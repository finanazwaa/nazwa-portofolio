export type ProjectChapter = {
  heading: "context" | "what you did" | "outcome";
  body: string;
};

// Hero images live in public/work/<slug>/. Each entry is one slide on the project page; the
// first is also the cover on the selected-works card. Without a `src` the slide shows the
// cut-paper placeholder.
export type ProjectVisual = {
  src?: string;
  alt: string;
};

// External links shown under the hero caption; they open in a new tab.
export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  number: string;
  slug: string;
  title: string;
  category: string;
  area: string;
  role: string;
  tools: string;
  year: string;
  team: string;
  summary: string;
  heroCaption: string;
  heroVisuals: ProjectVisual[];
  links: ProjectLink[];
  chapters: ProjectChapter[];
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  period: string;
};

export type Tool = {
  name: string;
  slug: string;
};

export const owner = {
  name: "Finanazwa Ayesha",
  monogram: "FA",
  subtitle:
    "Computer Science student interested in marketing analytics, consumer insights, and data-driven experiences.",
  email: "finanazwa123@gmail.com",
  emailLink: "mailto:finanazwa123@gmail.com",
  linkedin: "Finanazwa Ayesha",
  linkedinLink: "https://www.linkedin.com/in/finanazwa-ayesha-28840b307/?isSelfProfile=true",
  github: "finanazwaa",
  githubLink: "https://github.com/finanazwaa",
};

// Ordered by desk object (laptop, books, vase, envelope) to match the scene and the
// .scene-chip-N / .desk-still-N positions; numbers follow the section order on the home page.
// `asset` is the custom drawing for each object: a transparent PNG at `src`, cropped tight
// to the drawing, standing on the desk at `position` (scene units; x right, z towards the
// camera) and drawn `width` units wide (the height follows the image). If the image can't be
// loaded the 3D scene falls back to its built-in object.
export const sceneDoors = [
  { number: "03", label: "selected works", chipLabel: "SELECTED WORKS", href: "/#work", object: "laptop", asset: { src: "/assets/desk/laptop/portolaptop.PNG", position: [0.2, 0, 1.85], width: 3.1 } },
  { number: "01", label: "about", chipLabel: "ABOUT", href: "/#about", object: "stack of books", asset: { src: "/assets/desk/books/portobooks.PNG", position: [-2.7, 0, 2.6], width: 2.6 } },
  { number: "02", label: "areas i work in", chipLabel: "AREAS I WORK IN", href: "/#areas", object: "vase", asset: { src: "/assets/desk/vase/portoareas.PNG", position: [2.75, 0, 2.4], width: 1.7 } },
  { number: "04", label: "contact", chipLabel: "CONTACT", href: "/#contact", object: "envelope", asset: { src: "/assets/desk/envelope/portocontacts.PNG", position: [0.2, 0, 4.75], width: 1.9 } },
] as const;

// Backdrop behind the desk objects (desk surface + sky), drawn for the same camera view.
export const deskBackground = "/assets/desk/background/portobackground.PNG";

