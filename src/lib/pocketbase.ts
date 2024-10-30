import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

let pb: PocketBase;

if (browser) {
    pb = new PocketBase(`https://pocketbase.lenscorp.cloud`);
}

export { pb };