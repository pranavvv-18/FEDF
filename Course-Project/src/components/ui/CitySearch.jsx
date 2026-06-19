import { useState } from "react";
import { ALL_CITIES } from "../../data/cities.js";

export default function CitySearch({ used, onSelect, placeholder="🔍 Search city or airport…" }) {
  const [q, setQ] = useState("");
  const results = ALL_CITIES.filter(c =>
    !used.includes(c.code) &&
    (q.length < 1 || c.name.toLowerCase().includes(q.toLowerCase()) ||
     c.code.toLowerCase().includes(q.toLowerCase()) ||
     c.country.toLowerCase().includes(q.toLowerCase()))
  ).slice(0, q.length < 1 ? 14 : 12);

  return (
    <div style={{position:"relative"}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"11px 14px",borderRadius:11,border:"1.5px solid rgba(255,140,0,0.2)",background:"#fff",fontSize:13,fontFamily:"inherit",outline:"none",color:"#0F172A"}}/>
      {results.length > 0 && (
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",border:"1.5px solid rgba(255,140,0,0.18)",borderRadius:14,boxShadow:"0 16px 50px rgba(255,100,0,0.14)",zIndex:500,maxHeight:300,overflowY:"auto"}}>
          {results.map(c => (
            <div key={c.code} onMouseDown={()=>{onSelect(c);setQ("");}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,140,0,0.05)",background:"#fff"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,140,0,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <span style={{fontSize:19}}>{c.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{c.code} — {c.name}</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>{c.country} · {c.continent}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:5,background:"rgba(255,140,0,0.08)",color:"#FF8C00"}}>{c.continent}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
