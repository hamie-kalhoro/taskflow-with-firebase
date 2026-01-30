import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useFirestore = (collectionName) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // collection ref
    const collectionRef = collection(db, collectionName);

    useEffect(() => {
        let unsubscribe;

        if (user) {
            // Query documents specific to the logged-in user
            const q = query(
                collectionRef,
                where('uid', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                let results = [];
                snapshot.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id });
                });
                setDocuments(results);
                setError(null);
            }, (error) => {
                console.error(error);
                setError('Could not fetch data');
            });
        } else {
            setDocuments(null);
        }

        return () => unsubscribe && unsubscribe();
    }, [collectionName, user]);

    const addDocument = async (doc) => {
        try {
            await addDoc(collectionRef, {
                ...doc,
                uid: user.uid,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const deleteDocument = async (id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const updateDocument = async (id, updates) => {
        try {
            await updateDoc(doc(db, collectionName, id), updates);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return { documents, addDocument, deleteDocument, updateDocument, error };
};
