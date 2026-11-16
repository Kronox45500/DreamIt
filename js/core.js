"use strict";
/* =====================================================================
   ÉTHER — noyau : constantes, maths, espaces, géométrie, description du monde
   ===================================================================== */
const CELL=48,VIEW_R=7,SHADOW_HALF=64,SHADOW_RES=2048,TOP_HALF=72,TOP_RES=1024,MEGA=2400;
const RAD=0.3,HGT=1.75,EYE=1.62,STEP=0.55;

function norm(v){const l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function perspective(fovy,asp,n,f){const t=1/Math.tan(fovy/2);return new Float32Array([t/asp,0,0,0, 0,t,0,0, 0,0,(f+n)/(n-f),-1, 0,0,2*f*n/(n-f),0]);}
function ortho(l,r,b,t,n,f){return new Float32Array([2/(r-l),0,0,0, 0,2/(t-b),0,0, 0,0,-2/(f-n),0, -(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1]);}
function lookAt(e,c,u){const z=norm([e[0]-c[0],e[1]-c[1],e[2]-c[2]]),x=norm(cross(u,z)),y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,e),-dot(y,e),-dot(z,e),1]);}
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;}
function mod(a,n){return ((a%n)+n)%n;}

/* ---------- les espaces ----------
   gen : 0 Éther (architecture dans le ciel) · 1 Métro (ligne et rames) · 2 Aero (plaine et ville de verre)
         3 Poolrooms (intérieur clos) · 4 Nocturne (parking de nuit)
   full : sol continu, pas de vide · megas : colosses à l'horizon */
