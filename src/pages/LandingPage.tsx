/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, ChevronDown, Clock, ShieldCheck, Sparkles, Quote, ChevronLeft, ChevronRight, Globe, Calendar } from "lucide-react";
import { translations } from "../translations";
import { useInView } from "motion/react";
import { Link } from "react-router-dom";
import ShinyText from '../components/ShinyText';
import BorderGlow from '../components/BorderGlow';
import SpotlightCard from '../components/SpotlightCard';
import BlurText from '../components/BlurText';


import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Something went wrong</h2>
            <p className="text-neutral-600 mb-6">The application encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-black rounded-full font-semibold hover:bg-opacity-90 transition-colors shadow-lg shadow-blue-500/20"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <pre className="mt-6 p-4 bg-neutral-100 rounded text-left text-xs overflow-auto max-h-40">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const Section = ({ children, className = "", innerClassName = "", id, delay = 0 }: { children: React.ReactNode; className?: string; innerClassName?: string; id?: string; delay?: number }) => (
  <section id={id} className={`py-20 px-6 ${className}`}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`max-w-6xl mx-auto will-change-transform ${innerClassName}`}
    >
      {children}
    </motion.div>
  </section>
);


const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}
    whileTap={{ y: -5, boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}
    className={`p-8 bg-white border border-neutral-200 shadow-sm rounded-2xl transition-all will-change-transform ${className}`}
  >
    {children}
  </motion.div>
);

