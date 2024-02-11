import {handleAuth, handleLogin} from '@auth0/nextjs-auth0';

export default handleAuth({
    async login(req, res) {
        try {
            console.log("Handle login")
            await handleLogin(req, res, {authorizationParams: {audience: 'https://dev-wnuf5ensk4dnqucn.eu.auth0.com/api/v2/'}});
            console.log("Handle login done")
        } catch (error) {
            console.log("Handle login fail")
            res.status(error.status || 500).end();
        }
    }
});