
export enum QuestionType {
  MULTIPLE_CHOICE = 'Multiple Choice',
  TRUE_FALSE = 'True/False',
  SHORT_ANSWER = 'Short Answer',
  FILL_IN_THE_BLANKS = 'Fill in the Blanks',
  MATCH_COLUMNS = 'Match Columns',
  ESSAY = 'Essay',
  DIRECT_QUESTION = 'Direct Question',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface User {
  id: string;
  username: string;
  email: string;
  whatsapp: string;
  // Role of the user. 'admin' has full access. 'manager' can manage their own created users.
  // If undefined, the user is a 'Teacher' (standard user).
  role?: 'admin' | 'manager';
  status: 'active' | 'suspended';
  examLimit: number;
  examsGenerated: number;
  // ID of the admin or manager who created this user
  createdBy?: string; 
  // For managers: the number of users they are allowed to create
  userLimit?: number; 
}

export interface ExamPart {
  id:string;
  title?: string;
  questionType: QuestionType;
  numQuestions: number;
}

export interface ExamOptions {
  topic: string;
  parts: ExamPart[];
  difficulty: Difficulty;
  examName: string;
  className: string;
  description: string;
  language: string;
  lessonFile?: File;
  // FIX: Add lessonFileName to store the name of the uploaded file for history.
  lessonFileName?: string;
  studentFields: {
    includeName: boolean;
    includeId: boolean;
    includeClass: boolean;
  };
}

export interface ColumnItem {
  id: string;
  text: string;
}

export interface Question {
  questionNumber: number;
  type: QuestionType;
  questionText: string;
  options?: string[];
  columnA?: ColumnItem[];
  columnB?: ColumnItem[];
  answer: string;
}

export interface HistoricExam {
    id: string;
    userId: string;
    generatedAt: string;
    options: ExamOptions;
    exam: Question[];
}

export interface ProcessedQuestion extends Question {
  questionNumberInPart: number;
}

export interface ExamSection {
  partNumber: number;
  title: string;
  questionType: QuestionType;
  questions: ProcessedQuestion[];
}