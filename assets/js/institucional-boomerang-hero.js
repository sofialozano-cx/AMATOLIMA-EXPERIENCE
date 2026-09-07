(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const video=root.querySelector('video'),canvas=root.querySelector('canvas');
  if(!video||!canvas)return;

  // O vídeo não roda sozinho: o tempo é controlado exclusivamente pelo scroll.
  let duration=0;
  let targetTime=0;
  let currentTime=0;
  let raf=0;

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  const getProgress=()=>{
    const rect=root.getBoundingClientRect();
    const travel=Math.max(1,root.offsetHeight+window.innerHeight);
    return clamp((window.innerHeight-rect.top)/travel,0,1);
  };

  const render=()=>{
    raf=0;
    if(!duration)return;
    // Resposta rápida, mas com uma pequena suavização para não tremer em trackpads.
    currentTime+=(targetTime-currentTime)*.38;
    if(Math.abs(targetTime-currentTime)<.002)currentTime=targetTime;
    const safeEnd=Math.max(0,duration-.035);
    video.currentTime=clamp(currentTime,0,safeEnd);
    if(Math.abs(targetTime-currentTime)>.002)raf=requestAnimationFrame(render);
  };

  const syncToScroll=()=>{
    if(!duration)return;
    const progress=getProgress();
    const safeEnd=Math.max(0,duration-.035);
    targetTime=progress*safeEnd;
    if(!raf)raf=requestAnimationFrame(render);
  };

  const ready=()=>{
    duration=Number.isFinite(video.duration)?video.duration:0;
    video.pause();
    video.removeAttribute('autoplay');
    video.style.display='block';
    canvas.style.display='none';
    currentTime=targetTime=getProgress()*Math.max(0,duration-.035);
    video.currentTime=currentTime;
    syncToScroll();
  };

  video.pause();
  video.addEventListener('loadedmetadata',ready,{once:true});
  video.addEventListener('durationchange',()=>{
    if(Number.isFinite(video.duration))duration=video.duration;
  });
  window.addEventListener('scroll',syncToScroll,{passive:true});
  window.addEventListener('resize',syncToScroll,{passive:true});
  if(video.readyState>=1)ready();
})();