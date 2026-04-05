import { useState, useEffect } from 'react'

const C = {
  bg:'#060B14', panel:'#0C1420', card:'#111C2C', border:'#1A2B40',
  teal:'#0E7C7B', teal2:'#17C4C3', green:'#00E87B', red:'#FF3B5C',
  gold:'#E8B83D', white:'#EDF2F7', muted:'#6B7F99',
}

const COUPON_DATA = [
  { coupon:'2.0%', price:'94-08', chg:'+0-04', yield:'3.42%', spread:'+142' },
  { coupon:'2.5%', price:'96-16', chg:'+0-06', yield:'3.68%', spread:'+128' },
  { coupon:'3.0%', price:'98-02', chg:'+0-03', yield:'3.91%', spread:'+118' },
  { coupon:'4.0%', price:'100-24', chg:'-0-02', yield:'4.12%', spread:'+98' },
  { coupon:'4.5%', price:'101-18', chg:'-0-04', yield:'4.35%', spread:'+87' },
  { coupon:'5.0%', price:'102-08', chg:'+0-08', yield:'4.58%', spread:'+76' },
  { coupon:'5.5%', price:'102-28', chg:'+0-12', yield:'4.81%', spread:'+68' },
  { coupon:'6.0%', price:'103-14', chg:'+0-06', yield:'5.02%', spread:'+61' },
  { coupon:'6.5%', price:'103-30', chg:'+0-02', yield:'5.24%', spread:'+55' },
]

const FEATURES = [
  { icon:'📡', title:'Real-Time MBS Pricing', desc:'UMBS 30-year coupon stack updated throughout the trading day. TBA pricing, yield spreads, and basis point movements.' },
  { icon:'📲', title:'SMS Alert Engine', desc:'Configurable text alerts at 8:00 AM, 11:00 AM, and 2:00 PM AKT. Threshold-based triggers for rapid price moves.' },
  { icon:'📊', title:'Spread-to-Treasury Analysis', desc:'Automated calculation of current coupon spread to 10-year Treasury. Track compression and widening in real time.' },
  { icon:'🔔', title:'Rate Lock Advisory Signals', desc:'AI-generated lock/float recommendations based on MBS price velocity, Treasury curve, and Fed calendar proximity.' },
  { icon:'📈', title:'Historical Price Charts', desc:'30/60/90-day MBS price history with trend overlays. Identify seasonal patterns and rate cycle positioning.' },
  { icon:'🏦', title:'Fed Calendar Integration', desc:'FOMC meeting dates, economic data releases, and Treasury auction schedules mapped against MBS price action.' },
]

const ALERTS = [
  { time:'8:00 AM AKT', label:'Morning Open', desc:'Pre-market MBS levels, overnight Treasury moves, European session impact' },
  { time:'11:00 AM AKT', label:'Midday Update', desc:'Post-economic data reaction, rate sheet price movements, spread changes' },
  { time:'2:00 PM AKT', label:'Afternoon Close', desc:'End-of-day positioning, lock desk cutoff advisory, next-day outlook' },
  { time:'INSTANT', label:'Threshold Alert', desc:'Triggered when MBS price moves ±8/32nds from morning baseline' },
]

