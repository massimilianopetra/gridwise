import Head from 'next/head';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>GridWise - Advanced Tools for Trading</title>
        <meta name="description" content="GridWise offers advanced utilities for trading traditional assets and cryptocurrencies. Optimize your strategies with our powerful tools." />
      </Head>
      <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <section className="max-w-4xl text-center p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-500">GridWise</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            GridWise is your go-to platform for advanced tools and utilities in the trading world. Whether you trade traditional assets or cryptocurrencies, our mission is to simplify and enhance your strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Traditional Trading</h2>
              <p className="text-gray-500">
                Access tools for technical analysis, portfolio optimization, and market forecasting.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Crypto Trading</h2>
              <p className="text-gray-500">
                Discover utilities for digital asset tracking, DeFi strategies, and wallet management.
              </p>
            </div>
          </div>
          <Link href="/home">
            <p className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              Explore Our Tools
            </p>
          </Link>
        </section>
      </main>
    </>
  );
};


