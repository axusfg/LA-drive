export interface MatchaProfile {
  name: string;
  tagline: string;
  founded: string;
  founders: string;
  story: string;
  vibe: string;
  design: string;
  menu: { name: string; emoji: string; description: string }[];
  tip: string;
}

export const matchaProfiles: Record<string, MatchaProfile> = {
  "Memorylook": {
    name: "Memorylook",
    tagline: "Where coffee meets fashion in Koreatown",
    founded: "2022",
    founders: "Nick Kim",
    story: "What started as a small eyewear e-commerce site in 2020 evolved into one of Koreatown's most Instagrammable cafes. Founder Nick Kim envisioned a space where South Korean fashion and specialty coffee could coexist — and in 2022, Memorylook's brick-and-mortar shop opened on Olympic Boulevard. The result is part boutique, part cafe, and entirely its own thing.",
    vibe: "Modern and minimalist with a futuristic edge. From the street it reads as a crisp black-and-white shop, but step inside and you'll find a spacious indoor area that flows into a big outdoor patio surrounded by greenery. It's the kind of place where you can post up with a laptop for hours or browse curated sunglasses between sips.",
    design: "Clean lines, monochrome palette, and a seamless blend of retail and cafe space. The outdoor communal seating area — rare for Koreatown — is the real draw, with ample space and a relaxed energy.",
    menu: [
      { name: "Matcha Einspanner", emoji: "🍵", description: "Ceremonial grade matcha topped with rich whipped cream — their signature drink" },
      { name: "Strawberry Cream Matcha", emoji: "🍓", description: "House-made strawberry cream over matcha" },
      { name: "Ginger Chai Latte", emoji: "🫖", description: "Warm and spiced, a fan favorite for cooler days" },
      { name: "Einspanner Latte", emoji: "☕", description: "Classic espresso with a generous whipped cream top" },
      { name: "Fresh Donuts", emoji: "🍩", description: "Baked in-house, rotating flavors daily" },
    ],
    tip: "Big parking lot — a rare find in LA. Go on a weekday morning for the best experience.",
  },

  "DAMO (Koreatown)": {
    name: "DAMO",
    tagline: "Korean tea culture, reimagined",
    founded: "November 2022",
    founders: "Ted Nam",
    story: "Ted Nam wanted to bring the trendiness of Seoul's cafe scene to Los Angeles — something beyond the city's mainstream boba and milk tea. DAMO opened in late 2022 in a Koreatown strip mall and quickly developed a cult following for its einspanner drinks. The name pays homage to Korean tea tradition, and the cafe treats every cup like an art form.",
    vibe: "Quiet, modern, and intentional. This isn't a place for loud conversations — it's a space for savoring. Loose leaf teas and handmade ceramics line the counter, signaling that everything here is done with care. Despite the serious approach, it's never pretentious.",
    design: "Minimalist and ceramic-forward. The counter doubles as a display of the craft — porcelain teapots, tea leaves, and an hourglass for the full Korean tea service experience.",
    menu: [
      { name: "Matcha Einspanner", emoji: "🍵", description: "Where DAMO shines brightest — matcha with thick cream dusted in matcha powder" },
      { name: "Hojicha Einspanner", emoji: "🫖", description: "Roasted green tea version, nutty and smooth" },
      { name: "Chocolate Cream Matcha", emoji: "🍫", description: "For those who prefer chocolate over vanilla in their cream" },
      { name: "Korean Tea Service", emoji: "🍵", description: "Full ceremonial service with porcelain teapot and hourglass" },
      { name: "Dagwa", emoji: "🍡", description: "Traditional Korean tea snacks, perfect alongside any drink" },
    ],
    tip: "The cafe gets packed even on weekday afternoons. Visit early and avoid weekends for a quieter experience.",
  },

  "DAMO (Arts District)": {
    name: "DAMO Arts District",
    tagline: "More room to linger, same devotion to tea",
    founded: "2024",
    founders: "Ted Nam",
    story: "After the Koreatown original earned a cult following, DAMO expanded to the Arts District — bringing the same tea-as-art philosophy to a much larger, loft-style space. Where the original is cozy and intimate, this location is open and airy, designed for longer stays.",
    vibe: "Industrial-meets-serene. The expanded space encourages lingering over tea rather than grabbing and going. It's quieter and more spacious than the Koreatown original, with room to spread out and settle in.",
    design: "White brick walls, stone counters, and potted greenery throughout an industrial loft. The natural light and plants soften what could feel cold into something warm and inviting.",
    menu: [
      { name: "Matcha Einspanner", emoji: "🍵", description: "Same signature drink as the original — rich, creamy, perfect" },
      { name: "Hojicha Einspanner", emoji: "🫖", description: "Roasted green tea with whipped cream" },
      { name: "Matcha Latte", emoji: "🍵", description: "Clean and straightforward ceremonial matcha" },
      { name: "Tonic Matcha", emoji: "🥤", description: "Refreshing sparkling matcha for warm days" },
      { name: "Dagwa", emoji: "🍡", description: "Traditional Korean tea snacks" },
    ],
    tip: "Come here instead of Koreatown if you want space to work or read. Way more seating.",
  },

  "Stereoscope Coffee (Echo Park)": {
    name: "Stereoscope Coffee",
    tagline: "In pursuit of depth and simplicity",
    founded: "2013",
    founders: "Leif Sung An & Clifford Park",
    story: "Founded in 2013 by certified Q-grader Leif Sung An and partner Clifford Park, Stereoscope started with a simple mission: make the highest quality coffee easily accessible. Leif, a certified Quality Arabica Grader, sources and roasts beans in-house at their Arts District lab. The motto — 'in pursuit of depth and simplicity' — captures the idea that opposite forces can be complementary.",
    vibe: "Heaven for coffee snobs and designers. The crowd skews creative — expect beanie-wearing folks plugged into Adobe XD on their laptops. The space is sleek but welcoming, serious about craft without being stuffy.",
    design: "Sleek and minimal, designed to let the coffee speak. Clean lines, natural materials, and an emphasis on function over decoration.",
    menu: [
      { name: "Strawberry Milk Matcha", emoji: "🍓", description: "Their famous house-made strawberry milk with matcha — a signature" },
      { name: "Sakura Strawberry Milk", emoji: "🌸", description: "Floral sakura blossom tea meets strawberry" },
      { name: "Ganache Mocha", emoji: "🍫", description: "Made with single-origin Dandelion Chocolate ganache" },
      { name: "Madagascar Vanilla Latte", emoji: "🍦", description: "Rich vanilla from Madagascar, silky smooth" },
      { name: "Pour-Over", emoji: "☕", description: "Single-origin, brewed to order — the reason purists come here" },
    ],
    tip: "The menu reads like a novel — don't be intimidated. The baristas are happy to guide you.",
  },

  "Stereoscope Coffee (Hollywood)": {
    name: "Stereoscope Coffee Hollywood",
    tagline: "Specialty coffee on Santa Monica Boulevard",
    founded: "2013 (this location opened later)",
    founders: "Leif Sung An & Clifford Park",
    story: "The Hollywood outpost brings Stereoscope's meticulous coffee program to the heart of the city. Same obsessive sourcing, same in-house roasting, different neighborhood energy.",
    vibe: "A bit more bustling than Echo Park — the Hollywood foot traffic brings a mix of locals, creatives, and curious passersby. Still very much a coffee-first space.",
    design: "Consistent with the Stereoscope aesthetic — clean, modern, and focused. The space is designed for both quick pickups and longer stays.",
    menu: [
      { name: "Strawberry Milk Matcha", emoji: "🍓", description: "The signature that put Stereoscope on the map" },
      { name: "Matcha Latte", emoji: "🍵", description: "Pre-sweetened ceremonial grade, smooth and balanced" },
      { name: "Spanish Latte", emoji: "☕", description: "Espresso with sweetened condensed milk" },
      { name: "Hojicha Milk", emoji: "🫖", description: "Roasted tea latte, nutty and comforting" },
      { name: "Cold Brew", emoji: "🧊", description: "Slow-steeped for a clean, concentrated flavor" },
    ],
    tip: "Street parking can be tough — try the side streets off Santa Monica Blvd.",
  },

  "Stereoscope Coffee (Long Beach)": {
    name: "Stereoscope Coffee Long Beach",
    tagline: "Beach-side specialty coffee",
    founded: "2013 (this location opened later)",
    founders: "Leif Sung An & Clifford Park",
    story: "Stereoscope's Long Beach location brings their specialty roasting program to the coast. Tucked on 2nd Street in Belmont Shore, it serves the same meticulously sourced coffee in a more laid-back beach neighborhood setting.",
    vibe: "Relaxed coastal energy mixed with Stereoscope's trademark precision. The crowd is a blend of Long Beach locals, students, and weekend visitors.",
    design: "Warm and inviting, slightly more relaxed than the LA locations while maintaining the brand's clean aesthetic.",
    menu: [
      { name: "Strawberry Milk Matcha", emoji: "🍓", description: "The Stereoscope signature — strawberry and matcha" },
      { name: "Hojicha Milk", emoji: "🫖", description: "Roasted tea latte, warm and toasty" },
      { name: "Spanish Latte", emoji: "☕", description: "Espresso with sweetened condensed milk" },
      { name: "Ganache Mocha", emoji: "🍫", description: "Dandelion Chocolate ganache with espresso" },
      { name: "Drip Coffee", emoji: "☕", description: "Single-origin, rotates seasonally" },
    ],
    tip: "Great spot to grab coffee before a walk along the beach.",
  },

  "Kettl Tea (Los Feliz)": {
    name: "Kettl Tea",
    tagline: "Brooklyn's Japanese tea obsession, now in LA",
    founded: "2015 (LA location opened later)",
    founders: "Zach Mangan",
    story: "Zach Mangan moved to NYC to pursue music and ended up working at Ito En, a Japanese tea shop on the Upper East Side. There he befriended two businessmen from Fukuoka who invited him to tour tea farms in Japan — where he realized the best Japanese teas never leave the country. The trio founded Kettl to change that. The Los Feliz flagship is a love letter to Japanese tea culture, complete with a published book: 'Stories of Japanese Tea.'",
    vibe: "Like a tea house transplanted from Kyoto. It's serene and contemplative — you come here to slow down. Despite the serious approach to tea, the staff won't judge you for adding honey to your matcha.",
    design: "Wood paneling, a quiet upstairs loft, and $150 matcha tins on display. A dedicated shelf shows tasting notes, harvest dates, and origin maps. There's a four-seat tasting counter for deeper exploration.",
    menu: [
      { name: "Hand-Whisked Matcha", emoji: "🍵", description: "Bold and never grainy — whisked to order in front of you" },
      { name: "Hojicha Latte", emoji: "🫖", description: "Roasted green tea, warm and toasty" },
      { name: "Japanese Tea Flight", emoji: "🍃", description: "A curated tasting of seasonal selections" },
      { name: "Mochi Sweets", emoji: "🍡", description: "Traditional Japanese confections paired with tea" },
      { name: "Genmaicha", emoji: "🍵", description: "Green tea with roasted brown rice — nutty and comforting" },
    ],
    tip: "The upstairs loft is the most peaceful spot. Come early before the afternoon crowds.",
  },

  "Community Goods (Edinburgh Ave)": {
    name: "Community Goods",
    tagline: "The cafe where the line is part of the experience",
    founded: "circa 2020",
    founders: "Not publicly disclosed",
    story: "Community Goods exploded onto the LA cafe scene and hasn't slowed down. What started as a small wood-filled shop on Edinburgh Ave near Melrose became the cafe that constantly comes up in online conversation. The line wraps around the block on weekends — and for once, the hype is justified. A second location recently opened at the Pacific Design Center, with rumors of Brentwood next.",
    vibe: "Young, buzzy, and unapologetically popular. Hailey Bieber has been spotted here. The weekend line can hit 45 minutes, but the weekday mornings are peaceful. It's a small space that runs on energy and excellent execution.",
    design: "Small and wood-filled — warm tones, natural materials, and a layout that forces intimacy. The outdoor patio provides much-needed overflow seating.",
    menu: [
      { name: "Matcha Latte", emoji: "🍵", description: "Tastes like real tea, not expensive green oat milk" },
      { name: "Tuna Sandwich", emoji: "🥪", description: "One of the best in LA — creamy tuna, ciabatta, crushed salt & vinegar chips" },
      { name: "Breakfast Sliders", emoji: "🍞", description: "Hawaiian rolls with scrambled eggs, bacon, and avocado" },
      { name: "Pistachio Toast", emoji: "🥜", description: "House-made pistachio butter, vanilla sea salt, honey on thick sourdough" },
      { name: "Einspanner", emoji: "☕", description: "Espresso topped with cream and cacao powder" },
    ],
    tip: "Weekday mornings are your best bet. Order the tuna sandwich — you'll understand why people wait in line.",
  },

  "Community Goods (Pacific Design Center)": {
    name: "Community Goods PDC",
    tagline: "The expansion the Westside was waiting for",
    founded: "2024",
    founders: "Not publicly disclosed",
    story: "The Pacific Design Center location brings Community Goods to West Hollywood's design district. Same beloved menu, more space, and a clientele that skews toward the creative professionals working in the surrounding showrooms and agencies.",
    vibe: "Slightly more polished than the Edinburgh original — befitting its location in LA's design epicenter. Less chaotic on weekends, more business-lunch energy on weekdays.",
    design: "Maintains the warm wood aesthetic of the original with a bit more breathing room. The PDC setting adds an architectural backdrop.",
    menu: [
      { name: "Matcha Latte", emoji: "🍵", description: "The same excellent matcha that built the reputation" },
      { name: "Turkey Fontina Sandwich", emoji: "🥪", description: "Smoked turkey, sharp fontina, pickled shallots, basil aioli" },
      { name: "Pistachio Toast", emoji: "🥜", description: "House-made pistachio butter on thick sourdough" },
      { name: "Banana Bread", emoji: "🍌", description: "Moist, gently toasted, topped with passionfruit butter" },
      { name: "Vanilla Bean Latte", emoji: "☕", description: "Rich and creamy, a crowd-pleaser" },
    ],
    tip: "Easier to get a table here than Edinburgh, especially on weekends.",
  },

  "Stagger Coffee": {
    name: "Stagger Coffee",
    tagline: "Cream-topped dreams in Koreatown",
    founded: "October 2024",
    founders: "Not publicly disclosed",
    story: "What was once a rundown laundromat on 8th Street has been completely reimagined into one of Koreatown's hottest matcha cafes. Stagger opened with a soft launch in October 2024 and immediately drew crowds for its photogenic cream-topped drinks and cozy strip-mall charm. The wifi is strong, the pastries are baked fresh, and the vibes are immaculate.",
    vibe: "Instagram-ready but genuinely good. The minimalist interior and dessert-like drinks attract a young, creative crowd who split their time between sipping and working on laptops. Strong wifi makes it a real work-from-cafe destination.",
    design: "White shelving, sand-colored ceramics, and a squiggly-framed mirror that's become the obligatory photo backdrop. Warm and minimal — the kind of space that photographs beautifully without trying too hard.",
    menu: [
      { name: "Double Matcha Latte", emoji: "🍵", description: "High-grade matcha in both the milk and the vanilla cream on top" },
      { name: "Donut Latte", emoji: "🍩", description: "Chocolatey with cream and cocoa powder — dine-in only, served in branded porcelain" },
      { name: "Blueberry Muffin", emoji: "🫐", description: "Baked fresh in small batches throughout the day" },
      { name: "Einspanner Latte", emoji: "☕", description: "Classic cream-topped espresso" },
      { name: "Hojicha Latte", emoji: "🫖", description: "Roasted green tea, smooth and nutty" },
    ],
    tip: "No power outlets — charge your laptop before you come. The small parking lot fills up fast, so try street parking.",
  },

  "Maru Coffee (Los Feliz)": {
    name: "Maru Coffee",
    tagline: "A mountaintop in Los Feliz",
    founded: "2016",
    founders: "Jacob Park & Joonmo Kim",
    story: "Jacob Park and Joonmo Kim met while working at a coffee shop and bonded over Korean aesthetics and a shared vision. The name 'Maru' comes from 'San Ma Ru' — Korean for 'mountaintop,' symbolizing both the high altitudes where the finest coffee grows and the wooden floor of the communal space in traditional Korean homes. Jacob grew up in a Korean temple caring for his grandmother, a monk, and that sense of quiet intention permeates every detail. The duo designed and built all the furniture themselves.",
    vibe: "A beige-toned temple of discerning taste. This is standing-room-only by design — Maru doesn't encourage lingering despite being in a neighborhood full of sidewalk cafes. You come, you appreciate, you leave with an incredible coffee. The crowd is creative professionals, ceramic studio assistants from Mount Washington, and serious coffee people.",
    design: "Simple, minimal, warm. Off-white paint from top to bottom, accented with light birch wood and a few plants. Gorgeous wooden shelving at the bar — all handmade by the founders. Every element is intentional.",
    menu: [
      { name: "Cream-Topped Iced Long Black", emoji: "☕", description: "The signature — bold espresso with a silky cream layer" },
      { name: "Slow-Drip Cold Brew", emoji: "🧊", description: "Patient extraction, incredibly smooth and concentrated" },
      { name: "Pour-Over", emoji: "☕", description: "Single-origin, brewed with precision and care" },
      { name: "Matcha Latte", emoji: "🍵", description: "Clean and well-prepared ceremonial matcha" },
      { name: "Drip Coffee", emoji: "☕", description: "Simple, excellent, and always a great roast" },
    ],
    tip: "Standing room only — don't plan to camp here. The coffee is worth the intentional brevity.",
  },

  "Maru Coffee (Arts District)": {
    name: "Maru Coffee Arts District",
    tagline: "The same mountaintop, downtown",
    founded: "2018",
    founders: "Jacob Park & Joonmo Kim",
    story: "The Arts District location extends Maru's philosophy to downtown LA. Same handcrafted aesthetic, same obsessive coffee program, but with the raw industrial energy of the Arts District providing a different backdrop.",
    vibe: "More urban and edgy than Los Feliz — the Arts District foot traffic brings a wider mix of people. Still focused on coffee quality above all else.",
    design: "Maintains the founders' handmade furniture and minimal aesthetic, adapted to the industrial character of the neighborhood.",
    menu: [
      { name: "Pour-Over", emoji: "☕", description: "Single-origin, the core of what Maru does" },
      { name: "Cream-Topped Iced Long Black", emoji: "☕", description: "The Maru signature" },
      { name: "Drip Coffee", emoji: "☕", description: "Consistently excellent" },
      { name: "Cold Brew", emoji: "🧊", description: "Slow-drip extraction, smooth and clean" },
      { name: "Matcha Latte", emoji: "🍵", description: "Ceremonial grade, simple and good" },
    ],
    tip: "Pair your visit with a walk through the Arts District galleries and murals.",
  },

  "Maru Coffee (Beverly Hills)": {
    name: "Maru Espresso Bar",
    tagline: "Korean coffee craft meets Beverly Hills",
    founded: "2023",
    founders: "Jacob Park & Joonmo Kim",
    story: "The Beverly Hills espresso bar is Maru's most recent expansion — bringing their temple-like coffee philosophy to one of LA's most iconic neighborhoods. It's a testament to how far the two friends from the coffee shop have come since 2016.",
    vibe: "More polished than the other locations — Beverly Hills demands a certain level of finish. But the core DNA is unchanged: incredible coffee, minimal space, zero pretension about the craft.",
    design: "Compact espresso bar format with the signature Maru aesthetic — birch wood, clean lines, standing-friendly.",
    menu: [
      { name: "Iced Long Black", emoji: "☕", description: "The Maru signature, cream-topped" },
      { name: "Matcha Latte", emoji: "🍵", description: "Clean ceremonial matcha" },
      { name: "Espresso", emoji: "☕", description: "Single-origin, pulled to perfection" },
      { name: "Slow-Drip Cold Brew", emoji: "🧊", description: "Patient and smooth" },
      { name: "Drip Coffee", emoji: "☕", description: "Simple excellence" },
    ],
    tip: "Small space — perfect for a quick stop while shopping on Canon Drive.",
  },

  "Archives Of Us": {
    name: "Archives Of Us",
    tagline: "A retreat from the city's constant movement",
    founded: "2025",
    founders: "Nick Kim (concept) & Jialun Xiong (design)",
    story: "Nick Kim wanted a departure from the constant 'newness' of LA coffee shops — the ever-changing menus, the elaborate drinks, the relentless pursuit of novelty. He partnered with designer Jialun Xiong, whose studio explores duality within spaces, to create something intentionally permanent. Tucked on the second floor of a building between Chinatown and Downtown, Archives Of Us feels discovered rather than designed — a 2,500 sq ft retreat that stays open until midnight.",
    vibe: "Conceptual art gallery meets cafe. The pastry case holds one item — canelés in rotating flavors — spaced evenly apart like they're part of an installation. Drinks arrive on trays with wet wipes and sourcing cards. It's meticulous without being fussy, and the back patio is genuinely great for getting work done.",
    design: "Monochromatic and sculptural. Stained black ash wood, off-white leather upholstery, brushed metal accents. As night falls, the lighting shifts to create a moodier atmosphere. All furniture was designed by Jialun Xiong's studio.",
    menu: [
      { name: "Cream-Topped Matcha", emoji: "🍵", description: "Sourced matcha with a card explaining its origin" },
      { name: "Canelés", emoji: "🧁", description: "The only pastry — crunchy outside, custardy inside, rotating flavors" },
      { name: "Single-Origin Espresso", emoji: "☕", description: "Served with sourcing information on a tray" },
      { name: "Cream-Topped Coffee", emoji: "☕", description: "Their signature preparation across multiple drinks" },
      { name: "Seasonal Specials", emoji: "🍵", description: "Rotating drinks that complement the canelé flavors" },
    ],
    tip: "Open until midnight — it transforms into a moody evening hangout. The back patio is the best seat in the house.",
  },
};