const WORLDS=[
 {name:'Éther',gen:0,full:false,megas:true,cloudY:-46,goal:{summits:2,courses:1,talks:1},music:[0],
  pal:{sun:[0.50,0.70,0.40],zen:[.10,.26,.62],mid:[.34,.56,.90],hor:[.80,.875,.96],seaC:[.95,.965,.99],ambUp:[.70,.78,.93],ambDn:[.74,.77,.86],sunC:[.33,.26,.12],
       indoor:[.44,.49,.62],fogD:200,cl0:[.62,.70,.86],cl1:[1,.995,.98],se0:[.72,.79,.92],se1:[.985,.99,1],accent:[.2,.5,.95],glow:[1,.95,.84],
       water:0,night:0,stripe:[0,0],cloud:.42,lampC:[0,0,0],lampP:[1,1,0,0],lampO:[0,0],ground:null}},
 {name:'Métro céleste',gen:1,full:false,megas:true,cloudY:-46,goal:{stations:3,talks:2,shards:6},music:[1],spawn:[-3,0.76,6.4],
  pal:{sun:[0.42,0.60,0.62],zen:[.16,.38,.78],mid:[.46,.68,.93],hor:[.84,.89,.95],seaC:[.95,.96,.98],ambUp:[.66,.75,.90],ambDn:[.66,.70,.78],sunC:[.38,.31,.16],
       indoor:[.15,.16,.20],fogD:250,cl0:[.60,.67,.82],cl1:[1,1,.97],se0:[.72,.78,.90],se1:[.99,.99,.98],accent:[.95,.60,.10],glow:[1,.96,.86],
       water:0,night:0,stripe:[0,0],cloud:.55,lampC:[.62,.56,.44],lampP:[12,100000,4.5,4.5],lampO:[6,0],ground:null}},
 {name:'Aero',gen:2,full:true,megas:true,step:'grass',cloudY:-1000,goal:{summits:1,courses:1,shards:5},music:[4],
  pal:{sun:[0.35,0.78,0.50],zen:[.02,.40,.95],mid:[.10,.66,1.0],hor:[.62,.92,1.0],seaC:[.62,.92,1.0],ambUp:[.60,.80,.98],ambDn:[.62,.80,.84],sunC:[.38,.32,.15],
       indoor:[.40,.52,.60],fogD:430,cl0:[.70,.88,.98],cl1:[1,1,1],se0:[.28,.56,.18],se1:[.36,.66,.24],accent:[.20,.85,.45],glow:[1,1,.92],
       water:1,night:0,stripe:[0,0],cloud:.38,lampC:[0,0,0],lampP:[1,1,0,0],lampO:[0,0],ground:[.31,.60,.21]}},
 {name:'Poolrooms',gen:3,full:true,megas:false,inside:true,step:'hall',cloudY:-1000,goal:{pearls:5,shards:6},music:[2],
  pal:{sun:[0.30,0.85,0.40],zen:[.30,.58,.86],mid:[.60,.80,.94],hor:[.78,.87,.87],seaC:[.78,.87,.87],ambUp:[.80,.88,.90],ambDn:[.80,.86,.86],sunC:[.34,.30,.18],
       indoor:[.46,.53,.54],fogD:150,cl0:[.70,.78,.86],cl1:[1,1,.99],se0:[.78,.86,.90],se1:[.99,1,1],accent:[.16,.66,.72],glow:[1,.97,.88],
       water:1,night:0,stripe:[1.2,1.32],cloud:.3,lampC:[.40,.44,.41],lampP:[12,12,3.4,4.6],lampO:[6,6],ground:null}},
 {name:'Backrooms',gen:5,full:true,megas:false,inside:true,step:'hall',cloudY:-1000,goal:{shards:8,talks:1},music:[3],
  pal:{sun:[0.30,0.85,0.40],zen:[.55,.50,.30],mid:[.60,.55,.33],hor:[.60,.54,.32],seaC:[.60,.54,.32],ambUp:[.62,.56,.34],ambDn:[.58,.52,.32],sunC:[0,0,0],
       indoor:[.30,.27,.15],fogD:58,cl0:[.6,.55,.3],cl1:[.7,.65,.4],se0:[.5,.45,.28],se1:[.55,.5,.3],accent:[.85,.20,.15],glow:[0,0,0],
       water:0,night:0,stripe:[0,0],cloud:.2,lampC:[.70,.63,.35],lampP:[8,8,2.6,3.3],lampO:[4,4],ground:null}},
 {name:'Galerie',gen:6,full:true,megas:false,inside:true,step:'hall',cloudY:-1000,goal:{courses:1,shards:7},music:[5],
  pal:{sun:[0.38,0.80,0.46],zen:[.40,.55,.90],mid:[.72,.74,.95],hor:[.96,.84,.88],seaC:[.96,.84,.88],ambUp:[.86,.80,.86],ambDn:[.82,.76,.80],sunC:[.36,.30,.20],
       indoor:[.50,.45,.50],fogD:170,cl0:[.80,.70,.82],cl1:[1,.95,.96],se0:[.8,.7,.75],se1:[.9,.8,.85],accent:[.20,.72,.70],glow:[1,.92,.86],
       water:1,night:0,stripe:[0,0],cloud:.4,lampC:[.30,.27,.28],lampP:[12,12,9.3,7],lampO:[6,6],ground:null}},
 {name:'Aire de jeux',gen:7,full:true,megas:false,step:'grass',cloudY:-1000,goal:{summits:1,courses:1,shards:6},music:[6],
  pal:{sun:[0.62,0.34,0.50],zen:[.34,.36,.72],mid:[.78,.60,.82],hor:[1.0,.80,.74],seaC:[1.0,.80,.74],ambUp:[.66,.60,.80],ambDn:[.66,.56,.62],sunC:[.44,.28,.16],
       indoor:[.40,.36,.46],fogD:300,cl0:[.66,.52,.74],cl1:[1,.84,.78],se0:[.30,.50,.24],se1:[.40,.58,.30],accent:[.96,.62,.70],glow:[1,.78,.62],
       water:0,night:0,stripe:[0,0],cloud:.5,lampC:[0,0,0],lampP:[1,1,0,0],lampO:[0,0],ground:[.34,.54,.26]}},
 {name:'Nocturne',gen:4,full:true,megas:true,cloudY:-1000,goal:{car:1,summits:1,shards:4},music:[2,6],
  pal:{sun:[0.40,0.62,0.55],zen:[.008,.014,.040],mid:[.024,.034,.085],hor:[.070,.080,.135],seaC:[.070,.080,.135],ambUp:[.088,.102,.155],ambDn:[.060,.066,.100],sunC:[.085,.100,.150],
       indoor:[.034,.037,.050],fogD:270,cl0:[.02,.025,.05],cl1:[.13,.15,.22],se0:[.030,.032,.040],se1:[.040,.042,.052],accent:[.90,.16,.14],glow:[.75,.82,1],
       water:0,night:1,stripe:[0,0],cloud:.25,lampC:[1.0,.58,.22],lampP:[24,24,8,12.5],lampO:[12,12],ground:[.034,.036,.044]}},
];
let SUN=[0,1,0],PAL=null,W=0,WSALT=0,level=0,maxLevel=0,GEN=0;
try{level=Math.max(0,parseInt(localStorage.getItem('ether-level'))||0);maxLevel=Math.max(level,parseInt(localStorage.getItem('ether-max'))||0);}catch(e){}
function applyWorld(){W=level%WORLDS.length;WSALT=level*977;PAL=WORLDS[W].pal;SUN=norm(PAL.sun);GEN=WORLDS[W].gen;}
applyWorld();

