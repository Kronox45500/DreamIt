"use strict";
/* =====================================================================
   ÉTHER — générateurs de lieux, un jeu de fonctions par espace
   Matériaux : 0 plâtre · 1 dalles · 2 façade · 3 eau · 4 seuil lumineux · 6/7 colosses · 8 tremplin · 9 terre herbeuse
   10 carrelage · 11 carrosserie de rame · 12 métal sombre · 13 verre · 14 bulle · 15 feuillage · 16 couleur d'accent
   17 lumière blanche · 18 béton sombre · 19 sol beige craquelé · 20 route · 21 montgolfière · 22 parking · 24 gemme
   25 lumière sodium · 26 carrosserie de voiture · 27 écorce
   ===================================================================== */

/* ---------- éléments communs ---------- */
function sDoor(g){
  g.box(-0.9,0,-0.16,-0.6,2.35,0.16,0);g.box(0.6,0,-0.16,0.9,2.35,0.16,0);g.box(-0.9,2.35,-0.16,0.9,2.65,0.16,0);
  g.box(-0.6,0,-0.03,0.6,2.35,0.03,4,false);
}
function sAsc(g,P,i,j,pm,bm){
  const L=ascLayout(i,j);if(pm===undefined){pm=1;bm=0;}
  g.box(-2.2,0,-2.2,2.2,L.H-0.4,2.2,pm);g.box(-2.9,L.H-0.4,-2.9,2.9,L.H,2.9,bm);
  for(const b of L.bl)g.box(b[0]-0.75,b[1]-0.35,b[2]-0.75,b[0]+0.75,b[1],b[2]+0.75,bm);
  const m=L.bl[L.bl.length>>1];g.item(m[0],m[1]+1.2,m[2]);
}
/* garde-corps à lisses, le long de a (b0==b1) ou de b (a0==a1) */
function railing(g,a0,b0,a1,b1,y){
  const along=b0===b1,len=along?a1-a0:b1-b0,n=Math.max(1,Math.round(len/2.2));
  for(let k=0;k<=n;k++){const t=k/n,a=a0+(a1-a0)*t,b=b0+(b1-b0)*t;g.box(a-0.04,y,b-0.04,a+0.04,y+1.08,b+0.04,12,false);}
  for(const h of[0.38,0.72,1.05]){if(along)g.box(a0,y+h-0.025,b0-0.025,a1,y+h+0.025,b0+0.025,12,false);else g.box(a0-0.025,y+h-0.025,b0,a0+0.025,y+h+0.025,b1,12,false);}
  if(along)g.solid(a0,y,b0-0.05,a1,y+1.1,b0+0.05);else g.solid(a0-0.05,y,b0,a0+0.05,y+1.1,b1);
}
function tree(g,a,b,r,sc){
  sc=sc||1;const h=(2.6+r()*1.6)*sc,R=(1.5+r()*0.8)*sc;
  g.cyl(a,b,0.17*sc,0,h+R*0.4,27,true,8);
  g.sphere(a,h+R*0.75,b,R,15,ICO2,0.9);
  for(let k=0;k<4;k++){const an=r()*6.28,d=R*(0.45+r()*0.3);g.sphere(a+Math.cos(an)*d,h+R*(0.4+r()*0.7),b+Math.sin(an)*d,R*(0.5+r()*0.25),15,ICO2,0.9);}
  g.nog(a-0.4,b-0.4,a+0.4,b+0.4);
}

