"use strict";
/* =====================================================================
   ÉTHER — jeu : joueur, rames, objectifs, menus, son, boucle de rendu
   ===================================================================== */
let time=0,last=performance.now(),hudT=0;
let start=cellInfo(0,0);
const pos={x:0,y:start.h+0.01,z:6.5};
let yaw=0,pitch=0,vy=0,grounded=true,eyeY=pos.y+EYE,bob=0,stepAcc=0;
let safe={x:pos.x,y:pos.y,z:pos.z},inDoor=false,doorCount=0,veil=0,veilHold=0;
let airT=0,jumpT=-9,shards=0,summits=0,target=null,sunK=1,passage=false,shardHint=null,G={summits:0,shards:0},riding=0,grassQ=1,slow=0;
const taken=new Set(),doneAsc=new Set(),nearCells=[];
/* autres objectifs : stations visitées, rencontres, perles, courses, voiture */
const GK=['summits','courses','stations','talks','pearls','car','shards'];
const LABEL={summits:'Sommets',courses:'Courses',stations:'Stations',talks:'Rencontres',pearls:'Perles',car:'Voiture',shards:'Éclats'};
let ex={stations:0,talks:0,pearls:0,courses:0,car:0},swim=false,crouch=false,swimY=0,air=1,run=null,courseCool=-9,nearNpc=null,hint=null,carT=null,beepT=-9,touchMode=false;
const visited=new Set(),talked=new Set(),pearlTaken=new Set(),doneCourse=new Set();
function val(k){return k==='summits'?summits:k==='shards'?shards:ex[k];}
const LINES=[
 ['Je compte les fenêtres. Je recommence toujours.','Le mur n\'était pas là hier.','On entend la dalle avant de la voir.','Je crois que j\'attends quelqu\'un.','En bas, il n\'y a que du blanc.'],
 ['La rame passe. Elle passe toujours.','Je descends à la prochaine. Je dis ça depuis longtemps.','L\'herbe pousse plus vite dans les wagons.','Il n\'y a pas de terminus, j\'ai vérifié.','Vous avez un ticket ? Personne n\'en a.'],
 ['Il fait toujours ce temps-là.','Les éoliennes tournent pour personne.','J\'ai marché tout droit, la ville recule.','On a tondu ce matin. Je ne sais pas qui.','Regardez la sphère. Elle a bougé.'],
 ['L\'eau est à la bonne température. Elle l\'est toujours.','Je cherche la sortie depuis le petit bain.','Ne plongez pas trop longtemps.','Quelqu\'un a laissé la lumière allumée partout.','Ça sent le chlore, non ?'],
 ['Ça fait combien de pièces ? J\'ai arrêté de compter.','Le bourdonnement ne s\'arrête jamais.','Ne courez pas. Ça ne change rien.','Cette pièce, je l\'ai déjà vue. Toutes.','La moquette est humide par endroits.'],
 ['Tout est fermé. Tout a toujours été fermé.','La fontaine marche encore, elle.','J\'attends l\'ouverture.','On entend de la musique, mais d\'où ?','L\'étage est pareil que le bas.'],
 ['Les balançoires bougent toutes seules, parfois.','Il est l\'heure de rentrer. Depuis longtemps.','J\'ai joué ici. Je crois.','Le soleil ne finit pas de se coucher.','Personne n\'est venu me chercher.'],
 ['Je ne retrouve pas ma voiture non plus.','Les lampadaires ne s\'éteignent jamais.','Vous avez entendu ? Un bip, là-bas.','Le parking continue après le parking.','Il est tard. Il est toujours tard.'],
];
/* position d'une silhouette à l'instant présent : x, y, z, lacet */
function npcPos(n){
  if(n[4]===n[0]&&n[5]===n[2]){ /* immobile : se tourne vers vous quand vous approchez */
    const qx=pos.x-n[0],qz=pos.z-n[2];return [n[0],n[1],n[2],qx*qx+qz*qz<200?Math.atan2(-qx,qz):n[3]];}
  const ddx=n[4]-n[0],ddz=n[5]-n[2],L=Math.hypot(ddx,ddz),u=(time*1.15+n[6]*L*2)%(2*L),back=u>=L,t=(back?2*L-u:u)/L;
  return [n[0]+ddx*t,n[1]+Math.abs(Math.sin(time*6.3+n[6]*9))*0.035,n[2]+ddz*t,Math.atan2(-ddx,ddz)+(back?Math.PI:0)];
}
function talk(){
  if(!nearNpc)return;const L=LINES[[0,1,2,3,7,4,5,6][GEN]],line=L[Math.floor(Math.abs(nearNpc.seed)*97)%L.length];
  murmur();
  if(!talked.has(nearNpc.key)){talked.add(nearNpc.key);ex.talks++;checkGoal();}
  if(!(passage&&toastT>4))toast('« '+line+' »',5.5);
}
function interact(){
  if(nearNpc){talk();return;}
  if(G.car&&!ex.car){beepT=time;beep();toast(carT?'Bip · '+Math.round(Math.hypot(carT[0]-pos.x,carT[1]-pos.z))+' m':'Bip… pas de réponse, avancez encore',3);}
}
const keys={};let started=false,paused=true,locked=false,muted=false;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const DR={ax:0,az:0,t0:-60};

/* ---------- chargement progressif ---------- */
let queue=[],curI=1e9,curJ=1e9;
function updateStreaming(){
  const ci=Math.round(pos.x/CELL),cj=Math.round(pos.z/CELL);
  if(ci!==curI||cj!==curJ){
    curI=ci;curJ=cj;queue=[];
    for(let di=-VIEW_R;di<=VIEW_R;di++)for(let dj=-VIEW_R;dj<=VIEW_R;dj++){
      if(di*di+dj*dj>VIEW_R*VIEW_R+2)continue;
      if(!cells.has((ci+di)+','+(cj+dj)))queue.push([di*di+dj*dj,ci+di,cj+dj]);}
    queue.sort((a,b)=>b[0]-a[0]);
    for(const [k,c] of cells)if(Math.max(Math.abs(c.i-ci),Math.abs(c.j-cj))>VIEW_R+1){freeCell(c);cells.delete(k);}
  }
  const t0=performance.now();
  while(queue.length&&performance.now()-t0<5){const q=queue.pop();ensureCell(q[1],q[2]);}
}

/* ---------- rames du métro ----------
   Une rame toutes les deux stations sur chaque voie ; toutes avancent d'une station par cycle, avec un arrêt à quai. */
const ST=4*CELL,TC=24,DW=0.36;
const trains=[];let trainCols=[];
function trainAt(k,dir,t){
  const u=t/TC+(dir>0?0:0.5),n=Math.floor(u),f=u-n;let e=f<DW?0:(f-DW)/(1-DW);e=e*e*e*(e*(6*e-15)+10);
  const o=Math.max(0,Math.min(1,Math.min(f-0.02,DW-0.03-f)*TC/1.3));
  return {x:dir*(2*k+n+e)*ST,moving:f>=DW,open:o>0.75,o,f};
}
function updateTrains(dt){
  trains.length=0;trainCols=[];riding=0;
  if(GEN!==1)return;
  for(const dir of[1,-1]){
    const u=time/TC+(dir>0?0:0.5),base=Math.round((dir*pos.x/ST-u)/2);
    for(let k=base-2;k<=base+2;k++){
      const now=trainAt(k,dir,time),was=trainAt(k,dir,time-dt);
      if(Math.abs(now.x-pos.x)>470)continue;
      const z=dir>0?TRACK_Z:-TRACK_Z,dx=now.x-was.x;
      /* le joueur à bord (ou sur le toit) est emporté */
      const inside=Math.abs(pos.x-was.x)<TRAIN_HL&&Math.abs(pos.z-z)<TRAIN_HW&&pos.y>0.3&&pos.y<3.6;
      if(inside){pos.x+=dx;if(now.moving)riding=Math.min(1,Math.abs(dx)/Math.max(dt,1e-4)/14);}
      const src=now.open?TRAIN.colOpen:TRAIN.colClosed,col=new Float32Array(src.length);
      for(let q=0;q<src.length;q+=6){col[q]=src[q]+now.x;col[q+1]=src[q+1];col[q+2]=src[q+2]+z;col[q+3]=src[q+3]+now.x;col[q+4]=src[q+4];col[q+5]=src[q+5]+z;}
      trains.push({x:now.x,z,open:now.open,o:now.o,col,dx,inside});
      if(Math.abs(now.x-pos.x)<45&&((was.o===0&&now.o>0)||(was.o===1&&now.o<1)))doorSfx();trainCols.push(col);
    }
  }
}

