(()=>{
'use strict';
const DATA=window.ARCHIVE_DATA;if(!DATA){document.body.insertAdjacentHTML('afterbegin','<p style="padding:30px">資料檔案無法載入，請確定 data.js 與 index.html 在同一資料夾。</p>');return;}
const PRIVATE=DATA.meta.mode==='private';
const peopleKey='linwang_archive_persons_'+DATA.meta.mode+'_v1';
const savedPeople=DATA.meta.mode==='private'?(function(){try{return JSON.parse(localStorage.getItem(peopleKey)||'{}')}catch{return {}}})():{};
const byId=new Map(DATA.people.map(p=>[p.id,{...p,...(savedPeople[p.id]||{})}]));
DATA.people=Array.from(byId.values());
const localKey='linwang_archive_'+DATA.meta.mode+'_v1';
const noteKey='linwang_archive_notes_'+DATA.meta.mode+'_v1';
const $=(s,root=document)=>root.querySelector(s);const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const escapeHtml=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJson=s=>{try{return JSON.parse(s)}catch{return null}};
let localEvents=PRIVATE?(safeJson(localStorage.getItem(localKey))||[]):[];
let localNotes=PRIVATE?(safeJson(localStorage.getItem(noteKey))||{}):{};
let currentPage='home';let activePersonFilter='全部';let activeEventFilter='全部';let toastHandle;
const labels={private:'公開測試｜具名家族全本',public:'公開安全預覽 · 個資已遮蔽'};
$('#environmentTag').textContent=labels[DATA.meta.mode];
$('#footerMode').textContent=labels[DATA.meta.mode];
$('#importButton').hidden=!PRIVATE;
$('#heroQuote').textContent=DATA.meta.heroQuote;
if(PRIVATE){
 const portraitPerson=byId.get('wang_juwan');const portrait=portraitPerson?.photo;
 if(portrait){$('#heroPortrait').innerHTML=`<img src="${escapeHtml(portrait)}" alt="${escapeHtml(portraitPerson.name)}的家族近照" loading="eager">`;$('#portraitCaption').textContent=portraitPerson.name+'｜家屬提供影像';}
}else{ $('#addEvent').hidden=true; $('#addEvent').style.display='none'; }
$('#stats').innerHTML=`<div><strong>${PRIVATE?DATA.people.length:'3'}</strong><span>${PRIVATE?'人物紀錄':'家族世代'}</span></div><div><strong>${PRIVATE?DATA.events.length:'—'}</strong><span>${PRIVATE?'家族事件':'公開事件'}</span></div><div><strong>${DATA.records.length}</strong><span>史料線索</span></div>`;
const toast=(message)=>{const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastHandle);toastHandle=setTimeout(()=>el.classList.remove('show'),2700)};
function go(page){if(!$('#page-'+page))return;currentPage=page; $$('.screen').forEach(el=>el.classList.toggle('active',el.id==='page-'+page));$$('.nav-btn').forEach(el=>el.classList.toggle('active',el.dataset.page===page));window.scrollTo({top:0,behavior:'instant'});if(page==='tree')requestAnimationFrame(resetTree);}
$$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>go(btn.dataset.page)));
$$('.goto').forEach(btn=>btn.addEventListener('click',()=>go(btn.dataset.go)));
$('.brand-home').addEventListener('click',()=>go('home'));
const scene=$('#treeScene'),viewport=$('#treeViewport'),svg=$('#treeLines'),nodelayer=$('#treeNodes');
let zoom=.6,shiftX=0,shiftY=0,panning=false,panStart={x:0,y:0},initTransform={x:0,y:0};
function updateTree(){scene.style.transform=`translate(${shiftX}px,${shiftY}px) scale(${zoom})`;$('#zoomLabel').textContent=Math.round(zoom*100)+'%'}
function resetTree(){if(currentPage!=='tree')return;const r=viewport.getBoundingClientRect();if(r.width<=700){zoom=.72;shiftX=r.width*.44-zoom*585;shiftY=20;}else{zoom=Math.min(.76,Math.max(.45,(r.width-85)/2030));shiftX=Math.max(24,(r.width-2030*zoom)/2);shiftY=20;}updateTree()}
function setZoom(next,pivotX=viewport.clientWidth/2,pivotY=viewport.clientHeight/2){const old=zoom;zoom=Math.min(1.45,Math.max(.35,next));shiftX=pivotX-(pivotX-shiftX)*zoom/old;shiftY=pivotY-(pivotY-shiftY)*zoom/old;updateTree()}
$('#zoomIn').addEventListener('click',()=>setZoom(zoom+.12));$('#zoomOut').addEventListener('click',()=>setZoom(zoom-.12));$('#zoomReset').addEventListener('click',resetTree);
viewport.addEventListener('wheel',e=>{if(!$('#page-tree').classList.contains('active'))return;e.preventDefault();const r=viewport.getBoundingClientRect();setZoom(zoom*(e.deltaY<0?1.07:.93),e.clientX-r.left,e.clientY-r.top)},{passive:false});
viewport.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.node,button'))return;panning=true;panStart={x:e.clientX,y:e.clientY};initTransform={x:shiftX,y:shiftY};viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener('pointermove',e=>{if(!panning)return;shiftX=initTransform.x+e.clientX-panStart.x;shiftY=initTransform.y+e.clientY-panStart.y;updateTree()});
viewport.addEventListener('pointerup',()=>panning=false);viewport.addEventListener('pointercancel',()=>panning=false);
function renderTree(){
 const nodemap=new Map(DATA.nodes.map(n=>[n.id,n]));
 svg.innerHTML=DATA.edges.map(([from,to,relation])=>{const a=nodemap.get(from),b=nodemap.get(to);if(!a||!b)return'';const x1=a.x+a.w/2,y1=a.y+132,x2=b.x+b.w/2,y2=b.y;const curve=Math.max(54,(y2-y1)*.46);return `<path class="tree-line ${relation==='history'?'history':''}" d="M ${x1} ${y1} C ${x1} ${y1+curve}, ${x2} ${y2-curve}, ${x2} ${y2}"/>`;}).join('');
 nodelayer.innerHTML=DATA.nodes.map(n=>{
 const mixed=n.group==='林 × 王';const cl=n.uncertain?'pending':mixed?'mix':n.group==='林家'?'lin':'wang';const small=n.people.length===1;
 const people=n.people.map((id,i)=>{const p=byId.get(id);return `${i?'<span class="node-divider">×</span>':''}<button class="person-tag" type="button" data-person="${escapeHtml(id)}">${escapeHtml(p?.name||'待補')}</button>`}).join('');
 return `<div class="node ${cl}${small?' small':''}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px"><div class="node-overline">${escapeHtml(n.group)} · ${escapeHtml(n.caption)}</div><div class="node-people">${people}</div><div class="node-meta"><span>${n.ex?'↔ 已離婚 · 子女關係保留':n.uncertain?'◇ 未與主譜連線':small?'家族第三代':'檢視人物檔案 ↗'}</span></div></div>`;
 }).join('');
 $$('.person-tag',nodelayer).forEach(el=>el.addEventListener('click',()=>openPerson(el.dataset.person)));
}
renderTree();window.addEventListener('resize',()=>{if(currentPage==='tree')resetTree()});
function searchPerson(p,q){const content=[p.name,p.subtitle,p.bio,p.birth,p.death,...(p.aliases||[]),...(p.education||[]),...(p.tags||[])].join(' ').toLowerCase();return content.includes(q.toLowerCase())}
function renderPeople(){const q=$('#personSearch').value.trim();const list=DATA.people.filter(p=>(activePersonFilter==='全部'||p.family===activePersonFilter)&&(!q||searchPerson(p,q))).sort((a,b)=>a.generation-b.generation||a.name.localeCompare(b.name,'zh-Hant'));
 $('#personGrid').innerHTML=list.map(p=>`<button class="person-card" data-id="${escapeHtml(p.id)}" type="button"><span class="person-card-top"><span class="person-family">${escapeHtml(p.family)} · ${p.generation===1?'第一代':p.generation===2?'第二代':'第三代'}</span><span class="person-arrow">↗</span></span><strong class="person-name">${escapeHtml(p.name)}</strong><span class="person-subtitle">${escapeHtml(p.subtitle||'人物資料整理中')}</span><span class="person-card-bottom">${escapeHtml(p.source||'家族口述')}</span></button>`).join('');$('#peopleEmpty').hidden=list.length>0;
 $$('.person-card').forEach(el=>el.addEventListener('click',()=>openPerson(el.dataset.id)));
}
$('#personSearch').addEventListener('input',renderPeople);
$$('#peopleFilters .filter').forEach(btn=>btn.addEventListener('click',()=>{activePersonFilter=btn.dataset.family;$$('#peopleFilters .filter').forEach(x=>x.classList.toggle('active',x===btn));renderPeople()}));
renderPeople();
function showDate(p){let result=[];if(p.birth)result.push(p.birth);else if(p.birthdayGregorian)result.push('國曆 '+p.birthdayGregorian.replace('-','/')+'（年份待補）');if(p.death)result.push('— '+p.death);return result.join(' ')||'年代待補'}
function householdRelationships(id){
 const out=[];
 for(const r of (DATA.relations||[])){
  if(r.kind==='親子'){
   if(r.b===id)out.push({id:r.a,name:byId.get(r.a)?.name||'',label:'父母'});
   if(r.a===id)out.push({id:r.b,name:byId.get(r.b)?.name||'',label:'子女'});
  }else{
   if(r.a===id)out.push({id:r.b,name:byId.get(r.b)?.name||'',label:r.kind});
   if(r.b===id)out.push({id:r.a,name:byId.get(r.a)?.name||'',label:r.kind});
  }
 }
 return out.filter(r=>r.name);
}
const shade=$('#shade'),drawer=$('#personDrawer');
function openPerson(id){const p=byId.get(id);if(!p)return;const list=householdRelationships(id);
 const tags=(p.tags||[]).map(x=>`<span class="drawer-tag">${escapeHtml(x)}</span>`).join('');
 const listHtml=(items)=>items?.length?`<ul>${items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:'';
 const photo=p.photo?`<div class="drawer-photo"><img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}家族照片" loading="lazy"/></div>`:'';
 const rel=list.length?`<div class="drawer-section"><h4>FAMILY LINKS / 親屬關係</h4>${list.map(r=>`<div class="meta-row"><span>${escapeHtml(r.label)}</span><a href="#" data-related="${escapeHtml(r.id)}">${escapeHtml(r.name)} ↗</a></div>`).join('')}</div>`:'';
 const evForPerson=(DATA.events||[]).filter(ev=>(ev.people||[]).includes(id)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
 const moments=evForPerson.length?`<div class="drawer-section"><h4>PERSONAL TIMELINE / 相關人生事件</h4>${evForPerson.map(ev=>`<div class="meta-row"><span>${escapeHtml(isUndated(ev)?'日期待確認':ev.date)}</span><span>${escapeHtml(ev.title)}</span></div>`).join('')}</div>`:'';
 const sources=(DATA.records||[]).filter(r=>r.person===id&&r.url);
 const sourcesHtml=sources.length?`<div class="drawer-section"><h4>RECORDS / 社群與史料連結</h4>${sources.map(r=>`<div class="meta-row"><span>${escapeHtml(r.type)}</span><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)} ↗</a></div>`).join('')}<p class="drawer-disclaimer">家人提供的社群頁面只是研究線索，並未逐篇核實貼文。</p></div>`:'';
 const notes=PRIVATE?`<div class="drawer-section"><h4>PRIVATE NOTES / 本機家族備註</h4>${listHtml(p.notes)}<textarea id="noteEditor" rows="4" placeholder="僅在此裝置保存人物補充筆記…">${escapeHtml(localNotes[id]||'')}</textarea><button type="button" id="saveNote" class="btn-save">儲存本機筆記</button></div>`:'';
 $('#personContent').innerHTML=`${photo}<span class="drawer-kicker">THE FAMILY ARCHIVE / GENERATION ${p.generation}</span><h2 class="drawer-title">${escapeHtml(p.name)}</h2><div class="drawer-dates">${escapeHtml(showDate(p))}</div><p class="drawer-subtitle">${escapeHtml(p.subtitle||'')}</p>${p.aliases?.length?`<div class="meta-row"><span>曾用名</span><span>${escapeHtml(p.aliases.join(' · '))}</span></div>`:''}${p.lunarBirthday?`<div class="drawer-lunar">☽ ${escapeHtml(p.lunarBirthday)}</div>`:''}<div>${tags}</div><div class="drawer-section"><h4>BIOGRAPHY / 人物簡述</h4><p>${escapeHtml(p.bio||'個人生平待家族補充。')}</p></div>${p.education?.length?`<div class="drawer-section"><h4>EDUCATION / 求學</h4>${listHtml(p.education)}</div>`:''}${p.career?.length?`<div class="drawer-section"><h4>CAREER / 工作經歷</h4>${listHtml(p.career)}</div>`:''}${rel}${moments}${sourcesHtml}<div class="drawer-section"><h4>SOURCE / 資料來源</h4><p>${escapeHtml(p.source||'來源待查證')}</p></div>${notes}${PRIVATE?`<div class="drawer-section"><h4>EDIT / 修訂人物資料</h4><p class="drawer-disclaimer">資料會保存在此瀏覽器，匯出 JSON 備份才可跨裝置保存。此功能不會變更原始檔。</p><button class="btn-save" id="editPerson" type="button">編輯人物簡介</button><div id="editorTarget"></div></div>`:''}`;
 drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');shade.hidden=false;document.body.style.overflow='hidden';$('#closePerson').focus();
 $$('[data-related]',drawer).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openPerson(a.dataset.related)}));
 if(PRIVATE&&$('#saveNote'))$('#saveNote').addEventListener('click',()=>{localNotes[id]=$('#noteEditor').value;localStorage.setItem(noteKey,JSON.stringify(localNotes));toast('人物備註已保存在此瀏覽器')});
 if(PRIVATE&&$('#editPerson'))$('#editPerson').addEventListener('click',()=>editPerson(id));
}
function editPerson(id){
 const p=byId.get(id);if(!p)return;
 $('#editorTarget').innerHTML=`<form class="person-editor" id="personEditForm"><label>姓名<input name="name" maxlength="60" required value="${escapeHtml(p.name)}"></label><label>人物副標題<input name="subtitle" maxlength="140" value="${escapeHtml(p.subtitle||'')}"></label><label>出生資料（可不填）<input name="birth" maxlength="90" value="${escapeHtml(p.birth||'')}"></label><label>生平介紹<textarea name="bio" rows="7">${escapeHtml(p.bio||'')}</textarea></label><button class="btn-save" type="submit">儲存人物資料</button></form>`;
 $('#personEditForm').addEventListener('submit',ev=>{
  ev.preventDefault();const f=new FormData(ev.target);const patch={name:String(f.get('name')||'').trim(),subtitle:String(f.get('subtitle')||'').trim(),birth:String(f.get('birth')||'').trim(),bio:String(f.get('bio')||'').trim()};
  if(!patch.name)return;
  savedPeople[id]={...(savedPeople[id]||{}),...patch};localStorage.setItem(peopleKey,JSON.stringify(savedPeople));
  byId.set(id,{...byId.get(id),...patch});DATA.people=DATA.people.map(p=>p.id===id?{...p,...patch}:p);
  renderPeople();renderTree();openPerson(id);toast('已儲存人物修訂，請匯出備份');
 });
}
function closePerson(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');shade.hidden=true;document.body.style.overflow=''}
$('#closePerson').addEventListener('click',closePerson);shade.addEventListener('click',closePerson);
function isUndated(e){return !/^\d{4}-\d{2}-\d{2}$/.test(e.date||'')}
function timelineYear(e){return isUndated(e)?'年份待確認':e.date.slice(0,4)}
function niceDate(e){
 if(isUndated(e)){
  const d=(e.date||'').match(/(\d{2})-(\d{2})$/),end=(e.end||'').match(/(\d{2})-(\d{2})$/);
  return d?`${Number(d[1])}/${Number(d[2])}${end?' — '+Number(end[1])+'/'+Number(end[2]):''}（年份待確認）`:'日期待確認';
 }
 const first=e.date.replaceAll('-','.');return !e.end?first:first+' — '+e.end.replaceAll('-','.');
}
function renderTimeline(){
 const list=[...DATA.events,...localEvents]
  .filter(e=>activeEventFilter==='全部'||e.kind===activeEventFilter)
  .sort((a,b)=>((isUndated(b)?'0000-00-00':b.date)||'').localeCompare((isUndated(a)?'0000-00-00':a.date)||''));
 const years=[...new Set(list.map(timelineYear))];
 $('#timelineList').innerHTML=years.map(y=>`<div class="timeline-year"><div class="timeline-sticky">${escapeHtml(y)}</div><div class="timeline-year-content">${list.filter(e=>timelineYear(e)===y).map(e=>{const persons=(e.people||[]).map(id=>byId.get(id)?.name).filter(Boolean).join('、');return `<article class="timeline-entry"><div class="timeline-date">${escapeHtml(isUndated(e)?niceDate(e):niceDate(e).replace(y+'.',''))}</div><div><span class="kind">${escapeHtml(e.kind||'家族')}</span><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.description||'')}</p><div class="timeline-meta">${e.place?`<span>⌾ ${escapeHtml(e.place)}</span>`:''}${persons?`<span>♧ ${escapeHtml(persons)}</span>`:''}<span>來源：${escapeHtml(e.source||'家族口述')}</span></div></div></article>`}).join('')}</div></div>`).join('')||'<div class="empty">這個類別尚無紀錄。</div>';
}
$$('#eventFilters .filter').forEach(btn=>btn.addEventListener('click',()=>{activeEventFilter=btn.dataset.kind;$$('#eventFilters .filter').forEach(x=>x.classList.toggle('active',x===btn));renderTimeline()}));
renderTimeline();

