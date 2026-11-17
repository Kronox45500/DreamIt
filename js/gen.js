"use strict";
/* =====================================================================
   ÉTHER — générateurs de lieux, un jeu de fonctions par espace
   Matériaux : 0 plâtre · 1 dalles · 2 façade · 3 eau · 4 seuil lumineux · 6/7 colosses · 8 tremplin · 9 terre herbeuse
   10 carrelage · 11 carrosserie de rame · 12 métal sombre · 13 verre · 14 bulle · 15 feuillage · 16 couleur d'accent
   17 lumière blanche · 18 béton sombre · 19 sol beige craquelé · 20 route · 21 montgolfière · 22 parking · 24 gemme
   25 lumière sodium · 26 carrosserie de voiture · 27 écorce
   ===================================================================== */

/* ---------- éléments communs ---------- */
function sDoor(g){ /* les seuils n'existent plus : la place reste vide */
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
/* ====== accessoires des Poolrooms ====== */
function showerRow(g,a,b0,n,r){ /* un muret carrelé et une rangée de douches, certaines coulent */
  g.box(a,0,b0-0.8,a+0.3,2.4,b0+n*1.5+0.1,10);
  for(let k=0;k<n;k++){const b=b0+k*1.5;
    g.cyl(a-0.04,b,0.028,0.9,2.18,12,false,6);g.box(a-0.42,2.14,b-0.025,a-0.04,2.19,b+0.025,12,false);g.cyl(a-0.42,b,0.09,2.06,2.14,12,false,10);
    g.box(a-0.07,1.05,b-0.06,a-0.01,1.17,b+0.06,12,false);g.box(a-0.5,0,b-0.12,a-0.34,0.012,b+0.12,12,false);
    if(r()<0.45)g.cyl(a-0.42,b,0.05,0.02,2.06,53,false,6);}
}
function sinkRow(g,a0,b,n){ /* lavabos et robinets contre une cloison */
  g.box(a0-0.6,0,b,a0+n*1.3,2.2,b+0.25,10);
  for(let k=0;k<n;k++){const a=a0+k*1.3;
    g.box(a-0.32,0.74,b-0.46,a+0.32,0.9,b,10);g.box(a-0.24,0.86,b-0.40,a+0.24,0.905,b-0.06,3,false);
    g.box(a-0.02,0.9,b-0.10,a+0.02,1.07,b-0.06,12,false);g.box(a-0.02,1.03,b-0.24,a+0.02,1.07,b-0.06,12,false);
    g.box(a-0.3,1.25,b-0.02,a+0.3,1.95,b,47,false);}
}
function seated(g,a,b){ /* une chaise face au mur ; la silhouette est une image posée dessus */
  for(const sa of[-0.2,0.2])for(const sb of[-0.2,0.2])g.box(a+sa-0.02,0,b+sb-0.02,a+sa+0.02,0.45,b+sb+0.02,12,false);
  g.box(a-0.24,0.45,b-0.24,a+0.24,0.49,b+0.24,12);g.box(a-0.24,0.49,b-0.24,a-0.20,1.02,b+0.24,12,false);
  g.sitAt(a+0.06,0,b)
}
let loneKey=null,loneAt=null;
function loneCell(){ /* une seule pièce, dans tout le niveau, abrite l'ombre assise */
  if(loneKey===WSALT)return loneAt;loneKey=WSALT;loneAt=null;
  for(let rr=2;rr<=9&&!loneAt;rr++)for(let i=-rr;i<=rr&&!loneAt;i++)for(let j=-rr;j<=rr&&!loneAt;j++){
    if(Math.max(Math.abs(i),Math.abs(j))!==rr)continue;if(cellInfo(i,j).type===5)loneAt=[i,j];}
  return loneAt;
}

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
    if(r()<0.6)showerRow(g,-23+6*Math.floor(1+r()*6)+2.6,-20+6*Math.floor(r()*5),4,r);
    g.item((r()-0.5)*30,1.1,(r()-0.5)*30);if(r()<0.35)g.npc((r()-0.5)*30+1.5,0,(r()-0.5)*30+1.5,r()*6.28);
  }else if(T===3){ /* arcades et canaux */
    g.m=SYM[r()<0.5?0:4];
    for(const bz of[-12,0,12])for(let k=0;k<6;k++){const a0=-21+k*7;g.archWall(a0,a0+7,bz-0.35,bz+0.35,H,2.6,2.0,null,10);}
    g.top(-21,-11.6,21,-0.4,0.16,3);g.top(-21,0.4,21,11.6,0.16,3);g.m=SYM[0];g.item(0,1.1,6);g.item((r()-0.5)*30,1.1,-18);sinkRow(g,-8+r()*6,-18.6,4);
  }else if(T===5){ /* enfilade de petites pièces voûtées */
    g.top(-23.7,-23.7,23.7,23.7,0.14,3);
    for(const sym of[SYM[0],SYM[4]]){g.m=sym;
      for(const L of[-16,-8,0,8,16])for(let k=0;k<6;k++){const s0=-24+k*8,q=r();
        if(q<0.16)g.box(s0,0,L-0.15,s0+8,H,L+0.15,10);
        else if(q>=0.30)g.archWall(s0,s0+8,L-0.15,L+0.15,H,0.8+r()*0.9,1.3,null,10);}}
    g.m=SYM[0];for(let k=0;k<2;k++)g.item(-20+8*Math.floor(r()*6),1.1,-20+8*Math.floor(r()*6));
    if(r()<0.5)showerRow(g,-23.2+8*Math.floor(1+r()*4),-22.5+8*Math.floor(r()*5),3,r);
    {const lc=loneCell();if(lc&&lc[0]===i&&lc[1]===j)seated(g,22.7,22.4);}
  }else{ /* puits : très haut, ouvert sur le ciel, plongeoir au centre */
    g.top(-23.7,-23.7,23.7,23.7,0.2,3);sAsc(g,24,i,j,10,10);
    for(const sa of[-1,1])for(const sb of[-1,1])g.cyl(sa*15,sb*15,0.7,0,H,10,true,14);
  }
}

/* ====== Nocturne : un parking sans fin, la nuit, sous des lampadaires au sodium ====== */
function car(g,a,b,along,r){
  const m=g.m;g.m=along?SYM[0]:SYM[4];const A=along?a:b,B=along?b:a,pc=48+Math.floor(r()*4),dr=r()<0.5?1:-1,X=x=>A+dr*x;
  const bx=(x0,y0,z0,x1,y1,z1,mt,sol)=>g.box(Math.min(X(x0),X(x1)),y0,B+z0,Math.max(X(x0),X(x1)),y1,B+z1,mt,sol);
  bx(-2.12,0.32,-0.87,2.12,0.90,0.87,pc);                                   /* caisse */
  const EL=(x,y,z,rl,ry,rw,mt,ico)=>g.ell(X(x),y,B+z,along?rl:rw,ry,along?rw:rl,mt,ico); /* rayons donnés dans le repère de la voiture */
  EL(2.12,0.61,0,0.13,0.29,0.86,pc,ICO2);EL(-2.12,0.61,0,0.10,0.29,0.86,pc,ICO2);
  bx(-2.30,0.30,-0.84,2.34,0.44,0.84,12,false);                             /* bas de caisse et pare-chocs */
  /* habitacle : toit et vitrage incliné */
  const x0=-1.55,x1=1.05,t0=-1.10,t1=0.50,y0=0.90,y1=1.44,w=0.82,wt=0.72,P=(x,y,z)=>g.P(X(x),y,B+z),N=(x,y,z)=>norm(g.N(dr*x,y,z));
  bx(t0,y1-0.05,-wt,t1,y1,wt,pc,false);
  g.flat(P(x1,y0,-w),P(x1,y0,w),P(t1,y1,wt),P(t1,y1,-wt),N(0.73,0.68,0),47);
  g.flat(P(x0,y0,-w),P(x0,y0,w),P(t0,y1,wt),P(t0,y1,-wt),N(-0.73,0.68,0),47);
  for(const sg of[-1,1])g.flat(P(x0,y0,sg*w),P(x1,y0,sg*w),P(t1,y1,sg*wt),P(t0,y1,sg*wt),N(0,0.2,sg),47);
  g.solid(Math.min(X(x0),X(x1)),0.9,B-w,Math.max(X(x0),X(x1)),1.44,B+w);
  for(const sa of[-1.36,1.36])for(const sb of[-0.84,0.84]){EL(sa,0.33,sb,0.33,0.33,0.115,12,ICO2);EL(sa,0.33,sb*1.06,0.17,0.17,0.07,50,ICO1);}
  for(const sb of[-0.56,0.56]){bx(2.33,0.60,sb-0.17,2.39,0.76,sb+0.17,0,false);bx(-2.33,0.62,sb-0.19,-2.28,0.76,sb+0.19,48,false);}
  g.m=m
}
function officeTower(g,r){ /* une tour immense : hall, ascenseur, un plateau de bureaux tout en haut, le toit */
  const W=20,H=150+Math.floor(r()*5)*24,FY=H-48,t=0.6;g.m=SYM[0];
  g.top(-W,-W,W,W,0.03,54);
  /* la coque : pleine, sauf la porte du hall et la baie panoramique de l'étage */
  for(const sym of[0,2,4,5]){const m0=g.m;g.m=SYM[sym];
    if(sym===2){g.box(-W,0,W-t,-2.6,4.6,W,2);g.box(2.6,0,W-t,W,4.6,W,2);g.box(-2.6,3.2,W-t,2.6,4.6,W,2,false);}
    else g.box(-W,0,W-t,W,4.6,W,2);
    g.box(-W,4.6,W-t,W,FY+1.05,W,2);g.box(-W,FY+3.3,W-t,W,H,W,2);
    for(const a of[-W+0.5,-7,7,W-0.5])g.box(a-0.5,FY+1.05,W-t,a+0.5,FY+3.3,W,55,false);
    g.m=m0;}
  /* hall */
  g.box(-W,4.6,-W,W,5.1,W,55,false);g.box(-5,0,-2,5,1.1,-0.8,56);g.box(-5.2,1.1,-2.1,5.2,1.16,-0.7,55,false);
  for(let a=-14;a<=14;a+=7)for(let b=-14;b<=14;b+=7)g.box(a-0.9,4.5,b-0.4,a+0.9,4.6,b+0.4,17,false);
  for(const sa of[-1,1]){g.box(sa*2.2-0.3,0,W-4.4,sa*2.2+0.3,4.6,W-t,55);g.box(sa*13-0.4,0,sa*9-0.4,sa*13+0.4,4.6,sa*9+0.4,55);}
  g.box(-1.9,2.6,W-0.72,1.9,3.0,W-0.66,17,false);g.box(-1.3,0,W-0.68,1.3,2.5,W-0.62,12,false);
  /* plateau de bureaux */
  g.box(-W,FY-0.6,-W,W,FY,W,54);g.box(-W,FY+3.3,-W,W,FY+3.8,W,55,false);
  for(let a=-15;a<=15;a+=6)for(let b=-14;b<=10;b+=6){g.box(a-0.9,FY+3.2,b-0.35,a+0.9,FY+3.3,b+0.35,17,false);
    if(Math.abs(a)<3&&b>5)continue;
    g.box(a-1.3,FY,b-0.45,a+1.3,FY+0.74,b+0.45,56);g.box(a-0.34,FY+0.74,b-0.06,a+0.34,FY+1.14,b,r()<0.35?17:12,false);
    g.box(a-0.28,FY,b+0.75,a+0.28,FY+0.46,b+1.25,12,false);g.box(a-1.5,FY,b-0.55,a+1.5,FY+1.35,b-0.48,55);}
  for(const sa of[-1,1])g.box(sa*2.2-0.3,FY,W-4.4,sa*2.2+0.3,FY+3.3,W-t,55);
  g.box(-1.9,FY+2.6,W-0.72,1.9,FY+3.0,W-0.66,17,false);g.box(-1.3,FY,W-0.68,1.3,FY+2.5,W-0.62,12,false);
  g.item(-12+r()*24,FY+1.1,-16);
  /* toit */
  g.box(-W,H-0.6,-W,W,H,W,18);for(const sym of[0,2,4,5]){const m0=g.m;g.m=SYM[sym];g.box(-W,H,W-0.4,W,H+1.15,W,18);g.m=m0;}
  for(const sa of[-1,1])g.box(sa*2.2-0.15,H,W-1.2,sa*2.2+0.15,H+2.5,W-0.9,18);g.box(-2.6,H+2.5,W-3.6,2.6,H+2.7,W-0.4,18,false);g.box(-0.5,H+2.7,W-2.4,0.5,H+3.0,W-1.4,25,false);
  g.liftAt(0,W-2.2,[0.03,FY,H],0,-1);
  g.m=SYM[0];
}
function nightCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.top(-24,-24,24,24,0,22);
  if(T===6){officeTower(g,r);return;}
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
function playKit(g,k,r){ /* une structure, posée autour de l'origine courante */
  if(k===1){ /* tour : escalier d'un côté, descente de l'autre */
    for(const sa of[-1,1])for(const sb of[-1,1])g.box(sa*2-0.12,0,sb*2-0.12,sa*2+0.12,5.2,sb*2+0.12,37);
    g.box(-2.2,2.8,-2.2,2.2,3,2.2,36);g.box(-2.5,5.2,-2.5,2.5,5.45,2.5,34,false);
    for(let q=0;q<12;q++)g.box(-5.8+q*0.3,(q+1)*0.25-0.14,-0.7,-5.5+q*0.3,(q+1)*0.25,0.7,35);
    for(let q=0;q<29;q++)g.box(2.2+q*0.22,2.9-(q+1)*0.1-0.12,-0.6,2.42+q*0.22,2.9-(q+1)*0.1,0.6,34);
    for(const sb of[-1,1])g.box(2.2,1.6,sb*0.66-0.04,8.6,1.75,sb*0.66+0.04,37,false);
    g.item(0,4.1,0);g.nog(-6.2,-2.6,9,2.6);
  }else if(k===2){ /* plateformes à gravir, en lacet : chaque saut est court */
    let la=0,lb=0,ly=0;
    for(let q=0;q<9;q++){const row=Math.floor(q/3),col=row%2?2-q%3:q%3,a=-3.4+col*3.4,b=-3.4+row*3.4,y=0.6+q*0.55;
      g.box(a-1,y-0.15,b-1,a+1,y,b+1,34+q%4);g.box(a-0.08,0,b-0.08,a+0.08,y-0.15,b+0.08,12,false);la=a;lb=b;ly=y;}
    g.item(la,ly+1.2,lb);g.nog(-4.6,-4.6,4.6,4.6);
  }else if(k===3){ /* balançoires qui balancent, bac à sable */
    for(const sa of[-3,3]){g.box(sa-0.1,0,-0.1,sa+0.1,3,0.1,37);g.box(sa-0.08,0,-1.3,sa+0.08,0.08,1.3,37,false);}
    g.box(-3,2.9,-0.08,3,3.05,0.08,37,false);g.swingAt(-1.3,2.95,0);g.swingAt(1.3,2.95,0);
    g.box(5.5,0,-3.5,12.5,0.28,-3.2,36);g.box(5.5,0,3.2,12.5,0.28,3.5,36);g.box(5.5,0,-3.2,5.8,0.28,3.2,36);g.box(12.2,0,-3.2,12.5,0.28,3.2,36);
    g.top(5.8,-3.2,12.2,3.2,0.14,19);g.nog(5.5,-3.5,12.5,3.5);g.nog(-3.4,-1.6,3.4,1.6);g.item(9,1.1,0);
  }else if(k===4){ /* tremplins en chaîne */
    g.pad(-6,0,12);g.box(-3.8,3.3,-1.8,-0.2,3.5,1.8,35);g.box(-2.1,0,-0.1,-1.9,3.3,0.1,12,false);
    g.pad(-2,0,13.6,3.5);g.box(1.6,7.6,-2,5.8,7.8,2,34);g.box(3.6,0,-0.1,3.8,7.6,0.1,12,false);g.item(3.7,8.9,0);
  }else{ /* banc et réverbère */
    g.box(-1.2,0,-0.25,1.2,0.45,0.25,36);g.box(2.2,0,-0.06,2.32,3.4,0.06,12,false);g.sphere(2.26,3.6,0,0.28,17,ICO2);g.nog(-1.4,-0.5,2.6,0.5);
    if(r()<0.6)g.item(0,1.5,0);
  }
}
function toy(G0,r){ /* jouets géants : rares, immenses (deux fois plus grands qu'avant) */
  const S=2.1,g={ /* même interface que Geo, toutes les mesures multipliées par S */
    box:(x0,y0,z0,x1,y1,z1,m,s)=>G0.box(x0*S,y0*S,z0*S,x1*S,y1*S,z1*S,m,s),cyl:(a,b,R,y0,y1,m,s,n)=>G0.cyl(a*S,b*S,R*S,y0*S,y1*S,m,s,n),
    ell:(a,y,b,ra,ry,rb,m,ic)=>G0.ell(a*S,y*S,b*S,ra*S,ry*S,rb*S,m,ic),sphere:(a,y,b,R,m,ic,e)=>G0.sphere(a*S,y*S,b*S,R*S,m,ic,e),
    solid:(x0,y0,z0,x1,y1,z1)=>G0.solid(x0*S,y0*S,z0*S,x1*S,y1*S,z1*S),nog:(a0,b0,a1,b1)=>G0.nog(a0*S,b0*S,a1*S,b1*S)};
  const k=Math.floor(r()*3);G0.m=SYM[Math.floor(r()*4)]; /* symétries sans échange d'axes : les ellipsoïdes gardent leur sens */
  if(k===0){ /* briques emboîtables */
    const brick=(a,y,b,la,lb,h,mt)=>{g.box(a-la,y,b-lb,a+la,y+h,b+lb,mt);
      for(let u=-la+2;u<la;u+=4)for(let v=-lb+2;v<lb;v+=4)g.cyl(a+u,b+v,1.25,y+h,y+h+0.9,mt,false,14);};
    brick(-4,0,0,8,4,4.8,48);brick(2,4.8,0,4,4,4.8,36);brick(10,0,9,4,4,4.8,49);g.nog(-13,-5,15,14);
  }else if(k===1){ /* ours en peluche assis */
    g.ell(0,7,0,7.5,8,6.5,41,ICO3);g.ell(0,18.5,0.5,5.6,5.2,5.2,41,ICO3);g.ell(0,17.4,5.0,2.6,2.0,2.0,36,ICO2);g.ell(0,18.0,6.9,0.8,0.6,0.5,28,ICO2);
    for(const s of[-1,1]){g.ell(s*4.3,22.6,0,1.9,1.9,1.0,41,ICO2);g.ell(s*2.0,19.8,4.9,0.55,0.6,0.4,28,ICO1);
      g.ell(s*8.2,10,1.5,2.4,5.2,2.6,41,ICO2);g.ell(s*5.0,2.2,7.5,2.8,2.6,5.2,41,ICO2);g.ell(s*5.0,2.6,12.2,2.2,2.2,0.7,36,ICO2);}
    g.solid(-6,0,-5,6,14,5);g.solid(-7.5,0,3,7.5,4.4,12.5);g.nog(-9,-7,9,13);
  }else{ /* quilles et boule */
    for(const q of[[0,0],[5.5,3],[-5,4.5]]){const a=q[0],b=q[1];
      g.ell(a,5,b,2.3,5,2.3,0,ICO3);g.ell(a,10.6,b,1.05,2.6,1.05,0,ICO2);g.ell(a,13.2,b,1.45,1.6,1.45,0,ICO2);g.cyl(a,b,1.2,9.3,9.8,48,false,16);g.cyl(a,b,1.12,10.3,10.7,48,false,16);
      g.solid(a-1.7,0,b-1.7,a+1.7,9,b+1.7);}
    g.sphere(-11,3.2,-6,3.2,49,ICO3);g.solid(-13.2,0,-8.2,-8.8,5.4,-3.8);g.nog(-15,-9,8,7);
  }
}
function playCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.top(-24,-24,24,24,0,9);g.grass(-24,-24,24,24,0,4.6,0.05);
  if(T===T_FOOT)return;
  if(T===T_DOOR){sDoor(g);g.nog(-1.5,-1.5,1.5,1.5);return;}
  if(T===8){sAsc(g,24,i,j,37,34);g.nog(-6,-6,6,6);return;}
  if(T===5){ /* pré : tour de piste contre la montre */
    const R=13,pts=[];for(let q=0;q<12;q++){const t=q/12*4,k=Math.floor(t),u=(t-k)*2-1,p=[[u*R,-R],[R,u*R],[-u*R,R],[-R,-u*R]][k];pts.push([p[0],q%3===2?2.6:1.1,p[1]]);}
    g.courseSet(0,0,pts,7+8*R/5.0);g.nog(-1,-1,1,1);g.grass(-10,-10,10,10,0,3,0.5);return;
  }
  /* rien n'est aligné : chaque structure est décalée et tournée au hasard, certaines cases en ont deux, d'autres rien */
  const ox=g.ox,oz=g.oz;
  if(T===9){g.ox=ox+(r()-0.5)*4;g.oz=oz+(r()-0.5)*4;toy(g,r);g.ox=ox;g.oz=oz;g.m=SYM[0];return;}
  const n=T===6?(r()<0.5?1:0):(r()<0.3?2:1),sx=r()<0.5?-1:1,sz=r()<0.5?-1:1;
  for(let s=0;s<n;s++){
    const k=T===6?6:s===0?T:1+Math.floor(r()*4),sp=n>1?9+r()*5:r()*13;
    g.ox=ox+(s?-sx:sx)*sp*(0.4+r()*0.6);g.oz=oz+(s?-sz:sz)*sp*(0.4+r()*0.6);g.m=SYM[Math.floor(r()*8)];
    playKit(g,k,r);
  }
  g.ox=ox;g.oz=oz;g.m=SYM[0];
}

