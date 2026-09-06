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
      // Atmosfera bronze de fim de tarde: reflexo lateral, sem filtro laranja uniforme.
      .replace('renderer.toneMappingExposure = 1.02;', 'renderer.toneMappingExposure = .93;')
      .replace('environmentGradient.addColorStop(0, "#d7e0df");', 'environmentGradient.addColorStop(0, "#c58a58");')
      .replace('environmentGradient.addColorStop(.42, "#f4eee4");', 'environmentGradient.addColorStop(.42, "#e8b879");')
      .replace('environmentGradient.addColorStop(1, "#6e5542");', 'environmentGradient.addColorStop(1, "#4e3327");')
      .replace('rgba(255,248,226,.92)', 'rgba(255,166,76,.84)')
      .replace('rgba(255,255,255,.72)', 'rgba(213,125,57,.58)')

      // A incidência principal deixa o topo e vem lateralmente, como pôr do sol atravessando os vãos.
      .replace('new THREE.HemisphereLight(0xfff8ed, 0x44362f, .6)', 'new THREE.HemisphereLight(0xffd2a0, 0x332a28, .30)')
      .replace('new THREE.DirectionalLight(0xffeed0, 2.8)', 'new THREE.DirectionalLight(0xffa34f, 1.18)')
      .replace('sun.position.set(-8, 13, 9);', 'sun.position.set(-13, 5.2, 11.5);')
      .replace('new THREE.RectAreaLight(0xdde9eb, 7.5, 8.5, 3.2)', 'new THREE.RectAreaLight(0xffa45a, 5.6, 8.5, 3.2)')
      .replace('new THREE.RectAreaLight(0xffd7a0, 2.4, 4, 2.5)', 'new THREE.RectAreaLight(0xff8d38, 5.9, 4, 2.5)')
      .replace('new THREE.PointLight(0xe7bc79, 0, 18, 1.7)', 'new THREE.PointLight(0xff8a32, 0, 18, 1.7)')

      // Paleta aprovada permanece: paredes claras, madeira pigmentada, travertino e verdes fortes.
      .replace('plaster: 0xe8e4dc', 'plaster: 0xf1ebe3')
      .replace('plasterWarm: 0xded9d0', 'plasterWarm: 0xe9ded1')
      .replace('wood: 0x8a5c3a', 'wood: 0x75411f')
      .replace('woodLight: 0xc4a17b', 'woodLight: 0xa96b35')
      .replace('stone: 0xeee8dc', 'stone: 0xd8c5aa')
      .replace('travertine: 0xcbb99d', 'travertine: 0xb99061')
      .replace('quartz: 0xf0ece4', 'quartz: 0xe5d8c5')
      .replace('fabric: 0xb9ad9d', 'fabric: 0xa58c74')
      .replace('fabricLight: 0xded6ca', 'fabricLight: 0xcab9a4')
      .replace('metal: 0x5b493c', 'metal: 0x352820')
      .replace('glass: 0x8d7968', 'glass: 0xb36f3d')
      .replace('reflecta: 0x8f6f55', 'reflecta: 0x9b5429')
      .replace('green: 0x65715c', 'green: 0x315d32')

      // Texturas não lavam novamente a paleta.
      .replace('kind === "wood" ? "#dcc9ae"', 'kind === "wood" ? "#9b6237"')
      .replace('kind === "stone" ? "#e9e1d3"', 'kind === "stone" ? "#d4bea1"')
      .replace('kind === "quartz" ? "#f5f3ef"', 'kind === "quartz" ? "#e4d7c3"')
      .replace('kind === "travertine" ? "#cfbea2"', 'kind === "travertine" ? "#b78e5e"')
      .replace('kind === "fabric" ? "#d7d0c6"', 'kind === "fabric" ? "#ad9982"')
      .replace('index % 2 ? 0x78866f : 0x62715e', 'index % 2 ? 0x4f7b42 : 0x28562f')

      // Vidro panorâmico e Reflecta recebem bronze de verdade no material/reflexo.
      .replace('color: 0xa48165, roughness: .025, metalness: .32, transmission: .58,', 'color: 0x9b5429, roughness: .035, metalness: .38, transmission: .48,')
      .replace('transparent: true, opacity: 0, envMapIntensity: 1.65, side: THREE.DoubleSide,', 'transparent: true, opacity: 0, envMapIntensity: 2.35, side: THREE.DoubleSide,')
      .replace('color: 0xd3c4b4, roughness: .06, metalness: .02, transmission: .86,', 'color: 0xc77a43, roughness: .075, metalness: .06, transmission: .76,')
      .replace('thickness: .045, ior: 1.46, transparent: true, opacity: 0, side: THREE.DoubleSide,', 'thickness: .055, ior: 1.46, transparent: true, opacity: 0, envMapIntensity: 1.75, side: THREE.DoubleSide,')

      // LEDs embutidos quentes + pôr do sol lateral, mantendo contraste nas sombras.
      .replace('sun.intensity = 1.25 + materialPhase * 2.25;', 'sun.intensity = .46 + materialPhase * .72;')
      .replace('windowLight.intensity = 3.2 + materialPhase * 5.4;', 'windowLight.intensity = 2.15 + materialPhase * 3.15;')
      .replace('warmFill.intensity = .5 + materialPhase * 2.2;', 'warmFill.intensity = 1.8 + materialPhase * 4.45;')
      .replace('accentLight.intensity = materialPhase * 3.1;', 'accentLight.intensity = materialPhase * 5.8;')
      .replace('corridorGlow.intensity = materialPhase * 3.4;', 'corridorGlow.intensity = materialPhase * 5.5;')
      .replace('kitchenGlow.intensity = materialPhase * 4.2;', 'kitchenGlow.intensity = materialPhase * 7.2;')
      .replace('renderer.toneMappingExposure = .92 + materialPhase * .18;', 'renderer.toneMappingExposure = .87 + materialPhase * .11;');`
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