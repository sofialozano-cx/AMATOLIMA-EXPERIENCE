"use strict";

const navigationItems = [
  { label: "Home", href: "index.html", current: true },
  { label: "Institucional", href: "sobre.html" },
  { label: "Viver Amato e Lima", href: "reformas.html" },
  { label: "Ativos Imobiliários", href: "ativos.html" },
  { label: "Contato", href: "contato.html" },
];

const flowingMenuItems = [
  { label: "Home", href: "index.html", image: "assets/images/menu/6114.jpg", position: "center" },
  { label: "Institucional", href: "sobre.html", image: "assets/images/menu/6124.jpg", position: "center" },
  { label: "Viver Amato e Lima", href: "reformas.html", image: "assets/images/menu/6122.jpg", position: "center" },
  { label: "Ativos Imobiliários", href: "ativos.html", image: "assets/images/menu/27946.jpg", position: "center" },
  { label: "Contato", href: "contato.html", image: "assets/images/menu/31884.jpg", position: "center" },
];

const materialSpiralImages = [
  { image: "assets/images/sections-home/28152.jpg", alt: "Composição que representa a matéria antes do ativo imobiliário" },
  { image: "assets/images/material/31803.jpg", alt: "Detalhe de madeira clara" },
  { image: "assets/images/material/31805.jpg", alt: "Detalhe de piso em travertino" },
  { image: "assets/images/material/31806.jpg", alt: "Detalhe de vidro reflecta bronze" },
  { image: "assets/images/material/31808.jpg", alt: "Detalhe de pedra em quartzo branco" },
  { image: "assets/images/sections-home/31868.jpg", alt: "Detalhe de pedra natural Hijau" },
];

