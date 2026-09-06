"use strict";

(function initSmoothMotion() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  // Mantém o scroll nativo do navegador. O Lenis estava interpolando cada
  // wheel/touch e também interceptando links, causando atraso perceptível no
  // index e na navegação entre páginas, principalmente junto aos pins 3D.
  // As animações editoriais continuam usando ScrollTrigger, mas sem segurar a
  // entrada do usuário.
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector(".hero--art");
  if (!hero) return;

  const item = (selector) => hero.querySelector(selector);

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: .35,
      invalidateOnRefresh: true
    }
  })
    .to(item(".hero-art__brand"), {
      yPercent: -45,
      opacity: .35,
      ease: "none"
    }, 0)
    .to(item(".hero-art__arte"), {
      xPercent: -3,
      yPercent: -14,
      ease: "none"
    }, 0)
    .to(item(".hero-art__de"), {
      xPercent: 5,
      yPercent: -22,
      ease: "none"
    }, 0)
    .to(item(".hero-art__habitar"), {
      xPercent: 8,
      yPercent: -17,
      ease: "none"
    }, 0)
    .to(item(".hero-art__wood"), {
      yPercent: -5,
      ease: "none"
    }, 0);

  ScrollTrigger.refresh();
})();
