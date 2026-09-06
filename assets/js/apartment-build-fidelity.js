"use strict";
(async()=>{
  try{
    const response=await fetch("assets/js/apartment-build-reference.js?v=20260906-1",{cache:"no-store"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    let source=await response.text();

    // Keep the reference composition open and readable: low architectural cut walls,
    // warm materials, brighter studio light and the original drawing-to-model reveal.
    source=source
      .replace("toneMappingExposure=1.48","toneMappingExposure=1.72")
      .replace("wall:0xe9e0d5","wall:0xe7d8c6")
      .replace("floor:0xd9c5a7","floor:0xdcc6a5")
      .replace("wood:0x8d5835","wood:0x93603d")
      .replace("wood2:0xbb8654","wood2:0xc18e5d")
      .replace("dark:0x4b443e","dark:0x51483f")
      .replace("green:0x397543","green:0x347640")
      .replace("green2:0x74a05a","green2:0x72a45d")
      .replace("const wall=(x,z,w,d,h=1.9,c=C.wall)=>box([w,h,d],[x,h/2,z],c,{rough:.86});","const wall=(x,z,w,d,h=1.9,c=C.wall)=>{const cut=Math.min(h,.72);return box([w,cut,d],[x,cut/2,z],c,{rough:.82});};")
      .replace("new THREE.HemisphereLight(0xfffbf2,0x8f9787,1.75)","new THREE.HemisphereLight(0xfffbf4,0xc8b79e,2.35)")
      .replace("new THREE.DirectionalLight(0xffd49b,4.6)","new THREE.DirectionalLight(0xffd8a6,5.35)")
      .replace("new THREE.RectAreaLight(0xe8f1ed,6.5,15,10)","new THREE.RectAreaLight(0xf2f5ef,8.2,15,10)")
      .replace("camera.position.set(17.8,15.2,20.8)","camera.position.set(18.8,16.4,22.2)")
      .replace("camera.position.set(17.8-q*.75,15.2-q*.4,20.8-q*.85)","camera.position.set(18.8-q*.65,16.4-q*.35,22.2-q*.7)")
      .replace("const q=smooth(p),reveal=Math.min(1,Math.max(0,(q-.04)/.48));root.rotation.y=-.18+q*Math.PI*2;meshes.forEach(m=>{const b=m.material.userData.baseOpacity??1;m.material.opacity=Math.max(.025,b*(.06+.94*reveal));m.material.depthWrite=m.material.opacity>.42});edges.forEach(e=>e.material.opacity=.86*(1-reveal)+.06);","const q=smooth(p),reveal=Math.min(1,Math.max(0,(q-.16)/.42));root.rotation.y=-.18+q*Math.PI*2;meshes.forEach(m=>{const b=m.material.userData.baseOpacity??1;m.material.opacity=b*reveal;m.material.depthWrite=reveal>.72});edges.forEach(e=>e.material.opacity=.96*(1-reveal)+.12*reveal);")
      .replace("scrub:.65","scrub:.82");

    // Softer linework: brown architectural drawing instead of black massing.
    source=source.replaceAll("color:0x776959,transparent:true,opacity:.78","color:0x8d725b,transparent:true,opacity:.78");

    new Function(`${source}\n//# sourceURL=apartment-build-fidelity-runtime.js`)();
  }catch(error){
    console.error("[Amato Lima] Falha no refinamento da maquete:",error);
    const script=document.createElement("script");
    script.src="assets/js/apartment-build-reference.js?v=20260906-1";
    document.head.appendChild(script);
  }
})();