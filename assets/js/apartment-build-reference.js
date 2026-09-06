"use strict";

/* Amato Lima — apartment rebuilt around the approved warm isometric reference. */
(async()=>{
  const wait=()=>new Promise(resolve=>{const find=()=>document.querySelector('[data-apartment-build]');if(find())return resolve(find());const mo=new MutationObserver(()=>{const el=find();if(el){mo.disconnect();resolve(el)}});mo.observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>{mo.disconnect();resolve(find())},8000)});
  const section=await wait();
  if(!section||section.dataset.referenceApartment==='true')return;
  section.dataset.referenceApartment='true';
  const canvas=section.querySelector('[data-apartment-canvas]');
  const wrap=section.querySelector('[data-apartment-scene]');
  const fallback=section.querySelector('[data-apartment-fallback]');
  if(!canvas||!wrap)return;
  let THREE;
  try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js')}catch(e){if(fallback)fallback.hidden=false;return}
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0xf3f1ed,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(29,1,.1,120);camera.position.set(17,15.5,20.5);
  const root=new THREE.Group();root.rotation.y=-.18;root.position.y=-.8;scene.add(root);
  const C={wall:0xeee9e1,floor:0xd8c5aa,wood:0x9a6238,wood2:0xbd8a59,dark:0x39332e,stone:0xe9dcc8,fabric:0xd8c9b7,fabric2:0xb7a38d,glass:0xc7d5d0,green:0x3d713d,green2:0x6f8f4c,metal:0x78624e,white:0xf4efe7};
  const mat=(color,rough=.72,metal=0,extra={})=>new THREE.MeshPhysicalMaterial({color,roughness:rough,metalness:metal,clearcoat:metal?.2:.05,clearcoatRoughness:.55,...extra});
  const add=(geo,pos,color=C.wall,opt={})=>{const m=new THREE.Mesh(geo,mat(color,opt.rough??.72,opt.metal??0,opt.extra||{}));m.position.set(...pos);if(opt.rot)m.rotation.set(...opt.rot);if(opt.scale)m.scale.set(...opt.scale);m.castShadow=opt.shadow!==false;m.receiveShadow=true;root.add(m);return m};
  const box=(s,p,c,o={})=>add(new THREE.BoxGeometry(...s),p,c,o);
  const cyl=(r,h,p,c,o={})=>add(new THREE.CylinderGeometry(r,r,h,24),p,c,o);
  const rounded=(s,p,c,o={})=>{const shape=new THREE.Shape();const w=s[0],d=s[2],r=Math.min(o.radius||.12,w/3,d/3);shape.moveTo(-w/2+r,-d/2);shape.lineTo(w/2-r,-d/2);shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);shape.lineTo(w/2,d/2-r);shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);shape.lineTo(-w/2+r,d/2);shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);shape.lineTo(-w/2,-d/2+r);shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);const g=new THREE.ExtrudeGeometry(shape,{depth:s[1],bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2});g.rotateX(Math.PI/2);return add(g,p,c,o)};
  const wall=(x,z,w,d,h=3.1,c=C.dark)=>box([w,h,d],[x,h/2,z],c,{rough:.62});
  const glass=(s,p)=>box(s,p,C.glass,{rough:.08,extra:{transparent:true,opacity:.36,transmission:.58,ior:1.45,side:THREE.DoubleSide}});
  const plant=(x,z,scale=1)=>{cyl(.28*scale,.42*scale,[x,.22*scale,z],0x51463a,{rough:.8});for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const leaf=add(new THREE.SphereGeometry(.13*scale,12,8),[x+Math.cos(a)*.25*scale,.62*scale+Math.sin(i*.9)*.13*scale,z+Math.sin(a)*.25*scale],i%2?C.green:C.green2,{rough:.88,scale:[.7,2.3,.55]});leaf.rotation.z=a*.2}return true};
  const chair=(x,z,a=0,c=C.fabric2)=>{const g=new THREE.Group();root.add(g);const old=root;const seat=box([.58,.16,.56],[x,.48,z],c,{rough:.9});const back=box([.58,.68,.13],[x,.82,z-.25],c,{rough:.9,rot:[-.12,0,0]});[[-.22,-.2],[.22,-.2],[-.22,.2],[.22,.2]].forEach(([dx,dz])=>cyl(.025,.43,[x+dx,.22,z+dz],C.dark,{rough:.45}));[seat,back].forEach(m=>{m.rotation.y=a});};
  const bed=(x,z,w=2.2,d=2.65)=>{rounded([w,.28,d],[x,.32,z],C.fabric2,{radius:.12,rough:.92});rounded([w*.94,.3,d*.88],[x,.55,z],C.white,{radius:.1,rough:.96});box([w,1.0,.18],[x,.92,z-d/2+.08],C.wood,{rough:.58});rounded([w*.42,.18,.6],[x-w*.23,.83,z-d*.23],C.white,{radius:.12,rough:.96});rounded([w*.42,.18,.6],[x+w*.23,.83,z-d*.23],C.white,{radius:.12,rough:.96});box([w*.9,.09,.72],[x,.76,z+d*.12],0xc9b7a1,{rough:.95})};
  const sofa=(x,z)=>{rounded([3.15,.38,1.12],[x,.35,z],C.fabric,{radius:.16,rough:.94});rounded([2.95,.75,.25],[x,.75,z-.43],C.fabric,{radius:.12,rough:.94});rounded([.28,.66,1.0],[x-1.45,.62,z],C.fabric,{radius:.1,rough:.94});for(let i=-2;i<=2;i++)rounded([.48,.42,.16],[x+i*.5,.78,z-.22],i%2?C.fabric2:C.white,{radius:.09,rough:.98})};
  const vanity=(x,z,a=0)=>{box([1.5,.68,.52],[x,.43,z],C.wood2,{rough:.58,rot:[0,a,0]});box([1.58,.08,.58],[x,.81,z],C.stone,{rough:.28,rot:[0,a,0]});cyl(.24,.12,[x,.91,z],C.white,{rough:.24});};
  // slab + dark perimeter, matching the reference's architectural cutaway
  box([15.8,.22,11.4],[0,-.12,0],C.floor,{rough:.86});
  wall(0,-5.62,15.8,.16,3.25);wall(-7.82,0,.16,11.4,3.25);wall(7.82,0,.16,11.4,3.25);
  // room partitions: open living/kitchen left, bedrooms and baths right
  wall(2.15,-3.55,.15,4.1);wall(2.15,3.5,.15,4.2);wall(4.75,-2.35,.15,6.5);wall(4.75,3.8,.15,3.65);wall(6.2,.8,3.25,.15);wall(3.45,1.55,2.6,.15);wall(.45,3.0,3.55,.15);wall(-1.2,4.25,.15,2.7);
  // glass balcony perimeter
  for(let x=-6.8;x<=6.7;x+=1.35){glass([1.24,1.05,.045],[x,.52,5.48]);box([.045,1.12,.06],[x-.65,.56,5.46],C.dark,{rough:.4})}
  for(let z=-4.4;z<=4.5;z+=1.35){glass([.045,1.05,1.22],[-7.68,.52,z]);box([.06,1.12,.045],[-7.66,.56,z-.64],C.dark,{rough:.4})}
  // kitchen cabinetry
  box([4.9,.86,.62],[-4.25,.44,-4.95],C.wood2,{rough:.58});box([4.9,1.25,.42],[-4.25,1.72,-5.04],C.wood,{rough:.55});
  for(let x=-6.25;x<=-2.25;x+=.82)box([.018,1.12,.46],[x,1.72,-4.81],C.dark,{rough:.45});
  box([1.0,2.5,.68],[-1.35,1.25,-4.85],0x6c6258,{rough:.25,metal:.65});box([.018,2.28,.72],[-1.35,1.25,-4.49],C.dark,{rough:.25});
  rounded([4.3,.72,1.18],[-3.8,.46,-2.9],C.wood2,{radius:.14,rough:.58});rounded([4.5,.12,1.32],[-3.8,.88,-2.9],C.stone,{radius:.08,rough:.24});
  box([.72,.025,.52],[-4.6,.96,-2.9],0x282725,{rough:.08});box([.68,.025,.48],[-2.8,.96,-2.9],0x514c47,{rough:.08});
  for(let i=0;i<5;i++)chair(-5.25+i*.72,-2.12,Math.PI,C.wood2);
  // dining
  rounded([3.45,.16,1.45],[-4.35,.83,.25],C.stone,{radius:.5,rough:.3});cyl(.34,.72,[-5.25,.38,.25],C.wood,{rough:.55});cyl(.34,.72,[-3.45,.38,.25],C.wood,{rough:.55});
  [[-5.5,-.7],[-4.6,-.7],[-3.7,-.7],[-2.9,-.25],[-2.9,.62],[-3.7,1.12],[-4.6,1.12],[-5.5,1.0]].forEach(([x,z],i)=>chair(x,z,i<3?0:i<5?-Math.PI/2:Math.PI,C.wood2));
  // living
  sofa(-.55,2.55);rounded([1.0,.22,.72],[1.05,.38,2.65],C.stone,{radius:.28,rough:.34});rounded([.78,.18,.6],[.25,.3,3.28],C.wood2,{radius:.24,rough:.5});chair(1.75,3.35,-2.4,C.fabric2);chair(1.75,1.75,-.7,C.fabric2);box([2.5,.42,.42],[-.45,.32,4.7],C.wood,{rough:.56});
  // master bedroom
  bed(6.25,-2.5,2.35,2.8);box([2.7,2.5,.5],[6.1,1.25,-5.15],C.wood,{rough:.55});for(let x=5.0;x<=7.1;x+=.42)box([.025,2.2,.54],[x,1.3,-4.86],C.dark,{rough:.42});box([.55,.5,.48],[5.0,.32,-2.55],C.wood2);box([.55,.5,.48],[7.45,.32,-2.55],C.wood2);
  // second bedroom
  bed(3.45,-3.35,1.65,2.2);box([1.9,.55,.45],[3.45,.35,-4.95],C.wood2,{rough:.6});
  // dressing room
  box([2.7,2.65,.48],[6.25,1.33,2.4],C.wood,{rough:.55});for(let x=5.1;x<=7.35;x+=.46)box([.025,2.3,.5],[x,1.35,2.14],C.dark,{rough:.42});
  // bathrooms
  vanity(3.25,.62);glass([1.18,2.0,.06],[4.15,.98,.72]);box([.9,.18,1.65],[5.4,.1,4.0],C.white,{rough:.3});rounded([.72,.5,1.42],[5.4,.42,4.0],C.white,{radius:.22,rough:.25});
  vanity(6.65,4.35);glass([1.25,2.05,.06],[7.15,1.0,3.15]);
  // entry/elevator hall
  box([1.65,2.8,.12],[.65,1.38,-5.38],0x77716b,{rough:.22,metal:.55});box([.025,2.62,.12],[.65,1.38,-5.29],C.dark,{rough:.25});box([2.5,.42,.42],[.5,.3,-4.55],C.wood2,{rough:.58});plant(.55,-4.0,1.15);
  // abundant greenery around balcony
  [[-6.7,-2.5,1.25],[-6.65,1.3,1.0],[-6.5,4.25,1.25],[7.1,-.2,1.2],[7.0,1.1,1.0],[6.9,4.7,1.25],[2.1,4.8,.9]].forEach(v=>plant(...v));
  // warm integrated lighting
  const hemi=new THREE.HemisphereLight(0xfff5e5,0x455443,1.05);scene.add(hemi);const sun=new THREE.DirectionalLight(0xffc879,4.0);sun.position.set(-9,15,12);sun.castShadow=true;sun.shadow.mapSize.set(3072,3072);sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=16;sun.shadow.camera.bottom=-16;sun.shadow.bias=-.0002;scene.add(sun);
  const fill=new THREE.RectAreaLight(0xdce8e4,4.2,13,8);fill.position.set(1,7,9);fill.lookAt(0,0,0);scene.add(fill);
  [[-4,-4],[.5,-4.3],[5,-3],[6,2]].forEach(([x,z])=>{const l=new THREE.PointLight(0xffb85f,1.7,5,2);l.position.set(x,2.45,z);scene.add(l);cyl(.055,.025,[x,2.72,z],0xffd9a0,{rough:.15,extra:{emissive:0xffa43c,emissiveIntensity:3}})});
  camera.lookAt(0,.2,0);
  const resize=()=>{const r=wrap.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};resize();new ResizeObserver(resize).observe(wrap);
  let p=0;const render=()=>{root.rotation.y=-.18+p*.16;camera.position.x=17-p*1.3;camera.position.z=20.5-p*1.1;camera.lookAt(0,.15,0);renderer.render(scene,camera);requestAnimationFrame(render)};render();canvas.hidden=false;if(fallback)fallback.hidden=true;
  if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.create({trigger:section,start:'top top',end:'bottom bottom',scrub:.75,onUpdate:self=>{p=self.progress;const bar=section.querySelector('[data-apartment-progress]');if(bar)bar.style.transform=`scaleX(${p})`;const step=section.querySelector('[data-apartment-step]');if(step)step.textContent=String(Math.min(4,Math.floor(p*4)+1)).padStart(2,'0');const label=section.querySelector('[data-apartment-label]');if(label)label.textContent=p<.25?'Arquitetura':p<.5?'Matéria':p<.75?'Luz':'Habitar'}});ScrollTrigger.refresh()}
})();