/* ====== Éther ====== */
function sHall(g,P,r){
  const R=P-2.4,ch=r()<0.4?2.7:3.5,th=0.9,sp=4.5,lim=R-0.8;
  g.box(-R,ch,-R,R,ch+th,R,0);
  const two=r()<0.5;
  if(two)g.box(-R,ch+th+3,-R,R,ch+th+3.9,R,0);
  for(let k=-4;k<4;k++)for(let l=-4;l<4;l++){const a=(k+0.5)*sp,b=(l+0.5)*sp;if(Math.abs(a)>lim||Math.abs(b)>lim)continue;
    g.box(a-0.35,0,b-0.35,a+0.35,ch,b+0.35,0);
    if(two)g.box(a-0.35,ch+th,b-0.35,a+0.35,ch+th+3,b+0.35,0);}
  if(r()<0.65){const w=R-0.2;g.box(-w,0,-w,w,0.95,-w+0.3,0);g.box(-w,2.05,-w,w,ch,-w+0.3,0);}
  if(r()<0.4){const w=R-0.2;g.box(w-0.3,0,-w*0.6,w,ch,w*0.2,0);}
  g.pad(P-1.6,P*0.5,12.5);g.item(0,ch+th+1.1,0);
}
function sPool(g,P,r){
  const pa=P-3.5,b0=0.6,b1=P-3;
  g.box(-P,-0.8,-P,P,0,b0,1);g.box(-P,-0.8,b1,P,0,P,1);g.box(-P,-0.8,b0,-pa,0,b1,1);g.box(pa,-0.8,b0,P,0,b1,1);
  g.box(-pa,-0.95,b0,pa,-0.45,b1,1);
  g.box(-pa,-0.45,b0,pa,-0.1,b1,3,false);g.item(0,0.75,(b0+b1)/2);
  const L=P-2.5,Wd=2*L,nW=P>=12?3:2;
  for(let w=0;w<nW;w++){
    const bw=-1.2-w*4.1;if(bw-0.9<-L)break;
    const nseg=Math.max(2,Math.floor(Wd/(5+r()*1.5))),ws=Wd/nseg;
    for(let k=0;k<nseg;k++){
      const a0=-L+k*ws,rr=ws/2-0.7-r()*0.5,s=1.9+r()*2.2;
      if(r()<0.6){const r2=ws/2-0.8,cy=s+rr+0.9+r2+r()*2.5,H=cy+0.5+r()*2;g.archWall(a0,a0+ws,bw-0.9,bw,H,rr,s,{r:r2,cy},0);}
      else g.archWall(a0,a0+ws,bw-0.9,bw,s+rr+1.2+r()*6,rr,s,null,0);
    }
  }
}
function sTower(g,P,r){
  g.box(-P+0.6,-260,-P+0.6,P-0.6,-0.8,P-0.6,2,false);g.item(P-1.6,1.1,P-1.6);
  if(r()<0.72){
    const I=P-3.4-r()*1.6,H=12+r()*52;
    g.box(-I,0,-I,I,H,I,2);g.box(-I-0.45,H,-I-0.45,I+0.45,H+0.6,I+0.45,0,false);
    if(r()<0.45){const J=I*0.55,H2=H+0.6+6+r()*20;g.box(-J,H+0.6,-J,J,H2,J,2,false);g.box(-J-0.35,H2,-J-0.35,J+0.35,H2+0.5,J+0.35,0,false);}
  }else{
    const I=P-4;for(const sa of[-1,1])for(const sb of[-1,1])g.box(sa*I-0.4,0,sb*I-0.4,sa*I+0.4,4.2,sb*I+0.4,0);
    g.box(-I-1,4.2,-I-1,I+1,5.1,I+1,0,false);
  }
}
function sStair(g,P,r){
  const run=0.32,rise=0.25,w=2.2+r()*1.2,hw=w/2,a0=-(P-2.8),n=Math.floor((2*(P-2.8)-3.2)/run);
  for(let k=0;k<n;k++)g.box(a0+k*run,0,-hw,a0+(k+1)*run,(k+1)*rise,hw,0);
  const Hs=n*rise,aE=a0+n*run,aL=aE+3;
  g.box(aE,Hs-0.45,-hw,aL,Hs,hw,0);g.item(aE+1.5,Hs+1.1,0);
  if(r()<0.55){
    const h1=Hs+1.1+r()*3.5,h2=r()<0.5?h1:Hs+1.1;
    g.box(a0,0,-hw-0.5,aL,h1,-hw,0);g.box(a0,0,hw,aL,h2,hw+0.5,0);
    g.box(aL-0.25,Hs,-hw,aL,Hs+1.0,hw,0);
  }else{
    for(const sg of[-1,1]){const b=sg*(hw-0.05);
      for(let k=0;k<n;k+=2){const y=(k+1)*rise,a=a0+k*run;
        g.box(a+0.02,y,b-0.03,a+0.08,y+1.25,b+0.03,12,false);
        g.box(a,y+1.2,b-0.03,a+2*run,y+1.26+2*rise,b+0.03,12);}
    }
    railing(g,aE,-hw+0.05,aL,-hw+0.05,Hs);railing(g,aE,hw-0.05,aL,hw-0.05,Hs);railing(g,aL-0.05,-hw,aL-0.05,hw,Hs);
  }
}
function sMono(g,P,r){
  const L=P-2.5,H=22+r()*28,t=2+r()*1.6;
  g.box(-L,0,-L,L,H,-L+t,1);
  g.box(-L+1,0,L-0.85,L-1,0.45,L,0);g.item(0,1.6,L-0.42);
  if(r()<0.5)g.box(L-0.5,0,-L+t,L,3.2,-L+t+5,0);
}
function sBalc(g,P,r){
  const L=P-2.5,H=Math.round((24+r()*38)/3.2)*3.2,t=4.5,nb=Math.max(2,Math.floor(2*L/4.6)),sp=2*L/nb,bf=-L+t;
  g.box(-L,0,-L,L,H,bf,2);
  for(let c=0;c<nb;c++){const ac=-L+(c+0.5)*sp;
    for(let lv=1;lv*3.2<H-1;lv++){const y=lv*3.2;g.box(ac-1.6,y-0.2,bf,ac+1.6,y+1.0,bf+1.7,0,lv<3);}}
  const a1=-L+0.5*sp;g.pad(a1,bf+2.7,13);g.item(a1,5.3,bf+0.85);
}
function sEmpty(g,P,r){
  const k=r();
  if(k<0.3){const q=0.5+r()*0.9;g.box(-q,0,-q,q,2*q,q,0);if(2*q>0.9)g.pad(q+1.4,0,11);g.item(0,2*q+1.1,0);}
  else if(k<0.45){g.box(-0.4,0,-0.4,0.4,9+r()*14,0.4,0);if(r()<0.5)g.item((r()-0.5)*P,1.1,(r()-0.5)*P);}
  else if(k<0.6){const L=P-3;g.box(-L,0,-0.2,L*0.3,3+r()*3,0.2,0);if(r()<0.5)g.item((r()-0.5)*P,1.1,2+r()*3);}
  else if(k<0.85){g.pad(0,0,24);g.item(0,16,0);}
  else{ /* piste : un tour de place contre la montre */
    const R=P-1.5,pts=[];
    for(let q=0;q<12;q++){const t=q/12*4,s=Math.floor(t),u=(t-s)*2-1,p=[[u*R,-R],[R,u*R],[-u*R,R],[-R,-u*R]][s];pts.push([p[0],q%3===2?2.6:1.1,p[1]]);}
    g.courseSet(0,0,pts,7+8*R/5.0);
  }
}
function etherCell(g,c,P,bw,i,j,r){
  if(c.type!==T_POOL)g.box(-P,-0.8,-P,P,0,P,(c.type===T_MONO||c.type===T_TOWER||hash(i,j,7)<0.4)?1:0);
  const ps=hash(i,j,8),ph=ps<0.4?0:ps<0.7?0.45:1.05,pt=ps<0.7?0.7:0.25;
  if(ph>0){
    const seg=(sym,w)=>{g.m=sym;if(w>0){g.box(P-pt,0,-P,P,ph,-w/2,0);g.box(P-pt,0,w/2,P,ph,P,0);}else g.box(P-pt,0,-P,P,ph,P,0);};
    seg(SYM[0],bw[0]);seg(SYM[1],bw[1]);seg(SYM[4],bw[2]);seg(SYM[6],bw[3]);
  }
  g.m=(c.type===T_DOOR||c.type===T_ASC)?SYM[0]:SYM[Math.floor(hash(i,j,9)*8)];
  switch(c.type){
    case T_DOOR:sDoor(g);break;case T_HALL:sHall(g,P,r);break;case T_POOL:sPool(g,P,r);break;case T_TOWER:sTower(g,P,r);break;
    case T_STAIR:sStair(g,P,r);break;case T_MONO:sMono(g,P,r);break;case T_BALC:sBalc(g,P,r);break;case T_EMPTY:sEmpty(g,P,r);break;
    case T_ASC:sAsc(g,P,i,j);break;
  }
  g.m=SYM[0];
  if(c.type!==T_DOOR&&hash(i,j,90)<0.22)g.npc(P-1.8,0,(hash(i,j,91)-0.5)*P,1.57);
  if(c.type!==T_TOWER&&hash(i,j,11)<0.14){const q=P*0.45;g.box(-q,-260,-q,q,-0.8,q,2,false);}
  /* liaisons vers +x et +z */
  for(let d=0;d<2;d++){
    const w=bw[d===0?0:2];if(!w)continue;const kind=bkind(i,j,d),nb=d===0?cellInfo(i+1,j):cellInfo(i,j+1);
    g.m=d===0?SYM[0]:SYM[4];g.y=0;
    const x0=P,x1=CELL-nb.P,dh=nb.h-c.h,n=Math.round(Math.abs(dh)/0.1875),R=n*0.375,fa=(x1-x0-R)/2,hw=w/2,up=dh>0;
    if(kind!==1){
      const hard=kind===3,len=hard?2.4:1.6,gp=hard?4.2:2.0,Lb=x1-x0,ns=hard?Math.max(1,Math.round((Lb-4)/(len+4))):Math.ceil((Lb-gp)/(len+gp)),gap=(Lb-ns*len)/(ns+1);
      for(let k=0;k<ns;k++){const a=x0+gap+k*(len+gap),top=c.h+dh*(k+1)/(ns+1);g.box(a,top-0.4,-0.9,a+len,top,0.9,0);
        if(k===(ns>>1)&&(hard||hash(i,j,16+d)<0.4))g.item(a+len/2,top+1.2,0);}
    }else{
      const rail=hash(i,j,12+d)<0.35;
      g.box(x0,c.h-0.5,-hw,x0+fa,c.h,hw,0);g.box(x1-fa,nb.h-0.5,-hw,x1,nb.h,hw,0);
      if(rail)for(const sg of[-1,1]){g.box(x0,c.h,sg*hw-0.1,x0+fa,c.h+1,sg*hw+0.1,0);g.box(x1-fa,nb.h,sg*hw-0.1,x1,nb.h+1,sg*hw+0.1,0);}
      for(let k=0;k<n;k++){const top=up?c.h+(k+1)*0.1875:c.h-k*0.1875,a=x0+fa+k*0.375;
        g.box(a,top-0.5,-hw,a+0.375,top,hw,0);
        if(rail)for(const sg of[-1,1])g.box(a,top,sg*hw-0.1,a+0.375,top+1,sg*hw+0.1,0);}
    }
    g.y=c.h;
  }
}

