(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const video=root.querySelector('video');
  const canvas=root.querySelector('canvas');
  if(!video||!canvas)return;

  const source='assets/images/background/32039.mp4';
  if(!video.getAttribute('src')||!video.getAttribute('src').endsWith('/32039.mp4')){
    video.src=source;
    video.load();
  }

  const ctx=canvas.getContext('2d',{alpha:true,willReadFrequently:true});
  let duration=0,targetTime=0,currentTime=0,lastApplied=-1,raf=0,paintRaf=0;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const getProgress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight),0,1);

  const resizeCanvas=()=>{
    const box=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.max(1,Math.round(box.width*dpr));
    canvas.height=Math.max(1,Math.round(box.height*dpr));
  };

  const chromaFrame=()=>{
    if(video.readyState<2||!canvas.width||!canvas.height)return;
    const cw=canvas.width,ch=canvas.height,vw=video.videoWidth,vh=video.videoHeight;
    if(!vw||!vh)return;
    ctx.clearRect(0,0,cw,ch);
    const scale=Math.min(cw/vw,ch/vh);
    const dw=vw*scale,dh=vh*scale,x=0,y=ch-dh;
    ctx.drawImage(video,x,y,dw,dh);
    const img=ctx.getImageData(0,0,cw,ch),d=img.data;
    for(let i=0;i<d.length;i+=4){
      if(!d[i+3])continue;
      let r=d[i],g=d[i+1],b=d[i+2];
      const greenLead=g-Math.max(r,b);
      const greenStrength=g-(r+b)*.5;
      let alpha=255;

      // Chroma key verde com feather nas bordas.
      if(g>70&&greenLead>48&&greenStrength>55)alpha=0;
      else if(g>55&&greenLead>16&&greenStrength>20){
        const edge=clamp((greenLead-16)/32,0,1);
        alpha=Math.round(255*(1-edge));
      }

      // Despill: remove reflexo verde das bordas sem alterar as cores do prédio.
      if(alpha>0&&g>Math.max(r,b)){g=Math.min(g,Math.max(r,b)+8);d[i+1]=g;}
      d[i+3]=Math.min(d[i+3],alpha);
    }
    ctx.putImageData(img,0,0);
  };

  const paint=()=>{paintRaf=0;chromaFrame();};
  const requestPaint=()=>{if(!paintRaf)paintRaf=requestAnimationFrame(paint);};

  const render=()=>{
    raf=0;
    if(!duration)return;
    const delta=targetTime-currentTime;
    currentTime+=delta*.16;
    if(Math.abs(delta)<.0015)currentTime=targetTime;
    const safe=clamp(currentTime,0,Math.max(0,duration-.04));
    if(Math.abs(safe-lastApplied)>.005||safe===targetTime){video.currentTime=safe;lastApplied=safe;}
    requestPaint();
    if(Math.abs(targetTime-currentTime)>.0015)raf=requestAnimationFrame(render);
  };

  const sync=()=>{
    if(!duration)return;
    targetTime=getProgress()*Math.max(0,duration-.04);
    if(!raf)raf=requestAnimationFrame(render);
  };

  const ready=()=>{
    duration=Number.isFinite(video.duration)?video.duration:0;
    video.pause();resizeCanvas();
    currentTime=targetTime=getProgress()*Math.max(0,duration-.04);
    video.currentTime=currentTime;lastApplied=currentTime;
    requestPaint();sync();
  };

  video.pause();video.removeAttribute('autoplay');
  video.addEventListener('loadedmetadata',ready,{once:true});
  video.addEventListener('loadeddata',requestPaint);
  video.addEventListener('seeked',requestPaint);
  video.addEventListener('durationchange',()=>{if(Number.isFinite(video.duration))duration=video.duration;});
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',()=>{resizeCanvas();sync();requestPaint();},{passive:true});
  if(video.readyState>=1)ready();
})();