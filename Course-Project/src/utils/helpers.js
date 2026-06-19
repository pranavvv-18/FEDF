// [CO2: Analytical / Geopolitical Algorithms] - Haversine spherical distance equation
export function haverDist(a, b) {
  const R=6371, r=Math.PI/180;
  const dLat=(b.lat-a.lat)*r, dLng=(b.lng-a.lng)*r;
  const x=Math.sin(dLat/2)**2 + Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}
export function flightPrice(a,b){ return Math.round((haverDist(a,b)*0.115+75)/10)*10; }
export function flightDur(a,b){ return Math.max(1, Math.round(haverDist(a,b)/820+0.8)); }
export function detectCurrency(country, currencies){
  return currencies.find(c=>c.countries.includes(country))||currencies[0];
}
export function formatMoney(usdAmt, curr){
  const val = usdAmt * curr.rate;
  return curr.sym + (val>=1000 ? Math.round(val).toLocaleString() : Math.round(val));
}
export function fmtDate(d){ return d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"; }
export function fmtShort(d){ return d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""; }
export function layoverH(i){ return [2.2,1.1,4.6,1.8,3.3,2.5,1.3,2.1,4.9][i%9]; }

// [CO2: Geodesic Trajectory Modeling] - Custom coordinates generator resolving polar Mercator projections
export function geodesicPts(lat1, lng1, lat2, lng2, n = 50, invert = false) {
  // Generate a smooth 2D parabolic arc to avoid Web Mercator polar distortion
  const pts = [];
  let dLng = lng2 - lng1;
  const dLat = lat2 - lat1;
  const dist = Math.sqrt(dLng * dLng + dLat * dLat);
  
  // Arc height scales with distance. 
  const arcHeight = dist * 0.18; 
  
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const currentLng = lng1 + dLng * f;
    const baseLat = lat1 + dLat * f;
    
    // Bend towards the nearest pole (North if avg lat is >= 0)
    let sign = (lat1 + lat2) >= 0 ? 1 : -1; 
    if (invert) sign *= -1;
    let lat = baseLat + (4 * arcHeight * f * (1 - f) * sign);
    
    // Clamp to valid Web Mercator latitudes
    lat = Math.max(-85, Math.min(85, lat));
    
    pts.push([lat, currentLng]);
  }
  
  // Unwrap longitudes for continuous drawing
  for (let i = 1; i < pts.length; i++) {
    while (pts[i][1] - pts[i - 1][1] > 180) pts[i][1] -= 360;
    while (pts[i][1] - pts[i - 1][1] < -180) pts[i][1] += 360;
  }
  
  return pts;
}
export function bearing(lat1,lng1,lat2,lng2){
  const D2R=Math.PI/180, dL=(lng2-lng1)*D2R;
  return (Math.atan2(Math.sin(dL)*Math.cos(lat2*D2R), Math.cos(lat1*D2R)*Math.sin(lat2*D2R)-Math.sin(lat1*D2R)*Math.cos(lat2*D2R)*Math.cos(dL))*180/Math.PI+360)%360;
}
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DNAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];