/* ====== Lotissement : des pavillons presque identiques, sur un anneau qui se referme au-dessus de vous ====== */
function gable(g,a0,b0,a1,b1,y,rise,mat,wm){ /* toit à deux pentes, faîte le long de a */
  const bm=(b0+b1)/2,run=(b1-b0)/2,P=(a,yy,b)=>g.P(a,yy,b);
  g.flat(P(a0,y,b0),P(a1,y,b0),P(a1,y+rise,bm),P(a0,y+rise,bm),norm(g.N(0,run,-rise)),mat);
  g.flat(P(a0,y,b1),P(a1,y,b1),P(a1,y+rise,bm),P(a0,y+rise,bm),norm(g.N(0,run,rise)),mat);
  g.flat(P(a0+0.4,y,b0+0.4),P(a0+0.4,y,b1-0.4),P(a0+0.4,y+rise*0.93,bm),P(a0+0.4,y+rise*0.93,bm),g.N(-1,0,0),wm);
  g.flat(P(a1-0.4,y,b0+0.4),P(a1-0.4,y,b1-0.4),P(a1-0.4,y+rise*0.93,bm),P(a1-0.4,y+rise*0.93,bm),g.N(1,0,0),wm);
  g.flat(P(a0,y-0.04,b0),P(a1,y-0.04,b0),P(a1,y-0.04,b1),P(a0,y-0.04,b1),[0,-1,0],0);
}
function houseCell(g,c,i,j,r){
  const T=c.type,row=mod(j,3);g.m=SYM[0];
  /* le sol est découpé en bandes étroites pour épouser la courbure de l'anneau */
  for(let k=0;k<12;k++){const a0=-24+k*4;g.top(a0,-24,a0+4,24,0,9);}
  if(row===0){ /* la rue */
    for(let k=0;k<12;k++){const a0=-24+k*4;g.top(a0,-4,a0+4,4,0.02,22);g.box(a0,0,4,a0+4,0.14,6.2,19);g.box(a0,0,-6.2,a0+4,0.14,-4,19);
      if(k%2===0)g.top(a0+1,-0.08,a0+3,0.08,0.03,0);}
    g.grass(-24,6.2,24,24,0,4.5,0.02);g.grass(-24,-24,24,-6.2,0,4.5,0.02);
    if(T===T_DOOR){sDoor(g);return;}
    if(r()<0.55)car(g,-12+r()*24,2.9,true,r);if(r()<0.3)car(g,-12+r()*24,-2.9,true,r);
    for(const sb of[-1,1]){if(r()<0.5)continue;const a=-18+r()*36;g.box(a-0.06,0.14,sb*6.6-0.06,a+0.06,4.6,sb*6.6+0.06,12,false);g.box(a-0.06,4.5,Math.min(sb*6.6,sb*5.2),a+0.06,4.6,Math.max(sb*6.6,sb*5.2),12,false);g.box(a-0.16,4.42,sb*5.2-0.3,a+0.16,4.5,sb*5.2+0.3,0,false);}
    if(r()<0.35)g.npc(-20,0.14,5.1,0,20,5.1);
    return;
  }
  g.grass(-24,-24,24,24,0,4.5,0.03);
  g.m=row===1?SYM[0]:SYM[2]; /* −b local = côté rue */
  const house=(ac,S)=>{ /* S : échelle. À 3,6 la maison écrase la rue */
    const hw=(4.3+r()*1.2)*S,hd=(3.6+r()*1.0)*S,two=r()<0.45,H=(two?5.4:2.8)*S,wm=42+Math.floor(r()*4),bc=S>1?5:3,f=bc-hd,bk=bc+hd,gs=r()<0.5?-1:1;
    g.box(ac-hw,0,f,ac+hw,H,bk,wm);gable(g,ac-hw-0.4*S,f-0.4*S,ac+hw+0.4*S,bk+0.4*S,H,(1.9+r()*0.8)*S,46,wm);
    const dx=ac-gs*hw*0.35;
    g.box(dx-0.62*S,0,f-0.03,dx+0.62*S,2.22*S,f,0,false);g.box(dx-0.5*S,0,f-0.07,dx+0.5*S,2.1*S,f,47,false);g.box(dx-0.95*S,0,f-1.2*S,dx+0.95*S,0.16*S,f,19);g.hdoor(dx,f-0.45);
    const win=(x,y)=>{g.box(x-0.72*S,y-0.08*S,f-0.03,x+0.72*S,y+1.28*S,f,0,false);g.box(x-0.62*S,y,f-0.06,x+0.62*S,y+1.2*S,f,47,false);g.box(x-0.03*S,y,f-0.08,x+0.03*S,y+1.2*S,f,0,false);};
    win(ac+gs*hw*0.45,0.95*S);if(two){win(ac-hw*0.5,3.6*S);win(ac+hw*0.5,3.6*S);}
    for(const sd of[-1,1]){const x=ac+sd*hw;g.box(Math.min(x,x+sd*0.05),1.0*S,bc-0.6*S,Math.max(x,x+sd*0.05),2.1*S,bc+0.6*S,47,false);}
    if(S>1){g.top(dx-0.5*S,-24,dx+0.5*S,f-1.2*S,0.02,19);g.nog(ac-hw-1,f-1.2*S,ac+hw+1,bk+1);g.nog(dx-0.5*S,-24,dx+0.5*S,f-1.2*S);return;}
    /* garage, allée, boîte aux lettres, clôture du fond */
    const g0=ac+gs*hw,g1=ac+gs*(hw+3.3),ga=Math.min(g0,g1),gb=Math.max(g0,g1);
    g.box(ga,0,f+0.5,gb,2.5,bk-0.8,wm);g.box(ga-0.15,2.5,f+0.3,gb+0.15,2.66,bk-0.6,0,false);g.box(ga+0.35,0,f+0.44,gb-0.35,2.1,f+0.5,1,false);
    g.top(ga+0.3,-24,gb-0.3,f+0.5,0.02,19);g.top(dx-0.5,-24,dx+0.5,f-1.2,0.02,19);
    g.box(dx+1.5,0,-22.6,dx+1.58,1.05,-22.52,12,false);g.box(dx+1.36,1.05,-22.75,dx+1.72,1.3,-22.37,gs>0?48:49,false);
    for(let k=0;k<6;k++)g.box(ac-12+k*4,0,21,ac-8+k*4,1.15,21.08,0);
    if(r()<0.6)tree(g,ac+(r()-0.5)*14,13+r()*5,r,1);
    g.nog(Math.min(ac-hw,ga)-0.5,f-1.3,Math.max(ac+hw,gb)+0.5,bk+0.5);g.nog(ga+0.3,-24,gb-0.3,f+0.5);g.nog(dx-0.5,-24,dx+0.5,f-1.2);
  };
  if(hash(i,j,95)<0.07)house(0,3.6);else{house(-12,1);house(12,1);}
  g.item(-12+(r()<0.5?0:24)+(r()-0.5)*6,1.1,14+r()*4);if(r()<0.3)g.item(r()<0.5?-12:12,6.9,3);
  if(r()<0.22)g.npc((r()-0.5)*30,0,-14-r()*6,r()*6.28);
  g.m=SYM[0];
}

/* =====================================================================
   CHAPITRE 2 — matériaux : 57 papier peint et portes d'hôtel · 58 moquette rouge · 59 sol clair poli · 60 rayonnage garni
   61 panneau d'affichage · 62 sable · 63 parquet géant · 64 tapis roulant · 65 cabine rayée · 66 couverture · 67 papier peint nu
   ===================================================================== */

