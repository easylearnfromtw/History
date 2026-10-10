/* Sheliao Wang Archive — curated multilingual edition.
   English and Japanese translations are deliberately editorial, never fetched from a translator.
   Untranslated source records stay in Traditional Chinese, clearly disclosed. */
(()=>{'use strict';
if(document.body.classList.contains('reader-body'))return;
const root=document.documentElement;
const versions=[['zh-TW','繁體'],['en','ENGLISH'],['ja','日本語'],['zh-CN','简体']];
const allowed=new Set(versions.map(x=>x[0]));
const params=new URLSearchParams(location.search);
let requested=params.get('lang');
let stored=null;try{stored=localStorage.getItem('sheliao-lang')}catch(_e){}
let current=allowed.has(requested)?requested:allowed.has(stored)?stored:'zh-TW';
const original=new WeakMap();
const ignored='script,style,textarea,input,option,pre,code,[contenteditable],.reader-body,.private-locked';
const texts=window.SHELIAO_LOCALES||{};
const simplified=window.SHELIAO_SIMPLIFIED||{};
const skipChineseDisplay=x=>x.closest('svg,canvas,[data-no-translate],.reader-body,.private-archive,.encrypted-records');
const normalize=s=>s.replace(/[\u00a0\u3000]/g,' ').trim();
function valueFor(s,lang){
 if(lang==='zh-TW')return s;
 const trimmed=s.trim();const record=texts[trimmed];
 if(lang==='zh-CN')return record?.['zh-CN']||simplified[trimmed]||trimmed;
 return record?.[lang]||null;
}
function changeNode(node,lang){
 if(!node.nodeValue||!node.nodeValue.trim())return;
 const parent=node.parentElement;if(!parent||parent.closest(ignored)||skipChineseDisplay(parent))return;
 if(!original.has(node))original.set(node,node.nodeValue);
 const raw=original.get(node);const key=raw.trim();
 if(lang==='zh-TW'){node.nodeValue=raw;return;}
 const v=valueFor(raw,lang);
 if(v===null){node.nodeValue=raw;return}
 const start=raw.match(/^\s*/u)?.[0]||'',end=raw.match(/\s*$/u)?.[0]||'';
 node.nodeValue=start+v+end;
}
function apply(lang){
 root.dataset.locale=lang;root.lang=lang==='zh-TW'?'zh-Hant-TW':lang==='zh-CN'?'zh-Hans-CN':lang;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;while((n=walker.nextNode()))changeNode(n,lang);

 const attributes=['aria-label','title','placeholder'];
 document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(element=>{
   if(element.closest(ignored)||skipChineseDisplay(element))return;
   for(const attr of attributes){if(!element.hasAttribute(attr))continue;
     const origin='data-i18n-'+attr;if(!element.hasAttribute(origin))element.setAttribute(origin,element.getAttribute(attr));
     const v=valueFor(element.getAttribute(origin),lang);if(v!==null)element.setAttribute(attr,v);
   }
 });

 const title=document.title;
 if(!root.dataset.originalTitle)root.dataset.originalTitle=title;
 const base=root.dataset.originalTitle;
 if(lang==='en')document.title=base.replace(/社寮王家/g,'The Sheliao Wang Family').replace(/海島有名/g,'Names the Island Remembers').replace(/海風有名/g,'Names in the Sea Wind');
 else if(lang==='ja')document.title=base.replace(/社寮王家/g,'社寮王家').replace(/海島有名/g,'島に残る名').replace(/海風有名/g,'海風に残る名');
 else if(lang==='zh-CN')document.title=(base.replace(/海島有名/g,'海岛有名').replace(/海風有名/g,'海风有名').replace(/族譜/g,'族谱').replace(/傳/g,'传'));
 else document.title=base;
 // Typography enhances short Chinese titles by splitting them into glyph spans.
 // Rebuild them on language changes so translations can never stay trapped in old spans.
 for(const el of document.querySelectorAll('.ink-scripted')){
   const originalLabel=el.dataset.originalInkLabel||el.getAttribute('aria-label');
   if(!originalLabel)continue;
   el.dataset.originalInkLabel=originalLabel;
   const translated=valueFor(originalLabel,lang)||originalLabel;
   el.setAttribute('aria-label',translated);
   const frag=document.createDocumentFragment();
   [...translated].forEach((letter,i)=>{const c=document.createElement('span');c.className='ink-letter';c.textContent=letter;c.setAttribute('aria-hidden','true');c.style.setProperty('--ink-delay',(Math.min(i,16)*34)+'ms');frag.append(c)});
   el.replaceChildren(frag);el.classList.add('ink-visible');
 }
 const sw=document.querySelector('#sheliao-lang-switch');if(sw)sw.value=lang;
 let untranslated=0;if(lang==='en'||lang==='ja'){
   const article=document.querySelector('main');if(article){for(const e of article.querySelectorAll('p')){
     if(e.closest(ignored))continue;
     const raw=[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>original.get(n)||n.nodeValue).join('').trim();
     if(raw.length>50 && /[\u4e00-\u9fff]/u.test(raw) && !texts[raw]?.[lang])untranslated++;
   }}
 }
 const note=document.getElementById('sheliao-language-note');
 if(note){note.hidden=!(untranslated>0);note.textContent=lang==='en'?'Editorial note: some historical passages remain in their original Chinese while their translations are reviewed. Dates, names and unverified claims have not been silently adapted.':lang==='ja'?'編集上のご案内：一部の史料本文は翻訳監修中のため、原文の中国語で掲載しています。人名・年代・未確認事項を推測で補うことはしていません。':''}
}
function addSwitcher(){
 const header=document.querySelector('.museum-top')||document.querySelector('.admin-header .museum-top');
 if(!header||document.querySelector('#sheliao-lang-switch'))return;
 const box=document.createElement('div');box.className='sheliao-lang';
 const label=document.createElement('label');label.className='sheliao-lang-label';label.htmlFor='sheliao-lang-switch';label.textContent='LANGUAGE / 語言';
 const select=document.createElement('select');select.id='sheliao-lang-switch';select.setAttribute('aria-label','網站語言 / Site language / 言語');
 for(const [code,name] of versions){const o=document.createElement('option');o.value=code;o.textContent=name;select.appendChild(o)}
 const line=document.createElement('span');line.className='sheliao-lang-underline';line.setAttribute('aria-hidden','true');
 box.append(label,select,line);header.append(box);
 select.value=current;
 select.addEventListener('change',()=>{
   current=select.value;try{localStorage.setItem('sheliao-lang',current)}catch(_e){}
   const u=new URL(location.href);if(current==='zh-TW')u.searchParams.delete('lang');else u.searchParams.set('lang',current);
   history.replaceState(null,'',u.pathname+u.search+u.hash);
   box.classList.remove('language-changed');void box.offsetWidth;box.classList.add('language-changed');
   apply(current);
 });
 // Visible disclaimer when some long archival source material is not yet translated.
 const note=document.createElement('p');note.id='sheliao-language-note';note.className='sheliao-lang-note';note.hidden=true;
 const main=document.querySelector('main');if(main)main.prepend(note);
}
function start(){
 addSwitcher();apply(current);
 // Re-render only new nodes added by CMS/chart scripts, without rewriting user input.
 let busy=false;
 const watch=new MutationObserver(items=>{if(busy)return;const added=items.flatMap(x=>[...x.addedNodes]);if(!added.length)return;busy=true;for(const node of added){if(node.nodeType===Node.TEXT_NODE)changeNode(node,current);else if(node.nodeType===Node.ELEMENT_NODE && !node.closest?.(ignored)){
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let n;while((n=walker.nextNode()))changeNode(n,current);
 }}busy=false});
 watch.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