export default function MBSAlert() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])

  const S = {
    page: { minHeight:'100vh', background:C.bg, color:C.white, fontFamily:"'SF Mono','JetBrains Mono','Fira Code',monospace" },
    nav: { background:C.panel, borderBottom:`1px solid ${C.border}`, padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 },
    logo: { fontWeight:800, fontSize:18, letterSpacing:'-0.02em' },
    container: { maxWidth:1100, margin:'0 auto', padding:'0 24px' },
    hero: { padding:'100px 24px 60px', textAlign:'center' },
    heroTitle: { fontFamily:"'Syne','Space Grotesk',sans-serif", fontWeight:800, fontSize:'clamp(2.8rem,7vw,5rem)', lineHeight:0.95, letterSpacing:'-0.04em', marginBottom:16 },
    heroSub: { fontSize:16, color:C.muted, maxWidth:560, margin:'0 auto 40px', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" },
    grid: { display:'grid', gap:1, background:C.border, border:`1px solid ${C.border}`, borderRadius:8, overflow:'hidden' },
    section: { padding:'80px 24px' },
    sectionLabel: { fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:C.teal2, marginBottom:12, fontWeight:700 },
    sectionTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'clamp(1.8rem,4vw,2.5rem)', letterSpacing:'-0.03em', marginBottom:8 },
    sectionDesc: { color:C.muted, fontSize:15, maxWidth:520, marginBottom:40, fontFamily:"'DM Sans',sans-serif", lineHeight:1.6 },
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,borderRadius:6,background:`linear-gradient(135deg,${C.green},${C.teal})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>📊</div>
          <div>
            <div style={S.logo}>MBS ALERT</div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:'0.15em'}}>POWERED BY HUIT.AI</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:C.green,boxShadow:`0 0 8px ${C.green}`}}/>
          <span style={{fontSize:10,color:C.green,fontWeight:700}}>{time.toLocaleTimeString()}</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div style={{display:'inline-block',background:`${C.teal}18`,border:`1px solid ${C.teal}40`,borderRadius:50,padding:'6px 18px',fontSize:10,letterSpacing:'0.2em',color:C.teal2,marginBottom:32,textTransform:'uppercase'}}>
          Mortgage-Backed Securities Intelligence
        </div>
        <h1 style={S.heroTitle}>Never Miss a<br/><span style={{color:C.teal2}}>Rate Move</span> Again</h1>
        <p style={S.heroSub}>Real-time UMBS 30-year pricing, spread-to-Treasury analysis, and SMS alerts delivered to your phone 3x daily. Know exactly when to lock and when to float.</p>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="mailto:sales@huit.ai?subject=MBS%20Alert" style={{background:C.teal,color:C.white,padding:'14px 32px',borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:14,border:'none'}}>Get MBS Alerts</a>
          <a href="https://huit.ai#pricing" style={{background:'transparent',color:C.white,padding:'14px 32px',borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:14,border:`1px solid ${C.border}`}}>View Pricing</a>
        </div>
      </section>

      {/* LIVE COUPON STACK */}
      <section style={{...S.section,background:C.panel,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={S.container}>
          <div style={S.sectionLabel}>Live Coupon Stack</div>
          <div style={S.sectionTitle}>UMBS 30-Year TBA Pricing</div>
          <div style={S.sectionDesc}>Current coupon pricing, yield, and spread-to-Treasury for all active UMBS 30-year coupons.</div>
          
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden',fontSize:13}}>
              <thead>
                <tr style={{background:C.card}}>
                  {['Coupon','Price','Change','Yield','Spread to UST'].map(h => (
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',color:C.muted,fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',borderBottom:`1px solid ${C.border}`,fontWeight:700}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUPON_DATA.map((row,i) => (
                  <tr key={i} style={{background:i%2===0?C.bg:C.panel,borderBottom:`1px solid ${C.border}08`}}>
                    <td style={{padding:'10px 16px',fontWeight:700,color:C.white}}>{row.coupon}</td>
                    <td style={{padding:'10px 16px',color:C.teal2,fontWeight:700}}>{row.price}</td>
                    <td style={{padding:'10px 16px',color:row.chg.startsWith('+')?C.green:C.red,fontWeight:600}}>{row.chg}</td>
                    <td style={{padding:'10px 16px',color:C.white}}>{row.yield}</td>
                    <td style={{padding:'10px 16px',color:C.gold}}>{row.spread}bp</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:12,fontSize:10,color:C.muted,textAlign:'right'}}>Sample data — live pricing available with active subscription</div>
        </div>
      </section>

      {/* ALERT SCHEDULE */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={S.sectionLabel}>SMS Alert Schedule</div>
          <div style={S.sectionTitle}>3 Daily Alerts + Threshold Triggers</div>
          <div style={S.sectionDesc}>Automated SMS alerts at key decision points throughout the trading day, plus instant threshold-based notifications.</div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:1,...{background:C.border,border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden'}}}>
            {ALERTS.map((a,i) => (
              <div key={i} style={{background:C.panel,padding:24,display:'flex',flexDirection:'column',gap:8}}>
                <div style={{fontSize:10,fontWeight:700,color:a.time==='INSTANT'?C.red:C.teal2,letterSpacing:'0.15em'}}>{a.time}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:C.white}}>{a.label}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{...S.section,background:C.panel,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
        <div style={S.container}>
          <div style={S.sectionLabel}>Platform Capabilities</div>
          <div style={S.sectionTitle}>Built for Rate Lock Decisions</div>
          <div style={S.sectionDesc}>Everything a mortgage professional needs to make confident lock/float decisions backed by live MBS data.</div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:1,background:C.border,border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden'}}>
            {FEATURES.map((f,i) => (
              <div key={i} style={{background:C.bg,padding:24,display:'flex',flexDirection:'column',gap:8}}>
                <span style={{fontSize:28}}>{f.icon}</span>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:C.white}}>{f.title}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'100px 24px',textAlign:'center'}}>
        <div style={S.container}>
          <div style={S.sectionTitle}>Stop Guessing on Rate Locks</div>
          <p style={{color:C.muted,fontSize:16,maxWidth:480,margin:'0 auto 32px',fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>MBS Alert gives you the same pricing intelligence that Wall Street desks use — delivered to your phone in plain English.</p>
          <a href="https://huit.ai#pricing" style={{display:'inline-block',background:C.teal,color:C.white,padding:'14px 36px',borderRadius:6,textDecoration:'none',fontWeight:700,fontSize:14,border:'none'}}>Subscribe via Huit.AI</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:'24px',textAlign:'center'}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:'0.08em'}}>
          MBS ALERT · POWERED BY HUIT.AI · © 2026 HUIT.AI, INC. · ANCHORAGE, ALASKA
        </div>
      </footer>
    </div>
  )
}