/* ---------- collisions et déplacement ---------- */
let near=[],hTop=0,hBot=0;
function gatherNear(){near.length=0;nearCells.length=0;const ci=Math.round(pos.x/CELL),cj=Math.round(pos.z/CELL);
  for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){const c=ensureCell(ci+di,cj+dj);near.push(c.col);nearCells.push(c);}
  for(const c of trainCols)near.push(c);}
function test(x,y,z){
  let hit=false;hTop=-1e9;hBot=1e9;const x0=x-RAD,x1=x+RAD,y0=y+1e-3,y1=y+(crouch?1.0:HGT),z0=z-RAD,z1=z+RAD;
  if((GEN===2||GEN===4||GEN===7)&&y0<0){hit=true;hTop=0;hBot=-9;}
  for(const c of near)for(let k=0;k<c.length;k+=6){
    if(c[k]<x1&&c[k+3]>x0&&c[k+1]<y1&&c[k+4]>y0&&c[k+2]<z1&&c[k+5]>z0){hit=true;if(c[k+4]>hTop)hTop=c[k+4];if(c[k+1]<hBot)hBot=c[k+1];}}
  return hit;
}
function tryMove(dx,dz){
  const nx=pos.x+dx,nz=pos.z+dz;
  if(!test(nx,pos.y,nz)){pos.x=nx;pos.z=nz;return;}
  if((grounded||swim)&&hTop-pos.y<=(swim?1.75:STEP)){const ty=hTop;if(!test(nx,ty,nz)){pos.x=nx;pos.z=nz;pos.y=ty;return;}}
}
function moveH(dx,dz){
  const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/0.08));dx/=n;dz/=n;
  for(let k=0;k<n;k++){tryMove(dx,0);tryMove(0,dz);}
}
function findDoor(i,j){
  const si=Math.floor((hash(i,j,30)-0.5)*90),sj=GEN===1?0:Math.floor((hash(i,j,31)-0.5)*90);
  for(let rad=0;rad<40;rad++)for(let di=-rad;di<=rad;di++)for(let dj=-rad;dj<=rad;dj++){
    if(Math.max(Math.abs(di),Math.abs(dj))!==rad)continue;
    const a=si+di,b=sj+dj;if(a===i&&b===j)continue;
    const c=cellInfo(a,b);if(c.exists&&c.type===T_DOOR)return [a,b];}
  return [0,GEN===1?1:0];
}

/* ---------- objectifs ---------- */
function goalOf(){const g=WORLDS[W].goal,cy=Math.floor(level/WORLDS.length);
  return {summits:g.summits?g.summits+cy:0,shards:g.shards?g.shards+cy*2:0,stations:g.stations||0,talks:g.talks||0,pearls:g.pearls||0,courses:g.courses||0,car:g.car||0};}
function findCell(pred){
  const si=Math.round(pos.x/CELL),sj=Math.round(pos.z/CELL),seen=new Set([si+','+sj]),q=[[si,sj]];
  for(let h=0;h<q.length;h++){
    const [i,j]=q[h],c=cellInfo(i,j);
    if(c.exists&&pred(c,i,j))return {i,j,reach:true};
    for(const [a,b,ok] of [[i+1,j,bridge(i,j,0)],[i-1,j,bridge(i-1,j,0)],[i,j+1,bridge(i,j,1)],[i,j-1,bridge(i,j-1,1)]]){
      const k=a+','+b;if(ok&&Math.abs(a-si)<=18&&Math.abs(b-sj)<=18&&!seen.has(k)){seen.add(k);q.push([a,b]);}}
  }
  let best=null,bd=1e9;
  for(let di=-18;di<=18;di++)for(let dj=-18;dj<=18;dj++){const c=cellInfo(si+di,sj+dj),d=di*di+dj*dj;
    if(c.exists&&d<bd&&pred(c,si+di,sj+dj)){bd=d;best={i:si+di,j:sj+dj,reach:false};}}
  return best;
}
function pickTarget(){
  shardHint=null;target=null;
  if(passage){const f=findCell(c=>c.type===T_DOOR);if(f)target={kind:'door',x:f.i*CELL,z:f.j*CELL,top:cellInfo(f.i,f.j).h+1.2,reach:f.reach};}
  else if(summits<G.summits){const f=findCell((c,i,j)=>c.type===T_ASC&&!doneAsc.has(i+','+j));
    if(f)target={kind:'summit',x:f.i*CELL,z:f.j*CELL,top:cellInfo(f.i,f.j).h+ascLayout(f.i,f.j).H,reach:f.reach};}
}
function checkGoal(){
  if(!passage&&GK.every(k=>val(k)>=G[k])){passage=true;chime();toast('Un passage s\'est ouvert',5);}
  pickTarget();
}
function loadWorld(lv,arrive){
  level=lv;if(lv>maxLevel)maxLevel=lv;try{localStorage.setItem('ether-level',lv);localStorage.setItem('ether-max',maxLevel);}catch(e){}
  applyWorld();worldMusic();infoCache.clear();ascCache.clear();megaCache.clear();
  for(const c of cells.values())freeCell(c);cells.clear();
  for(const m of megaMeshes.values())freeMesh(m);megaMeshes.clear();
  queue=[];curI=1e9;start=cellInfo(0,0);
  toastEl.classList.remove('on');toastT=0;
  resetPlayer(arrive);spacesUI();
}
let toastT=0;const toastEl=document.getElementById('toast');
function toast(t,dur){toastEl.textContent=t;toastEl.classList.add('on');toastT=dur||3.2;}

