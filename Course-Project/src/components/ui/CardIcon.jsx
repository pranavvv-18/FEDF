export default function CardIcon({ icon }) {
  return (
    <div style={{
      width:46,height:46,borderRadius:13,marginBottom:14,
      background:"linear-gradient(135deg,rgba(255,140,0,0.12),rgba(255,69,0,0.06))",
      border:"1px solid rgba(255,140,0,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22
    }}>{icon}</div>
  );
}