export const projects: Project[] = [
  {
    number: "01", slug: "sociolla", title: "Sociolla Fragrance Dashboard", category: "data & analytics",
    area: "data & analytics", role: "Data Analyst", tools: "Excel, Python, Web Scraping", year: "2026", team: "Individual",
    summary: "Analyzed Sociolla fragrance data from Sociolla Website Scraping to uncover product, brand, and customer review trends.",
    heroCaption: "Analyzed Sociolla fragrance data to uncover product, brand, and customer review trends.",
    heroVisuals: [
      { src: "/work/sociolla/sociollanew.png", alt: "Sociolla fragrance dashboard overview" },
    ],
    links: [
      { label: "View Excel", href: "https://docs.google.com/spreadsheets/d/1n1XQ4lnwwN4NwD2U17VKOFTzuduyjIZHgONjE7BofeY/edit?usp=sharing" },
      { label: "View GitHub", href: "https://github.com/finanazwaa/sociolla-fragrance-analysis" },
    ],
    chapters: [
      { heading: "context", body: "Explored Sociolla fragrance data to understand which brands and products perform best and what patterns emerge from customer reviews and ratings." },
      { heading: "what you did", body: "Collected and structured fragrance product and review data, then analyzed brand performance, product ratings, pricing, and customer preferences through an interactive dashboard." },
      { heading: "outcome", body: "Identified top-performing brands and products, rating patterns, and customer preferences to provide a clearer view of the fragrance market." },
    ],
  },
  {
    number: "02", slug: "dsmile", title: "D’Smile Marketing Project", category: "brand & creative content",
    area: "creative content", role: "Consumer Insights & Marketing Strategy", tools: "Customer Data Analysis · Consumer Insights · Strategy · Customer Data Analysis", year: "2026", team: "8 Members",
    summary: "Analyzed customer and survey data to uncover consumer insights and develop a strategy to strengthen D’Smile’s brand awareness and customer conversion.",
    heroCaption: "A customer insight and marketing strategy project for D’Smile Dental Clinic.",
    heroVisuals: [
      { src: "/work/dsmile/dsmilenew.png", alt: "D’Smile marketing project cover" },
      { src: "/work/dsmile/dsmile2new.png", alt: "Customer insight analysis slide" },
      { src: "/work/dsmile/dsmile3new.png", alt: "Clinic conversion strategy visual" },
      { src: "/work/dsmile/dsmile4new.png", alt: "Marketing project mockup" },
    ],
    links: [
      { label: "Customer Data Analysis", href: "https://colab.research.google.com/drive/1p2JkcShRUJDOQC79NsI_5TUcRcFyLgoe#scrollTo=maT6eQgLDQ8k" },
      { label: "Questionnaire Data Analysis", href: "https://colab.research.google.com/drive/1RoFkDVMgWucEb80CRoPd8MEfCj6oSq1B?usp=sharing" },
    ],
    chapters: [
      { heading: "context", body: "D’Smile needed to strengthen its market position and turn existing word-of-mouth awareness into repeat visits and stronger customer loyalty." },
      { heading: "what you did", body: "Analyzed historical customer data and questionnaire responses to uncover patterns in visits, demographics, customer perceptions, and decision-making, then translated the findings into a customer conversion strategy." },
      { heading: "outcome", body: "Identified key opportunities around brand awareness, referrals, and proactive customer engagement to help D’Smile move customers from consideration to actual clinic visits." },
    ],
  },
  {
    number: "03", slug: "byu", title: "by.U Marketing Strategy", category: "product analytics",
    area: "marketing & consumer insights", role: "Marketing Strategy · Research & Analysis", tools: "PESTLE · TOWS · Porter’s Five Forces · TOWS · Marketing Mix · Questionnaire Analysis", year: "2025", team: "4 members",
    summary: "Developed a marketing strategy to strengthen by.U’s relevance, engagement, and loyalty among Gen Z.",
    heroCaption: "Exploring how by.U can strengthen Gen Z relevance through emotional engagement, brand differentiation, and user loyalty.",
    heroVisuals: [
      { src: "/work/byu/byu1new.png", alt: "by.U strategic marketing concept" },
      { src: "/work/byu/byu2new.png", alt: "by.U brand growth and Gen Z strategy board" },
    ],
    links: [],
    chapters: [
      { heading: "context", body: "by.U wanted to stay relevant among Gen Z as trends and competition continued to evolve." },
      { heading: "what you did", body: "Analyzed the market, competitors, and consumer insights using strategic frameworks and questionnaire findings, then developed ideas to strengthen engagement, differentiation, and loyalty." },
      { heading: "outcome", body: "Proposed four initiatives under “U.NITE: The Lifestyle That Moves You,” targeting +20% DAU, +15% user retention, +15% CLV, and three exclusive brand collaborations per year." },
    ],
  },
  {
    number: "04", slug: "cosmetics", title: "Cosmetic Pop-Ups Analysis", category: "marketing & consumer insights",
    area: "marketing & consumer insights", role: "Data Analyst", tools: "SQL, Data Analysis", year: "2026", team: "Individual",
    summary: "Analyzed luxury cosmetic pop-up data to uncover patterns in brand performance, location, event duration, and customer footfall.",
    heroCaption: "Using SQL to turn pop-up event data into actionable business insights.",
    heroVisuals: [
      { src: "/work/cosmetics/cosmeticsnew.png", alt: "Cosmetic pop-up analysis dashboard" },
    ],
    links: [
      { label: "View GitHub", href: "https://github.com/finanazwaa/SQLP2_CosmeticPopUps" },
    ],
    chapters: [
      { heading: "context", body: "Luxury cosmetic brands use pop-ups to create customer experiences and drive sales. This project explored what makes these events perform better." },
      { heading: "what you did", body: "Cleaned and analyzed pop-up event data with PostgreSQL, comparing brands, locations, event duration, footfall, and sales performance." },
      { heading: "outcome", body: "Turned event data into business insights on where, when, and how pop-up events performed best." },
    ],
  },
  {
    number: "05", slug: "erp", title: "Mini ERP", category: "data & analytics",
    area: "data & analytics", role: "Project Analyst", tools: "Excel", year: "2026", team: "Individual",
    summary: "Designed a mini ERP system to centralize sales, inventory, logistics, customer, and operational data.",
    heroCaption: "Connecting business operations into one structured view.",
    heroVisuals: [
      { src: "/work/erp/erpnew.png", alt: "Mini ERP business operations overview" },
    ],
    links: [
      { label: "View Excel", href: "https://docs.google.com/spreadsheets/d/16HnpODitsbO0XecriwSOxkrQmSxNh4j_XHED0VFD_HQ/edit?usp=sharing" },
    ],
    chapters: [
      { heading: "context", body: "BKN operates across multiple locations, making it challenging to maintain consistent visibility across sales, inventory, logistics, and other operational activities." },
      { heading: "what you did", body: "Designed a structured database architecture connecting master data, transactions, operational data, and analytics. Built an integrated dashboard to monitor sales, inventory, delivery, customer feedback, maintenance, and demand forecasts." },
      { heading: "outcome", body: "Created a centralized operational view that makes key business metrics easier to monitor and supports more data-driven decision-making." },
    ],
  },
  {
    number: "06", slug: "retail", title: "Retail Sales Analysis", category: "data & analytics",
    area: "data & analytics", role: "Data Analyst", tools: "SQL, Data Analysis", year: "2026", team: "Individual",
    summary: "Analyzed retail sales data to uncover product performance, customer spending patterns, and key revenue trends.",
    heroCaption: "Using SQL to uncover what drives retail sales and customer spending.",
    heroVisuals: [
      { src: "/work/retail/retailnew.png", alt: "Retail sales analysis dashboard" },
    ],
    links: [
      { label: "View GitHub", href: "https://github.com/finanazwaa/SQLP1_RetailProject" },
    ],
    chapters: [
      { heading: "context", body: "Using SQL to uncover what drives retail sales and customer spending." },
      { heading: "what you did", body: "Cleaned and structured retail data in PostgreSQL, then used SQL to analyze product performance, category revenue, customer spending, monthly sales trends, and average order value." },
      { heading: "outcome", body: "Identified high-performing products, revenue patterns, and customer spending trends to support data-driven retail decisions." },
    ],
  },
  {
    number: "07", slug: "enose-tb", title: "eNose Data Analysis", category: "data & analytics / research",
    area: "data & analytics", role: "Data Analysis & Machine Learning", tools: "Python · Pandas · NumPy · Matplotlib · Scikit-learn · Google Colab", year: "2026", team: "Individual",
    summary: "Analyzed eNose-TB sensor data to evaluate device performance and identify the best-performing devices.",
    heroCaption: "A data analysis and SVM classification pipeline for evaluating 18 eNose-TB devices.",
    heroVisuals: [
      { src: "/work/enose-tb/enosedatanew.png", alt: "E-Nose data analysis results" },
    ],
    links: [
      { label: "ENOSE 1", href: "https://docs.google.com/document/d/1ldSCd2qOmz0yFcoG6OyJlkHzU06B74Osd0-8gk9uaI8/edit?tab=t.0" },
      { label: "ENOSE 2", href: "https://docs.google.com/document/d/14MyRwzAAHfSg5Q5CzvtBVdsrhCeTHk5kOwJopysBsRI/edit?tab=t.0" },
    ],
    chapters: [
      { heading: "context", body: "Evaluated 18 eNose-TB devices using human breath sensor data to assess their performance and consistency." },
      { heading: "what you did", body: "Preprocessed 195 sensor data files, extracted 30 features using standard deviation, gradient, and AUC, then applied PCA, LDA, and SVM classification with hyperparameter tuning." },
      { heading: "outcome", body: "Identified 5 best-performing devices and achieved 64.1% SVM classification accuracy, providing a basis for comparing device performance." },
    ],
  },
  {
    number: "08", slug: "enose-qt-widget", title: "eNose QT Widget", category: "UI design",
    area: "digital experience", role: "Desktop UI Development", tools: "Qt Widgets · C++ · Qt Designer", year: "2026", team: "2 Members",
    summary: "Developed a desktop dashboard for controlling eNose devices and visualizing real-time sensor data.",
    heroCaption: "A Qt-based desktop dashboard for eNose device control, real-time sensor visualization, and AI prediction display.",
    heroVisuals: [
      { src: "/work/enose-qt-widget/qt1new.png", alt: "E-Nose Qt Widget dashboard" },
      { src: "/work/enose-qt-widget/qt2new.png", alt: "E-Nose sensor UI screen" },
      { src: "/work/enose-qt-widget/qt3new.png", alt: "E-Nose desktop monitoring screen" },
    ],
    links: [],
    chapters: [
      { heading: "context", body: "Developed a desktop interface for operating eNose-TB devices and monitoring sensor responses in real time." },
      { heading: "what you did", body: "Developed the desktop UI using Qt Widgets, integrating device controls, real-time sensor visualization, device status monitoring, and AI prediction display." },
      { heading: "outcome", body: "Delivered an interactive dashboard that brings device control, sensor monitoring, and AI prediction into a single desktop interface." },
    ],
  },
];

