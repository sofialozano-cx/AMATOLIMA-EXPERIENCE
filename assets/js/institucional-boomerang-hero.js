(()=>{
  const root=document.querySelector('[data-boomerang-hero]');
  if(!root)return;
  const media=root.querySelector('.institutional-boomerang-hero__media');
  if(!media)return;

  const frames=[
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_55_19.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_56_10.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_57_01.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_57_46.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_58_27.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_59_16.png',
    'assets/images/background/ChatGPT Image 6 de set. de 2026, 23_59_59.png',
    'assets/images/background/ChatGPT Image 7 de set. de 2026, 00_00_41.png'
  ];

  media.innerHTML='';
  const canvas=document.createElement('canvas');
  canvas.className='institutional-boomerang-hero__sequence-canvas';
  media.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx)return;

  const images=frames.map((src,index)=>{
    const img=new Image();
    img.decoding='async';
    if(index===0)img.fetchPriority='high';
    img.src=encodeURI(src);
    return img;
  });

  let target=0,current=0,raf=0,readyCount=0;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const ease=t=>t*t*(3-2*t);
  const getProgress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight),0,1);

  const resize=()=>{
    const rect=media.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(rect.width*dpr));
    canvas.height=Math.max(1,Math.round(rect.height*dpr));
    canvas.style.width=rect.width+'px';
    canvas.style.height=rect.height+'px';
    draw();
  };

  const drawImageContain=(img,alpha=1,scale=1,xShift=0,yShift=0)=>{
    if(!img.complete||!img.naturalWidth)return;
    const w=canvas.width,h=canvas.height;
    const ratio=Math.min(w/img.naturalWidth,h/img.naturalHeight)*scale;
    const dw=img.naturalWidth*ratio,dh=img.naturalHeight*ratio;
    const x=xShift+(w-dw)*0;
    const y=h-dh+yShift;
    ctx.globalAlpha=alpha;
    ctx.drawImage(img,x,y,dw,dh);
  };

  const draw=()=>{
    if(!readyCount)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const position=current*(images.length-1);
    const base=Math.min(images.length-1,Math.floor(position));
    const next=Math.min(images.length-1,base+1);
    const raw=position-base;
    const mix=ease(raw);

    // Mantém sempre uma imagem sólida por baixo e usa a seguinte apenas como movimento
    // progressivo. Isso evita o aspecto de flash/dissolve entre fotografias.
    drawImageContain(images[base],1,1,0,0);
    if(next!==base&&mix>0){
      const motion=(mix-.5);
      const scale=1+Math.sin(mix*Math.PI)*.008;
      const x=motion*canvas.width*.004;
      const y=-Math.sin(mix*Math.PI)*canvas.height*.003;
      drawImageContain(images[next],mix,scale,x,y);
    }
    ctx.globalAlpha=1;
  };

  const paint=()=>{
    raf=0;
    const delta=target-current;
    // Resposta contínua e mais lenta: vários frames de render entre eventos de scroll.
    current+=delta*.085;
    if(Math.abs(delta)<.00012)current=target;
    draw();
    if(Math.abs(target-current)>.00012)raf=requestAnimationFrame(paint);
  };

  const sync=()=>{
    target=getProgress();
    if(!raf)raf=requestAnimationFrame(paint);
  };

  images.forEach(img=>{
    const done=()=>{readyCount++;if(readyCount===1){resize();sync();}};
    if(img.complete&&img.naturalWidth)done();else img.addEventListener('load',done,{once:true});
  });

  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',()=>{resize();sync();},{passive:true});
  sync();
})();