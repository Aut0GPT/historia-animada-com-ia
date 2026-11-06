export const FPS=30;
export const TOTAL=52*FPS;
export const smooth=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x*x*x*(x*(x*6-15)+10)};
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const growAt=(t:number)=>smooth((t-22)/7);
export const bloomAt=(t:number)=>smooth((t-30)/4);
export const liftAt=(t:number)=>3.65*smooth((t-23.2)/5.2)*(1-smooth((t-36)/6.5));
export function stateAt(t:number){return {x:lerp(-3.8,1.45,smooth((t-4)/6)),y:liftAt(t),walking:t>=4&&t<10,grow:growAt(t),bloom:bloomAt(t)}}
type V=[number,number,number];
type Shot={pos:V;look:V;fov:number;blur:number;roll:number};
export function cameraAt(t:number):Shot{
 const s=stateAt(t);const growth=growAt(t);
 if(t<3.8)return {pos:[-1.9,2.7,6.8],look:[-3.1,1.75,0],fov:43-t*.25,blur:1.4,roll:0};
 if(t<10)return {pos:[s.x+2,4.25,11],look:[s.x+1.0,1.7,0],fov:41,blur:.45,roll:0};
 if(t<12.5)return {pos:[3.9,3.5,8],look:[3.3,1.8,0],fov:43-t*.07,blur:.5,roll:0};
 if(t<15)return {pos:[4.3,3.8,10.5],look:[3.6,1.65,0],fov:42,blur:.6,roll:0};
 if(t<17)return {pos:[4.8,2.7,5.3],look:[3.3,1.15,0],fov:41,blur:1.1,roll:0};
 if(t<18.8)return {pos:[4.3,3.6,9.5],look:[3.9,1.6,0],fov:42,blur:.5,roll:0};
 if(t<19.5)return {pos:[4.8,2.7,5.3],look:[3.3,1.15,0],fov:41,blur:1.1,roll:0};
 if(t<20)return {pos:[4.3,3.6,9.5],look:[3.9,1.6,0],fov:42,blur:.5,roll:0};
 if(t<22)return {pos:[2.5,3.4,5.8],look:[2.3,1.85,0],fov:44,blur:1,roll:0};
 if(t<30)return {pos:[4.5,lerp(4.1,7.1,growth),lerp(10,19,growth)],look:[3.1,lerp(1.9,4.7,growth),0],fov:43,blur:.2,roll:Math.sin(t*14)*.006*Math.sin(growth*Math.PI)};
 if(t<36)return {pos:[lerp(5.0,7.2,(t-30)/6),9,20],look:[3.2,5.3,0],fov:42,blur:.35,roll:0};
 if(t<43)return {pos:[5.2,lerp(7.7,4.5,smooth((t-36)/7)),17],look:[3.1,lerp(4.5,2.6,smooth((t-36)/7)),0],fov:43,blur:.2,roll:0};
 if(t<49.4)return {pos:[lerp(6.4,7.5,(t-43)/6.4),6,19],look:[3,3.8,0],fov:44,blur:.25,roll:0};
 return {pos:[2.4,3.1,5.0],look:[1.45,2.25,0],fov:35,blur:1.4,roll:0};
}
