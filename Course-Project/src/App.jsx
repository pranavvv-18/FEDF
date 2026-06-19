// [CO2: ES6 Modules / Modular Design] - Importing React components and utility modules
import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_CITIES } from "./data/cities.js";
import { CURRENCIES } from "./data/currencies.js";
import { detectCurrency } from "./utils/helpers.js";
import Toast from "./components/ui/Toast.jsx";
import PlaneTransition from "./components/ui/PlaneTransition.jsx";
import Step1 from "./components/steps/Step1.jsx";
import Step2 from "./components/steps/Step2.jsx";
import Step3 from "./components/steps/Step3.jsx";
import LoginPage, { loadSession, clearSession } from "./components/LoginPage.jsx";

const S = {
  body: { fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#FAFAFA",minHeight:"100vh",overflowX:"hidden",color:"#0F172A" },
  nav: { position:"sticky",top:0,zIndex:200,background:"rgba(255,255,255,0.93)",backdropFilter:"blur(28px)",borderBottom:"1px solid rgba(255,140,0,0.10)",padding:"0 40px",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 20px rgba(255,100,0,0.06)" },
};

export default function App() {
  // [CO3: State & Props Architecture] - Defining state hooks for core application flow
  // [CO4: State Management Strategies] - Orchestrator state lifted up to main container component
  const [user, setUser] = useState(loadSession);
  const [showBookings, setShowBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingTrigger, setBookingTrigger] = useState(0);
  const [step, setStep] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const nextStepRef = useRef(1);

  // [CO5: Performance Tuning / Optimization] - useCallback to memoize navigation and avoid redundant child re-renders
  const goTo = useCallback((n) => {
    nextStepRef.current = n;
    setTransitioning(true);
  }, []);
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [tripSrc, setTripSrc] = useState(ALL_CITIES.find(c=>c.code==="JFK"));
  const [tripDst, setTripDst] = useState(ALL_CITIES.find(c=>c.code==="SIN"));
  const [stops, setStops] = useState([]);
  const [passengers, setPassengers] = useState({adults:1,children:0,infants:0});
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [currManual, setCurrManual] = useState(false);
  const [toast, setToast] = useState({msg:"",ico:"✈️",visible:false});
  const toastTimer = useRef(null);

  function handleLogin(session){ setUser(session); }
  function handleLogout(){ clearSession(); setUser(null); }

  // [CO3: Side-Effect Management] - useEffect hook responding to source city updates
  useEffect(()=>{
    if(!currManual){ setCurrency(detectCurrency(tripSrc.country, CURRENCIES)); }
  },[tripSrc, currManual]);

  if(!user) return <LoginPage onLogin={handleLogin} />;

  function showToast(msg,ico="✈️"){
    clearTimeout(toastTimer.current);
    setToast({msg,ico,visible:true});
    toastTimer.current=setTimeout(()=>setToast(t=>({...t,visible:false})),2800);
  }

  function handleSrcChange(city){ setTripSrc(city); showToast(`📍 ${city.name} set as source`,"📍"); }
  function handleDstChange(city){ setTripDst(city); showToast(`📍 ${city.name} set as destination`,"📍"); }
  function handleStopAdd(city){ setStops(prev=>[...prev,city]); showToast(`✈ ${city.name} added`,"✈️"); }
  function handleStopRemove(i){ setStops(prev=>prev.filter((_,idx)=>idx!==i)); showToast("🗑 Stop removed","🗑️"); }
  function handleStopReorder(from,to){ setStops(prev=>{ const arr=[...prev]; [arr[from],arr[to]]=[arr[to],arr[from]]; return arr; }); showToast("🔀 Route reordered","🔀"); }
  function handlePaxChange(key,val){ setPassengers(prev=>({...prev,[key]:val})); }
  function handleCurrencyChange(code,manual=false){
    const c=CURRENCIES.find(x=>x.code===code)||CURRENCIES[0];
    setCurrency(c); if(manual) setCurrManual(true);
    showToast(`💱 ${c.code} (${c.sym})`,"💱");
  }

  function handleLoadTrip(data){
    if(!data) return;
    const src = ALL_CITIES.find(c=>c.code===data.srcCode);
    const dst = ALL_CITIES.find(c=>c.code===data.dstCode);
    if(src) setTripSrc(src);
    if(dst) setTripDst(dst);
    if(data.stopCodes) setStops(data.stopCodes.map(code=>ALL_CITIES.find(c=>c.code===code)).filter(Boolean));
    if(data.dateStart) setDateStart(new Date(data.dateStart));
    if(data.dateEnd) setDateEnd(new Date(data.dateEnd));
    if(data.passengers) setPassengers(data.passengers);
    if(data.currencyCode){
      const c=CURRENCIES.find(x=>x.code===data.currencyCode);
      if(c){ setCurrency(c); setCurrManual(true); }
    }
    goTo(3);
  }

  function getBookings(){ try{ return JSON.parse(localStorage.getItem("tripforge_bookings"))||[]; }catch{ return []; } }

  const navStepStyle = (n) => ({
    display:"flex",alignItems:"center",gap:7,padding:"7px 15px",borderRadius:10,
    fontSize:12.5,fontWeight:700,cursor:"pointer",border:"none",fontFamily:"inherit",
    background:step===n?"rgba(255,140,0,0.06)":"transparent",
    color:step===n?"#0F172A":step>n?"#1E293B":"#94A3B8",
  });

  return (
    <div style={S.body}>
      {/* Orbs */}
      {[
        {t:"-180px",l:"-180px",w:"640px",h:"640px",c:"radial-gradient(circle,rgba(255,140,0,0.14),transparent 68%)",d:"0s"},
        {t:"auto",l:"auto",w:"500px",h:"500px",c:"radial-gradient(circle,rgba(255,69,0,0.10),transparent 68%)",d:"-7s",b:"-140px",r:"-140px"},
        {t:"35%",l:"48%",w:"420px",h:"420px",c:"radial-gradient(circle,rgba(255,165,0,0.11),transparent 68%)",d:"-13s"},
        {t:"15%",l:"auto",w:"320px",h:"320px",c:"radial-gradient(circle,rgba(255,100,0,0.08),transparent 68%)",d:"-4s",r:"5%"},
      ].map((o,i)=>(
        <div key={i} style={{position:"fixed",top:o.t,left:o.l,bottom:o.b||"auto",right:o.r||"auto",width:o.w,height:o.h,borderRadius:"50%",background:o.c,filter:"blur(100px)",pointerEvents:"none",zIndex:0,animation:`orbFloat 20s ease-in-out ${o.d} infinite`}}/>
      ))}

      {/* Nav */}
      <nav style={S.nav}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#FF8C00,#FF4500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,boxShadow:"0 4px 18px rgba(255,140,0,0.40)"}}>✈</div>
          <div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em"}}>
            Trip<span style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Forge</span>
          </div>
        </div>
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          {[[1,"Select Dates"],[2,"Build Route"],[3,"Review Plan"]].map(([n,lbl])=>(
            <span key={n} style={{display:"flex",alignItems:"center",gap:2}}>
              {n>1&&<span style={{color:"rgba(255,140,0,0.25)",fontSize:16,padding:"0 2px"}}>›</span>}
              <button style={navStepStyle(n)} onClick={()=>{ if(n<=step||(n===2&&dateStart)||(n===3&&dateStart)) goTo(n); }}>
                <span style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:step>n?"linear-gradient(135deg,#22c55e,#16a34a)":step===n?"linear-gradient(135deg,#FF8C00,#FF4500)":"rgba(148,163,184,0.18)",color:step>=n?"#fff":"#94A3B8",boxShadow:step===n?"0 2px 10px rgba(255,140,0,0.4)":step>n?"0 2px 8px rgba(34,197,94,0.3)":"none"}}>{n}</span>
                {lbl}
              </button>
            </span>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {step===3 ? (
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowBookings(!showBookings)} style={{padding:"8px 18px",borderRadius:10,border:"1.5px solid rgba(255,140,0,0.28)",background:showBookings?"rgba(255,140,0,0.06)":"transparent",color:"#FF8C00",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:7}}>
                🎫 Recent Bookings
                <span style={{fontSize:10,fontWeight:800,background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",padding:"2px 7px",borderRadius:99,minWidth:18,textAlign:"center"}}>{getBookings().length}</span>
              </button>
              {showBookings && (
                <>
                  <div onClick={()=>setShowBookings(false)} style={{position:"fixed",inset:0,zIndex:299}} />
                  <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,width:380,maxHeight:420,overflowY:"auto",background:"rgba(255,255,255,0.97)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,140,0,0.15)",borderRadius:18,boxShadow:"0 16px 60px rgba(255,100,0,0.15), 0 4px 16px rgba(0,0,0,0.06)",zIndex:300,padding:"18px 20px"}}>
                    <div style={{fontSize:15,fontWeight:800,letterSpacing:"-0.02em",marginBottom:4}}>🎫 Recent Bookings</div>
                    <div style={{fontSize:11.5,color:"#64748B",marginBottom:14}}>Your confirmed flight bookings</div>
                    {getBookings().length===0 ? (
                      <div style={{textAlign:"center",padding:"28px 16px",color:"#94A3B8"}}>
                        <div style={{fontSize:32,marginBottom:8}}>📭</div>
                        <div style={{fontSize:12,fontWeight:600}}>No bookings yet</div>
                        <div style={{fontSize:11,marginTop:4}}>Book a trip to see it here</div>
                      </div>
                    ) : (
                      getBookings().slice(0,8).map(b=>(
                        <div key={b.id} onClick={()=>{setSelectedBooking(b);setShowBookings(false);}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:13,border:"1.5px solid rgba(255,140,0,0.1)",background:"#fff",marginBottom:8,transition:"all 0.2s",cursor:"pointer"}}
                          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,140,0,0.3)";e.currentTarget.style.background="rgba(255,140,0,0.02)";}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,140,0,0.1)";e.currentTarget.style.background="#fff";}}>
                          <div style={{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,rgba(255,140,0,0.12),rgba(255,69,0,0.07))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✈️</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12.5,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.route}</div>
                            <div style={{fontSize:10.5,color:"#94A3B8",marginTop:2}}>{b.airline} · {b.passengers} pax · {b.dates?.split("–")[0]?.trim()}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontSize:13,fontWeight:800,color:"#FF8C00"}}>{b.total}</div>
                              <div style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:5,background:"rgba(34,197,94,0.08)",color:"#16a34a",marginTop:3}}>{b.ref}</div>
                            </div>
                            <div style={{fontSize:14,color:"#94A3B8",flexShrink:0}}>›</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <button onClick={()=>{
              if(step===3){ showToast("💾 Use the Save Current button in the Saved Trips card","💾"); }
              else { setStep(3); showToast("📋 Go to Step 3 to save your trip","📋"); }
            }} style={{padding:"8px 18px",borderRadius:10,border:"1.5px solid rgba(255,140,0,0.28)",background:"transparent",color:"#FF8C00",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Save Trip</button>
          )}
          <button onClick={()=>{
            if(step===1){if(dateStart&&dateEnd) goTo(2); else showToast("📅 Pick dates first!","📅");}
            else if(step===2) goTo(3);
            else setBookingTrigger(t=>t+1);
          }} style={{padding:"9px 22px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(255,140,0,0.32)",fontFamily:"inherit"}}>
            {step===1?"Next: Build Route →":step===2?"Next: Review Plan →":"Book Now 🎫"}
          </button>
          {/* User avatar & logout */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:6}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#FF8C00,#FF4500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",boxShadow:"0 3px 12px rgba(255,140,0,0.30)",cursor:"default",letterSpacing:"-0.02em"}} title={user?.name || "User"}>
              {(user?.name||"U").charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} title="Sign out" style={{padding:"7px 14px",borderRadius:9,border:"1.5px solid rgba(239,68,68,0.22)",background:"rgba(239,68,68,0.04)",color:"#ef4444",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.10)";e.currentTarget.style.borderColor="#ef4444";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.04)";e.currentTarget.style.borderColor="rgba(239,68,68,0.22)";}}
            >Sign Out</button>
          </div>
        </div>
      </nav>

      {/* [CO1: Component-Driven Engineering] - Conditional step rendering representing the Virtual DOM mount orchestration */}
      {/* [CO4: Container-Presenter Design] - App container passing state as props down to Step components */}
      <div style={{position:"relative",zIndex:2}}>
        {step===1&&<Step1 dateStart={dateStart} dateEnd={dateEnd} onPick={(s,e)=>{setDateStart(s);setDateEnd(e);}} onNext={()=>goTo(2)}/>}
        {step===2&&<Step2 tripSrc={tripSrc} tripDst={tripDst} stops={stops} dateStart={dateStart} dateEnd={dateEnd} passengers={passengers}
          onSrcChange={handleSrcChange} onDstChange={handleDstChange} onStopAdd={handleStopAdd} onStopRemove={handleStopRemove} onStopReorder={handleStopReorder}
          onPaxChange={handlePaxChange} onNext={()=>goTo(3)} onBack={()=>goTo(1)} currency={currency}/>}
        {step===3&&<Step3 tripSrc={tripSrc} tripDst={tripDst} stops={stops} dateStart={dateStart} dateEnd={dateEnd}
          passengers={passengers} currency={currency}
          onCurrencyChange={handleCurrencyChange} onPaxChange={handlePaxChange}
          onBack={()=>goTo(2)} showToast={showToast}
          onLoadTrip={handleLoadTrip} bookingTrigger={bookingTrigger}/>}
      </div>

      <Toast msg={toast.msg} ico={toast.ico} visible={toast.visible}/>

      {/* [CO5: Routing Strategies & Animations] - Smooth transitions managed by custom timing triggers */}
      <PlaneTransition
        active={transitioning}
        onDone={()=>{
          setStep(nextStepRef.current);
          setTransitioning(false);
        }}
      />

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div onClick={()=>setSelectedBooking(null)} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.18)",position:"relative"}}>
            {/* Header */}
            <div style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",borderRadius:"24px 24px 0 0",padding:"28px 32px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}} />
              <div style={{position:"absolute",bottom:-30,left:-10,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}} />
              <button onClick={()=>setSelectedBooking(null)} style={{position:"absolute",top:16,right:20,width:34,height:34,borderRadius:11,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",backdropFilter:"blur(8px)"}}>✕</button>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:50,height:50,borderRadius:14,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:"1px solid rgba(255,255,255,0.25)"}}>✈</div>
                <div>
                  <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{selectedBooking.route}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:3}}>{selectedBooking.airline}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,background:"rgba(255,255,255,0.2)",color:"#fff",backdropFilter:"blur(8px)"}}>Confirmed ✓</span>
                <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:8,background:"rgba(255,255,255,0.2)",color:"#fff",backdropFilter:"blur(8px)"}}>{selectedBooking.ref}</span>
              </div>
            </div>

            {/* Body */}
            <div style={{padding:"28px 32px"}}>
              {/* Booking Ref Card */}
              <div style={{background:"rgba(255,140,0,0.04)",border:"1px solid rgba(255,140,0,0.12)",borderRadius:16,padding:"18px 22px",marginBottom:22,textAlign:"center"}}>
                <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>Booking Reference</div>
                <div style={{fontSize:32,fontWeight:800,color:"#FF8C00",letterSpacing:"0.06em"}}>{selectedBooking.ref}</div>
              </div>

              {/* Trip Details Grid */}
              <div style={{fontSize:14,fontWeight:800,letterSpacing:"-0.02em",marginBottom:14}}>✈️ Trip Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
                {[
                  ["📍 Route", selectedBooking.route],
                  ["🛫 Airline", selectedBooking.airline],
                  ["📅 Dates", selectedBooking.dates],
                  ["👥 Passengers", `${selectedBooking.passengers} passenger${selectedBooking.passengers!==1?"s":""}`],
                  ["💳 Payment", (selectedBooking.payMethod||"card").charAt(0).toUpperCase()+(selectedBooking.payMethod||"card").slice(1)],
                  ["📧 Contact", selectedBooking.email || "—"],
                ].map(([label,value])=>(
                  <div key={label} style={{padding:"14px 16px",borderRadius:13,border:"1px solid rgba(255,140,0,0.1)",background:"rgba(255,140,0,0.02)"}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:5}}>{label}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#0F172A",wordBreak:"break-word"}}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Passenger Names */}
              {selectedBooking.paxNames && selectedBooking.paxNames.length > 0 && (
                <div style={{marginBottom:22}}>
                  <div style={{fontSize:14,fontWeight:800,letterSpacing:"-0.02em",marginBottom:12}}>👥 Passengers</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {selectedBooking.paxNames.map((name,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:11,border:"1px solid rgba(255,140,0,0.12)",background:"#fff"}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#FF8C00,#FF4500)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>{name.charAt(0).toUpperCase()}</div>
                        <div style={{fontSize:12.5,fontWeight:600}}>{name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost */}
              <div style={{background:"linear-gradient(135deg,#FF8C00,#FF4500)",borderRadius:16,padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 8px 28px rgba(255,140,0,0.3)",marginBottom:18}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>Total Amount Paid</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",marginTop:2}}>All taxes & fees included</div>
                </div>
                <div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-0.03em"}}>{selectedBooking.total}</div>
              </div>

              {/* Phone & Timestamp */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"#94A3B8",marginBottom:20}}>
                <div>{selectedBooking.phone && `📞 ${selectedBooking.phone}`}</div>
                <div>Booked: {selectedBooking.bookedAt ? new Date(selectedBooking.bookedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}</div>
              </div>

              {/* Features */}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
                {[["✅","Free cancellation 24h"],["🛡️","Insurance included"],["📧","E-ticket sent"],["💳","Secure payment"]].map(([ico,lbl])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#475569",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.12)",padding:"5px 11px",borderRadius:8}}>
                    <span>{ico}</span>{lbl}
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button onClick={()=>setSelectedBooking(null)} style={{width:"100%",padding:"14px 24px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#FF8C00,#FF4500)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",letterSpacing:"-0.01em",boxShadow:"0 8px 28px rgba(255,140,0,0.35)",transition:"all 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
