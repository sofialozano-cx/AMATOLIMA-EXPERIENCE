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
    const terms=['DIREITO IMOBILIÁRIO','ENGENHARIA CIVIL','ARQUITETURA','NEGÓCIOS','MERCADO IMOBILIÁRIO','PATRIMÔNIO','PROJETO','VALORIZAÇÃO'];
    visual.innerHTML=terms.map((term,i)=>'<div class="founder-orbit__word" data-orbit-index="'+i+'">'+term+'</div>').join('');
    story.parentElement.insertBefore(visual,story);
    const style=document.createElement('style');
    style.textContent='.institutional-positioning{position:relative;overflow:hidden}.institutional-positioning__block--position,.institutional-positioning__block--story{position:relative;z-index:3}.founder-orbit{position:absolute;z-index:1;left:0;top:42%;bottom:0;width:43%;overflow:hidden;pointer-events:none;contain:layout paint}.founder-orbit__word{position:absolute;left:0;top:0;font:400 clamp(18px,1.75vw,27px)/1 Inter,sans-serif;letter-spacing:-.035em;white-space:nowrap;will-change:transform,opacity;background-image:linear-gradient(110deg,rgba(193,202,203,.68) 0%,rgba(193,202,203,.68) 36%,#fff 50%,rgba(193,202,203,.68) 64%,rgba(193,202,203,.68) 100%);background-size:220% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:founderShine 3.2s linear infinite}@keyframes founderShine{0%{background-position:150% center}100%{background-position:-50% center}}@media(max-width:767px){.founder-orbit{top:46%;width:45%}.founder-orbit__word{font-size:14px}.institutional-positioning__block--story{margin-left:8vw}}@media(prefers-reduced-motion:reduce){.founder-orbit__word{animation-duration:7s}}';
    document.head.appendChild(style);

    const orbitWords=[...visual.querySelectorAll('.founder-orbit__word')];
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start=performance.now();
    function animateFounderLoop(now){
      const w=visual.clientWidth,h=visual.clientHeight;
      if(w&&h){
        const cx=w*.34,cy=h*.50,rx=w*.50,ry=h*.58;
        const speed=(reduced?90000:30000);
        const base=((now-start)%speed)/speed*Math.PI*2;
        orbitWords.forEach((el,i)=>{
          const a=base+(i/orbitWords.length)*Math.PI*2;
          const x=cx+rx*Math.cos(a);
          const y=cy+ry*Math.sin(a);
          const edge=Math.min(1,Math.max(0,(x+30)/(w*.26)))*Math.min(1,Math.max(0,(w-x)/(w*.20)));
          const vertical=Math.min(1,Math.max(0,(y+30)/(h*.16)))*Math.min(1,Math.max(0,(h-y)/(h*.16)));
          el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) translate(-50%,-50%)';
          el.style.opacity=String(Math.max(.08,edge*vertical));
        });
      }
      requestAnimationFrame(animateFounderLoop);
    }
    requestAnimationFrame(animateFounderLoop);
  }

  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-visible')})},{threshold:.15});reveals.forEach(el=>observer.observe(el));
  if(!video||!canvas||!ctx)return;
  if(video.canPlayType('application/vnd.apple.mpegurl'))video.src=muxSource;else if(window.Hls&&window.Hls.isSupported()){const hls=new window.Hls({enableWorker:true,lowLatencyMode:false,backBufferLength:8,maxBufferLength:18,maxMaxBufferLength:24});hls.loadSource(muxSource);hls.attachMedia(video)}else return;
  const dpr=()=>Math.min(window.devicePixelRatio||1,2);function resize(){const r=dpr();canvas.width=Math.round(innerWidth*r);canvas.height=Math.round(innerHeight*r);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px'}resize();addEventListener('resize',resize,{passive:true});
  let target=0,smoothed=0,ready=false,seeking=false;function progress(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);return Math.max(0,Math.min(1,scrollY/max))}function drawVideo(){if(video.readyState<2||!video.videoWidth)return;const cw=canvas.width,ch=canvas.height,vw=video.videoWidth,vh=video.videoHeight;const scale=Math.max(cw/vw,ch/vh),dw=vw*scale,dh=vh*scale;ctx.clearRect(0,0,cw,ch);ctx.drawImage(video,(cw-dw)/2,(ch-dh)/2,dw,dh);if(!ready){ready=true;canvas.style.opacity='1';video.style.opacity='0';if(poster)poster.style.opacity='0'}}video.addEventListener('loadeddata',()=>{video.style.opacity='1';if(poster)poster.style.opacity='0';try{video.currentTime=.01}catch(e){}});video.addEventListener('seeked',()=>{seeking=false;drawVideo()});function tick(){target=progress();smoothed+=(target-smoothed)*.12;if(Number.isFinite(video.duration)&&video.duration>0&&!seeking){const t=smoothed*Math.max(0,video.duration-.08);if(Math.abs((video.currentTime||0)-t)>.055){seeking=true;try{video.currentTime=t}catch(e){seeking=false}}else drawVideo()}requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();