"use strict";
/* =====================================================================
   ÉTHER — rendu WebGL2 : shaders, ombres, visibilité du ciel, herbe instanciée
   ===================================================================== */
const canvas=document.getElementById('c');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
if(!gl){document.getElementById('err').style.display='flex';throw new Error('no webgl2');}

const COMMON=`
uniform vec3 uHor,uSeaC,uZen,uMid,uSun,uGlow,uCam;uniform float uTime,uNight;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+1.),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+17.1;a*=.5;}return s;}
float fbm3(vec2 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.03+17.1;a*=.5;}return s;}
vec3 skyGrad(float y){float t=max(y,0.);vec3 c=mix(uHor,uMid,smoothstep(0.,.32,t));return mix(c,uZen,smoothstep(.22,1.,t));}
/* brume : plus chaude et plus claire vers le soleil */
vec3 fogCol(vec3 dir){float s=max(dot(dir,uSun),0.);return mix(uHor,min(uHor+uGlow*.22,vec3(1.)),pow(s,5.)*(1.-uNight));}
/* courbe de contraste et grain */
vec4 fin(vec3 c){c=clamp(c,0.,1.);c=mix(c,c*c*(3.-2.*c),.42);
  return vec4(c+(h21(gl_FragCoord.xy*.37+fract(uTime)*7.)-.5)*(2.4/255.),0.);}
`;
const LIGHT=`
uniform mat4 uSVP,uTVP;uniform sampler2DShadow uSh;uniform sampler2D uTop;uniform float uTopR;
uniform vec3 uLampC;uniform vec4 uLampP;uniform vec2 uLampO;uniform vec4 uDark;uniform vec3 uDarkL;
const vec2 PO[8]=vec2[8](vec2(-.61,.42),vec2(.17,.88),vec2(.72,.31),vec2(.35,-.36),vec2(-.28,-.14),vec2(-.83,-.47),vec2(-.12,-.93),vec2(.90,-.38));
float shadow(vec3 wp,vec3 n){
  vec4 sp=uSVP*vec4(wp+n*.07,1.);vec3 s=sp.xyz*.5+.5;
  if(s.x<0.||s.x>1.||s.y<0.||s.y>1.||s.z>1.)return 1.;
  float e=1.7/${SHADOW_RES}.,z=s.z-.00016,r=0.;
  for(int k=0;k<8;k++)r+=texture(uSh,vec3(s.xy+PO[k]*e,z));
  r*=.125;float ed=max(abs(s.x-.5),abs(s.y-.5))*2.;return mix(r,1.,smoothstep(.85,1.,ed));
}
/* part de ciel visible au-dessus du point : sombre sous un toit, assombri au pied des murs */
float skyVis(vec3 wp,vec3 n){
  vec4 sp=uTVP*vec4(wp+n*.3,1.);vec3 s=sp.xyz*.5+.5;
  float ed=max(abs(s.x-.5),abs(s.y-.5))*2.;if(ed>=1.)return 1.;
  float z=s.z-.0007,v=0.;
  for(int k=0;k<8;k++)v+=step(z,texture(uTop,s.xy+PO[k]*uTopR).r);
  return mix(v*.125,1.,smoothstep(.8,1.,ed));
}
/* éclairage artificiel : lampes posées sur un réseau régulier */
vec3 lamps(vec3 wp,vec3 n){
  if(uLampP.w<=0.)return vec3(0.);
  vec2 b=floor((wp.xz-uLampO)/uLampP.xy);vec3 acc=vec3(0.);float r2=uLampP.w*uLampP.w;
  for(int a=0;a<2;a++)for(int c=0;c<2;c++){
    vec2 lc=(b+vec2(a,c))*uLampP.xy+uLampO;vec3 L=vec3(lc.x,uLampP.z,lc.y)-wp;float d2=dot(L,L);
    float f=r2/max(d2,.5);acc+=uLampC*min(f*f,1.15)*(max(dot(n,L*inversesqrt(d2)),0.)*.75+.25);}
  return acc;
}
`;
const HEAD='#version 300 es\nprecision highp float;\nprecision highp sampler2DShadow;\n';
const BENDF=`uniform vec3 uBend;vec3 wbend(vec3 w){if(uBend.z<.5)return w;float th=(w.x-uBend.x)/uBend.y,rr=uBend.y-w.y;return vec3(uBend.x+rr*sin(th),uBend.y-rr*cos(th),w.z);}
`;
let BENDV=[0,1,0];
const VS_MAIN=HEAD+`out float vWd;layout(location=0)in vec3 aP;layout(location=1)in vec3 aN;layout(location=2)in float aM;
uniform mat4 uVP;uniform vec3 uOff;uniform vec2 uRot,uTilt;out vec3 vW;out vec3 vN;flat out float vM;
${BENDF}void main(){vec3 p=vec3(aP.x,aP.y*uTilt.x-aP.z*uTilt.y,aP.y*uTilt.y+aP.z*uTilt.x),q=vec3(aN.x,aN.y*uTilt.x-aN.z*uTilt.y,aN.y*uTilt.y+aN.z*uTilt.x);
  vW=vec3(p.x*uRot.x-p.z*uRot.y,p.y,p.x*uRot.y+p.z*uRot.x)+uOff;vN=vec3(q.x*uRot.x-q.z*uRot.y,q.y,q.x*uRot.y+q.z*uRot.x);vM=aM;gl_Position=uVP*vec4(wbend(vW),1.);vWd=gl_Position.w;}`;
