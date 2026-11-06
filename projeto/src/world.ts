import * as THREE from 'three';
import {Pen,bodyFront,Outfit,FrontOpts,Expr,fxCloud} from './look/toon';
import {cardShade,CARD_K} from './look/cardshade';
import {twoTone,TONE,CHAR} from './look/shade';
import {NOINK} from './look/ink';
import {cobbleHD,grassHD,facadeHD,roofHD,stoneHD,rep,ctex} from './look/paint';
import {FPS,smooth,lerp,stateAt,growAt,bloomAt,liftAt} from './story';
import {estiloAtual} from './estilo';
const V=(x:number,y:number,z:number)=>new THREE.Vector3(x,y,z);
const COURIER:Outfit={jacket:'#ad335b',pants:'#343459',boots:'#27233d',hat:'cap',cap:'#ef8553',skin:'#ffe2c2',buttons:'#f7ce71',head:4};
const CLIENT:Outfit={jacket:'#a5436c',dress:'#e9a444',pants:'#414467',boots:'#39344d',hat:'hair',hair:'#55323d',skin:'#d89e73'};
function mat(color:string,map?:THREE.Texture){return twoTone(new THREE.MeshLambertMaterial({color,...(map?{map}:{})}));}
function mesh(g:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(parent:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,m:THREE.Material){return mesh(new THREE.BoxGeometry(w,h,d),m,parent,x,y,z);}
function line(parent:THREE.Object3D,a:THREE.Vector3,b:THREE.Vector3,r=.012,col='#322c48'){
 const o=mesh(new THREE.CylinderGeometry(r,r,1,6),new THREE.MeshBasicMaterial({color:col}),parent);o.layers.set(NOINK);setLine(o,a,b);return o;
}
function setLine(o:THREE.Mesh,a:THREE.Vector3,b:THREE.Vector3){o.position.copy(a).add(b).multiplyScalar(.5);const d=b.clone().sub(a);o.scale.y=d.length();o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());}
class Actor {
 root=new THREE.Group();canvas=document.createElement('canvas');tex:THREE.CanvasTexture;body:THREE.Mesh;
 constructor(public outfit:Outfit){
  this.canvas.width=600;this.canvas.height=1000;this.tex=new THREE.CanvasTexture(this.canvas);this.tex.colorSpace=THREE.SRGBColorSpace;this.tex.anisotropy=8;
  const g=new THREE.PlaneGeometry(1.92,3.2);g.translate(0,1.52,0);
  this.body=mesh(g,cardShade(new THREE.MeshLambertMaterial({map:this.tex,alphaTest:.5,side:THREE.DoubleSide})),this.root);
  this.body.layers.set(NOINK);this.body.customDepthMaterial=new THREE.MeshDepthMaterial({map:this.tex,alphaTest:.5,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});
  this.body.onBeforeRender=r=>{CARD_K.uPx.value=(r.getRenderTarget()?.height??r.domElement.height)/1920};
 }
 capAnchor(){
  // Find the actual orange crown in the rendered character drawing. This follows
  // the head tilt instead of assuming that the canvas upper edge is the cap.
  const data=this.canvas.getContext('2d')!.getImageData(170,90,260,230).data;
  for(let y=0;y<230;y++){let sum=0,n=0;for(let x=0;x<260;x++){const k=(y*260+x)*4,r=data[k],gg=data[k+1],b=data[k+2];if(data[k+3]>200&&r>120&&gg>65&&gg<190&&b<130&&r>gg*1.23){sum+=x;n++;}}
   if(n>3)return V((170+sum/n-300)*.0032,1.52+(500-(90+y+4))*.0032,.045);
  }
  return V(-.1,2.47,.045);
 }
 pose(f:number,o:FrontOpts,grip=false){const g=this.canvas.getContext('2d')!;g.clearRect(0,0,600,1000);const p=new Pen(g);bodyFront(p,this.outfit,{...(grip?{rightHand:[580,650] as [number,number]}:{}),...o,seed:this.outfit===COURIER?8:22,blink:(f+(this.outfit===COURIER?0:33))%91<4});
  this.tex.needsUpdate=true;
 }
}
export class World{
 root=new THREE.Group();nico=new Actor(COURIER);client=new Actor(CLIENT);parcel=new THREE.Group();lid=new THREE.Group();seed=new THREE.Group();plant=new THREE.Group();flower=new THREE.Group();petals:THREE.Group[]=[];leafPlatform=new THREE.Group();can=new THREE.Group();drop:THREE.Mesh;clouds:THREE.Mesh[]=[];leaves:THREE.Group[]=[];neighbors:Actor[]=[];hatSprout=new THREE.Group();shadow:THREE.Mesh;shade:THREE.Mesh;
 constructor(){
  const E=estiloAtual();
  TONE.uLitCol.value.set(...E.luz);TONE.uShadeCol.value.set(...E.sombra);TONE.uShadeLift.value.set(...E.elevarSombra);TONE.uBounce.value.set(...E.rebote);TONE.uSat.value=E.saturacao;
  CHAR.uCharTint.value.set(...E.peleTom);CHAR.uCharShade.value=E.peleSombra;
  const sun=new THREE.DirectionalLight(E.sol.cor,E.sol.intensidade);sun.position.set(...E.sol.pos);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-42;sun.shadow.camera.right=42;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;sun.shadow.camera.far=110;sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;sun.target.position.set(10,0,0);this.root.add(sun,sun.target,new THREE.HemisphereLight(E.hemi.ceu,E.hemi.chao,E.hemi.intensidade));
  const ground=mesh(new THREE.PlaneGeometry(180,140),mat('#ffffff',rep(grassHD(),18,14)),this.root,10,-.06,-20);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
  const road=mesh(new THREE.PlaneGeometry(110,12),mat('#ffffff',rep(cobbleHD(),14,2)),this.root,10,0,1);road.rotation.x=-Math.PI/2;road.castShadow=false;
  const curb=mat('#e7cfac');for(const z of [-5.2,7.2])box(this.root,10,.05,z,110,.16,.35,curb);
  const houses=[[-16,-10,5,5.5,'#dfb882','#2f8994'],[-9,-9,4.5,6.7,'#c97d60','#3f7989'],[-3,-10,5,5.5,'#e9c596','#516d96'],[4,-11,5.5,7.2,'#b76560','#2b7171'],[18,-10,5,6,'#dcb880','#336f91'],[25,-10,6,6.7,'#dfac98','#7460a1'],[33,-9,5,7.5,'#c99c68','#417575'],[-22,-18,6,8,'#c9b88a','#526b8d'],[39,-17,5,8,'#d99b84','#446a75']] as const;
  for(let i=0;i<houses.length;i++){const [x,z,w,h,col,shutter]=houses[i];this.house(x,z,w,h,col,shutter,i);}
  this.tower(11,-10);
  // Bakery/courtyard on the destination side. Geometric props, no downloaded model dependencies.
  this.house(24,-5.8,5.8,4.6,'#f0ce9e','#ae4867',33);
  for(let i=0;i<9;i++){const aw=box(this.root,21.6+i*.6,2.9,-2.85,.61,.10,1.25,mat(i%2?'#f6e7c5':'#d34b70'));aw.rotation.x=.16;mesh(new THREE.SphereGeometry(.3,12,8),mat(i%2?'#f6e7c5':'#d34b70'),this.root,21.6+i*.6,2.74,-2.2).scale.set(1,.45,.65);}
  // A stylised cake emblem on the shop facade.
  const sign=ctex('bakery-emblem',256,256,g=>{g.fillStyle='#fff0cd';g.fillRect(0,0,256,256);g.strokeStyle='#513449';g.lineWidth=10;g.strokeRect(7,7,242,242);g.fillStyle='#b94974';g.fillRect(55,130,146,58);g.fillStyle='#fff9e3';g.fillRect(55,115,146,25);g.fillStyle='#eebc58';for(const x of [90,128,166]){g.fillRect(x-4,75,8,40);g.beginPath();g.ellipse(x,62,7,12,0,0,7);g.fill();}});
  mesh(new THREE.PlaneGeometry(.95,.95),new THREE.MeshBasicMaterial({map:sign}),this.root,24,3.9,-3.44);
  for(const [x,z,s] of [[-12,-4,1],[7,-6,1.2],[31,-3,1.1],[-20,3,1.7],[40,-8,1.7],[1,-19,2],[19,-21,1.7]])this.tree(x,z,s);
  for(let i=0;i<20;i++){const x=-30+i*5;this.tree(x,-28-(i%3)*4,1.4+(i%4)*.25);}
  const pot=mat('#ac654d');for(const x of [20.2,27.5]){mesh(new THREE.CylinderGeometry(.35,.23,.55,12),pot,this.root,x,.3,-2.5);for(let j=0;j<7;j++){const a=j*2.4;mesh(new THREE.SphereGeometry(.15,7,6),mat(j%2?'#e2b947':'#e26b8f'),this.root,x+Math.cos(a)*.23,.8+(j%3)*.09,-2.5+Math.sin(a)*.21);}}
  // Cloud cards catch no world outline and stay behind the town.
  for(let i=0;i<12;i++){const cv=document.createElement('canvas');cv.width=600;cv.height=300;const g=cv.getContext('2d')!;g.scale(1.2,.6);fxCloud(new Pen(g),i+2);const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;const cloud=mesh(new THREE.PlaneGeometry(12,5),new THREE.MeshBasicMaterial({map:tx,color:E.nuvem,transparent:true,depthWrite:false}),this.root,-40+i*8,16+(i%3)*4,-44-(i%2)*6);cloud.layers.set(NOINK);cloud.castShadow=false;this.clouds.push(cloud);}

  this.root.add(this.nico.root,this.client.root,this.parcel,this.seed,this.plant,this.leafPlatform,this.can);
  this.client.root.position.set(5.35,0,0);
  const paper=mat('#fff1ce'),pink=mat('#d6446b');
  box(this.parcel,0,0,0,.9,.64,.75,paper);box(this.parcel,0,0,.382,.12,.64,.025,pink);box(this.parcel,.458,0,0,.025,.64,.12,pink);
  this.parcel.add(this.lid);box(this.lid,0,.36,0,.98,.12,.83,paper);box(this.lid,0,.426,0,.14,.022,.84,pink);box(this.lid,0,.427,0,.98,.022,.12,pink);
  for(const ss of [-1,1]){const bow=mesh(new THREE.TorusGeometry(.11,.035,8,18),pink,this.lid,ss*.1,.49,0);bow.rotation.x=Math.PI/2;bow.scale.set(1.3,1,.65);}
  for(const child of this.lid.children)child.position.sub(V(0,.36,-.4));this.lid.position.set(0,.36,-.4);
  const seedBody=mesh(new THREE.SphereGeometry(.17,12,8),mat('#bd7f37'),this.seed);seedBody.scale.set(.75,1.4,.65);
  line(this.seed,V(-.01,-.12,.11),V(.03,.17,.11),.012,'#e7c371');
  mesh(new THREE.CylinderGeometry(.64,.45,.75,18),mat('#b9634a'),this.root,3.3,.38,0);
  mesh(new THREE.TorusGeometry(.62,.09,8,24),mat('#df8a5a'),this.root,3.3,.77,0).rotation.x=Math.PI/2;
  mesh(new THREE.CylinderGeometry(.56,.56,.04,18),mat('#513a36'),this.root,3.3,.77,0);
  const vine=new THREE.CatmullRomCurve3([V(0,0,0),V(-.18,1.7,0),V(.15,3.2,-.04),V(-.14,4.8,0),V(0,6.6,0)]);
  mesh(new THREE.TubeGeometry(vine,40,.15,8,false),mat('#4a8c40'),this.plant);
  this.plant.position.set(3.3,.8,0);
  for(let i=0;i<6;i++){const leaf=new THREE.Group();leaf.position.set(0,1+i*.75,0);leaf.rotation.z=(i%2?1:-1)*1.1;leaf.rotation.y=(i%3-1)*.35;this.leaf(leaf,1.25+i*.08,i%2?'#62ac50':'#79bc5d');this.plant.add(leaf);this.leaves.push(leaf);}
  this.plant.add(this.flower);this.flower.position.y=6.6;
  for(let i=0;i<12;i++){const pivot=new THREE.Group();pivot.rotation.z=i*Math.PI/6;const inner=new THREE.Group();pivot.add(inner);const sh=new THREE.Shape();sh.moveTo(0,.38);sh.bezierCurveTo(-.62,.9,-.8,2.6,0,2.8);sh.bezierCurveTo(.8,2.6,.62,.9,0,.38);const pe=mesh(new THREE.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:true,bevelSize:.035,bevelThickness:.03,bevelSegments:1,steps:1,curveSegments:10}),mat(i%2?'#ffcc53':'#f2ad3f'),inner);pe.position.z=-.1;this.flower.add(pivot);this.petals.push(inner);}
  const center=mesh(new THREE.SphereGeometry(.73,24,16),mat('#744530'),this.flower,0,0,.17);center.scale.z=.35;
  for(let i=0;i<35;i++){const a=i*2.399,r=.09*Math.sqrt(i);mesh(new THREE.SphereGeometry(.047,6,4),mat(i%2?'#d99439':'#eec253'),this.flower,Math.cos(a)*r,Math.sin(a)*r,.39);}
  this.leaf(this.leafPlatform,2.05,'#6dad50');this.leafPlatform.rotation.set(-Math.PI/2,0,Math.PI/2);
  const aqua=mat('#559da1');mesh(new THREE.CylinderGeometry(.32,.35,.52,12),aqua,this.can);mesh(new THREE.TorusGeometry(.34,.055,7,20),aqua,this.can,.34,.03,0);
  const spout=mesh(new THREE.CylinderGeometry(.07,.13,.85,8),aqua,this.can,-.58,.1,0);spout.rotation.z=1.07;const head=mesh(new THREE.CylinderGeometry(.17,.10,.12,10),aqua,this.can,-.95,.32,0);head.rotation.z=1.07;
  this.drop=mesh(new THREE.SphereGeometry(.09,10,8),new THREE.MeshBasicMaterial({color:'#6cd8ff'}),this.root);this.drop.scale.y=1.5;mesh(new THREE.SphereGeometry(.025,8,6),new THREE.MeshBasicMaterial({color:'#ffffff'}),this.drop,-.025,.025,.08);
  const blob=ctex('contact-new',128,128,g=>{const q=g.createRadialGradient(64,64,1,64,64,64);q.addColorStop(0,'rgba(42,30,65,.45)');q.addColorStop(1,'rgba(42,30,65,0)');g.fillStyle=q;g.fillRect(0,0,128,128)});
  this.shadow=mesh(new THREE.PlaneGeometry(1.8,1),new THREE.MeshBasicMaterial({map:blob,transparent:true,depthWrite:false}),this.root,0,.023,0);this.shadow.rotation.x=-Math.PI/2;this.shadow.layers.set(NOINK);this.shadow.castShadow=false;
  const shadeTex=ctex('floral-shadow',512,512,g=>{g.clearRect(0,0,512,512);g.filter='blur(8px)';g.fillStyle='#fff';g.beginPath();g.ellipse(256,256,105,90,0,0,7);g.fill();for(let i=0;i<12;i++){const a=i*Math.PI/6;g.beginPath();g.ellipse(256+Math.cos(a)*140,256+Math.sin(a)*120,90,34,a,0,7);g.fill();}});this.shade=mesh(new THREE.PlaneGeometry(12,10),new THREE.MeshBasicMaterial({map:shadeTex,color:'#313d62',transparent:true,opacity:0,depthWrite:false}),this.root,3,.029,.7);this.shade.rotation.x=-Math.PI/2;this.shade.layers.set(NOINK);this.shade.castShadow=false;
  for(let i=0;i<2;i++){const a=new Actor({...CLIENT,jacket:i?'#468a96':'#7368a6',dress:undefined,pants:'#455570',hat:'hair',hair:i?'#724c35':'#dac5a8',skin:i?'#d89e73':'#ffe2c2'});a.root.scale.setScalar(.88);this.root.add(a.root);this.neighbors.push(a);}
  line(this.hatSprout,V(0,0,0),V(.015,.32,0),.018,'#568b42');for(const [y,angle,size] of [[.12,.7,.20],[.21,-.7,.18]]){const l=new THREE.Group();l.position.set(.01,y,.01);l.rotation.z=angle;this.leaf(l,size,'#74b450');this.hatSprout.add(l);}this.nico.root.add(this.hatSprout);this.hatSprout.position.set(-.1,2.47,.045);
 }
 leaf(parent:THREE.Object3D,size:number,color:string){const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(-size*.55,size*.3,-size*.3,size*.9,0,size);sh.bezierCurveTo(size*.35,size*.9,size*.5,size*.3,0,0);const o=mesh(new THREE.ExtrudeGeometry(sh,{depth:.025,bevelEnabled:false,curveSegments:12}),mat(color),parent);line(parent,V(0,.04,.035),V(0,size*.95,.035),.018,'#c3d782');return o;}
 house(x:number,z:number,w:number,h:number,col:string,shutter:string,id:number){
  const m=mat('#ffffff',facadeHD('h'+id,w,h,{wall:col,shutter,door:true,timber:id%3===0}));const d=4.1;
  box(this.root,x,h/2,z,w,h,d,m);box(this.root,x,.2,z,w+.24,.4,d+.25,mat('#d2ba96'));box(this.root,x,h-.15,z,w+.3,.22,d+.35,mat('#e4c9a3'));
  const geom=new THREE.CylinderGeometry(0,1,1,4,1);geom.rotateY(Math.PI/4);geom.scale(w*.83,1.7,d*.85);mesh(geom,mat('#ffffff',roofHD(id%2?'#a54f47':'#b86b50')),this.root,x,h+.75,z);
  box(this.root,x+w*.25,h+1.5,z-.5,.55,1.6,.6,mat('#bd896b'));box(this.root,x+w*.25,h+2.3,z-.5,.67,.16,.72,mat('#dfb998'));
  box(this.root,x,.1,z+d/2+.25,1.35,.2,.65,mat('#d7bea0'));
 }
 tower(x:number,z:number){
  const m=mat('#ffffff',stoneHD());box(this.root,x,5.25,z,3.3,10.5,3.3,m);box(this.root,x,9,z,3.7,.35,3.7,mat('#e0c8a4'));
  const roof=mesh(new THREE.ConeGeometry(3,3.0,4),mat('#4c738a'),this.root,x,12,z);roof.rotation.y=Math.PI/4;
  const face=ctex('clock',256,256,g=>{g.fillStyle='#fff4d6';g.beginPath();g.arc(128,128,119,0,7);g.fill();g.strokeStyle='#332f47';g.lineWidth=9;g.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;g.beginPath();g.moveTo(128+Math.sin(a)*95,128-Math.cos(a)*95);g.lineTo(128+Math.sin(a)*107,128-Math.cos(a)*107);g.stroke();}g.lineWidth=13;g.beginPath();g.moveTo(128,56);g.lineTo(128,128);g.lineTo(180,150);g.stroke();});
  const o=mesh(new THREE.PlaneGeometry(2.2,2.2),new THREE.MeshBasicMaterial({map:face,transparent:true}),this.root,x,8.8,z+1.67);o.layers.set(NOINK);
 }
 tree(x:number,z:number,s:number){const m=mat('#6e503b');mesh(new THREE.CylinderGeometry(.13*s,.24*s,2.3*s,7),m,this.root,x,1.15*s,z);for(let i=0;i<4;i++){const o=mesh(new THREE.IcosahedronGeometry(1.05*s,1),mat(['#679647','#80ac50','#5c8947','#91b65e'][i]),this.root,x+Math.sin(i*2.4)*.55*s,(2.5+(i%2)*.5)*s,z+Math.cos(i*2.4)*.5*s);o.scale.y=1.2;}}
 update(f:number,camera:THREE.PerspectiveCamera){
  const t=f/FPS,s=stateAt(t),yaw=Math.atan2(camera.position.x-s.x,camera.position.z);
  this.nico.root.position.set(s.x,s.y+.02,0);this.nico.root.rotation.y=yaw;this.nico.root.rotation.z=t>23&&t<30?Math.sin(t*6)*.06*(1-smooth((t-28)/2)):0;
  const ex:Expr=t<.5?'whistle':t<2.3?'nervous':t<3.8?'shock':t<10?'whistle':t<15?'nervous':t<22?'stern':t<30?'shock':t<36?'relief_open':t<49.8?'grin':'shock';
  this.nico.pose(f,{expr:ex,mode:s.walking?'stroll':'stand',phase:t*1.6,headTilt:t>20&&t<22?-12:t>49.8?-8:Math.sin(t*1.5)*2,look:t>49.8?0:1,rightHand:t<15.5?[550,560]:t>30&&t<35?[550,380]:undefined,leftHand:t<15.5?[420,625]:t>23&&t<30?[60,350]:undefined},t<15.5);
  this.client.root.rotation.y=Math.atan2(camera.position.x-5.35,camera.position.z);
  // Project the exact watering-can handle anchor into the character card plane.
  // The wrist and prop therefore share one contact in every camera shot.
  this.can.position.set(lerp(4.58,4.75,smooth((t-19.7)/1.3)),lerp(1.28,.32,smooth((t-19.7)/1.3)),lerp(-.42,.1,smooth((t-19.7)/1.3)));this.can.rotation.z=.43*smooth((t-17)/.8)*(1-smooth((t-19.5)/.5));
  const grip=V(.58,.27,.02).applyEuler(this.can.rotation).add(this.can.position),cy=this.client.root.rotation.y;
  const normal=V(Math.sin(cy),0,Math.cos(cy)),plane=new THREE.Plane().setFromNormalAndCoplanarPoint(normal,this.client.root.position);
  const hit=new THREE.Ray(camera.position.clone(),grip.clone().sub(camera.position).normalize()).intersectPlane(plane,V(0,0,0))!;
  const local=hit.sub(this.client.root.position).applyAxisAngle(V(0,1,0),-cy);
  const canWrist:[number,number]=[300+local.x/.0032,500-(local.y-1.52)/.0032];
  this.client.pose(f,{expr:t<15?'nervous':t<22?'stern':t<30?'shock':'grin',mode:'stand',look:-1,leftHand:t<21?canWrist:t<30?[80,400]:[120,560],headTilt:t<22?-7:0});
  const off=V(.87,1.28,-.48).applyAxisAngle(V(0,1,0),yaw),deposit=Math.pow(Math.max(0,Math.min(1,(t-15.5)/.48)),2);
  this.parcel.position.set(s.x+off.x,s.y+off.y,off.z);this.parcel.position.lerp(V(2.1,.38,.25),deposit);this.parcel.rotation.set(0,lerp(yaw,.15,deposit),t<3.8?Math.sin(t*26)*.045*Math.pow(Math.sin(t*3),6):0);this.lid.rotation.x=-1.8*smooth((t-11.1)/1.2);
  const hop=smooth((t-15.3)/1.2);this.seed.visible=t>11.7&&t<17;this.seed.position.set(lerp(2.4,3.3,hop),lerp(1.9,.82,hop)+Math.sin(hop*Math.PI)*.85,0);this.seed.rotation.z=t*4;
  this.can.position.set(lerp(4.58,4.75,smooth((t-19.7)/1.3)),lerp(1.28,.32,smooth((t-19.7)/1.3)),lerp(-.42,.1,smooth((t-19.7)/1.3)));this.can.rotation.z=.43*smooth((t-17)/.8)*(1-smooth((t-19.5)/.5));this.can.visible=true;
  const d=(t-18.4)/.9;this.drop.visible=d>=0&&d<=1;this.drop.position.set(3.3+.20*(1-d),lerp(1.19,.81,Math.max(0,Math.min(1,d*d))),.06);
  const gr=growAt(t),bl=bloomAt(t);this.plant.visible=t>=22;this.plant.scale.set(.45+.55*gr,Math.max(.001,gr),.45+.55*gr);
  this.flower.scale.setScalar(.25+.75*bl);this.flower.rotation.z=Math.sin(t*1.1)*.025;this.flower.rotation.x=-.16;
  for(let i=0;i<this.petals.length;i++){this.petals[i].rotation.x=lerp(-1.25,0,bl);this.petals[i].scale.set(lerp(.28,1,bl),1,1);}
  for(let i=0;i<this.leaves.length;i++)this.leaves[i].rotation.y=(i%3-1)*.35+Math.sin(t*2+i)*.07;
  this.leafPlatform.visible=t>22.8;this.leafPlatform.position.set(3.3,liftAt(t)+.04,0);this.leafPlatform.scale.setScalar(Math.max(.001,smooth((t-22.8)/.6)));this.leafPlatform.rotation.z=Math.PI/2;
  this.shadow.position.set(s.x,.024,0);this.shadow.scale.setScalar(1+s.y*.12);(this.shadow.material as THREE.MeshBasicMaterial).opacity=1-s.y*.1;
  (this.shade.material as THREE.MeshBasicMaterial).opacity=.62*bl;this.shade.scale.setScalar(Math.max(.001,bl));
  for(let i=0;i<this.clouds.length;i++)this.clouds[i].position.x=-40+i*8+t*.08;
  for(let i=0;i<this.neighbors.length;i++){const a=this.neighbors[i],u=smooth((t-43-i*.7)/3.5);a.root.visible=t>43+i*.7;a.root.position.set(lerp(i?10:-5,i?6.2:-.4,u),0,-.5-i*.3);a.root.rotation.y=Math.atan2(camera.position.x-a.root.position.x,camera.position.z+.5);a.pose(f,{expr:'grin',mode:u<1?'stroll':'stand',phase:t*1.8,look:i?-1:1});}
  for(const a of [this.nico,this.client,...this.neighbors]){const shade=bl*(1-smooth((Math.abs(a.root.position.x-3)-3.9)/1.3));(a.body.material as THREE.MeshLambertMaterial).color.copy(new THREE.Color('#ffffff').lerp(new THREE.Color('#a0b5d4'),shade*.65));}if(t>=49.8)this.hatSprout.position.copy(this.nico.capAnchor());this.hatSprout.scale.setScalar(smooth((t-49.8)/.7));
 }
 dispose(){const geos=new Set<THREE.BufferGeometry>(),mats=new Set<THREE.Material>(),tex=new Set<THREE.Texture>();this.root.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)geos.add(m.geometry);if(m.material)for(const a of Array.isArray(m.material)?m.material:[m.material]){mats.add(a);for(const v of Object.values(a))if(v instanceof THREE.Texture)tex.add(v);}});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());tex.forEach(t=>t.dispose());}
}



