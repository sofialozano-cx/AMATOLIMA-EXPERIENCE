"use strict";

(function(){
  const selectors=[
    '.service-list span',
    '.nova-headline',
    '.accent-badge',
    '.nova-intro',
    '.capability-body',
    '.nova-actions'
  ];
  const reveals=[...new Set(selectors.flatMap(selector=>[...document.querySelectorAll(selector)]))];
  let lastY=window.scrollY;
  let direction='down';

  reveals.forEach((el,index)=>{
    el.classList.add('reveal');
    el.style.setProperty('--delay',`${(index%4)*70}ms`);
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const el=entry.target;
      if(entry.isIntersecting){
        el.classList.remove('reveal-from-top','reveal-from-bottom');
        el.classList.add('is-visible');
      }else if(!entry.isIntersecting){
        const rect=entry.boundingClientRect;
        const leftAbove=rect.bottom<=window.innerHeight*.08;
        const leftBelow=rect.top>=window.innerHeight*.92;

        if(direction==='up' && leftBelow){
          el.classList.remove('is-visible','reveal-from-bottom');
          el.classList.add('reveal-from-top');
        }else if(direction==='down' && leftAbove){
          el.classList.remove('is-visible','reveal-from-top');
          el.classList.add('reveal-from-bottom');
        }
      }
    });
  },{threshold:[0,.12,.35],rootMargin:'-8% 0px -8% 0px'});

  reveals.forEach(el=>observer.observe(el));

  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(Math.abs(y-lastY)>3){
      direction=y>lastY?'down':'up';
      lastY=y;
    }
  },{passive:true});
})();