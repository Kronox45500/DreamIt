/* ====================== Coop : jusqu'à quatre rêveurs dans le même rêve ======================
   Les navigateurs se parlent directement (WebRTC). Pour se trouver, ils passent par le serveur
   public et gratuit de PeerJS, qui ne fait que relayer les messages de mise en relation.
   L'hôte décide du niveau ; chacun envoie sa position et ce qu'il a ramassé ; l'hôte fait la somme. */
const COOP={on:false,host:false,code:'',me:'',name:'',ws:null,peers:new Map(),states:new Map(),epoch:0,down:false,downT:0,exitT:-9,lastSend:0,lastSync:0,hb:null,err:''};
const COOP_SIG='wss://0.peerjs.com/peerjs?key=peerjs';
const COOP_ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:global.stun.twilio.com:3478'}]};
const coopEl={};
function coopStatus(t){COOP.err=t;if(coopEl.st)coopEl.st.textContent=t;}
function coopRand(n,abc){let s='';for(let k=0;k<n;k++)s+=abc[Math.floor(Math.random()*abc.length)];return s;}

/* ---- mise en relation ---- */
function coopSignal(id,onOpen){
  const ws=new WebSocket(COOP_SIG+'&id='+encodeURIComponent(id)+'&token='+coopRand(10,'abcdefghijklmnopqrstuvwxyz0123456789'));
  COOP.ws=ws;
  ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data);}catch(e){return;}
    if(m.type==='OPEN'){onOpen&&onOpen();return;}
    if(m.type==='ID-TAKEN'){coopStatus('Ce code est déjà pris. Recommence.');coopLeave();return;}
    if(m.type==='ERROR'){coopStatus('Le serveur de mise en relation refuse : '+((m.payload&&m.payload.msg)||''));return;}
    if(m.type==='EXPIRE'){coopStatus('Partie introuvable : vérifie le code.');return;}
    if(m.type==='OFFER'||m.type==='ANSWER'||m.type==='CANDIDATE')coopOnSignal(m);};
  ws.onerror=()=>coopStatus('Impossible de joindre le serveur de mise en relation (réseau bloqué ?).');
  ws.onclose=()=>{if(COOP.on&&!COOP.peers.size)coopStatus('Connexion au serveur perdue.');};
  clearInterval(COOP.hb);COOP.hb=setInterval(()=>{if(ws.readyState===1)ws.send(JSON.stringify({type:'HEARTBEAT'}));},5000);
}
function coopSend(type,dst,payload){if(COOP.ws&&COOP.ws.readyState===1)COOP.ws.send(JSON.stringify({type,dst,payload}));}
function coopPC(peer){
  const pc=new RTCPeerConnection(COOP_ICE),P={id:peer,pc,dc:null,name:'?'};COOP.peers.set(peer,P);
  pc.onicecandidate=e=>{if(e.candidate)coopSend('CANDIDATE',peer,{candidate:e.candidate,connectionId:'dream'});};
  pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed'||pc.connectionState==='closed'||pc.connectionState==='disconnected')coopDrop(peer);};
  pc.ondatachannel=e=>coopWire(P,e.channel);
  return P;
}
function coopWire(P,dc){P.dc=dc;dc.onopen=()=>{coopStatus(COOP.host?'Partie '+COOP.code+' · un rêveur vient d\'entrer.':'Connecté à la partie '+COOP.code+'.');coopList();if(COOP.host)coopSync(true);};
  dc.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch(x){return;}coopMsg(P,m);};dc.onclose=()=>coopDrop(P.id);}
async function coopOnSignal(m){
  const src=m.src,p=m.payload||{};
  if(m.type==='OFFER'&&COOP.host){if(COOP.peers.size>=3){return;}const P=coopPC(src);
    await P.pc.setRemoteDescription(p.sdp);const a=await P.pc.createAnswer();await P.pc.setLocalDescription(a);coopSend('ANSWER',src,{sdp:P.pc.localDescription,connectionId:'dream'});}
  else if(m.type==='ANSWER'){const P=COOP.peers.get(src);if(P)await P.pc.setRemoteDescription(p.sdp);}
  else if(m.type==='CANDIDATE'){const P=COOP.peers.get(src);if(P&&p.candidate)try{await P.pc.addIceCandidate(p.candidate);}catch(e){}}
}
function coopDrop(id){const P=COOP.peers.get(id);if(!P)return;try{P.pc.close();}catch(e){}COOP.peers.delete(id);COOP.states.delete(id);coopList();
  if(!COOP.host&&COOP.on){coopStatus('L\'hôte a quitté la partie.');}}

