export const CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics",
    targetCount: 526,
    icon: "Tv",
    color: "from-cyan-400 to-blue-500",
    glow: "shadow-cyan-500/20",
    tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    subCategories: ["Smart Televisions", "Audio & Headphones", "Wearables & Smartwatches", "Home Audio & Soundbars", "Cables & Power"],
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80", // TV
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", // Headphones
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", // Watch
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80", // Speaker
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", // Earbuds
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80", // Studio headphones
    ],
    brands: ["Sony", "Samsung", "OnePlus", "boAt", "Fire-Boltt", "Noise", "MI", "JBL", "Realme", "TCL", "Acer", "LG"],
    templates: [
      { template: "{brand} {screen}\" 4K Ultra HD Smart LED TV", subCategory: "Smart Televisions" },
      { template: "{brand} Wireless Bluetooth Over-Ear Headphones with Mic", subCategory: "Audio & Headphones" },
      { template: "{brand} True Wireless Earbuds with ANC and 40H Playtime", subCategory: "Audio & Headphones" },
      { template: "{brand} {screen}\" Smartwatch with Bluetooth Calling & SpO2", subCategory: "Wearables & Smartwatches" },
      { template: "{brand} Portable Bluetooth Speaker with Bass Boost {watt}W", subCategory: "Home Audio & Soundbars" },
      { template: "{brand} Universal Smart Remote Control for Smart TV", subCategory: "Smart Televisions" },
      { template: "{brand} 10000mAh Magnetic Wireless Fast Charging Power Bank", subCategory: "Cables & Power" },
      { template: "{brand} 5.1 Soundbar with Wireless Subwoofer and Dolby Audio", subCategory: "Home Audio & Soundbars" },
      { template: "{brand} High-Speed 4K HDMI 2.1 Cable 2-Meter", subCategory: "Cables & Power" },
      { template: "{brand} Full HD 1080p Home Theater Movie Projector", subCategory: "Smart Televisions" },
      { template: "{brand} Dual-Band Wi-Fi 6 Gigabit Wireless Router", subCategory: "Cables & Power" },
      { template: "{brand} Compact Digital Alarm Clock with Wireless Charger", subCategory: "Wearables & Smartwatches" },
      { template: "{brand} Heavy-Duty Swivel TV Wall Mount Bracket", subCategory: "Smart Televisions" },
      { template: "{brand} USB Gaming Microphone with RGB Lighting", subCategory: "Audio & Headphones" },
    ],
  },
  {
    id: "computers",
    name: "Computers & Accessories",
    targetCount: 453,
    icon: "Laptop",
    color: "from-fuchsia-500 to-pink-500",
    glow: "shadow-fuchsia-500/20",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    subCategories: ["Keyboards & Mice", "Storage Devices", "Laptop Accessories", "Hubs & Adapters", "Networking & Cables"],
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80", // Mouse
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80", // Keyboard
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // Storage
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80", // Electronics desk
      "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=80", // Gaming desk
    ],
    brands: ["Amazon Basics", "Logitech", "SanDisk", "HP", "Dell", "Wayona", "Lapster", "TP-Link", "Portronics", "Zebronics", "Crucial", "Redragon"],
    templates: [
      { template: "{brand} 2.4 GHz Ergonomic Wireless Optical Mouse", subCategory: "Keyboards & Mice" },
      { template: "{brand} Ultra-Slim Mechanical Gaming Keyboard RGB", subCategory: "Keyboards & Mice" },
      { template: "{brand} Nylon Braided Fast Charging USB-C to Lightning Cable 3.3ft", subCategory: "Networking & Cables" },
      { template: "{brand} 7-in-1 USB-C Hub with 4K HDMI, SD Card Reader & PD", subCategory: "Hubs & Adapters" },
      { template: "{brand} Ultra-Speed 128GB USB 3.2 Gen 1 Flash Drive", subCategory: "Storage Devices" },
      { template: "{brand} High-Speed USB 3.0 to Gigabit RJ45 Ethernet Adapter", subCategory: "Hubs & Adapters" },
      { template: "{brand} 1080p Full HD Pro Streaming Webcam with Privacy Shutter", subCategory: "Laptop Accessories" },
      { template: "{brand} Laptop Cooling Pad with 5 Silent High-RPM Fans", subCategory: "Laptop Accessories" },
      { template: "{brand} Aluminum Adjustable Ergonomic Laptop Stand", subCategory: "Laptop Accessories" },
      { template: "{brand} Water-Resistant Padded 15.6-inch Laptop Backpack", subCategory: "Laptop Accessories" },
      { template: "{brand} 300Mbps Nano Wi-Fi USB Adapter Dongle", subCategory: "Networking & Cables" },
      { template: "{brand} Extended Anti-Slip Micro-Textured Gaming Mouse Pad", subCategory: "Keyboards & Mice" },
      { template: "{brand} 65W GaN Fast Charger Power Adapter Dual USB-C", subCategory: "Hubs & Adapters" },
      { template: "{brand} 500GB Portable External NVMe Solid State Drive", subCategory: "Storage Devices" },
    ],
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    targetCount: 448,
    icon: "Coffee",
    color: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/20",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    subCategories: ["Small Kitchen Appliances", "Cookware & Dining", "Coffee & Tea Makers", "Kitchen Storage"],
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", // Kitchen kettle
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80", // Coffee maker
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80", // Cookware
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80", // Kitchen appliances
    ],
    brands: ["Prestige", "Pigeon", "Philips", "Bajaj", "Morphy Richards", "Kent", "Wonderchef", "Milton", "Cello", "Borosil"],
    templates: [
      { template: "{brand} Induction Cooktop 1900W with Push-Button Control", subCategory: "Small Kitchen Appliances" },
      { template: "{brand} Stainless Steel Electric Kettle 1.5L Auto Shut-Off", subCategory: "Coffee & Tea Makers" },
      { template: "{brand} Electric Hand Blender 300W with Stainless Steel Blades", subCategory: "Small Kitchen Appliances" },
      { template: "{brand} Electric Milk Frother and Handheld Drink Whisk", subCategory: "Coffee & Tea Makers" },
      { template: "{brand} 750W Mixer Grinder with 3 Stainless Steel Jars", subCategory: "Small Kitchen Appliances" },
      { template: "{brand} Non-Stick Die-Cast Aluminum Dosa Tawa 28cm", subCategory: "Cookware & Dining" },
      { template: "{brand} Digital Food Weighing Scale with Tare Function", subCategory: "Kitchen Storage" },
      { template: "{brand} Insulated Stainless Steel Water Bottle 1000ml", subCategory: "Kitchen Storage" },
      { template: "{brand} 4-Slice Automatic Pop-Up Bread Toaster with Defrost", subCategory: "Small Kitchen Appliances" },
      { template: "{brand} Borosilicate Glass Airtight Food Storage Containers Set of 4", subCategory: "Kitchen Storage" },
    ],
  },
  {
    id: "office-products",
    name: "Office Products",
    targetCount: 31,
    icon: "Briefcase",
    color: "from-emerald-400 to-teal-500",
    glow: "shadow-emerald-500/20",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    subCategories: ["Calculators & Electronics", "Desk Organizers", "Filing & Supplies"],
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80", // Office desk
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80", // Calculator notebook
    ],
    brands: ["Casio", "Amazon Basics", "Solo", "Kangaro", "Classmate"],
    templates: [
      { template: "{brand} Scientific Engineering Calculator with 417 Functions", subCategory: "Calculators & Electronics" },
      { template: "{brand} Heavy Duty Metal Mesh Desk Organizer with 6 Compartments", subCategory: "Desk Organizers" },
      { template: "{brand} Desktop Document Letter Tray 3-Tier Organizer", subCategory: "Desk Organizers" },
    ],
  },
  {
    id: "musical-instruments",
    name: "Musical Instruments",
    targetCount: 2,
    icon: "Music",
    color: "from-purple-400 to-indigo-600",
    glow: "shadow-purple-500/20",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    subCategories: ["Electronic Instruments", "Accessories"],
    images: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    ],
    brands: ["Yamaha", "Casio", "Vault"],
    templates: [
      { template: "{brand} 61-Key Portable Electronic Keyboard with Adapter", subCategory: "Electronic Instruments" },
      { template: "{brand} Acoustic Guitar Padded Gig Bag with Front Pocket", subCategory: "Accessories" },
    ],
  },
  {
    id: "home-improvement",
    name: "Home Improvement",
    targetCount: 2,
    icon: "Wrench",
    color: "from-yellow-400 to-amber-600",
    glow: "shadow-yellow-500/20",
    tagColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    subCategories: ["Electrical & Lighting", "Hardware"],
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    ],
    brands: ["Bosch", "Stanley", "Anchor"],
    templates: [
      { template: "{brand} 13-Piece Home Multi-Tool DIY Screwdriver Kit", subCategory: "Hardware" },
      { template: "{brand} Spike Guard 4-Outlet Surge Protector Extension Board", subCategory: "Electrical & Lighting" },
    ],
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    targetCount: 1,
    icon: "Gamepad2",
    color: "from-rose-400 to-red-500",
    glow: "shadow-rose-500/20",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    subCategories: ["Brain Teasers & Puzzles"],
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    ],
    brands: ["Funskool", "Hasbro"],
    templates: [
      { template: "{brand} High-Speed 3x3 Speed Magic Twist Puzzle for Kids & Adults", subCategory: "Brain Teasers & Puzzles" },
    ],
  },
  {
    id: "car-motorbike",
    name: "Car & Motorbike",
    targetCount: 1,
    icon: "Car",
    color: "from-sky-400 to-blue-600",
    glow: "shadow-sky-500/20",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    subCategories: ["Car Electronics"],
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    ],
    brands: ["70mai", "Qubo", "Portronics"],
    templates: [
      { template: "{brand} Smart Car Dash Camera with 1080p Full HD Night Vision and G-Sensor", subCategory: "Car Electronics" },
    ],
  },
  {
    id: "health-personal-care",
    name: "Health & Personal Care",
    targetCount: 1,
    icon: "HeartPulse",
    color: "from-teal-400 to-emerald-600",
    glow: "shadow-teal-500/20",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    subCategories: ["Health Monitors"],
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    ],
    brands: ["Omron", "Dr Trust"],
    templates: [
      { template: "{brand} Automatic Digital Blood Pressure Monitor with Large LCD Display", subCategory: "Health Monitors" },
    ],
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export function getCategoryMeta(categoryName) {
  return CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];
}
