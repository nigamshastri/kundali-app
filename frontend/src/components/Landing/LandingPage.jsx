import { useEffect, useRef } from "react";

export default function LandingPage({ onLogin, onRegister }) {
  const bgRef = useRef(null);
  const mandalaRef = useRef(null);
  const rashiRef = useRef(null);

  useEffect(() => {
    const c = bgRef.current; if (!c) return;
    const cx = c.getContext("2d");
    let W, H, stars = [], shoots = [], raf;
    const resize = () => {
      W = c.width = window.innerWidth; H = c.height = window.innerHeight;
      stars = Array.from({ length: 200 }, () => ({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.2, t: Math.random()*Math.PI*2, ts: 0.004+Math.random()*0.015, gold: Math.random()>0.88 }));
    };
    const si = setInterval(() => { if(Math.random()>0.5)return; shoots.push({x:Math.random()*W*0.65,y:Math.random()*H*0.4,vx:4+Math.random()*7,vy:2+Math.random()*4,life:1}); }, 4000);
    const draw = () => {
      cx.clearRect(0,0,W,H);
      const vg=cx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.75);
      vg.addColorStop(0,"rgba(10,4,30,0)");vg.addColorStop(1,"rgba(2,1,8,0.45)");
      cx.fillStyle=vg;cx.fillRect(0,0,W,H);
      stars.forEach(s=>{s.t+=s.ts;const a=0.2+0.5*Math.abs(Math.sin(s.t));cx.beginPath();cx.arc(s.x,s.y,s.r*(0.7+0.3*Math.abs(Math.sin(s.t*1.3))),0,Math.PI*2);cx.fillStyle=s.gold?`rgba(212,160,23,${a})`:`rgba(255,248,240,${a*0.6})`;cx.fill();if(s.r>1.1){cx.beginPath();cx.arc(s.x,s.y,s.r*3.5,0,Math.PI*2);cx.fillStyle=s.gold?`rgba(212,160,23,${a*0.03})`:`rgba(255,248,240,${a*0.015})`;cx.fill();}});
      shoots=shoots.filter(s=>{s.x+=s.vx;s.y+=s.vy;s.life-=0.018;if(s.life<=0)return false;const g=cx.createLinearGradient(s.x,s.y,s.x-s.vx*7,s.y-s.vy*7);g.addColorStop(0,`rgba(255,255,200,${s.life})`);g.addColorStop(1,"rgba(255,255,200,0)");cx.strokeStyle=g;cx.lineWidth=1.2;cx.beginPath();cx.moveTo(s.x,s.y);cx.lineTo(s.x-s.vx*7,s.y-s.vy*7);cx.stroke();return true;});
      raf=requestAnimationFrame(draw);
    };
    resize();draw();window.addEventListener("resize",resize);
    return ()=>{cancelAnimationFrame(raf);clearInterval(si);window.removeEventListener("resize",resize);};
  },[]);

  useEffect(()=>{
    const c=mandalaRef.current;if(!c)return;
    const cx=c.getContext("2d");const S=400,CX=200,CY=200;let a=0,raf;
    const planets=[{r:145,sp:0.004,col:"#ffcc00",s:5},{r:130,sp:-0.006,col:"#aaaaff",s:4},{r:140,sp:0.008,col:"#ff5555",s:4},{r:148,sp:-0.005,col:"#88ff88",s:3.5},{r:135,sp:0.003,col:"#ffaa44",s:6},{r:142,sp:-0.007,col:"#ffaaff",s:4},{r:155,sp:0.002,col:"#cccccc",s:4.5},{r:128,sp:0.01,col:"#9966ff",s:3.5},{r:133,sp:-0.009,col:"#ff66aa",s:3.5}];
    const draw=()=>{
      cx.clearRect(0,0,S,S);
      for(let i=0;i<8;i++){const ang=a+i*Math.PI/4;cx.save();cx.translate(CX,CY);cx.rotate(ang);cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(22,-55,55,-90,0,-130);cx.bezierCurveTo(-55,-90,-22,-55,0,0);cx.fillStyle=`rgba(212,160,23,${0.05+0.03*Math.sin(a*2+i)})`;cx.fill();cx.strokeStyle=`rgba(212,160,23,${0.18+0.08*Math.sin(a*3+i)})`;cx.lineWidth=0.6;cx.stroke();cx.restore();}
      for(let i=0;i<6;i++){const ang=-a*0.8+i*Math.PI/3;cx.save();cx.translate(CX,CY);cx.rotate(ang);cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(15,-40,40,-65,0,-95);cx.bezierCurveTo(-40,-65,-15,-40,0,0);cx.fillStyle=`rgba(255,107,26,${0.04+0.025*Math.sin(a*4+i)})`;cx.fill();cx.strokeStyle="rgba(255,107,26,0.15)";cx.lineWidth=0.5;cx.stroke();cx.restore();}
      [[0,-110,95,55,-95,55],[0,100,-87,-50,87,-50],[0,-80,69,40,-69,40]].forEach((t,i)=>{cx.save();cx.translate(CX,CY);cx.rotate(a*(i%2?-0.3:0.3));cx.beginPath();cx.moveTo(t[0],t[1]);cx.lineTo(t[2],t[3]);cx.lineTo(t[4],t[5]);cx.closePath();cx.strokeStyle=`rgba(212,160,23,${0.2-i*0.04})`;cx.lineWidth=0.7;cx.stroke();cx.fillStyle="rgba(212,160,23,0.03)";cx.fill();cx.restore();});
      [160,120,80,45].forEach((r,i)=>{cx.beginPath();cx.arc(CX,CY,r,0,Math.PI*2);cx.strokeStyle=`rgba(212,160,23,${0.12+i*0.04})`;cx.lineWidth=0.6;cx.stroke();});
      planets.forEach((p,i)=>{const pa=a*p.sp*200+i*(Math.PI*2/9);const px=CX+Math.cos(pa)*p.r,py=CY+Math.sin(pa)*p.r;const g=cx.createRadialGradient(px,py,0,px,py,p.s*2.5);g.addColorStop(0,p.col);g.addColorStop(1,"rgba(0,0,0,0)");cx.fillStyle=g;cx.beginPath();cx.arc(px,py,p.s*2.5,0,Math.PI*2);cx.fill();cx.fillStyle=p.col;cx.beginPath();cx.arc(px,py,p.s,0,Math.PI*2);cx.fill();});
      const bg=cx.createRadialGradient(CX,CY,0,CX,CY,20);bg.addColorStop(0,"rgba(255,220,100,0.9)");bg.addColorStop(0.5,"rgba(212,160,23,0.6)");bg.addColorStop(1,"rgba(212,160,23,0)");cx.fillStyle=bg;cx.beginPath();cx.arc(CX,CY,20,0,Math.PI*2);cx.fill();
      a+=0.004;raf=requestAnimationFrame(draw);
    };draw();return()=>cancelAnimationFrame(raf);
  },[]);

  useEffect(()=>{
    const c=rashiRef.current;if(!c)return;
    const cx=c.getContext("2d");const S=500,CX=250,CY=250;let a=0,raf;
    const rashis=[{g:"મેષ",s:"♈",c:"#ff5555"},{g:"વૃષભ",s:"♉",c:"#88cc44"},{g:"મિથુન",s:"♊",c:"#ffcc22"},{g:"કર્ક",s:"♋",c:"#aaaaff"},{g:"સિંહ",s:"♌",c:"#ffaa22"},{g:"કન્યા",s:"♍",c:"#88ff88"},{g:"તુલા",s:"♎",c:"#ffaaff"},{g:"વૃશ્ચિક",s:"♏",c:"#ff4466"},{g:"ધન",s:"♐",c:"#ff8833"},{g:"મકર",s:"♑",c:"#44aaff"},{g:"કુંભ",s:"♒",c:"#99aaff"},{g:"મીન",s:"♓",c:"#44ddcc"}];
    const draw=()=>{
      cx.clearRect(0,0,S,S);const sl=Math.PI*2/12;
      rashis.forEach((r,i)=>{const ang=a+i*sl,ang2=ang+sl,mid=ang+sl/2;cx.beginPath();cx.moveTo(CX,CY);cx.arc(CX,CY,210,ang,ang2);cx.closePath();cx.fillStyle=`${r.c}14`;cx.fill();cx.strokeStyle="rgba(212,160,23,0.15)";cx.lineWidth=0.8;cx.stroke();cx.beginPath();cx.moveTo(CX,CY);cx.arc(CX,CY,130,ang,ang2);cx.closePath();cx.fillStyle=`${r.c}07`;cx.fill();const sx=CX+Math.cos(mid)*178,sy=CY+Math.sin(mid)*178;cx.font="bold 16px sans-serif";cx.fillStyle=r.c;cx.textAlign="center";cx.textBaseline="middle";cx.fillText(r.s,sx,sy);cx.font="9px sans-serif";cx.fillStyle="rgba(255,248,240,0.45)";cx.fillText(r.g,CX+Math.cos(mid)*155,CY+Math.sin(mid)*155);cx.beginPath();cx.moveTo(CX+Math.cos(ang)*55,CY+Math.sin(ang)*55);cx.lineTo(CX+Math.cos(ang)*210,CY+Math.sin(ang)*210);cx.strokeStyle="rgba(212,160,23,0.12)";cx.lineWidth=0.5;cx.stroke();});
      [210,175,130,90,55].forEach((r,i)=>{cx.beginPath();cx.arc(CX,CY,r,0,Math.PI*2);cx.strokeStyle=`rgba(212,160,23,${0.1+i*0.04})`;cx.lineWidth=0.5+i*0.1;cx.stroke();});
      for(let i=0;i<24;i++){const ang=a*0.4+i*Math.PI/12;cx.beginPath();cx.arc(CX+Math.cos(ang)*193,CY+Math.sin(ang)*193,1.2,0,Math.PI*2);cx.fillStyle="rgba(212,160,23,0.35)";cx.fill();}
      const g=cx.createRadialGradient(CX,CY,0,CX,CY,48);g.addColorStop(0,"rgba(212,160,23,0.12)");g.addColorStop(1,"rgba(212,160,23,0)");cx.fillStyle=g;cx.beginPath();cx.arc(CX,CY,48,0,Math.PI*2);cx.fill();cx.beginPath();cx.arc(CX,CY,48,0,Math.PI*2);cx.strokeStyle="rgba(212,160,23,0.25)";cx.lineWidth=0.8;cx.stroke();cx.font="22px serif";cx.fillStyle="rgba(212,160,23,0.6)";cx.textAlign="center";cx.textBaseline="middle";cx.fillText("🕉️",CX,CY);
      a+=0.0015;raf=requestAnimationFrame(draw);
    };draw();return()=>cancelAnimationFrame(raf);
  },[]);

  const S = {
    root:{background:"#04020e",color:"#fff8f0",fontFamily:"'Georgia',serif",overflowX:"hidden",minHeight:"100vh"},
    bgCanvas:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"},
    hero:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"2rem",position:"relative",zIndex:10},
    om:{fontSize:"clamp(2.5rem,5vw,4rem)",marginBottom:"1.5rem",lineHeight:1},
    mandalaWrap:{width:"min(260px,70vw)",height:"min(260px,70vw)",margin:"0 auto 2rem"},
    mandalaCanvas:{width:"100%",height:"100%"},
    heroTitle:{fontSize:"clamp(1.8rem,5vw,3.2rem)",color:"#d4a017",letterSpacing:"0.04em",textShadow:"0 0 40px rgba(212,160,23,0.35)",marginBottom:"0.3rem"},
    heroEn:{fontSize:"clamp(0.65rem,1.5vw,0.8rem)",color:"rgba(255,248,240,0.3)",letterSpacing:"0.2em",fontFamily:"sans-serif",textTransform:"uppercase",marginBottom:"1rem"},
    tagline:{fontSize:"clamp(0.88rem,2vw,1.05rem)",color:"rgba(255,248,240,0.55)",fontStyle:"italic",marginBottom:"2.5rem",maxWidth:"380px",lineHeight:1.85},
    btns:{display:"flex",gap:"0.85rem",justifyContent:"center",flexWrap:"wrap"},
    btnP:{padding:"0.75rem 1.6rem",borderRadius:"50px",fontSize:"clamp(0.82rem,2vw,0.92rem)",cursor:"pointer",fontFamily:"'Georgia',serif",letterSpacing:"0.03em",background:"linear-gradient(135deg,#7a1515,#c84000,#c49010)",border:"none",color:"#fff",boxShadow:"0 4px 20px rgba(200,80,0,0.35)",transition:"all 0.3s",minWidth:"130px"},
    btnS:{padding:"0.75rem 1.6rem",borderRadius:"50px",fontSize:"clamp(0.82rem,2vw,0.92rem)",cursor:"pointer",fontFamily:"'Georgia',serif",background:"transparent",border:"1px solid rgba(212,160,23,0.4)",color:"#d4a017",transition:"all 0.3s",minWidth:"130px"},
    scrollHint:{position:"absolute",bottom:"1.5rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",color:"rgba(255,248,240,0.2)",fontSize:"0.62rem",fontFamily:"sans-serif"},
    scrollArr:{width:"13px",height:"13px",borderRight:"1px solid rgba(212,160,23,0.3)",borderBottom:"1px solid rgba(212,160,23,0.3)",transform:"rotate(45deg)"},
    sec:{padding:"4rem 1.2rem",maxWidth:"1000px",margin:"0 auto",position:"relative",zIndex:10},
    secTitle:{textAlign:"center",fontSize:"clamp(1.2rem,3vw,1.8rem)",color:"#d4a017",marginBottom:"0.3rem"},
    secSub:{textAlign:"center",fontSize:"0.65rem",color:"rgba(255,248,240,0.28)",marginBottom:"2.5rem",fontFamily:"sans-serif",letterSpacing:"0.12em",textTransform:"uppercase"},
    divider:{height:"1px",background:"linear-gradient(90deg,transparent,rgba(212,160,23,0.18),transparent)",margin:"0 1.5rem"},
    statsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"0.85rem",marginBottom:"3.5rem"},
    statCard:{textAlign:"center",padding:"1.2rem 0.7rem",background:"rgba(8,4,18,0.85)",border:"1px solid rgba(212,160,23,0.12)",borderRadius:"14px",display:"flex",flexDirection:"column",gap:"0.25rem"},
    statNum:{fontSize:"clamp(1.4rem,3vw,1.9rem)",fontWeight:700,color:"#d4a017",lineHeight:1},
    statLabel:{fontSize:"0.65rem",color:"rgba(255,248,240,0.32)",fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:"0.05em"},
    rashiWrap:{width:"min(360px,88vw)",height:"min(360px,88vw)",margin:"0 auto"},
    rashiCanvas:{width:"100%",height:"100%"},
    planetGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(85px,1fr))",gap:"0.75rem"},
    planetCard:{background:"rgba(8,4,18,0.85)",border:"1px solid rgba(212,160,23,0.12)",borderRadius:"13px",padding:"0.9rem 0.5rem",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.2rem",transition:"all 0.3s"},
    pcSym:{fontSize:"1.5rem"},
    pcEn:{fontSize:"0.7rem",fontWeight:700,fontFamily:"sans-serif"},
    pcGu:{fontSize:"0.62rem",color:"rgba(255,248,240,0.32)",fontFamily:"sans-serif"},
    featGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"1rem"},
    featCard:{background:"rgba(8,4,18,0.9)",border:"1px solid rgba(212,160,23,0.1)",borderRadius:"16px",padding:"1.5rem",transition:"all 0.35s"},
    featIcon:{fontSize:"2rem",display:"block",marginBottom:"0.75rem"},
    featTitle:{fontSize:"0.95rem",color:"#d4a017",marginBottom:"0.35rem",fontFamily:"'Georgia',serif"},
    featDesc:{fontSize:"0.76rem",color:"rgba(255,248,240,0.42)",lineHeight:1.7,fontFamily:"sans-serif"},
    doshaGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.95rem"},
    doshaCard:{borderRadius:"15px",padding:"1.5rem",textAlign:"center",border:"1px solid",transition:"all 0.3s",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.45rem"},
    doshaIcon:{fontSize:"2.2rem"},
    doshaName:{fontSize:"0.92rem",fontWeight:700,fontFamily:"'Georgia',serif"},
    doshaDesc:{fontSize:"0.73rem",color:"rgba(255,248,240,0.42)",lineHeight:1.65,fontFamily:"sans-serif"},
    testGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"},
    testCard:{background:"rgba(8,4,18,0.88)",border:"1px solid rgba(212,160,23,0.1)",borderRadius:"15px",padding:"1.3rem",display:"flex",flexDirection:"column",gap:"0.45rem"},
    testStars:{color:"#d4a017",fontSize:"0.78rem"},
    testText:{fontSize:"0.8rem",color:"rgba(255,248,240,0.58)",lineHeight:1.75,fontStyle:"italic",flex:1},
    testName:{fontSize:"0.8rem",fontWeight:700,color:"#d4a017"},
    testCity:{fontSize:"0.68rem",color:"rgba(255,248,240,0.28)",fontFamily:"sans-serif"},
    ctaSec:{padding:"5rem 1.5rem",textAlign:"center",position:"relative",zIndex:10},
    ctaTitle:{fontSize:"clamp(1.3rem,3vw,1.9rem)",color:"#d4a017",marginBottom:"0.75rem",marginTop:"1rem"},
    ctaDesc:{fontSize:"clamp(0.82rem,2vw,0.95rem)",color:"rgba(255,248,240,0.48)",marginBottom:"2rem",maxWidth:"380px",margin:"0 auto 2rem",lineHeight:1.75,fontFamily:"sans-serif"},
    footer:{textAlign:"center",padding:"2rem 1.5rem",color:"rgba(255,248,240,0.18)",fontSize:"0.75rem",fontFamily:"sans-serif",position:"relative",zIndex:10},
    footerOm:{fontSize:"1.6rem",marginBottom:"0.35rem",opacity:0.2},
  };

  return (
    <div style={S.root}>
      <canvas ref={bgRef} style={S.bgCanvas} aria-hidden="true" />
      <section style={S.hero} aria-label="Hero">
        <div style={S.om} aria-hidden="true">🕉️</div>
        <div style={S.mandalaWrap} aria-hidden="true" role="img" aria-label="Animated sacred mandala">
          <canvas ref={mandalaRef} width={400} height={400} style={S.mandalaCanvas} />
        </div>
        <h1 style={S.heroTitle}>Nigmayu Jyotish</h1>
        <p style={S.heroEn}>Vedic Astrology · Ahmedabad · Since 1984</p>
        <p style={S.tagline}>"Life guided by sacred wisdom —<br />let the stars illuminate your path."</p>
        <div style={S.btns} role="group" aria-label="Actions">
          <button style={S.btnP} onClick={onRegister}>🔯 કુંડળી બનાવો</button>
          <button style={S.btnS} onClick={onLogin}>🔑 લૉગ ઇન</button>
        </div>
        <div style={S.scrollHint} aria-hidden="true"><div style={S.scrollArr}/><span>scroll</span></div>
      </section>
      <div style={S.divider} />
      <section style={S.sec} aria-label="Stats and Rashi Wheel">
        <div style={S.statsGrid}>
          {[["5000+","Kundalis Made"],["40+","Years Experience"],["12+","States Served"],["99%","Satisfied"]].map(([n,l])=>(
            <div key={l} style={S.statCard}><span style={S.statNum}>{n}</span><span style={S.statLabel}>{l}</span></div>
          ))}
        </div>
        <h2 style={S.secTitle}>રાશિ ચક્ર</h2>
        <p style={S.secSub}>The Zodiac Wheel · 12 Houses of Destiny</p>
        <div style={S.rashiWrap} role="img" aria-label="Rashi zodiac wheel">
          <canvas ref={rashiRef} width={500} height={500} style={S.rashiCanvas} />
        </div>
      </section>
      <div style={S.divider} />
      <section style={S.sec} aria-label="Navagraha Nine Planets">
        <h2 style={S.secTitle}>नवग्रह · Navagraha</h2>
        <p style={S.secSub}>Nine Planets · Nine Destinies</p>
        <div style={S.planetGrid} role="list">
          {[{sym:"☀️",en:"Sun",gu:"સૂર્ય",col:"#ffcc00"},{sym:"🌙",en:"Moon",gu:"ચંદ્ર",col:"#aaaaff"},{sym:"♂",en:"Mars",gu:"મંગળ",col:"#ff5555"},{sym:"☿",en:"Mercury",gu:"બુધ",col:"#88ff88"},{sym:"♃",en:"Jupiter",gu:"ગુરુ",col:"#ffaa44"},{sym:"♀",en:"Venus",gu:"શુક્ર",col:"#ffaaff"},{sym:"♄",en:"Saturn",gu:"શનિ",col:"#aaaaaa"},{sym:"☊",en:"Rahu",gu:"રાહુ",col:"#9966ff"},{sym:"☋",en:"Ketu",gu:"કેતુ",col:"#ff66aa"}].map(p=>(
            <div key={p.en} style={S.planetCard} role="listitem" aria-label={`${p.en} ${p.gu}`}>
              <span style={S.pcSym} aria-hidden="true">{p.sym}</span>
              <div style={{...S.pcEn,color:p.col}}>{p.en}</div>
              <div style={S.pcGu}>{p.gu}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={S.divider} />
      <section style={S.sec} aria-label="Services">
        <h2 style={S.secTitle}>Our Services</h2>
        <p style={S.secSub}>Complete Vedic Guidance</p>
        <div style={S.featGrid}>
          {[{icon:"🔯",title:"Kundali Vishleshan",desc:"Complete birth chart with planetary positions, houses, dashas and yogas using Lahiri Ayanamsa."},{icon:"💍",title:"Vivah Muhurta",desc:"Auspicious wedding timing with full kundali milan and navamsa compatibility analysis."},{icon:"🏠",title:"Vastu Shastra",desc:"Property direction aligned with cosmic energies for prosperity, health and harmony."},{icon:"⏳",title:"Muhurta Chayan",desc:"Electional astrology for new ventures, travel, naming ceremonies and life decisions."},{icon:"🪐",title:"Graha Shanti",desc:"Planetary remedies, mantras, gemstone recommendations and fasting rituals."},{icon:"👶",title:"Naam Karan",desc:"Auspicious name selection based on birth nakshatra, rashi and numerological principles."}].map(f=>(
            <article key={f.title} style={S.featCard}>
              <span style={S.featIcon} aria-hidden="true">{f.icon}</span>
              <h3 style={S.featTitle}>{f.title}</h3>
              <p style={S.featDesc}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <div style={S.divider} />
      <section style={S.sec} aria-label="Dosha Analysis">
        <h2 style={S.secTitle}>Dosha Analysis</h2>
        <p style={S.secSub}>Detected · Remedied · Resolved</p>
        <div style={S.doshaGrid}>
          {[{icon:"⚔️",name:"Mangal Dosha",col:"#ff7777",bg:"rgba(80,8,8,0.25)",bc:"rgba(180,35,35,0.25)",desc:"Mars in houses 1,4,7,8,10,12 — impacts marriage and partnerships significantly."},{icon:"🐍",name:"Kaal Sarp Dosha",col:"#66ee88",bg:"rgba(4,35,18,0.25)",bc:"rgba(25,140,65,0.25)",desc:"All planets between Rahu-Ketu axis — creates repeated obstacles and karmic delays."},{icon:"🌘",name:"Pitru Dosha",col:"#ffcc44",bg:"rgba(50,33,0,0.25)",bc:"rgba(160,115,8,0.25)",desc:"Ancestral karma affecting health, children and family harmony across generations."}].map(d=>(
            <article key={d.name} style={{...S.doshaCard,background:d.bg,borderColor:d.bc}}>
              <span style={S.doshaIcon} aria-hidden="true">{d.icon}</span>
              <h3 style={{...S.doshaName,color:d.col}}>{d.name}</h3>
              <p style={S.doshaDesc}>{d.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <div style={S.divider} />
      <section style={S.sec} aria-label="Testimonials">
        <h2 style={S.secTitle}>Testimonials</h2>
        <p style={S.secSub}>Thousands of Families Guided</p>
        <div style={S.testGrid}>
          {[{text:"Shastri ji's kundali reading was remarkably accurate. His guidance on my career change proved exactly right within months.",name:"Rajesh Patel",city:"Ahmedabad"},{text:"We consulted for our daughter's vivah muhurta. His traditional knowledge is unmatched in all of Gujarat.",name:"Meena Shah",city:"Surat"},{text:"The Kaal Sarp remedy he suggested transformed our business completely. A true Jyotishi.",name:"Dhruv Mehta",city:"Vadodara"}].map(t=>(
            <article key={t.name} style={S.testCard}>
              <div style={S.testStars} aria-label="5 stars">★★★★★</div>
              <blockquote style={S.testText}>"{t.text}"</blockquote>
              <footer><div style={S.testName}>{t.name}</div><div style={S.testCity}>{t.city}</div></footer>
            </article>
          ))}
        </div>
      </section>
      <div style={S.divider} />
      <section style={S.ctaSec} aria-label="Call to action">
        <div style={S.om} aria-hidden="true">🕉️</div>
        <h2 style={S.ctaTitle}>Begin Your Cosmic Journey</h2>
        <p style={S.ctaDesc}>Create your free account and generate your complete Vedic birth chart instantly.</p>
        <div style={S.btns}>
          <button style={S.btnP} onClick={onRegister}>🔯 Get Started Free</button>
          <button style={S.btnS} onClick={onLogin}>🔑 Sign In</button>
        </div>
      </section>
      <footer style={S.footer}>
        <div style={S.footerOm} aria-hidden="true">🕉️</div>
        <div>© 2026 Nigmayu Jyotish · Ahmedabad, Gujarat, India</div>
        <div style={{marginTop:"0.3rem"}}>Lalbhai Shastri · Vedic Astrologer Since 1984</div>
      </footer>
    </div>
  );
}
