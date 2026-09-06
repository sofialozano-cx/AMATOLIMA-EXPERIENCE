"use strict";

(function(){
  const video=document.querySelector('.scroll-video__video');
  const canvas=document.querySelector('.scroll-video__canvas');
  const poster=document.querySelector('.scroll-video__poster');
  const ctx=canvas&&canvas.getContext('2d');
  const reveals=[...document.querySelectorAll('.reveal')];

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible');});
  },{threshold:.15});
  reveals.forEach(el=>observer.observe(el));

  if(!video||!canvas||!ctx)return;
  const dpr=()=>Math.min(window.devicePixelRatio||1,2);
  function resize(){
    const r=dpr();
    canvas.width=Math.round(innerWidth*r);
    canvas.height=Math.round(innerHeight*r);
    canvas.style.width=innerWidth+'px';
    canvas.style.height=innerHeight+'px';
  }
  resize(); addEventListener('resize',resize,{passive:true});

  let target=0,smoothed=0,ready=false,seeking=false;
  function progress(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    return Math.max(0,Math.min(1,scrollY/max));
  }
  function drawVideo(){
    if(video.readyState<2||!video.videoWidth)return;
    const cw=canvas.width,ch=canvas.height,vw=video.videoWidth,vh=video.videoHeight;
    const scale=Math.max(cw/vw,ch/vh),dw=vw*scale,dh=vh*scale;
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(video,(cw-dw)/2,(ch-dh)/2,dw,dh);
    if(!ready){ready=true;canvas.style.opacity='1';video.style.opacity='0';poster.style.opacity='0';}
  }
  video.addEventListener('loadeddata',()=>{
    video.style.opacity='1';poster.style.opacity='0';
    try{video.currentTime=.01;}catch(e){}
  });
  video.addEventListener('seeked',()=>{seeking=false;drawVideo();});
  function tick(){
    target=progress();
    smoothed+=(target-smoothed)*.12;
    if(Number.isFinite(video.duration)&&video.duration>0&&!seeking){
      const t=smoothed*Math.max(0,video.duration-.05);
      if(Math.abs((video.currentTime||0)-t)>.04){seeking=true;try{video.currentTime=t;}catch(e){seeking=false;}}
      else drawVideo();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();