function renderChronicle(){
 const chapters=DATA.chronicle||[];
 const chapterHtml=(c,i,mini=false)=>{
  const persons=(c.people||[]).map(id=>byId.get(id)).filter(Boolean);
  const personHtml=persons.length?`<div class="chronicle-person-links"><span>人物旁傳</span>${persons.map(p=>`<button type="button" class="chronicle-person" data-chronicle-person="${escapeHtml(p.id)}">${escapeHtml(p.name)} ↗</button>`).join('')}</div>`:'';
  return `<article class="chronicle-chapter ${mini?'is-preview':''}"><div class="chronicle-year">${escapeHtml(c.year)}</div><div class="chronicle-story"><div class="chronicle-kicker"><span>${escapeHtml(c.marker)}</span><span>${escapeHtml(c.status||'')}</span></div><h3>${escapeHtml(c.title)}</h3><p class="chronicle-narrative">${escapeHtml(c.narrative)}</p>${mini?'':`<blockquote>「${escapeHtml(c.quote||'')}」</blockquote>${personHtml}`}</div><div class="chronicle-number">${String(i+1).padStart(2,'0')}</div></article>`;
 };
 const chapter=$('#chronicleChapters');if(chapter)chapter.innerHTML=chapters.map((c,i)=>chapterHtml(c,i)).join('');
 const preview=$('#chroniclePreview');if(preview)preview.innerHTML=chapters.slice(0,3).map((c,i)=>chapterHtml(c,i,true)).join('');
 $$('[data-chronicle-person]').forEach(el=>el.addEventListener('click',()=>openPerson(el.dataset.chroniclePerson)));
}
renderChronicle();