/* ====== Métro céleste : une ligne, des rames qui roulent, des stations sombres ouvertes sur le ciel ====== */
const TRAIN_HL=8.75,TRAIN_HW=1.55,TRACK_Z=2.0;
function buildTrain(closed){
  const g=new Geo(0,0,0),hw=TRAIN_HW,L=4.25;
  for(const ac of[-4.5,4.5]){
    const out=ac<0?-1:1;
    g.box(ac-L+0.4,0.14,-1.05,ac+L-0.4,0.42,1.05,12,false);
    g.box(ac-L,0.42,-hw,ac+L,0.75,hw,9);
    g.box(ac-L,3.0,-hw,ac+L,3.22,hw,11);
    g.box(ac-L+0.5,2.94,-0.35,ac+L-0.5,3.0,0.35,17,false);
    for(const sb of[-1,1]){
      const b0=sb>0?hw-0.1:-hw,b1=sb>0?hw:-hw+0.1;
      for(const [x0,x1] of [[-L,-2.85],[-1.55,1.55],[2.85,L]]){
        g.box(ac+x0,0.75,b0,ac+x1,1.6,b1,11);g.box(ac+x0,2.5,b0,ac+x1,3.0,b1,11);
        g.box(ac+x0,1.6,b0,ac+x0+0.12,2.5,b1,11,false);g.box(ac+x1-0.12,1.6,b0,ac+x1,2.5,b1,11,false);
        g.solid(ac+x0,1.6,b0,ac+x1,2.5,b1);
      }
      for(const dc of[-2.2,2.2]){
        g.box(ac+dc-0.65,2.7,b0,ac+dc+0.65,3.0,b1,11,false);
        if(closed){g.box(ac+dc-0.65,0.75,b0,ac+dc+0.65,1.6,b1,11);g.box(ac+dc-0.65,2.5,b0,ac+dc+0.65,2.7,b1,11,false);
          g.box(ac+dc-0.04,1.6,b0,ac+dc+0.04,2.5,b1,12,false);g.solid(ac+dc-0.65,1.6,b0,ac+dc+0.65,2.7,b1);}
      }
      g.box(ac-1.45,0.75,sb>0?hw-0.62:-hw+0.1,ac+1.45,1.2,sb>0?hw-0.1:-hw+0.62,12);
    }
    const xo=out>0?ac+L-0.1:ac-L;
    g.box(xo,0.75,-hw,xo+0.1,1.6,hw,11);g.box(xo,2.5,-hw,xo+0.1,3.0,hw,11);g.box(xo,1.6,-hw,xo+0.1,2.5,-hw+0.2,11,false);g.box(xo,1.6,hw-0.2,xo+0.1,2.5,hw,11,false);
    g.solid(xo,0.75,-hw,xo+0.1,3.0,hw);
    const xi=out>0?ac-L:ac+L-0.1;
    g.box(xi,0.75,-hw,xi+0.1,3.0,-0.6,11);g.box(xi,0.75,0.6,xi+0.1,3.0,hw,11);g.box(xi,2.6,-0.6,xi+0.1,3.0,0.6,11,false);
    for(const x of[-3.4,-0.9,0.9,3.4])g.box(ac+x-0.03,0.75,-0.03,ac+x+0.03,2.95,0.03,12,false);
    g.box(ac+out*(L-0.5)-0.04,2.45,-1.0,ac+out*(L-0.5)+0.04,2.85,1.0,16,false);
    g.grass(ac-L+0.15,-hw+0.7,ac+L-0.15,hw-0.7,0.75,46,0.08);
  }
  g.box(-0.3,0.42,-0.6,0.3,0.75,0.6,12);
  return g;
}
function metroLine(g,c,i,r){
  const st=c.type===T_STATION;
  /* tablier herbeux et rails */
  g.box(-24,-0.7,-4.9,24,0,4.9,9);g.grass(-24,-3.6,24,3.6,0,st?7:9,0.02);
  for(const z of[-2.72,-1.28,1.28,2.72]){g.box(-24,0,z-0.05,24,0.13,z+0.05,12,false);g.nog(-24,z-0.12,24,z+0.12);}
  if(!st){
    const v=hash(i,0,80);
    if(v<0.72){ /* tunnel : murs sombres, fentes de jour, rampe lumineuse */
      const slots=v<0.45;
      for(const sb of[-1,1]){g.m=[1,0,0,sb];
        if(slots){g.box(-24,0,4.4,24,1.5,4.9,18);g.box(-24,3.1,4.4,24,4.8,4.9,18);
          for(let a=-24;a<24;a+=8)g.box(a,1.5,4.4,a+2.6,3.1,4.9,18);}
        else g.box(-24,0,4.4,24,4.8,4.9,18);}
      g.m=SYM[0];g.box(-24,4.8,-4.9,24,5.2,4.9,18,false);
      for(const a of[-18,-6,6,18])g.box(a-1.6,4.72,-0.14,a+1.6,4.8,0.14,17,false);
    }else{ /* viaduc à ciel ouvert */
      for(const sb of[-1,1]){g.m=[1,0,0,sb];g.box(-24,0,4.4,24,0.55,4.9,0);railing(g,-24,4.65,24,4.65,0.55);}
      g.m=SYM[0];
      for(const a of[-16,0,16]){g.box(a-0.15,0,-4.75,a+0.15,5.6,-4.45,12);g.box(a-0.15,0,4.45,a+0.15,5.6,4.75,12);g.box(a-0.15,5.3,-4.75,a+0.15,5.6,4.75,12,false);}
    }
    return;
  }
  /* station */
  const kind=Math.floor(hash(i,0,81)*3),RH=6.4;
  for(const sb of[-1,1]){
    g.m=[1,0,0,sb];
    g.box(-22,0,3.72,22,0.75,9.4,19);g.box(-22,0.75,3.72,22,0.765,4.05,16,false);
    const annex=cellInfo(i,sb).exists;
    if(annex){g.box(-22,0.75,9,4.9,RH,9.4,18);g.box(7.5,0.75,9,22,RH,9.4,18);g.box(4.9,3.3,9,7.5,RH,9.4,18,false);
      const zE=CELL-cellInfo(i,sb).P;g.box(4.9,0.4,9.4,7.5,0.75,zE,19);railing(g,4.95,9.4,4.95,zE,0.75);railing(g,7.45,9.4,7.45,zE,0.75);
    }else g.box(-22,0.75,9,22,RH,9.4,18);
    for(const a of[-16,-5,13])g.box(a-0.28,0.75,6.6,a+0.28,kind===1?4.3:RH,7.16,18);
    g.box(9.5,0.75,7.7,17.5,1.1,8.7,18);g.grass(9.7,7.85,17.3,8.55,1.1,30,0.12);
    g.box(-9,0.75,8.2,-5.4,1.2,8.8,12);
    g.box(-2.2,3.6,4.4,2.2,4.2,4.5,16,false);
    /* escalier de la passerelle */
    for(let k=0;k<12;k++)g.box(-20.6+k*0.3,0.75,5.3,-20.3+k*0.3,0.75+(k+1)*0.2375,6.7,19);
    railing(g,-20.6,5.25,-17,5.25,3.6);
    if(kind===1)g.box(-12,4.3,4.6,22,4.5,9.4,0,false);
    if(hash(i,sb,83)<0.5)g.item(19+r(),1.9,6+r()*2);
    g.npc(-12+r()*5,0.75,5.0+r()*2.5,sb>0?3.14:0);if(r()<0.65)g.npc(9+r()*9,0.75,5+r()*1.4,r()*6.28);if(r()<0.4)g.npc(-3,0.75,6.2,0,3,6.2);
  }
  g.m=SYM[0];
  g.box(-17,3.3,-6.7,-15.2,3.6,6.7,19);railing(g,-17,-5.3,-17,5.3,3.6);railing(g,-15.25,-6.7,-15.25,6.7,3.6);g.item(-16.1,4.7,0);
  if(kind===0){ /* halle couverte, fente de jour au-dessus des voies */
    g.box(-22,RH,-9.4,22,RH+0.4,-1.3,18,false);g.box(-22,RH,1.3,22,RH+0.4,9.4,18,false);
    for(const a of[-18,-6,6,18])for(const z of[-6.5,6.5])g.box(a-1.5,RH-0.08,z-0.12,a+1.5,RH,z+0.12,17,false);
  }else if(kind===2){ /* nervures en plein cintre */
    g.m=SYM[4];for(let x=-20;x<=20;x+=8)g.archWall(-10.2,10.2,x-0.3,x+0.3,11.4,9.0,0.75,null,0);g.m=SYM[0];
  }
}
function metroAnnex(g,c,P,i,j,r){
  const sb=j>0?-1:1; /* côté tourné vers la station */
  g.m=SYM[0];g.box(-P,-0.6,-P,P,0,P,19);
  g.m=[1,0,0,sb];
  railing(g,-P+0.05,-P,-P+0.05,P,0);railing(g,P-0.05,-P,P-0.05,P,0);railing(g,-P,-P+0.05,P,-P+0.05,0);
  railing(g,-P,P-0.05,4.9,P-0.05,0);if(P>7.6)railing(g,7.5,P-0.05,P,P-0.05,0);
  g.m=SYM[0];
  if(c.type===T_DOOR){ /* pavillon sombre autour du seuil */
    sDoor(g);
    g.box(-4.6,3.3,-4.6,4.6,3.7,4.6,18);
    for(const sa of[-1,1]){g.box(sa*4.6-0.25,0,-4.6,sa*4.6+0.25,3.3,-1.2,18);g.box(sa*4.6-0.25,0,1.2,sa*4.6+0.25,3.3,4.6,18);}
    for(const s2 of[-1,1]){g.box(-4.6,0,s2*4.6-0.25,-1.4,3.3,s2*4.6+0.25,18);g.box(1.4,0,s2*4.6-0.25,4.6,3.3,s2*4.6+0.25,18);g.box(-1.4,2.5,s2*4.6-0.25,1.4,3.3,s2*4.6+0.25,18,false);}
  }else if(c.type===T_TERRACE){ /* borne et bancs face au vide */
    const a=-P*0.4,b=-sb*P*0.55;
    g.box(a-0.7,0,b-0.6,a+0.7,1.25,b+0.6,12);g.box(a-0.55,1.25,b-0.45,a+0.55,1.33,b+0.45,17,false);
    g.box(1,0,-sb*(P-1.4)-0.3,5,0.45,-sb*(P-1.4)+0.3,12);
    g.box(-0.2,0,-0.2,0.2,3.4,0.2,12);g.box(-0.9,3.4,-0.9,0.9,3.5,0.9,18,false);
    g.item(a,2.2,b);g.npc(3.2,0,-sb*(P-0.8),sb>0?3.14:0);
  }else{ /* jardin suspendu */
    g.box(-P+1.6,0,-P+1.6,P-1.6,0.3,P-1.6,18);g.box(-P+1.9,0.3,-P+1.9,P-1.9,0.32,P-1.9,9,false);
    g.grass(-P+1.9,-P+1.9,P-1.9,P-1.9,0.32,24,0.1);tree(g,(r()-0.5)*4,(r()-0.5)*4,r);
    g.item(-P*0.35,1.5,sb*P*0.3);
  }
}

