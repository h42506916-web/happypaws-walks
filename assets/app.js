const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
$('#yr').textContent=new Date().getFullYear();
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>reduce?el.classList.add('in'):io.observe(el));
const buddy=$('#buddy'),trick=buddy.querySelector('.trick'),eyes=buddy.querySelector('.eyes'),svg=buddy.querySelector('svg'),bubble=$('#bubble');
const XP={explore:'curious',top:'happy',grow:'excited',calendar:'excited',book:'excited',faq:'curious'};let mood='neutral',moodT;
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
const KEY='hp-draft',FIELDS=['name','dog','date','time','dogs','size','age','temper','notes','first'];
function save(){try{const d={};FIELDS.forEach(k=>{const el=f.elements[k];d[k]=el.type==='checkbox'?el.checked:el.value});sessionStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
try{const d=JSON.parse(sessionStorage.getItem(KEY)||'null');if(d)FIELDS.forEach(k=>{const el=f.elements[k];if(el&&k in d){if(el.type==='checkbox')el.checked=!!d[k];else el.value=d[k]}})}catch(e){}
const notes=$('#notes'),nc=$('#notes-c');const cnt=()=>nc.textContent=notes.value.length+' / 600';cnt();notes.addEventListener('input',cnt);
f.addEventListener('input',save);f.addEventListener('change',save);
f.querySelectorAll('input:not([type=checkbox])').forEach(i=>{i.addEventListener('blur',()=>{if(i.value)check(i)});i.addEventListener('input',()=>{if(i.closest('.field').classList.contains('bad'))check(i)})});
let sending=false;
f.addEventListener('submit',e=>{e.preventDefault();if(sending)return;let first=null;['name','dog','phone'].forEach(k=>{const i=f.elements[k];if(!check(i)&&!first)first=i});const dt=HPB.checkDT();if(!dt.ok&&!first)first=dt.el;
 if(first){first.focus();doTrick('wiggle');feel('surprised',1500);say('Oops, check that one');return}
 if(!HPB.free()){HPB.dup();doTrick('wiggle');feel('surprised',1500);say('That slot is taken');return}
 sending=true;const b=f.querySelector('.btn[type=submit]');b.disabled=true;b.textContent='Sending…';
 const se=$('#send-e');se.classList.remove('show');const g=n=>(f.elements[n]&&f.elements[n].value||'').trim(),tc=f.querySelector('input[name=time]:checked');
 const data={_subject:'New Happy Paws booking','Booking ref':HPB.newRef(),_template:'table',_captcha:'false',_honey:g('_honey'),Name:g('name'),Phone:g('phone'),'Dog name':g('dog'),Date:HPB.dl(g('date')),Time:tc?HPB.tl(tc.value):'','Number of dogs':g('dogs')||'Not given',Price:HPB.price(g('dogs')),Size:g('size')||'Not given',Age:g('age')||'Not given',Temperament:g('temper')||'Not given',Notes:g('notes')||'None','First time':f.elements.first&&f.elements.first.checked?'Yes':'No'};
 const fail=()=>{sending=false;b.disabled=false;b.textContent='Send request';se.classList.add('show');se.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});doTrick('wiggle');feel('surprised',1500);say('Hmm, try again?')};
 fetch('https://formsubmit.co/ajax/h.bastian1@icloud.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)}).then(r=>{if(!r.ok)throw 0;return r.json().catch(()=>({}))}).then(j=>{if(j&&(j.success===false||j.success==='false')&&!/activat/i.test(j.message||''))throw 0;
 HPB.saveIt();try{sessionStorage.removeItem(KEY);sessionStorage.setItem('hp-sent','1')}catch(e){}f.style.display='none';const t=$('#thanks');t.style.display='block';t.focus({preventScroll:true});t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});buddy.classList.remove('away');doTrick('flip');base='joy';feel('joy',0);say('Yay, thank you!')}).catch(fail)});
$('#again').addEventListener('click',()=>{f.reset();HPB.reset();f.querySelectorAll('.field').forEach(x=>x.classList.remove('ok','bad'));cnt();const b=f.querySelector('.btn[type=submit]');b.disabled=false;b.textContent='Send request';sending=false;$('#thanks').style.display='none';f.style.display='';base='neutral';feel('neutral',0);$('#name').focus()});
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



