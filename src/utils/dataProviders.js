export async function getNews() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    try {
      const res = await fetch(`${base}/news`);
      if (res.ok) return res.json();
    } catch {}
  }
  return [
    { id: 1, title: "National tribal welfare initiative launched", date: "2025-08-30", link: "#" },
    { id: 2, title: "New scholarship guidelines for ST students", date: "2025-08-25", link: "#" },
    { id: 3, title: "E-governance upgrades for citizen services", date: "2025-08-20", link: "#" }
  ];
}

export async function getSchemes() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    try {
      const res = await fetch(`${base}/schemes`);
      if (res.ok) return res.json();
    } catch {}
  }
  return [
    { id: "sch-1", name: "Educational Support", desc: "Scholarships and hostels for ST students.", icon: "GraduationCap" },
    { id: "sch-2", name: "Healthcare Access", desc: "Mobile clinics and telemedicine services.", icon: "Stethoscope" },
    { id: "sch-3", name: "Livelihood Mission", desc: "Skill development and entrepreneurship.", icon: "Briefcase" },
    { id: "sch-4", name: "Infrastructure", desc: "Roads, housing, digital connectivity.", icon: "Building2" },
  ];
}

export async function getImportantLinks() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    try {
      const res = await fetch(`${base}/links`);
      if (res.ok) return res.json();
    } catch {}
  }
  return [
    { id: "l1", label: "DigiLocker", url: "https://www.digilocker.gov.in/" },
    { id: "l2", label: "UIDAI (Aadhaar)", url: "https://uidai.gov.in/" },
    { id: "l3", label: "PMO India", url: "https://www.pmindia.gov.in/" },
    { id: "l4", label: "MyGov", url: "https://www.mygov.in/" },
    { id: "l5", label: "National Portal", url: "https://www.india.gov.in/" }
  ];
}

export async function getGallery() {
  const base = import.meta.env.VITE_API_BASE;
  if (base) {
    try {
      const res = await fetch(`${base}/gallery`);
      if (res.ok) return res.json();
    } catch {}
  }
  return [
    {
      id: "g1",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/North_Block%2C_New_Delhi.jpg/1280px-North_Block%2C_New_Delhi.jpg",
      alt: "North Block, New Delhi",
    },
    {
      id: "g2",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tribal_Museum_Bhopal.jpg/1280px-Tribal_Museum_Bhopal.jpg",
      alt: "Tribal Museum, Bhopal",
    },
    {
      id: "g3",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_India.svg/1280px-Flag_of_India.svg.png",
      alt: "Flag of India",
    },
    {
      id: "g4",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/PMO_India.jpg/1280px-PMO_India.jpg",
      alt: "PMO India",
    },
  ];
}
