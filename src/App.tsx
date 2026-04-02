/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle, Star, Phone, Mail, MapPin, ChevronDown, Clock, ShieldCheck, Sparkles, Quote, ChevronLeft, ChevronRight, Globe, Calendar } from "lucide-react";
import { translations } from "./translations";
import { useInView, animate } from "motion/react";


const Counter = ({ value, duration = 2, suffix = "" }: { value: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
};


import { db, auth } from './firebase';
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
              className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`max-w-6xl mx-auto ${innerClassName}`}
    >
      {children}
    </motion.div>
  </section>
);


const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; key?: React.Key }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }}
    whileTap={{ y: -10, boxShadow: "0px 15px 30px rgba(0,0,0,0.08)" }}
    className={`p-8 bg-white border border-neutral-200 shadow-sm rounded-2xl transition-all ${className}`}
  >
    {children}
  </motion.div>
);

const VideoShowcase = ({ t }: { t: any }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const basePath = import.meta.env.BASE_URL || "/";
  const videos = [
    {
      id: 1,
      title: "Doing it properly",
      videoUrl: `${basePath}media/vid1.mp4`,
      thumbnailUrl: `${basePath}media/vid1-thumb.jpg`,
      igLink: "https://www.instagram.com/reel/DViwbMGETk7/",
    },
    {
      id: 2,
      title: "La peinture",
      videoUrl: `${basePath}media/vid2.mp4`,
      thumbnailUrl: `${basePath}media/vid2-thumb.jpg`,
      igLink: "https://www.instagram.com/reel/DVYn2kAET6p/",
    },
    {
      id: 3,
      title: "Fresh start",
      videoUrl: `${basePath}media/vid3.mp4`,
      thumbnailUrl: `${basePath}media/vid3-thumb.jpg`,
      igLink: "https://www.instagram.com/reel/DVONZCHFBZj/",
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
            {t.transformation.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto text-lg"
          >
            {t.transformation.subtitle}
          </motion.p>
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
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-white text-xs font-medium truncate max-w-[100px]">{videos[currentIndex].title}</span>
              </div>
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
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white text-xs font-medium truncate max-w-[100px]">{video.title}</span>
                </div>
                <a 
                  href={video.igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/20 transition-all"
                >
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
  const [activeId, setActiveId] = React.useState(1);

  const services = [
    {
      id: 1,
      title: t.services.interior.title, // Pressure Washing in translations
      subtitle: t.services.interior.desc,
      image: "/media/1.jpeg",
      icon: <Sparkles size={20} />,
      color: "#ED5565"
    },
    {
      id: 2,
      title: t.services.dye.title, // Pavement Restoration
      subtitle: t.services.dye.desc,
      image: "/media/2.jpeg",
      icon: <ShieldCheck size={20} />,
      color: "#FC6E51"
    },
    {
      id: 3,
      title: t.services.dye.title, // Pavement Restoration
      subtitle: t.services.dye.desc,
      image: "/media/3.jpeg",
      icon: <Star size={20} />,
      color: "#FFCE54"
    },
    {
      id: 4,
      title: t.services.exterior.title, // Gutter Cleaning
      subtitle: t.services.exterior.desc,
      image: "/media/4.jpeg",
      icon: <Clock size={20} />,
      color: "#2ECC71"
    }
  ];

  return (
    <Section id="portfolio" className="bg-neutral-50 py-24 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t.portfolioSection.title}</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">{t.portfolioSection.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch overflow-hidden w-full max-w-6xl mx-auto h-[600px] md:h-[500px] gap-4 px-4">
        {services.map((service) => (
          <motion.div
            key={service.id}
            layout
            onMouseEnter={() => {
              if (window.innerWidth >= 768) setActiveId(service.id);
            }}
            onClick={() => setActiveId(service.id)}
            className={`relative overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)] ${
              activeId === service.id ? 'flex-[10] rounded-[40px]' : 'flex-1 rounded-[30px]'
            }`}
            style={{
              backgroundImage: `url(${service.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Shadow Overlay */}
            <div className={`absolute inset-0 transition-all duration-500 ${
              activeId === service.id 
                ? 'shadow-[inset_0_-120px_120px_-120px_black,inset_0_-120px_120px_-100px_black]' 
                : 'shadow-[inset_0_-120px_0px_-120px_black,inset_0_-120px_0px_-100px_black]'
            }`} />

            {/* Label */}
            <div className={`absolute flex items-center transition-all duration-500 ${
              activeId === service.id ? 'bottom-8 left-8' : 'bottom-4 left-1/2 -translate-x-1/2'
            }`}>
              <div 
                className="flex items-center justify-center min-w-[48px] h-[48px] rounded-full bg-white shadow-lg"
                style={{ color: service.color }}
              >
                {service.icon}
              </div>
              
              <AnimatePresence mode="wait">
                {activeId === service.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="ml-4 text-white whitespace-nowrap"
                  >
                    <div className="font-bold text-lg md:text-2xl drop-shadow-md">{service.title}</div>
                    <div className="hidden md:block text-xs md:text-base opacity-90 drop-shadow-md">{service.subtitle}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [lang, setLang] = React.useState<'en' | 'fr'>('en');
  const t = translations[lang];

  const [formData, setFormData] = React.useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    service: '',
    details: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // 1. Save to Firestore
      try {
        await addDoc(collection(db, 'leads'), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'leads');
      }

      // 2. Send to Webhook
      await fetch('https://services.leadconnectorhq.com/hooks/o7aUwpKbtkP4AOP0pEjC/webhook-trigger/1afa2de0-a982-49c6-b56a-94afae15dd5e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'Website Contact Form',
          timestamp: new Date().toISOString(),
        }),
      });

      setStatus('success');
      setFormData({ fullName: '', phone: '', email: '', city: '', service: '', details: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <main className="bg-white text-neutral-900 min-h-screen selection:bg-primary selection:text-white scroll-smooth">
      {/* Navbar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50"
      >
        <nav className="bg-white border border-neutral-200/50 rounded-full px-3 py-2 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-6">
            <a href="#" className="pl-3 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/media/MC.png" alt="MC Exterior Care" className="w-14 h-14 object-contain" />
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">MC Exterior Care</span>
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
            
            <a href="#contact" className="hidden sm:flex bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-rose-700 transition-all text-sm items-center gap-2 shadow-lg shadow-primary/20">
              {t.nav.getQuote} <ArrowRight size={16} />
            </a>
          </div>
        </nav>
      </motion.div>

      {/* Hero - Attention & Intent */}
      <Section id="hero" className="pt-32 pb-0 relative min-h-[90vh] flex flex-col justify-between z-20 !px-0" innerClassName="mx-0 max-w-none">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            className="w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            style={{
              backgroundImage: `url('/media/hero.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.85) contrast(1.1) saturate(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full flex-1 flex flex-col items-start justify-center pt-20 pb-40 px-4 sm:px-6">
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
              {t.hero.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-medium drop-shadow-lg leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>
 
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-start w-full mt-4"
            >
              <a href="#contact" className="bg-primary text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 group">
                {t.hero.cta} <ArrowRight size={20} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
              </a>

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
        </div>

        {/* Social Proof Stats Bar - Overlapping Hero and Next Section, Centered & Smaller */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-xl px-4"
        >
          <div className="bg-primary backdrop-blur-xl rounded-2xl p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center">
                <p className="text-xl md:text-4xl font-black text-white mb-0.5 leading-none">
                  <Counter value={parseInt(t.hero.stats.reviews)} />
                </p>
                <p className="text-[7px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest">{t.hero.stats.reviewsText}</p>
              </div>
              <div className="text-center border-x border-white/20 px-2 md:px-4">
                <p className="text-xl md:text-4xl font-black text-white mb-0.5 leading-none">
                  <Counter value={parseInt(t.hero.stats.clients)} />
                </p>
                <p className="text-[7px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest">{t.hero.stats.clientsText}</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-4xl font-black text-white mb-0.5 leading-none">
                  <Counter value={parseInt(t.hero.stats.guarantee)} suffix="%" />
                </p>
                <p className="text-[7px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest">{t.hero.stats.guaranteeText}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Video Showcase */}
      <VideoShowcase t={t} />

      {/* Services */}
      <Section id="services">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">{t.services.title}</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">{t.services.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
          {[
            { key: 'exterior', icon: <Sparkles size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'interior', icon: <ShieldCheck size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'dye', icon: <Star size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
            { key: 'winter', icon: <Clock size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> }
          ].map((service, idx) => (
            <motion.div 
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ y: -5, scale: 1.02 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100 hover:border-primary/30 transition-all hover:shadow-xl group relative overflow-hidden flex flex-col h-full cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative z-10 flex-1">
                {service.icon}
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{(t.services[service.key as keyof typeof t.services] as any).title}</h3>
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
            className="bg-primary text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group"
          >
            <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
              <ShieldCheck size={300} />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">{t.services.cta.title}</h3>
              <p className="text-white/90 text-base sm:text-lg mb-0">{t.services.cta.subtitle}</p>
            </div>
            <div className="relative z-10 flex flex-col items-center md:items-end shrink-0">
              <div className="text-center md:text-right mb-4">
                <p className="text-white/80 text-sm uppercase tracking-wider mb-1">{t.services.cta.startingAt}</p>
                <p className="text-4xl sm:text-5xl font-bold">{t.services.cta.price}</p>
              </div>
              <a href="#contact" className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm hover:bg-neutral-100 transition-colors inline-block whitespace-nowrap shadow-lg">
                {t.services.cta.button}
              </a>
            </div>
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
        <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">{t.process.title}</h2>
        <p className="text-neutral-400 text-center mb-16 max-w-2xl mx-auto">{t.process.subtitle}</p>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-neutral-800 -translate-y-1/2 z-0"></div>
          
          {t.process.steps.map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center bg-neutral-950 p-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-neutral-950">
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
        <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">{t.testimonials.title}</h2>
        <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
        
        <div className="relative w-full py-4 overflow-hidden">
          <motion.div 
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...t.testimonials.items, ...t.testimonials.items].map((testimonial: any, i: number) => (
              <div key={i} className="w-[350px] md:w-[400px] shrink-0">
                <Card className="h-full flex flex-col justify-between bg-neutral-50 border-none !p-8 relative">
                  <div className="absolute bottom-6 right-6 text-primary/10 font-serif text-8xl leading-none select-none pointer-events-none">
                    <Quote size={80} className="text-primary/10" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => <Star key={j} size={18} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-neutral-700 italic mb-8 leading-relaxed text-lg">"{testimonial.text}"</p>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                      <svg className="w-8 h-8 text-neutral-400 mt-2" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-500">{testimonial.role}</p>
                    </div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{t.about.title}</h2>
            <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
              {t.about.desc}
            </p>
            <a href="#contact" className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg shadow-primary/20">
              {t.about.cta}
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img src="/media/house.png" alt="Exterior Services" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 group-active:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
          </motion.div>
        </div>
      </Section>

      {/* Frictionless CTA Form */}
      <Section id="contact" className="bg-neutral-50 border-y border-neutral-100 relative overflow-hidden group/main">
        {/* Background Images with Fade */}
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <div className="grid grid-cols-6 grid-rows-6 h-full">
            {Array(36).fill(null).map((_, i) => {
              const imgIndex = (i % 4) + 1;
              const img = `/media/${imgIndex}.jpeg`;
              return (
                <div key={i} className="relative group/item">
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover opacity-5 group-hover/main:blur-sm group-hover/main:opacity-10 transition-all duration-500" />
                  <img src={img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/item:opacity-100 group-hover/item:blur-0 transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">{t.contact.title}</h2>
            <p className="text-neutral-600 text-base md:text-lg">{t.contact.subtitle}</p>
          </div>
          
          <Card className="!p-6 md:!p-10 shadow-xl shadow-neutral-200/50 border-none">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} md-size={40} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">{t.contact.form.success.title}</h3>
                <p className="text-neutral-600 mb-8 text-sm md:text-base">{t.contact.form.success.desc}</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-primary font-bold hover:underline"
                >
                  {t.contact.form.success.button}
                </button>
              </motion.div>
            ) : (
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.name} *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm md:text-base" 
                      placeholder="Jean Francois" 
                      required 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.phone} *</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm md:text-base" 
                      placeholder="(514) 622-1599" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.email} *</label>
                      <input 
                        type="email" 
                        className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm md:text-base" 
                        placeholder="jean@example.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.city} *</label>
                      <input 
                        type="text" 
                        className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm md:text-base" 
                        placeholder="Montreal" 
                        required 
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.serviceLabel} *</label>
                  <select 
                    className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white appearance-none text-sm md:text-base" 
                    required 
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="" disabled>{t.contact.form.servicePlaceholder}</option>
                    {t.contact.services.map((option, i) => (
                      <option key={i}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-1.5 md:mb-2 text-neutral-900">{t.contact.form.details} (Optional)</label>
                  <textarea 
                    className="w-full px-3 md:px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-sm md:text-base" 
                    rows={3} 
                    placeholder={t.contact.form.detailsPlaceholder}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  ></textarea>
                </div>
                
                {status === 'error' && (
                  <p className="text-red-500 text-xs md:text-sm font-medium">{t.contact.form.error}</p>
                )}

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white font-bold text-base md:text-lg py-4 md:py-5 rounded-xl hover:bg-rose-700 transition-all mt-2 md:mt-4 flex justify-center items-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? t.contact.form.sending : t.contact.form.submit} <ArrowRight size={18} md-size={20} />
                </button>
                <p className="text-center text-[10px] md:text-xs text-neutral-500 mt-3 md:mt-4 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} md-size={14} /> {t.contact.form.secure}
                </p>
              </form>
            )}
          </Card>
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
              <img src="/media/MC.png" alt="MC Exterior Care" className="w-14 h-14 object-contain" />
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold tracking-tight">MC Exterior Care</span>
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

      {/* Floating Call Button (Mobile Only) */}
      <motion.a
        href="tel:5142472086"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="md:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-600 transition-colors group"
        aria-label="Call MC Exterior Care"
      >
        <Phone size={24} className="group-hover:animate-bounce group-active:animate-bounce" />
      </motion.a>

      {/* Book Free Call Button (Desktop/Tablet) */}
      <motion.a
        href="#contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white text-neutral-900 px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] items-center gap-3 font-bold hover:shadow-[0_15px_50px_rgba(0,0,0,0.3)] transition-all border border-neutral-100"
      >
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
          <Calendar size={20} className="text-neutral-900" />
        </div>
        <span>{t.bookFreeCall}</span>
      </motion.a>
    </main>
  );
}
