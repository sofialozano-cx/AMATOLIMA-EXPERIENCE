"use strict";

(function(){
  const video=document.querySelector('.scroll-video__video');
  const canvas=document.querySelector('.scroll-video__canvas');
  const poster=document.querySelector('.scroll-video__poster');
  const ctx=canvas&&canvas.getContext('2d');
  const reveals=[...document.querySelectorAll('.reveal')];
  const muxSource='https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8';

  document.querySelectorAll('.ag-panel').forEach(panel=>{const label=panel.querySelector('.ag-panel__text');if(label&&label.textContent.trim().toLowerCase()==='madeira'){label.textContent='Acabamento';panel.setAttribute('aria-label','Acabamento')}});

  const story=document.querySelector('.institutional-positioning__block--story');
  const storyTitle=story&&story.querySelector('.institutional-positioning__title');
  if(storyTitle)storyTitle.textContent='A HISTÓRIA';
  if(story&&!story.parentElement.querySelector('.founder-orbit')){
    const visual=document.createElement('div');
    visual.className='founder-orbit';visual.setAttribute('aria-hidden','true');
    visual.innerHTML='<div class="founder-orbit__disc"><div class="founder-orbit__word founder-orbit__word--1">DIREITO IMOBILIÁRIO</div><div class="founder-orbit__word founder-orbit__word--2">ENGENHARIA CIVIL</div><div class="founder-orbit__word founder-orbit__word--3">ARQUITETURA</div><div class="founder-orbit__word founder-orbit__word--4">NEGÓCIOS</div><div class="founder-orbit__word founder-orbit__word--5">MERCADO IMOBILIÁRIO</div><div class="founder-orbit__word founder-orbit__word--6">PATRIMÔNIO</div><div class="founder-orbit__word founder-orbit__word--7">PROJETO</div><div class="founder-orbit__word founder-orbit__word--8">VALORIZAÇÃO</div></div>';
    story.parentElement.insertBefore(visual,story);
    const style=document.createElement('style');
    style.textContent='.institutional-positioning{position:relative;overflow:hidden}.institutional-positioning__block--position,.institutional-positioning__block--story{position:relative;z-index:2}.founder-orbit{position:absolute;z-index:1;left:-39vw;top:4%;width:min(86vw,1180px);aspect-ratio:1;pointer-events:none}.founder-orbit__disc{position:absolute;inset:0;border-radius:50%;animation:founderDiscSpin 34s linear infinite;transform-origin:50% 50%}.founder-orbit__word{position:absolute;font:400 clamp(20px,2.15vw,31px)/1 Inter,sans-serif;letter-spacing:-.035em;white-space:nowrap;background-image:linear-gradient(110deg,rgba(193,202,203,.74) 0%,rgba(193,202,203,.74) 36%,rgba(255,255,255,1) 50%,rgba(193,202,203,.74) 64%,rgba(193,202,203,.74) 100%);background-size:220% auto;background-position:150% center;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:founderShine 3.2s linear infinite}.founder-orbit__word--1{left:66%;top:2%;transform:rotate(9deg)}.founder-orbit__word--2{left:78%;top:12%;transform:rotate(19deg);animation-delay:-.4s}.founder-orbit__word--3{left:87%;top:25%;transform:rotate(29deg);animation-delay:-.8s}.founder-orbit__word--4{left:92%;top:39%;transform:rotate(40deg);animation-delay:-1.2s}.founder-orbit__word--5{left:92%;top:54%;transform:rotate(51deg);animation-delay:-1.6s}.founder-orbit__word--6{left:87%;top:68%;transform:rotate(61deg);animation-delay:-2s}.founder-orbit__word--7{left:78%;top:81%;transform:rotate(71deg);animation-delay:-2.4s}.founder-orbit__word--8{left:65%;top:91%;transform:rotate(81deg);animation-delay:-2.8s}@keyframes founderDiscSpin{from{transform:rotate(-8deg)}to{transform:rotate(352deg)}}@keyframes founderShine{0%{background-position:150% center}100%{background-position:-50% center}}@media(max-width:767px){.founder-orbit{left:-112vw;top:8%;width:205vw}.founder-orbit__word{font-size:17px}.institutional-positioning__block--story{margin-left:8vw}}@media(prefers-reduced-motion:reduce){.founder-orbit__disc{animation-duration:90s}.founder-orbit__word{animation-duration:8s}}';
    document.head.appendChild(style);
  }

  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible')})},{threshold:.15});reveals.forEach(el=>observer.observe(el));
  if(!video||!canvas||!ctx)return;
  if(video.canPlayType('application/vnd.apple.mpegurl'))video.src=muxSource;else if(window.Hls&&window.Hls.isSupported()){const hls=new window.Hls({enableWorker:true,lowLatencyMode:false,backBufferLength:8,maxBufferLength:18,maxMaxBufferLength:24});hls.loadSource(muxSource);hls.attachMedia(video)}else return;
  const dpr=()=>Math.min(window.devicePixelRatio||1,2);function resize(){const r=dpr();canvas.width=Math.round(innerWidth*r);canvas.height=Math.round(innerHeight*r);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px'}resize();addEventListener('resize',resize,{passive:true});
  let target=0,smoothed=0,ready=false,seeking=false;function progress(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);return Math.max(0,Math.min(1,scrollY/max))}function drawVideo(){if(video.readyState<2||!video.videoWidth)return;const cw=canvas.width,ch=canvas.height,vw=video.videoWidth,vh=video.videoHeight;const scale=Math.max(cw/vw,ch/vh),dw=vw*scale,dh=vh*scale;ctx.clearRect(0,0,cw,ch);ctx.drawImage(video,(cw-dw)/2,(ch-dh)/2,dw,dh);if(!ready){ready=true;canvas.style.opacity='1';video.style.opacity='0';if(poster)poster.style.opacity='0'}}video.addEventListener('loadeddata',()=>{video.style.opacity='1';if(poster)poster.style.opacity='0';try{video.currentTime=.01}catch(e){}});video.addEventListener('seeked',()=>{seeking=false;drawVideo()});function tick(){target=progress();smoothed+=(target-smoothed)*.12;if(Number.isFinite(video.duration)&&video.duration>0&&!seeking){const t=smoothed*Math.max(0,video.duration-.08);if(Math.abs((video.currentTime||0)-t)>.055){seeking=true;try{video.currentTime=t}catch(e){seeking=false}}else drawVideo()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();