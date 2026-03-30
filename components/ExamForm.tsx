import React from 'react';
import { toast } from 'sonner';
import type { ExamOptions } from '../types';
import { QuestionType, Difficulty } from '../types';
import { useTranslations } from '../i18n/useTranslations';
import { examGenerationLanguages } from '../i18n/locales';


interface ExamFormProps {
  options: ExamOptions;
  setOptions: React.Dispatch<React.SetStateAction<ExamOptions>>;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const ExamForm: React.FC<ExamFormProps> = ({ options, setOptions, onSubmit, isLoading }) => {
  const { t } = useTranslations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions(prev => ({
        ...prev,
        studentFields: {
            ...prev.studentFields,
            [name]: checked,
        }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 150MB (150 * 1024 * 1024)
      if (file.size > 150 * 1024 * 1024) {
        toast.error("File size exceeds the 150MB limit.");
        // Clear input
        e.target.value = '';
        return;
      }
      setOptions(prev => ({ ...prev, lessonFile: file }));
    }
  };

  const removeFile = () => {
    setOptions(prev => ({ ...prev, lessonFile: undefined }));
    const fileInput = document.getElementById('lessonFile') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const addPart = () => {
    setOptions(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        { 
          id: crypto.randomUUID(), 
          title: '',
          questionType: QuestionType.SHORT_ANSWER, 
          numQuestions: 2 
        }
      ]
    }));
  };

  const removePart = (id: string) => {
    setOptions(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== id)
    }));
  };

  const updatePart = (id: string, field: 'questionType' | 'numQuestions' | 'title', value: string | number) => {
    const processedValue = field === 'numQuestions' ? Math.max(1, Number(value) || 1) : value;
    setOptions(prev => ({
      ...prev,
      parts: prev.parts.map(part => 
        part.id === id ? { ...part, [field]: processedValue } : part
      )
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (options.parts.length > 0 && options.parts.every(p => p.numQuestions > 0)) {
      onSubmit();
    } else {
      toast.error("Please configure at least one exam part with more than 0 questions.");
    }
  };

  const totalQuestions = options.parts.reduce((sum, part) => sum + part.numQuestions, 0);

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-blue-900/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <fieldset className="space-y-6">
           <legend className="text-xl font-semibold text-white mb-2 border-b border-slate-700 pb-2">{t('contentSource')}</legend>
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">{t('topicLabel')}</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={options.topic}
                onChange={handleInputChange}
                placeholder={t('topicPlaceholder')}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink mx-4 text-slate-500">{t('or')}</span>
                <div className="flex-grow border-t border-slate-700"></div>
            </div>
            <div>
                <label htmlFor="lessonFile" className="block text-sm font-medium text-slate-300 mb-2">{t('uploadLabel')}</label>
                <p className="text-xs text-slate-400 mb-1">{t('uploadDesc')}</p>
                <p className="text-xs text-slate-500 mb-3 italic">{t('uploadPrivacy')}</p>
                {!options.lessonFile ? (
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-600" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <div className="flex text-sm text-slate-400 justify-center">
                                <label htmlFor="lessonFile" className="relative cursor-pointer bg-slate-900 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-blue-500 px-1">
                                    <span>{t('uploadButton')}</span>
                                    <input id="lessonFile" name="lessonFile" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="ps-1">{t('uploadDragDrop')}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 flex justify-between items-center bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-slate-100">
                        <span className="truncate pe-4">{options.lessonFile.name}</span>
                        <button type="button" onClick={removeFile} className="ms-4 text-red-400 hover:text-red-300 font-bold text-xl leading-none">&times;</button>
                    </div>
                )}
            </div>
        </fieldset>
        
        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold text-white mb-2 border-b border-slate-700 pb-2">{t('examDetails')}</legend>
          <div>
            <label htmlFor="examName" className="block text-sm font-medium text-slate-300 mb-2">{t('examNameLabel')}</label>
            <input
              type="text"
              id="examName"
              name="examName"
              value={options.examName}
              onChange={handleInputChange}
              placeholder={t('examNamePlaceholder')}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
           <div>
            <label htmlFor="className" className="block text-sm font-medium text-slate-300 mb-2">{t('classLabel')}</label>
            <input
              type="text"
              id="className"
              name="className"
              value={options.className}
              onChange={handleInputChange}
              placeholder={t('classPlaceholder')}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">{t('examLanguageLabel')}</label>
            <select
              id="language"
              name="language"
              value={options.language}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {Object.entries(examGenerationLanguages).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 space-y-4">
            <div>
                <p className="text-sm font-medium text-slate-300">{t('studentInfoHeader')}</p>
                <p className="text-xs text-slate-400">{t('studentInfoDesc')}</p>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="includeName" className="text-sm font-medium text-slate-300">{t('nameField')}</label>
                <label htmlFor="includeName" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="includeName" name="includeName" checked={options.studentFields.includeName} onChange={handleStudentFieldChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="includeId" className="text-sm font-medium text-slate-300">{t('idField')}</label>
                <label htmlFor="includeId" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="includeId" name="includeId" checked={options.studentFields.includeId} onChange={handleStudentFieldChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="includeClass" className="text-sm font-medium text-slate-300">{t('classField')}</label>
                <label htmlFor="includeClass" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="includeClass" name="includeClass" checked={options.studentFields.includeClass} onChange={handleStudentFieldChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
          </div>
          
           <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">{t('descriptionLabel')}</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={options.description}
              onChange={handleInputChange}
              placeholder={t('descriptionPlaceholder')}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <legend className="text-xl font-semibold text-white">{t('questionConfig')}</legend>
                <span className="text-sm font-medium text-slate-300 bg-slate-700 px-3 py-1 rounded-full">{t('total')}: {totalQuestions}</span>
            </div>
            
             <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-2">{t('difficultyLabel')}</label>
                <select
                id="difficulty"
                name="difficulty"
                value={options.difficulty}
                onChange={handleInputChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="space-y-4">
                {options.parts.map((part, index) => (
                <div key={part.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-400">Part {index + 1}</span>
                        {options.parts.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => removePart(part.id)} 
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900/50 text-red-300 hover:bg-red-800/50 transition-colors text-xl font-bold flex items-center justify-center"
                                aria-label="Remove Part"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            id={`part-title-${part.id}`}
                            value={part.title || ''}
                            onChange={(e) => updatePart(part.id, 'title', e.target.value)}
                            placeholder={t('partTitlePlaceholder')}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-grow w-full">
                            <label htmlFor={`part-num-${part.id}`} className="sr-only">Number of Questions</label>
                            <input 
                                type="number" 
                                id={`part-num-${part.id}`}
                                value={part.numQuestions}
                                min="1"
                                onChange={(e) => updatePart(part.id, 'numQuestions', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="No. of Questions"
                            />
                        </div>
                        <div className="flex-grow w-full">
                            <label htmlFor={`part-type-${part.id}`} className="sr-only">Question Type</label>
                            <select
                                id={`part-type-${part.id}`}
                                value={part.questionType}
                                onChange={(e) => updatePart(part.id, 'questionType', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                {Object.values(QuestionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addPart}
                className="w-full flex justify-center py-2 px-4 border-2 border-dashed border-slate-700 rounded-md shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-colors"
            >
                {t('addPart')}
            </button>
        </fieldset>

        <button
          type="submit"
          disabled={isLoading || options.parts.length === 0 || options.parts.some(p => p.numQuestions <= 0)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg shadow-blue-600/40 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-700 disabled:shadow-none disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? t('generating') : t('generate')}
        </button>
      </form>
    </div>
  );
};

export default ExamForm;