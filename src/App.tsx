import React, { useState } from 'react';
import { 
  Search, 
  Map as MapIcon, 
  FileText, 
  ShieldCheck, 
  Info, 
  Phone, 
  Globe, 
  ChevronRight, 
  Menu, 
  X,
  Database,
  Layers,
  Landmark,
  MessageSquare,
  ArrowRight,
  Languages,
  Mail,
  MapPin,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Types ---
type Language = 'en' | 'am';

interface OwnershipTransfer {
  previousOwner: string;
  date: string;
}

interface PropertyRecord {
  id: string;
  address: string;
  owner: string;
  area: string;
  status: 'Registered' | 'Pending' | 'Disputed';
  valuation: string;
  ownershipHistory?: OwnershipTransfer[];
}

// --- Translations ---
const TRANSLATIONS = {
  en: {
    title: "SAMARA LOGIA",
    subtitle: "City Cadaster Office",
    nav: {
      registry: "Registry",
      maps: "Maps",
      services: "Services",
      laws: "Laws",
      portal: "E-PORTAL",
      home: "Home",
      about: "About Us",
      contact: "Contact"
    },
    about: {
      title: "About the Office",
      desc: "The Samara Logia City Cadaster Office is responsible for the maintenance of the city's land records, property valuation, and urban planning data. We ensure legal transparency for all real estate transactions.",
      mission: "Our mission is to provide accurate, accessible, and secure land information services to support the sustainable development of Samara Logia.",
      vision: "To be a leading institution in modern land administration, leveraging technology for the benefit of all citizens."
    },
    hero: {
      title: "Securing the Foundation of Our City.",
      subtitle: "Access the official land registry, view interactive zoning maps, and manage property registrations for Samara Logia.",
      searchPlaceholder: "Search by Cadaster ID or Address...",
      searchBtn: "SEARCH REGISTRY"
    },
    history: {
      title: "Ownership History",
      prevOwner: "Previous Owner",
      date: "Date",
      noHistory: "No previous transfers recorded"
    },
    ai: {
      title: "Cadaster AI Assistant",
      hint: "Ask about registration fees, legal requirements, or zoning laws.",
      placeholder: "e.g. How do I register a new plot?",
      ask: "Ask",
      thinking: "Thinking...",
      systemPrompt: "You are the official AI Assistant for the Samara Logia City Cadaster Office. Answer questions about property registration, land laws, and cadaster procedures in a professional, helpful, and administrative tone."
    },
    services: {
      title: "Our Services",
      desc: "Providing professional administrative support for citizens, businesses, and legal entities.",
      items: [
        { title: 'Property Registration', desc: 'Official recording of ownership transfers, mortgages, and easements.' },
        { title: 'Land Valuation', desc: 'Certified assessment of property value for taxation and legal purposes.' },
        { title: 'Urban Planning', desc: 'Access to zoning maps, development permits, and city growth plans.' },
      ]
    },
    contact: {
      title: "Contact Us",
      desc: "For any questions or information, you can find us at our office during working hours or via the following addresses.",
      address: "Samara, Afar, Ethiopia",
      form: {
        name: "Name",
        email: "Email",
        message: "Your message...",
        send: "Send Message"
      }
    },
    footer: {
      desc: "Dedicated to maintaining the integrity of Samara Logia's land records since 1924. Official portal for property and urban data.",
      rights: "© 2026 Samara Logia City Administration. All rights reserved."
    }
  },
  am: {
    title: "ሰመራ ሎጊያ",
    subtitle: "ከተማ ካዳስተር ጽሕፈት ቤት",
    nav: {
      registry: "መዝገብ",
      maps: "ካርታዎች",
      services: "አገልግሎቶች",
      laws: "ህጎች",
      portal: "ኢ-ፖርታል",
      home: "መነሻ",
      about: "ስለ እኛ",
      contact: "መረጃ"
    },
    about: {
      title: "ስለ ጽሕፈት ቤቱ",
      desc: "የሰመራ ሎጊያ ከተማ ካዳስተር ጽሕፈት ቤት የከተማዋን የመሬት መዛግብት የመጠበቅ፣ የንብረት ግመታ እና የከተማ ፕላን መረጃዎችን የማደራጀት ኃላፊነት አለበት። ለሁሉም የሪል እስቴት ግብይቶች ህጋዊ ግልጽነትን እናረጋግጣለን።",
      mission: "ተልእኳችን ለሰመራ ሎጊያ ዘላቂ ልማት ትክክለኛ፣ ተደራሽ እና ደህንነቱ የተጠበቀ የመሬት መረጃ አገልግሎት መስጠት ነው።",
      vision: "ቴክኖሎጂን ለሁሉም ዜጎች ጥቅም በማዋል በዘመናዊ የመሬት አስተዳደር ግንባር ቀደም ተቋም መሆን።"
    },
    hero: {
      title: "ሰመራ ሎጊያ ከተማ ካዳስተር ጽሕፈት ቤት",
      subtitle: "ዘመናዊና ግልጽ የሆነ የመሬት መረጃ አስተዳደር ስርዓት",
      searchPlaceholder: "በካዳስተር መለያ ወይም አድራሻ ይፈልጉ...",
      searchBtn: "መዝገብ ፈልግ"
    },
    history: {
      title: "የይዞታ ዝውውር ታሪክ",
      prevOwner: "የቀድሞ ባለቤት",
      date: "ቀን",
      noHistory: "ምንም የቀድሞ ዝውውር አልተመዘገበም"
    },
    ai: {
      title: "የካዳስተር AI ረዳት",
      hint: "ስለ ምዝገባ ክፍያዎች፣ ህጋዊ መስፈርቶች ወይም የዞን ክፍፍል ህጎች ይጠይቁ።",
      placeholder: "ምሳሌ፡ አዲስ ይዞታ እንዴት ማስመዝገብ እችላለሁ?",
      ask: "ጠይቅ",
      thinking: "በማሰብ ላይ...",
      systemPrompt: "እርስዎ የሰመራ ሎጊያ ከተማ ካዳስተር ጽሕፈት ቤት ኦፊሴላዊ AI ረዳት ነዎት። ስለ ንብረት ምዝገባ፣ የመሬት ህጎች እና የካዳስተር ሂደቶች ሙያዊ፣ አጋዥ እና አስተዳደራዊ በሆነ ቃና ይመልሱ።"
    },
    services: {
      title: "አገልግሎቶቻችን",
      desc: "ለዜጎች፣ ለንግድ ድርጅቶች እና ለህጋዊ አካላት ሙያዊ አስተዳደራዊ ድጋፍ መስጠት።",
      items: [
        { title: 'የይዞታ ማረጋገጫ', desc: 'ለመሬት ይዞታዎ ህጋዊ የካርታና የባለቤትነት ማረጋገጫ ደብተር የመስጠት አገልግሎት።' },
        { title: 'የመሬት ልኬት', desc: 'ዘመናዊ ቴክኖሎጂን በመጠቀም ትክክለኛ የመሬት ልኬትና የድንበር ማካለል ስራ።' },
        { title: 'የይዞታ ዝውውር', desc: 'የመሬትና ተያያዥ ንብረቶች የሽያጭ፣ የስጦታና የውርስ ዝውውር መረጃዎችን ማደራጀት።' },
      ]
    },
    contact: {
      title: "ያግኙን",
      desc: "ለማንኛውም ጥያቄ ወይም መረጃ በጽህፈት ቤታችን በስራ ሰዓት በመገኘት ወይም በሚከተሉት አድራሻዎች ሊያገኙን ይችላሉ።",
      address: "ሰመራ፣ አፋር፣ ኢትዮጵያ",
      form: {
        name: "ስም",
        email: "ኢሜይል",
        message: "መልዕክትዎ...",
        send: "መልዕክት ላክ"
      }
    },
    footer: {
      desc: "ከ1924 ጀምሮ የሰመራ ሎጊያን የመሬት መዛግብት ታማኝነት ለመጠበቅ ቁርጠኛ ነው። የንብረት እና የከተማ መረጃ ኦፊሴላዊ ፖርታል።",
      rights: "© 2026 ሰመራ ሎጊያ ከተማ ካዳስተር ጽሕፈት ቤት። መብቱ በህግ የተጠበቀ ነው።"
    }
  }
};

// --- Mock Data ---
const MOCK_RECORDS: PropertyRecord[] = [
  { 
    id: 'SL-102-44-A', 
    address: '124 Emerald Heights, District 4', 
    owner: 'Logia Development Corp', 
    area: '450 m²', 
    status: 'Registered', 
    valuation: '€1.2M',
    ownershipHistory: [
      { previousOwner: 'Abebe Bikila', date: '2018-05-12' },
      { previousOwner: 'City Administration', date: '2010-01-01' }
    ]
  },
  { 
    id: 'SL-105-12-B', 
    address: '88 Silver Lake Rd, District 2', 
    owner: 'Elena Volkov', 
    area: '1,200 m²', 
    status: 'Registered', 
    valuation: '€3.5M',
    ownershipHistory: [
      { previousOwner: 'Dmitri Volkov', date: '2022-11-20' }
    ]
  },
  { 
    id: 'SL-201-09-C', 
    address: 'Sector 7G, Industrial Zone', 
    owner: 'Samara Energy', 
    area: '15,000 m²', 
    status: 'Pending', 
    valuation: '€12.8M',
    ownershipHistory: []
  },
];

// --- Components ---

const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <nav className="sticky top-0 z-50 bg-cadaster-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cadaster-gold p-2 rounded-sm">
              <Landmark className="w-8 h-8 text-cadaster-blue" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-tight leading-none">{t.title}</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-sans">{t.subtitle}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
            <a href="#" className="nav-link">{t.nav.home}</a>
            <a href="#services" className="nav-link">{t.nav.services}</a>
            <a href="#about" className="nav-link">{t.nav.about}</a>
            <a href="#contact" className="nav-link">{t.nav.contact}</a>
            
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors"
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs">{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button className="bg-cadaster-gold text-cadaster-blue px-5 py-2 rounded-sm font-bold hover:bg-white transition-all">
              {t.nav.portal}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="p-2 bg-white/10 rounded"
            >
              <Languages className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-white/10"
          >
            <div className="px-4 py-6 flex flex-col gap-4 text-sm uppercase tracking-widest">
              <a href="#">{t.nav.home}</a>
              <a href="#services">{t.nav.services}</a>
              <a href="#contact">{t.nav.contact}</a>
              <button className="bg-cadaster-gold text-cadaster-blue px-5 py-3 rounded-sm font-bold">
                {t.nav.portal} LOGIN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AICadasterAssistant = ({ lang }: { lang: Language }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang].ai;

  const askAI = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      const result = await ai.models.generateContent({
        model,
        contents: `${t.systemPrompt} User asks: ${query}`,
      });
      setResponse(result.text || "I'm sorry, I couldn't process that request.");
    } catch (err) {
      setResponse("The assistant is currently offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
      <div className="bg-cadaster-blue p-4 text-white flex items-center gap-3">
        <MessageSquare className="w-5 h-5 text-cadaster-gold" />
        <span className="font-medium">{t.title}</span>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-4 italic">{t.hint}</p>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-cadaster-blue outline-none"
          />
          <button 
            onClick={askAI}
            disabled={loading}
            className="bg-cadaster-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? t.thinking : t.ask}
          </button>
        </div>
        {response && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed prose prose-slate max-w-none"
          >
            <Markdown>{response}</Markdown>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const MapVisualization = () => {
  return (
    <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-slate-400" />
        ))}
      </div>
      
      <div className="absolute inset-0 p-8 flex items-center justify-center">
        <div className="relative w-full h-full">
          <motion.div 
            whileHover={{ scale: 1.05, backgroundColor: '#C5A059' }}
            className="absolute top-10 left-20 w-32 h-24 bg-cadaster-blue/20 border-2 border-cadaster-blue flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-mono font-bold">SL-102</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, backgroundColor: '#C5A059' }}
            className="absolute top-40 left-60 w-48 h-32 bg-cadaster-blue/20 border-2 border-cadaster-blue flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-mono font-bold">SL-205</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, backgroundColor: '#C5A059' }}
            className="absolute bottom-10 right-20 w-40 h-40 bg-cadaster-blue/20 border-2 border-cadaster-blue flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-mono font-bold">SL-99-X</span>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          Interactive Parcel Viewer
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('am');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PropertyRecord[]>([]);
  const t = TRANSLATIONS[lang];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = MOCK_RECORDS.filter(r => 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} setLang={setLang} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 bg-cadaster-blue text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight"
              >
                {t.hero.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-slate-300 mb-10 font-light leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary whitespace-nowrap font-bold">
                  {t.hero.searchBtn}
                </button>
              </motion.form>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {results.length > 0 && (
          <section className="py-12 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-slate-800">Search Results</h3>
                <button onClick={() => setResults([])} className="text-sm text-slate-500 hover:text-cadaster-blue underline">Clear results</button>
              </div>
              <div className="grid gap-4">
                {results.map((record) => (
                  <motion.div 
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <Database className="w-6 h-6 text-cadaster-blue" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-cadaster-gold uppercase tracking-tighter">{record.id}</span>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                            record.status === 'Registered' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {record.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{record.address}</h4>
                        <p className="text-sm text-slate-500">Owner: {record.owner}</p>
                        
                        {/* Ownership History */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                            <History className="w-3 h-3" />
                            {(t as any).history.title}
                          </h5>
                          {record.ownershipHistory && record.ownershipHistory.length > 0 ? (
                            <div className="space-y-2">
                              {record.ownershipHistory.map((entry, idx) => (
                                <div key={idx} className="flex justify-between text-xs items-center bg-slate-50 p-2 rounded">
                                  <span className="text-slate-600 font-medium">
                                    <span className="text-slate-400 mr-1">{(t as any).history.prevOwner}:</span>
                                    {entry.previousOwner}
                                  </span>
                                  <span className="text-slate-400 font-mono">
                                    <span className="mr-1">{(t as any).history.date}:</span>
                                    {entry.date}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">{(t as any).history.noHistory}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">{t.services.title}</h3>
              <div className="w-20 h-1 bg-cadaster-blue mx-auto mb-6"></div>
              <p className="text-slate-500 max-w-2xl mx-auto">{t.services.desc}</p>
            </div>
            
            <div className="grid-container">
              {t.services.items.map((service, i) => (
                <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-cadaster-gold/20 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-cadaster-blue transition-colors">
                    {i === 0 ? <FileText className="w-6 h-6 text-cadaster-blue group-hover:text-white" /> : 
                     i === 1 ? <Layers className="w-6 h-6 text-cadaster-blue group-hover:text-white" /> : 
                     <ShieldCheck className="w-6 h-6 text-cadaster-blue group-hover:text-white" />}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">{(t as any).about.title}</h3>
              <div className="w-20 h-1 bg-cadaster-blue mx-auto"></div>
            </div>
            <div className="grid-container">
              <div className="about-card">
                <h4 className="text-xl font-bold mb-4 text-primary-blue">Mission</h4>
                <p className="text-slate-600 leading-relaxed">{(t as any).about.mission}</p>
              </div>
              <div className="about-card">
                <h4 className="text-xl font-bold mb-4 text-primary-blue">Vision</h4>
                <p className="text-slate-600 leading-relaxed">{(t as any).about.vision}</p>
              </div>
              <div className="about-card">
                <h4 className="text-xl font-bold mb-4 text-primary-blue">Values</h4>
                <p className="text-slate-600 leading-relaxed">Integrity, Transparency, Efficiency, and Innovation in all our services.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Map & AI Section */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-6 text-slate-900">Interactive Cadaster Map</h3>
                <MapVisualization />
              </div>
              <AICadasterAssistant lang={lang} />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-6">{t.contact.title}</h3>
                <p className="text-slate-600 mb-8">{t.contact.desc}</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><MapPin /></div>
                    <span>{t.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Phone /></div>
                    <span>+251 33 000 0000</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Mail /></div>
                    <span>info@slcadaster.gov.et</span>
                  </div>
                </div>
              </div>
              <form className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <input type="text" placeholder={t.contact.form.name} className="w-full mb-4 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" />
                <input type="email" placeholder={t.contact.form.email} className="w-full mb-4 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" />
                <textarea placeholder={t.contact.form.message} className="w-full mb-4 p-3 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-cadaster-blue outline-none"></textarea>
                <button className="w-full btn-primary font-bold">
                  {t.contact.form.send}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cadaster-blue text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-cadaster-gold" />
              <h1 className="font-serif font-bold text-white text-xl">{t.title}</h1>
            </div>
            <p className="max-w-md text-sm text-center md:text-right">{t.footer.desc}</p>
          </div>
          <p className="text-center text-xs uppercase tracking-widest">{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