/* ====== Hôtel : couloirs sur une trame de 24 m, des portes à l'infini ====== */
function phoneAt(g,a,y,b){ /* un vieux téléphone rouge ; il sonnera peut-être */
  g.box(a-0.13,y,b-0.1,a+0.13,y+0.08,b+0.1,12,false);g.box(a-0.15,y+0.08,b-0.035,a+0.15,y+0.13,b+0.035,48,false);g.phone(a,y+0.1,b);
}
function hotelCell(g,c,i,j,r){
  const T=c.type===T_DOOR?4:c.type,H=2.8,lob=T===2||T===3;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,58);
  if(lob){g.box(-24,H,-24,24,H+0.4,-13.2,0,false);g.box(-24,H,13.2,24,H+0.4,24,0,false);g.box(-24,H,-13.2,-13.2,H+0.4,13.2,0,false);g.box(13.2,H,-13.2,24,H+0.4,13.2,0,false);}
  else g.box(-24,H,-24,24,H+0.4,24,0,false);
  for(const s of[-1,1]){const e0=s>0?13.2:-24,e1=s>0?24:-13.2;
    g.box(e0,0,-10.8,e1,H,10.8,57);g.box(-10.8,0,e0,10.8,H,e1,57);
    for(const q of[-1,1])g.box(e0,0,q>0?13.2:-24,e1,H,q>0?24:-13.2,57);}
  const plant=(a,b)=>{g.cyl(a,b,0.28,0,0.55,41,true,10);g.sphere(a,1.25,b,0.62,15,ICO1,1.25);};
  const sofa=(a,b,L)=>{g.box(a-L,0,b-0.45,a+L,0.42,b+0.45,16);g.box(a-L,0.42,b+0.25,a+L,0.9,b+0.45,16,false);};
  /* habillage d'un mur de couloir : appliques, tableaux, corniche, consoles. Le plan est x=X (az) ou z=X, tourné vers n */
  const B=(az,u0,u1,y0,y1,d0,d1,m,s)=>az?g.box(d0,y0,u0,d1,y1,u1,m,s):g.box(u0,y0,d0,u1,y1,d1,m,s);
  const wallDeco=(az,X,n,u0,u1)=>{
    const D=(d0,d1)=>[Math.min(X+n*d0,X+n*d1),Math.max(X+n*d0,X+n*d1)];
    {const d=D(0,0.07);B(az,u0,u1,H-0.16,H,d[0],d[1],41,false);}
    for(let u=Math.ceil((u0-4)/8)*8+4;u<=u1-0.6;u+=8){if(u<u0+0.6)continue;const d=D(0,0.1);
      B(az,u-0.09,u+0.09,1.8,2.0,d[0],d[1],41,false);const e=D(0.1,0.2);B(az,u-0.12,u+0.12,1.95,2.2,e[0],e[1],25,false);}
    for(let u=Math.ceil(u0/8)*8;u<=u1-0.9;u+=8){if(u<u0+0.9)continue;const k=r();
      if(k<0.45){const d=D(0,0.05),e=D(0.05,0.07);B(az,u-0.55,u+0.55,1.15,1.95,d[0],d[1],41,false);B(az,u-0.45,u+0.45,1.25,1.85,e[0],e[1],[47,34,36,16,49][Math.floor(r()*5)],false);}
      else if(k<0.62){const d=D(0,0.42);B(az,u-0.7,u+0.7,0.8,0.86,d[0],d[1],41);B(az,u-0.62,u+0.62,0,0.8,d[0],d[1],41,false);
        const m=D(0.21,0.21)[0];if(r()<0.5){if(az)phoneAt(g,m,0.86,u-0.3);else phoneAt(g,u-0.3,0.86,m);}
        if(az)g.sphere(m,1.05,u+0.35,0.16,34+Math.floor(r()*4),ICO1,1.3);else g.sphere(u+0.35,1.05,m,0.16,34+Math.floor(r()*4),ICO1,1.3);}
      else if(k<0.7){const m=D(0.5,0.5)[0];if(az){g.box(m-0.25,0,u-0.3,m+0.25,0.1,u+0.3,50,false);g.sphere(m,0.1,u,0.2,50,ICO1,0.6);}else{g.box(u-0.3,0,m-0.25,u+0.3,0.1,m+0.25,50,false);g.sphere(u,0.1,m,0.2,50,ICO1,0.6);}}
    }};
  const segs=[[-24,-13.2],[13.2,24]],mid=[-10.8,10.8];
  for(const s of[-1,1])for(const az of[true,false]){
    for(const sg of[...segs,mid])wallDeco(az,s*13.2,-s,sg[0],sg[1]);
    for(const sg of segs)wallDeco(az,s*10.8,s,sg[0],sg[1]);
    if(T===1)wallDeco(az,s*10.8,s,mid[0],mid[1]);}
  if(T===1){g.box(-10.8,0,-10.8,10.8,H,10.8,57);
    {const u=-22+r()*44,s=r()<0.5?-12:12;if(r()<0.5)g.item(u,1.1,s);else g.item(s,1.1,u);}
    if(r()<0.5){const b=-8+r()*16;g.box(11.25,0,b-0.4,11.75,0.95,b+0.4,50);g.box(11.2,0.95,b-0.45,11.8,1.0,b+0.45,0,false);}
    if(r()<0.35)g.npc(-12,0,-20,0,-12,20);if(r()<0.14)g.watchAt(12,r()<0.5?-22:22);
  }else if(T===4){ /* palier d'ascenseur : portes dorées, un cadran qui égrène les étages */
    g.box(-10.8,0,-10.8,-1.4,H,10.8,57);g.box(1.4,0,-10.8,10.8,H,10.8,57);g.box(-1.4,0,-8.4,1.4,H,10.8,57);
    g.box(-1.4,0,-10.8,-1.34,H,-8.4,50,false);g.box(1.34,0,-10.8,1.4,H,-8.4,50,false);g.box(-1.34,0,-8.46,1.34,2.3,-8.4,17,false);
    g.box(-1.4,2.3,-10.86,1.4,H,-10.8,50,false);g.top(-1.34,-10.8,1.34,-8.46,0.01,50);
    for(const s of[-1,1])g.box(s*1.5-0.06,0,-10.9,s*1.5+0.06,2.36,-10.8,25,false);g.box(-1.56,2.3,-10.92,1.56,2.38,-10.8,25,false);
    g.box(-0.7,2.42,-10.9,0.7,2.7,-10.86,61,false);g.box(1.75,1.1,-10.86,1.9,1.4,-10.82,25,false);
    g.top(-1.3,-13.2,1.3,-10.8,0.012,16);g.hdoor(0,-9.5);plant(-2.4,-11.4);plant(2.4,-11.4);
    g.box(-3.8,0,-10.8,-2.9,0.82,-10.42,41);phoneAt(g,-3.35,0.82,-10.6);
    if(c.type!==T_DOOR){const u=-22+r()*44;g.item(12,1.1,u);}
  }else if(T===3){ /* le puits : vingt étages de coursives au-dessus de vous */
    const HH=67.2;
    for(const s of[-1,1]){g.box(s*13.2,H+0.4,-13.6,s*13.6,HH,13.6,57,false);g.box(-13.2,H+0.4,s*13.2,13.2,HH,s*13.6,57,false);}
    for(let k=1;k<21;k++){const y=3.2*k,m=k%5===0?25:0;
      for(const s of[-1,1]){g.box(s*11.7,y-0.25,-13.2,s*13.2,y,13.2,m,false);g.box(-11.7,y-0.25,s*11.7,11.7,y,s*13.2,m,false);
        g.box(s*11.7-0.04,y,-11.7,s*11.7+0.04,y+0.9,11.7,41,false);g.box(-11.7,y,s*11.7-0.04,11.7,y+0.9,s*11.7+0.04,41,false);}}
    g.box(-13.2,HH,-13.2,13.2,HH+0.3,13.2,17,false);
    g.cyl(0,0,0.07,22,HH,12,false,6);for(let k=0;k<5;k++)g.gem(0,21-k*1.9,0,3.2-k*0.6,24,ICO1);g.sphere(0,12.4,0,0.7,25,ICO2);
    g.cyl(0,0,3.2,0,0.5,0,true,24);g.cyl(0,0,2.9,0.5,0.56,3,false,24);g.item(0,1.7,0);
    for(const s of[-1,1])sofa(s*7,0,2.2);plant(-9,-9);plant(9,9);if(r()<0.6)g.npc(6,0,6,r()*6.28);
    g.box(-7.5,0,-7.5,-6.5,0.7,-6.5,41);phoneAt(g,-7,0.7,-7);
  }else{ /* le grand salon : un lustre, la réception, quelqu'un derrière le comptoir */
    const HL=8.4;
    for(const s of[-1,1]){g.box(s*10.8,H+0.4,-10.8,s*11.2,HL,10.8,57,false);g.box(-10.8,H+0.4,s*10.8,10.8,HL,s*11.2,57,false);}
    g.box(-11.2,HL,-11.2,11.2,HL+0.3,11.2,0,false);
    for(const s of[-1,1]){g.box(s*9.4,H+0.2,-10.8,s*10.8,H+0.45,10.8,41,false);g.box(-10.8,H+0.2,s*9.4,10.8,H+0.45,s*10.8,41,false);
      g.box(s*9.4-0.04,H+0.45,-9.4,s*9.4+0.04,H+1.4,9.4,41,false);g.box(-9.4,H+0.45,s*9.4-0.04,9.4,H+1.4,s*9.4+0.04,41,false);}
    for(const a of[-6,6])for(const b of[-6,6])g.box(a-0.3,0,b-0.3,a+0.3,HL,b+0.3,67);
    g.cyl(0,0,0.03,6.6,HL,12,false,6);
    for(let k=0;k<3;k++){const R=1.7-k*0.5,y=6.6-k*0.55;for(let q=0;q<10+k*-3;q++){const t=q/(10-k*3)*6.283;g.sphere(Math.cos(t)*R,y,Math.sin(t)*R,0.09,25,ICO1);g.gem(Math.cos(t)*R,y-0.3,Math.sin(t)*R,0.08,24,ICO1,2.2);}}
    g.gem(0,5.1,0,0.35,24,ICO1,2.2);
    g.box(-4,0,-1.2,4,1.1,-0.4,41);g.box(-4.2,1.1,-1.3,4.2,1.16,-0.3,0,false);g.box(-0.1,1.16,-0.9,0.1,1.3,-0.7,25,false);
    phoneAt(g,2.6,1.16,-0.8);for(let k=0;k<12;k++)g.box(-3.6+k*0.6-0.04,1.6,-2.95,-3.6+k*0.6+0.04,1.75,-2.9,25,false);g.box(-3.8,1.2,-3.0,3.8,2.2,-2.95,41,false);
    sofa(0,8.4,3);sofa(-8.5,3,1.6);plant(-9.6,-9.6);plant(9.6,-9.6);g.top(-5,3,5,7.6,0.012,16);
    {const a=7.5,b=5;for(const s of[-1,1])g.box(a+s*0.5-0.03,0,b-0.03,a+s*0.5+0.03,1.9,b+0.03,25,false);g.box(a-0.55,1.85,b-0.05,a+0.55,1.92,b+0.05,25,false);
      g.box(a-0.6,0.1,b-0.4,a+0.6,0.16,b+0.4,58,false);g.box(a-0.35,0.16,b-0.25,a+0.15,0.75,b+0.2,48,false);g.box(a+0.1,0.16,b-0.2,a+0.45,0.5,b+0.25,49,false);}
    g.npc(0,0,-2.6,0);g.item(8,1.1,-4);g.item(-8,1.1,-6);
  }
}

