// [CO2: ES6 Modules / Modular Design] - Modular design importing dependencies
import { useState } from "react";
import { MONTHS, DNAMES, fmtDate, fmtShort } from "../../utils/helpers.js";

// [CO3: React Hooks / Props Architecture] - Presenter component receiving callback hooks as props from parent Container
export default function Step1({ dateStart, dateEnd, onPick, onNext }) {
  // [CO3: Controlled UI Patterns] - Step 1 tracks calendars coordinates locally
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [pickingEnd, setPickingEnd] = useState(false);
  const today = new Date(); today.setHours(0,0,0,0);

  function handleDay(d) {
    const dt = new Date(year, month, d);
    if (!dateStart || !pickingEnd) { onPick(dt, null); setPickingEnd(true); }
    else { if (dt <= dateStart) { onPick(dt, null); } else { onPick(dateStart, dt); setPickingEnd(false); } }
  }
  function changeMonth(delta) {
    let m=month+delta, y=year;
    if(m>11){m=0;y++;}else if(m<0){m=11;y--;}
    setMonth(m); setYear(y);
  }

  const first = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const nights = dateStart&&dateEnd ? Math.round((dateEnd-dateStart)/86400000) : 0;

  return (
    <div style={{maxWidth:1180,margin:"0 auto",padding:"44px 40px"}}>
      <div style={{marginBottom:32}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,140,0,0.08)",border:"1px solid rgba(255,140,0,0.18)",padding:"5px 14px",borderRadius:99,fontSize:11,fontWeight:700,color:"#FF8C00",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#FF8C00",animation:"pdot 1.6s infinite",display:"inline-block"}}/>Step 1 of 3
        </span>
        <h2 style={{fontSize:32,fontWeight:800,letterSpacing:"-0.03em",color:"#0F172A",lineHeight:1.12}}>
          When Are You <span style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Travelling?</span>
        </h2>
        <p style={{fontSize:14,color:"#475569",marginTop:8,lineHeight:1.6}}>Select your departure and return dates to get started.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:26,alignItems:"start"}}>
        <div style={{background:"#fff",border:"1px solid rgba(255,140,0,0.14)",borderRadius:20,padding:26,boxShadow:"0 4px 24px rgba(255,100,0,0.07)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={()=>changeMonth(-1)} style={{width:32,height:32,borderRadius:9,border:"1px solid rgba(255,140,0,0.2)",background:"transparent",color:"#FF8C00",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>◀</button>
            <span style={{fontSize:16,fontWeight:800,letterSpacing:"-0.02em"}}>{MONTHS[month]} {year}</span>
            <button onClick={()=>changeMonth(1)} style={{width:32,height:32,borderRadius:9,border:"1px solid rgba(255,140,0,0.2)",background:"transparent",color:"#FF8C00",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>▶</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {DNAMES.map(d=><div key={d} style={{fontSize:10,fontWeight:700,color:"#94A3B8",textAlign:"center",padding:"3px 0"}}>{d}</div>)}
            {Array.from({length:first},(_,i)=><div key={`e${i}`}/>)}
            {Array.from({length:daysInMonth},(_,i)=>{
              const d=i+1, dt=new Date(year,month,d);
              const isPast=dt<today;
              const isS=dateStart&&dt.getTime()===dateStart.getTime();
              const isE=dateEnd&&dt.getTime()===dateEnd.getTime();
              const inR=dateStart&&dateEnd&&dt>dateStart&&dt<dateEnd;
              const isToday=dt.getTime()===today.getTime();
              let bg="transparent",color="#0F172A",br=9,border="none";
              if(isPast){color="rgba(148,163,184,0.4)";}
              else if(isS&&isE){bg="linear-gradient(135deg,#FF8C00,#FF4500)";color="#fff";}
              else if(isS){bg="linear-gradient(135deg,#FF8C00,#FF4500)";color="#fff";br="10px 0 0 10px";}
              else if(isE){bg="linear-gradient(135deg,#FF8C00,#FF4500)";color="#fff";br="0 10px 10px 0";}
              else if(inR){bg="rgba(255,140,0,0.10)";color="#FF8C00";br=0;}
              else if(isToday){border="1.5px solid rgba(255,140,0,0.45)";color="#FF8C00";}
              return (
                <div key={d} onClick={()=>!isPast&&handleDay(d)}
                  style={{aspectRatio:"1",borderRadius:br,fontSize:12.5,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",cursor:isPast?"default":"pointer",background:bg,color,border,transition:"all 0.15s"}}>
                  {d}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[{label:"Departure Date",val:dateStart?dateStart.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}):"—",sub:dateStart?fmtDate(dateStart):"Click a date to start"},
            {label:"Return Date",val:dateEnd?dateEnd.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}):"—",sub:dateEnd?fmtDate(dateEnd):"Click a second date"}
          ].map(item=>(
            <div key={item.label} style={{background:"linear-gradient(135deg,rgba(255,140,0,0.055),rgba(255,69,0,0.025))",border:"1px solid rgba(255,140,0,0.14)",borderRadius:17,padding:"20px 22px"}}>
              <div style={{fontSize:10.5,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{item.label}</div>
              <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.025em"}}>{item.val}</div>
              <div style={{fontSize:12,color:"#475569",marginTop:4}}>{item.sub}</div>
            </div>
          ))}
          <div style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",borderRadius:17,padding:22,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",fontSize:52,opacity:0.12}}>✈</div>
            <div style={{fontSize:10.5,fontWeight:700,color:"rgba(255,255,255,0.72)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Trip Duration</div>
            <div style={{fontSize:42,fontWeight:800,color:"#fff",letterSpacing:"-0.04em"}}>{nights}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.65)"}}>nights away</div>
          </div>
          <div style={{background:"rgba(255,140,0,0.05)",border:"1px dashed rgba(255,140,0,0.24)",borderRadius:13,padding:"14px 16px",fontSize:12,color:"#475569",lineHeight:1.6}}>
            <strong style={{color:"#FF8C00"}}>💡 Tip:</strong> After dates, build your route in Step 2. Stop dates spread automatically across your range.
          </div>
          <button onClick={onNext} disabled={!dateStart||!dateEnd}
            style={{alignSelf:"flex-end",padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",fontSize:13,fontWeight:700,cursor:(!dateStart||!dateEnd)?"not-allowed":"pointer",opacity:(!dateStart||!dateEnd)?0.38:1,boxShadow:"0 4px 18px rgba(255,140,0,0.32)",fontFamily:"inherit"}}>
            Next: Build Route →
          </button>
        </div>
      </div>
    </div>
  );
}
