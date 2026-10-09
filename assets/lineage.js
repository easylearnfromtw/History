
const t=document.querySelector('#siteMenu'),n=document.querySelector('#siteNav');t.addEventListener('click',()=>{const on=n.classList.toggle('open');t.setAttribute('aria-expanded',String(on))});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');t.setAttribute('aria-expanded','false')}));
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>io.observe(x))}else document.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible'));

const progress=document.querySelector('#readingProgress'),backtotop=document.querySelector('#jumpToTop');
let readingPending=false;
function updateReadingProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const fraction=max>0?Math.max(0,Math.min(1,window.scrollY/max)):0;
  if(progress)progress.style.width=(fraction*100).toFixed(2)+'%';
  if(backtotop)backtotop.classList.toggle('shown',window.scrollY>500);
  readingPending=false;
}
window.addEventListener('scroll',()=>{if(!readingPending){readingPending=true;requestAnimationFrame(updateReadingProgress)}},{passive:true});
window.addEventListener('resize',updateReadingProgress,{passive:true});updateReadingProgress();

/* Keyboard and touch friendly chapter navigation */
const chapterButtons=[...document.querySelectorAll('[data-mobile-chapter]')];
const chapters=[...document.querySelectorAll('#about,#caiyun,#juwan,#secondgen,#chronicle,#lineage')];
function closeNavigation(){
 n.classList.remove('open');
 t.setAttribute('aria-expanded','false');
}
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&n.classList.contains('open')){closeNavigation();t.focus()}
});
document.addEventListener('pointerdown',event=>{
 if(n.classList.contains('open')&&!n.contains(event.target)&&!t.contains(event.target))closeNavigation();
},{passive:true});
const chapterObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 const visible=entries.filter(entry=>entry.isIntersecting);
 if(!visible.length)return;
 visible.sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top));
 const id=visible[0].target.id;
 const current=['caiyun','juwan','secondgen'].includes(id)?'caiyun':id;
 chapterButtons.forEach(btn=>{
  if(btn.dataset.mobileChapter===current)btn.setAttribute('aria-current','location');
  else btn.removeAttribute('aria-current');
 });
},{rootMargin:'-18% 0px -58% 0px',threshold:0}):null;
if(chapterObserver)chapters.forEach(chapter=>chapterObserver.observe(chapter));
chapterButtons.forEach(btn=>btn.addEventListener('click',()=>closeNavigation()));


/* Expandable public lineage branches */
const lineageBranches=[...document.querySelectorAll('.lineage-branch')];
const lineageAll=document.querySelector('#lineageToggleAll');
if(lineageAll&&lineageBranches.length){
 const updateLineageToggle=()=>{
  const everyOpen=lineageBranches.every(item=>item.open);
  lineageAll.textContent=everyOpen?'收合全譜':'展開全譜';
  lineageAll.setAttribute('aria-expanded',String(everyOpen));
 };
 lineageAll.addEventListener('click',()=>{
  const shouldOpen=!lineageBranches.every(item=>item.open);
  lineageBranches.forEach(item=>item.open=shouldOpen);
  updateLineageToggle();
 });
 lineageBranches.forEach(item=>item.addEventListener('toggle',updateLineageToggle));
 updateLineageToggle();
}

