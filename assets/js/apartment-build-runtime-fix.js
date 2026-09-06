"use strict";
(async()=>{
  try{
    const enhanced=await fetch("assets/js/apartment-build-enhanced.js?v=20260906-2",{cache:"no-store"});
    if(!enhanced.ok)throw new Error(`HTTP ${enhanced.status}`);
    let code=await enhanced.text();

    // SOMENTE direção cromática, iluminação e resposta dos materiais.
    // Planta, geometria, móveis, câmera, desenho, rotação e timings permanecem intactos.
    code=code.replace(
      'let source = await response.text();',
      `let source = await response.text();

    source = source
      // Fim de tarde: reduz a sensação de estúdio branco e deixa o ambiente mais profundo.
      .replace('renderer.toneMappingExposure = 1.02;', 'renderer.toneMappingExposure = .94;')
      .replace('environmentGradient.addColorStop(0, "#d7e0df");', 'environmentGradient.addColorStop(0, "#d8c1a5");')
      .replace('environmentGradient.addColorStop(.42, "#f4eee4");', 'environmentGradient.addColorStop(.42, "#ead6bd");')
      .replace('environmentGradient.addColorStop(1, "#6e5542");', 'environmentGradient.addColorStop(1, "#70503a");')
      .replace('rgba(255,248,226,.92)', 'rgba(255,190,112,.72)')
      .replace('rgba(255,255,255,.72)', 'rgba(255,219,166,.48)')

      // Luz ambiente baixa e quente. O sol superior deixa de ser a fonte dominante.
      .replace('new THREE.HemisphereLight(0xfff8ed, 0x44362f, .6)', 'new THREE.HemisphereLight(0xffd7a3, 0x3d332d, .34)')
      .replace('new THREE.DirectionalLight(0xffeed0, 2.8)', 'new THREE.DirectionalLight(0xffb76b, .82)')
      .replace('new THREE.RectAreaLight(0xdde9eb, 7.5, 8.5, 3.2)', 'new THREE.RectAreaLight(0xffb96f, 4.8, 8.5, 3.2)')
      .replace('new THREE.RectAreaLight(0xffd7a0, 2.4, 4, 2.5)', 'new THREE.RectAreaLight(0xffa94f, 5.6, 4, 2.5)')
      .replace('new THREE.PointLight(0xe7bc79, 0, 18, 1.7)', 'new THREE.PointLight(0xff9f45, 0, 18, 1.7)')

      // Materiais com hierarquia mais forte: menos bege/branco, mais madeira, verde e bronze.
      .replace('plaster: 0xe8e4dc', 'plaster: 0xe1d5c5')
      .replace('plasterWarm: 0xded9d0', 'plasterWarm: 0xcdbba7')
      .replace('wood: 0x8a5c3a', 'wood: 0x75411f')
      .replace('woodLight: 0xc4a17b', 'woodLight: 0xa96b35')
      .replace('stone: 0xeee8dc', 'stone: 0xd8c5aa')
      .replace('travertine: 0xcbb99d', 'travertine: 0xb99061')
      .replace('quartz: 0xf0ece4', 'quartz: 0xe5d8c5')
      .replace('fabric: 0xb9ad9d', 'fabric: 0xa58c74')
      .replace('fabricLight: 0xded6ca', 'fabricLight: 0xcab9a4')
      .replace('metal: 0x5b493c', 'metal: 0x302923')
      .replace('glass: 0x8d7968', 'glass: 0x796b5f')
      .replace('reflecta: 0x8f6f55', 'reflecta: 0x8b5730')
      .replace('green: 0x65715c', 'green: 0x315d32')

      // Texturas deixam de clarear novamente os materiais.
      .replace('kind === "wood" ? "#dcc9ae"', 'kind === "wood" ? "#9b6237"')
      .replace('kind === "stone" ? "#e9e1d3"', 'kind === "stone" ? "#d4bea1"')
      .replace('kind === "quartz" ? "#f5f3ef"', 'kind === "quartz" ? "#e4d7c3"')
      .replace('kind === "travertine" ? "#cfbea2"', 'kind === "travertine" ? "#b78e5e"')
      .replace('kind === "fabric" ? "#d7d0c6"', 'kind === "fabric" ? "#ad9982"')

      // Folhagem mais presente e saturada.
      .replace('index % 2 ? 0x78866f : 0x62715e', 'index % 2 ? 0x4f7b42 : 0x28562f')

      // Iluminação final: LEDs e preenchimentos quentes assumem o protagonismo.
      .replace('sun.intensity = 1.25 + materialPhase * 2.25;', 'sun.intensity = .38 + materialPhase * .48;')
      .replace('windowLight.intensity = 3.2 + materialPhase * 5.4;', 'windowLight.intensity = 1.45 + materialPhase * 2.05;')
      .replace('warmFill.intensity = .5 + materialPhase * 2.2;', 'warmFill.intensity = 1.55 + materialPhase * 4.15;')
      .replace('accentLight.intensity = materialPhase * 3.1;', 'accentLight.intensity = materialPhase * 5.4;')
      .replace('corridorGlow.intensity = materialPhase * 3.4;', 'corridorGlow.intensity = materialPhase * 5.2;')
      .replace('kitchenGlow.intensity = materialPhase * 4.2;', 'kitchenGlow.intensity = materialPhase * 6.8;')
      .replace('renderer.toneMappingExposure = .92 + materialPhase * .18;', 'renderer.toneMappingExposure = .88 + materialPhase * .10;');`
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