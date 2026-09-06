"use strict";
(async()=>{
  try{
    const enhanced=await fetch("assets/js/apartment-build-enhanced.js?v=20260906-2",{cache:"no-store"});
    if(!enhanced.ok)throw new Error(`HTTP ${enhanced.status}`);
    let code=await enhanced.text();
    code=code.replace(
      'const run = new Function(`${source}\\n//# sourceURL=apartment-build-enhanced-runtime.js`);',
      `// Warm, richer architectural render grade inspired by the approved reference.
       source = source
        .replace('renderer.toneMappingExposure = 1.02', 'renderer.toneMappingExposure = 1.16')
        .replace('environmentGradient.addColorStop(0, "#d7e0df")', 'environmentGradient.addColorStop(0, "#c9d9d4")')
        .replace('environmentGradient.addColorStop(.42, "#f4eee4")', 'environmentGradient.addColorStop(.42, "#f5e5cf")')
        .replace('environmentGradient.addColorStop(1, "#6e5542")', 'environmentGradient.addColorStop(1, "#5d3d28")')
        .replace('plaster: 0xe8e4dc', 'plaster: 0xeee5d8')
        .replace('plasterWarm: 0xded9d0', 'plasterWarm: 0xe2d4c1')
        .replace('wood: 0x8a5c3a', 'wood: 0x8b4f27')
        .replace('woodLight: 0xc4a17b', 'woodLight: 0xc28a52')
        .replace('stone: 0xeee8dc', 'stone: 0xeee0ca')
        .replace('travertine: 0xcbb99d', 'travertine: 0xc9a77b')
        .replace('quartz: 0xf0ece4', 'quartz: 0xf4eadb')
        .replace('fabric: 0xb9ad9d', 'fabric: 0xb7a18b')
        .replace('fabricLight: 0xded6ca', 'fabricLight: 0xe2d2bd')
        .replace('metal: 0x5b493c', 'metal: 0x49372b')
        .replace('glass: 0x8d7968', 'glass: 0x796b5f')
        .replace('reflecta: 0x8f6f55', 'reflecta: 0x9b6842')
        .replace('green: 0x65715c', 'green: 0x3f6842')
        .replace('color: 0xa48165, roughness: .025', 'color: 0xa86f45, roughness: .025')
        .replace('color: 0xd3c4b4, roughness: .06', 'color: 0xc9d4cc, roughness: .045')
        .replace('const ambient = new THREE.HemisphereLight(0xfff8ed, 0x44362f, .6)', 'const ambient = new THREE.HemisphereLight(0xfff3df, 0x35483b, .72)')
        .replace('const sun = new THREE.DirectionalLight(0xffeed0, 2.8)', 'const sun = new THREE.DirectionalLight(0xffd7a1, 3.35)')
        .replace('const windowLight = new THREE.RectAreaLight(0xdde9eb, 7.5, 8.5, 3.2)', 'const windowLight = new THREE.RectAreaLight(0xd7e8e3, 8.4, 8.5, 3.2)')
        .replace('const warmFill = new THREE.RectAreaLight(0xffd7a0, 2.4, 4, 2.5)', 'const warmFill = new THREE.RectAreaLight(0xffbd72, 3.1, 4, 2.5)')
        .replace('clearcoat: .22, clearcoatRoughness: .46', 'clearcoat: .28, clearcoatRoughness: .38')
        .replace('envMapIntensity: .58', 'envMapIntensity: .78')
        .replace('envMapIntensity: .38', 'envMapIntensity: .52')
        .replace('envMapIntensity: .7', 'envMapIntensity: .9');
       if(document.readyState === "complete"){ source = source.replace("window.addEventListener(\\\"load\\\", async () => {", "(async () => {"); const tail = source.lastIndexOf("});"); if(tail > -1) source = source.slice(0,tail) + "})();" + source.slice(tail+3); } const run = new Function(\`${'${source}'}\\n//# sourceURL=apartment-build-enhanced-runtime.js\`);`
    );
    new Function(`${code}\n//# sourceURL=apartment-build-runtime-loader.js`)();
  }catch(error){
    console.error("[Amato Lima] Falha no bootstrap 3D:",error);
    const s=document.createElement("script");
    s.src="assets/js/apartment-build.js?v=20260905-27";
    document.head.appendChild(s);
  }
})();