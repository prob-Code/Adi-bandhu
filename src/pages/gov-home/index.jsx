import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { getNews, getSchemes, getImportantLinks, getGallery } from '../../utils/dataProviders';

const palette = {
  navy: '#002147',
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
};

const translations = {
  en: {
    title: 'Ministry of Tribal Affairs',
    mission: 'Empowering tribal communities through inclusive development, rights, and opportunities.',
    nav: ['Home', 'About Us', 'Schemes', 'Services', 'Documents', 'Contact'],
    latest: 'Latest Updates',
    schemes: 'Schemes & Programs',
    links: 'Important Links',
    gallery: 'Gallery & Events',
    quick: 'Quick Links',
    rti: 'RTI',
    tenders: 'Tenders',
    downloads: 'Downloads',
    charter: 'Citizen Charter',
    helpline: 'Helpline',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    feedback: 'Feedback',
    lang: 'English',
    contrast: 'High Contrast',
  },
  hi: {
    title: 'जनजातीय कार्य मंत्रालय',
    mission: 'समावेश�� विकास, अधिकार और अवसरों के माध्यम से जनजातीय समुदायों को सशक्त बनाना।',
    nav: ['मुख्य पृष्ठ', 'हमारे बारे में', 'योजनाएं', 'सेवाएं', 'दस्तावेज़', 'संपर्क'],
    latest: 'ताज़ा अपडेट',
    schemes: 'योजनाएं और कार्यक्रम',
    links: 'महत्वपूर्ण लिंक',
    gallery: 'गैलरी एवं कार्यक्रम',
    quick: 'त्वरित लिंक',
    rti: 'सूचना का अधिकार',
    tenders: 'निविदाएं',
    downloads: 'डाउनलोड',
    charter: 'नागरिक चार्टर',
    helpline: 'हेल्पलाइन',
    privacy: 'गोपनीयता नीति',
    terms: 'उपयोग की शर्तें',
    feedback: 'प्रतिक्रिया',
    lang: 'हिंदी',
    contrast: 'हाई कॉन्ट्रास्ट',
  },
};

