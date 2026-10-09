/* Soche-liao Wang reader: native, accessible progressive disclosure; family preface is always expanded. */
(()=>{'use strict';
const path=location.pathname;
if(/\/family\/?$/.test(path))return;
function wrap(node,summaryText,targets,opts={}){
 if(!node||node.querySelector(':scope > details.reading-disclosure'))return;
 const items=targets.filter(x=>x&&x.parentNode===node);
 if(!items.length)return;
 const d=document.createElement('details');d.className='reading-disclosure'+(opts.extra?' '+opts.extra:'');
 const s=document.createElement('summary');s.textContent=summaryText.trim()||'閱讀內容';
 const content=document.createElement('div');content.className='reading-disclosure-content';
 items[0].before(d);d.append(s,content);
 for(const item of items)content.append(item);
}
function direct(el,sel){return [...el.children].filter(x=>x.matches(sel))}
document.querySelectorAll('.biography-text').forEach(box=>{
 const original=[...box.children];let group=[],heading='';
 const flush=()=>{if(!group.length)return;wrap(box,heading||'編者補記',group);group=[]};
 original.forEach(child=>{
  if(child.tagName==='H3'){flush();heading=child.textContent;child.remove();}
  else if(child.matches('.biography-next')){flush()}
  else group.push(child);
 });flush();
});
document.querySelectorAll('article.secondgen-life').forEach(article=>{
 const content=article.querySelector(':scope > .secondgen-life-body');
 if(!content)return;
 const title=article.querySelector('.secondgen-life-heading h3')?.textContent||'閱讀列傳';
 wrap(article,'閱讀全文　'+title,[content]);
});
document.querySelectorAll('article.chronicle-item').forEach(article=>{
 const copy=article.querySelector(':scope > .chronicle-copy');if(!copy)return;
 const title=copy.querySelector('h3')?.textContent||'閱讀紀事';
 const year=article.querySelector('.chronicle-year')?.textContent?.trim()||'';
 wrap(article,year+'　'+title,[copy]);
});
document.querySelectorAll('.shipyard-history').forEach(box=>{
 const items=direct(box,'.shipyard-history-events,.shipyard-history-memory,.shipyard-history-sources');
 wrap(box,'展開產業沿革及參考史料',items);
});
document.querySelectorAll('article.island-history-step').forEach(el=>{
 const title=el.querySelector('h4')?.textContent||'地方沿革';
 const description=direct(el,'p');
 wrap(el,'閱讀　'+title,description);
});
document.querySelectorAll('article.origin').forEach(el=>{
 const title=el.querySelector('h3')?.textContent||'家系源流';
 wrap(el,'閱讀　'+title,direct(el,'p'));
});
document.querySelectorAll('article.courtyard-story').forEach(el=>{
 const b=el.querySelector('.courtyard-story-body');if(!b)return;
 wrap(b,'閱讀　'+(b.querySelector('h3')?.textContent||'庭院逸事'),direct(b,'p,small'));
});
document.querySelectorAll('.leisure-opening,.leisure-intro,.leisure-table,.leisure-ending').forEach(el=>{
 const title=el.querySelector('h3')?.textContent||el.querySelector(':scope > span')?.textContent||'詳情';
 wrap(el,'閱讀　'+title,direct(el,'p'));
});
document.querySelectorAll('.fire-history-annex').forEach(el=>{
 const blocks=direct(el,'.fire-annex-story,.fire-archive-library');wrap(el,'展開火警記錄與影音',blocks);
});
/* Stable deep links expand the relevant detail while keeping unrelated text collapsed. */
function openTarget(){
 if(!location.hash)return;
 let el;try{el=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch(e){return}
 if(!el)return;
 for(let p=el;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
 if(el.matches('.chronicle-item,.secondgen-life,.fire-history-annex,.shipyard-history,.island-history-step')){
  const d=el.querySelector(':scope > details.reading-disclosure')||el.querySelector('details.reading-disclosure');if(d)d.open=true;
 }
}
openTarget();window.addEventListener('hashchange',openTarget);
})();
