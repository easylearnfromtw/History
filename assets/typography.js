/* 社寮王家 | 書卷文字動態：純展示增強，不改動史料、人物關係或私人族譜。 */
(()=>{'use strict';
  const current=document.currentScript;
  const fileURL=current?.src||new URL('assets/typography.js',location.href).href;
  const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if(motion?.matches||!('IntersectionObserver' in window))return;
  const style=document.createElement('link');
  style.rel='stylesheet';style.href=new URL('typography.css',fileURL).href;
  let started=false;
  function init(){
    if(started)return;started=true;
    const elements=new Set();
    const characters=[
      '.home-title-main','.home-title-sub','.home-chapter-aside h2',
      '.home-person h3 > a','.museum-page-hero h1','.fiction-title',
      '.museum-collection-card h2','.more-card h3','.appendix-card h3',
      '.notfound h1'
    ];
    const ribbons=[
      '.home-intro-copy','.home-chapter-aside small','.home-summary-names',
      '.home-person-source','.museum-page-hero > p','.biography-subtitle',
      '.fiction-lead','.fiction-grid h2','.home-caption',
      '.museum-collection-card > p','.more-card > p',
      '.ref-group h2','.tl-era-title','.biography-head',
      '.preface-heading','.origin-title'
    ];
    function split(el){
      if(el.children.length||el.classList.contains('ink-ready')||el.closest('.welcome,[contenteditable],.museum-header,.museum-footer'))return;
      const clean=el.textContent.trim();
      const chars=(typeof Intl.Segmenter==='function')
        ?[...new Intl.Segmenter('zh-Hant',{granularity:'grapheme'}).segment(clean)].map(x=>x.segment)
        :Array.from(clean);
      if(chars.length<2||chars.length>14||!/[\u3400-\u9fff]/.test(clean))return;
      const accessible=document.createElement('span');accessible.className='ink-sr';accessible.textContent=clean;
      const visual=document.createElement('span');visual.className='ink-glyphs';visual.setAttribute('aria-hidden','true');
      chars.forEach((ch,i)=>{
        const glyph=document.createElement('span');glyph.className='ink-glyph';
        glyph.textContent=/^\s+$/.test(ch)?'\u00a0':ch;
        glyph.style.setProperty('--ink-index',i);
        visual.append(glyph);
      });
      el.replaceChildren(accessible,visual);el.classList.add('ink-ready');elements.add(el);
    }
    characters.forEach(sel=>document.querySelectorAll(sel).forEach(split));
    document.querySelectorAll('.biography-title h2').forEach(h=>{
      if(h.classList.contains('ink-person-ready'))return;
      const textNode=[...h.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(!textNode)return;
      const name=textNode.textContent.trim();if(name.length>14)return;
      const span=document.createElement('span');span.className='ink-person-name';span.textContent=name;
      h.replaceChild(span,textNode);h.classList.add('ink-person-ready');split(span);
    });
    ribbons.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{
      if(el.classList.contains('ink-ready')||el.classList.contains('type-fade')||el.closest('.welcome,.museum-header,.museum-footer'))return;
      el.classList.add('type-fade');
      if(el.matches('.home-caption,.home-person-source'))el.style.setProperty('--fade-delay','100ms');
      elements.add(el);
    }));
    document.querySelectorAll('.home-chapter .home-copy').forEach(copy=>{
      [...copy.children].filter(el=>el.matches('p')).forEach((p,i)=>{
        p.classList.add('type-paragraph');p.style.setProperty('--fade-delay',String(Math.min(i,3)*115)+'ms');
        elements.add(p);
      });
    });
    document.querySelectorAll('.biography-text blockquote,.fiction-grid blockquote,.preface blockquote').forEach(el=>{
      el.classList.add('type-quotation');elements.add(el);
    });
    document.querySelectorAll('.home-numeral').forEach(el=>{el.classList.add('type-numeral');elements.add(el)});
    document.querySelectorAll('.home-intro-line,.biography-rule,.fiction-rule').forEach(el=>{el.classList.add('type-rule');elements.add(el)});
    document.querySelectorAll('.museum-page-hero,.home-intro,.relations-lede').forEach(el=>{el.classList.add('type-drawn');elements.add(el)});
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('ink-in','type-in');observer.unobserve(entry.target);
      });
    },{threshold:.035,rootMargin:'0px 0px -12px 0px'});
    elements.forEach(el=>observer.observe(el));
  }
  function ready(){
    if(document.documentElement.classList.contains('welcome-pending')){
      window.addEventListener('sw:welcome-entered',init,{once:true});
      window.addEventListener('pageshow',()=>{
        if(!document.documentElement.classList.contains('welcome-pending'))init();
      },{once:true});
    }else init();
  }
  style.addEventListener('load',()=>{
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
    else ready();
  },{once:true});
  document.head.append(style);
})();
