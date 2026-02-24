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
  History,
  Facebook,
  Twitter,
  Send,
  Zap,
  Box
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

interface Applicant {
  name: string;
  type: string;
  date: string;
  status: string;
  details: string;
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
    applicants: {
      title: "New Registration Applicants",
      subtitle: "Recent applications currently being processed by the Cadaster Office.",
      name: "Applicant Name",
      type: "Property Type",
      date: "Application Date",
      status: "Status",
      details: "Details"
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
    registration: {
      title: "Property Registration Portal",
      subtitle: "Submit your application for new land registration or ownership transfer.",
      form: {
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        subcityKebele: "Subcity / Kebele",
        houseNumber: "House Number",
        areaSqm: "Area (sqm)",
        documents: "Supporting Documents (PDF/JPG)",
        submit: "Submit Application",
        success: "Application submitted successfully! Your tracking ID is: "
      }
    },
    news: {
      title: "News & Announcements",
      subtitle: "Stay updated with the latest developments in Samara Logia's urban planning and land administration.",
      more: "Read More"
    },
    portalLogin: {
      title: "E-Portal Login",
      username: "Username / Email",
      password: "Password",
      login: "Login",
      forgot: "Forgot Password?",
      noAccount: "Don't have an account? Contact the office."
    },
    newsAdmin: {
      title: "News Management",
      write: "Write New Article",
      upload: "Upload Image",
      publish: "Publish News",
      placeholderTitle: "Enter news title...",
      placeholderDesc: "Enter news description...",
      success: "News published successfully!"
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
    applicants: {
      title: "አዲስ የይዞታ አስመዝጋቢ አመልካቾች",
      subtitle: "በካዳስተር ጽሕፈት ቤት በመታየት ላይ ያሉ የቅርብ ጊዜ ማመልከቻዎች።",
      name: "የአመልካች ስም",
      type: "የይዞታ ዓይነት",
      date: "የማመልከቻ ቀን",
      status: "ሁኔታ",
      details: "ዝርዝር መረጃ"
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
    registration: {
      title: "የይዞታ ምዝገባ ፖርታል",
      subtitle: "ለአዲስ የመሬት ምዝገባ ወይም የባለቤትነት ዝውውር ማመልከቻዎን ያስገቡ።",
      form: {
        fullName: "ሙሉ ስም",
        phoneNumber: "ስልክ ቁጥር",
        subcityKebele: "ክፍለ ከተማ / ቀበሌ",
        houseNumber: "የቤት ቁጥር",
        areaSqm: "የይዞታ ስፋት (በካሬ ሜትር)",
        documents: "ደጋፊ ሰነዶች (PDF/JPG)",
        submit: "ማመልከቻ አስገባ",
        success: "ማመልከቻዎ በተሳካ ሁኔታ ገብቷል! የመከታተያ መለያዎ፡ "
      }
    },
    news: {
      title: "ዜና እና ማስታወቂያዎች",
      subtitle: "በሰመራ ሎጊያ የከተማ ፕላን እና የመሬት አስተዳደር የቅርብ ጊዜ መረጃዎችን ያግኙ።",
      more: "ተጨማሪ ያንብቡ"
    },
    portalLogin: {
      title: "የኢ-ፖርታል መግቢያ",
      username: "የተጠቃሚ ስም / ኢሜይል",
      password: "የይለፍ ቃል",
      login: "ግባ",
      forgot: "የይለፍ ቃል ረስተዋል?",
      noAccount: "መለያ የለዎትም? ጽህፈት ቤቱን ያነጋግሩ።"
    },
    newsAdmin: {
      title: "የዜና አስተዳደር",
      write: "አዲስ ዜና ጻፍ",
      upload: "ምስል አክል",
      publish: "ዜናውን አውጣ",
      placeholderTitle: "የዜናውን ርዕስ ያስገቡ...",
      placeholderDesc: "የዜናውን ዝርዝር መረጃ ያስገቡ...",
      success: "ዜናው በተሳካ ሁኔታ ወጥቷል!"
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
  { id: 'SL-301-01-D', address: '101 Blue Nile St', owner: 'Abebe Kebede', area: '300 m²', status: 'Registered', valuation: '€500K' },
  { id: 'SL-301-02-E', address: '102 Blue Nile St', owner: 'Mulugeta Tesfaye', area: '300 m²', status: 'Registered', valuation: '€510K' },
  { id: 'SL-301-03-F', address: '103 Blue Nile St', owner: 'Aster Aweke', area: '300 m²', status: 'Registered', valuation: '€520K' },
  { id: 'SL-301-04-G', address: '104 Blue Nile St', owner: 'Tilahun Gessesse', area: '300 m²', status: 'Registered', valuation: '€530K' },
  { id: 'SL-301-05-H', address: '105 Blue Nile St', owner: 'Mahmoud Ahmed', area: '300 m²', status: 'Registered', valuation: '€540K' },
  { id: 'SL-301-06-I', address: '106 Blue Nile St', owner: 'Gigi Shibabaw', area: '300 m²', status: 'Registered', valuation: '€550K' },
  { id: 'SL-301-07-J', address: '107 Blue Nile St', owner: 'Teddy Afro', area: '300 m²', status: 'Registered', valuation: '€560K' },
  { id: 'SL-301-08-K', address: '108 Blue Nile St', owner: 'Zeritu Kebede', area: '300 m²', status: 'Registered', valuation: '€570K' },
  { id: 'SL-301-09-L', address: '109 Blue Nile St', owner: 'Gossaye Tesfaye', area: '300 m²', status: 'Registered', valuation: '€580K' },
  { id: 'SL-301-10-M', address: '110 Blue Nile St', owner: 'Ejigayehu Shibabaw', area: '300 m²', status: 'Registered', valuation: '€590K' },
  { id: 'SL-301-11-N', address: '111 Blue Nile St', owner: 'Haile Gebrselassie', area: '300 m²', status: 'Registered', valuation: '€600K' },
];

const MOCK_APPLICANTS: Applicant[] = [
  { name: 'Mohammed Afar', type: 'Residential', date: '2026-02-15', status: 'In Review', details: 'Waiting for site survey confirmation.' },
  { name: 'Fatuma Ali', type: 'Commercial', date: '2026-02-18', status: 'Pending Inspection', details: 'Zoning compliance check in progress.' },
  { name: 'Girma Wolde', type: 'Industrial', date: '2026-02-20', status: 'Document Verification', details: 'Authenticating ownership certificates.' },
  { name: 'Zahra Hassan', type: 'Residential', date: '2026-02-22', status: 'Initial Stage', details: 'Application received and logged.' },
];

// --- Components ---

const LoginModal = ({ isOpen, onClose, lang, onLoginSuccess }: { isOpen: boolean, onClose: () => void, lang: Language, onLoginSuccess: () => void }) => {
  const t = TRANSLATIONS[lang].portalLogin;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials: Oumar Halato Mohammed / Semera@2026
    if (username === 'Oumar Halato Mohammed' && password === 'Semera@2026') {
      onLoginSuccess();
      onClose();
      setError(null);
    } else {
      setError(lang === 'en' ? 'Invalid credentials' : 'የተሳሳተ መለያ');
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-cadaster-blue p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-cadaster-gold" />
                <h3 className="text-xl font-bold">{t.title}</h3>
              </div>
              <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors">
                <X />
              </button>
            </div>
            <div className="p-8">
              <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.username}</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.password}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                  />
                </div>
                <button type="submit" className="w-full btn-primary font-bold py-3">
                  {t.login}
                </button>
                <div className="flex justify-between items-center text-xs">
                  <a href="#" className="text-cadaster-blue hover:underline">{t.forgot}</a>
                </div>
              </form>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">{t.noAccount}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const NewsAdmin = ({ lang, onBack }: { lang: Language, onBack: () => void }) => {
  const t = TRANSLATIONS[lang].newsAdmin;
  const [newsForm, setNewsForm] = useState({ title: '', desc: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setNewsForm({ title: '', desc: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-cadaster-blue font-bold mb-8 hover:underline">
          <ChevronRight className="rotate-180" /> Back to Home
        </button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          <div className="bg-cadaster-blue p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FileText className="text-cadaster-gold" /> {t.title}
            </h2>
          </div>
          
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-emerald-100 text-emerald-700 p-4 rounded-lg font-bold text-center"
              >
                {t.success}
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.write}</label>
              <input 
                type="text" 
                value={newsForm.title}
                onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                placeholder={t.placeholderTitle}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cadaster-blue outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea 
                rows={6}
                value={newsForm.desc}
                onChange={(e) => setNewsForm({...newsForm, desc: e.target.value})}
                placeholder={t.placeholderDesc}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cadaster-blue outline-none resize-none"
                required
              />
            </div>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-cadaster-blue transition-colors cursor-pointer group">
              <div className="flex flex-col items-center gap-2">
                <Layers className="w-8 h-8 text-slate-400 group-hover:text-cadaster-blue" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-cadaster-blue">{t.upload}</span>
              </div>
            </div>
            
            <button type="submit" className="w-full btn-primary py-4 text-lg font-bold">
              {t.publish}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const Navbar = ({ lang, setLang, onLogin }: { lang: Language, setLang: (l: Language) => void, onLogin: () => void }) => {
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
            <a href="#" className="nav-link focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded-sm">{t.nav.home}</a>
            <a href="#services" className="nav-link focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded-sm">{t.nav.services}</a>
            <a href="#registration" className="nav-link focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded-sm">{t.nav.registry}</a>
            <a href="#about" className="nav-link focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded-sm">{t.nav.about}</a>
            <a href="#contact" className="nav-link focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded-sm">{t.nav.contact}</a>
            
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold"
              aria-label={lang === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs">{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button 
              onClick={onLogin}
              className="bg-cadaster-gold text-cadaster-blue px-5 py-2 rounded-sm font-bold hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              {t.nav.portal}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="p-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-cadaster-gold"
              aria-label={lang === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}
            >
              <Languages className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded p-1"
            >
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
              <button 
                onClick={() => {
                  onLogin();
                  setIsOpen(false);
                }}
                className="bg-cadaster-gold text-cadaster-blue px-5 py-3 rounded-sm font-bold"
              >
                {t.nav.portal} LOGIN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NewsSection = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].news;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const newsItems = [
    {
      date: "Feb 20, 2026",
      title: lang === 'en' ? "New Zoning Regulations for District 4" : "ለዲስትሪክት 4 አዲስ የዞን ክፍፍል ደንቦች",
      desc: lang === 'en' ? "The city council has approved updated zoning laws to encourage residential development." : "የከተማው ምክር ቤት የመኖሪያ ቤት ልማትን ለማበረታታት የተሻሻሉ የዞን ክፍፍል ህጎችን አጽድቋል።",
      longDesc: lang === 'en' 
        ? "These new regulations simplify the process for converting commercial spaces into residential units, aiming to address the housing shortage in the district. The changes include reduced setback requirements and increased density allowances for sustainable housing projects."
        : "እነዚህ አዳዲስ ደንቦች የንግድ ቦታዎችን ወደ መኖሪያነት የመቀየር ሂደትን ያቃልላሉ፣ ይህም በዲስትሪክቱ ያለውን የቤት እጥረት ለመፍታት ያለመ ነው። ለውጦቹ ለዘላቂ የቤት ግንባታ ፕሮጀክቶች የተቀነሰ የቦታ መስፈርቶችን እና የጨመረ የጥግግት አበልን ያካትታሉ።"
    },
    {
      date: "Feb 15, 2026",
      title: lang === 'en' ? "Digital Land Registry Phase 2 Launch" : "የዲጂታል መሬት መዝገብ ሁለተኛ ምዕራፍ ጅምር",
      desc: lang === 'en' ? "We are expanding our online services to include automated ownership transfer requests." : "አውቶማቲክ የባለቤትነት ዝውውር ጥያቄዎችን ለማካተት የመስመር ላይ አገልግሎቶቻችንን እያሰፋን ነው።",
      longDesc: lang === 'en'
        ? "Phase 2 introduces a fully digital workflow for property transfers, reducing processing time from weeks to days. Citizens can now upload documents, track application status, and receive digital certificates through the E-Portal."
        : "ሁለተኛው ምዕራፍ ለንብረት ዝውውር ሙሉ በሙሉ ዲጂታል የሆነ የስራ ሂደትን ያስተዋውቃል፣ ይህም የማስኬጃ ጊዜን ከሳምንታት ወደ ቀናት ይቀንሳል። ዜጎች አሁን ሰነዶችን መጫን፣ የማመልከቻ ሁኔታን መከታተል እና በኢ-ፖርታል በኩል ዲጂታል የምስክር ወረቀቶችን መቀበል ይችላሉ።"
    },
    {
      date: "Feb 10, 2026",
      title: lang === 'en' ? "Public Consultation: Urban Green Spaces" : "የህዝብ ምክክር፡ የከተማ አረንጓዴ ቦታዎች",
      desc: lang === 'en' ? "Join us this Friday to discuss the proposed park developments in Sector 7." : "በሴክተር 7 የታቀዱ የፓርክ ልማቶችን ለመወያየት በዚህ አርብ ይቀላቀሉን።",
      longDesc: lang === 'en'
        ? "The consultation will focus on the design of three new community parks. We invite residents to share their ideas on playground equipment, walking trails, and native plant selections to ensure these spaces meet the needs of all age groups."
        : "ምክክሩ በሶስት አዳዲስ የማህበረሰብ ፓርኮች ዲዛይን ላይ ያተኩራል። እነዚህ ቦታዎች የሁሉንም የዕድሜ ቡድኖች ፍላጎት እንዲያሟሉ ነዋሪዎች ስለ መጫወቻ መሳሪያዎች፣ የእግር ጉዞ መንገዶች እና የአገር በቀል ተክሎች ምርጫ ሃሳባቸውን እንዲያካፍሉ እንጋብዛለን።"
    },
    {
      date: "Feb 05, 2026",
      title: lang === 'en' ? "Office Closure Notice" : "የጽህፈት ቤት መዝጊያ ማስታወቂያ",
      desc: lang === 'en' ? "The Cadaster Office will be closed for a public holiday on March 2nd." : "የካዳስተር ጽህፈት ቤት ለመጋቢት 2 የህዝብ በዓል ዝግ ይሆናል።",
      longDesc: lang === 'en'
        ? "Please note that all administrative services, including the physical help desk, will be unavailable. However, the E-Portal will remain operational for online submissions and tracking."
        : "እባክዎን አካላዊ የእርዳታ መስጫ ጠረጴዛን ጨምሮ ሁሉም የአስተዳደር አገልግሎቶች የማይገኙ መሆናቸውን ልብ ይበሉ። ሆኖም ኢ-ፖርታሉ ለመስመር ላይ ማቅረቢያዎች እና ክትትል ስራውን ይቀጥላል።"
    },
    {
      date: "Jan 28, 2026",
      title: lang === 'en' ? "Property Valuation Workshop" : "የንብረት ግመታ ወርክሾፕ",
      desc: lang === 'en' ? "A workshop for real estate developers on the new valuation methodologies." : "ለሪል እስቴት አልሚዎች ስለ አዲሱ የግመታ ዘዴዎች የተዘጋጀ ወርክሾፕ።",
      longDesc: lang === 'en'
        ? "This technical workshop will cover the transition to market-based valuation models. Experts from the Ministry of Urban Development will present the new criteria and tools used for certified assessments."
        : "ይህ ቴክኒካዊ ወርክሾፕ ወደ ገበያ ተኮር የግመታ ሞዴሎች የሚደረገውን ሽግግር ይሸፍናል። ከከተማ ልማት ሚኒስቴር የተውጣጡ ባለሙያዎች ለተረጋገጡ ግምገማዎች ጥቅም ላይ የሚውሉ አዳዲስ መስፈርቶችን እና መሳሪያዎችን ያቀርባሉ።"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">{t.title}</h3>
          <div className="w-20 h-1 bg-cadaster-gold mx-auto mb-6"></div>
          <p className="text-slate-500 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {newsItems.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
            >
              <div className="h-48 bg-slate-200 relative">
                <img 
                  src={`https://picsum.photos/seed/news${i}/800/600`} 
                  alt="News thumbnail" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-cadaster-blue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {item.date}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{item.title}</h4>
                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                
                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-slate-600 pt-2 border-t border-slate-100 mb-6 leading-relaxed">
                        {item.longDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-auto">
                  <button 
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="text-cadaster-blue font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    {expandedIndex === i ? (lang === 'en' ? 'Show Less' : 'ያነሰ አሳይ') : t.more} 
                    <ArrowRight className={cn("w-4 h-4 transition-transform", expandedIndex === i && "-rotate-90")} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
        <label htmlFor="ai-query" className="text-sm text-slate-500 mb-4 italic block">{t.hint}</label>
        <div className="flex gap-2 mb-4">
          <input 
            id="ai-query"
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
  const [layers, setLayers] = useState({
    parcels: true,
    zoning: false,
    utilities: false
  });
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);

  const parcels = [
    { id: 'SL-102', pos: 'top-10 left-20', size: 'w-32 h-24', owner: 'Logia Development Corp', area: '450 m²' },
    { id: 'SL-205', pos: 'top-40 left-60', size: 'w-48 h-32', owner: 'Elena Volkov', area: '1,200 m²' },
    { id: 'SL-99-X', pos: 'bottom-10 right-20', size: 'w-40 h-40', owner: 'Samara Energy', area: '15,000 m²' },
  ];

  return (
    <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
      {/* Base Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="border border-slate-400" />
        ))}
      </div>
      
      {/* Zoning Layer */}
      <AnimatePresence>
        {layers.zoning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/20 border-r-4 border-emerald-500/40 border-dashed" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Utilities Layer */}
      <AnimatePresence>
        {layers.utilities && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <svg className="w-full h-full" viewBox="0 0 600 300">
              <path d="M 0 50 Q 150 0 300 50 T 600 50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 0 150 Q 150 100 300 150 T 600 150" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 100 0 L 100 300" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 400 0 L 400 300" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parcels Layer */}
      <div className="absolute inset-0 p-8 flex items-center justify-center">
        <div className="relative w-full h-full">
          {layers.parcels && parcels.map((p) => (
            <motion.div 
              key={p.id}
              role="button"
              tabIndex={0}
              aria-label={`Parcel ${p.id}`}
              onClick={() => setSelectedParcel(selectedParcel === p.id ? null : p.id)}
              whileHover={{ scale: 1.05, backgroundColor: '#C5A059' }}
              className={cn(
                "absolute bg-cadaster-blue/20 border-2 border-cadaster-blue flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold",
                p.pos, p.size,
                selectedParcel === p.id && "bg-cadaster-gold/40 border-cadaster-gold z-20"
              )}
            >
              <span className="text-[10px] font-mono font-bold">{p.id}</span>
              
              {selectedParcel === p.id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full mt-2 left-0 bg-white p-3 rounded shadow-xl border border-slate-200 z-30 min-w-[150px] pointer-events-auto"
                >
                  <p className="text-[10px] font-bold text-cadaster-blue mb-1">{p.id}</p>
                  <p className="text-[9px] text-slate-600">Owner: {p.owner}</p>
                  <p className="text-[9px] text-slate-600">Area: {p.area}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={() => setLayers({...layers, parcels: !layers.parcels})}
          className={cn(
            "p-2 rounded-lg shadow-lg border transition-all",
            layers.parcels ? "bg-cadaster-blue text-white border-cadaster-blue" : "bg-white text-slate-400 border-slate-200"
          )}
          title="Toggle Parcels"
        >
          <Database className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setLayers({...layers, zoning: !layers.zoning})}
          className={cn(
            "p-2 rounded-lg shadow-lg border transition-all",
            layers.zoning ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-400 border-slate-200"
          )}
          title="Toggle Zoning"
        >
          <Box className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setLayers({...layers, utilities: !layers.utilities})}
          className={cn(
            "p-2 rounded-lg shadow-lg border transition-all",
            layers.utilities ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-400 border-slate-200"
          )}
          title="Toggle Utilities"
        >
          <Zap className="w-4 h-4" />
        </button>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const RECORDS_PER_PAGE = 10;

  const [regForm, setRegForm] = useState({
    fullName: '',
    phoneNumber: '',
    subcityKebele: '',
    houseNumber: '',
    areaSqm: ''
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [regStatus, setRegStatus] = useState<{ success: boolean; id?: number } | null>(null);
  const t = TRANSLATIONS[lang];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = MOCK_RECORDS.filter(r => 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
    setCurrentPage(1);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', regForm.fullName);
      formData.append('phoneNumber', regForm.phoneNumber);
      formData.append('subcityKebele', regForm.subcityKebele);
      formData.append('houseNumber', regForm.houseNumber);
      formData.append('areaSqm', regForm.areaSqm);
      if (documentFile) {
        formData.append('document', documentFile);
      }

      const response = await fetch('/api/registrations', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setRegStatus({ success: true, id: data.id });
        setRegForm({ fullName: '', phoneNumber: '', subcityKebele: '', houseNumber: '', areaSqm: '' });
        setDocumentFile(null);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const totalPages = Math.ceil(results.length / RECORDS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      {isAdminView ? (
        <NewsAdmin lang={lang} onBack={() => setIsAdminView(false)} />
      ) : (
        <>
          <Navbar lang={lang} setLang={setLang} onLogin={() => setIsLoginOpen(true)} />
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} lang={lang} onLoginSuccess={() => setIsAdminView(true)} />

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
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" aria-hidden="true" />
                  <input 
                    id="hero-search"
                    type="text" 
                    aria-label={t.hero.searchPlaceholder}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none transition-all focus:ring-2 focus:ring-cadaster-gold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary whitespace-nowrap font-bold focus:ring-2 focus:ring-white">
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
                {paginatedResults.map((record) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-4">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={cn(
                          "w-8 h-8 rounded-full text-sm font-bold transition-all",
                          currentPage === i + 1 
                            ? "bg-cadaster-blue text-white" 
                            : "hover:bg-slate-200 text-slate-600"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-30 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
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

        {/* News Section */}
        <NewsSection lang={lang} />

        {/* Registration Portal Section */}
        <section id="registration" className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">{(t as any).registration.title}</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">{(t as any).registration.subtitle}</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><ShieldCheck className="w-5 h-5" /></div>
                    <div>
                      <h5 className="font-bold text-slate-900">Secure Processing</h5>
                      <p className="text-sm text-slate-500">All applications are encrypted and processed through official government channels.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText className="w-5 h-5" /></div>
                    <div>
                      <h5 className="font-bold text-slate-900">Document Tracking</h5>
                      <p className="text-sm text-slate-500">Receive a unique tracking ID to monitor your application status in real-time.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200"
              >
                {regStatus?.success ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Success!</h4>
                    <p className="text-slate-600">{(t as any).registration.form.success} <span className="font-mono font-bold text-cadaster-blue">REG-{regStatus.id}</span></p>
                    <button 
                      onClick={() => setRegStatus(null)}
                      className="mt-8 text-cadaster-blue font-bold hover:underline"
                    >
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleRegSubmit}>
                    <div>
                      <label htmlFor="reg-fullname" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.fullName}</label>
                      <input 
                        id="reg-fullname"
                        type="text" 
                        required
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({...regForm, fullName: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-phone" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.phoneNumber}</label>
                      <input 
                        id="reg-phone"
                        type="text" 
                        required
                        value={regForm.phoneNumber}
                        onChange={(e) => setRegForm({...regForm, phoneNumber: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="reg-subcity" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.subcityKebele}</label>
                        <input 
                          id="reg-subcity"
                          type="text" 
                          value={regForm.subcityKebele}
                          onChange={(e) => setRegForm({...regForm, subcityKebele: e.target.value})}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-house" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.houseNumber}</label>
                        <input 
                          id="reg-house"
                          type="text" 
                          value={regForm.houseNumber}
                          onChange={(e) => setRegForm({...regForm, houseNumber: e.target.value})}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-area" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.areaSqm}</label>
                      <input 
                        id="reg-area"
                        type="number" 
                        value={regForm.areaSqm}
                        onChange={(e) => setRegForm({...regForm, areaSqm: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" 
                      />
                    </div>
                    <div>
                      <label htmlFor="reg-documents" className="block text-sm font-bold text-slate-700 mb-2">{(t as any).registration.form.documents}</label>
                      <input 
                        id="reg-documents"
                        type="file" 
                        onChange={(e) => setDocumentFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none bg-slate-50 text-sm" 
                      />
                    </div>
                    <button type="submit" className="w-full btn-primary font-bold mt-4">
                      {(t as any).registration.form.submit}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* New Applicants Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">{(t as any).applicants.title}</h3>
              <div className="w-20 h-1 bg-cadaster-gold mx-auto mb-6"></div>
              <p className="text-slate-500 max-w-2xl mx-auto">{(t as any).applicants.subtitle}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest">{(t as any).applicants.name}</th>
                    <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest">{(t as any).applicants.type}</th>
                    <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest">{(t as any).applicants.date}</th>
                    <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest">{(t as any).applicants.status}</th>
                    <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest">{(t as any).applicants.details}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_APPLICANTS.map((applicant, i) => (
                    <motion.tr 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">{applicant.name}</td>
                      <td className="py-4 px-6 text-slate-600">{applicant.type}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-sm">{applicant.date}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {applicant.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-sm">{applicant.details}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
                    <span>+251 91 068 0654</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Mail /></div>
                    <span>samaralogya.landoffice@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Facebook /></div>
                    <a href="https://www.facebook.com/share/1B2thsBjZn/" target="_blank" rel="noopener noreferrer" className="hover:text-cadaster-blue transition-colors">
                      Facebook
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Twitter /></div>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-cadaster-blue transition-colors">
                      Twitter (X)
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-full text-cadaster-blue"><Send /></div>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-cadaster-blue transition-colors">
                      Telegram
                    </a>
                  </div>
                </div>
              </div>
              <form className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <div className="mb-4">
                  <label htmlFor="contact-name" className="sr-only">{t.contact.form.name}</label>
                  <input id="contact-name" type="text" placeholder={t.contact.form.name} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact-email" className="sr-only">{t.contact.form.email}</label>
                  <input id="contact-email" type="email" placeholder={t.contact.form.email} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cadaster-blue outline-none" />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact-message" className="sr-only">{t.contact.form.message}</label>
                  <textarea id="contact-message" placeholder={t.contact.form.message} className="w-full p-3 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-cadaster-blue outline-none"></textarea>
                </div>
                <button type="submit" className="w-full btn-primary font-bold focus:ring-2 focus:ring-cadaster-blue focus:ring-offset-2">
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
            <div className="flex flex-col items-center md:items-end gap-4">
              <p className="max-w-md text-sm text-center md:text-right">{t.footer.desc}</p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1B2thsBjZn/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cadaster-gold transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded" aria-label="Visit our Facebook page">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cadaster-gold transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded" aria-label="Visit our Twitter page">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cadaster-gold transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded" aria-label="Join our Telegram channel">
                  <Send className="w-5 h-5" />
                </a>
                <a href="mailto:samaralogya.landoffice@gmail.com" className="text-white hover:text-cadaster-gold transition-colors focus:outline-none focus:ring-2 focus:ring-cadaster-gold rounded" aria-label="Send us an email">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-xs uppercase tracking-widest">{t.footer.rights}</p>
        </div>
      </footer>
    </>
  )}
</div>
  );
}
