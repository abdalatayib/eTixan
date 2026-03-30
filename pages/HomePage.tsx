
import React, { useState, useCallback } from 'react';
import { FileDown } from 'lucide-react';
import ExamForm from '../components/ExamForm';
import QuestionCard from '../components/QuestionCard';
import Spinner from '../components/Spinner';
import { generateExam } from '../services/geminiService';
import { incrementExamCount } from '../services/authService';
import { exportToPDF } from '../services/pdfService';
import { processExam } from '../services/examProcessingService';
import { useTranslations } from '../i18n/useTranslations';
import type { ExamOptions, Question, User, ExamSection } from '../types';
import { QuestionType, Difficulty } from '../types';

interface HomePageProps {
  currentUser: User;
  onUserUpdate: (updatedUser: User) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, onUserUpdate }) => {
  const { t } = useTranslations();
  
  const [options, setOptions] = useState<ExamOptions>({
    topic: '',
    parts: [
        { id: 'part1', questionType: QuestionType.MULTIPLE_CHOICE, numQuestions: 5 },
    ],
    difficulty: Difficulty.MEDIUM,
    examName: '',
    className: '',
    description: '',
    language: 'en',
    lessonFile: undefined,
    studentFields: {
      includeName: true,
      includeId: true,
      includeClass: true,
    },
  });

  const [_generatedExam, setGeneratedExam] = useState<Question[] | null>(null);
  const [processedExam, setProcessedExam] = useState<ExamSection[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateExam = useCallback(async () => {
    if (!currentUser) return;

    if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && currentUser.examsGenerated >= currentUser.examLimit) {
      setError(`You have reached your exam generation limit of ${currentUser.examLimit}. Please contact an administrator to extend your limit.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedExam(null);
    setProcessedExam(null);
    try {
      const exam = await generateExam(options);
      const processed = processExam(exam, options);
      setGeneratedExam(exam); // Keep original flat array for history
      setProcessedExam(processed); // Use structured data for display
      
      // Use generatedExam to avoid linting error
      console.log('Exam generated successfully with', exam.length, 'questions');

      // On success, increment the count
      const updatedUser = await incrementExamCount(currentUser.id);
      if (updatedUser) {
        onUserUpdate(updatedUser);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [options, currentUser, onUserUpdate]);
  
  const handleExportPDF = async () => {
    if (!processedExam) return;
    setIsExporting(true);
    try {
      // Use a brief timeout to allow the UI to update to 'Exporting...'
      await new Promise(resolve => setTimeout(resolve, 50));
      exportToPDF(processedExam, options, t);
    } catch (e) {
      console.error("Failed to export PDF", e);
      setError("Sorry, there was an issue exporting the PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleStartOver = () => {
    setGeneratedExam(null);
    setProcessedExam(null);
    setError(null);
  };
  
  const examsLeft = currentUser.examLimit - currentUser.examsGenerated;

  const renderRemainingGenerations = () => {
    const message = t('remainingGenerations');
    const parts = message.split(/<1>|<\/1>/);
    return (
        <p className="text-slate-300">
            {parts[0]}
            <span className="font-bold text-blue-400">{examsLeft}</span>
            {parts[2]}
        </p>
    );
  };

  return (
    <>
      {!processedExam && !isLoading && !error && (
        <>
            {currentUser.role !== 'admin' && currentUser.role !== 'manager' && (
                <div className="max-w-2xl mx-auto mb-6 text-center text-sm p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    {renderRemainingGenerations()}
                </div>
            )}
            <ExamForm 
              options={options}
              setOptions={setOptions}
              onSubmit={handleGenerateExam}
              isLoading={isLoading}
            />
        </>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <Spinner />
          <p className="mt-4 text-lg text-blue-400 animate-pulse">{t('generatingMessage')}</p>
        </div>
      )}

      {error && (
        <div className="mt-16 text-center max-w-2xl mx-auto p-6 bg-red-900/30 border border-red-700/50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400">{t('generationFailed')}</h2>
          <p className="mt-2 text-red-300">{error}</p>
          <button 
            onClick={handleStartOver}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
          >
            {t('tryAgain')}
          </button>
        </div>
      )}
      
      {processedExam && (
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
             <div className="flex-grow">
               <h2 className="text-3xl font-bold tracking-tight text-white">{options.examName}</h2>
               <p className="text-blue-400 mt-1">{options.className}</p>
             </div>
            <div className="flex items-center gap-3 self-start sm:self-center flex-shrink-0">
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md shadow-teal-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 disabled:from-slate-600 disabled:to-slate-700 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <FileDown size={18} />
                    {isExporting ? t('exportingPdf') : t('exportPdf')}
                </button>
                <button 
                    onClick={handleStartOver}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                    >
                    {t('createNewExam')}
                </button>
            </div>
          </div>

          {(options.studentFields.includeName || options.studentFields.includeId || options.studentFields.includeClass) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 mb-8 p-4 border border-slate-800 bg-slate-900/50 rounded-lg">
                  {options.studentFields.includeName && (
                      <div className="flex items-end">
                          <label className="text-slate-300 font-semibold me-2">{t('name')}:</label>
                          <div className="flex-grow border-b-2 border-slate-600 border-dotted"></div>
                      </div>
                  )}
                  {options.studentFields.includeId && (
                      <div className="flex items-end">
                          <label className="text-slate-300 font-semibold me-2">{t('idNo')}:</label>
                          <div className="flex-grow border-b-2 border-slate-600 border-dotted"></div>
                      </div>
                  )}
                  {options.studentFields.includeClass && (
                      <div className="flex items-end">
                          <label className="text-slate-300 font-semibold me-2">{t('class')}:</label>
                          <div className="flex-grow border-b-2 border-slate-600 border-dotted"></div>
                      </div>
                  )}
              </div>
          )}
           
          {options.description && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-8">
                  <p className="text-slate-300 whitespace-pre-wrap">{options.description}</p>

              </div>
          )}

          <div className="space-y-8">
            {processedExam.map((section) => (
              <div key={section.partNumber}>
                <h3 className="text-2xl font-bold text-blue-300 border-b-2 border-slate-700 pb-2 mb-4">{section.title}</h3>
                <div className="space-y-6">
                  {section.questions.map((q) => (
                    <QuestionCard key={q.questionNumber} question={q} displayQuestionNumber={q.questionNumberInPart} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