function renderRecords(){const icon={照片:'▧','工商紀錄':'▤','社群連結':'↗','待收集':'＋','研究中':'◇'};
 $('#archiveList').innerHTML=DATA.records.map(x=>`<article class="archive-entry"><div class="archive-icon">${escapeHtml(icon[x.type]||'▥')}</div><div><h3>${escapeHtml(x.name)}</h3><p>${escapeHtml(x.description||'')}</p>${x.url?`<a href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer">查看外部資料 ↗</a>`:''}</div><div class="archive-source">${escapeHtml(x.type)} · ${escapeHtml(x.year)}<br>來源：${escapeHtml(x.source)}</div></article>`).join('')
}
renderRecords();
const modal=$('#modalBackdrop');
function closeModal(){modal.hidden=true;document.body.style.overflow=''}
$('#addEvent').addEventListener('click',()=>{if(!PRIVATE)return;modal.hidden=false;document.body.style.overflow='hidden';$('#eventForm').elements.title.focus()});
$('#closeModal').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
$('#eventForm').addEventListener('submit',e=>{e.preventDefault();if(!PRIVATE)return;const f=new FormData(e.target);const next={date:String(f.get('date')||''),title:String(f.get('title')||'').trim(),kind:String(f.get('kind')||'家族'),description:String(f.get('description')||'').trim(),people:[],place:'',source:'家屬新增 · 本機草稿'};if(!next.date||!next.title)return;localEvents.push(next);localStorage.setItem(localKey,JSON.stringify(localEvents));e.target.reset();closeModal();renderTimeline();toast('已新增事件，請記得匯出資料備份')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!modal.hidden)closeModal();if(drawer.classList.contains('open'))closePerson()}});
function exportData(){const pkg={metadata:{title:DATA.meta.title,mode:DATA.meta.mode,exportedAt:new Date().toISOString(),warning:PRIVATE?'私人家族檔案，請勿公開或上傳至公開 GitHub 倉庫':'去識別公開預覽資料'},...DATA,localEvents,localNotes,localPeople:savedPeople};const blob=new Blob([JSON.stringify(pkg,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='lin-wang-archive-'+DATA.meta.mode+'-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已匯出 JSON 備份')}
$('#exportButton').addEventListener('click',exportData);
$('#importButton').addEventListener('click',()=>{if(PRIVATE)$('#importFile').click()});
$('#importFile').addEventListener('change',async ev=>{
 if(!PRIVATE)return;const file=ev.target.files?.[0];if(!file)return;
 try{
  const data=JSON.parse(await file.text());
  if(data?.meta?.mode!=='private'||!Array.isArray(data.people)||!Array.isArray(data.localEvents)||!data.localPeople||typeof data.localPeople!=='object')throw new Error('檔案格式或版本不符');
  if(!confirm('匯入將取代此裝置上的人物修訂、事件草稿與備註。確定繼續嗎？'))return;
  localStorage.setItem(localKey,JSON.stringify(data.localEvents));localStorage.setItem(noteKey,JSON.stringify(data.localNotes||{}));localStorage.setItem(peopleKey,JSON.stringify(data.localPeople));location.reload();
 }catch(err){toast('匯入失敗：請使用本站的私人版 JSON 備份')}finally{ev.target.value=''}
});
})();
