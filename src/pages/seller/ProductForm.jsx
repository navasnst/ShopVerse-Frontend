
import React, { useState } from "react";
import api from "../../api/axios"; // your axios instance pointed at VITE_API_URL

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn("Cloudinary env vars missing: VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET");
}

// ⭐ Unsplash API key
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";

export default function ProductForm() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    vendorName: "",
    images: [],
    offerPrice: "",
    offerEndDate: "",

  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});

  // ⭐ Suggested image state
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  // ⭐ Fetch suggested images from Unsplash
  const getSuggestedImage = async () => {
    const title = (formData.title || "").trim();
    if (!title) {
      alert("Please enter product title first!");
      return;
    }
    if (!UNSPLASH_KEY) {
      alert("Unsplash API key missing in VITE_UNSPLASH_ACCESS_KEY");
      return;
    }

    try {
      setSuggestLoading(true);
      const q = encodeURIComponent(title);
      const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=6&client_id=${UNSPLASH_KEY}`;

      const res = await fetch(url);
      if (!res.ok) {
        alert("Error fetching images from Unsplash");
        setSuggestLoading(false);
        return;
      }

      const data = await res.json();
      if (!data.results?.length) {
        alert("No matching images found.");
        setSuggestedImages([]);
        setSuggestLoading(false);
        return;
      }

      const urls = data.results.map((r) => r.urls.small);
      setSuggestedImages(urls);
    } catch (err) {
      console.error("Unsplash error:", err);
      alert("Unsplash error — see console");
    } finally {
      setSuggestLoading(false);
    }
  };

  // ⭐ Add suggested image to formData.images
  const useSuggestedImage = (url) => {
    setFormData((f) => ({ ...f, images: [...f.images, url] }));
    setSuggestedImages([]);
  };

  // Select local files
  const handleSelectFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles((s) => [...s, ...files]);
  };

  // Remove local file
  const removeSelectedFile = (idx) => {
    setSelectedFiles((s) => s.filter((_, i) => i !== idx));
  };

  // Cloudinary Upload
  const uploadToCloudinary = async () => {
    if (!selectedFiles.length) return [];
    setUploading(true);
    const uploadedUrls = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      fd.append("folder", "your_app_products");

      try {
        const xhr = new XMLHttpRequest();
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

        const promise = new Promise((resolve, reject) => {
          xhr.open("POST", url);

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded * 100) / e.total);
              setProgress((p) => ({ ...p, [i]: percent }));
            }
          });

          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                const resp = JSON.parse(xhr.responseText);
                resolve(resp);
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          };

          xhr.send(fd);
        });

        const resp = await promise;
        uploadedUrls.push(resp.secure_url);
      } catch (err) {
        console.error("Cloudinary upload error", err);
      }
    }

    setUploading(false);
    setProgress({});
    setFormData((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    setSelectedFiles([]);
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFiles.length) {
        await uploadToCloudinary();
      }

      const payload = {
        title: formData.title,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        stock: formData.stock,
        vendorName: formData.vendorName,
        images: formData.images,
        offerPrice: formData.offerPrice || null,
        offerEndDate: formData.offerEndDate || null,

      };

      const res = await api.post("/products/add-product", payload);

      if (res.data.success) {
        alert("✅ Product created");
        setFormData({ title: "", price: "", category: "", description: "", stock: "", images: [] });
        setSelectedFiles([]);
      } else {
        alert("Failed to create product");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
  };

  // Remove uploaded Cloudinary or suggested image
  const removeUploadedImage = (idx) => {
    setFormData((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} name="title" placeholder="Title" className="w-full border p-2 rounded" required />

        <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} type="number" name="price" placeholder="Price" className="w-full border p-2 rounded" required />

        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="mobiles">Mobiles & Tablets</option>
          <option value="tv-appliances">TV & Appliances</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home-kitchen">Home & Kitchen</option>
          <option value="beauty-toys">Beauty & Toys</option>
          <option value="furniture">Furniture</option>
        </select>

        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} name="description" placeholder="Description" className="w-full border p-2 rounded" />
        <input value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} type="number" name="stock" placeholder="Stock" className="w-full border p-2 rounded" />

        <input
          value={formData.vendorName}
          onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
          name="vendorName"
          placeholder="Vendor / Store Name"
          className="w-full border p-2 rounded"
          required
        />

        {/* OFFER PRICE */}

        <input
          value={formData.offerPrice ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, offerPrice: e.target.value })
          }
          type="number"
          placeholder="Offer Price (optional)"
          className="w-full border p-2 rounded"
        />

        {/* OFFER END DATE */}
        <label className="text-sm font-medium">Offer Ends On</label>
        <input
          type="datetime-local"
          value={formData.offerEndDate ?? ""}
          onChange={(e) =>
            setFormData({ ...formData, offerEndDate: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        {/* ⭐ Suggest Images Button */}
        <button
          type="button"
          onClick={getSuggestedImage}
          className="bg-purple-600 text-white px-3 py-2 rounded"
          disabled={suggestLoading}
        >
          {suggestLoading ? "Searching..." : "Suggest Images from Title"}
        </button>

        {/* ⭐ Suggested Images */}
        {suggestedImages.length > 0 && (
          <div className="mt-2">
            <div className="text-sm mb-1">Suggested images — click to use</div>
            <div className="flex flex-wrap gap-2">
              {suggestedImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-24 h-24 object-cover rounded cursor-pointer border"
                  onClick={() => useSuggestedImage(url)}
                />
              ))}
            </div>
          </div>
        )}

        <label className="font-medium">Choose images (select files)</label>
        <input type="file" multiple accept="image/*" onChange={handleSelectFiles} className="w-full" />

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedFiles.map((f, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(f)} alt="sel" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeSelectedFile(i)} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded">X</button>
                {uploading && progress[i] !== undefined && <div className="text-xs mt-1">{progress[i]}%</div>}
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={uploadToCloudinary} disabled={!selectedFiles.length || uploading} className="bg-blue-600 text-white px-3 py-1 rounded">
          {uploading ? "Uploading..." : "Upload Selected to Cloud"}
        </button>

        {/* Uploaded Cloudinary / Suggested Images */}
        {formData.images.length > 0 && (
          <div className="mt-2">
            <div className="text-sm mb-1">Images to be saved</div>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-24 h-24 object-cover rounded border" />
                  <button type="button" onClick={() => removeUploadedImage(i)} className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded">X</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual URL */}
        <div className="mt-4">
          <label className="text-sm block mb-1">Or paste image URL</label>
          <ImageUrlAdder onAdd={(url) => setFormData((f) => ({ ...f, images: [...f.images, url] }))} />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Add Product</button>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => window.location.href = "/seller/my-products"}
          className="bg-gray-700 text-white px-4 py-2 rounded w-full"
        >
          My Products
        </button>

      </div>

    </div>

  );
}

// URL adder
function ImageUrlAdder({ onAdd }) {
  const [val, setVal] = useState("");
  const add = () => {
    if (!val.trim()) return;
    onAdd(val.trim());
    setVal("");
  };
  return (
    <div className="flex gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://..." className="border p-2 rounded flex-1" />
      <button type="button" onClick={add} className="bg-blue-600 text-white px-3 py-1 rounded">Add URL</button>
    </div>
  );
}


