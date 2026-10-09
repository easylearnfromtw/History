(()=>{'use strict';
const buttons=[...document.querySelectorAll('[data-person]')],article=document.getElementById('personArticle');
const title=document.getElementById('recordName'),meta=document.getElementById('recordMeta'),source=document.getElementById('recordSource'),notes=document.getElementById('recordNotes'),readMore=document.getElementById('recordReadMore');
const search=document.getElementById('personSearch'),index=document.getElementById('personNameIndex'),reader=document.getElementById('personRecord'),status=document.getElementById('relationsStatus');
let records={},statuses={},selected=null;
const names=[...new Set(buttons.map(x=>x.dataset.person))];
function taipeiDate(){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=k=>parts.find(x=>x.type===k)?.value||'';return get('year')+'-'+get('month')+'-'+get('day')}
function updateUrl(name){const u=new URL(location.href);u.searchParams.set('person',name);history.replaceState(null,'',u.pathname+u.search+u.hash)}
function element(tag,text,className){const el=document.createElement(tag);if(className)el.className=className;el.textContent=text||'';return el}
function currentEducation(profile){return profile.educationStatusFrom&&taipeiDate()>=profile.educationStatusFrom?profile.educationStatusAfter:profile.educationStatus}
function show(name,fromInteraction=false){
 const p=records[name];if(!p){status.textContent='查無此人物的公開紀錄';return}
 selected=name;
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.person===name)));
 index.querySelectorAll('[data-index-person]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.indexPerson===name)));
 title.textContent=name;meta.textContent=[p.group,p.role].filter(Boolean).join('　／　');
 article.replaceChildren();
 for(const part of p.sections||[]){if(part.heading)article.append(element('h3',part.heading));if(part.text)article.append(element('p',part.text))}
 notes.replaceChildren();const profile=statuses[name];
 if(profile){if(profile.ageRelation)notes.append(element('p','年齡關係　'+profile.ageRelation));const state=currentEducation(profile);if(state&&state!=='未提供')notes.append(element('p','學籍狀態　'+state));if(profile.statusNote)notes.append(element('p',profile.statusNote))}
 notes.hidden=!notes.childNodes.length;
 source.textContent='史料性質　'+(p.source||'家族口述，待考');
 readMore.replaceChildren();
 if(p.full){const link=element('a',name==='王居萬'||name==='王黃彩雲'?'閱讀完整人物列傳':'閱讀二代合傳');link.href=p.full;link.className='relations-deep-link';readMore.append(link)}
 status.textContent='目前閱讀　'+name+'史記';
 if(fromInteraction){updateUrl(name);if(window.innerWidth<=800)reader.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}
}
function rebuildIndex(filter=''){
 const query=filter.trim().toLocaleLowerCase();index.replaceChildren();
 for(const name of names){if(query&&!name.toLocaleLowerCase().includes(query))continue;const b=element('button',name);b.type='button';b.dataset.indexPerson=name;b.setAttribute('aria-pressed',String(selected===name));b.addEventListener('click',()=>show(name,true));index.append(b)}
 buttons.forEach(b=>b.classList.toggle('is-muted',!!query&&!b.dataset.person.toLocaleLowerCase().includes(query)));
 if(query&&!index.childElementCount)index.append(element('span','沒有符合的人物姓名'));
}
for(const button of buttons)button.addEventListener('click',()=>show(button.dataset.person,true));
search.addEventListener('input',()=>rebuildIndex(search.value));
search.addEventListener('keydown',event=>{if(event.key==='Enter'){const first=index.querySelector('[data-index-person]');if(first){event.preventDefault();show(first.dataset.indexPerson,true)}}});
Promise.all([
 fetch('../data/person-records.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('人物史記讀取失敗');return r.json()}),
 fetch('../data/people.json',{cache:'no-store'}).then(r=>r.ok?r.json():{people:{}}).catch(()=>({people:{}}))
]).then(([stories,people])=>{
 records=stories.records||{};statuses=people.people||{};
 rebuildIndex();
 const named=new URLSearchParams(location.search).get('person');
 show(named&&records[named]?named:'王居萬',false);
}).catch(error=>{
 status.textContent='人物資料暫時無法載入，可由上方家族史入口閱讀既有人物列傳';
 title.textContent='史料載入失敗';meta.textContent='請重新整理頁面';article.replaceChildren(element('p',String(error.message||error)));
});
})();
