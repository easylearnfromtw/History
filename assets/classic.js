/* 社寮王家　典雅書卷設計層：頁首收合、閱讀進度、列印時展開全文。無 Emoji。 */
(()=>{'use strict';
/* 換頁一律從頁首開始；按「上一頁」返回時保留原位置；帶錨點的連結仍直達該段 */
try{
  const nav=performance.getEntriesByType('navigation')[0];
  if(!location.hash&&(!nav||nav.type==='navigate')){
    let touched=false;
    const mark=()=>{touched=true};
    ['wheel','touchstart','keydown','pointerdown'].forEach(t=>addEventListener(t,mark,{once:true,passive:true}));
    const toTop=()=>{if(!touched&&window.scrollY!==0)window.scrollTo({top:0,left:0,behavior:'instant'})};
    toTop();
    addEventListener('DOMContentLoaded',toTop,{once:true});
    addEventListener('load',toTop,{once:true});
    addEventListener('pageshow',e=>{if(!e.persisted)toTop()},{once:true});
  }
}catch(e){}
const head=document.querySelector('.museum-header');
const longRead=document.querySelector('.museum-reading,.museum-record-content,.more-story,.relations-reader,.museum-editorial');
let bar=null;
if(head&&longRead){bar=document.createElement('span');bar.className='read-progress';bar.setAttribute('aria-hidden','true');head.append(bar)}
let ticking=false;
const update=()=>{
  ticking=false;
  if(head)head.classList.toggle('is-scrolled',window.scrollY>24);
  if(bar){const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform='scaleX('+(max>0?Math.min(1,window.scrollY/max):0)+')'}
};
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
window.addEventListener('resize',update,{passive:true});
update();
/* 卷冊卡片的游標微光 */
document.querySelectorAll('.museum-collection-card,.more-card,.origin,.courtyard-story,.leisure-table').forEach(c=>{
  c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
  c.addEventListener('pointerleave',()=>{c.style.removeProperty('--mx');c.style.removeProperty('--my')});
});
/* 首頁開場：歡迎頁 → 緣起 → 主頁。按鈕、Enter／空白鍵或向下捲動往下一頁，Esc 直接進入；本次造訪不再顯示 */
const welcome=document.getElementById('welcome');
if(welcome&&document.documentElement.classList.contains('welcome-pending')){
  window.swWelcomeReady=true;
  const root=document.documentElement;
  const behind=[...document.body.children].filter(el=>el!==welcome&&el.tagName!=='SCRIPT');
  const steps=[...welcome.querySelectorAll('.welcome-step')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  behind.forEach(el=>el.inert=true);
  let idx=0,done=false,lockUntil=0;
  const focusStep=()=>{const b=steps[idx].querySelector('.welcome-btn');if(b)b.focus({preventScroll:true})};
  const enter=()=>{
    if(done)return;done=true;
    try{sessionStorage.setItem('sw-welcome','1')}catch(e){}
    welcome.classList.add('is-leaving');behind.forEach(el=>el.inert=false);
    removeEventListener('keydown',onKey);removeEventListener('wheel',onWheel);
    const finish=()=>{root.classList.remove('welcome-pending');welcome.remove();update()};
    reduce?finish():setTimeout(finish,700);
  };
  const next=()=>{
    if(done||Date.now()<lockUntil)return;
    lockUntil=Date.now()+900;
    if(idx>=steps.length-1){enter();return}
    steps[idx].hidden=true;steps[idx].classList.remove('is-current');
    idx++;steps[idx].hidden=false;steps[idx].classList.add('is-current');
    welcome.setAttribute('aria-labelledby',steps[idx].getAttribute('aria-labelledby'));
    welcome.scrollTop=0;focusStep();
  };
  const onKey=e=>{
    if(e.key==='Escape'){e.preventDefault();enter()}
    else if((e.key==='Enter'||e.key===' ')&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();next()}
  };
  const onWheel=e=>{if(e.deltaY>8)next()};
  let y0=null;
  welcome.addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
  welcome.addEventListener('touchend',e=>{if(y0!==null&&y0-e.changedTouches[0].clientY>50)next();y0=null},{passive:true});
  welcome.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',next));
  welcome.querySelectorAll('[data-enter]').forEach(b=>b.addEventListener('click',()=>{lockUntil=0;enter()}));
  addEventListener('keydown',onKey);addEventListener('wheel',onWheel,{passive:true});
  focusStep();
}
/* 列印時把收合的展讀內容全部打開，印完還原 */
const opened=[];
window.addEventListener('beforeprint',()=>{document.querySelectorAll('details:not([open])').forEach(d=>{d.open=true;opened.push(d)})});
window.addEventListener('afterprint',()=>{while(opened.length)opened.pop().open=false});
})();

/* 額外文字動態層獨立載入，不變更人物資料或族譜。 */
(()=>{const current=document.currentScript;if(!current?.src)return;const s=document.createElement('script');s.src=new URL('typography.js',current.src).href;s.async=false;document.head.appendChild(s)})();
