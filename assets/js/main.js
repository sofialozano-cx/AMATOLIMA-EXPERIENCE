if(document.body.classList.contains('ativos-page')){const nav=document.querySelector('.flowing-menu');if(nav){const items=[['Home','index.html','6114.jpg'],['Institucional','sobre.html','6124.jpg'],['Viver Amato e Lima','reformas.html','6122.jpg'],['Ativos Imobiliários','ativos.html','27946.jpg'],['Contato','contato.html','31884.jpg']];nav.setAttribute('aria-label','Navegação principal');nav.innerHTML=items.map(([label,href,img])=>`<div class="flowing-menu__item" data-flowing-menu-item data-speed="15"><a class="flowing-menu__link" href="${href}"><span class="flowing-menu__label">${label}</span></a><div class="flowing-menu__marquee" aria-hidden="true"><div class="flowing-menu__marquee-wrap"><div class="flowing-menu__marquee-inner" data-flowing-menu-inner><div class="flowing-menu__part" data-flowing-menu-part><span>${label}</span><img class="flowing-menu__img" src="assets/images/menu/${img}" alt=""></div></div></div></div></div>`).join('')}}

const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const overlayHeader = document.querySelector("[data-overlay-header]");

if (overlayHeader) {
  const updateHeader = () => {
    overlayHeader.classList.toggle("is-scrolled", window.scrollY > 28);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = contactForm.querySelector("[data-form-status]");
    const name = contactForm.querySelector("#nome")?.value.trim();

    if (status) {
      status.textContent = `${name ? `${name}, sua` : "Sua"} mensagem foi preparada. Conecte este formulário ao seu e-mail ou CRM antes de publicar o site.`;
    }
  });
}
