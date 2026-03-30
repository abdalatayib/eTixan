


import React, { useState } from 'react';
import { cn } from '../services/utils';
import type { Question } from '../types';
import { QuestionType } from '../types';
import { useTranslations } from '../i18n/useTranslations';

interface QuestionCardProps {
  question: Question;
  displayQuestionNumber: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, displayQuestionNumber }) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const { t } = useTranslations();

  const renderMatchAnswer = (answer: string) => {
    try {
        const parsed = JSON.parse(answer);
        return (
            <>
                <p className="font-bold mb-2">{t('answer')}:</p>
                <ul className="space-y-1">
                    {Object.entries(parsed).map(([key, value]) => {
                        // FIX: Cast `value` to `React.ReactNode` to fix the error "Type 'unknown' is not assignable to type 'ReactNode'". The type of `value` from `JSON.parse` is `unknown` and cannot be directly rendered in JSX.
                        return <li key={key} className="font-mono">{key} &rarr; {value as React.ReactNode}</li>;
                    })}
                </ul>
            </>
        );
    } catch {
        // Fallback for non-JSON answers
        return <p><span className="font-bold">{t('answer')}:</span> {answer}</p>;
    }
  };

  return (
    <div className={cn(
      "bg-slate-900 border border-slate-800 rounded-lg p-6 transition-all duration-300",
      "hover:border-blue-800/60 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1",
      "mt-4 first:mt-0"
    )}>
      <h3 className="text-lg text-slate-100 mb-4">
        <span className="font-semibold text-blue-400 me-2">Q{displayQuestionNumber}:</span>
        {question.questionText}
      </h3>

      {question.type === QuestionType.MULTIPLE_CHOICE && question.options && (
        <div className="space-y-3 my-4">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center text-slate-300">
              <span className="me-3 flex-shrink-0 text-sm font-mono bg-slate-700 h-6 w-6 rounded-md flex items-center justify-center">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
      
      {question.type === QuestionType.MATCH_COLUMNS && question.columnA && question.columnB && (
         <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <h4 className="font-bold text-slate-300 mb-2 pb-1 border-b border-slate-700">Column A</h4>
                <ul className="space-y-2">
                    {question.columnA.map(item => (
                        <li key={item.id} className="flex items-start text-slate-300">
                            <span className="me-3 font-mono font-medium text-slate-400">{item.id}.</span>
                            <span>{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-slate-300 mb-2 pb-1 border-b border-slate-700">Column B</h4>
                <ul className="space-y-2">
                    {question.columnB.map(item => (
                        <li key={item.id} className="flex items-start text-slate-300">
                             <span className="me-3 font-mono font-medium text-slate-400">{item.id}.</span>
                             <span>{item.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}

      <div className="mt-5 border-t border-slate-700 pt-4">
        {isAnswerVisible ? (
          <div className="text-teal-300 bg-teal-900/40 p-3 rounded-md">
            {question.type === QuestionType.MATCH_COLUMNS 
                ? renderMatchAnswer(question.answer) 
                : <p><span className="font-bold">{t('answer')}:</span> {question.answer}</p>
            }
          </div>
        ) : (
          <button
            onClick={() => setIsAnswerVisible(true)}
            className="px-4 py-2 bg-slate-700 text-slate-200 text-sm font-semibold rounded-md hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
          >
            {t('showAnswer')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;