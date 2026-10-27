import { ScrapCategory, MandiRate } from '../types';

export const SCRAP_CATEGORIES: ScrapCategory[] = [
  {
    id: 'cat-metal',
    name: 'Metal Scrap',
    hindiName: 'धातु / लोहा-तांबा',
    iconName: 'anvil',
    imageKey: 'copper',
    description: 'Copper, Brass, Aluminium, Heavy Iron, Sariya, Steel & Pipes',
    defaultUnit: 'kg',
    typicalPricePerKg: 120,
    subcategories: [
      { id: 'sub-copper', name: 'Copper (Armature/Wire)', hindiName: 'तांबा वायर / मोटर', imageKey: 'copper', mandiRate: 820, highestBuyDemand: 825, lowestSellOffer: 815, unit: 'kg', rateChangeToday: 4.5, purityGrade: '99.9% Pure' },
      { id: 'sub-brass', name: 'Brass / Peetal', hindiName: 'पीतल / बर्तन', imageKey: 'brasspeetal', mandiRate: 510, highestBuyDemand: 515, lowestSellOffer: 505, unit: 'kg', rateChangeToday: -2.0, purityGrade: 'Grade A Yellow' },
      { id: 'sub-aluminum', name: 'Aluminium (Cast/Sheet)', hindiName: 'एल्युमिनियम', imageKey: 'aluminum', mandiRate: 175, highestBuyDemand: 178, lowestSellOffer: 172, unit: 'kg', rateChangeToday: 1.5, purityGrade: 'Clean Extrusion' },
      { id: 'sub-lightiron', name: 'Light Iron (Tin/Sheet)', hindiName: 'हल्का लोहा / टीन', imageKey: 'lightiron', mandiRate: 32, highestBuyDemand: 33, lowestSellOffer: 31, unit: 'kg', rateChangeToday: 0.5 },
      { id: 'sub-heavyiron', name: 'Heavy Iron & Castings', hindiName: 'भारी लोहा / मशीनरी', imageKey: 'heavyiron', mandiRate: 42, highestBuyDemand: 43.5, lowestSellOffer: 41, unit: 'kg', rateChangeToday: 1.0 },
      { id: 'sub-sariya', name: 'TMT Sariya & Rebar', hindiName: 'टीटी सरिया वेस्ट', imageKey: 'sariya', mandiRate: 46, highestBuyDemand: 47, lowestSellOffer: 45.5, unit: 'kg', rateChangeToday: 0.8 },
      { id: 'sub-steel', name: 'Stainless Steel (304/202)', hindiName: 'स्टील स्क्रैप', imageKey: 'steelitems', mandiRate: 105, highestBuyDemand: 108, lowestSellOffer: 103, unit: 'kg', rateChangeToday: 2.0 },
      { id: 'sub-pipe', name: 'GI & MS Metal Pipes', hindiName: 'लोहे के पाइप', imageKey: 'pipe', mandiRate: 38, highestBuyDemand: 39, lowestSellOffer: 37, unit: 'kg', rateChangeToday: 0.0 },
    ]
  },
  {
    id: 'cat-ewaste',
    name: 'E-Waste & Electronics',
    hindiName: 'इलेक्ट्रॉनिक्स वेस्ट',
    iconName: 'cpu',
    imageKey: 'oldtvled',
    description: 'ACs, Refrigerators, TVs, Washing Machines, Laptops, Phones',
    defaultUnit: 'piece',
    typicalPricePerKg: 85,
    subcategories: [
      { id: 'sub-fridgeac', name: 'AC & Refrigerator (Compressor)', hindiName: 'एसी / फ्रिज स्क्रैप', imageKey: 'fridgeac', mandiRate: 1850, highestBuyDemand: 1900, lowestSellOffer: 1800, unit: 'piece', rateChangeToday: 50.0 },
      { id: 'sub-washingmachine', name: 'Washing Machine (Motor)', hindiName: 'वॉशिंग मशीन', imageKey: 'washingmachine', mandiRate: 850, highestBuyDemand: 880, lowestSellOffer: 820, unit: 'piece', rateChangeToday: 0.0 },
      { id: 'sub-oldtvled', name: 'Old CRT TV & LED Panels', hindiName: 'पुराना टीवी / एलइडी', imageKey: 'oldtvled', mandiRate: 350, highestBuyDemand: 360, lowestSellOffer: 340, unit: 'piece', rateChangeToday: -10.0 },
      { id: 'sub-laptop', name: 'Laptops & Desktop CPU PCB', hindiName: 'लैपटॉप व कंप्यूटर मदरबोर्ड', imageKey: 'laptopcomputer', mandiRate: 650, highestBuyDemand: 680, lowestSellOffer: 640, unit: 'piece', rateChangeToday: 25.0 },
      { id: 'sub-mobiles', name: 'Smartphones & PCB Motherboard', hindiName: 'मोबाइल व बोर्ड्स', imageKey: 'mobilephones', mandiRate: 140, highestBuyDemand: 150, lowestSellOffer: 135, unit: 'piece', rateChangeToday: 5.0 },
      { id: 'sub-brokenappliances', name: 'Mixed Broken Appliances', hindiName: 'मिक्स इलेक्ट्रॉनिक सामान', imageKey: 'brokenitems', mandiRate: 45, highestBuyDemand: 47, lowestSellOffer: 43, unit: 'kg', rateChangeToday: 0.5 },
    ]
  },
  {
    id: 'cat-battery',
    name: 'Battery Scrap (Lead-Acid)',
    hindiName: 'बैटरी स्क्रैप',
    iconName: 'battery-charging',
    imageKey: 'carbattery',
    description: 'Car, Inverter, UPS, Solar & Truck Lead Acid Batteries',
    defaultUnit: 'kg',
    typicalPricePerKg: 95,
    subcategories: [
      { id: 'sub-carbattery', name: 'Automotive Car Battery', hindiName: 'कार की बैटरी', imageKey: 'carbattery', mandiRate: 98, highestBuyDemand: 100, lowestSellOffer: 96, unit: 'kg', rateChangeToday: 1.2 },
      { id: 'sub-inverterbattery', name: 'Tall Tubular Inverter Battery', hindiName: 'इन्वर्टर ट्यूबलर बैटरी', imageKey: 'inverterbattery', mandiRate: 102, highestBuyDemand: 105, lowestSellOffer: 100, unit: 'kg', rateChangeToday: 1.5 },
      { id: 'sub-upsbattery', name: 'UPS & SMF Small Battery', hindiName: 'यूपीएस ड्राई बैटरी', imageKey: 'upsbattery', mandiRate: 92, highestBuyDemand: 94, lowestSellOffer: 90, unit: 'kg', rateChangeToday: 0.8 },
    ]
  },
  {
    id: 'cat-vehicles',
    name: 'Automobiles & Vehicles',
    hindiName: 'गाड़ी व ऑटो स्क्रैप',
    iconName: 'car',
    imageKey: 'oldcars',
    description: 'End-of-life Cars, Bikes, Scooters, Chassis & Engines',
    defaultUnit: 'piece',
    typicalPricePerKg: 45,
    subcategories: [
      { id: 'sub-oldcars', name: 'Total Loss / RTO Scrap Car', hindiName: 'पुरानी कबाड़ कार', imageKey: 'oldcars', mandiRate: 32000, highestBuyDemand: 33000, lowestSellOffer: 31500, unit: 'piece', rateChangeToday: 500.0 },
      { id: 'sub-bikescrap', name: 'Two-Wheeler Bike / Scooter', hindiName: 'बाइक / स्कूटी स्क्रैप', imageKey: 'bikescrap', mandiRate: 3800, highestBuyDemand: 4000, lowestSellOffer: 3700, unit: 'piece', rateChangeToday: 50.0 },
      { id: 'sub-autoscrap', name: 'Auto Rickshaw & Tempo Body', hindiName: 'ऑटो व टेम्पो बॉडी', imageKey: 'autoscrap', mandiRate: 14000, highestBuyDemand: 14500, lowestSellOffer: 13800, unit: 'piece', rateChangeToday: 200.0 },
      { id: 'sub-carparts', name: 'Auto Engine & Gearbox Parts', hindiName: 'इंजन व गियरबॉक्स पार्ट्स', imageKey: 'carparts', mandiRate: 48, highestBuyDemand: 50, lowestSellOffer: 47, unit: 'kg', rateChangeToday: 1.0 },
    ]
  },
  {
    id: 'cat-paper',
    name: 'Paper & Cardboard (Gatta)',
    hindiName: 'कागज व गत्ता (रद्दी)',
    iconName: 'newspaper',
    imageKey: 'newspaper',
    description: 'Newspaper, Corrugated Cartons, Books, Office Paper',
    defaultUnit: 'kg',
    typicalPricePerKg: 16,
    subcategories: [
      { id: 'sub-newspaper', name: 'English/Hindi Newspaper', hindiName: 'अखबार रद्दी', imageKey: 'newspaper', mandiRate: 18, highestBuyDemand: 18.5, lowestSellOffer: 17.5, unit: 'kg', rateChangeToday: 0.5 },
      { id: 'sub-cardboard', name: 'Corrugated Box / Gatta', hindiName: 'कार्टन / गत्ता बॉक्स', imageKey: 'cartooncardboard', mandiRate: 13.5, highestBuyDemand: 14, lowestSellOffer: 13, unit: 'kg', rateChangeToday: 0.2 },
      { id: 'sub-bookscopies', name: 'School Books & Notebooks', hindiName: 'किताबें व कॉपियां', imageKey: 'bookscopies', mandiRate: 15, highestBuyDemand: 15.5, lowestSellOffer: 14.5, unit: 'kg', rateChangeToday: 0.0 },
      { id: 'sub-officepaper', name: 'White Office Shredded Paper', hindiName: 'सफेद ऑफिस पेपर', imageKey: 'officepaper', mandiRate: 19, highestBuyDemand: 20, lowestSellOffer: 18.5, unit: 'kg', rateChangeToday: 0.5 },
    ]
  },
  {
    id: 'cat-plastics',
    name: 'Plastics & Polymers',
    hindiName: 'प्लास्टिक स्क्रैप',
    iconName: 'recycle',
    imageKey: 'plasticcontainer',
    description: 'HDPE Containers, PET Bottles, Soft Polythene, Drums',
    defaultUnit: 'kg',
    typicalPricePerKg: 28,
    subcategories: [
      { id: 'sub-plasticcontainers', name: 'HDPE Chemical Drums & Crates', hindiName: 'कंटेनर व ड्रम', imageKey: 'plasticcontainer', mandiRate: 36, highestBuyDemand: 37, lowestSellOffer: 35, unit: 'kg', rateChangeToday: 0.5 },
      { id: 'sub-heavyplastic', name: 'Hard Molded Plastic (Chairs/Tubs)', hindiName: 'कड़क प्लास्टिक / कुर्सी', imageKey: 'heavyplastic', mandiRate: 26, highestBuyDemand: 27, lowestSellOffer: 25, unit: 'kg', rateChangeToday: 0.0 },
      { id: 'sub-softplastic', name: 'LDPE Soft Film & Polythene', hindiName: 'सॉफ्ट प्लास्टिक पन्नी', imageKey: 'softplastic', mandiRate: 22, highestBuyDemand: 23, lowestSellOffer: 21, unit: 'kg', rateChangeToday: -0.5 },
      { id: 'sub-lightplastic', name: 'PET Water & Soda Bottles', hindiName: 'पीईटी बोतलें', imageKey: 'lightplastic', mandiRate: 24, highestBuyDemand: 25, lowestSellOffer: 23, unit: 'kg', rateChangeToday: 0.3 },
    ]
  },
  {
    id: 'cat-glass',
    name: 'Glass Scrap',
    hindiName: 'कांच की रद्दी',
    iconName: 'wine',
    imageKey: 'glassbottles',
    description: 'Beverage Bottles, Window Pane Glass, Cullet',
    defaultUnit: 'kg',
    typicalPricePerKg: 4.5,
    subcategories: [
      { id: 'sub-glassbottles', name: 'Beer & Liquor Glass Bottles', hindiName: 'कांच की बोतलें', imageKey: 'glassbottles', mandiRate: 3.5, highestBuyDemand: 3.8, lowestSellOffer: 3.2, unit: 'piece', rateChangeToday: 0.0 },
      { id: 'sub-windowglass', name: 'Flat Architectural Window Glass', hindiName: 'खिड़की का समतल कांच', imageKey: 'windowglass', mandiRate: 2.8, highestBuyDemand: 3.0, lowestSellOffer: 2.6, unit: 'kg', rateChangeToday: 0.0 },
      { id: 'sub-normalglass', name: 'Mixed Broken Cullet Glass', hindiName: 'टूटा कांच कबाड़', imageKey: 'normalglass', mandiRate: 2.2, highestBuyDemand: 2.4, lowestSellOffer: 2.0, unit: 'kg', rateChangeToday: 0.0 },
    ]
  },
  {
    id: 'cat-textiles',
    name: 'Textiles & Fabric Waste',
    hindiName: 'कपड़ा व कतरन वेस्ट',
    iconName: 'shirt',
    imageKey: 'fabricwaste',
    description: 'Old Garments, Factory Tailoring Cut-Pieces, Cotton Rags',
    defaultUnit: 'kg',
    typicalPricePerKg: 14,
    subcategories: [
      { id: 'sub-fabricwaste', name: 'Export Tailoring Cutting Pieces', hindiName: 'सिलाई कतरन वेस्ट', imageKey: 'fabricwaste', mandiRate: 22, highestBuyDemand: 23, lowestSellOffer: 21, unit: 'kg', rateChangeToday: 0.5 },
      { id: 'sub-oldclothes', name: 'Used Household Old Clothes', hindiName: 'पुराने घर के कपड़े', imageKey: 'oldclothes', mandiRate: 10, highestBuyDemand: 11, lowestSellOffer: 9.5, unit: 'kg', rateChangeToday: 0.0 },
    ]
  },
  {
    id: 'cat-furniture',
    name: 'Furniture & Wood Waste',
    hindiName: 'पुराना फर्नीचर व लकड़ी',
    iconName: 'archive',
    imageKey: 'oldfurniture',
    description: 'Steel Almirahs, Wooden Tables, Office Workstations',
    defaultUnit: 'piece',
    typicalPricePerKg: 20,
    subcategories: [
      { id: 'sub-oldfurniture', name: 'Commercial Office / Home Furniture', hindiName: 'ऑफिस व घर का फर्नीचर', imageKey: 'oldfurniture', mandiRate: 1200, highestBuyDemand: 1300, lowestSellOffer: 1150, unit: 'piece', rateChangeToday: 0.0 },
    ]
  },
  {
    id: 'cat-industrial',
    name: 'Industrial & Construction Scrap',
    hindiName: 'फैक्ट्री व कंस्ट्रक्शन स्क्रैप',
    iconName: 'factory',
    imageKey: 'Factoryscrap',
    description: 'Factory Plant Dismantling, Structural Steel, Demo Waste',
    defaultUnit: 'ton',
    typicalPricePerKg: 42,
    subcategories: [
      { id: 'sub-factoryscrap', name: 'Factory Machinery Dismantling Lot', hindiName: 'फैक्ट्री मशीनरी डिसमेंटलिंग', imageKey: 'Factoryscrap', mandiRate: 44500, highestBuyDemand: 45000, lowestSellOffer: 44000, unit: 'ton', rateChangeToday: 450.0 },
      { id: 'sub-constructionscrap', name: 'Building Demolition Reinforcement Bar', hindiName: 'कंस्ट्रक्शन लोहा व गर्डर', imageKey: 'constructionscrap', mandiRate: 43000, highestBuyDemand: 43500, lowestSellOffer: 42500, unit: 'ton', rateChangeToday: 300.0 },
      { id: 'sub-mixedkabadi', name: 'Mixed Warehouse Surplus Bulk Lot', hindiName: 'थोक मिक्स कबाड़ लॉट', imageKey: 'mixedkabadi', mandiRate: 36000, highestBuyDemand: 36500, lowestSellOffer: 35500, unit: 'ton', rateChangeToday: 200.0 },
    ]
  }
];

