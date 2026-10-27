// Sahi Bhaav Comprehensive Asset Registry

export const BRANDING_IMAGES = {
  appIcon: require("../../assets/branding/app_icon.png"),
  heroBanner: require("../../assets/branding/hero_banner.png"),
  logoHorizontal: require("../../assets/branding/logo_horizontal.png"),
};

export const UI_IMAGES = {
  callDeal: require("../../assets/ui/call_deal_discussion.png"),
  listingSuccess: require("../../assets/ui/listing_success.png"),
  requestNewCategory: require("../../assets/ui/request_new_category.png"),
};

export const SCRAP_IMAGES = {
  // New Studio 3D Category PNGs
  iron_steel_scrap: require("../../assets/scrap/iron_steel_scrap.png"),
  copper_scrap: require("../../assets/scrap/copper_scrap.png"),
  aluminium_scrap: require("../../assets/scrap/aluminium_scrap.png"),
  brass_scrap: require("../../assets/scrap/brass_scrap.png"),
  stainless_steel_scrap: require("../../assets/scrap/stainless_steel_scrap.png"),
  battery_lead_scrap: require("../../assets/scrap/battery_lead_scrap.png"),
  ewaste_scrap1: require("../../assets/scrap/ewaste_scrap1.png"),
  ewaste_scrap2: require("../../assets/scrap/ewaste_scrap2.png"),
  machinery_motor_scrap: require("../../assets/scrap/machinery_motor_scrap.png"),
  plastic_scrap: require("../../assets/scrap/plastic_scrap.png"),
  paper_cardboard_scrap: require("../../assets/scrap/paper_cardboard_scrap.png"),
  tyre_rubber_scrap: require("../../assets/scrap/tyre_rubber_scrap.png"),
  vehicle_auto_scrap: require("../../assets/scrap/vehicle_auto_scrap.png"),

  // Additional Subcategory WebP Images
  copper: require("../../assets/scrap/copper.webp"),
  brasspeetal: require("../../assets/scrap/brasspeetal.webp"),
  aluminum: require("../../assets/scrap/aluminum.webp"),
  lightiron: require("../../assets/scrap/lightiron.webp"),
  heavyiron: require("../../assets/scrap/heavyiron.webp"),
  sariya: require("../../assets/scrap/sariya.webp"),
  steelitems: require("../../assets/scrap/steelitems.webp"),
  pipe: require("../../assets/scrap/pipe.webp"),

  fridgeac: require("../../assets/scrap/fridgeac.webp"),
  washingmachine: require("../../assets/scrap/washingmachine.webp"),
  oldtvled: require("../../assets/scrap/oldtvled.webp"),
  laptopcomputer: require("../../assets/scrap/laptopcomputer.webp"),
  mobilephones: require("../../assets/scrap/mobilephones.webp"),
  brokenitems: require("../../assets/scrap/brokenitems.webp"),

  carbattery: require("../../assets/scrap/carbattery.webp"),
  inverterbattery: require("../../assets/scrap/inverterbattery.webp"),
  upsbattery: require("../../assets/scrap/upsbattery.webp"),

  oldcars: require("../../assets/scrap/oldcars.webp"),
  autoscrap: require("../../assets/scrap/autoscrap.webp"),
  bikescrap: require("../../assets/scrap/bikescrap.webp"),
  carparts: require("../../assets/scrap/carparts.webp"),

  newspaper: require("../../assets/scrap/newspaper.webp"),
  cartooncardboard: require("../../assets/scrap/cartooncardboard.webp"),
  bookscopies: require("../../assets/scrap/bookscopies.webp"),
  officepaper: require("../../assets/scrap/officepaper.webp"),

  plasticcontainer: require("../../assets/scrap/plasticcontainer.webp"),
  softplastic: require("../../assets/scrap/softplastic.webp"),
  heavyplastic: require("../../assets/scrap/heavyplastic.webp"),
  lightplastic: require("../../assets/scrap/lightplastic.webp"),

  glassbottles: require("../../assets/scrap/glassbottles.webp"),
  windowglass: require("../../assets/scrap/windowglass.webp"),
  normalglass: require("../../assets/scrap/normalglass.webp"),

  oldclothes: require("../../assets/scrap/oldclothes.webp"),
  fabricwaste: require("../../assets/scrap/fabricwaste.webp"),
  oldfurniture: require("../../assets/scrap/oldfurniture.webp"),

  Factoryscrap: require("../../assets/scrap/Factoryscrap.webp"),
  constructionscrap: require("../../assets/scrap/constructionscrap.webp"),
  mixedkabadi: require("../../assets/scrap/mixedkabadi.webp"),
} as const;