/* ====== Aero : plaine d'herbe, routes, tours de verre, bulles, éoliennes ====== */
function turbine(g,a,b,r){
  const H=38+r()*14;g.cyl(a,b,0.75,0,H,0,true,10);g.box(a-0.9,H,b-1.6,a+0.9,H+1.4,b+2.4,0,false);
  const hub=g.P(a,H+0.7,b+2.6),n=g.N(0,0,1),t0=r()*2;
  for(let k=0;k<3;k++){const th=t0+k*2.0944,dx=Math.cos(th),dy=Math.sin(th),m=g.m,L=17+H*0.12;
    const d=[m[0]*dx,dy,m[2]*dx],p=[-m[0]*dy,dx,-m[2]*dy],q=(s,w)=>[hub[0]+d[0]*s+p[0]*w,hub[1]+d[1]*s+p[1]*w,hub[2]+d[2]*s+p[2]*w];
    g.flat(q(0,-0.8),q(L,-0.25),q(L,0.25),q(0,0.8),n,0);}
  g.nog(a-1,b-1,a+1,b+1);
}
function balloon(g,a,b,r){const y=32+r()*60,R=2.6+r()*1.4;g.sphere(a,y,b,R,21,ICO3,1.18);g.box(a-0.45,y-R*1.9,b-0.45,a+0.45,y-R*1.9+0.7,b+0.45,27,false);}
function aeroCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];
  g.top(-24,-24,24,24,0,9);g.grass(-24,-24,24,24,0,5.2,0.014);
  if(T===T_FOOT)return;
  if(T===T_ROAD){
    const rx=mod(j,3)===1,rz=mod(i,3)===1;
    for(const [on,sym,cross] of[[rx,SYM[0],rz],[rz,SYM[4],rx]]){if(!on)continue;g.m=sym;
      g.top(-24,-3.4,24,3.4,0.02,20);g.nog(-24,-4.7,24,4.7);
      for(const sb of[-1,1])for(const [a0,a1] of cross?[[-24,-4.6],[4.6,24]]:[[-24,24]])g.box(a0,0,sb>0?3.4:-4.6,a1,0.14,sb>0?4.6:-3.4,0);
      g.box(8,0,5.3,8.1,2.6,5.4,12);g.box(7.6,2.0,5.25,8.5,2.9,5.45,16,false);
      if(r()<0.55)g.npc(-20,0.14,4,0,20,4);if(r()<0.3)g.npc(18,0.14,-4,0,-18,-4);
      if(sym===SYM[0]&&!cross&&hash(i,j,92)<0.34){ /* course sur la route : slalom et sauts */
        const pts=[];for(let q=0;q<20;q++)pts.push([-13+q*4,q%4===3?2.6:1.1,q%2?2.2:-2.2]);g.courseSet(-19,0,pts,17);}
    }
    g.m=SYM[0];
    const q=[[15,15],[-15,15],[15,-15],[-15,-15]][Math.floor(r()*4)];
    const k=r();if(k<0.22)turbine(g,q[0],q[1],r);else if(k<0.5)tree(g,q[0],q[1],r,1.2);else if(k<0.62)g.item(q[0],1.1,q[1]);
    if(r()<0.25)balloon(g,(r()-0.5)*30,(r()-0.5)*30,r);
    return;
  }
  if(T===T_DOOR){sDoor(g);g.nog(-1.5,-1.5,1.5,1.5);tree(g,-6,-4,r);tree(g,7,-3,r);return;}
  if(T===1){ /* parc : arbres, bassin, bancs */
    const n=5+Math.floor(r()*5);for(let k=0;k<n;k++){const an=r()*6.28,d=9+r()*12;tree(g,Math.cos(an)*d,Math.sin(an)*d,r,0.9+r()*0.6);}
    g.box(-5,0,-4,5,0.35,-3.6,0);g.box(-5,0,3.6,5,0.35,4,0);g.box(-5,0,-3.6,-4.6,0.35,3.6,0);g.box(4.6,0,-3.6,5,0.35,3.6,0);
    g.top(-4.6,-3.6,4.6,3.6,0.24,3);g.nog(-5.1,-4.1,5.1,4.1);g.item(0,1.2,0);
    g.box(-2,0,6,2,0.45,6.6,0);g.npc(3.2,0,7.6,3.14);if(r()<0.5)g.npc(-9,0,-6,0,9,-7);
  }else if(T===2){ /* tours de verre */
    const sp=[[-11,-10],[9,-12],[-4,12],[13,8]],n=2+Math.floor(r()*3);
    for(let k=0;k<n;k++){const a=sp[k][0],b=sp[k][1],R=4.5+r()*3,H=36+r()*110;
      if(r()<0.6){g.cyl(a,b,R,0,H,13,true,24);g.sphere(a,H,b,R,14,ICO3,0.8);}
      else{g.box(a-R,0,b-R,a+R,H,b+R,13);g.box(a-R-0.3,H,b-R-0.3,a+R+0.3,H+0.5,b+R+0.3,0,false);}
      g.nog(a-R-0.3,b-R-0.3,a+R+0.3,b+R+0.3);}
    g.box(2,0,-2.5,7,4.5,2.5,0);g.nog(2,-2.5,7,2.5);g.pad(0.5,0,13.5);g.item(4.5,5.7,0);
  }else if(T===3){ /* bulles et dalles de verre en spirale */
    const n=9+Math.floor(r()*5);
    for(let k=0;k<n;k++){const an=k*0.62,a=Math.cos(an)*5,b=Math.sin(an)*5,y=0.65*(k+1);g.box(a-0.9,y-0.2,b-0.9,a+0.9,y,b+0.9,13);if(k===n-1)g.item(a,y+1.2,b);}
    g.sphere(0,6+r()*3,0,2.4+r(),14,ICO3);
    for(let k=0;k<9;k++)g.sphere((r()-0.5)*40,2+r()*20,(r()-0.5)*40,0.4+r()*1.5,14,ICO2);
    balloon(g,(r()-0.5)*20,(r()-0.5)*20,r);
  }else if(T===4){ /* éoliennes et prairie fleurie */
    turbine(g,-9,-8,r);if(r()<0.6)turbine(g,12,10,r);
    g.grass(-14,-14,14,14,0,3.2,0.4);g.item((r()-0.5)*16,1.1,(r()-0.5)*16);
  }else if(T===5){ /* dôme à facettes */
    g.gem(0,0,0,11,24,ICO2);g.solid(-8,0,-8,8,7,8);g.solid(-4.5,7,-4.5,4.5,10.3,4.5);g.nog(-11,-11,11,11);
    g.pad(13.5,0,18.2);g.item(0,11.6,0);tree(g,-16,14,r);
  }else if(T===6){ /* grand panneau blanc sur pilotis */
    for(let a=-9;a<=9;a+=3)g.box(a-0.1,0,-0.1,a+0.1,7,0.1,12);
    g.box(-10,7,-0.5,10,14,0.5,0);g.box(-10,6.6,-2.2,10,7,0.5,0);
    g.box(-13.5,0,-2.2,-11.5,3.6,-0.2,0);g.pad(-15.2,-1.2,11.5);g.pad(-12.5,-1.2,10.6,3.6);g.item(-6,8.2,-1.3);
    balloon(g,10,-12,r);
  }else{ /* tour d'ascension en verre */
    sAsc(g,24,i,j,13,0);g.nog(-6,-6,6,6);for(let k=0;k<5;k++)g.sphere((r()-0.5)*30,3+r()*20,(r()-0.5)*30,0.5+r()*1.3,14,ICO2);
  }
}

