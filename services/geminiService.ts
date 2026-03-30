// FIX: Removed the `/// <reference types="node" />` directive.
// Minimal type declaration for `process.env.API_KEY`.
declare const process: {
  env: {
    API_KEY?: string;
  }
};

import { GoogleGenAI, Type } from '@google/genai';
import type { ExamOptions, Question } from '../types';
import { saveExamToHistory } from './historyService';
import { examGenerationLanguages } from '../i18n/locales';

// Use environment variable or fallback to the provided key
const apiKey = process.env.API_KEY || "AIzaSyAviiliOABU5F6XLfvNW7UYcgX1Bsf1D7k";

if (!apiKey) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Helper: Detect MIME type robustly.
 * Trusts the browser if specific, otherwise falls back to extension.
 */
const getMimeType = (file: File): string => {
  if (file.type && file.type !== '' && file.type !== 'application/octet-stream') {
      return file.type;
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch(extension) {
      case 'pdf': return 'application/pdf';
      case 'txt': return 'text/plain';
      case 'csv': return 'text/csv';
      case 'json': return 'application/json';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'html': return 'text/html';
      case 'md': return 'text/md';
      case 'rtf': return 'text/rtf';
      case 'doc': 
      case 'docx': return 'application/msword';
      case 'xls':
      case 'xlsx': return 'application/vnd.ms-excel';
      default: return 'application/pdf'; 
  }
};

/**
 * Helper: Upload a single File object to Gemini via the Files API.
 */
const uploadSingleFile = async (file: File, mimeType: string): Promise<{ uri: string; name: string }> => {
  try {
    const response = await ai.files.upload({
      file: file,
      config: { 
        displayName: file.name,
        mimeType: mimeType
      }
    });

    const uploadedFile = (response as { file?: { uri: string; name: string } }).file || response;

    if (!uploadedFile || !uploadedFile.uri || !uploadedFile.name) {
        throw new Error("Upload successful but file URI or name is missing in response.");
    }
    
    return { uri: uploadedFile.uri, name: uploadedFile.name };
  } catch (error) {
    console.error("Upload failed:", error);
    if (error instanceof Error && (error.message.includes('500') || error.message.includes('Rpc'))) {
         throw new Error("Google Servers encountered an error. Please check your internet connection and try again.", { cause: error });
    }
    throw error;
  }
};

/**
 * Helper: Wait for a file to reach 'ACTIVE' state so it can be used in generation.
 */
const waitForFileActive = async (fileName: string): Promise<void> => {
  let state = 'PROCESSING';
  let attempts = 0;
  // Poll for up to 5 minutes (150 attempts * 2 seconds)
  const MAX_ATTEMPTS = 150; 

  while (state === 'PROCESSING' && attempts < MAX_ATTEMPTS) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const response = await ai.files.get({ name: fileName });
      const fileStatus = (response as { file?: { state: string } }).file || response;
      state = fileStatus.state || 'PROCESSING';
      
      if (state === 'FAILED') {
        throw new Error('File processing failed on Google servers.');
      }
      if (state === 'ACTIVE') {
        return; 
      }
    } catch (e) {
      console.warn("Error checking file status, retrying...", e);
    }
    
    attempts++;
  }
  
  if (state !== 'ACTIVE') {
    throw new Error('File processing timed out. The file might be too large.');
  }
};

/**
 * Main File Handler:
 * 1. Determines if the file needs splitting (Limit: 48MB per chunk).
 * 2. Splits if necessary (Max 3 chunks).
 * 3. Uploads chunks sequentially.
 * 4. Waits for processing.
 * 5. Returns the content parts for the Gemini API.
 */