/* ====== Hôpital : couloirs de nuit, chambres communes, un lit vide quelque part ====== */
function hbed(g,a,bh,dir,r,empty){ /* lit médicalisé : tête en bh, pieds vers dir (±1 en b) */
  const Z=(u,v,y0,y1,m,s,da)=>{da=da||0.5;g.box(a-da,y0,Math.min(u,v),a+da,y1,Math.max(u,v),m,s);},bf=bh+dir*2.1;
  Z(bh+dir*0.05,bf,0,0.3,50);Z(bh+dir*0.08,bf-dir*0.03,0.3,0.48,0,true,0.47);
  Z(bh+dir*0.55,bf-dir*0.02,0.48,0.52,66,false,0.49);g.ell(a,0.56,bh+dir*0.32,0.34,0.07,0.17,0,ICO1);
  Z(bh,bh+dir*0.06,0,1.05,50,false,0.52);Z(bf-dir*0.05,bf,0,0.82,50,false,0.52);
  for(const s of[-1,1])g.box(a+s*0.5-0.02,0.55,Math.min(bh+dir*0.4,bh+dir*1.3),a+s*0.5+0.02,0.72,Math.max(bh+dir*0.4,bh+dir*1.3),50,false);
  if(empty){g.hdoor(a,bh+dir*1.05);Z(bh+dir*0.02,bh+dir*0.08,1.55,1.72,17,false,0.32);}else g.ell(a,0.6,bh+dir*1.15,0.3,0.13,0.7,66,ICO2);
  const px=a+0.85,pz=bh+dir*0.35;g.cyl(px,pz,0.022,0,1.95,50,false,6);g.box(px-0.08,1.55,pz-0.03,px+0.08,1.82,pz+0.03,13,false);
  g.box(a-1.25,0,pz-0.28,a-0.7,0.75,pz+0.28,0);g.box(a-1.2,0.75,pz-0.05,a-0.75,1.05,pz+0.05,12,false);g.box(a-1.17,0.79,pz+dir*0.06-0.005,a-0.78,1.01,pz+dir*0.06+0.005,29,false);
  if(r()<0.6){const cz=bf+dir*0.6,cx=a+0.9;g.box(cx-0.24,0,cz-0.24,cx+0.24,0.45,cz+0.24,16);g.box(cx-0.24,0.45,cz-0.24,cx+0.24,0.95,cz-0.18,16,false);}
}
/* accessoires d'hôpital, posés le long d'un mur : u le long du mur, w la distance au centre du couloir, s le côté */
function hprop(g,az,u,w,k,r){ /* az : couloir le long de a (b=w) ; sinon le long de b (a=w) */
  const B=(u0,u1,y0,y1,w0,w1,m,s)=>az?g.box(u0,y0,Math.min(w0,w1),u1,y1,Math.max(w0,w1),m,s):g.box(Math.min(w0,w1),y0,u0,Math.max(w0,w1),y1,u1,m,s);
  const sg=Math.sign(w)||1;
  if(k===0){ /* brancard, un drap froissé */
    B(u-1,u+1,0.62,0.74,w-sg*0.33,w+sg*0.33,50);B(u-0.95,u+0.95,0.74,0.8,w-sg*0.3,w+sg*0.3,0,false);
    for(const q of[-0.85,0.85])B(u+q-0.03,u+q+0.03,0,0.62,w-0.03,w+0.03,12,false);
    if(r()<0.5)B(u-0.3,u+0.6,0.8,0.86,w-sg*0.28,w+sg*0.2,66,false);
  }else if(k===1){ /* fauteuil roulant */
    B(u-0.25,u+0.25,0.45,0.52,w-0.25,w+0.25,12);B(u-0.25,u+0.25,0.52,0.95,w+sg*0.2,w+sg*0.26,12,false);
    for(const q of[-1,1]){const p=az?[u,0.33,w+q*0.3]:[w+q*0.3,0.33,u];g.ell(p[0],p[1],p[2],az?0.33:0.03,0.33,az?0.03:0.33,50,ICO2);}
  }else if(k===2){ /* banc de trois sièges */
    for(let q=-1;q<=1;q++){B(u+q*0.55-0.25,u+q*0.55+0.25,0.42,0.48,w-0.25,w+0.25,16);B(u+q*0.55-0.25,u+q*0.55+0.25,0.48,0.9,w+sg*0.2,w+sg*0.25,16,false);}
    B(u-0.8,u+0.8,0.36,0.42,w-0.04,w+0.04,12,false);
  }else if(k===3){ /* chariot de soins, tiroirs de couleur */
    B(u-0.4,u+0.4,0.12,0.95,w-0.28,w+0.28,0);for(let q=0;q<4;q++)B(u-0.38,u+0.38,0.2+q*0.19,0.34+q*0.19,w-sg*0.29,w-sg*0.27,[16,36,34,35][q],false);
    B(u-0.15,u+0.15,0.95,1.05,w-0.1,w+0.1,13,false);
  }else if(k===4){ /* plante en pot, extincteur */
    g.cyl(az?u:w,az?w:u,0.25,0,0.5,41,true,10);g.sphere(az?u:w,1.1,az?w:u,0.5,15,ICO1,1.3);
    g.cyl(az?u+0.8:w+sg*0.3,az?w+sg*0.3:u+0.8,0.09,0.9,1.4,48,false,8);
  }else{ /* un fauteuil, des magazines */
    B(u-0.4,u+0.4,0,0.45,w-0.35,w+0.35,16);B(u-0.4,u+0.4,0.45,1.0,w+sg*0.25,w+sg*0.35,16,false);B(u+0.55,u+1.0,0,0.5,w-0.25,w+0.25,41);B(u+0.6,u+0.9,0.5,0.53,w-0.15,w+0.12,36,false);
  }
}
function hospitalCell(g,c,i,j,r){
  const T=c.type,H=3;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,59);
  if(T===3){hospHall(g,r);return;}
  g.box(-24,H,-24,24,H+0.4,24,32); /* plafond plein : on ne passe plus au travers */
  const dark=T===5,lamp=(a0,b0,a1,b1)=>g.box(a0,H-0.05,b0,a1,H,b1,(dark||r()<0.16)?12:17,false);
  for(let k=-24;k<=24;k+=6){if(k===0)continue;lamp(k-0.6,-0.3,k+0.6,0.3);lamp(-0.3,k-0.6,0.3,k+0.6);}
  g.box(-0.55,2.45,-0.05,0.55,2.75,0.05,29,false);g.box(-0.02,2.75,-0.02,0.02,H,0.02,12,false);
  const wall=(alongA,u0,u1,w,gc)=>{const B=(p0,y0,p1,y1,m,s)=>alongA?g.box(Math.min(p0,p1),y0,w-0.1,Math.max(p0,p1),y1,w+0.1,m,s):g.box(w-0.1,y0,Math.min(p0,p1),w+0.1,y1,Math.max(p0,p1),m,s);
    const lo=Math.min(u0,u1),hi=Math.max(u0,u1);
    if(gc===undefined){B(lo,0,hi,H,0);return;}
    B(lo,0,gc-0.75,H,0);B(gc+0.75,0,hi,H,0);B(gc-0.75,2.2,gc+0.75,H,0,false);B(gc-0.8,0,gc-0.75,2.2,50,false);B(gc+0.75,0,gc+0.8,2.2,50,false);};
  /* fausse porte fermée sur un mur de couloir, avec son hublot et son numéro */
  const fdoor=(az,u,w)=>{const s=Math.sign(w),f=w-s*0.1,B=(u0,u1,y0,y1,d,m)=>az?g.box(u0,y0,Math.min(f,f-s*d),u1,y1,Math.max(f,f-s*d),m,false):g.box(Math.min(f,f-s*d),y0,u0,Math.max(f,f-s*d),y1,u1,m,false);
    B(u-0.62,u+0.62,0,2.15,0.03,50);B(u-0.55,u+0.55,0,2.1,0.05,16);B(u-0.15,u+0.15,1.35,1.75,0.06,47);B(u+0.38,u+0.48,0.98,1.03,0.09,12);B(u-0.2,u+0.2,2.2,2.32,0.04,0);};
  const kinds=[];for(let q=0;q<4;q++){const x=r();
    kinds.push(T===2&&q===0?'wait':T===4&&q===1?'bloc':T===4&&q===2?'stock':T===6&&q===3?'kids':x<0.1?'stock':x<0.24?'office':'ward');}
  let q=0,noteQ=r()<0.6?Math.floor(r()*4):-1;
  for(const sa of[-1,1])for(const sb of[-1,1]){const kind=kinds[q],gc=sa*(6+Math.floor(r()*15)),hasNote=q===noteQ;q++;
    wall(true,sa*2,sa*24,sb*2.1,gc);wall(false,sb*2.1,sb*24,sa*2.1);wall(true,sa*2,sa*24,sb*23.9);wall(false,sb*2,sb*24,sa*23.9);
    /* main courante : interrompue à chaque porte, vraie ou close */
    const fd=[6,12,18].map(u=>sb*u+(r()-0.5));
    const rail=(alongA,u0,u1,w0,w1,gaps)=>{const lo=Math.min(u0,u1),hi=Math.max(u0,u1),cut=gaps.map(c=>[c-0.75,c+0.75]).sort((p,q)=>p[0]-q[0]);let s=lo;
      for(const [c0,c1] of cut.concat([[hi,hi]])){const e=Math.min(c0,hi);if(e-s>0.1){if(alongA)g.box(s,0.86,Math.min(w0,w1),e,0.93,Math.max(w0,w1),16,false);else g.box(Math.min(w0,w1),0.86,s,Math.max(w0,w1),0.93,e,16,false);}s=Math.max(s,c1);}};
    rail(true,sa*2.2,sa*24,sb*1.92,sb*2,[gc]);rail(false,sb*2.2,sb*24,sa*1.92,sa*2,fd);
    /* couloir : portes closes, accessoires contre les murs */
    for(const u of fd)fdoor(false,u,sa*2.1);
    {const used=[gc];for(let k=0;k<2;k++){const u=sa*(4+r()*18);if(used.some(v=>Math.abs(v-u)<2.6))continue;used.push(u);if(r()<0.85)hprop(g,true,u,sb*1.45,Math.floor(r()*6),r);}}
    {const u=sb*(4+r()*18);if(r()<0.7)hprop(g,false,u,sa*1.45,Math.floor(r()*6),r);}
    for(const k of[6,12,18])for(const l of[6,12,18])lamp(sa*k-0.6,sb*l-0.6,sa*k+0.6,sb*l+0.6);
    g.box(Math.min(sa*23.78,sa*23.8),1.0,sb*5,Math.max(sa*23.78,sa*23.8),2.2,sb*9,47,false);
    if(kind==='ward'){ /* deux rangées de lits, des rideaux, une télévision ; un lit est vide parfois */
      const emptyK=Math.floor(r()*4),noteK=hasNote?Math.floor(r()*4):-1;
      wall(true,sa*2.1,sa*23.9,sb*13,sa*(7.7+5.4*Math.floor(r()*3)));
      for(let k=0;k<4;k++){const a=sa*(5+k*5.4);hbed(g,a,sb*23.75,-sb,r,dark?false:k===emptyK);
        if(k===noteK)g.note(a,0.95,sb*21.4);
        if(k<3&&r()<0.7)g.box(a+sa*2.7-0.02,0.25,Math.min(sb*23.7,sb*20.6),a+sa*2.7+0.02,2.45,Math.max(sb*23.7,sb*20.6),16,false);
        if(Math.abs(a-gc)>2.4&&r()<0.75)hbed(g,a,sb*2.25,sb,r,false);}
      g.box(Math.min(sa*3,sa*23),2.55,Math.min(sb*20.55,sb*20.6),Math.max(sa*3,sa*23),2.6,Math.max(sb*20.55,sb*20.6),50,false);
      {const a=sa*22.3,b=sb*16.8;g.box(Math.min(a,a+sa*1.5),0,b-1.3,Math.max(a,a+sa*1.5),1.9,b+1.3,41);}
      {const b=sb*8.5;g.box(Math.min(sa*2.2,sa*2.35),1.9,b-0.6,Math.max(sa*2.2,sa*2.35),2.5,b+0.6,47,false);}
      {const a=sa*12,b=sb*9;g.box(a-0.9,0.72,b-0.6,a+0.9,0.78,b+0.6,41);g.box(a-0.04,0,b-0.04,a+0.04,0.72,b+0.04,12,false);
        for(const s of[-1,1]){g.box(a+s*1.3-0.22,0,b-0.22,a+s*1.3+0.22,0.45,b+0.22,16);}g.sphere(a+0.3,0.95,b,0.14,13,ICO1,1.4);g.sphere(a+0.3,1.15,b,0.2,[34,36,35][Math.floor(r()*3)],ICO1);}
      if(r()<0.5)hprop(g,true,sa*17,sb*9,1,r);if(r()<0.5)hprop(g,true,sa*12,sb*17,r()<0.5?2:5,r);
      if(r()<0.55)g.item(sa*(5+Math.floor(r()*4)*5.4)+sa*2.7,1.1,sb*(15+r()*3));
    }else if(kind==='office'){ /* bureau des médecins : un négatoscope allumé, des dossiers partout */
      const a=sa*13,b=sb*13;g.box(a-1.4,0.74,b-0.7,a+1.4,0.8,b+0.7,41);g.box(a-1.35,0,b-0.65,a-1.25,0.74,b+0.65,41,false);g.box(a+1.25,0,b-0.65,a+1.35,0.74,b+0.65,41,false);
      g.box(a-0.35,0.8,b-0.4,a+0.25,1.2,b-0.32,12,false);g.box(a-0.3,0.84,b-0.38,a+0.2,1.16,b-0.36,29,false);
      for(let k=0;k<4;k++)g.box(a+0.5+k*0.04,0.8,b-0.1,a+0.8+k*0.04,0.84+k*0.03,b+0.3,[0,36,0,16][k],false);
      g.box(a-0.3,0,b+1.0,a+0.3,0.45,b+1.6,16);
      for(let k=0;k<4;k++)g.box(Math.min(sa*23.3,sa*23.8),0,sb*(4+k*1.1),Math.max(sa*23.3,sa*23.8),1.4,sb*(4+k*1.1)+sb*1,50);
      g.box(Math.min(sa*23.7,sa*23.75),1.5,sb*14,Math.max(sa*23.7,sa*23.75),2.2,sb*17,17,false);
      if(hasNote)g.note(a+0.5,0.95,b);else if(r()<0.5)g.item(a,1.4,b+3);
      if(r()<0.5)g.npc(a-2,0,b-2,r()*6.28);
    }else if(kind==='wait'){
      for(const l of[8,12,16])for(let k=0;k<7;k++){const a=sa*(6+k*1.1),b=sb*l;g.box(a-0.25,0.42,b-0.25,a+0.25,0.48,b+0.25,16);g.box(a-0.25,0.48,b+sb*0.2,a+0.25,0.9,b+sb*0.25,16,false);g.box(a-0.03,0,b-0.03,a+0.03,0.42,b+0.03,12,false);}
      g.box(Math.min(sa*16,sa*21),0,Math.min(sb*5,sb*6),Math.max(sa*16,sa*21),1.1,Math.max(sb*5,sb*6),41);g.box(Math.min(sa*17,sa*18),1.1,Math.min(sb*5.4,sb*5.5),Math.max(sa*17,sa*18),1.6,Math.max(sb*5.4,sb*5.5),29,false);
      g.box(Math.min(sa*21.5,sa*23.8),0,sb*18,Math.max(sa*21.5,sa*23.8),1.9,sb*18+sb*1.2,12);g.box(Math.min(sa*21.45,sa*21.5),0.6,sb*18.1,Math.max(sa*21.45,sa*21.5),1.8,sb*18+sb*1.1,17,false);
      {const b=sb*23.75;g.box(sa*8,1.6,Math.min(b,b-sb*0.06),sa*12,2.4,Math.max(b,b-sb*0.06),47,false);}
      hprop(g,true,sa*20,sb*12,4,r);g.npc(sa*18.5,0,sb*7.5,0);g.item(sa*10,1.1,sb*20);if(hasNote)g.note(sa*18.5,1.15,sb*5.5);
    }else if(kind==='bloc'){
      const a=sa*13,b=sb*13;g.box(a-0.4,0,b-1.1,a+0.4,0.85,b+1.1,50);g.box(a-0.45,0.85,b-1.15,a+0.45,0.92,b+1.15,16,false);
      g.cyl(a,b,0.85,2.2,2.32,17,false,24);g.cyl(a,b,0.9,2.32,2.4,50,false,24);g.box(a-0.04,2.4,b-0.04,a+0.04,H,b+0.04,50,false);
      if(sb>0)sinkRow(g,sa>0?6:-18,22.6,3);g.item(a,1.6,b);
      hprop(g,true,a+sa*2.5,b,3,r);g.cyl(a-sa*2,b+1.5,0.022,0,1.9,50,false,6);g.box(a-sa*2-0.3,1.3,b+1.2,a-sa*2+0.3,1.7,b+1.25,29,false);
      if(hasNote)g.note(a+sa*2.5,1.15,b);
    }else if(kind==='stock'){
      for(const l of[8,13,18]){g.box(Math.min(sa*5,sa*20),0,sb*l-0.3,Math.max(sa*5,sa*20),2.4,sb*l+0.3,50);
        for(let k=0;k<6;k++){if(r()<0.3)continue;const a=sa*(6+k*2.4);g.box(a-0.6,2.4,sb*l-0.28,a+0.6,2.4+0.3+r()*0.3,sb*l+0.28,41,false);}}
      for(let k=0;k<3;k++)hprop(g,true,sa*(7+k*5),sb*21.5,k%2?1:0,r);
      g.item(sa*12,1.1,sb*10.5);if(hasNote)g.note(sa*21.5,1.1,sb*10.5);
    }else{
      for(let k=0;k<3;k++){const a=sa*(8+k*5),b=sb*14;g.box(a-0.7,0,b-0.7,a+0.7,0.5,b+0.7,34+k);
        for(const d of[[-1,0],[1,0],[0,-1],[0,1]])g.box(a+d[0]*1.05-0.18,0,b+d[1]*1.05-0.18,a+d[0]*1.05+0.18,0.3,b+d[1]*1.05+0.18,35+(k+d[0]+3)%3,false);}
      for(let k=0;k<5;k++){const a=sa*(5+k*3.5);g.box(a-1.2,1.0,Math.min(sb*23.76,sb*23.78),a+1.2,2.2,Math.max(sb*23.76,sb*23.78),34+k%4,false);}
      for(let k=0;k<5;k++)g.box(sa*18-0.4,k*0.5,sb*6-0.4+(k%2)*0.2,sa*18+0.4,(k+1)*0.5,sb*6+0.4,34+k%4);
      g.sphere(sa*20,0.6,sb*19,0.6,36,ICO2);g.ell(sa*6,0.35,sb*20,0.5,0.35,0.4,34,ICO2);g.sphere(sa*6,0.85,sb*20,0.28,34,ICO2);
      g.item(sa*18,1.1,sb*8);if(r()<0.6)g.npc(sa*10,0,sb*19,r()*6.28);if(hasNote)g.note(sa*8,0.6,sb*14);
    }
  }
  if(r()<0.3)g.npc(-22,0,0.6,0,22,0.6);else if(r()<0.25)g.npc(0.6,0,-22,0,0.6,22);
  if(r()<0.13)g.watchAt(r()<0.5?-22:22,0);
  if(r()<0.5)g.item((r()<0.5?-1:1)*(4+r()*18),1.1,0);
}
function hospHall(g,r){ /* le hall : une verrière à soixante-dix mètres, des coursives tout autour */
  const HH=70;
  for(let k=1;k<=20;k++){const y=3.4*k,m=k%4===0?17:0;
    for(const s of[-1,1]){g.box(-24,y-0.3,s*20,24,y,s*24,m,false);g.box(s*20,y-0.3,-20,s*24,y,20,m,false);
      g.box(-20,y,s*19.95,20,y+1,s*20,13,false);g.box(s*19.95,y,-20,s*20,y+1,20,13,false);}}
  g.box(-24,HH,-24,24,HH+0.3,24,13,false);
  for(const a of[-10,10])for(const b of[-10,10])g.cyl(a,b,0.7,0,HH,0,true,14);
  g.box(-4,0,-1.5,4,1.15,1.5,41);g.box(-4.1,1.15,-1.6,4.1,1.2,1.6,0,false);g.box(-1,1.2,-0.2,1,1.7,0.2,29,false);
  for(const s of[-1,1])for(const l of[7,9]){for(let k=0;k<9;k++){const a=-4.4+k*1.1,b=s*l;g.box(a-0.25,0.42,b-0.25,a+0.25,0.48,b+0.25,16);g.box(a-0.25,0.48,b+s*0.2,a+0.25,0.9,b+s*0.25,16,false);}}
  for(const p of[[-15,-15],[15,15],[-15,15],[15,-15]]){g.cyl(p[0],p[1],0.5,0,0.7,41,true,12);g.sphere(p[0],1.6,p[1],1.0,15,ICO1,1.3);}
  g.cyl(0,0,0.03,30,HH,12,false,6);g.sphere(0,29,0,1.4,17,ICO2);
  g.item(0,1.9,0);g.item(-15,1.1,0);g.npc(2.5,0,4.2,0);
}

/* ====== Parking souterrain : piliers, néons, des voitures qui ne repartiront pas ====== */
function ambulance(g,a,b){
  g.box(a-3,0.4,b-1.1,a+3,2.55,b+1.1,0);g.box(a-3.02,1.15,b-1.12,a+3.02,1.4,b+1.12,48,false);
  g.box(a+1.9,1.45,b-1.12,a+2.8,2.2,b+1.12,47,false);g.box(a+3,0.4,b-1.0,a+3.15,1.3,b+1.0,12,false);
  for(const s of[-1,1]){g.box(a-0.6+s*0.35,2.55,b-0.4,a-0.2+s*0.35,2.68,b+0.4,s<0?49:17,false);
    g.ell(a-1.9,0.4,b+s*1.0,0.42,0.4,0.16,12,ICO2);g.ell(a+1.9,0.4,b+s*1.0,0.42,0.4,0.16,12,ICO2);}
  g.box(a-3.05,0.4,b-1.1,a-3,2.5,b+1.1,47,false); /* portes arrière ouvertes sur le noir */
  g.box(a-3.9,0.5,b-1.6,a-3.05,2.45,b-1.55,0,false);g.box(a-3.9,0.5,b+1.55,a-3.05,2.45,b+1.6,0,false);
  g.box(a-5.6,0,b-0.35,a-3.6,0.62,b+0.35,50);g.box(a-5.55,0.62,b-0.32,a-3.65,0.7,b+0.32,0,false);
}
function parkCell(g,c,i,j,r){
  const T=c.type,big=T===3,H=big?34:T===4?6:2.7;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,20);g.box(-24,H,-24,24,H+(big?3:0.6),24,18,false);
  for(const a of[-20,-12,-4,4,12,20])g.box(a-0.3,H-(big?1.6:0.45),-24,a+0.3,H,24,18,false);
  const pw=big?1.5:0.35;
  for(const a of[-20,-12,-4,4,12,20])for(const b of[-16,0,16]){g.box(a-pw,0,b-pw,a+pw,H,b+pw,18);g.box(a-pw-0.02,0.9,b-pw-0.02,a+pw+0.02,1.5,b+pw+0.02,16,false);}
  for(let x=-16;x<=24;x+=8)for(let z=-16;z<=24;z+=8)if(r()<(big?0.5:0.8))g.box(x-0.65,H-(big?1.7:0.55),z-0.06,x+0.65,H-(big?1.6:0.47),z+0.06,r()<0.22?12:17,false);
  if(T===T_DOOR){if(r()<0.5)car(g,-9.1,12,false,r);return;}
  let first=true;const park=p=>{for(const b of[-20.3,-11.7,11.7,20.3])for(let k=0;k<17;k++)if(r()<p){const a=-21+k*2.6;if(Math.abs(a-4)<1.2||Math.abs(a+4)<1.2||Math.abs(a-12)<1.2||Math.abs(a+12)<1.2||Math.abs(a-20)<1.2||Math.abs(a+20)<1.2)continue;car(g,a,b,false,r);if(first&&T===1){first=false;g.carAt(a,b);}}};
  if((T===1||T===2)&&r()<0.15)g.watchAt(-20+r()*40,r()<0.5?-6:6);
  if(T===1){park(0.5);g.item(-23+r()*46,1.1,(r()-0.5)*5);if(r()<0.5)g.item((r()-0.5)*40,1.1,r()<0.5?-16:16);if(r()<0.3)g.npc(-22,0,-6,0,22,-6);}
  else if(T===2){ /* un niveau vide ; une silhouette attend au milieu */
    park(0.06);g.npc(r()*10-5,0,(r()-0.5)*6,r()*6.28);g.item(r()*30-15,1.1,8);}
  else if(T===3){ /* la cathédrale : le plafond se perd dans le noir */
    park(0.18);g.item(0,1.1,8);g.item(-16+r()*6,1.1,-8);if(r()<0.5)g.npc(6,0,-8,0);}
  else if(T===4){ /* une rampe vers la mezzanine */
    for(let k=0;k<11;k++)g.box(-6+k*0.9,0,-6,-6+(k+1)*0.9,(k+1)*0.2,-3,18);
    g.box(3.9,0,-10,14,2.2,-3,18);g.box(3.9,2.2,-10,14,2.45,-9.8,16,false);park(0.25);g.item(10,3.3,-6.5);
  }else if(T===5){ambulance(g,-6,-6);park(0.2);g.item(-10.6,1.4,-6);g.npc(-2,0,-9,0);}
  else{ /* palier d'ascenseur : vitré, éclairé, personne ne vient */
    g.box(-3,0,-3,3,0.02,3,59,false);
    for(const s of[-1,1]){g.box(-3,0,s*3-0.04,3,H,s*3+0.04,13);}
    g.box(-3.1,0,-3,-2.9,H,3,18);g.box(2.9,0,-3,3.1,-0+H,-0.9,18);g.box(2.9,0,0.9,3.1,H,3,18);
    g.box(-2.9,0,-0.7,-2.86,2.1,0.7,50,false);g.box(-2.9,2.25,-0.15,-2.86,2.45,0.15,29,false);
    g.box(-1.5,0.4,1.8,1.5,0.46,2.4,41);park(0.35);g.item(0,1.1,0);if(r()<0.6)g.npc(1,0,-1.5,0);
  }
}

