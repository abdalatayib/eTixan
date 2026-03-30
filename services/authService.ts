
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc,
  increment
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import type { User } from '../types';
import { handleFirestoreError, OperationType } from './firestoreUtils';

const USERS_COLLECTION = 'users';

// Helper to convert Firebase User + Firestore Data to our User type
const mapToAppUser = (firebaseUser: FirebaseUser, userData: Record<string, unknown>): User => {
  return {
    id: firebaseUser.uid,
    username: (userData.username as string) || firebaseUser.displayName || 'User',
    email: firebaseUser.email || '',
    whatsapp: (userData.whatsapp as string) || '',
    role: userData.role as 'admin' | 'manager' | undefined,
    status: (userData.status as 'active' | 'suspended') || 'active',
    examLimit: (userData.examLimit as number) || 0,
    examsGenerated: (userData.examsGenerated as number) || 0,
    createdBy: userData.createdBy as string | undefined,
    userLimit: userData.userLimit as number | undefined,
  };
};

// --- Admin Seeding ---
const ADMIN_EMAIL = 'tayib4986@gmail.com';

export const seedAdminUser = async (user: FirebaseUser) => {
  if (user.email === ADMIN_EMAIL) {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    try {
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const adminData = {
          username: 'admin',
          email: ADMIN_EMAIL,
          whatsapp: '+0000000000',
          role: 'admin',
          status: 'active',
          examLimit: 9999,
          examsGenerated: 0,
          userLimit: 9999,
        };
        await setDoc(userRef, adminData);
        console.log('Admin user seeded in Firestore.');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${user.uid}`);
    }
  }
};

// Internal User Creation (Admin creating Manager, or Manager creating User)
export const createUser = async (
    creatorId: string, 
    details: { username: string; email: string; whatsapp: string; password?: string; role?: 'manager'; userLimit?: number }
): Promise<User> => {
    const users = await getAllUsers();
    const creator = users.find(u => u.id === creatorId);

    if (!creator) {
        throw new Error("Creator not found.");
    }

    // If creator is a manager, check their limit
    if (creator.role === 'manager') {
        const createdCount = users.filter(u => u.createdBy === creatorId).length;
        const limit = creator.userLimit || 0;
        if (createdCount >= limit) {
            throw new Error(`You have reached your limit of ${limit} users. Contact Admin to increase it.`);
        }
        // Managers can only create standard users
        if (details.role === 'manager') {
            throw new Error("Managers cannot create other managers.");
        }
    }

    // Check duplicates
    const lowercasedEmail = details.email.toLowerCase();
    const lowercasedUsername = details.username.toLowerCase();
    if (users.some(u => u.email.toLowerCase() === lowercasedEmail)) {
        throw new Error("An account with this email already exists.");
    }
    if (users.some(u => u.username.toLowerCase() === lowercasedUsername)) {
        throw new Error("This username is already taken.");
    }

    // Note: In Firebase, we can't easily "create" another user's Auth account from the client
    // without using Firebase Admin SDK or Cloud Functions.
    // For this app, we'll just store the user record in Firestore.
    // When the user actually signs in with Google, we'll link them if the email matches.
    // Or we can just use a placeholder ID for now.
    const newUserId = crypto.randomUUID(); 
    const userRef = doc(db, USERS_COLLECTION, newUserId);
    
    const newUser = {
        username: details.username,
        email: details.email,
        whatsapp: details.whatsapp,
        status: 'active',
        examLimit: 3,
        examsGenerated: 0,
        createdBy: creatorId,
        role: details.role,
        userLimit: details.role === 'manager' ? (details.userLimit || 20) : undefined
    };

    await setDoc(userRef, newUser);
    return { id: newUserId, ...newUser } as User;
};

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  
  const firebaseUser = result.user;
  
  const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  let userData;
  if (!userSnap.exists()) {
    // New user from Google
    userData = {
      username: firebaseUser.displayName || 'User',
      email: firebaseUser.email,
      whatsapp: '',
      status: 'active',
      examLimit: 0,
      examsGenerated: 0,
      role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : undefined,
      userLimit: firebaseUser.email === ADMIN_EMAIL ? 9999 : undefined,
    };
    await setDoc(userRef, userData);
  } else {
    userData = userSnap.data();
    if (userData.status === 'suspended') {
      await signOut(auth);
      throw new Error("Your account has been suspended by an administrator.");
    }
  }
  
  return mapToAppUser(firebaseUser, userData);
};

// Public registration (Self sign-up)
export const register = async (_username: string, _email: string, _whatsapp: string, _password: string): Promise<User> => {
  // Note: Firebase doesn't support custom fields in the default createAccount easily without a backend or Firestore
  // We'll use email/password auth and then store extra info in Firestore
  // But for now, let's stick to Google Sign-In as requested, or implement email/pass if needed.
  // The user specifically asked for Google account sign in.
  throw new Error("Please use Google Sign-In.");
};

export const login = async (_emailOrUsername: string, _password: string): Promise<User> => {
  throw new Error("Please use Google Sign-In.");
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            resolve(mapToAppUser(firebaseUser, userSnap.data() as Record<string, unknown>));
          } else {
            resolve(null);
          }
        } catch (error) {
          try {
            handleFirestoreError(error, OperationType.GET, `${USERS_COLLECTION}/${firebaseUser.uid}`);
          } catch (e) {
            reject(e);
          }
        }
      } else {
        resolve(null);
      }
    });
  });
};

// --- Management Functions ---
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as User));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
    return [];
  }
};

export const deleteUser = async (userId: string, requestorId: string): Promise<void> => {
  if (userId === requestorId) {
    throw new Error("You cannot delete your own account.");
  }
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${USERS_COLLECTION}/${userId}`);
  }
};

export const updateUserStatus = async (userId: string, status: 'active' | 'suspended'): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  try {
    await updateDoc(userRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
  }
};

export const updateUserExamLimit = async (userId: string, newLimit: number): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  try {
    await updateDoc(userRef, { examLimit: newLimit });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${userId}`);
  }
};

export const updateManagerUserLimit = async (managerId: string, newLimit: number): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, managerId);
  try {
    await updateDoc(userRef, { userLimit: newLimit });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${USERS_COLLECTION}/${managerId}`);
  }
};

export const resetUserPassword = async (userId: string): Promise<void> => {
  // Firebase Auth handles password resets differently (via email)
  console.log("Password reset requested for", userId);
};

export const incrementExamCount = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  try {
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    const userData = userSnap.data();

    if (userData.role !== 'admin' && userData.role !== 'manager') {
      await updateDoc(userRef, {
        examsGenerated: increment(1)
      });
    }
    
    const updatedSnap = await getDoc(userRef);
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.uid === userId) {
      const data = updatedSnap.data();
      if (data) {
        return mapToAppUser(firebaseUser, data as Record<string, unknown>);
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${userId}`);
    return null;
  }
};
