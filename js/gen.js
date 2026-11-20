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
function tree(g,a,b,r,sc){ /* tronc effilé, trois branches maîtresses, un houppier en grappes */
  sc=sc||1;const h=(2.6+r()*1.6)*sc,R=(1.5+r()*0.8)*sc;
  g.rod(a,0,b,a,h+R*0.35,b,0.19*sc,27,8,0.09*sc);g.cone(a,b,0.3*sc,0.19*sc,0,0.3*sc,27,8);g.solid(a-0.13*sc,0,b-0.13*sc,a+0.13*sc,h,b+0.13*sc);
  const cl=[[a,h+R*0.95,b,R*0.72]];
  for(let k=0;k<3;k++){const an=k*2.1+r(),d=R*0.55,y=h+R*(0.2+0.3*r()),x=a+Math.cos(an)*d,z=b+Math.sin(an)*d;g.rod(a,h*0.72,b,x,y,z,0.07*sc,27,5,0.035*sc);cl.push([x,y+R*0.22,z,R*0.6]);}
  for(let k=0;k<4;k++){const an=r()*6.28,d=R*(0.3+r()*0.4);cl.push([a+Math.cos(an)*d,h+R*(0.45+r()*0.65),b+Math.sin(an)*d,R*(0.42+r()*0.2)]);}
  for(const c of cl)g.ell(c[0],c[1],c[2],c[3],c[3]*0.82,c[3],15,ICO1);
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
/* ====== mobilier commun, plus détaillé ====== */
/* repère d'un meuble adossé à un mur : u le long du mur (autour de u), d la profondeur depuis le dos (w), f le sens de la façade ; az : le mur suit b */
function furn(g,az,u,w,f){const X=(uu,dd)=>az?[w+f*dd,u+uu]:[u+uu,w+f*dd];
  return {P:X,B:(u0,u1,y0,y1,d0,d1,m,s)=>{const p=X(u0,d0),q=X(u1,d1);g.box(Math.min(p[0],q[0]),y0,Math.min(p[1],q[1]),Math.max(p[0],q[0]),y1,Math.max(p[1],q[1]),m,s);},
    door:(u0,u1,y0,y1,d,th,ang,m)=>{const du=az?[0,1]:[1,0],nf=az?[f,0]:[0,f],c=Math.cos(ang),sn=Math.sin(ang),dx=du[0]*c+nf[0]*sn,dz=du[1]*c+nf[1]*sn,h=X(u0,d),W=u1-u0;
      g.obox(h[0]+dx*W/2,(y0+y1)/2,h[1]+dz*W/2,W/2,(y1-y0)/2,th/2,Math.atan2(-dz,dx),0,m,false);}};}
function lockerBank(g,F,u0,u1,D,H,dw,m,r){ /* casiers métalliques : socle, portes à ouïes, poignées, numéros ; parfois une porte entrouverte */
  H=H||1.9;dw=dw||0.45;m=m||80;const n=Math.max(1,Math.round((u1-u0)/dw)),w=(u1-u0)/n;
  F.B(u0,u1,0.1,H,0,D,m);F.B(u0+0.02,u1-0.02,0,0.1,0,D-0.04,12,false);F.B(u0,u1,H,H+0.03,0,D+0.02,m,false);
  F.B(u0,u1,0.12,H-0.02,D,D+0.004,12,false);
  for(let k=0;k<n;k++){const a0=u0+k*w+0.012,a1=u0+(k+1)*w-0.012,mid=(a0+a1)/2;
    if(r&&r()<0.07){F.B(a0,a1,0.13,H-0.03,D-0.3,D-0.29,28,false);F.door(a0,a1,0.13,H-0.03,D+0.01,0.015,0.5+r()*0.6,m);continue;}
    F.B(a0,a1,0.13,H-0.03,D,D+0.015,m,false);
    F.B(a0+0.06,a1-0.06,H-0.42,H-0.16,D+0.015,D+0.02,87,false);F.B(a1-0.07,a1-0.04,0.95,1.2,D+0.015,D+0.045,50,false);}
}
function armoire(g,F,u,W,D,m){ /* armoire de bois : socle, corniche, deux portes à panneaux, boutons de laiton */
  m=m||81;W=W||1.3;D=D||0.6;const h=W/2;
  F.B(u-h,u+h,0.12,2.0,0,D,m);F.B(u-h-0.02,u+h+0.02,0,0.12,0,D+0.02,m,false);F.B(u-h-0.05,u+h+0.05,2.0,2.07,0,D+0.05,m,false);F.B(u-h-0.03,u+h+0.03,2.07,2.12,0,D+0.03,m,false);
  F.B(u-0.006,u+0.006,0.16,1.96,D,D+0.012,12,false);
  for(const s of[-1,1]){const a0=s<0?u-h+0.04:u+0.02,a1=s<0?u-0.02:u+h-0.04;
    for(const [y0,y1] of[[0.26,1.0],[1.12,1.86]])F.B(a0+0.06,a1-0.06,y0,y1,D,D+0.018,m,false);
    const p=F.P(u+s*0.06,D+0.03);g.sphere(p[0],1.06,p[1],0.022,78,ICO0);}
}
function filing(g,F,u,D,m){ /* classeur à quatre tiroirs : poignées, porte-étiquettes */
  m=m||80;D=D||0.62;F.B(u-0.24,u+0.24,0,1.32,0,D,m);
  for(let k=0;k<4;k++){const y=0.03+k*0.32;F.B(u-0.225,u+0.225,y,y+0.3,D,D+0.015,m,false);F.B(u-0.09,u+0.09,y+0.19,y+0.22,D+0.015,D+0.04,50,false);F.B(u-0.05,u+0.05,y+0.24,y+0.27,D+0.015,D+0.02,0,false);}
}

function potPlant(g,a,b,h,pot){ /* pot évasé, terreau, tiges, feuilles en éventail */
  pot=pot||81;h=h||1.3;g.cone(a,b,0.19,0.26,0,0.46,pot,12);g.torus(a,0.46,b,0.25,0.025,[0,1,0],pot,12,4);g.cyl(a,b,0.235,0.42,0.44,27,false,10);g.solid(a-0.2,0,b-0.2,a+0.2,0.5,b+0.2);
  for(let k=0;k<4;k++)g.rod(a,0.44,b,a+Math.sin(k*1.6)*0.12,0.44+h*0.55,b+Math.cos(k*1.6)*0.12,0.012,15,4);
  for(let k=0;k<14;k++){const t=k*2.4,l=0.2+0.16*(k%3)/2,y=0.44+h*(0.28+0.4*((k*7)%5)/4);g.obox(a+Math.sin(t)*l*0.7,y,b+Math.cos(t)*l*0.7,0.085,0.01,l,t,-0.2-0.25*(k%3),15);}
}
function sofa2(g,a,b,L,f,m,legM){ /* canapé : f = côté du dossier (±1 en b), coussins, accoudoirs roulés, pieds tournés */
  m=m||83;legM=legM||81;const Z=(z0,z1)=>[Math.min(b+f*z0,b+f*z1),Math.max(b+f*z0,b+f*z1)];
  let z=Z(-0.45,0.45);g.box(a-L,0.1,z[0],a+L,0.38,z[1],m);
  for(const s of[-1,1])for(const t of[-0.38,0.38])g.cone(a+s*(L+0.1),b+f*t,0.035,0.025,0,0.1,legM,6);
  const n=Math.max(1,Math.round(L/0.65)),w=2*L/n;
  for(let k=0;k<n;k++){const x0=a-L+k*w;z=Z(-0.44,0.22);g.box(x0+0.02,0.38,z[0],x0+w-0.02,0.53,z[1],m,false);
    g.ell(x0+w/2,0.74,b+f*0.2,w/2-0.03,0.22,0.09,m,ICO1);}
  z=Z(0.24,0.45);g.box(a-L,0.38,z[0],a+L,0.98,z[1],m,false);
  for(const s of[-1,1]){z=Z(-0.45,0.45);g.box(a+s*L-(s>0?0:0.2),0.1,z[0],a+s*L+(s>0?0.2:0),0.62,z[1],m,false);g.rod(a+s*(L+0.1),0.66,z[0]-0.02,a+s*(L+0.1),0.66,z[1]+0.02,0.1,m,10,0.1,true);}
}
function tableLamp(g,a,y,b,s){s=s||1;g.cone(a,b,0.09*s,0.06*s,y,y+0.03*s,78,8);g.ell(a,y+0.16*s,b,0.075*s,0.13*s,0.075*s,47,ICO1);g.rod(a,y+0.28*s,b,a,y+0.4*s,b,0.008*s,78,4);g.cone(a,b,0.17*s,0.1*s,y+0.34*s,y+0.55*s,84,10);}
function sideTable(g,a,b,h,R){h=h||0.75;R=R||0.32;g.cyl(a,b,R,h-0.04,h,81,false,18);g.torus(a,h-0.02,b,R,0.02,[0,1,0],81,18,4);g.rod(a,0.06,b,a,h-0.04,b,0.035,81,8,0.025);g.cone(a,b,0.22,0.1,0,0.07,81,12);g.solid(a-R*0.7,0,b-R*0.7,a+R*0.7,h,b+R*0.7);}
function phoneAt(g,a,y,b){ /* un vieux téléphone à cadran, en bakélite rouge ; il sonnera peut-être */
  const P=48;g.box(a-0.12,y,b-0.13,a+0.12,y+0.045,b+0.13,P,false);g.obox(a,y+0.075,b+0.01,0.105,0.035,0.11,0,0.3,P,false);
  g.cyl(a,b+0.05,0.06,y+0.1,y+0.112,0,false,14);g.torus(a,y+0.114,b+0.05,0.046,0.009,[0,1,0],50,12,4);g.cyl(a,b+0.05,0.018,y+0.112,y+0.12,P,false,8);
  for(const s of[-1,1])g.box(a+s*0.085-0.012,y+0.08,b-0.07,a+s*0.085+0.012,y+0.15,b-0.03,P,false);
  g.rod(a-0.11,y+0.165,b-0.05,a+0.11,y+0.165,b-0.05,0.019,P,8);for(const s of[-1,1])g.cone(a+s*0.12,b-0.05,0.032,0.044,y+0.13,y+0.172,P,10);
  let q=[a+0.13,y+0.14,b-0.05];for(let k=1;k<=9;k++){const t=k/9,n=[a+0.13+0.07*Math.sin(t*3.14)+(k%2?0.012:-0.012),y+0.14-0.12*Math.sin(t*1.57),b-0.05-0.1*t];g.rod(q[0],q[1],q[2],n[0],n[1],n[2],0.007,47,4);q=n;}
  g.phone(a,y+0.1,b);
}
function hotelCell(g,c,i,j,r){
  const T=c.type===T_DOOR?4:c.type,H=2.8,lob=T===2||T===3;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,58);
  if(lob){g.box(-24,H,-24,24,H+0.4,-13.2,0,false);g.box(-24,H,13.2,24,H+0.4,24,0,false);g.box(-24,H,-13.2,-13.2,H+0.4,13.2,0,false);g.box(13.2,H,-13.2,24,H+0.4,13.2,0,false);}
  else g.box(-24,H,-24,24,H+0.4,24,0,false);
  for(const s of[-1,1]){const e0=s>0?13.2:-24,e1=s>0?24:-13.2;
    g.box(e0,0,-10.8,e1,H,10.8,57);g.box(-10.8,0,e0,10.8,H,e1,57);
    for(const q of[-1,1])g.box(e0,0,q>0?13.2:-24,e1,H,q>0?24:-13.2,57);}
  const plant=(a,b)=>potPlant(g,a,b,1.5,47);
  const sofa=(a,b,L)=>sofa2(g,a,b,L,1);
  /* habillage d'un mur de couloir : appliques, tableaux, corniche, consoles. Le plan est x=X (az) ou z=X, tourné vers n */
  const B=(az,u0,u1,y0,y1,d0,d1,m,s)=>az?g.box(d0,y0,u0,d1,y1,u1,m,s):g.box(u0,y0,d0,u1,y1,d1,m,s);
  const wallDeco=(az,X,n,u0,u1)=>{
    const D=(d0,d1)=>[Math.min(X+n*d0,X+n*d1),Math.max(X+n*d0,X+n*d1)];
    const Q=(u,d)=>az?[X+n*d,u]:[u,X+n*d];
    {const d=D(0,0.07);B(az,u0,u1,H-0.16,H,d[0],d[1],81,false);const e=D(0,0.03);B(az,u0,u1,0.9,0.96,e[0],e[1],81,false);}
    for(let u=Math.ceil((u0-4)/8)*8+4;u<=u1-0.6;u+=8){if(u<u0+0.6)continue; /* applique : platine de laiton, bras, petit abat-jour */
      const d=D(0,0.025);B(az,u-0.06,u+0.06,1.72,1.92,d[0],d[1],78,false);const p0=Q(u,0.02),p1=Q(u,0.16);g.rod(p0[0],1.8,p0[1],p1[0],1.86,p1[1],0.012,78,5);g.cone(p1[0],p1[1],0.09,0.055,1.86,2.04,84,8);}
    for(let u=Math.ceil(u0/8)*8;u<=u1-0.9;u+=8){if(u<u0+0.9)continue;const k=r();
      if(k<0.45){ /* tableau : cadre doré, paysage */
        const d=D(0,0.05),e=D(0.05,0.065);B(az,u-0.58,u+0.58,1.12,1.98,d[0],d[1],78,false);B(az,u-0.48,u+0.48,1.22,1.88,e[0],e[1],86,false);}
      else if(k<0.62){ /* console : plateau d'acajou, un tiroir, pieds fuselés ; une lampe, parfois le téléphone */
        const t=D(0,0.42);B(az,u-0.72,u+0.72,0.78,0.82,t[0],t[1],81);const ap=D(0.02,0.38);B(az,u-0.66,u+0.66,0.64,0.78,ap[0],ap[1],81,false);
        const dr=D(0.38,0.4);B(az,u-0.3,u+0.3,0.66,0.76,dr[0],dr[1],81,false);{const kn=Q(u,0.41);g.sphere(kn[0],0.71,kn[1],0.018,78,ICO0);}
        for(const uu of[u-0.62,u+0.62])for(const dd of[0.06,0.34]){const p=Q(uu,dd);g.cone(p[0],p[1],0.028,0.016,0,0.64,81,6);}
        const m=Q(u-0.3,0.21);if(r()<0.5)phoneAt(g,m[0],0.82,m[1]);const l=Q(u+0.36,0.2);tableLamp(g,l[0],0.82,l[1],1);}
      else if(k<0.7){ /* grand vase, des branches sèches */
        const p=Q(u,0.3);g.cone(p[0],p[1],0.13,0.2,0,0.45,47,12);g.cone(p[0],p[1],0.2,0.09,0.45,0.78,47,12);g.solid(p[0]-0.2,0,p[1]-0.2,p[0]+0.2,0.8,p[1]+0.2);
        for(let q=0;q<5;q++){const t=q*1.3;g.rod(p[0],0.7,p[1],p[0]+Math.sin(t)*0.3,1.5+0.2*(q%2),p[1]+Math.cos(t)*0.3,0.01,27,4);}}
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
    sideTable(g,-3.35,-10.45,0.78,0.34);phoneAt(g,-3.35,0.78,-10.45);
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
    sideTable(g,-7,-7,0.72,0.4);phoneAt(g,-7,0.72,-7);
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
    g.box(-4,0,-1.2,4,1.1,-0.4,81);g.box(-4.2,1.1,-1.3,4.2,1.16,-0.3,81,false);g.box(-4.05,0,-1.25,4.05,0.1,-0.36,47,false);g.box(-4.02,0.98,-0.39,4.02,1.02,-0.37,78,false);for(let k=0;k<6;k++)g.box(-3.7+k*1.25,0.22,-0.4,-2.7+k*1.25,0.88,-0.37,81,false);g.cone(-1.2,-0.8,0.06,0.07,1.16,1.18,78,10);g.ell(-1.2,1.2,-0.8,0.055,0.045,0.055,78,ICO1);g.box(-0.1,1.16,-0.9,0.1,1.3,-0.7,25,false);tableLamp(g,3.6,1.16,-0.85,1.1);
    phoneAt(g,2.6,1.16,-0.8);for(let k=0;k<12;k++)g.box(-3.6+k*0.6-0.04,1.6,-2.95,-3.6+k*0.6+0.04,1.75,-2.9,25,false);g.box(-3.8,1.2,-3.0,3.8,2.2,-2.95,41,false);
    sofa(0,8.4,3);sofa(-8.5,3,1.6);plant(-9.6,-9.6);plant(9.6,-9.6);g.top(-5,3,5,7.6,0.012,16);
    {const a=7.5,b=5;for(const s of[-1,1])g.box(a+s*0.5-0.03,0,b-0.03,a+s*0.5+0.03,1.9,b+0.03,25,false);g.box(a-0.55,1.85,b-0.05,a+0.55,1.92,b+0.05,25,false);
      g.box(a-0.6,0.1,b-0.4,a+0.6,0.16,b+0.4,58,false);g.box(a-0.35,0.16,b-0.25,a+0.15,0.75,b+0.2,48,false);g.box(a+0.1,0.16,b-0.2,a+0.45,0.5,b+0.25,49,false);}
    g.npc(0,0,-2.6,0);g.item(8,1.1,-4);g.item(-8,1.1,-6);
  }
}

/* ====== Hôpital : couloirs de nuit, chambres communes, un lit vide quelque part ====== */
function patient(g,a,bh,dir,r){ /* allongé sur le dos, la tête sur l'oreiller, les bras sur la couverture */
  const B=t=>bh+dir*t,y0=0.62,hair=r()<0.4?79:75,L=(t0,t1)=>[Math.min(B(t0),B(t1)),Math.max(B(t0),B(t1))];
  g.ell(a,y0+0.06,B(0.3),0.32,0.075,0.17,76,ICO1);                                   /* oreiller */
  g.ell(a,y0+0.165,B(0.35),0.082,0.095,0.112,74,ICO1);                               /* visage tourné vers le plafond */
  g.ell(a,y0+0.15,B(0.31),0.088,0.08,0.1,hair,ICO1);                                 /* cheveux, du côté de l'oreiller */
  g.ell(a,y0+0.262,B(0.385),0.017,0.022,0.026,74,ICO0);                              /* nez */
  for(const s of[-1,1])g.ell(a+s*0.083,y0+0.16,B(0.35),0.014,0.03,0.022,74,ICO0);    /* oreilles */
  g.ell(a,y0+0.13,B(0.48),0.05,0.05,0.06,74,ICO0);                                   /* cou */
  g.ell(a,y0+0.11,B(0.6),0.23,0.09,0.1,77,ICO1);                                     /* épaules, la blouse */
  {const z=L(0.64,0.76);g.box(a-0.5,y0+0.03,z[0],a+0.5,y0+0.12,z[1],76,false);}      /* le drap rabattu */
  {const z=L(0.68,2.08);g.box(a-0.51,y0,z[0],a+0.51,y0+0.03,z[1],85,false);for(const s of[-1,1])g.box(a+s*0.51-0.01,0.4,z[0],a+s*0.51+0.01,y0+0.03,z[1],85,false);}
  g.ell(a,y0+0.03,B(1.05),0.3,0.085,0.42,85,ICO1);g.ell(a,y0+0.02,B(1.62),0.27,0.065,0.48,85,ICO1); /* le corps sous la couverture */
  for(const s of[-1,1])g.ell(a+s*0.1,y0+0.05,B(1.98),0.08,0.065,0.07,85,ICO0);
  /* bras : manche courte, avant-bras, main ; l'un le long du corps, l'autre sur le ventre */
  g.rod(a-0.22,y0+0.13,B(0.58),a-0.25,y0+0.14,B(0.84),0.05,77,6,0.045);g.rod(a-0.25,y0+0.14,B(0.84),a-0.22,y0+0.14,B(1.08),0.04,74,6,0.034);
  g.ell(a-0.21,y0+0.145,B(1.14),0.042,0.026,0.065,74,ICO0);
  g.rod(a+0.22,y0+0.13,B(0.58),a+0.25,y0+0.15,B(0.83),0.05,77,6,0.045);g.rod(a+0.25,y0+0.15,B(0.83),a+0.09,y0+0.17,B(0.97),0.04,74,6,0.034);
  g.ell(a+0.05,y0+0.175,B(0.99),0.065,0.026,0.042,74,ICO1);
  return [a+0.05,y0+0.18,B(0.99)];
}
function hbed(g,a,bh,dir,r,empty){ /* lit médicalisé : tête en bh, pieds vers dir (±1 en b) */
  const B=t=>bh+dir*t,Zb=(t0,t1,y0,y1,da,m,s)=>g.box(a-da,y0,Math.min(B(t0),B(t1)),a+da,y1,Math.max(B(t0),B(t1)),m,s);
  /* châssis sur roulettes, matelas */
  Zb(0.06,2.04,0.34,0.44,0.47,50);
  for(const t of[0.14,1.96])for(const s of[-1,1]){g.rod(a+s*0.4,0.1,B(t),a+s*0.4,0.36,B(t),0.022,50,6);g.box(a+s*0.4-0.03,0.02,B(t)-0.06,a+s*0.4+0.03,0.13,B(t)+0.06,12,false);}
  Zb(0.08,2.02,0.44,0.62,0.46,76,false);
  /* têtes de lit : panneau crème dans un cadre de tubes chromés */
  for(const [t,h] of[[0.03,1.02],[2.07,0.84]]){Zb(t-0.015,t+0.015,0.44,h-0.06,0.43,42,false);
    for(const s of[-1,1])g.rod(a+s*0.47,0.34,B(t),a+s*0.47,h,B(t),0.028,50,6);g.rod(a-0.47,h,B(t),a+0.47,h,B(t),0.028,50,6);}
  /* barrières relevées, côté tête */
  for(const s of[-1,1]){for(const y of[0.72,0.86])g.rod(a+s*0.5,y,B(0.22),a+s*0.5,y,B(1.12),0.013,50,5);
    for(const t of[0.25,0.67,1.09])g.rod(a+s*0.5,0.58,B(t),a+s*0.5,0.86,B(t),0.012,50,5);}
  let hand=null;
  if(empty){g.hdoor(a,bh+dir*1.05);Zb(0.02,0.08,1.55,1.72,0.32,17,false);
    g.ell(a,0.68,B(0.3),0.32,0.07,0.17,76,ICO1);Zb(0.7,2.04,0.62,0.645,0.47,76,false);g.ell(a+0.12,0.64,B(1.55),0.36,0.06,0.34,85,ICO1);}
  else if(r()<0.6)hand=patient(g,a,bh,dir,r);
  else{g.ell(a,0.68,B(0.3),0.32,0.07,0.17,76,ICO1);Zb(0.6,2.06,0.62,0.66,0.48,85,false);Zb(0.6,0.72,0.66,0.7,0.48,76,false);}
  /* pied à perfusion : cinq branches, une poche, une tubulure jusqu'à la main */
  const px=a+0.85,pz=B(0.35);g.rod(px,0.06,pz,px,1.95,pz,0.014,50,6);
  for(let k=0;k<5;k++){const t=k/5*6.283;g.rod(px,0.08,pz,px+Math.cos(t)*0.26,0.03,pz+Math.sin(t)*0.26,0.012,50,4);}
  g.rod(px-0.13,1.93,pz,px+0.13,1.93,pz,0.009,50,4);g.ell(px+0.1,1.74,pz,0.065,0.12,0.03,13,ICO1);
  if(hand){g.rod(px+0.1,1.62,pz,px+0.02,1.1,pz+dir*0.25,0.004,76,4);g.rod(px+0.02,1.1,pz+dir*0.25,hand[0]+0.06,hand[1]+0.02,hand[2],0.004,76,4);}
  /* table de chevet : un tiroir, un plateau, le moniteur qui bat encore */
  const cx=a-0.98,f=pz+dir*0.25;g.box(cx-0.25,0.04,pz-0.25,cx+0.25,0.72,pz+0.25,42);g.box(cx-0.27,0.72,pz-0.27,cx+0.27,0.75,pz+0.27,41);
  for(const y of[0.45,0.2]){g.box(cx-0.22,y,Math.min(f,f+dir*0.012),cx+0.22,y+0.22,Math.max(f,f+dir*0.012),0,false);g.box(cx-0.07,y+0.15,Math.min(f,f+dir*0.03),cx+0.07,y+0.17,Math.max(f,f+dir*0.03),50,false);}
  g.cone(cx+0.13,pz-0.08,0.04,0.035,0.75,0.86,13,8);
  g.rod(cx-0.05,0.75,pz,cx-0.05,0.95,pz,0.02,50,5);g.box(cx-0.24,0.95,pz-0.09,cx+0.14,1.25,pz+0.09,12,false);
  g.box(cx-0.21,0.98,Math.min(pz+dir*0.09,pz+dir*0.1),cx+0.11,1.22,Math.max(pz+dir*0.09,pz+dir*0.1),empty?47:82,false);
  if(r()<0.6){const cz=B(2.7),ch=a+0.95;g.box(ch-0.24,0.42,cz-0.22,ch+0.24,0.47,cz+0.22,16);
    for(const s of[-1,1])for(const t of[-1,1])g.rod(ch+s*0.21,0,cz+t*0.19,ch+s*0.21,0.42,cz+t*0.19,0.015,50,5);
    g.box(ch-0.24,0.6,cz+dir*0.2,ch+0.24,0.95,cz+dir*0.23,16,false);for(const s of[-1,1])g.rod(ch+s*0.21,0.47,cz+dir*0.21,ch+s*0.21,0.62,cz+dir*0.21,0.013,50,5);}
}
/* accessoires d'hôpital, posés le long d'un mur : u le long du mur, w la distance au centre du couloir, s le côté */
function hprop(g,az,u,w,k,r){ /* az : couloir le long de a (b=w) ; sinon le long de b (a=w) */
  const B=(u0,u1,y0,y1,w0,w1,m,s)=>az?g.box(u0,y0,Math.min(w0,w1),u1,y1,Math.max(w0,w1),m,s):g.box(Math.min(w0,w1),y0,u0,Math.max(w0,w1),y1,u1,m,s);
  const Q=(uu,ww)=>az?[uu,ww]:[ww,uu],R=(u0,y0,w0,u1,y1,w1,rr,m,n)=>{const p=Q(u0,w0),q=Q(u1,w1);g.rod(p[0],y0,p[1],q[0],y1,q[1],rr,m,n||6);},AX=az?[1,0,0]:[0,0,1];
  const sg=Math.sign(w)||1;
  if(k===0){ /* brancard : cadre de tubes, matelas, un drap froissé */
    B(u-1,u+1,0.6,0.66,w-0.32,w+0.32,50);B(u-0.97,u+0.97,0.66,0.76,w-0.3,w+0.3,76,false);
    for(const q of[-0.85,0.85])for(const t of[-0.26,0.26]){R(u+q,0.08,w+t,u+q,0.6,w+t,0.02,50);const p=Q(u+q,w+t);g.sphere(p[0],0.06,p[1],0.055,12,ICO0);}
    for(const t of[-0.33,0.33])R(u-0.95,0.82,w+t,u+0.95,0.82,w+t,0.014,50,5);
    if(r()<0.6){const p=Q(u+0.2,w);g.ell(p[0],0.8,p[1],az?0.45:0.28,0.06,az?0.28:0.45,76,ICO1);}
  }else if(k===1){ /* fauteuil roulant : grandes roues, mains courantes, roulettes, repose-pieds */
    B(u-0.24,u+0.24,0.46,0.52,w-0.22,w+0.22,47);B(u-0.24,u+0.24,0.52,0.95,w+sg*0.2,w+sg*0.24,47,false);
    for(const q of[-1,1]){const p=Q(u+q*0.3,w+sg*0.05);g.torus(p[0],0.31,p[1],0.29,0.022,AX,12,16,4);g.torus(p[0],0.31,p[1],0.25,0.01,AX,50,14,3);
      R(u+q*0.3,0.31,w+sg*0.05,u+q*0.24,0.48,w+sg*0.05,0.012,50,4);
      R(u+q*0.24,0.52,w+sg*0.22,u+q*0.24,1.0,w+sg*0.27,0.014,50);R(u+q*0.24,1.0,w+sg*0.27,u+q*0.24,1.0,w+sg*0.4,0.018,47);
      R(u+q*0.22,0.46,w-sg*0.2,u+q*0.18,0.12,w-sg*0.38,0.013,50);B(u+q*0.18-0.08,u+q*0.18+0.08,0.1,0.12,w-sg*0.46,w-sg*0.34,12,false);
      const c=Q(u+q*0.22,w-sg*0.25);g.sphere(c[0],0.07,c[1],0.065,12,ICO0);}
  }else if(k===2){ /* trois sièges sur une poutre */
    for(let q=-1;q<=1;q++){B(u+q*0.55-0.24,u+q*0.55+0.24,0.42,0.48,w-0.24,w+0.22,16);B(u+q*0.55-0.24,u+q*0.55+0.24,0.52,0.92,w+sg*0.2,w+sg*0.25,16,false);}
    B(u-0.85,u+0.85,0.36,0.42,w-0.04,w+0.04,50,false);for(const q of[-0.7,0.7]){R(u+q,0,w,u+q,0.36,w,0.03,50);B(u+q-0.04,u+q+0.04,0,0.02,w-0.25,w+0.25,50,false);}
  }else if(k===3){ /* chariot de soins : tiroirs de couleur, poignée, roulettes */
    B(u-0.4,u+0.4,0.12,0.95,w-0.28,w+0.28,0);for(let q=0;q<4;q++)B(u-0.38,u+0.38,0.2+q*0.19,0.34+q*0.19,w-sg*0.29,w-sg*0.27,[16,36,34,35][q],false);
    B(u-0.42,u+0.42,0.95,0.98,w-0.3,w+0.3,50,false);R(u-0.46,0.9,w-0.2,u-0.46,0.9,w+0.2,0.015,50);
    for(const q of[-0.32,0.32])for(const t of[-0.2,0.2]){const p=Q(u+q,w+t);g.sphere(p[0],0.06,p[1],0.055,12,ICO0);}
    {const p=Q(u+0.15,w);g.cone(p[0],p[1],0.06,0.05,0.98,1.12,0,8);}
  }else if(k===4){ /* plante en pot, extincteur au mur */
    const p=Q(u,w);potPlant(g,p[0],p[1],1.2,0);
    const e=Q(u+0.8,w+sg*0.3);g.cyl(e[0],e[1],0.085,0.9,1.4,48,false,12);g.cone(e[0],e[1],0.085,0.03,1.4,1.47,48,10);g.cone(e[0],e[1],0.02,0.02,1.47,1.53,12,6);
    R(u+0.8,1.5,w+sg*0.3,u+0.88,1.35,w+sg*0.22,0.01,12,4);R(u+0.88,1.35,w+sg*0.22,u+0.9,1.0,w+sg*0.22,0.012,12,4);
  }else{ /* un fauteuil de skaï, une table basse, des magazines */
    B(u-0.42,u+0.42,0.12,0.45,w-0.36,w+0.36,16);B(u-0.36,u+0.36,0.45,0.55,w-0.33,w+0.2,16,false);B(u-0.42,u+0.42,0.45,1.0,w+sg*0.22,w+sg*0.36,16,false);
    for(const q of[-1,1])B(u+q*0.42-(q>0?0.12:0),u+q*0.42+(q<0?0.12:0),0.12,0.68,w-0.36,w+0.36,16,false);
    for(const q of[-0.36,0.36])for(const t of[-0.3,0.3])R(u+q,0,w+t,u+q,0.12,w+t,0.02,50,4);
    const t=Q(u+0.78,w);sideTable(g,t[0],t[1],0.5,0.25);B(u+0.66,u+0.92,0.5,0.52,w-0.14,w+0.12,36,false);B(u+0.7,u+0.95,0.52,0.535,w-0.1,w+0.15,34,false);
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
      {const F=furn(g,true,sb*16.8,sa*23.8,-sa);lockerBank(g,F,-1.3,1.3,0.55,1.95,0.65,80,r);}
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
      {const F=furn(g,true,0,sa*23.8,-sa);for(let k=0;k<4;k++)filing(g,F,sb*(4.5+k*0.55),0.62,80);}
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
/* ---------- petit mobilier commun ---------- */
function c3plant(g,a,b,h,pot){ /* plante en pot : des feuilles longues qui retombent */
  pot=pot||41;h=h||1.4;g.cyl(a,b,0.28,0,0.5,pot,true,12);g.cyl(a,b,0.25,0.5,0.52,62,false,12);
  for(let k=0;k<9;k++){const t=k*2.4,l=0.35+0.25*(k%3)/2;g.obox(a+Math.sin(t)*l*0.6,0.5+h*(0.45+0.12*(k%3)),b+Math.cos(t)*l*0.6,0.07,0.012,l,t,-0.5-0.2*(k%3),15);}
  g.cyl(a,b,0.025,0.5,0.5+h*0.6,15,false,5);
}
function c3bench(g,a,b,along,L){ /* banc : lattes de bois, pieds de fonte */
  L=L||1.8;const B=(u0,y0,w0,u1,y1,w1,m,s)=>along?g.box(a+u0,y0,b+w0,a+u1,y1,b+w1,m,s):g.box(a+w0,y0,b+u0,a+w1,y1,b+u1,m,s);
  for(let k=0;k<3;k++)B(-L/2,0.42,-0.25+k*0.17,L/2,0.46,-0.13+k*0.17,41,k===1);
  for(let k=0;k<2;k++)B(-L/2,0.6+k*0.16,0.24,L/2,0.7+k*0.16,0.28,41,false);
  for(const s of[-1,1]){B(s*L/2-0.06,0,-0.26,s*L/2,0.42,-0.2,12,false);B(s*L/2-0.06,0,0.2,s*L/2,0.9,0.26,12,false);}
}
function c3bin(g,a,b){g.cyl(a,b,0.24,0,0.85,50,true,12);g.cyl(a,b,0.27,0.85,0.92,12,false,12);g.cyl(a,b,0.12,0.92,0.95,47,false,10);}
/* enseigne : un caisson sombre et des lettres lumineuses (des barres qui se lisent comme un mot de loin) */
function c3sign(g,a,y,b,w,h,axis,face,m,r){
  const B=(u0,v0,d0,u1,v1,d1,mm)=>axis?g.box(a+u0,y+v0,b+d0,a+u1,y+v1,b+d1,mm,false):g.box(a+d0,y+v0,b+u0,a+d1,y+v1,b+u1,mm,false);
  const f=face;B(-w/2,0,Math.min(0,-f*0.2),w/2,h,Math.max(0,-f*0.2),12);
  let u=-w/2+0.15;const lh=h*0.62,y0=(h-lh)/2;
  while(u<w/2-0.25){const lw=0.12+r()*0.22;if(r()<0.18){u+=lw;continue;}
    const d=f*0.02;B(u,y0,Math.min(d,d+f*0.03),u+0.035,y0+lh,Math.max(d,d+f*0.03),m);
    if(r()<0.7)B(u,y0+lh-0.035,Math.min(d,d+f*0.03),u+lw,y0+lh,Math.max(d,d+f*0.03),m);
    if(r()<0.6)B(u,y0,Math.min(d,d+f*0.03),u+lw,y0+0.035,Math.max(d,d+f*0.03),m);
    if(r()<0.5)B(u+lw-0.035,y0,Math.min(d,d+f*0.03),u+lw,y0+lh,Math.max(d,d+f*0.03),m);
    if(r()<0.4)B(u,y0+lh*0.45,Math.min(d,d+f*0.03),u+lw,y0+lh*0.55,Math.max(d,d+f*0.03),m);
    u+=lw+0.09;}
}
/* peluche : un ours qu'on reconnaît à ses oreilles */
function c3bear(g,a,y,b,s,m){g.ell(a,y+0.22*s,b,0.2*s,0.24*s,0.17*s,m,ICO1);g.sphere(a,y+0.55*s,b,0.16*s,m,ICO1);for(const t of[-1,1]){g.sphere(a+t*0.12*s,y+0.68*s,b,0.06*s,m,ICO1);g.sphere(a+t*0.15*s,y+0.06*s,b+0.06*s,0.08*s,m,ICO1);}
  g.ell(a,y+0.5*s,b+0.13*s,0.07*s,0.05*s,0.05*s,0,ICO1);g.sphere(a,y+0.52*s,b+0.17*s,0.02*s,28,ICO1);}
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
  g.box(-R-0.3,-0.8,-R-0.3,R+0.3,0,R+0.3,63);g.box(-R-0.3,H,-R-0.3,R+0.3,H+0.3,R+0.3,0);
  g.box(-R-0.3,0,-R-0.3,R+0.3,H,-R,0);g.box(-R-0.3,0,-R,-R,H,R,0);g.box(R,0,-R,R+0.3,H,R,0);
  g.box(-R-0.3,0,R,-0.7,H,R+0.3,0);g.box(0.7,0,R,R+0.3,H,R+0.3,0);g.box(-0.7,2.15,R,0.7,H,R+0.3,0);
  for(const s of[-1,1])g.box(s*0.7-0.05,0,R-0.03,s*0.7+0.05,2.2,R+0.3,41,false);g.box(-0.75,2.15,R-0.03,0.75,2.22,R+0.3,41,false);
  g.box(-0.7,0,R+0.3,0.7,2.15,R+0.34,17,false);g.hdoor(0,R+0.1);g.obox(0.7-0.4,1.07,R-0.35,0.4,1.06,0.02,-0.9,0,41);
  /* plinthes */
  g.box(-R,0,-R,R,0.08,-R+0.015,0,false);g.box(-R,0,-R,-R+0.015,0.08,R,0,false);g.box(R-0.015,0,-R,R,0.08,R,0,false);
  /* la fenêtre : la ville, la nuit, un radiateur dessous */
  g.box(-2.2,0.9,-R+0.0,2.2,2.2,-R+0.02,13,false);g.box(-2.25,0.88,-R,2.25,0.92,-R+0.06,0,false);g.box(-2.25,2.18,-R,2.25,2.22,-R+0.06,0,false);g.box(-0.02,0.9,-R,0.02,2.2,-R+0.05,0,false);
  for(let k=0;k<70;k++){const x=-2+r()*4,y=0.95+r()*1.2;g.box(x,y,-R-0.4,x+0.03,y+0.03,-R-0.37,r()<0.7?25:17,false);}
  g.box(-2.3,0.85,-R+0.02,2.3,0.9,-R+0.25,0,false);for(let k=0;k<12;k++)g.box(-1.1+k*0.2,0.15,-R+0.05,-1.02+k*0.2,0.7,-R+0.13,0,false);
  g.box(-2.4,2.3,-R+0.05,2.4,2.33,-R+0.08,50,false);for(const s of[-1,1])for(let q=0;q<5;q++)g.box(s*2.4-s*q*0.09-0.05,0.1,-R+0.08,s*2.4-s*q*0.09+0.05,2.3,-R+0.12+(q%2)*0.05,16,false);
  /* l'ampoule nue, le matelas par terre, une lampe de chevet, les cartons */
  g.cyl(0,0,0.006,1.95,H,12,false,4);g.sphere(0,1.9,0,0.06,25,ICO1);g.cyl(0,0,0.04,2.6,H,0,false,8);
  g.box(-R+0.2,0,-R+0.4,-R+1.7,0.22,-R+2.5,0);g.box(-R+0.22,0.22,-R+0.42,-R+1.68,0.3,-R+1.9,66,false);g.ell(-R+0.95,0.3,-R+2.2,0.45,0.08,0.18,0,ICO1);
  g.cyl(-R+2.1,-R+0.7,0.08,0,0.32,41,false,8);g.cyl(-R+2.1,-R+0.7,0.012,0.32,0.62,50,false,4);g.cyl(-R+2.1,-R+0.7,0.12,0.6,0.78,36,false,10);
  for(const p of[[-4.6,4.2,0],[-4.6,3.3,0],[-4.0,4.4,1],[-3.6,4.2,0],[-4.2,3.3,1]])g.box(p[0]-0.35,p[2]*0.5,p[1]-0.3,p[0]+0.35,p[2]*0.5+0.5,p[1]+0.3,70);
  c3plant(g,-R+0.6,R-0.6,1.1);
  /* l'étagère : six places, une par lieu perdu */
  g.box(R-0.45,0,-3.4,R,0.04,3.4,41,false);for(const y of[0.9,1.55])g.box(R-0.45,y,-3.4,R,y+0.04,3.4,41);
  for(const z of[-3.4,0,3.4])g.box(R-0.45,0,z-0.03,R,1.95,z+0.03,41);g.box(R-0.45,1.95,-3.4,R,1.99,3.4,41,false);
  for(let k=0;k<6;k++){const lv=16+k,y=k<3?0.94:1.59,z=-2.3+(k%3)*2.3;
    if(C3.has(lv))keepsake(g,k,R-0.22,y,z);else g.box(R-0.3,y+0.001,z-0.25,R-0.05,y+0.003,z+0.25,0,false);}
  g.box(R-0.03,2.0,-0.3,R,2.4,0.3,16,false);g.box(R-0.035,2.03,-0.27,R-0.03,2.37,0.27,34,false);
}

/* ---- centre commercial mort : la galerie marchande, les vitrines, la fontaine sèche ---- */
function shopFront(g,a0,a1,s,H,r,kind){ /* façade de boutique côté allée (z=s*6), enseigne au-dessus */
  const z=s*6,f=-s,w=a1-a0,mid=(a0+a1)/2;
  g.box(a0,0,Math.min(z,z+s*0.3),a0+0.3,H,Math.max(z,z+s*0.3),0);g.box(a1-0.3,0,Math.min(z,z+s*0.3),a1,H,Math.max(z,z+s*0.3),0);
  g.box(a0,4.2,Math.min(z,z+s*0.3),a1,5.4,Math.max(z,z+s*0.3),12,false);
  c3sign(g,mid,4.4,z-s*0.02,Math.min(w-2,7),0.8,true,f,r()<0.25?47:[25,17,71,72,36][Math.floor(r()*5)],r);
  if(kind==='shut'){g.box(a0+0.3,0,Math.min(z,z+s*0.12),a1-0.3,4.2,Math.max(z,z+s*0.12),43);g.box(a0+0.3,0,Math.min(z,z-s*0.06),a1-0.3,0.12,Math.max(z,z-s*0.06),50,false);return false;}
  if(kind==='half'){g.box(a0+0.3,1.2,Math.min(z,z+s*0.12),a1-0.3,4.2,Math.max(z,z+s*0.12),43);g.box(a0+0.3,1.1,Math.min(z,z-s*0.05),a1-0.3,1.2,Math.max(z,z-s*0.05),50,false);return true;}
  /* vitrine : montants, verre, porte ouverte au milieu */
  for(let u=a0+0.3;u<a1-0.3;u+=(w-0.6)/4){g.box(u-0.04,0,Math.min(z,z+s*0.12),u+0.04,4.2,Math.max(z,z+s*0.12),50);}
  g.box(a0+0.3,0,Math.min(z,z+s*0.06),mid-0.9,4.2,Math.max(z,z+s*0.06),13);g.box(mid+0.9,0,Math.min(z,z+s*0.06),a1-0.3,4.2,Math.max(z,z+s*0.06),13);g.box(mid-0.9,2.4,Math.min(z,z+s*0.06),mid+0.9,4.2,Math.max(z,z+s*0.06),13,false);
  g.box(a0+0.3,0,Math.min(z,z+s*0.12),a1-0.3,0.15,Math.max(z,z+s*0.12),50,false);return true;
}
function shopInside(g,a0,a1,s,r,i,j){ /* rayonnages, une caisse, des produits qui n'ont pas été repris */
  const mid=(a0+a1)/2;g.box(a0+0.3,0.005,Math.min(s*6.3,s*23.7),a1-0.3,0.01,Math.max(s*6.3,s*23.7),r()<0.5?58:59,false);
  const kind=Math.floor(r()*3);
  if(kind===0){for(let k=0;k<3;k++){const b=s*(11+k*4.2);g.box(mid-4,0,b-0.35,mid+4,0.1,b+0.35,12);g.box(mid-4,0,b-0.05,mid+4,1.8,b+0.05,50);
      for(const y of[0.15,0.6,1.05,1.5])for(const sd of[-1,1]){g.box(mid-4,y,b+sd*0.05,mid+4,y+0.03,b+sd*0.38,50,false);let u=mid-3.9;while(u<mid+3.6){const ww=0.25+r()*0.25;if(r()<0.45)g.box(u,y+0.03,Math.min(b+sd*0.08,b+sd*0.3),u+ww,y+0.08+r()*0.25,Math.max(b+sd*0.08,b+sd*0.3),[34,35,36,49,48,0][Math.floor(r()*6)],false);u+=ww+0.02;}}}}
  else if(kind===1){for(let k=0;k<4;k++){const u=a0+2+k*(a1-a0-4)/3,b=s*14;g.box(u-0.03,1.55,b-0.9,u+0.03,1.6,b+0.9,50,false);g.box(u-0.03,0,b-0.9,u+0.03,1.6,b-0.85,50,false);g.box(u-0.03,0,b+0.85,u+0.03,1.6,b+0.9,50,false);
      for(let q=0;q<7;q++)if(r()<0.6)g.box(u-0.25,0.85,b-0.8+q*0.25,u+0.25,1.55,b-0.78+q*0.25,[34,16,49,0,47][Math.floor(r()*5)],false);}}
  else{for(let k=0;k<3;k++){const u=a0+2.5+k*(a1-a0-5)/2,b=s*13;g.cyl(u,b,0.6,0,0.9,0,true,16);g.cyl(u,b,0.62,0.9,0.95,50,false,16);g.box(u-0.2,0.95,b-0.15,u+0.2,1.0,b+0.15,[48,36][k%2],false);}}
  /* la caisse, près de l'entrée */
  const cb=s*8.2;g.box(a1-3.4,0,Math.min(cb,cb+s*0.7),a1-1.2,1.0,Math.max(cb,cb+s*0.7),41);g.box(a1-3.45,1.0,Math.min(cb-s*0.05,cb+s*0.75),a1-1.15,1.04,Math.max(cb-s*0.05,cb+s*0.75),59,false);
  g.obox(a1-2.0,1.2,cb+s*0.35,0.18,0.14,0.02,0,s*0.4,12);g.obox(a1-2.0,1.2,cb+s*0.33,0.15,0.11,0.005,0,s*0.4,29);
}
function deadMallCell(g,c,i,j,r){
  const T=c.type,H=T===3?30:9;g.m=SYM[0];
  g.box(-24,-0.8,-24,24,0,24,59);
  /* toutes les cellules sont des carrefours : une allée le long de x, une autre le long de z, pour qu'aucun recoin ne soit muré */
  const cross=true,plaza=T===2||T===3,store=T===5;
  /* plafond : verrière en bandes au-dessus des allées, bandeaux suspendus */
  if(T!==3){for(const s of[-1,1])for(const t of[-1,1])g.box(s*6,H,t*6,s*24,H+0.5,t*24,0);
    g.box(-24,H+2,-6,24,H+2.3,6,13,false);g.box(-6,H+2,-24,6,H+2.3,24,13,false);for(const s of[-1,1])for(const t of[-1,1]){g.box(s*6-0.1,H,Math.min(t*6,t*24),s*6+0.1,H+2,Math.max(t*6,t*24),0,false);g.box(Math.min(t*6,t*24),H,s*6-0.1,Math.max(t*6,t*24),H+2,s*6+0.1,0,false);}
    for(let a=-21;a<=21;a+=6){g.box(a-0.15,H,-6,a+0.15,H+2,6,50,false);for(const s of[-1,1])g.span(a,H,s*6,a,H+2,s*3.5,0.2,0.2,50,false);}
    for(let a=-18;a<=18;a+=12)if(r()<0.6){const m=[34,36,49,48][Math.floor(r()*4)];g.box(a-0.02,H-3.2,-0.7,a+0.02,H,0.7,m,false);g.box(a-0.04,H-0.05,-0.75,a+0.04,H,0.75,50,false);}
    for(let a=-20;a<=20;a+=8)for(const s of[-1,1]){g.cyl(a,s*4.3,0.02,H-1.2,H,50,false,4);g.cyl(a,s*4.3,0.35,H-1.4,H-1.2,12,false,14);g.cyl(a,s*4.3,0.3,H-1.42,H-1.4,r()<0.3?47:17,false,14);}
  }else{ /* l'atrium : une coupole de verre à trente mètres, des coursives qui n'ouvrent plus */
    for(let k=1;k<=4;k++){const y=k*6;for(const s of[-1,1]){g.box(-24,y-0.4,s*14,24,y,s*24,0,k===1);g.box(s*14,y-0.4,-14,s*24,y,14,0,k===1);
      g.box(-14,y,s*14-0.05,14,y+1.05,s*14+0.05,13,false);g.box(s*14-0.05,y,-14,s*14+0.05,y+1.05,14,13,false);
      g.box(-14,y+1.05,s*14-0.07,14,y+1.12,s*14+0.07,50,false);g.box(s*14-0.07,y+1.05,-14,s*14+0.07,y+1.12,14,50,false);
      g.box(-24,y,s*23.6,24,y+5.4,s*24,43,false);g.box(s*23.6,y,-24,s*24,y+5.4,24,43,false);
      for(let a=-20;a<=20;a+=10)c3sign(g,a,y+3.6,s*23.55,6,0.7,true,-s,r()<0.4?47:[25,71,72,17][Math.floor(r()*4)],r);}}
    g.box(-24,H,-24,24,H+0.4,24,13,false);for(let a=-20;a<=20;a+=8){g.box(a-0.12,H-0.3,-24,a+0.12,H,24,50,false);g.box(-24,H-0.3,a-0.12,24,H,a+0.12,50,false);}
    for(const s of[-1,1])for(const t of[-1,1])g.cyl(s*14,t*14,0.5,0,H,0,true,16);
    /* l'escalator immobile : marches, rampes de caoutchouc, flancs vitrés */
    for(let k=0;k<24;k++)g.box(8-k*0.42,0,-12.6,8-k*0.42+0.42,(k+1)*0.25,-11,50);
    for(const z of[-12.65,-10.95]){g.span(8.4,0.9,z,-1.8,6.9,z,0.05,0.9,13,false);g.span(8.6,1.0,z,-2.0,7.0,z,0.12,0.08,47,false);}
    g.span(9,0,-11.8,-2.3,6,-11.8,1.9,0.08,12,false);g.box(-4.5,5.75,-14.5,-2.1,6,-10.5,0);
    c3plant(g,-8,8,2.5,0);c3plant(g,8,-8,2.5,0);
  }
  /* les vitrines, de part et d'autre de l'allée */
  const sides=cross?[[-24,-6],[6,24]]:[[-24,-8],[-8,8],[8,24]];
  for(const s of[-1,1]){
    for(const sg of sides){if(store&&s>0)continue;
      const kind=r()<0.4?'shut':r()<0.35?'half':'glass',open=shopFront(g,sg[0],sg[1],s,H,r,kind);
      if(open){shopInside(g,sg[0],sg[1],s,r,i,j);if(r()<0.5)g.statue((sg[0]+sg[1])/2,s*20);if(r()<0.4)g.note((sg[0]+sg[1])/2,1.12,s*(11+4.2)+(s>0?0.3:-0.3));
        if(r()<0.35)g.item((sg[0]+sg[1])/2+3,1.1,s*19);}
      else if(r()<0.25)g.item((sg[0]+sg[1])/2,1.1,s*4.6);}
    for(const sg of sides)for(const a of[sg[0],sg[1]]){if(Math.abs(a)===24)continue;g.box(a-0.15,0,Math.min(s*6.3,s*24),a+0.15,H,Math.max(s*6.3,s*24),0);}
    if(!(store&&s>0)){g.box(-6,0,Math.min(s*6,s*24),-5.7,H,Math.max(s*6,s*24),0);g.box(5.7,0,Math.min(s*6,s*24),6,H,Math.max(s*6,s*24),0);}
    g.box(-24,0,s*23.7,-6,H,s*24,0);g.box(6,0,s*23.7,24,H,s*24,0);
  }
  if(store){ /* le grand magasin : portants de vêtements, cabines, caisses, mannequins debout */
    g.box(-24,0.005,6,24,0.012,24,58,false);c3sign(g,0,4.4,6.02,9,0.9,true,-1,48,r);
    for(let k=0;k<6;k++)for(let l=0;l<3;l++){const a=-20+k*8,b=10+l*5;
      if((k+l)%2){g.cyl(a,b,0.5,1.45,1.5,50,false,16);g.cyl(a,b,0.03,0,1.5,50,false,6);g.cyl(a,b,0.3,0,0.05,50,false,10);
        for(let q=0;q<10;q++){const t=q*0.63;g.obox(a+Math.cos(t)*0.5,1.1,b+Math.sin(t)*0.5,0.2,0.38,0.02,-t,0,[34,16,49,0,47,36][q%6]);}}
      else{g.box(a-1.4,1.55,b-0.03,a+1.4,1.6,b+0.03,50,false);for(const t of[-1,1])g.box(a+t*1.4-0.03,0,b-0.03,a+t*1.4+0.03,1.6,b+0.03,50,false);
        for(let q=0;q<9;q++)if(r()<0.75)g.box(a-1.25+q*0.3,0.85,b-0.25,a-1.22+q*0.3,1.55,b+0.25,[34,16,49,0,47,48][Math.floor(r()*6)],false);}}
    for(let k=0;k<3;k++){g.box(-14+k*10,0,7.5,-11+k*10,1.0,8.4,41);g.box(-14.05+k*10,1.0,7.45,-10.95+k*10,1.04,8.45,59,false);g.obox(-12.5+k*10,1.2,8.0,0.18,0.14,0.02,0,0.4,12);}
    for(let k=0;k<3;k++){const a=14+k*2.2;g.box(a,0,21.5,a+0.05,2.3,23.7,0);g.box(a+0.05,2.2,21.5,a+2.2,2.25,21.55,50,false);g.box(a+0.1,0.15,21.52,a+2.1,2.15,21.54,48,false);}
    for(let k=0;k<3;k++)g.statue(-16+k*14+r()*4,12+r()*8);if(r()<0.6)g.note(-12.5,1.15,8);g.item(8,1.1,20);
  }
  /* au milieu de l'allée : bancs, bacs à plantes, poubelles, plan du centre, la fontaine, le kiosque */
  if(plaza){
    g.cyl(0,0,4.4,0,0.55,0,true,32);g.cyl(0,0,4.1,0.0,0.57,10,false,32);g.cyl(0,0,0.45,0.57,1.6,0,true,12);g.cyl(0,0,1.6,1.6,1.75,0,false,20);g.cyl(0,0,1.45,1.75,1.78,10,false,20);
    g.cyl(0,0,0.25,1.78,2.6,0,false,10);g.cyl(0,0,0.8,2.6,2.7,0,false,16);g.sphere(0,2.9,0,0.25,0,ICO2);
    for(let k=0;k<14;k++)g.cyl(Math.cos(k*1.7)*(1.5+k%3),Math.sin(k*1.7)*(1.5+k%3),0.035,0.57,0.58,k%3?25:50,false,8);
    for(let k=0;k<4;k++){const t=k*1.571+0.785;c3bench(g,Math.cos(t)*6.2,Math.sin(t)*6.2,Math.abs(Math.cos(t))<0.5,1.6);}
    if(T===2){ /* le kiosque à jouets : comptoir vitré, auvent rayé, petites voitures */
      const kx=10;g.box(kx-1.6,0,-2.6,kx+1.6,1.0,2.6,41);g.box(kx-1.62,1.0,-2.62,kx+1.62,1.05,2.62,13);
      for(let k=0;k<8;k++){const z=-2.2+k*0.6;g.box(kx-1.4,0.85,z-0.08,kx-1.1,0.95,z+0.08,[48,49,36,34][k%4],false);}
      for(const p of[[kx-1.6,-2.6],[kx+1.6,-2.6],[kx-1.6,2.6],[kx+1.6,2.6]])g.cyl(p[0],p[1],0.05,1.05,3.0,50,false,6);
      for(let q=0;q<8;q++){const z=-2.9+q*0.725;g.obox(kx-0.9,3.25,z+0.36,1.2,0.04,0.365,0,0,q%2?0:48);g.obox(kx-2.1,3.0,z+0.36,0.06,0.25,0.365,0,0,q%2?0:48);}
      g.obox(kx+0.6,3.4,0,1.1,0.04,3,0,0,0);
      g.box(kx+1.3,1.05,-2.4,kx+1.6,2.6,2.4,41);for(const y of[1.5,2.0])g.box(kx+0.9,y,-2.4,kx+1.3,y+0.03,2.4,41,false);
      for(let k=0;k<10;k++)c3bear(g,kx+1.05,1.53+(k%2)*0.5,-2.1+k*0.45,0.5,34+k%4);
      c3sign(g,kx-1.65,3.45,0,2.6,0.5,false,-1,36,r);
      if(isFar(i,j,2,3))g.souv(kx-1.45,1.12,0.3);else if(r()<0.4)g.note(kx-1.45,1.1,1.5);
    }
  }else{
    for(const a of[-16,16]){g.box(a-1.4,0,-0.9,a+1.4,0.55,0.9,59);g.box(a-1.3,0.55,-0.8,a+1.3,0.6,0.8,62,false);for(let q=0;q<3;q++)c3plant(g,a-0.8+q*0.8,0,1.6,59);
      for(const s of[-1,1])c3bench(g,a+s*3.8,0,true,1.8);c3bin(g,a+6,(a%2?-1:1)*1.2);}
    {const a=-9;g.box(a-0.6,0,-0.15,a+0.6,2.2,0.15,12);for(const s of[-1,1]){g.box(a-0.5,0.5,s*0.15,a+0.5,2.0,s*0.16,17,false);for(let q=0;q<9;q++)g.box(a-0.45+(q%3)*0.32,0.6+Math.floor(q/3)*0.45,s*0.16,a-0.2+(q%3)*0.32,0.95+Math.floor(q/3)*0.45,s*0.165,[34,35,36,49,16][q%5],false);}}
    if(T===4){ /* aire de restauration : comptoirs éteints, menus lumineux, l'ascenseur au bout */
      for(let k=0;k<4;k++)for(let l=0;l<2;l++){const a=-15+k*9,b=-3+l*6;g.box(a-0.6,0.72,b-0.6,a+0.6,0.76,b+0.6,0);g.cyl(a,b,0.05,0,0.72,50,false,6);g.cyl(a,b,0.3,0,0.03,50,false,10);
        for(const [dx,dz,rot] of[[0.9,0,1.571],[-0.9,0,-1.571],[0,0.9,0],[0,-0.9,3.14]]){g.box(a+dx-0.2,0.42,b+dz-0.2,a+dx+0.2,0.46,b+dz+0.2,16);g.obox(a+dx*1.22,0.68,b+dz*1.22,0.2,0.22,0.02,rot,0,16);for(const q of[-1,1])g.cyl(a+dx+(dz?q*0.17:0),b+dz+(dx?q*0.17:0),0.015,0,0.42,50,false,4);}
        if(r()<0.4)g.box(a-0.2,0.76,b-0.15,a+0.2,0.79,b+0.15,[48,36][k%2],false);}
      g.box(19,0,-2,23.7,2.6,-1.9,50);g.box(19,0,1.9,23.7,2.6,2,50);g.box(19,2.6,-2,23.7,2.8,2,50,false);g.box(23.6,0,-1.9,23.7,2.6,1.9,17,false);
      g.box(18.95,0,-1.95,19.0,2.6,-1.75,50,false);g.box(18.95,0,1.75,19.0,2.6,1.95,50,false);
      g.box(18.9,2.65,-0.6,19,3.0,0.6,12,false);g.box(18.88,2.72,-0.4,18.9,2.93,0.4,61,false);g.box(18.95,1.1,2.05,19,1.4,2.25,12,false);g.cyl(18.97,2.15,0.04,1.2,1.3,25,false,8);g.hdoor(21.5,0);
      c3sign(g,21,3.2,-2.05,3,0.45,true,-1,17,r);
    }
    if(T===6){ /* un pan de plafond tombé, des dalles au sol, de l'eau qui goutte */
      for(let k=0;k<10;k++){const a=-8+r()*16,b=-4+r()*8;g.obox(a,0.06+r()*0.2,b,0.3+r()*0.3,0.02,0.3+r()*0.3,r()*3,0.2*(r()-0.5),32);}
      g.obox(2,2.5,0,2.2,0.04,0.6,0.3,0.9,0,false);g.water(-3,-2,3,2,0.01,-0.01);if(r()<0.6)g.statue(-10+r()*20,(r()<0.5?-1:1)*3.5);}
  }
  if(T===1&&r()<0.4)g.guard(-22,2.8,22,2.8);else if(T===1&&r()<0.25)g.statue(-20+r()*40,(r()<0.5?-1:1)*4.5);
  if(r()<0.3)g.npc(-6+r()*12,0,(r()<0.5?-1:1)*3,r()*6.28);
  if(r()<0.5)g.item(-20+r()*40,1.1,(r()<0.5?-1:1)*3.6);
}

/* ---- cinéma : des salles, des fauteuils rouges, un écran qui attend son film ---- */
const SCREEN_W=11,SCREEN_H=4.6,SCREEN_BW=19,SCREEN_BH=8.2;
function c3seat(g,a,y,z){ /* fauteuil de cinéma : assise, dossier incliné, accoudoir */
  g.box(a-0.25,y,z+0.12,a+0.25,y+0.45,z+0.58,48);g.obox(a,y+0.78,z+0.66,0.25,0.36,0.06,0,0.18,48);g.box(a+0.26,y+0.3,z+0.12,a+0.33,y+0.66,z+0.62,12,false);
}
function cinemaCell(g,c,i,j,r){
  const T=c.type;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,58);
  if(T===0||T===2||T===5){ /* le hall : confiserie, affiches, cordons */
    const H=4.2;g.box(-24,H,-24,24,H+0.4,24,0);
    for(let a=-20;a<=20;a+=8)for(let b=-20;b<=20;b+=8){g.cyl(a,b,0.4,H-0.05,H,12,false,14);g.cyl(a,b,0.32,H-0.06,H-0.05,r()<0.3?47:25,false,14);}
    for(const s of[-1,1])for(let a=-18;a<=18;a+=9){const z=s*17;g.box(a-1.15,0,z-0.1,a+1.15,3.3,z+0.1,12);g.box(a-1.05,0.25,z-s*0.12,a+1.05,3.15,z-s*0.1,25,false);
      const m1=[34,47,49,36,48][Math.floor(r()*5)],m2=[0,28,16,35][Math.floor(r()*4)];g.box(a-0.95,0.35,z-s*0.14,a+0.95,3.05,z-s*0.12,m1,false);
      g.ell(a,1.7,z-s*0.15,0.45,0.75,0.01,m2,ICO2);g.box(a-0.8,2.6,z-s*0.16,a+0.8,2.9,z-s*0.15,0,false);g.box(a-0.6,0.5,z-s*0.16,a+0.6,0.65,z-s*0.15,0,false);}
    if(T===2){ /* la confiserie : vitrine à bonbons, machine à pop-corn, menus lumineux */
      g.box(-6,0,-8,6,1.0,-6.8,41);g.box(-6.05,1.0,-8.05,6.05,1.04,-6.75,59,false);g.box(-6,0.15,-6.82,6,0.95,-6.8,13,false);
      for(let k=0;k<20;k++)g.box(-5.8+k*0.58,0.2,-7.4,-5.4+k*0.58,0.5+(k%3)*0.1,-7.0,[34,35,36,49,48][k%5],false);
      g.box(-5,1.04,-7.9,-3.4,2.5,-7.1,48);g.box(-4.9,1.2,-7.12,-3.5,2.3,-7.08,13,false);g.ell(-4.2,1.35,-7.5,0.65,0.25,0.3,36,ICO2);g.box(-5.05,2.5,-7.95,-3.35,2.75,-7.05,25,false);
      g.box(2.5,1.04,-7.9,4.5,1.8,-7.2,50);for(let q=0;q<3;q++)g.cyl(2.9+q*0.6,-7.25,0.04,1.4,1.55,12,false,6);
      for(let k=0;k<4;k++){const a=-4.5+k*3;g.box(a-1.3,2.4,-8.25,a+1.3,3.7,-8.2,12,false);for(let q=0;q<4;q++){g.box(a-1.15,3.4-q*0.27,-8.2,a-0.3,3.55-q*0.27,-8.18,61,false);g.box(a+0.6,3.4-q*0.27,-8.2,a+1.1,3.55-q*0.27,-8.18,25,false);}}
      g.box(-6,0,-8.3,6,4.2,-8.25,41);g.npc(0,0,-9,0);if(r()<0.6)g.note(2,1.15,-7.2);}
    for(let k=0;k<6;k++){const a=-15+k*6;g.cyl(a,4,0.05,0,0.95,50,false,8);g.sphere(a,1.0,4,0.08,50,ICO1);if(k<5){for(let q=0;q<6;q++){const t=(q+0.5)/6,a2=a+t*6,sag=Math.sin(t*3.1416)*0.18;g.box(a2-0.5,0.82-sag,3.97,a2+0.5,0.86-sag,4.03,48,false);}}}
    if(T===0&&r()<0.5)g.guard(-20,0,20,0);else if(r()<0.4)g.guard(-20,-2,20,-2);
    g.item(-14+r()*28,1.1,-14+r()*6);return;}
  /* une salle : murs tendus, gradins, écran entre deux rideaux, projecteur au dernier rang */
  const big=T===3,W=big?22:15,L=big?22:21,H=big?20:9;
  g.box(-W,H,-L,W,H+0.5,L,0,false);
  for(const s of[-1,1]){ /* les murs latéraux, percés près de l'écran d'une porte vers le couloir */
    g.box(s*W,0,-L,s*(W+0.3),H,-L+1.2,58);g.box(s*W,2.6,-L+1.2,s*(W+0.3),H,-L+3.4,58);g.box(s*W,0,-L+3.4,s*(W+0.3),H,L,58);
    g.box(s*W-0.02,2.65,-L+1.8,s*W+0.02,2.95,-L+2.8,29,false);
    for(let b=-L+5;b<L;b+=4)g.box(s*W-s*0.05,0.5,b,s*W,H-1,b+1.6,12,false);
    for(let b=-L+6;b<L;b+=6){g.box(s*W-s*0.12,3.2,b-0.15,s*W,3.6,b+0.15,12,false);g.box(s*W-s*0.13,3.25,b-0.1,s*W-s*0.12,3.55,b+0.1,25,false);}}
  g.box(-W,0,-L-0.3,W,H,-L,12);g.box(-W,0,L,W,H,L+0.3,58);
  for(const s of[-1,1]){g.box(s*(W+0.3),4.2,-24,s*24,4.5,24,0,false);g.box(-W-0.3,4.2,s*(L+0.3),W+0.3,4.5,s*24,0,false);}
  for(const s of[-1,1])for(let b=-18;b<=18;b+=9){g.box(s*(W+0.32),0.9,b-0.85,s*(W+0.36),3.1,b+0.85,25,false);g.box(s*(W+0.36),1.0,b-0.75,s*(W+0.38),3.0,b+0.75,[34,47,49,36][Math.floor(r()*4)],false);g.ell(s*(W+0.39),1.8,b,0.01,0.6,0.35,[0,28,16][Math.floor(r()*3)],ICO2);}
  const sw=big?SCREEN_BW:SCREEN_W,sh=big?SCREEN_BH:SCREEN_H,sy=big?3:1.6;
  g.box(-sw/2-0.4,sy-0.4,-L+0.02,sw/2+0.4,sy+sh+0.4,-L+0.1,12,false);g.box(-sw/2,sy,-L+0.1,sw/2,sy+sh,-L+0.13,0,false);
  for(const s of[-1,1])for(let q=0;q<10;q++){const a=s*(sw/2+0.4+q*0.3);g.box(a-0.15,0,-L+0.2+(q%2)*0.12,a+0.15,H-0.5,-L+0.35+(q%2)*0.12,48,false);}
  for(let q=0;q<Math.ceil((sw+6)/0.6);q++){const a=-sw/2-3+q*0.6;g.box(a,sy+sh+0.4,-L+0.15+(q%2)*0.08,a+0.6,H,-L+0.3+(q%2)*0.08,48,false);}
  g.box(-W,0,-L,W,0.4,-L+5,41);g.box(-W,0.4,-L+4.98,W,0.42,-L+5.02,25,false);
  const rows=big?14:11,rise=big?0.5:0.38,z0=-L+(big?10:7);
  for(let k=0;k<rows;k++){const z=z0+k*1.2,y=k*rise;
    g.box(-W,0,z,W,y+0.001,z+1.2,58);g.box(-W,y-0.02,z-0.01,W,y+0.002,z+0.03,25,false);
    for(let a=-W+1.2;a<=W-1.2;a+=0.65){if(Math.abs(a)<1.0)continue;if(T===4&&r()<0.4)continue;c3seat(g,a,y,z);}
    if(k===0)for(const a of[-1.6,1.6])g.hdoor(a,z+0.35);}
  const yt=(rows-1)*rise,zt=z0+rows*1.2;g.box(-W,0,zt,W,yt,L,58);
  /* le projecteur : boîtier, deux bobines, l'objectif tourné vers l'écran */
  const P=(px,big)=>{g.box(px-0.45,yt,L-2.6,px+0.45,yt+0.95,L-1.8,12);g.box(px-0.3,yt+0.95,L-2.75,px+0.3,yt+1.35,L-1.65,50);
    for(const dz of[-0.35,0.35])g.ell(px,yt+1.75,L-2.2+dz,0.03,0.38,0.38,12,ICO2);g.cyl(px,L-2.85,0.11,yt+1.07,yt+1.25,13,false,10);g.box(px-0.05,yt+1.1,L-2.95,px+0.05,yt+1.2,L-2.75,12,false);
    g.box(-1.2,yt+2.2,L-0.05,1.2,yt+3,L,13,false);g.phone(px,yt+1.3,L-2.2);};
  if(!big){g.screen(0,sy,-L+0.14,false);P(0);}else{g.screen(0,sy,-L+0.14,true);P(0);}
  if(T===6&&isFar(i,j,6,3))g.souv(1.8,0.62,z0+0.35);
  if(r()<0.5)g.item(-W+3+r()*(2*W-6),yt*0.5+1.4,z0+rows*0.6);
  if(r()<0.35)g.npc((r()-0.5)*8,0,-L+3,r()*6.28);
  {const sg=r()<0.5?-1:1;if(r()<0.4)g.guard(sg*(W+1.2),-18,sg*(W+1.2),18);}
  g.item((r()<0.5?-1:1)*(W+1.2),1.1,-10+r()*20);
}

/* ---- salle d'arcade : bornes, néons, moquette fluo, le comptoir des lots ---- */
function cabinet(g,a,b,f,r,lit){ /* borne : caisson, écran incliné, panneau de commandes, monnayeur, fronton lumineux */
  const B=(x0,y0,z0,x1,y1,z1,m,s)=>g.box(x0,y0,Math.min(b+f*z0,b+f*z1),x1,y1,Math.max(b+f*z0,b+f*z1),m,s);const yaw=f>0?0:Math.PI;
  const body=lit?[12,48,49,47][Math.floor(r()*4)]:12;
  B(a-0.38,0,-0.35,a+0.38,0.95,0.32,body);B(a-0.38,0.95,-0.35,a+0.38,1.95,0.05,body);
  for(const s of[-1,1])B(a+s*0.38-0.02,0,-0.36,a+s*0.38+0.02,2.12,0.34,12,false);
  g.obox(a,1.4,b+f*0.16,0.34,0.32,0.03,yaw,-0.32,12);g.obox(a,1.41,b+f*0.19,0.29,0.26,0.005,yaw,-0.32,lit?[29,61,71,72][Math.floor(r()*4)]:47);
  g.obox(a,1.0,b+f*0.45,0.37,0.03,0.17,yaw,0.25,12);
  B(a-0.17,1.0,0.43,a-0.15,1.12,0.45,50,false);B(a-0.19,1.12,0.42,a-0.13,1.17,0.46,48,false);
  for(let q=0;q<3;q++)B(a+q*0.09,1.02,0.41+q*0.015,a+0.05+q*0.09,1.06,0.45+q*0.015,[48,36,49][q],false);
  B(a-0.15,0.35,0.32,a+0.15,0.6,0.335,12,false);B(a-0.1,0.48,0.335,a-0.05,0.53,0.34,lit?25:47,false);B(a+0.05,0.48,0.335,a+0.1,0.53,0.34,lit?25:47,false);
  B(a-0.38,1.95,-0.35,a+0.38,2.25,0.18,12);B(a-0.34,1.98,0.18,a+0.34,2.22,0.19,lit?(r()<0.5?71:72):47,false);
  if(lit)for(let q=0;q<4;q++)B(a-0.28+q*0.15,2.04,0.19,a-0.2+q*0.15,2.16,0.195,12,false);
}
function clawMachine(g,a,b,m,r){
  g.box(a-0.75,0,b-0.75,a+0.75,0.85,b+0.75,m);g.box(a-0.75,0.85,b-0.75,a+0.75,2.2,b+0.75,13,false);for(const s of[-1,1])for(const t of[-1,1])g.box(a+s*0.73-0.02,0.85,b+t*0.73-0.02,a+s*0.73+0.02,2.2,b+t*0.73+0.02,50,false);
  g.box(a-0.8,2.2,b-0.8,a+0.8,2.55,b+0.8,m);g.box(a-0.6,2.25,b+0.8,a+0.6,2.5,b+0.81,72,false);
  for(let q=0;q<5;q++)c3bear(g,a-0.4+(q%3)*0.4,0.85+(q>2?0.15:0),b-0.3+Math.floor(q/3)*0.5,0.5,34+q%4);
  g.cyl(a+0.2,b-0.1,0.012,1.7,2.2,50,false,4);g.cyl(a+0.2,b-0.1,0.07,1.62,1.72,50,false,8);for(let q=0;q<3;q++){const t=q*2.09;g.obox(a+0.2+Math.cos(t)*0.07,1.52,b-0.1+Math.sin(t)*0.07,0.012,0.12,0.012,t,0.35,50);}
  g.box(a+0.35,0.3,b+0.75,a+0.65,0.65,b+0.77,47,false);g.box(a-0.6,0.85,b+0.76,a+0.1,0.88,b+0.95,12,false);g.sphere(a-0.35,0.95,b+0.85,0.05,48,ICO1);g.solid(a-0.75,0,b-0.75,a+0.75,2.55,b+0.75);
}
function arcadeCell(g,c,i,j,r){
  const T=c.type,H=4;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,69);g.box(-24,H,-24,24,H+0.4,24,12);
  const dark=T===4;
  for(let a=-20;a<=20;a+=8)for(let b=-20;b<=20;b+=8){if(dark&&r()<0.8)continue;const m=r()<0.5?71:72;g.box(a+4-1.2,H-0.06,b+4-0.04,a+4+1.2,H-0.02,b+4+0.04,m,false);g.box(a+4-1.25,H-0.02,b+4-0.06,a+4+1.25,H,b+4+0.06,12,false);}
  for(const a of[-12,12])for(const b of[-12,12]){g.box(a-0.4,0,b-0.4,a+0.4,H,b+0.4,12);for(const s of[-1,1]){g.box(a+s*0.4-0.01,0.2,b-0.3,a+s*0.4+0.01,H-0.2,b-0.26,72,false);g.box(a-0.3,0.2,b+s*0.4-0.01,a-0.26,H-0.2,b+s*0.4+0.01,71,false);}}
  let act=-1;if(T===1||T===6)act=Math.floor(r()*14);
  if(T===1||T===4||T===0){ /* rangées de bornes dos à dos */
    let n=0;for(const b of[-6,6])for(let a=-21;a<=21;a+=0.95){if(Math.abs(a)<1.5)continue;if(r()<0.1)continue;
      const lit=!dark&&r()<0.8;cabinet(g,a,b-0.4,-1,r,lit);cabinet(g,a,b+0.4,1,r,lit&&r()<0.85);
      if(n++===act){g.phone(a,1.0,b+1.05);}}
    if(r()<0.35)g.guard(-22,0,22,0);if(r()<0.3)g.npc(-10+r()*20,0,11,r()*6.28);
    if(r()<0.5)g.item(-20+r()*40,1.1,(r()<0.5?-1:1)*11);
  }else if(T===2){ /* pinces à peluches */
    for(let k=0;k<6;k++)clawMachine(g,-15+k*6,-8,[48,49,34,72][k%4],r);
    for(let k=0;k<8;k++)cabinet(g,-12+k*1.0,10,-1,r,true);g.phone(-8.5,1.0,9.0);
    g.item(0,1.1,0);if(r()<0.5)g.guard(-20,2,20,2);
  }else if(T===3){ /* le comptoir des lots : tickets contre peluches */
    g.box(-8,0,-2,8,1.05,-1,41);g.box(-8.05,1.05,-2.05,8.05,1.1,-0.95,59,false);g.box(-8,0.2,-0.98,8,0.95,-0.96,13,false);
    for(let k=0;k<26;k++)g.box(-7.6+k*0.6,0.25,-1.6,-7.3+k*0.6,0.4+(k%3)*0.1,-1.2,[34,35,36,49,48][k%5],false);
    for(const y of[1.4,2.1,2.8]){g.box(-9,y,-5,9,y+0.05,-4.4,41,false);for(let k=0;k<8;k++)c3bear(g,-7.8+k*2.2,y+0.05,-4.7,0.7,34+(k+Math.floor(y*3))%4);}
    g.box(-9,0,-5,9,3.4,-4.95,12);c3sign(g,0,3.45,-4.9,8,0.5,true,1,72,r);g.npc(3,0,-3.4,0);
    for(let q=0;q<3;q++){g.box(-5+q*0.4,1.1,-1.7,-4.75+q*0.4,1.12+q*0.02,-1.3,36,false);}
    if(isFar(i,j,3,3))g.souv(-2,1.2,-1.1);else if(r()<0.5)g.item(6,1.4,-1.1);
    for(let k=0;k<8;k++)cabinet(g,-15+k*4.3,12,-1,r,true);
  }else if(T===5){ /* au fond, la borne à deux joueurs qui clignote : la vôtre */
    for(let k=0;k<12;k++)cabinet(g,-18+k*3.3,-14,1,r,false);
    cabinet(g,-0.45,0,1,r,true);cabinet(g,0.45,0,1,r,true);g.box(-1.2,2.25,-0.35,1.2,2.8,0.2,71,false);for(let q=0;q<6;q++)g.box(-1.0+q*0.36,2.38,0.2,-0.8+q*0.36,2.68,0.21,12,false);g.hdoor(0,1.2);
    g.box(-1.2,0,1.4,1.2,0.01,2.6,72,false);g.item(-10,1.1,8);
  }else{ /* skee-ball, air hockey, photomaton */
    for(let k=0;k<4;k++){const a=-16+k*2;g.span(a,0.55,-2,a,1.1,-6.5,0.9,0.06,41,true);for(const s of[-1,1])g.span(a+s*0.47,0.85,-2,a+s*0.47,1.4,-6.5,0.05,0.5,12,false);
      g.box(a-0.5,0,-1.9,a+0.5,0.55,-1.1,12);g.box(a-0.5,0,-8,a+0.5,2.6,-6.5,12);for(let q=0;q<3;q++)g.cyl(a,-6.6,0.18+q*0.12,1.1+q*0.25,1.15+q*0.25,q?0:48,false,14);g.box(a-0.4,2.1,-6.49,a+0.4,2.45,-6.47,61,false);
      for(let q=0;q<4;q++)g.sphere(a-0.3+q*0.2,0.6,-1.3,0.06,[48,36,49,0][q],ICO1);}
    for(let k=0;k<2;k++){const a=2+k*7,b=-4;g.box(a-1.2,0,b-2.2,a+1.2,0.8,b+2.2,12);g.box(a-1.1,0.8,b-2.1,a+1.1,0.82,b+2.1,0,false);g.box(a-1.1,0.82,b-0.02,a+1.1,0.83,b+0.02,72,false);
      for(const s of[-1,1]){g.box(a-1.2,0.8,b+s*2.2-0.05,a+1.2,0.92,b+s*2.2+0.05,71,false);g.box(a-1.2,0.8,b-2.2,a-1.1,0.92,b+2.2,71,false);g.box(a+1.1,0.8,b-2.2,a+1.2,0.92,b+2.2,71,false);g.cyl(a,b+s*1.6,0.1,0.82,0.9,48,false,12);}
      g.cyl(a+0.3,b+0.4,0.06,0.82,0.84,12,false,10);g.box(a-0.8,2.4,b-0.3,a+0.8,2.8,b+0.3,61,false);g.box(a-0.02,2.8,b-0.02,a+0.02,H,b+0.02,12,false);}
    g.box(10,0,8,12.2,2.4,10.6,48);g.box(10.4,0.4,7.95,11.8,2.1,8,47,false);g.box(9.6,2.4,7.9,12.6,2.7,10.7,72,false);g.box(10.2,0.2,7.9,11.1,2.2,7.92,16,false);
    for(let k=0;k<6;k++)cabinet(g,-20+k*0.95,14,-1,r,true);if(act>=0)g.phone(-17.2,1.0,13.0);
    if(r()<0.4)g.npc(4,0,6,0);g.item(0,1.1,10);
  }
}