function navigationTemplate() {
  return navigationItems.map(({ label, href, current }) => `<li><a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
}

function flowingMenuTemplate() {
  const items = flowingMenuItems.map(({ label, href, image, position = "center" }) => `<div class="flowing-menu__item" data-flowing-menu-item data-speed="15"><a class="flowing-menu__link" href="${href}"><span class="flowing-menu__label">${label}</span></a><div class="flowing-menu__marquee" aria-hidden="true"><div class="flowing-menu__marquee-wrap"><div class="flowing-menu__marquee-inner" data-flowing-menu-inner><div class="flowing-menu__part" data-flowing-menu-part><span>${label}</span><img class="flowing-menu__img" src="${image}" alt="" style="object-position:${position}" /></div></div></div></div></div>`).join("");
  return `<div class="staggered-flow-menu" data-staggered-flow-menu><div class="flowing-menu-backdrop" data-flowing-menu-backdrop aria-hidden="true"></div><div class="flowing-menu-prelayers" aria-hidden="true"><span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span><span class="flowing-menu-prelayer" data-flowing-menu-prelayer></span></div><aside class="flowing-menu-panel" id="flowing-menu-panel" data-flowing-menu-panel aria-hidden="true"><div class="flowing-menu-wrap"><nav class="flowing-menu" aria-label="Navegação principal">${items}</nav></div></aside><button class="flowing-menu-toggle" type="button" data-flowing-menu-toggle aria-label="Abrir menu" aria-controls="flowing-menu-panel" aria-expanded="false"><span class="flowing-menu-toggle__text-wrap" aria-hidden="true"><span class="flowing-menu-toggle__text-inner"><span class="flowing-menu-toggle__line">Menu</span><span class="flowing-menu-toggle__line">Fechar</span></span></span><span class="flowing-menu-toggle__icon" aria-hidden="true"><span class="flowing-menu-toggle__icon-line"></span><span class="flowing-menu-toggle__icon-line flowing-menu-toggle__icon-line--vertical"></span></span></button></div>`;
}

function heroTemplate() {
  return `<section class="hero hero--art" aria-labelledby="home-title"><div class="hero-art__brand" aria-label="Amato Lima — Ativos Imobiliários"><div class="hero-art__brand-line"><span class="hero-art__brand-name">Amato Lima</span><img class="hero-art__brand-mark" src="assets/images/logo/9175.png" alt="" aria-hidden="true" /></div><span class="hero-art__brand-descriptor">Ativos Imobiliários</span></div><h1 id="home-title" class="hero-art__headline"><span class="hero-art__arte">Arte</span><span class="hero-art__de">de</span><span class="hero-art__habitar">habitar</span></h1><picture><source media="(max-width: 760px)" srcset="assets/images/hero-mask-2.png" /><img class="hero-art__wood" src="assets/images/hero-mask.png" alt="" aria-hidden="true" /></picture><span class="hero-art__base-reflection" aria-hidden="true"></span></section>`;
}

function perspectiveTemplate() {
  const scrollPhrases = ["A MATÉRIA PRECEDE O ATIVO","MADEIRA CLARA","PISO TRAVERTINO","VIDROS REFLECTA BRONZE","PEDRAS EM QUARTZO BRANCO","PEDRA NATURAL HIJAU"];
  const cards = scrollPhrases.map((phrase,index)=>{const item=materialSpiralImages[index];return `<figure class="material-spiral__card" data-spiral-card data-spiral-label="${phrase}"><img src="${item.image}" alt="${item.alt}" loading="lazy" draggable="false" /></figure>`;}).join("");
  return `<section class="material-spiral" id="perspectiva" aria-labelledby="material-title" data-material-scroll><div class="material-spiral__viewport"><div class="material-spiral__copy"><h2 class="material-spiral__title" id="material-title" data-spiral-text aria-live="polite"></h2></div><div class="material-spiral__gallery" data-material-spiral aria-label="Carrossel de materiais controlado pelo scroll"><div class="material-spiral__stage">${cards}</div></div><div class="material-card-experience" data-material-card aria-label="Cartão Amato Lima com projetos selecionados"><div class="material-card-experience__fluid" data-ferrofluid aria-hidden="true"></div><div class="material-card-experience__stage"><div class="material-card-experience__card" data-project-card><div class="material-card-experience__face material-card-experience__face--project"><div class="material-card-experience__projects"><img class="is-active" data-card-project src="assets/images/card/6124.jpg" alt="Projeto Amato Lima" /><img data-card-project src="assets/images/card/27946.jpg" alt="Projeto Amato Lima" /><img data-card-project src="assets/images/sections-home/11693.png" alt="Projeto Amato Lima" /></div><span class="material-card-experience__reflection" data-card-reflection aria-hidden="true"></span></div><div class="material-card-experience__face material-card-experience__face--identity" style="background-image:url('assets/images/card/10494.png');background-size:cover;background-position:center;background-repeat:no-repeat;"><img class="material-card-experience__mark" src="assets/images/monograma.png" alt="" /></div></div></div></div></div></section>`;
}

function editorialRevealMarkup(title, first, second="") {
  let characterIndex=0;
  const render=(value,className)=>{const words=value.split(" ").map(word=>{const characters=Array.from(word).map(character=>`<span class="editorial-foundations__character" style="--shine-index:${characterIndex++}">${character}</span>`).join("");characterIndex++;return `<span class="editorial-foundations__word">${characters}</span>`;}).join(" ");return `<span class="${className}">${words}</span>`;};
  return `${render(title,"editorial-foundations__line editorial-foundations__line--title")}${render(first,"editorial-foundations__line editorial-foundations__line--body")}${second?render(second,"editorial-foundations__line editorial-foundations__line--body editorial-foundations__line--body-bold"):""}`;
}

function principlesTemplate() {
  const words=editorialRevealMarkup("Arquitetura discreta","O verdadeiro luxo não grita;","ele acolhe em silêncio através de texturas e tempo.");
  return `<section class="editorial-foundations" id="fundamentos"><div class="editorial-foundations__layout"><figure class="editorial-foundations__image-wrap"><img src="assets/images/sections-home/31809.jpg" alt="Detalhe arquitetônico Amato Lima" loading="lazy" /></figure><div class="editorial-foundations__copy"><p class="editorial-foundations__text" data-editorial-scroll-reveal>${words}</p></div></div></section>`;
}

function projectsTemplate() {
  const projects=[{name:"Residência Horizonte",location:"Jardim Europa — São Paulo, SP"},{name:"Casa Matéria",location:"Alto de Pinheiros — São Paulo, SP"},{name:"Apartamento Luz",location:"Itaim Bibi — São Paulo, SP"},{name:"Casa Jardim",location:"Cidade Jardim — São Paulo, SP"}];
  const projectRows=projects.map(({name,location})=>`<li class="project-index__item"><span class="project-index__name">${name}</span><span class="project-index__location">${location}</span></li>`).join("");
  return `<section class="project-index" id="projetos-selecionados" aria-labelledby="project-index-title"><div class="project-index__heading-wrap"><h2 class="project-index__heading" id="project-index-title"><span class="project-index__line project-index__line--one">SÃO PAULO,</span><span class="project-index__line project-index__line--two">SOB O OLHAR</span><span class="project-index__line project-index__line--three">AMATO LIMA</span></h2></div><div class="project-index__list-wrap"><ul class="project-index__list" aria-label="Projetos selecionados">${projectRows}</ul></div></section>`;
}

function interactiveApartmentTemplate() { return `<section class="apartment-build" id="transformacao-3d" data-apartment-build><div class="apartment-build__pin"><div class="apartment-build__backdrop" data-apartment-backdrop aria-hidden="true"></div><div class="apartment-build__scene" data-apartment-scene><canvas data-apartment-canvas aria-label="Apartamento tridimensional sendo construído durante a rolagem"></canvas><p class="apartment-build__fallback" data-apartment-fallback hidden>Uma residência é desenhada, estruturada e materializada.</p></div><div class="apartment-build__counter" aria-hidden="true"><span data-apartment-step>01</span><i></i><span>04</span></div><div class="apartment-build__progress" aria-hidden="true"><span data-apartment-progress></span></div></div></section>`; }
function mainTemplate() { return `<main id="conteudo"><div class="hero-material-stack">${heroTemplate()}${perspectiveTemplate()}</div>${principlesTemplate()}${projectsTemplate()}${interactiveApartmentTemplate()}</main>`; }
function footerTemplate() { return `<footer class="site-footer"></footer>`; }
function renderHome() { const app=document.querySelector("[data-app]"); if(!app)throw new Error("O elemento principal da aplicação não foi encontrado."); document.body.classList.add("home-page"); app.innerHTML=`${flowingMenuTemplate()}${mainTemplate()}${footerTemplate()}`; }
renderHome();