const FS_MAIN=HEAD+`in float vWd;in vec3 vW;in vec3 vN;flat in float vM;out vec4 o;
uniform vec3 uAmbUp,uAmbDn,uSunC,uAccent,uDoorC,uIndoor;uniform float uCloudY,uSunK,uFogD,uWater;uniform vec2 uStripe;
${COMMON}${LIGHT}
/* distance au bord de cellule de Voronoï : fissures */
float crack(vec2 p){vec2 i=floor(p),f=fract(p);float d1=9.,d2=9.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y),o=vec2(h21(i+g),h21(i+g+31.7));float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
  return d2-d1;}
void main(){gl_FragDepth=log2(1.+max(vWd,0.))*0.07160311;
  vec3 n=normalize(vN);int m=int(vM+.5);
  vec3 V=normalize(uCam-vW);float d=length(uCam-vW);
  vec3 wq=abs(n);wq*=wq;wq*=wq;wq/=(wq.x+wq.y+wq.z);vec2 uv=wq.y*vW.xz+wq.x*vW.zy+wq.z*vW.xy;
  vec3 col;float fogK=1.,emi=0.;
  if(m==4){col=uDoorC;fogK=.3;emi=1.;}
  else if(m==17){col=vec3(1.05,1.03,.97);fogK=.5;emi=1.;}
  else if(m==25){col=vec3(1.1,.72,.30);fogK=.4;emi=1.;}
  else if(m==73){ /* l'écran de cinéma : un vieux film en noir et blanc, qui tremble */
    vec2 q=vW.xy*.35+vec2(uTime*.05,0.);float fl=.86+.14*sin(uTime*41.)*sin(uTime*13.),sc=step(.995,fract(sin(floor(vW.x*7.+uTime*3.)*91.7)*4375.));
    col=vec3(.92,.88,.80)*(.35+.55*vn(q*1.3+floor(uTime*.4)*7.)+.15*vn(q*6.))*fl+sc*.4;fogK=.6;emi=.9;}
  else if(m==71){col=vec3(1.15,.22,.85);fogK=.35;emi=1.;} /* néon magenta */
  else if(m==72){col=vec3(.2,.95,1.15);fogK=.35;emi=1.;} /* néon cyan */
  else if(m==82){ /* moniteur cardiaque : une ligne verte qui bat, une grille */
    float sx=(abs(n.x)>abs(n.z)?vW.z:vW.x)*4.2,x=fract(sx-uTime*.55),yy=fract(vW.y*5.)-.5;
    float h=.30*exp(-pow((x-.45)*38.,2.))-.12*exp(-pow((x-.49)*40.,2.))+.06*exp(-pow((x-.70)*12.,2.));
    float ln=smoothstep(.035,.0,abs(yy-h))*(.35+.65*smoothstep(.0,.6,1.-x));vec2 gq=abs(fract(vec2(sx,vW.y*5.)*4.)-.5);
    col=vec3(.01,.03,.02)+vec3(.0,.10,.05)*step(.46,max(gq.x,gq.y))+vec3(.25,1.15,.45)*ln;fogK=.5;emi=.4+ln*.6;}
  else if(m==84){ /* abat-jour allumé : tissu chaud, plus clair en bas */
    col=vec3(1.05,.78,.46)*(.82+.18*vn(vec2(atan(vN.x,vN.z)*20.,vW.y*30.)));fogK=.45;emi=.85;}
  else if(m==28){float rim=pow(1.-max(dot(n,V),0.),3.);col=vec3(.005,.005,.008)+uHor*rim*.05;fogK=.9;}
  else if(m==39){ /* œil : la pupille est toujours tournée vers vous */
    float e=dot(n,V);vec3 sc=mix(vec3(.80,.40,.38),vec3(.97,.95,.93),smoothstep(.12,.55,e));
    vec3 ir=mix(vec3(.20,.08,.05),vec3(.50,.23,.10),smoothstep(.935,.972,e)*(.7+.3*vn(vW.xy*60.)));
    col=mix(sc,ir,smoothstep(.915,.935,e));col=mix(col,vec3(.008),smoothstep(.976,.983,e));
    col*=max(min(uAmbUp+uSunC*.5,vec3(1.)),vec3(.46));
    vec3 R=reflect(-V,n);col+=vec3(1.)*pow(max(dot(R,normalize(uSun+vec3(.3,.9,.2))),0.),70.)*.85;fogK=.8;
  }else if(m==40){ /* plumes */
    float f=.76+.24*vn(vec2((vW.x+vW.z)*10.,vW.y*34.));
    col=mix(vec3(.88,.78,.83),vec3(1.,.98,.98),f)*max(min(mix(uAmbDn,uAmbUp,.7)+uSunC*.5,vec3(1.)),vec3(.42));fogK=.8;
  }
  else if(m==53){col=mix(vec3(.66,.86,.93),vec3(1.),vn(vec2((vW.x+vW.z)*44.,vW.y*3.+uTime*9.)))*max(min(uAmbUp+uIndoor,vec3(1.)),vec3(.5));fogK=.7;}
  else if(m>=54&&m<=56){ /* bureaux la nuit : moquette, cloisons, mobilier sous les néons */
    vec3 al=m==54?vec3(.24,.27,.33)*(.86+.28*vn(uv*34.)):m==55?vec3(.66,.67,.66)*(.95+.05*vn(uv*3.)):vec3(.44,.37,.30)*(.9+.1*vn(uv*vec2(2.,14.)));
    col=al*(.50+.26*n.y)*vec3(.94,1.,.98);fogK=.5;}
  else if(m==61){ /* tableau des départs : des lignes de points ambrés qui changent */
    vec2 g=vec2((abs(n.x)>abs(n.z)?vW.z:vW.x)/.42,vW.y/.72);vec2 id=floor(g);float row=h21(vec2(id.y,3.)),tk=floor(uTime*.25+row*7.);
    float on=step(.42,h21(id+tk*vec2(0.,13.)))*step(fract(id.x*.071+row),.78)*step(.28,fract(g.y))*smoothstep(.5,.3,abs(fract(g.x)-.5));
    on=mix(on,.3,clamp(fwidth(g.x)*1.5,0.,1.));col=vec3(.012,.013,.016)+vec3(1.1,.66,.16)*on;fogK=.6;emi=on*.8;}
  else if(m==29){float ck=step(.5,fract((vW.x+vW.z)*.9+uTime*.8));col=mix(vec3(.08,.72,.38),vec3(.72,1.,.84),ck);fogK=.5;}
  else if(m==8){
    vec2 q=fract(vW.xz*.625);float ring=abs(fract(length(q-.5)*3.-uTime*1.2)-.5)*2.;
    col=mix(vec3(.16,.50,1.),vec3(.80,.95,1.),smoothstep(.35,.9,ring));if(abs(n.y)<.5)col=vec3(.20,.52,.98);fogK=.6;
  }else if(m==6||m==7){
    float ndl=max(dot(n,uSun),0.);vec3 alb=vec3(.93,.93,.92);vec3 em=vec3(0.);
    if(m==6){
      if(abs(n.y)<.5){
        vec2 g=uv/vec2(7.,4.5);vec2 fw=fwidth(g);vec2 f=fract(g);
        float win=smoothstep(.2,.2+fw.x,f.x)*(1.-smoothstep(.8-fw.x,.8,f.x))*smoothstep(.3,.3+fw.y,f.y)*(1.-smoothstep(.85-fw.y,.85,f.y));
        float fade=clamp(max(fw.x,fw.y)*2.2,0.,1.);
        alb=mix(alb,vec3(.36,.46,.62),mix(win,.3,fade)*.8);
        if(uNight>.5)em=vec3(1.,.74,.40)*mix(win*step(.86,h21(floor(g))),.035,fade)*.9;
      }
      vec2 G=uv/vec2(120.,90.);vec2 Fw=fwidth(G);vec2 F2=abs(fract(G)-.5);vec2 l=smoothstep(.5-Fw*1.5-.004,vec2(.5),F2);
      alb*=1.-.18*max(l.x,l.y)*clamp(1.-max(Fw.x,Fw.y)*3.,0.,1.);
      alb*=.90+.10*fbm3(uv*.012);
    }else{
      float G=vW.y/40.;float Fw=fwidth(G);float l=smoothstep(.5-Fw*1.5-.01,.5,abs(fract(G)-.5));alb*=1.-.12*l*clamp(1.-Fw*3.,0.,1.);
      if(uWater>.5){vec3 R=reflect(-V,n);alb=mix(vec3(.45,.86,.96),skyGrad(R.y),.55);}
    }
    vec3 amb=mix(uAmbDn*.85,uAmbUp,n.y*.5+.5);
    col=alb*(amb+uSunC*ndl*1.1)+em;emi=max(emi,min(1.,dot(em,vec3(.6))));
    float fd=min(1.-exp(-pow(d/2600.,1.2)),.93);
    col=mix(col,mix(fogCol(-V),skyGrad(-V.y),.5),fd);fogK=0.;
  }else if(m==14||m==24){
    vec3 R=reflect(-V,n);float fr=pow(1.-max(dot(n,V),0.),m==24?1.4:2.2);
    col=mix(skyGrad(R.y)*vec3(.90,1.04,1.07),vec3(1.),fr*.8)+vec3(1.)*pow(max(dot(R,uSun),0.),m==24?30.:90.)*.9;
    if(m==24)col*=.86+.14*max(dot(n,uSun),0.);
  }else{
    float sh=shadow(vW,n),vis=skyVis(vW,n),ndl=max(dot(n,uSun),0.);
    vec3 alb=vec3(.93),em=vec3(0.);float gloss=0.,refl=0.,hgt=0.,bump=0.;
    if(m==3||m==38){
      vec2 p=vW.xz;float t=uTime;
      vec2 gr=vec2(sin(p.x*2.1+t*1.3)+sin(p.y*1.7-t*1.1+p.x*.6)*.8+sin((p.x+p.y)*4.3+t*2.1)*.35,
                   cos(p.y*2.3+t*1.2)+cos(p.x*1.5+t*.9-p.y*.7)*.8+cos((p.x-p.y)*3.9-t*1.8)*.35)*.045;
      vec3 wn=normalize(vec3(gr.x,1.,gr.y));vec3 R=reflect(-V,wn);
      float fr=.03+.97*pow(1.-max(dot(wn,V),0.),4.);
      vec3 lit=mix(uIndoor,mix(uAmbDn,uAmbUp,.8),vis)+uSunC*sh*uSunK+lamps(vW,vec3(0.,1.,0.));
      vec3 base;
      if(uWater>.5){
        vec2 rp=p+gr*2.4;vec2 f=abs(fract(rp/.3)-.5);float line=smoothstep(.40,.5,max(f.x,f.y))*clamp(1.-d/26.,0.,1.);
        base=vec3(.42,.80,.84)*(1.-.12*line);
        float ca=abs(vn(rp*1.9+t*.35)-vn(rp*1.9-t*.3+7.3));base+=smoothstep(.07,0.,ca)*.20*(.3+.7*sh);
        if(m==38)base=mix(base,vec3(.02,.17,.32)+smoothstep(.07,0.,ca)*.05,.86); /* grand fond : bleu sombre, plus de carrelage visible */
        base*=min(lit,vec3(1.25));fr=min(fr*.6,.42);
      }else base=mix(vec3(.05,.24,.48),vec3(.12,.44,.66),.5+gr.x*4.)*lit;
      vec3 rf=mix(mix(uIndoor*1.5,vec3(1.),vis),skyGrad(R.y),smoothstep(.05,.45,R.y+gr.y*2.)*vis);
      if(uWater>.5)rf=mix(vec3(.74,.86,.86)*min(lit,vec3(1.)),skyGrad(R.y),smoothstep(.45,.85,R.y)*vis);
      col=mix(base,rf,fr)+vec3(1.,.97,.9)*pow(max(dot(R,uSun),0.),260.)*sh*1.5*uSunK;
    }else{
      if(m==0){ /* plâtre : salissures larges, coulures sur les murs */
        alb=vec3(.925,.925,.915)*(.93+.07*fbm3(uv*.45))*(.965+.035*vn(uv*11.));
        alb=mix(alb,alb*vec3(.86,.84,.78),smoothstep(.58,.82,fbm3(uv*.16+5.))*.55);
        if(abs(n.y)<.5)alb*=1.-.07*vn(vec2(uv.x*3.5,uv.y*.22));
        hgt=vn(uv*38.)*.5+fbm3(uv*4.)*.5;bump=.005;
      }else if(m==1){
        vec2 g=uv/(abs(n.y)>.5?vec2(1.5):vec2(3.,1.5));vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);
        vec2 l=smoothstep(.5-fw*1.5-.006,vec2(.5),f);float line=max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*4.,0.,1.);
        alb=vec3(.90,.90,.885)*(1.-.22*line)*(.90+.10*vn(floor(g)*7.3))*(.94+.06*fbm3(uv*1.3));
        hgt=vn(uv*30.)-line*2.;bump=.012;gloss=.12;
      }else if(m==2){
        alb=vec3(.90,.895,.875)*(.92+.08*fbm3(uv*.3));
        if(abs(n.y)<.5){
          vec2 g=uv/vec2(3.,3.2);vec2 fw=fwidth(g);vec2 f=fract(g);
          float wx=smoothstep(.24,.24+fw.x,f.x)*(1.-smoothstep(.76-fw.x,.76,f.x));
          float wy=smoothstep(.26,.26+fw.y,f.y)*(1.-smoothstep(.80-fw.y,.80,f.y));
          float win=wx*wy,fade=clamp(max(fw.x,fw.y)*2.2,0.,1.);
          float wm=mix(win,.28,fade);
          alb=mix(alb,vec3(.20,.27,.38),wm*.9);alb*=1.-.07*step(.955,f.y)*(1.-fade);
          gloss=.5*win*(1.-fade);refl=.5*win*(1.-fade);
          if(uNight>.5)em=vec3(1.,.74,.40)*mix(win*step(.80,h21(floor(g)+3.)),.05,fade);
        }
      }else if(m==9){ /* terre et herbe rase sous les brins */
        float a=fbm3(uv*.9)*.6+vn(uv*14.)*.4;alb=mix(vec3(.15,.29,.08),vec3(.30,.50,.15),a);
        alb=mix(alb,vec3(.26,.21,.13),smoothstep(.66,.84,vn(uv*.6+9.))*.3);if(abs(n.y)<.5)alb=vec3(.20,.17,.12)*(.8+.4*vn(uv*9.));
        hgt=vn(uv*22.);bump=.03;
      }else if(m==10){ /* carrelage */
        vec2 g=uv/.3;vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);vec2 l=smoothstep(.5-fw*1.2-.035,vec2(.5),f);
        float line=max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*2.5,0.,1.);
        alb=vec3(.93,.955,.95)*(1.-.30*line)*(.95+.05*vn(floor(g)*3.1));
        if(abs(n.y)<.5&&vW.y>uStripe.x&&vW.y<uStripe.y)alb=mix(alb,uAccent,.85);
        alb*=mix(vec3(1.),vec3(.93,.97,1.0),h21(floor(g)+.5)*.6);alb*=1.-.10*smoothstep(.55,.85,fbm3(uv*.22+1.));
        hgt=-line;bump=.02;gloss=.6;refl=.14;
      }else if(m==11){ /* carrosserie de rame */
        alb=vec3(.84,.86,.88);
        if(abs(n.y)<.5){if(vW.y>1.22&&vW.y<1.52)alb=uAccent;else if(vW.y<1.0)alb=vec3(.56,.60,.66);}
        alb*=.95+.05*vn(uv*3.);gloss=.5;refl=.12;
      }else if(m==12){alb=vec3(.16,.17,.20)*(.85+.3*vn(uv*18.));gloss=.4;}
      else if(m==13){ /* verre */
        alb=mix(vec3(.22,.62,.78),vec3(.50,.86,.95),smoothstep(0.,1.,fract(vW.y/3.)));
        if(abs(n.y)<.5){vec2 g=vec2((abs(n.x)>abs(n.z)?vW.z:vW.x)/2.,vW.y/3.);vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);vec2 l=smoothstep(.5-fw*1.5-.02,vec2(.5),f);
          alb=mix(alb,vec3(.96),max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*3.,0.,1.));}
        gloss=.9;refl=.62;
      }else if(m==15){ /* feuillage */
        alb=mix(vec3(.10,.30,.10),vec3(.36,.62,.18),vn(vW.xz*2.1+vW.y*1.7)*.6+vn(vW.xy*9.)*.4);ndl=dot(n,uSun)*.5+.5;sh=mix(sh,1.,.45);
      }else if(m==16){alb=uAccent*(.92+.08*vn(uv*6.));gloss=.25;}
      else if(m==28){alb=vec3(.070,.075,.095);}
      else if(m==41){alb=vec3(.50,.34,.19)*(.78+.34*vn(uv*1.4))*(.9+.1*vn(uv*9.));}
      else if(m>=42&&m<=45){ /* bardage */
        alb=(m==42?vec3(.90,.87,.78):m==43?vec3(.66,.76,.84):m==44?vec3(.70,.78,.66):vec3(.84,.74,.72))*(.95+.05*fbm3(uv*.6));
        if(abs(n.y)<.5){float f=fract(vW.y/.24);alb*=1.-.16*smoothstep(.84,1.,f)*clamp(1.-d/60.,0.,1.);}
      }else if(m==46){ /* bardeaux */
        vec2 g=uv*vec2(2.2,4.);g.x+=floor(g.y)*.5;alb=vec3(.21,.185,.18)*(.78+.3*h21(floor(g)))*(1.-.18*smoothstep(.8,1.,fract(g.y))*clamp(1.-d/50.,0.,1.));
      }else if(m==47){alb=vec3(.07,.09,.13);gloss=.8;refl=.55;}
      else if(m>=48&&m<=51){alb=(m==48?vec3(.50,.05,.06):m==49?vec3(.06,.12,.30):m==50?vec3(.60,.62,.65):vec3(.07,.24,.15));gloss=.9;refl=.30;}
      else if(m==30){ /* papier peint */
        alb=vec3(.80,.71,.36)*(.92+.08*fbm3(uv*.8))*(1.-.07*step(.5,fract(uv.x/.24)))*(1.-.05*step(.9,fract(uv.x/.24+uv.y/.48)));
        alb=mix(alb,alb*vec3(.62,.52,.36),smoothstep(.52,.80,fbm3(uv*.33+3.))*.6);alb*=mix(1.,.94+.06*vn(uv*26.),clamp(1.-d/20.,0.,1.));
        if(abs(n.y)<.5&&vW.y<.13)alb=vec3(.40,.32,.17);
      }else if(m==31){ /* moquette */
        alb=vec3(.56,.49,.27)*mix(1.,.74+.5*vn(uv*55.),clamp(1.-d/16.,0.,1.))*(.88+.12*fbm3(uv*.5));alb=mix(alb,alb*vec3(.55,.48,.38),smoothstep(.60,.82,fbm3(uv*.27+8.))*.7);hgt=vn(uv*50.);bump=.02;
      }else if(m==32){ /* dalles de plafond */
        vec2 g=uv/.6;vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);vec2 l=smoothstep(.5-fw*1.2-.03,vec2(.5),f);
        alb=vec3(.83,.81,.70)*(1.-.28*max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*2.5,0.,1.))*(.92+.08*vn(uv*25.));
      }else if(m==33){ /* marbre en damier */
        vec2 g=floor(uv/1.2);float ck=mod(g.x+g.y,2.);
        alb=mix(vec3(.72,.66,.84),vec3(.34,.19,.50),ck)*(.90+.10*fbm3(uv*1.1+g*3.));
        {float v=abs(sin(uv.x*1.7+uv.y*2.3+fbm3(uv*1.3+g)*7.));alb*=1.-.20*smoothstep(.07,0.,v);}gloss=.6;refl=.20;
        {float hb=h21(floor(uv/4.8+.37)+3.7);
          if(hb>.93){vec2 q=floor(uv/.3);alb=mod(q.x+q.y,2.)<.5?vec3(.90,.0,.85):vec3(.015);gloss=0.;refl=0.;}
          else if(hb>.85)alb=alb.brg*1.15;}
      }else if(m>=34&&m<=37){ /* peinture pastel */
        alb=(m==34?vec3(.96,.60,.69):m==35?vec3(.58,.88,.76):m==36?vec3(.98,.85,.48):vec3(.58,.76,.96))*(.93+.07*vn(uv*5.));gloss=.3;
      }
      else if(m==18){ /* béton sombre banché */
        float b=fbm3(uv*1.4);alb=vec3(.165,.17,.185)*(.72+.56*b);
        float j=smoothstep(.46,.5,abs(fract(uv.y/1.2)-.5));if(abs(n.y)<.5)alb*=1.-.25*j;
        hgt=vn(uv*26.)+b;bump=.03;
      }else if(m==19){ /* dallage beige craquelé */
        float cr=crack(uv*1.7),fine=crack(uv*5.3+3.);float ln=smoothstep(.045,0.,cr)+.5*smoothstep(.03,0.,fine);
        ln*=clamp(1.-fwidth(uv.x)*9.,0.,1.);
        alb=vec3(.80,.72,.58)*(.86+.14*fbm3(uv*.7))*(1.-.45*ln);hgt=-ln+vn(uv*30.)*.3;bump=.03;gloss=.08;
      }else if(m==20||m==22){ /* asphalte, marquage */
        float g1=vn(uv*40.),g2=fbm3(uv*.5);alb=vec3(.115,.118,.125)*(.75+.35*g1)*(.8+.4*g2);
        float mk=0.;
        if(m==20){vec2 q=abs(fract(vW.xz/48.+.5)-.5)*48.;float w=fwidth(vW.x)+fwidth(vW.z);
          float cx=smoothstep(.09+w,.09,q.y)*step(.45,fract(vW.x/6.))*step(3.6,q.x);float cz=smoothstep(.09+w,.09,q.x)*step(.45,fract(vW.z/6.))*step(3.6,q.y);
          mk=max(cx,cz);mk=max(mk,smoothstep(.07+w,.07,abs(min(q.x,q.y)-3.15))*step(3.6,max(q.x,q.y)));}
        else{float zz=mod(vW.z,12.);float w=fwidth(vW.x)*1.5;
          mk=smoothstep(.06+w,.06,abs(fract(vW.x/2.6)-.5)*2.6)*step(1.,zz)*step(zz,6.2);
          mk=max(mk,smoothstep(.06+w,.06,abs(zz-6.2))*.9);mk*=clamp(1.-fwidth(vW.x)*4.,0.,1.);}
        alb=mix(alb,vec3(.74,.74,.70)*(.7+.3*g1),mk*(.55+.35*g2));
        hgt=g1;bump=.025;gloss=.10;
      }else if(m==21){ /* montgolfière rayée */
        float a=atan(n.z,n.x)*1.2732;int k=int(mod(floor(a+8.),4.));
        alb=k==0?vec3(.95,.35,.45):k==1?vec3(.98,.85,.30):k==2?vec3(.55,.40,.90):vec3(.30,.80,.75);
      }else if(m==26){ /* carrosserie */
        float hh=h21(floor(vW.xz/7.));alb=hh<.33?vec3(.10,.12,.18):hh<.66?vec3(.30,.05,.05):vec3(.42,.43,.45);gloss=.9;refl=.25;
      }else if(m==27){alb=vec3(.22,.16,.11)*(.7+.6*vn(vec2(uv.x*14.,uv.y*2.)));}
      else if(m==57||m==67){ /* hôtel : soubassement de bois, papier peint à rayures, portes numérotées */
        float fy=mod(vW.y,3.2),u=abs(n.x)>abs(n.z)?vW.z:vW.x,near=clamp(1.-d/38.,0.,1.);
        alb=vec3(.70,.57,.39)*(.93+.07*fbm3(uv*.6))*(1.-.07*step(.5,fract(u/.16))*near);
        alb=mix(alb,alb*vec3(.72,.60,.48),smoothstep(.55,.85,fbm3(uv*.21+4.))*.5);
        if(abs(n.y)<.5){
          if(fy<.95)alb=vec3(.215,.115,.065)*(.8+.4*vn(vec2(u*1.5,fy*14.)))*(1.-.25*step(.93,fract(u/.5))*near);
          else if(fy<1.02)alb=vec3(.13,.07,.04);
          if(m==57){float fu=abs(mod(u,4.)-2.);
            if(fu<.6&&fy<2.14){alb=vec3(.12,.065,.04);
              if(fu<.5&&fy<2.05){alb=vec3(.33,.185,.10)*(.82+.3*vn(vec2(u*3.,fy*22.)));gloss=.3;
                vec2 pn=vec2(fu,fy);if((pn.x>.12&&pn.x<.4)&&((pn.y>.2&&pn.y<.9)||(pn.y>1.08&&pn.y<1.9)))alb*=.82;
                if(fu<.085&&fy>1.5&&fy<1.62)alb=mix(alb,vec3(.80,.62,.25),near);
                float hs=mod(u,4.)-2.;if(hs>.36&&hs<.43&&fy>1.&&fy<1.07)alb=mix(alb,vec3(.85,.68,.30),near);}}}
        }
      }else if(m==58){ /* moquette d'hôtel : losanges dorés sur fond lie-de-vin */
        vec2 q=abs(fract(uv/.9)-.5);float dm=q.x+q.y,fw=fwidth(uv.x)+fwidth(uv.y),ln=smoothstep(.06+fw,.02,abs(dm-.5))+smoothstep(.07+fw,.03,dm);
        ln*=clamp(1.-fw*2.2,0.,1.);alb=mix(vec3(.30,.045,.065),vec3(.52,.36,.13),ln*.8)*(.86+.14*fbm3(uv*.5))*mix(1.,.78+.44*vn(uv*52.),clamp(1.-d/16.,0.,1.));
        alb=mix(alb,alb*vec3(.5,.5,.55),smoothstep(.62,.85,fbm3(uv*.24+2.))*.6);hgt=vn(uv*50.);bump=.02;
      }else if(m==59){ /* sol clair poli, grandes dalles mouchetées */
        vec2 g=uv/1.2;vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);vec2 l=smoothstep(.5-fw*1.2-.006,vec2(.5),f);
        float line=max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*3.,0.,1.);
        alb=vec3(.80,.805,.80)*(1.-.25*line)*(.95+.05*vn(floor(g)*5.7))*mix(1.,.90+.16*vn(uv*70.),clamp(1.-d/14.,0.,1.));
        alb=mix(alb,alb*vec3(.84,.82,.78),smoothstep(.6,.9,fbm3(uv*.13+6.))*.5);gloss=.75;refl=.24;
      }else if(m==60){ /* rayonnage garni */
        if(abs(n.y)>.5)alb=vec3(.62,.63,.64);
        else{float u=abs(n.x)>abs(n.z)?vW.z:vW.x;vec2 g=vec2(u/.26,vW.y/.4);vec2 id=floor(g);float fade=clamp(fwidth(g.x)*1.6,0.,1.);
          float fam=h21(vec2(floor(id.x/5.),id.y)),hh=h21(id+fam*17.);
          vec3 pc=.5+.5*cos(6.2832*(fam+hh*.16+vec3(0.,.33,.67)));pc=mix(pc,vec3(.9),step(.75,hh)*.7)*(.55+.45*h21(id+3.3));
          pc*=1.-.5*smoothstep(.42,.5,abs(fract(g.x)-.5));pc=mix(pc,vec3(.9,.9,.86),step(.3,fract(g.y))*step(fract(g.y),.5)*step(.3,fract(g.x))*step(fract(g.x),.7)*.5*step(.5,h21(id+9.)));
          alb=mix(pc,vec3(.42,.40,.40),fade);
          float sf=fract(g.y);if(sf>.90)alb=mix(vec3(.82,.83,.84),alb,fade);else if(sf<.10)alb*=.45;
        }
      }else if(m==62){ /* sable : rides du vent, mouillé près de l'eau */
        float rp=sin(uv.y*7.+fbm3(uv*.4)*7.);alb=vec3(.84,.71,.53)*(.90+.10*fbm3(uv*.5))*(.94+.06*vn(uv*45.));
        float wet=smoothstep(.42,.02,vW.y);alb=mix(alb,alb*vec3(.50,.47,.46),wet);gloss=wet*.6;refl=wet*.22;
        hgt=rp*.5*(1.-wet)+vn(uv*30.)*.4;bump=.03;
      }else if(m==63){ /* parquet : des lames larges comme des routes */
        vec2 g=vec2(uv.x/2.6,uv.y/17.+floor(uv.x/2.6)*.37);vec2 id=floor(g);vec2 fw=fwidth(g);
        float lx=smoothstep(.5-fw.x*1.5-.012,.5,abs(fract(g.x)-.5)),ly=smoothstep(.5-fw.y*1.5-.002,.5,abs(fract(g.y)-.5));
        alb=vec3(.47,.305,.165)*(.78+.34*h21(id))*(.86+.14*vn(vec2(uv.x*7.,uv.y*.45)))*(.93+.07*fbm3(vec2(uv.x*1.5,uv.y*.12)));
        alb*=1.-.6*max(lx,ly)*clamp(1.-fw.x*4.,0.,1.);hgt=-max(lx,ly)+vn(vec2(uv.x*9.,uv.y*.6))*.3;bump=.03;gloss=.45;refl=.10;
      }else if(m==64){ /* tapis roulant : caoutchouc strié qui défile */
        float dir=mod(vW.z+24.,48.)<24.?1.:-1.;float rb=step(.5,fract((vW.x-dir*2.3*uTime)*2.2));
        alb=vec3(.055,.057,.062)*(1.+.9*rb*clamp(1.-d/40.,0.,1.));if(abs(n.y)<.5)alb=vec3(.42,.43,.45);gloss=.3;
      }else if(m==65){ /* cabine de plage rayée */
        float u=abs(n.x)>abs(n.z)?vW.z:vW.x,hh=h21(vec2(floor((vW.x+24.)/6.),floor(vW.z/48.+.5)));
        vec3 pc=hh<.25?vec3(.86,.30,.28):hh<.5?vec3(.24,.46,.70):hh<.75?vec3(.94,.74,.28):vec3(.30,.62,.56);
        alb=mix(vec3(.93,.91,.86),pc,step(.5,fract(u/.52)))*(.92+.08*vn(uv*vec2(3.,30.)));
      }else if(m==69){ /* moquette de salle d'arcade : confettis fluo sur fond nuit */
        vec2 c=floor(uv/.55),f=fract(uv/.55)-.5;float h1=fract(sin(dot(c,vec2(12.9,78.2)))*43758.5),h2=fract(h1*91.7);
        vec2 p=f-vec2(h1-.5,h2-.5)*.5;float sh=h1<.33?length(p)-.12:h1<.66?max(abs(p.x),abs(p.y))-.09:abs(p.y+p.x*.6)-.035;
        float fw=fwidth(uv.x)*2.;float on=smoothstep(fw+.01,0.,sh)*clamp(1.-fw*3.,0.,1.);
        vec3 nc=h2<.25?vec3(1.,.2,.8):h2<.5?vec3(.2,.9,1.):h2<.75?vec3(1.,.9,.2):vec3(.4,1.,.3);
        alb=mix(vec3(.025,.02,.06),nc*.9,on)*(.85+.15*vn(uv*40.));em=nc*on*.35;hgt=vn(uv*50.);bump=.02;
      }else if(m==70){ /* carton kraft, une bande d'adhésif */
        float tp=smoothstep(.02,.0,abs(fract(uv.x*.5+.25)-.5)-.07);
        alb=mix(vec3(.58,.43,.27),vec3(.68,.57,.40),tp*.8)*(.9+.1*fbm3(uv*3.))*(.94+.06*vn(vec2(uv.x*60.,uv.y*2.)));gloss=.15+tp*.4;hgt=vn(uv*30.)*.5;bump=.01;
      }else if(m==68){ /* linoléum d'hôpital, des dalles larges comme des places */
        vec2 g=uv/14.;vec2 fw=fwidth(g);vec2 f=abs(fract(g)-.5);vec2 l=smoothstep(.5-fw*1.2-.004,vec2(.5),f);
        float line=max(l.x,l.y)*clamp(1.-max(fw.x,fw.y)*3.,0.,1.);
        alb=vec3(.70,.75,.72)*(1.-.22*line)*(.95+.05*vn(floor(g)*5.7))*(.92+.08*fbm3(uv*.05))*mix(1.,.93+.1*vn(uv*6.),clamp(1.-d/20.,0.,1.));
        hgt=-line;bump=.02;gloss=.7;refl=.2;
      }else if(m==66){ /* couverture matelassée */
        vec2 q=abs(fract(uv/2.6)-.5);float dm=abs(q.x+q.y-.5),st=smoothstep(.07,0.,dm);
        alb=vec3(.27,.38,.62)*(.88+.12*fbm3(uv*.4))*(1.-.3*st);hgt=-st*2.+smoothstep(.0,.35,dm);bump=.05;
      }else if(m==74){ /* peau */
        alb=vec3(.84,.66,.56)*(.94+.06*vn(uv*9.))*(.97+.03*vn(uv*60.));gloss=.12;
      }else if(m==75||m==79){ /* cheveux : bruns, ou gris */
        float st=vn(vec2((vW.x+vW.z)*90.,vW.y*7.));alb=(m==75?vec3(.15,.10,.07):vec3(.62,.61,.60))*(.75+.45*st);gloss=.35;
      }else if(m==76){ /* drap de coton : plis souples */
        float f=fbm3(uv*1.2);alb=vec3(.90,.91,.93)*(.88+.12*f);hgt=f;bump=.012;
      }else if(m==77){ /* blouse d'hôpital : bleu pâle, petits losanges */
        vec2 q=abs(fract(uv*7.)-.5);float dt=smoothstep(.12,.06,q.x+q.y);alb=mix(vec3(.60,.74,.84),vec3(.30,.44,.62),dt*.6)*(.9+.1*fbm3(uv*2.));hgt=fbm3(uv*3.);bump=.02;
      }else if(m==78){ /* laiton patiné */
        alb=vec3(.74,.55,.26)*(.82+.18*fbm3(uv*4.));gloss=.85;refl=.45;
      }else if(m==85){ /* couverture d'hôpital : bleu pâle, tissage gaufré, une bande blanche */
        vec2 q=abs(fract(uv*9.)-.5);float wf=smoothstep(.5,.3,max(q.x,q.y));alb=vec3(.58,.68,.80)*(.9+.07*wf)*(.92+.08*fbm3(uv*1.5));
      }else if(m==86){ /* tableau : un paysage à l'huile, ciel, collines, touches de pinceau */
        float u=(abs(n.x)>abs(n.z)?vW.z:vW.x)*2.,t=vW.y,hz=1.52+.08*sin(u*2.3+h21(floor(vW.xz*.1)))+.04*vn(vec2(u*3.,0.));
        vec3 sky=mix(vec3(.85,.72,.52),vec3(.42,.55,.66),smoothstep(hz,1.9,t)),land=mix(vec3(.18,.24,.12),vec3(.40,.36,.18),vn(vec2(u*4.,t*9.)));
        alb=mix(land,sky,smoothstep(hz-.01,hz+.01,t))*(.85+.25*vn(vec2(u*30.,t*12.)));gloss=.3;
      }else if(m==87){ /* ouïes de casier : fentes sombres en biais */
        float sl=fract(vW.y*26.);alb=mix(vec3(.04,.045,.05),vec3(.55,.58,.6),smoothstep(.45,.6,sl));gloss=.3;
      }else if(m==88){ /* érable des pistes : lattes étroites, vernis miroir */
        float lx=vW.x*25.,id=floor(lx);float e=smoothstep(.0,.06,fract(lx))*smoothstep(1.,.94,fract(lx));
        alb=mix(vec3(.62,.42,.24),vec3(.86,.66,.42),h21(vec2(id,floor(vW.z*.35+id*.37))))*(.9+.1*vn(vec2(lx*.3,vW.z*3.)))*(.86+.14*e);gloss=.95;refl=.45;
      }else if(m==89){ /* parquet de maison : lames de chêne de 14 cm */
        vec2 q=vec2(uv.x/.14,uv.y/1.2+floor(uv.x/.14)*.43);vec2 id=floor(q),fw=fwidth(q);
        float lx=smoothstep(.5-fw.x*1.5-.03,.5,abs(fract(q.x)-.5)),ly=smoothstep(.5-fw.y*1.5-.006,.5,abs(fract(q.y)-.5));
        alb=vec3(.56,.38,.22)*(.8+.3*h21(id))*(.88+.12*vn(vec2(uv.x*30.,uv.y*2.)))*(1.-.35*max(lx,ly));gloss=.45;refl=.1;
      }else if(m==90){ /* papier peint : rayures douces, petits brins */
        float st=smoothstep(.3,.5,abs(fract((n.x*n.x>n.z*n.z?vW.z:vW.x)*3.2)-.5));alb=mix(vec3(.80,.74,.62),vec3(.70,.63,.52),st)*(.94+.06*fbm3(uv*3.));
      }else if(m==91){ /* corde : chanvre torsadé */
        float tw=fract((vW.y*14.+atan(n.x,n.z)*.32));alb=vec3(.58,.48,.32)*(.75+.35*smoothstep(.0,.5,tw)*smoothstep(1.,.5,tw));
      }else if(m==80){ /* tôle peinte des casiers et armoires métalliques : vert d'eau, rayures fines */
        alb=vec3(.42,.55,.54)*(.9+.1*fbm3(uv*1.5))*(1.-.12*smoothstep(.75,.95,vn(uv*vec2(3.,40.))));gloss=.45;refl=.12;
      }else if(m==81){ /* acajou verni : veines serrées */
        float gr=vn(vec2(uv.x*3.+fbm3(uv*.8)*2.,uv.y*38.));alb=mix(vec3(.20,.085,.045),vec3(.38,.17,.08),gr)*(.9+.1*fbm3(uv*.5));gloss=.6;refl=.18;
      }else if(m==83){ /* velours de fauteuil : bordeaux, reflets doux */
        alb=vec3(.36,.07,.09)*(.8+.2*vn(uv*14.))*(.85+.3*pow(1.-max(dot(n,V),0.),2.));hgt=vn(uv*40.);bump=.015;
      }
      /* relief : dérivées écran de la hauteur procédurale */
      bump*=clamp(1.-d/26.,0.,1.);
      if(bump>0.&&d<60.){vec3 dpx=dFdx(vW),dpy=dFdy(vW);float hx=dFdx(hgt),hy=dFdy(hgt);
        vec3 r1=cross(dpy,n),r2=cross(n,dpx);float det=dot(dpx,r1);
        if(abs(det)>1e-9){vec3 gr=(hx*r1+hy*r2)/det;n=normalize(n-clamp(gr*bump,-.6,.6)*(1.-d/60.));ndl=max(dot(n,uSun),0.);}}
      vec3 amb=mix(uIndoor,mix(uAmbDn,uAmbUp,n.y*.5+.5),vis);
      vec3 Lt=amb*(.82+.18*uSunK)+uSunC*ndl*sh*uSunK+lamps(vW,n);
      /* une pièce sans lumière : seul le couloir, par la porte entrouverte, y dépose un coin jaune */
      if(uDark.z>uDark.x&&vW.x>uDark.x&&vW.x<uDark.z&&vW.z>uDark.y&&vW.z<uDark.w&&vW.y<2.75){
        vec3 D=vW-uDarkL;float dd=length(D);vec3 dir=D/max(dd,.001);
        float cone=smoothstep(.55,.92,dot(dir,normalize(vec3(1.,-.25,.42))))*smoothstep(.2,.9,dd);
        Lt=amb*.035+uLampC*(cone*2.4/(dd*dd*.42+.6))*(max(dot(n,-dir),0.)*.85+.15);gloss*=.15;refl*=.1;}
      col=alb*Lt+em;emi=max(emi,min(1.,dot(em,vec3(.6))));
      if(gloss>0.){vec3 R=reflect(-V,n);float fr=pow(1.-max(dot(n,V),0.),4.);
        vec3 env=mix(uIndoor*1.3,skyGrad(R.y),vis);
        col=mix(col,env,refl*(.25+.75*fr)+gloss*fr*.25);
        col+=vec3(1.,.97,.9)*pow(max(dot(R,uSun),0.),70.)*gloss*sh*uSunK;}
    }
  }
  if(fogK>0.){float fd=1.-exp(-pow(d/uFogD,1.7));col=mix(col,fogCol(-V),fd*fogK);}
  if(uCloudY>-500.){float wob=(vn(vW.xz*.018+uTime*.012)-.5)*16.;col=mix(col,uSeaC,smoothstep(uCloudY+30.,uCloudY+3.,vW.y+wob));}
  o=fin(col);o.a=(m==8||m==29)?.4:emi;
}`;
const VS_DEPTH=HEAD+`layout(location=0)in vec3 aP;uniform mat4 uVP;uniform vec3 uOff;void main(){gl_Position=uVP*vec4(aP+uOff,1.);}`;
const FS_DEPTH=HEAD+`void main(){}`;
const VS_SKY=HEAD+`layout(location=0)in vec2 aP;out vec2 vP;void main(){vP=aP;gl_Position=vec4(aP,1.,1.);}`;
const FS_SKY=HEAD+`in vec2 vP;out vec4 o;uniform vec3 uF,uR,uU,uCl0,uCl1;uniform vec2 uTan;uniform float uCloud;
${COMMON}
void main(){
  vec3 d=normalize(uF+uR*vP.x*uTan.x+uU*vP.y*uTan.y);
  vec3 c=skyGrad(d.y);
  float s=max(dot(d,uSun),0.);
  if(uNight>.5){ /* étoiles et lune */
    vec2 sp=d.xz/(abs(d.y)+.35)*190.;float st=step(.9965,h21(floor(sp)))*smoothstep(.02,.25,d.y);
    c+=vec3(.8,.85,1.)*st*(.4+.6*h21(floor(sp)+5.));
    c+=uGlow*(smoothstep(.99962,.99972,s)*1.1+pow(s,300.)*.25+pow(s,20.)*.05);
  }else c+=uGlow*(pow(s,900.)*3.+pow(s,60.)*.22+pow(s,6.)*.10);
  /* voile d'altitude */
  if(d.y>.02){
    vec2 uv=d.xz/(d.y+.10);float t=uTime*.004;
    float a=fbm(uv*vec2(.5,1.6)+vec2(t,3.));float b=fbm(uv*1.9+vec2(7.-t,a*1.3));
    float dn=smoothstep(1.-uCloud,1.-uCloud+.42,a*.72+b*.42);
    float lit=clamp(.55+(a-fbm3(uv*vec2(.5,1.6)+vec2(t,3.)+uSun.xz*.22))*2.4,0.,1.);
    c=mix(c,mix(uCl0,uCl1,lit),dn*.78*smoothstep(.02,.20,d.y));
  }
  /* banc de cumulus à l'horizon */
  if(d.y>-.02&&d.y<.42){
    float az=atan(d.z,d.x);float top=.07+.21*fbm3(vec2(az*2.4+11.,1.7))+.07*vn(vec2(az*9.,4.))-(.25-uCloud*.4);
    float e=d.y/max(top,.001);
    float det=fbm(vec2(az*9.,d.y*26.)+vec2(uTime*.003,0.));
    float m=smoothstep(1.,.62,e+det*.5-.22)*step(0.,top);
    float sd=clamp(.25+e*.75+(det-.5)*.5+.35*max(dot(normalize(vec3(d.x,0.,d.z)),uSun),0.),0.,1.);
    vec3 cc=mix(uCl0,uCl1,sd);cc=mix(uHor,cc,smoothstep(-.02,.09,d.y));
    c=mix(c,cc,m*.92);
  }
  if(d.y<0.)c=mix(fogCol(d),uSeaC,smoothstep(0.,-.12,d.y));
  o=fin(c);o.a=uNight>.5?smoothstep(.99962,.99972,s):clamp(pow(s,900.)*2.,0.,1.);
}`;
const VS_SEA=HEAD+`out float vWd;layout(location=0)in vec2 aP;uniform mat4 uVP;uniform vec3 uCamP;uniform float uY;out vec3 vW;
void main(){vW=vec3(aP.x*15000.+uCamP.x,uY,aP.y*15000.+uCamP.z);gl_Position=uVP*vec4(vW,1.);vWd=gl_Position.w;}`;
const FS_SEA=HEAD+`in float vWd;in vec3 vW;out vec4 o;uniform vec3 uSe0,uSe1;uniform float uLayer,uGroundK;
${COMMON}
void main(){gl_FragDepth=log2(1.+max(vWd,0.))*0.07160311;
  float d=length(vW-uCam);vec3 V=normalize(vW-uCam);
  if(uGroundK>.5){ /* sol lointain des espaces à terre ferme */
    vec3 c=mix(uSe0,uSe1,fbm3(vW.xz*.02));c=mix(c,fogCol(V),1.-exp(-pow(d/900.,1.3)));o=fin(c);return;}
  vec2 p=vW.xz*.011*(1.+uLayer*.37)+vec2(uTime*.006*(1.+uLayer),uLayer*13.7);
  float n=fbm(p),n2=fbm(p+uSun.xz*.30),n3=fbm(vW.xz*.045-vec2(0.,uTime*.012)+uLayer*5.);
  float sh=clamp((n-n2)*4.5+.60+(n3-.5)*.4,0.,1.);
  vec3 c=mix(uSe0,uSe1,sh);
  c=mix(c,fogCol(V),1.-exp(-pow(d/1000.,1.4)));
  float a=uLayer<.5?1.:smoothstep(.46,.66,n*.7+n3*.45)*(1.-smoothstep(600.,1500.,d))*.9;
  vec4 f=fin(c);o=vec4(f.rgb,uLayer<.5?0.:a);
}`;
const VS_ITEM=HEAD+`out float vWd;layout(location=0)in vec3 aP;layout(location=1)in vec3 aN;uniform mat4 uVP;uniform vec3 uPos,uScale;uniform float uRot;out vec3 vN;
${BENDF}void main(){float c=cos(uRot),s=sin(uRot);vec3 p=aP*uScale;p=vec3(p.x*c-p.z*s,p.y,p.x*s+p.z*c);vN=vec3(aN.x*c-aN.z*s,aN.y,aN.x*s+aN.z*c);gl_Position=uVP*vec4(wbend(p+uPos),1.);vWd=gl_Position.w;}`;
const FS_ITEM=HEAD+`in float vWd;in vec3 vN;out vec4 o;uniform vec3 uColor;void main(){gl_FragDepth=log2(1.+max(vWd,0.))*0.07160311;vec3 n=normalize(vN);o=vec4(uColor*(.80+.22*n.y+.12*n.x),1.);}`;
/* herbe : un ruban de 7 sommets par brin, courbé par le vent, écarté par le joueur */
const VS_GRASS=HEAD+`out float vWd;layout(location=0)in vec3 aV;layout(location=1)in vec3 iPos;layout(location=2)in vec4 iPar;
uniform mat4 uVP;uniform vec3 uOff,uEye;uniform float uTimeV,uGrassR;
out vec3 vW;out float vT;out float vH;out float vF;out vec3 vRoot;
${BENDF}void main(){
  float k=aV.z;vec3 P=iPos+uOff;float t=aV.y,fl=iPar.w*step(k,.5);float an=iPar.x+k*2.3;
  P.xz+=vec2(cos(an*1.7),sin(an*1.7))*.07*k;
  float dist=length(P.xz-uEye.xz);float sc=1.-smoothstep(uGrassR*.55,uGrassR,dist);
  float h=iPar.y*sc*(1.-k*.2);
  vec2 dir=vec2(cos(an),sin(an));vec2 lean=vec2(-dir.y,dir.x);
  float wdt=fl>.5?(t>.78?.075*(1.-abs(t-.9)*5.):.008):mix(.040,.004,t*t);
  float w=sin(uTimeV*1.6+P.x*.31+P.z*.23)+.5*sin(uTimeV*2.9+P.x*1.1-P.z*.7);
  float bend=((fract(iPar.z*7.+k*.37)-.5)*.6+w*.10)*t*t*h+(.18*t*t*h);
  vec2 push=P.xz-uEye.xz;float pl=length(push);float pk=(1.-smoothstep(.2,1.1,pl))*step(abs(P.y-uEye.y+1.62),1.2);
  vec3 pos=P+vec3(dir.x*aV.x*wdt,t*h,dir.y*aV.x*wdt)+vec3(lean.x,0.,lean.y)*bend+vec3(push.x,-.25*t,push.y)/max(pl,.05)*pk*.3*t;
  vW=pos;vT=t;vH=fract(iPar.z+k*.13);vF=fl;vRoot=P;gl_Position=uVP*vec4(wbend(pos),1.);
vWd=gl_Position.w;}`;
const FS_GRASS=HEAD+`in float vWd;in vec3 vW;in float vT;in float vH;in float vF;in vec3 vRoot;out vec4 o;
uniform vec3 uAmbUp,uAmbDn,uSunC,uIndoor;uniform float uSunK,uFogD;
${COMMON}${LIGHT}
void main(){gl_FragDepth=log2(1.+max(vWd,0.))*0.07160311;
  vec3 up=vec3(0.,1.,0.);float sh=shadow(vRoot+vec3(0.,.15,0.),up),vis=skyVis(vRoot+vec3(0.,.3,0.),up);
  vec3 base=mix(vec3(.07,.21,.045),mix(vec3(.33,.62,.15),vec3(.56,.70,.24),vH*vH),vT);
  if(vH>.86)base=mix(base,vec3(.55,.52,.24),vT*.6);
  if(vF>.5&&vT>.78)base=vH<.4?vec3(.20,.82,.98):vH<.7?vec3(.97,.97,.92):vec3(.98,.80,.25);
  vec3 V=normalize(uCam-vW);float tr=pow(max(dot(-V,uSun),0.),3.)*.35*vT;
  vec3 amb=mix(uIndoor*1.25,mix(uAmbDn,uAmbUp,.8),vis)*(.55+.45*vT);
  vec3 col=base*(amb+uSunC*(.75+tr*2.)*sh*uSunK*(.45+.55*vT)+lamps(vRoot+vec3(0.,.2,0.),up));
  float d=length(uCam-vW);col=mix(col,fogCol(-V),1.-exp(-pow(d/uFogD,1.7)));
  o=fin(col);
}`;
function prog(vs,fs){
  const p=gl.createProgram();
  for(const [t,src] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));gl.attachShader(p,s);}
  gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
  const u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);
  for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name.replace('[0]','')]=gl.getUniformLocation(p,inf.name);}
  return {p,u};
}
const pMain=prog(VS_MAIN,FS_MAIN),pDepth=prog(VS_DEPTH,FS_DEPTH),pSky=prog(VS_SKY,FS_SKY),pSea=prog(VS_SEA,FS_SEA),pItem=prog(VS_ITEM,FS_ITEM),pGrass=prog(VS_GRASS,FS_GRASS);

