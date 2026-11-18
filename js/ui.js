'use strict';
/* ---------- menu : pages, paramètres, statistiques, guide ---------- */
(function(){
const $=id=>document.getElementById(id);
const panel=document.querySelector('#menu .panel');
let page=null;

/* ---- navigation entre les pages ---- */
function openPage(p){
  page=p;
  for(const el of document.querySelectorAll('#menu .pg'))el.classList.toggle('on',el.dataset.pg===p);
  for(const b of document.querySelectorAll('#menu .nav [data-p]'))b.setAttribute('aria-current',b.dataset.p===p?'true':'false');
  panel.classList.toggle('has',!!p);
  if(p==='stats')statsUI();
  if(p==='settings')settingsUI();
}
for(const b of document.querySelectorAll('#menu .nav [data-p]'))
  b.addEventListener('click',()=>{const p=b.dataset.p;openPage(page===p&&menu.classList.contains('pause')?null:p);});
const baseShow=showMenu;
showMenu=function(m){baseShow(m);
  if(m==='title')openPage(page&&page!=='none'?page:'chapters');else openPage(null);};
openPage('chapters');

/* ---- noms des touches, selon le clavier du joueur ---- */
let layout=null;
try{if(navigator.keyboard&&navigator.keyboard.getLayoutMap)navigator.keyboard.getLayoutMap().then(m=>{layout=m;bindsUI();guideKeys();}).catch(()=>{});}catch(e){}
const NAMES={Space:'Espace',ShiftLeft:'Maj gauche',ShiftRight:'Maj droite',ControlLeft:'Ctrl gauche',ControlRight:'Ctrl droite',AltLeft:'Alt',AltRight:'Alt Gr',
  Tab:'Tab',Enter:'Entrée',Backspace:'Retour',CapsLock:'Verr. maj',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',MetaLeft:'Méta',MetaRight:'Méta'};
function keyName(code){
  if(NAMES[code])return NAMES[code];
  if(layout&&layout.get(code))return layout.get(code).toUpperCase();
  if(/^Key[A-Z]$/.test(code))return code.slice(3);
  if(/^Digit\d$/.test(code))return code.slice(5);
  if(/^Numpad/.test(code))return 'Pavé '+code.slice(6);
  return code;
}
const bindOf=id=>SET.binds[id]||ACTIONS.find(a=>a[0]===id)[2];
window.keyOf=id=>keyName(bindOf(id));

/* ---- paramètres ---- */
const sfxEl=$('sfxv'),sensEl=$('sens'),invEl=$('inv');
function applySfx(){if(typeof ac!=='undefined'&&ac&&master&&started&&!paused)master.gain.setTargetAtTime(0.45*SET.sfx,ac.currentTime,0.05);}
function settingsUI(){
  sfxEl.value=Math.round(SET.sfx*100);$('sfxo').textContent=Math.round(SET.sfx*100)+' %';
  sensEl.value=Math.round(SET.sens*100);$('senso').textContent='× '+SET.sens.toFixed(2);
  invEl.checked=!!SET.inv;fxsUI();bindsUI();
}
sfxEl.addEventListener('input',()=>{SET.sfx=sfxEl.value/100;setSave();applySfx();settingsUI();
  if(typeof ac!=='undefined'&&ac&&typeof ping==='function'&&!started){/* petit aperçu */}});
sensEl.addEventListener('input',()=>{SET.sens=sensEl.value/100;setSave();settingsUI();});
invEl.addEventListener('change',()=>{SET.inv=invEl.checked;setSave();});
function fxsUI(){const el=$('fxs');el.textContent='';
  FXS.forEach((f,k)=>{const b=document.createElement('button');b.type='button';b.textContent=f[1];b.setAttribute('aria-pressed',k===fxI?'true':'false');
    b.addEventListener('click',()=>{fxI=k;try{localStorage.setItem('ether-fx',f[0]);}catch(e){}fxUI();fxsUI();});el.appendChild(b);});}

let waiting=null;
function bindsUI(){const el=$('binds');if(!el)return;el.textContent='';
  for(const [id,label] of ACTIONS){const l=document.createElement('span');l.textContent=label;
    const b=document.createElement('button');b.type='button';b.className=waiting===id?'wait':'';
    b.textContent=waiting===id?'Appuie sur une touche…':keyName(bindOf(id));b.setAttribute('aria-label',label+' : '+keyName(bindOf(id)));
    b.addEventListener('click',()=>{waiting=waiting===id?null:id;bindsUI();});el.append(l,b);}
}
window.uiKeyCapture=function(ev){
  if(!waiting)return false;
  ev.preventDefault();ev.stopPropagation();
  if(ev.code!=='Escape'&&!/^Arrow/.test(ev.code)){
    const old=bindOf(waiting);
    for(const [id] of ACTIONS)if(id!==waiting&&bindOf(id)===ev.code)SET.binds[id]=old; /* échange avec l'action qui l'avait */
    SET.binds[waiting]=ev.code;
    for(const [id,,def] of ACTIONS)if(SET.binds[id]===def)delete SET.binds[id];
    setSave();
  }
  waiting=null;bindsUI();guideKeys();return true;
};
$('bdef').addEventListener('click',()=>{SET.binds={};setSave();waiting=null;bindsUI();guideKeys();});

/* ---- tout recommencer (deux clics) ---- */
let resetArm=0;const rb=$('reset');
rb.addEventListener('click',()=>{
  if(performance.now()-resetArm>5000){resetArm=performance.now();rb.textContent='Confirmer : tout effacer';$('reseto').textContent='Clique encore pour confirmer.';
    setTimeout(()=>{if(performance.now()-resetArm>=4900){rb.textContent='Tout recommencer';$('reseto').textContent='';}},5000);return;}
  try{for(const k of ['ether-level','ether-max','ether-max2','dream-max3','dream-c3','dream-c3next','ether-ch1','dream-stats'])localStorage.removeItem(k);}catch(e){}
  STATS.time=-1e9; /* empêche une dernière sauvegarde */
  location.reload();
});

/* ---- statistiques ---- */
let last=null,saveT=0,prevG=true;
function snap(){return {W,shards,summits,talks:ex.talks,pearls:ex.pearls,notes:ex.notes,acts:ex.phones,souv:ex.souv,courses:ex.courses,cars:ex.car,stations:ex.stations,passage,x:pos.x,z:pos.z};}
window.statTick=function(dt){
  const s=snap();
  if(started&&!paused&&STATS.time>=0){
    STATS.time+=dt;
    if(last&&last.W===s.W){
      const d=Math.hypot(s.x-last.x,s.z-last.z);if(d<5)STATS.dist+=d;
      for(const k of ['shards','summits','talks','pearls','notes','acts','souv','courses','cars','stations'])if(s[k]>last[k])STATS[k]+=s[k]-last[k];
      if(s.passage&&!last.passage)STATS.objectives++;
      if(prevG&&!grounded&&vy>1.5&&!swim)STATS.jumps++;
    }
    saveT+=dt;if(saveT>5){saveT=0;statSave();}
  }
  prevG=grounded;last=s;
  if(page==='stats'&&menu&&!menu.classList.contains('off')&&Math.floor(performance.now()/1000)!==statsSec)statsUI();
};
window.statLevel=function(w){if(mode==='obs')return;if(!STATS.levels.includes(w)){STATS.levels.push(w);statSave();}};
window.statEnd=function(ch){if(!STATS.chapters.includes(ch)){STATS.chapters.push(ch);statSave();}};
addEventListener('visibilitychange',()=>{if(document.hidden&&STATS.time>=0)statSave();});
addEventListener('pagehide',()=>{if(STATS.time>=0)statSave();});
let statsSec=-1;
function dur(t){t=Math.floor(t);const h=Math.floor(t/3600),m=Math.floor(t/60)%60,s=t%60;return h?h+' h '+String(m).padStart(2,'0'):m?m+' min '+String(s).padStart(2,'0'):s+' s';}
function statsUI(){statsSec=Math.floor(performance.now()/1000);const el=$('statsT');if(!el)return;
  const nb=n=>Math.round(n).toLocaleString('fr-FR');
  const rows=[[dur(Math.max(0,STATS.time)),'Temps joué'],[(STATS.dist/1000).toLocaleString('fr-FR',{maximumFractionDigits:2})+' km','Distance marchée'],
    [STATS.levels.length+' / '+WORLDS.length,'Lieux terminés'],[STATS.chapters.length+' / '+CHAPS.length,'Chapitres terminés'],
    [nb(STATS.objectives),'Passages ouverts'],[nb(STATS.shards),'Éclats'],[nb(STATS.summits),'Sommets'],[nb(STATS.courses),'Courses'],
    [nb(STATS.stations),'Stations'],[nb(STATS.talks),'Rencontres'],[nb(STATS.pearls),'Perles'],[nb(STATS.notes),'Papiers lus'],
    [nb(STATS.acts),'Appels et gestes'],[nb(STATS.cars),'Voitures retrouvées'],[nb(STATS.souv)+' / 6','Souvenirs'],[nb(STATS.jumps),'Sauts'],[nb(STATS.deaths),'Réveils en sursaut']];
  el.textContent='';for(const [v,l] of rows){const d=document.createElement('div');d.className='stat';const b=document.createElement('b');b.textContent=v;const s=document.createElement('span');s.textContent=l;d.append(b,s);el.appendChild(d);}
}

/* ---- guide du rêveur : sans rien dévoiler de l'histoire ---- */
const K=id=>'<kbd data-k="'+id+'"></kbd>';
const card=(img,title,txt)=>'<div class="gcard"><img src="img/guide/'+img+'.jpg" alt="" loading="lazy"><div><h3>'+title+'</h3><p>'+txt+'</p></div></div>';
const GUIDE=[
 ['start','Premiers pas',
  '<ol><li>Clique sur <b>Entrer</b>. La souris sert à regarder ; '+K('fwd')+K('left')+K('back')+K('right')+' (ou les flèches) à marcher.</li>'+
  '<li>En haut de l\'écran, une ligne te dit <b>quoi faire ici</b>, avec des compteurs : par exemple « Éclats 2/6 ».</li>'+
  '<li>Au bout de cette ligne, une flèche et une distance (« → Sommet · 48 m ») t\'indiquent l\'objectif le plus proche. Suis-la quand tu es perdu.</li>'+
  '<li>Quand tout est fait, la ligne devient <b>« Passage ouvert »</b> suivie d\'une consigne : elle te dit comment quitter ce lieu.</li>'+
  '<li>Quitter un lieu ouvre le suivant. Ta progression est gardée automatiquement.</li></ol>'+
  card('hud','Ce qu\'il faut lire','En haut : ce qu\'il reste à faire et où aller. En bas : le nom du lieu et tes éclats. Si tu ne sais plus quoi faire, regarde toujours en haut en premier.')+
  '<p class="hint">Rien ne presse : il n\'y a pas de chronomètre, sauf pendant les courses. '+K('use')+' sert à interagir quand une indication apparaît à l\'écran.</p>'],
 ['goals','Les objectifs',
  '<p class="hint">Chaque lieu en demande seulement quelques-uns. Voici à quoi ils ressemblent.</p>'+
  card('shard','Éclats','De petits cristaux qui brillent et tournent sur eux-mêmes. Il suffit de passer dessus. Certains sont en hauteur : saute ('+K('jump')+') ou grimpe pour les atteindre.')+
  card('summit','Sommets','Les grandes structures se grimpent, marche après marche. Atteins le point le plus haut et reste debout dessus : « Sommet atteint » s\'affiche.')+
  card('course','Courses','Une dalle verte au sol lance une course chronométrée. Ramasse tous les repères lumineux qui apparaissent avant la fin du temps (affiché en haut). Raté ? Reviens simplement sur la dalle. Cours avec '+K('run')+'.')+
  card('station','Stations','Monte dans une rame quand elle s\'arrête, descends à un autre quai. Chaque nouveau quai où tu poses le pied compte.')+
  card('talk','Rencontres','Les présences qui errent ne te veulent pas forcément du mal. Approche-toi et appuie sur '+K('use')+' (ou reste quelques secondes près d\'elles) pour qu\'elles te parlent.')+
  card('pearl','Perles','Elles reposent au fond de l\'eau. Plonge avec '+K('run')+', remonte avec '+K('jump')+'. Surveille ton air et reviens respirer à la surface.')+
  card('note','Papiers','Dossiers, cartes, tickets, bouteilles… selon le lieu. Ils flottent doucement et brillent un peu. Passe dessus pour les lire.')+
  card('act','Gestes','Téléphones qui sonnent, projecteurs, bornes, pistes, cartons : quand une indication avec '+K('use')+' apparaît, appuie. Ce qui attend un geste se signale par une lueur ou un bruit.')+
  card('car','Voiture','Ta voiture est garée quelque part. Appuie sur '+K('use')+' : elle répond par un bip et ses phares, et la flèche t\'y conduit.')+
  card('souv','Souvenir','Un seul par lieu, dans un faisceau de lumière qu\'on voit de loin. Approche-toi pour le prendre. C\'est lui que tu es venu chercher.')],
 ['exit','Sortir d\'un lieu',
  card('exit','Passage ouvert','Une fois les objectifs remplis, une cloche sonne et la consigne de sortie s\'affiche en haut. Chaque lieu a sa façon de te laisser partir : lis-la, et la flèche t\'aide à trouver où aller.')+
  '<ul><li>La consigne reste affichée tant que tu n\'es pas sorti.</li><li>Tu peux continuer d\'explorer avant de partir : rien ne disparaît.</li>'+
  '<li>Si tu es coincé, <b>Recommencer ce lieu</b> (dans la pause) te ramène au départ du lieu.</li></ul>'],
 ['end','Finir le jeu',
  '<ol><li>Le jeu compte <b>trois chapitres</b>. Chacun est une suite de lieux à traverser dans l\'ordre.</li>'+
  '<li>À la fin d\'un chapitre, laisse le texte défiler : le chapitre suivant s\'ouvre tout seul.</li>'+
  '<li>Au troisième chapitre, tu reviens toujours au même endroit entre deux lieux. Une porte allumée t\'indique où aller ensuite.</li>'+
  '<li>Le menu <b>Chapitres et modes</b> te laisse revenir à n\'importe quel lieu déjà ouvert.</li></ol>'+
  '<p class="hint">C\'est tout ce qu\'il faut savoir. Le reste, c\'est à toi de le découvrir.</p>'],
 ['modes','Modes et dangers',
  '<ul><li><b>Paisible</b> : les objectifs, sans aucun danger. Idéal pour une première fois.</li>'+
  '<li><b>Classique</b> : les mêmes objectifs, mais tu n\'es pas seul. Garde un œil derrière toi, surtout une fois le passage ouvert : ne traîne pas.</li>'+
  '<li><b>Observation</b> : aucun objectif, tous les lieux ouverts, pour simplement se promener.</li></ul>'+
  '<p class="hint">En Classique, si quelque chose t\'attrape, tu te réveilles en sursaut et le lieu recommence. Rien n\'est perdu ailleurs.</p>'],
 ['coop','Jouer à plusieurs',
  '<ol><li>Ouvre <b>Coop</b>, choisis un nom.</li><li>Un joueur clique sur <b>Créer</b> et donne le code aux autres.</li>'+
  '<li>Les autres tapent le code et cliquent sur <b>Rejoindre</b>.</li><li>Tout ce qu\'un joueur trouve compte pour l\'équipe. On sort ensemble : la sortie attend que tout le monde soit là.</li>'+
  '<li>Un joueur attrapé en Classique peut être relevé : reste près de lui quelques secondes.</li></ol>'],
 ['keys','Commandes',
  '<div id="gkeys"></div><p class="hint">Les touches se changent dans <b>Paramètres</b>. Échap met en pause. Sur écran tactile : glisse à gauche pour marcher, à droite pour regarder, touche brièvement la moitié droite pour sauter.</p>']
];
let gsec='start';
function guideUI(){const el=$('guide');
  el.innerHTML='<h2>Guide du rêveur</h2><div class="gnav" role="tablist"></div>'+GUIDE.map(g=>'<div class="gsec" data-g="'+g[0]+'"><h2>'+g[1]+'</h2>'+g[2]+'</div>').join('');
  const nav=el.querySelector('.gnav');
  for(const [id,t] of GUIDE){const b=document.createElement('button');b.type='button';b.textContent=t;b.dataset.g=id;
    b.addEventListener('click',()=>{gsec=id;guideSec();});nav.appendChild(b);}
  for(const img of el.querySelectorAll('img'))img.addEventListener('error',()=>{img.style.display='none';});
  guideSec();guideKeys();
}
function guideSec(){for(const s of document.querySelectorAll('#guide .gsec'))s.classList.toggle('on',s.dataset.g===gsec);
  for(const b of document.querySelectorAll('#guide .gnav button'))b.setAttribute('aria-pressed',b.dataset.g===gsec?'true':'false');
  const p=document.querySelector('#menu .panel');if(p)p.scrollTop=0;}
function guideKeys(){
  for(const k of document.querySelectorAll('#guide kbd[data-k]'))k.textContent=keyName(bindOf(k.dataset.k));
  const gk=$('gkeys');if(!gk)return;gk.innerHTML='';gk.id='gkeys';gk.style.cssText='display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:.9rem;margin-bottom:10px';
  const extra=[['Regarder','Souris'],['Marcher','Flèches aussi'],['Pause','Échap']];
  for(const [id,l] of ACTIONS){const a=document.createElement('kbd');a.textContent=keyName(bindOf(id));const b=document.createElement('span');b.textContent=l;gk.append(a,b);}
  for(const [l,k] of extra){const a=document.createElement('kbd');a.textContent=k;const b=document.createElement('span');b.textContent=l;gk.append(a,b);}
}
guideUI();
window.__ui={openPage,statsUI,guideSec:s=>{gsec=s;guideSec();}};
})();
