(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const video=root.querySelector('video'),canvas=root.querySelector('canvas');
  if(!video||!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;

  const SPEED=.82;
  const SCROLL_INFLUENCE=.58;
  const frames=[];
  let lastTime=-1,capturing=true,playing=false;
  let scrollVelocity=0,lastScrollY=window.scrollY,lastScrollTime=performance.now();

  const onScroll=()=>{
    const now=performance.now();
    const y=window.scrollY;
    const dt=Math.max(16,now-lastScrollTime);
    scrollVelocity=(y-lastScrollY)/dt;
    lastScrollY=y;
    lastScrollTime=now;
  };
  window.addEventListener('scroll',onScroll,{passive:true});

  const capture=()=>{
    if(!capturing||video.ended)return;
    const t=video.currentTime;
    if(video.videoWidth&&t!==lastTime){
      lastTime=t;
      const w=Math.min(960,video.videoWidth),h=Math.round(w*video.videoHeight/video.videoWidth),c=document.createElement('canvas');
      c.width=w;c.height=h;
      const x=c.getContext('2d');
      x.drawImage(video,0,0,w,h);
      frames.push(c);
    }
    if('requestVideoFrameCallback'in video)video.requestVideoFrameCallback(capture);else requestAnimationFrame(capture);
  };

  const start=()=>{
    video.playbackRate=SPEED;
    video.play().catch(()=>{});
    if('requestVideoFrameCallback'in video)video.requestVideoFrameCallback(capture);else requestAnimationFrame(capture);
  };

  video.addEventListener('loadeddata',start,{once:true});
  video.addEventListener('ended',()=>{
    capturing=false;
    if(frames.length<2)return;
    canvas.width=frames[0].width;
    canvas.height=frames[0].height;
    video.style.display='none';
    canvas.style.display='block';
    let position=0,dir=1,last=0;
    playing=true;

    const loop=ts=>{
      if(!playing)return;
      const dt=last?Math.min(50,ts-last):16.67;
      last=ts;
      scrollVelocity*=.9;
      const scrollBoost=Math.max(-1.25,Math.min(1.25,scrollVelocity*SCROLL_INFLUENCE));
      position+=dir*(dt/1000)*30*SPEED+scrollBoost;
      if(position>=frames.length-1){position=frames.length-1;dir=-1}
      else if(position<=0){position=0;dir=1}
      ctx.drawImage(frames[Math.max(0,Math.min(frames.length-1,Math.round(position)))],0,0,canvas.width,canvas.height);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  if(video.readyState>=2)start();
})();