function physics(dt){
  updateTrains(dt);
  gatherNear();
  /* une rame qui démarre referme ses portes : on ne reste pas coincé dans l'embrasure */
  for(const t of trains){
    if(t.inside&&!t.open&&test(pos.x,pos.y,pos.z))pos.z=t.z;
    else if(!t.inside&&t.dx!==0&&test(pos.x,pos.y,pos.z))pos.x+=t.dx*1.05;
  }
  let f=0,s=0;
  if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyD||keys.ArrowRight)s+=1;if(keys.KeyA||keys.ArrowLeft)s-=1;
  f+=touch.my;s+=touch.mx;
  const l=Math.hypot(f,s);if(l>1){f/=l;s/=l;}
  /* accroupi tant que C est tenu ; on ne se relève que s'il y a la place */
  if(keys.KeyC&&!swim)crouch=true;
  else if(crouch){crouch=false;if(test(pos.x,pos.y,pos.z))crouch=true;}
  /* eau profonde : on nage, en trois dimensions, avec une réserve d'air */
  let wy=null;
  for(const c of nearCells)for(const w of c.wat)if(pos.x>w[0]&&pos.x<w[2]&&pos.z>w[1]&&pos.z<w[3]&&pos.y+0.9<w[4]&&pos.y>w[5]-0.6)wy=w[4];
  const wasSwim=swim;swim=wy!==null;if(swim)swimY=wy;
  if(swim&&!wasSwim){splash(Math.min(1,Math.abs(vy)/7+0.3));vy*=0.3;}
  const shift=keys.ShiftLeft||keys.ShiftRight,sp=swim?3.0:crouch?2.1:shift?7.6:4.3,cpt=swim?Math.cos(pitch):1;
  const dx=(Math.sin(yaw)*f*cpt+Math.cos(yaw)*s)*sp*dt,dz=(-Math.cos(yaw)*f*cpt+Math.sin(yaw)*s)*sp*dt;
  const px=pos.x,pz=pos.z;
  if(dx||dz)moveH(dx,dz);
  const moved=Math.hypot(pos.x-px,pos.z-pz);walkV=walkV*0.8+moved/Math.max(dt,1e-4)*0.2;
  if(swim){
    const under=pos.y+EYE<wy;
    air=under?Math.max(0,air-dt/24):Math.min(1,air+dt/2.5);
    const up=keys.Space||touch.jump;
    let vv=f*Math.sin(pitch)*3.0+(up?2.6:0)-(shift?2.6:0);
    if(!f&&!up&&!shift)vv=0.25;if(air<=0)vv=3.4;
    vy+=(vv-vy)*Math.min(1,dt*5);pos.y+=vy*dt;
    const top=wy-1.32;if(pos.y>top){pos.y=top;if(vy>0)vy=0;}
    if(test(pos.x,pos.y,pos.z)){if(vy<=0)pos.y=hTop;else pos.y=hBot-(crouch?1.0:HGT)-2e-3;vy=0;}
    grounded=false;airT=1;touch.jump=false;
    stepAcc+=moved+Math.abs(vy)*dt;if(stepAcc>2.6){stepAcc=0;splash(0.22);}
  }else{
    air=Math.min(1,air+dt/2.5);
    const wantJump=keys.Space||touch.jump||(time-jumpT<0.15);
    if(wantJump&&(grounded||(airT<0.12&&vy<=0))){vy=5.4;grounded=false;airT=1;jumpT=-9;}
    touch.jump=false;
    if(grounded){
      if(test(pos.x,pos.y-STEP,pos.z)&&hTop<=pos.y+2e-3){pos.y=hTop;vy=0;}else grounded=false;
    }
    if(!grounded){
      vy=Math.max(vy-15*dt,-45);pos.y+=vy*dt;
      if(test(pos.x,pos.y,pos.z)){if(vy<=0){pos.y=hTop;grounded=true;if(vy<-6)footstep(1.6);}else pos.y=hBot-(crouch?1.0:HGT)-2e-3;vy=0;}
    }
    if(grounded){
      airT=0;if(!riding){safe.x=pos.x;safe.y=pos.y;safe.z=pos.z;}
      stepAcc+=moved;if(stepAcc>(sp>5?2.3:1.75)){stepAcc=0;footstep(1);}
      if(!reduce)bob+=moved*3.4;
      for(const c of nearCells){const p=c.pads;for(let k=0;k<p.length;k+=4)
        if(Math.abs(pos.x-p[k])<0.8&&Math.abs(pos.z-p[k+2])<0.8&&Math.abs(pos.y-p[k+1])<0.07){vy=p[k+3];grounded=false;airT=1;whoosh(p[k+3]);}}
    }else airT+=dt;
  }
  /* perles au fond de l'eau */
  for(const c of nearCells){const it=c.pearls;for(let k=0;k<it.length;k+=3){
    const key=c.i+','+c.j+','+k;if(pearlTaken.has(key))continue;
    const qx=it[k]-pos.x,qy=it[k+1]-(pos.y+0.9),qz=it[k+2]-pos.z;
    if(qx*qx+qy*qy+qz*qz<1.9){pearlTaken.add(key);ex.pearls++;ping();toast('Perle · '+ex.pearls,2.5);checkGoal();}}}
  /* quelqu'un à portée de voix ? */
  nearNpc=null;let nd=2.4;
  for(const c of nearCells)for(let k=0;k<c.npcs.length;k++){const p=npcPos(c.npcs[k]),d=Math.hypot(p[0]-pos.x,p[2]-pos.z);
    if(d<nd&&Math.abs(p[1]-pos.y)<1.5){nd=d;nearNpc={key:c.i+','+c.j+','+k,seed:c.npcs[k][6]+c.i*0.71+c.j*0.37};}}
  if(nearNpc&&touchMode&&nd<1.3&&!talked.has(nearNpc.key))talk();
  /* courses chronométrées */
  if(!run){
    for(const c of nearCells){const co=c.course;if(!co)continue;const key=c.i+','+c.j;
      if(!doneCourse.has(key)&&grounded&&time-courseCool>1.5&&Math.hypot(pos.x-co.s[0],pos.z-co.s[2])<0.9&&Math.abs(pos.y-co.s[1])<0.2){
        run={key,pts:co.pts,got:new Set(),t0:time,T:co.T};toast('Course · '+Math.round(co.T)+' s',2.5);whoosh(8);}}
  }else{
    for(let k=0;k<run.pts.length;k++){if(run.got.has(k))continue;const p=run.pts[k];
      if((p[0]-pos.x)**2+(p[1]-pos.y-0.9)**2+(p[2]-pos.z)**2<1.25){run.got.add(k);tick(run.got.size);}}
    if(run.got.size===run.pts.length){doneCourse.add(run.key);ex.courses++;run=null;chime();toast('Course réussie',4);checkGoal();}
    else if(time-run.t0>run.T){run=null;courseCool=time;toast('Trop tard · repassez sur la dalle verte',4);}
  }
  /* la voiture */
  if(G.car&&!ex.car&&carT&&Math.hypot(pos.x-carT[0],pos.z-carT[1])<2.9){ex.car=1;chime();toast('Voiture retrouvée',4);checkGoal();}
  /* éclats */
  for(const c of nearCells){const it=c.items;for(let k=0;k<it.length;k+=3){
    const key=c.i+','+c.j+','+k;if(taken.has(key))continue;
    const ex=it[k]-pos.x,ey=it[k+1]-(pos.y+0.9),ez=it[k+2]-pos.z;
    if(ex*ex+ey*ey+ez*ez<1.7){taken.add(key);shards++;ping();checkGoal();}}}
  const c=cells.get(Math.round(pos.x/CELL)+','+Math.round(pos.z/CELL));
  /* stations visitées */
  if(GEN===1&&c&&c.j===0&&grounded&&!riding&&!visited.has(c.i)&&cellInfo(c.i,0).type===T_STATION&&Math.abs(pos.y-0.75)<0.1&&Math.abs(pos.z)>3.7&&Math.abs(pos.z)<9.4){
    visited.add(c.i);ex.stations=visited.size;ping();if(ex.stations>1)toast('Station '+ex.stations,3);checkGoal();}
  /* sommets */
  if(c&&c.asc&&grounded&&pos.y>=c.asc.top-0.1&&!doneAsc.has(c.i+','+c.j)){
    doneAsc.add(c.i+','+c.j);summits++;if(!play('summit',0.8))chime();toast('Sommet atteint · '+summits,4);checkGoal();
  }
  /* seuils lumineux */
  if(c&&c.door){
    const d=c.door,inside=Math.abs(pos.x-d.x)<0.62&&Math.abs(pos.z-d.z)<0.2&&pos.y>d.y-0.5&&pos.y<d.y+2;
    if(inside&&!inDoor&&passage){veil=1;veilHold=1.1;chime();loadWorld(level+1,true);toast('Espace '+(level+1)+' · '+WORLDS[W].name,5);return;}
    if(inside&&!inDoor){
      const [a,b]=findDoor(c.i,c.j),t=cellInfo(a,b),ox=a*CELL-d.x,oz=b*CELL-d.z;
      pos.x+=ox;pos.z+=oz;pos.y+=t.h-d.y;eyeY+=t.h-d.y;DR.ax+=ox;DR.az+=oz;
      safe.x=pos.x;safe.y=pos.y;safe.z=pos.z;
      inDoor=true;doorCount++;veil=1;veilHold=0.12;chime();
      curI=1e9;updateStreaming();
      for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++)ensureCell(a+di,b+dj);
      pickTarget();
    }else if(!inside&&Math.hypot(pos.x-d.x,pos.z-d.z)>0.7)inDoor=false;
  }else inDoor=false;
  /* chute dans les nuages */
  if(pos.y<WORLDS[W].cloudY-22){pos.x=safe.x;pos.y=safe.y+0.02;pos.z=safe.z;vy=0;grounded=true;eyeY=pos.y+EYE;veil=1;veilHold=0.5;}
  const tg=pos.y+(crouch?0.92:EYE);eyeY+=(tg-eyeY)*Math.min(1,dt*(grounded?16:60));
  if(Math.abs(tg-eyeY)>1.2)eyeY=tg;
}

