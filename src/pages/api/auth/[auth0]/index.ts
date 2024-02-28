import {handleAuth, handleLogin} from '@auth0/nextjs-auth0';
import {NextApiRequest, NextApiResponse} from "next";

export default handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            await handleLogin(req, res, {
                authorizationParams: {
                    audience: process.env.AUTH0_ISSUER_BASE_URL,
                },
            });
        } catch (error: any) {
            res.status(error.status || 500).end();
        }
    }
});