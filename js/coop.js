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

/* ---- mise en relation ----
   Pas de serveur à nous : un lobby occupe l'une des 16 « places » connues du serveur de mise en relation.
   Pour lister les lobbies, on frappe à chaque place ; l'hôte qui s'y trouve répond avec la fiche de son lobby. */
const COOP_PRE='dreamit-k45-',COOP_SLOTS=16,COOP_MAX=4;
const COOP_BLOCKED='Impossible de joindre le serveur de mise en relation. Le coop ne marche pas dans l\'aperçu Claude : ouvre la version GitHub Pages du jeu. Ailleurs, vérifie ta connexion ou ton bloqueur de pubs.';
const slotId=k=>COOP_PRE+'lobby-'+String(k).padStart(2,'0');
function coopHash(t){let h1=0xdeadbeef,h2=0x41c6ce57;t=t+'|dream-it';for(let i=0;i<t.length;i++){const c=t.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (h2>>>0).toString(36)+(h1>>>0).toString(36);}
function coopSignal(id,on){ /* on : {open, taken, msg} */
  let ws;try{ws=new WebSocket(COOP_SIG+'&id='+encodeURIComponent(id)+'&token='+coopRand(10,'abcdefghijklmnopqrstuvwxyz0123456789')+'&version=1.5.4');}
  catch(e){coopStatus(COOP_BLOCKED);return null;}
  let opened=false,gone=false;ws.id=id;
  ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data);}catch(e){return;}
    if(m.type==='OPEN'){opened=true;on.open&&on.open(ws);return;}
    if(m.type==='ID-TAKEN'){gone=true;try{ws.close();}catch(e){}on.taken&&on.taken();return;}
    if(m.type==='ERROR'){coopStatus('Le serveur de mise en relation refuse : '+((m.payload&&m.payload.msg)||'erreur inconnue'));return;}
    on.msg&&on.msg(m,ws);};
  ws.onerror=()=>{if(!opened&&!gone)coopStatus(COOP_BLOCKED);};
  ws.onclose=()=>{clearInterval(ws.hb);if(gone)return;if(COOP.ws===ws){COOP.ws=null;if(COOP.on&&!COOP.peers.size)coopStatus(opened?'Connexion au serveur perdue. Recrée ou rejoins un lobby.':COOP_BLOCKED);}
    if(COOP.bws===ws)COOP.bws=null;};
  ws.hb=setInterval(()=>{if(ws.readyState===1)ws.send(JSON.stringify({type:'HEARTBEAT'}));},5000);
  return ws;
}
function wsSend(ws,type,dst,payload){if(ws&&ws.readyState===1)ws.send(JSON.stringify({type,dst,payload}));}
function coopSend(type,dst,payload){wsSend(COOP.ws,type,dst,payload);}
/* les messages de mise en relation sont traités un par un, dans l'ordre d'arrivée */
let coopChain=Promise.resolve();
function coopQueue(m){coopChain=coopChain.then(()=>coopOnSignal(m)).catch(e=>console.warn('coop',e));}
/* on attend d'avoir rassemblé les adresses possibles avant d'envoyer la description : un seul message, rien ne se perd */
function coopGather(pc){return new Promise(res=>{if(pc.iceGatheringState==='complete')return res();const t=setTimeout(res,2000);
  pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete'){clearTimeout(t);res();}});});}
function coopPC(peer){
  const old=COOP.peers.get(peer);if(old)try{old.pc.close();}catch(e){}
  const pc=new RTCPeerConnection(COOP_ICE),P={id:peer,pc,dc:null,name:'?',pend:[]};COOP.peers.set(peer,P);
  pc.onicecandidate=e=>{if(e.candidate&&P.sent)coopSend('CANDIDATE',peer,{candidate:e.candidate,type:'data',connectionId:'dream'});};
  pc.onconnectionstatechange=()=>{const st=pc.connectionState;if(COOP.peers.get(peer)!==P)return;
    if(st==='failed'){coopStatus('La connexion directe a échoué : un des réseaux (4G, Wi-Fi d\'école ou d\'entreprise) bloque le jeu à plusieurs. Essayez un autre réseau, ou un partage de connexion.');coopDrop(peer,true);}
    else if(st==='closed')coopDrop(peer);};
  pc.ondatachannel=e=>coopWire(P,e.channel);
  return P;
}
function coopWire(P,dc){P.dc=dc;dc.onopen=()=>{if(COOP.host)coopStatus('Un rêveur vient d\'entrer dans le lobby.');else{COOP.joining=null;coopStatus('Tu es dans le lobby. '+(COOP.go?'La partie a commencé : clique sur « Entrer dans la partie ».':'L\'hôte lancera la partie.'));}
    coopUI();if(COOP.host)coopSync(true);};
  dc.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch(x){return;}coopMsg(P,m);};dc.onclose=()=>{if(COOP.peers.get(P.id)===P)coopDrop(P.id);};}
async function coopFlush(P){P.ready=true;for(const c of P.pend.splice(0))try{await P.pc.addIceCandidate(c);}catch(e){}}
function coopOpen(){let n=0;for(const P of COOP.peers.values())if(P.dc&&P.dc.readyState==='open')n++;return n;}
async function coopOnSignal(m){
  const src=m.src,p=m.payload||{};if(!src)return;
  if(m.type==='OFFER'&&COOP.host){if(!COOP.peers.has(src)&&COOP.peers.size>=COOP_MAX-1)return;const P=coopPC(src);
    await P.pc.setRemoteDescription(p.sdp);await coopFlush(P);const a=await P.pc.createAnswer();await P.pc.setLocalDescription(a);await coopGather(P.pc);
    P.sent=true;coopSend('ANSWER',src,{sdp:P.pc.localDescription,type:'data',connectionId:'dream'});coopStatus('Un rêveur se connecte au lobby…');}
  else if(m.type==='ANSWER'){const P=COOP.peers.get(src);if(P&&!P.ready){await P.pc.setRemoteDescription(p.sdp);await coopFlush(P);}}
  else if(m.type==='CANDIDATE'){const P=COOP.peers.get(src);if(!P||!p.candidate)return;if(P.ready){try{await P.pc.addIceCandidate(p.candidate);}catch(e){}}else P.pend.push(p.candidate);}
}
function coopDrop(id,keep){const P=COOP.peers.get(id);if(!P)return;try{P.pc.close();}catch(e){}COOP.peers.delete(id);COOP.states.delete(id);
  if(!COOP.host&&COOP.on&&!keep&&P.dc&&P.dc.readyState!=='connecting'){coopLeave(true);coopStatus('L\'hôte a fermé le lobby.');}
  coopUI();}

/* ---- la fiche du lobby, telle que les autres la voient ---- */
function coopInfo(){return{name:COOP.lobby,host:COOP.name,n:1+coopOpen(),max:COOP_MAX,lock:!!COOP.pw,place:WORLDS[level].name,ch:chOf(level)+1,go:started?1:0,mode};}
/* l'hôte, sur sa place : il répond aux curieux, il trie ceux qui frappent */
function coopHostMsg(m){const p=m.payload||{};
  if(m.type==='OFFER'&&p.probe){coopSend('ANSWER',m.src,{lobby:coopInfo()});return;}
  if(m.type==='OFFER'&&p.sdp&&!COOP.peers.has(m.src)){
    if(COOP.pw&&p.pw!==COOP.pw){coopSend('ANSWER',m.src,{deny:'pw'});return;}
    if(1+COOP.peers.size>=COOP_MAX){coopSend('ANSWER',m.src,{deny:'full'});return;}}
  if(m.type==='OFFER'||m.type==='CANDIDATE')coopQueue(m);
}

/* ---- créer un lobby ---- */
function coopName(){const n=(coopEl.name&&coopEl.name.value.trim())||'Rêveur';try{localStorage.setItem('dream-name',n);}catch(e){}return n.slice(0,16);}
function coopCreate(){
  coopLeave();COOP.name=coopName();
  const nm=(coopEl.lname.value.trim()||('Partie de '+COOP.name)).slice(0,28),pw=coopEl.priv&&coopEl.pwI.value;
  if(coopEl.priv&&!pw){coopStatus('Choisis un mot de passe, ou repasse le lobby en public.');return;}
  COOP.lobby=nm;COOP.pw=coopEl.priv?coopHash(pw):'';COOP.on=true;COOP.host=true;COOP.go=false;
  const order=[...Array(COOP_SLOTS).keys()].sort(()=>Math.random()-0.5);let k=0;
  coopStatus('Ouverture du lobby…');coopUI();
  const tryNext=()=>{if(!COOP.on||!COOP.host)return;if(k>=order.length){coopLeave(true);coopStatus('Tous les lobbies sont pleins pour l\'instant. Réessaie dans un moment.');return;}
    const id=slotId(order[k++]);COOP.me=id;
    COOP.ws=coopSignal(id,{open:()=>{coopStatus('Lobby ouvert. Les autres le voient dans la liste ; lance la partie quand tout le monde est là.');coopUI();},taken:tryNext,msg:coopHostMsg});};
  tryNext();
}

/* ---- la liste des lobbies ---- */
function coopBrowse(){ /* une connexion d'observateur, qui sert ensuite à rejoindre */
  if(COOP.on)return;
  if(COOP.bws&&COOP.bws.readyState<=1){coopProbe();return;}
  COOP.me=COOP_PRE+'p-'+coopRand(10,'abcdefghijklmnopqrstuvwxyz0123456789');COOP.lobbies=new Map();COOP.scan=true;coopUI();
  COOP.bws=coopSignal(COOP.me,{open:()=>coopProbe(),taken:()=>{COOP.bws=null;coopBrowse();},msg:coopBrowseMsg});
}
function coopProbe(){if(!COOP.bws||COOP.bws.readyState!==1)return;COOP.found=new Map();COOP.scan=true;coopUI();
  for(let k=0;k<COOP_SLOTS;k++)wsSend(COOP.bws,'OFFER',slotId(k),{probe:1});
  clearTimeout(COOP.scanT);COOP.scanT=setTimeout(()=>{COOP.lobbies=COOP.found;COOP.scan=false;coopUI();},2600);}
function coopBrowseMsg(m){const p=m.payload||{};
  if(m.type==='ANSWER'&&p.lobby){p.lobby.id=m.src;(COOP.found||(COOP.found=new Map())).set(m.src,p.lobby);COOP.lobbies.set(m.src,p.lobby);if(!COOP.on)coopUI();return;}
  if(m.type==='ANSWER'&&p.deny&&COOP.joining===m.src){const d=p.deny;coopLeave(true);coopStatus(d==='pw'?'Mot de passe incorrect.':'Ce lobby est complet.');coopProbe();return;}
  if(m.type==='EXPIRE'){if(COOP.joining&&m.src===COOP.joining){coopLeave(true);coopStatus('Ce lobby vient de fermer.');coopProbe();}return;}
  if(COOP.on&&(m.type==='ANSWER'||m.type==='CANDIDATE'))coopQueue(m);
}

/* ---- rejoindre ---- */
function coopJoin(id,pw){
  const L=COOP.lobbies&&COOP.lobbies.get(id);if(!L||!COOP.bws||COOP.bws.readyState!==1){coopStatus('Ce lobby n\'est plus là. Actualise la liste.');return;}
  if(L.lock&&!pw){coopStatus('Ce lobby demande un mot de passe.');return;}
  for(const pid of[...COOP.peers.keys()])coopDrop(pid,true);
  COOP.name=coopName();COOP.on=true;COOP.host=false;COOP.go=!!L.go;COOP.lobby=L.name;COOP.pw=L.lock?'x':'';COOP.joining=id;COOP.ws=COOP.bws;
  coopStatus('Connexion au lobby « '+L.name+' »…');coopUI();const ph=L.lock?coopHash(pw):'';
  const tryOffer=async n=>{if(!COOP.on||COOP.host||COOP.joining!==id)return;const P=coopPC(id);coopWire(P,P.pc.createDataChannel('dream'));
    const o=await P.pc.createOffer();await P.pc.setLocalDescription(o);await coopGather(P.pc);P.sent=true;
    coopSend('OFFER',id,{sdp:P.pc.localDescription,type:'data',connectionId:'dream',pw:ph});
    const chk=()=>{if(!COOP.on||COOP.host||COOP.joining!==id||(P.dc&&P.dc.readyState==='open'))return;
      if(P.ready&&!P.waited){P.waited=1;setTimeout(chk,12000);return;}
      if(n<2){coopStatus('Connexion au lobby… (nouvel essai)');tryOffer(n+1);}
      else{coopLeave(true);coopStatus('Le lobby ne répond pas. Un des réseaux bloque sans doute la connexion directe : essayez un autre réseau.');}};setTimeout(chk,12000);};
  tryOffer(0);
}
function coopLeave(keepMsg){
  if(COOP.on){try{coopBroadcast({t:'bye',id:COOP.me});}catch(e){}}
  for(const id of[...COOP.peers.keys()]){const P=COOP.peers.get(id);try{P.pc.close();}catch(e){}COOP.peers.delete(id);}COOP.states.clear();
  if(COOP.host&&COOP.ws)try{COOP.ws.close();}catch(e){}
  COOP.ws=null;COOP.on=false;COOP.host=false;COOP.joining=null;COOP.go=false;COOP.down=false;COOP.pw='';document.body.classList.remove('downed');
  if(!keepMsg)coopStatus('');coopUI();
}
function coopList(){coopUI();}

/* ---- messages ---- */
function coopBroadcast(m,except){const s=JSON.stringify(m);for(const P of COOP.peers.values())if(P.id!==except&&P.dc&&P.dc.readyState==='open')try{P.dc.send(s);}catch(e){}}
function coopMsg(P,m){
  if(m.t==='st'){m.at=performance.now();COOP.states.set(m.id,m);P.name=m.n;if(COOP.host)coopBroadcast(m,P.id);coopUI();}
  else if(m.t==='prog'){if(m.ep===COOP.epoch)coopMerge(m);if(COOP.host)coopSync(true);}
  else if(m.t==='sync'&&!COOP.host){coopApply(m);if(m.go&&!COOP.go){COOP.go=true;if(!started){coopStatus('L\'hôte a lancé la partie ! Clique sur « Entrer dans la partie ».');coopUI();try{chime();}catch(e){}}}}
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
  coopBroadcast(Object.assign({t:'sync',go:started?1:0,lv:level,ep:COOP.epoch,mode,end:wakeT>0?wakeKind:-1,c3n:c3next,c3:[...C3]},coopSets()));}
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
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let coopUIk='';
function coopUI(){
  const host=document.getElementById('coop');if(!host||!coopEl.view)return;
  coopEl.leave.hidden=!COOP.on;coopEl.make.hidden=COOP.on;coopEl.browse.hidden=COOP.on;coopEl.lobby.hidden=!COOP.on;
  if(COOP.on){ /* dans un lobby */
    const me=COOP.name+(COOP.host?' (toi, hôte)':' (toi)'),others=[...COOP.states.values()].map(s=>esc(s.n)),n=COOP.host?1+coopOpen():Math.max(1+others.length,COOP.joining?1:2);
    const k='L'+COOP.lobby+n+others.join()+COOP.go+COOP.host+(COOP.joining||'')+started;if(k===coopUIk)return;coopUIk=k;
    coopEl.lobby.innerHTML='<div class="lobbyCard"><b>'+esc(COOP.lobby)+'</b><span>'+(COOP.pw?'🔒 Avec mot de passe':'Public')+' · '+n+' / '+COOP_MAX+' rêveurs</span>'+
      '<ul><li>'+esc(me)+'</li>'+others.map(o=>'<li>'+o+'</li>').join('')+'</ul></div>'+
      (COOP.host?(started?'':'<button type="button" id="coopGo" class="go">Lancer la partie</button>'):
        (COOP.joining?'':(COOP.go&&!started?'<button type="button" id="coopGo" class="go pulse">Entrer dans la partie</button>':(started?'':'<p class="hint">En attente de l\'hôte…</p>'))));
    const g=document.getElementById('coopGo');if(g)g.addEventListener('click',()=>{if(typeof resume==='function')resume();});
    coopEl.leave.textContent=COOP.host?'Fermer le lobby':'Quitter le lobby';
    return;}
  coopUIk='';
  const L=COOP.lobbies?[...COOP.lobbies.values()]:[];
  let h='';
  if(!COOP.bws)h='<p class="hint">Ouverture de la liste…</p>';
  else if(!L.length)h='<p class="hint">'+(COOP.scan?'Recherche des lobbies…':'Aucun lobby ouvert pour l\'instant. Crée le tien, ou actualise dans un moment.')+'</p>';
  else h=L.sort((a,b)=>a.name.localeCompare(b.name)).map(l=>'<div class="lob" data-id="'+esc(l.id)+'"><div><b>'+(l.lock?'🔒 ':'')+esc(l.name)+'</b><span>Hôte : '+esc(l.host)+' · '+l.n+' / '+l.max+
     ' · '+(l.go?'en jeu, chapitre '+l.ch+' · '+esc(l.place):'dans le lobby')+'</span></div>'+
     (l.n>=l.max?'<button type="button" disabled>Complet</button>':(l.lock?'<input type="password" placeholder="Mot de passe" aria-label="Mot de passe du lobby">':'')+'<button type="button" class="jn">Rejoindre</button>')+'</div>').join('');
  coopEl.list.innerHTML=h;
  for(const row of coopEl.list.querySelectorAll('.lob')){const id=row.dataset.id,inp=row.querySelector('input'),b=row.querySelector('.jn');if(!b)continue;
    if(inp){inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')coopJoin(id,inp.value);});}
    b.addEventListener('click',()=>coopJoin(id,inp?inp.value:''));}
}
(function(){
  const host=document.getElementById('coop');if(!host)return;
  host.innerHTML='<label class="crow">Ton pseudo <input id="coopName" maxlength="16" placeholder="Rêveur" aria-label="Pseudo"></label>'+
    '<div id="coopLobby" hidden></div>'+
    '<div id="coopMake"><h3>Créer un lobby</h3><div class="crow"><input id="coopLName" maxlength="28" placeholder="Nom du lobby" aria-label="Nom du lobby">'+
      '<span class="spaces"><button type="button" id="coopPub" aria-pressed="true">Public</button><button type="button" id="coopPriv" aria-pressed="false">Mot de passe</button></span>'+
      '<input id="coopPw" type="password" maxlength="24" placeholder="Mot de passe" aria-label="Mot de passe" hidden>'+
      '<button type="button" id="coopCreate">Créer le lobby</button></div></div>'+
    '<div id="coopBrowse"><h3>Lobbies ouverts <button type="button" id="coopRef" class="small">Actualiser</button></h3><div id="coopList"></div></div>'+
    '<p id="coopSt" class="coopst" role="status"></p><button id="coopLeave" type="button" hidden>Quitter le lobby</button>';
  const $=id=>document.getElementById(id);
  Object.assign(coopEl,{view:host,name:$('coopName'),lname:$('coopLName'),pwI:$('coopPw'),st:$('coopSt'),list:$('coopList'),leave:$('coopLeave'),make:$('coopMake'),browse:$('coopBrowse'),lobby:$('coopLobby'),priv:false});
  try{coopEl.name.value=localStorage.getItem('dream-name')||'';}catch(e){}
  for(const el of host.querySelectorAll('input'))el.addEventListener('keydown',e=>e.stopPropagation());
  const vis=p=>{coopEl.priv=p;$('coopPub').setAttribute('aria-pressed',p?'false':'true');$('coopPriv').setAttribute('aria-pressed',p?'true':'false');coopEl.pwI.hidden=!p;if(p)coopEl.pwI.focus();};
  $('coopPub').addEventListener('click',()=>vis(false));$('coopPriv').addEventListener('click',()=>vis(true));
  $('coopCreate').addEventListener('click',()=>coopCreate());coopEl.lname.addEventListener('keydown',e=>{if(e.key==='Enter')coopCreate();});
  $('coopRef').addEventListener('click',()=>coopBrowse());coopEl.leave.addEventListener('click',()=>{coopLeave();coopBrowse();});
  coopEl.tags=document.createElement('div');coopEl.tags.id='coopTags';document.body.appendChild(coopEl.tags);
  addEventListener('beforeunload',()=>{coopBroadcast({t:'bye',id:COOP.me});});
  /* la liste s'ouvre et se met à jour seule tant que la page Coop est affichée */
  const pg=document.querySelector('[data-pg="coop"]');
  setInterval(()=>{if(pg&&pg.classList.contains('on')&&!document.getElementById('menu').classList.contains('off')){if(!COOP.on){if(!COOP.bws)coopBrowse();else if(!COOP.scan)coopProbe();}else coopUI();}},6000);
  if(pg)new MutationObserver(()=>{if(pg.classList.contains('on')&&!COOP.on)coopBrowse();coopUI();}).observe(pg,{attributes:true,attributeFilter:['class']});
  coopUI();
})();