/* ---------- entrées et menus ---------- */
const touch={mx:0,my:0,jump:false,mId:null,lId:null,m0:[0,0],l0:[0,0],lt:0,lMoved:false};
const menu=document.getElementById('menu'),hud=document.getElementById('hud'),btn=document.getElementById('go');
const objEl=document.getElementById('obj'),ttl=document.getElementById('ttl'),musBtn=document.getElementById('mus'),volEl=document.getElementById('vol'),trkEl=document.getElementById('trk');
function lockPointer(){try{const p=canvas.requestPointerLock&&canvas.requestPointerLock();if(p&&p.catch)p.catch(()=>{});}catch(e){}}
function resume(){
  if(!started)toast('Espace '+(level+1)+' · '+WORLDS[W].name,5);
  started=true;paused=false;menu.classList.add('off');hud.classList.add('on');objEl.classList.add('on');startAudio();playMusic();canvas.focus();lockPointer();
}
function showMenu(mode){
  menu.className=mode;ttl.textContent=mode==='pause'?'PAUSE':'ÉTHER';btn.textContent=mode==='pause'?'Reprendre':'Entrer';
  toastEl.classList.remove('on');toastT=0;
  if(mode==='title'){hud.classList.remove('on');objEl.classList.remove('on');}
}
function pause(){paused=true;showMenu('pause');if(ac)master.gain.setTargetAtTime(0,ac.currentTime,0.2);
  if(document.pointerLockElement)document.exitPointerLock();for(const k in keys)keys[k]=false;btn.focus();}
function resetPlayer(arrive){
  const sp=WORLDS[W].spawn;
  if(sp){pos.x=sp[0];pos.y=sp[1];pos.z=sp[2];}else{pos.x=0;pos.y=start.h+0.01;pos.z=arrive?-1.7:6.5;}
  yaw=0;pitch=0;vy=0;grounded=true;eyeY=pos.y+EYE;bob=0;stepAcc=0;
  safe.x=pos.x;safe.y=pos.y;safe.z=pos.z;inDoor=false;doorCount=0;veil=1;veilHold=arrive?1.1:0.15;
  shards=0;summits=0;taken.clear();doneAsc.clear();ex={stations:0,talks:0,pearls:0,courses:0,car:0};visited.clear();talked.clear();pearlTaken.clear();doneCourse.clear();
  run=null;swim=false;crouch=false;air=1;carT=null;beepT=-9;nearNpc=null;hint=null;airT=0;DR.ax=0;DR.az=0;DR.t0=time-60;passage=false;G=goalOf();
  touch.mx=touch.my=0;touch.mId=touch.lId=null;
  for(let di=-2;di<=2;di++)for(let dj=-2;dj<=2;dj++)ensureCell(di,dj);
  pickTarget();
}
function spacesUI(){
  const el=document.getElementById('spaces');el.textContent='';
  WORLDS.forEach((w,k)=>{const b=document.createElement('button');b.type='button';b.textContent=(k+1)+' · '+w.name;b.disabled=k>maxLevel;
    b.setAttribute('aria-pressed',k===W?'true':'false');b.addEventListener('click',()=>{loadWorld(k);});el.appendChild(b);});
  document.getElementById('where').textContent='Espace '+(level+1)+' · '+WORLDS[W].name;
}
btn.addEventListener('click',resume);
document.getElementById('restart').addEventListener('click',()=>{loadWorld(level);resume();});
document.getElementById('tomenu').addEventListener('click',()=>{started=false;paused=true;showMenu('title');btn.focus();});
canvas.addEventListener('click',()=>{if(started&&!paused&&!locked)lockPointer();});
document.addEventListener('pointerlockchange',()=>{const was=locked;locked=document.pointerLockElement===canvas;if(was&&!locked&&!paused)pause();});
let dragging=false;
canvas.addEventListener('mousedown',()=>{dragging=true;});addEventListener('mouseup',()=>{dragging=false;});
addEventListener('mousemove',e=>{if(paused)return;if(locked||dragging){yaw+=e.movementX*0.0022;pitch=Math.max(-1.5,Math.min(1.5,pitch-e.movementY*0.0022));}});
addEventListener('keydown',e=>{
  if(e.code==='Escape'&&started){if(paused)resume();else pause();return;}
  if(e.code==='KeyM'){toggleMusic();return;}
  if(paused)return;if(e.code==='KeyE'&&!e.repeat){interact();return;}
  if(e.code==='Space'&&!e.repeat)jumpT=time;keys[e.code]=true;
  if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();
});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
canvas.addEventListener('touchstart',e=>{e.preventDefault();touchMode=true;for(const t of e.changedTouches){
  if(t.clientX<innerWidth/2&&touch.mId===null){touch.mId=t.identifier;touch.m0=[t.clientX,t.clientY];}
  else if(touch.lId===null){touch.lId=t.identifier;touch.l0=[t.clientX,t.clientY];touch.lt=performance.now();touch.lMoved=false;}}},{passive:false});
canvas.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){
  if(t.identifier===touch.mId){touch.mx=Math.max(-1,Math.min(1,(t.clientX-touch.m0[0])/60));touch.my=Math.max(-1,Math.min(1,-(t.clientY-touch.m0[1])/60));}
  else if(t.identifier===touch.lId){const dx=t.clientX-touch.l0[0],dy=t.clientY-touch.l0[1];if(Math.abs(dx)+Math.abs(dy)>4)touch.lMoved=true;
    yaw+=dx*0.005;pitch=Math.max(-1.5,Math.min(1.5,pitch-dy*0.005));touch.l0=[t.clientX,t.clientY];}}},{passive:false});
const tEnd=e=>{for(const t of e.changedTouches){
  if(t.identifier===touch.mId){touch.mId=null;touch.mx=touch.my=0;}
  else if(t.identifier===touch.lId){touch.lId=null;if(!touch.lMoved&&performance.now()-touch.lt<220)touch.jump=true;}}};
canvas.addEventListener('touchend',tEnd);canvas.addEventListener('touchcancel',tEnd);

/* ---------- musique ---------- */
const TRACKS=[['music/liminal-rest.mp3','Liminal Rest, lux-aeterna'],['music/renovation.mp3','Renovation, logicallism'],['music/liminal-deep-ambient.mp3','Liminal Deep Ambient, lux_aeterna_2026'],
  ['music/empty-rooms.mp3','Empty Rooms, 9jackjack8'],['music/a-distant-glow.mp3','A Distant Glow, 9jackjack8'],['music/drowsy-liminal.mp3','Drowsy Liminal, 9jackjack8'],['music/deep-dreamcore-ambient.mp3','Deep Dreamcore Ambient, lux-aeterna']];
const music=new Audio();music.preload='auto';
let trackIdx=WORLDS[W].music[0],musicOn=true,musicVol=0.6,musicReady=false;
try{const v=localStorage.getItem('ether-vol');if(v!==null&&!isNaN(+v))musicVol=Math.max(0,Math.min(1,+v));if(localStorage.getItem('ether-mus')==='0')musicOn=false;}catch(e){}
function loadTrack(){music.src=TRACKS[trackIdx][0];musicReady=true;}
function musicUI(){
  musBtn.textContent=musicOn?'Musique activée':'Musique coupée';musBtn.setAttribute('aria-pressed',musicOn?'true':'false');
  volEl.value=Math.round(musicVol*100);music.volume=musicVol;
  trkEl.textContent=musicOn&&musicReady?'En cours : '+TRACKS[trackIdx][1]:'';
}
function playMusic(){
  if(!musicOn){music.pause();musicUI();return;}
  if(!musicReady)loadTrack();
  const p=music.play();if(p&&p.catch)p.catch(()=>{});musicUI();
}
music.addEventListener('ended',()=>{const l=WORLDS[W].music;trackIdx=l[(l.indexOf(trackIdx)+1)%l.length];loadTrack();playMusic();});
/* chaque espace a sa liste de morceaux : on change de piste en changeant d'espace */
function worldMusic(){const l=WORLDS[W].music;if(l.includes(trackIdx))return;trackIdx=l[0];if(musicReady){loadTrack();if(started&&musicOn)playMusic();else musicUI();}}
music.addEventListener('error',()=>{trkEl.textContent='Cette piste ne se charge pas.';});
function toggleMusic(){musicOn=!musicOn;try{localStorage.setItem('ether-mus',musicOn?'1':'0');}catch(e){}if(started)playMusic();else musicUI();}
musBtn.addEventListener('click',()=>{musicOn=!musicOn;try{localStorage.setItem('ether-mus',musicOn?'1':'0');}catch(e){}playMusic();});
volEl.addEventListener('input',()=>{musicVol=volEl.value/100;try{localStorage.setItem('ether-vol',String(musicVol));}catch(e){}musicUI();});
musicUI();

