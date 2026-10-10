/* 社寮王家　編修室輔助：人物索引、狀態標示、未發布提醒。不改動原有編輯與發布流程。 */
(()=>{'use strict';
/* 狀態列依文字內容標示狀態，並記錄是否有尚未發布的修改 */
let dirty=false;
document.querySelectorAll('.admin [role="status"]').forEach(el=>{
  const read=()=>{
    const t=el.textContent||'';let s='idle';
    if(/失敗|錯誤|請先|請輸入|缺少|必須|另一位編輯者/.test(t))s='error';
    else if(/尚未發布|未發布/.test(t)){s='dirty';dirty=true}
    else if(/已提交/.test(t)){s='done';dirty=false}
    else if(/正在|核對/.test(t))s='busy';
    else if(/已載入|可編輯/.test(t))s='ready';
    el.dataset.state=s;
  };
  new MutationObserver(read).observe(el,{childList:true,characterData:true,subtree:true});read();
});
addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});

/* 人物資料管理：依載入的人物卡建立左側索引 */
const entries=document.getElementById('entries'),list=document.getElementById('adminIndex');
if(entries&&list){
  const build=()=>{
    list.replaceChildren();
    entries.querySelectorAll('.edit-person').forEach((card,i)=>{
      const h=card.querySelector('h2');if(!h)return;
      card.id='person-'+(i+1);
      const li=document.createElement('li'),a=document.createElement('a');
      a.href='#'+card.id;a.textContent=h.textContent;li.append(a);list.append(li);
    });
  };
  new MutationObserver(build).observe(entries,{childList:true});build();
}

/* 個別史記編輯：左側人物清單與下拉選單同步 */
const select=document.getElementById('choosePerson'),rlist=document.getElementById('recordIndex');
if(select&&rlist){
  const mark=()=>rlist.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.name===select.value)));
  const build=()=>{
    rlist.replaceChildren();
    [...select.options].filter(o=>o.value).forEach(o=>{
      const li=document.createElement('li'),b=document.createElement('button');
      b.type='button';b.dataset.name=o.value;b.textContent=o.textContent;
      b.addEventListener('click',()=>{select.value=o.value;select.dispatchEvent(new Event('change',{bubbles:true}));mark();
        const f=document.getElementById('recordFields');if(f){const r=f.getBoundingClientRect();if(r.top<80||r.top>innerHeight*.7)f.scrollIntoView({behavior:'smooth',block:'start'})}});
      li.append(b);rlist.append(li);
    });
    mark();
  };
  new MutationObserver(build).observe(select,{childList:true});
  select.addEventListener('change',mark);build();
}
})();
