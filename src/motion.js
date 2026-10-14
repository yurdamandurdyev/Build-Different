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
 function scroll(){const r=portal.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-r.top/(portal.offsetHeight-innerHeight)));title.style.transform=reduce.matches?'none':`scale(${.55+progress*1.65}) rotate(${progress*6-3}deg)`;document.documentElement.style.setProperty('--scroll',`${scrollY}px`);}
 addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);scroll();
 function loop(t){if(visible&&!document.hidden&&!reduce.matches&&t-last>30){draw(t);last=t;}frame=requestAnimationFrame(loop);}resize();frame=requestAnimationFrame(loop);
 addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}
