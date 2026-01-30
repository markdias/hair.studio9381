import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, LogOut, Check, Calendar, User, Info, Loader2,
    Settings, Scissors, Tag, Image, Plus, Trash2, ChevronRight,
    MapPin, Phone, Mail, Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

            // Transform settings array to object
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
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-white/20">
                    <Loader2 size={40} />
                </motion.div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: <Settings size={18} /> },
        { id: 'services', label: 'Services', icon: <Scissors size={18} /> },
        { id: 'pricing', label: 'Pricing', icon: <Tag size={18} /> },
        { id: 'team', label: 'Team', icon: <User size={18} /> },
        { id: 'gallery', label: 'Gallery', icon: <Image size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white/5 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col">
                <div className="mb-12">
                    <h1 className="text-2xl font-light tracking-widest text-white">ADMIN</h1>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mt-1">Salon Management</p>
                </div>

                <nav className="flex-grow space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm tracking-wide ${activeTab === tab.id
                                ? 'bg-white text-black font-semibold'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-12 flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest"
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-12 overflow-y-auto flex justify-center">
                <div className="w-full max-w-7xl">
                    <AnimatePresence mode="wait">
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
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
        <div className="relative group">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] tracking-widest uppercase font-bold transition-all ${uploading ? 'opacity-50' : 'hover:bg-white hover:text-black group-hover:scale-105'}`}>
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Image size={12} />}
                {uploading ? 'UPDATING...' : 'UPLOAD NEW'}
            </div>
        </div>
    );
};

const GeneralTab = ({ settings, setSettings, showMessage }) => {
    const fields = [
        { key: 'hero_title', label: 'Hero Title', icon: <Info size={16} /> },
        { id: 'hero_p', key: 'hero_subtitle', label: 'Hero Subtitle', icon: <Info size={16} /> },
        { key: 'phone', label: 'Phone Number', icon: <Phone size={16} /> },
        { key: 'whatsapp', label: 'WhatsApp Number', icon: <Mail size={16} /> },
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
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-light mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map(field => (
                    <div key={field.key} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4 hover:bg-white/[0.07] transition-all duration-500">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1 flex items-center gap-2">
                            {field.icon}
                            {field.label}
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={settings[field.key] || ''}
                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 focus:border-white/30 transition-all placeholder:text-white/20"
                            />
                            <button
                                onClick={() => handleSave(field.key, settings[field.key])}
                                className="bg-white text-black w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all"
                            >
                                <Save size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const MasterDetailLayout = ({ title, items, renderItem, renderDetail, onAdd, activeId, onSelect }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-3xl font-light bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">{title}</h2>
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl text-xs tracking-widest uppercase hover:bg-white/90 transition-all"
                    >
                        <Plus size={16} /> ADD NEW
                    </button>
                )}
            </div>

            <div className="flex-grow flex gap-6 overflow-hidden">
                {/* Left Panel: List */}
                <div className="w-1/3 min-w-[300px] flex flex-col gap-3 overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div
                            key={item.id || idx}
                            onClick={() => onSelect(item)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${activeId === (item.id || idx)
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {renderItem(item)}
                            </div>
                            <ChevronRight size={16} className={`transition-transform ${activeId === (item.id || idx) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-white/20 text-center py-12 italic text-sm">No items found</div>
                    )}
                </div>

                {/* Right Panel: Detail Form */}
                <div className="flex-grow bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-y-auto">
                    {activeId !== null && renderDetail ? (
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {renderDetail()}
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                            <Info size={48} strokeWidth={1} />
                            <p className="tracking-widest text-xs uppercase">Select an item to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ServicesTab = ({ services, refresh, showMessage }) => {
    const [localServices, setLocalServices] = useState(services);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        setLocalServices(services);
        if (services.length > 0 && !selectedService) setSelectedService(services[0]);
    }, [services]);

    const handleFieldChange = (field, value) => {
        if (!selectedService) return;
        const updated = { ...selectedService, [field]: value };
        setSelectedService(updated);

        // Update local list instantly for preview
        setLocalServices(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const handleSave = async () => {
        if (!selectedService) return;
        try {
            const { error } = await supabase.from('services_overview').upsert(selectedService);
            if (error) throw error;
            showMessage('success', 'Service updated!');
            refresh();
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <MasterDetailLayout
            title="Service Highlights"
            items={localServices}
            activeId={selectedService?.id}
            onSelect={setSelectedService}
            renderItem={(item) => (
                <>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedService?.id === item.id ? 'bg-black/10 border-black/10 text-black' : 'bg-white/10 border-white/10'}`}>
                        <Scissors size={18} />
                    </div>
                    <span className="font-medium tracking-wide text-sm">{item.title || 'Untitled Service'}</span>
                </>
            )}
            renderDetail={() => selectedService && (
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Title</label>
                        <input
                            value={selectedService.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xl font-medium text-white focus:border-white/30 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Description</label>
                        <textarea
                            value={selectedService.description || selectedService.desc || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 h-48 resize-none focus:border-white/30 outline-none transition-all leading-relaxed"
                        />
                    </div>

                    <div className="pt-8 flex justify-end">
                        <button onClick={handleSave} className="bg-white text-black font-bold py-4 px-12 rounded-2xl flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all text-xs tracking-widest uppercase">
                            <Save size={16} /> SAVE CHANGES
                        </button>
                    </div>
                </div>
            )}
        />
    );
};

const PricingTab = ({ pricing, refresh, showMessage }) => {
    const [localPricing, setLocalPricing] = useState(pricing);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => { setLocalPricing(pricing); }, [pricing]);

    const handleFieldChange = (field, value) => {
        if (!selectedItem) return;
        const updated = { ...selectedItem, [field]: value };
        setSelectedItem(updated);
        setLocalPricing(prev => prev.map(p => p.id === updated.id ? updated : p));
    };

    const handleSave = async () => {
        if (!selectedItem) return;
        try {
            // Remove 'id' if it's new/temp to allow auto-increment/UUID generation if needed, 
            // BUT Supabase usually needs ID for updates.
            // If ID is 'new', we remove it.
            const { id, ...toSave } = selectedItem;

            let error;
            if (id === 'new') {
                const { error: insertError } = await supabase.from('price_list').insert([toSave]);
                error = insertError;
            } else {
                const { error: updateError } = await supabase.from('price_list').upsert(selectedItem);
                error = updateError;
            }

            if (error) throw error;
            showMessage('success', 'Price list updated!');
            refresh();
            setSelectedItem(null); // Deselect or perhaps fetch new ID? Refresh will reload list.
        } catch (err) { showMessage('error', err.message); }
    };

    const handleAdd = () => {
        const newItem = { id: 'new', category: 'CUT & STYLING', item_name: 'New Service', price: '£0' };
        setLocalPricing([newItem, ...localPricing]);
        setSelectedItem(newItem);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        if (selectedItem.id === 'new') {
            setLocalPricing(prev => prev.filter(p => p.id !== 'new'));
            setSelectedItem(null);
            return;
        }
        if (!confirm('Are you sure you want to remove this item?')) return;
        try {
            await supabase.from('price_list').delete().eq('id', selectedItem.id);
            refresh();
            setSelectedItem(null);
            showMessage('success', 'Item removed');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <MasterDetailLayout
            title="Price List"
            items={localPricing}
            activeId={selectedItem?.id}
            onSelect={setSelectedItem}
            onAdd={handleAdd}
            renderItem={(item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{item.item_name}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.category}</span>
                </div>
            )}
            renderDetail={() => selectedItem && (
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Category</label>
                            <select
                                value={selectedItem.category}
                                onChange={(e) => handleFieldChange('category', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                            >
                                <option>CUT & STYLING</option>
                                <option>COLOURING</option>
                                <option>HAIR TREATMENTS</option>
                                <option>HAIR EXTENSIONS</option>
                                <option>MAKE UP</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Price</label>
                            <input
                                value={selectedItem.price}
                                onChange={(e) => handleFieldChange('price', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 focus:border-white/30 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Service Name</label>
                        <input
                            value={selectedItem.item_name}
                            onChange={(e) => handleFieldChange('item_name', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xl font-medium text-white focus:border-white/30 outline-none"
                        />
                    </div>

                    <div className="pt-8 flex justify-between items-center">
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all">
                            Delete Item
                        </button>
                        <button onClick={handleSave} className="bg-white text-black font-bold py-4 px-12 rounded-2xl flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all text-xs tracking-widest uppercase">
                            <Save size={16} /> SAVE CHANGES
                        </button>
                    </div>
                </div>
            )}
        />
    );
};

const TeamTab = ({ stylists, refresh, showMessage }) => {
    const [localStylists, setLocalStylists] = useState(stylists);
    const [selectedStylist, setSelectedStylist] = useState(null);

    useEffect(() => { setLocalStylists(stylists); }, [stylists]);

    const handleFieldChange = (field, value) => {
        if (!selectedStylist) return;
        const updated = { ...selectedStylist, [field]: value };
        setSelectedStylist(updated);
        setLocalStylists(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const handleSave = async () => {
        if (!selectedStylist) return;
        try {
            const { id, ...toSave } = selectedStylist;
            let error;
            if (id === 'new') {
                const { error: insertError } = await supabase.from('stylist_calendars').insert([toSave]);
                error = insertError;
            } else {
                const { error: updateError } = await supabase.from('stylist_calendars').upsert(selectedStylist);
                error = updateError;
            }

            if (error) throw error;
            showMessage('success', `Stylist ${selectedStylist.stylist_name} updated!`);
            refresh();
            // Keep selected if update, deselect/refresh if insert? 
            // Refresh will clobber local state, so let's deselect to be safe.
            setSelectedStylist(null);
        } catch (err) { showMessage('error', err.message); }
    };

    const handleAdd = () => {
        const newStylist = { id: 'new', stylist_name: 'New Stylist', role: 'Stylist', description: '', calendar_id: '', image_url: '' };
        setLocalStylists([newStylist, ...localStylists]);
        setSelectedStylist(newStylist);
    };

    const handleDelete = async () => {
        if (!selectedStylist) return;
        if (selectedStylist.id === 'new') {
            setLocalStylists(prev => prev.filter(s => s.id !== 'new'));
            setSelectedStylist(null);
            return;
        }
        if (!confirm('Are you sure you want to delete this stylist?')) return;
        try {
            await supabase.from('stylist_calendars').delete().eq('id', selectedStylist.id);
            refresh();
            setSelectedStylist(null);
            showMessage('success', 'Stylist removed');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <MasterDetailLayout
            title="Team Members"
            items={localStylists}
            activeId={selectedStylist?.id}
            onSelect={setSelectedStylist}
            onAdd={handleAdd}
            renderItem={(s) => (
                <>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black/40 shrink-0">
                        <img src={s.image_url || '/placeholder.png'} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{s.stylist_name}</span>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">{s.role}</span>
                    </div>
                </>
            )}
            renderDetail={() => selectedStylist && (
                <div className="space-y-8 max-w-2xl mx-auto py-4">
                    <div className="flex items-start gap-8">
                        <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 bg-black/40 shrink-0 relative group">
                            <img src={selectedStylist.image_url || '/placeholder.png'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageUploader
                                    folder="team"
                                    onUpload={(url) => handleFieldChange('image_url', url)}
                                    showMessage={showMessage}
                                />
                            </div>
                        </div>
                        <div className="flex-grow space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Name</label>
                                <input value={selectedStylist.stylist_name} onChange={(e) => handleFieldChange('stylist_name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 focus:border-white/30 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Role</label>
                                <input value={selectedStylist.role || ''} placeholder="e.g. Master Stylist" onChange={(e) => handleFieldChange('role', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 italic font-light focus:border-white/30 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Calendar ID</label>
                        <input value={selectedStylist.calendar_id || ''} onChange={(e) => handleFieldChange('calendar_id', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/40 text-xs focus:border-white/30 outline-none font-mono" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-1">Bio</label>
                        <textarea value={selectedStylist.description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/60 h-32 resize-none focus:ring-0 leading-relaxed text-sm focus:border-white/30 outline-none" />
                    </div>

                    <div className="pt-8 flex justify-between items-center">
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-500/10 rounded-lg transition-all">
                            Delete Stylist
                        </button>
                        <button onClick={handleSave} className="bg-white text-black font-bold py-4 px-12 rounded-2xl flex items-center gap-3 hover:bg-white/90 active:scale-95 transition-all text-xs tracking-widest uppercase">
                            <Save size={16} /> SAVE CHANGES
                        </button>
                    </div>
                </div>
            )}
        />
    );
};

const GalleryTab = ({ gallery, refresh, showMessage }) => {
    const [newUrl, setNewUrl] = useState('');

    const handleAdd = async (url) => {
        const targetUrl = url || newUrl;
        if (!targetUrl) return;
        try {
            await supabase.from('gallery_images').insert([{ image_url: targetUrl, sort_order: gallery.length }]);
            setNewUrl('');
            refresh();
            showMessage('success', 'Image added to gallery');
        } catch (err) { showMessage('error', err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this image?')) return;
        try {
            await supabase.from('gallery_images').delete().eq('id', id);
            refresh();
            showMessage('success', 'Image removed');
        } catch (err) { showMessage('error', err.message); }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-light mb-8 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">Gallery Carousel</h2>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-6 hover:bg-white/[0.07] transition-all duration-500">
                <div className="flex-grow flex gap-4">
                    <input
                        placeholder="Paste Image URL"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white/80 focus:border-white/30 transition-all placeholder:text-white/20 outline-none"
                    />
                    <button onClick={() => handleAdd()} className="bg-white text-black h-[58px] px-8 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all text-xs font-bold uppercase tracking-widest">
                        <Plus size={20} /> ADD
                    </button>
                </div>
                <div className="hidden md:block w-px h-14 bg-white/10"></div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Or upload:</span>
                    <ImageUploader
                        folder="gallery"
                        onUpload={(url) => handleAdd(url)}
                        showMessage={showMessage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6">
                {gallery.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                        <img src={img.image_url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                            <button onClick={() => handleDelete(img.id)} className="bg-red-500 text-white p-4 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl">
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