export type ScrapImageKey = keyof typeof SCRAP_IMAGES;

export function getScrapImage(key?: string): any {
  if (key && key in SCRAP_IMAGES) {
    return SCRAP_IMAGES[key as ScrapImageKey];
  }
  return SCRAP_IMAGES.iron_steel_scrap;
}

// Multi-image collections for categories of the same type/name
export const CATEGORY_MULTI_IMAGES: Record<string, any[]> = {
  "iron-steel": [
    SCRAP_IMAGES.iron_steel_scrap,
    SCRAP_IMAGES.heavyiron,
    SCRAP_IMAGES.sariya,
    SCRAP_IMAGES.pipe,
    SCRAP_IMAGES.lightiron,
  ],
  copper: [
    SCRAP_IMAGES.copper_scrap,
    SCRAP_IMAGES.copper,
  ],
  aluminium: [
    SCRAP_IMAGES.aluminium_scrap,
    SCRAP_IMAGES.aluminum,
  ],
  brass: [
    SCRAP_IMAGES.brass_scrap,
    SCRAP_IMAGES.brasspeetal,
  ],
  "stainless-steel": [
    SCRAP_IMAGES.stainless_steel_scrap,
    SCRAP_IMAGES.steelitems,
  ],
  "lead-battery": [
    SCRAP_IMAGES.battery_lead_scrap,
    SCRAP_IMAGES.inverterbattery,
    SCRAP_IMAGES.carbattery,
    SCRAP_IMAGES.upsbattery,
  ],
  ewaste: [
    SCRAP_IMAGES.ewaste_scrap1,
    SCRAP_IMAGES.ewaste_scrap2,
    SCRAP_IMAGES.laptopcomputer,
    SCRAP_IMAGES.mobilephones,
    SCRAP_IMAGES.oldtvled,
  ],
  "machinery-motors": [
    SCRAP_IMAGES.machinery_motor_scrap,
    SCRAP_IMAGES.washingmachine,
    SCRAP_IMAGES.fridgeac,
    SCRAP_IMAGES.Factoryscrap,
  ],
  plastic: [
    SCRAP_IMAGES.plastic_scrap,
    SCRAP_IMAGES.plasticcontainer,
    SCRAP_IMAGES.heavyplastic,
    SCRAP_IMAGES.lightplastic,
    SCRAP_IMAGES.softplastic,
  ],
  "paper-cardboard": [
    SCRAP_IMAGES.paper_cardboard_scrap,
    SCRAP_IMAGES.cartooncardboard,
    SCRAP_IMAGES.newspaper,
    SCRAP_IMAGES.bookscopies,
    SCRAP_IMAGES.officepaper,
  ],
  tyres: [
    SCRAP_IMAGES.tyre_rubber_scrap,
  ],
  "auto-parts": [
    SCRAP_IMAGES.vehicle_auto_scrap,
    SCRAP_IMAGES.autoscrap,
    SCRAP_IMAGES.carparts,
    SCRAP_IMAGES.bikescrap,
    SCRAP_IMAGES.oldcars,
  ],
};

