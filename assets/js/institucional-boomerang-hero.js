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
  const work=document.createElement('canvas');
  const workCtx=work.getContext('2d',{alpha:true,willReadFrequently:true});
  let duration=0,targetTime=0,currentTime=0,lastRequested=-1,raf=0,seekPending=false;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const getProgress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight),0,1);

  const resizeCanvas=()=>{
    const box=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.max(1,Math.round(box.width*dpr));
    canvas.height=Math.max(1,Math.round(box.height*dpr));
    // Mais resolução no matte para preservar detalhes finos sem voltar ao custo do full-res.
    work.width=Math.max(1,Math.round(canvas.width*.75));
    work.height=Math.max(1,Math.round(canvas.height*.75));
    ctx.imageSmoothingEnabled=true;
    ctx.imageSmoothingQuality='high';
    workCtx.imageSmoothingEnabled=true;
    workCtx.imageSmoothingQuality='high';
  };

  const chromaFrame=()=>{
    if(video.readyState<2||!work.width||!work.height)return;
    const cw=work.width,ch=work.height,vw=video.videoWidth,vh=video.videoHeight;
    if(!vw||!vh)return;
    workCtx.clearRect(0,0,cw,ch);
    const scale=Math.min(cw/vw,ch/vh);
    const dw=vw*scale,dh=vh*scale,x=0,y=ch-dh;
    workCtx.drawImage(video,x,y,dw,dh);
    const img=workCtx.getImageData(0,0,cw,ch),d=img.data;
    for(let i=0;i<d.length;i+=4){
      if(!d[i+3])continue;
      const r=d[i],g=d[i+1],b=d[i+2];
      const greenLead=g-Math.max(r,b);
      const greenStrength=g-(r+b)*.5;
      let alpha=255;
      if(g>70&&greenLead>48&&greenStrength>55)alpha=0;
      else if(g>55&&greenLead>16&&greenStrength>20){
        const edge=clamp((greenLead-16)/32,0,1);
        alpha=Math.round(255*(1-edge));
      }
      if(alpha>0&&g>Math.max(r,b))d[i+1]=Math.min(g,Math.max(r,b)+8);
      d[i+3]=Math.min(d[i+3],alpha);
    }
    workCtx.putImageData(img,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(work,0,0,canvas.width,canvas.height);
  };

  const requestSeek=(time)=>{
    if(seekPending||Math.abs(time-lastRequested)<.012)return;
    seekPending=true;
    lastRequested=time;
    video.currentTime=time;
  };

  const render=()=>{
    raf=0;
    if(!duration)return;
    const delta=targetTime-currentTime;
    currentTime+=delta*.24;
    if(Math.abs(delta)<.0015)currentTime=targetTime;
    requestSeek(clamp(currentTime,0,Math.max(0,duration-.04)));
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
    requestSeek(currentTime);
  };

  video.pause();video.removeAttribute('autoplay');
  video.addEventListener('loadedmetadata',ready,{once:true});
  video.addEventListener('seeked',()=>{
    seekPending=false;
    chromaFrame();
    if(Math.abs(targetTime-currentTime)>.0015&&!raf)raf=requestAnimationFrame(render);
  });
  video.addEventListener('loadeddata',chromaFrame);
  video.addEventListener('durationchange',()=>{if(Number.isFinite(video.duration))duration=video.duration;});
  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',()=>{resizeCanvas();sync();chromaFrame();},{passive:true});
  if(video.readyState>=1)ready();
})();