// ---- bookings (stored on this device)
const HPB=(()=>{const K='hp-bookings',MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],MF=['January','February','March','April','May','June','July','August','September','October','November','December'],DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 const load=()=>{try{const a=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(a)?a.filter(b=>b&&/^\d{4}-\d\d-\d\d$/.test(b.date)&&/^\d\d:\d\d$/.test(b.time)):[]}catch(e){return[]}};
 const store=a=>{try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}};
 const pd=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
 const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const tl=t=>{let[h,m]=t.split(':').map(Number);const ap=h<12?'am':'pm';h=h%12||12;return h+':'+String(m).padStart(2,'0')+ap};
 const dl=s=>{const d=pd(s);return DN[d.getDay()]+' '+d.getDate()+' '+MF[d.getMonth()]};
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const t0=new Date(),today=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate());
 const SLOTS=['16:00','17:00'];const price=n=>n==='3'?'$50 (1 hour, 3 dogs)':n==='2'?'$30 (1 hour, 2 dogs)':'$20 (1 hour, 1 dog)';const isSun=s=>{if(!s)return false;const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).getDay()===0};const SUN="We don't walk on Sundays. Please choose Monday to Saturday.";
 let pref='';const mkref=()=>{const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let r='';const u=new Uint8Array(4);try{crypto.getRandomValues(u)}catch(e){for(let i=0;i<4;i++)u[i]=Math.random()*256}u.forEach(x=>r+=A[x%A.length]);return 'HP-'+r};
 const api={price,isSun,load,iso,tl,dl,newRef(){pref=mkref();return pref},checkDT(){return{ok:true}},free(){return true},dup(){},saveIt(){},reset(){}};
 const f=document.getElementById('f'),di=document.getElementById('date');
 if(f&&di){const pills=document.getElementById('pills'),tf=document.getElementById('time-f'),df=document.getElementById('date-f'),de=document.getElementById('dup-e');
  const mx=new Date(today);mx.setDate(mx.getDate()+60);const mn=new Date(today);mn.setDate(mn.getDate()+1);di.min=iso(mn);di.max=iso(mx);
  const cur=()=>{const r=f.querySelector('input[name=time]:checked');return r?r.value:''};
  function draw(){const v=cur(),d=isSun(di.value)?'':di.value,taken=new Set(load().filter(b=>b.date===d).map(b=>b.time));
   pills.innerHTML=(d?'':'<p class="hint">Choose a date first to see times.</p>')+SLOTS.map(s=>{const t=taken.has(s);return `<label class="pill"><input type="radio" name="time" value="${s}"${s===v&&!t?' checked':''}${t||!d?' disabled':''} aria-label="${tl(s)}${t?', already booked':''}"><span>${tl(s)}</span></label>`}).join('');
   pills.querySelectorAll('input').forEach(r=>r.addEventListener('change',()=>{tf.classList.remove('bad');de.classList.remove('show')}))}
  const okDate=()=>di.value&&di.value>=di.min&&di.value<=di.max&&!isSun(di.value);const dsel=document.getElementById('dogs'),ps=document.getElementById('psum');const upd=()=>{if(ps)ps.innerHTML=dsel&&dsel.value==='3'?'1 hour walk, 3 dogs: <b>$50</b>':dsel&&dsel.value==='2'?'1 hour walk, 2 dogs: <b>$30</b>':'1 hour walk, 1 dog: <b>$20</b>'};if(dsel){dsel.addEventListener('change',upd);dsel.addEventListener('input',upd)}setTimeout(upd);
  di.addEventListener('change',()=>{const sun=isSun(di.value);if(di.value&&!okDate()&&!sun){di.value=''}const dE2=document.getElementById('date-e');if(sun){dE2.textContent=SUN;df.classList.add('bad');df.classList.remove('ok');de.classList.remove('show');draw();return}dE2.textContent='Please choose a date.';df.classList.toggle('bad',!di.value);df.classList.toggle('ok',!!di.value);de.classList.remove('show');draw()});
  const dE=document.getElementById('date-e');
  api.checkDT=()=>{let el=null;const dok=okDate();dE.textContent=isSun(di.value)?SUN:di.value&&!dok?'Please choose a date in the next 60 days.':'Please choose a date.';df.classList.toggle('bad',!dok);di.setAttribute('aria-invalid',!dok);if(!dok)el=di;
   const tok=dok&&!!cur();tf.classList.toggle('bad',!tok);if(!tok&&!el)el=pills.querySelector('input:not(:disabled)')||di;return{ok:dok&&tok,el}};
  api.free=()=>!load().some(b=>b.date===di.value&&b.time===cur());
  api.dup=()=>{de.classList.add('show');draw();tf.classList.add('bad');de.scrollIntoView({block:'center'})};
  api.saveIt=()=>{const a=load(),v=n=>(f.elements[n]&&f.elements[n].value||'').trim().slice(0,60);a.push({id:Date.now().toString(36),ref:pref||mkref(),date:di.value,time:cur(),dog:v('dog'),dogs:v('dogs'),size:v('size')});store(a);
   const td=document.getElementById('thanks-d');if(td)td.textContent=dl(di.value)+' at '+tl(cur());const tp=document.getElementById('thanks-p');if(tp)tp.textContent=price(v('dogs'));const tr=document.getElementById('thanks-r');if(tr)tr.textContent=a[a.length-1].ref;pref=''};
  api.reset=()=>{setTimeout(upd);df.classList.remove('bad','ok');tf.classList.remove('bad');de.classList.remove('show');setTimeout(draw)};
  if(di.value&&!okDate())di.value='';draw();try{const d=JSON.parse(sessionStorage.getItem('hp-draft')||'null');if(d&&d.time){const r=pills.querySelector(`input[value="${d.time}"]:not(:disabled)`);if(r)r.checked=true}}catch(e){}}
 return api})();
