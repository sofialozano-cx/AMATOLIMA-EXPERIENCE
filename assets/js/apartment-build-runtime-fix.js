"use strict";
(async()=>{
  try{
    const enhanced=await fetch("assets/js/apartment-build-enhanced.js?v=20260906-2",{cache:"no-store"});
    if(!enhanced.ok)throw new Error(`HTTP ${enhanced.status}`);
    let code=await enhanced.text();
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