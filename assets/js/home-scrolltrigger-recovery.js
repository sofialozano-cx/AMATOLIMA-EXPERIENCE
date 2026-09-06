"use strict";
(()=>{
  const refresh=()=>{
    if(!window.ScrollTrigger)return;
    requestAnimationFrame(()=>requestAnimationFrame(()=>ScrollTrigger.refresh(true)));
    setTimeout(()=>ScrollTrigger.refresh(true),350);
    setTimeout(()=>ScrollTrigger.refresh(true),1100);
  };
  if(document.readyState==="complete")refresh();else addEventListener("load",refresh,{once:true});
  addEventListener("pageshow",refresh);
  document.fonts?.ready?.then(refresh).catch(()=>{});
  document.querySelectorAll(".closing-collage img,[data-apartment-build] canvas").forEach(el=>{
    if(el.tagName==="IMG"&&!el.complete)el.addEventListener("load",refresh,{once:true});
  });
})();