const basePath = import.meta.env.BASE_URL || "/";
const getAssetPath = (path: string) => {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

const VideoShowcase = ({ t }: { t: any }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const videos = [
    {
      id: 1,
      title: "Doing it properly",
      videoUrl: getAssetPath("media/vid1.mp4"),
      thumbnailUrl: getAssetPath("media/vid1-thumb.jpg"),
      igLink: "https://www.instagram.com/mcexteriorcare?igsh=Ymd0ZDF6MTdodWo0",
    },
    {
      id: 2,
      title: "La peinture",
      videoUrl: getAssetPath("media/vid2.mp4"),
      thumbnailUrl: getAssetPath("media/vid2-thumb.jpg?v=2"),
      igLink: "https://www.instagram.com/mcexteriorcare?igsh=Ymd0ZDF6MTdodWo0",
    },
    {
      id: 3,
      title: "Fresh start",
      videoUrl: getAssetPath("media/vid3.mp4"),
      thumbnailUrl: getAssetPath("media/vid3-thumb.jpg"),
      igLink: "https://www.instagram.com/mcexteriorcare?igsh=Ymd0ZDF6MTdodWo0",
    }
  ];

  return (
    <Section className="bg-neutral-950 py-10 md:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            <ShinyText text={t.transformation.title} color="#ffffff" shineColor="#3C91E6" speed={3} />
          </motion.h2>
          <BlurText 
            className="text-neutral-400 max-w-2xl mx-auto text-lg justify-center" 
            text={t.transformation.subtitle} 
            delay={100} 
            animateBy="words" 
            direction="bottom" 
          />
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[9/16] max-h-[65vh] relative group border border-white/10">
            <video 
              key={videos[currentIndex].id}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={videos[currentIndex].thumbnailUrl}
            >
              <source src={videos[currentIndex].videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 right-4 flex justify-end items-center z-10">
              <a
                href={videos[currentIndex].igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                {t.transformation.viewOnIg}
              </a>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full text-white hover:bg-white/30"
          >
            <ChevronLeft />
          </button>
          <button 
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % videos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full text-white hover:bg-white/30"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {videos.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[9/16] relative group border border-white/10"
            >
              <video 
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={video.thumbnailUrl}
              >
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 right-4 flex justify-end items-center z-10">
                <a 
                  href={video.igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/20 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  {t.transformation.viewOnIg}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ServiceGallery = ({ t }: { t: any }) => {
  const services = [
    {
      id: 1,
      title: t.services.interior.title,
      subtitle: t.services.interior.desc,
      image: getAssetPath("media/1.jpeg"),
      icon: <Sparkles size={20} />,
      color: "#ED5565"
    },
    {
      id: 2,
      title: t.services.dye.title,
      subtitle: t.services.dye.desc,
      image: getAssetPath("media/2.jpeg"),
      icon: <ShieldCheck size={20} />,
      color: "#FC6E51"
    },
    {
      id: 3,
      title: t.services.dye.title,
      subtitle: t.services.dye.desc,
      image: getAssetPath("media/3.jpeg"),
      icon: <Star size={20} />,
      color: "#FFCE54"
    },
    {
      id: 4,
      title: t.services.exterior.title,
      subtitle: t.services.exterior.desc,
      image: getAssetPath("media/4.jpeg"),
      icon: <Clock size={20} />,
      color: "#2ECC71"
    }
  ];

  return (
    <Section id="portfolio" className="bg-neutral-50 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <ShinyText text={t.portfolioSection.title} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
        </h2>
        <BlurText 
          className="text-neutral-600 max-w-2xl mx-auto text-lg justify-center" 
          text={t.portfolioSection.subtitle} 
          delay={100} 
          animateBy="words" 
          direction="bottom" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-[32px] aspect-[4/3] cursor-pointer"
            style={{
              backgroundImage: `url(${service.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-6 left-6 flex items-center">
              <div
                className="flex items-center justify-center min-w-[44px] h-[44px] rounded-full bg-white shadow-lg"
                style={{ color: service.color }}
              >
                {service.icon}
              </div>
              <div className="ml-3 text-white">
                <div className="font-bold text-lg drop-shadow-md">{service.title}</div>
                <div className="text-sm opacity-90 drop-shadow-md">{service.subtitle}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default function LandingPage() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [lang, setLang] = React.useState<'en' | 'fr'>('en');
  const t = translations[lang];



  return (
    <main className="bg-white text-neutral-900 min-h-screen selection:bg-primary selection:text-white scroll-smooth">
      {/* Navbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 will-change-transform"
      >
        <nav className="bg-white border border-neutral-200/50 rounded-full px-3 py-2 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-6">
            <a href="#" className="pl-3 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={getAssetPath("MC.svg")} alt="MC ExteriorCare" className="w-14 h-14 object-contain" />
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">MC ExteriorCare</span>
            </a>
            
            <div className="hidden lg:flex items-center bg-neutral-100/50 rounded-full p-1 gap-1">
              <a 
                href="#hero" 
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E0E0FF] text-neutral-900 shadow-sm transition-all"
              >
                {t.nav.home}
              </a>
              <a 
                href="#services" 
                className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-all"
              >
                {t.nav.services}
              </a>
              <a 
                href="#portfolio" 
                className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-all"
              >
                {t.nav.portfolio}
              </a>
              <a 
                href="#process" 
                className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-all"
              >
                {t.nav.process}
              </a>
              <a 
                href="#testimonials" 
                className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-all"
              >
                {t.nav.reviews}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100/50 rounded-full p-1 mr-2">
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('fr')} 
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'fr' ? 'bg-white text-primary shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                FR
              </button>
            </div>
            
          </div>
        </nav>
      </motion.div>

      {/* Hero - Attention & Intent */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-between z-20 pt-32 pb-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            className="w-full h-full will-change-transform"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            style={{
              backgroundImage: `url('${getAssetPath("media/hero.png")}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full flex-1 flex flex-col items-start justify-center pt-20 pb-40 px-4 sm:px-6 max-w-6xl mx-auto"
        >
          <div className="max-w-3xl text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-medium text-xs sm:text-sm mb-6 backdrop-blur-md border border-white/20 -ml-4 sm:-ml-6"
            >
              <Star size={14} className="fill-white text-white" /> {t.hero.badge}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl leading-[1.1] max-w-3xl"
            >
              <ShinyText text={t.hero.title} color="#ffffff" shineColor="#3C91E6" speed={3} />
            </motion.h1>
            
            <BlurText 
              className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-lg leading-relaxed justify-start" 
              text={t.hero.subtitle} 
              delay={100} 
              animateBy="words" 
              direction="bottom" 
            />
 
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-start w-full mt-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs sm:text-sm font-medium"
              >
                <Clock size={14} className="text-white/60" />
                <span>{t.hero.consultation}</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Video Showcase */}
      <VideoShowcase t={t} />

      {/* Services */}
      <Section id="services">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
            <ShinyText text={t.services.title} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
          </h2>
          <BlurText 
            className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base justify-center" 
            text={t.services.subtitle} 
            delay={100} 
            animateBy="words" 
            direction="bottom" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
          {[
            { key: 'exterior', slug: 'gutter-cleaning', image: getAssetPath('media/1.jpeg'), icon: <Sparkles size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'interior', slug: 'pressure-washing', image: getAssetPath('media/2.jpeg'), icon: <ShieldCheck size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'dye', slug: 'pavement-restoration', image: getAssetPath('media/3.jpeg'), icon: <Star size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'winter', slug: 'winter-services', image: getAssetPath('media/4.jpeg'), icon: <Clock size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> }
          ].map((service, idx) => (
            <motion.div 
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ y: -5, scale: 1.02 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="h-full relative block"
            >
              <SpotlightCard
                className="w-full h-full rounded-3xl bg-white shadow-sm border border-neutral-100 hover:border-primary/30 transition-all hover:shadow-lg !p-0"
                spotlightColor="rgba(60, 145, 230, 0.1)"
              >
                <div className="bg-transparent p-6 sm:p-8 flex flex-col h-full relative z-10 transition-all group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 relative">
                      <img src={service.image} alt={service.slug} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    {service.icon}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-neutral-900">{(t.services[service.key as keyof typeof t.services] as any).title}</h3>
                    <p className="text-neutral-600 text-sm sm:text-base mb-6">{(t.services[service.key as keyof typeof t.services] as any).desc}</p>
                    
                    <ul className="space-y-3 mb-6">
                      {((t.services[service.key as keyof typeof t.services] as any).features || []).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Annual Protection Plan Banner */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative block rounded-3xl"
          >
            <BorderGlow
              className="w-full h-full"
              backgroundColor="#0A3D62"
              glowColor="210 77 57"
              colors={['#ffffff', '#3C91E6', '#0A3D62']}
              borderRadius={24}
              animated={true}
            >
              <div className="bg-primary/90 backdrop-blur-sm text-black rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group">
                <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                  <ShieldCheck size={300} />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-black">{t.services.cta.title}</h3>
                  <BlurText 
                    className="text-black/90 text-base sm:text-lg mb-0 justify-start" 
                    text={t.services.cta.subtitle} 
                    delay={100} 
                    animateBy="words" 
                    direction="bottom" 
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center md:items-end shrink-0">
                  <div className="text-center md:text-right mb-4">
                    <p className="text-black/70 text-sm uppercase tracking-wider mb-1">{t.services.cta.startingAt}</p>
                    <p className="text-4xl sm:text-5xl font-bold text-black">{t.services.cta.price}</p>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-center gap-12"
        >
          <p className="text-[#54728c] font-bold text-sm uppercase tracking-[0.2em]">{t.services.socialProof}</p>
          <div className="flex items-center gap-8">
            <div className="flex -space-x-4">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
              ].map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="Client" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" 
                />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-[#f8f9fa] flex items-center justify-center text-sm font-bold text-[#54728c] shadow-sm">
                +50
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => <Star key={j} size={24} className="fill-[#ffcd00] text-[#ffcd00]" />)}
              </div>
              <span className="text-2xl font-bold text-[#54728c] ml-1">5.0</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Portfolio Gallery */}
      <ServiceGallery t={t} />

      {/* Process - Validating the Next Action */}
      <Section id="process" className="bg-neutral-950 text-white">
        <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">
          <ShinyText text={t.process.title} color="#ffffff" shineColor="#3C91E6" speed={3} />
        </h2>
        <BlurText 
          className="text-neutral-400 text-center mb-16 max-w-2xl mx-auto justify-center" 
          text={t.process.subtitle} 
          delay={100} 
          animateBy="words" 
          direction="bottom" 
        />
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-neutral-800 -translate-y-1/2 z-0"></div>
          
          {t.process.steps.map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center bg-neutral-950 p-6">
              <div className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-neutral-950">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Proof - Validating the Outcome */}
      <Section id="testimonials" className="overflow-hidden">
        <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">
          <ShinyText text={t.testimonials.title} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
        </h2>
        <BlurText 
          className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto justify-center" 
          text={t.testimonials.subtitle} 
          delay={100} 
          animateBy="words" 
          direction="bottom" 
        />
        
        <div className="relative w-full py-4 overflow-hidden">
          <motion.div 
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...t.testimonials.items, ...t.testimonials.items].map((testimonial: any, i: number) => (
              <div key={i} className="w-[350px] md:w-[400px] shrink-0">
                <Card className="h-full flex flex-col bg-neutral-50 border-none !p-6 md:!p-8 relative">
                  <div className="absolute bottom-6 right-6 text-primary/10 font-serif text-8xl leading-none select-none pointer-events-none">
                    <Quote size={80} className="text-primary/10" />
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10 mb-5">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0 text-white font-medium text-xl shadow-sm"
                      style={{ backgroundColor: testimonial.bg || '#9CA3AF' }}
                    >
                      {testimonial.initials || testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 leading-tight">{testimonial.name}</p>
                      <p className="text-sm text-neutral-500 leading-tight mt-0.5">{testimonial.reviewsCount || testimonial.role}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(testimonial.stars || 5)].map((_, j) => <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-neutral-700 leading-relaxed text-[15px] flex-1">"{testimonial.text}"</p>
                  </div>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Reliable Exterior Services */}
      <Section id="reliable" className="bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              <ShinyText text={t.about.title} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
            </h2>
            <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
              {t.about.desc}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img src={getAssetPath("media/house.png")} alt="Exterior Services" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 group-active:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
          </motion.div>
        </div>
      </Section>




      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-10 border-t border-neutral-900">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center gap-x-12 gap-y-10 items-center"
        >
          <div className="flex flex-col items-start gap-4 shrink-0 md:w-1/3">
            <div className="text-white flex items-center gap-4">
              <img src={getAssetPath("MC.svg")} alt="MC ExteriorCare" className="w-14 h-14 object-contain" />
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold tracking-tight">MC ExteriorCare</span>
                <a
                  href="https://www.instagram.com/mcexteriorcare?igsh=Ymd0ZDF6MTdodWo0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  @mcexteriorcare
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-xs text-center md:text-left md:w-1/3">
            <p className="leading-relaxed text-neutral-300 text-sm">{t.footer.desc}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 md:gap-12 text-center md:text-left md:w-1/3 justify-end">
            <div>
              <h4 className="text-white font-bold mb-6">{t.footer.links}</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="hover:text-primary transition-colors">{t.nav.services}</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">{t.nav.portfolio}</a></li>
                <li><a href="#process" className="hover:text-primary transition-colors">{t.nav.process}</a></li>
                <li><a href="#testimonials" className="hover:text-primary transition-colors">{t.nav.reviews}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t.footer.contact}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><Phone size={16} className="text-primary" /> 514 247 2086</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-primary" /> Mcextcare@gmail.com</li>
                <li className="flex items-center gap-3"><MapPin size={16} className="text-primary" /> {t.footer.location}</li>
              </ul>
            </div>
          </div>
        </motion.div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>{t.footer.rights}</p>
        </div>
      </footer>


    </main>
  );
}