const processAndUploadFile = async (file: File): Promise<unknown[]> => {
  const mimeType = getMimeType(file);
  const parts: unknown[] = [];
  
  // 48MB limit to stay safely under the 50MB API constraint per file
  const CHUNK_SIZE = 48 * 1024 * 1024; 
  
  // Calculate how many chunks we need
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  if (totalChunks > 3) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). The limit is approximately 145MB.`);
  }

  let start = 0;
  let chunkIndex = 0;

  console.log(`Processing file: ${file.name}. Size: ${file.size}. Chunks: ${totalChunks}`);

  while (start < file.size) {
    chunkIndex++;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunkBlob = file.slice(start, end, mimeType);
    
    // Create a proper File object for the chunk so the SDK handles it correctly
    const chunkName = totalChunks > 1 
      ? `${file.name.split('.')[0]}_part${chunkIndex}.${file.name.split('.').pop()}`
      : file.name;
      
    const chunkFile = new File([chunkBlob], chunkName, { type: mimeType });

    console.log(`Uploading chunk ${chunkIndex}/${totalChunks} (${chunkFile.size} bytes)...`);

    try {
      // 1. Upload
      const { uri, name } = await uploadSingleFile(chunkFile, mimeType);
      
      // 2. Wait for processing
      await waitForFileActive(name);
      
      // 3. Add to parts
      parts.push({
        fileData: {
          mimeType: mimeType,
          fileUri: uri
        }
      });
    } catch (err) {
      throw new Error(`Failed to process part ${chunkIndex} of the file. ${err instanceof Error ? err.message : ''}`, { cause: err });
    }

    start = end;
  }

  return parts;
};

export const generateExam = async (options: ExamOptions): Promise<Question[]> => {
  const { topic, parts, difficulty, lessonFile, language } = options;
  const languageName = examGenerationLanguages[language as keyof typeof examGenerationLanguages] || 'English';

  const totalNumQuestions = parts.reduce((sum, part) => sum + part.numQuestions, 0);
  const partsDescription = parts.map((part, index) => {
    const titlePart = part.title ? ` (${part.title})` : '';
    return `- **Part ${index + 1}${titlePart}:** ${part.numQuestions} ${part.questionType} question(s).`;
  }).join('\n');

  // Base System Prompt
  let prompt = `
    Act as an expert academic exam creator.
    
    **Goal:** Generate a structured exam JSON based on the user's topic and specifications.
    
    **Exam Specifications:**
    - **Topic:** ${topic}
    - **Language:** ${languageName} (Ensure ALL questions, options, and answers are in this language).
    - **Difficulty:** ${difficulty}
    - **Total Questions:** ${totalNumQuestions}
    - **Structure:**
    ${partsDescription}
  `;

  // File Handling
  let fileContentParts: unknown[] = [];
  
  if (lessonFile) {
    fileContentParts = await processAndUploadFile(lessonFile);

    prompt += `
    \n
    ---------------------------------------------------------
    *** STRICT DOCUMENT-ONLY MODE ACTIVATED ***
    
    You have been provided with a document (which may be split into multiple parts for technical reasons). 
    Treat all uploaded file parts as a SINGLE continuous source of truth.

    **CRITICAL RULES:**
    1. **NO OUTSIDE KNOWLEDGE:** You must NOT use any information that is not explicitly found in the uploaded document(s).
    2. **STRICT GROUNDING:** Every single question and answer must be directly supported by the text in the document.
    3. **MISSING INFO:** If the document does not contain enough information to generate the requested number of questions for a specific topic, do NOT invent questions. Instead, generate questions about what *is* present, or if impossible, return a generic question stating "Content not found in document".
    4. **CITATION:** For every 'answer' field, append the text: "(Source: Uploaded Document)".

    **YOUR TASK:**
    Generate the exam questions defined in the structure above using ONLY the provided document.
    ---------------------------------------------------------
    `;
  }

  // Output Formatting Instructions
  prompt += `
    \n
    **OUTPUT FORMAT:**
    Return a **valid JSON array** of objects. Do not include markdown formatting (like \`\`\`json). 
    
    The JSON schema for each question object is:
    {
      "questionNumber": number,
      "type": string (one of: 'Multiple Choice', 'True/False', 'Short Answer', 'Fill in the Blanks', 'Match Columns', 'Essay', 'Direct Question'),
      "questionText": string,
      "options": string[] (array of 4 strings, ONLY for 'Multiple Choice', otherwise null),
      "columnA": object[] (array of {id: string, text: string}, ONLY for 'Match Columns', otherwise null),
      "columnB": object[] (array of {id: string, text: string}, ONLY for 'Match Columns', otherwise null),
      "answer": string (The correct answer. For 'Match Columns', a JSON string like '{"A":"1", "B":"2"}')
    }
  `;

  try {
    // Select Model:
    // Use 'gemini-3.1-pro-preview' if files are involved (Better context, higher stability for files).
    // Use 'gemini-3-flash-preview' for text-only (Faster).
    const modelName = lessonFile ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          ...(fileContentParts as { fileData: { mimeType: string; fileUri: string } }[]), // File parts must come before text in some contexts, or mixed. SDK handles this.
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionNumber: { type: Type.INTEGER },
              type: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                nullable: true,
              },
              columnA: {
                type: Type.ARRAY,
                items: { 
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, text: { type: Type.STRING } },
                    required: ['id', 'text']
                },
                nullable: true,
              },
              columnB: {
                type: Type.ARRAY,
                items: { 
                    type: Type.OBJECT,
                    properties: { id: { type: Type.STRING }, text: { type: Type.STRING } },
                    required: ['id', 'text']
                },
                nullable: true,
              },
              answer: { type: Type.STRING },
            },
            required: ['questionNumber', 'type', 'questionText', 'answer'],
          },
        },
      },
    });

    const jsonText = response.text?.trim() || "[]";
    
    // Safety clean up if model adds markdown despite instructions
    const cleanJson = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    const generatedQuestions: Question[] = JSON.parse(cleanJson);
    
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("The AI returned an empty exam. Please try again with a different topic or document.");
    }
    
    await saveExamToHistory(generatedQuestions, options);

    return generatedQuestions;

  } catch (error) {
    console.error("Exam Generation Error:", error);
    
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
        if (error.message.includes('JSON')) {
            errorMessage = "Failed to parse the AI response. Please try again.";
        } else if (error.message.includes('404')) {
            errorMessage = "Model not found. Please contact support.";
        } else if (error.message.includes('503') || error.message.includes('Overloaded')) {
            errorMessage = "AI Service is currently overloaded. Please wait a minute and try again.";
        } else {
            errorMessage = error.message;
        }
    }
    throw new Error(errorMessage, { cause: error });
  }
};