/* ---- lettres de néon : de vraies lettres, en tubes ---- */
const GLYPH={A:[[0,0,.3,1],[.3,1,.6,0],[.12,.4,.48,.4]],B:[[0,0,0,1],[0,1,.45,1],[.45,1,.6,.8],[.6,.8,.45,.55],[0,.55,.45,.55],[.45,.55,.6,.3],[.6,.3,.45,0],[.45,0,0,0]],
  C:[[.6,1,0,1],[0,1,0,0],[0,0,.6,0]],E:[[.6,1,0,1],[0,1,0,0],[0,0,.6,0],[0,.5,.45,.5]],G:[[.6,1,0,1],[0,1,0,0],[0,0,.6,0],[.6,0,.6,.45],[.6,.45,.3,.45]],
  H:[[0,0,0,1],[.6,0,.6,1],[0,.5,.6,.5]],I:[[.08,0,.08,1]],D:[[0,0,0,1],[0,1,.4,1],[.4,1,.6,.75],[.6,.75,.6,.25],[.6,.25,.4,0],[.4,0,0,0]],K:[[0,0,0,1],[0,.45,.6,1],[.15,.6,.6,0]],L:[[0,1,0,0],[0,0,.55,0]],N:[[0,0,0,1],[0,1,.6,0],[.6,0,.6,1]],
  O:[[0,0,0,1],[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0]],R:[[0,0,0,1],[0,1,.6,1],[.6,1,.6,.55],[.6,.55,0,.55],[.2,.55,.6,0]],S:[[.6,1,0,1],[0,1,0,.5],[0,.5,.6,.5],[.6,.5,.6,0],[.6,0,0,0]],
  T:[[0,1,.6,1],[.3,1,.3,0]],P:[[0,0,0,1],[0,1,.6,1],[.6,1,.6,.55],[.6,.55,0,.55]],U:[[0,1,0,0],[0,0,.6,0],[.6,0,.6,1]],V:[[0,1,.3,0],[.3,0,.6,1]],W:[[0,1,.1,0],[.1,0,.3,.5],[.3,.5,.5,0],[.5,0,.6,1]],
  '0':[[0,0,0,1],[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0]],'1':[[.15,.8,.35,1],[.35,1,.35,0]],'2':[[0,1,.6,1],[.6,1,.6,.5],[.6,.5,0,.5],[0,.5,0,0],[0,0,.6,0]],
  '3':[[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0],[.15,.5,.6,.5]],'4':[[0,1,0,.5],[0,.5,.6,.5],[.6,1,.6,0]],'5':[[.6,1,0,1],[0,1,0,.5],[0,.5,.6,.5],[.6,.5,.6,0],[.6,0,0,0]],
  '6':[[.6,1,0,1],[0,1,0,0],[0,0,.6,0],[.6,0,.6,.5],[.6,.5,0,.5]],'7':[[0,1,.6,1],[.6,1,.25,0]],'8':[[0,0,0,1],[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0],[0,.5,.6,.5]],
  '9':[[.6,.5,0,.5],[0,.5,0,1],[0,1,.6,1],[.6,1,.6,0],[.6,0,0,0]]};