/* ---------- hasard déterministe ---------- */
function hash(i,j,k){let h=Math.imul(i,374761393)^Math.imul(j,668265263)^Math.imul(k+WSALT,1274126177);
  h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;h=Math.imul(h,2246822519);h^=h>>>13;return (h>>>0)/4294967296;}
function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function vnoise(x,y){const i=Math.floor(x),j=Math.floor(y);let fx=x-i,fy=y-j;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
  const a=hash(i,j,99),b=hash(i+1,j,99),c=hash(i,j+1,99),d=hash(i+1,j+1,99);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}

/* ---------- géométrie ---------- */
const SYM=[[1,0,0,1],[-1,0,0,1],[1,0,0,-1],[-1,0,0,-1],[0,1,1,0],[0,-1,1,0],[0,1,-1,0],[0,-1,-1,0]];
function icosphere(sub){
  const t=(1+Math.sqrt(5))/2;let v=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(norm);
  let f=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  for(let s=0;s<sub;s++){const nf=[],mid=new Map();
    const m=(a,b)=>{const k=a<b?a+'_'+b:b+'_'+a;let r=mid.get(k);if(r===undefined){r=v.length;v.push(norm([v[a][0]+v[b][0],v[a][1]+v[b][1],v[a][2]+v[b][2]]));mid.set(k,r);}return r;};
    for(const [a,b,c] of f){const ab=m(a,b),bc=m(b,c),ca=m(c,a);nf.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);}f=nf;}
  const out=[];for(const tri of f)for(const k of tri)out.push(v[k]);return out;
}
const ICO1=icosphere(1),ICO2=icosphere(2),ICO3=icosphere(3),ICO5=icosphere(5);

