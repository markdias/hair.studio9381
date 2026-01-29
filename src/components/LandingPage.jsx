import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone, Calendar } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            padding: isScrolled ? '15px 50px' : '30px 50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            backgroundColor: isScrolled ? 'rgba(61, 43, 31, 0.95)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            transition: 'all 0.4s ease',
            color: isScrolled ? '#EAE0D5' : '#FFFFFF',
            boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    fontFamily: 'Playfair Display, serif'
                }}>
                    938 <span style={{ fontWeight: '300', fontSize: '1rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Studio</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', fontWeight: '500' }}>
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#gallery">Gallery</a>
                <a href="#contact">Contact</a>
                <button className="btn-primary" style={{
                    padding: '10px 24px',
                    backgroundColor: isScrolled ? '#EAE0D5' : '#3D2B1F',
                    color: isScrolled ? '#3D2B1F' : '#EAE0D5',
                }}>
                    Book Now
                </button>
            </div>
        </nav>
    );
};

const Hero = () => {
    return (
        <section id="home" style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            backgroundImage: 'url("/salon_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(61, 43, 31, 0.6))',
                zIndex: 1
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '800px',
                    padding: '0 20px'
                }}
            >
                <h1 style={{ fontSize: '5rem', marginBottom: '1rem', lineHeight: '1' }}>Where Hair Dreams Come True</h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', letterSpacing: '2px', fontWeight: '300', opacity: 0.9 }}>
                    Luxury hair styling and bespoke treatments at 938 High Road.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button className="btn-primary">Our Services</button>
                    <button style={{
                        border: '1px solid #FFFFFF',
                        color: '#FFFFFF',
                        padding: '12px 32px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontWeight: '600'
                    }}>
                        Follow Us
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

const Services = () => {
    const services = [
        { title: "Hair Magic", desc: "Expert coloring and transformations tailored to you.", icon: <Calendar style={{ color: '#3D2B1F' }} /> },
        { title: "Salon Life", desc: "A premium experience in every detail of your visit.", icon: <MapPin style={{ color: '#3D2B1F' }} /> },
        { title: "Bespoke Styling", desc: "Crafting the perfect look for your unique identity.", icon: <Phone style={{ color: '#3D2B1F' }} /> }
    ];

    return (
        <section id="services" style={{ padding: '120px 50px', backgroundColor: '#FFFFFF' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h2 style={{ fontSize: '3rem', color: '#3D2B1F', marginBottom: '15px' }}>Our Services</h2>
                <div style={{ width: '60px', height: '2px', backgroundColor: '#3D2B1F', margin: '0 auto' }}></div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -10 }}
                        style={{
                            padding: '50px 40px',
                            backgroundColor: '#F5F1ED',
                            borderRadius: '8px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
                            {service.icon}
                        </div>
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#3D2B1F' }}>{service.title}</h3>
                        <p style={{ color: '#666', lineHeight: '1.8' }}>{service.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const PriceList = () => {
    const categories = [
        {
            title: "CUT & STYLING",
            items: [
                { name: "Wash cut & blowdry", price: "£50" },
                { name: "Wash & cut", price: "£30-£35" },
                { name: "Wash & blowdry", price: "£25-35" },
                { name: "Styling (flat iron/curls)", price: "£20" },
                { name: "Hair Up", price: "From £60" }
            ]
        },
        {
            title: "COLOURING",
            items: [
                { name: "T-section highlights", price: "£50" },
                { name: "Half head highlights", price: "£75" },
                { name: "Full head highlights", price: "£95" },
                { name: "Full head of baby lights", price: "£120" },
                { name: "Balyage", price: "£180-£225" },
                { name: "Full head tint", price: "From £70" },
                { name: "Root tint", price: "From £50" },
                { name: "Toner", price: "£25" }
            ]
        },
        {
            title: "HAIR TREATMENTS",
            items: [
                { name: "Keratin blowdry", price: "£140-£150" },
                { name: "Hair Botox", price: "£35" },
                { name: "Olaplex", price: "£25" }
            ]
        },
        {
            title: "HAIR EXTENSIONS",
            items: [
                { name: "Hair extensions on consultation", price: "£0" },
                { name: "Extensions maintenance", price: "£100-150" }
            ]
        },
        {
            title: "MAKE UP",
            items: [
                { name: "Natural make up", price: "£55" },
                { name: "Full glam make up", price: "£65" },
                { name: "Wedding make up packages available", price: "" }
            ]
        }
    ];

    return (
        <section id="pricing" style={{
            padding: '120px 50px',
            backgroundColor: '#F5F1ED',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{
                    backgroundColor: '#EDE4DB',
                    maxWidth: '900px',
                    width: '100%',
                    padding: '80px 100px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    position: 'relative'
                }}
            >
                <h2 style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '6rem',
                    color: '#3D2B1F',
                    textAlign: 'center',
                    marginBottom: '60px',
                    fontWeight: '400',
                    lineHeight: '1'
                }}>
                    Price list
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', position: 'relative' }}>
                    {/* Vertical Divider */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '180px',
                        width: '1px',
                        height: '100%',
                        backgroundColor: 'rgba(61, 43, 31, 0.2)'
                    }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
                        {categories.map((cat, idx) => (
                            <div key={idx}>
                                <h3 style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    color: '#3D2B1F',
                                    letterSpacing: '2px',
                                    marginBottom: '20px'
                                }}>
                                    {cat.title}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {cat.items.map((item, i) => (
                                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 150px', alignItems: 'baseline' }}>
                                            <span style={{ fontSize: '1.05rem', color: '#3D2B1F', opacity: 0.8 }}>{item.name}</span>
                                            <span style={{ fontSize: '1.05rem', color: '#3D2B1F', fontWeight: '600', textAlign: 'right' }}>{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer style={{ padding: '80px 50px', backgroundColor: '#3D2B1F', color: '#EAE0D5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>938</h2>
                    <p style={{ opacity: 0.8, lineHeight: '1.8' }}>Where Hair Dreams Come True! Follow us for fabulous hair moments!</p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                        <a href="https://www.instagram.com/hair.studio938/" target="_blank">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px' }}>Location</h4>
                    <p style={{ opacity: 0.8 }}>938 High Road, London<br />United Kingdom N12 9RT</p>
                </div>

                <div>
                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px' }}>Opening Hours</h4>
                    <p style={{ opacity: 0.8 }}>Tuesday - Saturday<br />9:00 AM - 6:00 PM</p>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '80px auto 0', paddingTop: '40px', borderTop: '1px solid rgba(234, 224, 213, 0.1)', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Hair Studio 938. All rights reserved.
            </div>
        </footer>
    );
};

export { Navbar, Hero, Services, PriceList, Footer };