export const INITIAL_MANDI_RATES: MandiRate[] = [
  { id: 'rate-1', categoryName: 'Metal Scrap', materialName: 'Copper (Armature)', imageKey: 'copper', currentRate: 820, highestBuyDemand: 825, lowestSellAsk: 815, previousRate: 815.5, changeToday: 4.5, changePercent: 0.55, unit: 'kg', marketLocation: 'Delhi Mandi', updatedAt: '10 mins ago' },
  { id: 'rate-2', categoryName: 'Metal Scrap', materialName: 'Brass / Peetal', imageKey: 'brasspeetal', currentRate: 510, highestBuyDemand: 515, lowestSellAsk: 505, previousRate: 512.0, changeToday: -2.0, changePercent: -0.39, unit: 'kg', marketLocation: 'Moradabad Mandi', updatedAt: '25 mins ago' },
  { id: 'rate-3', categoryName: 'Metal Scrap', materialName: 'Aluminium Extrusion', imageKey: 'aluminum', currentRate: 175, highestBuyDemand: 178, lowestSellAsk: 172, previousRate: 173.5, changeToday: 1.5, changePercent: 0.86, unit: 'kg', marketLocation: 'Mumbai Mandi', updatedAt: '15 mins ago' },
  { id: 'rate-4', categoryName: 'Metal Scrap', materialName: 'Heavy Iron (Machinery)', imageKey: 'heavyiron', currentRate: 42, highestBuyDemand: 43.5, lowestSellAsk: 41, previousRate: 41.0, changeToday: 1.0, changePercent: 2.44, unit: 'kg', marketLocation: 'Mandi Gobindgarh', updatedAt: '5 mins ago' },
  { id: 'rate-5', categoryName: 'Metal Scrap', materialName: 'TMT Sariya Waste', imageKey: 'sariya', currentRate: 46, highestBuyDemand: 47, lowestSellAsk: 45.5, previousRate: 45.2, changeToday: 0.8, changePercent: 1.77, unit: 'kg', marketLocation: 'Raipur Mandi', updatedAt: '30 mins ago' },
  { id: 'rate-6', categoryName: 'Battery Scrap', materialName: 'Lead Battery (Automotive)', imageKey: 'carbattery', currentRate: 98, highestBuyDemand: 100, lowestSellAsk: 96, previousRate: 96.8, changeToday: 1.2, changePercent: 1.24, unit: 'kg', marketLocation: 'Pan India Rate', updatedAt: '12 mins ago' },
  { id: 'rate-7', categoryName: 'Paper Scrap', materialName: 'Corrugated Carton (Gatta)', imageKey: 'cartooncardboard', currentRate: 13.5, highestBuyDemand: 14, lowestSellAsk: 13, previousRate: 13.3, changeToday: 0.2, changePercent: 1.50, unit: 'kg', marketLocation: 'Vapi Paper Hub', updatedAt: '40 mins ago' },
  { id: 'rate-8', categoryName: 'Paper Scrap', materialName: 'Newspaper (Raddi)', imageKey: 'newspaper', currentRate: 18, highestBuyDemand: 18.5, lowestSellAsk: 17.5, previousRate: 17.5, changeToday: 0.5, changePercent: 2.86, unit: 'kg', marketLocation: 'Delhi NCR', updatedAt: '1 hour ago' },
  { id: 'rate-9', categoryName: 'Plastics', materialName: 'HDPE Drums & Crates', imageKey: 'plasticcontainer', currentRate: 36, highestBuyDemand: 37, lowestSellAsk: 35, previousRate: 35.5, changeToday: 0.5, changePercent: 1.41, unit: 'kg', marketLocation: 'Ahmedabad Mandi', updatedAt: '45 mins ago' },
  { id: 'rate-10', categoryName: 'Industrial', materialName: 'Heavy Structural Steel', imageKey: 'Factoryscrap', currentRate: 44.5, highestBuyDemand: 45, lowestSellAsk: 44, previousRate: 44.0, changeToday: 0.5, changePercent: 1.14, unit: 'kg', marketLocation: 'Alang Shipbreaking', updatedAt: '2 hours ago' },
];
