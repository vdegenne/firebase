import {type FirebaseOptions, initializeApp} from 'firebase/app';
// import {DEV} from '../constants.js';

export function createFirebase(options: FirebaseOptions) {
	return initializeApp(options);
}

// export const firebase = initializeApp(firebaseConfig);

// Connect the emulators during development
// if (DEV) {
// 	Promise.all([
// 		import('firebase/firestore'),
// 		import('firebase/auth'),
// 		import('firebase/functions'),
// 	]).then(
// 		([
// 			{getFirestore, connectFirestoreEmulator},
// 			{getAuth, connectAuthEmulator},
// 			{getFunctions, connectFunctionsEmulator},
// 		]) => {
// 			const host = 'localhost';
// 			connectFirestoreEmulator(getFirestore(), host, 8080);
// 			connectAuthEmulator(getAuth(), `http://${host}:9099`);
// 			connectFunctionsEmulator(getFunctions(), host, 5001);
// 			document.body.querySelector('.firebase-emulator-warning')?.remove();
// 		}
// 	);
// }