/* ---------- ressources fixes ---------- */
function vao2d(data){const v=gl.createVertexArray();gl.bindVertexArray(v);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);return v;}
const vaoTri=vao2d([-1,-1,3,-1,-1,3]),vaoQuad=vao2d([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]);
function depthTarget(res,compare){
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,res,res);
  const f=compare?gl.LINEAR:gl.NEAREST;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  if(compare){gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_MODE,gl.COMPARE_REF_TO_TEXTURE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_COMPARE_FUNC,gl.LEQUAL);}
  const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,tex,0);
  gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);gl.bindFramebuffer(gl.FRAMEBUFFER,null);return {tex,fbo};
}
const shT=depthTarget(SHADOW_RES,true),topT=depthTarget(TOP_RES,false);
let octVao;(function(){const P=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],v=[];
  for(const sx of[0,1])for(const sy of[2,3])for(const sz of[4,5]){const a=P[sx],b=P[sy],c=P[sz],n=norm([a[0]+b[0]+c[0],a[1]+b[1]+c[1],a[2]+b[2]+c[2]]);
    for(const p of[a,b,c])v.push(p[0],p[1],p[2],n[0],n[1],n[2]);}
  octVao=gl.createVertexArray();gl.bindVertexArray(octVao);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);})();
function mesh7(verts){const o={count:verts.length/7};if(!o.count)return o;o.vao=gl.createVertexArray();gl.bindVertexArray(o.vao);o.vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o.vbo);
  gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,12);
  gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,1,gl.FLOAT,false,28,24);return o;}
