/* Local-only correspondence workspace. No passwords or contact info is committed to public GitHub. */
(()=>{'use strict';const $=id=>document.getElementById(id), KEY='sheliao-letter-studio-v1';
const presets={family:{name:'家書',subject:'給{recipient}的一封家書',body:'{recipient}：\n\n近日可好？這封信是想向你問候，也說說家中的近況。\n\n{occasion}，常讓我想起過去一家人團聚的時光。日子各自忙碌，仍盼能不時寫信，分享生活中值得留存的小事。\n\n願你一切平安順心。若有空，也盼收到你的回信。\n\n{sender}\n{date}'},official:{name:'公文／正式函件',subject:'有關{occasion}一事，敬請惠予協助',body:'受文者：{recipient}\n主旨：有關{occasion}一事，敬請惠予協助。\n\n說明：\n一、茲因相關事由，特函說明辦理背景及需求。\n二、相關文件或事證，得視需要另行檢附。\n\n辦法：敬請查照並惠予回覆；如有應補充事項，請不吝告知。\n\n此致\n{recipient}\n\n具函人：{sender}\n日期：{date}'},celebration:{name:'賀慶',subject:'恭賀{occasion}｜來自社寮王家的祝福',body:'{recipient}：\n\n欣聞{occasion}，心中十分歡喜，特此致上誠摯祝福。\n\n這份喜悅不只屬於今天，也記錄了一路走來的心意與努力。願未來的日子，有人相伴、有事可期，平凡之處也常有值得珍藏的光亮。\n\n敬祝平安、喜樂，萬事順心。\n\n{sender}\n{date}'}};
const clean=()=>({senders:[],contacts:[],templates:[],draft:null});let data;try{data=Object.assign(clean(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{data=clean()}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch{status('瀏覽器無法保存資料，請先下載備份')}};
const status=t=>$('letterState').textContent=t;
const emailValid=s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const fields=['recipient','senderName','occasion','letterDate','mailTo','subject','letterBody'];
const repl=t=>String(t).replace(/\{recipient\}/g,$('recipient').value.trim()||'收件人').replace(/\{sender\}/g,$('senderName').value.trim()||'具名人').replace(/\{occasion\}/g,$('occasion').value.trim()||'近日喜事').replace(/\{date\}/g,$('letterDate').value||new Date().toLocaleDateString('zh-TW'));
function preview(){ $('letterPreview').textContent=($('subject').value||'(無主旨)')+'\n\n'+($('letterBody').value||'(尚無正文)') }
function applyTemplate(){const t=presets[$('template').value];$('subject').value=repl(t.subject);$('letterBody').value=repl(t.body.replace(/\\n/g,'\n'));preview();status('已套用'+t.name+'範本，可繼續修改')}
function download(name,text,mime='application/json'){const u=URL.createObjectURL(new Blob([text],{type:mime}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),700)}
function renderSenders(){const s=$('senderSelect'),v=s.value;s.replaceChildren(new Option('以 Gmail 中選取的帳號寄出',''));data.senders.forEach(x=>s.add(new Option(x,x)));s.value=data.senders.includes(v)?v:''}
function renderContacts(){const s=$('contactSelect'),v=s.value;s.replaceChildren(new Option('選擇聯絡人',''));data.contacts.forEach((c,i)=>s.add(new Option(c.name+'｜'+c.email,String(i))));s.value=data.contacts[v]?v:''}
function renderCustom(){const s=$('customTemplate');s.replaceChildren(new Option('選擇已儲存模板',''));data.templates.forEach((x,i)=>s.add(new Option(x.name,String(i))))}
$('template').addEventListener('change',applyTemplate);$('applyTemplate').addEventListener('click',applyTemplate);$('makeLetter').addEventListener('click',applyTemplate);
$('saveCustom').addEventListener('click',()=>{const name=prompt('請輸入個人模板名稱');if(!name||!name.trim())return;const title=name.trim().slice(0,80);const rec={name:title,subject:$('subject').value,body:$('letterBody').value};const ix=data.templates.findIndex(x=>x.name===title);if(ix>=0)data.templates[ix]=rec;else data.templates.push(rec);persist();renderCustom();status('個人模板已儲存在此裝置')});
$('loadCustom').addEventListener('click',()=>{const t=data.templates[Number($('customTemplate').value)];if(!t)return;$('subject').value=t.subject;$('letterBody').value=t.body;preview();status('已讀取個人模板')});
$('deleteCustom').addEventListener('click',()=>{const i=$('customTemplate').value;if(i==='')return;if(!confirm('刪除此個人模板？'))return;data.templates.splice(+i,1);persist();renderCustom()});
$('senderSelect').addEventListener('change',()=>{$('senderAddress').value=$('senderSelect').value});
$('upsertSender').addEventListener('click',()=>{const v=$('senderAddress').value.trim(),old=$('senderSelect').value;if(!emailValid(v)){status('寄件 Gmail 格式不正確');return}if(old&&old!==v)data.senders=data.senders.filter(x=>x!==old);if(!data.senders.includes(v))data.senders.push(v);persist();renderSenders();$('senderSelect').value=v;status('已更新常用寄件 Gmail；請在 Gmail 撰信視窗核實帳號')});
$('removeSender').addEventListener('click',()=>{const v=$('senderSelect').value;if(!v)return;data.senders=data.senders.filter(x=>x!==v);persist();renderSenders();$('senderAddress').value='';status('已移除常用寄件 Gmail')});
$('contactSelect').addEventListener('change',()=>{const c=data.contacts[+$('contactSelect').value];if(!c)return;$('contactName').value=c.name;$('contactEmail').value=c.email;$('recipient').value=c.name;$('mailTo').value=c.email;preview()});
$('upsertContact').addEventListener('click',()=>{const name=$('contactName').value.trim(),email=$('contactEmail').value.trim();if(!name||!emailValid(email)){status('請提供聯絡人姓名及有效電子郵件');return}const ix=$('contactSelect').value;const selected=ix===''?-1:+ix;const same=data.contacts.findIndex(c=>c.email===email);const next={name:name.slice(0,100),email};if(selected>=0)data.contacts[selected]=next;else if(same>=0)data.contacts[same]=next;else data.contacts.push(next);persist();renderContacts();status('已更新聯絡人，資料僅存於本機')});
$('removeContact').addEventListener('click',()=>{const i=$('contactSelect').value;if(i==='')return;if(!confirm('移除此聯絡信箱？'))return;data.contacts.splice(+i,1);persist();renderContacts();status('已移除聯絡人')});
$('exportAddressBook').addEventListener('click',()=>download('社寮王家_私有聯絡簿.json',JSON.stringify({senders:data.senders,contacts:data.contacts},null,2)));
fields.forEach(id=>$(id).addEventListener('input',preview));
const current=()=>Object.fromEntries(fields.map(id=>[id,$(id).value]));
$('saveDraft').addEventListener('click',()=>{data.draft=current();persist();status('已儲存本機草稿，沒有公開上傳')});
$('restoreDraft').addEventListener('click',()=>{if(!data.draft){status('目前沒有草稿');return}fields.forEach(id=>$(id).value=data.draft[id]||'');preview();status('已恢復本機草稿')});
$('copyLetter').addEventListener('click',async()=>{const text=$('subject').value+'\n\n'+$('letterBody').value;try{await navigator.clipboard.writeText(text);status('已複製信函全文')}catch{status('瀏覽器未授權複製，請在欄位中手動複製')}});
$('exportDraft').addEventListener('click',()=>download('社寮王家_書函草稿.txt',$('subject').value+'\n\n'+$('letterBody').value,'text/plain;charset=utf-8'));
function args(){const to=$('mailTo').value.trim();if(!emailValid(to)){status('請先填入有效收件人 Gmail 或電子郵件');return null}if(!$('subject').value.trim()||!$('letterBody').value.trim()){status('請先完成主旨與內文');return null}return {to,subject:$('subject').value,body:$('letterBody').value}}
$('openGmail').addEventListener('click',()=>{const a=args();if(!a)return;const p=new URLSearchParams({view:'cm',fs:'1',to:a.to,su:a.subject,body:a.body});const sender=$('senderSelect').value;if(sender)p.set('authuser',sender);const w=window.open('https://mail.google.com/mail/?'+p.toString(),'_blank','noopener,noreferrer');if(!w)status('瀏覽器封鎖了新分頁；請允許本站開啟 Gmail');else status('已開啟 Gmail 撰信視窗；尚未寄出，請核對收件人與寄件帳號')});
$('openMailto').addEventListener('click',()=>{const a=args();if(a)location.href='mailto:'+encodeURIComponent(a.to)+'?'+new URLSearchParams({subject:a.subject,body:a.body})});
$('letterDate').value=new Date().toLocaleDateString('en-CA');renderSenders();renderContacts();renderCustom();applyTemplate();
})();
