
import React from 'react';

export default function SortDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
      <option value="latest">Sort by: Latest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