/* ---- créer, rejoindre, quitter ---- */
function coopName(){const n=(coopEl.name&&coopEl.name.value.trim())||'Rêveur';try{localStorage.setItem('dream-name',n);}catch(e){}return n.slice(0,16);}
function coopHost(){coopLeave();COOP.on=true;COOP.host=true;COOP.name=coopName();COOP.code=coopRand(4,'ABCDEFGHJKLMNPQRSTUVWXYZ');COOP.me='dreamit-'+COOP.code.toLowerCase();
  coopStatus('Ouverture de la partie…');coopSignal(COOP.me,()=>{coopStatus('Partie ouverte · code '+COOP.code+' · donne-le à tes amis, puis entre.');coopList();});}
function coopJoin(){const code=(coopEl.code.value||'').trim().toUpperCase();if(!/^[A-Z]{4}$/.test(code)){coopStatus('Le code fait quatre lettres.');return;}
  coopLeave();COOP.on=true;COOP.host=false;COOP.name=coopName();COOP.code=code;COOP.me='dreamit-'+code.toLowerCase()+'-'+coopRand(6,'abcdefghijklmnopqrstuvwxyz0123456789');
  const host='dreamit-'+code.toLowerCase();coopStatus('Recherche de la partie '+code+'…');
  coopSignal(COOP.me,async()=>{const P=coopPC(host);coopWire(P,P.pc.createDataChannel('dream'));const o=await P.pc.createOffer();await P.pc.setLocalDescription(o);
    coopSend('OFFER',host,{sdp:P.pc.localDescription,type:'data',connectionId:'dream'});
    setTimeout(()=>{if(COOP.on&&!COOP.host&&!(P.dc&&P.dc.readyState==='open'))coopStatus('Pas de réponse de la partie '+code+'. Vérifie le code, ou le réseau bloque la connexion directe.');},12000);});}
function coopLeave(){for(const id of[...COOP.peers.keys()])coopDrop(id);if(COOP.ws)try{COOP.ws.close();}catch(e){}COOP.ws=null;clearInterval(COOP.hb);
  COOP.on=false;COOP.host=false;COOP.down=false;document.body.classList.remove('downed');coopList();coopStatus('');}
function coopList(){if(!coopEl.list)return;const n=[COOP.on?COOP.name+' (toi'+(COOP.host?', hôte':'')+')':''];for(const s of COOP.states.values())n.push(s.n);
  coopEl.list.textContent=COOP.on?'Rêveurs : '+n.filter(Boolean).join(' · '):'';coopEl.leave.hidden=!COOP.on;}