/* brin : 7 sommets en ruban (x de -1 à 1, t de 0 à 1) */
const bladeBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bladeBuf);
const BLADE_N=(function(){const v=[];for(let k=0;k<3;k++){if(k)v.push(-1,0,k);for(const [x,t] of[[-1,0],[1,0],[-1,.5],[1,.5],[0,1]])v.push(x,t,k);if(k<2)v.push(0,1,k);}
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);return v.length/3;})();
function grassMesh(inst){
  const o={count:inst.length/7};if(!o.count)return o;o.vao=gl.createVertexArray();gl.bindVertexArray(o.vao);
  gl.bindBuffer(gl.ARRAY_BUFFER,bladeBuf);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
  o.vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o.vbo);gl.bufferData(gl.ARRAY_BUFFER,inst,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,28,0);gl.vertexAttribDivisor(1,1);
  gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,4,gl.FLOAT,false,28,12);gl.vertexAttribDivisor(2,1);return o;
}
function freeMesh(o){if(o&&o.vao){gl.deleteVertexArray(o.vao);gl.deleteBuffer(o.vbo);}}

/* palette de l'espace courant */
function setPal(p,doorC){
  const u=p.u,P=PAL;
  gl.uniform3fv(u.uHor,P.hor);gl.uniform3fv(u.uSeaC,P.seaC);gl.uniform3fv(u.uZen,P.zen);gl.uniform3fv(u.uMid,P.mid);gl.uniform3fv(u.uSun,SUN);
  gl.uniform3fv(u.uGlow,P.glow);gl.uniform1f(u.uTime,time);gl.uniform1f(u.uNight,P.night);
  if(u.uAmbUp){gl.uniform3fv(u.uAmbUp,P.ambUp);gl.uniform3fv(u.uAmbDn,P.ambDn);gl.uniform3fv(u.uSunC,P.sunC);gl.uniform3fv(u.uIndoor,P.indoor);gl.uniform1f(u.uFogD,P.fogD);}
  if(u.uAccent)gl.uniform3fv(u.uAccent,P.accent);if(u.uWater)gl.uniform1f(u.uWater,P.water);if(u.uStripe)gl.uniform2fv(u.uStripe,P.stripe);
  if(u.uCl0){gl.uniform3fv(u.uCl0,P.cl0);gl.uniform3fv(u.uCl1,P.cl1);}if(u.uSe0){gl.uniform3fv(u.uSe0,P.se0);gl.uniform3fv(u.uSe1,P.se1);}
  if(u.uCloud)gl.uniform1f(u.uCloud,P.cloud);if(u.uCloudY)gl.uniform1f(u.uCloudY,WORLDS[W].cloudY);
  if(u.uLampC){gl.uniform3fv(u.uLampC,P.lampC);gl.uniform4fv(u.uLampP,P.lampP);gl.uniform2fv(u.uLampO,P.lampO);}
  if(u.uDark){gl.uniform4fv(u.uDark,GEN===21?[2.8,-6.95,8.95,-2.0]:[0,0,0,0]);gl.uniform3fv(u.uDarkL,[2.78,1.25,-4.3]);}
  if(u.uDoorC)gl.uniform3fv(u.uDoorC,doorC||[1.04,1.03,1.0]);if(u.uRot)gl.uniform2f(u.uRot,1,0);
  if(u.uTilt)gl.uniform2f(u.uTilt,1,0);if(u.uBend)gl.uniform3fv(u.uBend,BENDV);
}
function setLight(p,SVP,TVP){
  gl.uniformMatrix4fv(p.u.uSVP,false,SVP);gl.uniformMatrix4fv(p.u.uTVP,false,TVP);gl.uniform1f(p.u.uTopR,1.7/(2*TOP_HALF));
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,shT.tex);gl.uniform1i(p.u.uSh,0);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,topT.tex);gl.uniform1i(p.u.uTop,1);
}

