import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
    context.res.writeHead(302, { Location: "/children" });
    context.res.end();
    return { props: {} };
};

export default function Home() {

}
