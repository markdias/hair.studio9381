import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, LogOut, Check, Info, Loader2,
    Settings, Scissors, Tag, Image, Plus, Trash2,
    MapPin, Phone, Mail, Clock, User
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Data States
    const [siteSettings, setSiteSettings] = useState({});
    const [services, setServices] = useState([]);
    const [pricing, setPricing] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [
                { data: settings },
                { data: srvs },
                { data: prices },
                { data: stls },
                { data: gly }
            ] = await Promise.all([
                supabase.from('site_settings').select('*'),
                supabase.from('services_overview').select('*'),
                supabase.from('price_list').select('*').order('sort_order'),
                supabase.from('stylist_calendars').select('*'),
                supabase.from('gallery_images').select('*').order('sort_order')
            ]);

            if (settings) {
                const settingsObj = {};
                settings.forEach(s => settingsObj[s.key] = s.value);
                setSiteSettings(settingsObj);
            }

            if (srvs) setServices(srvs);
            if (prices) setPricing(prices);
            if (stls) setStylists(stls);
            if (gly) setGallery(gly);

        } catch (err) {
            console.error('Error fetching data:', err.message);
            setMessage({ type: 'error', text: 'Error loading data. Make sure tables exist.' });
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-stone-800" />
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General Settings', icon: <Settings size={18} /> },
        { id: 'services', label: 'Services', icon: <Scissors size={18} /> },
        { id: 'pricing', label: 'Pricing', icon: <Tag size={18} /> },
        { id: 'team', label: 'Team', icon: <User size={18} /> },
        { id: 'gallery', label: 'Gallery', icon: <Image size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10  rounded-lg flex items-center justify-center" style={{ backgroundColor: "#3D2B1F" }}>
                            <Scissors size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Studio 938</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${activeTab === tab.id
                                ? 'bg-stone-100 text-stone-800 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all text-sm"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <AnimatePresence mode="wait">
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                                    }`}
                            >
                                {message.type === 'success' ? <Check size={18} /> : <Info size={18} />}
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <TabContent
                        activeTab={activeTab}
                        data={{ siteSettings, services, pricing, stylists, gallery }}
                        setData={{ setSiteSettings, setServices, setPricing, setStylists, setGallery }}
                        refresh={fetchAllData}
                        showMessage={showMessage}
                    />
                </div>
            </main>
        </div>
    );
};

const TabContent = ({ activeTab, data, setData, refresh, showMessage }) => {
    switch (activeTab) {
        case 'general': return <GeneralTab settings={data.siteSettings} setSettings={setData.setSiteSettings} showMessage={showMessage} />;
        case 'services': return <ServicesTab services={data.services} refresh={refresh} showMessage={showMessage} />;
        case 'pricing': return <PricingTab pricing={data.pricing} refresh={refresh} showMessage={showMessage} />;
        case 'team': return <TeamTab stylists={data.stylists} refresh={refresh} showMessage={showMessage} />;
        case 'gallery': return <GalleryTab gallery={data.gallery} refresh={refresh} showMessage={showMessage} />;
        default: return null;
    }
};

const ImageUploader = ({ onUpload, folder = 'general', showMessage }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('salon-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('salon-assets')
                .getPublicUrl(filePath);

            onUpload(data.publicUrl);
            showMessage('success', 'Image uploaded successfully!');
        } catch (error) {
            showMessage('error', 'Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:-hover disabled:opacity-50 transition-all" style={{ backgroundColor: "#3D2B1F" }}
            >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
        </div>
    );
};

const GeneralTab = ({ settings, setSettings, showMessage }) => {
    const fields = [
        { key: 'hero_title', label: 'Hero Title', icon: <Info size={16} /> },
        { key: 'hero_subtitle', label: 'Hero Subtitle', icon: <Info size={16} /> },
        { key: 'phone', label: 'Phone Number', icon: <Phone size={16} /> },
        { key: 'whatsapp', label: 'WhatsApp Number', icon: <Phone size={16} /> },
        { key: 'email', label: 'Email Address', icon: <Mail size={16} /> },
        { key: 'address', label: 'Salon Address', icon: <MapPin size={16} /> },
        { key: 'opening_hours', label: 'Opening Hours', icon: <Clock size={16} /> },
    ];

    const handleSave = async (key, value) => {
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key, value });
            if (error) throw error;
            showMessage('success', `${key.replace('_', ' ')} updated!`);
        } catch (err) {
            showMessage('error', err.message);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(field => (
                    <div key={field.key} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                            {field.icon}
                            {field.label}
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={settings[field.key] || ''}
                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <button
                                onClick={() => handleSave(field.key, settings[field.key])}
                                className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:-hover transition-all" style={{ backgroundColor: "#3D2B1F" }}
                            >
                                <Save size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const ServicesTab = ({ services, refresh, showMessage }) => {
    const [localServices, setLocalServices] = useState(services);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({ title: '', description: '' });

    useEffect(() => { setLocalServices(services); }, [services]);

    const handleFieldChange = (idx, field, value) => {
        const updated = [...localServices];
        updated[idx] = { ...updated[idx], [field]: value };
        setLocalServices(updated);
    };

    const handleSave = async (s) => {
        try {
            const { error } = await supabase.from('services_overview').upsert(s);
            if (error) throw error;
            showMessage('success', 'Service updated!');
            refresh();
        } catch (err) { showMessage('error', err.message); }
    };

    const handleAddService = async () => {
        if (!newService.title || !newService.description) {
            showMessage('error', 'Please fill in all fields');
            return;
        }
        try {
            const { error } = await supabase.from('services_overview').insert([newService]);
            if (error) throw error;
            setNewService({ title: '', description: '' });
            setShowAddForm(false);
            refresh();
            showMessage('success', 'Service added!');
        } catch (err) { showMessage('error', err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this service?')) return;
        try {
            const { error } = await supabase.from('services_overview').delete().eq('id', id);
            if (error) throw error;
            showMessage('success', 'Service deleted!');
            refresh();
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Service Highlights</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:-hover transition-all" style={{ backgroundColor: "#3D2B1F" }}
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Service'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-900">New Service</h3>
                    <input
                        placeholder="Service Title"
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                    />
                    <textarea
                        placeholder="Description"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-stone-800 focus:border-transparent"
                    />
                    <button
                        onClick={handleAddService}
                        className="w-full bg-stone-800 text-white font-medium py-3 rounded-lg hover:-hover transition-all flex items-center justify-center gap-2" style={{ backgroundColor: "#3D2B1F" }}
                    >
                        <Plus size={16} /> Create Service
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localServices.map((s, idx) => (
                    <div key={s.id || idx} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-stone-50 rounded-lg flex items-center justify-center text-stone-800">
                                <Scissors size={24} />
                            </div>
                            {s.id && (
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <input
                            placeholder="Service Title"
                            value={s.title}
                            onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                            className="w-full text-lg font-semibold border-none p-0 focus:ring-0 outline-none"
                        />
                        <textarea
                            placeholder="Description"
                            value={s.description || s.desc || ''}
                            onChange={(e) => handleFieldChange(idx, 'description', e.target.value)}
                            className="w-full text-gray-600 text-sm h-32 resize-none border-none p-0 focus:ring-0 outline-none"
                        />
                        <button
                            onClick={() => handleSave(s)}
                            className="w-full bg-stone-800 text-white font-medium py-3 rounded-lg hover:-hover transition-all flex items-center justify-center gap-2" style={{ backgroundColor: "#3D2B1F" }}
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const PricingTab = ({ pricing, refresh, showMessage }) => {
    const [newItem, setNewItem] = useState({ category: 'CUT & STYLING', item_name: '', price: '' });

    const handleAdd = async () => {
        if (!newItem.item_name || !newItem.price) {
            showMessage('error', 'Please fill in all fields');
            return;
        }
        try {
            const { error } = await supabase.from('price_list').insert([newItem]);
            if (error) throw error;
            setNewItem({ ...newItem, item_name: '', price: '' });
            refresh();
            showMessage('success', 'Added to price list');
        } catch (err) { showMessage('error', err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        try {
            await supabase.from('price_list').delete().eq('id', id);
            refresh();
            showMessage('success', 'Item removed');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Price List</h2>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Add New Service</h3>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option>CUT & STYLING</option>
                        <option>COLOURING</option>
                        <option>HAIR TREATMENTS</option>
                        <option>HAIR EXTENSIONS</option>
                        <option>MAKE UP</option>
                    </select>
                    <input
                        placeholder="Service Name"
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <input
                        placeholder="£50"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:-hover transition-all flex items-center gap-2" style={{ backgroundColor: "#3D2B1F" }}
                    >
                        <Plus size={18} /> Add
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {pricing.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
                            <p className="text-gray-900 font-medium">{item.item_name} <span className="text-stone-800 font-semibold ml-2">{item.price}</span></p>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const TeamTab = ({ stylists, refresh, showMessage }) => {
    const [localStylists, setLocalStylists] = useState(stylists);
    const [showHelp, setShowHelp] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newStylist, setNewStylist] = useState({ stylist_name: '', role: '', description: '', calendar_id: '', image_url: '' });

    useEffect(() => { setLocalStylists(stylists); }, [stylists]);

    const handleFieldChange = (idx, field, value) => {
        const updated = [...localStylists];
        updated[idx] = { ...updated[idx], [field]: value };
        setLocalStylists(updated);
    };

    const handleSave = async (s) => {
        try {
            const { error } = await supabase.from('stylist_calendars').upsert(s);
            if (error) throw error;
            showMessage('success', `Stylist ${s.stylist_name} updated!`);
            refresh();
        } catch (err) { showMessage('error', err.message); }
    };

    const handleAdd = async () => {
        if (!newStylist.stylist_name) return showMessage('error', 'Stylist name is required');
        try {
            const { error } = await supabase.from('stylist_calendars').insert([newStylist]);
            if (error) throw error;
            setNewStylist({ stylist_name: '', role: '', description: '', calendar_id: '', image_url: '' });
            setIsAdding(false);
            refresh();
            showMessage('success', 'New stylist added!');
        } catch (err) { showMessage('error', err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this stylist?')) return;
        try {
            const { error } = await supabase.from('stylist_calendars').delete().eq('id', id);
            if (error) throw error;
            refresh();
            showMessage('success', 'Stylist removed');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        title="Calendar Setup Help"
                    >
                        <Info size={20} />
                    </button>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:-hover transition-all" style={{ backgroundColor: "#3D2B1F" }}
                >
                    <Plus size={18} /> Add Stylist
                </button>
            </div>

            {showHelp && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <Info size={18} />
                        How to Set Up Google Calendar for a Stylist
                    </h3>
                    <div className="text-sm text-amber-900 space-y-3">
                        <div>
                            <p className="font-medium mb-1">1. Create or Access the Stylist's Google Calendar</p>
                            <p className="text-amber-800 ml-4">Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="underline">calendar.google.com</a> and create a new calendar for the stylist or use an existing one.</p>
                        </div>
                        <div>
                            <p className="font-medium mb-1">2. Share the Calendar</p>
                            <ul className="text-amber-800 ml-4 list-disc list-inside space-y-1">
                                <li>Click the three dots next to the calendar name</li>
                                <li>Select "Settings and sharing"</li>
                                <li>Scroll to "Share with specific people"</li>
                                <li>Add your service account email with <strong>"Make changes to events"</strong> permission</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium mb-1">3. Get the Calendar ID</p>
                            <ul className="text-amber-800 ml-4 list-disc list-inside space-y-1">
                                <li>In Calendar Settings, scroll to "Integrate calendar"</li>
                                <li>Copy the <strong>Calendar ID</strong> (looks like: example@group.calendar.google.com)</li>
                                <li>Paste it into the "Calendar ID" field below</li>
                            </ul>
                        </div>
                        <div className="bg-amber-100 p-3 rounded mt-3">
                            <p className="font-medium text-amber-900">Required Permissions:</p>
                            <p className="text-amber-800 text-xs mt-1">The service account needs "Make changes to events" permission to create and manage bookings.</p>
                        </div>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">New Stylist</h3>
                    <div className="flex items-center gap-4">
                        <ImageUploader
                            folder="team"
                            onUpload={(url) => setNewStylist({ ...newStylist, image_url: url })}
                            showMessage={showMessage}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={newStylist.stylist_name} onChange={e => setNewStylist({ ...newStylist, stylist_name: e.target.value })} placeholder="Name" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none" />
                        <input value={newStylist.role} onChange={e => setNewStylist({ ...newStylist, role: e.target.value })} placeholder="Role" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none" />
                    </div>
                    <input
                        value={newStylist.calendar_id}
                        onChange={e => setNewStylist({ ...newStylist, calendar_id: e.target.value })}
                        placeholder="Google Calendar ID (e.g., example@group.calendar.google.com)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none text-sm"
                    />
                    <textarea
                        value={newStylist.description}
                        onChange={e => setNewStylist({ ...newStylist, description: e.target.value })}
                        placeholder="Bio"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none"
                    />
                    <div className="flex gap-4">
                        <button onClick={handleAdd} className="flex-grow bg-stone-800 text-white py-2 rounded-lg hover:-hover transition-all" style={{ backgroundColor: "#3D2B1F" }}>Create Stylist</button>
                        <button onClick={() => setIsAdding(false)} className="px-8 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localStylists.map((s, idx) => (
                    <div key={s.id || idx} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0 relative group">
                                <img src={s.image_url || '/placeholder.png'} className="w-full h-full object-cover" alt={s.stylist_name} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageUploader
                                        folder="team"
                                        onUpload={(url) => handleFieldChange(idx, 'image_url', url)}
                                        showMessage={showMessage}
                                    />
                                </div>
                            </div>
                            <div className="flex-grow space-y-2">
                                <input value={s.stylist_name} onChange={(e) => handleFieldChange(idx, 'stylist_name', e.target.value)} className="w-full text-lg font-semibold border-none p-0 focus:ring-0 outline-none" />
                                <input value={s.role || ''} placeholder="Role" onChange={(e) => handleFieldChange(idx, 'role', e.target.value)} className="w-full text-sm text-gray-600 border-none p-0 focus:ring-0 outline-none" />
                            </div>
                        </div>
                        <input
                            value={s.calendar_id || ''}
                            onChange={(e) => handleFieldChange(idx, 'calendar_id', e.target.value)}
                            placeholder="Calendar ID"
                            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none font-mono text-gray-700"
                        />
                        <textarea value={s.description || ''} onChange={(e) => handleFieldChange(idx, 'description', e.target.value)} placeholder="Bio" className="w-full text-sm text-gray-600 h-20 resize-none border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none" />
                        <div className="flex gap-2">
                            <button onClick={() => handleSave(s)} className="flex-grow bg-stone-800 text-white py-2 rounded-lg hover:-hover transition-all" style={{ backgroundColor: "#3D2B1F" }}>Save</button>
                            <button onClick={() => handleDelete(s.id)} className="px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const GalleryTab = ({ gallery, refresh, showMessage }) => {
    const handleDelete = async (id) => {
        if (!confirm('Remove this image?')) return;
        try {
            await supabase.from('gallery_images').delete().eq('id', id);
            refresh();
            showMessage('success', 'Image removed');
        } catch (err) { showMessage('error', err.message); }
    };

    const handleAdd = async (url) => {
        try {
            const { error } = await supabase.from('gallery_images').insert([{ image_url: url, sort_order: gallery.length }]);
            if (error) throw error;
            refresh();
            showMessage('success', 'Image added to gallery');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Gallery</h2>
                <ImageUploader folder="gallery" onUpload={handleAdd} showMessage={showMessage} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
