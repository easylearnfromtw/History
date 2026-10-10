/* Non-invasive entry points: adds links to legacy admin and archive layouts without changing their text or data. */
(()=>{'use strict';
const ready=()=>{
 document.querySelectorAll('.admin-nav').forEach(nav=>{
  for(const [href,label] of [['histories.html','家族史／人物史'],['letters.html','家書・公文・賀慶']]){
   if(nav.querySelector(`a[href="${href}"]`))continue;
   const a=document.createElement('a');a.href=href;a.textContent=label;
   const back=[...nav.querySelectorAll('a')].find(x=>x.getAttribute('href')==='../');nav.insertBefore(a,back||null);
  }
 });
 const path=location.pathname;
 if(!/\/(family|archive|relations)\/?$/.test(path))return;
 const main=document.querySelector('main');if(!main||main.querySelector('.new-stories-links'))return;
 const section=document.createElement('aside');section.className='museum-shell new-stories-links';section.style.cssText='padding:22px 0 34px;border-top:1px solid #cbbb9e;letter-spacing:.08em;line-height:2';
 const p=document.createElement('p');p.textContent='新編史卷';p.style.fontSize='12px';section.append(p);
 const links=[['家族史新增篇章','../family/stories/'],['人物史新增篇章','../people/stories/']];
 for(const [name,url] of links){const a=document.createElement('a');a.href=url;a.textContent=name;a.style.cssText='display:inline-block;margin-right:24px;font-size:14px;color:#315342;border-bottom:1px solid #ad9268';section.append(a)}
 main.append(section);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