class Geo{
  constructor(ox,oz,y){this.v=[];this.col=[];this.items=[];this.pads=[];this.gr=[];this.ng=[];this.npcs=[];this.wat=[];this.pearls=[];this.course=null;this.car=null;this.ox=ox;this.oz=oz;this.y=y;this.m=SYM[0];}
  P(a,y,b){const m=this.m;return [this.ox+m[0]*a+m[1]*b,this.y+y,this.oz+m[2]*a+m[3]*b];}
  N(a,y,b){const m=this.m;return [m[0]*a+m[1]*b,y,m[2]*a+m[3]*b];}
  quad(p0,p1,p2,p3,n0,n1,n2,n3,mat){const v=this.v;
    v.push(p0[0],p0[1],p0[2],n0[0],n0[1],n0[2],mat, p1[0],p1[1],p1[2],n1[0],n1[1],n1[2],mat, p2[0],p2[1],p2[2],n2[0],n2[1],n2[2],mat,
           p0[0],p0[1],p0[2],n0[0],n0[1],n0[2],mat, p2[0],p2[1],p2[2],n2[0],n2[1],n2[2],mat, p3[0],p3[1],p3[2],n3[0],n3[1],n3[2],mat);}
  flat(p0,p1,p2,p3,n,mat){this.quad(p0,p1,p2,p3,n,n,n,n,mat);}
  rect(a0,b0,a1,b1){const p=this.P(a0,0,b0),q=this.P(a1,0,b1);return [Math.min(p[0],q[0]),Math.min(p[2],q[2]),Math.max(p[0],q[0]),Math.max(p[2],q[2])];}
  box(a0,y0,b0,a1,y1,b1,mat,solid){
    const p=this.P(a0,y0,b0),q=this.P(a1,y1,b1);
    const x0=Math.min(p[0],q[0]),x1=Math.max(p[0],q[0]),z0=Math.min(p[2],q[2]),z1=Math.max(p[2],q[2]),Y0=p[1],Y1=q[1];
    this.flat([x1,Y0,z0],[x1,Y1,z0],[x1,Y1,z1],[x1,Y0,z1],[1,0,0],mat);
    this.flat([x0,Y0,z0],[x0,Y1,z0],[x0,Y1,z1],[x0,Y0,z1],[-1,0,0],mat);
    this.flat([x0,Y1,z0],[x1,Y1,z0],[x1,Y1,z1],[x0,Y1,z1],[0,1,0],mat);
    this.flat([x0,Y0,z0],[x1,Y0,z0],[x1,Y0,z1],[x0,Y0,z1],[0,-1,0],mat);
    this.flat([x0,Y0,z1],[x1,Y0,z1],[x1,Y1,z1],[x0,Y1,z1],[0,0,1],mat);
    this.flat([x0,Y0,z0],[x1,Y0,z0],[x1,Y1,z0],[x0,Y1,z0],[0,0,-1],mat);
    if(solid!==false)this.col.push(x0,Y0,z0,x1,Y1,z1);
  }
  /* dalle vue du dessus seulement (sols continus) */
  top(a0,b0,a1,b1,y,mat){const r=this.rect(a0,b0,a1,b1),Y=this.y+y;this.flat([r[0],Y,r[1]],[r[2],Y,r[1]],[r[2],Y,r[3]],[r[0],Y,r[3]],[0,1,0],mat);}
  solid(a0,y0,b0,a1,y1,b1){const p=this.P(a0,y0,b0),q=this.P(a1,y1,b1);this.col.push(Math.min(p[0],q[0]),p[1],Math.min(p[2],q[2]),Math.max(p[0],q[0]),q[1],Math.max(p[2],q[2]));}
  item(a,y,b){const p=this.P(a,y,b);this.items.push(p[0],p[1],p[2]);}
  pad(a,b,pw,y){y=y||0;this.box(a-0.8,y,b-0.8,a+0.8,y+0.08,b+0.8,8);const p=this.P(a,y+0.08,b);this.pads.push(p[0],p[1],p[2],pw);}
  /* silhouette : immobile, ou qui fait les cent pas jusqu'à (a2,b2) */
  npc(a,y,b,yaw,a2,b2){const p=this.P(a,y,b),q=a2===undefined?p:this.P(a2,y,b2);this.npcs.push([p[0],p[1],p[2],yaw||0,q[0],q[2],this.npcs.length*0.37+0.11]);}
  water(a0,b0,a1,b1,ys,yb){const r=this.rect(a0,b0,a1,b1);this.wat.push([r[0],r[1],r[2],r[3],this.y+ys,this.y+yb]);}
  pearl(a,y,b){const p=this.P(a,y,b);this.pearls.push(p[0],p[1],p[2]);}
  courseSet(a,b,pts,T,y){y=y||0;this.box(a-0.9,y,b-0.9,a+0.9,y+0.06,b+0.9,29);this.course={s:this.P(a,y+0.06,b),pts:pts.map(p=>this.P(p[0],p[1],p[2])),T};}
  carAt(a,b){const p=this.P(a,0,b);this.car=[p[0],p[2]];}
  grass(a0,b0,a1,b1,y,dens,flow){const r=this.rect(a0,b0,a1,b1);this.gr.push([r[0],r[1],r[2],r[3],this.y+y,dens,flow||0]);}
  nog(a0,b0,a1,b1){this.ng.push(this.rect(a0,b0,a1,b1));}
  ell(a,y,b,rx,ry,rz,mat,ico){const c=this.P(a,y,b),v=this.v;for(const n of ico){const q=norm([n[0]/rx,n[1]/ry,n[2]/rz]);v.push(c[0]+n[0]*rx,c[1]+n[1]*ry,c[2]+n[2]*rz,q[0],q[1],q[2],mat);}}
  sphere(a,y,b,r,mat,ico,sy){const c=this.P(a,y,b),v=this.v;sy=sy||1;
    for(const n of ico)v.push(c[0]+n[0]*r,c[1]+n[1]*r*sy,c[2]+n[2]*r,n[0],n[1],n[2],mat);}
  /* sphère à facettes (gemme, dôme géodésique) */
  gem(a,y,b,r,mat,ico,sy){const c=this.P(a,y,b),v=this.v;sy=sy||1;
    for(let k=0;k<ico.length;k+=3){const A=ico[k],B=ico[k+1],C=ico[k+2],n=norm([A[0]+B[0]+C[0],A[1]+B[1]+C[1],A[2]+B[2]+C[2]]);
      for(const q of[A,B,C])v.push(c[0]+q[0]*r,c[1]+q[1]*r*sy,c[2]+q[2]*r,n[0],n[1],n[2],mat);}}
  /* cylindre vertical lisse, chapeau plat */
  cyl(a,b,r,y0,y1,mat,solid,n){n=n||20;const c=this.P(a,0,b),Y0=this.y+y0,Y1=this.y+y1;
    for(let k=0;k<n;k++){const t0=k/n*6.2832,t1=(k+1)/n*6.2832,c0=Math.cos(t0),s0=Math.sin(t0),c1=Math.cos(t1),s1=Math.sin(t1);
      this.quad([c[0]+c0*r,Y0,c[2]+s0*r],[c[0]+c1*r,Y0,c[2]+s1*r],[c[0]+c1*r,Y1,c[2]+s1*r],[c[0]+c0*r,Y1,c[2]+s0*r],[c0,0,s0],[c1,0,s1],[c1,0,s1],[c0,0,s0],mat);
      const u=[0,1,0];this.quad([c[0],Y1,c[2]],[c[0]+c0*r,Y1,c[2]+s0*r],[c[0]+c1*r,Y1,c[2]+s1*r],[c[0],Y1,c[2]],u,u,u,u,mat);}
    if(solid!==false){const q=r*0.74;this.col.push(c[0]-q,Y0,c[2]-q,c[0]+q,Y1,c[2]+q);}
  }
  /* mur percé d'une arche (rayon r, naissance s) et, en option, d'une encoche en U au sommet */
  archWall(a0,a1,b0,b1,H,r,s,notch,mat){
    const ac=(a0+a1)/2,xs=[a0,a1,ac-r,ac+r],SEG=18;
    for(let k=1;k<SEG;k++)xs.push(ac-r*Math.cos(Math.PI*k/SEG));
    if(notch){xs.push(ac-notch.r,ac+notch.r);for(let k=1;k<SEG;k++)xs.push(ac-notch.r*Math.cos(Math.PI*k/SEG));}
    xs.sort((p,q)=>p-q);
    const nF=this.N(0,0,1),nB=this.N(0,0,-1),nU=[0,1,0];
    for(let k=0;k<xs.length-1;k++){
      const xa=xs[k],xb=xs[k+1];if(xb-xa<1e-5)continue;
      const xm=(xa+xb)/2,inO=Math.abs(xm-ac)<r,inN=notch&&Math.abs(xm-ac)<notch.r;
      const Bf=x=>inO?s+Math.sqrt(Math.max(0,r*r-(x-ac)*(x-ac))):0;
      const Tf=x=>inN?notch.cy-Math.sqrt(Math.max(0,notch.r*notch.r-(x-ac)*(x-ac))):H;
      const Ba=Bf(xa),Bb=Bf(xb),Ta=Tf(xa),Tb=Tf(xb);
      this.flat(this.P(xa,Ba,b1),this.P(xb,Bb,b1),this.P(xb,Tb,b1),this.P(xa,Ta,b1),nF,mat);
      this.flat(this.P(xa,Ba,b0),this.P(xb,Bb,b0),this.P(xb,Tb,b0),this.P(xa,Ta,b0),nB,mat);
      if(inO){const na=this.N((ac-xa)/r,(s-Ba)/r,0),nb=this.N((ac-xb)/r,(s-Bb)/r,0);
        this.quad(this.P(xa,Ba,b0),this.P(xb,Bb,b0),this.P(xb,Bb,b1),this.P(xa,Ba,b1),na,nb,nb,na,mat);}
      if(inN){const na=this.N((ac-xa)/notch.r,(notch.cy-Ta)/notch.r,0),nb=this.N((ac-xb)/notch.r,(notch.cy-Tb)/notch.r,0);
        this.quad(this.P(xa,Ta,b0),this.P(xb,Tb,b0),this.P(xb,Tb,b1),this.P(xa,Ta,b1),na,nb,nb,na,mat);}
      else this.flat(this.P(xa,H,b0),this.P(xb,H,b0),this.P(xb,H,b1),this.P(xa,H,b1),nU,mat);
    }
    const side=(x,y0,y1,sg)=>this.flat(this.P(x,y0,b0),this.P(x,y1,b0),this.P(x,y1,b1),this.P(x,y0,b1),this.N(sg,0,0),mat);
    side(a0,0,H,-1);side(a1,0,H,1);side(ac-r,0,s,1);side(ac+r,0,s,-1);
    if(notch){side(ac-notch.r,notch.cy,H,1);side(ac+notch.r,notch.cy,H,-1);}
    this.solid(a0,0,b0,ac-r,H,b1);this.solid(ac+r,0,b0,a1,H,b1);this.solid(ac-r,s+r*0.5,b0,ac+r,H,b1);
  }
  /* brins d'herbe : une instance = x,y,z, lacet, hauteur, hasard, type (0 brin, 1 fleur) */
  blades(r){
    const out=[];let total=0;
    for(const g of this.gr){
      const n=Math.min(26000-total,Math.floor((g[2]-g[0])*(g[3]-g[1])*g[5]));
      for(let k=0;k<n;k++){const x=g[0]+r()*(g[2]-g[0]),z=g[1]+r()*(g[3]-g[1]);let ok=true;
        for(const e of this.ng)if(x>e[0]&&x<e[2]&&z>e[1]&&z<e[3]){ok=false;break;}
        if(!ok)continue;
        const fl=r()<g[6]?1:0,patch=vnoise(x*0.21,z*0.21);
        out.push(x,g[4],z,r()*6.2832,(fl?0.34+r()*0.3:0.16+r()*0.26+patch*0.26),r(),fl);total++;}
    }
    return new Float32Array(out);
  }
}

