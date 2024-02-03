import {useUser} from "@auth0/nextjs-auth0/client";

export default function Home() {
    const {user, error, isLoading} = useUser();
    if (user)
        return <div>
            Welcome {user.name}
        </div>
}
