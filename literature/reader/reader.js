(()=>{'use strict';
let data=window.HAIFENG_MANUSCRIPT;
if(new URLSearchParams(location.search).get('preview')==='1'){
  try{const d=JSON.parse(sessionStorage.getItem('haifeng-cms-preview-v1')||'null');if(d&&Array.isArray(d.pages)&&d.chapters?.length===50){data=d;const tag=document.createElement('div');tag.className='reader-preview-banner';tag.textContent='編修室試讀｜目前修改僅供本機預覽，尚未公開發布';document.querySelector('.r-top').after(tag)}}catch(e){console.warn('書稿試讀資料無法載入')}
}
if(!data){document.getElementById('readerError').hidden=false;return}
const P=data.pages;let R=[],pdfIndex=new Map(),current=0,turning=false,mobile=matchMedia('(max-width:760px)').matches;let scale=1;
const $=x=>document.getElementById(x);const book=$('book'),left=$('leafLeft'),right=$('leafRight'),sheet=$('turnSheet'),front=$('turnFront'),back=$('turnBack'),progress=$('progressBar'),pageNo=$('readerPageNo'),drawer=$('drawer'),veil=$('veil'),search=$('searchQuery'),contents=$('contentsList'),results=$('searchResults'),hits=$('searchHits');
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cached=()=>{try{return JSON.parse(localStorage.getItem('haifeng-reader-v1')||'{}')}catch{return {}}};
function save(){try{localStorage.setItem('haifeng-reader-v1',JSON.stringify({page:current+1,pdf:R[current]?.pdf||1,piece:R[current]?.piece||0,scale,updated:new Date().toISOString()}))}catch{}}
function makePage(i){if(i<0||i>=R.length)return '<div class="page-inner"><div class="page-kicker">王家傳 · 海風有名</div></div>';
 const p=R[i];if(p.pdf===1)return '<div class="paper-cover"><p class="cover-micro">THE WANG FAMILY CHRONICLES</p><div class="cover-divider"></div><p class="cover-series">第一輯 · 第一代</p><div class="cover-title">海風有名</div><p class="cover-bottom">第二輪校樣　·　二〇二六年十月</p></div>';
 let body='';if(p.pdf===3){body='<div class="page-toc-preview"><h2 class="page-chapter">目次｜五十回</h2><p>全書分十部、五十回。點選左上角「章回目次」即可直接跳至任一回；亦可使用左右鍵或下方按鈕翻頁。</p><p><button type="button" class="toc-opener" data-open-toc>展開五十回目次　／　選讀章回</button></p></div>'}
 else {for(const b of p.blocks){const txt=escapeHtml(b.text);switch(b.type){case 'part':body+=`<h3 class="page-part">${txt}</h3>`;break;case 'chapter':body+=`<h2 class="page-chapter">${txt}</h2>`;break;case 'heading':body+=`<h3 class="page-part">${txt}</h3>`;break;case 'p':body+=`<p>${txt}</p>`;break;}}}
 return `<div class="page-inner" aria-label="原稿第 ${p.pdf} 頁"><div class="page-kicker">${escapeHtml(p.section)}　／　${escapeHtml(p.running)}</div><div class="page-content">${body}</div><div class="page-num">原稿 ${p.pdf} · 閱讀頁 ${i+1}</div></div>`;}
/* Adaptive on-page pagination: all text fits on the visible paper. Original PDF numbering stays searchable. */
const blockMarkup=b=>{const t=escapeHtml(b.text);return b.type==='p'?`<p>${t}</p>`:b.type==='chapter'?`<h2 class="page-chapter">${t}</h2>`:`<h3 class="page-part">${t}</h3>`};
function reflow(targetPdf,targetPiece=0){
 const remembered=targetPdf||R[current]?.pdf||1,rememberedPiece=targetPiece||0;
 const probe=document.createElement('article');probe.className='leaf left measure-leaf';
 probe.innerHTML='<div class="page-inner"><div class="page-kicker">王家傳　／　海風有名</div><div class="page-content"><p>一段示範文字</p></div><div class="page-num">— 閱讀頁 —</div></div>';
 book.append(probe);
 const canvas=probe.querySelector('.page-content'),pstyle=getComputedStyle(canvas.querySelector('p'));
 const fontsize=parseFloat(pstyle.fontSize)||14,lineheight=parseFloat(pstyle.lineHeight)||28;
 const perLine=Math.max(8,Math.floor(canvas.clientWidth/(fontsize+parseFloat(pstyle.letterSpacing||'0'))));
 // Reserve margin and line breaks: no paper should ever require scrolling.
 const usableLines=Math.max(5,Math.floor(canvas.clientHeight/lineheight*0.77));
 const costText=str=>{let count=0;for(const c of str){const k=c.codePointAt(0);count+=k>=0x2e80?1:((k>=65&&k<=122)||k>=48&&k<=57)?0.58:0.72}return count};
 const estimate=b=>b.type==='p'?(costText(b.text)/perLine+1.3):((costText(b.text)/perLine)*1.5+2.1);
 const maxFit=(text,room)=>{
  let used=0,i=0;const budget=Math.max(1,(room-1.3)*perLine);
  for(const c of text){const k=c.codePointAt(0),w=k>=0x2e80?1:((k>=65&&k<=122)||k>=48&&k<=57)?0.58:0.72;if(i>0&&used+w>budget)break;used+=w;i+=c.length}
  return Math.max(1,i)
 };
 const next=[],index=new Map();
 for(const source of P){
  let piece=0,pend=[],lines=0;
  const flush=()=>{if(!index.has(source.pdf))index.set(source.pdf,next.length);next.push({...source,blocks:pend,piece:piece++});pend=[];lines=0};
  if(source.pdf===1||source.pdf===3){pend=source.blocks.map(x=>({...x}));flush();continue}
  if(!source.blocks.length){flush();continue}
  for(const original of source.blocks){
   if(original.type!=='p'){
    const cost=estimate(original);
    if(lines+cost>usableLines&&pend.length)flush();pend.push({...original});lines+=cost;continue;
   }
   let rest=original.text;
   while(rest.length){
    if(lines+2>usableLines&&pend.length)flush();
    const take=Math.min(rest.length,maxFit(rest,usableLines-lines));
    const text=rest.slice(0,take);
    const block={...original,text};
    if(lines+estimate(block)>usableLines&&pend.length){flush();continue}
    pend.push(block);lines+=estimate(block);rest=rest.slice(take);
    if(rest.length)flush();
   }
  }
  if(pend.length)flush();
 }
 probe.remove();R=next;pdfIndex=index;
 const begin=index.get(remembered)??0;let finish=begin;
 while(finish<R.length&&R[finish].pdf===remembered)finish++;
 current=Math.min(R.length-1,begin+Math.min(rememberedPiece,Math.max(0,finish-begin-1)));
 refresh();
}
function refresh(){
 const spread=mobile?current:Math.floor(current/2)*2;
 left.innerHTML=makePage(spread);if(!mobile)right.innerHTML=makePage(spread+1);else right.innerHTML='';
 let displayStart=spread+1,displayEnd=mobile?spread+1:Math.min(R.length,spread+2);
 const pdf1=R[spread]?.pdf||1,pdf2=R[displayEnd-1]?.pdf||pdf1;
 pageNo.textContent=`閱讀 ${displayStart}${displayEnd>displayStart?'—'+displayEnd:''} / ${R.length} 頁 · 原稿 ${pdf1}${pdf2>pdf1?'—'+pdf2:''}`;
 progress.style.width=(100*displayEnd/R.length).toFixed(2)+'%';
 $('prevButton').disabled=current<=0;$('nextButton').disabled=current+(mobile?1:2)>=R.length;
 document.documentElement.style.setProperty('--booktype',String(scale));
 $('currentChapter').textContent=R[Math.min(R.length-1,current)]?.running||'卷首';save();
}
function turn(delta){if(turning)return;const step=mobile?1:2;let target=delta>0?Math.min(R.length-1,current+step):Math.max(0,current-step);if(target===current)return;const from=mobile?current:Math.floor(current/2)*2;const to=mobile?target:Math.floor(target/2)*2;const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(reduce){current=target;refresh();return}turning=true;sheet.className='turn-sheet';
 if(mobile){front.innerHTML=makePage(from);back.innerHTML=makePage(to);left.innerHTML=makePage(to)}else if(delta>0){front.innerHTML=makePage(from+1);back.innerHTML=makePage(to);right.innerHTML=makePage(to+1)}else{front.innerHTML=makePage(from);back.innerHTML=makePage(to+1);left.innerHTML=makePage(to)}
 sheet.classList.add(delta>0?'go-next':'go-prev');let done=false;const finish=()=>{if(done)return;done=true;sheet.className='turn-sheet';current=target;turning=false;refresh()};sheet.addEventListener('animationend',finish,{once:true});setTimeout(finish,900);
}
function jump(page){if(turning)return;current=Math.max(0,(pdfIndex.get(page)??0));refresh();closeDrawer();/* The reading viewport stays in place when jumping between chapters. */}
function openDrawer(mode){drawer.classList.add('open');veil.classList.add('open');drawer.setAttribute('aria-hidden','false');veil.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setMode(mode||'contents');$('drawerClose').focus();}
function closeDrawer(){drawer.classList.remove('open');veil.classList.remove('open');drawer.setAttribute('aria-hidden','true');veil.setAttribute('aria-hidden','true');document.body.style.overflow='';}
function setMode(mode){const searching=mode==='search',notes=mode==='notes';contents.classList.toggle('hidden',searching||notes);results.classList.toggle('active',searching);$('readerNotes').classList.toggle('active',notes);const heading=drawer.querySelector('.drawer-head h2');if(heading)heading.textContent=notes?'校樣說明':searching?'尋找內文':'章回選讀';document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));if(searching)search.focus();}
function renderToc(){let markup='<button class="toc-link" data-jump="4"><span>序</span>序章｜壽宴上的兩種光</button>';data.parts.forEach((part,i)=>{markup+=`<section class="toc-section"><h3>${escapeHtml(part.name)}</h3>`;data.chapters.filter(c=>c.part===i+1).forEach(ch=>{markup+=`<button class="toc-link" data-jump="${ch.page}"><span>${String(ch.index).padStart(2,'0')}</span>${escapeHtml(ch.name)}</button>`});markup+='</section>'});markup+='<section class="toc-section"><h3>附記</h3><button class="toc-link" data-jump="145">史料與創作說明</button><button class="toc-link" data-jump="146">編輯版本與進度</button></section>';contents.innerHTML=markup;}
let searchTimer=null;search.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{const q=search.value.trim();if(!q){hits.innerHTML='<p>輸入人物、地名、回目或詞句，尋找原稿中出現的位置。</p>';return}const found=[];P.forEach(p=>{const all=p.blocks.map(b=>b.text).join('');let ix=all.indexOf(q);if(ix!==-1){const snip=all.slice(Math.max(0,ix-24),Math.min(all.length,ix+q.length+48));found.push({page:p.pdf,snip});}});hits.replaceChildren();const top=document.createElement('p');top.textContent=`搜尋「${q}」：找到 ${found.length} 頁` ;hits.append(top);for(const result of found.slice(0,65)){const b=document.createElement('button');b.className='toc-link';b.dataset.jump=result.page;b.innerText=`第 ${result.page} 頁　${result.snip}`;hits.append(b)}},120)});
const old=cached();if(old.scale&&old.scale>=.84&&old.scale<=1.28)scale=old.scale;
$('prevButton').addEventListener('click',()=>turn(-1));$('nextButton').addEventListener('click',()=>turn(1));$('fontSmaller').addEventListener('click',()=>{scale=Math.max(.86,Math.round((scale-.08)*100)/100);document.documentElement.style.setProperty('--booktype',String(scale));reflow(R[current]?.pdf,R[current]?.piece)});$('fontLarger').addEventListener('click',()=>{scale=Math.min(1.24,Math.round((scale+.08)*100)/100);document.documentElement.style.setProperty('--booktype',String(scale));reflow(R[current]?.pdf,R[current]?.piece)});$('tocButton').addEventListener('click',()=>openDrawer('contents'));$('findButton').addEventListener('click',()=>openDrawer('search'));$('noteButton').addEventListener('click',()=>openDrawer('notes'));$('drawerClose').addEventListener('click',closeDrawer);veil.addEventListener('click',closeDrawer);
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.addEventListener('click',e=>{const goto=e.target.closest('[data-jump]');if(goto){jump(+goto.dataset.jump);return}if(e.target.closest('[data-open-toc]'))openDrawer('contents')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open')){closeDrawer();return}if(drawer.classList.contains('open')||e.target.matches('input,textarea,select'))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();turn(1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();turn(-1)}});
/* Freeze the paper in place while swiping; only a deliberate horizontal gesture turns a leaf. */
let gesture=null;
book.addEventListener('touchstart',e=>{gesture=null;if(e.touches.length!==1||e.target.closest('button,a,input,select,textarea'))return;gesture={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
book.addEventListener('touchmove',e=>{if(!gesture||e.touches.length!==1)return;const dx=e.touches[0].clientX-gesture.x,dy=e.touches[0].clientY-gesture.y;if(Math.abs(dx)+Math.abs(dy)>6&&e.cancelable)e.preventDefault()},{passive:false});
book.addEventListener('touchend',e=>{if(!gesture||e.changedTouches.length!==1){gesture=null;return}const dx=e.changedTouches[0].clientX-gesture.x,dy=e.changedTouches[0].clientY-gesture.y;gesture=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)turn(dx<0?1:-1)},{passive:true});
book.addEventListener('touchcancel',()=>{gesture=null},{passive:true});
const mobileMql=matchMedia('(max-width:760px)');mobileMql.addEventListener('change',e=>{mobile=e.matches;reflow(R[current]?.pdf,R[current]?.piece)});
renderToc();document.documentElement.style.setProperty('--booktype',String(scale));reflow(old.pdf||old.page||1,old.piece||0);let lastWidth=book.clientWidth,lastHeight=book.clientHeight;
const sizeChanged=()=>{const w=book.clientWidth,h=book.clientHeight;if(Math.abs(w-lastWidth)>4||Math.abs(h-lastHeight)>4){lastWidth=w;lastHeight=h;clearTimeout(window._ebookReflowTimer);window._ebookReflowTimer=setTimeout(()=>reflow(R[current]?.pdf,R[current]?.piece),140)}};
addEventListener('resize',sizeChanged,{passive:true});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(sizeChanged).observe(book);
})();