/* ---- messages ---- */
function coopBroadcast(m,except){const s=JSON.stringify(m);for(const P of COOP.peers.values())if(P.id!==except&&P.dc&&P.dc.readyState==='open')try{P.dc.send(s);}catch(e){}}
function coopMsg(P,m){
  if(m.t==='st'){m.at=performance.now();COOP.states.set(m.id,m);P.name=m.n;if(COOP.host)coopBroadcast(m,P.id);if(!coopEl.list.textContent.includes(m.n))coopList();}
  else if(m.t==='prog'){if(m.ep===COOP.epoch)coopMerge(m);if(COOP.host)coopSync(true);}
  else if(m.t==='sync'&&!COOP.host)coopApply(m);
  else if(m.t==='bye'){coopDrop(m.id);}
}
const COOP_SETS=['taken','noteTaken','pearlTaken','answered','talked','doneCourse','doneAsc'];
function coopSets(){return{taken:[...taken],noteTaken:[...noteTaken],pearlTaken:[...pearlTaken],answered:[...answered],talked:[...talked],doneCourse:[...doneCourse],doneAsc:[...doneAsc],visited:[...visited],car:ex.car,souv:ex.souv};}
function coopMerge(m){ /* l'union de ce que chacun a trouvé : ce qu'un rêveur ramasse compte pour tous */
  const S={taken,noteTaken,pearlTaken,answered,talked,doneCourse,doneAsc};let ch=false;
  for(const k of COOP_SETS)if(m[k])for(const v of m[k])if(!S[k].has(v)){S[k].add(v);ch=true;}
  if(m.visited)for(const v of m.visited)if(!visited.has(v)){visited.add(v);ch=true;}
  if(m.car>ex.car){ex.car=m.car;ch=true;}if(m.souv>ex.souv){ex.souv=m.souv;ch=true;}
  if(ch){shards=taken.size;summits=doneAsc.size;ex.talks=talked.size;ex.pearls=pearlTaken.size;ex.notes=noteTaken.size;ex.phones=answered.size;
    ex.courses=doneCourse.size;ex.stations=visited.size;checkGoal();}
}
function coopSync(now){ /* l'hôte publie l'état de la partie : niveau, mode, objets trouvés, fin éventuelle */
  if(!COOP.host)return;const t=performance.now();if(!now&&t-COOP.lastSync<900)return;COOP.lastSync=t;
  coopBroadcast(Object.assign({t:'sync',lv:level,ep:COOP.epoch,mode,end:wakeT>0?wakeKind:-1,c3n:c3next,c3:[...C3]},coopSets()));}
function coopApply(m){
  if(m.mode&&m.mode!==mode){mode=m.mode;document.body.dataset.mode=mode;}
  if(m.c3){C3.clear();for(const v of m.c3)C3.add(v);c3next=m.c3n||c3next;}
  if(m.lv!==level||m.ep!==COOP.epoch){COOP.epoch=m.ep;COOP.down=false;document.body.classList.remove('downed');coopLoad(m.lv);if(started)chapter();}
  if(m.end>=0&&!(wakeT>0)){wakeKind=m.end;const L=m.end===0?WAKE:m.end===1?END2:END3;veil=1;veilHold=L.length*5.2+1.5;wakeT=veilHold-0.4;chime();story(L,true);}
  coopMerge(m);
}
let coopLoading=false;
function coopLoad(lv){coopLoading=true;try{loadWorld(lv,true);}finally{coopLoading=false;}}
/* l'hôte change de niveau : nouvelle époque, tout le monde suit */
const coopLoadWorld0=loadWorld;
loadWorld=function(lv,arrive){coopLoadWorld0(lv,arrive);if(COOP.on&&COOP.host&&!coopLoading){COOP.epoch++;COOP.down=false;document.body.classList.remove('downed');coopSync(true);}};

/* ---- règles du coop : sortie à plusieurs, rêveurs attrapés, relève ---- */
function coopBlockExit(){ /* appelé quand le joueur remplit la condition de sortie : on ne part qu'ensemble */
  if(!COOP.on||!COOP.peers.size)return false;COOP.exitT=performance.now();
  if(!COOP.host){toast('Tu attends les autres à la sortie.',1.2);return true;}
  const t=performance.now();for(const s of COOP.states.values())if(s.lv===level&&!s.d&&!(s.ex&&t-s.at<1500)){toast('Tout le monde doit rejoindre la sortie.',1.2);return true;}
  return false;
}
function coopOnDeath(){ /* attrapé : on reste à terre, les autres peuvent venir te relever */
  if(!COOP.on||!COOP.peers.size)return false;COOP.down=true;COOP.downT=0;document.body.classList.add('downed');toast('Attrapé. Attends qu\'un autre rêveur vienne te relever.',5);return true;}