/* ====== Poolrooms : un intérieur sans fin, carrelé, tiède, éclairé par des dalles au plafond ====== */
function roomH(i,j){const t=cellInfo(i,j).type;return t===8?24:(t===2||t===5)?3.6:t===3?5.5:t===1?6.5:5;}
function poolCell(g,c,i,j,r){
  const T=c.type,H=roomH(i,j);
  /* murs est et nord, percés chacun de deux arches ; les voisins ferment l'ouest et le sud */
  for(const [sym,ni,nj,k] of[[SYM[4],i+1,j,0],[SYM[0],i,j+1,1]]){
    g.m=sym;const Hw=Math.max(H,roomH(ni,nj)),s1=(hash(i,j,70+k)-0.5)*12;
    g.archWall(-24,s1,23.7,24.3,Hw,1.7,1.6,null,10);g.archWall(s1,24,23.7,24.3,Hw,1.7,1.6,null,10);
  }
  g.m=SYM[0];
  const sky=T===1||T===8,hs=T===8?9:6;
  if(sky){g.box(-24,H,-24,24,H+0.6,-hs,10,false);g.box(-24,H,hs,24,H+0.6,24,10,false);g.box(-24,H,-hs,-hs,H+0.6,hs,10,false);g.box(hs,H,-hs,24,H+0.6,hs,10,false);}
  else g.box(-24,H,-24,24,H+0.6,24,10,false);
  if(H<10)for(const a of[-18,-6,6,18])for(const b of[-18,-6,6,18]){if(sky&&Math.abs(a)<hs&&Math.abs(b)<hs)continue;g.box(a-0.9,H-0.05,b-0.9,a+0.9,H,b+0.9,17,false);}
  const floor=(a0,b0,a1,b1,dp)=>{const yb=-dp-0.5;
    g.box(-24,yb,-24,24,0,b0,10);g.box(-24,yb,b1,24,0,24,10);g.box(-24,yb,b0,a0,0,b1,10);g.box(a1,yb,b0,24,0,b1,10);
    g.box(a0,yb,b0,a1,-dp,b1,10);g.box(a0,-dp,b0,a1,-0.1,b1,dp>1?38:3,false);
    if(dp>0.8){g.box(a0,-dp,b0,a0+0.6,-0.4,b1,10);g.box(a0+0.6,-dp,b0,a0+1.2,-0.8,b1,10);g.box(a1-0.6,-dp,b0,a1,-0.4,b1,10);g.box(a1-1.2,-dp,b0,a1-0.6,-0.8,b1,10);}};
  if(T===1){ /* grand bassin sous un puits de lumière */
    for(const sym of[SYM[0],SYM[4]]){g.m=sym;for(const L of[-18,18])for(let k=0;k<6;k++)g.archWall(-24+k*8,-16+k*8,L-0.3,L+0.3,H,2.4,1.4,null,10);}g.m=SYM[0];
    floor(-14,-12,14,12,4.5);g.water(-14,-12,14,12,-0.1,-4.5);g.pearl(-6,-4.05,3);g.pearl(8,-4.05,-5);
    for(const a of[-16,-5.5,5.5,16])for(const b of[-14,14])g.cyl(a,b,0.45,0,H,10,true,12);
    g.item(0,0.4,0);g.item(-19,1.1,19);return;
  }
  if(T===6){ /* salle sèche, bancs, petit bain */
    g.m=SYM[4];for(let k=0;k<6;k++)g.archWall(-24+k*8,-16+k*8,-0.3,0.3,H,1.6,1.4,null,10);g.m=SYM[0];
    floor(4,-6,16,6,7);g.water(4,-6,16,6,-0.1,-7);g.pearl(10,-6.55,0);g.pearl(13.5,-6.55,4);g.pearl(6.5,-6.55,-4);
    for(const b of[-16,-8,8,16])g.box(-18,0,b-0.3,-8,0.45,b+0.3,10);
    g.box(-21,0,-21,-20.4,2.2,21,10);g.item(10.5,0.7,0);return;
  }
  g.box(-24,-0.8,-24,24,0,24,10);
  if(T===T_DOOR){sDoor(g);g.top(-9,3,9,10,0.12,3);return;}
  if(T===2){ /* salle basse inondée, forêt de piliers */
    g.top(-23.7,-23.7,23.7,23.7,0.2,3);
    for(let a=-21;a<=21;a+=6)for(let b=-21;b<=21;b+=6)g.cyl(a,b,0.4,0,H,10,true,10);
    for(let a=-21;a<21;a+=6)for(let b=-21;b<=21;b+=6)if(r()<0.30){g.m=r()<0.5?SYM[0]:SYM[4];g.box(a,0,b-0.2,a+6,H,b+0.2,10);}g.m=SYM[0];
    g.item((r()-0.5)*30,1.1,(r()-0.5)*30);if(r()<0.35)g.npc((r()-0.5)*30+1.5,0,(r()-0.5)*30+1.5,r()*6.28);
  }else if(T===3){ /* arcades et canaux */
    g.m=SYM[r()<0.5?0:4];
    for(const bz of[-12,0,12])for(let k=0;k<6;k++){const a0=-21+k*7;g.archWall(a0,a0+7,bz-0.35,bz+0.35,H,2.6,2.0,null,10);}
    g.top(-21,-11.6,21,-0.4,0.16,3);g.top(-21,0.4,21,11.6,0.16,3);g.m=SYM[0];g.item(0,1.1,6);g.item((r()-0.5)*30,1.1,-18);
  }else if(T===5){ /* enfilade de petites pièces voûtées */
    g.top(-23.7,-23.7,23.7,23.7,0.14,3);
    for(const sym of[SYM[0],SYM[4]]){g.m=sym;
      for(const L of[-16,-8,0,8,16])for(let k=0;k<6;k++){const s0=-24+k*8,q=r();
        if(q<0.16)g.box(s0,0,L-0.15,s0+8,H,L+0.15,10);
        else if(q>=0.30)g.archWall(s0,s0+8,L-0.15,L+0.15,H,0.8+r()*0.9,1.3,null,10);}}
    g.m=SYM[0];for(let k=0;k<2;k++)g.item(-20+8*Math.floor(r()*6),1.1,-20+8*Math.floor(r()*6));
    if(r()<0.3)g.npc(-20+8*Math.floor(r()*6),0,-20+8*Math.floor(r()*6),r()*6.28);
  }else{ /* puits : très haut, ouvert sur le ciel, plongeoir au centre */
    g.top(-23.7,-23.7,23.7,23.7,0.2,3);sAsc(g,24,i,j,10,10);
    for(const sa of[-1,1])for(const sb of[-1,1])g.cyl(sa*15,sb*15,0.7,0,H,10,true,14);
  }
}

