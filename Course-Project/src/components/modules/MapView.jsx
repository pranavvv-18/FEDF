// [CO2: ES6 Modules / Modular Design] - Importing dependencies
import { useState, useEffect, useRef } from "react";
import CardIcon from "../ui/CardIcon.jsx";
import { geodesicPts, bearing, formatMoney, flightPrice, flightDur } from "../../utils/helpers.js";

export default function MapView({ allStops, currency }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef([]);
  const tileRef = useRef(null);
  const [activeTile, setActiveTile] = useState("osm");

  // [CO3: Side-Effect Management] - useEffect handles map lifecycle initialization & structural garbage collection cleanup
  useEffect(() => {
    if (!window.L) return;
    const L = window.L;
    if (!mapInstance.current) {
      const bounds = L.latLngBounds([[-90, -180], [90, 180]]);
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        worldCopyJump: false
      }).setView([20, 20], 2);
      tileRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 18,
        noWrap: true,
        bounds: bounds
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        tileRef.current = null;
      }
    };
  }, []);

  // [CO3: Side-Effect Management] - React state synchronizer drawing vector paths and markers onto Leaflet Map
  useEffect(() => {
    if (!window.L || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    // Force Leaflet to recalculate container size
    map.invalidateSize();
    setTimeout(() => { if (mapInstance.current) mapInstance.current.invalidateSize(); }, 150);

    // Clear existing layers
    layersRef.current.forEach(l => {
      try {
        map.removeLayer(l);
      } catch (e) {}
    });
    layersRef.current = [];

    if (allStops.length < 1) return;

    const bounds = [];
    const animatedPlanes = [];

    for (let i = 0; i < allStops.length - 1; i++) {
      const a = allStops[i], b = allStops[i + 1];
      const invertArc = i % 2 !== 0; // Alternate curve direction to prevent overlaps
      const pts = geodesicPts(a.lat, a.lng, b.lat, b.lng, 60, invertArc);

      // Background glow line
      const glow = L.polyline(pts, { color: "rgba(255,140,0,0.25)", weight: 8, opacity: 1, lineCap: "round" });
      glow.addTo(map);
      layersRef.current.push(glow);

      // Main dashed route line
      const line = L.polyline(pts, { color: "#FF8C00", weight: 2.8, opacity: 0.9, dashArray: "9 6" });
      line.addTo(map);
      layersRef.current.push(line);

      // Plane icon (Animated)
      const planeIcon = L.divIcon({
        html: `<div class="plane-icon" style="font-size:20px;filter:drop-shadow(0 2px 4px rgba(255,100,0,0.6));will-change:transform">✈</div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const planeM = L.marker(pts[0], { icon: planeIcon, interactive: false });
      planeM.addTo(map);
      layersRef.current.push(planeM);

      const distance = Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
      
      animatedPlanes.push({
        marker: planeM,
        pts: pts,
        duration: 2500 + distance * 30, // dynamically scale animation duration based on flight length
        startTime: Date.now() + i * 400 // stagger flights if multiple stops
      });

      // Small direction arrows
      const arrowPositions = [0.25, 0.75];
      arrowPositions.forEach(frac => {
        const idx = Math.floor(pts.length * frac);
        const pt = pts[idx];
        const ptB = pts[Math.max(0, idx - 2)];
        const ptA = pts[Math.min(pts.length - 1, idx + 2)];
        const arrowRot = bearing(ptB[0], ptB[1], ptA[0], ptA[1]) - 90;
        const arrowIcon = L.divIcon({
          html: `<div style="font-size:10px;color:#FF8C00;transform:rotate(${arrowRot}deg);opacity:0.6">›</div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        const arrowM = L.marker(pt, { icon: arrowIcon, interactive: false });
        arrowM.addTo(map);
        layersRef.current.push(arrowM);
      });
    }

    // [CO5: Rendering Optimizations] - High-performance requestAnimationFrame loop to animate plane markers smoothly without lagging the UI thread
    let animationFrameId;
    const animatePlanes = () => {
      const now = Date.now();
      animatedPlanes.forEach(p => {
        let elapsed = (now - p.startTime) % p.duration;
        if (elapsed < 0) elapsed += p.duration; // handle staggered starts
        
        const progress = elapsed / p.duration;
        const exactIdx = progress * (p.pts.length - 1);
        const idx1 = Math.floor(exactIdx);
        const idx2 = Math.min(idx1 + 1, p.pts.length - 1);
        const frac = exactIdx - idx1;
        
        const pt1 = p.pts[idx1];
        const pt2 = p.pts[idx2];
        
        const lat = pt1[0] + (pt2[0] - pt1[0]) * frac;
        const lng = pt1[1] + (pt2[1] - pt1[1]) * frac;
        
        p.marker.setLatLng([lat, lng]);
        
        const el = p.marker.getElement();
        if (el) {
          const planeDiv = el.querySelector('.plane-icon');
          if (planeDiv) {
            const ptB = p.pts[Math.max(0, idx1 - 1)];
            const ptA = p.pts[Math.min(p.pts.length - 1, idx2 + 1)];
            const arcBearing = bearing(ptB[0], ptB[1], ptA[0], ptA[1]);
            const rotation = arcBearing - 90;
            planeDiv.style.transform = `rotate(${rotation}deg)`;
          }
        }
      });
      animationFrameId = requestAnimationFrame(animatePlanes);
    };
    animatePlanes();

    allStops.forEach((stop, i) => {
      bounds.push([stop.lat, stop.lng]);
      const isFirst = i === 0, isLast = i === allStops.length - 1;
      const color = isFirst ? "#22c55e" : isLast ? "#ef4444" : "#FF8C00";
      const circle = L.circleMarker([stop.lat, stop.lng], { radius: isFirst || isLast ? 11 : 9, fillColor: color, color: "#fff", weight: 2.5, fillOpacity: 1, zIndexOffset: 1000 });
      const priceStr = i > 0 ? `<div style="margin-top:6px;font-size:11px;color:#64748B">✈ from ${allStops[i - 1].code}: ~${formatMoney(flightPrice(allStops[i - 1], stop), currency)} · ~${flightDur(allStops[i - 1], stop)}h</div>` : "";
      circle.bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:155px;padding:2px"><div style="font-size:15px;font-weight:800;color:#0F172A;margin-bottom:3px">${stop.flag} ${stop.name}</div><div style="font-size:11px;color:#64748B;margin-bottom:8px">${stop.country} · ${stop.code}</div><div style="font-size:11px;font-weight:700;color:${stop.visaType === "ok" ? "#16a34a" : "#FF8C00"};background:${stop.visaType === "ok" ? "rgba(34,197,94,0.09)" : "rgba(255,140,0,0.09)"};padding:4px 9px;border-radius:7px;display:inline-block">🛂 ${stop.visa}</div>${priceStr}<div style="margin-top:6px;font-size:10px;color:#94A3B8">${isFirst ? "🟢 Departure" : isLast ? "🔴 Arrival" : "🟠 Stopover"}</div></div>`);
      circle.addTo(map);
      layersRef.current.push(circle);

      const lbl = L.marker([stop.lat, stop.lng], {
        icon: L.divIcon({
          html: `<div style="background:rgba(255,255,255,0.96);border:1.5px solid rgba(255,140,0,0.35);padding:2px 8px;border-radius:8px;font-size:10px;font-weight:800;color:#0F172A;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,0.09);margin-top:15px;margin-left:5px">${i + 1}.${stop.code}</div>`,
          className: "",
          iconAnchor: [-5, -10]
        }),
        interactive: false
      });
      lbl.addTo(map);
      layersRef.current.push(lbl);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [44, 44] });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [allStops, currency]);

  function setTile(type){
    if(!window.L||!mapInstance.current) return;
    const L=window.L;
    if(tileRef.current) mapInstance.current.removeLayer(tileRef.current);
    const urls={osm:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",topo:"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"};
    const bounds = L.latLngBounds([[-90, -180], [90, 180]]);
    tileRef.current=L.tileLayer(urls[type]||urls.osm,{attribution:"© OpenStreetMap",maxZoom:17,noWrap:true,bounds:bounds}).addTo(mapInstance.current);
  }

  function handleTileChange(type){
    setTile(type);
    setActiveTile(type);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div><CardIcon icon="🌍"/><div style={{fontSize:15,fontWeight:800,letterSpacing:"-0.025em"}}>Map View</div><div style={{fontSize:12.5,color:"#475569",marginTop:4}}>Real-world route with geodesic flight arcs.</div></div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={()=>handleTileChange("osm")} style={{fontSize:11.5,fontWeight:700,padding:"6px 13px",borderRadius:8,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s",...(activeTile==="osm"?{border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",boxShadow:"0 3px 12px rgba(255,140,0,0.3)"}:{border:"1.5px solid rgba(255,140,0,0.2)",background:"transparent",color:"#FF8C00"})}}>Streets</button>
          <button onClick={()=>handleTileChange("topo")} style={{fontSize:11.5,fontWeight:700,padding:"6px 13px",borderRadius:8,fontFamily:"inherit",cursor:"pointer",transition:"all 0.2s",...(activeTile==="topo"?{border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",boxShadow:"0 3px 12px rgba(255,140,0,0.3)"}:{border:"1.5px solid rgba(255,140,0,0.2)",background:"transparent",color:"#FF8C00"})}}>Terrain</button>
        </div>
      </div>
      <div ref={mapRef} style={{height:340,borderRadius:15,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}/>
    </div>
  );
}