/* x,y,z : bas gauche du texte ; ux,uz : sens de lecture (unitaire) ; sz : hauteur des lettres */
function neonText(g,x,y,z,ux,uz,sz,txt,m,r0){r0=r0||sz*0.045;let o=0;
  for(const ch of txt){const G=GLYPH[ch];if(G)for(const [a0,b0,a1,b1] of G)g.rod(x+ux*(o+a0*sz),y+b0*sz,z+uz*(o+a0*sz),x+ux*(o+a1*sz),y+b1*sz,z+uz*(o+a1*sz),r0,m,5);o+=sz*(ADV[ch]||0.85);}
  return o;}
const ADV={I:0.4,'1':0.6,' ':0.5};
const textW=(t,sz)=>[...t].reduce((w,ch)=>w+sz*(ADV[ch]||0.85),0)-sz*0.25;

/* ---- bowling : dix pistes d'érable ciré, des quilles sous la lumière, des néons ---- */
function pins(g,a,b,S){S=S||1;for(let row=0;row<4;row++)for(let k=0;k<=row;k++){const x=a+(k-row/2)*0.3*S,z=b-row*0.26*S;
  g.ell(x,0.17*S,z,0.062*S,0.17*S,0.062*S,0,S>1?ICO2:ICO1);g.cyl(x,z,0.033*S,0.28*S,0.31*S,48,false,6);g.sphere(x,0.36*S,z,0.04*S,0,S>1?ICO1:ICO0);}}