/* ---------- cellules, colosses, rames ---------- */
const cells=new Map();
function ensureCell(i,j){
  const key=i+','+j;let c=cells.get(key);if(c)return c;
  c=genCell(i,j);c.i=i;c.j=j;Object.assign(c,mesh7(c.verts));c.verts=null;
  c.grass=c.blades?grassMesh(c.blades):null;c.blades=null;
  cells.set(key,c);return c;
}
function freeCell(c){freeMesh(c);freeMesh(c.grass);}
const megaMeshes=new Map();
function updateMegas(px,pz){
  const I=Math.floor(px/MEGA),J=Math.floor(pz/MEGA);
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const k=(I+a)+','+(J+b);if(megaMeshes.has(k))continue;
    megaMeshes.set(k,Object.assign(mesh7(megaInfo(I+a,J+b).verts),{I:I+a,J:J+b}));}
  for(const [k,m] of megaMeshes)if(Math.abs(m.I-I)>2||Math.abs(m.J-J)>2){freeMesh(m);megaMeshes.delete(k);}
}
const DRIFT_Y=620,DRIFT_HX=700,DRIFT_HZ=260;
const driftMesh=(function(){const g=new Geo(0,0,0);g.box(-DRIFT_HX,-50,-DRIFT_HZ,DRIFT_HX,50,DRIFT_HZ,6,false);return mesh7(new Float32Array(g.v));})();
const TRAIN=(function(){const a=buildTrain(false),b=buildTrain(true),r=rng(77);
  return {open:mesh7(new Float32Array(a.v)),closed:mesh7(new Float32Array(b.v)),colOpen:new Float32Array(a.col),colClosed:new Float32Array(b.col),grass:grassMesh(a.blades(r))};})();

