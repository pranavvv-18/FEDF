// [CO2: ES6 Modules / Modular Design] - Importing components and ES6 helper modules
import { useState } from "react";
import CitySearch from "../ui/CitySearch.jsx";
import PaxCounter from "../ui/PaxCounter.jsx";
import { fmtDate, fmtShort, formatMoney, flightPrice, flightDur } from "../../utils/helpers.js";

// [CO4: Lifting State Up / Container-Presenter Design] - Presenter component utilizing states lifted to App
export default function Step2({ tripSrc, tripDst, stops, dateStart, dateEnd, passengers, onSrcChange, onDstChange, onStopAdd, onStopRemove, onStopReorder, onPaxChange, onNext, onBack, currency }) {
  const [searchMode, setSearchMode] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const allStops = [tripSrc, ...stops, tripDst];
  const totalPax = passengers.adults+passengers.children+passengers.infants;
  const payingPax = passengers.adults+passengers.children;

  function getStopDate(i,total){
    if(!dateStart||!dateEnd||total<2) return null;
    const d=new Date(dateStart.getTime()+i*(dateEnd.getTime()-dateStart.getTime())/(total-1));
    return fmtShort(d);
  }
  
  // [CO2: Functional Composition] - Using .reduce() pipelines for calculation modeling
  function totalCostUSD(){return allStops.slice(1).reduce((s,c,i)=>s+flightPrice(allStops[i],c),0)*payingPax;}
  const dur = allStops.slice(1).reduce((s,c,i)=>s+flightDur(allStops[i],c),0);
  const conts = new Set(allStops.map(s=>s.continent)).size;

  function EndpointCard({city,label,dotColor,onChangeClick}){
    const date=label==="Source"?getStopDate(0,allStops.length):getStopDate(allStops.length-1,allStops.length);
    return (
      <div style={{background:"#fff",border:"1.5px solid rgba(255,140,0,0.16)",borderRadius:16,padding:"18px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:dotColor,boxShadow:`0 0 0 3px ${dotColor}30`}}/>
          <span style={{fontSize:10,fontWeight:800,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>{city.flag}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"-0.02em"}}>{city.code} — {city.name}</div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{city.country} · {city.continent}</div>
          </div>
          <button onClick={onChangeClick} style={{fontSize:11,fontWeight:700,color:"#FF8C00",background:"rgba(255,140,0,0.09)",border:"1px solid rgba(255,140,0,0.2)",padding:"5px 11px",borderRadius:7,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Change ↗</button>
        </div>
        {date&&<div style={{marginTop:9,fontSize:11,fontWeight:700,color:"#FF8C00",background:"rgba(255,140,0,0.08)",padding:"2px 10px",borderRadius:6,display:"inline-block"}}>{label==="Source"?"📅 Depart ":"🏁 Arrive "}{date}</div>}
      </div>
    );
  }

  function ConnLine({from,to}){
    const p=flightPrice(from,to), d=flightDur(from,to);
    return (
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 22px"}}>
        <div style={{flex:1,height:1.5,background:"repeating-linear-gradient(90deg,rgba(255,140,0,0.5) 0,rgba(255,140,0,0.5) 5px,transparent 5px,transparent 10px)"}}/>
        <span style={{fontSize:11,fontWeight:700,color:"#475569",background:"rgba(255,140,0,0.06)",border:"1px solid rgba(255,140,0,0.14)",padding:"3px 10px",borderRadius:6,whiteSpace:"nowrap"}}>✈ ~{d}h · {formatMoney(p,currency)}</span>
        <div style={{flex:1,height:1.5,background:"repeating-linear-gradient(90deg,rgba(255,140,0,0.5) 0,rgba(255,140,0,0.5) 5px,transparent 5px,transparent 10px)"}}/>
      </div>
    );
  }

  const usedCodes = allStops.map(s=>s.code);

  return (
    <div style={{maxWidth:1180,margin:"0 auto",padding:"44px 40px"}}>
      <div style={{marginBottom:32}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,140,0,0.08)",border:"1px solid rgba(255,140,0,0.18)",padding:"5px 14px",borderRadius:99,fontSize:11,fontWeight:700,color:"#FF8C00",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#FF8C00",display:"inline-block"}}/>Step 2 of 3
        </span>
        <h2 style={{fontSize:32,fontWeight:800,letterSpacing:"-0.03em",color:"#0F172A",lineHeight:1.12}}>Build Your <span style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Route</span></h2>
        <p style={{fontSize:14,color:"#475569",marginTop:8}}>Set source and destination, add stops. Drag to reorder.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 310px",gap:22,alignItems:"start"}}>
        <div>
          {searchMode&&(
            <div style={{background:"#fff",border:"1.5px solid rgba(255,140,0,0.2)",borderRadius:16,padding:18,marginBottom:16,boxShadow:"0 8px 30px rgba(255,100,0,0.12)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:800}}>{{src:"Change Source",dst:"Change Destination",stop:"Add Stop"}[searchMode]}</div>
                <button onClick={()=>setSearchMode(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#94A3B8"}}>✕</button>
              </div>
              <CitySearch used={searchMode==="stop"?usedCodes:usedCodes.filter(c=>searchMode==="src"?c!==tripSrc.code:c!==tripDst.code)} onSelect={c=>{
                if(searchMode==="src") onSrcChange(c);
                else if(searchMode==="dst") onDstChange(c);
                else onStopAdd(c);
                setSearchMode(null);
              }}/>
            </div>
          )}
          <EndpointCard city={tripSrc} label="Source" dotColor="#22c55e" onChangeClick={()=>setSearchMode("src")}/>
          {stops.length===0
            ? <ConnLine from={tripSrc} to={tripDst}/>
            : <>
                <ConnLine from={tripSrc} to={stops[0]}/>
                {stops.map((stop,i)=>(
                  <div key={stop.code}>
                    <div draggable onDragStart={()=>setDragIdx(i)} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragIdx!==null&&dragIdx!==i){onStopReorder(dragIdx,i);setDragIdx(null);}}} onDragEnd={()=>setDragIdx(null)}
                      style={{display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1.5px solid ${dragIdx===i?"#FF8C00":"rgba(255,140,0,0.14)"}`,borderRadius:14,padding:"14px 18px",cursor:"grab",opacity:dragIdx===i?0.5:1,transition:"all 0.2s"}}>
                      <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>S{i+1}</div>
                      <span style={{fontSize:22}}>{stop.flag}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:800}}>{stop.code} — {stop.name}</div>
                        <div style={{fontSize:11,color:"#94A3B8"}}>{stop.country} · {stop.continent}</div>
                      </div>
                      {getStopDate(i+1,allStops.length)&&<div style={{fontSize:11,fontWeight:700,color:"#FF8C00",background:"rgba(255,140,0,0.08)",padding:"2px 8px",borderRadius:6}}>{getStopDate(i+1,allStops.length)}</div>}
                      <button onClick={()=>onStopRemove(i)} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(239,68,68,0.22)",background:"rgba(239,68,68,0.05)",color:"#ef4444",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
                    </div>
                    {i<stops.length-1&&<ConnLine from={stop} to={stops[i+1]}/>}
                  </div>
                ))}
                <ConnLine from={stops[stops.length-1]} to={tripDst}/>
              </>
          }
          <div onClick={()=>setSearchMode("stop")} style={{display:"flex",alignItems:"center",gap:12,border:"1.5px dashed rgba(255,140,0,0.28)",borderRadius:13,padding:"13px 18px",cursor:"pointer",margin:"10px 0",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,140,0,0.03)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,rgba(255,140,0,0.13),rgba(255,69,0,0.07))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>＋</div>
            <div><div style={{fontSize:13,fontWeight:700,color:"#FF8C00"}}>Add Intermediate Stop</div><div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>Click to search and add a transit city</div></div>
          </div>
          <EndpointCard city={tripDst} label="Destination" dotColor="#ef4444" onChangeClick={()=>setSearchMode("dst")}/>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:20}}>
            <button onClick={onBack} style={{padding:"9px 18px",borderRadius:10,border:"1.5px solid rgba(255,140,0,0.28)",background:"transparent",color:"#FF8C00",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
            <button onClick={onNext} style={{padding:"9px 22px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(255,140,0,0.32)",fontFamily:"inherit"}}>Next: Review Plan →</button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {title:"📅 Trip Dates",rows:[{l:"Departure",v:fmtDate(dateStart)},{l:"Return",v:fmtDate(dateEnd)},{l:"Nights",v:dateStart&&dateEnd?Math.round((dateEnd-dateStart)/86400000)+" nights":"—"}]},
            {title:"🗺️ Route Summary",rows:[{l:"Source",v:`${tripSrc.flag} ${tripSrc.code}`},{l:"Stops",v:stops.length},{l:"Destination",v:`${tripDst.flag} ${tripDst.code}`},{l:"Total Legs",v:(allStops.length-1)+" flights"},{l:"Continents",v:conts},{l:"Est. Cost",v:formatMoney(totalCostUSD(),currency)+(payingPax>1?` (×${payingPax})`:"")}]},
          ].map(card=>(
            <div key={card.title} style={{background:"#fff",border:"1px solid rgba(255,140,0,0.12)",borderRadius:17,padding:"19px 20px",boxShadow:"0 2px 12px rgba(255,100,0,0.05)"}}>
              <div style={{fontSize:13,fontWeight:800,marginBottom:13}}>{card.title}</div>
              {card.rows.map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9,fontSize:12.5}}>
                  <span style={{color:"#475569"}}>{r.l}</span>
                  <span style={{fontWeight:700,color:"#0F172A"}}>{r.v}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{background:"#fff",border:"1px solid rgba(255,140,0,0.12)",borderRadius:17,padding:"19px 20px"}}>
            <div style={{fontSize:13,fontWeight:800,marginBottom:12}}>👥 Passengers</div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <PaxCounter label="Adults" sub="12+ years" value={passengers.adults} onChange={v=>onPaxChange("adults",v)} min={1}/>
              <PaxCounter label="Children" sub="2–11 years" value={passengers.children} onChange={v=>onPaxChange("children",v)}/>
              <PaxCounter label="Infants" sub="Under 2" value={passengers.infants} onChange={v=>onPaxChange("infants",Math.min(v,passengers.adults))}/>
            </div>
            <div style={{marginTop:12,padding:"10px 14px",background:"linear-gradient(135deg,#FF8C00,#FF4500)",borderRadius:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.82)"}}>Total</span>
              <span style={{fontSize:18,fontWeight:800,color:"#fff"}}>{totalPax}</span>
            </div>
            <p style={{fontSize:11,color:"#94A3B8",marginTop:10,lineHeight:1.5}}>Cost multiplied by paying passengers (adults + children). Infants travel free.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
