import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {type FirestoreObjectManager} from '../FirestoreObjectManager.js';

export async function getObjects(manager: FirestoreObjectManager) {
	if (!manager.userCtrl.isConnected) {
		throw new Error('User not connected');
	}
	const firestore = getFirestore(manager.firebase);
	const colRef = collection(
		firestore,
		`users/${manager.userCtrl.id}/${manager.objectHandle}s`,
	);
	const snapshot = await getDocs(colRef);
	return snapshot.docs.map(
		(doc) => new manager.ObjectClass(null, {id: doc.id, ...doc.data()}),
	);
}
