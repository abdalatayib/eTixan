

import React, { useState } from 'react';
import { toast } from 'sonner';
import type { HistoricExam } from '../types';
import QuestionCard from './QuestionCard';
import { ChevronDown, Trash2, FileDown } from 'lucide-react';
import { processExam } from '../services/examProcessingService';
import { exportToPDF } from '../services/pdfService';
import { useTranslations } from '../i18n/useTranslations';

interface HistoryCardProps {
  historicExam: HistoricExam;
  onDelete: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ historicExam, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { options, exam, generatedAt } = historicExam;
    const { t } = useTranslations();

    const formattedDate = new Date(generatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    const processedExam = isExpanded ? processExam(exam, options) : null;

    const handleRedownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isExporting) return;

        setIsExporting(true);
        try {
            const sections = processExam(exam, options);
            // Use a brief timeout to allow the UI to update
            await new Promise(resolve => setTimeout(resolve, 50));
            exportToPDF(sections, options, t);
        } catch (err) {
            console.error("Failed to re-download PDF", err);
            toast.error("Sorry, there was an issue exporting the PDF.");
        } finally {
            setIsExporting(false);
        }
    };


    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg transition-all duration-300 hover:border-blue-800/60 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-1">
            <div 
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white">{options.examName}</h3>
                        <p className="text-sm text-blue-400 mt-1">{options.topic}</p>
                        <p className="text-xs text-slate-400 mt-2">{formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                         <button
                            onClick={handleRedownload}
                            disabled={isExporting}
                            className="p-2 rounded-full text-teal-400 bg-teal-900/40 hover:bg-teal-900/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t('redownload')}
                            title={t('redownload')}
                        >
                            <FileDown size={18} />
                        </button>
                         <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card from toggling
                                onDelete();
                            }}
                            className="p-2 rounded-full text-red-400 bg-red-900/40 hover:bg-red-900/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                            aria-label={t('delete')}
                        >
                            <Trash2 size={18} />
                        </button>
                        <ChevronDown 
                            size={24} 
                            className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                    </div>
                </div>
            </div>

            {isExpanded && processedExam && (
                <div className="border-t border-slate-800 p-4 md:p-6 bg-slate-900/30">
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
        </div>
    );
};

export default HistoryCard;