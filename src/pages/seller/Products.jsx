import React, { useEffect, useState } from 'react';
import { sellerApi } from '../../hooks/useSellerApi';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchProducts(); }, []);


    function fetchProducts() {
        setLoading(true);
        sellerApi.products().then(r => setProducts(r.data.products || [])).catch(console.error).finally(() => setLoading(false));
    }

    async function handleDelete(id) {
        if (!confirm('Delete product?')) return;
        await sellerApi.productDelete(id);
        fetchProducts();
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input className="border p-2" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2">
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left">
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.filter(p => (filter === 'all' || p.status === filter) && p.title.toLowerCase().includes(query.toLowerCase())).map(p => (
                            <tr key={p._id} className="border-t">
                                <td><img src={p.images?.[0]} className="w-12 h-12 object-cover" /></td>
                                <td>{p.title}</td>
                                <td>{p.category}</td>
                                <td>{p.price}</td>
                                <td>{p.stock}</td>
                                <td>{p.status}</td>
                                <td className="flex gap-2">
                                    <a className="text-blue-500" href={`/seller/products/edit/${p._id}`}>Edit</a>
                                    <button className="text-red-500" onClick={() => handleDelete(p._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}








