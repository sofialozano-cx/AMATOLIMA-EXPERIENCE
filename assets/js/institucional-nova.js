"use strict";

(function(){
  const selectors=[
    '.nova-top-row > *',
    '.service-list span',
    '.nova-headline',
    '.accent-badge',
    '.nova-intro',
    '.institutional-accordion',
    '.capability-copy > *',
    '.institutional-morph-slider'
  ];
  const reveals=[...new Set(selectors.flatMap(selector=>[...document.querySelectorAll(selector)]))];

  reveals.forEach((el,index)=>{
    el.classList.add('reveal');
    el.style.setProperty('--delay',`${(index%4)*70}ms`);
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});

  reveals.forEach(el=>observer.observe(el));
})();