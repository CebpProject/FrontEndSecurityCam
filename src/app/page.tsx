import Head from 'next/head';

const HomePage = () => {
    return (
        <div className="bg-background-alt">
            <Head>
                <title>Home Page</title>
                <meta name="description" content="Welcome to the homepage" />
            </Head>
            <main className="container mx-auto p-4 bg-background-alt">
                <h1 className="text-4xl font-bold text-center mb-8">Welcome to My Website</h1>
                <p className="text-lg text-gray-700 text-center ">
                    This is the main content of the home page.
                </p>
            </main>
        </div>
    );
};

export default HomePage;
