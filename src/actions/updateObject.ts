import {doc, getFirestore, updateDoc} from 'firebase/firestore';
import type {
	ControllerWithId,
	FirestoreObjectManager,
} from '../FirestoreObjectManager.js';

export async function updateObject<T extends ControllerWithId>(
	manager: FirestoreObjectManager<T>,
	objectId: string,
	properties: Partial<T>,
): Promise<void> {
	if (!manager.userCtrl.isConnected) {
		throw new Error('User not connected');
	}
	if (!objectId) {
		throw new Error('Invalid object ID');
	}
	const firestore = getFirestore(manager.firebase);
	const objectDocRef = doc(
		firestore,
		`users/${manager.userCtrl.id}/${manager.objectHandle}s/${objectId}`,
	);

	const cleanProps = Object.fromEntries(
		Object.entries(properties).filter(([, value]) => value !== undefined),
	);

	if (Object.keys(cleanProps).length === 0) return;

	await updateDoc(objectDocRef, cleanProps);
}
