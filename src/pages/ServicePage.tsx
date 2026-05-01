import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, ShieldCheck, Phone, Mail, MapPin, ChevronDown, ChevronUp, Plus, Minus, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ShinyText from '../components/ShinyText';
import BorderGlow from '../components/BorderGlow';
import BlurText from '../components/BlurText';
import { translations } from '../translations';

const basePath = import.meta.env.BASE_URL || "/";
const getAssetPath = (path: string) => {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

const servicesData: any = {
  'gutter-cleaning': {
    key: 'exterior',
    image: getAssetPath('media/1.jpeg'),
    color: '#3C91E6'
  },
  'pressure-washing': {
    key: 'pressure',
    image: getAssetPath('media/2.jpeg'),
    color: '#E84C3D'
  },
  'pavement-restoration': {
    key: 'pavement',
    image: getAssetPath('media/3.jpeg'),
    color: '#FFCE54'
  },
  'winter-services': {
    key: 'winter',
    image: getAssetPath('media/4.jpeg'),
    color: '#2ECC71'
  }
};

export default function ServicePage() {
  const { serviceId } = useParams();
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const serviceInfo = servicesData[serviceId as string];
  if (!serviceInfo) {
    return <div className="min-h-screen flex items-center justify-center p-8 text-center text-xl">Service not found. <Link to="/" className="text-primary ml-2 underline">Go back home</Link></div>;
  }

  const t = translations[lang];
  const serviceDetails = (t.services as any)[serviceInfo.key as keyof typeof t.services] as any;
  const detailed = (t as any).detailedServices[serviceId as string] || (t as any).detailedServices['gutter-cleaning']; // fallback

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="pl-3 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={getAssetPath("MC.svg")} alt="MC Exterior Care" className="w-14 h-14 object-contain" />
              <span className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">MC Exterior Care</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                {t.nav.home}
              </Link>
              <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} className="text-neutral-600 hover:text-primary font-bold transition-colors uppercase text-sm bg-neutral-100 px-3 py-1.5 rounded-full">
                {lang === 'en' ? 'FR' : 'EN'}
              </button>
            </div>
            <Link to="/#contact" className="hidden md:inline-flex bg-primary text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all hover:shadow-lg hover:-translate-y-0.5">
              {t.nav.getQuote}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-neutral-900/60 z-10 mix-blend-multiply" />
          <img src={serviceInfo.image} alt={detailed.headline} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <Link to="/" className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            <ArrowLeft size={16} className="mr-2" />
            {t.nav.home} / {serviceDetails.title}
          </Link>
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-tight"
            >
              {detailed.headline}
            </motion.h1>
            <BlurText 
              className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium drop-shadow-md leading-relaxed justify-start mb-10 max-w-3xl" 
              text={detailed.shortDescription} 
              delay={30} 
              animateBy="words" 
              direction="bottom" 
            />
            <div className="flex flex-wrap gap-4">
              <Link to="/#contact" className="inline-flex bg-primary text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all hover:shadow-lg hover:-translate-y-0.5 pointer-events-auto">
                {t.nav.getQuote}
              </Link>
              <a href={`tel:${detailed.cta.phone.replace(/\D/g, '')}`} className="inline-flex bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-all pointer-events-auto">
                {lang === 'en' ? 'Call Us:' : 'Appelez-nous :'} {detailed.cta.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do & Included Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 tracking-tight">
                <ShinyText text={detailed.whatWeDoTitle} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                {detailed.whatWeDo}
              </p>
              
              <div className="mb-8 rounded-3xl overflow-hidden shadow-sm border border-neutral-100 aspect-video relative">
                <img src={serviceInfo.image} alt={detailed.headline} className="w-full h-full object-cover" />
              </div>

              <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
                <h3 className="text-2xl font-bold mb-6 text-neutral-900">{detailed.benefitsTitle}</h3>
                <ul className="space-y-4">
                  {detailed.benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full shrink-0">
                        <CheckCircle size={18} />
                      </div>
                      <span className="text-neutral-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-28 bg-primary text-black rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <h3 className="text-2xl font-bold mb-8 relative z-10">{detailed.servicesIncludedTitle}</h3>
                <ul className="space-y-6 relative z-10">
                  {detailed.servicesIncluded.map((serviceItem: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-1 bg-black/10 p-1.5 rounded-full shrink-0">
                        <Star size={16} className="text-black" />
                      </div>
                      <span className="text-black/80 text-lg font-medium">{serviceItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-neutral-50 px-4 border-y border-neutral-100">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            <ShinyText text={detailed.howItWorksTitle} color="#1B1B1B" shineColor="#3C91E6" speed={3} />
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 justify-center">
            {detailed.howItWorksSubtitle}
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-6 relative px-4">
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10" />
          
          {detailed.howItWorks.map((step: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center relative bg-white px-6 py-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-all h-full"
            >
              <div className="w-16 h-16 mx-auto bg-primary/5 rounded-2xl flex items-center justify-center mb-5 text-primary border border-primary/10 shadow-inner">
                <span className="text-2xl font-black">0{idx + 1}</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-neutral-900">{step.title}</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{detailed.faqTitle}</h2>
            <p className="text-neutral-600 text-lg">{detailed.faqSubtitle}</p>
          </div>
          
          <div className="space-y-4">
            {detailed.faqs.map((faq: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="border border-neutral-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors text-left"
                >
                  <span className="font-bold text-lg text-neutral-900">{faq.q}</span>
                  <div className={`p-1 rounded-full bg-neutral-100 text-neutral-600 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                  className="overflow-hidden bg-neutral-50"
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 pt-2 text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay bg-cover bg-center" 
          style={{ backgroundImage: `url('${getAssetPath("media/1.jpeg")}')` }}
        />
        <div className="absolute inset-0 bg-primary/20 pointer-events-none mix-blend-color" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{detailed.cta.text.split('.')[0]}.</h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
            {detailed.cta.text.split('.').slice(1).join('.').trim()}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/#contact" className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl hover:shadow-blue-400/40 hover:-translate-y-1">
              {detailed.cta.button || t.nav.getQuote}
            </Link>
            <a href={`tel:${detailed.cta.phone.replace(/\D/g, '')}`} className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              <Phone size={20} className="mr-2" />
              {detailed.cta.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
