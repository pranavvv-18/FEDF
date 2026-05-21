const fs = require('fs');

const content = fs.readFileSync('voyager-trip-planner.html', 'utf8');

// Extract CSS
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('voyager-react/src/index.css', styleMatch[1].trim());
}

// Extract body
const bodyMatch = content.match(/<body>([\s\S]*?)<script>/);
let bodyHtml = bodyMatch ? bodyMatch[1].trim() : '';

// Convert HTML to JSX
let jsx = bodyHtml;

// Replace class with className
jsx = jsx.replace(/class=/g, 'className=');

// Replace SVG properties
jsx = jsx.replace(/stroke-dasharray/g, 'strokeDasharray');
jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
jsx = jsx.replace(/stroke-dashoffset/g, 'strokeDashoffset');
jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');

// Replace inline styles
jsx = jsx.replace(/style="([^"]*)"/g, (match, styleStr) => {
  const parts = styleStr.split(';');
  const objParts = [];
  for (let p of parts) {
    p = p.trim();
    if (!p) continue;
    if (!p.includes(':')) continue;
    let [k, v] = p.split(':');
    k = k.trim();
    v = v.trim();
    const kCamel = k.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    objParts.push(`${kCamel}: '${v}'`);
  }
  return `style={{${objParts.join(', ')}}}`;
});

// Remove inline onclick
jsx = jsx.replace(/onclick="[^"]*"/g, '');

// Convert comments
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Close unclosed input tags
jsx = jsx.replace(/<input([^>]*?)>/g, (match, p1) => {
  if (p1.trim().endsWith('/')) return match; // already closed
  return `<input${p1} />`;
});

const appJsx = `import React, { useEffect, useState } from 'react';
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
          
          if (orb1) orb1.style.transform = \`translateY(\${y * -0.18}px)\`;
          if (orb2) orb2.style.transform = \`translateY(\${y * 0.16}px)\`;
          if (orb3) orb3.style.transform = \`translateY(\${y * -0.12}px)\`;
          if (orb4) orb4.style.transform = \`translateY(\${y * 0.22}px)\`;
          if (flayer) flayer.style.transform = \`translateY(\${y * 0.6}px)\`;
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
${jsx}
    </>
  );
}

export default App;
`;

fs.writeFileSync('voyager-react/src/App.jsx', appJsx);
console.log('Conversion successful!');
