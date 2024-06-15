// import { redirect } from '@sveltejs/kit';

// export const GET = async ({ locals, url, cookies, request }) => {
//     const redirectURL = `${url.origin}/oauth`;

//     const expectedState = cookies.get('state');
//     const expectedVerifier = cookies.get('verifier');


//     console.log(expectedState)
//     console.log(expectedVerifier)

//     const state = url.searchParams.get('state');
//     const code = url.searchParams.get('code');

//     const authMethods = await locals.pb?.collection('users').listAuthMethods();
//     const session = await locals.pb
//         ?.collection("session")
//         .create({
//             owned: true,
//         })
//         .catch((e) => {
//             console.error("[Session Create Error]: ", e);
//         });
//     console.log(session);

//     if (!authMethods?.authProviders || authMethods.authProviders.length === 0) {
//         console.log('No Auth Providers');
//         throw redirect(303, '/register');
//     }

//     const provider = authMethods.authProviders[0];
//     const verifier = provider.codeVerifier

//     if (expectedState !== state) {
//         console.log('Returned State Does not Match Expected', expectedState, state);
//         throw redirect(303, '/register');
//     }
// console.log(expectedVerifier)
// console.log(verifier)
//     try {
//      const auth = await locals.pb?.collection('users')
//             .authWithOAuth2Code(provider.name, code, expectedVerifier ? expectedVerifier : verifier, redirectURL, { username: '', name: 'user', session: session.id });


//             console.log(auth)


//         // Redirect to a success page or dashboard after successful login
//         const isProd = process.env.NODE_ENV === "production" ? true : false;
//         if (locals.pb?.authStore.isValid) {
//             const cookieOptions = {
//                 secure: isProd,
//                 sameSite: isProd ? "none" : "lax",
//                 httpOnly: true,
//             };
//             const authToken = locals.pb?.authStore.exportToCookie(cookieOptions);
//             cookies.set("pb_auth", authToken, cookieOptions);
//         } else {
//             console.log('Auth store is not valid after OAuth');
//         }
//     } catch (err) {
//         console.log('Error logging in with OAuth2 user', err);
//         throw redirect(303, '/login?error=login_failed');
//     }
//     throw redirect(303, `/session/${session.id}`);
// };



import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, url, cookies }) => {
    const redirectURL = `${url.origin}/oauth`;

    const expectedState = cookies.get('state');
    const expectedVerifier = cookies.get('verifier');

    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');
    console.log(locals.pb?.authStore)
    locals.pb?.authStore.clear();
    console.log("Cleared existing authStore data");


    if (!expectedState || expectedState !== state) {
        throw redirect(303, '/register?message=State mismatch.');
    }

    const authMethods = await locals.pb.collection('users').listAuthMethods();
    const googleProvider = authMethods.authProviders.find(provider => provider.name === "google");

    if (!googleProvider) {
        throw redirect(303, `/register?message=Google Auth not available.`);
    }
    // console.log(locals.user)
    const session = await locals.pb.collection("session").create({ owned: true });

    try {
        // const auth = await locals.pb?.collection('users')
        //     .authWithOAuth2Code(googleProvider.name, code, expectedVerifier, redirectURL, { username: '', name: 'My Awesome User', session: session.id });
        // console.log(auth)

        const auth = await locals.pb.collection('users').authWithOAuth2Code(
            googleProvider.name,
            code,
            expectedVerifier || googleProvider.codeVerifier,
            redirectURL,
            { username: '', name: 'user', session: session.id }
        );
        console.log(auth)

        if (auth.record && auth.record.id) {
            console.log('updating user')
            console.log(auth.meta?.name)
            console.log(auth.meta?.avatarUrl)
            const update = await locals.pb?.collection('users').update(auth.record.id, {
                name: auth.meta?.name,
                avatar: auth.meta?.avatarUrl
            })

            console.log(update)
        }

        // If the returned record is not for a new user, create a new user explicitly
        // if (auth.record && auth.record.id) {
        //     console.log('Existing user data returned:', auth.record);
        //     // Create a new user since the existing user data was returned
        //     const newUser = await locals.pb?.collection('users').create({
        //         name: auth.meta?.name,
        //         session: session.id,
        //         email: auth.meta?.email,
        //         image: auth.meta?.picture
        //     });
        //     console.log('New user created:', newUser);
        // } else {
        //     console.log('New user authenticated:', auth);
        // }
        // if(auth.name !== 'user') {
        //     await locals.pb.collection('users').update(auth.id, {
        //         name: 'user'
        //     })
        // }

        if (locals.pb.authStore.isValid) {
            const isProd = process.env.NODE_ENV === "production";
            const cookieOptions = {
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                httpOnly: true,
                path: '/'
            };
            const authToken = locals.pb.authStore.exportToCookie(cookieOptions);
            cookies.set("pb_auth", auth.token, cookieOptions);
        } else {
            console.log('Auth store is not valid after OAuth');
        }
    } catch (err) {
        console.log('Error logging in with OAuth2 user', err);
        cookies.delete('pb_auth')
        cookies.delete('state')
        cookies.delete('verifier')
        locals.pb?.authStore.clear();
        throw redirect(303, '/login?error=login_failed');
    }
    console.log(session.id)
    throw redirect(303, `/session/${session.id}`);
};
