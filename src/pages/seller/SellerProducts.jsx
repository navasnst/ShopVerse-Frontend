
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null); // which product is being edited
    const [editData, setEditData] = useState({ title: "", price: "", stock: "" });
    const [editImage, setEditImage] = useState(null); // state for new image

    const fetchProducts = async () => {
        try {
            const res = await api.get("/seller/my-products");
            if (res.data.success) setProducts(res.data.products);
        } catch (err) {
            console.error(err);
            alert("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await api.delete(`/seller/product/${id}`);
            if (res.data.success) setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    const startEdit = (p) => {
        setEditingId(p._id);
        setEditData({ title: p.title, price: p.price, stock: p.stock });
        setEditImage(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ title: "", price: "", stock: "" });
        setEditImage(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEditImage(e.target.files[0]);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const formData = new FormData();
            formData.append("title", editData.title);
            formData.append("price", editData.price);
            formData.append("stock", editData.stock);
            if (editImage) formData.append("image", editImage);

            const res = await api.put(`/seller/product/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                setProducts(products.map(p =>
                    p._id === id
                        ? { ...p, ...editData, images: editImage ? [URL.createObjectURL(editImage)] : p.images }
                        : p
                ));
                cancelEdit();
            }
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">My Products</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <div key={p._id} className="border p-3 rounded shadow hover:shadow-lg transition-shadow duration-200">
                            <img src={p.images[0]} alt="" className="w-full h-48 sm:h-40 object-cover mb-2 rounded" />

                            {editingId === p._id ? (
                                <>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editData.title}
                                        onChange={handleChange}
                                        className="border p-1 w-full mb-1 rounded"
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        value={editData.price}
                                        onChange={handleChange}
                                        className="border p-1 w-full mb-1 rounded"
                                    />
                                    <input
                                        type="number"
                                        name="stock"
                                        value={editData.stock}
                                        onChange={handleChange}
                                        className="border p-1 w-full mb-1 rounded"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="border p-1 w-full mb-1 rounded"
                                    />
                                    {editImage && (
                                        <img
                                            src={URL.createObjectURL(editImage)}
                                            alt="preview"
                                            className="w-full h-40 object-cover mb-2 rounded"
                                        />
                                    )}
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <button onClick={() => handleUpdate(p._id)} className="bg-green-600 text-white px-2 py-1 rounded flex-1 sm:flex-none">Save</button>
                                        <button onClick={cancelEdit} className="bg-gray-600 text-white px-2 py-1 rounded flex-1 sm:flex-none">Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-semibold truncate">{p.title}</h3>
                                    <p className="text-sm">Price: ₹{p.price}</p>
                                    <p className="text-sm">Stock: {p.stock}</p>
                                    {p.offer?.discount && (
                                        <p className="text-red-600 text-sm">Offer: {p.offer.discount}% off — ends {new Date(p.offer.countdown).toLocaleDateString()}</p>
                                    )}
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <button onClick={() => startEdit(p)} className="bg-blue-600 text-white px-2 py-1 rounded flex-1 sm:flex-none">Edit</button>
                                        <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-2 py-1 rounded flex-1 sm:flex-none">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}