export const areas = [
  {
    number: "01",
    title: "data & analytics",
    description: "I use data to clarify questions and make patterns easier to act on.",
    keywords: ["data analysis", "pattern recognition", "decision support"],
    projects: ["enose-tb", "datacracy"],
  },
  {
    number: "02",
    title: "marketing & consumer insights",
    description: "I explore what people need and how products can meet them.",
    keywords: ["consumer research", "audience understanding", "market strategy"],
    projects: ["byu", "cosmetics", "dsmile"],
  },
  {
    number: "03",
    title: "digital experience",
    description: "I shape useful, considered ways for people to interact with digital products.",
    keywords: ["product thinking", "user flows", "digital interfaces"],
    projects: ["enose-qt-widget"],
  },
  {
    number: "04",
    title: "creative content",
    description: "I bring ideas into clear and engaging forms.",
    keywords: ["content strategy", "visual storytelling", "communication"],
    projects: ["dsmile"],
  },
] as const;

export const about = {
  paragraphs: [
    "interested in Marketing Analytics, consumer insights, and data-driven marketing. Combines analytical thinking with creativity through experience in marketing, product development, design, and creative media.",
    "I’m interested in understanding people through data and turning insights into better experiences. I bring together technology, consumer insight, and creativity to solve real-world problems.",
  ],
  quote: "Curiosity leads. Everything else follows.",
  education: "Universitas Gadjah Mada, Bachelor of Computer Science, 2024–present",
  // Newest first. The list is rendered in this order and reveals entry by entry on scroll.
  experience: [
    { role: "Marketing Analytics & Research", organization: "by.U", period: "2025–present" },
    { role: "Data Analyst & Research Intern", organization: "E-Nose Research Project", period: "2024–2025" },
    { role: "Product & Design Collaborator", organization: "Creative Media & Research", period: "2023–2024" },
  ] satisfies ExperienceEntry[],
  // Logos: public/logos/<slug>.svg (ink-toned, Simple Icons) and public/logos/color/<slug>.svg
  // (full-colour, Devicon; brand-colour Simple Icons where no full-colour version exists). Max 12.
  tools: [
    { name: "Python", slug: "python" },
    { name: "SQL", slug: "postgresql" },
    { name: "pandas", slug: "pandas" },
    { name: "Figma", slug: "figma" },
    { name: "HTML", slug: "html5" },
    { name: "CSS", slug: "css3" },
    { name: "Microsoft Excel", slug: "microsoftexcel" },
    { name: "Canva", slug: "canva" },
  ] satisfies Tool[],
};
