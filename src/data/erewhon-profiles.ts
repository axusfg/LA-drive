export interface ErewhonProfile {
  name: string;
  tagline: string;
  opened: string;
  highlight: string;
  description: string;
  vibe: string;
  design: string;
  menu: { name: string; emoji: string; description: string }[];
  tip: string;
}

export const erewhonProfiles: Record<string, ErewhonProfile> = {
  "Erewhon (Grove / Fairfax)": {
    name: "Erewhon Grove / Fairfax",
    tagline: "Where it all began — LA's original health food destination",
    opened: "1969 (LA's oldest operating Erewhon)",
    highlight: "The Original",
    description: "This is the one that started it all. Founded in Boston in 1966 by Michio and Aveline Kushi, Erewhon moved to this Fairfax District spot in 1969. The name is an anagram of 'nowhere,' from Samuel Butler's 1872 novel about a utopia where people are responsible for their own health. After decades of financial struggles, Tony and Josephine Antoci bought the store in 2011 — it was averaging $180K in weekly sales. Today, that number is $900K. This single store became the seed of an empire.",
    vibe: "The most chaotic Erewhon. Shopping here can feel like navigating a crowded farmers market — tight aisles, heavy foot traffic, and everyone seemingly in a rush. But there's a certain energy to being in the original that no other location can replicate.",
    design: "The smallest and most packed of all locations. It has the feel of a neighborhood market that grew into something much bigger than its walls can contain. Don't expect the polished spaciousness of the newer stores.",
    menu: [
      { name: "Hailey Bieber Strawberry Glaze", emoji: "🍓", description: "The collab smoothie that broke the internet — strawberry, coconut, hyaluronic acid" },
      { name: "Coconut Cloud Smoothie", emoji: "🥥", description: "The original celebrity smoothie that started the collab trend" },
      { name: "Organic Sushi Bar", emoji: "🍣", description: "Freshly rolled sushi rivaling high-end restaurants" },
      { name: "Tonic Bar Wellness Shots", emoji: "🧃", description: "Immune-boosting shots with turmeric, ginger, and adaptogens" },
      { name: "Hot Bar Rotisserie Chicken", emoji: "🍗", description: "Organic and perfectly seasoned — a local staple" },
    ],
    tip: "Parking is a nightmare. Go early on a weekday morning or use the valet if available.",
  },

  "Erewhon (Calabasas)": {
    name: "Erewhon Calabasas",
    tagline: "Celebrity grocery shopping in the hills",
    opened: "2015",
    highlight: "The Celebrity Magnet",
    description: "Nestled in the Kardashian homeland of Calabasas, this spacious location is where you're most likely to spot an A-lister picking up organic eggs. Kim Kardashian does her own grocery shopping here, Kourtney grabs her turmeric golden milk and blue algae supplements, and Kendall Jenner is a regular. It's less a grocery store, more a very expensive casting call.",
    vibe: "Spacious and suburban — a completely different energy from the cramped city locations. The wide aisles and calm atmosphere feel almost like a regular grocery store, until you notice the $20 smoothies and Range Rovers in the parking lot.",
    design: "One of the larger Erewhon locations with a more open floor plan. The suburban setting gives it room to breathe that the urban locations lack.",
    menu: [
      { name: "Kourtney Kardashian Poosh Smoothie", emoji: "💜", description: "A wellness smoothie collab with Poosh — adaptogens and superfoods" },
      { name: "Acai Bowl", emoji: "🫐", description: "Loaded with organic acai, granola, and seasonal fruit" },
      { name: "Cold-Pressed Green Juice", emoji: "🥬", description: "A Calabasas mom essential" },
      { name: "Grass-Fed Bone Broth", emoji: "🍲", description: "Sipped warm from the tonic bar" },
      { name: "Organic Prepared Meals", emoji: "🥗", description: "Grab-and-go meals for the busy Calabasas lifestyle" },
    ],
    tip: "Come on a weekday for the best celebrity-spotting odds. The parking lot is easy compared to other locations.",
  },

  "Erewhon (Venice)": {
    name: "Erewhon Venice",
    tagline: "A six-foot jerky wall and beach town wellness",
    opened: "2016",
    highlight: "The Beach Outpost",
    description: "The Venice location leans into the neighborhood's eclectic, health-conscious identity. It's the only Erewhon with a six-foot jerky wall next to the checkout line — a detail that perfectly captures Venice's weird-but-wellness energy. The vine-covered patio out front is one of the best outdoor dining spots in the chain.",
    vibe: "Venice Beach energy through and through — health-conscious locals in athleisure, surfers grabbing post-session smoothies, and the occasional tourist who wandered in from the boardwalk. More laid-back than the Westside locations.",
    design: "Brick walls, a hot bar right up front, and a charming side patio with a vine-covered pergola. The outdoor seating with bench seating along the sidewalk gives it a European cafe feel.",
    menu: [
      { name: "Wellness Wednesday Specials", emoji: "🧘", description: "Free wellness seminars with local health experts — Venice only" },
      { name: "Organic Acai Bowl", emoji: "🫐", description: "Post-surf fuel, loaded with toppings" },
      { name: "Kombucha on Tap", emoji: "🍵", description: "Multiple rotating flavors at the tonic bar" },
      { name: "Beef & Bison Jerky Wall", emoji: "🥩", description: "Six feet of curated jerky — the most impressive selection of any Erewhon" },
      { name: "Fresh Salad Bar", emoji: "🥗", description: "All-organic with house-made dressings" },
    ],
    tip: "Parking is terrible. Walk or bike if you can — it's Venice, after all.",
  },

  "Erewhon (Santa Monica)": {
    name: "Erewhon Santa Monica",
    tagline: "A garden terrace on Wilshire Boulevard",
    opened: "2018",
    highlight: "The Garden Store",
    description: "The Santa Monica location was designed to blur the line between indoor shopping and outdoor living. The standout feature is a lush garden terrace where you can dine under a cedar trellis surrounded by plantings that grow on the building itself over time. Carefully placed skylights flood the interior with natural light.",
    vibe: "Influencer central. Bad parking and content creators in every corner, but the garden terrace is genuinely beautiful when you can find a seat. The Wilshire Boulevard location draws a mix of Santa Monica's wellness crowd and westside commuters.",
    design: "A 10,500 sq ft space renovated from a 1993 building with full-height storefront glazing, sculptured soffits, and suspended opaque glass that softens the natural light. Green walls face Wilshire Blvd, and the open kitchen is visible from street level. The lit glass feature at the deli is an architectural highlight.",
    menu: [
      { name: "Garden Terrace Smoothie", emoji: "🌿", description: "Best enjoyed on the cedar trellis patio" },
      { name: "Open Kitchen Prepared Foods", emoji: "🍽️", description: "Watch your meal being made through the street-level window" },
      { name: "Bulletproof Coffee", emoji: "☕", description: "From the tonic bar — butter coffee done right" },
      { name: "Organic Hot Bar", emoji: "🍲", description: "Chef-prepared meals fresh daily" },
      { name: "Immune Wellness Tonics", emoji: "🧃", description: "Shots and elixirs at the tonic bar" },
    ],
    tip: "The garden terrace is the reason to come here. Morning is the best time — fewer influencers, more sunshine.",
  },

  "Erewhon (Silver Lake)": {
    name: "Erewhon Silver Lake",
    tagline: "The best all-around Erewhon experience",
    opened: "2020",
    highlight: "The Local Favorite",
    description: "Ranked among the top Erewhon locations, Silver Lake nails the balance. Good parking (with free valet and underground garage), zero bottleneck aisles, a separate wine shop next door, and a wood-burning pizza oven with Tartine baked goods. The 12,000 sq ft store sits in a mixed-use building near Sunset Junction with an expansive outdoor seating area for about 80 people and a 1,000 sq ft community room.",
    vibe: "The least chaotic Erewhon. Silver Lake's creative, slightly bohemian neighborhood energy makes this feel more like a community gathering place than a luxury grocery store. People actually linger here.",
    design: "Custom brick, tilework, and wood millwork create an organic yet modern feel. The outdoor seating area is the largest of any location, and the exhibition kitchen adds theater to the shopping experience.",
    menu: [
      { name: "Wood-Fired Pizza", emoji: "🍕", description: "From the in-store pizza oven — unique to Silver Lake" },
      { name: "Tartine Baked Goods", emoji: "🥐", description: "From the legendary California bakery" },
      { name: "Tonic Bar Smoothies", emoji: "🥤", description: "Full smoothie and wellness tonic menu" },
      { name: "Wine Shop Selection", emoji: "🍷", description: "The separate wine shop next door has a curated natural wine selection" },
      { name: "Exhibition Kitchen Meals", emoji: "🍽️", description: "Watch chefs prepare your meal in the open kitchen" },
    ],
    tip: "Use the free underground valet. The wine shop next door is worth browsing after you eat.",
  },

  "Erewhon (Studio City)": {
    name: "Erewhon Studio City",
    tagline: "Palatial in the Valley",
    opened: "2019",
    highlight: "The Spacious One",
    description: "The Studio City Erewhon is palatial in scale — one of the largest locations in the chain, set within the Sportsmen's Lodge complex on Ventura Boulevard. The floating patio decks in the courtyard are a standout feature you won't find at any other Erewhon.",
    vibe: "Valley calm meets Erewhon energy. The spacious interior has none of the bottleneck chaos of the city locations. The crowd is local families, entertainment industry professionals from nearby studios, and Valley wellness devotees.",
    design: "Wide, serene interior with no hot bar bottlenecks. The outdoor floating patio decks in the Sportsmen's Lodge courtyard give it an almost resort-like dining experience.",
    menu: [
      { name: "Courtyard Patio Dining", emoji: "🌴", description: "Eat on the floating deck patios at Sportsmen's Lodge" },
      { name: "Grass-Fed Burger", emoji: "🍔", description: "From the hot bar — organic and perfectly grilled" },
      { name: "Fresh Pressed Juice", emoji: "🧃", description: "Made to order at the juice bar" },
      { name: "Organic Rotisserie Chicken", emoji: "🍗", description: "A consistent crowd favorite" },
      { name: "Smoothie Bar Classics", emoji: "🥤", description: "All the celebrity collabs plus house originals" },
    ],
    tip: "The parking situation is tricky despite the size. The courtyard patio is worth seeking out.",
  },

  "Erewhon (Beverly Hills)": {
    name: "Erewhon Beverly Hills",
    tagline: "The luxury flagship near Rodeo Drive",
    opened: "2021",
    highlight: "The Tourist Destination",
    description: "Located on the former Williams-Sonoma site on Beverly Drive, this is Erewhon as luxury retail. It's become a tourist destination — visitors treat it like the 'Official Erewhon Gift Shop,' picking up branded merch and $20 smoothies as Beverly Hills souvenirs. The sidewalk seating encourages gathering and people-watching on one of LA's most famous streets.",
    vibe: "Tourist-heavy and polished. The Beverly Hills crowd mingles with visitors who came specifically to experience the Erewhon phenomenon. It feels more like a boutique than a grocery store — which, in Beverly Hills, is exactly the point.",
    design: "The reimagined Williams-Sonoma space has generous sidewalk seating that turns the store into a social hub. The supplement wall is massive — one of the most impressive in the chain. The sushi bar rivals standalone restaurants.",
    menu: [
      { name: "Sushi Bar Omakase", emoji: "🍣", description: "Freshly prepared sushi that rivals high-end restaurants" },
      { name: "Supplement Wall", emoji: "💊", description: "A giant curated wall of the best nutraceutical brands" },
      { name: "Celebrity Collab Smoothies", emoji: "🥤", description: "All the famous collabs, with Beverly Hills markup" },
      { name: "Organic Cosmetics", emoji: "💄", description: "Luxury beauty products alongside the groceries" },
      { name: "Erewhon Merch", emoji: "👕", description: "Branded totes and gear — the Beverly Hills souvenir" },
    ],
    tip: "Come for the sushi bar. The sidewalk seating is prime people-watching territory.",
  },

  "Erewhon (Culver City)": {
    name: "Erewhon Culver City",
    tagline: "Proof that Erewhon can be enjoyable",
    opened: "2019",
    highlight: "The Easy One",
    description: "The Culver City location proves that shopping at Erewhon doesn't have to be stressful. A large underground garage that's half-empty at all times with free first-hour parking, spacious aisles, natural crowd flow, and a hot bar without bottlenecks. Its proximity to The Culver Steps — a pavilion with fountains and terrace seating — makes it a destination rather than just a grocery run.",
    vibe: "The most relaxed Erewhon experience. Culver City's creative-but-grounded neighborhood energy (think Apple TV+, Sony, and tech startups) keeps things chill. No influencer chaos, no tourist crowds — just good food and easy parking.",
    design: "Spacious and well-planned, with the kind of natural flow that makes you wonder why other locations feel so cramped. The underground parking alone elevates the experience.",
    menu: [
      { name: "Hot Bar Specials", emoji: "🍲", description: "Spacious hot bar area with no bottlenecks — enjoy browsing" },
      { name: "Organic Salad Bar", emoji: "🥗", description: "Build your own with all-organic ingredients" },
      { name: "Tonic Bar Smoothies", emoji: "🥤", description: "Full menu without the wait times of busier locations" },
      { name: "Fresh Baked Goods", emoji: "🥐", description: "Pastries and bread baked fresh daily" },
      { name: "Culver Steps Lunch", emoji: "🌳", description: "Grab food and eat at the nearby fountain pavilion" },
    ],
    tip: "Park underground — free for the first hour and always half-empty. Walk to The Culver Steps after.",
  },

  "Erewhon (Pasadena)": {
    name: "Erewhon Pasadena",
    tagline: "Historic architecture meets organic luxury",
    opened: "September 2023",
    highlight: "The Architectural Gem",
    description: "Erewhon's 10th location occupies the iconic I. Magnin & Borders Books building on South Lake Avenue — a Pasadena landmark that was carefully restored. Red hues throughout the store represent Pasadena's Rose Parade heritage, distinguishing it from every other location. A new four-level elevator connects basement to roof deck, and the building also houses Brella (a child care center) and Tia (a women's health clinic). Hundreds lined up for the grand opening.",
    vibe: "As beautiful as the upscale suburb that surrounds it. Pasadena's old-money-meets-new-wellness energy is different from the Westside locations. More families, fewer influencers, and a genuine neighborhood feel. The outdoor patios encourage lingering and people-watching.",
    design: "A stunning adaptive reuse project. The team restored original architectural features — replacing entry doors with aluminum storefronts characteristic of the original design, removing non-original awnings, and refurbishing deteriorating wood-framed windows. A bronze plaque marks the structure's landmark status.",
    menu: [
      { name: "Rose Parade Red Smoothie", emoji: "🌹", description: "A Pasadena-exclusive drink honoring the neighborhood's heritage" },
      { name: "Roof Deck Dining", emoji: "🏔️", description: "Eat with views of the San Gabriel Mountains" },
      { name: "Artisan Prepared Foods", emoji: "🍽️", description: "From the in-store kitchen" },
      { name: "Natural Wine Selection", emoji: "🍷", description: "Curated organic and biodynamic wines" },
      { name: "Tonic Bar Classics", emoji: "🧃", description: "Full wellness tonic and smoothie menu" },
    ],
    tip: "Take the elevator to the roof deck for mountain views. The building's history is worth reading about — check the bronze landmark plaque at the entrance.",
  },

  "Erewhon (Manhattan Beach)": {
    name: "Erewhon Manhattan Beach",
    tagline: "South Bay's wellness grocery",
    opened: "2024",
    highlight: "The Beach Town Store",
    description: "Erewhon's South Bay outpost brings the chain to Manhattan Beach — a community that was already living the Erewhon lifestyle before the store arrived. It shares a shopping center with more conventional retailers, creating an interesting contrast between organic luxury and suburban normalcy.",
    vibe: "By-the-books Erewhon with South Bay beach town energy. The crowd is fitness-focused locals, young families, and the post-workout smoothie set. Less scene-y than the Westside locations.",
    design: "A standard Erewhon layout with ample parking. The interior is relatively large but the smoothie bar can get bottlenecked and the cash register area is cramped despite the space.",
    menu: [
      { name: "Post-Workout Smoothies", emoji: "💪", description: "Protein-packed options popular with the fitness crowd" },
      { name: "Organic Açaí Bowl", emoji: "🫐", description: "Beach town essential" },
      { name: "Cold-Pressed Juices", emoji: "🧃", description: "Fresh-pressed daily" },
      { name: "Grab-and-Go Meals", emoji: "🥗", description: "Quick organic meals for the beach day" },
      { name: "Supplement Selection", emoji: "💊", description: "Curated wellness supplements" },
    ],
    tip: "Ample parking here — a rare Erewhon luxury. Good stop before or after a beach day.",
  },

  "Erewhon (West Hollywood)": {
    name: "Erewhon West Hollywood",
    tagline: "WeHo's newest wellness hub",
    opened: "February 2026",
    highlight: "The Newest Location",
    description: "Erewhon's newest LA location opened on Santa Monica Boulevard in West Hollywood with an exclusive city-specific smoothie — a first for the chain. A portion of proceeds benefits Pride House LA, reflecting the neighborhood's LGBTQ+ community roots. The indoor-outdoor patio and café are designed for WeHo's social, see-and-be-seen culture.",
    vibe: "Chaotic parking, cramped quarters, and influencers — it's West Hollywood. But the energy is unmistakably fun. The neighborhood's nightlife-adjacent crowd brings a different energy than the daytime-focused locations.",
    design: "Features the company's signature Tonic Bar and Café with an indoor-outdoor patio. The space is compact relative to newer locations, fitting the dense urban fabric of Santa Monica Boulevard.",
    menu: [
      { name: "WeHo Exclusive Smoothie", emoji: "🏳️‍🌈", description: "A city-specific smoothie available only at this location" },
      { name: "Indoor-Outdoor Patio Dining", emoji: "☀️", description: "The café extends onto the sidewalk" },
      { name: "Tonic Bar Specials", emoji: "🧃", description: "Full wellness tonic menu" },
      { name: "Celebrity Collab Smoothies", emoji: "🥤", description: "All the famous collabs" },
      { name: "Organic Prepared Foods", emoji: "🥗", description: "Fresh daily from the kitchen" },
    ],
    tip: "Parking is chaotic — Uber or walk if you can. The WeHo-exclusive smoothie is worth trying.",
  },

  "Erewhon (Glendale)": {
    name: "Erewhon Glendale",
    tagline: "Coming soon to Glendale",
    opened: "Coming 2026",
    highlight: "The Newest Expansion",
    description: "Erewhon's Glendale location is part of the chain's continued expansion across Los Angeles. Set to bring organic luxury grocery to Glendale's growing wellness-conscious community on Glendale Avenue.",
    vibe: "To be determined — but expect Erewhon's signature blend of luxury grocery and wellness culture adapted to Glendale's diverse, family-oriented community.",
    design: "Details not yet available.",
    menu: [
      { name: "Tonic Bar", emoji: "🧃", description: "Erewhon's signature smoothies and wellness shots" },
      { name: "Organic Hot Bar", emoji: "🍲", description: "Chef-prepared meals fresh daily" },
      { name: "Celebrity Collab Smoothies", emoji: "🥤", description: "All the famous collaborations" },
      { name: "Prepared Foods", emoji: "🥗", description: "Organic grab-and-go meals" },
      { name: "Supplement Wall", emoji: "💊", description: "Curated wellness products" },
    ],
    tip: "Check Erewhon's website for the latest opening updates.",
  },
};