/* vantaux des portes de rame : un maillage par sens de coulissement */
const LEAVES=[-1,1].map(side=>{const g=new Geo(0,0,0),hw=TRAIN_HW;
  for(const ac of[-4.5,4.5])for(const sb of[-1,1]){const b0=sb>0?hw-0.075:-hw+0.025,b1=b0+0.05;
    for(const dc of[-2.2,2.2]){const x0=ac+dc+(side<0?-0.65:0),x1=x0+0.65;
      g.box(x0,0.75,b0,x1,1.6,b1,11,false);g.box(x0,2.5,b0,x1,2.7,b1,11,false);
      g.box(x0,1.6,b0,x0+0.05,2.5,b1,12,false);g.box(x1-0.05,1.6,b0,x1,2.5,b1,12,false);}}
  return mesh7(new Float32Array(g.v));});
/* yeux ailés : un globe en amande, deux ailes de plumes qui battent autour de l'axe vertical */
const EYEM=(function(){const g=new Geo(0,0,0);g.ell(0,0,0,0.27,0.155,0.135,39,ICO3);return mesh7(new Float32Array(g.v));})();
const WINGS=[-1,1].map(sd=>{const g=new Geo(0,0,0),n=[0,0,1];
  for(let lay=0;lay<2;lay++)for(let k=0;k<11;k++){
    const S=0.62,t=k/10,rx=0.17+0.55*S*t,ry=0.06+0.30*S*Math.sin(t*2.2),ang=-1.35+t*0.55,len=(0.35+0.78*t)*(lay?0.5:1)*S,w=(lay?0.075:0.088)*S,z=lay?0.02:0;
    const dx=Math.cos(ang),dy=Math.sin(ang),px=-dy,py=dx,tx=rx+dx*len,ty=ry+dy*len;
    g.flat([sd*(rx-px*w),ry-py*w,z],[sd*(rx+px*w),ry+py*w,z],[sd*(tx+px*w*0.3),ty+py*w*0.3,z],[sd*(tx-px*w*0.3),ty-py*w*0.3,z],n,40);
    if(!lay)g.ell(sd*rx,ry+0.012,0,0.055,0.042,0.028,40,ICO1);
  }
  return mesh7(new Float32Array(g.v));});

