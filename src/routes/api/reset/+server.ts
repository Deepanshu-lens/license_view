import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request,locals }) => {
    console.log(locals.user.token)
    try {
        const { newPassword, newPasswordConfirm } = await request.json();
        const token = locals.user.token


        const newAuth = await locals.pb?.collection('users').authWithPassword(
            'admin@admin.com',
            '1234567890'
        )

        console.log(typeof token)

        console.log(newAuth?.token)
        const result = await locals.pb?.collection('users').confirmPasswordReset(
            newAuth?.token,
            newPassword,
            newPasswordConfirm
        );

        console.log(result)

        return json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        return json({ success: false, message: 'Password reset failed' }, { status: 400 });
    }
};