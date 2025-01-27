import Link from 'next/link';
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">

        <section className="max-w-4xl text-center p-6">
          <Image
            src="/images/home.jpg"
            width={600}
            height={480}
            alt="Screenshots of the dashboard project showing desktop version"
            className="mx-auto mb-6 rounded-lg shadow-md"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-500">OpenTradeNet</span>
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            OpenTradeNet is your go-to platform for advanced tools and utilities
            in the trading world. Whether you trade traditional assets or cryptocurrencies,
            our mission is to simplify and enhance your strategies. Built as an open-source platform, OpenTradeNet provides all its services free of charge,
            fostering transparency and accessibility for everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Traditional Trading
              </h2>
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

          <div className="flex justify-center space-x-4 mt-6">
            <Link href="/home">
              <p className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Explore Our Tools
              </p>
            </Link>
            <Link href="/register">
              <p className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Register Account
              </p>
            </Link>
          </div>
        </section>
      </main>

    </>
  );
};


