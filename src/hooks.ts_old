import type {IdTokenResult} from 'firebase/auth';
import {type FirebaseUser, userCtrl} from './UserController.js';

export async function whenAuthStateChanges(user: FirebaseUser | null) {
	// const shell = document.querySelector('material-shell')!;
	// shell.innerHTML = '';
	// window.bulletsView.loading = true;
}

export async function whenUserConnects(
	user: FirebaseUser,
	token: IdTokenResult,
) {
	userCtrl.user = user;
	userCtrl.isPremium = token.claims.isPremium === true;
	// await userCtrl.updateComplete;
	// if (!userCtrl.isPremium) {
	//   // access denied
	//   await logout();
	//   return;
	// }
	/* When the user logs, we show the application */
	// import('../app-shell/app-shell.js').then((module) => {
	// 	document.querySelector('material-shell').appendChild(module.app);
	// });
}

export async function whenUserDisconnects() {
	userCtrl.reset();
	/* If the user is not logged, we should show a login dialog */
	// import('../login-interface/login-interface.js').then((module) => {
	// 	document.querySelector('material-shell').appendChild(module.loginInterface);
	// });
}

/**
 * Called after user controller was fully updated
 */
const FIRST_DATA_SAVE_FAILED_LS_HANDLE = 'first-data-save-failed';
export async function postWhenUserConnects() {
	/** This is a persistent save flag, to make sure data was saved properly */
	const firstDataSaveFailed = localStorage.getItem(
		FIRST_DATA_SAVE_FAILED_LS_HANDLE,
	);
	if (userCtrl.isNewUser || firstDataSaveFailed !== null) {
		localStorage.setItem(FIRST_DATA_SAVE_FAILED_LS_HANDLE, 'true');
		/**
		 * If the user is new we should save the local data
		 * we use batching to make sure everything is saved properly. */
		// if (window.bulletsManager.bullets.length > 0) {
		// 	const batch = writeBatch(firestore);
		// 	for (const bullet of window.bulletsManager.bullets) {
		// 		const data = bullet.toJSON() as any;
		// 		if ('i' in data && data.i === 0) {
		// 			delete data.i;
		// 		}
		// 		batch.set(
		// 			doc(firestore, `customers/${user.uid}/bullets/${bullet.id}`),
		// 			data
		// 		);
		// 	}

		// 	await batch.commit();
		// }

		localStorage.removeItem(FIRST_DATA_SAVE_FAILED_LS_HANDLE);
	}

	/**
	 * Make sure we empty the local storage when user is connected
	 * to avoid confusion between local and remote state. */
	// window.bulletsManager.clearData();
	// await window.bulletsManager.updateComplete;
	// window.bulletsManager.startWatching();
}

/**
 * Called after user controller was fully updated
 */
export async function postWhenUserDisconnects() {
	// import('../app/app.js').then((module) => {
	// 	shell.appendChild(module.app);
	// });
	/** Normal execution when the user is not connected */
	// window.bulletsManager.stopWatching();
	// window.bulletsManager.loadFromLocalStorage();
}
