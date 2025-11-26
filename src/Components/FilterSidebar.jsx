
import React, { useState } from 'react';

const categories = [
  'Mobiles & Tablets',
  'TVs & Appliances',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Toys',
  'Furniture',
];

export default function FilterSidebar({ filters, setFilters }) {
  const [local, setLocal] = useState(filters);

  const apply = () => setFilters(local);
  const reset = () => {
    const empty = { category: '', minPrice: '', maxPrice: '', brand: '', vendor: '', rating: '', q: '' };
    setLocal(empty);
    setFilters(empty);
  };

  return (
    <div className="space-y-4 border rounded p-4">
      <div>
        <h4 className="font-semibold">Search</h4>
        <input value={local.q || ''} onChange={(e) => setLocal({ ...local, q: e.target.value })} placeholder="Search products" className="input" />
      </div>

      {/* <div>
        <h4 className="font-semibold">Category</h4>
        <select value={local.category || ''} onChange={(e) => setLocal({ ...local, category: e.target.value })} className="input">
          <option value="">All</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div> */}

      <div className="w-full">
        <h4 className="font-semibold mb-1">Price range (₹)</h4>

        <div className="flex items-center gap-2 w-full">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice || ''}
            onChange={(e) => setLocal({ ...local, minPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          />

          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice || ''}
            onChange={(e) => setLocal({ ...local, maxPrice: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* <div>
        <h4 className="font-semibold">Brand</h4>
        <input value={local.brand || ''} onChange={(e) => setLocal({ ...local, brand: e.target.value })} placeholder="Brand" className="input" />
      </div> */}

      {/* <div>
        <h4 className="font-semibold">Vendor</h4>
        <input value={local.vendor || ''} onChange={(e) => setLocal({ ...local, vendor: e.target.value })} placeholder="Vendor id or name" className="input" />
      </div> */}

      <div>
        <h4 className="font-semibold">Rating</h4>
        <select value={local.rating || ''} onChange={(e) => setLocal({ ...local, rating: e.target.value })} className="input">
          <option value="">All</option>
          <option value="4">4 & up</option>
          <option value="3">3 & up</option>
          <option value="2">2 & up</option>
          <option value="1">1 & up</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={apply} className="btn">Apply</button>
        <button onClick={reset} className="btn btn-ghost">Reset</button>
      </div>
    </div>
  );
}