/* ---------- filtres d'ambiance ---------- */
const FXS=[['none','aucun'],['vhs','VHS'],['grain','grain'],['back','caméscope'],['dream','dreamcore']],fxBtn=document.getElementById('fxb'),osdEl=document.getElementById('osd');
let fxI=0;try{const v=localStorage.getItem('ether-fx');const k=FXS.findIndex(f=>f[0]===v);if(k>0)fxI=k;}catch(e){}
(function(){const cv=document.createElement('canvas');cv.width=cv.height=160;const x=cv.getContext('2d'),im=x.createImageData(160,160);
  for(let q=0;q<im.data.length;q+=4){const v=Math.random()*255;im.data[q]=im.data[q+1]=im.data[q+2]=v;im.data[q+3]=255;}
  x.putImageData(im,0,0);document.getElementById('fx-grain').style.backgroundImage='url('+cv.toDataURL()+')';})();
function fxUI(){document.body.dataset.fx=FXS[fxI][0];fxBtn.textContent='Filtre : '+FXS[fxI][1];}
fxBtn.addEventListener('click',()=>{fxI=(fxI+1)%FXS.length;try{localStorage.setItem('ether-fx',FXS[fxI][0]);}catch(e){}fxUI();});
fxUI();

/* ---------- sons ---------- */
let ac=null,master=null,noiseBuf=null,rumble=null,windG=null;
function startAudio(){
  try{
    if(ac){ac.resume();master.gain.setTargetAtTime(0.45,ac.currentTime,0.4);return;}
    ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
    master.gain.setTargetAtTime(0.45,ac.currentTime,1.5);loadSfx();
    noiseBuf=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const mk=(type,f,q,gv)=>{const s=ac.createBufferSource();s.buffer=noiseBuf;s.loop=true;const b=ac.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q;
      const g=ac.createGain();g.gain.value=gv;s.connect(b);b.connect(g);g.connect(master);s.start();return {b,g};};
    const w1=mk('bandpass',420,0.5,0.10),w2=mk('lowpass',160,0.3,0.22);rumble=w2.g.gain;windG=w1.g.gain;
    const lfo=ac.createOscillator();lfo.frequency.value=0.06;const lg=ac.createGain();lg.gain.value=230;lfo.connect(lg);lg.connect(w1.b.frequency);lfo.start();
  }catch(e){ac=null;}
}
/* bruitages enregistrés : chargés au premier clic, la synthèse sert de repli */
const SFX={},LOOPS={},SFX_FILES={crystal:'sfx/cristal.mp3',summit:'sfx/cristal-sommet.mp3',splash:'sfx/splash.mp3',water:'sfx/water.mp3',drip:'sfx/dripping.mp3',grass:'sfx/pas-herbe.mp3',concrete:'sfx/pas-beton.mp3',hall:'sfx/pas-couloir.mp3'};
let walkV=0;
function loadSfx(){
  { /* bourdonnement des néons */
    const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=100;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=200;bp.Q.value=2;
    const hg=ac.createGain();hg.gain.value=0;o.connect(bp);bp.connect(hg);hg.connect(master);o.start();LOOPS.hum={g:hg.gain};}
  for(const k in SFX_FILES)fetch(SFX_FILES[k]).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>ac.decodeAudioData(b)).then(buf=>{
    SFX[k]=buf;
    if(k==='water'||k==='drip'||k==='concrete'||k==='hall'){const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const g=ac.createGain();g.gain.value=0;s.connect(g);g.connect(master);s.start();LOOPS[k]={s,g:g.gain};}
  }).catch(()=>{});
}
function play(k,vol,rate,dur){
  if(!ac||!SFX[k])return false;const s=ac.createBufferSource();s.buffer=SFX[k];s.playbackRate.value=rate||1;const g=ac.createGain();g.gain.value=vol;s.connect(g);g.connect(master);
  if(dur)s.start(0,0,dur);else s.start();return true;
}
/* boucles : pas selon le sol, gouttes dans les Poolrooms, brasse dans l'eau */
function updateLoops(){
  if(!ac)return;const surf=WORLDS[W].step||'concrete',t=ac.currentTime,on=grounded&&!swim&&walkV>1.2&&!paused;
  for(const k of['concrete','hall'])if(LOOPS[k]){LOOPS[k].g.setTargetAtTime(on&&surf===k?(k==='hall'?0.75:0.5):0,t,0.07);LOOPS[k].s.playbackRate.setTargetAtTime(walkV>6?1.35:1,t,0.1);}
  if(LOOPS.hum)LOOPS.hum.g.setTargetAtTime(GEN===5?0.05:0,t,0.8);
  if(LOOPS.drip)LOOPS.drip.g.setTargetAtTime(GEN===3?0.4:0,t,0.8);
  if(LOOPS.water)LOOPS.water.g.setTargetAtTime(swim?0.55:0,t,0.25);
}
function footstep(k){
  if(k<=1){const surf=WORLDS[W].step||'concrete';if(surf==='grass'&&play('grass',0.5,0.9+Math.random()*0.25,0.5))return;if(LOOPS[surf])return;}
  if(!ac||muted)return;const s=ac.createBufferSource();s.buffer=noiseBuf;const b=ac.createBiquadFilter();b.type='bandpass';b.frequency.value=700+Math.random()*500;b.Q.value=1.2;
  const g=ac.createGain(),t=ac.currentTime;g.gain.setValueAtTime(0.05*k,t);g.gain.exponentialRampToValueAtTime(0.0008,t+0.11);
  s.connect(b);b.connect(g);g.connect(master);s.start(t,Math.random()*2,0.13);
}
function ping(){
  if(!ac)return;if(play('crystal',0.7,0.95+Math.random()*0.1))return;const t=ac.currentTime;
  [1318.5,1975.5].forEach((f,i)=>{const o=ac.createOscillator();o.frequency.value=f;const g=ac.createGain();
    g.gain.setValueAtTime(0,t+i*0.07);g.gain.linearRampToValueAtTime(0.06,t+i*0.07+0.02);g.gain.exponentialRampToValueAtTime(0.0005,t+i*0.07+0.9);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+1.2);});
}
function whoosh(pw){
  if(!ac)return;const s=ac.createBufferSource();s.buffer=noiseBuf;const b=ac.createBiquadFilter();b.type='bandpass';b.Q.value=0.9;
  const g=ac.createGain(),t=ac.currentTime,d=0.5+pw*0.03;b.frequency.setValueAtTime(300,t);b.frequency.exponentialRampToValueAtTime(2600,t+d);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.22,t+0.06);g.gain.exponentialRampToValueAtTime(0.0008,t+d);
  s.connect(b);b.connect(g);g.connect(master);s.start(t,Math.random(),d+0.1);
}
function splash(k){
  if(!ac)return;if(k>0.28){if(play('splash',Math.min(0.8,0.7*k)))return;}else if(LOOPS.water)return;const s=ac.createBufferSource();s.buffer=noiseBuf;const b=ac.createBiquadFilter();b.type='lowpass';const g=ac.createGain(),t=ac.currentTime;
  b.frequency.setValueAtTime(2600,t);b.frequency.exponentialRampToValueAtTime(300,t+0.5);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.30*k,t+0.03);g.gain.exponentialRampToValueAtTime(0.0008,t+0.6);
  s.connect(b);b.connect(g);g.connect(master);s.start(t,Math.random()*2,0.7);
}
function doorSfx(){
  if(!ac)return;const t=ac.currentTime;
  [880,660].forEach((f,i)=>{const o=ac.createOscillator();o.frequency.value=f;const g=ac.createGain();g.gain.setValueAtTime(0,t+i*0.22);g.gain.linearRampToValueAtTime(0.05,t+i*0.22+0.02);g.gain.exponentialRampToValueAtTime(0.0005,t+i*0.22+0.5);o.connect(g);g.connect(master);o.start(t);o.stop(t+1.1);});
  const s=ac.createBufferSource();s.buffer=noiseBuf;const b=ac.createBiquadFilter();b.type='highpass';b.frequency.value=2500;const g=ac.createGain();
  g.gain.setValueAtTime(0.0001,t+0.4);g.gain.exponentialRampToValueAtTime(0.07,t+0.5);g.gain.exponentialRampToValueAtTime(0.0008,t+1.5);s.connect(b);b.connect(g);g.connect(master);s.start(t+0.4,0,1.2);
}
function beep(){
  if(!ac)return;const t=ac.currentTime;
  [0,0.18].forEach(d=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=1500;const g=ac.createGain();g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(0.012,t+d+0.01);g.gain.setValueAtTime(0.012,t+d+0.08);g.gain.linearRampToValueAtTime(0,t+d+0.1);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.5);});
}
function murmur(){
  if(!ac)return;const t=ac.currentTime;
  for(let i=0;i<5;i++){const o=ac.createOscillator();o.type='triangle';o.frequency.value=150+Math.random()*90;const g=ac.createGain(),d=i*0.11;
    g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(0.05,t+d+0.03);g.gain.linearRampToValueAtTime(0,t+d+0.09);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.8);}
}
function tick(n){
  if(!ac)return;if(play('crystal',1.0,1.35+n*0.03))return;const t=ac.currentTime,o=ac.createOscillator();o.frequency.value=700+n*45;const g=ac.createGain();
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.24,t+0.01);g.gain.exponentialRampToValueAtTime(0.0005,t+0.25);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.3);
}
function chime(){
  if(!ac||muted)return;const t=ac.currentTime;
  [523.25,784,1174.7].forEach((f,i)=>{const o=ac.createOscillator();o.frequency.value=f;const g=ac.createGain();
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.05/(i+1),t+0.04+i*0.05);g.gain.exponentialRampToValueAtTime(0.0005,t+3.5);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+3.6);});
}