/* œil ailé en image : un panneau toujours tourné vers la caméra, détouré, dont les ailes battent */
const VS_SPR=HEAD+`out float vWd;layout(location=0)in vec2 aV;uniform mat4 uVP;uniform vec3 uPos,uRight;uniform vec2 uSize;uniform float uFlap;out vec2 vUV;out vec3 vW;
${BENDF}void main(){float k=smoothstep(.16,1.,abs(aV.x));float x=aV.x*(1.-uFlap*k*.24),y=aV.y+uFlap*k*k*.38;
  vW=uPos+uRight*x*uSize.x+vec3(0.,y*uSize.y,0.);vUV=vec2(aV.x*.5+.5,.5-aV.y*.5);gl_Position=uVP*vec4(wbend(vW),1.);vWd=gl_Position.w;}`;
const FS_SPR=HEAD+`in float vWd;in vec2 vUV;in vec3 vW;out vec4 o;uniform sampler2D uTex;uniform vec3 uAmbUp,uAmbDn,uSunC;uniform float uFogD;
${COMMON}
void main(){gl_FragDepth=log2(1.+max(vWd,0.))*0.07160311;vec4 t=texture(uTex,vUV);if(t.a<.5)discard;
  vec3 col=t.rgb*max(min(mix(uAmbDn,uAmbUp,.7)+uSunC*.55,vec3(1.)),vec3(.45));
  vec3 V=normalize(uCam-vW);float d=length(uCam-vW);col=mix(col,fogCol(-V),(1.-exp(-pow(d/uFogD,1.7)))*.85);o=fin(col);}`;
const pSpr=prog(VS_SPR,FS_SPR);
const SPR=(function(){const v=[],N=12;for(let k=0;k<N;k++){const x0=-1+2*k/N,x1=-1+2*(k+1)/N;v.push(x0,-1,x1,-1,x1,1,x0,-1,x1,1,x0,1);}
  const o={vao:vao2d(v),count:v.length/2,tex:gl.createTexture(),ready:false,asp:0.533};
  const im=new Image();im.onload=()=>{try{gl.bindTexture(gl.TEXTURE_2D,o.tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);o.asp=im.height/im.width;o.ready=true;}catch(e){}};
  im.src=EYE_IMG;return o;})();
const SIT=(function(){const o={tex:gl.createTexture(),ready:false,asp:1.76};
  const im=new Image();im.onload=()=>{try{gl.bindTexture(gl.TEXTURE_2D,o.tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);o.asp=im.height/im.width;o.ready=true;}catch(e){}};
  im.src=SIT_IMG;return o;})();

/* nouvelles entités, en image comme les autres : l'étoile ailée, l'homme-étoile, la longue silhouette */
function imgTex(src){const o={tex:gl.createTexture(),ready:false,asp:1};
  const im=new Image();im.onload=()=>{try{gl.bindTexture(gl.TEXTURE_2D,o.tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);o.asp=im.height/im.width;o.ready=true;}catch(e){}};
  im.src=src;return o;}
const THIN=imgTex(THIN_IMG),MASK=imgTex(MASK_IMG),CHILD={ready:false};
const STAR=imgTex(STAR_IMG),MAN=imgTex(MAN_IMG),LONG=imgTex(LONG_IMG),ANGEL=imgTex(ANGEL_IMG),EYES2=imgTex(EYES2_IMG),COAT=imgTex(COAT_IMG);

/* ---------- post-traitement : occlusion ambiante, halo des lumières, anticrénelage, aberration légère ---------- */
const FS_AO=HEAD+`in vec2 vP;out vec4 o;uniform sampler2D uD;uniform vec2 uTan,uNF,uPx;
float hh(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vz(vec2 uv){return exp2(texture(uD,uv).r*uNF.y)-1.+uNF.x*0.;}
vec3 vp(vec2 uv){float z=vz(uv);return vec3((uv*2.-1.)*uTan*z,-z);}
const vec3 K[10]=vec3[10](vec3(.18,.05,.12),vec3(-.22,.20,.25),vec3(.10,-.38,.20),vec3(-.45,-.12,.30),vec3(.50,.30,.22),
  vec3(-.15,.60,.35),vec3(.35,-.60,.45),vec3(-.70,.25,.40),vec3(.75,-.10,.55),vec3(.05,.20,.95));
void main(){
  vec2 uv=vP*.5+.5;float z=vz(uv);if(z>70.){o=vec4(1.);return;}
  vec3 P=vec3((uv*2.-1.)*uTan*z,-z);
  vec3 pr=vp(uv+vec2(uPx.x,0.)),pl=vp(uv-vec2(uPx.x,0.)),pu=vp(uv+vec2(0.,uPx.y)),pd=vp(uv-vec2(0.,uPx.y));
  vec3 dx=abs(pr.z-P.z)<abs(P.z-pl.z)?pr-P:P-pl,dy=abs(pu.z-P.z)<abs(P.z-pd.z)?pu-P:P-pd;
  vec3 n=normalize(cross(dx,dy));
  float a=(mod(floor(gl_FragCoord.x),4.)*4.+mod(floor(gl_FragCoord.y),4.))*.3927+hh(floor(gl_FragCoord.xy/4.))*.2;vec3 rv=vec3(cos(a),sin(a),0.);vec3 t=normalize(rv-n*dot(rv,n)+1e-4),b=cross(n,t);
  float R=.42+z*.035,occ=0.;
  for(int i=0;i<10;i++){vec3 k=K[i];vec3 sp=P+(t*k.x+b*k.y+n*k.z)*R;
    vec2 su=(sp.xy/(-sp.z)/uTan)*.5+.5;float sz=vz(su);
    occ+=step(sz,-sp.z-.035)*smoothstep(0.,1.,R/max(abs(z-sz),1e-3));}
  float ao=1.-occ*.1*1.25;o=vec4(mix(1.,clamp(ao,0.,1.),1.-smoothstep(40.,70.,z)));
}`;
const FS_BRIGHT=HEAD+`in vec2 vP;out vec4 o;uniform sampler2D uT;uniform vec2 uPx;
void main(){vec2 uv=vP*.5+.5;vec3 s=vec3(0.);
  for(int i=0;i<4;i++){vec2 q=vec2(i<2?-1.:1.,(i==0||i==2)?-1.:1.);vec4 c=texture(uT,uv+q*uPx);float l=dot(c.rgb,vec3(.299,.587,.114));s+=c.rgb*(c.a+smoothstep(.94,1.,l)*.14);}
  o=vec4(s*.25,1.);}`;
