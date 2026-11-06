import React,{useMemo,useEffect} from 'react';
import {AbsoluteFill,Audio,Composition,staticFile,useCurrentFrame,useVideoConfig,getInputProps} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {EffectComposer} from '@react-three/postprocessing';
import {ToneMappingEffect,ToneMappingMode,BloomEffect} from 'postprocessing';
import * as THREE from 'three';
import {InkPass} from './look/ink';
import {LensBlur} from './look/lensblur';
import {GradeEffect,GRADES} from './look/grade';
import {estiloAtual} from './estilo';
import {World} from './world';
import {TOTAL,FPS,cameraAt} from './story';
import {Paper,Pixel} from './Alternatives';

const Inner=({offset=0}:{offset?:number})=>{
 const frame=useCurrentFrame()+offset;const {camera,scene}=useThree();
 const world=useMemo(()=>new World(),[]);
 const E=useMemo(()=>estiloAtual(),[]);
 const sky=useMemo(()=>{const cv=document.createElement('canvas');cv.width=4;cv.height=512;const g=cv.getContext('2d')!;const q=g.createLinearGradient(0,0,0,512);for(const [o,c] of E.ceu)q.addColorStop(o,c);g.fillStyle=q;g.fillRect(0,0,4,512);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;return t;},[E]);
 const fog=useMemo(()=>new THREE.Fog(E.neblina,E.neblinaPerto,E.neblinaLonge),[E]);
 const fx=useMemo(()=>({ink:new InkPass(scene,camera as THREE.PerspectiveCamera,{widthNear:3.7,widthFar:2.8}),lens:new LensBlur({maxCoC:20}),tone:new ToneMappingEffect({mode:ToneMappingMode.NEUTRAL}),grade:(()=>{const g=new GradeEffect(GRADES.day,.65);g.set(GRADES.day,GRADES.golden,E.grade);return g;})(),bloom:new BloomEffect({intensity:.18,luminanceThreshold:1,mipmapBlur:true})}),[camera,scene,E]);
  useEffect(()=>()=>{sky.dispose();fx.ink.dispose();fx.lens.dispose();fx.tone.dispose();fx.grade.dispose();fx.bloom.dispose();world.dispose();},[fx,world,sky]);
 const c=camera as THREE.PerspectiveCamera;const shot=cameraAt(frame/FPS);
 c.position.set(...shot.pos);c.up.set(Math.sin(shot.roll),Math.cos(shot.roll),0);c.lookAt(...shot.look);c.fov=shot.fov;c.layers.enableAll();c.updateProjectionMatrix();c.updateMatrixWorld();
 scene.background=sky;scene.fog=fog;
 world.update(frame,c);
 const forward=new THREE.Vector3();c.getWorldDirection(forward);
 fx.lens.focus=new THREE.Vector3(...shot.look).sub(c.position).dot(forward);fx.lens.cInf=Number(getInputProps().blurTest??shot.blur);
 return <><primitive object={world.root}/>{!getInputProps().noPost&&<EffectComposer multisampling={0}><primitive object={fx.ink}/><primitive object={fx.lens.pre}/><primitive object={fx.lens.main}/><primitive object={fx.bloom}/><primitive object={fx.tone}/><primitive object={fx.grade}/></EffectComposer>}</>;
};
export const Film=({offset=0}:{offset?:number})=>{const {width,height}=useVideoConfig();return <AbsoluteFill style={{background:estiloAtual().fundo}}><ThreeCanvas width={width} height={height} shadows gl={{antialias:false,powerPreference:'low-power'}} camera={{near:.15,far:200,fov:40}}><Inner offset={offset}/></ThreeCanvas><Audio src={staticFile('mix.mp3')} startFrom={offset}/></AbsoluteFill>};
const Compare=()=> <Film offset={600}/>;
export const Root=()=> <>
<Composition id="Jardim25D" component={Film} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>
<Composition id="JardimComparacao" component={Compare} durationInFrames={300} fps={FPS} width={1080} height={1920}/>
<Composition id="JardimPapel" component={Paper} durationInFrames={300} fps={FPS} width={1080} height={1920}/>
<Composition id="JardimPixel" component={Pixel} durationInFrames={300} fps={FPS} width={1080} height={1920}/>
</>;
