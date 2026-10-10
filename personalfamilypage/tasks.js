/* Private family task manager. Data stays AES-GCM-encrypted in this browser, not in the public repository. */
(()=>{'use strict';
const STORE='sheliao-private-tasks-v1',encoder=new TextEncoder(),decoder=new TextDecoder();
const $=id=>document.getElementById(id);
const panel=$('privateTaskPanel'),frame=$('familyFrame'),openBtn=$('taskManagerButton'),closeBtn=$('tasksReturn');
if(!panel||!frame||!openBtn||!closeBtn)return;
let key=null,items=[],salt=null,editing=null,ready=false;
const toB64=bytes=>btoa(String.fromCharCode(...bytes));
const fromB64=str=>Uint8Array.from(atob(str),c=>c.charCodeAt(0));
function status(message,isError=false){const el=$('taskStatus');el.textContent=message;el.dataset.kind=isError?'error':'ok'}
function random(size){return crypto.getRandomValues(new Uint8Array(size))}
function clearForm(){$('taskForm').reset();editing=null;$('taskSave').textContent='新增任務';$('taskCancel').hidden=true;$('taskStatusSelect').value='待辦';$('taskPriority').value='一般'}
function visible(show){if(!ready)return;panel.hidden=!show;frame.hidden=show;openBtn.setAttribute('aria-pressed',String(show));if(show){render();$('taskTitle').focus({preventScroll:true})}else frame.focus({preventScroll:true})}
async function unlock(password){
 try{
  const raw=localStorage.getItem(STORE),saved=raw?JSON.parse(raw):null;
  if(saved&&(!saved.salt||!saved.iv||!saved.data||saved.v!==1))throw Error('任務資料格式不符，未覆蓋既有備份');
  salt=saved?fromB64(saved.salt):random(16);
  const material=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
  key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:180000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  if(saved){const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(saved.iv)},key,fromB64(saved.data));const parsed=JSON.parse(decoder.decode(plain));if(!Array.isArray(parsed))throw Error('任務備份內容不符');items=parsed}
  else items=[];
  ready=true;clearForm();render();status('任務資料已在本機加密載入；此裝置與瀏覽器獨立儲存，不會自動同步到其他家人。');
 }catch(e){key=null;items=[];ready=false;status('任務資料無法解鎖，已保留原始加密資料，請勿清除瀏覽器資料。',true);console.warn('Task storage unavailable:',e);throw e}
}
async function persist(){
 if(!ready||!key)throw Error('請先登入私人典藏館');
 const iv=random(12),data=encoder.encode(JSON.stringify(items));
 const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,data);
 localStorage.setItem(STORE,JSON.stringify({v:1,salt:toB64(salt),iv:toB64(iv),data:toB64(new Uint8Array(encrypted))}));
}
function view(item){
 const card=document.createElement('article');card.className='private-task-card';
 const top=document.createElement('div');top.className='private-task-cardtop';
 const heading=document.createElement('h3');heading.textContent=item.title;
 const label=document.createElement('span');label.className='private-task-pill';label.textContent=item.status||'待辦';
 top.append(heading,label);card.append(top);
 const meta=document.createElement('p');meta.className='private-task-meta';meta.textContent=[item.owner?'負責：'+item.owner:'',item.due?'期限：'+item.due:'',item.priority?'優先：'+item.priority:''].filter(Boolean).join('　／　')||'未設定期限';card.append(meta);
 if(item.detail){const p=document.createElement('p');p.className='private-task-desc';p.textContent=item.detail;card.append(p)}
 const actions=document.createElement('div');actions.className='private-task-actions';
 const edit=document.createElement('button');edit.type='button';edit.textContent='編輯';edit.addEventListener('click',()=>loadEdit(item.id));
 const done=document.createElement('button');done.type='button';done.textContent=item.status==='完成'?'改回待辦':'標示完成';done.addEventListener('click',async()=>{item.status=item.status==='完成'?'待辦':'完成';item.updated=new Date().toISOString();try{await persist();render();status('已更新任務狀態')}catch(e){status('儲存失敗：'+e.message,true)}});
 const remove=document.createElement('button');remove.type='button';remove.textContent='刪除';remove.className='quiet';remove.addEventListener('click',async()=>{if(!confirm('確定刪除「'+item.title+'」？此動作無法復原。'))return;items=items.filter(x=>x.id!==item.id);try{await persist();if(editing===item.id)clearForm();render();status('已刪除任務')}catch(e){status('儲存失敗：'+e.message,true)}});
 actions.append(edit,done,remove);card.append(actions);return card;
}
function render(){
 const list=$('taskList');list.replaceChildren();
 const filter=$('taskFilter').value;
 const filtered=items.filter(x=>filter==='全部'||(x.status||'待辦')===filter).sort((a,b)=>{
  const rank=s=>({'進行中':0,'待辦':1,'完成':2}[s]??3);
  return rank(a.status)-rank(b.status)||(a.due||'9999').localeCompare(b.due||'9999')||(b.updated||'').localeCompare(a.updated||'')
 });
 $('taskSummary').textContent='共 '+items.length+' 件　／　待辦 '+items.filter(x=>x.status==='待辦').length+'　／　進行中 '+items.filter(x=>x.status==='進行中').length+'　／　完成 '+items.filter(x=>x.status==='完成').length;
 if(!filtered.length){const empty=document.createElement('p');empty.className='task-empty';empty.textContent=items.length?'此狀態目前沒有任務。':'目前沒有任務，可從左側建立第一筆。';list.append(empty);return}
 filtered.forEach(x=>list.append(view(x)));
}
function loadEdit(id){const item=items.find(x=>x.id===id);if(!item)return;editing=id;$('taskTitle').value=item.title;$('taskOwner').value=item.owner||'';$('taskDue').value=item.due||'';$('taskPriority').value=item.priority||'一般';$('taskStatusSelect').value=item.status||'待辦';$('taskDetail').value=item.detail||'';$('taskSave').textContent='儲存修改';$('taskCancel').hidden=false;$('taskTitle').focus({preventScroll:true})}
$('taskForm').addEventListener('submit',async e=>{e.preventDefault();if(!ready)return;const title=$('taskTitle').value.trim();if(!title){status('請填寫任務名稱',true);return}
 const info={title,owner:$('taskOwner').value.trim(),due:$('taskDue').value,status:$('taskStatusSelect').value,priority:$('taskPriority').value,detail:$('taskDetail').value.trim(),updated:new Date().toISOString()};
 if(editing){const item=items.find(x=>x.id===editing);if(item)Object.assign(item,info)}else items.push({id:crypto.randomUUID(),created:new Date().toISOString(),...info});
 try{await persist();render();clearForm();status('任務已加密儲存至此瀏覽器')}catch(e){status('無法儲存：'+e.message,true)}
});
$('taskCancel').addEventListener('click',clearForm);
$('taskFilter').addEventListener('change',render);
$('tasksBackup').addEventListener('click',()=>{if(!ready)return;const text=localStorage.getItem(STORE);if(!text){status('尚未有可備份的任務',true);return}const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='社寮王家_任務管理_加密備份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);status('已下載加密備份；請妥善保管家族密碼')});
openBtn.addEventListener('click',()=>visible(panel.hidden));
closeBtn.addEventListener('click',()=>visible(false));
function lock(){ready=false;key=null;items=[];salt=null;editing=null;panel.hidden=true;frame.hidden=false;openBtn.setAttribute('aria-pressed','false');$('taskList').replaceChildren();clearForm();status('請登入私人典藏館以查看任務')}
window.FamilyTaskManager={unlock,lock};
})();