function ballReturn(g,a,z0,dark){ /* capot arrondi, rails chromés, boules de couleur */
  g.box(a-0.32,0,z0,a+0.32,0.55,z0+1.4,47);g.ell(a,0.55,z0+0.35,0.34,0.32,0.4,dark?12:49,ICO1);
  for(const s of[-1,1])g.rod(a+s*0.12,0.72,z0+0.55,a+s*0.12,0.72,z0+1.45,0.018,50,6);
  for(let q=0;q<4;q++)g.sphere(a,0.79,z0+0.72+q*0.23,0.11,[48,49,72,34][q],ICO1);
  g.box(a-0.06,0,z0-0.02,a+0.06,0.07,z0+0.02,47,false);}
function bowlCell(g,c,i,j,r){
  const T=c.type,H=4.2;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,58);
  if(T===5){ /* la piste géante : on est la boule */
    g.box(-24,H*4,-24,24,H*4+0.5,24,12,false);g.box(-10,0,-24,10,0.12,24,88);for(const s of[-1,1])g.rod(s*11,-0.2,-24,s*11,-0.2,24,1.0,50,10);
    for(let k=0;k<7;k++)g.obox(-6+k*2,0.125,2,0.3,0.004,0.7,0,0,47);for(let k=0;k<10;k++)g.cyl(-7+k*1.55,12,0.12,0.12,0.125,47,false,10);
    pins(g,0,-14,10);g.item(0,1.1,0);g.statue(14,0);g.statue(-15,-8);
    for(const s of[-1,1])g.box(s*16,0,-24,s*24,H*4,24,12);neonText(g,-textW('STRIKE',2.4)/2,H*2.4,-23.5,1,0,2.4,'STRIKE',71,0.09);return;}
  g.box(-24,H,-24,24,H+0.4,24,12);
  if(T===3||T===4){ /* salle des anniversaires / comptoir des chaussures */
    g.box(-24,0,-24,24,H,-23.7,0);
    if(T===3){for(let k=0;k<4;k++){const a=-15+k*10;g.box(a-2,0.72,-5,a+2,0.78,5,0);g.box(a-1.9,0.78,-4.9,a+1.9,0.785,4.9,34,false);for(const s of[-1,1])for(const t of[-1,1])g.rod(a+s*1.8,0,t*4.7,a+s*1.8,0.72,t*4.7,0.03,50,6);
        for(let q=0;q<6;q++){const z=-4+q*1.6;if(Math.abs(z)<0.5)continue;for(const s of[-1,1]){g.box(a+s*2.4-0.2,0.42,z-0.2,a+s*2.4+0.2,0.46,z+0.2,16);g.obox(a+s*2.62,0.68,z,0.02,0.22,0.2,0,0,16);for(const t of[-1,1])for(const u of[-1,1])g.rod(a+s*2.4+t*0.16,0,z+u*0.16,a+s*2.4+t*0.16,0.42,z+u*0.16,0.012,50,4);}}
        g.cyl(a,0,0.3,0.78,0.98,34,false,16);g.cyl(a,0,0.22,0.98,1.12,0,false,16);g.cyl(a,0,0.23,1.12,1.14,48,false,16);for(let q=0;q<6;q++)g.cyl(a+Math.cos(q)*0.15,Math.sin(q)*0.15,0.008,1.14,1.22,36,false,4);
        for(let q=0;q<3;q++){const x=a-1.5+q*1.5,z=4+r();g.rod(x,0.78,z,x,2.6,z,0.004,0,3);g.ell(x,2.8,z,0.25,0.3,0.25,34+q,ICO1);}
        for(let q=0;q<2;q++){const z=-3+q*6;g.box(a+0.8,0.78,z-0.2,a+1.2,1.1,z+0.2,[49,48][q]);g.box(a+0.98,0.78,z-0.21,a+1.02,1.11,z+0.21,36,false);}}
      for(let k=0;k<16;k++){const a=-12+k*1.6;g.obox(a,3.2-Math.sin(k*0.39)*0.15,-23.6,0.25,0.3,0.01,0,0,34+k%4);}
      neonText(g,-textW('ANNIVERSAIRES',0.5)/2,2.2,-23.6,1,0,0.5,'ANNIVERSAIRES',71);
      if(isFar(i,j,3,3))g.souv(6.85,0.95,0);else if(r()<0.5)g.item(-5,1.1,0);g.npc(10,0,8,r()*6.28);}
    else{g.box(-10,0,-10,10,1.05,-9,81);g.box(-10.05,1.05,-10.05,10.05,1.1,-8.95,59,false);for(let k=0;k<8;k++)g.box(-9.6+k*2.45,0.15,-8.99,-7.6+k*2.45,0.95,-8.97,81,false);
      for(const y of[0.3,0.9,1.5,2.1]){g.box(-10,y,-13,10,y+0.04,-12.2,50,false);for(let k=0;k<26;k++){const x=-9.6+k*0.75;for(const q of[0,0.14]){g.box(x+q,y+0.04,-12.9,x+q+0.12,y+0.1,-12.45,[48,49,0][k%3],false);g.box(x+q,y+0.04,-12.5,x+q+0.12,y+0.14,-12.35,0,false);}}}
      g.box(-10,0,-13.2,10,2.6,-13.1,12);neonText(g,-textW('CHAUSSURES',0.42)/2,2.75,-13.05,1,0,0.42,'CHAUSSURES',72);g.npc(0,0,-11.5,0);g.statue(-8,4);g.statue(8,-2);g.item(0,1.1,6);
      for(const x of[-6,0,6])c3bench(g,x,4,true,2.4);}
    return;}
  /* dix pistes d'érable, gouttières arrondies, séparations noires ; deux couloirs de service sur les côtés */
  const dark=T===2,N=10,SP=1.9,A0=-(N-1)*SP/2,lane=k=>A0+k*SP;
  g.box(-9.6,0,-23.7,9.6,0.02,14,47,false);
  for(let k=0;k<N;k++){const a=lane(k);
    g.box(a-0.53,0,-22,a+0.53,0.08,17.6,88);
    for(const s of[-1,1])g.rod(a+s*0.645,-0.02,-22,a+s*0.645,-0.02,14,0.1,50,8);
    for(let q=0;q<7;q++){const x=a-0.42+q*0.14;g.obox(x,0.082,9.6-Math.abs(q-3)*0.32,0.03,0.001,0.1,0,0,dark?12:48);g.cyl(x,12.2,0.012,0.081,0.083,47,false,6);}
    g.box(a-0.53,0.08,13.98,a+0.53,0.085,14.02,48,false);
    pins(g,a,-20.6);g.box(a-0.62,0.08,-21.9,a+0.62,0.1,-20.1,0,false);}
  for(let k=0;k<=N;k++){const x=A0-SP/2+k*SP;g.box(x-0.19,0,-22,x+0.19,0.16,14,47);if(!dark)g.rod(x,0.17,-22,x,0.17,14,0.012,k%2?71:72,4);}
  /* la façade des quilles : un grand panneau noir peint de vagues de néon, une rampe de lumière sur les quilles */
  g.box(-9.6,1.25,-22.2,9.6,3.7,-21.95,47,false);g.box(-9.6,1.15,-21.9,9.6,1.25,-21.5,dark?12:17,false);g.box(-9.6,0,-23.7,9.6,H,-23.6,47);
  if(!dark){for(let k=0;k<N;k++){const a=lane(k),m=k%2?71:72;let p=[a-0.85,2.2];for(let q=1;q<=8;q++){const n=[a-0.85+q*0.21,2.2+0.28*Math.sin(q*0.9+k)];g.rod(p[0],p[1],-21.93,n[0],n[1],-21.93,0.025,m,5);p=n;}
      const t=String(k+1);neonText(g,a-textW(t,0.38)/2,2.85,-21.93,1,0,0.38,t,m==71?72:71);}
    neonText(g,-textW('STRIKE',0.55)/2,3.95,-23.55,1,0,0.55,'STRIKE',71);}
  /* les murs de la salle, le bar d'un côté, les râteliers de boules de l'autre */
  for(const s of[-1,1]){g.box(s*18.1,0,-22,s*19,H,14,12);g.box(s*21,0,-22,s*24,H,14,12);
    if(!dark)for(let q=0;q<3;q++)g.rod(s*18.05,0.9+q*0.12,-21.5,s*18.05,0.9+q*0.12,13.5,0.02,[71,72,71][q],5);}
  if(!dark){const L='BOWLING',sz=1.3;neonText(g,-18.04,2.2,6+textW(L,sz)/2,0,-1,sz,L,72,0.05);neonText(g,18.04,2.2,6-textW(L,sz)/2,0,1,sz,L,71,0.05);}
  /* le bar, à gauche */
  g.box(-17.2,0,-14,-16.2,1.05,-2,81);g.box(-17.25,1.05,-14.05,-16.05,1.1,-1.95,50,false);g.box(-16.21,0.1,-14,-16.19,0.95,-2,78,false);
  g.box(-18.05,1.0,-14,-17.75,2.6,-2,81,false);for(const y of[1.35,1.95])g.box(-18.05,y,-14,-17.6,y+0.03,-2,13,false);
  for(let q=0;q<22;q++){const z=-13.6+q*0.53,y=q%2?1.38:1.98;g.cone(-17.8,z,0.04,0.03,y,y+0.24,[13,51,48,36][q%4],6);}
  for(let q=0;q<5;q++){const z=-12.8+q*2.4;g.rod(-15.6,0,z,-15.6,0.72,z,0.025,50,6);g.cone(-15.6,z,0.17,0.17,0.72,0.8,48,12);g.torus(-15.6,0.3,z,0.13,0.01,[0,1,0],50,10,3);}
  if(!dark)neonText(g,-18.04,2.75,-6.6,0,-1,0.6,'BAR',71,0.03);
  /* les râteliers de boules, à droite */
  for(const z of[-12,-6]){for(const y of[0.45,0.95])for(const t of[-1,1])g.rod(16.6+t*0.12,y,z-2,16.6+t*0.12,y,z+2,0.02,50,6);
    for(const zz of[z-2,z+2])g.rod(16.6,0,zz,16.6,1.0,zz,0.03,50,6);
    for(let q=0;q<14;q++)g.sphere(16.6,q<7?0.56:1.06,z-1.7+(q%7)*0.57,0.11,[48,49,72,34,51,36,71][(q+Math.floor(z))%7],ICO1);}
  for(let q=0;q<3;q++)c3bench(g,15.2,2+q*3,false,2.2);
  g.box(-24,0,-24,-21,H,-23.7,12);g.box(-19,0,-24,19,H,-23.7,12);g.box(21,0,-24,24,H,-23.7,12);
  /* l'aire de lancer : moquette, retours de boules, canapés en arc, écrans des scores */
  g.box(-18,0.005,17.6,18,0.012,24,58,false);
  for(let p=0;p<N/2;p++){const ac=(lane(2*p)+lane(2*p+1))/2;ballReturn(g,ac,14.3,dark);
    sofa2(g,ac,19.9,0.95,1,[49,48,83,49,48][p],50);for(const s of[-1,1])g.ell(ac+s*1.5,0.3,18.6,0.28,0.3,0.28,[49,48,83,49,48][p],ICO1);
    g.box(ac-0.25,0,17.9,ac+0.25,0.7,18.2,47);g.obox(ac,0.82,18.05,0.24,0.16,0.02,Math.PI,0.45,12);g.obox(ac,0.82,18.03,0.21,0.13,0.005,Math.PI,0.45,dark?47:61);
    for(const q of[-0.55,0.55]){g.box(ac+q-0.5,2.95,14.3,ac+q+0.5,3.6,14.42,12,false);g.box(ac+q-0.46,2.99,14.28,ac+q+0.46,3.56,14.3,dark?47:61,false);}
    g.rod(ac,3.6,14.36,ac,H,14.36,0.02,50,5);}
  for(let k=0;k<6;k++)g.cyl(-15+k*6,16,0.25,H-0.02,H,dark?12:17,false,10);
  const act=dark?-1:Math.floor(r()*(N/2));if(act>=0){const ac=(lane(2*act)+lane(2*act+1))/2;g.phone(ac,0.85,14.9);}
  if(!dark)for(let k=0;k<N;k++)g.hdoor(lane(k),-20.2);
  for(let k=0;k<2;k++)if(r()<0.5)g.statue(lane(Math.floor(r()*N)),-6+r()*14);
  if(r()<0.35)g.npc(-10+r()*20,0,21.5,r()*6.28);
  g.item(lane(Math.floor(r()*N)),1.1,-4+r()*10);
}

