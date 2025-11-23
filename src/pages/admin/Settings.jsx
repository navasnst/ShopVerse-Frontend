import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

export default function Settings() {
    const [settings, setSettings] = useState({
        platformName: "",
        taxRate: 0,
        commissionRate: 0,
        shippingCharge: 0,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const res = await api.get("/admin/settings");
        setSettings(res.data.settings || {});
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await api.put("/admin/settings", settings);
        alert("Settings saved successfully!");
    };

    return (
        <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold mb-4">Site Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Platform Name</label>
                    <input
                        name="platformName"
                        value={settings.platformName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Tax Rate (%)</label>
                    <input
                        name="taxRate"
                        type="number"
                        value={settings.taxRate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Commission Rate (%)</label>
                    <input
                        name="commissionRate"
                        type="number"
                        value={settings.commissionRate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Shipping Charge</label>
                    <input
                        name="shippingCharge"
                        type="number"
                        value={settings.shippingCharge}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
            </div>
            <button
                onClick={handleSave}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Save Settings
            </button>
        </motion.div>
    );
}