/* ====== Aéroport : une halle immense, des sièges, des tapis roulants ====== */
function termCell(g,c,i,j,r){
  const T=c.type,H=24,walk=mod(j,3)===0;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,59);
  for(const b0 of[-24,-12,0,12]){if(T===5&&(b0===-12||b0===0))continue;g.box(-24,H,b0+1.2,24,H+0.5,b0+10.8,0,false);}
  if(T===5){g.box(-24,H,-10.8,-11,H+0.5,10.8,0,false);g.box(11,H,-10.8,24,H+0.5,10.8,0,false);}
  for(const a of[-12,12]){g.box(a-0.3,H-1.2,-24,a+0.3,H,24,12,false);
    for(const b of[-12,12]){g.cyl(a,b,0.85,0,H-1.6,0,true,14);g.box(a-2.2,H-1.6,b-2.2,a+2.2,H-1.2,b+2.2,0,false);g.box(a-0.9,0,b-0.9,a+0.9,0.3,b+0.9,12,false);}}
  if(walk){ /* deux tapis, un dans chaque sens, d'un bout à l'autre de la halle */
    g.belt(-24,-4.6,24,-3.0,0.12,2.3);g.belt(-24,3.0,24,4.6,0.12,-2.3);
    for(const b of[-4.68,-3.0,2.92,4.6]){g.box(-15,0.12,b,15,1.05,b+0.08,13);g.box(-15,1.05,b-0.02,15,1.1,b+0.1,12,false);}
    if(T!==T_DOOR){g.item(-20+r()*40,1.3,r()<0.5?-3.8:3.8);if(r()<0.5)g.item((r()-0.5)*30,1.1,14);}
    if(r()<0.3)g.npc(-18,0,9,0,18,9);if(T!==T_DOOR&&r()<0.2)g.note((r()-0.5)*30,1.0,10);return;
  }
  if(T===T_DOOR)return;
  const bench=(b,flip)=>{g.box(-9,0.40,b-0.26,9,0.46,b+0.26,37);g.box(-9,0.46,b+(flip?-0.26:0.2),9,0.95,b+(flip?-0.2:0.26),37,false);
    for(const a of[-8.6,0,8.6])g.box(a-0.04,0,b-0.2,a+0.04,0.4,b+0.2,12,false);};
  if(T===1){ /* salle d'attente */
    for(const b of[-18,-8,6,16]){bench(b,false);bench(b+1.2,true);}
    g.box(10.5,0,-4.3,11.1,0.75,-3.4,16);g.box(10.75,0.75,-3.9,10.85,1.05,-3.8,12,false);
    g.item((r()-0.5)*16,1.1,-13+r()*2);if(r()<0.5)g.item(-15,1.1,11);if(r()<0.5)g.note(-8+r()*16,0.62,-8);if(r()<0.45)g.npc(-11,0,-13.4,0,11,-13.4);
  }else if(T===3){ /* enregistrement */
    g.box(-18,0,-6,18,4.2,-5.6,0);g.box(-18,3.2,-5.6,18,3.6,-5.56,16,false);
    for(let k=0;k<6;k++){const a=-15+k*6;g.box(a-1.2,0,-2,a+1.2,1.05,-1,0);g.box(a+1.3,0,-2.6,a+2.3,0.28,0.4,64);
      g.box(a-0.9,2.5,-1.6,a+0.9,3.1,-1.5,61,false);g.box(a-0.03,3.1,-1.58,a+0.03,4.2,-1.52,12,false);}
    g.item(-12,1.1,-3.8);g.item(9,1.1,5);if(r()<0.45)g.note(-15+Math.floor(r()*6)*6,1.15,-1.5);if(r()<0.5)g.npc(3,0,-3.8,0);
  }else if(T===4){ /* le tableau des départs */
    for(const a of[-13,13])g.cyl(a,0,0.5,0,18,12,true,10);
    g.box(-15,7,-0.4,15,17,0.4,12,false);g.box(-14.6,7.4,0.4,14.6,16.6,0.46,61,false);g.box(-14.6,7.4,-0.46,14.6,16.6,-0.4,61,false);
    g.item(0,1.1,5);g.item(0,1.1,-6);g.npc(0,0,9,0);if(r()<0.3)g.note(4,1.0,3);
  }else if(T===5){ /* jardin sous la verrière ouverte */
    g.box(-10,0,-10,10,0.5,10,0);g.top(-9.6,-9.6,9.6,9.6,0.52,9);g.grass(-9.6,-9.6,9.6,9.6,0.52,7,0.12);
    const y=g.y;g.y=y+0.5;for(const p of[[-5,-4],[4,5],[5,-6]]){tree(g,p[0],p[1],r,1.7+r()*0.8);}g.y=y;
    for(const s of[-1,1]){g.box(s*11.2-0.25,0.4,-4,s*11.2+0.25,0.46,4,37);for(const b of[-3.6,3.6])g.box(s*11.2-0.2,0,b-0.04,s*11.2+0.2,0.4,b+0.04,12,false);}
    g.item(0,1.7,0);g.npc(-2,0.52,3,0);
  }else{ /* boutique fermée, un globe suspendu */
    g.box(-5,0,-3,5,3.2,3,35);g.box(-5.3,3.2,-3.3,5.3,3.4,3.3,0,false);g.box(-4,0.5,3,4,2.4,3.05,47,false);g.box(-4.4,2.6,3,4.4,3.0,3.08,17,false);
    for(let k=0;k<6;k++)g.box(5,0,-3+k*0.9,6.6,(k+1)*0.53,-3+(k+1)*0.9,41);g.item(0,4.5,0);
    g.cyl(0,0,0.05,19,H,12,false,6);g.sphere(0,14.5,0,4.6,7,ICO3);
  }
}

/* ====== Plage : le dernier soir, la mer monte doucement ====== */
function beachCell(g,c,i,j,r){
  const T=c.type,cx=g.ox,cz=g.oz;g.m=SYM[0];g.y=0;g.terrain(62);
  if(j>=0){g.top(-24,-24,24,24,-0.12,3);g.water(-24,-24,24,24,-0.12,-14);}
  if(mod(i,5)===0&&j>=0&&j<=3){ /* la jetée */
    const b0=j===0?-9:-24,b1=j===3?2:24;g.box(-1.6,1.1,b0,1.6,1.32,b1,41);
    for(let b=Math.ceil(b0/8)*8;b<=b1;b+=8)for(const s of[-1,1])g.cyl(s*1.4,b,0.16,-11,1.1,27,false,8);
    if(j===0)for(let k=0;k<4;k++)g.box(-1.6,-0.6,-9-(k+1)*0.6,1.6,1.32-(k+1)*0.25,-9-k*0.6,41);
    if(j===3){g.box(-5,1.1,2,5,1.32,10,41);for(const s of[-1,1])for(const b of[2.4,9.6])g.cyl(s*4.6,b,0.2,-11,1.1,27,false,8);
      g.box(-0.07,1.32,9.2,0.07,4.4,9.34,12);g.sphere(0,4.6,9.27,0.28,25,ICO1);g.item(0,2.5,6);}
    else if(r()<0.6)g.item(0,2.4,(r()-0.5)*30);
  }
  if(T===T_FOOT)return;
  if(T===2){ /* le haut de la plage : cabines, parasols */
    for(let k=0;k<8;k++){if(r()<0.3)continue;g.put(cx,cz,-21+k*6,-19);
      g.box(-1.3,-1.5,-1.3,1.3,2.3,1.3,65);gable(g,-1.5,-1.5,1.5,1.5,2.3,0.95,0,65);g.box(-0.42,0.15,1.3,0.42,1.95,1.34,47,false);g.box(-0.7,-1.5,1.3,0.7,0.15,2.0,41);}
    for(let k=0;k<3;k++){const a=-18+k*13+r()*5,b=-11+r()*6;g.put(cx,cz,a,b);
      g.cyl(0,0,0.045,-1,2.25,12,false,6);g.cyl(0,0,1.7,2.25,2.38,34+Math.floor(r()*4),false,16);
      g.box(0.5,0.02,-0.35,2.3,0.06,0.35,34+Math.floor(r()*4),false);if(k===1)g.item(1.4,1.1,0);}
    g.put(cx,cz,9+r()*8,-3);g.sphere(0,0.42,0,0.42,21,ICO2);
    g.put(cx,cz,-12+r()*5,-1.5);for(const p of[[0,0],[0.9,0.2],[0.4,0.8]])g.cyl(p[0],p[1],0.28,-0.5,0.45+p[0]*0.2,62,false,10);
    if(r()<0.4){g.put(cx,cz,(r()-0.5)*30,-6);g.npc(0,0,0,0);}
    if(r()<0.5){g.put(cx,cz,(r()-0.5)*34,-9+r()*6);g.note(0,0.35,0);}
  }else if(T===1){ /* les dunes */
    g.grass(-24,-24,24,24,0,j===-1?0.5:0.9,0);
    if(j===-1){for(let k=0;k<9;k++){g.put(cx,cz,-22+k*5.5,14+Math.sin(k*1.7)*1.5);g.box(-0.06,-1,-0.06,0.06,0.9+r()*0.25,0.06,41,false);}
      if(r()<0.7){g.put(cx,cz,(r()-0.5)*36,(r()-0.5)*20);g.item(0,1.1,0);}
      if(r()<0.3){g.put(cx,cz,(r()-0.5)*30,6);g.npc(0,0,0,r()*6.28);}
      if(r()<0.35){g.put(cx,cz,(r()-0.5)*34,(r()-0.5)*16);g.note(0,0.35,0);}}
  }else{ /* la mer : bouées, perles au fond */
    if(j<=3){const n=j===1?2:1;for(let k=0;k<n;k++){g.put(cx,cz,(r()-0.5)*38,(r()-0.5)*38);g.pearl(0,0.45,0);}}
    if(r()<0.45){const a=(r()-0.5)*34,b=(r()-0.5)*34;g.ox=cx+a;g.oz=cz+b;g.y=0;g.sphere(0,-0.05,0,0.62,16,ICO2);g.cyl(0,0,0.04,0.4,1.5,12,false,6);if(j<=2)g.item(0,0.75,0);}
  }
  /* la vie du rivage : crabes sur le sable mouillé, étoiles de mer, coquillages ; algues et rochers sous l'eau */
  let crabs=0;
  const star=m=>{g.sphere(0,0.03,0,0.075,m,ICO1,0.45);for(let q=0;q<5;q++){const t=q/5*6.283+0.3;for(const [d,R] of[[0.08,0.05],[0.14,0.04],[0.2,0.028]])g.sphere(Math.cos(t)*d,0.025,Math.sin(t)*d,R,m,ICO1,0.5);}};
  for(let k=0;k<(T===2||T===1?18:12);k++){const a=(r()-0.5)*44,b=(r()-0.5)*44,h=HF(cx+a,cz+b);if(T===T_DOOR&&Math.hypot(a,b)<4)continue;g.put(cx,cz,a,b);const x=r();
    if(h<-0.75){ /* fond marin */
      if(x<0.55){const n=3+Math.floor(r()*4),top=Math.min(1.8,-h-0.25);for(let q=0;q<n;q++){const hh=top*(0.45+r()*0.55),u=(r()-0.5)*0.7,v=(r()-0.5)*0.7;g.ell(u,hh/2,v,0.05,hh/2,0.025,15,ICO1);g.ell(u+0.06,hh*0.75,v,0.03,hh*0.3,0.05,15,ICO1);}}
      else if(x<0.75)star(r()<0.5?34:36);
      else if(x<0.9){const R=0.3+r()*0.6;g.ell(0,R*0.3,0,R,R*0.65,R*0.85,18,ICO2);g.ell(R*0.3,R*0.75,0.1,0.12,0.4,0.03,15,ICO1);}
      else g.ell(0,0.04,0,0.1,0.05,0.08,0,ICO1);
    }else if(h<0.6&&j>=-1){ /* sable mouillé, laisse de mer */
      if(x<0.3&&crabs<3){crabs++;g.crab(0,0);}
      else if(x<0.55)star(r()<0.5?36:34);
      else if(x<0.85){for(let q=0;q<1+Math.floor(r()*3);q++)g.ell((r()-0.5)*0.6,0.035,(r()-0.5)*0.6,0.07+r()*0.05,0.04,0.055,r()<0.6?0:34,ICO1);}
      else{for(let q=0;q<3;q++)g.ell((r()-0.5)*0.8,0.02,(r()-0.5)*0.4,0.22,0.02,0.04,15,ICO1);}
    }}
  g.ox=cx;g.oz=cz;g.y=0;
}

/* ====== Chambre 214 : la chambre d'hôpital, à l'échelle de celui qui dort ====== */
const firstAt={};
function firstOf(t){ /* la cellule de ce type la plus proche de l'origine */
  const k=WSALT+':'+t;if(k in firstAt)return firstAt[k];let f=null;
  for(let rr=1;rr<=9&&!f;rr++)for(let i=-rr;i<=rr&&!f;i++)for(let j=-rr;j<=rr&&!f;j++){
    if(Math.max(Math.abs(i),Math.abs(j))!==rr)continue;if(cellInfo(i,j).type===t)f=[i,j];}
  return firstAt[k]=f;
}
function roomCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.top(-24,-24,24,24,0,68);
  if(T===T_FOOT||T===0)return;
  const ox=g.ox,oz=g.oz;
  if(T===8){ /* le moniteur : il compte les battements pour toi */
    g.cyl(0,0,3.2,0,0.8,12,true,20);g.cyl(0,0,0.45,0.8,14,50,false,10);g.solid(-0.6,0,-0.6,0.6,14,0.6);
    g.box(-5,14,-1.3,5,20.5,1.3,12,false);g.box(-4.5,14.5,1.3,4.5,20,1.36,29,false);g.box(-4.5,14.5,-1.36,4.5,20,-1.3,29,false);
    g.cyl(7,4,0.18,0,27,50,false,8);g.box(6.2,22,3.4,7.8,26,4.6,13,false);g.box(6.95,0,3.95,7.05,22,4.05,13,false);return;}
  if(T===7){ /* le lit : des barreaux comme des réverbères, des draps comme des collines */
    g.box(-13,0,-20,13,6.5,20,50);g.box(-12.4,6.5,-19.4,12.4,8.5,19.4,0);g.box(-12.7,8.5,-19.7,12.7,8.9,6,66);g.box(-13.4,6.0,-20.3,-12.4,8.9,6,66,false);
    g.box(-13,0,20,13,16,21.2,50);g.box(-13,0,-21.2,13,11,-20,50);g.ell(0,9.5,13,6.2,1.15,3.3,0,ICO3);g.solid(-5.6,8.5,10.4,5.6,9.3,15.6);g.hdoor(0,13);g.hdoor(-2,13);g.hdoor(2,13);
    for(const s of[-1,1]){g.box(s*13.2-0.3,11.4,-6,s*13.2+0.3,12,14,50,false);for(const b of[-6,4,14])g.box(s*13.2-0.25,8.5,b-0.25,s*13.2+0.25,11.4,b+0.25,50,false);}
    for(let k=0;k<17;k++)g.box(13,0,-18+k*1.25,18.5-(k%2)*0.02,(k+1)*0.5,-18+(k+1)*1.25,34+k%4);
    const f=firstOf(7);
    if(f&&f[0]===i&&f[1]===j){ /* la chaise : quelqu'un s'est endormi là, il veille */
      for(const sa of[-1,1])for(const sb of[-1,1])g.box(-19+sa*3-0.3,0,6+sb*3-0.3,-19+sa*3+0.3,6.7,6+sb*3+0.3,12);
      g.box(-22.6,6.7,2.4,-15.4,7.3,9.6,16);g.box(-22.6,7.3,2.4,-22,14.5,9.6,16,false);g.sitAt(-18.6,0,6,14.8);}
    g.item(8,10,0);return;}
  g.ox=ox+(r()-0.5)*12;g.oz=oz+(r()-0.5)*12;g.m=SYM[Math.floor(r()*4)];
  if(T===1){ /* les livres qu'on t'a lus, empilés */
    g.box(-3,0,-3,3,6,3,34);g.box(3.4,0,-2.6,9.4,6,3.4,36);g.box(-0.4,6,-2.2,5.6,12,3.8,37);
    for(let k=0;k<11;k++)g.box(-8.5,0,-6.3+k*0.9,-3.2,(k+1)*0.52,-6.3+(k+1)*0.9,35+k%3);
    for(let k=0;k<11;k++)g.box(-8.5+k*0.75,6,4.2,-8.5+(k+1)*0.75,6+(k+1)*0.52,8.6,34+k%4);g.box(-8.5,0,3.6,6,6,9.2,35);
    g.item(2.6,13.2,0.8);g.item(-6,1.1,-7);if(r()<0.45)g.note(12,1.0,-7);
  }else if(T===2){ /* le ballon : « bon rétablissement » */
    g.sphere(0,5.2,0,5.2,21,ICO3);g.solid(-3.6,0,-3.6,3.6,9,3.6);g.cyl(0,0,0.05,10.4,26,12,false,6);g.sphere(0,30,0,4,48,ICO3);g.item(8,1.1,2);if(r()<0.45)g.note(-8,1.0,-2);
  }else if(T===3){ /* les crayons des dessins accrochés au mur */
    for(let k=0;k<6;k++){const b=-6+k*2.2+r(),a=(r()-0.5)*6,m=[48,49,51,36,34,37][k];g.box(a-8,0,b-0.45,a+8,0.9,b+0.45,m);g.box(a+8,0.15,b-0.3,a+9.2,0.75,b+0.3,41,false);}
    g.box(-3,0.9,-2.6,11,1.8,-1.7,48);g.item(0,3.0,-2.1);if(r()<0.45)g.note(0,1.0,-10);
  }else if(T===4){ /* la chaise */
    for(const sa of[-1,1])for(const sb of[-1,1])g.box(sa*5-0.45,0,sb*5-0.45,sa*5+0.45,sb>0?27:12,sb*5+0.45,41);
    g.box(-5.6,12,-5.6,5.6,12.8,5.6,41);g.box(-5.4,19,4.6,5.4,26,5.4,41,false);g.box(-5.4,14.5,4.7,5.4,16,5.3,41,false);
    g.item(0,1.1,0);g.npc(2.5,0,-8,0);if(r()<0.45)g.note(0,1.0,9);
  }else if(T===5){ /* billes */
    for(let k=0;k<6;k++){const a=(r()-0.5)*26,b=(r()-0.5)*26,R=0.9+r()*0.9;g.sphere(a,R,b,R,k%2?24:14,ICO3);g.solid(a-R*0.6,0,b-R*0.6,a+R*0.6,R*1.7,b+R*0.6);}
    g.item(0,1.1,0);
  }else{ /* une pile de livres, un tremplin en haut */
    for(let k=0;k<12;k++)g.box(-4-k*0.1,0,-9+k*1.1,4+k*0.1,(k+1)*0.52,-9+k*1.1+6,[34,35,36,37,48,49][k%6]);
    g.pad(0,7.5,13,6.24);g.item(0,10.5,7.5);
  }
  g.ox=ox;g.oz=oz;g.m=SYM[0];
}