/* ---- parc aquatique vidé : bassins secs, toboggans, palmiers morts sous la verrière ---- */
function basin(g,a0,b0,a1,b1,D,steps){ /* un trou carrelé, profond de D, une margelle, une échelle chromée */
  g.box(a0,-D-0.8,b0,a1,-D,b1,10);
  g.box(a0-0.3,-D,b0-0.3,a1+0.3,0,b0,10);g.box(a0-0.3,-D,b1,a1+0.3,0,b1+0.3,10);g.box(a0-0.3,-D,b0,a0,0,b1,10);g.box(a1,-D,b0,a1+0.3,0,b1,10);
  g.box(a0-0.6,0,b0-0.6,a1+0.6,0.06,b0,0,false);g.box(a0-0.6,0,b1,a1+0.6,0.06,b1+0.6,0,false);g.box(a0-0.6,0,b0,a0,0.06,b1,0,false);g.box(a1,0,b0,a1+0.6,0.06,b1,0,false);
  for(let a=a0+2.5;a<a1-1;a+=2.5)g.box(a-0.1,-D+0.001,b0+1,a+0.1,-D+0.004,b1-1,47,false);
  for(const s of[-1,1]){const x=(a0+a1)/2+s*0.3,z=b0+0.05;g.cyl(x,z+0.15,0.025,-D*0.6,0.9,50,false,6);g.span(x,0.9,z+0.15,x,0.9,z-0.3,0.05,0.05,50,false);g.cyl(x,z-0.3,0.025,0,0.9,50,false,6);}
  for(let q=0;q<4;q++)g.box((a0+a1)/2-0.3,-0.4-q*0.5,b0+0.02,(a0+a1)/2+0.3,-0.37-q*0.5,b0+0.18,50,false);
  if(steps){const n=Math.ceil(D/0.25);for(let k=0;k<n;k++){g.box(a0,-D,b1-0.42*(k+1),a0+2.2,-0.25*(k+1),b1-0.42*k,10);g.box(a0,-0.25*(k+1),b1-0.42*(k+1),a0+2.2,-0.25*(k+1)+0.01,b1-0.42*(k+1)+0.04,0,false);}}
  g.water(a0,b0,a1,b1,-D+0.06,-D);
}
function tube(g,pts,w,cols){ /* toboggan : une gouttière de couleur portée par des piliers */
  for(let k=0;k<pts.length-1;k++){const p=pts[k],q=pts[k+1],m=cols[Math.floor(k/3)%cols.length];
    g.span(p[0],p[1],p[2],q[0],q[1],q[2],w,0.08,m,true);
    const dx=q[0]-p[0],dz=q[2]-p[2],h=Math.hypot(dx,dz)||1,nx=-dz/h,nz=dx/h;
    for(const s of[-1,1])g.span(p[0]+nx*s*w/2,p[1]+0.3,p[2]+nz*s*w/2,q[0]+nx*s*w/2,q[1]+0.3,q[2]+nz*s*w/2,0.08,0.6,m,false);
    if(k%5===0&&p[1]>0.8)g.cyl(p[0],p[2],0.12,0,p[1]-0.05,0,false,8);}
}
function aquaCell(g,c,i,j,r){
  const T=c.type,H=T===3?44:16;g.m=SYM[0];
  const pool=T===1?[-16,-10,16,10,2.4]:T===4?[-18,-14,18,12,3.2]:T===3?[-10,-20,10,-4,4.5]:null;
  if(pool){const [a0,b0,a1,b1]=pool;g.box(-24,-0.8,-24,24,0,b0-0.3,59);g.box(-24,-0.8,b1+0.3,24,0,24,59);g.box(-24,-0.8,b0-0.3,a0-0.3,0,b1+0.3,59);g.box(a1+0.3,-0.8,b0-0.3,24,0,b1+0.3,59);
    basin(g,a0,b0,a1,b1,pool[4],true);}
  else if(T!==2)g.box(-24,-0.8,-24,24,0,24,59);
  g.box(-24,H,-24,24,H+0.3,24,13,false);for(let a=-24;a<=24;a+=6)g.box(a-0.1,H-0.4,-24,a+0.1,H,24,50,false);for(let b=-24;b<=24;b+=12)g.box(-24,H-0.3,b-0.08,24,H,b+0.08,50,false);
  for(const s of[-1,1])for(const t of[-1,1])g.cyl(s*22,t*22,0.35,0,H,50,true,10);
  const palm=(a,b,h)=>{for(let q=0;q<Math.ceil(h/0.6);q++){const y=q*0.6;g.cyl(a+Math.sin(q*0.3)*0.1,b,0.2-q*0.006,y,y+0.62,41,q===0,8);g.cyl(a+Math.sin(q*0.3)*0.1,b,0.23-q*0.006,y+0.52,y+0.6,62,false,8);}
    for(let q=0;q<9;q++){const t=q*0.7;g.obox(a+Math.sin(t)*1.0,h+0.1-(q%3)*0.15,b+Math.cos(t)*1.0,0.3,0.015,1.1,t,0.35+(q%3)*0.15,q%2?15:62);}g.sphere(a,h,b,0.3,62,ICO1);};
  const lounger=(a,b,m)=>{g.box(a-0.33,0.2,b-0.95,a+0.33,0.3,b+0.4,0);g.obox(a,0.55,b+0.65,0.33,0.05,0.35,0,-0.9,0);g.box(a-0.3,0.3,b-0.9,a+0.3,0.34,b+0.35,m,false);g.obox(a,0.57,b+0.62,0.3,0.03,0.32,0,-0.9,m);
    for(const s of[-1,1])for(const t of[-0.85,0.3])g.box(a+s*0.3-0.02,0,b+t-0.02,a+s*0.3+0.02,0.2,b+t+0.02,0,false);};
  const umbrella=(a,b,m)=>{g.cyl(a,b,0.03,0,2.2,0,false,6);for(let q=0;q<8;q++){const t=q*0.785;g.obox(a+Math.sin(t)*0.6,2.05,b+Math.cos(t)*0.6,0.48,0.015,0.65,t,0.32,q%2?0:m);}};
  if(T===0||T===5){ /* bassin des petits : champignon qui ne coule plus, petit toboggan, canons à eau */
    g.box(-12,0,-12,12,0.02,12,10,false);g.cyl(0,0,0.25,0,2.2,34,true,10);g.ell(0,2.4,0,2.2,0.5,2.2,48,ICO2);for(let k=0;k<6;k++)g.sphere(Math.cos(k)*1.7,2.75,Math.sin(k)*1.7,0.25,0,ICO1);
    for(let k=0;k<5;k++)g.box(-10+k*4.5,0,8,-8.5+k*4.5,0.3,11,[34,35,36,37,49][k]);
    for(let k=0;k<6;k++)g.box(6,k*0.3,-8+k*0.3,8,(k+1)*0.3,-7.7+k*0.3,0);tube(g,[[7,1.8,-6],[7,1.2,-4],[7,0.6,-2],[7,0.15,0]],1.0,[36,34]);
    for(let k=0;k<3;k++){const a=-8+k*3;g.cyl(a,-8,0.15,0,0.9,49,false,10);g.span(a,0.9,-8,a,1.1,-7.3,0.12,0.12,36,false);}
    palm(16,-14,9);palm(-17,14,8);for(let k=0;k<4;k++){lounger(-20,-6+k*2,[49,36,34][k%3]);}umbrella(-18.5,-3,48);
    if(r()<0.5)g.note(5,0.4,-6);if(T===5)g.statue(-6+r()*12,-10);g.item(-8,1.1,-8);
  }else if(T===1){ /* le grand bassin vide, les transats alignés, la chaise du maître-nageur */
    for(let k=0;k<9;k++){const a=-18+k*4.5;lounger(a,15,[49,36,34][k%3]);if(k%3===1)umbrella(a+2.2,15.5,[48,49][k%2]);}
    if(isFar(i,j,1,3))g.souv(-9,0.4,14.6);else if(r()<0.4)g.note(9,0.4,14.6);
    {const a=18.5,b=-11;for(const s of[-1,1])for(const t of[-1,1])g.span(a+s*0.6,0,b+t*0.6,a+s*0.35,2.4,b+t*0.35,0.08,0.08,0,false);g.box(a-0.45,2.4,b-0.45,a+0.45,2.48,b+0.45,0);g.box(a-0.45,2.48,b+0.35,a+0.45,3.1,b+0.45,0,false);
      for(let q=0;q<6;q++)g.box(a-0.4,0.4*q,b+0.6,a+0.4,0.4*q+0.04,b+0.65,0,false);umbrella(a,b,48);}
    g.statue(-6+r()*12,12.5);palm(-21,-18,10);g.item(0,-1.3,0);if(r()<0.4)g.npc(10,0,18,0);
  }else if(T===2){ /* la rivière lente, à sec, des bouées oubliées, un petit pont */
    for(const b of[-6,6]){g.box(-24,-1.2,b-0.15,24,0,b+0.15,10);g.box(-24,0,b-0.3,24,0.06,b+0.3,0,false);}
    g.box(-24,-2,-6,24,-1.2,6,10);g.box(-24,-0.8,-24,24,0,-6.15,59,true);g.box(-24,-0.8,6.15,24,0,24,59,true);
    for(let k=0;k<5;k++){const a=-18+k*9,b=(r()-0.5)*6;for(let q=0;q<12;q++){const t=q*0.524;g.sphere(a+Math.cos(t)*0.45,-1.05,b+Math.sin(t)*0.45,0.17,[36,48,49][k%3],ICO1);}}
    for(let k=0;k<5;k++){const a=-20+k*10;g.box(a-0.6,-1.2,4.4,a+0.6,-0.8,6,10);g.box(a-0.6,-1.2,5.2,a+0.6,-0.4,6,10);}
    for(let q=0;q<10;q++){const t=q/9,y=Math.sin(t*3.1416)*1.2;g.span(8,0.1+Math.sin(q/10*3.1416)*1.2,-6.6+q*1.32,8,0.1+Math.sin((q+1)/10*3.1416)*1.2,-6.6+(q+1)*1.32,2,0.12,41,true);}
    for(const s of[-1,1])g.span(8+s*1.0,1.2,-6.6,8+s*1.0,1.2,6.6,0.06,0.06,0,false);
    palm(-12,14,9);palm(12,-14,11);if(r()<0.5)g.note(4,-0.9,0);g.statue(-14+r()*28,-14);g.item(-6,-0.1,0);
  }else if(T===3){ /* la tour des toboggans : trente mètres d'escalier en colimaçon, puis la longue gouttière jusqu'au fond */
    const TH=28;
    for(let k=0;k<TH/0.25;k++){const y=(k+1)*0.25,t=k*0.22,a=12+Math.cos(t)*3.4,b=10+Math.sin(t)*3.4;g.obox(a,y-0.06,b,0.65,0.06,0.42,-t,0,59);g.solid(a-0.5,y-0.25,b-0.5,a+0.5,y,b+0.5);
      if(k%2===0)g.cyl(12+Math.cos(t)*4.15,10+Math.sin(t)*4.15,0.02,y,y+1.0,50,false,4);}
    g.cyl(12,10,1.6,0,TH,0,true,14);for(let y=4;y<TH;y+=4)g.cyl(12,10,1.7,y,y+0.15,49,false,14);
    const t1=(TH/0.25-1)*0.22,sx=12+Math.cos(t1)*3.4,sz=10+Math.sin(t1)*3.4;
    g.cyl(12,10,5,TH+2.2,TH+2.4,48,false,16);g.cyl(12,10,0.1,TH,TH+2.2,50,false,6);
    const pts=[];for(let k=0;k<=40;k++){const f=k/40;pts.push([sx+(0-sx)*f+Math.sin(f*9)*2.5*(1-f),TH-f*(TH+4.3)+0.1,sz+(-12-sz)*f]);}
    tube(g,pts,1.3,[34,49,36]);
    g.hdoor(0,-12);g.hdoor(-5,-12);g.hdoor(5,-12);palm(-18,10,12);g.item(sx,TH+1.1,sz);g.statue(-16,6);
  }else if(T===4){ /* la piscine à vagues : le fond remonte en paliers, les volets des machines à vagues */
    for(let k=0;k<5;k++)g.box(-18,-3.2,-14+k*5.2,18,-3.2+k*0.6,-14+(k+1)*5.2,10);
    for(let k=0;k<6;k++){g.box(-17+k*6.8,0,-14.6,-15+k*6.8,4.5,-14.3,50);for(let q=0;q<6;q++)g.box(-16.9+k*6.8,0.4+q*0.6,-14.31,-15.1+k*6.8,0.6+q*0.6,-14.29,12,false);}
    palm(20,16,10);for(let k=0;k<6;k++)lounger(-15+k*3,18,[49,36,34][k%3]);g.statue(-10,-8);g.statue(10,-12);g.item(0,-1.5,-6);if(r()<0.5)g.note(-14,0.4,17);
  }else{ /* vestiaires : casiers aérés, bancs, douches qui gouttent */
    for(let l=0;l<4;l++){const b=-14+l*8,m=[49,35,48][l%3];g.box(-18.6,0,b-0.02,18.6,1.95,b+0.02,12,false);
      for(const f of[-1,1]){const F=furn(g,false,0,b,f);lockerBank(g,F,-17.6,-9.4,0.3,1.95,0.45,m,r);lockerBank(g,F,-7.6,7.6,0.3,1.95,0.45,m,r);lockerBank(g,F,9.4,17.6,0.3,1.95,0.45,m,r);}
      c3bench(g,0,b+2.0,true,8);}
    showerRow(g,22,-12,5,r);if(r()<0.6)g.note(6,1.2,-10+0.6);g.statue(-4,-6+r()*2);g.item(10,1.1,2);
  }
  if(r()<0.3)g.npc(-18+r()*36,0,20,r()*6.28);
}

/* ---- la maison vendue : des pièces vides, des cartons, des inconnus qui visitent ---- */
function houseDoor(i,j,k,u){return u*8+2+Math.floor(hash(i*7+k,j*5+u,71)*4);}
function houseRoom(g,a0,b0,kind,r){ /* une pièce de 8 m : le mobilier reste dans les coins, les portes restent libres */
  const S=8,cx=a0+4,cz=b0+4,sheet=(x0,y0,z0,x1,y1,z1)=>{g.box(x0,y0,z0,x1,y1,z1,0);g.obox((x0+x1)/2,y0+0.02,z0-0.02,(x1-x0)/2+0.02,0.04,0.03,0,0,0,false);};
  if(kind===0){ /* le salon : canapé et fauteuil sous des draps, une table basse, un tapis roulé */
    sheet(cx-1.2,0,cz-0.5,cx+1.2,0.45,cz+0.45);g.box(cx-1.25,0.45,cz+0.2,cx+1.25,0.95,cz+0.5,0);for(const s of[-1,1])g.box(cx+s*1.2-0.15,0.45,cz-0.5,cx+s*1.2+0.15,0.68,cz+0.5,0);
    for(let q=0;q<5;q++)g.obox(cx-1.0+q*0.5,0.25,cz-0.52,0.24,0.22,0.02,0,0.12*(q%2?1:-1),0,false);
    g.box(cx+2.1,0,cz-0.4,cx+2.9,0.45,cz+0.4,0);g.box(cx+2.1,0.45,cz+0.2,cx+2.9,0.9,cz+0.4,0);g.ell(cx+2.5,0.95,cz+0.3,0.4,0.1,0.15,0,ICO1);
    g.box(cx-0.6,0,cz-1.9,cx+0.6,0.38,cz-1.3,41);g.box(cx-0.65,0.38,cz-1.95,cx+0.65,0.42,cz-1.25,41,false);
    g.ell(a0+1.0,0.18,cz,0.18,0.18,1.6,[34,48,36][Math.floor(r()*3)],ICO2);
    g.box(a0+6.2,0,b0+7.4,a0+7.9,0.55,b0+7.9,41);g.box(a0+6.6,0.55,b0+7.6,a0+7.5,1.15,b0+7.66,12,false);
  }else if(kind===1){ /* la cuisine : meubles bas, plan de travail, évier, cuisinière, frigo, table */
    const zt=b0+7.4;g.box(a0+5.6,0,zt,a0+7.9,0.86,b0+7.9,0);g.box(a0+5.6,0.86,zt-0.05,a0+7.95,0.9,b0+7.95,59,false);
    for(let q=0;q<3;q++){g.box(a0+5.7+q*0.75,0.1,zt-0.01,a0+6.3+q*0.75,0.75,zt,0,false);g.box(a0+5.95+q*0.75,0.65,zt-0.03,a0+6.05+q*0.75,0.68,zt-0.01,50,false);}
    g.box(a0+6.1,0.84,zt+0.05,a0+6.7,0.9,b0+7.8,50,false);g.cyl(a0+6.4,b0+7.8,0.015,0.9,1.15,50,false,5);
    g.box(a0+7.4,0,b0+5.6,a0+7.9,0.86,b0+7.4,0);g.box(a0+7.4,0.86,b0+5.6,a0+7.9,0.9,b0+7.4,12,false);for(const [x,z] of[[7.55,5.8],[7.75,5.8],[7.55,6.15],[7.75,6.15]])g.cyl(a0+x,b0+z,0.07,0.9,0.92,47,false,10);
    for(let q=0;q<2;q++)g.box(a0+5.7+q*1.0,1.5,b0+7.55,a0+6.6+q*1.0,2.2,b0+7.9,0);
    g.box(a0+0.15,0,b0+7.2,a0+0.95,1.9,b0+7.9,0);g.box(a0+0.9,0.8,b0+7.15,a0+0.93,1.6,b0+7.2,50,false);g.box(a0+0.15,1.2,b0+7.18,a0+0.95,1.21,b0+7.2,12,false);
    g.box(cx-0.8,0.74,cz-0.5,cx+0.8,0.78,cz+0.5,41);for(const s of[-1,1])for(const t of[-1,1])g.box(cx+s*0.72-0.03,0,cz+t*0.42-0.03,cx+s*0.72+0.03,0.74,cz+t*0.42+0.03,41,false);
    for(const [dx,dz,rot] of[[0,0.85,0],[0,-0.85,3.14]])if(r()<0.7){g.box(cx+dx-0.2,0.44,cz+dz-0.2,cx+dx+0.2,0.48,cz+dz+0.2,41);g.obox(cx+dx,0.7,cz+dz*1.25,0.2,0.24,0.02,rot,0,41);}
    g.box(a0+1.5,1.05,b0+7.97,a0+1.56,1.95,b0+7.99,0,false);for(let q=0;q<6;q++)g.box(a0+1.48,1.1+q*0.15,b0+7.97,a0+1.6,1.105+q*0.15,b0+7.985,47,false);
  }else if(kind===2){ /* la chambre : lit défait, matelas nu, armoire, table de nuit */
    g.box(a0+6.2,0,b0+5.6,a0+7.85,0.35,b0+7.9,41);g.box(a0+6.25,0.35,b0+5.65,a0+7.8,0.55,b0+7.85,0);for(let q=0;q<6;q++)g.box(a0+6.25,0.551,b0+5.75+q*0.36,a0+7.8,0.553,b0+5.8+q*0.36,49,false);
    g.box(a0+6.2,0.35,b0+7.85,a0+7.85,1.15,b0+7.95,41);g.box(a0+5.65,0,b0+7.4,a0+6.15,0.55,b0+7.9,41);g.cyl(a0+5.9,b0+7.65,0.12,0.55,0.62,0,false,10);g.cyl(a0+5.9,b0+7.65,0.015,0.62,0.85,50,false,4);g.cyl(a0+5.9,b0+7.65,0.14,0.85,1.05,36,false,10);
    armoire(g,furn(g,false,a0+0.75,b0+0.08,1),0,1.3,0.6,81);
    for(let q=0;q<6;q++)g.box(cx-1.2+q*0.42,0,cz-0.1,cx-0.9+q*0.42,0.35+r()*0.2,cz+0.25,70);
  }else if(kind===3){ /* la salle de bain : baignoire, lavabo et miroir, toilettes */
    g.box(a0+5.6,0,b0+0.02,a0+7.98,1.2,b0+0.05,10,false);g.box(a0+0.02,0,b0+0.02,a0+1.4,1.2,b0+0.05,10,false);
    g.box(a0+5.65,0,b0+7.1,a0+7.95,0.55,b0+7.95,0);g.box(a0+5.8,0.45,b0+7.25,a0+7.8,0.56,b0+7.8,10,false);g.cyl(a0+7.6,b0+7.9,0.03,0.6,0.75,50,false,6);
    g.box(a0+0.25,0,b0+7.35,a0+0.75,0.38,b0+7.75,0);g.ell(a0+0.5,0.42,b0+7.35,0.22,0.06,0.28,0,ICO2);g.box(a0+0.2,0.38,b0+7.7,a0+0.8,0.85,b0+7.92,0);
    g.cyl(a0+0.35,b0+6.4,0.08,0,0.8,0,false,10);g.ell(a0+0.4,0.84,b0+6.4,0.22,0.06,0.3,0,ICO2);g.box(a0+0.03,1.2,b0+6.05,a0+0.05,1.9,b0+6.75,13,false);g.cyl(a0+0.18,b0+6.4,0.012,0.88,1.02,50,false,5);
  }else if(kind===4){ /* une pièce de cartons : piles fermées, matelas roulé, un lampadaire */
    for(let q=0;q<7;q++){const x=a0+1.6+(q%4)*1.25,z=b0+2+Math.floor(q/4)*3;const n=1+Math.floor(r()*3);for(let k=0;k<n;k++)g.box(x-0.3,k*0.46,z-0.25,x+0.3,k*0.46+0.45,z+0.25,70);}
    g.ell(a0+6.8,0.35,b0+6.8,0.35,0.35,0.9,0,ICO2);g.cyl(a0+1,b0+7,0.15,0,0.04,50,false,10);g.cyl(a0+1,b0+7,0.015,0,1.6,50,false,4);g.cyl(a0+1,b0+7,0.2,1.55,1.85,0,false,12);
  }else{ /* le couloir de l'entrée : portemanteau vide, traces de cadres, un miroir */
    for(let q=0;q<5;q++)g.cyl(a0+5.8+q*0.4,b0+7.95,0.015,1.7,1.72,50,false,4);g.box(a0+5.7,1.66,b0+7.92,a0+7.7,1.72,b0+7.98,41,false);
    g.box(a0+0.3,1.0,b0+7.96,a0+0.9,2.0,b0+7.98,13,false);g.box(a0+0.25,0.95,b0+7.95,a0+0.95,2.05,b0+7.96,41,false);
    for(let q=0;q<3;q++)g.box(cx-0.2+(q-1)*0.6,0,cz-0.2,cx+0.15+(q-1)*0.6,0.12,cz+0.15,[48,12,0][q],false);
  }
}
/* une corde de chanvre : trois torons tordus autour d'un chemin (points), une âme au centre */
function ropeAlong(g,P,r,m,pitch){m=m||91;pitch=pitch||0.05;const S=[];
  for(let k=0;k<P.length-1;k++){const a=P[k],b=P[k+1],L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),n=Math.max(1,Math.ceil(L/0.022));for(let q=0;q<n;q++){const t=q/n;S.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]);}}
  S.push(P[P.length-1]);let n1=null,acc=0,prev=null;const pts=[];
  for(let k=0;k<S.length;k++){const p=S[k],q=S[Math.min(k+1,S.length-1)],o=S[Math.max(k-1,0)];let T=[q[0]-o[0],q[1]-o[1],q[2]-o[2]];const tl=Math.hypot(...T)||1;T=T.map(x=>x/tl);
    if(!n1){const up=Math.abs(T[1])<0.9?[0,1,0]:[1,0,0];n1=[T[1]*up[2]-T[2]*up[1],T[2]*up[0]-T[0]*up[2],T[0]*up[1]-T[1]*up[0]];}
    const d=n1[0]*T[0]+n1[1]*T[1]+n1[2]*T[2];n1=[n1[0]-d*T[0],n1[1]-d*T[1],n1[2]-d*T[2]];const nl=Math.hypot(...n1)||1;n1=n1.map(x=>x/nl);
    const n2=[T[1]*n1[2]-T[2]*n1[1],T[2]*n1[0]-T[0]*n1[2],T[0]*n1[1]-T[1]*n1[0]];if(prev)acc+=Math.hypot(p[0]-prev[0],p[1]-prev[1],p[2]-prev[2]);prev=p;
    pts.push([p,n1.slice(),n2,acc]);}
  for(let k=0;k<pts.length-1;k++){const [p,,,]=pts[k],[q]=pts[k+1];g.rod(p[0],p[1],p[2],q[0],q[1],q[2],r*0.6,m,5);
    for(let s=0;s<3;s++){const off=(e,len)=>{const a=s*2.094+len/pitch*6.283,c=Math.cos(a)*r*0.5,si=Math.sin(a)*r*0.5;return [e[0][0]+e[1][0]*c+e[2][0]*si,e[0][1]+e[1][1]*c+e[2][1]*si,e[0][2]+e[1][2]*c+e[2][2]*si];};
      const A=off(pts[k],pts[k][3]),B=off(pts[k+1],pts[k+1][3]);g.rod(A[0],A[1],A[2],B[0],B[1],B[2],r*0.5,m,5);}}}
/* un tabouret de bois tourné, couché sur le flanc. O : centre de l'axe au sol ; phi : direction de l'assise */
function stoolDown(g,O,phi,m){m=m||41;const U=[Math.cos(phi),0,Math.sin(phi)],X=[0,1,0],Z=[U[1]*X[2]-U[2]*X[1],U[2]*X[0]-U[0]*X[2],U[0]*X[1]-U[1]*X[0]];
  const T=(lx,ly,lz)=>[O[0]+X[0]*lx+U[0]*ly+Z[0]*lz,O[1]+X[1]*lx+U[1]*ly+Z[1]*lz,O[2]+X[2]*lx+U[2]*ly+Z[2]*lz];
  const R=(a,b,r0,r1,n,caps)=>{g.rod(a[0],a[1],a[2],b[0],b[1],b[2],r0,m,n||8,r1,caps);};
  {const a=T(0,0.42,0),b=T(0,0.455,0);R(a,b,0.17,0.17,18,true);const c=T(0,0.438,0);g.torus(c[0],c[1],c[2],0.168,0.019,U,m,18,5);const d=T(0,0.405,0),e=T(0,0.42,0);R(d,e,0.13,0.15,14,true);}
  const leg=[];for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2,top=T(Math.cos(a)*0.11,0.41,Math.sin(a)*0.11),bot=T(Math.cos(a)*0.19,0,Math.sin(a)*0.19);
    R(top,bot,0.021,0.015,8,true);const mid=T(Math.cos(a)*0.148,0.22,Math.sin(a)*0.148);g.sphere(mid[0],mid[1],mid[2],0.025,m,ICO1);
    const r2=T(Math.cos(a)*0.17,0.1,Math.sin(a)*0.17);g.torus(r2[0],r2[1],r2[2],0.019,0.006,U,m,8,3);leg.push(a);}
  for(let k=0;k<4;k++){const a=leg[k],b=leg[(k+1)%4],y=k%2?0.16:0.12,rr=0.19-0.08*y/0.41;R(T(Math.cos(a)*rr,y,Math.sin(a)*rr),T(Math.cos(b)*rr,y,Math.sin(b)*rr),0.011,0.011,6,true);}}
/* un battant de porte à panneaux. Gond (hx,hz) dans un mur le long de z ; s : sens du battant le long de z ; w : vers x ; th : ouverture */
function doorLeaf(g,hx,hz,s,w,th,m){m=m||0;const u=[w*Math.sin(th),s*Math.cos(th)],nr=[u[1],-u[0]],yaw=Math.atan2(-u[1],u[0]);
  g.obox(hx+u[0]*0.44,1.04,hz+u[1]*0.44,0.44,1.04,0.022,yaw,0,m);
  for(const f of[-1,1]){for(const [t,y,h] of[[0.24,0.58,0.33],[0.64,0.58,0.33],[0.24,1.5,0.38],[0.64,1.5,0.38]])g.obox(hx+u[0]*t*0.9+nr[0]*f*0.024,y,hz+u[1]*t*0.9+nr[1]*f*0.024,0.15,h,0.005,yaw,0,m);
    const a=[hx+u[0]*0.8+nr[0]*f*0.025,hz+u[1]*0.8+nr[1]*f*0.025],b=[a[0]+nr[0]*f*0.05,a[1]+nr[1]*f*0.05];g.rod(a[0],1.0,a[1],b[0],1.0,b[1],0.008,78,6);g.rod(b[0],1.0,b[1],b[0]-u[0]*0.11,1.0,b[1]-u[1]*0.11,0.008,78,6,0.008,true);}}
