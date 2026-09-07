(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const video=root.querySelector('video');
  if(!video)return;

  let duration=0;
  let targetTime=0;
  let currentTime=0;
  let lastApplied=-1;
  let raf=0;

  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const getProgress=()=>{
    const rect=root.getBoundingClientRect();
    return clamp(-rect.top/Math.max(1,root.offsetHeight),0,1);
  };

  const render=()=>{
    raf=0;
    if(!duration)return;
    const delta=targetTime-currentTime;
    currentTime+=delta*.16;
    if(Math.abs(delta)<.0015)currentTime=targetTime;
    const safe=clamp(currentTime,0,Math.max(0,duration-.04));
    if(Math.abs(safe-lastApplied)>.005||safe===targetTime){
      video.currentTime=safe;
      lastApplied=safe;
    }
    if(Math.abs(targetTime-currentTime)>.0015)raf=requestAnimationFrame(render);
  };

  const sync=()=>{
    if(!duration)return;
    targetTime=getProgress()*Math.max(0,duration-.04);
    if(!raf)raf=requestAnimationFrame(render);
  };

  const ready=()=>{
    duration=Number.isFinite(video.duration)?video.duration:0;
    video.pause();
    currentTime=targetTime=getProgress()*Math.max(0,duration-.04);
    video.currentTime=currentTime;
    lastApplied=currentTime;
    sync();
  };

  video.pause();
  video.removeAttribute('autoplay');
  video.addEventListener('loadedmetadata',ready,{once:true});
  video.addEventListener('durationchange',()=>{if(Number.isFinite(video.duration))duration=video.duration;});
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync,{passive:true});
  if(video.readyState>=1)ready();
})();