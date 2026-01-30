import React, { useState } from 'react'
import IntroVideo from './components/IntroVideo'
import { Navbar, Hero, Services, TeamSection, PriceList, BookingSection, Footer } from './components/LandingPage'
import './App.css'

function App() {
  const [showMainSite, setShowMainSite] = useState(() => {
    return localStorage.getItem('hasSeenIntro') === 'true';
  })

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowMainSite(true);
  }

  return (
    <div className="app-container">
      {!showMainSite && (
        <IntroVideo onComplete={handleIntroComplete} />
      )}

      {showMainSite && (
        <main className="main-content">
          <Navbar />
          <Hero />
          <Services />
          <TeamSection />
          <PriceList />
          <BookingSection />
          <section id="gallery" style={{ padding: '80px 0', backgroundColor: '#EDE4DB' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '3rem', color: '#3D2B1F' }}>Instagram Vibes</h2>
            </div>
            <img
              src="/salon_bg.png"
              alt="Salon Interior"
              style={{ width: '100%', height: '600px', objectFit: 'cover' }}
            />
          </section>
          <Footer />
        </main>
      )}
    </div>
  )
}

export default App
