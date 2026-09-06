"use strict";
(async()=>{
  try{
    const enhanced=await fetch("assets/js/apartment-build-enhanced.js?v=20260906-2",{cache:"no-store"});
    if(!enhanced.ok)throw new Error(`HTTP ${enhanced.status}`);
    let code=await enhanced.text();

    // Direção cromática da referência: SOMENTE cor, luz e resposta dos materiais.
    // Nenhuma geometria, câmera, rotação, planta ou timing do desenho é alterado.
    code=code.replace(
      'let source = await response.text();',
      `let source = await response.text();

    source = source
      // Exposição e ambiente: claro, solar, quente e sem aparência acinzentada.
      .replace('renderer.toneMappingExposure = 1.02;', 'renderer.toneMappingExposure = 1.16;')
      .replace('environmentGradient.addColorStop(0, "#d7e0df");', 'environmentGradient.addColorStop(0, "#f4f1ea");')
      .replace('environmentGradient.addColorStop(.42, "#f4eee4");', 'environmentGradient.addColorStop(.42, "#fff8ec");')
      .replace('environmentGradient.addColorStop(1, "#6e5542");', 'environmentGradient.addColorStop(1, "#b8895e");')
      .replace('rgba(255,248,226,.92)', 'rgba(255,244,216,.98)')
      .replace('rgba(255,255,255,.72)', 'rgba(255,255,250,.9)')

      // Luz natural dourada + preenchimento limpo, preservando sombra e profundidade.
      .replace('new THREE.HemisphereLight(0xfff8ed, 0x44362f, .6)', 'new THREE.HemisphereLight(0xfffbf2, 0x8f7258, .88)')
      .replace('new THREE.DirectionalLight(0xffeed0, 2.8)', 'new THREE.DirectionalLight(0xffe2ad, 3.45)')
      .replace('new THREE.RectAreaLight(0xdde9eb, 7.5, 8.5, 3.2)', 'new THREE.RectAreaLight(0xfff3dc, 9.2, 8.5, 3.2)')
      .replace('new THREE.RectAreaLight(0xffd7a0, 2.4, 4, 2.5)', 'new THREE.RectAreaLight(0xffc77d, 3.15, 4, 2.5)')
      .replace('new THREE.PointLight(0xe7bc79, 0, 18, 1.7)', 'new THREE.PointLight(0xffbd68, 0, 18, 1.7)')

      // Paleta: carvalho/mel, travertino creme, tecidos areia, grafite e verde vivo.
      .replace('plaster: 0xe8e4dc', 'plaster: 0xf2ede4')
      .replace('plasterWarm: 0xded9d0', 'plasterWarm: 0xe8dfd2')
      .replace('wood: 0x8a5c3a', 'wood: 0x9b6740')
      .replace('woodLight: 0xc4a17b', 'woodLight: 0xc99d6c')
      .replace('stone: 0xeee8dc', 'stone: 0xf2e8d7')
      .replace('travertine: 0xcbb99d', 'travertine: 0xd9c09a')
      .replace('quartz: 0xf0ece4', 'quartz: 0xf7f0e5')
      .replace('fabric: 0xb9ad9d', 'fabric: 0xc8b8a4')
      .replace('fabricLight: 0xded6ca', 'fabricLight: 0xe8ddce')
      .replace('metal: 0x5b493c', 'metal: 0x3f3933')
      .replace('glass: 0x8d7968', 'glass: 0xb9aa98')
      .replace('reflecta: 0x8f6f55', 'reflecta: 0xa97b55')
      .replace('green: 0x65715c', 'green: 0x4f6f3d')

      // Texturas-base acompanham a nova hierarquia sem mudar escala ou geometria.
      .replace('kind === "wood" ? "#dcc9ae"', 'kind === "wood" ? "#d5b58f"')
      .replace('kind === "stone" ? "#e9e1d3"', 'kind === "stone" ? "#f0e4d2"')
      .replace('kind === "quartz" ? "#f5f3ef"', 'kind === "quartz" ? "#faf5ec"')
      .replace('kind === "travertine" ? "#cfbea2"', 'kind === "travertine" ? "#dcc39c"')

      // Vegetação desenhada no living: dois verdes mais naturais e saturados.
      .replace('index % 2 ? 0x78866f : 0x62715e', 'index % 2 ? 0x6f8a55 : 0x456b39')

      // Estado materializado continua luminoso até o final do scroll.
      .replace('sun.intensity = 1.25 + materialPhase * 2.25;', 'sun.intensity = 1.7 + materialPhase * 2.55;')
      .replace('windowLight.intensity = 3.2 + materialPhase * 5.4;', 'windowLight.intensity = 4.5 + materialPhase * 6.2;')
      .replace('warmFill.intensity = .5 + materialPhase * 2.2;', 'warmFill.intensity = .8 + materialPhase * 2.7;')
      .replace('renderer.toneMappingExposure = .92 + materialPhase * .18;', 'renderer.toneMappingExposure = 1.04 + materialPhase * .18;');`
    );

    code=code.replace(
      'const run = new Function(`${source}\\n//# sourceURL=apartment-build-enhanced-runtime.js`);',
      'if(document.readyState === "complete"){ source = source.replace("window.addEventListener(\\\"load\\\", async () => {", "(async () => {"); const tail = source.lastIndexOf("});"); if(tail > -1) source = source.slice(0,tail) + "})();" + source.slice(tail+3); } const run = new Function(`${source}\\n//# sourceURL=apartment-build-enhanced-runtime.js`);'
    );
    new Function(`${code}\n//# sourceURL=apartment-build-runtime-loader.js`)();
  }catch(error){
    console.error("[Amato Lima] Falha no bootstrap 3D:",error);
    const s=document.createElement("script");
    s.src="assets/js/apartment-build.js?v=20260905-27";
    document.head.appendChild(s);
  }
})();