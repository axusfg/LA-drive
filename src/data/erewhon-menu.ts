export interface MenuItem {
  name: string;
  emoji: string;
  price: string;
}

// Erewhon's famous collab smoothies and staples
export const erewhonSmoothies: MenuItem[] = [
  { name: "Coconut Cloud", emoji: "🥥", price: "$17" },
  { name: "Strawberry Glaze", emoji: "🍓", price: "$15" },
  { name: "Green Glow", emoji: "💚", price: "$14" },
  { name: "Acai Antioxidant", emoji: "🫐", price: "$16" },
  { name: "Vanilla Almond", emoji: "🍦", price: "$15" },
];

// Location-specific "Known for" items based on reviews and unique features
export const erewhonKnownFor: Record<string, string[]> = {
  "Erewhon (Grove / Fairfax)":
    ["🍓 Strawberry Glaze Smoothie", "🍣 Organic Sushi Bar", "🍗 Rotisserie Chicken"],
  "Erewhon (Calabasas)":
    ["💜 Poosh Smoothie Collab", "🥗 Organic Prepared Meals", "🧃 Cold-Pressed Juices"],
  "Erewhon (Venice)":
    ["🥩 Six-Foot Jerky Wall", "🫐 Post-Surf Acai Bowl", "🍵 Kombucha on Tap"],
  "Erewhon (Santa Monica)":
    ["🌿 Garden Terrace Dining", "☕ Bulletproof Coffee", "🍽️ Open Kitchen Meals"],
  "Erewhon (Silver Lake)":
    ["🍕 Wood-Fired Pizza", "🥐 Tartine Baked Goods", "🍷 Wine Shop Next Door"],
  "Erewhon (Studio City)":
    ["🌴 Courtyard Patio Decks", "🍔 Grass-Fed Burger", "🧃 Fresh Pressed Juice"],
  "Erewhon (Beverly Hills)":
    ["🍣 Sushi Bar Omakase", "👕 Erewhon Merch", "🥤 Celebrity Smoothie Collabs"],
  "Erewhon (Culver City)":
    ["🅿️ Best Parking of Any Erewhon", "🍲 Spacious Hot Bar", "🌳 Culver Steps Nearby"],
  "Erewhon (Pasadena)":
    ["🌹 Rose Parade Red Smoothie", "🏔️ Roof Deck with Mountain Views", "🏛️ Landmark Building"],
  "Erewhon (Manhattan Beach)":
    ["💪 Post-Workout Smoothies", "🫐 Organic Açaí Bowl", "🧃 Fresh-Pressed Juices"],
  "Erewhon (West Hollywood)":
    ["🏳️‍🌈 WeHo Exclusive Smoothie", "☀️ Indoor-Outdoor Patio", "🧃 Tonic Bar"],
  "Erewhon (Glendale)":
    ["🥤 Celebrity Collab Smoothies", "🍲 Organic Hot Bar", "💊 Supplement Wall"],
};

// Real photos from Erewhon's official website (Shopify CDN)
export const erewhonPhotos: Record<string, string> = {
  "Erewhon (Grove / Fairfax)": "https://ship.erewhon.com/cdn/shop/files/unnamed_2.jpg?v=1753686980&width=800",
  "Erewhon (Calabasas)": "https://ship.erewhon.com/cdn/shop/files/CALABASAS.jpg?v=1750465003&width=800",
  "Erewhon (Venice)": "https://ship.erewhon.com/cdn/shop/files/venice_exterior.jpg?v=1713563341&width=800",
  "Erewhon (Santa Monica)": "https://ship.erewhon.com/cdn/shop/files/SM_604b9631-f97a-4662-87b4-c9d344b69f1c.jpg?v=1750465877&width=800",
  "Erewhon (Silver Lake)": "https://ship.erewhon.com/cdn/shop/files/SL_f9879435-16e0-49a3-abce-ade56cdaa517.jpg?v=1750466629&width=800",
  "Erewhon (Studio City)": "https://ship.erewhon.com/cdn/shop/files/CULVER_2938535e-84f9-46c0-b991-43a315b0b91c.jpg?v=1750466064&width=800",
  "Erewhon (Beverly Hills)": "https://ship.erewhon.com/cdn/shop/files/Beverly_Hills.jpg?v=1750464945&width=800",
  "Erewhon (Culver City)": "https://ship.erewhon.com/cdn/shop/files/Erewhon_CulverCity_by_Paul_Turang1.jpg?v=1711054803&width=800",
  "Erewhon (Pasadena)": "https://ship.erewhon.com/cdn/shop/files/erewhonPas-24.jpg?v=1713560071&width=800",
  "Erewhon (Manhattan Beach)": "https://ship.erewhon.com/cdn/shop/files/MB_locations.jpg?v=1751412428&width=800",
  "Erewhon (West Hollywood)": "https://ship.erewhon.com/cdn/shop/files/WEHO.jpg?v=1750466463&width=800",
  "Erewhon (Glendale)": "https://ship.erewhon.com/cdn/shop/files/GLEN.jpg?v=1750466419&width=800",
};