function houseSoldCell(g,c,i,j,r){ /* plus de rêve : une vraie maison, un jardin, une haie, la rue */
  g.m=SYM[0];
  if(i||j){ /* les alentours : pelouses, la rue, les maisons des voisins ; on ne passe pas la haie */
    g.box(-24,-0.8,-24,24,0,24,9);
    if(j===1){g.box(-24,0,-14,24,0.02,-6,20,false);for(const z of[-15,-5])g.box(-24,0,z-1,24,0.12,z+1,59,false);for(let k=-3;k<=3;k++)g.box(k*7-1.5,0.021,-10.08,k*7+1.5,0.025,-9.92,22,false);
      for(const x of[-14,0,14]){if(i===0&&x===0)continue;g.box(x-5,0,2,x+5,5.2,10,42);gable(g,x-5.4,1.6,x+5.4,10.4,5.2,2.2,46,42);for(const q of[-3,0,3])g.box(x+q-0.6,1.0,1.98,x+q+0.6,2.2,2.0,25,false);}
      g.cyl(-8,-4.5,0.06,0,4.2,50,false,6);g.rod(-8,4.2,-4.5,-8,4.3,-5.6,0.05,50,5);g.cone(-8,-5.7,0.18,0.08,4.0,4.3,25,8);}
    else{const n=2+Math.floor(r()*3);for(let q=0;q<n;q++)tree(g,-18+r()*36,-18+r()*36,r,1.3);
      if(Math.abs(i)+Math.abs(j)===1&&r()<0.8){const x=(r()-0.5)*20,z=(r()-0.5)*20;g.box(x-5,0,z-4,x+5,5.2,z+4,[42,0][Math.floor(r()*2)]);gable(g,x-5.4,z-4.4,x+5.4,z+4.4,5.2,2.2,46,42);}}
    return;}
  const H=2.6,Wt=0.2;
  /* le jardin : pelouse, allée, haie qui ferme tout, portail, panneau VENDU, un arbre, un banc */
  g.box(-24,-0.8,-24,24,0,24,9);
  for(const s of[-1,1]){g.box(-21,0,s*20-0.5,21,2.2,s*20+0.5,15);g.box(s*20-0.5,0,-21,s*20+0.5,2.2,21,15);}
  g.box(0.6,0,19.4,3.4,1.1,20.6,0);for(let q=0;q<9;q++)g.box(0.75+q*0.3,0.1,19.45,0.82+q*0.3,1.05,20.55,0,false);
  for(let q=0;q<6;q++){const z=8.4+q*1.9;g.box(1.3,0,z-0.55,2.7,0.03,z+0.55,59,false);}
  g.box(-1,0,7.2,5,0.12,8.2,59);
  {const x=-4,z=13;g.box(x-0.04,0,z-0.04,x+0.04,1.6,z+0.04,41);g.box(x-0.9,1.0,z-0.03,x+0.9,1.6,z+0.03,0,false);
    neonText(g,x-textW('VENDU',0.42)/2,1.09,z+0.035,1,0,0.42,'VENDU',48,0.028);neonText(g,x+textW('VENDU',0.42)/2,1.09,z-0.035,-1,0,0.42,'VENDU',48,0.028);}
  tree(g,-13,13,r,1.4);tree(g,13,-14,r,1.2);tree(g,14,12,r,1.0);c3bench(g,-13,9.5,true,1.8);
  for(let q=0;q<8;q++){const x=-8+q*2;if(x>0&&x<4)continue;g.ell(x,0.35,8.6,0.5,0.4,0.4,15,ICO1);}
  /* la maison : murs, sol, plafond, toit */
  const win=[],door=[];
  const wallX=(z,x0,x1,ops,m,t)=>{t=t||Wt;let x=x0;const S=[...ops].sort((p,q)=>p[0]-q[0]);
    for(const [c,w,y0,y1] of S){g.box(x,0,z-t/2,c-w/2,H,z+t/2,m);g.box(x,0,z-t/2-0.014,c-w/2,0.09,z+t/2+0.014,0,false);g.box(x,H-0.07,z-t/2-0.03,c-w/2,H,z+t/2+0.03,0,false);if(y0>0)g.box(c-w/2,0,z-t/2,c+w/2,y0,z+t/2,m);g.box(c-w/2,y1,z-t/2,c+w/2,H,z+t/2,m);x=c+w/2;
      if(y0>0){win.push([c-w/2,y0,z,c+w/2,y1,z,1]);}else door.push([c-w/2,z,c+w/2,z,y1]);}
    g.box(x,0,z-t/2,x1,H,z+t/2,m);g.box(x,0,z-t/2-0.014,x1,0.09,z+t/2+0.014,0,false);g.box(x,H-0.07,z-t/2-0.03,x1,H,z+t/2+0.03,0,false);};
  const wallZ=(x,z0,z1,ops,m,t)=>{t=t||Wt;let z=z0;const S=[...ops].sort((p,q)=>p[0]-q[0]);
    for(const [c,w,y0,y1] of S){g.box(x-t/2,0,z,x+t/2,H,c-w/2,m);g.box(x-t/2-0.014,0,z,x+t/2+0.014,0.09,c-w/2,0,false);g.box(x-t/2-0.03,H-0.07,z,x+t/2+0.03,H,c-w/2,0,false);if(y0>0)g.box(x-t/2,0,c-w/2,x+t/2,y0,c+w/2,m);g.box(x-t/2,y1,c-w/2,x+t/2,H,c+w/2,m);z=c+w/2;
      if(y0>0){win.push([x,y0,c-w/2,x,y1,c+w/2,0]);}else door.push([x,c-w/2,x,c+w/2,y1]);}
    g.box(x-t/2,0,z,x+t/2,H,z1,m);g.box(x-t/2-0.014,0,z,x+t/2+0.014,0.09,z1,0,false);g.box(x-t/2-0.03,H-0.07,z,x+t/2+0.03,H,z1,0,false);};
  g.box(-9,0,-7,9,0.03,7,89,false);g.box(-8.9,0.031,-6.9,1.14,0.04,-0.06,10,false);g.box(2.86,0.031,-1.94,8.9,0.04,1.44,10,false);
  g.box(-9.1,H,-7.1,9.1,H+0.18,7.1,0);gable(g,-9.6,-7.7,9.6,7.7,H+0.18,2.5,46,42);
  wallX(7,-9.1,9.1,[[-6.5,2.2,0.9,2.1],[-2.5,1.4,0.9,2.1],[2,1.0,0,2.15],[6,1.6,0.9,2.1]],42);
  wallX(-7,-9.1,9.1,[[-5,1.8,1.05,2.0],[6,1.4,0.9,2.1]],42);
  wallZ(-9,-7,7,[[3.5,1.8,0.9,2.1],[-3.5,1.2,1.0,2.0]],42);
  wallZ(9,-7,7,[[4.2,1.4,0.9,2.1],[-0.3,0.7,1.45,2.0],[-4.5,1.2,0.9,2.1]],42);
  wallZ(1.2,-6.9,6.9,[[4,0.9,0,2.1],[-4,0.9,0,2.1]],0,0.12);
  wallZ(2.8,-6.9,6.9,[[4.3,0.9,0,2.1],[-0.25,0.8,0,2.1],[-4.6,0.9,0,2.1]],0,0.12);
  wallX(0,-8.9,1.14,[[-4.7,2.6,0,2.3]],0,0.12);wallX(1.5,2.86,8.9,[],0,0.12);wallX(-2,2.86,8.9,[],0,0.12);
  /* fenêtres : cadre blanc, croisillons, appui, un rideau ; personne ne passe par là */
  for(const [x0,y0,z0,x1,y1,z1,ax] of win){g.solid(Math.min(x0,x1)-0.12,y0,Math.min(z0,z1)-0.12,Math.max(x0,x1)+0.12,y1,Math.max(z0,z1)+0.12);
    const B=(u0,v0,u1,v1,d0,d1,m)=>ax?g.box(u0,v0,z0+d0,u1,v1,z0+d1,m,false):g.box(x0+d0,v0,u0,x0+d1,v1,u1,m,false),u0=ax?x0:z0,u1=ax?x1:z1,um=(u0+u1)/2;
    B(u0,y0-0.04,u1,y0,-0.18,0.18,0);B(u0,y1,u1,y1+0.04,-0.12,0.12,0);B(u0-0.04,y0,u0,y1,-0.12,0.12,0);B(u1,y0,u1+0.04,y1,-0.12,0.12,0);
    B(um-0.02,y0,um+0.02,y1,-0.03,0.03,0);B(u0,(y0+y1)/2-0.02,u1,(y0+y1)/2+0.02,-0.03,0.03,0);}
  for(const [x0,y0,z0,x1,y1,z1,ax] of win){if(y0>1.2)continue;const inn=ax?-Math.sign(z0):-Math.sign(x0),c0=ax?(x0+x1)/2:(z0+z1)/2,hw=Math.min(0.55,(ax?x1-x0:z1-z0)*0.35);
    for(let q=-hw;q<=hw+1e-3;q+=0.07){if(ax)g.box(c0+q-0.022,0.16,z0+inn*0.12,c0+q+0.022,0.68,z0+inn*0.2,0,false);else g.box(x0+inn*0.12,0.16,c0+q-0.022,x0+inn*0.2,0.68,c0+q+0.022,0,false);}
    if(ax)g.box(c0-hw,0.6,z0+inn*0.11,c0+hw,0.64,z0+inn*0.2,0,false);else g.box(x0+inn*0.11,0.6,c0-hw,x0+inn*0.2,0.64,c0+hw,0,false);}
  doorLeaf(g,1.2,4.45,-1,-1,1.45);doorLeaf(g,1.2,-3.55,-1,-1,1.45);doorLeaf(g,2.8,3.85,1,1,1.45);doorLeaf(g,2.8,0.15,-1,1,1.4);
  for(const [x,z] of[[1.27,4.75],[1.27,-3.25],[2.73,3.6],[2.73,-0.85],[2.73,-5.25]]){g.box(x-0.01,1.08,z-0.04,x+0.01,1.18,z+0.04,0,false);}
  for(const [x0,z0,x1,z1,h] of door){const ax=z0===z1,B=(u0,v0,u1,v1,d0,d1,m)=>ax?g.box(u0,v0,z0+d0,u1,v1,z0+d1,m,false):g.box(x0+d0,v0,u0,x0+d1,v1,u1,m,false),u0=ax?x0:z0,u1=ax?x1:z1;
    B(u0-0.07,0,u0,h+0.07,-0.13,0.13,0);B(u1,0,u1+0.07,h+0.07,-0.13,0.13,0);B(u0-0.07,h,u1+0.07,h+0.07,-0.13,0.13,0);}
  g.box(-5.6,H+1.2,-2.6,-4.8,H+3.9,-1.8,59);g.box(-5.7,H+3.9,-2.7,-4.7,H+4.0,-1.7,59,false);for(const s of[-1,1])g.rod(-9.6,H+0.12,s*7.75,9.6,H+0.12,s*7.75,0.06,50,6);
  g.box(2.75,1.95,7.1,2.95,2.25,7.2,78,false);g.cone(2.85,7.25,0.06,0.08,2.0,2.2,25,8);g.box(3.6,0,20.7,3.7,1.0,20.8,12);g.box(3.45,1.0,20.6,3.85,1.3,21.0,48);
  g.obox(2.0+0.48,1.07,7.3,0.48,1.07,0.03,-1.2,0,81);g.sphere(2.9,1.0,7.6,0.03,78,ICO0);
  /* plafonniers */
  for(const [x,z] of[[-4,3.5],[-4,-3.5],[2,3],[2,-3],[6,4.3],[6,-0.3],[6,-4.5]]){g.cyl(x,z,0.22,H-0.12,H,0,false,12);g.cyl(x,z,0.18,H-0.13,H-0.12,17,false,12);}
  for(const [x0,z0,x1,z1] of[[-8.9,0.06,1.14,0.1],[-8.9,6.84,1.14,6.89],[-8.9,0.06,-8.85,6.89],[1.08,0.06,1.14,6.89]])g.box(x0,0,z0,x1,0.1,z1,0,false);
  /* LE SALON */
  g.box(-2.3,0,0.08,0.3,0.5,0.55,81);g.box(-2.25,0.5,0.15,0.25,0.52,0.5,47,false);g.box(-1.75,0.52,0.25,-0.25,1.38,0.32,47);g.box(-1.7,0.57,0.33,-0.3,1.33,0.335,61,false);
  g.box(-3,0.005,2.4,0.9,0.015,5.2,66,false);sofa2(g,-1,5.9,1.25,1,83,81);sofa2(g,-6.6,6.2,0.45,1,83,81);
  g.box(-1.7,0.38,3.1,-0.3,0.42,4.0,81);for(const s of[-1,1])for(const t of[-1,1])g.rod(-1+s*0.6,0,3.55+t*0.38,-1+s*0.6,0.38,3.55+t*0.38,0.025,81,6);
  g.box(-1.4,0.42,3.3,-1.1,0.45,3.55,[36,49][0],false);g.cone(-0.6,3.6,0.04,0.04,0.42,0.52,0,8);
  {const F=furn(g,true,5.6,-8.9,1);F.B(-1.1,1.1,0,2.2,0,0.36,81);for(let q=0;q<5;q++){const y=0.08+q*0.44;F.B(-1.06,1.06,y,y+0.03,0.03,0.36,81,false);
      let u=-1.0;while(u<0.9){const w=0.03+r()*0.05,h=0.22+r()*0.15;F.B(u,y+0.03,u+w,y+0.03+h,0.06,0.32,[48,49,51,36,0,41,47][Math.floor(r()*7)],false);u+=w+0.005;if(r()<0.1)u+=0.12;}}}
  g.note(-8.6,1.42,5.3);
  {const x=0.5,z=6.4;g.cone(x,z,0.16,0.12,0,0.04,78,10);g.rod(x,0.04,z,x,1.5,z,0.012,78,5);g.cone(x,z,0.25,0.16,1.45,1.75,84,12);}
  potPlant(g,-8.3,6.3,1.4,47);
  {const F=furn(g,false,-4,6.9,-1);F.B(-0.6,0.6,1.2,1.75,0,0.04,78,false);F.B(-0.52,0.52,1.27,1.68,0.04,0.05,86,false);}
  {const x=-5.3,z=4.7;g.box(x-0.3,0,z-0.25,x+0.3,0.45,z+0.25,70);for(const s of[-1,1]){g.obox(x+s*0.42,0.5,z,0.13,0.012,0.25,0,0,70);g.obox(x,0.5,z+s*0.37,0.3,0.012,0.12,0,0,70);}g.phone(x,0.5,z);
    for(let q=0;q<3;q++){const xx=x+1.1+(q%2)*0.65,h=q*0.46;g.box(xx-0.3,q>1?0.46:0,z-0.6-0.25,xx+0.3,(q>1?0.46:0)+0.45,z-0.6+0.25,70);}}
  for(const [x,z] of[[-6.5,6.8],[-2.5,6.8]])for(const s of[-1,1])for(let q=0;q<3;q++)g.box(x+s*(1.0+q*0.1)-0.05,0.05,z-0.08+(q%2)*0.04,x+s*(1.0+q*0.1)+0.05,2.3,z-0.04+(q%2)*0.04,16,false);
  /* LA CUISINE */
  {const z0=-6.9;g.box(-8.9,0,z0,-3,0.86,z0+0.62,44);g.box(-8.92,0.86,z0,-2.98,0.9,z0+0.66,59,false);
    for(let q=0;q<8;q++){const x=-8.8+q*0.72;g.box(x,0.1,z0+0.62,x+0.68,0.8,z0+0.63,44,false);g.box(x+0.28,0.7,z0+0.63,x+0.4,0.72,z0+0.65,50,false);}
    g.box(-6,0.84,z0+0.1,-5.2,0.9,z0+0.5,50,false);g.rod(-5.6,0.9,z0+0.08,-5.6,1.15,z0+0.08,0.015,50,5);g.rod(-5.6,1.15,z0+0.08,-5.6,1.15,z0+0.25,0.012,50,5);
    g.box(-4.4,0.86,z0+0.02,-3.4,0.9,z0+0.6,47,false);for(const [x,zz] of[[-4.15,0.17],[-3.65,0.17],[-4.15,0.45],[-3.65,0.45]])g.torus(x,0.91,z0+zz,0.07,0.012,[0,1,0],50,10,3);
    for(const x of[-8.8,-7.9,-3.95])g.box(x,1.5,z0,x+0.85,2.2,z0+0.35,44);
    g.box(-8.9,0.9,z0,-3,1.5,z0+0.012,10,false);g.box(-4.45,1.62,z0,-3.35,1.78,z0+0.5,50,false);g.box(-4.15,1.78,z0,-3.65,H,z0+0.25,50,false);
    g.box(-2.6,0,z0,-1.75,1.85,z0+0.7,0);g.box(-2.6,1.2,z0+0.7,-1.75,1.21,z0+0.71,12,false);g.box(-1.84,0.3,z0+0.7,-1.8,1.1,z0+0.74,50,false);g.box(-1.84,1.3,z0+0.7,-1.8,1.7,z0+0.74,50,false);
    for(let q=0;q<5;q++)g.box(-2.5+q*0.13,1.35+(q%2)*0.1,z0+0.71,-2.42+q*0.13,1.43+(q%2)*0.1,z0+0.72,[48,36,49,35,34][q],false);g.note(-2.15,1.55,z0+0.9);}
  {const x=-5,z=-3.2;g.box(x-0.9,0.74,z-0.55,x+0.9,0.78,z+0.55,81);for(const s of[-1,1])for(const t of[-1,1])g.rod(x+s*0.8,0,z+t*0.45,x+s*0.8,0.74,z+t*0.45,0.03,81,6);
    for(const [dx,dz,f] of[[0,-0.95,-1],[0,0.95,1],[-1.25,0,0],[1.25,0,0]]){const cx=x+dx,cz=z+dz;g.box(cx-0.21,0.44,cz-0.21,cx+0.21,0.48,cz+0.21,81);for(const s of[-1,1])for(const t of[-1,1])g.rod(cx+s*0.18,0,cz+t*0.18,cx+s*0.18,0.44,cz+t*0.18,0.015,81,4);
      if(f)g.box(cx-0.21,0.48,cz+f*0.17,cx+0.21,0.95,cz+f*0.21,81,false);else{const s2=Math.sign(dx);g.box(cx+s2*0.17,0.48,cz-0.21,cx+s2*0.21,0.95,cz+0.21,81,false);}}
    g.rod(x,H,z,x,1.75,z,0.006,47,4);g.cone(x,z,0.2,0.06,1.55,1.75,47,14);g.sphere(x,1.58,z,0.045,25,ICO1);
    g.cyl(x-0.5,z+0.2,0.13,0.78,0.84,0,false,12);for(let q=0;q<4;q++)g.sphere(x-0.5+Math.cos(q*1.6)*0.06,0.86,z+0.2+Math.sin(q*1.6)*0.06,0.04,[48,36,35,48][q],ICO1);
    g.box(x-0.3,0.78,z-0.1,x-0.02,0.783,z+0.12,0,false);g.souv(x+0.25,0.92,z);g.cone(x+0.55,z-0.3,0.045,0.04,0.78,0.88,0,8);}
  {const x=-1.2,z=-2.0;g.box(x-0.3,0,z-0.25,x+0.3,0.45,z+0.25,70);for(const s of[-1,1]){g.obox(x+s*0.42,0.5,z,0.13,0.012,0.25,0,0,70);g.obox(x,0.5,z+s*0.37,0.3,0.012,0.12,0,0,70);}g.phone(x,0.5,z);
    for(let q=0;q<4;q++)g.box(x-0.22+q*0.12,0.3,z-0.08,x-0.14+q*0.12,0.5,z+0.1,[0,50,13,0][q],false);}
  /* L'ENTRÉE ET LE COULOIR */
  g.box(1.3,0.005,-6.5,2.7,0.012,6.6,66,false);
  g.box(1.26,1.55,5.2,1.3,1.62,6.4,81,false);for(let q=0;q<4;q++)g.rod(1.3,1.6,5.35+q*0.3,1.42,1.6,5.35+q*0.3,0.012,78,4);
  g.ell(1.42,1.12,5.95,0.07,0.48,0.24,49,ICO1);g.ell(1.42,1.52,5.95,0.08,0.1,0.26,49,ICO1);g.box(1.36,1.0,5.6,1.4,1.55,5.68,48,false);g.box(1.36,1.0,5.74,1.4,1.4,5.8,48,false);g.note(1.55,1.5,5.65);
  g.box(1.75,0,6.5,2.0,0.1,6.85,47,false);g.box(2.05,0,6.55,2.3,0.1,6.85,47,false);
  {const F=furn(g,true,-1.5,2.74,-1);F.B(-0.6,0.6,0.78,0.82,0,0.35,81);F.B(-0.55,0.55,0,0.78,0.02,0.04,81,false);for(const u of[-0.55,0.55])F.B(u-0.03,u+0.03,0,0.78,0.3,0.34,81,false);
    const p=F.P(-0.2,0.18);g.box(p[0]-0.09,0.82,p[1]-0.12,p[0]+0.09,0.84,p[1]+0.12,49,false);g.note(p[0],0.98,p[1]);const l=F.P(0.35,0.18);tableLamp(g,l[0],0.82,l[1],0.8);}
  for(const z of[2.2,0.8,-2.3])g.box(2.73,1.35,z-0.25,2.74,1.75,z+0.25,78,false);
  g.box(1.26,1.0,-1.9,1.3,1.9,-1.1,78,false);g.box(1.3,1.04,-1.86,1.305,1.86,-1.14,13,false);
  /* LA SALLE DE BAIN */
  g.box(2.86,0.04,-1.94,2.9,1.3,1.44,10,false);g.box(8.86,0.04,-1.94,8.9,1.3,1.44,10,false);g.box(2.86,0.04,-1.98,8.9,1.3,-1.94,10,false);g.box(2.86,0.04,1.44,8.9,1.3,1.48,10,false);
  g.box(7.1,0,-1.92,8.88,0.58,-1.1,0);g.box(7.2,0.45,-1.85,8.8,0.585,-1.17,13,false);g.rod(8.7,0.58,-1.5,8.7,0.75,-1.5,0.02,50,5);
  g.box(5.2,0.85,1.0,5.9,0.92,1.42,0);g.cone(5.55,1.21,0.06,0.05,0,0.85,0,8);g.box(5.25,1.15,1.41,5.85,1.8,1.43,13,false);g.box(5.2,1.1,1.42,5.9,1.85,1.44,50,false);g.note(5.75,1.08,1.15);
  g.box(3.2,0,0.9,3.6,0.4,1.4,0);g.ell(3.4,0.43,0.95,0.2,0.05,0.25,0,ICO1);g.box(3.15,0.4,1.25,3.65,0.82,1.42,0);
  for(let q=0;q<3;q++)g.box(4.1+q*0.3,1.0,1.38,4.3+q*0.3,1.45,1.42,[0,49,36][q],false);
  g.rod(7.1,2.0,-1.08,8.88,2.0,-1.08,0.012,50,5);for(let q=0;q<9;q++)g.box(7.15+q*0.19,0.65,-1.11+(q%2)*0.025,7.3+q*0.19,1.98,-1.09+(q%2)*0.025,0,false);g.box(6.2,0.005,-1.5,7.0,0.012,-0.9,49,false);
  g.rod(4.1,1.48,1.36,4.95,1.48,1.36,0.01,50,5);
  /* TA CHAMBRE : le lit, le bureau, l'étagère des souvenirs, sa chaise bleue */
  g.box(7.0,0,4.6,8.88,0.38,6.88,81);g.box(7.05,0.38,4.65,8.83,0.55,6.83,76);g.box(7.0,0.55,4.8,8.88,0.6,6.5,66,false);g.ell(8.0,0.62,6.5,0.45,0.08,0.2,76,ICO1);g.box(7.0,0.38,6.85,8.88,1.05,6.9,81,false);
  {const F=furn(g,true,5.2,2.86,1);F.B(-0.2,1.6,0.72,0.76,0,0.6,81);for(const u of[-0.15,1.55])F.B(u-0.03,u+0.03,0,0.72,0.04,0.56,81,false);
    const l=F.P(1.3,0.3);tableLamp(g,l[0],0.76,l[1],0.8);
    F.B(-0.3,1.7,1.45,1.48,0,0.25,81,false);F.B(-0.3,1.7,1.95,1.98,0,0.25,81,false);for(let k=0;k<6;k++){const p=F.P(-0.1+k*0.3,0.12);keepsake(g,k,p[0],k<3?1.48:1.98,p[1]);}}
  g.box(3.5,1.3,6.88,4.4,2.0,6.89,[34,72,35][0],false);g.box(3.6,1.4,6.87,4.3,1.9,6.875,49,false);
  g.box(4.4,0.005,2.6,6.6,0.012,4.6,66,false);armoire(g,furn(g,false,7.6,1.56,1),0,1.1,0.55,41);
  g.box(6.55,0,6.2,6.95,0.5,6.85,41);tableLamp(g,6.75,0.5,6.5,0.7);
  {const x=5.6,z=4.6;g.box(x-0.25,0.45,z-0.25,x+0.25,0.5,z+0.25,16);for(const s of[-1,1])for(const t of[-1,1])g.rod(x+s*0.22,0,z+t*0.22,x+s*0.22,0.45,z+t*0.22,0.016,50,5);
    g.box(x-0.25,0.5,z-0.25,x+0.25,1.0,z-0.2,16,false);g.hdoor(x,z);}
  {const x=4.0,z=2.3;g.box(x-0.3,0,z-0.25,x+0.3,0.45,z+0.25,70);for(const s of[-1,1]){g.obox(x+s*0.42,0.5,z,0.13,0.012,0.25,0,0,70);g.obox(x,0.5,z+s*0.37,0.3,0.012,0.12,0,0,70);}g.phone(x,0.5,z);}
  /* SA CHAMBRE : la porte est restée entrouverte. Le noir. Seule la lumière du couloir entre, de biais. On n'entre pas. */
  doorLeaf(g,2.8,-5.05,1,1,0.55,81);g.solid(2.7,0,-5.1,3.25,2.1,-4.1);g.spot=g.P(2.2,0,-4.4);g.spot.push(0.5);
  g.cyl(2.0,-4.4,0.22,H-0.12,H,0,false,12);g.cyl(2.0,-4.4,0.18,H-0.13,H-0.12,17,false,12);
  g.box(2.86,0.1,-6.9,8.9,H,-6.89,42,false);
  /* le lit fait au carré, comme s'il allait revenir */
  g.box(6.4,0,-6.88,8.88,0.38,-4.9,81);g.box(6.45,0.38,-6.83,8.83,0.58,-4.95,76);g.box(6.4,0.58,-6.3,8.88,0.62,-4.92,66,false);g.box(6.38,0.3,-6.3,6.41,0.6,-4.92,66,false);g.box(8.87,0.3,-6.3,8.9,0.6,-4.92,66,false);
  g.box(6.4,0.58,-6.45,8.88,0.66,-6.3,76,false);for(const x of[7.05,8.25])g.ell(x,0.7,-6.62,0.42,0.09,0.18,76,ICO1);
  g.box(6.4,0.38,-6.95,8.88,1.25,-6.88,81,false);for(let q=0;q<7;q++)g.box(6.55+q*0.33,0.45,-6.88,6.65+q*0.33,1.15,-6.86,81,false);
  for(const dz of[-0.06,0.08])g.ell(6.25,0.04,-5.0+dz,0.05,0.035,0.12,49,ICO1);
  /* la table de nuit : la lampe éteinte, le réveil, un verre, une photo retournée */
  {const x=5.95,z=-6.55;g.box(x-0.24,0.08,z-0.24,x+0.24,0.55,z+0.24,81);g.box(x-0.26,0.55,z-0.26,x+0.26,0.58,z+0.26,81);for(const a of[-0.2,0.2])for(const b of[-0.2,0.2])g.rod(x+a,0,z+b,x+a,0.08,z+b,0.015,81,4);
    g.box(x-0.2,0.3,z+0.24,x+0.2,0.5,z+0.25,81,false);g.sphere(x,0.4,z+0.26,0.015,78,ICO0);
    g.cone(x-0.12,z-0.1,0.06,0.045,0.58,0.61,78,8);g.rod(x-0.12,0.61,z-0.1,x-0.12,0.86,z-0.1,0.008,78,4);g.cone(x-0.12,z-0.1,0.12,0.07,0.84,1.0,0,12);
    g.box(x+0.06,0.58,z-0.14,x+0.18,0.66,z-0.1,47,false);g.cone(x+0.1,z+0.1,0.03,0.028,0.58,0.69,13,8);g.obox(x-0.02,0.59,z+0.12,0.08,0.006,0.1,0.4,0,78);}
  /* la chaise, sa veste sur le dossier ; ses chaussures alignées */
  {const x=7.9,z=-3.0;g.box(x-0.22,0.44,z-0.22,x+0.22,0.48,z+0.22,81);for(const a of[-0.19,0.19])for(const b of[-0.19,0.19])g.rod(x+a,0,z+b,x+a,0.44,z+b,0.014,81,5);
    for(const a of[-0.19,0.19])g.rod(x+a,0.48,z+0.19,x+a,0.98,z+0.21,0.014,81,5);g.box(x-0.21,0.82,z+0.18,x+0.21,0.96,z+0.23,81,false);
    g.ell(x,0.72,z+0.25,0.26,0.32,0.08,49,ICO1);g.ell(x,0.98,z+0.23,0.24,0.06,0.09,49,ICO1);g.box(x-0.18,0.48,z-0.15,x+0.18,0.53,z+0.1,49,false);}
  for(const q of[0,0.22])g.ell(8.6,0.05,-2.5-q,0.07,0.05,0.14,47,ICO1);
  armoire(g,furn(g,true,-3.0,8.88,-1),0,1.3,0.6,81);
  /* les rideaux tirés ; un trait de jour entre les deux */
  for(let q=0;q<10;q++){const z=-5.15+q*0.13+(q>4?0.03:0);g.box(8.74-(q%2)*0.03,0.25,z,8.8-(q%2)*0.03,2.35,z+0.13,83,false);}g.box(8.81,0.4,-4.52,8.82,2.2,-4.49,17,false);g.rod(8.77,2.42,-5.3,8.77,2.42,-3.7,0.015,78,5);
  /* la poutre, la corde, le tabouret renversé */
  g.box(3.98,H-0.24,-6.9,4.26,H,-2.07,81,false);for(let q=0;q<2;q++)g.box(3.97,H-0.24,-6.9+q*0.002,4.27,H-0.235,-2.07,27,false);
  for(const dz of[-0.07,0,0.07])g.torus(4.12,H-0.12,-3.3+dz,0.165,0.017,[0,0,1],91,18,5);
  ropeAlong(g,[[4.12,H-0.26,-3.3],[4.12,1.98,-3.3],[4.12,1.78,-3.3]],0.016);
  for(let q=0;q<7;q++)g.torus(4.12,1.8+q*0.026,-3.3,0.03,0.014,[0,1,0],91,12,5);
  {const P=[],R=0.13,cy=1.64;for(let k=0;k<=20;k++){const a=k/20*6.283;P.push([4.12,cy+Math.cos(a)*R,-3.3+Math.sin(a)*R*0.92]);}ropeAlong(g,P,0.015);}
  ropeAlong(g,[[4.12,1.98,-3.3],[4.13,2.04,-3.28],[4.15,2.02,-3.24]],0.014);
  stoolDown(g,[4.6,0.17,-2.85],0.55,41);
  g.box(4.6,0.005,-4.6,6.0,0.012,-3.0,58,false);
}