// 12 High-Impact Items for Home Page Auto-Swiping Hero Slider
export const HOME_SLIDER_ITEMS = [
  {
    id: "slide-1",
    titleHi: "लोहा और एमएस स्क्रैप (HMS 1)",
    titleEn: "Heavy Iron & Steel Scrap",
    rate: "₹38",
    unit: "kg",
    tagHi: "उच्च मांग • तुरंत उठाव",
    tagEn: "High Demand • Bulk Pickup",
    image: SCRAP_IMAGES.iron_steel_scrap,
    categoryId: "iron-steel",
  },
  {
    id: "slide-2",
    titleHi: "तांबा मिलबेरी तार (99.9%)",
    titleEn: "Bright Copper Millberry",
    rate: "₹745",
    unit: "kg",
    tagHi: "सर्वोच्च भाव • नकद भुगतान",
    tagEn: "Top Price • Instant Payment",
    image: SCRAP_IMAGES.copper_scrap,
    categoryId: "copper",
  },
  {
    id: "slide-3",
    titleHi: "एल्युमिनियम 6063 प्रोफाइल",
    titleEn: "Aluminium Extrusion 6063",
    rate: "₹195",
    unit: "kg",
    tagHi: "फैक्ट्री रेट • 18,500 kg उपलब्ध",
    tagEn: "Factory Rate • 18,500 kg Ready",
    image: SCRAP_IMAGES.aluminium_scrap,
    categoryId: "aluminium",
  },
  {
    id: "slide-4",
    titleHi: "पीला हनी पीतल (Honey Brass)",
    titleEn: "Yellow Honey Brass Scrap",
    rate: "₹460",
    unit: "kg",
    tagHi: "शुद्ध पीतल • सीधी तोल",
    tagEn: "Clean Honey • Accurate Weight",
    image: SCRAP_IMAGES.brass_scrap,
    categoryId: "brass",
  },
  {
    id: "slide-5",
    titleHi: "स्टेनलेस स्टील SS 304",
    titleEn: "Stainless Steel 304 Scrap",
    rate: "₹130",
    unit: "kg",
    tagHi: "नॉन-मैग्नेटिक • 12 टन स्टॉक",
    tagEn: "Non-Magnetic • 12 Ton Stock",
    image: SCRAP_IMAGES.stainless_steel_scrap,
    categoryId: "stainless-steel",
  },
  {
    id: "slide-6",
    titleHi: "इनवर्टर व ट्रक बैटरी स्क्रैप",
    titleEn: "Lead Acid Batteries Scrap",
    rate: "₹98",
    unit: "kg",
    tagHi: "सभी ब्रांड्स • तत्काल तोल",
    tagEn: "All Brands • Same Day Deal",
    image: SCRAP_IMAGES.battery_lead_scrap,
    categoryId: "lead-battery",
  },
  {
    id: "slide-7",
    titleHi: "ई-वेस्ट मदरबोर्ड व सर्वर बोर्ड",
    titleEn: "E-Waste Circuit PCBs",
    rate: "₹180",
    unit: "kg",
    tagHi: "ग्रेड ए इलेक्ट्रॉनिक कचरा",
    tagEn: "Grade A High Recovery PCBs",
    image: SCRAP_IMAGES.ewaste_scrap1,
    categoryId: "ewaste",
  },
  {
    id: "slide-8",
    titleHi: "इंडस्ट्रियल 3-फेज मोटर व मशीनरी",
    titleEn: "Heavy Electric Motors & Plant Scrap",
    rate: "₹46,000",
    unit: "ton",
    tagHi: "प्लांट डिस्मेंटलिंग सौदा",
    tagEn: "Complete Plant Dismantling",
    image: SCRAP_IMAGES.machinery_motor_scrap,
    categoryId: "machinery-motors",
  },
  {
    id: "slide-9",
    titleHi: "प्लास्टिक एचडीपीई नीले ड्रम",
    titleEn: "HDPE Chemical Drums & Scrap",
    rate: "₹32",
    unit: "kg",
    tagHi: "22,000 kg उपलब्ध",
    tagEn: "22,000 kg Ready Stock",
    image: SCRAP_IMAGES.plastic_scrap,
    categoryId: "plastic",
  },
  {
    id: "slide-10",
    titleHi: "गत्ता व क्राफ्ट पेटियां (OCC)",
    titleEn: "Corrugated Cardboard Bales (OCC)",
    rate: "₹14",
    unit: "kg",
    tagHi: "प्रेस बंडल • पेपर मिल ग्रेड",
    tagEn: "Pressed Bales • Paper Mill Grade",
    image: SCRAP_IMAGES.paper_cardboard_scrap,
    categoryId: "paper-cardboard",
  },
  {
    id: "slide-11",
    titleHi: "ट्रक व रेडियल टायर स्क्रैप",
    titleEn: "Whole Radial Truck Tyres",
    rate: "₹12,500",
    unit: "ton",
    tagHi: "पायरोलिसिस व कटिंग ग्रेड",
    tagEn: "Pyrolysis & Retreading Grade",
    image: SCRAP_IMAGES.tyre_rubber_scrap,
    categoryId: "tyres",
  },
  {
    id: "slide-12",
    titleHi: "गाड़ियों का कबाड़ व इंजन ब्लॉक",
    titleEn: "Automobile Scrap & Engine Blocks",
    rate: "₹44",
    unit: "kg",
    tagHi: "कास्ट आयरन व अलॉय कटिंग",
    tagEn: "Cast Iron & Chassis Cuts",
    image: SCRAP_IMAGES.vehicle_auto_scrap,
    categoryId: "auto-parts",
  },
];
