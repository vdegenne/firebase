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
	isNewUser: boolean | undefined;
}

export interface AuthManagerImplInterface {
	onAuthStateChanged(user: FirebaseUser | null): void;
	// onAuthStateChangedComplete?(user: UserController): void;
	onUserConnected(user: UserController): void;
	onUserDisconnected(user: UserController): void;
}

export class AlreadyLoggedInError extends Error {
	constructor(message = 'Already logged in') {
		super(message);
		this.name = 'AlreadyLoggedInError';
	}
}

export class AuthManagerBase implements AuthManagerImplInterface {
	/** TODO: implement a promise to wait for the first onAuthStateChanged call to avoid using an undefined object below */
	#onAuthStateChangedPromiseWithResolvers!: PromiseWithResolvers<void>;

	get authStateChangedComplete() {
		return this.#onAuthStateChangedPromiseWithResolvers.promise;
	}

	constructor(protected userCtrl: UserController) {
		onAuthStateChanged(getAuth(), async (user: FirebaseUser | null) => {
			this.#onAuthStateChangedPromiseWithResolvers =
				Promise.withResolvers<void>();
			this.onAuthStateChanged(user);
			await this._onAuthStateChanged(user);

			await this.userCtrl.updateComplete;
			if (this.userCtrl.isConnected) {
				this.onUserConnected(this.userCtrl);
			} else {
				this.onUserDisconnected(this.userCtrl);
			}

			this.#onAuthStateChangedPromiseWithResolvers.resolve();
		});
	}

	onAuthStateChanged(user: FirebaseUser | null): void {}
	// onAuthStateChangedComplete(user: UserController): void {}
	onUserConnected(user: UserController): void {}
	onUserDisconnected(user: UserController): void {}

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
		if (!(await this.isUserLogged())) {
			return await this.login();
		} else {
			return await this.logout();
		}
	}

	async #doNotLogTwice() {
		if (await this.isUserLogged()) {
			throw new AlreadyLoggedInError();
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
		await this.#doNotLogTwice();
		const {signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo} =
			await import('firebase/auth');
		const userCredential = await signInWithPopup(
			getAuth(),
			new GoogleAuthProvider(),
		);
		const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;
		this.userCtrl.isNewUser = isNewUser;
		return {
			credential: userCredential,
			user: userCredential.user,
			isNewUser,
		};
	}

	/**
	 * How to use:
	 * ```js
	 * try {
	 *   await authManager.loginWithGoogleCredential(idToken)
	 * } catch (err) {
	 *   if (err instanceof AlreadyLoggedInError) {
	 *     await authManager.logout();
	 *   } else {
	 *     throw err;
	 *   }
	 * }
	 * ```
	 */
	async loginWithGoogleCredential(
		googleIdToken?: string | null,
		googleAccessToken?: string | null,
	): Promise<LoginInformation> {
		await this.#doNotLogTwice();

		const {signInWithCredential, GoogleAuthProvider, getAdditionalUserInfo} =
			await import('firebase/auth');

		const oauthCredential = GoogleAuthProvider.credential(
			googleIdToken,
			googleAccessToken,
		);

		const userCredential = await signInWithCredential(
			getAuth(),
			oauthCredential,
		);
		const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;
		this.userCtrl.isNewUser = isNewUser;
		return {
			credential: userCredential,
			user: userCredential.user,
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
