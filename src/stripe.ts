// import {addDoc, collection, onSnapshot} from 'firebase/firestore';
// import {firestore} from './firebase.js';
// import type {Stripe} from 'stripe';
//
// export async function goToCheckoutPage(uid: string) {
// 	const sessionRef = await addDoc(
// 		collection(firestore, `/customers/${uid}/checkout_sessions`),
// 		{
// 			mode: 'payment',
// 			price: 'price_1NLWzpDoQQLk2x936JycRvlk',
// 			success_url: `${window.location.origin}#checkout_success`,
// 			cancel_url: window.location.origin,
// 			billing_address_collection: 'auto',
// 		} as Stripe.Checkout.SessionCreateParams,
// 	);
//
// 	const unsub = onSnapshot(sessionRef, async function (snap) {
// 		const {url} = snap.data();
//
// 		if (url) {
// 			unsub();
// 			window.location.href = url;
// 		}
// 	});
// }
