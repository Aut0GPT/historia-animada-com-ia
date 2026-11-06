import React,{useLayoutEffect,useRef} from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {growAt,liftAt,smooth} from './story';
const ink='#342c49';
function paper(g:CanvasRenderingContext2D,t:number){
 const W=540,H=960,gr=growAt(t),lift=liftAt(t),base=790;
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);g.fillStyle='#e9dcc2';g.fillRect(0,0,W,H);g.translate(-54,-158);g.scale(1.2,1.2);
 const poly=(pts:number[][],color:string,shadow=true)=>{g.save();if(shadow){g.shadowColor='#342b4933';g.shadowOffsetX=4;g.shadowOffsetY=7;g.shadowBlur=4;}g.fillStyle=color;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();g.restore();g.strokeStyle='#ffffff55';g.lineWidth=2;g.stroke();};
 poly([[0,460],[70,430],[150,465],[210,425],[310,460],[430,400],[540,450],[540,960],[0,960]],'#a3b8a0');
 for(let i=0;i<5;i++){const x=-30+i*132+Math.sin(t*.3)*2,h=145+(i%3)*35;poly([[x,660],[x,660-h],[x+110,660-h],[x+110,660]],['#cf926f','#b7a0b7','#e1bb8e'][i%3]);poly([[x-9,660-h],[x+50,610-h],[x+120,660-h]],'#a86665');for(let k=0;k<3;k++){g.fillStyle='#637e85';g.fillRect(x+18+k*29,680-h,15,28);g.fillStyle='#f5dfac';g.fillRect(x+23+k*29,684-h,3,20);}g.fillStyle='#5a5b68';g.fillRect(x+45,614,25,46);}
 poly([[0,686],[540,657],[540,960],[0,960]],'#cebaa1');
 g.strokeStyle='#f3e6d5';g.lineWidth=2;for(let j=0;j<5;j++){g.beginPath();g.moveTo(0,720+j*58);g.lineTo(540,690+j*61);g.stroke();}
 function leaf(x:number,y:number,size:number,angle:number,color:string){g.save();g.translate(x,y);g.rotate(angle);g.shadowColor='#243b493f';g.shadowOffsetX=5;g.shadowOffsetY=6;g.shadowBlur=3;g.fillStyle=color;g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-size*.45,-size*.4,-size*.35,-size*.9,0,-size);g.bezierCurveTo(size*.4,-size*.8,size*.5,-size*.35,0,0);g.fill();g.shadowColor='transparent';g.strokeStyle='#d8dfad';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(0,-size*.9);g.stroke();g.restore();}
 if(gr>0){g.strokeStyle='#4f7c58';g.lineWidth=16;g.lineCap='round';g.beginPath();g.moveTo(270,base-48);g.bezierCurveTo(250,base-180*gr,286,base-340*gr,270,base-510*gr);g.stroke();for(let i=0;i<6;i++)leaf(270,base-48-(65+i*63)*gr,(75+i*4)*gr,(i%2?1:-1)*1.1,i%2?'#86a875':'#73976e');leaf(270,base-48-460*gr,55*gr,0,'#acc16d');}
 poly([[240,base-45],[300,base-45],[292,base],[248,base]],'#b96951');poly([[235,base-51],[305,base-51],[306,base-41],[235,base-41]],'#d68a63');
 if(t>22.8)leaf(270,base-lift*70,140*smooth((t-22.8)/.6),-Math.PI/2,'#759c64');
 function actor(x:number,y:number,client=false){const a=t>23&&t<29?Math.sin(t*6)*.25:0;g.save();g.translate(x,y);g.rotate(client?0:a*.12);const coat=client?'#a96f8a':'#b94468';
 const limb=(ax:number,ay:number,bx:number,by:number,col:string,w:number)=>{g.save();g.shadowColor='#32274444';g.shadowOffsetX=2;g.shadowOffsetY=3;g.strokeStyle=col;g.lineWidth=w;g.lineCap='butt';g.beginPath();g.moveTo(ax,ay);g.lineTo(bx,by);g.stroke();g.restore();g.fillStyle='#d8bfa0';g.beginPath();g.arc(ax,ay,3,0,7);g.fill();};
 limb(-10,-55,-15-(client?0:a*32),-6,'#41455a',10);limb(10,-55,16+(client?0:a*22),-8,'#41455a',10);g.fillStyle=ink;g.fillRect(-24-(client?0:a*32),-10,23,9);g.fillRect(10+(client?0:a*22),-11,23,9);
 if(client){poly([[-23,-118],[21,-118],[36,-38],[-35,-38]],'#dfae55');poly([[-23,-118],[21,-118],[24,-101],[-25,-101]],'#934964');}else poly([[-23,-118],[21,-118],[27,-51],[-26,-51]],coat);poly([[-22,-117],[-6,-104],[-12,-63],[-26,-51]],'#ffffff16',false);
 const shock=t>22.8;limb(-19,-106,-42,shock?-143:-71,coat,13);limb(20,-106,43,shock?-139:-70,coat,13);g.fillStyle='#eac29e';for(const [xx,yy]of [[-42,shock?-143:-71],[43,shock?-139:-70]]){g.beginPath();g.arc(xx,yy,7,0,7);g.fill();}
 g.save();g.translate(0,-145);g.rotate(client?-.08:shock?.1:Math.sin(t)*.04);poly([[-27,-26],[18,-29],[32,-7],[26,22],[-18,29],[-33,10]],'#f0cfaa');
 if(client)poly([[-32,5],[-34,-21],[-17,-35],[20,-33],[34,-12],[24,-12],[10,-26],[-20,-20]],'#62494d');else{poly([[-36,-17],[-31,-36],[17,-41],[30,-18]],'#ee9661');poly([[-37,-18],[43,-17],[38,-10],[-35,-10]],'#ce705b');}
 g.fillStyle=ink;g.fillRect(-13,-3,4,shock?11:6);g.fillRect(12,-3,4,shock?11:6);g.beginPath();if(shock)g.ellipse(3,15,6,8,0,0,7);else g.rect(-1,16,13,3);g.fill();g.restore();g.restore();}
 actor(390,base,true);actor(140,base-lift*70);
 // The paper fibre is deterministic and stays in the material coordinate system.
 g.globalAlpha=.045;for(let i=0;i<1700;i++){const x=(i*193)%540,y=(i*337)%960;g.fillStyle=i%2?'#fff8e2':'#352d47';g.fillRect(x,y,1+(i%4),1);}g.globalAlpha=1;
}
function pixel(g:CanvasRenderingContext2D,t:number){
 g.setTransform(1,0,0,1,0,0);t=Math.floor(t*12)/12;const gr=growAt(t),lift=liftAt(t),B=267;
 const r=(x:number,y:number,w:number,h:number,c:string)=>{g.fillStyle=c;g.fillRect(Math.round(x*1.2-18),Math.round(y*1.2-53),Math.max(1,Math.round(w*1.2)),Math.max(1,Math.round(h*1.2)))};
 r(0,0,180,320,'#93b3d9');r(0,120,180,90,'#b9c6bc');
 for(let i=0;i<6;i++){const x=-12+i*37,h=40+i%3*12;r(x,215-h,32,h,'#d8b08a');r(x-2,212-h,36,4,'#6a586f');for(let j=0;j<5;j++)r(x+2+j*3,207-h-j*2,28-j*6,3,'#a9686b');for(let j=0;j<3;j++){r(x+4+j*10,222-h,6,9,'#40546e');r(x+5+j*10,223-h,2,6,'#e7d9a3');}r(x+13,200,7,15,'#615164');}
 for(let i=0;i<9;i++){const x=(i*39+8)%180;r(x,194-i%3*8,20,15,'#6c9479');r(x+6,188-i%3*8,10,24,'#6c9479');}
 r(0,220,180,100,'#ccb79a');for(let i=0;i<170;i++)r((i*37)%180,224+(i*19)%96,3,1,i%2?'#e2cbaa':'#b9a68f');
 const px=(x:number,y:number,s:number,col:string)=>r(x,y,s,s,col);
 if(gr>0){const height=169*gr;for(let i=0;i<height;i+=3)r(89+Math.round(Math.sin(i*.04)*2),B-17-i,4,4,'#477d55');for(let i=0;i<6;i++){const y=B-23-(20+i*19)*gr,side=i%2?1:-1;for(let j=0;j<8*gr;j++){r(90+side*j*2,y-j,side>0?8:7,3,'#679e59');}r(90+side*12*gr,y-7*gr,5*gr,2,'#b0c66c');}r(83,B-22-height,16,14,'#8eaf5c');r(87,B-26-height,8,5,'#b9c773');}
 r(79,B-17,23,5,'#d68459');r(82,B-12,18,12,'#ac624f');r(84,B-11,2,10,'#d18a60');
 if(t>22.8){for(let j=0;j<13;j++){const y=B-lift*23.4-Math.sin(j/13*Math.PI)*3;r(49+j*3,y,7,3,j%2?'#76a75c':'#65984f');}r(54,B-lift*23.4-1,34,1,'#b2c779');}
 function sprite(x:number,y:number,client=false){x=Math.round(x);y=Math.round(y);const shocked=t>23,pose=Math.floor(t*12)%4;const coat=client?'#a86186':'#b63b66';r(x-5,y-19,4,17,'#303650');r(x+3,y-19,4,shocked&&!client?11:17,'#303650');r(x-7,y-3,7,3,ink);r(x+3,y-(shocked&&!client?9:3),8,3,ink);r(x-9,y-41,18,24,ink);if(client){r(x-8,y-40,16,10,'#92485d');r(x-9,y-30,18,10,'#dfaa43');r(x-11,y-20,22,5,'#dfaa43');r(x-12,y-15,24,3,'#dfaa43');}else r(x-8,y-40,16,21,coat);if(!client)r(x-7,y-39,3,20,'#db5976');r(x-10,y-40,3,shocked?5:18,coat);r(x+9,y-40,3,shocked?5:18,coat);if(shocked){r(x-14,y-48-(pose%2),4,12,coat);r(x+12,y-48+pose%2,4,12,coat);r(x-14,y-51-pose%2,4,4,'#f0cca8');r(x+12,y-51+pose%2,4,4,'#f0cca8');}else{r(x-10,y-23,3,4,'#f0cca8');r(x+9,y-23,3,4,'#f0cca8');}r(x-10,y-60,20,20,ink);r(x-9,y-60,18,18,'#f0cca8');r(x-11,y-62,22,6,client?'#63484e':'#e18a55');r(x-8,y-66,17,5,client?'#63484e':'#e18a55');if(!client)r(x+7,y-58,7,3,'#c66a4b');r(x-5,y-53,2,shocked?4:2,ink);r(x+4,y-53,2,shocked?4:2,ink);r(x,y-45,shocked?3:6,shocked?3:1,ink);}
 sprite(132,B,true);sprite(49,B-lift*23.4);
}
export const Alternate=({kind}:{kind:'paper'|'pixel'})=>{const ref=useRef<HTMLCanvasElement>(null);const frame=useCurrentFrame();const pix=kind==='pixel';useLayoutEffect(()=>{const g=ref.current!.getContext('2d')!;(pix?pixel:paper)(g,20+frame/30)},[frame,pix]);return <AbsoluteFill><canvas ref={ref} width={pix?180:540} height={pix?320:960} style={{width:'100%',height:'100%',imageRendering:pix?'pixelated':'auto'}}/><Audio src={staticFile('mix.mp3')} startFrom={600}/></AbsoluteFill>};
export const Paper=()=> <Alternate kind="paper"/>;
export const Pixel=()=> <Alternate kind="pixel"/>;


