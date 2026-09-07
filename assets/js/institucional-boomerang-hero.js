(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const video=root.querySelector('video'),canvas=root.querySelector('canvas');
  if(!video||!canvas)return;

  // Scrub contínuo: o vídeo não toca sozinho, mas desliza suavemente enquanto a página rola.
  let duration=0;
  let targetTime=0;
  let currentTime=0;
  let lastApplied=-1;
  let raf=0;

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  const getProgress=()=>{
    const rect=root.getBoundingClientRect();
    const travel=Math.max(1,root.offsetHeight+window.innerHeight);
    return clamp((window.innerHeight-rect.top)/travel,0,1);
  };

  const updateTarget=()=>{
    if(!duration)return;
    targetTime=getProgress()*Math.max(0,duration-.045);
    if(!raf)raf=requestAnimationFrame(render);
  };

  const render=()=>{
    raf=0;
    if(!duration)return;

    // Lerp mais longo cria a sensação de o filme estar realmente rodando durante o scroll,
    // em vez de saltar de frame em frame a cada evento da roda/trackpad.
    const delta=targetTime-currentTime;
    currentTime+=delta*.14;
    if(Math.abs(delta)<.0015)currentTime=targetTime;

    const safeTime=clamp(currentTime,0,Math.max(0,duration-.045));
    // Evita seeks microscópicos demais, que fazem MP4/UHD parecer travado em alguns navegadores.
    if(Math.abs(safeTime-lastApplied)>.006||safeTime===targetTime){
      video.currentTime=safeTime;
      lastApplied=safeTime;
    }

    if(Math.abs(targetTime-currentTime)>.0015)raf=requestAnimationFrame(render);
  };

  const ready=()=>{
    duration=Number.isFinite(video.duration)?video.duration:0;
    video.pause();
    video.removeAttribute('autoplay');
    video.style.display='block';
    canvas.style.display='none';
    currentTime=targetTime=getProgress()*Math.max(0,duration-.045);
    video.currentTime=currentTime;
    lastApplied=currentTime;
  };

  video.pause();
  video.addEventListener('loadedmetadata',ready,{once:true});
  video.addEventListener('durationchange',()=>{
    if(Number.isFinite(video.duration))duration=video.duration;
  });
  window.addEventListener('scroll',updateTarget,{passive:true});
  window.addEventListener('resize',updateTarget,{passive:true});
  if(video.readyState>=1)ready();
})();