const FS_BLUR=HEAD+`in vec2 vP;out vec4 o;uniform sampler2D uT;uniform vec2 uDir;
void main(){vec2 uv=vP*.5+.5;vec3 s=texture(uT,uv).rgb*.227;
  s+=(texture(uT,uv+uDir*1.385).rgb+texture(uT,uv-uDir*1.385).rgb)*.316;s+=(texture(uT,uv+uDir*3.231).rgb+texture(uT,uv-uDir*3.231).rgb)*.0703;o=vec4(s,1.);}`;
const FS_COMP=HEAD+`in vec2 vP;out vec4 o;uniform sampler2D uT,uAO,uB;uniform vec2 uPx;
float lu(vec3 c){return dot(c,vec3(.299,.587,.114));}
void main(){
  vec2 uv=vP*.5+.5;vec4 M=texture(uT,uv);vec3 col=M.rgb;
  float lM=lu(col),lNW=lu(texture(uT,uv+vec2(-1.,-1.)*uPx).rgb),lNE=lu(texture(uT,uv+vec2(1.,-1.)*uPx).rgb),lSW=lu(texture(uT,uv+vec2(-1.,1.)*uPx).rgb),lSE=lu(texture(uT,uv+vec2(1.,1.)*uPx).rgb);
  float mn=min(lM,min(min(lNW,lNE),min(lSW,lSE))),mx=max(lM,max(max(lNW,lNE),max(lSW,lSE)));
  if(mx-mn>max(.03,mx*.09)){
    vec2 dir=vec2(-((lNW+lNE)-(lSW+lSE)),(lNW+lSW)-(lNE+lSE));
    float red=max((lNW+lNE+lSW+lSE)*.03125,.0078);dir=clamp(dir/(min(abs(dir.x),abs(dir.y))+red),-8.,8.)*uPx;
    vec3 A=.5*(texture(uT,uv+dir*(-.1667)).rgb+texture(uT,uv+dir*.1667).rgb);
    vec3 Bc=A*.5+.25*(texture(uT,uv-dir*.5).rgb+texture(uT,uv+dir*.5).rgb);float lB=lu(Bc);col=(lB<mn||lB>mx)?A:Bc;
  }
  /* aberration chromatique discrète vers les bords */
  vec2 c=uv-.5;float r2=dot(c,c);vec2 off=c*r2*.010;col.r=mix(col.r,texture(uT,uv+off).r,.7);col.b=mix(col.b,texture(uT,uv-off).b,.7);
  float ao=0.;for(int i=-1;i<=2;i++)for(int j=-1;j<=2;j++)ao+=texture(uAO,uv+uPx*(vec2(float(i),float(j))*2.-1.)*2.).r;ao*=.0625;
  col*=mix(1.,ao,.74*(1.-M.a));
  col+=texture(uB,uv).rgb*.60;
  o=vec4(col,1.);
}`;
const pAO=prog(VS_SKY,FS_AO),pBright=prog(VS_SKY,FS_BRIGHT),pBlur=prog(VS_SKY,FS_BLUR),pComp=prog(VS_SKY,FS_COMP);
const POST={ok:false,w:0,h:0,tex:[],fbos:[]};
function postTarget(w,h,ifmt,fmt,type,filter,depth){
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texStorage2D(gl.TEXTURE_2D,1,ifmt,w,h);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
  if(depth)gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depth,0);
  POST.tex.push(tex);POST.fbos.push(fbo);
  return {tex,fbo,w,h,ok:gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE};
}
function postReady(w,h){
  if(POST.w===w&&POST.h===h)return POST.ok;
  for(const t of POST.tex)gl.deleteTexture(t);for(const f of POST.fbos)gl.deleteFramebuffer(f);POST.tex=[];POST.fbos=[];
  POST.w=w;POST.h=h;POST.ok=false;if(w<8||h<8)return false;
  try{
    const dz=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,dz);gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,w,h);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    POST.tex.push(dz);POST.depth=dz;
    POST.scene=postTarget(w,h,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR,dz);
    POST.ao=postTarget(w>>1,h>>1,gl.R8,gl.RED,gl.UNSIGNED_BYTE,gl.LINEAR);
    POST.bA=postTarget(w>>2,h>>2,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR);POST.bB=postTarget(w>>2,h>>2,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,gl.LINEAR);
    POST.ok=POST.scene.ok&&POST.ao.ok&&POST.bA.ok&&POST.bB.ok;
  }catch(e){POST.ok=false;}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);return POST.ok;
}
function postRun(tanX,tanY,near,far){
  const P=POST,bind=(u,tex)=>{gl.activeTexture(gl.TEXTURE0+u);gl.bindTexture(gl.TEXTURE_2D,tex);};
  gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.disable(gl.BLEND);gl.bindVertexArray(vaoTri);
  gl.bindFramebuffer(gl.FRAMEBUFFER,P.ao.fbo);gl.viewport(0,0,P.ao.w,P.ao.h);gl.useProgram(pAO.p);bind(0,P.depth);gl.uniform1i(pAO.u.uD,0);
  gl.uniform2f(pAO.u.uTan,tanX,tanY);gl.uniform2f(pAO.u.uNF,near,Math.log2(1+far));gl.uniform2f(pAO.u.uPx,1/P.w,1/P.h);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.bindFramebuffer(gl.FRAMEBUFFER,P.bA.fbo);gl.viewport(0,0,P.bA.w,P.bA.h);gl.useProgram(pBright.p);bind(0,P.scene.tex);gl.uniform1i(pBright.u.uT,0);gl.uniform2f(pBright.u.uPx,1/P.w,1/P.h);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.useProgram(pBlur.p);gl.uniform1i(pBlur.u.uT,0);
  for(let k=0;k<2;k++){
    gl.bindFramebuffer(gl.FRAMEBUFFER,P.bB.fbo);bind(0,P.bA.tex);gl.uniform2f(pBlur.u.uDir,(1+k)/P.bA.w,0);gl.drawArrays(gl.TRIANGLES,0,3);
    gl.bindFramebuffer(gl.FRAMEBUFFER,P.bA.fbo);bind(0,P.bB.tex);gl.uniform2f(pBlur.u.uDir,0,(1+k)/P.bA.h);gl.drawArrays(gl.TRIANGLES,0,3);}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,P.w,P.h);gl.useProgram(pComp.p);
  bind(0,P.scene.tex);bind(1,P.ao.tex);bind(2,P.bA.tex);gl.uniform1i(pComp.u.uT,0);gl.uniform1i(pComp.u.uAO,1);gl.uniform1i(pComp.u.uB,2);gl.uniform2f(pComp.u.uPx,1/P.w,1/P.h);
  gl.drawArrays(gl.TRIANGLES,0,3);
  bind(2,null);bind(1,null);bind(0,null);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);
}

/* ombre debout : pour les apparitions du mode classique */
const FIG=(function(){const g=new Geo(0,0,0),E=(x,y,z,rx,ry,rz)=>g.ell(x,y,z,rx,ry,rz,28,ICO2);
  E(0,1.80,0,0.095,0.125,0.105);g.cyl(0,0,0.045,1.60,1.72,28,false,8);
  E(0,1.37,0,0.185,0.27,0.105);E(0,1.52,0,0.215,0.095,0.095);E(0,1.04,0,0.155,0.17,0.10);
  for(const s of[-1,1]){E(s*0.255,1.29,0,0.05,0.26,0.052);E(s*0.268,0.90,0.012,0.04,0.25,0.042);E(s*0.272,0.63,0.02,0.036,0.075,0.028);
    E(s*0.092,0.71,0,0.076,0.30,0.08);E(s*0.088,0.27,-0.005,0.056,0.27,0.058);E(s*0.088,0.035,0.05,0.048,0.035,0.115);}
  return mesh7(new Float32Array(g.v));})();
/* écrans de cinéma, allumés quand on relance un projecteur */
const SCREENM=(function(){const g=new Geo(0,0,0);g.box(-SCREEN_W/2,0,0,SCREEN_W/2,SCREEN_H,0.02,73,false);return mesh7(new Float32Array(g.v));})();
const SCREENB=(function(){const g=new Geo(0,0,0);g.box(-SCREEN_BW/2,0,0,SCREEN_BW/2,SCREEN_BH,0.02,73,false);return mesh7(new Float32Array(g.v));})();
/* crabe : une carapace, deux pinces, des yeux sur pédoncules, six pattes */
const CRAB=(function(){const g=new Geo(0,0,0),E=(x,y,z,a,b,c,m)=>g.ell(x,y,z,a,b,c,m||48,ICO2);
  E(0,0.13,0,0.2,0.075,0.15);E(0,0.1,0.02,0.17,0.05,0.13,36);
  for(const s of[-1,1]){E(s*0.17,0.12,0.17,0.035,0.03,0.07);E(s*0.2,0.14,0.27,0.075,0.05,0.06);E(s*0.17,0.15,0.32,0.03,0.03,0.04);
    g.cyl(s*0.055,0.12,0.012,0.17,0.25,48,false,5);g.sphere(s*0.055,0.26,0.12,0.026,28,ICO1);
    for(let k=0;k<3;k++){const z=-0.09+k*0.075,x0=s*0.16,x1=s*0.31;g.box(Math.min(x0,x1),0.13,z-0.012,Math.max(x0,x1),0.16,z+0.012,48,false);g.box(Math.min(x1,x1+s*0.025),0,z-0.012,Math.max(x1,x1+s*0.025),0.16,z+0.012,48,false);}}
  return mesh7(new Float32Array(g.v));})();
/* balançoire : deux cordes et une assise, suspendues à l'origine */
const SWING_L=2.35;
const SWING=(function(){const g=new Geo(0,0,0);
  g.box(-0.30,-SWING_L-0.03,-0.16,0.30,-SWING_L+0.03,0.16,36,false);
  g.box(-0.285,-SWING_L,-0.015,-0.255,0,0.015,12,false);g.box(0.255,-SWING_L,-0.015,0.285,0,0.015,12,false);
  return mesh7(new Float32Array(g.v));})();
