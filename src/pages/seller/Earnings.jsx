import React, { useEffect, useState } from 'react';
import { sellerApi } from '../../hooks/useSellerApi';


export default function Earnings() {
    const [data, setData] = useState({});
    useEffect(() => { sellerApi.earnings().then(r => setData(r.data || {})).catch(console.error); }, []);
    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">Total Earnings: {data.totalEarnings}</div>
            <div className="bg-white p-4 rounded shadow">Pending Payouts: {data.pendingPayouts}</div>
            <div className="bg-white p-4 rounded shadow">Commission Fee: {data.commissionPercentage}%</div>
            <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold">Transaction history</h4>
                <table className="w-full text-sm">
                    <thead><tr><th>Order</th><th>Amount</th><th>Commission</th><th>Net</th><th>Status</th></tr></thead>
                    <tbody>
                        {(data.transactions || []).map(t => (
                            <tr key={t._id} className="border-t"><td>{t.orderId}</td><td>{t.amount}</td><td>{t.commission}</td><td>{t.net}</td><td>{t.status}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}