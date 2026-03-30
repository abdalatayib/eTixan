import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { HistoricExam, Question, ExamOptions } from '../types';
import { handleFirestoreError, OperationType } from './firestoreUtils';

const HISTORY_COLLECTION = 'history';

export const getHistory = async (): Promise<HistoricExam[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const q = query(
      collection(db, HISTORY_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("generatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as HistoricExam));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, HISTORY_COLLECTION);
    return [];
  }
};

export const saveExamToHistory = async (exam: Question[], options: ExamOptions): Promise<void> => {
  const user = auth.currentUser;
  if (!user) return;

  const serializableOptions = { ...options };
  if (serializableOptions.lessonFile) {
    serializableOptions.lessonFileName = serializableOptions.lessonFile.name;
    delete serializableOptions.lessonFile;
  }

  const newHistoricExam = {
    userId: user.uid,
    generatedAt: new Date().toISOString(),
    options: serializableOptions,
    exam,
  };
  
  try {
    await addDoc(collection(db, HISTORY_COLLECTION), newHistoricExam);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, HISTORY_COLLECTION);
  }
};

export const deleteExamFromHistory = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, HISTORY_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${HISTORY_COLLECTION}/${id}`);
  }
};
