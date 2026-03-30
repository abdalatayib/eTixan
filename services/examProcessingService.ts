
import type { ExamOptions, Question, ExamSection } from '../types';

/**
 * Processes a flat array of questions from the AI into a structured array of sections.
 * Each section corresponds to a "part" defined in the exam options, with its own
 * title and re-numbered questions.
 *
 * @param questions The flat array of questions from the Gemini API.
 * @param options The original options used to generate the exam.
 * @returns An array of ExamSection objects, ready for display.
 */
export const processExam = (questions: Question[], options: ExamOptions): ExamSection[] => {
  const sections: ExamSection[] = [];
  let questionIndex = 0;

  options.parts.forEach((part, index) => {
    // Slice the flat questions array to get the questions for the current part
    const partQuestions = questions.slice(questionIndex, questionIndex + part.numQuestions);
    
    if (partQuestions.length > 0) {
      // Use the custom title if provided, otherwise default to the question type.
      const effectiveTitle = (part.title && part.title.trim() !== '') ? part.title.trim() : part.questionType;
      const sectionTitle = `Part ${index + 1}: ${effectiveTitle}`;

      sections.push({
        partNumber: index + 1,
        title: sectionTitle,
        questionType: part.questionType,
        // Renumber questions to start from 1 for this part
        questions: partQuestions.map((q, qIndex) => ({
          ...q,
          questionNumberInPart: qIndex + 1,
        })),
      });
    }

    // Move the index to the start of the next part
    questionIndex += part.numQuestions;
  });

  return sections;
};
