import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Phone, Mail, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { translations } from "../translations";
import { Link } from "react-router-dom";

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
    <section className="bg-neutral-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">{t.transformation.title}</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">{t.transformation.subtitle}</p>
        </motion.div>

        <div className="md:hidden relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[9/16] max-h-[65vh] relative border border-white/10">
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
              <a href={videos[currentIndex].igLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-black/60 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                {t.transformation.viewOnIg}
              </a>
            </div>
          </div>
          <button type="button" onClick={() => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full text-white">←</button>
          <button type="button" onClick={() => setCurrentIndex((prev) => (prev + 1) % videos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 p-2 rounded-full text-white">→</button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">{videos.map((_, index) => (<span key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/40'}`} />))}</div>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 aspect-[9/16] relative border border-white/10">
              <video className="w-full h-full object-cover" controls playsInline preload="metadata" poster={video.thumbnailUrl}>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-4 right-4 flex justify-end items-center z-10">
                <a href={video.igLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-black/60 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  {t.transformation.viewOnIg}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceGallery = ({ t }: { t: any }) => {
  const services = [
    { id: 1, title: t.services.interior.title, subtitle: t.services.interior.desc, image: getAssetPath("media/1.jpeg"), icon: <Sparkles size={20} />, color: "#ED5565" },
    { id: 2, title: t.services.dye.title, subtitle: t.services.dye.desc, image: getAssetPath("media/2.jpeg"), icon: <ShieldCheck size={20} />, color: "#FC6E51" },
    { id: 3, title: t.services.dye.title, subtitle: t.services.dye.desc, image: getAssetPath("media/3.jpeg"), icon: <Star size={20} />, color: "#FFCE54" },
    { id: 4, title: t.services.exterior.title, subtitle: t.services.exterior.desc, image: getAssetPath("media/4.jpeg"), icon: <Clock size={20} />, color: "#2ECC71" }
  ];

  return (
    <section id="portfolio" className="bg-neutral-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 tracking-tight">{t.portfolioSection.title}</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">{t.portfolioSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {services.map((service) => (
            <div key={service.id} className="relative overflow-hidden rounded-[32px] aspect-[4/3] cursor-pointer" style={{ backgroundImage: `url(${service.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center">
                <div className="flex items-center justify-center min-w-[44px] h-[44px] rounded-full bg-white shadow-lg" style={{ color: service.color }}>{service.icon}</div>
                <div className="ml-3 text-white">
                  <div className="font-bold text-lg drop-shadow-md">{service.title}</div>
                  <div className="text-sm opacity-90 drop-shadow-md">{service.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  const [lang, setLang] = React.useState<'en' | 'fr'>('en');
  const t = translations[lang];

  return (
    <main className="bg-white text-neutral-900 min-h-screen selection:bg-primary selection:text-white">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50">
        <nav className="bg-white border border-neutral-200/50 rounded-full px-3 py-2 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-6">
            <a href="#" className="pl-3 flex items-center gap-2">
              <img src={getAssetPath("MC.svg")} alt="MC ExteriorCare" className="w-14 h-14 object-contain" />
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">MC ExteriorCare</span>
            </a>
            <div className="hidden lg:flex items-center bg-neutral-100/50 rounded-full p-1 gap-1">
              <a href="#hero" className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#E0E0FF] text-neutral-900 shadow-sm">{t.nav.home}</a>
              <a href="#services" className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500">{t.nav.services}</a>
              <a href="#portfolio" className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500">{t.nav.portfolio}</a>
              <a href="#process" className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500">{t.nav.process}</a>
              <a href="#testimonials" className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-500">{t.nav.reviews}</a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100/50 rounded-full p-1 mr-2">
              <button onClick={() => setLang('en')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-neutral-400'}`}>EN</button>
              <button onClick={() => setLang('fr')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${lang === 'fr' ? 'bg-white text-primary shadow-sm' : 'text-neutral-400'}`}>FR</button>
            </div>
          </div>
        </nav>
      </div>

      <section id="hero" className="pt-32 pb-0 relative min-h-[90vh] flex flex-col justify-between z-20 px-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div style={{ backgroundImage: `url('${getAssetPath("media/hero.png")}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.85) contrast(1.1) saturate(1.1)" }} className="w-full h-full" />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-20 pb-40 px-4 sm:px-6">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-medium text-xs sm:text-sm mb-6 backdrop-blur-md border border-white/20">
              <Star size={14} className="fill-white text-white" /> {t.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl leading-[1.1]">{t.hero.title}</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-lg leading-relaxed">{t.hero.subtitle}</p>
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs sm:text-sm font-medium">
              <Clock size={14} className="text-white/60" />
              <span>{t.hero.consultation}</span>
            </div>
          </div>
        </div>
      </section>

      <VideoShowcase t={t} />

      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">{t.services.title}</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base">{t.services.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'exterior', slug: 'gutter-cleaning', icon: <Sparkles size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
              { key: 'interior', slug: 'pressure-washing', icon: <ShieldCheck size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
              { key: 'dye', slug: 'pavement-restoration', icon: <Star size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> },
              { key: 'winter', slug: 'winter-services', icon: <Clock size={40} className="text-primary mb-4 w-10 h-10 sm:w-12 sm:h-12" /> }
            ].map((service) => (
              <div key={service.key} className="h-full relative block rounded-3xl bg-white shadow-sm border border-neutral-100 p-6 sm:p-8 flex flex-col">
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
                <div className="mt-auto">
                  <Link to={`/service/${service.slug}`} className="inline-flex items-center text-primary font-bold">
                    See More <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-center gap-12">
            <p className="text-[#54728c] font-bold text-sm uppercase tracking-[0.2em]">{t.services.socialProof}</p>
            <div className="flex items-center gap-8">
              <div className="flex -space-x-4">
                {["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"].map((img, i) => (
                  <img key={i} src={img} alt="Client" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm" />
                ))}
                <div className="w-12 h-12 rounded-full border-2 border-white bg-[#f8f9fa] flex items-center justify-center text-sm font-bold text-[#54728c] shadow-sm">+50</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">{[...Array(5)].map((_, j) => <Star key={j} size={24} className="fill-[#ffcd00] text-[#ffcd00]" />)}</div>
                <span className="text-2xl font-bold text-[#54728c] ml-1">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceGallery t={t} />

      <section id="process" className="bg-neutral-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">{t.process.title}</h2>
          <p className="text-neutral-400 text-center mb-16 max-w-2xl mx-auto">{t.process.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-neutral-800 -translate-y-1/2 z-0"></div>
            {t.process.steps.map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-neutral-950 p-6">
                <div className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-neutral-950">{i + 1}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="overflow-hidden py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center tracking-tight">{t.testimonials.title}</h2>
          <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
          <div className="relative overflow-hidden">
            <motion.div
              animate={{ x: [0, -320 * t.testimonials.items.length] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-6"
              style={{ width: `${320 * t.testimonials.items.length * 2}px` }}
            >
              {[...t.testimonials.items, ...t.testimonials.items].map((testimonial: any, i: number) => (
                <div key={i} className="flex-shrink-0 w-80 p-6 md:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-medium text-xl shadow-sm" style={{ backgroundColor: testimonial.bg || '#9CA3AF' }}>{testimonial.initials || testimonial.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 leading-tight">{testimonial.name}</p>
                      <p className="text-sm text-neutral-500 leading-tight mt-0.5">{testimonial.reviewsCount || testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3"><div className="flex gap-0.5">{[...Array(testimonial.stars || 5)].map((_, j) => <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />)}</div></div>
                    <p className="text-neutral-700 leading-relaxed text-[15px]">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="reliable" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{t.about.title}</h2>
            <p className="text-neutral-600 text-lg mb-8 leading-relaxed">{t.about.desc}</p>
          </div>
          <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img src={getAssetPath("media/house.png")} alt="Exterior Services" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
          </div>
        </div>
      </section>

      <footer className="bg-neutral-950 text-neutral-400 py-10 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center gap-x-12 gap-y-10 items-center">
          <div className="flex flex-col items-start gap-4 shrink-0 md:w-1/3">
            <div className="text-white flex items-center gap-4">
              <img src={getAssetPath("MC.svg")} alt="MC ExteriorCare" className="w-14 h-14 object-contain" />
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold tracking-tight">MC ExteriorCare</span>
                <a href="https://www.instagram.com/mcexteriorcare?igsh=Ymd0ZDF6MTdodWo0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                  @mcexteriorcare
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-xs text-center md:text-left md:w-1/3"><p className="leading-relaxed text-neutral-300 text-sm">{t.footer.desc}</p></div>
          <div className="flex flex-col sm:flex-row gap-10 md:gap-12 text-center md:text-left md:w-1/3 justify-end">
            <div>
              <h4 className="text-white font-bold mb-6">{t.footer.links}</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-neutral-400">{t.nav.services}</a></li>
                <li><a href="#portfolio" className="text-neutral-400">{t.nav.portfolio}</a></li>
                <li><a href="#process" className="text-neutral-400">{t.nav.process}</a></li>
                <li><a href="#testimonials" className="text-neutral-400">{t.nav.reviews}</a></li>
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
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-900 text-sm text-center md:text-left"><p>{t.footer.rights}</p></div>
      </footer>

      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <a href="tel:5142472086" className="w-14 h-14 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center font-bold" aria-label="Call MC ExteriorCare">
          <Phone size={24} />
        </a>
      </div>
    </main>
  );
}
