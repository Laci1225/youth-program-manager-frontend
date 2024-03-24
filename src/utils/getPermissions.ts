import jwt from "jsonwebtoken";
import {Session} from "@auth0/nextjs-auth0";

export default async function getPermissions(session: Session | null | undefined) {
    const claims = jwt.decode(session?.accessToken!) as jwt.JwtPayload;
    return claims["permissions"] as string[];
}