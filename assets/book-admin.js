/* 王家傳｜海風有名小說編修室。書稿只在目前裝置上編輯；發布需獨立確認。 */
(()=>{'use strict';
const repo='easylearnfromtw/History';
const repoFile='literature/reader/manuscript.js';
const api=`https://api.github.com/repos/${repo}/contents/${repoFile}`;
const $=id=>document.getElementById(id);
let manuscript=null, sourceSha=undefined, dirty=false, activeChapter='1', activePage=7;
const chapterSelect=$('chapterSelect'),pageSelect=$('pageSelect'),chapterList=$('booksChapterList');
const inputFile=$('importBook'),editor=$('pageEditor'),state=$('bookStatus');
const previewKey='haifeng-cms-preview-v1';
function setStatus(t,level='neutral'){state.textContent=t;state.dataset.level=level}
function btn(text,kind){const e=document.createElement('button');e.type='button';e.textContent=text;if(kind)e.className=kind;return e}
function el(type,text){const x=document.createElement(type);if(text!==undefined)x.textContent=text;return x}
function clone(obj){return JSON.parse(JSON.stringify(obj))}
function assertValid(obj){
 if(!obj||!Array.isArray(obj.pages)||obj.pages.length<10||!Array.isArray(obj.chapters)||obj.chapters.length!==50||!Array.isArray(obj.parts)||obj.parts.length!==10)throw Error('不是《海風有名》五十回有效資料');
 obj.pages.forEach((p,i)=>{if(p.pdf!==i+1||!Array.isArray(p.blocks)||!p.blocks.every(b=>typeof b.text==='string'&&typeof b.type==='string'))throw Error('原稿第 '+(i+1)+' 頁格式不正確')});
 return obj;
}
function markDirty(message){dirty=true;setStatus(message||'變更尚未發布。請先下載 JSON 備份，必要時試讀版面。')}
function chapterLabel(index){if(index===0)return '序章｜壽宴上的兩種光';if(index===51)return '附錄與版本備考';return manuscript.chapters[index-1]?.name||`第 ${index} 回`}
/* Determine chapter membership at paragraph resolution: some chapter boundaries share a PDF page. */
function annotated(){const output=[];let chapter=0;for(const [pi,page] of manuscript.pages.entries()){
 let shared=[];
 for(const [bi,block] of page.blocks.entries()){
  if(page.pdf>=146)chapter=51;
  else if(block.type==='chapter'&&page.pdf>=7&&chapter<50)chapter++;
  shared.push({page:pi,block:bi,chapter,type:block.type,text:block.text});
 }
 output.push(shared);
 }return output;
}
function pagesForChapter(chapter){return annotated().flatMap((list,i)=>list.some(b=>b.chapter===+chapter)?[i+1]:[])}
function loadBook(obj,how){manuscript=clone(assertValid(obj));dirty=false;activeChapter='1';activePage=7;
 const stored={};try{const q=sessionStorage.getItem(previewKey);if(q)stored.book=JSON.parse(q)}catch(e){}
 chapterSelect.replaceChildren();for(let i=0;i<=51;i++){let o=el('option',chapterLabel(i));o.value=String(i);chapterSelect.append(o)}
 $('loadedInfo').textContent=`${manuscript.parts.length} 部 · ${manuscript.chapters.length} 回 · ${manuscript.pages.length} 頁`;
 $('metaTitle').value=manuscript.meta.title||'';$('metaVersion').value=manuscript.meta.version||'';$('metaNote').value=manuscript.meta.editorNote||'';
 ['exportJson','exportJs','previewBook','addParagraph'].forEach(id=>$(id).disabled=false);
 renderChapterList();chooseChapter(1);setStatus(how+'；現在可以編輯正文及回目，修改不會自動公開。','ok');
}
function renderChapterList(){chapterList.replaceChildren();const filter=$('chapterFilter').value.trim().toLowerCase();
 for(let i=0;i<=51;i++){const name=chapterLabel(i),li=el('li'),b=btn(name);b.dataset.chapter=String(i);b.setAttribute('aria-current',String(activeChapter===String(i)));b.addEventListener('click',()=>chooseChapter(i));li.append(b);li.hidden=!!filter&&!name.toLowerCase().includes(filter)&&!String(i).includes(filter);chapterList.append(li)}
}
function chooseChapter(n){if(!manuscript)return;activeChapter=String(n);let nums=pagesForChapter(n);if(!nums.length){setStatus('這個章節沒有原稿頁，請檢查章回標題。','error');return}
 $('chapterHeading').textContent=chapterLabel(n);
 chapterSelect.value=activeChapter;pageSelect.replaceChildren();nums.forEach(pg=>{let o=el('option',`第 ${pg} 頁`);o.value=String(pg);pageSelect.append(o)});
 activePage=nums.includes(activePage)?activePage:nums[0];pageSelect.value=String(activePage);renderPage();renderChapterList();
}
function makeRow(entry){const page=manuscript.pages[entry.page],block=page.blocks[entry.block];
 const wrap=el('article');wrap.className='books-block';const head=el('div');head.className='books-block-top';
 head.append(el('small',({p:'正文',chapter:'回目',part:'部名',heading:'附記',cover:'封面',toc:'目次'})[block.type]||block.type));
 if(block.type==='p'){const del=btn('刪除此段');del.addEventListener('click',()=>{if(!confirm('確定移除此段落？刪除後可以在下載的備份中恢復。'))return;page.blocks.splice(entry.block,1);markDirty('段落已移除，尚未發布');renderPage()});head.append(del)}
 wrap.append(head);const area=el('textarea');area.value=block.text;area.dataset.type=block.type;area.rows=block.type==='p'?Math.max(3,Math.min(9,Math.ceil(block.text.length/40))):2;
 area.setAttribute('aria-label',`原稿第 ${activePage} 頁，${block.type}文字`);
 area.addEventListener('input',()=>{
   block.text=area.value;
   if(block.type==='chapter'){
     const ch=manuscript.chapters[+activeChapter-1];
     if(ch){ch.name=area.value;ch.label=area.value.split('｜').slice(1).join('｜')||area.value}
     let next=false;for(let i=entry.page;i<manuscript.pages.length;i++){
      if(i>entry.page&&manuscript.pages[i].blocks.some(b=>b.type==='chapter'))break;
      manuscript.pages[i].running=area.value;
     }
     $('chapterHeading').textContent=area.value;chapterSelect.selectedOptions[0].textContent=area.value;
   }
   if(block.type==='part'){
     const pt=manuscript.chapters[+activeChapter-1]?.part||0;
     if(manuscript.parts[pt-1]){manuscript.parts[pt-1].name=area.value;manuscript.parts[pt-1].label=area.value.split('｜').slice(1).join('｜')||area.value}
     page.section=area.value;
   }
   markDirty('本頁文字已修改，尚未發布');
 });wrap.append(area);return wrap;
}
function renderPage(){if(!manuscript)return;const p=manuscript.pages[activePage-1];const entries=annotated()[activePage-1].filter(x=>x.chapter===+activeChapter);
 editor.replaceChildren();let head=el('div');head.className='books-page-header';head.append(el('h3',`原稿第 ${activePage} 頁`));head.append(el('small',p.section+'　／　'+p.running));editor.append(head);
 if(entries.length)entries.forEach(item=>editor.append(makeRow(item)));else editor.append(el('p','本頁暫無可編修段落。'));
 const characters=entries.map(e=>e.text).join('').length;if(characters>970){const warning=el('p','本頁字數較多，建議到閱讀器確認是否有溢出版面。');warning.className='books-warning';editor.append(warning)}
}
function createJson(){return JSON.stringify(manuscript,null,2)+'\n'}
function createScript(){// Executable data wrapper, with '<' escaped to avoid script-tag termination in downstream previews.
 return '/* 王家傳｜海風有名；來源：小說編修室。非出版定稿。 */\nwindow.HAIFENG_MANUSCRIPT='+JSON.stringify(manuscript).replace(/</g,'\\u003c')+';\n';
}
function download(filename,content,type){const u=URL.createObjectURL(new Blob([content],{type}));const a=el('a');a.href=u;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function decodeInput(raw){let s=raw.trim().replace(/^\uFEFF/,'');if(s.startsWith('{'))return JSON.parse(s);const m=s.match(/window\.HAIFENG_MANUSCRIPT\s*=\s*([\s\S]*?)\s*;\s*$/);if(!m)throw Error('JS 格式不符：請匯入由本編修室匯出的 manuscript.js');return JSON.parse(m[1])}
inputFile.addEventListener('change',async()=>{const file=inputFile.files?.[0];if(!file)return;try{if(file.size>20*1024*1024)throw Error('書稿檔案超過 20 MB');const data=decodeInput(await file.text());loadBook(data,'已從檔案匯入書稿');}catch(e){setStatus('匯入失敗：'+String(e.message||e),'error')}finally{inputFile.value=''}});
$('chapterFilter').addEventListener('input',renderChapterList);
chapterSelect.addEventListener('change',()=>chooseChapter(+chapterSelect.value));
pageSelect.addEventListener('change',()=>{activePage=+pageSelect.value;renderPage()});
for(const [field,prop] of [['metaTitle','title'],['metaVersion','version'],['metaNote','editorNote']]){$(field).addEventListener('input',e=>{if(!manuscript)return;manuscript.meta[prop]=e.target.value;markDirty('書籍版本與資料已修改，尚未發布')})}
$('addParagraph').addEventListener('click',()=>{
 const entries=annotated()[activePage-1].filter(x=>x.chapter===+activeChapter);const arr=manuscript.pages[activePage-1].blocks;
 const where=entries.length?entries[entries.length-1].block+1:arr.length;
 arr.splice(where,0,{type:'p',text:''});markDirty('已新增段落，尚未發布');renderPage();
});
$('exportJson').addEventListener('click',()=>{if(!manuscript)return;download('海風有名_書稿備份.json',createJson(),'application/json;charset=utf-8');setStatus('已產生完整 JSON 備份；包含未發布的修改。','ok')});
$('exportJs').addEventListener('click',()=>{if(!manuscript)return;download('manuscript.js',createScript(),'text/javascript;charset=utf-8');setStatus('已匯出可供閱讀器使用的 manuscript.js。','ok')});
$('previewBook').addEventListener('click',()=>{
 if(!manuscript)return;try{sessionStorage.setItem(previewKey,JSON.stringify(manuscript));const dest='../literature/reader/?preview=1';
  const newWin=window.open(dest,'_blank');if(!newWin){location.href=dest;return}setStatus('已開啟試讀視窗；使用同一瀏覽器的臨時預覽資料，不會發布到網路。','ok')
 }catch(e){setStatus('試讀需要從網站或 localhost 開啟。請先匯出書稿，或使用本機伺服器測試：'+String(e.message||e),'error')}
});
function toBase64(s){const bytes=new TextEncoder().encode(s);let out='';for(let i=0;i<bytes.length;i+=32768)out+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(out)}
function confirmReady(){return manuscript&&$('publicConsent').checked&&$('publicPhrase').value.trim()==='公開全書'&&!!$('bookToken').value.trim()}
function updatePublish(){ $('publishBook').disabled=!confirmReady(); }
for(const id of ['publicConsent','publicPhrase','bookToken'])$(id).addEventListener('input',updatePublish);
$('publishBook').addEventListener('click',async()=>{
 if(!confirmReady())return; if(!confirm('最後確認：這將把《海風有名》完整五十回小說全文送往公開 GitHub 儲存庫；即使日後刪除，也可能被快取或保留於 Git 歷史。確定已完成匿名化與發表授權，仍要公開嗎？'))return;
 const token=$('bookToken').value.trim(),button=$('publishBook');button.disabled=true;setStatus('正在核對 GitHub 最新版本……');
 try{const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'X-GitHub-Api-Version':'2022-11-28'};
  const response=await fetch(api+'?ref=main',{headers,cache:'no-store'});if(!response.ok&&response.status!==404)throw Error('無法讀取 GitHub 版本（HTTP '+response.status+'）');
  const remote=response.ok?await response.json():null;
  if(sourceSha!==undefined&&sourceSha!==(remote?.sha||null))throw Error('GitHub 內容已有其他人更新；為避免覆蓋，請重新載入最新版本後再編輯。');
  if(sourceSha===undefined&&remote)throw Error('GitHub 上已有書稿，請先取得最新資料版本，避免覆蓋。');
  const body={message:'Publish reviewed family novel manuscript from editorial CMS',branch:'main',content:toBase64(createScript())};if(remote?.sha)body.sha=remote.sha;
  const done=await fetch(api,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!done.ok){const err=await done.text();throw Error('發布失敗：HTTP '+done.status+' '+err.slice(0,170))}
  const saved=await done.json();sourceSha=saved.content?.sha||sourceSha;dirty=false;
  $('bookToken').value='';$('publicPhrase').value='';$('publicConsent').checked=false;setStatus('書稿已提交 GitHub；請等待 Pages 部署，並再次檢查公開網站。','ok');
 }catch(e){setStatus(String(e.message||e),'error')}finally{updatePublish()}
});
async function probeSha(){try{const r=await fetch(api+'?ref=main',{cache:'no-store'});if(r.status===404){sourceSha=null;return}if(r.ok){const d=await r.json();sourceSha=d.sha;return}}catch(e){}sourceSha=undefined;}
addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
if(window.HAIFENG_MANUSCRIPT){try{loadBook(window.HAIFENG_MANUSCRIPT,'已載入完整第二輪校樣')}catch(e){setStatus('原稿載入失敗：'+String(e.message||e),'error')}}
else {setStatus('尚未找到完整書稿：請使用右側匯入 JSON 或 manuscript.js；編修室可獨立使用。')}
probeSha();
})();
