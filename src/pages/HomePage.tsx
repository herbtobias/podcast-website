import { useEffect } from 'react';
import Hero from '../components/Hero';
import HeroContent from '../components/HeroContent';
import Subscribe from '../components/Subscribe';
import LatestEpisode from '../components/LatestEpisode';
import Newsletter from '../components/Newsletter';
import Topics from '../components/Topics';
import Hosts from '../components/Hosts';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage() {
  useScrollReveal();

  useEffect(() => {
    const vignette = document.createElement('div');
    vignette.className = 'pointer-events-none fixed inset-0 -z-10';
    vignette.innerHTML = `
      <div class="absolute inset-0" style="background: radial-gradient(60% 60% at 70% 20%, rgba(0,179,255,0.18) 0%, rgba(0,179,255,0.05) 35%, rgba(10,15,31,0.0) 60%), radial-gradient(40% 40% at 20% 80%, rgba(0,179,255,0.12) 0%, rgba(0,179,255,0.04) 35%, rgba(10,15,31,0.0) 65%);"></div>
      <div class="absolute inset-0 opacity-[0.03] mix-blend-screen" style="background-image: url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop'); background-size: cover; background-position: center;"></div>
    `;
    document.body.appendChild(vignette);

    return () => {
      document.body.removeChild(vignette);
    };
  }, []);

  return (
    <>
      <SEO
        title="Zukunft ist relativ — Der KI-Podcast über Technologie und Zukunft"
        description="Der Podcast über das neue KI-Zeitalter, Identität und die Pfade des Fortschritts. Tobias und Patrick erkunden KI & Kreativität, nachhaltige Tech-Wetten und die Zukunft des Körpers. Jetzt reinhören!"
        keywords="KI Podcast, Künstliche Intelligenz, Zukunft Podcast, Technologie Podcast, generative KI, Biohacking, Innovation, Wissenschaft Podcast, deutscher Podcast"
        ogType="website"
      />
      <StructuredData type="podcast" />
      <main className="relative pt-16">
        <Hero />
        <HeroContent />
        <Subscribe />
        <LatestEpisode />
        <Newsletter />
        <Topics />
        <Hosts />
        <Footer />
      </main>
    </>
  );
}
