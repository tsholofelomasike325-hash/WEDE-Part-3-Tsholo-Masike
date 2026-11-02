/* ==========================================================================
   Site content data
   Programmes are stored here and rendered dynamically on services.html,
   so updating the site means editing this array, not the HTML.
   ========================================================================== */

const CATEGORIES = {
  education: "Education",
  skills: "Skills & Employment",
  health: "Social & Health",
  enterprise: "Enterprise",
  culture: "Culture"
};

const PROGRAMMES = [
  {
    id: "after-school-tutoring",
    title: "After-school tutoring",
    category: "education",
    audience: "School-aged learners (Grades 1–12)",
    schedule: "Weekdays, after school",
    description: "Daily homework help and subject tutoring in maths, science and languages to improve academic outcomes.",
    keywords: ["homework", "maths", "science", "school", "learners", "study"],
    image: "images/soweto-learners-first-day-of-school.jpg",
    alt: "Two smiling Soweto learners in their school uniforms"
  },
  {
    id: "digital-literacy",
    title: "Digital literacy course",
    category: "education",
    audience: "Learners and unemployed young adults",
    schedule: "Short courses throughout the year",
    description: "Hands-on computer basics, internet safety, email and office tools so participants can study and apply for jobs online.",
    keywords: ["computer", "internet", "ict", "technology", "online", "laptop"],
    image: "images/learners-coding-activity-johannesburg-library.jpg",
    alt: "Learners working on a coding activity at a Johannesburg library"
  },
  {
    id: "youth-mentorship",
    title: "Youth mentorship circles",
    category: "education",
    audience: "Teenagers and young adults",
    schedule: "Fortnightly group sessions",
    description: "Trusted mentors guide young people on career choices, confidence and making positive decisions.",
    keywords: ["mentor", "careers", "guidance", "teenagers", "leadership"],
    image: "images/young-people-mentoring-session.jpg",
    alt: "Young people talking together in a mentoring session"
  },
  {
    id: "vocational-skills",
    title: "Accredited vocational skills training",
    category: "skills",
    audience: "Unemployed youth",
    schedule: "Annual intake",
    description: "Practical, accredited trade and vocational skills that lead to recognised certificates and employment.",
    keywords: ["trade", "accredited", "certificate", "training", "jobs", "unemployed"],
    image: "images/women-sewing-skills-training.jpg",
    alt: "Women learning sewing and craft skills at a workshop"
  },
  {
    id: "job-readiness",
    title: "Job-readiness & CV workshops",
    category: "skills",
    audience: "Job seekers",
    schedule: "Monthly workshops",
    description: "CV writing, interview practice and workplace skills to help job seekers land and keep work.",
    keywords: ["cv", "interview", "employment", "work", "resume", "jobs"],
    image: "images/adult-computer-training-johannesburg-library.jpg",
    alt: "Adults at a computer training session in a library"
  },
  {
    id: "youth-entrepreneurship",
    title: "Youth entrepreneurship bootcamp",
    category: "skills",
    audience: "Young aspiring entrepreneurs",
    schedule: "Intensive bootcamps",
    description: "Turn an idea into a small business: pricing, marketing, basic bookkeeping and pitching to funders.",
    keywords: ["business", "startup", "entrepreneur", "marketing", "pitch"],
    image: "images/woman-holding-handmade-craft-products.jpg",
    alt: "Woman holding handmade products she makes to sell"
  },
  {
    id: "food-parcels",
    title: "Food parcel drive",
    category: "health",
    audience: "Low-income families and seniors",
    schedule: "Regular distribution days",
    description: "Food security assistance for vulnerable households, packed and distributed by community volunteers.",
    keywords: ["food", "parcels", "hunger", "groceries", "families", "donation"],
    image: "images/volunteers-packing-food-parcels-philippi.jpg",
    alt: "Volunteers packing food parcels for families in need"
  },
  {
    id: "health-workshops",
    title: "Community health workshops",
    category: "health",
    audience: "Families and seniors",
    schedule: "Monthly",
    description: "Practical talks and screenings on nutrition, chronic illness, mental health and wellbeing.",
    keywords: ["health", "wellness", "nutrition", "mental health", "clinic", "screening"],
    image: "images/community-health-worker-health-talk.jpg",
    alt: "Community health worker giving a health talk at a clinic"
  },
  {
    id: "food-garden",
    title: "Community food garden",
    category: "health",
    audience: "All residents",
    schedule: "Ongoing",
    description: "A shared vegetable garden that supplies fresh produce for food parcels and teaches home gardening.",
    keywords: ["garden", "vegetables", "farming", "food security", "green"],
    image: "images/community-vegetable-garden-cape-town.jpg",
    alt: "People tending lettuce in a community vegetable garden"
  },
  {
    id: "business-clinic",
    title: "Micro-enterprise business clinic",
    category: "enterprise",
    audience: "Local micro-enterprises",
    schedule: "Monthly one-on-one sessions",
    description: "Business development tools, financial literacy and mentorship to help local businesses grow sustainably.",
    keywords: ["business", "mentorship", "finance", "growth", "spaza", "small business"],
    image: "images/spaza-tuck-shop-small-business.jpg",
    alt: "A township tuck shop, a typical local small business"
  },
  {
    id: "market-day",
    title: "Entrepreneur networking market day",
    category: "enterprise",
    audience: "Entrepreneurs and creatives",
    schedule: "Quarterly",
    description: "A community market where local makers sell their products, meet customers and network with partners.",
    keywords: ["market", "networking", "creatives", "sell", "crafts", "vendors"],
    image: "images/soweto-fresh-produce-market.jpg",
    alt: "Fresh produce for sale at a market in Soweto"
  },
  {
    id: "heritage",
    title: "Cultural heritage celebrations",
    category: "culture",
    audience: "The whole community",
    schedule: "Heritage Month and special events",
    description: "Music, dance, storytelling and food that celebrate Soweto's rich heritage and connect generations.",
    keywords: ["culture", "heritage", "music", "dance", "arts", "events"],
    image: "images/heritage-day-celebration-traditional-dress.jpg",
    alt: "People in traditional dress at a Heritage Day celebration"
  }
];

