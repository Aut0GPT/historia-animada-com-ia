"""Original score and cartoon foley. Deterministic local synthesis; no API/audio downloads."""
from pathlib import Path
import math,json,wave,subprocess,os
import numpy as np
R=Path(__file__).resolve().parents[1];A=R/'audio';A.mkdir(exist_ok=True)
SR=48000;D=52;N=SR*D;rng=np.random.default_rng(302)
music=np.zeros((N,2),dtype=np.float32);fx=np.zeros_like(music);cues=[]
def add(dst,y,t,amp=1,pan=0):
    i=int(t*SR);n=min(len(y),N-i)
    if n<=0 or i<0:return
    dst[i:i+n,0]+=y[:n]*amp*math.sqrt((1-pan)/2);dst[i:i+n,1]+=y[:n]*amp*math.sqrt((1+pan)/2)
def note(m,d=.3,kind='pluck'):
    t=np.arange(round(SR*d))/SR;f=440*2**((m-69)/12)
    if kind=='flute':
        y=np.sin(2*np.pi*f*t+.025*np.sin(t*31))+.18*np.sin(4*np.pi*f*t)+.045*np.sin(6*np.pi*f*t)
        env=np.minimum(t/.055,1)*np.minimum((d-t)/.1,1)
    elif kind=='string':
        y=sum(np.sin(2*np.pi*f*(1+k*.0001)*t*k)/k**1.4 for k in range(1,7));env=np.minimum(t/.14,1)*np.minimum((d-t)/.25,1)
    elif kind=='bell':
        y=np.sin(2*np.pi*f*t)*np.exp(-t*6)+.42*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*14);env=np.minimum(t/.003,1)
    elif kind=='bass':
        y=np.sin(2*np.pi*f*t)+.22*np.sin(4*np.pi*f*t);env=np.minimum(t/.006,1)*np.exp(-t*7)
    else:
        y=np.sin(2*np.pi*f*t)+.32*np.sin(4*np.pi*f*t)+.13*np.sin(6*np.pi*f*t);env=np.minimum(t/.004,1)*np.exp(-t*10)
    return (y*env).astype(np.float32)
def pop(t,m=72,amp=.18,d=.18):
    x=np.arange(int(d*SR))/SR;f=440*2**((m-69)/12);add(fx,np.sin(2*np.pi*(f*x-200*x*x))*np.exp(-x*24),t,amp);cues.append({'time':t,'event':'pop','midi':m})
def whoosh(t,d=.7,amp=.1):
    x=np.arange(round(d*SR))/SR;n=rng.normal(0,1,len(x));n=np.convolve(n,np.ones(19)/19,'same');add(fx,n*np.sin(np.pi*x/d)**2,t,amp);cues.append({'time':t,'event':'air-and-leaf','duration':d})
beat=60/116
chords=[[53,57,60],[50,53,57],[46,50,53],[48,52,55]]
for k,t in enumerate(np.arange(.15,50.1,beat/2)):
    chord=chords[(k//8)%4]
    if 18.0<t<22.0:continue
    if 22<t<30:continue
    amp=.09 if t<18 else .065
    add(music,note(chord[k%3]+12,.3),t,amp,(-.45 if k%2 else .45))
    if k%2==0:add(music,note(chord[0]-12,.42,'bass'),t,.10,-.1)
    if k%4 in [1,3]:
        x=np.arange(int(.06*SR))/SR;shaker=rng.normal(0,1,len(x))*np.exp(-x*65);add(music,shaker,t,.012,.55)
    if k%8==0 and t>30:
        for n in chord:add(music,note(n+12,1.9,'string'),t,.019,-.3)
mel=[77,81,79,74,76,77,72,76,74,72,69,72,74,76,77,81]
for k in range(22):
    t=4+k*beat
    if t<15.7:add(music,note(mel[k%len(mel)],beat*.8,'flute'),t,.068,.2)
for k in range(22):
    t=33+k*beat
    if t<45:add(music,note([77,79,81,84,81,79,77,72,74,77,76][k%11],beat*.88,'flute'),t,.065,.15)
# Hook: the box answers three increasingly impatient knocks.
for t,m in [(0.45,67),(1.25,72),(2.2,79)]:pop(t,m,.12);add(music,note(m+12,.45,'bell'),t+.08,.085,.1)
for t in np.arange(4.1,9.9,.31):
    x=np.arange(int(.075*SR))/SR;y=(np.sin(2*np.pi*135*x)+rng.normal(0,.15,len(x)))*np.exp(-x*65);add(fx,y,t,.10,-.2)
whoosh(11.1,.5,.15);pop(11.9,84,.13);add(music,note(89,1,'bell'),12.05,.15)
pop(15.35,76,.15);whoosh(15.5,.65,.15);pop(15.98,48,.10);pop(16.5,64,.12);pop(20.95,55,.06)
whoosh(17,.7,.08)
# One drop: rising resonant plink followed by soil contact.
x=np.arange(int(.4*SR))/SR;add(fx,np.sin(2*np.pi*(900*x+800*x*x))*np.exp(-x*18),19.25,.28);cues.append({'time':19.25,'event':'last-water-drop'})
for t in [20.4,21.1]:add(fx,note(84,.08,'bell'),t,.022,.45)
for k,t in enumerate(np.arange(22.0,29.5,.24)):
    add(music,note([53,57,60,65,69,72,77,81][k%8]+(k//8)*2,.33),t,.105,math.sin(k)*.5)
    if k%4==0:pop(t,45+k,.09)
whoosh(22,.8,.20);whoosh(24,1.3,.24);whoosh(26.5,1.5,.25);whoosh(30,2,.16)
for k,n in enumerate([65,69,72,77,81,84]):add(music,note(n,2.7,'bell'),30+k*.16,.10,(-.5+k*.2))
for n in [53,57,60,65]:add(music,note(n,3.5,'string'),30,.035)
whoosh(36,2,.1);whoosh(40.7,1,.1);pop(42.4,48,.18)
for k,n in enumerate([72,77,81,84]):add(music,note(n,.8,'bell'),44+k*.15,.08)
pop(49.9,83,.18);whoosh(49.9,.4,.1)
for k,n in enumerate([77,81,89]):add(music,note(n,.55),50.15+k*.22,.13)
for n in [53,57,60,65,77]:add(music,note(n,1.1,'bell'),50.85,.055)
fade=np.minimum(np.arange(N)/SR/.025,1)*np.minimum((N-np.arange(N))/SR/.35,1)
mix=(music+fx)*fade[:,None]
def wav(path,data):
    with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.int16(np.clip(data,-1,1)*32767).tobytes())
for name,data in [('music-original',music),('sfx-original',fx),('mix-premaster',mix)]:wav(A/(name+'.wav'),data)
ff=os.environ.get('FFMPEG','ffmpeg')
p=subprocess.run([ff,'-y','-hide_banner','-i',str(A/'mix-premaster.wav'),'-af','loudnorm=I=-17:TP=-2:LRA=8:print_format=json','-ar',str(SR),'-c:a','libmp3lame','-b:a','192k',str(R/'public/mix.mp3')],capture_output=True,text=True,check=True)
(A/'mastering.txt').write_text(p.stderr,encoding='utf-8')
(A/'cues.json').write_text(json.dumps({'duration':D,'bpm':116,'original_local_synthesis':True,'external_cost':0,'cues':cues},indent=2),encoding='utf-8')
print(json.dumps({'duration':D,'peak_premaster':float(np.max(np.abs(mix))),'cues':len(cues)}))
