import React, { useEffect, useState } from 'react';
import './index.css';

function App() {
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const orb1 = document.getElementById('orb1');
          const orb2 = document.getElementById('orb2');
          const orb3 = document.getElementById('orb3');
          const orb4 = document.getElementById('orb4');
          const flayer = document.getElementById('flayer');
          
          if (orb1) orb1.style.transform = `translateY(${y * -0.18}px)`;
          if (orb2) orb2.style.transform = `translateY(${y * 0.16}px)`;
          if (orb3) orb3.style.transform = `translateY(${y * -0.12}px)`;
          if (orb4) orb4.style.transform = `translateY(${y * 0.22}px)`;
          if (flayer) flayer.style.transform = `translateY(${y * 0.6}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);

    const mods = document.querySelectorAll('.mod');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('vis');
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    mods.forEach(m => io.observe(m));

    const mapIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['arc1', 'arc2', 'arc3', 'arc4'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('draw');
          });
        }
      });
    }, { threshold: .2 });
    const mv = document.getElementById('map-view');
    if (mv) mapIO.observe(mv);

    const costIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.cbar-fill').forEach(b => {
            const w = b.getAttribute('data-w');
            if (w) b.style.width = w + '%';
          });
        }
      });
    }, { threshold: .3 });
    const cc = document.getElementById('cost-card');
    if (cc) costIO.observe(cc);

    setTimeout(() => {
      const hero = document.getElementById('hero');
      if (hero) hero.classList.add('vis');
    }, 80);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
      mapIO.disconnect();
      costIO.disconnect();
    };
  }, []);

  return (
    <>
{/*  Background wash  */}
    <div className="bg-wash"></div>

    {/*  Atmosphere Orbs (parallax via JS)  */}
    <div className="orb o1" id="orb1"></div>
    <div className="orb o2" id="orb2"></div>
    <div className="orb o3" id="orb3"></div>
    <div className="orb o4" id="orb4"></div>

    {/*  Flight lines parallax layer  */}
    <div className="fl-layer" id="flayer">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
                <pattern id="dotpat" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(255,140,0,0.18)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotpat)" />
            <path d="M-50,200 Q300,80 700,280 Q1100,450 1500,180" stroke="rgba(255,140,0,0.12)" strokeWidth="1.5"
                fill="none" strokeDasharray="8,10" />
            <path d="M-50,500 Q400,300 900,420 Q1200,500 1600,320" stroke="rgba(255,69,0,0.09)" strokeWidth="1"
                fill="none" strokeDasharray="5,12" />
            <path d="M200,-30 Q500,200 400,600 Q350,900 600,1100" stroke="rgba(255,140,0,0.08)" strokeWidth="1.5"
                fill="none" strokeDasharray="6,10" />
            <path d="M800,-30 Q1100,300 900,700" stroke="rgba(255,69,0,0.07)" strokeWidth="1" fill="none"
                strokeDasharray="4,14" />
        </svg>
    </div>

    {/*  Navbar  */}
    <nav>
        <a href="#" className="nlogo">
            <div className="nlogo-icon">✈</div>
            Voyager
        </a>
        <ul className="nlinks">
            <li><a href="#routes">Routes</a></li>
            <li><a href="#map">Map</a></li>
            <li><a href="#visas">Visas</a></li>
            <li><a href="#airlines">Airlines</a></li>
            <li><a href="#saved">My Trips</a></li>
            <li><a href="#" className="n-cta">Plan a Trip →</a></li>
        </ul>
    </nav>

    <main>

        {/*  ═══════════ HERO ═══════════  */}
        <div className="wrap">
            <section className="hero mod" id="hero">
                <div className="hero-badge">
                    <div className="hb-dot"></div> AI-Powered Multi-City Planner
                </div>
                <h1>Plan every stop.<br /><span className="gtxt">Fly smarter.</span></h1>
                <p className="hero-sub">Build complex multi-city itineraries with real-time visa checks, layover
                    intelligence, and AI-optimised routing across 190+ countries.</p>

                <div className="hsearch">
                    <div className="hf">
                        <label>From</label>
                        <input type="text" placeholder="New York, JFK" value="New York, JFK" />
                    </div>
                    <div className="hdiv"></div>
                    <div className="hf">
                        <label>Cities</label>
                        <input type="text" placeholder="Add up to 6 stops" value="London · Dubai · Tokyo" />
                    </div>
                    <div className="hdiv"></div>
                    <div className="hf">
                        <label>Depart</label>
                        <input type="text" placeholder="Select dates" value="Jul 14 – Aug 2" />
                    </div>
                    <div className="hdiv"></div>
                    <div className="hf">
                        <label>Passengers</label>
                        <input type="text" placeholder="1 adult" value="2 Adults" />
                    </div>
                    <button className="hbtn">✦ Search Flights</button>
                </div>

                <div className="hero-stats">
                    <div>
                        <div className="stat-n">4.2<span>M</span></div>
                        <div className="stat-l">Trips planned</div>
                    </div>
                    <div>
                        <div className="stat-n">190<span>+</span></div>
                        <div className="stat-l">Countries covered</div>
                    </div>
                    <div>
                        <div className="stat-n">38<span>%</span></div>
                        <div className="stat-l">Average savings</div>
                    </div>
                    <div>
                        <div className="stat-n">2.8<span>s</span></div>
                        <div className="stat-l">Search speed</div>
                    </div>
                </div>
            </section>
        </div>

        {/*  ═══════════ SECTION 1: Route Builder + Layover ═══════════  */}
        <div className="wrap sec" id="routes">
            <div className="sec-tag">Plan Your Journey</div>
            <div className="sec-h">Build your route</div>
            <div className="g2">

                {/*  Route Builder  */}
                <div className="mod">
                    <div className="card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">🗺️</div>
                                <div>
                                    <div className="ct">Route Builder</div>
                                    <div className="cs">Drag to reorder stops</div>
                                </div>
                            </div>
                            <span className="badge bo">5 Cities</span>
                        </div>

                        <div id="route-list">
                            <div className="rc" draggable="true" data-idx="0">
                                <div className="dh"><span></span><span></span><span></span></div>
                                <div className="cdot"></div>
                                <div className="ci-info">
                                    <div className="cn">New York</div>
                                    <div className="cd">Jul 14 · 09:00</div>
                                </div>
                                <div className="cc">JFK</div>
                                <div className="connector">
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                </div>
                            </div>
                            <div className="rc" draggable="true" data-idx="1">
                                <div className="dh"><span></span><span></span><span></span></div>
                                <div className="cdot"></div>
                                <div className="ci-info">
                                    <div className="cn">London</div>
                                    <div className="cd">Jul 15 · 22:15</div>
                                </div>
                                <div className="cc">LHR</div>
                                <div className="connector">
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                </div>
                            </div>
                            <div className="rc" draggable="true" data-idx="2">
                                <div className="dh"><span></span><span></span><span></span></div>
                                <div className="cdot"></div>
                                <div className="ci-info">
                                    <div className="cn">Dubai</div>
                                    <div className="cd">Jul 19 · 07:30</div>
                                </div>
                                <div className="cc">DXB</div>
                                <div className="connector">
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                </div>
                            </div>
                            <div className="rc" draggable="true" data-idx="3">
                                <div className="dh"><span></span><span></span><span></span></div>
                                <div className="cdot"></div>
                                <div className="ci-info">
                                    <div className="cn">Bangkok</div>
                                    <div className="cd">Jul 23 · 14:50</div>
                                </div>
                                <div className="cc">BKK</div>
                                <div className="connector">
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                    <div className="c-dot"></div>
                                </div>
                            </div>
                            <div className="rc" draggable="true" data-idx="4">
                                <div className="dh"><span></span><span></span><span></span></div>
                                <div className="cdot"></div>
                                <div className="ci-info">
                                    <div className="cn">Tokyo</div>
                                    <div className="cd">Jul 27 · 11:00</div>
                                </div>
                                <div className="cc">NRT</div>
                            </div>
                        </div>

                        <button className="add-city" >
                            <div className="add-icon">+</div> Add another city
                        </button>
                    </div>
                </div>

                {/*  Layover Display  */}
                <div className="mod">
                    <div className="card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">⏱️</div>
                                <div>
                                    <div className="ct">Layover Display</div>
                                    <div className="cs">All connection times</div>
                                </div>
                            </div>
                            <span className="badge bo">2 Alerts</span>
                        </div>

                        <div className="tl-scroll">
                            <div className="tl">
                                <div className="tl-city">
                                    <div className="tl-ap">JFK</div>
                                    <div className="tl-n">New York</div>
                                    <div className="tl-t">09:00</div>
                                </div>
                                <div className="tl-seg">
                                    <div className="fl-line">
                                        <div className="fl-plane">✈</div>
                                    </div>
                                    <div className="fl-dur">7h 15m</div>
                                </div>
                                <div className="tl-city">
                                    <div className="tl-ap">LHR</div>
                                    <div className="tl-n">London</div>
                                    <div className="tl-t">22:15</div>
                                </div>
                                <div className="tl-seg">
                                    <div
                                        style={{background: 'rgba(255,140,0,.08)', borderRadius: '8px', padding: '4px 10px', textAlign: 'center'}}>
                                        <div className="lay-badge">⚡ 3h 20m Layover</div>
                                    </div>
                                </div>
                                <div className="tl-city">
                                    <div className="tl-ap">DXB</div>
                                    <div className="tl-n">Dubai</div>
                                    <div className="tl-t">Jul 16</div>
                                </div>
                            </div>
                        </div>

                        <div style={{marginTop: '18px'}}>
                            <div
                                style={{fontSize: '13px', fontWeight: '700', color: 'var(--slate)', marginBottom: '12px', letterSpacing: '-.01em'}}>
                                Connection Summary</div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                <div
                                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,140,0,.06)', border: '1.5px solid rgba(255,140,0,.15)', borderRadius: '12px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--slate)'}}>LHR → DXB</div>
                                    <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--org)'}}>⚡ 3h 20m — Tight</div>
                                </div>
                                <div
                                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(16,185,129,.04)', border: '1.5px solid rgba(16,185,129,.15)', borderRadius: '12px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--slate)'}}>DXB → BKK</div>
                                    <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--green)'}}>✓ 5h 40m —
                                        Comfortable</div>
                                </div>
                                <div
                                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(16,185,129,.04)', border: '1.5px solid rgba(16,185,129,.15)', borderRadius: '12px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '600', color: 'var(--slate)'}}>BKK → NRT</div>
                                    <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--green)'}}>✓ 6h 50m — Relaxed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/*  ═══════════ SECTION 2: Map View ═══════════  */}
        <div className="wrap sec" id="map">
            <div className="sec-tag">Visual Route</div>
            <div className="sec-h">Your flight path</div>
            <div className="mod">
                <div className="card" style={{padding: '0', overflow: 'hidden'}}>
                    <div className="map-wrap" id="map-view">
                        <div className="map-pins">
                            <div className="mpin">
                                <div className="pdot"></div>New York
                            </div>
                            <div className="mpin">
                                <div className="pdot"></div>London
                            </div>
                            <div className="mpin">
                                <div className="pdot"></div>Dubai
                            </div>
                            <div className="mpin">
                                <div className="pdot g"></div>Bangkok
                            </div>
                            <div className="mpin">
                                <div className="pdot g"></div>Tokyo
                            </div>
                        </div>
                        <svg className="map-svg" viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg">
                            {/*  Ocean background  */}
                            <rect width="900" height="420" fill="url(#mapbg)" />
                            <defs>
                                <radialGradient id="mapbg" cx="50%" cy="50%" r="75%">
                                    <stop offset="0%" stop-color="#EEF6FF" />
                                    <stop offset="100%" stop-color="#F5F0FF" />
                                </radialGradient>
                                <radialGradient id="cityglow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stop-color="rgba(255,140,0,0.3)" />
                                    <stop offset="100%" stop-color="rgba(255,140,0,0)" />
                                </radialGradient>
                                <filter id="blur4">
                                    <feGaussianBlur stdDeviation="4" />
                                </filter>
                            </defs>

                            {/*  Continent shapes (simplified)  */}
                            {/*  North America  */}
                            <path
                                d="M60,80 L70,70 L95,68 L120,75 L135,90 L145,115 L150,140 L140,165 L120,180 L105,195 L95,215 L75,220 L60,210 L50,190 L40,165 L45,130 L55,105 Z"
                                fill="rgba(200,215,230,0.5)" stroke="rgba(180,200,220,0.4)" strokeWidth="1" />
                            {/*  Europe  */}
                            <path d="M295,60 L320,58 L340,65 L350,80 L345,100 L330,110 L310,108 L295,98 L285,80 Z"
                                fill="rgba(200,215,230,0.5)" stroke="rgba(180,200,220,0.4)" strokeWidth="1" />
                            {/*  Africa  */}
                            <path
                                d="M310,120 L340,118 L360,130 L365,165 L360,200 L350,230 L330,245 L310,240 L295,220 L290,185 L295,155 L300,130 Z"
                                fill="rgba(200,215,230,0.45)" stroke="rgba(180,200,220,0.4)" strokeWidth="1" />
                            {/*  Middle East / Asia  */}
                            <path
                                d="M390,85 L440,82 L490,90 L530,100 L570,95 L610,85 L650,80 L700,85 L720,100 L710,125 L680,140 L640,145 L590,140 L540,145 L500,150 L460,145 L430,135 L400,125 L385,108 Z"
                                fill="rgba(200,215,230,0.48)" stroke="rgba(180,200,220,0.4)" strokeWidth="1" />
                            {/*  Japan island  */}
                            <ellipse cx="740" cy="135" rx="22" ry="35" fill="rgba(200,215,230,0.5)"
                                stroke="rgba(180,200,220,0.4)" strokeWidth="1" transform="rotate(-15,740,135)" />
                            {/*  SE Asia  */}
                            <path d="M570,155 L610,160 L630,180 L620,210 L595,220 L570,210 L555,185 L560,165 Z"
                                fill="rgba(200,215,230,0.45)" stroke="rgba(180,200,220,0.35)" strokeWidth="1" />
                            {/*  South America  */}
                            <path
                                d="M130,235 L160,230 L175,245 L180,275 L175,310 L160,335 L140,345 L120,335 L110,310 L108,275 L115,250 Z"
                                fill="rgba(200,215,230,0.45)" stroke="rgba(180,200,220,0.35)" strokeWidth="1" />
                            {/*  Australia  */}
                            <path d="M650,280 L700,272 L730,285 L740,310 L730,335 L700,348 L665,340 L645,315 L648,290 Z"
                                fill="rgba(200,215,230,0.45)" stroke="rgba(180,200,220,0.35)" strokeWidth="1" />

                            {/*  Glow halos under city dots  */}
                            <circle cx="105" cy="145" r="22" fill="rgba(255,140,0,0.1)" filter="url(#blur4)" />
                            <circle cx="312" cy="84" r="20" fill="rgba(255,140,0,0.1)" filter="url(#blur4)" />
                            <circle cx="455" cy="118" r="20" fill="rgba(255,140,0,0.1)" filter="url(#blur4)" />
                            <circle cx="598" cy="178" r="18" fill="rgba(255,140,0,0.1)" filter="url(#blur4)" />
                            <circle cx="742" cy="138" r="18" fill="rgba(255,140,0,0.1)" filter="url(#blur4)" />

                            {/*  Animated flight arcs  */}
                            {/*  NYC → London  */}
                            <path className="arc-path arc-anim" id="arc1" d="M105,145 Q208,40 312,84" />
                            {/*  London → Dubai  */}
                            <path className="arc-path arc-anim" id="arc2" d="M312,84 Q383,50 455,118"
                                style={{transitionDelay: '.5s'}} />
                            {/*  Dubai → Bangkok  */}
                            <path className="arc-path arc-anim" id="arc3" d="M455,118 Q526,80 598,178"
                                style={{transitionDelay: '1s'}} />
                            {/*  Bangkok → Tokyo  */}
                            <path className="arc-path arc-anim" id="arc4" d="M598,178 Q670,90 742,138"
                                style={{transitionDelay: '1.5s'}} />

                            {/*  Animated travel dot on arc 1  */}
                            <circle r="5" fill="var(--org)" opacity="0.9">
                                <animateMotion dur="4s" repeatCount="indefinite" path="M105,145 Q208,40 312,84" />
                            </circle>
                            <circle r="5" fill="var(--org)" opacity="0.9">
                                <animateMotion dur="3.5s" repeatCount="indefinite" begin="1s"
                                    path="M312,84 Q383,50 455,118" />
                            </circle>

                            {/*  City dots  */}
                            <g className="city-glow">
                                <circle cx="105" cy="145" r="8" fill="white" stroke="var(--org)" strokeWidth="2.5" />
                                <circle cx="105" cy="145" r="4" fill="var(--org)" />
                            </g>
                            <g className="city-glow">
                                <circle cx="312" cy="84" r="8" fill="white" stroke="var(--org)" strokeWidth="2.5" />
                                <circle cx="312" cy="84" r="4" fill="var(--org)" />
                            </g>
                            <g className="city-glow">
                                <circle cx="455" cy="118" r="8" fill="white" stroke="var(--org)" strokeWidth="2.5" />
                                <circle cx="455" cy="118" r="4" fill="var(--org)" />
                            </g>
                            <g className="city-glow">
                                <circle cx="598" cy="178" r="8" fill="white" stroke="#10B981" strokeWidth="2.5" />
                                <circle cx="598" cy="178" r="4" fill="#10B981" />
                            </g>
                            <g className="city-glow">
                                <circle cx="742" cy="138" r="8" fill="white" stroke="#10B981" strokeWidth="2.5" />
                                <circle cx="742" cy="138" r="4" fill="#10B981" />
                            </g>

                            {/*  City labels  */}
                            <text x="105" y="165" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif"
                                fontSize="11" fontWeight="700" fill="var(--slate)">New York</text>
                            <text x="312" y="72" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif"
                                fontSize="11" fontWeight="700" fill="var(--slate)">London</text>
                            <text x="455" y="108" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif"
                                fontSize="11" fontWeight="700" fill="var(--slate)">Dubai</text>
                            <text x="598" y="198" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif"
                                fontSize="11" fontWeight="700" fill="#059669">Bangkok</text>
                            <text x="742" y="128" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif"
                                fontSize="11" fontWeight="700" fill="#059669">Tokyo</text>

                            {/*  Total distance indicator  */}
                            <rect x="14" y="365" width="220" height="42" rx="10" fill="rgba(255,255,255,0.88)" />
                            <text x="28" y="382" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="11"
                                fontWeight="700" fill="#64748B">TOTAL DISTANCE</text>
                            <text x="28" y="398" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="13"
                                fontWeight="800" fill="var(--slate)">18,240 km · 19h 45m total</text>

                            {/*  Legend  */}
                            <circle cx="800" cy="375" r="5" fill="var(--org)" />
                            <text x="812" y="379" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="11"
                                fontWeight="600" fill="#64748B">Outbound</text>
                            <circle cx="800" cy="395" r="5" fill="#10B981" />
                            <text x="812" y="399" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="11"
                                fontWeight="600" fill="#64748B">Final leg</text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        {/*  ═══════════ SECTION 3: Visa + Cost ═══════════  */}
        <div className="wrap sec" id="visas">
            <div className="sec-tag">Trip Intelligence</div>
            <div className="sec-h">Visa &amp; budget overview</div>
            <div className="g2">

                {/*  Visa Info Panel  */}
                <div className="mod">
                    <div className="card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">🛂</div>
                                <div>
                                    <div className="ct">Visa Info Panel</div>
                                    <div className="cs">US Passport · Updated today</div>
                                </div>
                            </div>
                            <button className="btn-g" style={{fontSize: '12px', padding: '7px 13px'}}>Refresh ↻</button>
                        </div>

                        <div className="vc">
                            <div className="vf">🇬🇧</div>
                            <div className="vi">
                                <div className="vco">United Kingdom</div>
                                <div className="vty">e-Visa on arrival · 180 days</div>
                            </div>
                            <div className="vstv">✓ Verified</div>
                        </div>
                        <div className="vc">
                            <div className="vf">🇦🇪</div>
                            <div className="vi">
                                <div className="vco">United Arab Emirates</div>
                                <div className="vty">Visa on Arrival · 30 days</div>
                            </div>
                            <div className="vstv">✓ Verified</div>
                        </div>
                        <div className="vc">
                            <div className="vf">🇹🇭</div>
                            <div className="vi">
                                <div className="vco">Thailand</div>
                                <div className="vty">Visa-free · 30 days</div>
                            </div>
                            <div className="vstv">✓ Verified</div>
                        </div>
                        <div className="vc">
                            <div className="vf">🇯🇵</div>
                            <div className="vi">
                                <div className="vco">Japan</div>
                                <div className="vty">eVisa required · Apply 14d prior</div>
                            </div>
                            <div className="vstr">⚡ Action Required</div>
                        </div>

                        <div
                            style={{background: 'rgba(255,140,0,.06)', border: '1.5px solid rgba(255,140,0,.15)', borderRadius: '12px', padding: '14px 16px', marginTop: '14px'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'var(--slate)', marginBottom: '4px'}}>⚠ Japan
                                eVisa Reminder</div>
                            <div style={{fontSize: '12px', color: 'var(--muted)', lineHeight: '1.6'}}>Apply at least 14 days before
                                your Jul 27 flight. Processing takes 5–7 business days. Cost: ¥3,000 (~$20).</div>
                            <button className="btn-o" style={{marginTop: '10px', fontSize: '12px', padding: '8px 14px'}}>Apply Now
                                →</button>
                        </div>
                    </div>
                </div>

                {/*  Cost Summary  */}
                <div className="mod">
                    <div className="card" id="cost-card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">💰</div>
                                <div>
                                    <div className="ct">Cost Summary</div>
                                    <div className="cs">2 adults · 19 days</div>
                                </div>
                            </div>
                            <span className="badge bg">-38% vs avg</span>
                        </div>

                        <div className="cost-total"><span className="gtxt">$6,</span>840</div>
                        <div className="cost-sub">Total estimated cost per person</div>

                        <div className="cbar-row">
                            <div className="cbar-lbl">Flights</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="78" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$2,980</div>
                        </div>
                        <div className="cbar-row">
                            <div className="cbar-lbl">Hotels</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="58" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$2,120</div>
                        </div>
                        <div className="cbar-row">
                            <div className="cbar-lbl">Transport</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="30" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$640</div>
                        </div>
                        <div className="cbar-row">
                            <div className="cbar-lbl">Meals</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="24" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$480</div>
                        </div>
                        <div className="cbar-row">
                            <div className="cbar-lbl">Activities</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="16" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$360</div>
                        </div>
                        <div className="cbar-row">
                            <div className="cbar-lbl">Visas</div>
                            <div className="cbar-track">
                                <div className="cbar-fill" data-w="3" style={{width: '0%'}}></div>
                            </div>
                            <div className="cbar-amt">$260</div>
                        </div>

                        <div className="cost-total-row">
                            <div className="ctl">Total (2 people)</div>
                            <div className="cta">$13,680</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/*  ═══════════ SECTION 4: Date Picker + Airlines ═══════════  */}
        <div className="wrap sec">
            <div className="sec-tag">Scheduling &amp; Flights</div>
            <div className="sec-h">Dates &amp; airlines</div>
            <div className="g2">

                {/*  Date Picker  */}
                <div className="mod">
                    <div className="card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">📅</div>
                                <div>
                                    <div className="ct">Date Picker</div>
                                    <div className="cs">Select departure windows</div>
                                </div>
                            </div>
                        </div>

                        <div className="trip-legs">
                            <div className="leg-tag active">NYC→LHR</div>
                            <div className="leg-tag">LHR→DXB</div>
                            <div className="leg-tag">DXB→BKK</div>
                            <div className="leg-tag">BKK→NRT</div>
                        </div>

                        <div className="cal-hdr">
                            <button className="cal-nav">‹</button>
                            <div className="cal-title">July 2025</div>
                            <button className="cal-nav">›</button>
                        </div>
                        <div className="cal-g">
                            <div className="cal-dn">Su</div>
                            <div className="cal-dn">Mo</div>
                            <div className="cal-dn">Tu</div>
                            <div className="cal-dn">We</div>
                            <div className="cal-dn">Th</div>
                            <div className="cal-dn">Fr</div>
                            <div className="cal-dn">Sa</div>
                            <div className="cal-d empty"></div>
                            <div className="cal-d">1</div>
                            <div className="cal-d">2</div>
                            <div className="cal-d">3</div>
                            <div className="cal-d">4</div>
                            <div className="cal-d">5</div>
                            <div className="cal-d">6</div>
                            <div className="cal-d">7</div>
                            <div className="cal-d">8</div>
                            <div className="cal-d">9</div>
                            <div className="cal-d">10</div>
                            <div className="cal-d">11</div>
                            <div className="cal-d">12</div>
                            <div className="cal-d today">13</div>
                            <div className="cal-d sel">14</div>
                            <div className="cal-d range">15</div>
                            <div className="cal-d range">16</div>
                            <div className="cal-d range">17</div>
                            <div className="cal-d range">18</div>
                            <div className="cal-d range">19</div>
                            <div className="cal-d">20</div>
                            <div className="cal-d">21</div>
                            <div className="cal-d">22</div>
                            <div className="cal-d">23</div>
                            <div className="cal-d">24</div>
                            <div className="cal-d">25</div>
                            <div className="cal-d">26</div>
                            <div className="cal-d">27</div>
                            <div className="cal-d">28</div>
                            <div className="cal-d">29</div>
                            <div className="cal-d">30</div>
                            <div className="cal-d">31</div>
                        </div>

                        <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                            <div
                                style={{flex: '1', background: 'rgba(255,140,0,.07)', border: '1.5px solid rgba(255,140,0,.2)', borderRadius: '12px', padding: '12px', textAlign: 'center'}}>
                                <div
                                    style={{fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '3px'}}>
                                    Depart</div>
                                <div style={{fontSize: '16px', fontWeight: '800', color: 'var(--slate)', letterSpacing: '-.02em'}}>Jul
                                    14</div>
                                <div style={{fontSize: '11px', color: 'var(--org)', fontWeight: '600'}}>Best price day ✦</div>
                            </div>
                            <div
                                style={{flex: '1', background: 'rgba(255,255,255,.85)', border: '1.5px solid rgba(0,0,0,.06)', borderRadius: '12px', padding: '12px', textAlign: 'center'}}>
                                <div
                                    style={{fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '3px'}}>
                                    Return</div>
                                <div style={{fontSize: '16px', fontWeight: '800', color: 'var(--slate)', letterSpacing: '-.02em'}}>Aug
                                    2</div>
                                <div style={{fontSize: '11px', color: 'var(--muted)', fontWeight: '600'}}>19 days total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Airline Compare  */}
                <div className="mod" id="airlines">
                    <div className="card">
                        <div className="ch">
                            <div className="ch-left">
                                <div className="ci">🛫</div>
                                <div>
                                    <div className="ct">Airline Compare</div>
                                    <div className="cs">JFK → LHR · Jul 14</div>
                                </div>
                            </div>
                            <span className="badge bo">4 options</span>
                        </div>

                        <div className="ar sel" >
                            <div className="al-logo" style={{background: 'linear-gradient(135deg,#1a56db,#0e3b9e)'}}>BA</div>
                            <div className="al-info">
                                <div className="al-n">British Airways</div>
                                <div className="al-r">JFK → LHR · 7h 10m · Nonstop</div>
                            </div>
                            <div className="al-badge">
                                <div className="al-pa">$849</div>
                                <div className="al-pl">per person</div>
                                <div className="stars"><span className="star">★</span><span className="star">★</span><span
                                        className="star">★</span><span className="star">★</span><span className="star e">★</span>
                                </div>
                            </div>
                        </div>

                        <div className="ar" >
                            <div className="al-logo" style={{background: 'linear-gradient(135deg,#E31837,#b01028)'}}>VA</div>
                            <div className="al-info">
                                <div className="al-n">Virgin Atlantic</div>
                                <div className="al-r">JFK → LHR · 7h 25m · Nonstop</div>
                            </div>
                            <div className="al-badge">
                                <div className="al-pa">$779</div>
                                <div className="al-pl">per person</div>
                                <div className="stars"><span className="star">★</span><span className="star">★</span><span
                                        className="star">★</span><span className="star">★</span><span className="star">★</span>
                                </div>
                            </div>
                        </div>

                        <div className="ar" >
                            <div className="al-logo" style={{background: 'linear-gradient(135deg,#FF6900,#cc4f00)'}}>AA</div>
                            <div className="al-info">
                                <div className="al-n">American Airlines</div>
                                <div className="al-r">JFK → LHR · 7h 05m · Nonstop</div>
                            </div>
                            <div className="al-badge">
                                <div className="al-pa">$698</div>
                                <div className="al-pl">per person</div>
                                <div className="stars"><span className="star">★</span><span className="star">★</span><span
                                        className="star">★</span><span className="star">★</span><span className="star e">★</span>
                                </div>
                            </div>
                        </div>

                        <div className="ar" >
                            <div className="al-logo" style={{background: 'linear-gradient(135deg,#0096D5,#006fa8)'}}>UA</div>
                            <div className="al-info">
                                <div className="al-n">United Airlines</div>
                                <div className="al-r">JFK → LHR · 7h 55m · 1 stop</div>
                            </div>
                            <div className="al-badge">
                                <div className="al-pa">$612</div>
                                <div className="al-pl">per person</div>
                                <div className="stars"><span className="star">★</span><span className="star">★</span><span
                                        className="star">★</span><span className="star e">★</span><span className="star e">★</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/*  ═══════════ SECTION 5: Saved Trips ═══════════  */}
        <div className="wrap sec" id="saved">
            <div className="sec-tag">Your Collection</div>
            <div className="sec-h">Saved trips</div>
            <div className="g3">

                <div className="mod">
                    <div className="st">
                        <div className="st-img" style={{background: 'linear-gradient(135deg,#FF8C00,#FF4500,#c0392b)'}}>
                            <div className="st-overlay">
                                <div className="st-cities">
                                    <div className="st-ct">NYC</div><span className="st-arrow">→</span>
                                    <div className="st-ct">LHR</div><span className="st-arrow">→</span>
                                    <div className="st-ct">DXB</div><span className="st-arrow">→</span>
                                    <div className="st-ct">NRT</div>
                                </div>
                            </div>
                        </div>
                        <div className="st-info">
                            <div className="st-days">19 days</div>
                            <div className="st-name">Grand Asia Pacific Tour</div>
                            <div className="st-meta">
                                <div className="st-date">Jul 14 – Aug 2, 2025</div>
                                <div className="st-cost">$6,840</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mod">
                    <div className="st">
                        <div className="st-img" style={{background: 'linear-gradient(135deg,#0F2F6E,#1565C0,#0288D1)'}}>
                            <div className="st-overlay">
                                <div className="st-cities">
                                    <div className="st-ct">LON</div><span className="st-arrow">→</span>
                                    <div className="st-ct">AMS</div><span className="st-arrow">→</span>
                                    <div className="st-ct">BCN</div><span className="st-arrow">→</span>
                                    <div className="st-ct">ROM</div>
                                </div>
                            </div>
                        </div>
                        <div className="st-info">
                            <div className="st-days">14 days</div>
                            <div className="st-name">European Summer Loop</div>
                            <div className="st-meta">
                                <div className="st-date">Aug 10 – Aug 24, 2025</div>
                                <div className="st-cost">$3,120</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mod">
                    <div className="st">
                        <div className="st-img" style={{background: 'linear-gradient(135deg,#1B5E20,#2E7D32,#388E3C)'}}>
                            <div className="st-overlay">
                                <div className="st-cities">
                                    <div className="st-ct">MIA</div><span className="st-arrow">→</span>
                                    <div className="st-ct">BOG</div><span className="st-arrow">→</span>
                                    <div className="st-ct">LIM</div><span className="st-arrow">→</span>
                                    <div className="st-ct">EZE</div>
                                </div>
                            </div>
                        </div>
                        <div className="st-info">
                            <div className="st-days">21 days</div>
                            <div className="st-name">South America Explorer</div>
                            <div className="st-meta">
                                <div className="st-date">Sep 1 – Sep 22, 2025</div>
                                <div className="st-cost">$4,560</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    </main>

    {/*  Footer  */}
    <footer>
        <div className="foot-wrap">
            <div>
                <div className="foot-logo">
                    <div className="foot-logo-icon">✈</div>Voyager
                </div>
                <div className="foot-tagline">The world's smartest multi-city planner.</div>
            </div>
            <ul className="foot-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Support</a></li>
            </ul>
        </div>
        <div className="foot-legal">© 2025 Voyager Technologies Inc. All rights reserved. Trip data is for illustrative
            purposes only.</div>
    </footer>
    </>
  );
}

export default App;
