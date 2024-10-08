import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

let pb: PocketBase;

if (browser) {
    pb = new PocketBase(`http://${window.location.hostname}:5555`);
}

export { pb };