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
  const layers=frames.map((src,index)=>{
    const img=new Image();
    img.className='institutional-boomerang-hero__frame';
    img.alt='';
    img.decoding='async';
    if(index===0)img.fetchPriority='high';
    img.src=encodeURI(src);
    img.style.opacity=index===0?'1':'0';
    media.appendChild(img);
    return img;
  });

  let target=0,current=0,raf=0;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const getProgress=()=>clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight),0,1);

  const paint=()=>{
    raf=0;
    const delta=target-current;
    current+=delta*.18;
    if(Math.abs(delta)<.0008)current=target;
    const position=current*(layers.length-1);
    const base=Math.floor(position);
    const mix=position-base;
    layers.forEach((layer,i)=>{
      let opacity=0;
      if(i===base)opacity=1-mix;
      else if(i===Math.min(base+1,layers.length-1))opacity=mix;
      layer.style.opacity=String(opacity);
    });
    if(Math.abs(target-current)>.0008)raf=requestAnimationFrame(paint);
  };

  const sync=()=>{
    target=getProgress();
    if(!raf)raf=requestAnimationFrame(paint);
  };

  window.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync,{passive:true});
  sync();
})();