/* ====== Nocturne : un parking sans fin, la nuit, sous des lampadaires au sodium ====== */
function car(g,a,b,along,r){
  const m=g.m;g.m=along?SYM[0]:SYM[4];const A=along?a:b,B=along?b:a;
  g.box(A-2.2,0.32,B-0.9,A+2.2,1.02,B+0.9,26);g.box(A-1.2,1.02,B-0.8,A+1.1,1.56,B+0.8,12);
  for(const sa of[-1.45,1.45])for(const sb of[-0.86,0.86])g.box(A+sa-0.32,0,B+sb-0.1,A+sa+0.32,0.64,B+sb+0.1,12,false);
  g.m=m;
}
function nightCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.top(-24,-24,24,24,0,22);
  for(const sa of[-1,1])for(const sb of[-1,1]){const a=sa*12,b=sb*12;
    g.box(a-0.09,0,b-0.09,a+0.09,8.1,b+0.09,12);g.box(a-0.6,7.95,b-0.14,a+0.6,8.1,b+0.14,12,false);g.box(a-0.5,7.88,b-0.12,a+0.5,7.95,b+0.12,25,false);}
  if(T===T_FOOT)return;
  if(T===T_DOOR){sDoor(g);return;}
  if(hash(i,j,90)<0.14)g.npc(12.9,0,12.9,r()*6.28);
  if(T===1){ /* emplacements vides, quelques voitures oubliées */
    const n=Math.floor(r()*4);for(let k=0;k<n;k++){const a=-19.5+Math.floor(r()*15)*2.6,b=(r()<0.5?-1:1)*(3.5+Math.floor(r()*2)*12);car(g,a,b,false,r);if(k===0){g.carAt(a,b);if(r()<0.6)g.item(a,2.7,b);}}
    if(n===0&&r()<0.5)g.item((r()-0.5)*30,1.1,(r()-0.5)*30);
  }else if(T===2){ /* parking à étages */
    for(let k=1;k<=3;k++){const y=3.2*k,gA=k===2?[-4,-2.4]:[2.4,4];
      g.box(-16,y-0.35,-10,16,y,10,18);
      g.box(-16,y,-10,16,y+1,-9.75,18);g.box(-16,y,-10,-15.75,y+1,10,18);g.box(15.75,y,-10,16,y+1,10,18);
      g.box(-16,y,9.75,gA[0],y+1,10,18);g.box(gA[1],y,9.75,16,y+1,10,18);
      const sA=k!==2,z0=sA?10:11.5,dir=k===2?-1:1;
      for(let s=0;s<16;s++){const a=dir>0?-2.4+s*0.3:2.4-(s+1)*0.3;g.box(a,y-3.2+(s+1)*0.2-0.25,z0,a+0.3,y-3.2+(s+1)*0.2,z0+1.5,18);}
      g.box(gA[0],y-0.25,10,gA[1],y,13,18);
      if(r()<0.7)car(g,-10+r()*18,(r()<0.5?-1:1)*5.5,true,r);
    }
    for(const a of[-15,-7.5,0,7.5,15])for(const b of[-9,9])g.box(a-0.3,0,b-0.3,a+0.3,9.6,b+0.3,18);
    g.box(-4.2,0,13,-4,10.6,13.2,18);g.box(4,0,13,4.2,10.6,13.2,18);
    g.item(12,10.8,0);g.item(-12,4.4,-6);
  }else if(T===3){ /* guérite et barrière */
    g.box(-1.4,0,-1.4,1.4,2.7,1.4,18);g.box(-1.7,2.7,-1.7,1.7,2.9,1.7,18,false);g.box(-0.9,1.1,1.4,0.9,2.1,1.44,17,false);
    g.box(2.2,0,1.0,2.45,1.1,1.25,12);g.box(2.2,0.95,1.05,8.4,1.1,1.2,16);
    g.item(0,4.0,0);g.pad(-3.2,0,11.5);
  }else if(T===4){ /* friche : l'herbe perce l'asphalte */
    g.top(-13,-13,13,13,0.015,19);g.grass(-19,-19,19,19,0,2.6,0.03);g.grass(-8,-8,8,8,0,9,0.05);
    for(const p of[[-12,-12],[12,12],[-12,12],[12,-12]])g.nog(p[0]-0.5,p[1]-0.5,p[0]+0.5,p[1]+0.5);
    g.item((r()-0.5)*12,1.1,(r()-0.5)*12);
  }else if(T===5){ /* panneau lumineux */
    g.cyl(-6,0,0.35,0,7,12,true,8);g.cyl(6,0,0.35,0,7,12,true,8);
    g.box(-8.5,6.6,-0.35,8.5,12.4,0.35,12,false);g.box(-8.2,6.9,0.35,8.2,12.1,0.4,17,false);g.box(-8.2,6.9,-0.4,8.2,12.1,-0.35,17,false);
    g.item(0,1.1,3);
  }else{ /* tour de béton, feu au sommet */
    sAsc(g,24,i,j,18,0);
  }
}