/* ---------- description des cellules ---------- */
const T_DOOR=0,T_HALL=1,T_POOL=2,T_TOWER=3,T_STAIR=4,T_MONO=5,T_BALC=6,T_EMPTY=7,T_ASC=8;
const T_STATION=20,T_LINE=21,T_TERRACE=22,T_GARDEN=23,T_FOOT=30,T_ROAD=40;
const TYPES=[
  [[.11,0],[.27,7],[.41,1],[.53,2],[.61,3],[.74,4],[.82,5],[.88,6],[1.01,8]],
  null,
  [[.10,0],[.30,1],[.50,2],[.62,3],[.74,4],[.82,5],[.90,6],[1.01,8]],
  [[.08,0],[.22,1],[.36,2],[.50,3],[.80,5],[.90,6],[1.01,8]],
  [[.10,0],[.34,1],[.52,2],[.64,3],[.76,4],[.88,5],[1.01,8]],
  [[.08,0],[.66,1],[.75,2],[1.01,3]],
  [[.08,0],[.38,1],[.55,2],[.80,3],[1.01,4]],
  [[.07,0],[.25,1],[.43,2],[.58,3],[.72,4],[.88,5],[1.01,8]],
];
const infoCache=new Map(),ascCache=new Map(),megaCache=new Map();
function megaInfo(I,J){
  const key=I+','+J;let M=megaCache.get(key);if(M)return M;
  let t=Math.floor(hash(I,J,50)*7.5);if(t>6)t=0;
  if(I===0&&J===-1)t=2;else if(I===-1&&J===-1)t=1;else if(I===0&&J===0)t=4;else if(I===-1&&J===0)t=3;
  if(!WORLDS[W].megas)t=0;
  const cx=(I+0.5)*MEGA+(hash(I,J,51)-0.5)*120,cz=(J+0.5)*MEGA+(hash(I,J,52)-0.5)*120;
  const base=WORLDS[W].full?-2:-300,g=new Geo(cx,cz,base),r=rng(Math.floor(hash(I,J,54)*4294967296)),feet=[],o=-base;
  g.m=SYM[Math.floor(hash(I,J,53)*8)];
  const foot=(a0,b0,a1,b1)=>feet.push(g.rect(a0,b0,a1,b1));
  if(t===1){const L=800+r()*200,th=70+r()*30,H=1800+r()*900;g.box(-L,0,-th,L,H,th,6,false);foot(-L,-th,L,th);}
  else if(t===2){const w=130+r()*80,H=2900+r()*1600;g.box(-w,0,-w,w,H*0.55,w,6,false);g.box(-w*0.72,H*0.55,-w*0.72,w*0.72,H*0.82,w*0.72,6,false);
    g.box(-w*0.45,H*0.82,-w*0.45,w*0.45,H,w*0.45,6,false);foot(-w,-w,w,w);}
  else if(t===3){g.archWall(-1000,1000,-110,110,2000+r()*300,620,o+450+r()*200,null,6);g.col.length=0;foot(-1000,-110,-620,110);foot(620,-110,1000,110);}
  else if(t===4){const R=380+r()*150;if(GEN===2)g.gem(0,o+850+r()*350,0,R,7,ICO2,0.85);else g.sphere(0,o+850+r()*350,0,R,7,ICO5);}
  else if(t===5){const rise=60+r()*20,w=320;for(let k=0;k<22;k++)g.box(-880+k*80,0,-w,-880+(k+1)*80,o-100+(k+1)*rise,w,6,false);foot(-880,-w,880,w);}
  else if(t===6){const L=900,H=1600+r()*700;g.box(-L,0,90,L,H,210,6,false);g.box(-L,0,-210,L,H*(0.7+r()*0.3),-90,6,false);foot(-L,90,L,210);foot(-L,-210,L,-90);}
  M={t,feet,verts:new Float32Array(g.v)};megaCache.set(key,M);return M;
}
function cellInfo(i,j){
  const key=i+','+j;let c=infoCache.get(key);if(c)return c;
  const gen=GEN,nearO=Math.abs(i)+Math.abs(j)<=1;
  let blocked=false;
  if(gen!==1){const mg=megaInfo(Math.floor(i*CELL/MEGA),Math.floor(j*CELL/MEGA)),wx=i*CELL,wz=j*CELL;
    for(const f of mg.feet)if(wx+32>f[0]&&wx-32<f[2]&&wz+32>f[1]&&wz-32<f[3])blocked=true;}
  const t=hash(i,j,2);let exists,h=0,type=0,P=9+Math.floor(hash(i,j,3)*4)*1.5,remote=false;
  if(gen===1){ /* une ligne le long de x, une station toutes les quatre cellules, des annexes de part et d'autre */
    const st=mod(i,4)===0;
    if(j===0){exists=true;P=24;type=st?T_STATION:T_LINE;}
    else if(Math.abs(j)===1&&st&&((i===0&&j===1)||hash(i,j,1)<0.78)){exists=true;h=0.75;type=(i===0&&j===1)?T_DOOR:t<0.32?T_DOOR:t<0.66?T_TERRACE:T_GARDEN;}
    else{exists=false;remote=Math.abs(j)>2&&hash(i,j,6)<0.07;}
  }else if(WORLDS[W].full){
    exists=true;P=24;
    if(blocked)type=T_FOOT;
    else if(gen===2&&(mod(i,3)===1||mod(j,3)===1))type=T_ROAD;
    else{for(const e of TYPES[gen])if(t<e[0]){type=e[1];break;}}
    if(i===0&&j===0)type=T_DOOR;
  }else{
    exists=!blocked&&(nearO||hash(i,j,1)<0.8);
    h=Math.round((vnoise(i*0.31,j*0.31)*2-1)*3+(vnoise(i*0.11+7.3,j*0.11+3.1)*2-1)*4)*3;if(h<-6)h=-6;
    for(const e of TYPES[0])if(t<e[0]){type=e[1];break;}
    if(i===0&&j===0){type=T_DOOR;P=10.5;}
    remote=!exists&&!blocked&&hash(i,j,6)<0.22;
  }
  c={exists,h,type,P,remote};infoCache.set(key,c);return c;
}
/* liaisons de l'Éther : 0 rien, 1 passerelle, 2 pierres de gué, 3 pierres espacées */
function bkind(i,j,dir){
  const a=cellInfo(i,j),b=dir===0?cellInfo(i+1,j):cellInfo(i,j+1),dh=Math.abs(a.h-b.h);
  if(!a.exists||!b.exists||dh>9)return 0;
  if((i===0&&j===0)||(dir===0&&i===-1&&j===0)||(dir===1&&i===0&&j===-1))return 1;
  const h=hash(i,j,4+dir);
  if(h<0.62)return 1;
  if(h<0.86)return dh<=3?2:1;
  return dh===0?3:0;
}
/* peut-on passer à pied de la cellule (i,j) à sa voisine en +x (dir 0) ou +z (dir 1) ? renvoie une largeur */
function bridge(i,j,dir){
  if(WORLDS[W].full)return 2;
  if(GEN===1){
    if(dir===0)return j===0?3:0;
    const a=cellInfo(i,j),b=cellInfo(i,j+1);return (a.exists&&b.exists&&(j===0||j===-1))?2.4:0;
  }
  const k=bkind(i,j,dir);return k===0?0:k!==1?1.8:2.4+Math.floor(hash(i,j,10+dir)*3)*0.8;
}
function ascLayout(i,j){
  const key=i+','+j;let L=ascCache.get(key);if(L)return L;
  const r=rng(Math.floor(hash(i,j,41)*4294967296)),turns=2+Math.floor(r()*3),bl=[];let y=0,skip=false;
  for(let k=0;k<turns*12;k++){
    if(!skip&&k>2&&k<turns*12-2&&r()<0.16){skip=true;continue;}
    skip=false;y+=0.6;const an=k*Math.PI/6;bl.push([Math.cos(an)*4.3,y,Math.sin(an)*4.3]);}
  L={bl,H:y+0.6};ascCache.set(key,L);return L;
}