function coopTick(dt){
  if(!COOP.on)return;const t=performance.now();
  for(const [id,s] of COOP.states)if(t-s.at>6000)COOP.states.delete(id);
  if(t-COOP.lastSend>100&&COOP.peers.size){COOP.lastSend=t;
    const m={t:'st',id:COOP.me,n:COOP.name,lv:level,x:pos.x,y:pos.y,z:pos.z,yaw,d:COOP.down?1:0,ex:t-COOP.exitT<600?1:0};
    coopBroadcast(m);}
  if(!COOP.host&&COOP.peers.size&&t-COOP.lastProg>1000){COOP.lastProg=t;coopBroadcast(Object.assign({t:'prog',ep:COOP.epoch},coopSets()));}
  coopSync(false);
  /* relève : un rêveur debout près de toi pendant deux secondes */
  if(COOP.down){let near=false;for(const s of COOP.states.values())if(s.lv===level&&!s.d&&Math.hypot(s.x-pos.x,s.z-pos.z)<1.8)near=true;
    if(!near)COOP.revAt=0;else if(!COOP.revAt)COOP.revAt=t;if(COOP.revAt&&t-COOP.revAt>2000){COOP.revAt=0;COOP.down=false;document.body.classList.remove('downed');toast('Relevé.',2);}}
  /* l'hôte : si tout le monde est à terre, le lieu recommence */
  if(COOP.host&&COOP.down){let all=true;for(const s of COOP.states.values())if(s.lv===level&&!s.d)all=false;if(all){COOP.down=false;document.body.classList.remove('downed');loadWorld(level);toast('Tout le monde a été attrapé.',4);}}
  coopLabels();
}
COOP.lastProg=0;
/* étiquettes des noms au-dessus des autres rêveurs */
function coopLabels(){
  const box=coopEl.tags;if(!box)return;const VP=window.__VP;let html='';
  if(VP&&COOP.on&&started&&!paused)for(const s of COOP.states.values()){if(s.lv!==level)continue;
    const x=s.x,y=s.y+2.05,z=s.z,cx=VP[0]*x+VP[4]*y+VP[8]*z+VP[12],cy=VP[1]*x+VP[5]*y+VP[9]*z+VP[13],cw=VP[3]*x+VP[7]*y+VP[11]*z+VP[15];
    if(cw<0.1)continue;const sx=(cx/cw*0.5+0.5)*innerWidth,sy=(1-(cy/cw*0.5+0.5))*innerHeight;if(sx<-50||sx>innerWidth+50||sy<-20||sy>innerHeight+20)continue;
    const d=Math.hypot(x-pos.x,z-pos.z);html+='<span style="left:'+sx.toFixed(0)+'px;top:'+sy.toFixed(0)+'px">'+s.n.replace(/[<>&]/g,'')+(s.d?' · à terre':'')+(d>12?' · '+Math.round(d)+' m':'')+'</span>';}
  if(box.innerHTML!==html)box.innerHTML=html;
}
function coopPeersHere(){const out=[];if(!COOP.on)return out;for(const s of COOP.states.values())if(s.lv===level)out.push(s);return out;}

/* ---- le panneau du menu ---- */
(function(){
  const host=document.getElementById('coop');if(!host)return;
  host.innerHTML='<span class="chl">Coop · jusqu\'à 4 rêveurs</span>'+
    '<input id="coopName" maxlength="16" placeholder="Ton pseudo" aria-label="Pseudo">'+
    '<button id="coopHost" type="button">Créer une partie</button>'+
    '<input id="coopCode" maxlength="4" placeholder="CODE" aria-label="Code de la partie" style="width:6em;text-transform:uppercase">'+
    '<button id="coopJoin" type="button">Rejoindre</button><button id="coopLeave" type="button" hidden>Quitter le coop</button>'+
    '<span id="coopSt" class="coopst" role="status"></span><span id="coopList" class="coopst"></span>';
  coopEl.name=document.getElementById('coopName');coopEl.code=document.getElementById('coopCode');coopEl.st=document.getElementById('coopSt');coopEl.list=document.getElementById('coopList');coopEl.leave=document.getElementById('coopLeave');
  try{coopEl.name.value=localStorage.getItem('dream-name')||'';}catch(e){}
  for(const el of[coopEl.name,coopEl.code])el.addEventListener('keydown',e=>e.stopPropagation());
  document.getElementById('coopHost').addEventListener('click',coopHost);document.getElementById('coopJoin').addEventListener('click',coopJoin);coopEl.leave.addEventListener('click',coopLeave);
  coopEl.tags=document.createElement('div');coopEl.tags.id='coopTags';document.body.appendChild(coopEl.tags);
  addEventListener('beforeunload',()=>{coopBroadcast({t:'bye',id:COOP.me});});
})();