/* ====== Backrooms : papier peint jaune, moquette, néons, cloisons sans fin ====== */
function backCell(g,c,i,j,r){
  const T=c.type,H=2.7;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,31);g.box(-24,H,-24,24,H+0.4,24,32,false);
  for(let a=-20;a<24;a+=8)for(let b=-20;b<24;b+=8)g.box(a-0.6,H-0.04,b-0.3,a+0.6,H,b+0.3,17,false);
  if(T===T_DOOR)sDoor(g);
  const sq=()=>-22+4*Math.floor(r()*12);
  /* trame de 4 m : pièces étroites, couloirs, embrasures sans porte */
  for(let a=-24;a<24;a+=4)for(let b=-24;b<24;b+=4){
    const clear=T===T_DOOR&&Math.abs(a+2)<7&&Math.abs(b+2)<7;
    for(let al=0;al<2;al++){
      let p=T===2?0.10:0.62;if(T===3)p=al?0.88:0.12;
      const on=r()<p,gap=r()<(T===3?0.22:0.45);if(!on||clear)continue;
      g.m=al?SYM[4]:SYM[0];const A=al?b:a,Bz=al?a:b;
      if(gap){g.box(A,0,Bz-0.1,A+1.4,H,Bz+0.1,30);g.box(A+2.6,0,Bz-0.1,A+4,H,Bz+0.1,30);g.box(A+1.4,2.1,Bz-0.1,A+2.6,H,Bz+0.1,30,false);}
      else g.box(A,0,Bz-0.1,A+4,H,Bz+0.1,30);
    }
  }
  g.m=SYM[0];
  if(T===2)for(let a=-16;a<=16;a+=8)for(let b=-16;b<=16;b+=8)g.box(a-0.4,0,b-0.4,a+0.4,H,b+0.4,30);
  const n=T===T_DOOR?0:2;for(let k=0;k<n;k++)g.item(sq(),1.1,sq());
  if(T!==T_DOOR&&r()<0.4)g.npc(sq(),0,sq(),r()*6.28);
}

/* ====== Galerie : centre commercial vide, deux niveaux, verrière ====== */
function mallCell(g,c,i,j,r){
  const T=c.type,Y=4.5,RH=10,h=10;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,33);
  g.box(-24,Y-0.4,-24,24,Y,-h,33);g.box(-24,Y-0.4,h,24,Y,24,33);g.box(-24,Y-0.4,-h,-h,Y,h,33);g.box(h,Y-0.4,-h,24,Y,h,33);
  railing(g,-h,-h,h,-h,Y);railing(g,-h,-h,-h,h,Y);railing(g,h,-h,h,h,Y);
  if(T===1){railing(g,-h,h,-1,h,Y);railing(g,1.6,h,h,h,Y);}else railing(g,-h,h,h,h,Y);
  const s=7;g.box(-24,RH,-24,24,RH+0.5,-s,0,false);g.box(-24,RH,s,24,RH+0.5,24,0,false);g.box(-24,RH,-s,-s,RH+0.5,s,0,false);g.box(s,RH,-s,24,RH+0.5,s,0,false);
  for(const sa of[-1,1])for(const sb of[-1,1]){g.box(sa*h-0.35,0,sb*h-0.35,sa*h+0.35,RH,sb*h+0.35,0);g.box(sa*17.5-0.3,Y,sb*17.5-0.3,sa*17.5+0.3,RH,sb*17.5+0.3,0);}
  /* boutiques fermées sous la galerie */
  for(const sb of[-1,1]){if(r()<0.7){const a0=-20+r()*14,w=7+r()*6,z0=sb>0?15:-21;
    g.box(a0,0,z0,a0+w,3.3,z0+6,0);g.box(a0+0.6,0.5,sb>0?z0-0.04:z0+6,a0+w-0.6,2.6,sb>0?z0:z0+6.04,12,false);g.box(a0+0.4,2.8,sb>0?z0-0.08:z0+6,a0+w-0.4,3.2,sb>0?z0:z0+6.08,16,false);}}
  if(T===T_DOOR){sDoor(g);return;}
  if(T===1){ /* escalier vers la galerie */
    for(let k=0;k<20;k++)g.box(-7+k*0.3,Y*(k+1)/20-0.3,h-1.5,-7+(k+1)*0.3,Y*(k+1)/20,h,33);
    g.box(-1,Y-0.3,h-1.5,1.6,Y,h,33);railing(g,-7,h-1.55,1.6,h-1.55,Y);
    g.item(17,Y+1.1,-17);g.item(-16,1.1,3);
    if(r()<0.6)g.npc(-18,Y,17,0,18,17);
  }else if(T===2){ /* fontaine */
    g.box(-4,0,-4,4,0.5,-3.6,0);g.box(-4,0,3.6,4,0.5,4,0);g.box(-4,0,-3.6,-3.6,0.5,3.6,0);g.box(3.6,0,-3.6,4,0.5,3.6,0);
    g.top(-3.6,-3.6,3.6,3.6,0.38,3);g.cyl(0,0,0.5,0,1.5,0,true,12);g.cyl(0,0,1.2,1.5,1.62,0,false,16);g.item(0,2.9,0);
    g.pad(7.6,0,14.2);g.item(17,Y+1.1,6);
  }else if(T===3){ /* jardinières et bancs */
    for(const q of[[-5,-5],[5,4],[-4,6]]){g.box(q[0]-1.3,0,q[1]-1.3,q[0]+1.3,0.55,q[1]+1.3,0);g.grass(q[0]-1.1,q[1]-1.1,q[0]+1.1,q[1]+1.1,0.55,26,0.2);
      g.cyl(q[0],q[1],0.12,0.55,2.4,27,false,6);g.sphere(q[0],3.0,q[1],1.1,15,ICO2,0.9);}
    g.box(1,0,-7,5,0.45,-6.3,12);g.pad(-7.6,-2,14.2);g.item(-17,Y+1.1,-10);g.item(6,1.1,-3);
  }else{ /* course sur la galerie */
    const R=17,pts=[];for(let q=0;q<16;q++){const t=q/16*4,k=Math.floor(t),u=(t-k)*2-1,p=[[u*R,-R],[R,u*R],[-u*R,R],[-R,-u*R]][k];pts.push([p[0],Y+(q%4===3?2.6:1.1),p[1]]);}
    g.courseSet(-R,-R,pts,8+8*R/5.2,Y);g.item(0,1.1,0);
  }
}

