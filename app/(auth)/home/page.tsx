

export default function Home() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <main>

        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

          <br></br>
          <div className="max-w-4xl bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">What is Grid Trading?</h1>
            <p className="text-gray-700 text-lg mb-4">
              Grid trading is a trading strategy that involves placing a series of buy and sell orders at
              predefined intervals above and below a set price. This creates a "grid" of orders, enabling
              traders to profit from market volatility without needing to predict the market direction.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-gray-700 text-lg mb-4">
              <li>Profits from market fluctuations.</li>
              <li>No need to predict market direction.</li>
              <li>Works well in ranging markets.</li>
              <li>Customizable grid levels and intervals.</li>
            </ul>
            <p className="text-gray-700 text-lg mb-6">
              Grid trading is particularly popular in cryptocurrency and forex markets due to their high
              volatility. However, it can also be used in traditional stock trading. By strategically
              setting up a grid of buy and sell orders, traders can automate their strategy and reduce the
              need for constant monitoring.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
