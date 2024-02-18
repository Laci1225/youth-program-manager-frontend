import {handleAuth, handleLogin} from '@auth0/nextjs-auth0';
import {NextApiRequest, NextApiResponse} from "next";

export default handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            console.log('Handle login');
            await handleLogin(req, res, {
                authorizationParams: {
                    audience: 'https://ypm/api',
                },
            });
            console.log('Handle login done');
        } catch (error: any) {
            console.log('Handle login fail ', error);
            res.status(error.status || 500).end();
        }
    }
});