/* ---------- génération d'une cellule ---------- */
/* ====================== Chapitre 3 : ce qu'on a perdu ====================== */
const farAt={};
function farOf(t,minR){ /* la première cellule de ce type, assez loin du départ : c'est là qu'attend le souvenir */
  const k=WSALT+':'+t+':'+minR;if(k in farAt)return farAt[k];let f=null;
  for(let rr=minR;rr<=10&&!f;rr++)for(let i=-rr;i<=rr&&!f;i++)for(let j=-rr;j<=rr&&!f;j++){
    if(Math.max(Math.abs(i),Math.abs(j))!==rr)continue;if(cellInfo(i,j).type===t)f=[i,j];}
  return farAt[k]=f;
}
function isFar(i,j,t,minR){const f=farOf(t,minR);return !!f&&f[0]===i&&f[1]===j;}
/* les souvenirs, tels qu'ils reposent sur l'étagère de la pièce */
function keepsake(g,k,a,y,b){
  if(k===0){g.box(a-0.16,y+0.04,b-0.07,a+0.16,y+0.12,b+0.07,48,false);g.box(a-0.07,y+0.12,b-0.06,a+0.08,y+0.19,b+0.06,47,false);
    for(const s of[-1,1])for(const t of[-1,1])g.ell(a+s*0.1,y+0.04,b+t*0.07,0.035,0.035,0.015,12,ICO1);}
  else if(k===1){g.box(a-0.17,y,b-0.06,a+0.01,y+0.012,b+0.05,36,false);g.box(a-0.03,y+0.012,b-0.03,a+0.16,y+0.024,b+0.08,16,false);}
  else if(k===2){for(let q=0;q<4;q++)g.box(a-0.2+q*0.1,y+q*0.008,b-0.04,a-0.1+q*0.1,y+0.008+q*0.008,b+0.04,36,false);}
  else if(k===3){g.box(a-0.14,y,b-0.03,a+0.14,y+0.24,b,41,false);g.box(a-0.12,y+0.02,b-0.035,a+0.12,y+0.22,b-0.03,34,false);g.sphere(a,y+0.1,b-0.04,0.04,36,ICO1,0.5);}
  else if(k===4){for(let q=0;q<5;q++)g.box(a-0.18,y+q*0.03,b-0.12,a+0.18,y+(q+1)*0.03,b+0.12,q%2?0:49,false);}
  else{g.cyl(a,b,0.04,y,y+0.01,50,false,10);g.box(a+0.02,y,b-0.01,a+0.12,y+0.012,b+0.015,50,false);g.box(a-0.11,y,b+0.02,a-0.02,y+0.012,b+0.045,25,false);}
}

/* ---- la pièce aux souvenirs : un studio presque vide, une étagère, une porte qui s'allume ---- */
function hubCell(g,c,i,j,r){
  if(i!==0||j!==0)return;g.m=SYM[0];const H=2.7,R=6;
  g.box(-R-0.3,-0.8,-R-0.3,R+0.3,0,R+0.3,41);g.box(-R-0.3,H,-R-0.3,R+0.3,H+0.3,R+0.3,0);
  g.box(-R-0.3,0,-R-0.3,R+0.3,H,-R,0);g.box(-R-0.3,0,-R,-R,H,R,0);g.box(R,0,-R,R+0.3,H,R,0);
  g.box(-R-0.3,0,R,-0.7,H,R+0.3,0);g.box(0.7,0,R,R+0.3,H,R+0.3,0);g.box(-0.7,2.15,R,0.7,H,R+0.3,0);
  g.box(-0.75,0,R-0.02,-0.7,2.15,R+0.3,41,false);g.box(0.7,0,R-0.02,0.75,2.15,R+0.3,41,false);
  g.box(-0.7,0,R+0.3,0.7,2.15,R+0.34,17,false);g.hdoor(0,R+0.1);g.box(0.7,0,R-0.85,0.74,2.1,R-0.02,41,false);
  /* la fenêtre : la ville, la nuit */
  g.box(-2.2,0.9,-R+0.0,2.2,2.2,-R+0.02,13,false);for(let k=0;k<40;k++)g.box(-2+r()*4,0.95+r()*1.2,-R-0.25,-2+r()*4+0.03,0.95+r()*1.2+0.03,-R-0.22,r()<0.7?25:17,false);
  g.box(-2.3,0.85,-R+0.02,2.3,0.9,-R+0.25,0,false);
  /* l'ampoule nue, le matelas par terre, les cartons */
  g.cyl(0,0,0.006,1.95,H,12,false,4);g.sphere(0,1.9,0,0.06,25,ICO1);
  g.box(-R+0.2,0,-R+0.4,-R+1.7,0.22,-R+2.5,0);g.box(-R+0.2,0.22,-R+0.4,-R+1.7,0.28,-R+1.8,66,false);g.ell(-R+0.95,0.3,-R+2.2,0.45,0.08,0.18,0,ICO1);
  for(const p of[[-4.6,4.2,0],[-4.6,3.3,0],[-4.0,4.4,1],[-3.6,4.2,0]])g.box(p[0]-0.35,p[2]*0.5,p[1]-0.3,p[0]+0.35,p[2]*0.5+0.5,p[1]+0.3,70);
  /* l'étagère : six places, une par lieu perdu */
  g.box(R-0.45,0,-3.4,R,0.04,3.4,41,false);for(const y of[0.9,1.55])g.box(R-0.45,y,-3.4,R,y+0.04,3.4,41);
  for(const z of[-3.4,0,3.4])g.box(R-0.45,0,z-0.03,R,1.95,z+0.03,41);
  for(let k=0;k<6;k++){const lv=16+k,y=k<3?0.94:1.59,z=-2.3+(k%3)*2.3;
    if(C3.has(lv))keepsake(g,k,R-0.22,y,z);else g.box(R-0.3,y+0.001,z-0.25,R-0.05,y+0.003,z+0.25,0,false);}
  g.box(R-0.03,2.0,-0.3,R,2.4,0.3,16,false);
}

/* ---- centre commercial mort : la galerie marchande, les rideaux de fer, la fontaine sèche ---- */
function shutter(g,a0,a1,b,dir,open){ /* vitrine : rideau métallique, parfois levé à hauteur d'enfant */
  const y0=open?1.15:0,s=Math.sign(dir);
  g.box(Math.min(a0,a1),y0,Math.min(b,b+s*0.1),Math.max(a0,a1),4.2,Math.max(b,b+s*0.1),43);
  g.box(Math.min(a0,a1),4.2,Math.min(b,b+s*0.4),Math.max(a0,a1),5.0,Math.max(b,b+s*0.4),12,false);
  g.box((a0+a1)/2-2.5,4.4,b-s*0.02,(a0+a1)/2+2.5,4.85,b-s*0.03,[25,47,47,17][Math.floor(Math.abs(a0*7+b)%4)],false);
}
function deadMallCell(g,c,i,j,r){
  const T=c.type,H=T===3?30:9;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,59);
  const cross=T===2||T===3,store=T===5;
  /* plafond : verrière en bandes au-dessus des allées */
  if(T!==3){g.box(-24,H,-24,24,H+0.5,-6,0);g.box(-24,H,6,24,H+0.5,24,0);if(cross){g.box(-24,H,-6,-6,H+0.5,6,0);g.box(6,H,-6,24,H+0.5,6,0);}
    else g.box(-24,H+2,-6,24,H+2.3,6,13,false);
    for(let a=-21;a<=21;a+=6){g.box(a-0.15,H,-6,a+0.15,H+2,6,50,false);}
  }else{ /* l'atrium : une coupole de verre à trente mètres, des coursives qui n'ouvrent plus */
    g.box(-4.5,5.75,-14.5,-2.1,6,-10.5,0);
    for(let k=1;k<=4;k++){const y=k*6;for(const s of[-1,1]){g.box(-24,y-0.4,s*14,24,y,s*24,0,k===1);g.box(s*14,y-0.4,-14,s*24,y,14,0,k===1);
      g.box(-14,y,s*14-0.05,14,y+1.05,s*14+0.05,13,false);g.box(s*14-0.05,y,-14,s*14+0.05,y+1.05,14,13,false);
      g.box(-24,y,s*23.6,24,y+5.4,s*24,43,false);g.box(s*23.6,y,-24,s*24,y+5.4,24,43,false);}}
    g.box(-24,H,-24,24,H+0.4,24,13,false);for(let a=-20;a<=20;a+=8){g.box(a-0.12,H-0.3,-24,a+0.12,H,24,50,false);g.box(-24,H-0.3,a-0.12,24,H,a+0.12,50,false);}
    for(const s of[-1,1])for(const t of[-1,1])g.cyl(s*14,t*14,0.5,0,H,0,true,12);
    /* l'escalator immobile vers la première coursive */
    for(let k=0;k<24;k++)g.box(8-k*0.42,0,-12.6,8-k*0.42+0.42,(k+1)*0.25,-11,50);g.box(-2.1,0,-12.7,8,1.1,-12.6,13,false);
  }
  /* les vitrines, de part et d'autre de l'allée */
  const sides=cross?[[-24,-6],[6,24]]:[[-24,24]];
  for(const s of[-1,1]){
    for(const sg of sides)for(let a=sg[0];a<sg[1]-0.1;a+=sg[1]-sg[0]>20?16:18){const a1=Math.min(a+(sg[1]-sg[0]>20?16:18),sg[1]),open=r()<0.3;
      if(store&&s>0){continue;}
      shutter(g,a+0.3,a1-0.3,s*6,s,open);g.box(a,0,s*6,a+0.3,H,s*24,0);
      if(open){ /* derrière le rideau levé : rayonnages vides, un mannequin peut-être */
        for(let k=0;k<3;k++){const b=s*(10+k*4.5);g.box(a+2,0,b-0.3,a1-2,1.8,b+0.3,50);if(r()<0.4)g.box(a+3+r()*6,1.8,b-0.25,a+3.6+r()*6,2.1,b+0.25,70,false);}
        if(r()<0.5)g.statue((a+a1)/2,s*21);if(r()<0.35)g.note((a+a1)/2+2,1.95,s*14.5);
        if(r()<0.35)g.item((a+a1)/2,1.1,s*12.25);}
    }
    if(cross){g.box(-6,0,s*6,-5.7,H,s*24,0);g.box(5.7,0,s*6,6,H,s*24,0);}
    g.box(-24,0,s*23.7,24,H,s*24,0);
  }
  if(store){ /* le grand magasin : portants vides, caisses, mannequins debout */
    g.box(-24,0,6,24,0.02,24,58,false);
    for(let k=0;k<6;k++)for(let l=0;l<3;l++){const a=-20+k*8,b=10+l*5;g.box(a-1.4,1.55,b-0.03,a+1.4,1.6,b+0.03,50,false);for(const t of[-1,1])g.box(a+t*1.4-0.03,0,b-0.03,a+t*1.4+0.03,1.6,b+0.03,50,false);
      if(r()<0.3)for(let q=0;q<3;q++)g.box(a-1.2+q*0.8,0.9,b-0.02,a-0.9+q*0.8,1.55,b+0.25,[34,16,49][q],false);}
    for(let k=0;k<3;k++){g.box(-14+k*10,0,7.5,-11+k*10,1.0,8.4,41);g.box(-13.4+k*10,1.0,7.7,-12.8+k*10,1.35,8.1,12,false);}
    for(let k=0;k<3;k++)g.statue(-16+k*14+r()*4,12+r()*8);if(r()<0.6)g.note(-12.5,1.15,8);g.item(8,1.1,20);
  }
  /* au milieu de l'allée : bancs, bacs à plantes morts, la fontaine, le kiosque */
  if(cross){
    g.cyl(0,0,4.2,0,0.6,10,true,28);g.cyl(0,0,3.8,0.0,0.62,59,false,28);g.cyl(0,0,0.5,0.6,2.4,10,true,10);g.cyl(0,0,1.4,2.4,2.55,10,false,16);
    for(let k=0;k<5;k++)g.sphere(Math.cos(k*1.3)*2.3,0.67,Math.sin(k*1.3)*2.3,0.04,36,ICO1,0.4);
    if(T===2){ /* le kiosque à jouets, le comptoir */
      g.box(8,0,-3,12,1.05,3,41);g.box(8,2.6,-3.2,12.2,2.8,3.2,16,false);for(const p of[[8,-3],[12,-3],[8,3],[12,3]])g.box(p[0]-0.06,1.05,p[1]-0.06,p[0]+0.06,2.6,p[1]+0.06,50,false);
      for(let k=0;k<6;k++)g.box(9+r()*2.5,1.05,-2.5+k*0.9,9.3+r()*2.5,1.2,-2.3+k*0.9,34+k%4,false);
      if(isFar(i,j,2,3))g.souv(10,1.35,0);else if(r()<0.4)g.note(10,1.2,1.5);
    }
  }else{
    for(const a of[-16,0,16]){g.box(a-1.2,0,-0.9,a+1.2,0.6,0.9,59);g.box(a-1.1,0.6,-0.8,a+1.1,0.68,0.8,62,false);g.ell(a,0.75,0,0.6,0.25,0.4,12,ICO2);
      for(const s of[-1,1]){g.box(a+s*3.6-0.9,0.42,-0.25,a+s*3.6+0.9,0.48,0.25,41);g.box(a+s*3.6-0.9,0.48,0.2,a+s*3.6+0.9,0.9,0.25,41,false);}}
    if(T===4){ /* aire de restauration : comptoirs éteints, l'ascenseur au bout */
      for(let k=0;k<4;k++)for(let l=0;l<2;l++){const a=-15+k*9,b=-3+l*6;g.cyl(a,b,0.6,0.72,0.76,0,true,14);g.cyl(a,b,0.06,0,0.72,50,false,6);
        for(let q=0;q<4;q++){const t=q*1.57+0.4;g.box(a+Math.cos(t)*1.0-0.2,0.42,b+Math.sin(t)*1.0-0.2,a+Math.cos(t)*1.0+0.2,0.47,b+Math.sin(t)*1.0+0.2,16,false);}}
      g.box(19,0,-2,23.7,2.6,-1.9,50);g.box(19,0,1.9,23.7,2.6,2,50);g.box(19,2.6,-2,23.7,2.8,2,50,false);g.box(23.6,0,-1.9,23.7,2.6,1.9,17,false);
      g.box(18.9,2.65,-0.5,19,2.9,0.5,61,false);g.box(18.95,1.1,2.05,19,1.35,2.25,25,false);g.hdoor(21.5,0);
    }
    if(T===6){ /* un pan de plafond tombé */
      for(let k=0;k<6;k++)g.box(-8+r()*16,0,-4+r()*8,-8+r()*16+1.5+r()*2,0.1+r()*0.4,-4+r()*8+1+r()*2,0);if(r()<0.6)g.statue(-10+r()*20,(r()<0.5?-1:1)*3.5);}
  }
  if(T===1&&r()<0.4)g.guard(-22,2.8,22,2.8);else if(T===1&&r()<0.25)g.statue(-20+r()*40,(r()<0.5?-1:1)*4.5);
  if(r()<0.3)g.npc(-6+r()*12,0,(r()<0.5?-1:1)*3,r()*6.28);
  if(r()<0.5)g.item(-20+r()*40,1.1,(r()-0.5)*6);
}

