

import React, { useState, useEffect } from 'react';
import { getHistory, deleteExamFromHistory } from '../services/historyService';
import type { HistoricExam } from '../types';
import HistoryCard from '../components/HistoryCard';
import { FileText } from 'lucide-react';
import { useTranslations } from '../i18n/useTranslations';

import ConfirmModal from '../components/ui/ConfirmModal';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoricExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });
  const { t } = useTranslations();

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getHistory();
      setHistory(data);
      setLoading(false);
    };
    loadHistory();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteExamFromHistory(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };
  
  if (loading) {
    return null; // or a spinner
  }

  if (history.length === 0) {
    return (
        <div className="text-center mt-16 flex flex-col items-center">
            <FileText size={48} className="text-slate-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-300">{t('noHistory')}</h2>
            <p className="text-slate-400 mt-2">{t('noHistoryDesc')}</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-white">{t('historyTitle')}</h2>
      {history.map((item) => (
        <HistoryCard 
            key={item.id} 
            historicExam={item}
            onDelete={() => setDeleteModal({ isOpen: true, id: item.id })}
        />
      ))}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t('deleteConfirmTitle') || 'Delete Exam'}
        message={t('deleteConfirm')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default HistoryPage;