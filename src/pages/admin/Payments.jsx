import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

export default function Payments() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await api.get("/admin/transactions");
    setTransactions(res.data.transactions || []);
  };

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-semibold mb-4">Payments & Transactions</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Order</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Commission</th>
            <th>Net</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-t">
              <td>{t.order?._id}</td>
              <td>{t.vendor?.shopName}</td>
              <td>₹{t.amount}</td>
              <td>₹{t.commission}</td>
              <td>₹{t.netAmount}</td>
              <td>{t.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
