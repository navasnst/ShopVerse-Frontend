import React, { useEffect, useState } from 'react';
import { adminApi } from '../../hooks/adminApi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [salesSeries, setSalesSeries] = useState([]);

  useEffect(() => {
    adminApi.dashboard().then(res => {
      const { data } = res;
      setStats(data.stats || {});
      setSalesSeries(data.salesSeries || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Total Vendors" value={stats.totalVendors} />
        <Card title="Total Products" value={stats.totalProducts} />
        <Card title="Total Orders" value={stats.totalOrders} />
        <Card title="Total Revenue" value={stats.totalRevenue} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Sales over time</h3>
        <div style={{ height: 320 }}>
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











