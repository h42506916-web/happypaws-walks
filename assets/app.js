const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
$('#yr').textContent=new Date().getFullYear();
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>reduce?el.classList.add('in'):io.observe(el));
const buddy=$('#buddy'),trick=buddy.querySelector('.trick'),eyes=buddy.querySelector('.eyes'),svg=buddy.querySelector('svg'),bubble=$('#bubble');
const XP={explore:'curious',top:'happy',grow:'excited',calendar:'excited',book:'excited',faq:'curious',qr:'happy'};let mood='neutral',moodT;
function feel(m,ms){svg.classList.remove('x-'+mood);mood=m;svg.classList.add('x-'+m);clearTimeout(moodT);if(ms)moodT=setTimeout(()=>feel(base,0),ms)}
let base='neutral';function setBase(m){base=m;if(!moodT||mood===base)feel(m,0)}
let bt;function say(t){bubble.textContent=t;bubble.classList.add('show');clearTimeout(bt);bt=setTimeout(()=>bubble.classList.remove('show'),3000)}
const tricks=['spin','flip','hop'];let ti=0;
function doTrick(k){if(reduce)return;k=k||tricks[ti++%3];trick.classList.remove('spin','flip','wiggle','hop');void trick.offsetWidth;trick.classList.add(k)}
trick.addEventListener('animationend',()=>trick.classList.remove('spin','flip','wiggle','hop'));
buddy.addEventListener('click',()=>{feel('surprised',1600);doTrick();say(['Wheee!','Again?','Woof!','Hehe!'][Math.random()*4|0])});
buddy.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();buddy.click()}});
// smooth eye tracking
let tx=-4,ty=-3,ex=0,ey=0,raf=0;
function look(dx,dy){if(!/neutral|curious|happy/.test(mood)){dx*=.3;dy*=.3}const d=Math.hypot(dx,dy)||1,k=Math.min(1,d/300);tx=dx/d*6*k;ty=dy/d*5*k;if(!raf)raf=requestAnimationFrame(step)}
function step(){ex+=(tx-ex)*.18;ey+=(ty-ey)*.18;eyes.setAttribute('transform',`translate(${ex.toFixed(2)} ${ey.toFixed(2)})`);raf=Math.abs(tx-ex)+Math.abs(ty-ey)>.05?requestAnimationFrame(step):0}
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=svg.getBoundingClientRect();look(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)},{passive:true});
const nav=$('#nav');let lastY=scrollY,lt,st=false;
addEventListener('scroll',()=>{if(st)return;st=true;requestAnimationFrame(()=>{const dy=scrollY-lastY;lastY=scrollY;nav.classList.toggle('scrolled',scrollY>8);if(Math.abs(dy)>2){look(0,dy>0?300:-300);clearTimeout(lt);lt=setTimeout(()=>look(-200,-120),800)}st=false})},{passive:true});
look(-200,-120);
(function blink(){setTimeout(()=>{if(!reduce&&!document.hidden){svg.classList.add('blink');setTimeout(()=>svg.classList.remove('blink'),240)}blink()},2600+Math.random()*3200)})();
setInterval(()=>{if(!document.hidden&&!/spin|flip|hop/.test(trick.className))doTrick('wiggle')},9000);
let cur=null;const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.target!==cur){const first=cur===null;cur=e.target;const xm=XP[e.target.id]||(e.target.tagName==='FOOTER'?'happy':'neutral');if(base!=='joy'&&xm!=='neutral')feel(xm,2800);say(e.target.dataset.say);if(!first)doTrick()}}),{rootMargin:'-45% 0px -45% 0px'});
$$('[data-say]').forEach(s=>so.observe(s));
// mobile: tuck buddy away while typing so it never covers fields or the Send button
const small=()=>innerWidth<600;
$$('input,select,textarea').forEach(i=>{i.addEventListener('focus',()=>{if(small())buddy.classList.add('away')});i.addEventListener('blur',()=>setTimeout(()=>{if(!f||!f.contains(document.activeElement))buddy.classList.remove('away')},50))});
// keep buddy and bubble clear of the Send button on mobile
const f=$('#f');if(f){const sendBtn=$('#f .btn');new IntersectionObserver(es=>es.forEach(e=>{if(small())buddy.classList.toggle('away',e.isIntersecting||f.contains(document.activeElement))}),{rootMargin:'0px 0px -0px 0px',threshold:0}).observe(sendBtn);
// slide buddy to the screen edge whenever a control sits underneath it
const CTRL='a,button,input,select,textarea,label.toggle,summary';let pk=false;
function clear(){pk=false;if(buddy.classList.contains('away'))return;const r={left:buddy.offsetLeft,top:buddy.offsetTop,right:buddy.offsetLeft+buddy.offsetWidth,bottom:buddy.offsetTop+buddy.offsetHeight};let hit=false;
 for(const el of document.querySelectorAll(CTRL)){if(buddy.contains(el)||el.closest('[hidden]'))continue;const q=el.getBoundingClientRect();if(q.width&&q.right>r.left&&q.left<r.right&&q.bottom>r.top-12&&q.top<r.bottom+12){hit=true;break}}
 buddy.classList.toggle('peek',hit)}
addEventListener('scroll',()=>{if(!pk){pk=true;requestAnimationFrame(clear)}},{passive:true});addEventListener('resize',clear);document.addEventListener('toggle',clear,true);clear();
// form validation (front-end only)
const phoneOK=v=>{const d=v.replace(/[\s\-().]/g,'');return /^(?:\+?61|0)4\d{8}$/.test(d)};
function check(i){const fd=i.closest('.field');if(!fd)return true;let v=i.value.trim(),ok=true;
 if(i.required&&!v)ok=false;else if(i.id==='phone'&&!phoneOK(v))ok=false;
 fd.classList.toggle('bad',!ok);fd.classList.toggle('ok',ok&&v!=='');i.setAttribute('aria-invalid',!ok);return ok}
const KEY='hp-draft',FIELDS=['name','dog','time','dogs','size','age','temper','notes','first'];
function save(){try{const d={};FIELDS.forEach(k=>{const el=f.elements[k];d[k]=el.type==='checkbox'?el.checked:el.value});sessionStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
try{const d=JSON.parse(sessionStorage.getItem(KEY)||'null');if(d)FIELDS.forEach(k=>{const el=f.elements[k];if(el&&k in d){if(el.type==='checkbox')el.checked=!!d[k];else el.value=d[k]}})}catch(e){}
const notes=$('#notes'),nc=$('#notes-c');const cnt=()=>nc.textContent=notes.value.length+' / 600';cnt();notes.addEventListener('input',cnt);
f.addEventListener('input',save);f.addEventListener('change',save);
f.querySelectorAll('input:not([type=checkbox])').forEach(i=>{i.addEventListener('blur',()=>{if(i.value)check(i)});i.addEventListener('input',()=>{if(i.closest('.field').classList.contains('bad'))check(i)})});
let sending=false;
f.addEventListener('submit',e=>{e.preventDefault();if(sending)return;let first=null;['name','dog','phone'].forEach(k=>{const i=f.elements[k];if(!check(i)&&!first)first=i});
 if(first){first.focus();doTrick('wiggle');feel('surprised',1500);say('Oops, check that one');return}
 sending=true;const b=f.querySelector('.btn[type=submit]');b.disabled=true;b.textContent='Sending…';
 setTimeout(()=>{try{sessionStorage.removeItem(KEY);sessionStorage.setItem('hp-sent','1')}catch(e){}f.style.display='none';const t=$('#thanks');t.style.display='block';t.focus({preventScroll:true});t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});buddy.classList.remove('away');doTrick('flip');base='joy';feel('joy',0);say('Yay, thank you!')},700)});
$('#again').addEventListener('click',()=>{f.reset();f.querySelectorAll('.field').forEach(x=>x.classList.remove('ok','bad'));cnt();const b=f.querySelector('.btn[type=submit]');b.disabled=false;b.textContent='Send request';sending=false;$('#thanks').style.display='none';f.style.display='';base='neutral';feel('neutral',0);$('#name').focus()});
addEventListener('pageshow',()=>{const b=f.querySelector('.btn[type=submit]');if(f.style.display!=='none'){b.disabled=false;b.textContent='Send request';sending=false}});
}
addEventListener('beforeprint',()=>$$('.faq details').forEach(d=>{d.hidden=false;d.open=true}));
// returning visitor greeting
try{if(localStorage.getItem('hp-seen')&&$('#top'))$('#top').dataset.say='Welcome back!';localStorage.setItem('hp-seen','1')}catch(e){}
// FAQ search, filter, expand all
if($('#fq')){const fq=$('#fq'),fx=$('#fx'),grps=$$('.faq .grp'),chips=$$('.chip');let fg='';
function ff(){const q=fq.value.trim().toLowerCase();let n=0;grps.forEach(g=>{let gn=0;const inG=!fg||g.dataset.g===fg;g.querySelectorAll('details').forEach(d=>{const m=inG&&(!q||d.textContent.toLowerCase().includes(q));d.hidden=!m;if(m){gn++;if(q)d.open=true}});g.hidden=!gn;n+=gn});$('#nores').style.display=n?'none':'block'}
fq.addEventListener('input',ff);chips.forEach(c=>c.addEventListener('click',()=>{fg=c.dataset.g;chips.forEach(x=>x.setAttribute('aria-pressed',x===c));ff()}));
fx.addEventListener('click',()=>{const open=fx.getAttribute('aria-pressed')!=='true';$$('.faq details').forEach(d=>d.open=open);fx.setAttribute('aria-pressed',open);fx.textContent=open?'Collapse all':'Expand all'})}
if(!reduce&&$('#grow')){const grow=$('#grow'),h=grow.querySelector('h2');let t=false;
function upd(){const vh=innerHeight,r=grow.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-vh)*1.6+.25));h.style.setProperty('--s',(.8+.2*p).toFixed(3));h.style.setProperty('--o',(.12+.88*p).toFixed(3));t=false}
addEventListener('scroll',()=>{if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()}

// active tab is set per page in the HTML (aria-current="page")

if(document.getElementById('caldays')){const days=document.getElementById('caldays'),mt=document.getElementById('calmonth'),pv=document.getElementById('calprev'),nx=document.getElementById('calnext'),panel=document.getElementById('calpanel'),wrap=panel.parentNode,F=document.getElementById('f'),T=document.getElementById('thanks'),chip=document.getElementById('dchip'),chipT=document.getElementById('dchip-t'),fdate=document.getElementById('fdate'),td=document.getElementById('thanks-d');
 const MN=['January','February','March','April','May','June','July','August','September','October','November','December'],DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 const t0=new Date();const today=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate());const MAXM=11;
 let vy=today.getFullYear(),vm=today.getMonth(),sel=null,foc=new Date(today);
 const same=(a,b)=>a&&b&&a.getTime()===b.getTime();const lbl=d=>DN[d.getDay()]+' '+d.getDate()+' '+MN[d.getMonth()];
 const mi=(y,m)=>(y-today.getFullYear())*12+m-today.getMonth();
 function render(focus){mt.textContent=MN[vm]+' '+vy;pv.disabled=mi(vy,vm)<=0;nx.disabled=mi(vy,vm)>=MAXM;
  const first=new Date(vy,vm,1),lead=(first.getDay()+6)%7,n=new Date(vy,vm+1,0).getDate();let h='',c=0;
  for(let r=0;c<lead+n;r++){h+='<div role="row" class="calrow">';for(let k=0;k<7;k++,c++){const dn=c-lead+1;if(dn<1||dn>n){h+='<span role="gridcell"><span class="day out" aria-hidden="true"></span></span>';continue}
   const d=new Date(vy,vm,dn),past=d<today,ist=same(d,today),is=same(d,sel);
   h+=`<span role="gridcell"><button type="button" class="day${ist?' today':''}" data-d="${dn}" tabindex="-1" aria-label="${lbl(d)}${ist?', today':''}${past?', unavailable':''}" aria-selected="${is}"${ist?' aria-current="date"':''}${past?' disabled':''}>${dn}</button></span>`}h+='</div>'}
  days.innerHTML=h;if(foc.getMonth()!==vm||foc.getFullYear()!==vy||foc<today){foc=(vy===today.getFullYear()&&vm===today.getMonth())?new Date(today):new Date(vy,vm,1)}
  const b=days.querySelector(`[data-d="${foc.getDate()}"]`);if(b){b.tabIndex=0;if(focus)b.focus()}}
 function go(d,focus){if(d<today)d=new Date(today);const m=mi(d.getFullYear(),d.getMonth());if(m>MAXM)return;foc=d;vy=d.getFullYear();vm=d.getMonth();render(focus)}
 pv.addEventListener('click',()=>{const d=new Date(vy,vm-1,1);vy=d.getFullYear();vm=d.getMonth();render()});
 nx.addEventListener('click',()=>{const d=new Date(vy,vm+1,1);vy=d.getFullYear();vm=d.getMonth();render()});
 days.addEventListener('keydown',e=>{const k=e.key,d=new Date(foc);const mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[k];
  if(mv!==undefined)d.setDate(d.getDate()+mv);else if(k==='Home')d.setDate(d.getDate()-(d.getDay()+6)%7);else if(k==='End')d.setDate(d.getDate()+(7-d.getDay())%7);else if(k==='PageUp')d.setMonth(d.getMonth()-1);else if(k==='PageDown')d.setMonth(d.getMonth()+1);else return;
  e.preventDefault();go(d,true)});
 function home(){wrap.classList.add('open');panel.hidden=false}
 days.addEventListener('click',e=>{const b=e.target.closest('.day');if(!b||b.disabled)return;sel=new Date(vy,vm,+b.dataset.d);foc=new Date(sel);render(true);
  const L=lbl(sel);chipT.textContent=L;chip.hidden=false;fdate.value=sel.getFullYear()+'-'+String(sel.getMonth()+1).padStart(2,'0')+'-'+String(sel.getDate()).padStart(2,'0');td.textContent=' about '+L;
  const fresh=panel.hidden;home();if(T.style.display==='block')document.getElementById('again').click();F.classList.add('in');
  if(typeof feel==='function'){feel('excited',2400);say('Ooh, '+L.split(' ')[0]+'!');doTrick('hop')}
  if(fresh||innerWidth<860)setTimeout(()=>panel.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}),fresh?60:0);
  setTimeout(()=>document.getElementById('name').focus({preventScroll:true}),reduce?0:450)});
 document.getElementById('chgdate').addEventListener('click',()=>{const c=document.getElementById('cal');c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});const b=days.querySelector('[tabindex="0"]');if(b)b.focus({preventScroll:true})});
 render()}
