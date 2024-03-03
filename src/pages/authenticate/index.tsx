/*export default function Authenticate() {
    const router = useRouter();
    const parseHash = () => {
        auth.parseHash({
                hash: router.asPath.split('?')[1]
            }, (err, authResult) => {
                if (err) {
                    console.log(err)
                    return
                }
                if (authResult) {
                    console.log(authResult)
                    if (authResult.accessToken) {
                        auth.client.userInfo(authResult.accessToken,
                            (err, user) => {
                                if (err) {
                                    console.log(err)
                                    return;
                                }
                                console.log(user)
                            })
                    }
                }
            }
        )
    }
    useEffect(() => {
        parseHash()
    }, []);
    return (
        <div>
            Loading....
        </div>
    )
}*/