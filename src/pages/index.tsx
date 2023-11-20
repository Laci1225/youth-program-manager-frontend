export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/children',
            permanent: true,
        },
    }
}

export default function Home() {

}