function GovHeader({ lang, setLang, fontScale, setFontScale, highContrast, setHighContrast }) {
  const t = translations[lang];
  return (
    <header className="w-full border-b border-border" style={{ backgroundColor: palette.white }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Emblem_of_India.svg" alt="Government of India Emblem" className="w-10 h-10" />
            <div>
              <div className="font-bold text-xl" style={{ color: palette.navy }}>{t.title}</div>
              <div className="text-sm" style={{ color: palette.green }}>Government of India</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs" onClick={() => setFontScale(Math.max(90, fontScale - 10))}>
              <Icon name="Minus" size={14} className="mr-1" />A-
            </Button>
            <Button variant="outline" size="xs" onClick={() => setFontScale(100)}>A</Button>
            <Button variant="outline" size="xs" onClick={() => setFontScale(Math.min(140, fontScale + 10))}>
              <Icon name="Plus" size={14} className="mr-1" />A+
            </Button>
            <Button variant="outline" size="xs" onClick={() => setHighContrast(!highContrast)}>
              <Icon name="Contrast" size={14} className="mr-1" />{t.contrast}
            </Button>
            <div className="relative">
              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-8 border border-border rounded-md px-2 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <nav className="sticky top-0 z-40" style={{ backgroundColor: palette.navy }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <ul className="flex items-center gap-4 text-white overflow-x-auto">
            {t.nav.map((item, idx) => (
              <li key={idx} className="group relative py-3">
                <button className="px-3 py-1 rounded hover:bg-white/10 transition" aria-haspopup="true">{item}</button>
                <div className="absolute left-0 top-full hidden group-hover:block bg-white text-foreground min-w-[220px] border border-border rounded shadow-md">
                  <a className="block px-4 py-2 hover:bg-muted" href="#">Overview</a>
                  <a className="block px-4 py-2 hover:bg-muted" href="#">Departments</a>
                  <a className="block px-4 py-2 hover:bg-muted" href="#">Contacts</a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function Carousel({ slides }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <div className="relative h-72 sm:h-96 w-full overflow-hidden" aria-roledescription="carousel">
      {slides.map((s, idx) => (
        <div key={idx} className={cn("absolute inset-0 transition-opacity duration-700", i === idx ? "opacity-100" : "opacity-0")}
          style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${s.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="max-w-7xl mx-auto h-full flex items-center px-4 lg:px-6">
            <div className="text-white max-w-2xl">
              <div className="text-sm mb-2" style={{ color: palette.saffron }}>{s.tag}</div>
              <h2 className="text-2xl sm:text-4xl font-bold leading-tight">{s.title}</h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base opacity-90">{s.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={cn("w-2.5 h-2.5 rounded-full", i === idx ? "bg-white" : "bg-white/60")}
            aria-label={`Go to slide ${idx + 1}`}></button>
        ))}
      </div>
    </div>
  );
}

function NewsTicker({ items, label }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [items.length]);
  const current = items[idx];
  return (
    <div className="flex items-center gap-3 px-4 py-3 border rounded bg-white">
      <span className="px-2 py-1 text-xs font-semibold rounded" style={{ backgroundColor: palette.saffron, color: palette.white }}>{label}</span>
      <a className="text-sm hover:underline" href={current.link}>{current.title}</a>
      <span className="ml-auto text-xs text-muted-foreground">{current.date}</span>
    </div>
  );
}

function Gallery({ images }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((g) => (
          <button key={g.id} className="relative group" onClick={() => { setActive(g); setOpen(true); }}>
            <img src={g.src} alt={g.alt} className="w-full h-28 md:h-36 object-cover rounded border" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          </button>
        ))}
      </div>
      {open && active && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-3xl w-full">
            <div className="flex items-center justify-between p-2 border-b">
              <div className="font-medium px-2 py-1">{active.alt}</div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><Icon name="X" /></Button>
            </div>
            <img src={active.src} alt={active.alt} className="w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function GovHome() {
  const [lang, setLang] = useState('en');
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const t = translations[lang];

  const slides = useMemo(() => ([
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/North_Block%2C_New_Delhi.jpg/1280px-North_Block%2C_New_Delhi.jpg',
      tag: 'Governance',
      title: lang === 'en' ? 'Citizen-centric services and transparent delivery' : 'नागरिक केंद्रित सेवाएं और पारदर्शी डिलीवरी',
      subtitle: lang === 'en' ? 'Access schemes, documents, and information with ease.' : 'योजनाओं, दस्तावेज़ों और जानकारी तक आसान पहुंच।',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tribal_Museum_Bhopal.jpg/1280px-Tribal_Museum_Bhopal.jpg',
      tag: 'Inclusion',
      title: lang === 'en' ? 'Inclusive development for tribal communities' : 'जनजातीय समुदायों के लिए समावेशी विकास',
      subtitle: lang === 'en' ? 'Education, health, livelihood and infrastructure.' : 'शिक्षा, स्वास्थ्य, आजीविका और बुनियादी ढांचा।',
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_India.svg/1280px-Flag_of_India.svg.png',
      tag: 'Mission',
      title: lang === 'en' ? 'Empowering India through rights and opportunities' : 'अधिकारों और अवसरों के माध्यम से भारत को सशक्त बनाना',
      subtitle: lang === 'en' ? 'A secure, equitable, and prosperous future.' : 'सुरक्षित, समान और समृद्ध भविष्य।',
    },
  ]), [lang]);

  const [news, setNews] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [links, setLinks] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    (async () => {
      setNews(await getNews());
      setSchemes(await getSchemes());
      setLinks(await getImportantLinks());
      setGallery(await getGallery());
    })();
  }, []);

  return (
    <div style={{ fontSize: `${fontScale}%` }} className={cn("min-h-screen", highContrast ? "bg-white text-black" : "bg-background text-foreground")}> 
      <GovHeader lang={lang} setLang={setLang} fontScale={fontScale} setFontScale={setFontScale} highContrast={highContrast} setHighContrast={setHighContrast} />

      <main>
        <Carousel slides={slides} />

        <section className="max-w-7xl mx-auto px-4 lg:px-6 -mt-8 relative z-10">
          {news.length > 0 && (
            <NewsTicker items={news} label={t.latest} />
          )}
        </section>

        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white border rounded">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: palette.navy }}>
                <h3 className="text-white font-semibold">{t.schemes}</h3>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {schemes.map(s => (
                  <div key={s.id} className="border rounded p-4 hover:shadow-md transition bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: palette.green }}>
                        <Icon name={s.icon} size={18} color={palette.white} />
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: palette.navy }}>{s.name}</div>
                        <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                        <div className="mt-3">
                          <Button size="sm" variant="outline"><Icon name="ExternalLink" size={14} className="mr-2" />Learn More</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: palette.navy }}>
                <h3 className="text-white font-semibold">{t.gallery}</h3>
              </div>
              <div className="p-4">
                <Gallery images={gallery} />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border rounded">
              <div className="px-4 py-3 border-b font-semibold" style={{ backgroundColor: palette.saffron, color: palette.white }}>{t.quick}</div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[{k:'rti', ic:'FileText'},{k:'tenders', ic:'FileDigit'},{k:'downloads', ic:'Download'},{k:'charter', ic:'ScrollText'}].map((q) => (
                  <a key={q.k} href="#" className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-muted">
                    <Icon name={q.ic} size={16} />
                    <span className="text-sm">{t[q.k]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded">
              <div className="px-4 py-3 border-b font-semibold" style={{ backgroundColor: palette.navy, color: palette.white }}>{t.links}</div>
              <ul className="p-4 space-y-2">
                {links.map(l => (
                  <li key={l.id}>
                    <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:underline">
                      <Icon name="ExternalLink" size={14} />{l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded p-4" style={{ backgroundColor: palette.green }}>
              <div className="flex items-start gap-3 text-white">
                <Icon name="Phone" />
                <div>
                  <div className="font-semibold">{t.helpline}</div>
                  <div className="text-sm opacity-90">1800-123-456 (Mon-Fri, 9am-6pm)</div>
                  <div className="text-sm opacity-90">helpdesk@tribalaffairs.gov.in</div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="mt-8" style={{ backgroundColor: palette.navy }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="font-semibold mb-2">{t.title}</div>
              <p className="text-sm opacity-90">{t.mission}</p>
            </div>
            <div>
              <div className="font-semibold mb-2">Links</div>
              <ul className="space-y-1 text-sm">
                <li><a className="hover:underline" href="#">{t.privacy}</a></li>
                <li><a className="hover:underline" href="#">{t.terms}</a></li>
                <li><a className="hover:underline" href="#">{t.feedback}</a></li>
              </ul>
            </div>
            <div className="text-sm">
              <div>© Government of India</div>
              <div className="opacity-80">All content is in the public domain unless otherwise stated.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
