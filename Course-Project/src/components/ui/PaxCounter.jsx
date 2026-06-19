// [CO3: Controlled UI Patterns / Props Architecture] - Reusable presenter component implementing controlled inputs patterns
export default function PaxCounter({ label, sub, value, onChange, min=0, max=9 }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#fff",border:"1px solid rgba(255,140,0,0.14)",borderRadius:12}}>
      <div>
        <div style={{fontSize:12,fontWeight:700,color:"#0F172A"}}>{label}</div>
        <div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>{sub}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>onChange(Math.max(min,value-1))} disabled={value<=min}
          style={{width:30,height:30,borderRadius:8,border:"1.5px solid rgba(255,140,0,0.28)",background:"transparent",color:"#FF8C00",fontSize:18,fontWeight:700,cursor:value<=min?"not-allowed":"pointer",opacity:value<=min?0.28:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
        <span style={{fontSize:17,fontWeight:800,minWidth:20,textAlign:"center"}}>{value}</span>
        <button onClick={()=>onChange(Math.min(max,value+1))} disabled={value>=max}
          style={{width:30,height:30,borderRadius:8,border:"1.5px solid rgba(255,140,0,0.28)",background:"transparent",color:"#FF8C00",fontSize:18,fontWeight:700,cursor:value>=max?"not-allowed":"pointer",opacity:value>=max?0.28:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
      </div>
    </div>
  );
}
