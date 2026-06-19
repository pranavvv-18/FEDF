export default function Toast({ msg, ico, visible }) {
  return (
    <div style={{
      position:"fixed",bottom:28,right:28,zIndex:9999,
      background:"rgba(255,255,255,0.96)",backdropFilter:"blur(20px)",
      border:"1.5px solid rgba(255,140,0,0.25)",borderRadius:16,
      padding:"14px 20px",boxShadow:"0 10px 40px rgba(255,100,0,0.18)",
      display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,color:"#0F172A",
      transform:visible?"translateY(0) scale(1)":"translateY(70px) scale(0.94)",
      opacity:visible?1:0,transition:"all 0.42s cubic-bezier(0.34,1.56,0.64,1)",pointerEvents:"none"
    }}>
      <span style={{fontSize:18}}>{ico}</span>{msg}
    </div>
  );
}
