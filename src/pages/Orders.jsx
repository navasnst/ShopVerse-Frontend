import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import Loader from '../Components/Loader'

export default function Orders() {
    const { user } = useContext(AuthContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/orders/myorders/${user?._id}`)
                setOrders(res.data || [])
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user?._id) fetchOrders()
    }, [user])

    if (loading) return <Loader text="Loading your orders..." />

    if (!orders.length)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-600">
                <h2 className="text-2xl font-semibold mb-3">No Orders Found</h2>
                <p>Looks like you haven’t placed any orders yet.</p>
            </div>
        )

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Orders</h2>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition"
                    >
                        <div className="flex flex-wrap justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Order #{order._id.slice(-6).toUpperCase()}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered'
                                        ? 'bg-green-100 text-green-700'
                                        : order.status === 'Processing'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {order.status || 'Pending'}
                            </span>
                        </div>

                        <div className="text-gray-600 mb-4">
                            <p>
                                <span className="font-medium">Date:</span>{' '}
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <p>
                                <span className="font-medium">Payment:</span>{' '}
                                {order.paymentMethod?.toUpperCase() || 'COD'}
                            </p>
                            <p>
                                <span className="font-medium">Total:</span> ₹
                                {order.totalAmount.toFixed(2)}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Products</h4>
                            <ul className="space-y-2">
                                {order.products.map((item) => (
                                    <li
                                        key={item._id}
                                        className="flex justify-between text-sm text-gray-700"
                                    >
                                        <span>
                                            {item.product?.name || 'Product'} × {item.quantity}
                                        </span>
                                        <span>
                                            ₹{(item.product?.price * item.quantity).toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {order.shippingAddress && (
                            <div className="border-t mt-4 pt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Shipping Address</h4>
                                <p className="text-gray-600 text-sm">
                                    {order.shippingAddress.name}
                                    <br />
                                    {order.shippingAddress.address}
                                    <br />
                                    {order.shippingAddress.city} - {order.shippingAddress.postalCode}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
