"use strict";

(() => {
  const root = document.querySelector("[data-staggered-flow-menu]");
  if (!root) return;

  const panel = root.querySelector("[data-flowing-menu-panel]");
  const toggle = root.querySelector("[data-flowing-menu-toggle]");
  const backdrop = root.querySelector("[data-flowing-menu-backdrop]");
  const prelayers = [...root.querySelectorAll("[data-flowing-menu-prelayer]")];
  const itemEls = [...root.querySelectorAll("[data-flowing-menu-item]")];
  const labels = [...root.querySelectorAll(".flowing-menu__label")];
  const icon = root.querySelector(".flowing-menu-toggle__icon");
  const textInner = root.querySelector(".flowing-menu-toggle__text-inner");
  const gsapApi = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const marqueeTweens = new WeakMap();
  let isOpen = false;
  let busy = false;

  if (!panel || !toggle || !backdrop) return;

  const closedY = () => -(panel.getBoundingClientRect().height || window.innerHeight);
  const waapiEase = "cubic-bezier(.16,1,.3,1)";

  const repeatMarqueeParts = item => {
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const original = inner?.querySelector("[data-flowing-menu-part]");
    if (!inner || !original) return;
    inner.querySelectorAll("[data-flowing-menu-part]:not(:first-child)").forEach(part => part.remove());
    const width = Math.max(original.getBoundingClientRect().width, 1);
    const repetitions = Math.max(4, Math.ceil(panel.getBoundingClientRect().width / width) + 2);
    for (let index = 1; index < repetitions; index += 1) inner.appendChild(original.cloneNode(true));
  };

  const startItemMarquee = item => {
    repeatMarqueeParts(item);
    const inner = item.querySelector("[data-flowing-menu-inner]");
    const firstPart = inner?.querySelector("[data-flowing-menu-part]");
    marqueeTweens.get(item)?.kill?.();
    if (!inner || !firstPart) return;
    if (!gsapApi || reducedMotion) {
      inner.getAnimations().forEach(a => a.cancel());
      const distance = firstPart.getBoundingClientRect().width;
      const anim = inner.animate([{transform:"translateX(0)"},{transform:`translateX(${-distance}px)`}],{duration:Number(item.dataset.speed||15)*1000,iterations:Infinity,easing:"linear"});
      marqueeTweens.set(item,{kill:()=>anim.cancel()});
      return;
    }
    gsapApi.set(inner, { x: 0 });
    marqueeTweens.set(item, gsapApi.to(inner, {x:-firstPart.getBoundingClientRect().width,duration:Number(item.dataset.speed||15),ease:"none",repeat:-1}));
  };

  const stopItemMarquee = item => {
    const tween = marqueeTweens.get(item);
    if (tween) { tween.kill(); marqueeTweens.delete(item); }
  };

  const closestEdge = (event, item) => {
    const rect = item.getBoundingClientRect();
    return event.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
  };

  itemEls.forEach(item => {
    const link = item.querySelector(".flowing-menu__link");
    const marquee = item.querySelector(".flowing-menu__marquee");
    const inner = item.querySelector("[data-flowing-menu-inner]");
    if (!link || !marquee || !inner) return;

    const activate = event => {
      if (!root.classList.contains("is-open")) return;
      const edge = closestEdge(event, item);
      startItemMarquee(item);
      if (!gsapApi || reducedMotion) {
        marquee.getAnimations().forEach(a=>a.cancel());
        marquee.animate([{transform:`translateY(${edge==="top"?"-101%":"101%"})`},{transform:"translateY(0)"}],{duration:620,easing:waapiEase,fill:"forwards"});
        return;
      }
      gsapApi.killTweensOf([marquee, inner]);
      gsapApi.timeline({ defaults: { duration: .62, ease: "expo.out" } })
        .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
        .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    };

    const deactivate = event => {
      stopItemMarquee(item);
      const edge = closestEdge(event, item);
      if (!gsapApi || reducedMotion) {
        marquee.getAnimations().forEach(a=>a.cancel());
        marquee.animate([{transform:"translateY(0)"},{transform:`translateY(${edge==="top"?"-101%":"101%"})`}],{duration:500,easing:"cubic-bezier(.76,0,.24,1)",fill:"forwards"});
        return;
      }
      gsapApi.killTweensOf([marquee, inner]);
      gsapApi.timeline({defaults:{duration:.5,ease:"expo.inOut"},onComplete:()=>gsapApi.set(inner,{x:0})})
        .to(marquee,{y:edge==="top"?"-101%":"101%"},0)
        .to(inner,{y:edge==="top"?"101%":"-101%"},0);
    };

    item.addEventListener("pointerenter", activate);
    item.addEventListener("pointerleave", deactivate);
    link.addEventListener("pointerdown", activate);
  });

  const setAccessibleState = open => {
    root.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("flowing-menu-open", open);
  };

  const openMenu = () => {
    if (busy || isOpen) return;
    busy = true; isOpen = true; setAccessibleState(true); itemEls.forEach(repeatMarqueeParts);
    if (!gsapApi || reducedMotion) {
      const layers=[...prelayers,panel];
      layers.forEach((el,index)=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{transform:"translateY(-105%)"},{transform:"translateY(0)"}],{duration:index===layers.length-1?620:480,delay:index*70,easing:waapiEase,fill:"forwards"});});
      labels.forEach((label,index)=>{label.animate([{transform:"translateY(125%) rotate(7deg)",opacity:.2},{transform:"translateY(0) rotate(0)",opacity:1}],{duration:780,delay:240+index*65,easing:waapiEase,fill:"forwards"});});
      icon?.animate([{transform:"rotate(0deg)"},{transform:"rotate(225deg)"}],{duration:750,easing:waapiEase,fill:"forwards"});
      textInner?.animate([{transform:"translateY(0)"},{transform:"translateY(-50%)"}],{duration:620,easing:waapiEase,fill:"forwards"});
      setTimeout(()=>{busy=false},900); return;
    }
    gsapApi.killTweensOf([panel, icon, textInner, ...prelayers, ...labels]);
    gsapApi.set(labels, { yPercent: 125, rotate: 7 });
    const tl = gsapApi.timeline({ onComplete: () => { busy = false; } });
    prelayers.forEach((layer,index)=>{tl.fromTo(layer,{y:closedY(),xPercent:0},{y:0,duration:.48,ease:"power4.out"},index*.07)});
    tl.fromTo(panel,{y:closedY(),xPercent:0},{y:0,duration:.62,ease:"power4.out"},.14);
    tl.to(labels,{yPercent:0,rotate:0,duration:.78,ease:"power4.out",stagger:.065},.24);
    tl.to(icon,{rotate:225,duration:.75,ease:"power4.out"},0);
    tl.to(textInner,{yPercent:-50,duration:.62,ease:"power4.out"},0);
  };

  const closeMenu = () => {
    if (busy || !isOpen) return;
    busy=true; isOpen=false;
    itemEls.forEach(item=>{stopItemMarquee(item);const marquee=item.querySelector(".flowing-menu__marquee");const inner=item.querySelector("[data-flowing-menu-inner]");if(gsapApi&&marquee&&inner)gsapApi.set([marquee,inner],{y:"101%"})});
    setAccessibleState(false);
    if (!gsapApi || reducedMotion) {
      [...prelayers,panel].forEach(el=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{transform:"translateY(0)"},{transform:"translateY(-105%)"}],{duration:340,easing:"cubic-bezier(.76,0,.24,1)",fill:"forwards"});});
      icon?.animate([{transform:"rotate(225deg)"},{transform:"rotate(0deg)"}],{duration:340,easing:"cubic-bezier(.76,0,.24,1)",fill:"forwards"});
      textInner?.animate([{transform:"translateY(-50%)"},{transform:"translateY(0)"}],{duration:340,easing:"cubic-bezier(.76,0,.24,1)",fill:"forwards"});
      setTimeout(()=>{busy=false},360); return;
    }
    gsapApi.killTweensOf([panel,icon,textInner,...prelayers]);
    gsapApi.timeline({onComplete:()=>{busy=false}})
      .to([panel,...prelayers],{y:closedY(),duration:.34,ease:"power3.in"},0)
      .to(icon,{rotate:0,duration:.34,ease:"power3.inOut"},0)
      .to(textInner,{yPercent:0,duration:.34,ease:"power3.inOut"},0);
  };

  toggle.addEventListener("click",()=>isOpen?closeMenu():openMenu());
  backdrop.addEventListener("click",closeMenu);
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&isOpen)closeMenu()});
  if(gsapApi)gsapApi.set([panel,...prelayers],{y:closedY(),xPercent:0});
})();