/* ================= chapitre 4 : les cauchemars d'après ================= */
/* murs d'une pièce rectangulaire, avec des ouvertures : ops = [[côté 'n'|'s'|'w'|'e', centre, largeur, hauteur]] */
function room4(g,x0,z0,x1,z1,H,m,ops,t){t=t||0.15;
  const side=(sd,a0,a1,fix,isX)=>{const O=ops.filter(o=>o[0]===sd).sort((p,q)=>p[1]-q[1]);let a=a0;
    const B=(u0,u1,y0,y1)=>{if(u1-u0<0.01)return;isX?g.box(u0,y0,fix-t/2,u1,y1,fix+t/2,m):g.box(fix-t/2,y0,u0,fix+t/2,y1,u1,m);};
    for(const [,c,w,h] of O){B(a,c-w/2,0,H);B(c-w/2,c+w/2,h,H);a=c+w/2;}B(a,a1,0,H);};
  side('n',x0,x1,z0,true);side('s',x0,x1,z1,true);side('w',z0,z1,x0,false);side('e',z0,z1,x1,false);}
const hasX=(a,b)=>Math.abs(a)+Math.abs(b)>=2;
/* un battant de porte : gond (hx,hz), sens fermé (cx,cz) le long du mur, côté ouvert (nx,nz), ouverture th */
function leafAt(g,hx,hz,cx,cz,nx,nz,th,m){m=m||81;const u=[cx*Math.cos(th)+nx*Math.sin(th),cz*Math.cos(th)+nz*Math.sin(th)],nr=[u[1],-u[0]],yaw=Math.atan2(-u[1],u[0]);
  g.obox(hx+u[0]*0.45,1.04,hz+u[1]*0.45,0.45,1.04,0.024,yaw,0,m);
  for(const f of[-1,1]){for(const [t,y,h] of[[0.25,0.6,0.32],[0.68,0.6,0.32],[0.25,1.52,0.38],[0.68,1.52,0.38]])g.obox(hx+u[0]*t*0.9+nr[0]*f*0.026,y,hz+u[1]*t*0.9+nr[1]*f*0.026,0.15,h,0.005,yaw,0,m);
    const p=[hx+u[0]*0.8+nr[0]*f*0.026,hz+u[1]*0.8+nr[1]*f*0.026],q=[p[0]+nr[0]*f*0.05,p[1]+nr[1]*f*0.05];g.rod(p[0],1.0,p[1],q[0],1.0,q[1],0.008,78,6);g.rod(q[0],1.0,q[1],q[0]-u[0]*0.11,1.0,q[1]-u[1]*0.11,0.008,78,6,0.008,true);}}