if(document.getElementById('bkcards')){const days=document.getElementById('caldays'),mt=document.getElementById('calmonth'),pv=document.getElementById('calprev'),nx=document.getElementById('calnext'),ul=document.getElementById('bkcards'),em=document.getElementById('bkempty'),more=document.getElementById('bkmore');
 const MF=['January','February','March','April','May','June','July','August','September','October','November','December'],MS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],DS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 const t0=new Date(),today=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()),tiso=HPB.iso(today);
 const pd=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};const esc=s=>String(s||'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
 let vy=today.getFullYear(),vm=today.getMonth();
 const sorted=()=>HPB.load().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 {const up=sorted().find(b=>b.date>=tiso);if(up){const d=pd(up.date);vy=d.getFullYear();vm=d.getMonth()}}
 const mi=(y,m)=>y*12+m;
 function range(){const a=sorted();let lo=mi(today.getFullYear(),today.getMonth()),hi=lo+2;a.forEach(b=>{const d=pd(b.date),k=mi(d.getFullYear(),d.getMonth());lo=Math.min(lo,k);hi=Math.max(hi,k)});return[lo,hi]}
 function grid(){const a=sorted(),set=new Set(a.map(b=>b.date)),[lo,hi]=range();mt.textContent=MF[vm]+' '+vy;pv.disabled=mi(vy,vm)<=lo;nx.disabled=mi(vy,vm)>=hi;
  const first=new Date(vy,vm,1),lead=(first.getDay()+6)%7,n=new Date(vy,vm+1,0).getDate();let h='',c=0;
  for(let r=0;c<lead+n;r++){h+='<div role="row" class="calrow">';for(let k=0;k<7;k++,c++){const dn=c-lead+1;if(dn<1||dn>n){h+='<span role="gridcell"><span class="day out" aria-hidden="true"></span></span>';continue}
   const d=new Date(vy,vm,dn),s=HPB.iso(d),bk=set.has(s),ist=s===tiso,past=d<today;
   h+=`<span role="gridcell">${bk?`<button type="button" class="day booked${past?' past':''}${ist?' today':''}" data-iso="${s}" aria-label="${HPB.dl(s)}, walk booked">${dn}</button>`:`<span class="day${ist?' today':''}" style="cursor:default;display:grid;place-items:center" aria-label="${HPB.dl(s)}${ist?', today':''}">${dn}</span>`}</span>`}h+='</div>'}
  days.innerHTML=h}
 function list(){const a=sorted();em.hidden=!!a.length;more.hidden=!a.length;
  ul.innerHTML=a.map(b=>{const d=pd(b.date),past=b.date<tiso,ex=[b.dogs&&(b.dogs+(b.dogs==='1'?' dog':' dogs')),b.size&&b.size+' size'].filter(Boolean).join(' · ');
   return `<li class="bk${past?' past':''}" data-id="${esc(b.id)}" data-iso="${b.date}"><div class="dd" aria-hidden="true"><small>${DS[d.getDay()]}</small><b>${d.getDate()}</b><small>${MS[d.getMonth()]}</small></div><div class="bi"><strong>${esc(b.dog)||'Your pup'}'s walk</strong><span>${HPB.dl(b.date)} at ${HPB.tl(b.time)}${past?' · Past':''}</span>${ex?`<span>${esc(ex)}</span>`:''}${b.ref?`<span class="ref">Ref ${esc(b.ref)}</span>`:''}</div><button type="button" class="x" aria-label="Cancel walk on ${HPB.dl(b.date)} at ${HPB.tl(b.time)}">Cancel</button></li>`}).join('')}
 function all(){grid();list()}
 pv.addEventListener('click',()=>{const d=new Date(vy,vm-1,1);vy=d.getFullYear();vm=d.getMonth();grid()});
 nx.addEventListener('click',()=>{const d=new Date(vy,vm+1,1);vy=d.getFullYear();vm=d.getMonth();grid()});
 days.addEventListener('click',e=>{const b=e.target.closest('.day.booked');if(!b)return;const li=ul.querySelector(`[data-iso="${b.dataset.iso}"]`);if(li){ul.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl'));li.classList.add('hl');li.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});setTimeout(()=>li.classList.remove('hl'),2400)}});
 ul.addEventListener('click',e=>{const li=e.target.closest('.bk');if(!li)return;
  if(e.target.closest('.x')){const x=e.target.closest('.x');const cf=document.createElement('div');cf.className='cf';cf.innerHTML='<span>Cancel this walk?</span><button type="button" class="yes">Yes, cancel</button><button type="button" class="no">Keep it</button>';x.replaceWith(cf);cf.querySelector('.no').focus();return}
  if(e.target.closest('.no')){list();return}
  if(e.target.closest('.yes')){const y=e.target.closest('.yes'),cf=y.closest('.cf'),bk=HPB.load().find(b=>b.id===li.dataset.id),msg=document.getElementById('bkmsg');if(!bk){all();return}
   cf.querySelectorAll('button').forEach(x=>x.disabled=true);y.textContent='Cancelling…';msg.className='bkmsg';msg.textContent='';
   const ex=s=>s||'Not given',data={_subject:'Happy Paws booking CANCELLED',_template:'table',_captcha:'false',_honey:'',Status:'Cancelled','Booking ref':bk.ref||'n/a (older booking)','Dog name':bk.dog||'Not given',Date:HPB.dl(bk.date),Time:HPB.tl(bk.time),'Number of dogs':ex(bk.dogs),Size:ex(bk.size)};
   fetch('https://formsubmit.co/ajax/h.bastian1@icloud.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)}).then(r=>{if(!r.ok)throw 0;return r.json().catch(()=>({}))}).then(j=>{if(j&&(j.success===false||j.success==='false'))throw 0;
    try{localStorage.setItem('hp-bookings',JSON.stringify(HPB.load().filter(b=>b.id!==bk.id)))}catch(x){}all();msg.className='bkmsg ok';msg.textContent='Walk cancelled. '+HPB.dl(bk.date)+' at '+HPB.tl(bk.time)+' has been cancelled and Happy Paws has been told.';if(typeof say==='function'){say('Walk cancelled');feel('surprised',1200)}(ul.querySelector('.x')||em.querySelector('a')).focus()})
   .catch(()=>{list();msg.className='bkmsg bad';msg.textContent="Couldn't cancel right now. Please check your connection and try again.";const nl=ul.querySelector(`[data-id="${li.dataset.id}"] .x`);if(nl)nl.focus()})}});
 addEventListener('storage',all);all()}
