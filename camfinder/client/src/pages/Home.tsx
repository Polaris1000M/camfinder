import { useState, useEffect, useMemo } from "react";

interface WaitlistEntry {
  email: string;
  name: string;
  interest: string;
}

interface Listing {
  name: string;
  price: number;
  location: string;
  platform: string;
  condition: string;
  link: string;
}

const LISTINGS: Listing[] = [
  { name: "Original Leitz Leica Camera Double Stroke M3 Body S#: 775xxx in Excellent Cond.", price: 1195.95, location: "San Leandro, CA", platform: "eBay", condition: "Cosmetic wear, frame a little dim, Original \"L\" seal", link: "https://ebay.us/m/HAx1Zk" },
  { name: "Leica M3 DS Double Stroke Rangefinder Camera Body Chrome #783134", price: 1129.00, location: "Arcadia, CA", platform: "eBay", condition: "Good working condition but lots of wear.", link: "https://ebay.us/m/8ER74R" },
  { name: "Leica M3 Double Stroke Rangefinder 35mm Film Camera. 1955. Case. CLA'D. AS-IS!", price: 1195.00, location: "Solon, OH", platform: "eBay", condition: "CLA'd in 2025, minimal cosmetic wear", link: "https://ebay.us/m/H0rQ2a" },
  { name: "Leica M3 DS Double Stroke Rangefinder 35mm Film Camera", price: 1375.00, location: "Lansdale, PA", platform: "eBay", condition: "Good cosmetic with some wear. Needs CLA, inaccurate shutter", link: "https://ebay.us/m/CXIu0e" },
  { name: "Leica Leitz M3 35mm Rangefinder Film Camera Body, Single Stroke SS, M3", price: 1395.29, location: "Gilford, NH", platform: "eBay", condition: "Cosmetic wear, shutter gets stuck", link: "https://ebay.us/m/V5NNf7" },
  { name: "Mint LEICA M3 Single Stroke SS 35mm Film Camera Body #11228813", price: 1500.00, location: "Playa del Rey, CA", platform: "eBay", condition: "Some minor marks on top plate", link: "https://ebay.us/m/PGRz7u" },
  { name: "Leica M3 Single Stroke 35mm Rangefinder Camera Body *USED*", price: 1549.00, location: "Nashville, TN", platform: "eBay", condition: "Minor cosmetic wear", link: "https://ebay.us/m/WnysZV" },
  { name: "Leica M3 DS Double Stroke Rangefinder 35mm Camera. 1955. Case. CLA'D in 2024.", price: 1545.00, location: "Solon, OH", platform: "eBay", condition: "Shutter good, minor marks on top/bottom plate", link: "https://ebay.us/m/QUgymM" },
  { name: "Leica M3 Single Stroke 35mm Rangefinder Film Camera", price: 1599.00, location: "Battle Creek, MI", platform: "eBay", condition: "Shutter needs CLA", link: "https://ebay.us/m/sHXlxH" },
  { name: "Leica M3 35mm Rangefinder Film Camera Body Only", price: 1700.00, location: "Woodside, NY", platform: "eBay", condition: "Recently CLA'd, minor scratches on top/bottom plate", link: "https://ebay.us/m/TXjGWe" },
  { name: "Leica M3 DS 35mm Rangefinder FILM camera body. 1955. Case & Cap. Cla'd in 2023.", price: 1695.00, location: "Solon, OH", platform: "eBay", condition: "Good working order, good cosmetics", link: "https://ebay.us/m/wKRVFy" },
  { name: "Leica M3 SS Single Stroke Rangefinder 35mm Film Camera", price: 1699.00, location: "Lansdale, PA", platform: "eBay", condition: "Very good condition, accurate shutter, rangefinder accurate", link: "https://ebay.us/m/g4s1pM" },
  { name: "Leica M3 35mm Rangefinder With Summicron 50mm F2 Lens", price: 1735.00, location: "Janesville, WI", platform: "eBay", condition: "See listing", link: "https://ebay.us/m/W4CibL" },
  { name: "Leica M3 Single Stroke vintage 35mm Film Rangefinder Camera. Cap. Manual", price: 1745.00, location: "Solon, OH", platform: "eBay", condition: "Great condition with everything working", link: "https://ebay.us/m/3ch9dL" },
  { name: "Leica Camera M3 Body S#: 9982XX E. Leitz Canada (ELC) w/Manual, Box", price: 1895.95, location: "San Leandro, CA", platform: "eBay", condition: "Clean and shutters are working", link: "https://ebay.us/m/LgUXSy" },
  { name: "Leica M3 35mm Rangefinder Film Camera Body Only", price: 2000.00, location: "Folsom, CA", platform: "eBay", condition: "See listing", link: "https://ebay.us/m/hUAwZg" },
  { name: "[RARE] Near Latest 1966 Leica M3 with L seal, Service Recommended", price: 1999.00, location: "Vestal, NY", platform: "eBay", condition: "L seal on. Needs service, good cosmetics", link: "https://ebay.us/m/uVB80D" },
  { name: "Leica M3 Single Stroke 35mm Film Rangefinder camera. Case. Cap. CLA'd in 2026!", price: 1995.00, location: "Solon, OH", platform: "eBay", condition: "Good frame lines, good cosmetics and functionality", link: "https://ebay.us/m/HUkfrZ" },
  { name: "Leica M3 with Rapid Load Kit 14260", price: 1499.95, location: "Des Plaines, IL", platform: "Alpine Camera", condition: "Working properly, missing leather in the back", link: "https://alpinecamerausa.com/products/leica-m3-single-stroke-converted-w-rapid-load-kit-14260" },
  { name: "Leica M3 DS Double Stroke Rangefinder Camera Body Chrome *Read", price: 1004.70, location: "Indianapolis, IN", platform: "UPP", condition: "See listing", link: "https://usedphotopro.com/leica-m3-ds-double-stroke-rangefinder-camera-body-chrome-read-ulm-02-9600-6-833696-03d31ae1" },
  { name: "Leica M3 DS Double Stroke 1st Batch! #702025 Camera Body", price: 3166.08, location: "Indianapolis, IN", platform: "UPP", condition: "Excellent", link: "https://usedphotopro.com/leica-m3-ds-double-stroke-1st-batch-702025-camera-body-ulm-02-9890-3-702025-0d4af734" },
  { name: "Leica M3 Single Stroke Preview Lever 35mm Rangefinder Camera Body, Chrome", price: 1334.00, location: "Smyrna, GA", platform: "KEH", condition: "Inoperative", link: "https://www.keh.com/shop/leica-m3-single-stroke-preview-lever-35mm-camera-body.html" },
  { name: "Leica M3 Double Stroke Preview Lever 35mm Rangefinder Camera Body, Chrome", price: 1791.00, location: "Smyrna, GA", platform: "KEH", condition: "Excellent", link: "https://www.keh.com/shop/leica-m3-double-stroke-preview-lever-35mm-camera-body.html" },
  { name: "Leica M3 Rangefinder Kit – Recently CLA'd – Leitz 50mm f/2.8 Elmar & Original Leather Case", price: 2400.00, location: "Thomasville, GA", platform: "Facebook", condition: "Full CLA recently", link: "https://www.facebook.com/share/1QegqJdQXK/" },
  { name: "CLA'D Leica M3 DS", price: 1500.00, location: "Madison, WI", platform: "Facebook", condition: "Accurate shutter, replaced with Litchigrain Cowhide leather", link: "https://www.facebook.com/share/1E7nRGpJWr/" },
  { name: "Leica M3 double stroke transitional", price: 1200.00, location: "Tipton, IA", platform: "Facebook", condition: "Viewfinder has some haze", link: "https://www.facebook.com/share/18QzArrWBY/" },
  { name: "Leica M3 Double Stroke (BODY ONLY) film camera - PLEASE READ DESCRIPTION", price: 1300.00, location: "Riverside, MO", platform: "Facebook", condition: "Serviced by Ryan Jones recently", link: "https://www.facebook.com/share/14brANQRgwd/" },
  { name: "Leica M3 camera s/n 833999 with Summicron 50mm f2 lens s/n 1351806.", price: 2200.00, location: "Lee's Summit, MO", platform: "Facebook", condition: "See listing", link: "https://www.facebook.com/share/1FddfSkPos/" },
  { name: "For Sale: Mint Leica M3 Single-Stroke Rangefinder + Clean Summicron 50mm", price: 2360.00, location: "Naperville, IL", platform: "Facebook", condition: "No haze, fungus, or separation", link: "https://www.facebook.com/share/1cnHYt6RUG/" },
  { name: "leica m3 double stroke DS", price: 1400.00, location: "Los Angeles, CA", platform: "Facebook", condition: "Speeds sound accurate", link: "https://www.facebook.com/share/18NLdd5ca3/" },
  { name: "Leica M3 Double Stroke w/ 50mm Summicron f2", price: 2500.00, location: "Los Angeles, CA", platform: "Facebook", condition: "Purchased in 2024 from KEH", link: "https://www.facebook.com/share/1CXsUvMtEe/" },
  { name: "Leica M3 single stroke film camera", price: 1200.00, location: "Emeryville, CA", platform: "Facebook", condition: "Good condition, minor scuffs on body, CLA'd 2024", link: "https://www.facebook.com/share/1J3mzAjXgX/" },
  { name: "Leica M3 single stroke with collapsible Summicron lens.", price: 1600.00, location: "Seaside, CA", platform: "Facebook", condition: "Purchased from Japan, unknown if CLA'd", link: "https://www.facebook.com/share/18GYB9k1EU/" },
  { name: "Leica M3 single stroke - just CLA'd", price: 1800.00, location: "Claremont, CA", platform: "Facebook", condition: "Just CLA'd", link: "https://www.facebook.com/share/1CKgFv7KJd/" },
  { name: "Leica M3", price: 2000.00, location: "San Diego, CA", platform: "Facebook", condition: "See listing", link: "https://www.facebook.com/share/1B6Q1CdGyM/" },
  { name: "1955 Leica M3 - Lucky 777", price: 1850.00, location: "Berkeley, CA", platform: "Facebook", condition: "CLA'd recently", link: "https://www.facebook.com/share/17tPQNKXSp/" },
  { name: "Leica M3 with 5cm Summicron 3/2026 CLA", price: 2200.00, location: "Oakland, CA", platform: "Facebook", condition: "Just CLA'd by Youxin Ye last month", link: "https://www.facebook.com/share/18DgBTRqWC/" },
  { name: "Camera: Leica M3 single stroke in perfect condition. All original e.g. Leitz/Wetzlar lense, etc.", price: 1200.00, location: "Silver Spring, MD", platform: "Facebook", condition: "See listing", link: "https://www.facebook.com/share/1LK8P4NA8j/" },
  { name: "Leica M3 Double Stroke Late Model w/ Box", price: 2000.00, location: "Allston, MA", platform: "Facebook", condition: "Good cosmetics condition", link: "https://www.facebook.com/share/18KBcpMPh8/" },
  { name: "Leica M3 Chrome Single Stroke Camera body", price: 1100.00, location: "New York, NY", platform: "Facebook", condition: "Needs CLA, 1/1000 shutter is not opening", link: "https://www.facebook.com/share/17Tvb7rpyf/" },
  { name: "Leica m3 trades welcome for m2/m5", price: 1000.00, location: "Philadelphia, PA", platform: "Facebook", condition: "See listing", link: "https://www.facebook.com/share/1CTjeq6Coi/" },
  { name: "Leica M3 SS, preview lever, Black Re-paint", price: 2400.00, location: "Warrenton, VA", platform: "Facebook", condition: "Shutter speeds accurate", link: "https://www.facebook.com/share/1GyrWGbSWX/" },
  { name: "Leica M3 (1957) with Summicron 50mm F2", price: 2500.00, location: "Austin, TX", platform: "Facebook", condition: "Recently CLA'd", link: "https://www.facebook.com/share/1CbZftX5uc/" }
];

