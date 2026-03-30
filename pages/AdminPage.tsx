
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getAllUsers, deleteUser, updateUserStatus, updateUserExamLimit, updateManagerUserLimit, resetUserPassword, createUser } from '../services/authService';
import type { User } from '../types';
import { Shield, Trash2, User as UserIcon, Edit, Power, PowerOff, Search, KeyRound, UserPlus, Briefcase } from 'lucide-react';
import Spinner from '../components/Spinner';
import { useTranslations } from '../i18n/useTranslations';

import ConfirmModal from '../components/ui/ConfirmModal';
import PromptModal from '../components/ui/PromptModal';

interface AdminPageProps {
    currentUser: User;
}

const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
      username: '',
      email: '',
      whatsapp: '',
      password: '',
      role: 'user' as 'user' | 'manager', // Default to normal user
      userLimit: 20 // Default for managers
  });

  // Action Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });

  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    defaultValue: string;
    onConfirm: (val: string) => void;
    type: 'text' | 'number';
  }>({
    isOpen: false,
    title: '',
    message: '',
    defaultValue: '',
    onConfirm: () => {},
    type: 'text'
  });

  const { t } = useTranslations();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await getAllUsers();
      // Filter based on who is viewing
      let visibleUsers = allUsers;
      if (currentUser.role === 'manager') {
          visibleUsers = allUsers.filter(u => u.createdBy === currentUser.id);
      }
      
      // Sort: Admin first, then Managers, then Users, then alphabetical
      visibleUsers.sort((a, b) => {
          const roleScore = (r?: string) => r === 'admin' ? 3 : r === 'manager' ? 2 : 1;
          const scoreA = roleScore(a.role);
          const scoreB = roleScore(b.role);
          if (scoreA !== scoreB) return scoreB - scoreA;
          return a.username.localeCompare(b.username);
      });
      
      setUsers(visibleUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [currentUser.role, currentUser.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = (userId: string, currentStatus: 'active' | 'suspended') => {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const action = newStatus === 'suspended' ? 'suspend' : 'activate';
      
      setConfirmModal({
          isOpen: true,
          title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
          message: `Are you sure you want to ${action} this user?`,
          variant: newStatus === 'suspended' ? 'warning' : 'info',
          onConfirm: async () => {
              try {
                  await updateUserStatus(userId, newStatus);
                  setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                  toast.success(`User ${action}d successfully.`);
              } catch {
                  toast.error(`Failed to ${action} user.`);
              }
          }
      });
  };

  const handleEditExamLimit = (userId: string, currentLimit: number) => {
      setPromptModal({
          isOpen: true,
          title: 'Edit Exam Limit',
          message: `Enter new exam limit for this user (current is ${currentLimit}):`,
          defaultValue: String(currentLimit),
          type: 'number',
          onConfirm: async (val) => {
              const newLimit = parseInt(val, 10);
              if (!isNaN(newLimit) && newLimit >= 0) {
                  try {
                      await updateUserExamLimit(userId, newLimit);
                      setUsers(prev => prev.map(u => u.id === userId ? { ...u, examLimit: newLimit } : u));
                      toast.success("Exam limit updated.");
                  } catch {
                      toast.error("Failed to update user's limit.");
                  }
              } else {
                  toast.error("Invalid input. Please enter a non-negative number.");
              }
          }
      });
  };

  const handleEditUserLimit = (userId: string, currentLimit: number) => {
      setPromptModal({
          isOpen: true,
          title: 'Edit User Limit',
          message: `Enter new user creation limit for this manager (current is ${currentLimit}):`,
          defaultValue: String(currentLimit),
          type: 'number',
          onConfirm: async (val) => {
              const newLimit = parseInt(val, 10);
              if (!isNaN(newLimit) && newLimit >= 0) {
                  try {
                      await updateManagerUserLimit(userId, newLimit);
                      setUsers(prev => prev.map(u => u.id === userId ? { ...u, userLimit: newLimit } : u));
                      toast.success("User limit updated.");
                  } catch {
                      toast.error("Failed to update manager's user limit.");
                  }
              } else {
                  toast.error("Invalid input. Please enter a non-negative number.");
              }
          }
      });
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmModal({
        isOpen: true,
        title: 'Delete User',
        message: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
        variant: 'danger',
        onConfirm: async () => {
            try {
                await deleteUser(userId, currentUser.id);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                toast.success("User deleted successfully.");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'An error occurred while deleting the user.');
            }
        }
    });
  };

  const handleResetPassword = (userId: string, username: string) => {
      setConfirmModal({
          isOpen: true,
          title: 'Reset Password',
          message: t('resetPasswordConfirm', { name: username }),
          variant: 'warning',
          onConfirm: async () => {
              try {
                  await resetUserPassword(userId);
                  toast.success(t('resetSuccess'));
              } catch {
                  toast.error('Failed to reset password');
              }
          }
      });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsCreating(true);
      try {
          const createdUser = await createUser(currentUser.id, {
              ...newUser,
              role: newUser.role === 'manager' ? 'manager' : undefined
          });
          setUsers(prev => [createdUser, ...prev]);
          setIsModalOpen(false);
          setNewUser({ username: '', email: '', whatsapp: '', password: '', role: 'user', userLimit: 20 });
          toast.success(t('userCreatedSuccess'));
      } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Failed to create user');
      } finally {
          setIsCreating(false);
      }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.whatsapp && user.whatsapp.toLowerCase().includes(query))
    );
  });

  const usersCreatedCount = currentUser.role === 'manager' 
      ? users.length // Since filteredUsers only contains users created by this manager in fetching logic
      : 0; 
      
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <div className="flex items-center gap-3">
                    {currentUser.role === 'admin' ? <Shield size={32} className="text-blue-400" /> : <Briefcase size={32} className="text-teal-400" />}
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        {currentUser.role === 'admin' ? t('adminTitle') : t('managerTitle')}
                    </h2>
                </div>
                {currentUser.role === 'manager' && (
                    <p className="text-slate-400 mt-1 text-sm">
                        {t('myLimitStatus', { count: usersCreatedCount, limit: currentUser.userLimit || 0 })}
                    </p>
                )}
            </div>
            
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors shadow-lg shadow-blue-900/40 cursor-pointer"
            >
                <UserPlus size={18} />
                {t('createUserBtn')}
            </button>
          </div>
          
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search size={18} className="text-slate-500" />
            </div>
            <input 
                type="text" 
                className="block w-full p-2.5 ps-10 text-sm text-slate-100 border border-slate-700 rounded-lg bg-slate-800 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 focus:outline-none transition-colors" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      </div>

      {loading && (
        <div className="flex justify-center mt-16">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/30 text-red-300 border border-red-700/50 rounded-lg text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800/50">
                <tr>
                    <th scope="col" className="py-3.5 ps-4 pe-3 text-start text-sm font-semibold text-white sm:ps-6">{t('user')}</th>
                    <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('role')}</th>
                    <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('whatsapp')}</th>
                    <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('status')}</th>
                    <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('examLimit')}</th>
                    {currentUser.role === 'admin' && (
                         <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('userLimit')}</th>
                    )}
                    <th scope="col" className="px-3 py-3.5 text-start text-sm font-semibold text-white">{t('password')}</th>
                    <th scope="col" className="relative py-3.5 ps-3 pe-4 sm:pe-6 text-start text-sm font-semibold text-white">{t('actions')}</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 ps-4 pe-3 text-sm sm:ps-6">
                        <div className="flex items-center">
                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${user.role === 'manager' ? 'bg-teal-900 text-teal-300' : 'bg-slate-700 text-slate-400'}`}>
                            {user.role === 'manager' ? <Briefcase size={20} /> : <UserIcon size={20} />}
                        </div>
                        <div className="ms-4">
                            <div className="font-medium text-white">{user.username}</div>
                            <div className="text-slate-400">{user.email}</div>
                        </div>
                        </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                        {user.role === 'admin' ? t('roleAdmin') : user.role === 'manager' ? t('roleManager') : t('roleUser')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                        {user.whatsapp || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                        {user.status === 'active' ? (
                            <span className="inline-flex items-center rounded-md bg-green-900/60 px-2 py-1 text-xs font-medium text-green-300 ring-1 ring-inset ring-green-700/30">
                                {t('active')}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-md bg-yellow-900/60 px-2 py-1 text-xs font-medium text-yellow-300 ring-1 ring-inset ring-yellow-700/30">
                                {t('suspended')}
                            </span>
                        )}
                    </td>
                     <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                        <div className="text-white">{user.examsGenerated} / {user.role === 'admin' || user.role === 'manager' ? '∞' : user.examLimit}</div>
                    </td>
                    {currentUser.role === 'admin' && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                            {user.role === 'manager' ? (
                                <div className="flex items-center gap-2">
                                    <span>{user.userLimit}</span>
                                    <button 
                                        onClick={() => handleEditUserLimit(user.id, user.userLimit || 0)}
                                        className="text-teal-400 hover:text-teal-300 cursor-pointer"
                                        title={t('editUserLimit')}
                                    >
                                        <Edit size={14} />
                                    </button>
                                </div>
                            ) : '-'}
                        </td>
                    )}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                        {user.role !== 'admin' && (
                            <button
                                onClick={() => handleResetPassword(user.id, user.username)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 transition-colors border border-slate-600 cursor-pointer"
                                aria-label={`Reset password for ${user.username}`}
                                title={`Reset password for ${user.username}`}
                            >
                                <KeyRound size={12} />
                                {t('reset')}
                            </button>
                        )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 ps-3 pe-4 text-start text-sm font-medium sm:pe-6">
                        {user.role !== 'admin' && (
                           <div className="flex items-center gap-2">
                               <button
                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                    className={`p-2 rounded-md transition-colors cursor-pointer ${user.status === 'active' 
                                        ? 'text-yellow-400 bg-yellow-900/30 hover:bg-yellow-900/60' 
                                        : 'text-green-400 bg-green-900/30 hover:bg-green-900/60'}`}
                                    aria-label={user.status === 'active' ? `Suspend ${user.username}` : `Activate ${user.username}`}
                                    title={user.status === 'active' ? `Suspend ${user.username}` : `Activate ${user.username}`}
                                >
                                    {user.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
                                </button>
                                {user.role !== 'manager' && (
                                    <button
                                        onClick={() => handleEditExamLimit(user.id, user.examLimit || 0)}
                                        className="p-2 rounded-md text-blue-400 bg-blue-900/30 hover:bg-blue-900/60 transition-colors cursor-pointer"
                                        aria-label={`Edit limit for ${user.username}`}
                                        title={`Edit limit for ${user.username}`}
                                    >
                                        <Edit size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 rounded-md text-red-400 bg-red-900/30 hover:bg-red-900/60 transition-colors cursor-pointer"
                                    aria-label={`Delete ${user.username}`}
                                    title={`Delete ${user.username}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                           </div>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
           </div>
        </div>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">{t('createUserBtn')}</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{t('username')}</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                            value={newUser.username}
                            onChange={e => setNewUser({...newUser, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{t('email')}</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{t('whatsappNum')}</label>
                        <input 
                            type="tel" 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                            value={newUser.whatsapp}
                            onChange={e => setNewUser({...newUser, whatsapp: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">{t('password')}</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                        />
                    </div>
                    
                    {currentUser.role === 'admin' && (
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('role')}</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value as 'user' | 'manager'})}
                            >
                                <option value="user">{t('roleUser')}</option>
                                <option value="manager">{t('roleManager')}</option>
                            </select>
                        </div>
                    )}

                    {currentUser.role === 'admin' && newUser.role === 'manager' && (
                        <div>
                             <label className="block text-sm font-medium text-slate-300 mb-1">{t('userLimit')}</label>
                             <input 
                                type="number" 
                                min="1"
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                                value={newUser.userLimit}
                                onChange={e => setNewUser({...newUser, userLimit: parseInt(e.target.value) || 0})}
                            />
                            <p className="text-xs text-slate-400 mt-1">{t('userLimitDesc')}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit" 
                            disabled={isCreating}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isCreating ? t('registering') : t('createAccount')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {/* Action Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <PromptModal
        isOpen={promptModal.isOpen}
        title={promptModal.title}
        message={promptModal.message}
        defaultValue={promptModal.defaultValue}
        type={promptModal.type}
        onConfirm={promptModal.onConfirm}
        onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AdminPage;