function houseNightCell(g,c,i,j,r){ /* la maison du chapitre 3, mais elle ne finit plus */
  const T=c.type,H=2.5,t=0.12;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,89);g.box(-24,H,-24,24,H+0.3,24,0,false);
  const ajar=[];
  const wall=(alongX,fix,u0,u1,D,m,ajarSide)=>{let u=u0;const S=[...D].sort((p,q)=>p-q);
    const B=(a0,a1,y0,y1,mm,sol)=>{if(a1-a0<0.01)return;alongX?g.box(a0,y0,fix-t/2,a1,y1,fix+t/2,mm,sol):g.box(fix-t/2,y0,a0,fix+t/2,y1,a1,mm,sol);};
    const Bp=(a0,a1)=>{if(a1-a0<0.01)return;alongX?g.box(a0,0,fix-t/2-0.014,a1,0.09,fix+t/2+0.014,0,false):g.box(fix-t/2-0.014,0,a0,fix+t/2+0.014,0.09,a1,0,false);
      alongX?g.box(a0,H-0.06,fix-t/2-0.03,a1,H,fix+t/2+0.03,0,false):g.box(fix-t/2-0.03,H-0.06,a0,fix+t/2+0.03,H,a1,0,false);};
    for(const d of S){B(u,d-0.5,0,H,m);Bp(u,d-0.5);B(d-0.5,d+0.5,2.1,H,m);u=d+0.5;
      const fr=(a0,a1,y0,y1)=>alongX?g.box(a0,y0,fix-0.1,a1,y1,fix+0.1,0,false):g.box(fix-0.1,y0,a0,fix+0.1,y1,a1,0,false);fr(d-0.57,d-0.5,0,2.17);fr(d+0.5,d+0.57,0,2.17);fr(d-0.57,d+0.57,2.1,2.17);
      if(ajarSide&&r()<0.3)ajar.push([alongX,fix,d,ajarSide]);}
    B(u,u1,0,H,m);Bp(u,u1);};
  for(const s of[-1,1]){
    wall(true,s*1.2,-24,-1.2,[-18,-6],90,s);wall(true,s*1.2,1.2,24,[6,18],90,s);
    wall(false,s*1.2,-24,-1.2,[-18,-6],90,s);wall(false,s*1.2,1.2,24,[6,18],90,s);
    wall(true,s*24,-24,-1.2,[-12],42);wall(true,s*24,1.2,24,[12],42);wall(false,s*24,-24,-1.2,[-12],42);wall(false,s*24,1.2,24,[12],42);
    for(const q of[-1,1])wall(true,s*12.6,q>0?1.2:-24,q>0?24:-1.2,[q*12],42);}
  /* le couloir : tapis, appliques de laiton, cadres de famille, plafonniers qui grésillent */
  g.box(-1.0,0.005,-24,1.0,0.012,24,66,false);g.box(-24,0.005,-1.0,24,0.012,1.0,66,false);
  for(let q=-22;q<=22;q+=4){if(Math.abs(q)<2)continue;g.cyl(q,0,0.18,H-0.04,H,0,false,10);g.cyl(q,0,0.15,H-0.05,H-0.04,17,false,10);g.cyl(0,q,0.18,H-0.04,H,0,false,10);g.cyl(0,q,0.15,H-0.05,H-0.04,17,false,10);}
  for(const s of[-1,1])for(let q=-21;q<=21;q+=6){if(Math.abs(q)<3)continue;const w=s*1.13;
    g.box(q-0.05,1.62,w-0.02*s,q+0.05,1.8,w,78,false);g.rod(q,1.7,w,q,1.76,w-s*0.14,0.01,78,4);g.cone(q,w-s*0.14,0.08,0.05,1.74,1.9,84,8);
    if(r()<0.6){const x=q+1.6,fw=0.22+r()*0.15,fh=0.28+r()*0.12;g.box(x-fw,1.3,w-0.025*s,x+fw,1.3+fh*2,w,78,false);g.box(x-fw+0.04,1.34,w-0.03*s,x+fw-0.04,1.26+fh*2,w-0.025*s,r()<0.3?47:86,false);}
    const z=q,x2=s*1.13;g.box(x2-0.02*s,1.62,z-0.05,x2,1.8,z+0.05,78,false);g.rod(x2,1.7,z,x2-s*0.14,1.76,z,0.01,78,4);g.cone(x2-s*0.14,z,0.08,0.05,1.74,1.9,84,8);}
  /* les portes de sa chambre : entrouvertes sur le noir. Refermées, elles le restent. */
  for(const [ax,fix,d,sd] of ajar){const into=sd,th=0.35+r()*0.25,hasP=r()<0.7,key=i+','+j+','+g.phones.length,closed=hasP&&typeof answered!=='undefined'&&answered.has(key);
    if(ax){leafAt(g,d-0.45,fix,1,0,0,into,closed?0:th);if(!closed)g.box(d-0.5,0,Math.min(fix+into*0.07,fix+into*0.1),d+0.5,2.1,Math.max(fix+into*0.07,fix+into*0.1),28,false);
      g.solid(d-0.5,0,Math.min(fix,fix+into*0.5),d+0.5,2.1,Math.max(fix,fix+into*0.5));if(hasP)g.phone(d,1.0,fix-into*0.45);}
    else{leafAt(g,fix,d-0.45,0,1,into,0,closed?0:th);if(!closed)g.box(Math.min(fix+into*0.07,fix+into*0.1),0,d-0.5,Math.max(fix+into*0.07,fix+into*0.1),2.1,d+0.5,28,false);
      g.solid(Math.min(fix,fix+into*0.5),0,d-0.5,Math.max(fix,fix+into*0.5),2.1,d+0.5);if(hasP)g.phone(fix-into*0.45,1.0,d);}}
  /* les pièces : chacune meublée comme une vraie pièce, contre son mur du fond */
  const room=(sa,sb,far)=>{const bz=sb*(far?23.94:12.54),mz=sb*(far?18.3:6.9),kind=Math.floor(r()*5),X=v=>sa*v;
    g.cyl(X(12),mz,0.25,H-0.05,H,0,false,12);g.cyl(X(12),mz,0.2,H-0.06,H-0.05,17,false,12);
    const B=(x0,x1,y0,y1,d0,d1,m,sol)=>g.box(Math.min(X(x0),X(x1)),y0,Math.min(bz-sb*d0,bz-sb*d1),Math.max(X(x0),X(x1)),y1,Math.max(bz-sb*d0,bz-sb*d1),m,sol);
    const P=(x,d)=>[X(x),bz-sb*d];
    if(kind===0){ /* salon */
      const p=P(5.5,0.55);sofa2(g,p[0],p[1],1.25,sb,83,81);B(4.5,6.5,0.38,0.42,1.6,2.4,81);B(3.5,7.5,0.005,0.012,1.2,3.4,66,false);
      B(4.3,6.7,1.25,1.95,0.0,0.04,78,false);B(4.4,6.6,1.32,1.88,0.04,0.05,86,false);
      {const q=P(8.3,0.4);g.cone(q[0],q[1],0.16,0.12,0,0.04,78,10);g.rod(q[0],0.04,q[1],q[0],1.5,q[1],0.012,78,5);g.cone(q[0],q[1],0.25,0.16,1.45,1.75,84,12);}
      B(17.4,19.6,0,2.0,0,0.35,81);for(let y=0.1;y<1.9;y+=0.45){B(17.45,19.55,y,y+0.03,0.02,0.35,81,false);let x=17.5;while(x<19.4){const w=0.04+r()*0.05;B(x,x+w,y+0.03,y+0.25+r()*0.12,0.06,0.32,[48,49,51,36,0,41][Math.floor(r()*6)],false);x+=w+0.006;}}
      const a=P(11.5,3.8);sofa2(g,a[0],a[1],0.42,sb,83,81);}
    else if(kind===1){ /* chambre */
      B(4.5,6.5,0,0.38,0.05,2.15,81);B(4.55,6.45,0.38,0.56,0.08,2.1,76);B(4.5,6.5,0.56,0.6,0.7,2.15,66,false);B(4.5,6.5,0.38,1.15,0.0,0.06,81,false);
      for(const x of[5.0,6.0]){const q=P(x,0.35);g.ell(q[0],0.64,q[1],0.4,0.08,0.17,76,ICO1);}
      for(const x of[3.95,7.05]){B(x-0.25,x+0.25,0,0.55,0.05,0.5,81);const q=P(x,0.28);tableLamp(g,q[0],0.55,q[1],0.75);}
      armoire(g,furn(g,false,X(18.5),bz,-sb),0,1.4,0.6,81);B(3.6,7.4,0.005,0.012,2.2,3.6,58,false);}
    else if(kind===2){ /* cuisine */
      B(2.5,9.5,0,0.86,0,0.62,44);B(2.48,9.52,0.86,0.9,0,0.66,59,false);B(2.5,9.5,0.9,1.5,0,0.012,10,false);for(let x=2.6;x<9.4;x+=0.72){B(x,x+0.68,0.1,0.8,0.62,0.63,44,false);B(x+0.28,x+0.4,0.7,0.72,0.63,0.65,50,false);}
      B(9.7,10.55,0,1.85,0,0.7,0);B(10.46,10.5,0.3,1.1,0.7,0.74,50,false);B(5,6,0.84,0.9,0.1,0.5,50,false);
      for(const x of[2.6,3.5,6.6,7.5])B(x,x+0.85,1.5,2.2,0,0.35,44);
      const q=P(12,4.2);g.box(q[0]-0.9,0.74,q[1]-0.55,q[0]+0.9,0.78,q[1]+0.55,81);for(const a of[-0.8,0.8])for(const bb of[-0.45,0.45])g.rod(q[0]+a,0,q[1]+bb,q[0]+a,0.74,q[1]+bb,0.03,81,6);
      for(const [dx,dz] of[[0,-0.95],[0,0.95],[-1.25,0],[1.25,0]]){const cx=q[0]+dx,cz=q[1]+dz;g.box(cx-0.21,0.44,cz-0.21,cx+0.21,0.48,cz+0.21,81);for(const a of[-0.18,0.18])for(const bb of[-0.18,0.18])g.rod(cx+a,0,cz+bb,cx+a,0.44,cz+bb,0.014,81,4);}
      g.cone(q[0]+0.3,q[1],0.045,0.04,0.78,0.88,0,8);}
    else if(kind===3){ /* bureau */
      B(4.4,6.6,0.72,0.76,0,0.7,81);for(const x of[4.45,6.55])B(x-0.04,x+0.04,0,0.72,0.04,0.66,81,false);B(4.5,5.2,0,0.72,0.05,0.65,81);
      {const q=P(6.2,0.3);tableLamp(g,q[0],0.76,q[1],0.7);const k=P(5.5,1.15);g.box(k[0]-0.22,0.44,k[1]-0.22,k[0]+0.22,0.48,k[1]+0.22,49);g.rod(k[0],0,k[1],k[0],0.44,k[1],0.03,50,6);B(5.28,5.72,0.48,1.0,1.33,1.38,49,false);}
      for(let q=0;q<5;q++)B(5.2+q*0.12,5.3+q*0.12,0.76,0.765+q*0.004,0.15,0.45,0,false);
      const F=furn(g,false,X(18.5),bz,-sb);for(let q=0;q<3;q++)filing(g,F,(q-1)*0.55,0.62,80);}
    else{ /* débarras : des cartons, des meubles sous des draps blancs */
      for(let q=0;q<9;q++){const x=3+(q%5)*1.0+r()*0.3,y=q<5?0:0.5,d=0.4+r()*0.4;B(x,x+0.6,y,y+0.48,d,d+0.5,70);}
      for(let q=0;q<3;q++){const p=P(15+q*2.8,1.4+r());g.ell(p[0],0.55+q*0.1,p[1],0.65,0.6+q*0.12,0.45,76,ICO1);g.box(p[0]-0.55,0,p[1]-0.38,p[0]+0.55,0.05,p[1]+0.38,76,false);}
      {const p=P(11,0.4);g.obox(p[0],0.95,p[1],0.35,0.9,0.03,0,0.08,81);g.obox(p[0],0.95,p[1]-sb*0.035,0.3,0.84,0.005,0,0.08,13);}}
    if(r()<0.2){const p=P(12+(r()-0.5)*6,2.5+r()*2);g.note(p[0],1.0,p[1]);}};
  for(const sa of[-1,1])for(const sb of[-1,1])for(const far of[0,1]){if(T===5&&sa>0&&sb<0&&far)continue;room(sa,sb,far);}
  if(T===5&&hasX(i,j)){ /* la porte d'entrée, éclairée, au bout d'une pièce vide */
    g.box(22.4,0,-19.8,23.9,2.3,-18.2,81);g.box(22.3,0.05,-19.7,22.4,2.25,-18.3,25,false);g.box(22.2,2.3,-20,23.9,2.45,-18,17,false);g.box(21.4,0.005,-20.2,22.3,0.012,-17.8,25,false);g.hdoor(21.7,-19);}
  if(r()<0.55)g.watchAt(r()<0.5?-21:21,0);
  if(r()<0.35)g.npc(-6+r()*12,0,r()<0.5?-0.4:0.4,r()*6.28);
  if(r()<0.4)g.note(r()<0.5?-10:10,1.0,0.6);
}
function waitCell(g,c,i,j,r){ /* la salle d'attente : la nuit de l'appel, sans fin */
  const T=c.type,H=3.2;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,68);g.box(-24,H,-24,24,H+0.3,24,0,false);
  for(let a=-20;a<=20;a+=8)for(let b=-20;b<=20;b+=8)g.box(a-0.6,H-0.03,b-1.2,a+0.6,H,b+1.2,17,false);
  for(const a of[-12,12])for(const b of[-12,12]){g.box(a-0.35,0,b-0.35,a+0.35,H,b+0.35,0);g.box(a-0.37,0,b-0.37,a+0.37,0.12,b+0.37,12,false);}
  /* des rangées de sièges vissés, dos à dos */
  const row=(a,b,n,f)=>{const L=n*0.55;g.box(a-L/2,0.36,b-0.04,a+L/2,0.4,b+0.04,50,false);for(const q of[-L/2+0.2,L/2-0.2]){g.rod(a+q,0,b,a+q,0.36,b,0.03,50,5);g.box(a+q-0.05,0,b-0.3,a+q+0.05,0.02,b+0.3,50,false);}
    for(let k=0;k<n;k++){const x=a-L/2+0.275+k*0.55;g.box(x-0.24,0.4,b-0.22,x+0.24,0.46,b+0.2,16);g.obox(x,0.72,b+f*0.24,0.24,0.25,0.025,0,f*0.12,16);}};
  for(let q=0;q<4;q++){const b=-18+q*12;if(T===3&&q===1)continue;for(const a of[-17,-5,7,17]){row(a,b,5,1);row(a,b+0.9,5,-1);}}
  /* écran des numéros, télé qui grésille, distributeur de tickets, machine à café */
  g.box(-2,2.2,-23.7,2,3.0,-23.5,12);g.box(-1.9,2.28,-23.5,1.9,2.92,-23.49,47,false);neonText(g,-1.6,2.4,-23.48,1,0,0.42,'N 214',48,0.03);
  g.box(8,1.9,-23.7,9.8,2.9,-23.55,47);g.box(8.08,1.98,-23.55,9.72,2.82,-23.54,29,false);
  g.box(-9,0,-23.6,-8.4,1.3,-23.1,0);g.box(-8.95,0.95,-23.1,-8.45,1.05,-23.08,48,false);g.box(-8.8,0.7,-23.1,-8.6,0.74,-22.9,0,false);
  g.box(-15,0,-23.7,-14,1.9,-23,47);g.box(-14.95,0.9,-23,-14.05,1.8,-22.99,13,false);
  potPlant(g,-22.5,-22.5,1.4,0);potPlant(g,22.5,22.5,1.4,0);
  for(let a=-24;a<=24;a+=1.2)g.box(a-0.015,H-0.02,-24,a+0.015,H,24,50,false);for(let b=-24;b<=24;b+=1.2)g.box(-24,H-0.02,b-0.015,24,H,b+0.015,50,false);
  {const x=4,y=2.45,z=-23.58;g.rod(x,y,z,x,y,z+0.06,0.32,0,24,0.32,true);g.torus(x,y,z+0.06,0.32,0.025,[0,0,1],12,24,4);for(let k=0;k<12;k++){const a=k/12*6.283;g.box(x+Math.cos(a)*0.27-0.012,y+Math.sin(a)*0.27-0.012,z+0.065,x+Math.cos(a)*0.27+0.012,y+Math.sin(a)*0.27+0.012,z+0.07,12,false);}
    g.rod(x,y,z+0.075,x+0.16,y+0.05,z+0.075,0.012,12,4);g.rod(x,y,z+0.08,x-0.05,y+0.22,z+0.08,0.008,12,4);}
  {const x=-20,z=-23.2;g.box(x-0.18,0,z-0.18,x+0.18,1.0,z+0.18,0);g.box(x-0.12,0.6,z+0.17,x+0.12,0.7,z+0.2,50,false);g.cone(x,z,0.15,0.15,1.0,1.42,13,12);g.ell(x,1.45,z,0.15,0.06,0.15,13,ICO1);}
  for(const [x,c] of[[-4.5,49],[-18,36],[14,35]]){g.box(x-0.45,1.3,-23.62,x+0.45,2.4,-23.6,c,false);g.box(x-0.38,1.4,-23.6,x+0.38,1.7,-23.59,0,false);g.box(x-0.38,1.8,-23.6,x+0.1,1.86,-23.59,0,false);}
  for(let q=0;q<12;q++)g.box(-14.92+(q%4)*0.22,1.0+Math.floor(q/4)*0.26,-23.0,-14.76+(q%4)*0.22,1.18+Math.floor(q/4)*0.26,-22.99,[48,49,36,35,34][q%5],false);
  for(const [c,o] of[[49,-0.4],[48,0.4]])g.box(-24,0.002,o-0.08,24,0.006,o+0.08,c,false);
  for(const a of[-11,1,13]){const b=-12;g.box(a-0.5,0.4,b-0.3,a+0.5,0.44,b+0.3,0);g.rod(a,0,b,a,0.4,b,0.04,50,6);g.box(a-0.3,0.44,b-0.15,a+0.05,0.45,b+0.15,[36,49][0],false);g.box(a-0.1,0.45,b-0.18,a+0.25,0.46,b+0.12,0,false);}
  for(const s of[-1,1]){g.box(-24,0,s*23.8-0.2,-3,H,s*23.8+0.2,0);g.box(3,0,s*23.8-0.2,24,H,s*23.8+0.2,0);g.box(s*23.8-0.2,0,-24,s*23.8+0.2,H,-3,0);g.box(s*23.8-0.2,0,3,s*23.8+0.2,H,24,0);}
  if(T===5&&hasX(i,j)){ /* le guichet : la vitre, la lampe, ton numéro */
    g.box(10,0,20,22,1.1,21.2,0);g.box(10,1.1,21.1,22,2.4,21.2,13,false);g.box(10,2.4,20.8,22,3.2,21.2,0);g.box(14,2.5,20.78,18,2.95,20.8,47,false);
    neonText(g,14.2,2.58,20.77,1,0,0.32,'GUICHET',72,0.025);g.box(15.4,1.1,20.3,16.6,1.12,20.9,25,false);g.hdoor(16,19.4);}
  if(r()<0.7){const a=-17+Math.floor(r()*4)*12+(r()-0.5)*2,b=-18+Math.floor(r()*4)*12;g.box(a-0.04,0.46,b-0.08,a+0.04,0.47,b+0.08,47,false);g.box(a-0.035,0.47,b-0.075,a+0.035,0.471,b+0.075,61,false);g.phone(a,0.6,b);}
  if(r()<0.5)g.note(-12+r()*24,0.9,-6+r()*12);
  if(r()<0.4)g.statue(-10+r()*20,-8+r()*16);
  if(r()<0.3)g.npc(-6+r()*12,0,-6+r()*12,r()*6.28);
}
function funeralCell(g,c,i,j,r){ /* le funérarium : des chaises, des fleurs, un cercueil fermé */
  const T=c.type,H=4.4;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,58);g.box(-24,H,-24,24,H+0.3,24,12,false);
  for(const s of[-1,1]){g.box(-24,0,s*23.8-0.2,-3,H,s*23.8+0.2,81);g.box(3,0,s*23.8-0.2,24,H,s*23.8+0.2,81);g.box(s*23.8-0.2,0,-24,s*23.8+0.2,H,-3,81);g.box(s*23.8-0.2,0,3,s*23.8+0.2,H,24,81);}
  for(let k=-20;k<=20;k+=5){for(const s2 of[-1,1]){const z=s2*23.58;g.box(k-0.06,2.45,z-0.02*s2,k+0.06,2.75,z,78,false);g.rod(k,2.6,z,k,2.66,z-s2*0.16,0.01,78,4);g.cone(k,z-s2*0.16,0.11,0.07,2.62,2.84,84,10);}}
  for(const s2 of[-1,1])for(let k=-23;k<=23;k+=0.32)if(Math.abs(k)>3.2)g.box(k,0.1,s2*23.55-(Math.floor(k*3)%2?0.03:0)*s2,k+0.3,4.3,s2*23.6,83,false);
  g.box(-0.8,0.005,-13.8,0.8,0.012,22,48,false);g.box(-0.85,0.004,-13.8,0.85,0.006,22,78,false);
  /* l'estrade, le cercueil fermé, les couronnes, les cierges */
  g.box(-6,0,-20,6,0.3,-14,81);g.box(-6.1,0.3,-20.1,6.1,0.32,-13.9,58,false);
  g.box(-1.3,0.3,-18.15,1.3,0.42,-16.25,47);for(const x of[-1.0,1.0])for(const z of[-17.9,-16.5])g.rod(x,0.3,z,x,0.62,z,0.05,78,8);
  g.box(-1.12,0.62,-17.95,1.12,1.02,-16.45,81);g.box(-1.16,1.0,-17.99,1.16,1.06,-16.41,81);g.obox(0,1.1,-17.2,1.1,0.05,0.62,0,0,81);g.ell(0,1.12,-17.2,1.08,0.08,0.6,81,ICO1);
  for(const x of[-0.7,0,0.7])for(const s2 of[-1,1])g.rod(x-0.15,0.82,-17.2+s2*0.79,x+0.15,0.82,-17.2+s2*0.79,0.018,78,6);
  {const x=2.4,z=-15.4;g.rod(x,0.3,z+0.3,x,1.7,z,0.02,81,4);g.rod(x-0.35,0.3,z-0.2,x,1.7,z,0.02,81,4);g.rod(x+0.35,0.3,z-0.2,x,1.7,z,0.02,81,4);
    g.obox(x,1.3,z+0.05,0.3,0.38,0.02,0,-0.2,78);g.obox(x,1.3,z+0.07,0.25,0.33,0.005,0,-0.2,47);}
  for(const x of[-5,5]){g.rod(x,0,-15,x,1.0,-15,0.035,78,6);g.cone(x,-15,0.2,0.12,0,0.04,78,10);g.cone(x,-15,0.14,0.2,1.0,1.18,47,10);for(let q=0;q<9;q++)g.sphere(x+Math.cos(q*0.7)*0.17,1.25+(q%3)*0.06,-15+Math.sin(q*0.7)*0.17,0.07,[0,45,48,0,15][q%5],ICO0);}
  for(const s of[-1,1]){g.torus(s*3,1.2,-19.5,0.55,0.12,[0,0,1],15,14,5);for(let q=0;q<10;q++){const t=q/10*6.28;g.sphere(s*3+Math.cos(t)*0.55,1.2+Math.sin(t)*0.55,-19.38,0.08,[0,45,48,36][q%4],ICO0);}
    g.rod(s*3,0.3,-19.6,s*3-0.3,0.65,-19.6,0.012,50,4);g.rod(s*3,0.3,-19.6,s*3+0.3,0.65,-19.6,0.012,50,4);
    for(const q of[1.6,2.0]){g.cyl(s*q,-15.2,0.05,0.3,1.4,0,false,8);g.ell(s*q,1.46,-15.2,0.025,0.05,0.025,25,ICO0);}}
  for(let q=0;q<8;q++)g.ell(-1+q*0.28,1.12,-17.2,0.07,0.06,0.07,[0,45,48][q%3],ICO0);
  for(let rw=0;rw<6;rw++)for(const sd of[-1,1])for(let k=0;k<5;k++){const x=sd*(1.6+k*0.62),z=-11+rw*1.7;g.box(x-0.23,0.44,z-0.22,x+0.23,0.48,z+0.22,83);g.box(x-0.23,0.48,z+0.18,x+0.23,0.95,z+0.22,81,false);for(const a of[-0.2,0.2])for(const b of[-0.19,0.19])g.rod(x+a,0,z+b,x+a,0.44,z+b,0.012,81,4);}
  /* le registre des condoléances */
  {const x=-8,z=-12;g.rod(x,0,z,x,1.0,z,0.04,81,6);g.obox(x,1.05,z,0.32,0.03,0.24,0,0.35,81);g.obox(x,1.09,z,0.28,0.01,0.2,0,0.35,0);g.note(x,1.35,z);}
  if(r()<0.7){g.box(4.5,0.3,-15.6,5.2,0.34,-15.0,0,false);for(let q=0;q<6;q++)g.ell(4.6+q*0.1,0.42,-15.3,0.06,0.05,0.06,[48,0,45][q%3],ICO0);g.phone(4.85,0.6,-15.3);}
  if(T===5&&hasX(i,j)){ /* derrière l'estrade, le rideau entrouvert, une lumière */
    g.box(-3,0,-23.55,3,H,-23.45,83);g.box(-0.6,0,-23.6,0.6,2.4,-23.4,25,false);g.box(-0.7,0,-23.5,0.7,0.02,-22,25,false);g.hdoor(0,-22.4);}
  for(let k=0;k<2;k++)if(r()<0.6)g.statue((r()<0.5?-1:1)*(5+r()*12),-8+r()*14);
  if(r()<0.3)g.npc(-10+r()*20,0,6+r()*10,r()*6.28);
}
function graveyardCell(g,c,i,j,r){ /* le cimetière sous la pluie : toutes les tombes portent le même nom */
  const T=c.type;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,9);
  g.box(-1.6,0,-24,1.6,0.03,24,59,false);g.box(-24,0,-1.6,24,0.03,1.6,59,false);
  const tomb=(x,z,k)=>{const st=[59,50,59,12][k%4];
    if(k%3===0){g.box(x-0.45,0,z-0.12,x+0.45,0.85,z+0.12,st);g.cyl(x,z,0.45,0.85,0.86,st,false,12);g.box(x-0.5,0,z+0.15,x+0.5,0.18,z+1.9,st);}
    else if(k%3===1){g.box(x-0.06,0,z-0.06,x+0.06,1.3,z+0.06,st);g.box(x-0.35,0.85,z-0.06,x+0.35,0.97,z+0.06,st);g.box(x-0.45,0,z+0.1,x+0.45,0.12,z+1.8,9,false);}
    else{g.box(x-0.4,0,z-0.1,x+0.4,0.7,z+0.1,st);g.box(x-0.55,0,z+0.12,x+0.55,0.3,z+1.95,st);}
    if(r()<0.2)g.cone(x+0.3,z+0.3,0.06,0.05,0,0.16,48,6);};
  for(const sa of[-1,1])for(const sb of[-1,1])for(let a=0;a<5;a++)for(let b=0;b<4;b++){if(T===5&&sa>0&&sb<0&&a<2&&b<2)continue;tomb(sa*(4+a*3.8),sb*(4+b*4.8),Math.floor(r()*12));}
  for(const [x,z] of[[-2.6,-10],[2.6,10],[-2.6,14],[2.6,-18]]){g.rod(x,0,z,x,1.2,z,0.1,27,6);g.cone(x,z,0.75,0.05,1.0,6.5,15,10);}
  for(let q=0;q<3;q++){if(r()<0.5)continue;const x=(r()<0.5?-1:1)*(4+Math.floor(r()*5)*3.8),z=(r()<0.5?-1:1)*(4+Math.floor(r()*4)*4.8);
    for(const [a0,b0,a1,b1] of[[-0.75,-0.3,0.75,-0.3],[-0.75,2.2,0.75,2.2],[-0.75,-0.3,-0.75,2.2],[0.75,-0.3,0.75,2.2]]){const L=Math.hypot(a1-a0,b1-b0),n=Math.round(L/0.14);
      g.rod(x+a0,0.62,z+b0,x+a1,0.62,z+b1,0.012,12,4);g.rod(x+a0,0.3,z+b0,x+a1,0.3,z+b1,0.012,12,4);for(let k=0;k<=n;k++){const t=k/n,px=x+a0+(a1-a0)*t,pz=z+b0+(b1-b0)*t;g.rod(px,0,pz,px,0.7,pz,0.008,12,4);g.cone(px,pz,0.02,0.002,0.7,0.76,12,4);}}}
  for(let q=0;q<4;q++){const x=(r()<0.5?-1:1)*(4.3+Math.floor(r()*5)*3.8),z=(r()<0.5?-1:1)*(4.6+Math.floor(r()*4)*4.8);g.box(x-0.06,0,z-0.06,x+0.06,0.22,z+0.06,47);g.box(x-0.045,0.06,z-0.045,x+0.045,0.18,z+0.045,25,false);g.cone(x,z,0.07,0.01,0.22,0.3,47,4);}
  for(let q=0;q<3;q++){const x=(r()-0.5)*3,z=(r()-0.5)*40;g.box(x-0.4-r()*0.5,0.031,z-0.3,x+0.4+r()*0.5,0.034,z+0.3,47,false);}
  if(r()<0.3){const x=-14,z=-14;g.box(x-2,0,z-1.6,x+2,2.6,z+1.6,59);gable(g,x-2.2,z-1.8,x+2.2,z+1.8,2.6,1.0,59,59);g.box(x-0.6,0,z+1.6,x+0.6,1.9,z+1.65,12,false);for(let k=0;k<5;k++)g.box(x-0.55+k*0.27,0.1,z+1.66,x-0.5+k*0.27,1.85,z+1.68,50,false);}
  if(r()<0.5){g.cyl(2.2,2.2,0.06,0,3.6,50,false,6);g.cone(2.2,2.2,0.2,0.1,3.4,3.7,25,8);}
  if(T===5&&hasX(i,j)){ /* sa tombe : la terre est encore fraîche, quelqu'un a laissé des fleurs */
    const x=8,z=-8;g.box(x-0.5,0,z-0.12,x+0.5,1.0,z+0.12,0);g.cyl(x,z,0.5,1.0,1.01,0,false,14);g.box(x-0.6,0,z+0.15,x+0.6,0.22,z+2.1,27);
    for(let q=0;q<9;q++)g.ell(x-0.4+q*0.1,0.27,z+0.5+(q%3)*0.15,0.07,0.06,0.07,[0,48,45][q%3],ICO0);g.cone(x-0.3,z+0.3,0.05,0.05,0,0.2,25,6);g.hdoor(x,z+2.6);}
  if(r()<0.65)g.item((r()<0.5?-1:1)*(2+r()*16),1.1,(r()<0.5?-1:1)*(2.4+r()*1.2));
  if(r()<0.5)g.note(-6+r()*12,0.7,(r()<0.5?-1:1)*(4+r()*14));
  for(let k=0;k<2;k++)if(r()<0.45)g.statue((r()<0.5?-1:1)*(3+r()*18),(r()<0.5?-1:1)*(3+r()*18));
  if(r()<0.3)g.npc(r()<0.5?-0.8:0.8,0,-10+r()*20,r()*6.28);
  if(r()<0.35)g.watchAt(0,(r()<0.5?-1:1)*20);
}
function boxesCell(g,c,i,j,r){ /* l'entrepôt : toute une vie dans des cartons, jusqu'au plafond */
  const T=c.type,H=8.5;g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,59);g.box(-24,H,-24,24,H+0.4,24,12,false);
  for(let a=-22;a<=22;a+=11)g.box(a-0.15,H-0.6,-24,a+0.15,H-0.3,24,50,false);
  for(let a=-18;a<=18;a+=12)for(let b=-18;b<=18;b+=12){g.box(a-0.6,H-0.9,b-0.15,a+0.6,H-0.8,b+0.15,17,false);g.rod(a,H-0.8,b,a,H-0.3,b,0.01,50,3);}
  g.box(-24,0.002,-0.08,24,0.006,0.08,36,false);
  /* rayonnages : montants bleus, lisses orange, cartons de toutes tailles */
  for(const sb of[-1,1])for(let rk=0;rk<3;rk++){const z0=sb*(4+rk*7),z1=z0+sb*2.2,zl=Math.min(z0,z1),zh=Math.max(z0,z1);
    for(let a=-21;a<=21;a+=3){if(Math.abs(a)<2)continue;g.box(a-0.06,0,zl,a+0.06,6.2,zl+0.1,49,false);g.box(a-0.06,0,zh-0.1,a+0.06,6.2,zh,49,false);}
    for(const y of[0.15,1.7,3.3,4.9]){for(const sg of[-1,1]){const a0=sg>0?2:-21,a1=sg>0?21:-2;g.box(a0,y,zl,a1,y+0.12,zl+0.08,48,false);g.box(a0,y,zh-0.08,a1,y+0.12,zh,48,false);g.box(a0,y+0.12,zl,a1,y+0.14,zh,41,false);
        let a=a0+0.1;while(a<a1-0.6){const w=0.5+r()*0.7,h=0.35+r()*0.9;if(r()<0.85)g.box(a,y+0.14,zl+0.15+r()*0.2,a+w,y+0.14+Math.min(h,1.3),zh-0.15,70,false);a+=w+0.08;}}}
    g.solid(-21,0,zl,-2,6.3,zh);g.solid(2,0,zl,21,6.3,zh);}
  for(let k=0;k<5;k++){const a=-20+r()*40,b=(r()<0.5?-1:1)*(1.2+r()*1.4);if(Math.abs(a)<2.5)continue;const n=1+Math.floor(r()*3);
    for(let q=0;q<3;q++)g.box(a-0.6,0.12,b-0.4+q*0.37,a+0.6,0.15,b-0.34+q*0.37,41,false);for(const dx of[-0.55,0,0.55])g.box(a+dx-0.05,0,b-0.4,a+dx+0.05,0.12,b+0.4,41,false);
    for(let q=0;q<n;q++)g.box(a-0.5,0.15+q*0.5,b-0.35,a+0.5,0.15+q*0.5+0.49,b+0.35,70);g.solid(a-0.6,0,b-0.4,a+0.6,0.15+n*0.5,b+0.4);}
  for(const s2 of[-1,1]){for(let q=0;q<3;q++){const z=s2*(2.9+q*7);g.box(-0.18,0,z-0.18,0.18,H,z+0.18,59);for(let y=0;y<1.2;y+=0.2)g.box(-0.19,y,z-0.19,0.19,y+0.1,z+0.19,(y*5)%2<1?36:47,false);}
    g.box(-0.6,5.6,s2*5.1-0.02,0.6,6.1,s2*5.1+0.02,49,false);neonText(g,-0.25,5.68,s2*5.1+0.025*s2,s2,0,0.32,s2>0?'A':'B',0,0.02);}
  {const x=-1.0,z=-0.9;g.box(x-0.12,1.0,z-0.02,x+0.12,1.5,z+0.02,48,false);g.cyl(x+20.5,1.0,0.09,0.4,0.95,48,false,10);}
  if(r()<0.4){const a=8+r()*8,b=-1.5;g.box(a-0.6,0.15,b-0.45,a+0.6,0.95,b+0.45,36);g.box(a+0.3,0.95,b-0.42,a+0.6,1.9,b+0.42,36);g.box(a-0.62,1.9,b-0.45,a+0.62,1.95,b+0.45,47,false);
    for(const dz of[-0.42,0.42]){g.rod(a-0.55,0.95,b+dz,a-0.55,1.9,b+dz,0.025,47,5);}g.box(a-0.8,0,b-0.35,a-0.6,2.4,b-0.28,50);g.box(a-0.8,0,b+0.28,a-0.6,2.4,b+0.35,50);g.box(a-1.7,0.05,b-0.3,a-0.62,0.1,b-0.2,50,false);g.box(a-1.7,0.05,b+0.2,a-0.62,0.1,b+0.3,50,false);
    for(const dx of[-0.4,0.4])for(const dz of[-0.46,0.46])g.rod(a+dx,0.18,b+dz,a+dx,0.18,b+dz+(dz>0?0.08:-0.08),0.18,47,10,0.18,true);g.solid(a-1.7,0,b-0.5,a+0.65,1.95,b+0.5);}
  if(r()<0.7){const a=(r()<0.5?-1:1)*(6+r()*12),b=(r()<0.5?-1:1)*1.8;g.box(a-0.35,0,b-0.3,a+0.35,0.6,b+0.3,70);g.box(a-0.2,0.3,b+0.301,a+0.2,0.45,b+0.302,0,false);g.phone(a,0.75,b);}
  if(r()<0.4)g.note(-4+r()*8,1.0,(r()<0.5?-1:1)*1.5);
  if(T===5&&hasX(i,j)){ /* le quai : le rideau métallique à demi levé, la lumière du dehors */
    for(const s of[-1,1])g.box(s*23.8-0.2,0,-3,s*23.8+0.2,H,3,12);g.box(23.4,1.1,-2.4,23.6,H-1,2.4,50,false);for(let y=1.2;y<6;y+=0.16)g.box(23.35,y,-2.4,23.4,y+0.05,2.4,12,false);
    g.box(23.6,0,-2.4,23.7,1.1,2.4,17,false);g.box(21,0.005,-2.6,23.6,0.012,2.6,25,false);g.hdoor(22.8,0);}
  if(r()<0.5)g.watchAt((r()<0.5?-1:1)*22,0);
  if(r()<0.3)g.npc(-10+r()*20,0,(r()<0.5?-1:1)*0.8,r()*6.28);
}
function nightRoadCell(g,c,i,j,r){ /* la route de nuit : sans fin, et c'est toi qui conduis */
  g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,9);
  if(j===0){g.box(-24,0,-6,24,0.04,6,20,false);for(const z of[-5.6,5.6])g.box(-24,0.041,z-0.08,24,0.045,z+0.08,0,false);
    for(let k=-24;k<24;k+=6)g.box(k,0.041,-0.07,k+3,0.045,0.07,0,false);
    for(const s of[-1,1]){for(let k=-24;k<=24;k+=4)g.box(k-0.05,0,s*7-0.05,k+0.05,0.7,s*7+0.05,50,false);g.box(-24,0.45,s*7-0.02,24,0.72,s*7+0.04,50,false);
      for(const k of[-12,12]){g.cyl(k,s*7.6,0.07,0,7,50,false,6);g.rod(k,7,s*7.6,k,7.1,s*5.8,0.05,50,5);g.box(k-0.25,6.85,s*5.6-0.18,k+0.25,7.0,s*5.6+0.18,i%3===0?12:25,false);}}
    if(r()<0.5){const x=-10+r()*20,s=r()<0.5?-1:1,txt=['MAISON','SORTIE','PAUSE'][Math.floor(r()*3)];for(const dx of[-1.0,1.0])g.rod(x+dx,0,s*8.6,x+dx,3.6,s*8.6,0.05,50,6);
      g.box(x-1.5,2.4,s*8.6-0.03,x+1.5,3.6,s*8.6+0.03,51,false);g.box(x-1.42,2.48,s*8.6-0.035,x+1.42,3.52,s*8.6-0.03,0,false);g.box(x-1.38,2.52,s*8.6-0.04,x+1.38,3.48,s*8.6-0.035,51,false);
      neonText(g,x+textW(txt,0.42)/2,2.8,s*8.6-0.045,-1,0,0.42,txt,0,0.03);g.note(x,1.4,s*7.8);}
    for(const s2 of[-1,1])for(let k=-24;k<24;k+=8){g.box(k-0.06,0,s2*6.6-0.06,k+0.06,1.0,s2*6.6+0.06,0,false);g.box(k-0.065,0.75,s2*6.6-0.065,k+0.065,0.9,s2*6.6+0.065,s2>0?48:36,false);}
    if(r()<0.2){const x=(r()-0.5)*30;g.box(x-0.25,0,7.6,x+0.25,1.3,7.95,36);g.box(x-0.2,0.8,7.58,x+0.2,1.15,7.6,47,false);}
    if(i!==0&&r()<0.45){car(g,(r()-0.5)*20,-4.2,true,r);const p=g.car;}
    if(r()<0.25)g.npc((r()-0.5)*30,0,(r()<0.5?-1:1)*6.6,r()*6.28);
    if(r()<0.4)g.watchAt((r()-0.5)*30,(r()<0.5?-1:1)*2.5);}
  else{for(let k=0;k<3;k++)tree(g,-20+r()*40,-20+r()*40,r,1.2);if(Math.abs(j)===1){for(let k=-24;k<=24;k+=6)g.cyl(k,j>0?-14:14,0.05,0,1.1,27,false,4);}}
}
function morningCell(g,c,i,j,r){ /* l'épilogue : le cimetière au matin. Ce n'est plus un rêve. */
  g.m=SYM[0];g.box(-24,-0.8,-24,24,0,24,9);
  if(i||j){for(let k=0;k<3;k++)tree(g,-20+r()*40,-20+r()*40,r,1.3);if(j===1&&!i){g.box(-24,0,-14,24,0.02,-6,20,false);}return;}
  for(const s of[-1,1]){g.box(-21,0,s*20-0.3,21,1.6,s*20+0.3,59);g.box(s*20-0.3,0,-21,s*20+0.3,1.6,21,59);}
  g.box(-1.5,0,19.6,1.5,0.02,20.4,59,false);for(const s of[-1,1])g.box(s*1.6-0.25,0,19.7,s*1.6+0.25,2.2,20.3,59);
  for(let q=0;q<7;q++)g.rod(-1.35+q*0.45,0,20,-1.35+q*0.45,1.8,20,0.02,12,4);g.obox(-0.8,0.9,20.6,0.72,0.9,0.02,0.8,0,12);
  g.box(-1.4,0,-20,1.4,0.03,20,59,false);g.box(-20,0,-1.4,20,0.03,1.4,59,false);
  for(const sa of[-1,1])for(const sb of[-1,1])for(let a=0;a<4;a++)for(let b=0;b<3;b++){if(sa<0&&sb<0&&a===0&&b===0)continue;const x=sa*(4+a*4),z=sb*(4+b*5);g.box(x-0.4,0,z-0.1,x+0.4,0.75,z+0.1,59);g.box(x-0.5,0,z+0.15,x+0.5,0.2,z+1.9,59);if(r()<0.4)g.cone(x+0.3,z+0.3,0.06,0.05,0,0.16,[48,45,0][Math.floor(r()*3)],6);}
  for(const [x,z] of[[-12,-14],[12,14],[14,-12],[-14,12]])tree(g,x,z,r,1.3);c3bench(g,-3,8,true,1.8);c3bench(g,3,-8,true,1.8);
  {const x=0,z=-17;g.box(x-3,0,z-2.5,x+3,3.4,z+2.5,59);gable(g,x-3.3,z-2.8,x+3.3,z+2.8,3.4,2.0,46,59);g.box(x-0.7,0,z+2.5,x+0.7,2.3,z+2.56,81,false);g.cyl(x,z+2.55,0.5,2.6,2.62,13,false,14);g.box(x-0.12,5.4,z-0.12,x+0.12,6.4,z+0.12,59);}
  {const x=-3.3,z=-3.2;g.cone(x,z,0.1,0.12,0,0.22,49,10);g.rod(x+0.1,0.15,z,x+0.32,0.3,z,0.015,49,4);g.torus(x,0.26,z,0.08,0.012,[1,0,0],49,10,3);}
  for(let q=0;q<12;q++){const a=q/12*6.283;g.rod(-4+Math.cos(a)*0.5,0,-1.4+Math.sin(a)*0.2,-4+Math.cos(a)*0.5,0.2,-1.4+Math.sin(a)*0.2,0.008,15,3);g.sphere(-4+Math.cos(a)*0.5,0.22,-1.4+Math.sin(a)*0.2,0.04,[48,36,45,0][q%4],ICO0);}
  /* sa tombe : une pierre simple, son prénom ; on y pose la petite voiture rouge */
  const x=-4,z=-4;g.box(x-0.55,0,z-0.13,x+0.55,1.05,z+0.13,0);g.cyl(x,z,0.55,1.05,1.06,0,false,14);g.box(x-0.65,0,z+0.16,x+0.65,0.25,z+2.2,9,false);g.box(x-0.68,0,z+0.15,x+0.68,0.26,z+0.18,0,false);g.box(x-0.68,0,z+2.18,x+0.68,0.26,z+2.21,0,false);
  neonText(g,x-textW('PAPA',0.24)/2,0.55,z+0.135,1,0,0.24,'PAPA',12,0.012);
  for(let q=0;q<7;q++)g.ell(x-0.3+q*0.1,0.32,z+0.6+(q%2)*0.12,0.06,0.05,0.06,[48,45,0][q%3],ICO0);
  g.phone(x,0.45,z+0.5);g.hdoor(0,19.2);
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
    else if(gen===22)houseNightCell(g,c,i,j,r);else if(gen===23)waitCell(g,c,i,j,r);else if(gen===24)funeralCell(g,c,i,j,r);
    else if(gen===25)graveyardCell(g,c,i,j,r);else if(gen===26)boxesCell(g,c,i,j,r);else if(gen===27)nightRoadCell(g,c,i,j,r);else if(gen===28)morningCell(g,c,i,j,r);
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
  return {verts:new Float32Array(g.v),col:new Float32Array(g.col),door,items:g.items,pads:g.pads,npcs:g.npcs,wat:g.wat,pearls:g.pearls,course:g.course,car:g.car,sit:g.sit,spot:g.spot,lifts:g.lifts,swings:g.swings,hdoors:g.hdoors,conv:g.conv,crabs:g.crabs,statues:g.statues,guards:g.guards,visitors:g.visitors,souvs:g.souvs,scr:g.scr,notes:g.notes,phones:g.phones,watch:g.watch,blades:g.gr.length?g.blades(r):null,
          asc:hasAsc?{x:cx,z:cz,top:c.h+ascLayout(i,j).H}:null};
}
