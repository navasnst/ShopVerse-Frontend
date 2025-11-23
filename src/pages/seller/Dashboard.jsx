import React, { useEffect, useState } from 'react';
import { sellerApi } from '../../hooks/useSellerApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { Sidebar } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const [salesSeries, setSalesSeries] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        let mounted = true;
        sellerApi.dashboard().then((res) => {
            if (!mounted) return;
            setStats(res.data.stats);
            setSalesSeries(res.data.salesSeries || []);
            setTopProducts(res.data.topProducts || []);
            setRecentOrders(res.data.recentOrders || []);
        }).catch(console.error);
        return () => (mounted = false);
    }, []);

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* <Card title="Total Sales" value={stats.totalSales} /> */}
                <Card title="Total Orders" value={stats.totalOrders} />
                <Card title="Total Products" value={stats.totalProducts} />
                <Card title="Pending Orders" value={stats.pendingOrders} />
                {/* <Card title="Total Earnings" value={stats.totalEarnings} /> */}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Sales over time</h3>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer>
                            <LineChart data={salesSeries}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Recent Orders</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left">
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((o) => (
                                <tr key={o._id} className="border-t">
                                    <td>{o.orderId}</td>
                                    <td>{o.customerName}</td>
                                    <td>{o.status}</td>
                                    <td>{o.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <ul className="space-y-2">
                        {/* Notification items are fetched from /notifications */}
                        <NotificationsList />
                    </ul>
                </div>
            </section>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold">{value ?? '-'}</div>
        </div>
    );
}


function NotificationsList() {
    const [notes, setNotes] = React.useState([]);
    React.useEffect(() => { sellerApi.notifications().then((r) => setNotes(r.data.notifications || [])).catch(() => { }); }, []);
    if (!notes.length) return <div className="text-sm text-gray-500">No notifications</div>;
    return (
        <>
            {notes.map((n) => (
                <li key={n._id} className="p-2 border rounded">{n.message}</li>
            ))}
        </>

    );
}
