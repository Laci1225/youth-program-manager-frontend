import {CurrentUser} from "@/model/current-user";

const getCurrentUser = (auth0Token: string) => fetch("http://localhost:8080/me", {headers: {"Authorization": `Bearer ${auth0Token}`}}).then(
    response => response.json() as Promise<CurrentUser>
)
export default getCurrentUser