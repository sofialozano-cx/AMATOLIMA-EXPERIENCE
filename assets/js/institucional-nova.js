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

  reveals.forEach((el,index)=>{
    el.classList.add('reveal');
    el.style.setProperty('--delay',`${(index%4)*95}ms`);
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.18,rootMargin:'0px 0px -12% 0px'});

  reveals.forEach(el=>observer.observe(el));
})();