/* ====== Aire de jeux : structures pastel sur un pré, au couchant ====== */
function playCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.top(-24,-24,24,24,0,9);g.grass(-24,-24,24,24,0,4.6,0.05);
  g.box(-18.06,0,-18.06,-17.94,3.4,-17.94,12,false);g.sphere(-18,3.6,-18,0.28,17,ICO2);g.nog(-18.4,-18.4,-17.6,-17.6);
  if(T===T_FOOT)return;
  if(T===T_DOOR){sDoor(g);g.nog(-1.5,-1.5,1.5,1.5);return;}
  if(T!==8)g.m=SYM[Math.floor(r()*8)];
  if(T===1){ /* tour, escalier d'un côté, descente de l'autre */
    for(const sa of[-1,1])for(const sb of[-1,1]){g.box(sa*2-0.12,0,sb*2-0.12,sa*2+0.12,5.2,sb*2+0.12,37);}
    g.box(-2.2,2.8,-2.2,2.2,3,2.2,36);g.box(-2.5,5.2,-2.5,2.5,5.45,2.5,34,false);
    for(let k=0;k<12;k++)g.box(-5.8+k*0.3,(k+1)*0.25-0.14,-0.7,-5.5+k*0.3,(k+1)*0.25,0.7,35);
    for(let k=0;k<29;k++)g.box(2.2+k*0.22,2.9-(k+1)*0.1-0.12,-0.6,2.42+k*0.22,2.9-(k+1)*0.1,0.6,34);
    for(const sb of[-1,1])g.box(2.2,1.6,sb*0.66-0.04,8.6,1.75,sb*0.66+0.04,37,false);
    g.item(0,4.1,0);g.nog(-6.2,-2.6,9,2.6);
  }else if(T===2){ /* plateformes à gravir */
    let la=0,lb=0,ly=0;
    for(let k=0;k<8;k++){const a=-5+(k%3)*4.4,b=-4.4+Math.floor(k/3)*4.4,y=0.7+k*0.65;
      g.box(a-1,y-0.15,b-1,a+1,y,b+1,34+k%4);g.box(a-0.08,0,b-0.08,a+0.08,y-0.15,b+0.08,12,false);la=a;lb=b;ly=y;}
    g.item(la,ly+1.2,lb);g.nog(-6.4,-5.8,5.2,5.8);
  }else if(T===3){ /* balançoires, bac à sable */
    for(const sa of[-3,3]){g.box(sa-0.1,0,-0.1,sa+0.1,3,0.1,37);}
    g.box(-3,2.9,-0.08,3,3.05,0.08,37,false);
    for(const sa of[-1.3,1.3]){g.box(sa-0.3,0.55,-0.16,sa+0.3,0.61,0.16,36);g.box(sa-0.29,0.6,-0.02,sa-0.26,2.9,0.02,12,false);g.box(sa+0.26,0.6,-0.02,sa+0.29,2.9,0.02,12,false);}
    g.box(5.5,0,-3.5,12.5,0.28,-3.2,36);g.box(5.5,0,3.2,12.5,0.28,3.5,36);g.box(5.5,0,-3.2,5.8,0.28,3.2,36);g.box(12.2,0,-3.2,12.5,0.28,3.2,36);
    g.top(5.8,-3.2,12.2,3.2,0.14,19);g.nog(5.5,-3.5,12.5,3.5);g.nog(-3.4,-0.6,3.4,0.6);g.item(9,1.1,0);
  }else if(T===4){ /* tremplins en chaîne */
    g.pad(-6,0,12);g.box(-3.5,3.3,-1.5,-0.5,3.5,1.5,35);g.box(-2.1,0,-0.1,-1.9,3.3,0.1,12,false);
    g.pad(-2,0,13.6,3.5);g.box(2,7.6,-1.6,5.4,7.8,1.6,34);g.box(3.6,0,-0.1,3.8,7.6,0.1,12,false);g.item(3.7,8.9,0);
  }else if(T===5){ /* pré : tour de piste contre la montre */
    const R=13,pts=[];for(let q=0;q<12;q++){const t=q/12*4,k=Math.floor(t),u=(t-k)*2-1,p=[[u*R,-R],[R,u*R],[-u*R,R],[-R,-u*R]][k];pts.push([p[0],q%3===2?2.6:1.1,p[1]]);}
    g.courseSet(0,0,pts,7+8*R/5.0);g.nog(-1,-1,1,1);g.grass(-10,-10,10,10,0,3,0.5);
  }else{sAsc(g,24,i,j,37,34);g.nog(-6,-6,6,6);}
}

/* ---------- génération d'une cellule ---------- */
function genCell(i,j){
  const c=cellInfo(i,j),cx=i*CELL,cz=j*CELL,g=new Geo(cx,cz,c.h),r=rng(Math.floor(hash(i,j,20)*4294967296)),gen=GEN;
  let door=null;
  if(c.exists){
    if(c.type===T_DOOR)door={x:cx,y:c.h,z:cz};
    if(gen===0){const P=c.P;etherCell(g,c,P,[bridge(i,j,0),bridge(i-1,j,0),bridge(i,j,1),bridge(i,j-1,1)],i,j,r);}
    else if(gen===1){if(j===0)metroLine(g,c,i,r);else metroAnnex(g,c,c.P,i,j,r);}
    else if(gen===2)aeroCell(g,c,i,j,r);
    else if(gen===3)poolCell(g,c,i,j,r);
    else if(gen===5)backCell(g,c,i,j,r);
    else if(gen===6)mallCell(g,c,i,j,r);
    else if(gen===7)playCell(g,c,i,j,r);
    else nightCell(g,c,i,j,r);
    if(c.type===T_FOOT){ /* pied d'un colosse : on s'y cogne */
      const mg=megaInfo(Math.floor(cx/MEGA),Math.floor(cz/MEGA));
      for(const f of mg.feet){const x0=Math.max(f[0],cx-24),x1=Math.min(f[2],cx+24),z0=Math.max(f[1],cz-24),z1=Math.min(f[3],cz+24);
        if(x1>x0&&z1>z0){g.col.push(x0,-2,z0,x1,300,z1);g.ng.push([x0,z0,x1,z1]);}}
    }
  }else if(c.remote){
    g.y=0;g.m=SYM[0];const q=6+r()*8,H=r()<0.3?150+r()*260:10+r()*110;
    g.box(-q,-260,-q,q,H,q,2,false);g.box(-q-0.5,H,-q-0.5,q+0.5,H+0.7,q+0.5,0,false);
    if(r()<0.5){const q2=q*0.5,H2=H+8+r()*30;g.box(-q2,H+0.7,-q2,q2,H2,q2,2,false);}
  }
  const hasAsc=c.exists&&c.type===T_ASC;
  return {verts:new Float32Array(g.v),col:new Float32Array(g.col),door,items:g.items,pads:g.pads,npcs:g.npcs,wat:g.wat,pearls:g.pearls,course:g.course,car:g.car,blades:g.gr.length?g.blades(r):null,
          asc:hasAsc?{x:cx,z:cz,top:c.h+ascLayout(i,j).H}:null};
}
