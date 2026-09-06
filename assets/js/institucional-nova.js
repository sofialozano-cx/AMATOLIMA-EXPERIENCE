"use strict";

(function(){
  const video=document.querySelector('.scroll-video__video');
  const canvas=document.querySelector('.scroll-video__canvas');
  const poster=document.querySelector('.scroll-video__poster');
  const ctx=canvas&&canvas.getContext('2d');
  const reveals=[...document.querySelectorAll('.reveal')];
  const muxSource='https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8';

  document.querySelectorAll('.ag-panel').forEach(panel=>{
    const label=panel.querySelector('.ag-panel__text');
    if(label&&label.textContent.trim()==='Madeira'){
      label.textContent='Acabamento';
      panel.setAttribute('aria-label','Acabamento');
    }
  });

  const story=document.querySelector('.institutional-positioning__block--story');
  const storyTitle=story&&story.querySelector('.institutional-positioning__title');
  if(storyTitle)storyTitle.textContent='A HISTÓRIA';
  if(story&&!story.querySelector('.founder-orbit')){
    const visual=document.createElement('div');
    visual.className='founder-orbit';
    visual.setAttribute('aria-hidden','true');
    visual.innerHTML='<div class="founder-orbit__arc"></div><div class="founder-orbit__word founder-orbit__word--1">DIREITO IMOBILIÁRIO</div><div class="founder-orbit__word founder-orbit__word--2">ENGENHARIA CIVIL</div><div class="founder-orbit__word founder-orbit__word--3">ARQUITETURA</div><div class="founder-orbit__word founder-orbit__word--4">NEGÓCIOS</div><div class="founder-orbit__word founder-orbit__word--5">MERCADO IMOBILIÁRIO</div><div class="founder-orbit__word founder-orbit__word--6">PATRIMÔNIO</div>';
    story.parentElement.insertBefore(visual,story);
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible');});
  },{threshold:.15});
  reveals.forEach(el=>observer.observe(el));

  if(!video||!canvas||!ctx)return;

  if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=muxSource;
  }else if(window.Hls&&window.Hls.isSupported()){
    const hls=new window.Hls({enableWorker:true,lowLatencyMode:false,backBufferLength:8,maxBufferLength:18,maxMaxBufferLength:24});
    hls.loadSource(muxSource);
    hls.attachMedia(video);
  }else{
    return;
  }

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
    if(!ready){ready=true;canvas.style.opacity='1';video.style.opacity='0';if(poster)poster.style.opacity='0';}
  }
  video.addEventListener('loadeddata',()=>{
    video.style.opacity='1';if(poster)poster.style.opacity='0';
    try{video.currentTime=.01;}catch(e){}
  });
  video.addEventListener('seeked',()=>{seeking=false;drawVideo();});
  function tick(){
    target=progress();
    smoothed+=(target-smoothed)*.12;
    if(Number.isFinite(video.duration)&&video.duration>0&&!seeking){
      const t=smoothed*Math.max(0,video.duration-.08);
      if(Math.abs((video.currentTime||0)-t)>.055){seeking=true;try{video.currentTime=t;}catch(e){seeking=false;}}
      else drawVideo();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();