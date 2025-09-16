import React, { useEffect, useState } from "react";
import axios from "axios";

interface WalletEntry {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${API_URL}/api/wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWallet(data.wallet || []);
        setBalance(data.balance || 0);
      } catch (err) {
        console.error("Failed to load wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading wallet...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 bg-white shadow-lg rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">My Wallet</h2>
          <p className="text-gray-500">Available Balance</p>
        </div>
        <div className="text-2xl font-bold text-green-600">
          ${balance.toFixed(2)}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-4">Transactions</h3>
        {wallet.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {wallet.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-2">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="p-2 capitalize">{entry.type}</td>
                  <td
                    className={`p-2 font-semibold ${
                      entry.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {entry.amount >= 0 ? "+" : ""}${entry.amount.toFixed(2)}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        entry.status === "available"
                          ? "bg-green-100 text-green-700"
                          : entry.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            balance < 10
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={balance < 10}
        >
          Withdraw Funds
        </button>
      </div>
    </div>
  );
};

export default Wallet;