/* ---- cinéma : des salles, des fauteuils rouges, un écran qui attend son film ---- */
const SCREEN_W=11,SCREEN_H=4.6,SCREEN_BW=19,SCREEN_BH=8.2;
function cinemaCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,58);
  if(T===0||T===2||T===5){ /* le hall : confiserie, affiches, cordons */
    const H=4.2;g.box(-24,H,-24,24,H+0.4,24,0);
    for(let a=-20;a<=20;a+=8)for(let b=-20;b<=20;b+=8)g.box(a-0.35,H-0.04,b-0.35,a+0.35,H,b+0.35,(r()<0.3)?12:25,false);
    for(const s of[-1,1])for(let a=-18;a<=18;a+=9){const z=s*17;g.box(a-1.1,0,z-0.08,a+1.1,3.2,z+0.08,41);g.box(a-1,0.9,z-s*0.1,a+1,3.1,z-s*0.08,[34,47,49,36,48][Math.floor(r()*5)],false);}
    if(T===2){g.box(-6,0,-8,6,1.1,-6.8,41);g.box(-6.1,1.1,-8.1,6.1,1.16,-6.7,48,false);g.box(-5,1.16,-7.8,-3,2.4,-7,13,false);g.box(-4.9,1.2,-7.7,-3.1,1.6,-7.1,36,false);
      g.box(-6,2.9,-8.2,6,3.6,-8.1,61,false);g.npc(0,0,-9,0);if(r()<0.6)g.note(2,1.25,-7.4);}
    for(let k=0;k<6;k++){const a=-15+k*6;g.cyl(a,4,0.12,0,0.95,50,false,8);if(k<5)g.box(a,0.8,3.97,a+6,0.86,4.03,48,false);}
    if(T===0&&r()<0.5)g.guard(-20,0,20,0);else if(r()<0.4)g.guard(-20,-2,20,-2);
    g.item(-14+r()*28,1.1,-14+r()*6);return;}
  /* une salle : murs tendus, gradins, écran, projecteur au dernier rang */
  const big=T===3,W=big?22:15,L=big?22:21,H=big?20:9;
  g.box(-W,H,-L,W,H+0.5,L,0,false);
  for(const s of[-1,1]){g.box(s*W,0,-L,s*(W+0.3),H,L,58);}
  g.box(-W,0,-L-0.3,W,H,-L,12);g.box(-W,0,L,-2,H,L+0.3,58);g.box(2,0,L,W,H,L+0.3,58);g.box(-2,2.6,L,2,H,L+0.3,58);
  for(const s of[-1,1]){g.box(s*(W+0.3),4.2,-24,s*24,4.5,24,0,false);g.box(-W-0.3,4.2,s*(L+0.3),W+0.3,4.5,s*24,0,false);}
  /* couloirs autour : affiches, appliques */
  for(const s of[-1,1])for(let b=-18;b<=18;b+=9){g.box(s*(W+0.32),1.0,b-0.8,s*(W+0.35),3.0,b+0.8,[34,47,49,36][Math.floor(r()*4)],false);g.box(s*(W+0.32),3.4,b+2.5,s*(W+0.42),3.7,b+2.8,25,false);}
  const sw=big?SCREEN_BW:SCREEN_W,sh=big?SCREEN_BH:SCREEN_H,sy=big?3:1.6;
  g.box(-sw/2-0.4,sy-0.4,-L+0.02,sw/2+0.4,sy+sh+0.4,-L+0.1,12,false);g.box(-sw/2,sy,-L+0.1,sw/2,sy+sh,-L+0.13,0,false);
  g.box(-W,0,-L,W,0.4,-L+5,58);
  const rows=big?14:11,rise=big?0.5:0.38,z0=-L+(big?10:7);
  for(let k=0;k<rows;k++){const z=z0+k*1.2,y=k*rise;
    g.box(-W,0,z,W,y+0.001+(k?0:0),z+1.2,58);
    for(let a=-W+1.2;a<=W-1.2;a+=0.65){if(Math.abs(a)<0.9)continue;if(T===4&&r()<0.4)continue;
      g.box(a-0.27,y,z+0.1,a+0.27,y+0.45,z+0.6,48);g.box(a-0.27,y+0.45,z+0.6,a+0.27,y+1.05,z+0.75,48,false);}
    if(k===0)for(const a of[-1.6,1.6])g.hdoor(a,z+0.35);}
  const yt=(rows-1)*rise,zt=z0+rows*1.2;g.box(-W,0,zt,W,yt,L,58);
  /* le projecteur, sur l'estrade du fond */
  if(!big){g.screen(0,sy,-L+0.14,false);g.box(-0.4,yt,L-2.6,0.4,yt+1.1,L-1.8,12);g.box(-0.3,yt+1.1,L-2.9,0.3,yt+1.5,L-1.5,50,false);g.cyl(0,L-2.95,0.12,yt+1.18,yt+1.42,13,false,10);g.phone(0,yt+1.3,L-2.2);}
  else{g.screen(0,sy,-L+0.14,true);g.box(-0.5,yt,L-2.8,0.5,yt+1.2,L-1.8,12);g.phone(0,yt+1.3,L-2.3);}
  for(let k=0;k<rows;k+=2){const z=z0+k*1.2+0.6,y=k*rise;g.box(-W+0.05,y+0.05,z-0.06,-W+0.1,y+0.12,z+0.06,25,false);g.box(W-0.1,y+0.05,z-0.06,W-0.05,y+0.12,z+0.06,25,false);}
  if(T===6&&isFar(i,j,6,3))g.souv(1.6,0.62,z0+0.35);
  if(r()<0.5)g.item(-W+3+r()*(2*W-6),yt*0.5+1.4,z0+rows*0.6);
  if(r()<0.35)g.npc((r()-0.5)*8,0,-L+3,r()*6.28);
  {const sg=s0(r);if(r()<0.4)g.guard(sg*(W+1.2),-18,sg*(W+1.2),18);}
  g.item((r()<0.5?-1:1)*(W+1.2),1.1,-10+r()*20);
}
function s0(r){return r()<0.5?-1:1;}

/* ---- salle d'arcade : bornes, néons, moquette fluo, le comptoir des lots ---- */
function cabinet(g,a,b,f,r,lit){ /* f : direction de l'écran (+1 vers +b, -1 vers -b) */
  const B=(x0,y0,z0,x1,y1,z1,m,s)=>g.box(x0,y0,Math.min(b+f*z0,b+f*z1),x1,y1,Math.max(b+f*z0,b+f*z1),m,s);
  B(a-0.4,0,-0.4,a+0.4,1.85,0.35,12);B(a-0.4,0.85,0.35,a+0.4,1.0,0.6,41);
  const scr=lit?[29,61,71,72][Math.floor(r()*4)]:47;B(a-0.32,1.05,0.36,a+0.32,1.55,0.38,scr,false);
  B(a-0.42,1.85,-0.4,a+0.42,2.15,0.42,lit?(r()<0.5?71:72):12,false);
  for(const s of[-1,1])B(a+s*0.405,0,-0.4,a+s*0.42,2.15,0.42,lit?(r()<0.5?72:71):12,false);
}
function arcadeCell(g,c,i,j,r){
  const T=c.type,H=4;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,69);g.box(-24,H,-24,24,H+0.4,24,12);
  const dark=T===4;
  for(let a=-20;a<=20;a+=8)for(let b=-20;b<=20;b+=8){if(dark&&r()<0.8)continue;g.box(a+4-1.2,H-0.06,b+4-0.05,a+4+1.2,H,b+4+0.05,r()<0.5?71:72,false);}
  for(const a of[-12,12])for(const b of[-12,12])g.box(a-0.4,0,b-0.4,a+0.4,H,b+0.4,12);
  let act=-1;if(T===1||T===6)act=Math.floor(r()*14);
  if(T===1||T===4||T===0){ /* rangées de bornes dos à dos */
    let n=0;for(const b of[-16,-6,6,16])for(let a=-21;a<=21;a+=1.5){if(Math.abs(a)>10.5&&Math.abs(a)<13.5&&Math.abs(Math.abs(b)-12)<6)continue;if(r()<0.12)continue;
      const lit=!dark&&r()<0.75;cabinet(g,a,b-0.5,-1,r,lit);cabinet(g,a,b+0.5,1,r,lit&&r()<0.8);
      if(n++===act){g.phone(a,1.0,b+1.05);}}
    if(r()<0.35)g.guard(-22,0,22,0);if(r()<0.3)g.npc(-10+r()*20,0,11,r()*6.28);
    if(r()<0.5)g.item(-20+r()*40,1.1,(r()<0.5?-1:1)*11);
  }else if(T===2){ /* pinces à peluches */
    for(let k=0;k<8;k++){const a=-17+k*4.8,b=-8;g.box(a-1,0,b-1,a+1,0.9,b+1,12);g.box(a-1,0.9,b-1,a+1,2.4,b+1,13,false);g.box(a-1.05,2.4,b-1.05,a+1.05,2.7,b+1.05,k%2?71:72,false);
      for(let q=0;q<6;q++)g.sphere(a-0.6+r()*1.2,1.0+r()*0.4,b-0.6+r()*1.2,0.18,34+Math.floor(r()*4),ICO2);g.solid(a-1,0,b-1,a+1,2.7,b+1);}
    for(let k=0;k<5;k++)cabinet(g,-12+k*6,10,-1,r,true);g.phone(0,1.0,9.0);
    g.item(0,1.1,0);if(r()<0.5)g.guard(-20,2,20,2);
  }else if(T===3){ /* le comptoir des lots : tickets contre peluches */
    g.box(-8,0,-2,8,1.05,-1,41);g.box(-8,1.05,-2.1,8,1.1,-0.9,72,false);
    for(const y of[1.4,2.1,2.8]){g.box(-9,y,-5,9,y+0.05,-4.4,50,false);for(let k=0;k<14;k++)g.sphere(-8.4+k*1.3,y+0.25,-4.7,0.2+r()*0.08,34+(k+Math.floor(y*3))%4,ICO2);}
    g.box(-9,0,-5,9,3.4,-4.95,12);g.npc(3,0,-3.4,0);
    if(isFar(i,j,3,3))g.souv(-2,1.25,-1.5);else if(r()<0.5)g.item(6,1.4,-1.5);
    for(let k=0;k<4;k++)cabinet(g,-15+k*10,12,-1,r,true);
  }else if(T===5){ /* au fond, la borne à deux joueurs qui clignote : la vôtre */
    for(let k=0;k<6;k++)cabinet(g,-18+k*7.2,-14,1,r,false);
    cabinet(g,-0.6,0,1,r,true);cabinet(g,0.6,0,1,r,true);g.box(-1.5,2.15,-0.4,1.5,2.7,0.42,71,false);g.hdoor(0,1.4);
    g.box(-1.2,0,1.6,1.2,0.01,2.6,72,false);g.item(-10,1.1,8);
  }else{ /* air hockey, photomaton */
    for(let k=0;k<3;k++){const a=-14+k*14,b=-6;g.box(a-1.2,0,b-2.2,a+1.2,0.8,b+2.2,12);g.box(a-1.1,0.8,b-2.1,a+1.1,0.82,b+2.1,0,false);g.box(a-1.1,0.82,b-0.02,a+1.1,0.83,b+0.02,72,false);g.cyl(a,b+1.2,0.12,0.82,0.86,48,false,12);}
    g.box(10,0,8,12.2,2.4,10.6,48);g.box(10.4,0.4,7.95,11.8,2.1,8,47,false);g.box(9.6,2.4,7.9,12.6,2.7,10.7,72,false);
    for(let k=0;k<5;k++)cabinet(g,-20+k*1.5,14,-1,r,true);if(act>=0)g.phone(-17,1.0,13.0);
    if(r()<0.4)g.npc(4,0,6,0);g.item(0,1.1,10);
  }
}

/* ---- bowling : des pistes cirées à perte de vue, des quilles qui attendent ---- */
function pins(g,a,b,S){S=S||1;for(let row=0;row<4;row++)for(let k=0;k<=row;k++){const x=a+(k-row/2)*0.3*S,z=b-row*0.26*S;
  g.ell(x,0.2*S,z,0.06*S,0.2*S,0.06*S,0,ICO1);g.ell(x,0.28*S,z,0.035*S,0.025*S,0.035*S,48,ICO1);g.sphere(x,0.38*S,z,0.04*S,0,ICO1);}}
function bowlCell(g,c,i,j,r){
  const T=c.type,H=4.2;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,58);
  if(T===5){ /* la piste géante : on est la boule */
    g.box(-24,H*4,-24,24,H*4+0.5,24,12,false);g.box(-10,0,-24,10,0.12,24,41);for(const s of[-1,1])g.box(s*10,0,-24,s*12,0.06,24,50);
    pins(g,0,-14,10);for(let k=0;k<7;k++)g.box(-12+k*4-0.8,0.12,8,-12+k*4+0.8,0.13,8.6,25,false);g.item(0,1.1,0);g.statue(14,0);g.statue(-15,-8);
    for(const s of[-1,1])g.box(s*16,0,-24,s*24,H*4,24,12);return;}
  g.box(-24,H,-24,24,H+0.4,24,12);
  if(T===3||T===4){ /* salle des anniversaires / comptoir des chaussures */
    g.box(-24,0,-24,24,H,-23.7,0);
    if(T===3){for(let k=0;k<4;k++){const a=-15+k*10;g.box(a-2,0.72,-5,a+2,0.78,5,0);g.box(a-0.05,0,-0.05,a+0.05,0.72,0.05,50,false);
        for(let q=0;q<6;q++){g.box(a-2.6,0.42,-4+q*1.6-0.2,a-2.2,0.46,-4+q*1.6+0.2,16);g.box(a+2.2,0.42,-4+q*1.6-0.2,a+2.6,0.46,-4+q*1.6+0.2,16);}
        g.cyl(a,0,0.3,0.78,1.0,34,false,14);g.cyl(a,0,0.3,1.0,1.04,0,false,14);
        for(let q=0;q<3;q++){const x=a-1.5+q*1.5,z=4+r();g.cyl(x,z,0.004,0.78,2.6,0,false,3);g.ell(x,2.8,z,0.25,0.3,0.25,34+q,ICO2);}}
      g.box(-12,2.8,-23.6,12,3.4,-23.55,36,false);if(isFar(i,j,3,3))g.souv(5,1.05,0);else if(r()<0.5)g.item(-5,1.1,0);g.npc(10,0,8,r()*6.28);}
    else{g.box(-10,0,-10,10,1.05,-9,41);for(const y of[0.3,0.9,1.5,2.1]){g.box(-10,y,-13,10,y+0.04,-12.2,50,false);for(let k=0;k<26;k++)g.box(-9.6+k*0.75,y+0.04,-12.9,-9.3+k*0.75,y+0.14,-12.4,[48,49,0][k%3],false);}
      g.box(-10,0,-13.2,10,2.6,-13.1,12);g.npc(0,0,-11.5,0);g.statue(-8,4);g.statue(8,-2);g.item(0,1.1,6);}
    return;}
  /* huit pistes le long de z ; l'arrière du hall s'ouvre sur la rangée suivante par deux passages */
  const dark=T===2;
  for(let k=0;k<8;k++){const a=-15.75+k*4.5;
    g.box(a-0.53,0,-22,a+0.53,0.08,14,41);for(const s of[-1,1])g.box(a+s*0.53,0,-22,a+s*0.77,0.02,14,50,false);
    for(let q=0;q<7;q++)g.box(a-0.3+q*0.1,0.081,6,a-0.27+q*0.1,0.082,6.3,25,false);
    pins(g,a,-20.6);if(k%2===0){g.box(a+0.77,0,-22,a+3.73,0.25,14,59);g.box(a+1.6,0,10,a+2.9,0.9,14,50);for(let q=0;q<4;q++)g.sphere(a+1.8+q*0.32,1.02,12,0.11,[48,49,34,72][q],ICO1);}
    g.box(a-0.77,1.4,-22.3,a+0.77,3.4,-21.9,12,false);g.box(a-0.6,2.6,-21.9,a+0.6,3.0,-21.88,dark?47:(k%2?71:72),false);}
  g.box(-18.1,1.2,-22.3,18.1,H,-21.9,12,false);
  for(const s of[-1,1]){g.box(s*18.1,0,-22,s*19,H,14,12);g.box(s*21,0,-22,s*24,H,14,12);}
  g.box(-24,0,-24,-21,H,-23.7,12);g.box(-19,0,-24,19,H,-23.7,12);g.box(21,0,-24,24,H,-23.7,12);
  /* l'aire de lancer : sièges, écrans des scores */
  g.box(-24,0,14,24,0.02,24,58,false);
  for(let k=0;k<4;k++){const a=-13.5+k*9;g.box(a-2.2,0.42,18,a+2.2,0.48,19,16);g.box(a-2.2,0.48,18.8,a+2.2,1.0,19,16,false);g.box(a-0.9,0,16,a+0.9,0.7,16.8,59);
    g.box(a-1.4,3.0,14.3,a+1.4,3.8,14.4,dark?47:61,false);g.box(a-0.05,3.8,14.32,a+0.05,H,14.38,12,false);}
  const act=dark?-1:Math.floor(r()*8);if(act>=0){const a=-15.75+act*4.5;g.phone(a,0.6,14.6);g.box(a-0.1,0,14.5,a+0.1,0.55,14.7,50,false);}
  if(!dark)for(let k=0;k<8;k++)g.hdoor(-15.75+k*4.5,-20.2);
  for(let k=0;k<2;k++)if(r()<0.5)g.statue(-15.75+Math.floor(r()*8)*4.5,-6+r()*14);
  if(r()<0.35)g.npc(-10+r()*20,0,21,r()*6.28);
  g.item(-15.75+Math.floor(r()*8)*4.5,1.1,-4+r()*10);
}

