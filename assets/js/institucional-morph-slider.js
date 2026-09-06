import {Renderer,Triangle,Program,Mesh,Texture} from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const root=document.querySelector('[data-morph-slider]');
if(root){
 const stage=root.querySelector('[data-morph-stage]');
 const captions=[...root.querySelectorAll('[data-morph-caption]')];
 const dots=[...root.querySelectorAll('[data-morph-dot]')];
 const items=[
  'assets/images/menu/6114.jpg','assets/images/sections-home/31809.jpg','assets/images/material/31803.jpg','assets/images/material/31805.jpg'
 ];
 const vertex=`attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
 const fragment=`precision highp float;uniform sampler2D tCurrent;uniform sampler2D tNext;uniform vec2 uResolution;uniform vec2 uCurrentSize;uniform vec2 uNextSize;uniform float uProgress;uniform float uTime;uniform float uIntensity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}vec2 coverUV(vec2 uv,vec2 res,vec2 img){float ra=res.x/max(res.y,1.),ia=img.x/max(img.y,1.);vec2 s=vec2(1.);float ratio=ra/max(ia,.0001);if(ratio>1.)s.y=1./ratio;else s.x=ratio;return(uv-.5)*s+.5;}void main(){float p=clamp(uProgress,0.,1.);vec2 uv=vUv;uv+=vec2(sin(uTime*.25+uv.y*4.),cos(uTime*.22+uv.x*4.))*.003;float n=fbm(uv*2.4+uTime*.03),w=fbm(uv*4.08-uTime*.02);vec2 g=vec2(n,w)-.5;vec2 a=coverUV(uv+g*uIntensity*.5*p,uResolution,uCurrentSize);vec2 b=coverUV(uv-g*uIntensity*.5*(1.-p),uResolution,uNextSize);float m=smoothstep(n-.15,n+.15,p);vec3 c=mix(texture2D(tCurrent,a).rgb,texture2D(tNext,b).rgb,m);float vig=smoothstep(1.25,.25,length(uv-.5));c=mix(c,vec3(.21,.145,.1),(1.-vig)*.18);gl_FragColor=vec4(c,1.);}`;
 const renderer=new Renderer({alpha:false,antialias:true,dpr:Math.min(devicePixelRatio||1,2)}),gl=renderer.gl;
 gl.clearColor(.87,.86,.84,1);const canvas=gl.canvas;canvas.className='institutional-morph-slider__canvas';stage.appendChild(canvas);
 const fallback=()=>{const data=new Uint8Array(4*4*4);data.fill(220);for(let i=3;i<data.length;i+=4)data[i]=255;return new Texture(gl,{image:data,width:4,height:4,generateMipmaps:false})};
 const textures=items.map(fallback),sizes=items.map(()=>[1,1]);let current=0,busy=false,startX=0;
 const program=new Program(gl,{vertex,fragment,uniforms:{tCurrent:{value:textures[0]},tNext:{value:textures[0]},uResolution:{value:[1,1]},uCurrentSize:{value:sizes[0]},uNextSize:{value:sizes[0]},uProgress:{value:0},uTime:{value:0},uIntensity:{value:.55}}});
 const mesh=new Mesh(gl,{geometry:new Triangle(gl),program});
 items.forEach((src,i)=>{const img=new Image();img.src=src;img.onload=()=>{const tex=new Texture(gl,{generateMipmaps:false});tex.image=img;textures[i]=tex;sizes[i]=[img.naturalWidth||1,img.naturalHeight||1];if(i===current){program.uniforms.tCurrent.value=tex;program.uniforms.uCurrentSize.value=sizes[i]}}});
 const resize=()=>{const r=stage.getBoundingClientRect();renderer.setSize(Math.max(r.width,1),Math.max(r.height,1));program.uniforms.uResolution.value=[canvas.width,canvas.height]};new ResizeObserver(resize).observe(stage);resize();
 const ui=i=>{captions.forEach((el,n)=>el.classList.toggle('is-active',n===i));dots.forEach((el,n)=>el.classList.toggle('is-active',n===i))};ui(0);
 const go=dir=>{if(busy)return;const target=(current+dir+items.length)%items.length;busy=true;program.uniforms.tCurrent.value=textures[current];program.uniforms.uCurrentSize.value=sizes[current];program.uniforms.tNext.value=textures[target];program.uniforms.uNextSize.value=sizes[target];ui(target);const state={p:0};window.gsap.to(state,{p:1,duration:1.1,ease:'power2.inOut',onUpdate:()=>program.uniforms.uProgress.value=state.p,onComplete:()=>{current=target;program.uniforms.tCurrent.value=textures[target];program.uniforms.uCurrentSize.value=sizes[target];program.uniforms.uProgress.value=0;busy=false}})};
 root.querySelector('[data-morph-prev]').addEventListener('click',()=>go(-1));root.querySelector('[data-morph-next]').addEventListener('click',()=>go(1));dots.forEach((d,i)=>d.addEventListener('click',()=>{if(i===current||busy)return;go(i>current?1:-1)}));
 stage.addEventListener('pointerdown',e=>{startX=e.clientX});stage.addEventListener('pointerup',e=>{const dx=e.clientX-startX;if(Math.abs(dx)>45)go(dx<0?1:-1)});stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
 let timer=setInterval(()=>go(1),4000);root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',()=>{clearInterval(timer);timer=setInterval(()=>go(1),4000)});
 const loop=t=>{program.uniforms.uTime.value=t*.001;renderer.render({scene:mesh});requestAnimationFrame(loop)};requestAnimationFrame(loop);
}