import {addDoc, collection, getFirestore} from 'firebase/firestore';
import type {
	AugmentedController,
	FirestoreObjectManager,
} from '../FirestoreObjectManager.js';

export async function addObject<T extends AugmentedController>(
	manager: FirestoreObjectManager,
	object: T,
) {
	if (!manager.userCtrl.isConnected) {
		throw new Error('User not connected.');
	}
	if (object.id !== undefined) {
		throw new Error(`This ${manager.objectHandle} already has an id.`);
	}
	const firestore = getFirestore(manager.firebase);
	const colRef = collection(
		firestore,
		`users/${manager.userCtrl.id}/${manager.objectHandle}s`,
	);
	const docRef = await addDoc(
		colRef,
		object.toJSON({removeUndefinedValues: true}),
	);
	// TODO: Be careful there, this could trigger a new update
	object.id = docRef.id;
	return object;
}