/* ---------- rendu ---------- */
function resize(){const dpr=Math.min(devicePixelRatio||1,1.5),w=Math.floor(canvas.clientWidth*dpr),h=Math.floor(canvas.clientHeight*dpr);
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}}
const ARROWS=['↑','↗','→','↘','↓','↙','←','↖'],shardsEl=document.getElementById('shards'),summitsEl=document.getElementById('summits'),
  veilEl=document.getElementById('veil'),underEl=document.getElementById('under'),altEl=document.getElementById('alt'),doorsEl=document.getElementById('doors');
function snapCenter(ax,ay,tex){const c=[pos.x,pos.y,pos.z],u=dot(c,ax),v=dot(c,ay),su=Math.floor(u/tex)*tex-u,sv=Math.floor(v/tex)*tex-v;
  return [c[0]+ax[0]*su+ay[0]*sv,c[1]+ax[1]*su+ay[1]*sv,c[2]+ax[2]*su+ay[2]*sv];}
function depthPass(target,res,VPm,radius,ci,cj){
  gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);gl.viewport(0,0,res,res);gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(pDepth.u.uVP,false,VPm);gl.uniform3f(pDepth.u.uOff,0,0,0);
  for(const c of cells.values()){if(!c.count||Math.abs(c.i-ci)>radius||Math.abs(c.j-cj)>radius)continue;gl.bindVertexArray(c.vao);gl.drawArrays(gl.TRIANGLES,0,c.count);}
  for(const t of trains){const m=TRAIN.open;gl.uniform3f(pDepth.u.uOff,t.x,0,t.z);gl.bindVertexArray(m.vao);gl.drawArrays(gl.TRIANGLES,0,m.count);}
}
function frame(now){
  requestAnimationFrame(frame);
  const raw=(now-last)/1000,dt=Math.min(0.033,raw);last=now;time+=dt;
  /* herbe : on allège si la machine peine */
  slow=slow*0.95+(raw>0.030?1:0)*0.05;if(slow>0.75&&grassQ<=0.3&&!window.__noLOD&&!window.__noPost){window.__noPost=1;slow=0.3;} /* machine à la peine : on coupe le post-traitement */
  if(slow>0.6&&grassQ>0.3&&!window.__noLOD){grassQ-=0.15;slow=0.3;}
  resize();
  const doorC=passage?[1.05,0.80+0.1*Math.sin(time*3),0.28]:null;
  if(!paused)physics(dt);else{updateTrains(dt);if(!started)yaw=Math.sin(time*0.05)*0.5;}
  updateStreaming();
  const WD=WORLDS[W];

  const cp=Math.cos(pitch),F=[Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp],Rt=[Math.cos(yaw),0,Math.sin(yaw)],U=cross(Rt,F);
  const eye=[pos.x,eyeY+(grounded?Math.sin(bob)*0.035:0),pos.z];
  const asp=canvas.width/canvas.height,fovy=(asp<1?88:72)*Math.PI/180,ty=Math.tan(fovy/2);
  const VP=mul(perspective(fovy,asp,0.12,16000),lookAt(eye,[eye[0]+F[0],eye[1]+F[1],eye[2]+F[2]],[0,1,0]));
  const ci=Math.round(pos.x/CELL),cj=Math.round(pos.z/CELL);

  /* ombres du soleil, puis carte de ciel visible (vue du dessus) */
  const lx=norm(cross([0,1,0],SUN)),ly=cross(SUN,lx),sc=snapCenter(lx,ly,2*SHADOW_HALF/SHADOW_RES);
  const SVP=mul(ortho(-SHADOW_HALF,SHADOW_HALF,-SHADOW_HALF,SHADOW_HALF,1,700),lookAt([sc[0]+SUN[0]*350,sc[1]+SUN[1]*350,sc[2]+SUN[2]*350],sc,[0,1,0]));
  const tc=snapCenter([1,0,0],[0,0,1],2*TOP_HALF/TOP_RES);
  const TVP=mul(ortho(-TOP_HALF,TOP_HALF,-TOP_HALF,TOP_HALF,1,701),lookAt([tc[0],pos.y+400,tc[2]],[tc[0],pos.y,tc[2]],[0,0,-1]));
  gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.BLEND);
  gl.useProgram(pDepth.p);
  gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1.5,3);
  depthPass(shT,SHADOW_RES,SVP,3,ci,cj);
  gl.disable(gl.POLYGON_OFFSET_FILL);
  depthPass(topT,TOP_RES,TVP,2,ci,cj);
  const usePost=!window.__noPost&&postReady(canvas.width,canvas.height);
  gl.bindFramebuffer(gl.FRAMEBUFFER,usePost?POST.scene.fbo:null);gl.viewport(0,0,canvas.width,canvas.height);
  gl.clearColor(0,0,0,0);gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);

  /* ciel */
  gl.disable(gl.DEPTH_TEST);gl.depthMask(false);
  gl.useProgram(pSky.p);setPal(pSky);gl.uniform3fv(pSky.u.uF,F);gl.uniform3fv(pSky.u.uR,Rt);gl.uniform3fv(pSky.u.uU,U);gl.uniform3fv(pSky.u.uCam,eye);
  gl.uniform2f(pSky.u.uTan,ty*asp,ty);
  gl.bindVertexArray(vaoTri);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.enable(gl.DEPTH_TEST);gl.depthMask(true);

  /* colosses et dalle errante */
  sunK=1;
  gl.useProgram(pMain.p);setPal(pMain,doorC);setLight(pMain,SVP,TVP);gl.uniformMatrix4fv(pMain.u.uVP,false,VP);gl.uniform3fv(pMain.u.uCam,eye);
  gl.uniform3f(pMain.u.uOff,0,0,0);gl.uniform1f(pMain.u.uSunK,1);
  if(WD.megas){
    updateMegas(pos.x,pos.z);
    let du=(time-DR.t0)*25-3000;if(du>3000){DR.t0=time;DR.ax=pos.x;DR.az=pos.z;du=-3000;}
    const tS=DRIFT_Y/SUN[1],dOff=[DR.ax+SUN[0]*tS+du,DRIFT_Y,DR.az+SUN[2]*tS];
    const t=(DRIFT_Y-eye[1])/SUN[1],hx=eye[0]+SUN[0]*t-dOff[0],hz=eye[2]+SUN[2]*t-dOff[2];
    let k=Math.max(0,Math.min(1,(Math.min(DRIFT_HX-Math.abs(hx),DRIFT_HZ-Math.abs(hz))+60)/120));k=k*k*(3-2*k);sunK=1-0.85*k;
    for(const m of megaMeshes.values())if(m.count){gl.bindVertexArray(m.vao);gl.drawArrays(gl.TRIANGLES,0,m.count);}
    gl.uniform3fv(pMain.u.uOff,dOff);gl.bindVertexArray(driftMesh.vao);gl.drawArrays(gl.TRIANGLES,0,driftMesh.count);
  }

  /* mer de nuages (couche de fond) ou sol lointain */
  gl.useProgram(pSea.p);setPal(pSea);gl.uniformMatrix4fv(pSea.u.uVP,false,VP);gl.uniform3fv(pSea.u.uCam,eye);gl.uniform3fv(pSea.u.uCamP,eye);
  gl.uniform1f(pSea.u.uLayer,0);gl.uniform1f(pSea.u.uGroundK,WD.full?1:0);gl.uniform1f(pSea.u.uY,WD.inside?-60:WD.full?-0.06:WD.cloudY);
  gl.bindVertexArray(vaoQuad);gl.drawArrays(gl.TRIANGLES,0,6);

  /* architecture */
  gl.useProgram(pMain.p);gl.uniform3f(pMain.u.uOff,0,0,0);gl.uniform1f(pMain.u.uSunK,sunK);
  const fh=norm([Math.sin(yaw),0,-Math.cos(yaw)]),cullOk=Math.abs(pitch)<0.9;
  for(const c of cells.values()){
    if(!c.count)continue;
    if(cullOk&&(c.i*CELL-eye[0])*fh[0]+(c.j*CELL-eye[2])*fh[2]<-42)continue;
    gl.bindVertexArray(c.vao);gl.drawArrays(gl.TRIANGLES,0,c.count);
  }
  for(const t of trains){
    gl.uniform3f(pMain.u.uOff,t.x,0,t.z);gl.bindVertexArray(TRAIN.open.vao);gl.drawArrays(gl.TRIANGLES,0,TRAIN.open.count);
    for(const sd of[0,1]){gl.uniform3f(pMain.u.uOff,t.x+(sd?1:-1)*t.o*0.62,0,t.z);gl.bindVertexArray(LEAVES[sd].vao);gl.drawArrays(gl.TRIANGLES,0,LEAVES[sd].count);}
  }
  /* yeux ailés : dans les rames, sur les quais, au détour d'une pièce */
  const eyesL=[],drawEye=(x,y,z,a,ph)=>{eyesL.push(x,y,z,ph);};
  for(const t of trains){if(Math.abs(t.x-eye[0])>130)continue;
    for(const q of[[-6.3,-0.6,1.57,0.1],[1.2,0.5,-1.57,0.4],[5.9,-0.5,1.57,0.7]])drawEye(t.x+q[0],0.75+1.5,t.z+q[1],Math.atan2(-(eye[0]-t.x-q[0]),eye[2]-t.z-q[1]),q[3]);}
  for(const c of cells.values()){if(!c.npcs.length||Math.abs(c.i-ci)>3||Math.abs(c.j-cj)>3)continue;
    for(const n of c.npcs){const p=npcPos(n);drawEye(p[0],p[1]+1.5,p[2],p[3],n[6]);}}
  gl.uniform2f(pMain.u.uRot,1,0);gl.uniform3f(pMain.u.uOff,0,0,0);
  if(SPR.ready&&eyesL.length){
    gl.useProgram(pSpr.p);setPal(pSpr);gl.uniformMatrix4fv(pSpr.u.uVP,false,VP);gl.uniform3fv(pSpr.u.uCam,eye);gl.uniform3fv(pSpr.u.uRight,Rt);
    gl.uniform2f(pSpr.u.uSize,0.85,0.85*SPR.asp);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,SPR.tex);gl.uniform1i(pSpr.u.uTex,2);gl.bindVertexArray(SPR.vao);
    for(let k=0;k<eyesL.length;k+=4){const ph=eyesL[k+3];
      gl.uniform3f(pSpr.u.uPos,eyesL[k],eyesL[k+1]+(reduce?0:Math.sin(time*1.3+ph*9)*0.10),eyesL[k+2]);gl.uniform1f(pSpr.u.uFlap,reduce?0:Math.sin(time*3.2+ph*20)*0.5+0.5);
      gl.drawArrays(gl.TRIANGLES,0,SPR.count);}
    gl.activeTexture(gl.TEXTURE0);
  }

  /* herbe */
  const GR=46;
  gl.useProgram(pGrass.p);setPal(pGrass);setLight(pGrass,SVP,TVP);gl.uniformMatrix4fv(pGrass.u.uVP,false,VP);gl.uniform3fv(pGrass.u.uCam,eye);gl.uniform3fv(pGrass.u.uEye,eye);
  gl.uniform1f(pGrass.u.uTimeV,reduce?0:time);gl.uniform1f(pGrass.u.uGrassR,GR);gl.uniform1f(pGrass.u.uSunK,sunK);gl.uniform3f(pGrass.u.uOff,0,0,0);
  for(const c of cells.values()){
    if(!c.grass||!c.grass.count)continue;
    const ddx=Math.max(0,Math.abs(c.i*CELL-eye[0])-24),ddz=Math.max(0,Math.abs(c.j*CELL-eye[2])-24),dd=Math.hypot(ddx,ddz);
    if(dd>GR)continue;if(cullOk&&(c.i*CELL-eye[0])*fh[0]+(c.j*CELL-eye[2])*fh[2]<-42)continue;
    const n=Math.floor(c.grass.count*grassQ*(dd>22?0.55:1));
    gl.bindVertexArray(c.grass.vao);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,BLADE_N,n);
  }
  for(const t of trains){if(Math.abs(t.x-eye[0])>GR+10)continue;gl.uniform3f(pGrass.u.uOff,t.x,0,t.z);gl.bindVertexArray(TRAIN.grass.vao);gl.drawArraysInstanced(gl.TRIANGLE_STRIP,0,BLADE_N,TRAIN.grass.count);}

  /* éclats, flammes, faisceau */
  gl.useProgram(pItem.p);gl.uniformMatrix4fv(pItem.u.uVP,false,VP);gl.bindVertexArray(octVao);
  gl.uniform3f(pItem.u.uColor,1.0,0.80,0.30);gl.uniform3f(pItem.u.uScale,0.2,0.4,0.2);
  for(const c of cells.values()){
    if(Math.abs(c.i*CELL-eye[0])>170||Math.abs(c.j*CELL-eye[2])>170)continue;
    const it=c.items;for(let k=0;k<it.length;k+=3){if(taken.has(c.i+','+c.j+','+k))continue;
      gl.uniform3f(pItem.u.uPos,it[k],it[k+1]+Math.sin(time*1.6+it[k])*0.12,it[k+2]);gl.uniform1f(pItem.u.uRot,time*1.4+it[k+2]);gl.drawArrays(gl.TRIANGLES,0,24);}
  }
  gl.uniform3f(pItem.u.uColor,1.0,0.90,0.97);gl.uniform3f(pItem.u.uScale,0.2,0.2,0.2);
  for(const c of cells.values()){if(!c.pearls.length||Math.abs(c.i-ci)>2||Math.abs(c.j-cj)>2)continue;
    const it=c.pearls;for(let k=0;k<it.length;k+=3){if(pearlTaken.has(c.i+','+c.j+','+k))continue;
      gl.uniform3f(pItem.u.uPos,it[k],it[k+1]+Math.sin(time*1.1+it[k])*0.05,it[k+2]);gl.uniform1f(pItem.u.uRot,time*0.8+it[k]);gl.drawArrays(gl.TRIANGLES,0,24);}}
  if(run){gl.uniform3f(pItem.u.uColor,0.35,0.97,1.0);gl.uniform3f(pItem.u.uScale,0.26,0.26,0.26);
    for(let k=0;k<run.pts.length;k++){if(run.got.has(k))continue;const p=run.pts[k];gl.uniform3f(pItem.u.uPos,p[0],p[1],p[2]);gl.uniform1f(pItem.u.uRot,time*2+k);gl.drawArrays(gl.TRIANGLES,0,24);}}
  if(G.car&&!ex.car&&carT&&(time-beepT<3||Math.sin(time*4.5)>0.75)){
    gl.uniform3f(pItem.u.uColor,1.08,0.62,0.16);gl.uniform3f(pItem.u.uScale,0.34,0.16,0.34);gl.uniform3f(pItem.u.uPos,carT[0],1.78,carT[1]);gl.uniform1f(pItem.u.uRot,0);gl.drawArrays(gl.TRIANGLES,0,24);}
  gl.uniform3f(pItem.u.uColor,1.04,0.95,0.72);
  for(const c of cells.values())if(c.asc&&!doneAsc.has(c.i+','+c.j)){
    gl.uniform3f(pItem.u.uScale,0.45,0.9,0.45);gl.uniform3f(pItem.u.uPos,c.asc.x,c.asc.top+1.7+Math.sin(time*1.2)*0.15,c.asc.z);gl.uniform1f(pItem.u.uRot,time*0.9);gl.drawArrays(gl.TRIANGLES,0,24);}
  if(target){const dd=Math.hypot(target.x-eye[0],target.z-eye[2]),w=Math.max(0.35,dd*0.0035);
    if(target.kind==='door')gl.uniform3f(pItem.u.uColor,1.05,0.82,0.30);
    const hgt=WORLDS[W].inside?10:900;
    gl.uniform3f(pItem.u.uScale,w,hgt,w);gl.uniform3f(pItem.u.uPos,target.x,target.top+3.2+hgt,target.z);gl.uniform1f(pItem.u.uRot,time*0.3);gl.drawArrays(gl.TRIANGLES,0,24);}
  else if(shardHint){const hgt=WORLDS[W].inside?1.2:30;gl.uniform3f(pItem.u.uColor,1.0,0.86,0.45);gl.uniform3f(pItem.u.uScale,0.07,hgt,0.07);
    gl.uniform3f(pItem.u.uPos,shardHint[0],shardHint[1]+1+hgt,shardHint[2]);gl.uniform1f(pItem.u.uRot,time*0.3);gl.drawArrays(gl.TRIANGLES,0,24);}

  /* nappes de nuages translucides au-dessus de la mer */
  if(!WD.full){
    gl.useProgram(pSea.p);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ZERO,gl.ONE);gl.depthMask(false);gl.bindVertexArray(vaoQuad);
    for(const L of[1,2]){gl.uniform1f(pSea.u.uLayer,L);gl.uniform1f(pSea.u.uY,WD.cloudY+L*7);gl.drawArrays(gl.TRIANGLES,0,6);}
    gl.disable(gl.BLEND);gl.depthMask(true);
  }

  if(usePost)postRun(ty*asp,ty,0.12,16000);

  /* voile blanc : traversée des nuages, seuils */
  if(veilHold>0)veilHold-=dt;else veil=Math.max(0,veil-dt*1.1);
  const depth=WD.full?0:Math.max(0,Math.min(1,(WD.cloudY+16-eye[1])/20));
  veilEl.style.opacity=Math.max(veil,depth).toFixed(3);
  underEl.style.opacity=(swim&&eye[1]<swimY)?1:0;
  hudT+=dt;if(hudT>(run?0.1:0.25)){hudT=0;
    altEl.textContent=WD.name+(WD.full?'':' · altitude '+Math.round(3200+pos.y).toLocaleString('fr-FR')+' m');
    doorsEl.textContent=doorCount?'Seuils '+doorCount:'';
    shardsEl.textContent=G.shards?'':'Éclats '+shards;summitsEl.textContent='';
    /* indice : la chose la plus proche qui fait avancer l'objectif en cours */
    hint=null;
    if(!target&&!passage){
      const L=[];
      if(ex.courses<G.courses){for(const c of cells.values())if(c.course&&!doneCourse.has(c.i+','+c.j))L.push([c.course.s[0],c.course.s[1],c.course.s[2],'départ de course']);}
      else if(ex.talks<G.talks){for(const c of cells.values())for(let k=0;k<c.npcs.length;k++)if(!talked.has(c.i+','+c.j+','+k)){const p=npcPos(c.npcs[k]);L.push([p[0],p[1],p[2],'un regard']);}}
      else if(ex.pearls<G.pearls){for(const c of cells.values()){const it=c.pearls;for(let k=0;k<it.length;k+=3)if(!pearlTaken.has(c.i+','+c.j+','+k))L.push([it[k],it[k+1],it[k+2],'perle']);}}
      else if(shards<G.shards){for(const c of cells.values()){const it=c.items;for(let k=0;k<it.length;k+=3)if(!taken.has(c.i+','+c.j+','+k))L.push([it[k],it[k+1],it[k+2],'éclat']);}}
      let bd=1e9;for(const q of L){const d=(q[0]-pos.x)**2+(q[2]-pos.z)**2+(q[1]-pos.y)**2*4;if(d<bd){bd=d;hint=q;}}
    }
    shardHint=hint;
    if(G.car&&!ex.car&&!carT){let bd=0;for(const c of cells.values())if(c.car){const d=Math.hypot(c.car[0]-pos.x,c.car[1]-pos.z);if(d>110&&d<330&&d>bd){bd=d;carT=c.car;}}}
    const parts=[],arrow=(tx,tz)=>{let rel=Math.atan2(tx,-tz)-yaw;rel=((rel%(2*Math.PI))+2*Math.PI)%(2*Math.PI);return ARROWS[Math.round(rel/(Math.PI/4))%8];};
    if(run)parts.push('Course '+run.got.size+'/'+run.pts.length+' · '+Math.max(0,run.T-(time-run.t0)).toFixed(1).replace('.',',')+' s');
    else if(passage)parts.push('Passage ouvert');
    else for(const k of GK)if(G[k])parts.push(LABEL[k]+' '+Math.min(val(k),G[k])+'/'+G[k]);
    const tg=run?null:(target||(hint?{kind:'hint',x:hint[0],y:hint[1],z:hint[2],label:hint[3],reach:true}:null));
    if(tg){const tx=tg.x-pos.x,tz=tg.z-pos.z,dd=Math.hypot(tx,tz);
      if(tg.kind==='summit'&&dd<9)parts.push('grimpez');
      else if(tg.kind==='hint')parts.push(dd<3?tg.label+(tg.y>pos.y+2.2?' au-dessus':tg.y<pos.y-1.2?' en dessous, plongez':' tout près'):arrow(tx,tz)+' '+tg.label+' · '+Math.round(dd)+' m');
      else parts.push(arrow(tx,tz)+' '+(tg.kind==='door'?'seuil':'sommet')+' · '+Math.round(dd)+' m'+(tg.reach?'':' · par un seuil ou un grand saut'));}
    if(GEN===1&&!passage&&!run&&ex.stations<G.stations&&!riding)parts.push('prenez une rame vers une autre station');
    if(nearNpc)parts.push('E · écouter');
    else if(G.car&&!ex.car&&!passage)parts.push(carT&&time-beepT<6?arrow(carT[0]-pos.x,carT[1]-pos.z)+' voiture · '+Math.round(Math.hypot(carT[0]-pos.x,carT[1]-pos.z))+' m':'E · biper la voiture');
    if(crouch)parts.push('accroupi');
    if(FXS[fxI][0]==='vhs'||FXS[fxI][0]==='back'){const s=Math.floor(time);osdEl.textContent=(FXS[fxI][0]==='vhs'?'\u25B6 PLAY   SP\n':'\u25CF REC\n')+String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
    if(swim){const n=Math.ceil(air*6);parts.push('Air '+'▮'.repeat(n)+'▯'.repeat(6-n));}
    objEl.textContent=parts.join(' · ');
    updateLoops();
    if(ac&&rumble){rumble.setTargetAtTime(0.22+0.9*(1-sunK)+0.8*riding,ac.currentTime,0.5);windG.setTargetAtTime(WORLDS[W].inside?0.012:0.10,ac.currentTime,0.8);}
  }
  if(toastT>0){toastT-=dt;if(toastT<=0)toastEl.classList.remove('on');}
}
resetPlayer();spacesUI();
window.__ether={cell:(i,j)=>ensureCell(i,j),pos,cells,cellInfo,bridge,bkind,ascLayout,megaInfo,trains,trainAt,world:(n)=>loadWorld(n),get passage(){return passage;},get G(){return G;},get target(){return target;},
  get st(){return {shards,summits,sunK,riding,time,grassQ,ex,swim,air,run:run&&run.got.size,nearNpc:!!nearNpc,carT};},interact,win:()=>{shards=G.shards;summits=G.summits;for(const k in ex)ex[k]=G[k];checkGoal();},drift:(t)=>{DR.t0=time-t;},
  sim:(n,k)=>{Object.assign(keys,k);paused=false;for(let q=0;q<n;q++){time+=1/60;physics(1/60);}for(const x in k)keys[x]=false;return {x:pos.x,y:pos.y,z:pos.z,doorCount,grounded};},
  set:(y,p)=>{yaw=y;pitch=p;},go:()=>{started=true;paused=false;}};
requestAnimationFrame(frame);