/* ---- parc aquatique vidé : bassins secs, toboggans, palmiers morts sous la verrière ---- */
function basin(g,a0,b0,a1,b1,D,steps){ /* un trou carrelé, profond de D, avec une échelle */
  g.box(a0,-D-0.8,b0,a1,-D,b1,10);
  g.box(a0-0.3,-D,b0-0.3,a1+0.3,0,b0,10);g.box(a0-0.3,-D,b1,a1+0.3,0,b1+0.3,10);g.box(a0-0.3,-D,b0,a0,0,b1,10);g.box(a1,-D,b0,a1+0.3,0,b1,10);
  g.box(a0-0.5,-0.04,b0-0.5,a1+0.5,0.06,b0-0.3,0,false);g.box(a0-0.5,-0.04,b1+0.3,a1+0.5,0.06,b1+0.5,0,false);
  if(steps){const n=Math.ceil(D/0.25);for(let k=0;k<n;k++)g.box(a0,-D,b1-0.42*(k+1),a0+2.2,-0.25*(k+1),b1-0.42*k,10);}
  g.water(a0,b0,a1,b1,-D+0.06,-D);
}
function aquaCell(g,c,i,j,r){
  const T=c.type,H=T===3?44:16;g.m=SYM[0];
  const pool=T===1?[-16,-10,16,10,2.4]:T===4?[-18,-14,18,12,3.2]:T===3?[-10,-20,10,-4,4.5]:null;
  if(pool){const [a0,b0,a1,b1]=pool;g.box(-24,-0.8,-24,24,0,b0-0.3,59);g.box(-24,-0.8,b1+0.3,24,0,24,59);g.box(-24,-0.8,b0-0.3,a0-0.3,0,b1+0.3,59);g.box(a1+0.3,-0.8,b0-0.3,24,0,b1+0.3,59);
    basin(g,a0,b0,a1,b1,pool[4],true);}
  else if(T!==2)g.box(-24,-0.8,-24,24,0,24,59);
  g.box(-24,H,-24,24,H+0.3,24,13,false);for(let a=-24;a<=24;a+=6)g.box(a-0.1,H-0.4,-24,a+0.1,H,24,50,false);
  for(const s of[-1,1])for(const t of[-1,1])g.cyl(s*22,t*22,0.35,0,H,50,true,10);
  const palm=(a,b,h)=>{g.cyl(a,b,0.22,0,h,41,true,8);for(let q=0;q<6;q++){const t=q*1.05;g.ell(a+Math.cos(t)*1.2,h-0.3,b+Math.sin(t)*1.2,1.2,0.12,0.35,15,ICO1);}};
  if(T===0||T===5){ /* bassin des petits : champignon qui ne coule plus, plage carrelée */
    g.box(-12,0,-12,12,0.02,12,10,false);g.cyl(0,0,0.25,0,2.2,34,true,10);g.ell(0,2.4,0,2.2,0.5,2.2,48,ICO2);for(let k=0;k<6;k++)g.sphere(Math.cos(k)*1.7,2.75,Math.sin(k)*1.7,0.25,0,ICO1);
    for(let k=0;k<5;k++)g.box(-10+k*4.5,0,8,-8.5+k*4.5,0.3,11,[34,35,36,37,49][k]);palm(16,-14,9);palm(-17,14,8);
    if(r()<0.5)g.note(5,0.4,-6);if(T===5)g.statue(-6+r()*12,-10);g.item(-8,1.1,-8);
  }else if(T===1){ /* le grand bassin vide, les transats alignés */
    for(let k=0;k<9;k++){const a=-18+k*4.5;g.box(a-0.35,0,14,a+0.35,0.35,16,0);g.box(a-0.35,0.35,15.6,a+0.35,0.9,16.2,0,false);}
    if(isFar(i,j,1,3))g.souv(-9,0.45,15);else if(r()<0.4)g.note(9,0.45,15);
    g.box(17,0,-12,18,2.5,-11,49);g.box(16.6,2.5,-12.4,18.4,2.6,-10.6,49);g.statue(-6+r()*12,12.5);palm(-21,-18,10);g.item(0,-1.3,0);if(r()<0.4)g.npc(10,0,18,0);
  }else if(T===2){ /* la rivière lente, à sec */
    for(const b of[-6,6]){g.box(-24,-1.2,b-0.15,24,0,b+0.15,10);}
    g.box(-24,-1.2-0.8,-6,24,-1.2,6,10);g.box(-24,-0.8,-24,24,0,-6.15,59,true);g.box(-24,-0.8,6.15,24,0,24,59,true);
    for(let k=0;k<4;k++){const a=-18+k*12;g.ell(a,-1.0,(r()-0.5)*6,0.7,0.2,0.7,36,ICO2);}
    for(let k=0;k<5;k++){const a=-20+k*10;g.box(a-0.6,-1.2,4.4,a+0.6,-0.8,6,10);g.box(a-0.6,-1.2,5.2,a+0.6,-0.4,6,10);}
    palm(-12,14,9);palm(12,-14,11);if(r()<0.5)g.note(4,-0.9,0);g.statue(-14+r()*28,-14);g.item(-6,-0.1,0);
  }else if(T===3){ /* la tour des toboggans : trente mètres d'escalier, puis tout le chemin jusqu'au fond */
    const TH=28;
    for(let k=0;k<TH/0.25;k++){const y=(k+1)*0.25,t=k*0.22,a=12+Math.cos(t)*3.4,b=10+Math.sin(t)*3.4;g.box(a-0.6,y-0.25,b-0.6,a+0.6,y,b+0.6,59);}
    g.cyl(12,10,1.6,0,TH,50,true,12);
    const t1=(TH/0.25-1)*0.22,sx=12+Math.cos(t1)*3.4,sz=10+Math.sin(t1)*3.4;
    for(let k=0;k<112;k++){const f=k/112,y=TH-f*(TH+4.3),a=sx+(0-sx)*f,b=sz+(-12-sz)*f,w=0.9;
      g.box(a-w,y-0.12,b-0.12,a+w,y,b+0.12,k%8<4?34:49);g.box(a-w-0.15,y,b-0.12,a-w,y+0.6,b+0.12,k%8<4?34:49,false);g.box(a+w,y,b-0.12,a+w+0.15,y+0.6,b+0.12,k%8<4?34:49,false);}
    g.hdoor(0,-12);g.hdoor(-5,-12);g.hdoor(5,-12);palm(-18,10,12);g.item(sx,TH+1.1,sz);g.statue(-16,6);
  }else if(T===4){ /* la piscine à vagues : le fond descend sous la verrière */
    for(let k=0;k<5;k++)g.box(-18,-3.2,-14+k*5.2,18,-3.2+k*0.6,-14+(k+1)*5.2,10);
    for(let k=0;k<6;k++)g.box(-17+k*6.8,4,-14.2,-15+k*6.8,6.5,-13.9,50,false);palm(20,16,10);g.statue(-10,-8);g.statue(10,-12);g.item(0,-1.5,-6);if(r()<0.5)g.note(-14,0.4,17);
  }else{ /* vestiaires : casiers, douches qui gouttent */
    for(let l=0;l<4;l++){const b=-14+l*8;for(let k=0;k<16;k++){const a=-18+k*2.4;g.box(a-1.15,0,b-0.3,a+1.15,2.2,b+0.3,[49,35,48][l%3]);g.box(a-0.3,1.6,b+0.3,a+0.3,1.65,b+0.32,12,false);}}
    showerRow(g,22,-12,5,r);if(r()<0.6)g.note(6,1.2,-10+0.6);g.statue(-4,-6+r()*2);g.item(10,1.1,2);
  }
  if(r()<0.3)g.npc(-18+r()*36,0,20,r()*6.28);
}

/* ---- la maison vendue : des pièces vides, des cartons, des inconnus qui visitent ---- */
function houseSoldCell(g,c,i,j,r){
  const T=c.type,H=2.6,S=8;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,41);g.box(-24,H,-24,24,H+0.3,24,0);
  /* murs tous les huit mètres, chacun percé d'une porte */
  for(let k=-3;k<=3;k++){const w=k*S;
    for(let u=-3;u<3;u++){const u0=u*S,u1=u0+S,dc=u0+2+Math.floor(hash(i*7+k,j*5+u,71)*4);
      for(const az of[true,false]){const B=(p0,y0,p1,y1)=>az?g.box(p0,y0,w-0.08,p1,y1,w+0.08,0):g.box(w-0.08,y0,p0,w+0.08,y1,p1,0);
        if(Math.abs(k)===3&&(az?k>0:k>0))continue;
        B(u0,0,dc-0.5,H);B(dc+0.5,0,u1,H);B(dc-0.5,2.1,dc+0.5,H);
        if(az)g.box(dc-0.55,0,w-0.1,dc-0.5,2.1,w+0.1,41,false);else g.box(w-0.1,0,dc-0.55,w+0.1,2.1,dc-0.5,41,false);}}}
  /* chaque pièce : quelques traces de vie, des cartons, des meubles sous des draps */
  const chair=T===6&&isFar(i,j,6,2);
  for(let ra=-3;ra<3;ra++)for(let rb=-3;rb<3;rb++){const a=ra*S+S/2,b=rb*S+S/2,x=r();
    if(chair&&ra===-2&&rb===-2){g.box(a-0.3,H-0.02,b-0.3,a+0.3,H,b+0.3,25,false);continue;}
    g.box(a-0.3,H-0.02,b-0.3,a+0.3,H,b+0.3,25,false);
    for(let q=0;q<2;q++)if(r()<0.6){const fa=a-3+r()*6;g.box(fa-0.4,1.3,b-S/2+0.09,fa+0.4,1.9,b-S/2+0.1,16,false);}
    if(x<0.25){g.ell(a,0.45,b,1.1,0.45,0.5,0,ICO2);g.ell(a+0.9,0.75,b,0.3,0.35,0.5,0,ICO2);g.solid(a-1.1,0,b-0.5,a+1.1,0.85,b+0.5);}
    else if(x<0.4){g.box(a-1,0,b-0.8,a+1,0.4,b+0.8,0);g.box(a-1.05,0,b-0.85,a+1.05,0.9,b-0.8,41,false);}
    else if(x<0.55){g.box(a-1.3,0,b-0.6,a+1.3,0.9,b+0.6,41);g.box(a-1.35,0.9,b-0.65,a+1.35,0.95,b+0.65,59,false);}
    if(r()<0.55){const n=1+Math.floor(r()*3);for(let q=0;q<n;q++){const ca=a-2.5+r()*5,cb=b-2.5+r()*5;g.box(ca-0.3,0,cb-0.25,ca+0.3,0.45,cb+0.25,70);}}
    if(r()<0.16){const ca=a+1.8,cb=b+1.8;g.box(ca-0.3,0,cb-0.25,ca+0.3,0.42,cb+0.25,70);g.box(ca-0.3,0.42,cb-0.25,ca-0.28,0.7,cb+0.25,70,false);g.box(ca+0.28,0.42,cb-0.25,ca+0.3,0.7,cb+0.25,70,false);g.phone(ca,0.5,cb);}
    if(r()<0.12)g.visitor(a+(r()-0.5)*4,b+(r()-0.5)*4);
    if(r()<0.06)g.item(a,1.1,b);
  }
  /* fenêtres de fin d'après-midi sur les murs extérieurs de la cellule */
  for(let u=-3;u<3;u++){const a=u*S+S/2;g.box(a-1.2,0.9,-23.9,a+1.2,2.1,-23.88,17,false);}
  if(isFar(i,j,4,3)){g.souv(-21,0.95,-21);g.box(-21.4,0,-21.4,-20.6,0.9,-20.6,41);}
  if(chair){ /* ta chambre : vide, une chaise bleue au milieu, face à la fenêtre */
    const a=-12,b=-12;g.box(a-0.25,0.45,b-0.25,a+0.25,0.5,b+0.25,16);for(const s of[-1,1])for(const t of[-1,1])g.box(a+s*0.22-0.02,0,b+t*0.22-0.02,a+s*0.22+0.02,0.45,b+t*0.22+0.02,50,false);
    g.box(a-0.25,0.5,b+0.2,a+0.25,1.0,b+0.25,16,false);g.hdoor(a,b);g.box(a-1.4,0.9,b-3.9,a+1.4,2.2,b-3.88,17,false);g.box(a-1.6,0,b-1.2,a-1.2,0.01,b+1.6,16,false);}
}

function genCell(i,j){
  const c=cellInfo(i,j),cx=i*CELL,cz=j*CELL,g=new Geo(cx,cz,c.h),r=rng(Math.floor(hash(i,j,20)*4294967296)),gen=GEN;
  let door=null;
  if(c.exists){
    if(gen===0){const P=c.P;etherCell(g,c,P,[bridge(i,j,0),bridge(i-1,j,0),bridge(i,j,1),bridge(i,j-1,1)],i,j,r);}
    else if(gen===1){if(j===0)metroLine(g,c,i,r);else metroAnnex(g,c,c.P,i,j,r);}
    else if(gen===2)aeroCell(g,c,i,j,r);
    else if(gen===3)poolCell(g,c,i,j,r);
    else if(gen===5)backCell(g,c,i,j,r);
    else if(gen===6)mallCell(g,c,i,j,r);
    else if(gen===7)playCell(g,c,i,j,r);
    else if(gen===9)hotelCell(g,c,i,j,r);
    else if(gen===10)hospitalCell(g,c,i,j,r);
    else if(gen===11)parkCell(g,c,i,j,r);
    else if(gen===12)termCell(g,c,i,j,r);
    else if(gen===13)beachCell(g,c,i,j,r);
    else if(gen===14)roomCell(g,c,i,j,r);
    else if(gen===15)hubCell(g,c,i,j,r);
    else if(gen===16)deadMallCell(g,c,i,j,r);
    else if(gen===17)cinemaCell(g,c,i,j,r);
    else if(gen===18)arcadeCell(g,c,i,j,r);
    else if(gen===19)bowlCell(g,c,i,j,r);
    else if(gen===20)aquaCell(g,c,i,j,r);
    else if(gen===21)houseSoldCell(g,c,i,j,r);
    else if(gen===8)houseCell(g,c,mod(i,RING_N),j,rng(Math.floor(hash(mod(i,RING_N),j,20)*4294967296)));
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
  return {verts:new Float32Array(g.v),col:new Float32Array(g.col),door,items:g.items,pads:g.pads,npcs:g.npcs,wat:g.wat,pearls:g.pearls,course:g.course,car:g.car,sit:g.sit,lifts:g.lifts,swings:g.swings,hdoors:g.hdoors,conv:g.conv,crabs:g.crabs,statues:g.statues,guards:g.guards,visitors:g.visitors,souvs:g.souvs,scr:g.scr,notes:g.notes,phones:g.phones,watch:g.watch,blades:g.gr.length?g.blades(r):null,
          asc:hasAsc?{x:cx,z:cz,top:c.h+ascLayout(i,j).H}:null};
}
