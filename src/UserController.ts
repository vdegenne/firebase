import {ReactiveController, state} from '@snar/lit';
import type {User as FirebaseUser} from 'firebase/auth';

export {type FirebaseUser};

declare global {
	interface Window {
		userCtrl: UserController;
	}
}

interface UserControllerInterface {
	user: FirebaseUser | null;
	isPremium: boolean | undefined;
	isNewUser: boolean | undefined;
}

export class UserController
	extends ReactiveController<UserControllerInterface>
	implements UserControllerInterface
{
	@state() user: FirebaseUser | null = null;
	@state() isPremium: boolean | undefined = undefined;
	/**
	 * This property can be retrieved from UserCredential on one of firebase signin methods,
	 * It only appears on first sign in on first user registration, so it's important to set it
	 * to make it available early from the onAuthStateChanged callback (e.g. to determine if
	 * data should be persisted if the user used it offline prior to the connection.)
	 */
	@state() isNewUser: boolean | undefined = undefined;

	reset() {
		this.user = null;
		this.isPremium = false;
		this.isNewUser = undefined;
	}

	async updated() {
		// console.log('User center updated.');
		if (this.user) {
			// console.log((await this.user.getIdTokenResult()).claims);
		}
	}

	get id() {
		return this.user?.uid;
	}

	get isConnected() {
		return !!this.user;
	}

	get isAuthorized() {
		return this.isConnected && this.isPremium;
	}
}

export const userCtrl = (window.userCtrl = new UserController());
