import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../Components/ProductCard";

export default function CategoryPage() {
    const { slug } = useParams(); // slug comes from URL
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadCategoryProducts = async () => {
            try {
                const res = await api.get("/products", {
                    params: { category: slug } // fetch only this category
                });
                setProducts(res.data.products || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadCategoryProducts();
    }, [slug]);

    return (
        <div className="max-w-7xl mx-auto p-4 mt-10">
            <h1 className="text-2xl font-semibold capitalize mb-4">
                {slug.replace(/-/g, " ")}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.length ? (
                    products.map(product => <ProductCard key={product._id} product={product} />)
                ) : (
                    <p>No products found in {slug.replace(/-/g, " ")}.</p>
                )}
            </div>
        </div>
    );
}
