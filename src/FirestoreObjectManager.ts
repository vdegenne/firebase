import {ReactiveController, state} from '@snar/lit';
import {type FirebaseApp} from 'firebase/app';
import {toast} from 'toastit';
import {type UserController} from './UserController.js';

export type ControllerWithId = ReactiveController & {id?: string};

export class FirestoreObjectManager<
	T extends ControllerWithId,
> extends ReactiveController {
	@state() objects: T[] = [];

	constructor(
		public firebase: FirebaseApp,
		public userCtrl: UserController,
		/**
		 * The object name handle. E.g. `post`.
		 * The name should always be in singular form and not plural (`posts` is not valid.)
		 */
		public objectHandle: string,
		public ObjectClass: new (...args: any[]) => T,
	) {
		super();
	}

	getObjectFromId(id: string) {
		return this.objects.find((object: ControllerWithId) => object.id === id);
	}

	async loadObjects(): Promise<void> {
		try {
			const {getObjects} = await import('./actions/getObjects.js');
			this.objects = await getObjects(this);
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast('Something went wrong, check console.');
				throw err;
			}
		}
	}

	async addObject(object: T) {
		try {
			const {addObject} = await import('./actions/addObject.js');
			this.objects = [...this.objects, await addObject(this, object)];
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast('Something went wrong, check console.');
				throw err;
			}
		}
	}

	async removeObject(objectId: string): Promise<void>;
	async removeObject(object: T): Promise<void>;
	async removeObject(object: string | T): Promise<void> {
		try {
			const objectId = typeof object === 'string' ? object : object.id;
			const index = this.objects.findIndex((o) => o.id === objectId);
			if (index < 0) {
				throw new Error(`Object of id ${objectId} can't be found.`);
			}
			const {removeObject} = await import('./actions/removeObject.js');
			await removeObject(this, this.objects[index]);
			this.objects.splice(index, 1);
			this.objects = [...this.objects];
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast('Something went wrong, check console.');
				throw err;
			}
		}
	}

	async updateObject(objectId: string, properties: Partial<T>) {
		try {
			const {updateObject} = await import('./actions/updateObject.js');
			await updateObject(this, objectId, properties);
			this.objects = [...this.objects];
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast('Something went wrong, check console.');
				throw err;
			}
		}
	}
}