/* Public lineage individual records without sensitive attributes */
const publicLineageRecords={
 "王居萬":{group:"王家祖輩",bio:"王氏居萬少歷軍旅　據家屬所述曾就讀政治作戰學校　官至陸軍上尉　曾任輔導長　後於社寮參與鄉里公益",rel:[["配偶",["王黃彩雲"]],["子女",["王曉芬","王美玲","王俊明","王螢家"]]],chapter:"../../people/juwan/",source:"據家族口述整理　詳細事蹟參閱王居萬傳"},
 "王黃彩雲":{group:"王家祖輩",bio:"黃氏彩雲出自汐止黃家　少時曾從事紡織與家庭代工　後與居萬成家於社寮　經營撞球間及和平檳榔店　後人尤念其勤儉與遠見",rel:[["配偶",["王居萬"]],["子女",["王曉芬","王美玲","王俊明","王螢家"]]],chapter:"../../people/caiyun/",source:"據家族口述整理　詳細事蹟參閱王黃彩雲傳"},
 "王俊明":{group:"王家第二代　長子",chapter:"../second-generation/#wang-junming",bio:"王氏俊明為居萬彩雲之子　家族譜系錄其婚姻與二名子女",rel:[["父母",["王居萬","王黃彩雲"]],["曾配偶",["鄧越鴻"]],["子女",["王翔立","王品媗"]],["現配偶",["小梅"]]],source:"家屬提供親屬關係"},
 "王曉芬":{group:"王家第二代　長女",chapter:"../second-generation/#wang-xiaofen",bio:"王氏曉芬為居萬彩雲之女　少時就讀基隆中正國中　後入基隆商工　並就讀龍華科技大學　與林衞國結縭　育有哲緯哲愷二子　並曾參與家族事業之經營",education:[["國中","基隆中正國中"],["高中","基隆商工"],["大學","龍華科技大學"]],rel:[["父母",["王居萬","王黃彩雲"]],["配偶",["林衞國"]],["子女",["林哲緯","林哲愷"]]],source:"家屬提供親屬關係及事業經歷"},
 "王美玲":{group:"王家第二代　次女",chapter:"../second-generation/#wang-meiling",bio:"王氏美玲為居萬彩雲之女　與陳建成結縭　育有季佑一子",rel:[["父母",["王居萬","王黃彩雲"]],["配偶",["陳建成"]],["子女",["陳季佑"]]],source:"家屬提供親屬關係"},
 "王螢家":{group:"王家第二代　么女",chapter:"../second-generation/#wang-yingjia",bio:"王氏螢家為居萬彩雲之女　與李心為結縭　育有芸閑永彤二女",rel:[["父母",["王居萬","王黃彩雲"]],["配偶",["李心為"]],["子女",["李芸閑","李永彤"]]],source:"家屬提供親屬關係"},
 "鄧越鴻":{group:"王家姻親",bio:"王俊明前配偶　王翔立及王品媗之母",rel:[["曾配偶",["王俊明"]],["子女",["王翔立","王品媗"]]],source:"家屬提供親屬關係"},
 "小梅":{group:"王家姻親",bio:"王俊明現配偶　家人稱小梅　正式姓名尚待確認",rel:[["配偶",["王俊明"]]],source:"小梅為家族稱呼　非正式姓名記載"},
 "林衞國":{group:"王家姻親",bio:"王曉芬之夫　與曉芬共育哲緯哲愷二子　曾共同經營家族事業",rel:[["配偶",["王曉芬"]],["子女",["林哲緯","林哲愷"]]],source:"家屬提供親屬關係"},
 "陳建成":{group:"王家姻親",bio:"王美玲之夫　陳季佑之父",rel:[["配偶",["王美玲"]],["子女",["陳季佑"]]],source:"家屬提供親屬關係"},
 "李心為":{group:"王家姻親",bio:"王螢家之夫　李芸閑與李永彤之父",rel:[["配偶",["王螢家"]],["子女",["李芸閑","李永彤"]]],source:"家屬提供親屬關係"},
 "王翔立":{group:"王家第三代",bio:"王俊明與鄧越鴻之子　為王家後輩",rel:[["父母",["王俊明","鄧越鴻"]],["手足",["王品媗"]]],source:"家屬提供親屬關係"},
 "王品媗":{group:"王家第三代",bio:"王俊明與鄧越鴻之女　為王家後輩",rel:[["父母",["王俊明","鄧越鴻"]],["手足",["王翔立"]]],source:"家屬提供親屬關係"},
 "林哲緯":{group:"王家第三代",bio:"王曉芬與林衞國之長子　為王家外孫",rel:[["父母",["王曉芬","林衞國"]],["手足",["林哲愷"]]],source:"家屬提供親屬關係"},
 "林哲愷":{group:"王家第三代",alias:"字　敻詠　　號　淺山居士",bio:"林氏哲愷　字敻詠　號淺山居士　為曉芬與衞國之次子　王家外孫　參與家族族譜之編纂",rel:[["父母",["王曉芬","林衞國"]],["手足",["林哲緯"]]],source:"字號及親屬關係據家屬最新確認"},
 "陳季佑":{group:"王家第三代",bio:"王美玲與陳建成之子　為王家外孫",rel:[["父母",["王美玲","陳建成"]]],source:"家屬提供親屬關係"},
 "李芸閑":{group:"王家第三代",bio:"王螢家與李心為之女　為王家外孫女",rel:[["父母",["王螢家","李心為"]],["手足",["李永彤"]]],source:"家屬提供親屬關係"},
 "李永彤":{group:"王家第三代",bio:"王螢家與李心為之女　為王家外孫女",rel:[["父母",["王螢家","李心為"]],["手足",["李芸閑"]]],source:"家屬提供親屬關係"}
};
const personOverlay=document.querySelector('#lineagePersonOverlay');
const personSheet=document.querySelector('#lineagePersonSheet');
const personContent=document.querySelector('#lineagePersonContent');
let lastPersonTrigger=null;
let activePersonName=null;
const personHistory=[];
let lineageSteppingBack=false;
function escapeLineageText(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function openLineagePerson(name,trigger){
 const record=publicLineageRecords[name];if(!record)return;
 const isOpening=personOverlay.hidden;
 if(isOpening){lastPersonTrigger=trigger||document.activeElement;document.body.classList.add('lineage-modal-open');}
 if(!isOpening&&!lineageSteppingBack&&activePersonName&&activePersonName!==name)personHistory.push(activePersonName);
 activePersonName=name;
 document.querySelector('#lineagePersonBack').hidden=!personHistory.length;
 personOverlay.hidden=false;
 document.querySelector('#lineagePersonName').textContent=name;
 document.querySelector('#lineagePersonRole').textContent=record.group;
 const aliasEl=document.querySelector('#lineagePersonAlias');
 aliasEl.hidden=!record.alias;aliasEl.textContent=record.alias||'';
 document.querySelector('#lineagePersonBio').textContent=record.bio;
 const educationBox=document.querySelector('#lineagePersonEducation');
 educationBox.hidden=!(record.education&&record.education.length);
 educationBox.replaceChildren();
 if(record.education&&record.education.length){
  const label=document.createElement('span');label.className='lineage-person-education-title';label.textContent='求學經歷';educationBox.append(label);
  for(const [stage,school] of record.education){const row=document.createElement('div');row.className='lineage-person-education-row';const a=document.createElement('span');a.textContent=stage;const b=document.createElement('strong');b.textContent=school;row.append(a,b);educationBox.append(row);}
 }
 document.querySelector('#lineagePersonCitation').textContent=record.source||'家屬口述';
 const relContainer=document.querySelector('#lineagePersonRelations');
 relContainer.innerHTML=(record.rel||[]).map(([label,names])=>'<div class="lineage-person-relrow"><span>'+escapeLineageText(label)+'</span><div>'+names.map(n=>'<button type="button" data-person="'+escapeLineageText(n)+'">'+escapeLineageText(n)+'</button>').join('')+'</div></div>').join('');
 document.querySelector('#lineagePersonActions').innerHTML=record.chapter?'<a href="'+record.chapter+'" data-person-read>閱讀人物列傳</a>':'';
 personSheet.scrollTop=0;
 if(isOpening)document.querySelector('#lineagePersonClose').focus({preventScroll:true});
}
function closeLineagePerson(){
 if(personOverlay.hidden)return;
 personOverlay.hidden=true;
 document.body.classList.remove('lineage-modal-open');
 activePersonName=null;
 personHistory.length=0;
 document.querySelector('#lineagePersonBack').hidden=true;
 const target=lastPersonTrigger;lastPersonTrigger=null;
 if(target&&target.isConnected)target.focus({preventScroll:true});
}
document.querySelector('#lineage').addEventListener('click',event=>{
 const trigger=event.target.closest('[data-person]');
 if(!trigger)return;
 if(trigger.closest('summary')){event.preventDefault();event.stopPropagation();}
 openLineagePerson(trigger.dataset.person,trigger);
});
document.querySelector('#lineage').addEventListener('keydown',event=>{
 const trigger=event.target.closest('.lineage-name-trigger');
 if(trigger&&(event.key==='Enter'||event.key===' ')){
  event.preventDefault();event.stopPropagation();openLineagePerson(trigger.dataset.person,trigger);
 }
});
personContent.addEventListener('click',event=>{
 const other=event.target.closest('[data-person]');
 if(other){openLineagePerson(other.dataset.person,other);return;}
 const reading=event.target.closest('[data-person-read]');
 if(reading)closeLineagePerson();
});
document.querySelector('#lineagePersonClose').addEventListener('click',closeLineagePerson);
personOverlay.querySelector('[data-close-person]').addEventListener('click',closeLineagePerson);
document.addEventListener('keydown',event=>{
 if(personOverlay.hidden)return;
 if(event.key==='Escape'){event.preventDefault();closeLineagePerson();return;}
 if(event.key==='Tab'){
  const focusable=[...personSheet.querySelectorAll('button:not([disabled]),a[href]')].filter(x=>x.offsetParent!==null);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});

/* Connect published life histories to the interactive family chart */
document.querySelectorAll('.secondgen-profile-link').forEach(button=>{
 button.addEventListener('click',()=>openLineagePerson(button.dataset.person,button));
});

/* Public person discovery and accessible reading controls */
const finder=document.querySelector('#personFinder');
const finderInput=document.querySelector('#personFinderInput');
const finderResults=document.querySelector('#personFinderResults');
const finderCount=document.querySelector('#personFinderCount');
const finderOpenBtn=document.querySelector('#openPersonFinder');
const finderCloseBtn=document.querySelector('#closePersonFinder');
const finderSheet=finder.querySelector('.quick-find-sheet');
const publicNames=Object.keys(publicLineageRecords);
let finderReturnFocus=null;
function showFinder(){
 if(!personOverlay.hidden)closeLineagePerson();
 closeNavigation();
 finderReturnFocus=document.activeElement;
 finder.hidden=false;
 document.body.classList.add('finder-open');
 finderInput.value='';
 renderFinder('');
 requestAnimationFrame(()=>finderInput.focus({preventScroll:true}));
}
function hideFinder(){
 if(finder.hidden)return;
 finder.hidden=true;
 document.body.classList.remove('finder-open');
 if(finderReturnFocus&&finderReturnFocus.isConnected)finderReturnFocus.focus({preventScroll:true});
 finderReturnFocus=null;
}
function normalizeFinderQuery(value){
 return String(value).normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,'').trim();
}
function renderFinder(value){
 const q=normalizeFinderQuery(value);
 const names=publicNames.filter(name=>{
  if(!q)return ['王居萬','王黃彩雲','王曉芬','王美玲','王俊明','王螢家','林哲愷'].includes(name);
  const person=publicLineageRecords[name];
  return normalizeFinderQuery(name+' '+(person.alias||'')+' '+person.group+' '+(person.bio||'')+' '+(person.education||[]).flat().join(' ')).includes(q);
 }).sort((a,b)=>{
  const aScore=q&&normalizeFinderQuery(a).startsWith(q)?-1:0;
  const bScore=q&&normalizeFinderQuery(b).startsWith(q)?-1:0;
  return aScore-bScore||publicNames.indexOf(a)-publicNames.indexOf(b);
 });
 finderCount.textContent=q?'找到 '+names.length+' 位人物':'常用人物';
 finderResults.replaceChildren();
 if(!names.length){
  const note=document.createElement('p');note.className='quick-find-empty';note.textContent='沒有符合的公開紀錄　可嘗試其他姓名';finderResults.append(note);return;
 }
 for(const name of names){
  const person=publicLineageRecords[name];
  const row=document.createElement('button');row.type='button';row.className='quick-find-result';row.dataset.findPerson=name;
  const details=document.createElement('span');
  const title=document.createElement('span');title.className='quick-find-result-name';title.textContent=name;
  const desc=document.createElement('small');desc.className='quick-find-result-category';desc.textContent=person.group+(person.alias?'　'+person.alias:'');
  details.append(title,desc);
  const action=document.createElement('span');action.className='quick-find-result-action';action.textContent='查看紀錄';
  row.append(details,action);finderResults.append(row);
 }
 finderResults.scrollTop=0;
}
finderOpenBtn.addEventListener('click',showFinder);
finderCloseBtn.addEventListener('click',hideFinder);
document.querySelector('#finderShade').addEventListener('click',hideFinder);
finderInput.addEventListener('input',()=>renderFinder(finderInput.value));
finderResults.addEventListener('click',event=>{
 const button=event.target.closest('[data-find-person]');
 if(!button)return;
 const name=button.dataset.findPerson;
 hideFinder();
 openLineagePerson(name,finderOpenBtn);
});
finderInput.addEventListener('keydown',event=>{
 if(event.key==='Enter'){
  const first=finderResults.querySelector('[data-find-person]');
  if(first){event.preventDefault();first.click();}
 }
});
document.addEventListener('keydown',event=>{
 if((event.key==='/'||event.key==='k'&&(event.metaKey||event.ctrlKey))&&!event.altKey&&!event.shiftKey&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'')&&!document.activeElement?.isContentEditable){
  event.preventDefault();if(finder.hidden)showFinder();else finderInput.focus();
 }
 if(finder.hidden)return;
 if(event.key==='Escape'){event.preventDefault();hideFinder();return;}
 if(event.key==='Tab'){
  const focusable=[...finderSheet.querySelectorAll('button:not([disabled]),input:not([disabled])')].filter(el=>el.offsetParent!==null);
  if(!focusable.length)return;
  if(event.shiftKey&&document.activeElement===focusable[0]){event.preventDefault();focusable[focusable.length-1].focus();}
  else if(!event.shiftKey&&document.activeElement===focusable[focusable.length-1]){event.preventDefault();focusable[0].focus();}
 }
});
document.querySelector('#lineagePersonBack').addEventListener('click',()=>{
 const prev=personHistory.pop();if(!prev)return;
 lineageSteppingBack=true;openLineagePerson(prev);lineageSteppingBack=false;
 const backControl=document.querySelector('#lineagePersonBack');
 (backControl.hidden?document.querySelector('#lineagePersonClose'):backControl).focus({preventScroll:true});
});
const readingSizeToggle=document.querySelector('#readingSizeToggle');
function applyTextSize(isLarger){
 document.documentElement.classList.toggle('reader-larger',isLarger);
 readingSizeToggle.setAttribute('aria-pressed',String(isLarger));
 readingSizeToggle.setAttribute('aria-label',isLarger?'還原正文文字大小':'放大正文文字');
 readingSizeToggle.querySelector('span').textContent=isLarger?'乙':'甲';
 try{localStorage.setItem('wang-reading-larger',isLarger?'1':'0')}catch(error){}
}
let savedLarge=false;
try{savedLarge=localStorage.getItem('wang-reading-larger')==='1'}catch(error){}
applyTextSize(savedLarge);
readingSizeToggle.addEventListener('click',()=>applyTextSize(!document.documentElement.classList.contains('reader-larger')));


/* Open a named person from a biography's direct link. */
try{const requested=new URLSearchParams(window.location.search).get("person");if(requested&&publicLineageRecords[requested])requestAnimationFrame(()=>openLineagePerson(requested,document.querySelector("#openPersonFinder")));}catch(e){}
