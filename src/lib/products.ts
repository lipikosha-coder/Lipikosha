export interface ProductFile {
  name: string;
  size: string;
  type: string;
}

export type Category =
  | "All (12)"
  | "Bundles"
  | "AI & Prompts"
  | "Marketing & Data"
  | "Videos & Animation"
  | "Software";

export const CATEGORIES: Category[] = [
  "All (12)",
  "Bundles",
  "AI & Prompts",
  "Marketing & Data",
  "Videos & Animation",
  "Software",
];

export interface ModulePeek {
  title: string;
  itemCount: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: "Bundles" | "AI & Prompts" | "Marketing & Data" | "Videos & Animation" | "Software";
  badge?: string;
  isFeatured?: boolean;
  price: number;
  mrp: number;
  hook: string;
  description?: string;
  formats?: string;
  specPills: [string, string, string];
  coverFile: string;
  fileName: string;
  fileSize: string;
  modules: ModulePeek[];
  deliverables: string[];
  specs: {
    license: string;
    version: string;
    updatedAt: string;
    compatibility: string;
    downloadFormat: string;
  };
  files: ProductFile[];
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "all-in-one-ultimate",
    slug: "all-in-one-ultimate",
    title: "All-in-One Ultimate Mega Bundle",
    category: "Bundles",
    badge: "Bestseller",
    isFeatured: true,
    price: 199,
    mrp: 999,
    hook: "20-in-1 creator & business vault.",
    specPills: [
      "AI Reels + YT Courses",
      "Eng/Hindi Marketing",
      "6,000+ Worksheets & Templates",
    ],
    coverFile: "all-in-one-ultimate.png",
    fileName: "all-in-one-ultimate.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "AI Video & YouTube Mastery", itemCount: "120+ Video Lessons", description: "Comprehensive editing courses, scripts, and retention frameworks." },
      { title: "Bilingual Marketing Systems", itemCount: "50+ Multi-format Flows", description: "English & Hindi high-conversion sales copy & WhatsApp funnels." },
      { title: "Templates & Worksheets", itemCount: "6,000+ Notion & Canva Files", description: "Ready-to-use business worksheets, contracts, and pitch decks." },
    ],
    deliverables: [
      "Official Master PDF Access Document with Verified Direct Links",
      "AI Video & YouTube Mastery Academy (120+ Video Lessons)",
      "Bilingual English & Hindi Performance Marketing Playbooks",
      "6,000+ Canva, Notion & Excel Business Worksheets",
      "Perpetual Commercial & Personal Use License",
    ],
    specs: {
      license: "Perpetual Commercial & Personal Use",
      version: "2026 Master Edition",
      updatedAt: "November 2026",
      compatibility: "Universal PDF, Adobe Reader, Web, Mobile",
      downloadFormat: "Single Instant High-Speed PDF Document",
    },
    files: [{ name: "all-in-one-ultimate.pdf", size: "4.8 MB", type: "PDF" }],
    tags: ["Bundle", "Mega Pack", "All in One", "Marketing", "Video", "Creator"],
  },
  {
    id: "resale-1000-vault",
    slug: "resale-1000-vault",
    title: "1000+ Digital Products Resale Vault",
    category: "Bundles",
    badge: "Most Popular",
    isFeatured: true,
    price: 199,
    mrp: 999,
    hook: "22-module PLR & web asset library.",
    specPills: [
      "350+ PLR Ebooks",
      "WP Themes & Source Code",
      "3,000+ T-Shirt & Festival Designs",
    ],
    coverFile: "resale-1000-vault.png",
    fileName: "resale-1000-vault.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "PLR & MRR Ebook Library", itemCount: "350+ Full Ebooks", description: "Fully editable source documents with rights to resell at 100% profit." },
      { title: "Websites, Themes & Code", itemCount: "40+ Themes & Plugins", description: "Production WordPress themes, HTML landing pages, and scripts." },
      { title: "Merch & Graphic Designs", itemCount: "3,000+ Vector Cut Files", description: "T-shirt illustrations, festival banners, and print-on-demand assets." },
    ],
    deliverables: [
      "Master Resale Vault PDF Access Guide with High-Speed Repositories",
      "350+ Full Commercial PLR Ebooks across 20 profitable niches",
      "WordPress Themes, Landing Page Templates & Source Code",
      "3,000+ T-Shirt Vector Designs and Indian Festival Graphics",
      "Full Master Resale Rights (MRR) & PLR Certificate",
    ],
    specs: {
      license: "Master Resale Rights (MRR) & PLR Included",
      version: "Inventive Cafe Edition",
      updatedAt: "November 2026",
      compatibility: "Universal PDF, Web Browsers, Mobile",
      downloadFormat: "Instant Secure PDF Document",
    },
    files: [{ name: "resale-1000-vault.pdf", size: "3.2 MB", type: "PDF" }],
    tags: ["Resale Rights", "MRR", "PLR", "Digital Products", "Passive Income"],
  },
  {
    id: "all-in-one-starter",
    slug: "all-in-one-starter",
    title: "All-in-One Creator Starter Bundle",
    category: "Bundles",
    isFeatured: true,
    price: 149,
    mrp: 699,
    hook: "Essential toolkit to launch & freelance.",
    specPills: [
      "999+ Notion Prompts",
      "Canva & Excel Kits",
      "IG Growth & Freelance Courses",
    ],
    coverFile: "all-in-one-starter.png",
    fileName: "all-in-one-starter.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Notion & AI Prompt Kit", itemCount: "999+ Verified Prompts", description: "Curated daily prompts for writing, planning, and task execution." },
      { title: "Creative Canva & Sheet Toolkits", itemCount: "500+ Templates", description: "Social media carousels, rate cards, and financial spreadsheets." },
      { title: "Freelance & Instagram Roadmap", itemCount: "8 Step-by-Step Modules", description: "Proven playbooks to land first 5 high-paying client contracts." },
    ],
    deliverables: [
      "Direct Clickable Starter PDF Directory with Zero Waiting",
      "999+ Notion Prompt Blueprints & Productivity Dashboards",
      "500+ Canva Social Media Templates & Excel Pricing Calculators",
      "Instagram Organic Reach & Growth Playbook",
      "Freelance Client Proposal, Contract & Invoicing Kit",
    ],
    specs: {
      license: "Commercial Client & Freelance License",
      version: "v2.1",
      updatedAt: "November 2026",
      compatibility: "All PDF Viewers, Mobile & Desktop",
      downloadFormat: "Immediate PDF Access Document",
    },
    files: [{ name: "all-in-one-starter.pdf", size: "2.9 MB", type: "PDF" }],
    tags: ["Starter Bundle", "Creator Kit", "Freelance", "Social Media"],
  },
  {
    id: "pan-india-database",
    slug: "pan-india-database",
    title: "Pan-India Business Database",
    category: "Marketing & Data",
    price: 149,
    mrp: 699,
    hook: "Multi-folder B2B outreach spreadsheets.",
    specPills: [
      "Pan-India Directories",
      "Region & Sector Filters",
      "CRM-Ready Sheet Format",
    ],
    coverFile: "pan-india-database.png",
    fileName: "pan-india-database.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Regional Commercial Hubs", itemCount: "5 Metro Clusters", description: "Verified records from Mumbai, Delhi NCR, Bengaluru, Gujarat, Chennai." },
      { title: "Industry Segmentation", itemCount: "20+ Primary Verticals", description: "Wholesalers, traders, D2C brands, IT services, and distributors." },
      { title: "CRM Export Package", itemCount: "Clean XLSX & CSV", description: "One-click import ready for HubSpot, Zoho, and tele-calling suites." },
    ],
    deliverables: [
      "Pan-India Verified Database PDF Directory with Instant Cloud Folders",
      "Segmented Records: Retailers, Wholesalers, Manufacturers, Professionals",
      "Direct Phone Numbers, WhatsApp Numbers, Cities, and Pin Codes",
      "Clean Excel (.xlsx) and CSV Formats via Direct Cloud Links",
      "Telemarketing & Cold Outreach Best Practices Guide",
    ],
    specs: {
      license: "Commercial Marketing & Prospecting Rights",
      version: "Pan-India 2026 Edition",
      updatedAt: "November 2026",
      compatibility: "Excel, Google Sheets, CRM, CSV Viewers",
      downloadFormat: "Authenticated PDF Document",
    },
    files: [{ name: "pan-india-database.pdf", size: "1.8 MB", type: "PDF" }],
    tags: ["Database", "B2B", "Pan India", "Marketing", "Leads"],
  },
  {
    id: "all-india-categories-db",
    slug: "all-india-categories-db",
    title: "All-India Categorized Database",
    category: "Marketing & Data",
    price: 149,
    mrp: 699,
    hook: "High-volume Indian buyer & student data.",
    specPills: [
      "15 Cr Categorized Records",
      "4 Cr IndiaMART + 1 Cr Shoppers",
      "Bulk Sender Tool",
    ],
    coverFile: "all-india-categories-db.png",
    fileName: "all-india-categories-db.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "High-Intent Buyer Bases", itemCount: "15 Crore Segmented Records", description: "Classified databases across e-commerce shoppers, founders, and students." },
      { title: "B2B Marketplace Extract", itemCount: "4 Crore Verified Vendors", description: "Curated supplier and manufacturer records across 400 Indian districts." },
      { title: "WhatsApp Sender Toolkit", itemCount: "Software & Script Stems", description: "Automated bulk messaging guidelines & message formatting models." },
    ],
    deliverables: [
      "Master Categorized Database Access PDF with Direct Storage Links",
      "15 Crore Categorized Records with Demographic Attributes",
      "4 Crore Verified Marketplace & E-commerce Buyer Records",
      "Bulk WhatsApp Message Sender Script & Formatting Tool",
      "Deliverability Checklist to Prevent Phone Number Bans",
    ],
    specs: {
      license: "Commercial Agency & Internal Usage",
      version: "Categorized Master Edition",
      updatedAt: "November 2026",
      compatibility: "Excel, CSV, CRM Systems, Google Sheets",
      downloadFormat: "Instant Protected PDF Document",
    },
    files: [{ name: "all-india-categories-db.pdf", size: "2.1 MB", type: "PDF" }],
    tags: ["Categorized Leads", "B2B Database", "Sales Prospecting", "CRM"],
  },
  {
    id: "chatgpt-mega-bundle",
    slug: "chatgpt-mega-bundle",
    title: "ChatGPT Mega Prompts Bundle",
    category: "AI & Prompts",
    price: 99,
    mrp: 499,
    hook: "19-in-1 AI courses, tools & workflows.",
    specPills: [
      "95+ Mastery Videos",
      "2,000+ Copy & Ad Prompts",
      "1,500+ AI Tools & Automations",
    ],
    coverFile: "chatgpt-mega-bundle.png",
    fileName: "chatgpt-mega-bundle.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "AI Prompt Engineering Blueprint", itemCount: "2,000+ Prompts", description: "High-conversion copywriting, cold email hooks, and Facebook ad angles." },
      { title: "Automation Masterclass", itemCount: "95+ Video Guides", description: "Step-by-step video tutorials on building zero-code AI agency workflows." },
      { title: "AI Tool Directory", itemCount: "1,500+ Categorized Tools", description: "Handpicked tools for video creation, voice synthesis, and SEO indexing." },
    ],
    deliverables: [
      "Complete ChatGPT Mega Bundle PDF Guide with Copy-Ready Prompts",
      "95+ Mastery Video Lessons for GPT-4o, Claude 3.7 & Midjourney",
      "2,000+ Direct-Response Ad Copy, SEO & Email Marketing Prompts",
      "1,500+ Curated AI Tools Directory with Lifetime Free Alternatives",
      "Personal & Agency Commercial Utilization Rights",
    ],
    specs: {
      license: "Commercial & Personal Unrestricted Use",
      version: "Mega Edition",
      updatedAt: "November 2026",
      compatibility: "ChatGPT, Claude, Gemini, Copilot, DeepSeek",
      downloadFormat: "Instant Clickable PDF Document",
    },
    files: [{ name: "chatgpt-mega-bundle.pdf", size: "3.5 MB", type: "PDF" }],
    tags: ["ChatGPT", "Prompts", "AI", "Copywriting", "Automation"],
  },
  {
    id: "chatgpt-150k-prompts",
    slug: "chatgpt-150k-prompts",
    title: "1,50,000+ ChatGPT Prompts Vault",
    category: "AI & Prompts",
    badge: "Top Rated",
    price: 129,
    mrp: 599,
    hook: "Niche-sorted prompts across 10 industries.",
    specPills: [
      "43K Copy & Email Prompts",
      "24.5K Finance & Crypto",
      "Social Media + Beginner Guide",
    ],
    coverFile: "chatgpt-150k-prompts.png",
    fileName: "chatgpt-150k-prompts.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Copywriting & Sales Core", itemCount: "43,000+ Prompts", description: "High-ticket sales scripts, webinar outlines, and VSL frameworks." },
      { title: "Finance, Investing & SaaS", itemCount: "24,500+ Prompts", description: "Algorithmic formulas, tax planning prompts, and venture analysis." },
      { title: "Creator & Social Media Suite", itemCount: "50,000+ Prompts", description: "Viral hook prompts, thumbnail ideation, and YouTube scripts." },
    ],
    deliverables: [
      "1,50,000+ Categorized Prompts Master Access PDF",
      "Niche-by-Niche Breakdown: SaaS, Real Estate, E-Commerce, Legal, Code",
      "Zero-Shot & Few-Shot Prompt Optimization Guide",
      "Direct Drive Spreadsheet Imports for Bulk API Ingestion",
      "Perpetual Commercial Multi-User License",
    ],
    specs: {
      license: "Perpetual License for Unlimited Projects",
      version: "150k Grand Vault",
      updatedAt: "November 2026",
      compatibility: "All LLM Interfaces & PDF Readers",
      downloadFormat: "Instant Verified PDF Document",
    },
    files: [{ name: "chatgpt-150k-prompts.pdf", size: "5.2 MB", type: "PDF" }],
    tags: ["150k Prompts", "Prompt Engineering", "Mega Collection", "AI Vault"],
  },
  {
    id: "retargeting-templates",
    slug: "retargeting-templates",
    title: "Retargeting Message Templates",
    category: "Marketing & Data",
    badge: "Starter Deal",
    price: 49,
    mrp: 249,
    hook: "40 WhatsApp scripts to recover lost sales.",
    specPills: [
      "20 Cart & Cross-Sell Scripts",
      "20 Service Follow-Ups",
      "Plug-and-Play Tags",
    ],
    coverFile: "retargeting-templates.png",
    fileName: "retargeting-templates.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Abandoned Cart Recovery", itemCount: "20 Proven Scripts", description: "Psychological urgency & discount angles that bring back 30%+ drop-offs." },
      { title: "Client Service Follow-Ups", itemCount: "20 Cross-Sell Scripts", description: "High-touch relationship follow-ups for agency and high-ticket sales." },
      { title: "Variable Placeholders", itemCount: "Fill-in-the-Blank Format", description: "Simply copy, paste customer name/product, and hit send on WhatsApp." },
    ],
    deliverables: [
      "Retargeting Message Templates Master PDF with Instant Copy Blocks",
      "20 Abandoned Cart & Checkout Recovery WhatsApp Scripts",
      "20 Agency & High-Ticket Service Follow-Up Messages",
      "Urgency & Objection Handling Framework for Indian Buyers",
      "Instant Commercial Re-Use Rights",
    ],
    specs: {
      license: "Unlimited Commercial Client Use",
      version: "v2.0",
      updatedAt: "November 2026",
      compatibility: "WhatsApp Business, SMS Gateways, Klaviyo, Brevo",
      downloadFormat: "Instant PDF Download",
    },
    files: [{ name: "retargeting-templates.pdf", size: "1.4 MB", type: "PDF" }],
    tags: ["Retargeting", "WhatsApp Templates", "Email Copy", "E-commerce"],
  },
  {
    id: "promotional-templates",
    slug: "promotional-templates",
    title: "Promotional Message Templates",
    category: "Marketing & Data",
    price: 49,
    mrp: 249,
    hook: "40 high-converting launch & festival DMs.",
    specPills: [
      "Flash Sale & BOGO Scripts",
      "Diwali, Holi & Eid Copy",
      "High-CTR Mobile Formatting",
    ],
    coverFile: "promotional-templates.png",
    fileName: "promotional-templates.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Flash Sale & BOGO Offers", itemCount: "18 High-Urgency Scripts", description: "Limited-hour promotions engineered to create immediate buying rushes." },
      { title: "Festival Marketing Copy", itemCount: "14 Seasonal Campaigns", description: "Pre-written messages tailored for Diwali, New Year, Holi, and Eid." },
      { title: "VIP Loyalty Blasts", itemCount: "8 Exclusive Offer Scripts", description: "Reward repeat buyers with special private collection access." },
    ],
    deliverables: [
      "Promotional Message Templates PDF Reference Guide",
      "40 Ready-to-Send Broadcast Scripts for WhatsApp and Telegram",
      "Diwali, New Year, Holi, and Independence Day Promotional Copy",
      "High-CTR Formatting Guide with Emoji Placement & Bold Layouts",
      "Lifetime Commercial Campaign Usage",
    ],
    specs: {
      license: "Commercial Marketing License",
      version: "v2.0",
      updatedAt: "November 2026",
      compatibility: "WhatsApp, Telegram, SMS, Email",
      downloadFormat: "Instant Clean PDF Document",
    },
    files: [{ name: "promotional-templates.pdf", size: "1.3 MB", type: "PDF" }],
    tags: ["Promotional Copy", "Broadcasts", "SMS", "WhatsApp", "Marketing"],
  },
  {
    id: "viral-vault-cartoon",
    slug: "viral-vault-cartoon",
    title: "Viral Vault Cartoon Bundle",
    category: "Videos & Animation",
    price: 99,
    mrp: 499,
    hook: "Ready-to-post viral animation story packs.",
    specPills: [
      "Main Cartoon Clip Vault",
      "2 Bonus Character Packs",
      "Shorts & Reels Ready",
    ],
    coverFile: "viral-vault-cartoon.png",
    fileName: "viral-vault-cartoon.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Core Animated Story Clips", itemCount: "500+ Ready Reels", description: "Engaging 2D character scenarios with high retention narrative pacing." },
      { title: "Bonus Character Packs", itemCount: "2 Custom Casts", description: "Vector asset rigs, expressions, and transparent alpha-channel overlays." },
      { title: "Audio & Sound FX Stems", itemCount: "150+ Sound Stems", description: "Royalty-free cartoon whooshes, comic impacts, and background beats." },
    ],
    deliverables: [
      "Viral Vault Cartoon Bundle Access PDF with Direct High-Speed Cloud Drives",
      "500+ Pre-Rendered Watermark-Free Shorts & Reels in 1080x1920",
      "2 Bonus Vector Character Packs for Premiere Pro, AE & CapCut",
      "High-Engagement Sound FX and Comic Audio Library",
      "Faceless Channel Commercial Monetization License",
    ],
    specs: {
      license: "Commercial YouTube & Social Media Monetization License",
      version: "Viral Vault 2026",
      updatedAt: "November 2026",
      compatibility: "CapCut, Premiere Pro, DaVinci Resolve, VN Editor, Canva",
      downloadFormat: "Instant Master PDF Access Document",
    },
    files: [{ name: "viral-vault-cartoon.pdf", size: "2.7 MB", type: "PDF" }],
    tags: ["Cartoon", "Faceless Channel", "Reels", "Animation", "YouTube"],
  },
  {
    id: "usa-cartoon-bundle",
    slug: "usa-cartoon-bundle",
    title: "USA & Hindi Cartoon Video Bundle",
    category: "Videos & Animation",
    price: 99,
    mrp: 499,
    hook: "8,000+ watermark-free 1080p/4K story videos.",
    specPills: [
      "8,000+ Long & Short Videos",
      "45+ Story Categories",
      "5,000+ Bonus Reels & Thumbnails",
    ],
    coverFile: "usa-cartoon-bundle.png",
    fileName: "usa-cartoon-bundle.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "High-RPM Story Videos", itemCount: "8,000+ Master Clips", description: "Watermark-free 1080p and 4K storytelling videos tailored for US audiences." },
      { title: "Story Category Diversity", itemCount: "45+ Curated Themes", description: "Moral stories, fairy tales, mystery shorts, and comedic anecdotes." },
      { title: "Thumbnail & Reel Pack", itemCount: "5,000+ Editable PSDs", description: "High-CTR YouTube thumbnail templates and bonus vertical cuts." },
    ],
    deliverables: [
      "USA & Hindi Cartoon Video Bundle Master PDF with Fast Repositories",
      "8,000+ HD Story Videos (Long-Form & Short-Form 9:16)",
      "45+ Thematic Story Categories Ready for Immediate Voiceover",
      "5,000+ High-CTR Thumbnail Graphics and Animated Hooks",
      "Global Commercial Broadcast & Monetization Rights",
    ],
    specs: {
      license: "Worldwide Commercial Monetization License",
      version: "USA & Hindi Edition",
      updatedAt: "November 2026",
      compatibility: "Premiere Pro, CapCut, After Effects, Final Cut Pro",
      downloadFormat: "Instant PDF Download Document",
    },
    files: [{ name: "usa-cartoon-bundle.pdf", size: "2.5 MB", type: "PDF" }],
    tags: ["USA Cartoon", "Animation", "High RPM", "Faceless", "Video Editing"],
  },
  {
    id: "adobe-collection",
    slug: "adobe-collection",
    title: "Adobe Collection Suite & Assets",
    category: "Software",
    price: 149,
    mrp: 799,
    hook: "Complete 2024 creative suite resource guide.",
    specPills: [
      "Premiere, After Effects & Audition",
      "Photoshop, Illustrator & Lightroom",
      "InDesign & Animate",
    ],
    coverFile: "adobe-collection.png",
    fileName: "adobe-collection.pdf",
    fileSize: "Instant PDF Access",
    modules: [
      { title: "Video & Motion Suite", itemCount: "500+ MOGRTs & LUTs", description: "Premiere Pro transitions, After Effects expressions, and Audition vocal chains." },
      { title: "Graphic Design & Photo", itemCount: "1,200+ Brushes & Styles", description: "Photoshop action scripts, Illustrator swatches, and Lightroom XMP presets." },
      { title: "Publishing & Layout", itemCount: "300+ Editorial Grids", description: "InDesign book layouts, typography pairings, and vector asset libraries." },
    ],
    deliverables: [
      "Adobe Collection Master PDF with Direct Access to Cloud Repositories",
      "Premiere Pro, After Effects & Audition Presets and MOGRTs",
      "Photoshop Brushes, Layer Styles, and Lightroom XMP Color Profiles",
      "Illustrator Vector Swatches, Icon Sets, and InDesign Layout Kits",
      "Perpetual Professional & Commercial License",
    ],
    specs: {
      license: "Perpetual Professional & Commercial License",
      version: "Adobe 2026 Collection",
      updatedAt: "November 2026",
      compatibility: "Adobe Creative Cloud (Photoshop, Premiere, Illustrator, AE)",
      downloadFormat: "Instant Certified PDF Guide",
    },
    files: [{ name: "adobe-collection.pdf", size: "3.9 MB", type: "PDF" }],
    tags: ["Adobe", "Photoshop", "Premiere Pro", "Plugins", "Presets", "Illustrator"],
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All (12)" || category === "All") {
    return PRODUCTS;
  }
  return PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(currentId: string, limit: number = 3): Product[] {
  const current = getProductById(currentId);
  const others = PRODUCTS.filter((p) => p.id !== currentId);
  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter((p) => p.category === current.category);
  const differentCategory = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...differentCategory].slice(0, limit);
}
