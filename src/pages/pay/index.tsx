import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import {loadStripe, Stripe} from "@stripe/stripe-js";
import CheckoutForm from "@/form/payment/CheckoutForm";
import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import getPermissions from "@/utils/getPermissions";

export const getServerSideProps = withPageAuthRequired<{
    accessToken: string;
    permissions: string[];
    publishableKey: string;
    clientSecret: string;
}>({
    async getServerSideProps(context) {
        const session = await getSession(context.req, context.res);
        const permissions = await getPermissions(session);
        if (session?.accessTokenExpiresAt && session.accessTokenExpiresAt < Date.now() / 1000) {
            context.res.writeHead(302, { Location: "/api/auth/logout" }).end();
            return { props: {} as any };
        }
        const configResponse = await fetch("http://localhost:8080/payment/config", {
            headers: { Authorization: `Bearer ${session!.accessToken!}` },
        });
        const { publishableKey } = await configResponse.json();
        console.log(publishableKey)
        const paymentIntentResponse = await fetch("http://localhost:8080/payment/create-payment-intent", {
            headers: { Authorization: `Bearer ${session!.accessToken!}` },
            method: "POST",
            body: JSON.stringify({}),
        });
        const { clientSecret } = await paymentIntentResponse.json();
        console.log(clientSecret)
        return {
            props: {
                accessToken: session!.accessToken!,
                permissions,
                publishableKey,
                clientSecret,
            },
        };
    },
}) satisfies GetServerSideProps<{}>;

function Payment({
                     accessToken,
                     permissions,
                        publishableKey,
                        clientSecret,
                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
    let a = async () => {
        setStripePromise(await loadStripe(publishableKey));
    }
    useEffect(() => {
        a()
    }, []);

    return (
            <div className="w-[480px] mx-auto p-6">
            <h1>React Stripe and the Payment Element</h1>
            {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}

export default Payment;