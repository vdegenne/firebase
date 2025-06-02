/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 *
 *
 * This module is used to store server time (firestore timestamp) locally.
 * The following google cloud function needs to be available for this module to work.
 * Values are saved locally if they don't exist,
 * the function `getSyncNow()` can then be used to get the remote current time.
 *
 * ```javascript
 * const {Timestamp} = require('firebase-admin/firestore');
 * const {onCall} = require('firebase-functions/v2/https');
 *
 * exports.getservertime = onCall(() => {
 *   return Timestamp.now().toMillis()
 * });
 * ```
 */
import {httpsCallable} from 'firebase/functions';
import {functions} from './firebase.js';
import {ReactiveObject, state} from 'snar';
import {saveToLocalStorage} from 'snar-save-to-local-storage';

// const functions = getFunctions();
// connectFunctionsEmulator(functions, '192.168.1.168', 5001);
const getServerTime = httpsCallable(functions, 'getservertime');

@saveToLocalStorage('server-time')
class ServerTime extends ReactiveObject {
	@state() private remoteTime: number | undefined = undefined;
	@state() private timeDifference?: number = undefined;

	#readyPromiseWithResolvers = Promise.withResolvers<void>();
	get isReady() {
		return this.#readyPromiseWithResolvers.promise;
	}

	async firstUpdated() {
		if (!this.remoteTime) {
			await this.requestRemoteTimeUpdate();
		}
		this.#readyPromiseWithResolvers.resolve();
	}

	async requestRemoteTimeUpdate() {
		await this.#performRemoteTimeUpdate();
	}

	async #performRemoteTimeUpdate() {
		this.remoteTime = (await getServerTime()).data as number;
		this.updateLocalValues();
	}

	updateLocalValues() {
		this.timeDifference = Date.now() - this.remoteTime!;
	}

	async getSyncNow() {
		await this.isReady;

		return Date.now() + this.timeDifference!;
	}
}

export const serverTime = new ServerTime();