function qualityScore(condition: string): number {
  const c = (condition || "").toLowerCase();
  const bad = ["inoperative", "stuck", "need cla", "needs cla", "not accurate", "not opening", "as-is", "haze", "wear"];
  const good = ["cla'd", "cla'ed", "excellent", "mint", "perfect", "accurate", "working", "clean", "great", "no haze", "no fungus"];
  let score = 0;
  good.forEach(k => { if (c.includes(k)) score++; });
  bad.forEach(k => { if (c.includes(k)) score--; });
  return score;
}

function qualityLabel(condition: string): { label: string; cls: string } {
  const s = qualityScore(condition);
  if (s >= 2) return { label: "Good condition", cls: "dot-green" };
  if (s >= 0) return { label: "Fair condition", cls: "dot-yellow" };
  return { label: "Issues noted", cls: "dot-red" };
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("All");
  const [activeSort, setActiveSort] = useState("price-asc");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistInterest, setWaitlistInterest] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const platforms = useMemo(() => ["All", ...Array.from(new Set(LISTINGS.map(l => l.platform)))], []);

  const filtered = useMemo(() => {
    let list = [...LISTINGS];

    if (activePlatform !== "All") {
      list = list.filter(l => l.platform === activePlatform);
    }
    if (searchQuery) {
      list = list.filter(l =>
        l.name.toLowerCase().includes(searchQuery) ||
        l.location.toLowerCase().includes(searchQuery) ||
        l.condition.toLowerCase().includes(searchQuery)
      );
    }
    if (minPrice !== null) list = list.filter(l => l.price >= minPrice);
    if (maxPrice !== null) list = list.filter(l => l.price <= maxPrice);

    list.sort((a, b) => {
      if (activeSort === "price-asc") return a.price - b.price;
      if (activeSort === "price-desc") return b.price - a.price;
      if (activeSort === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [searchQuery, activePlatform, activeSort, minPrice, maxPrice]);

  const stats = useMemo(() => {
    const prices = LISTINGS.map(l => l.price);
    return {
      total: LISTINGS.length,
      minPrice: Math.min(...prices),
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      maxPrice: Math.max(...prices),
      platformCount: Array.from(new Set(LISTINGS.map(l => l.platform))).length,
    };
  }, []);

  const lowestPrice = filtered.length ? Math.min(...filtered.map(l => l.price)) : null;

  const handleReset = () => {
    setSearchQuery("");
    setActivePlatform("All");
    setActiveSort("price-asc");
    setMinPrice(null);
    setMaxPrice(null);
  };

  useEffect(() => {
    const launchDate = new Date("2026-05-18T00:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;
      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail && waitlistName && waitlistInterest) {
      setWaitlistSubmitted(true);
      setWaitlistEmail("");
      setWaitlistName("");
      setWaitlistInterest("");
      setTimeout(() => setWaitlistSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f8f9fa;
          --surface: #ffffff;
          --surface-alt: #f1f3f5;
          --border: #e9ecef;
          --accent: #c41e3a;
          --accent-light: #fce4e8;
          --accent-hover: #a01729;
          --text: #1a1a1a;
          --text-muted: #6c757d;
          --text-light: #adb5bd;
          --success: #28a745;
          --warning: #ffc107;
          --danger: #dc3545;
          --radius: 12px;
          --radius-sm: 8px;
          --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100vh; line-height: 1.6; }
        header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 16px 0; position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm); }
        .header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; gap: 16px; }
        .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); }
        .logo-icon svg { width: 22px; height: 22px; fill: white; }
        .logo-text { font-size: 1.3rem; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }
        .logo-text span { color: var(--accent); }
        .header-count { font-size: 0.85rem; color: var(--text-muted); background: var(--surface-alt); border: 1px solid var(--border); border-radius: 20px; padding: 6px 14px; font-weight: 500; }
        .main { max-width: 1400px; margin: 0 auto; padding: 32px 24px 60px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; box-shadow: var(--shadow-sm); transition: all 0.2s ease; }
        .stat-card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .stat-value { font-size: 1.8rem; font-weight: 700; color: var(--accent); margin-bottom: 6px; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
        .controls-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 28px; box-shadow: var(--shadow-sm); }
        .controls-title { font-size: 0.9rem; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; display: block; }
        .controls { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
        .search-wrap { position: relative; flex: 1 1 260px; min-width: 200px; }
        .search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; fill: var(--text-muted); pointer-events: none; }
        .search-wrap input { width: 100%; background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 0.95rem; padding: 10px 12px 10px 40px; outline: none; transition: all 0.2s ease; font-family: var(--font); }
        .search-wrap input:focus { border-color: var(--accent); background: var(--surface); box-shadow: 0 0 0 3px var(--accent-light); }
        .search-wrap input::placeholder { color: var(--text-light); }
        select { background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 0.95rem; padding: 10px 12px; outline: none; cursor: pointer; transition: all 0.2s ease; font-family: var(--font); font-weight: 500; }
        select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }
        .price-range { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .price-range label { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
        .price-range input[type="number"] { width: 100px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 0.95rem; padding: 10px 10px; outline: none; transition: all 0.2s ease; font-family: var(--font); }
        .price-range input[type="number"]:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }
        .btn-reset { background: transparent; border: 1.5px solid var(--border); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.9rem; font-weight: 600; padding: 10px 16px; cursor: pointer; transition: all 0.2s ease; font-family: var(--font); }
        .btn-reset:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
        .platform-pills { display: flex; gap: 8px; flex-wrap: wrap; margin: 14px 0 0 0; }
        .pill { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 20px; color: var(--text-muted); font-size: 0.85rem; padding: 7px 14px; cursor: pointer; transition: all 0.2s ease; font-weight: 500; }
        .pill:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
        .pill.active { background: var(--accent); border-color: var(--accent); color: white; }
        .sort-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .results-info { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
        .results-info strong { color: var(--text); font-weight: 700; }
        .sort-btns { display: flex; gap: 8px; flex-wrap: wrap; }
        .sort-btn { background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-muted); font-size: 0.85rem; font-weight: 600; padding: 7px 13px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; font-family: var(--font); }
        .sort-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-light); }
        .sort-btn.active { border-color: var(--accent); color: white; background: var(--accent); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: all 0.2s ease; position: relative; box-shadow: var(--shadow-sm); }
        .card:hover { border-color: var(--accent); box-shadow: var(--shadow-md); transform: translateY(-4px); }
        .card.deal-badge::before { content: '⭐ Best Deal'; position: absolute; top: -1px; right: 16px; background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%); color: white; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 0 0 var(--radius-sm) var(--radius-sm); letter-spacing: 0.04em; box-shadow: var(--shadow-sm); }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .card-name { font-size: 0.95rem; font-weight: 600; color: var(--text); line-height: 1.4; flex: 1; }
        .card-price { font-size: 1.4rem; font-weight: 700; color: var(--accent); white-space: nowrap; flex-shrink: 0; }
        .card-meta { display: flex; flex-wrap: wrap; gap: 8px; }
        .badge { font-size: 0.75rem; padding: 5px 11px; border-radius: 6px; font-weight: 600; letter-spacing: 0.02em; display: inline-block; }
        .badge-platform { background: var(--accent-light); color: var(--accent); border: 1px solid rgba(0, 102, 204, 0.2); }
        .badge-location { background: #f0f0f0; color: var(--text-muted); border: 1px solid var(--border); }
        .card-condition { font-size: 0.85rem; color: var(--text-muted); background: var(--surface-alt); border-radius: var(--radius-sm); padding: 10px 12px; line-height: 1.5; border-left: 3px solid var(--accent); }
        .condition-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 700; margin-bottom: 4px; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border); }
        .quality-dot { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 500; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-green { background: var(--success); box-shadow: 0 0 8px rgba(40, 167, 69, 0.4); }
        .dot-yellow { background: var(--warning); box-shadow: 0 0 8px rgba(255, 193, 7, 0.4); }
        .dot-red { background: var(--danger); box-shadow: 0 0 8px rgba(220, 53, 69, 0.4); }
        .btn-view { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: white; font-size: 0.8rem; font-weight: 700; padding: 8px 14px; border-radius: var(--radius-sm); text-decoration: none; transition: all 0.2s ease; letter-spacing: 0.02em; border: none; cursor: pointer; font-family: var(--font); }
        .btn-view:hover { background: var(--accent-hover); transform: translateX(2px); box-shadow: var(--shadow-md); }
        .btn-view svg { width: 13px; height: 13px; fill: white; }
        .empty { text-align: center; padding: 80px 20px; color: var(--text-muted); grid-column: 1 / -1; }
        .empty svg { width: 56px; height: 56px; fill: var(--border); margin-bottom: 16px; opacity: 0.5; }
        .empty p { font-size: 1rem; }
        footer { text-align: center; padding: 24px; font-size: 0.8rem; color: var(--text-light); border-top: 1px solid var(--border); margin-top: 48px; background: var(--surface-alt); }
        footer a { color: var(--accent); text-decoration: none; }
        .waitlist-btn { background: var(--accent); color: white; padding: 12px 24px; border-radius: var(--radius-sm); border: none; font-weight: 600; cursor: pointer; font-size: 0.95rem; transition: all 0.2s ease; }
        .waitlist-btn:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .waitlist-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .waitlist-content { background: var(--surface); border-radius: var(--radius); padding: 40px; max-width: 500px; width: 90%; box-shadow: var(--shadow-lg); }
        .waitlist-close { float: right; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
        .waitlist-close:hover { color: var(--text); }
        .waitlist-title { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .waitlist-subtitle { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px; }
        .countdown { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .countdown-item { background: var(--surface-alt); border-radius: var(--radius-sm); padding: 16px; text-align: center; }
        .countdown-value { font-size: 1.8rem; font-weight: 700; color: var(--accent); }
        .countdown-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
        .waitlist-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: var(--text); margin-bottom: 6px; }
        .form-input, .form-select { background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.9rem; color: var(--text); font-family: var(--font); transition: all 0.2s ease; }
        .form-input:focus, .form-select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }
        .submit-button { background: var(--accent); color: white; padding: 12px 16px; border-radius: var(--radius-sm); border: none; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: all 0.2s ease; }
        .submit-button:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .success-message { background: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.9rem; }
        @media (max-width: 768px) {
          .header-inner { padding: 0 16px; gap: 8px; flex-wrap: wrap; }
          .logo-text { font-size: 1rem; }
          .header-count { font-size: 0.75rem; padding: 4px 10px; }
          .waitlist-btn { padding: 10px 16px; font-size: 0.85rem; }
          .main { padding: 20px 16px 40px; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 20px; }
          .stat-card { padding: 16px 12px; }
          .stat-value { font-size: 1.4rem; }
          .stat-label { font-size: 0.65rem; }
          .controls-section { padding: 16px; margin-bottom: 20px; }
          .controls { flex-direction: column; align-items: stretch; gap: 12px; }
          .search-wrap { flex: 1 1 100%; min-width: 100%; }
          .price-range { flex-direction: column; align-items: stretch; }
          .price-range label { margin-bottom: 6px; }
          .price-range input[type="number"] { width: 100%; }
          .btn-reset { width: 100%; }
          .platform-pills { justify-content: flex-start; gap: 6px; margin-top: 12px; }
          .pill { font-size: 0.75rem; padding: 6px 12px; }
          .sort-row { flex-direction: column; align-items: stretch; justify-content: flex-start; }
          .results-info { font-size: 0.8rem; }
          .sort-btns { flex-direction: column; align-items: stretch; width: 100%; }
          .sort-btn { width: 100%; justify-content: center; font-size: 0.75rem; padding: 10px 8px; }
          .grid { grid-template-columns: 1fr; gap: 16px; }
          .card { padding: 16px; }
          .card-top { flex-direction: column; align-items: stretch; }
          .card-name { font-size: 0.9rem; }
          .card-price { font-size: 1.2rem; }
          .card-meta { flex-direction: column; }
          .badge { width: 100%; text-align: left; }
          .card-footer { flex-direction: column; gap: 12px; align-items: stretch; }
          .quality-dot { justify-content: flex-start; }
          .btn-view { width: 100%; justify-content: center; }
          .waitlist-content { padding: 24px 16px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
          .waitlist-title { font-size: 1.2rem; }
          .waitlist-subtitle { font-size: 0.8rem; }
          .countdown { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .countdown-item { padding: 12px; }
          .countdown-value { font-size: 1.4rem; }
          .countdown-label { font-size: 0.65rem; }
          .form-label { font-size: 0.8rem; }
          .form-input, .form-select { font-size: 16px; padding: 12px 10px; }
          .submit-button { font-size: 0.85rem; padding: 12px 16px; width: 100%; }
          footer { font-size: 0.7rem; padding: 16px; }
        }
        @media (max-width: 480px) {
          .header-inner { padding: 0 12px; }
          .logo-text { font-size: 0.9rem; }
          .header-count { display: none; }
          .main { padding: 16px 12px 32px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
          .stat-card { padding: 12px 8px; }
          .stat-value { font-size: 1.2rem; }
          .stat-label { font-size: 0.6rem; }
          .controls-section { padding: 12px; margin-bottom: 16px; }
          .controls-title { font-size: 0.8rem; margin-bottom: 12px; }
          .search-wrap input { font-size: 0.9rem; padding: 10px 10px 10px 36px; }
          .search-wrap svg { width: 16px; height: 16px; left: 10px; }
          .platform-pills { gap: 4px; margin-top: 10px; }
          .pill { font-size: 0.7rem; padding: 5px 10px; }
          .sort-row { margin-bottom: 16px; }
          .results-info { font-size: 0.75rem; }
          .sort-btn { font-size: 0.7rem; padding: 8px 6px; }
          .grid { gap: 12px; }
          .card { padding: 12px; gap: 10px; }
          .card-name { font-size: 0.85rem; }
          .card-price { font-size: 1.1rem; }
          .badge { font-size: 0.7rem; padding: 4px 8px; }
          .card-condition { font-size: 0.75rem; padding: 8px 10px; }
          .condition-label { font-size: 0.6rem; }
          .quality-dot { font-size: 0.75rem; }
          .btn-view { font-size: 0.75rem; padding: 8px 12px; }
          .waitlist-content { padding: 16px 12px; }
          .waitlist-title { font-size: 1rem; margin-bottom: 6px; }
          .waitlist-subtitle { font-size: 0.75rem; margin-bottom: 16px; }
          .countdown { grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 16px; }
          .countdown-item { padding: 8px; }
          .countdown-value { font-size: 1.2rem; }
          .countdown-label { font-size: 0.6rem; margin-top: 2px; }
          .form-label { font-size: 0.75rem; }
          .form-input, .form-select { font-size: 16px; padding: 10px 8px; }
          .submit-button { font-size: 0.8rem; padding: 10px 12px; }
          footer { font-size: 0.65rem; padding: 12px; }
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="header-inner">
          <a className="logo" href="#">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21ZM12 9.27273C9.69881 9.27273 7.83333 11.1043 7.83333 13.3636C7.83333 15.623 9.69881 17.4545 12 17.4545C14.3012 17.4545 16.1667 15.623 16.1667 13.3636C16.1667 11.1043 14.3012 9.27273 12 9.27273ZM12 10.9091C10.6193 10.9091 9.5 12.008 9.5 13.3636C9.5 14.7192 10.6193 15.8182 12 15.8182C13.3807 15.8182 14.5 14.7192 14.5 13.3636C14.5 12.008 13.3807 10.9091 12 10.9091ZM16.7222 10.0909C16.7222 9.63904 17.0953 9.27273 17.5556 9.27273H18.6667C19.1269 9.27273 19.5 9.63904 19.5 10.0909C19.5 10.5428 19.1269 10.9091 18.6667 10.9091H17.5556C17.0953 10.9091 16.7222 10.5428 16.7222 10.0909Z" fill="white"/>
              </svg>
            </div>
            <span className="logo-text">Cam<span>Finder</span></span>
          </a>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <button className="waitlist-btn" onClick={() => setShowWaitlist(true)}>Join Waitlist</button>
            <span className="header-count">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="main">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Listings</div></div>
          <div className="stat-card"><div className="stat-value">${stats.minPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}</div><div className="stat-label">Lowest Price</div></div>
          <div className="stat-card"><div className="stat-value">${stats.avgPrice.toLocaleString()}</div><div className="stat-label">Avg Price</div></div>
          <div className="stat-card"><div className="stat-value">${stats.maxPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}</div><div className="stat-label">Highest Price</div></div>
          <div className="stat-card"><div className="stat-value">{stats.platformCount}</div><div className="stat-label">Platforms</div></div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <label className="controls-title">Search & Filter</label>
          <div className="controls">
            <div className="search-wrap">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input type="text" placeholder="Search listings…" value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} />
            </div>

            <div className="price-range">
              <label>Price:</label>
              <input type="number" placeholder="Min" min="0" step="50" value={minPrice ?? ''} onChange={e => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)} />
              <span style={{color: 'var(--text-muted)'}}>–</span>
              <input type="number" placeholder="Max" min="0" step="50" value={maxPrice ?? ''} onChange={e => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)} />
            </div>

            <button className="btn-reset" onClick={handleReset}>Reset All</button>
          </div>

          <div className="platform-pills">
            {platforms.map(p => (
              <button key={p} className={`pill ${p === activePlatform ? 'active' : ''}`} onClick={() => setActivePlatform(p)}>{p}</button>
            ))}
          </div>
        </div>

        {/* Sort Row */}
        <div className="sort-row">
          <span className="results-info">Showing <strong>{filtered.length}</strong> of <strong>{LISTINGS.length}</strong> listings</span>
          <div className="sort-btns">
            <button className={`sort-btn ${activeSort === 'price-asc' ? 'active' : ''}`} onClick={() => setActiveSort('price-asc')}>💰 Price Low–High</button>
            <button className={`sort-btn ${activeSort === 'price-desc' ? 'active' : ''}`} onClick={() => setActiveSort('price-desc')}>💰 Price High–Low</button>
            <button className={`sort-btn ${activeSort === 'name-asc' ? 'active' : ''}`} onClick={() => setActiveSort('name-asc')}>📝 Name A–Z</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid">
          {filtered.length === 0 ? (
            <div className="empty">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <p>No listings match your filters. Try adjusting your search.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const ql = qualityLabel(item.condition);
              const isDeal = item.price === lowestPrice;
              return (
                <div key={idx} className={`card ${isDeal ? 'deal-badge' : ''}`}>
                  <div className="card-top">
                    <div className="card-name">{item.name}</div>
                    <div className="card-price">${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="card-meta">
                    <span className="badge badge-platform">{item.platform}</span>
                    <span className="badge badge-location">📍 {item.location}</span>
                  </div>
                  <div className="card-condition">
                    <div className="condition-label">Condition</div>
                    {item.condition}
                  </div>
                  <div className="card-footer">
                    <div className="quality-dot">
                      <div className={`dot ${ql.cls}`}></div>
                      <span>{ql.label}</span>
                    </div>
                    <a className="btn-view" href={item.link} target="_blank" rel="noopener noreferrer">
                      View
                      <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="waitlist-modal" onClick={() => setShowWaitlist(false)}>
          <div className="waitlist-content" onClick={e => e.stopPropagation()}>
            <div className="waitlist-close" onClick={() => setShowWaitlist(false)}>×</div>
            <h2 className="waitlist-title">Join the Waitlist</h2>
            <p className="waitlist-subtitle">Be the first to know about new Leica M3 listings and exclusive deals</p>
            
            <div className="countdown">
              <div className="countdown-item">
                <div className="countdown-value">{String(countdown.days).padStart(2, '0')}</div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="countdown-label">Minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="countdown-label">Seconds</div>
              </div>
            </div>

            {waitlistSubmitted && (
              <div className="success-message">✓ Thanks for joining! We'll notify you soon.</div>
            )}

            <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="waitlist-name">Name <span style={{color: 'var(--accent)'}}>*</span></label>
                <input
                  type="text"
                  id="waitlist-name"
                  className="form-input"
                  placeholder="Your name"
                  value={waitlistName}
                  onChange={e => setWaitlistName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="waitlist-email">Email <span style={{color: 'var(--accent)'}}>*</span></label>
                <input
                  type="email"
                  id="waitlist-email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={waitlistEmail}
                  onChange={e => setWaitlistEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="waitlist-interest">What interests you? <span style={{color: 'var(--accent)'}}>*</span></label>
                <select
                  id="waitlist-interest"
                  className="form-select"
                  value={waitlistInterest}
                  onChange={e => setWaitlistInterest(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="budget">Budget cameras (under $1500)</option>
                  <option value="premium">Premium cameras (over $1500)</option>
                  <option value="deals">Best deals</option>
                  <option value="all">All listings</option>
                </select>
              </div>

              <button type="submit" className="submit-button">Join the Waitlist</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        CamFinder © 2026 — Leica M3 Listings Aggregator &nbsp;|&nbsp; Data from eBay, Facebook Marketplace, KEH, MPB, Alpine Camera, UPP &nbsp;|&nbsp; <a href="#">Learn more</a>
      </footer>
    </div>
  );
}
