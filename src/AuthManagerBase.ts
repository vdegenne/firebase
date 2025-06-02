import {
	getAuth,
	onAuthStateChanged,
	type UserCredential,
	type UserInfo,
} from 'firebase/auth';
import './firebase.js';
import {type FirebaseUser, UserController} from './UserController.js';

interface LoginInformation {
	credential: UserCredential;
	user: UserInfo;
	isNewUser: boolean;
}

export interface AuthManagerImplInterface {
	onAuthStateChanged(user: FirebaseUser | null): void;
	// onAuthStateChangedComplete?(user: UserController): void;
	onUserConnected(user: UserController): void;
	onUserDisconnected(): void;
}

export class AuthManagerBase implements AuthManagerImplInterface {
	constructor(protected userCtrl: UserController) {
		onAuthStateChanged(getAuth(), async (user: FirebaseUser | null) => {
			this.onAuthStateChanged(user);
			await this._onAuthStateChanged(user);

			await this.userCtrl.updateComplete;
			if (this.userCtrl.isConnected) {
				this.onUserConnected(this.userCtrl);
			} else {
				this.onUserDisconnected();
			}
			// this.onAuthStateChangedComplete(this.userCtrl);
		});
	}

	onAuthStateChanged(user: FirebaseUser | null): void {}
	// onAuthStateChangedComplete(user: UserController): void {}
	onUserConnected(user: UserController): void {}
	onUserDisconnected(): void {}

	async _onAuthStateChanged(user: FirebaseUser | null): Promise<void> {
		if (user) {
			const jwtoken = await user.getIdTokenResult(true);
			this.userCtrl.user = user;
			this.userCtrl.isPremium = jwtoken.claims.isPremium === true;
		} else {
			this.userCtrl.reset();
		}
	}

	async isUserLogged() {
		await this.userCtrl.updateComplete;
		return this.userCtrl.isConnected;
	}

	async loginOrLogout() {
		if (!this.isUserLogged()) {
			return await this.login();
		} else {
			return await this.logout();
		}
	}

	/**
	 * Here's an example how to use it:
	 *
	 * ```javascript
	 * async #login() {
	 *   if (!authManager.isUserLogged()) {
	 *     try {
	 *       await authManager.login();
	 *       this.dialog.close();
	 *       // To get a fully updated user controller
	 *       const {getOnAuthStateChangedComplete} = await import('../firebase/onAuthStateChanged.js');
	 *       const userCtrl = await getOnAuthStateChangedComplete();
	 *       if (userCtrl.isAuthorized) {
	 *         // do something
	 *       }
	 *     } catch {
	 *       // canceled
	 *       return;
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * Check `onAuthStateChanged.ts` for more details.
	 */
	async login(): Promise<LoginInformation> {
		if (await this.isUserLogged()) {
			throw new Error('Already logged in');
		}
		const {signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo} =
			await import('firebase/auth');
		const credential = await signInWithPopup(
			getAuth(),
			new GoogleAuthProvider(),
		);
		const isNewUser = !!getAdditionalUserInfo(credential)?.isNewUser;
		this.userCtrl.isNewUser = isNewUser;
		return {
			credential,
			user: credential.user,
			isNewUser,
		};
	}

	/**
	 * Here's an example how to use it:
	 *
	 * ```javascript
	 * @confirm({content: 'You will be logged out'})
	 * private async logout() {
	 *   if (await authManager.isUserLogged()) {
	 *     try {
	 *       await authManager.logout();
	 *       this.dialog.close();
	 *       toastit('Logged out');
	 *     } catch {
	 *       return;
	 *     }
	 *   }
	 * }
	 * ```
	 */
	async logout() {
		if (!(await this.isUserLogged())) {
			throw new Error('Already logged out');
		}
		try {
			const {signOut} = await import('firebase/auth');
			await signOut(getAuth());
			// await getAuth().signOut();
		} catch {
			throw new Error('Something went wrong');
		}
	}
}
