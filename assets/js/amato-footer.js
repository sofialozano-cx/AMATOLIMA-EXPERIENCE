"use strict";

(function initAmatoFooter(){
  const app=document.querySelector("[data-app]");
  if(!app||document.querySelector(".amato-footer"))return;

  const oldFooter=app.querySelector("footer");
  if(oldFooter)oldFooter.remove();

  const space=document.createElement("div");
  space.className="amato-footer-space";
  space.setAttribute("aria-hidden","true");

  const footer=document.createElement("footer");
  footer.className="amato-footer";
  footer.innerHTML=`
    <div class="amato-footer__card">
      <div class="amato-footer__top">
        <div class="amato-footer__identity">
          <a class="amato-footer__brand" href="index.html" aria-label="Amato Lima — página inicial">
            <img class="amato-footer__mark" src="assets/images/logo/9175.png" alt="" />
            <span class="amato-footer__brand-copy"><strong>Amato Lima</strong><span>Ativos Imobiliários</span></span>
          </a>
          <p class="amato-footer__intro">Arquitetura, matéria e precisão aplicadas a ativos residenciais de alto padrão em São Paulo.</p>
        </div>

        <div class="amato-footer__column">
          <h3>Institucional</h3>
          <nav class="amato-footer__links" aria-label="Institucional">
            <a href="sobre.html">Sobre</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Ativos</h3>
          <nav class="amato-footer__links" aria-label="Ativos">
            <a href="ativos.html">Ativos disponíveis</a>
            <a href="projetos.html">Portfólio</a>
          </nav>
        </div>

        <div class="amato-footer__column">
          <h3>Contato</h3>
          <nav class="amato-footer__links" aria-label="Contato">
            <a href="contato.html">Fale conosco</a>
          </nav>
        </div>
      </div>

      <div class="amato-footer__divider"></div>
      <div class="amato-footer__bottom">
        <span>© <span data-amato-footer-year></span> Amato Lima. Todos os direitos reservados.</span>
        <div class="amato-footer__legal"><a href="#">Termos e condições</a><a href="#">Política de privacidade</a></div>
      </div>
    </div>`;

  app.append(space,footer);
  const year=footer.querySelector("[data-amato-footer-year]");
  if(year)year.textContent=new Date().getFullYear();
})();
