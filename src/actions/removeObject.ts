import {deleteDoc, doc, getFirestore} from 'firebase/firestore';
import type {
	ControllerWithId,
	FirestoreObjectManager,
} from '../FirestoreObjectManager.js';

export async function removeObject<T extends ControllerWithId>(
	manager: FirestoreObjectManager<T>,
	object: T,
) {
	if (!manager.userCtrl.isConnected) {
		throw new Error('User not connected');
	}
	if (!object.id) {
		throw new Error('Invalid day ID');
	}
	const firestore = getFirestore(manager.firebase);
	const dayDocRef = doc(
		firestore,
		`users/${manager.userCtrl.id}/${manager.objectHandle}s/${object.id}`,
	);
	await deleteDoc(dayDocRef);
}
