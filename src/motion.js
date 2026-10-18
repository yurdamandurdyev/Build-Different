export function initMotion(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const intro=document.querySelector('.intro-screen');
 setTimeout(()=>intro.classList.add('finished'),reduce.matches?0:950);
 document.querySelector('.theme-toggle').addEventListener('click',()=>document.body.classList.toggle('paper-theme'));
 const canvas=document.querySelector('#motion-field'),ctx=canvas.getContext('2d');
 let width=0,height=0,visible=true,frame=0,last=0;const mouse={x:-1000,y:-1000,sx:-1000,sy:-1000};
 function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(0);}
 function draw(time){ctx.clearRect(0,0,width,height);ctx.strokeStyle='#162019';ctx.lineWidth=.8;const t=reduce.matches?0:time*.00025;mouse.sx+=(mouse.x-mouse.sx)*.12;mouse.sy+=(mouse.y-mouse.sy)*.12;
 for(let x=-65;x<width+65;x+=7){ctx.beginPath();for(let y=-15;y<height+16;y+=9){const wave=Math.sin(y*.009+x*.004+t)*24+Math.sin(y*.018-x*.006-t*.8)*13+Math.cos(x*.008+y*.004+t)*20;const distance=Math.hypot(x-mouse.sx,y-mouse.sy);const push=reduce.matches?0:Math.max(0,1-distance/170)**2*65;const px=x+wave+push*(x<mouse.sx?-1:1);const py=y+Math.sin(x*.008+t)*6; if(y===-15)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();}}
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});canvas.addEventListener('pointerleave',()=>{mouse.x=-1000;mouse.y=-1000;});
 new ResizeObserver(resize).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
 const portal=document.querySelector('.training-portal'),title=document.querySelector('.portal-title');
 const room=portal.querySelector('.portal-room'),cards=[...portal.querySelectorAll('.depth-card')],count=portal.querySelector('.room-count'),bar=portal.querySelector('.room-progress span'),caption=portal.querySelector('.portal-caption');
 const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
 function scroll(){
  if(reduce.matches){room.style.clipPath='none';room.style.opacity='1';title.style.transform='none';title.style.opacity='1';cards.forEach(c=>{c.style.transform='none';c.style.opacity='1';c.style.visibility='visible';c.style.pointerEvents='auto';c.tabIndex=0;});return;}
  const r=portal.getBoundingClientRect(),progress=clamp(-r.top/Math.max(1,portal.offsetHeight-innerHeight));
  const entry=clamp(progress/.19),travel=clamp((progress-.19)/.73),exit=clamp((progress-.94)/.06);
  const easing=entry*entry*(3-2*entry);
  room.style.clipPath=`ellipse(${12+easing*100}% ${32+easing*90}% at 50% 50%)`;
  room.style.opacity=String(1-exit);
  title.style.transform=`scale(${.6+easing*7})`;
  title.style.opacity=String(1-clamp((entry-.25)/.65));
  caption.style.opacity=String(1-entry);
  const camera=travel*(cards.length*1050+650);
  cards.forEach((card,i)=>{
   const z=-1600-i*1050+camera;
   const x=(i%2===0?-1:1)*(innerWidth<700?72:220);
   const y=[-35,40,-15][i%3];
   const opacity=clamp((z+3000)/650)*clamp((680-z)/240)*clamp((entry-.5)*2);
   card.style.transform=`translate3d(${x}px,${y}px,${z}px) rotateY(${i%2===0?9:-9}deg)`;
   card.style.opacity=String(opacity);
   card.style.visibility=opacity>.015?'visible':'hidden';
   const interactive=opacity>.4&&z>-1200&&z<540;
   card.style.pointerEvents=interactive?'auto':'none';card.tabIndex=interactive?0:-1;
  });
  count.textContent=String(Math.min(cards.length,Math.max(1,Math.floor((camera-700)/1050)+1))).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
  bar.style.transform=`scaleX(${travel})`;
 }
 reduce.addEventListener('change',scroll);
 addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);scroll();
 function loop(t){if(visible&&!document.hidden&&!reduce.matches&&t-last>30){draw(t);last=t;}frame=requestAnimationFrame(loop);}resize();frame=requestAnimationFrame(loop);
 addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}
