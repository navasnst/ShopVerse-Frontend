import React, { useEffect, useState } from 'react';
import { sellerApi } from '../../hooks/useSellerApi';


export default function StoreProfile() {
    const [profile, setProfile] = useState({});
    useEffect(() => { sellerApi.profile().then(r => setProfile(r.data.profile || {})).catch(console.error); }, []);
    function handleChange(e) { setProfile({ ...profile, [e.target.name]: e.target.value }); }
    async function save() { await sellerApi.profileUpdate(profile); alert('Saved'); }
    return (
        <div className="bg-white p-4 rounded shadow space-y-2">
            <input name="name" value={profile.name || ''} onChange={handleChange} className="border p-2 w-full" placeholder="Store name" />
            <textarea name="about" value={profile.about || ''} onChange={handleChange} className="border p-2 w-full" placeholder="About" />
            <input name="email" value={profile.email || ''} onChange={handleChange} className="border p-2 w-full" placeholder="Email" />
            <input name="phone" value={profile.phone || ''} onChange={handleChange} className="border p-2 w-full" placeholder="Phone" />
            <input name="address" value={profile.address || ''} onChange={handleChange} className="border p-2 w-full" placeholder="Address" />
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save changes</button>
        </div>
    );
}