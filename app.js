const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let DB=null, currentRecord='batting';
const norm=s=>String(s??'').toLowerCase().trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>v===null||v===undefined||v===''?null:Number(v);
const seasonLabel=s=>s==='1'?'EGL 1.0':'EGL 2.0';
function playerStat(p,s,key){if(s==='1')return p.season1_stats?.[key]??null;if(s==='2')return p.season2_stats?.[key]??null;return null}
function statValue(p,s,kind){let a=p.season1_stats||{},b=p.season2_stats||{},c=p.career_totals||{};if(s==='1'){if(kind==='runs')return a.Runs_scored;if(kind==='wickets')return a.Wickets;if(kind==='matches')return a.Matches;if(kind==='fours')return a.Fours;if(kind==='sixes')return a.Sixes;}if(s==='2'){if(kind==='runs')return b.Runs;if(kind==='wickets')return b.Wickets;if(kind==='matches')return b.Matches;if(kind==='fours')return b.Fours;if(kind==='sixes')return b.Sixes;}if(kind==='runs')return c['All-Time Runs'];if(kind==='wickets')return c['All-Time Wickets'];if(kind==='matches')return c['All-Time Matches'];if(kind==='fours')return c['All-Time Fours'];if(kind==='sixes')return c['All-Time Sixes'];return null}
function photo(p){return p.photo&&fileExists(p.photo)?p.photo:null}function fileExists(path){return true}
function teamName(t){return t?.name||''}
function teamAsset(season,name){let key=norm(name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');let map={'s1':{'sab super kings':'team-s1-sab-super-kings.png','master blasters':'team-s1-master-blasters.png','the x factor':'team-s1-the-x-factor.png','cell zone fighters':'team-s1-cell-zone-fighters.png','pr dynamites':'team-s1-pr-dynamites.png','radiant warriors':'team-s1-radiant-warriors.png','strikers':'team-s1-strikers.png','supernovas':'team-s1-supernovas.png'},'s2':{'all in xi':'team-s2-all-in-xi.png','bounce titans':'team-s2-bounce-titans.png','cell zone fighters':'team-s2-cell-zone-fighters.png','gladiators':'team-s2-gladiators.png','iincrediblee':'team-s2-iincrediblee.png','incredible':'team-s2-iincrediblee.png','mangrove blasters':'team-s2-mangrove-blasters.png','master blasters':'team-s2-master-blasters.png','strikers':'team-s2-strikers.png'}};return 'assets/'+(map['s'+season]?.[norm(name)]||'')}
function matchTeamLabel(s,name){if(s==='1'&&norm(name)==='sab super kings')return 'SAB Super Kings';return name||'—'}
function standingsRows(s){return DB.standings[s].map((r,i)=>({rank:i+1,name:r['League Level']||r['Team Name'],played:r['Matches Played'],won:r.Won,lost:r.Lost,tied:r.Tied,noresult:r['No Result'],points:r.Points,nrr:r.NRR,for:r.For,against:r.against,group:r.Group}));}
function sponsorLogoPath(s){return s.logo||null}
function partnerFor(season){let x=DB.sponsors.find(x=>String(x.season)===String(season)&&(season==='1'?x.category==='Title':x.category==='Exclusive Partner'));return x}
function renderHome(){
 const p=partnerFor('2'), c=DB.champions['2'];
 $('#season-partner').textContent='LATEST SEASON · EGL 2.0';
 $('#season-date').textContent='';
 $('#season-date').hidden=true;
 $('#home-partner').innerHTML=p&&p.logo?`<img src="${esc(p.logo)}" alt="${esc(p.brand)}" onerror="this.replaceWith(document.createTextNode('${esc(p.brand)}'))">`:`<b>${esc(p?.brand||'EGL 2.0')}</b>`;
 const featured=[DB.sponsors.find(x=>x.season===1&&x.category==='Title'),DB.sponsors.find(x=>x.season===2&&x.category==='Exclusive Partner')].filter(Boolean);
 $('#home-season-partners').innerHTML=featured.map(x=>`<article class="home-partner-card"><small>${seasonLabel(String(x.season))} · ${esc(x.category)}</small>${x.logo?`<img src="${esc(x.logo)}" alt="${esc(x.brand)}">`:`<b>${esc(x.brand)}</b>`}<span>${esc(x.sponsor_name||'')}</span></article>`).join('');
 $('#home-champions').innerHTML=championCards('2',c);
}
function championCards(s,c){
  return [['Champions',c.champions],['Runners-up',c.runners_up]].map(([role,name])=>{
    const logo=teamAsset(s,name);
    return `<article class="champion-card"><div class="champion-mark"><img src="${esc(logo)}" alt="${esc(name)} logo" onerror="this.closest('.champion-mark').classList.add('no-logo');this.remove()"><span>${esc(name.split(/\s+/).map(x=>x[0]).slice(0,3).join(''))}</span></div><div><div class="tag">${seasonLabel(s)} · ${role}</div><h3>${esc(name)}</h3></div></article>`;
  }).join('');
}
function playerCard(p,s){
  const season=s==='all'?(p.season2_stats?'2':'1'):s;
  const team=season==='1'?p.season1_team:season==='2'?p.season2_team:[p.season2_team,p.season1_team].filter(Boolean).join(' · ');
  const matches=statValue(p,s,'matches'),runs=statValue(p,s,'runs'),w=statValue(p,s,'wickets'),im=photo(p);
  return `<article class="player-card" data-player="${esc(p.egl_player_id)}">
    <div class="player-photo">${im?`<img src="${esc(im)}" alt="${esc(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=avatar-fallback>${esc((p.name||'E').split(' ').map(x=>x[0]).slice(0,2).join(''))}</span>'">`:`<span class="avatar-fallback">${esc((p.name||'E').split(' ').map(x=>x[0]).slice(0,2).join(''))}</span>`}</div>
    <div class="player-info"><b>${esc(p.name)}</b><small>${esc(team||'EGL player')}</small><div class="player-mini"><span>${matches??'—'} M</span><span>${runs??'—'} R</span><span>${w??'—'} W</span></div></div></article>`;
}
function renderPlayers(){let s=$('#player-season').value,q=norm($('#player-search').value),role=$('#player-role').value;let arr=DB.players.filter(p=>{let st=s==='1'?p.season1_stats:s==='2'?p.season2_stats:(p.season1_stats||p.season2_stats);let team=s==='1'?p.season1_team:s==='2'?p.season2_team:(p.season2_team||p.season1_team);let text=norm([p.name,p.egl_player_id,team].join(' '));let r=norm(p.declared_role||p.season2_stats?.Role||p.season1_stats?.Role||'');let okRole=!role||r.includes(norm(role))||(role==='All-rounder'&&r.includes('all-rounder'))||(role==='Batter'&&r.includes('batter'))||(role==='Bowler'&&r.includes('bowler'))||(role==='Wicket Keeper'&&r.includes('keeper'));return !!st&&(!q||text.includes(q))&&okRole});$('#player-count').textContent=`${arr.length} players`;$('#player-grid').innerHTML=arr.map(p=>playerCard(p,s)).join('')||'<div class="empty">No players found.</div>';$$('.player-card').forEach(x=>x.onclick=()=>openPlayer(x.dataset.player,s));}
function openPlayer(id,s){
 const p=DB.players.find(x=>x.egl_player_id===id);if(!p)return;
 const stats=s==='1'?p.season1_stats:s==='2'?p.season2_stats:null,label=s==='all'?'Combined EGL career':seasonLabel(s);
 const matches=statValue(p,s,'matches'),runs=statValue(p,s,'runs'),w=statValue(p,s,'wickets'),f=statValue(p,s,'fours'),six=statValue(p,s,'sixes');
 const teams=[p.season1_team&&`EGL 1.0: ${p.season1_team}`,p.season2_team&&`EGL 2.0: ${p.season2_team}`].filter(Boolean);
 $('#player-modal-content').innerHTML=`<div class="modal-player"><img src="${esc(photo(p)||'')}" onerror="this.style.visibility='hidden'" alt="${esc(p.name)}"><div><div class="eyebrow">${esc(label)}</div><h2>${esc(p.name)}</h2><p class="muted">${esc(s==='all'?teams.join(' · '):(s==='1'?p.season1_team:p.season2_team)||'EGL Player')}</p><div class="modal-stats"><div class="modal-stat"><strong>${matches??'—'}</strong><small>Matches</small></div><div class="modal-stat"><strong>${runs??'—'}</strong><small>Runs</small></div><div class="modal-stat"><strong>${w??'—'}</strong><small>Wickets</small></div><div class="modal-stat"><strong>${f??'—'}</strong><small>Fours</small></div><div class="modal-stat"><strong>${six??'—'}</strong><small>Sixes</small></div><div class="modal-stat"><strong>${stats?.['Bat_SR']??stats?.['Strike Rate']??'—'}</strong><small>Strike rate</small></div></div><p class="footnote">${s==='2'&&p.auction_price_inr?'Season 2 auction price: ₹'+Number(p.auction_price_inr).toLocaleString('en-IN'):''}</p></div></div>`;
 $('#player-modal').classList.add('open');$('#player-modal').setAttribute('aria-hidden','false');
}
function renderTeams(){
 const s=$('#team-season').value,teams=DB.teams.filter(t=>String(t.season)===s);
 $('#team-grid').innerHTML=teams.map(t=>{
  const logo=teamAsset(s,t.name),standing=standingsRows(s).find(x=>norm(x.name)===norm(t.name));
  return `<article class="team-card"><div class="team-logo"><img src="${esc(logo)}" alt="${esc(t.name)}" onerror="this.closest('.team-logo').classList.add('no-logo');this.remove()"><span>${esc(t.name.split(/\s+/).map(x=>x[0]).slice(0,3).join(''))}</span></div><b>${esc(t.name)}</b><small>${esc(t.owner||'')}</small><small>${standing?`Position ${standing.rank} · ${standing.points} points`:''}</small></article>`;
 }).join('');
 $('#standings-body').innerHTML=standingsRows(s).map(r=>`<tr><td class="rank">${r.rank}</td><td><b>${esc(r.name)}</b></td><td>${r.played??'—'}</td><td>${r.won??'—'}</td><td>${r.lost??'—'}</td><td>${r.tied??'—'}</td><td>${r.noresult??'—'}</td><td><b>${r.points??'—'}</b></td><td>${r.nrr??'—'}</td><td>${esc(r.for??'—')}</td><td>${esc(r.against??'—')}</td></tr>`).join('');
}
function formatDate(d){if(!d)return 'Date not supplied';let x=new Date(d);return isNaN(x)?d:x.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
function renderMatches(){
 let s=$('#match-season').value,q=norm($('#match-search').value),type=$('#match-type').value,arr=[];
 for(let sn of (s==='all'?['1','2']:[s]))DB.matches[sn].forEach(m=>arr.push({...m,_season:sn}));
 arr=arr.filter(m=>(!q||norm([m.Team,m['Team.1'],m['Match Won'],m['Player of the Match'],m.Remarks].join(' ')).includes(q))&&(!type||norm(m['Match.1'])===norm(type)));
 $('#match-count').textContent=`${arr.length} matches`;
 const stage=m=>m['Match.1']==='SF1'?'Semi-final 1':m['Match.1']==='SF2'?'Semi-final 2':m['Match.1']==='Final'?'Grand Final':m['Match.1']||'Match';
 $('#match-list').innerHTML=arr.map(m=>{let sn=m._season;return `<article class="match-card"><div class="match-top"><span>${seasonLabel(sn)} · Match ${m.Match} · ${esc(stage(m))}</span><span>${esc(m.Day||'')} · ${formatDate(m.Date)}</span></div><div class="match-teams"><b>${esc(matchTeamLabel(sn,m.Team))}</b><span class="vs">VS</span><b>${esc(matchTeamLabel(sn,m['Team.1']))}</b></div><div class="match-result">${esc(m['Match Won']||'Result not supplied')} · ${esc(m.Remarks||'')}</div><div class="match-meta"><span>Player of the Match: ${esc(m['Player of the Match']||'—')}</span><span>Overs: ${esc(m['Total Overs played']??'—')}</span><span>Match duration: ${esc(m['Total Match  Time_display']??m['Total Match  Time']??'—')} min</span><span>Playing time: ${esc(m['Match Playing Time_display']??m['Match Playing Time']??'—')} min</span><span>Time / over: ${esc(m['Total Time per over_display']??(m['Total Time per over']!=null?Number(m['Total Time per over']).toFixed(2):'—'))} min</span></div></article>`}).join('')||'<div class="empty">No matches found.</div>';
}
function getRecordRows(s,kind){
 let rows=DB.players.map(p=>{
  let a=s==='1'?p.season1_stats:s==='2'?p.season2_stats:null,c=p.career_totals||{};
  if(s==='all'){
   const x=p.season1_stats||{},y=p.season2_stats||{};
   const runs=Number(x.Runs_scored||0)+Number(y.Runs||0),wkts=Number(x.Wickets||0)+Number(y.Wickets||0);
   const dismissals=Number(x.Dismissals||0)+Math.max(0,Number(y.BattingInnings||0)-Number(y.NotOuts||0));
   const s1Conceded=(Number(x.Bowl_Avg||0)*Number(x.Wickets||0));
   const conceded=s1Conceded+Number(y.RunsConceded||0);
   if(kind==='batting')return {p,runs,matches:c['All-Time Matches'],fours:c['All-Time Fours'],sixes:c['All-Time Sixes'],avg:dismissals>0?Number((runs/dismissals).toFixed(2)):null};
   if(kind==='bowling')return {p,wickets:wkts,matches:c['All-Time Matches'],avg:wkts>0&&(Number(x.Wickets||0)===0||hasS1Conceded)?Number((conceded/wkts).toFixed(2)):null,econ:null};
   return {p,catches:Number(x.Total_catches||0)+Number(y.Catches||0),runouts:Number(x.Total_RunOuts||0)+Number(y.RunOuts||0),stumpings:Number(x.Total_stumpings||0)+Number(y.Stumpings||0),matches:c['All-Time Matches']};
  }
  if(!a)return null;
  if(kind==='batting')return {p,runs:s==='1'?a.Runs_scored:a.Runs,avg:s==='1'?a.bat_avg:a['Batting Average'],sr:s==='1'?a.Bat_SR:a['Strike Rate'],matches:a.Matches,fours:a.Fours,sixes:a.Sixes};
  if(kind==='bowling')return {p,wickets:a.Wickets,avg:s==='1'?a.Bowl_Avg:a['Bowling Average'],econ:s==='2'?a.Economy:null,matches:a.Matches};
  return {p,catches:s==='1'?a.Total_catches:a.Catches,runouts:s==='1'?a.Total_RunOuts:a.RunOuts,stumpings:s==='1'?a.Total_stumpings:a.Stumpings,matches:a.Matches};
 }).filter(Boolean);
 let key=kind==='batting'?'runs':kind==='bowling'?'wickets':'catches';
 return rows.filter(x=>num(x[key])!==null).sort((a,b)=>(num(b[key])||0)-(num(a[key])||0)).slice(0,50);
}
function renderRecords(){let s=$('#record-season').value,kind=currentRecord,rows=getRecordRows(s,kind);let cols=kind==='batting'?[['Player',x=>x.p.name],['Matches',x=>x.matches],['Runs',x=>x.runs],['Average',x=>x.avg??'—'],['Strike rate',x=>x.sr??'—'],['Fours',x=>x.fours??'—'],['Sixes',x=>x.sixes??'—']]:kind==='bowling'?[['Player',x=>x.p.name],['Matches',x=>x.matches],['Wickets',x=>x.wickets],['Average',x=>x.avg??'—'],['Economy',x=>x.econ??'—']]:[['Player',x=>x.p.name],['Matches',x=>x.matches],['Catches',x=>x.catches??'—'],['Run outs',x=>x.runouts??'—'],['Stumpings',x=>x.stumpings??'—']];$('#record-head').innerHTML='<tr>'+cols.map(c=>`<th>${c[0]}</th>`).join('')+'</tr>';$('#record-body').innerHTML=rows.map((x,i)=>'<tr>'+cols.map((c,j)=>`<td>${j===0?`<b>${i+1}. ${esc(c[1](x))}</b>`:esc(c[1](x)??'—')}</td>`).join('')+'</tr>').join('')||'<tr><td colspan="7">No statistics available.</td></tr>'}
function renderCompare(){let s=$('#compare-season').value,a=$('#compare-a').value,b=$('#compare-b').value;function card(id){let p=DB.players.find(x=>x.egl_player_id===id);if(!p)return '<div class="empty">Choose a player.</div>';return `<article class="compare-player"><div class="eyebrow">${esc(s==='all'?'Combined EGL career':seasonLabel(s))}</div><h3>${esc(p.name)}</h3><div class="compare-stat"><span>Matches</span><strong>${statValue(p,s,'matches')??'—'}</strong></div><div class="compare-stat"><span>Runs</span><strong>${statValue(p,s,'runs')??'—'}</strong></div><div class="compare-stat"><span>Wickets</span><strong>${statValue(p,s,'wickets')??'—'}</strong></div><div class="compare-stat"><span>Fours</span><strong>${statValue(p,s,'fours')??'—'}</strong></div><div class="compare-stat"><span>Sixes</span><strong>${statValue(p,s,'sixes')??'—'}</strong></div></article>`}$('#compare-result').innerHTML=card(a)+card(b)}
function renderHall(){
 let s=$('#hall-season').value,seasons=s==='all'?['1','2']:[s];
 $('#hall-champions').innerHTML=seasons.map(sn=>championCards(sn,DB.champions[sn])).join('');
 let awards=[];
 seasons.forEach(sn=>(DB.awards[sn]||[]).forEach(a=>{
  if(a.award_type==='team'||/sponsor|owner|felicit/i.test(a.category||''))return;
  awards.push({season:sn,...a});
 }));
 const rank=a=>{let c=norm(a.category);if(c.includes('best batsman'))return 1;if(c.includes('most wicket')||c.includes('best bowler'))return 2;if(c.includes('economy'))return 3;if(c.includes('fielder'))return 4;if(c.includes('tournament'))return 5;if(c.includes('final')&&c.includes('potm'))return 6;if(c.includes('match'))return 7;return 8};
 awards.sort((a,b)=>rank(a)-rank(b)||a.season.localeCompare(b.season)||a.category.localeCompare(b.category));
 $('#award-list').innerHTML=awards.map(a=>{const cat=a.category||'';const match=cat.match(/MATCH\s*(\d+)/i);const stage=cat.match(/(Semi Final\s*[12]|Final)/i);const awardLabel=/POTM/i.test(cat)?(match?`Match ${match[1]} · Player of the Match`:stage?`${stage[1]} · Player of the Match`:'Player of the Match'):cat.replace(/Best Batsmen?/i,'Best Batsman').replace(/Best Bowler\s*\(\s*Wkts\s*\)/i,'Best Bowler · Most Wickets').replace(/Best Bowler\s*\(\s*Economy\s*\)/i,'Best Bowler · Best Economy');return `<article class="award-card"><small>${seasonLabel(a.season)}</small><b>${esc(awardLabel)}</b><strong>${esc(a.player||'—')}</strong></article>`}).join('');
}
function renderSponsors(){
 const s=$('#sponsor-season').value,arr=DB.sponsors.filter(x=>s==='all'||String(x.season)===s);
 const grouped=new Map();
 arr.forEach(x=>{const k=String(x.season)+'|'+norm(x.brand);if(!grouped.has(k))grouped.set(k,{...x,roles:[]});if(!grouped.get(k).roles.includes(x.category))grouped.get(k).roles.push(x.category)});
 const items=[...grouped.values()];
 $('#sponsor-grid').innerHTML=items.map(x=>{
  const logo=x.logo&&fileExists(x.logo)?x.logo:null;
  return `<article class="sponsor-card premium-sponsor"><div class="sponsor-logo">${logo?`<img src="${esc(logo)}" alt="${esc(x.brand)}" onerror="this.parentElement.classList.add('logo-missing');this.innerHTML='<span>'+${JSON.stringify(x.brand)}+'</span>'">`:`<span>${esc(x.brand)}</span>`}</div><div class="sponsor-copy"><div class="eyebrow">${seasonLabel(String(x.season))}</div><h3>${esc(x.brand)}</h3><div class="sponsor-roles">${x.roles.map(r=>`<span>${esc(r)}</span>`).join('')}</div>${x.sponsor_name?`<p class="sponsor-person">${esc(x.sponsor_name)}</p>`:''}</div></article>`;
 }).join('');
}
function renderShare(){
 let id=$('#share-player').value,s=$('#share-season').value,p=DB.players.find(x=>x.egl_player_id===id);if(!p)return;
 let season=s==='all'?(p.season2_stats?'2':'1'):s,partner=s==='all'?null:partnerFor(season),label=s==='all'?'COMBINED EGL CAREER':seasonLabel(season);
 let team=s==='1'?p.season1_team:s==='2'?p.season2_team:[p.season1_team,p.season2_team].filter(Boolean).join(' · ');
 let auction=s==='2'?p.auction_price_inr:null,im=photo(p);
 let awards=[];for(const sn of (s==='all'?['1','2']:[season]))(DB.awards[sn]||[]).forEach(a=>{if(norm(a.player)===norm(p.name)&&!(/sponsor|owner|felicit/i.test(a.category)))awards.push(`${a.category} · ${seasonLabel(sn)}`)});
 $('#share-card').innerHTML=`<div class="share-card-head"><div><div class="share-season">EMAMI CITY GROUND LEAGUE · ${esc(label)}</div><b>PLAYER PROFILE</b></div>${partner?.logo?`<img src="${esc(partner.logo)}" alt="${esc(partner.brand)}">`:`<b>EMAMI CITY GROUND LEAGUE</b>`}</div><div class="share-player-photo">${im?`<img src="${esc(im)}" alt="${esc(p.name)}" onerror="this.parentElement.classList.add('photo-missing');this.innerHTML='<span>${esc(p.name.slice(0,1))}</span>'">`:`<span>${esc(p.name.slice(0,1))}</span>`}</div><h2>${esc(p.name)}</h2><div class="muted">${esc(team||'EGL Player')}</div><div class="share-score"><div><small>MATCHES</small><strong>${statValue(p,s,'matches')??'—'}</strong></div><div><small>RUNS</small><strong>${statValue(p,s,'runs')??'—'}</strong></div><div><small>WICKETS</small><strong>${statValue(p,s,'wickets')??'—'}</strong></div><div><small>FOURS / SIXES</small><strong>${statValue(p,s,'fours')??'—'} / ${statValue(p,s,'sixes')??'—'}</strong></div></div>${auction?`<p class="share-foot">Auction price · ₹${Number(auction).toLocaleString('en-IN')}</p>`:''}${awards.length?`<div class="share-awards"><b>AWARDS & RECOGNITION</b>${awards.map(a=>`<span>${esc(a)}</span>`).join('')}</div>`:''}<div class="share-foot">${partner?`${esc(partner.category)} · ${esc(partner.brand)}`:'Official EGL career record'}<br>THE HOME OF EMAMI CITY CRICKET</div>`;
}
function renderIntelligence(){
 const q=norm($('#intelligence-search')?.value||'');
 const intel=DB.intelligence.players||[];
 const byName=new Map(intel.map(x=>[norm(x.Player),x]));
 const rows=DB.players.filter(p=>!q||norm([p.name,p.season1_team,p.season2_team].join(' ')).includes(q));
 $('#intelligence-list').innerHTML=`<div class="table-wrap"><table class="intel-table"><thead><tr><th>Player</th><th>EGL 1.0 · Team</th><th>S1 Runs / Wkts</th><th>EGL 2.0 · Team</th><th>S2 Runs / Wkts</th><th>Auction price</th><th>Intelligence</th></tr></thead><tbody>${rows.map(p=>{let i=byName.get(norm(p.name));return `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.season1_team||'—')}</td><td>${p.season1_stats?`${p.season1_stats.Runs_scored??'—'} / ${p.season1_stats.Wickets??'—'}`:'—'}</td><td>${esc(p.season2_team||'—')}</td><td>${p.season2_stats?`${p.season2_stats.Runs??'—'} / ${p.season2_stats.Wickets??'—'}`:'—'}</td><td>${p.auction_price_inr?'₹'+Number(p.auction_price_inr).toLocaleString('en-IN'):'—'}</td><td>${i?`${i.Provisional_Score??'—'} · ${esc(i.Confidence_Label_From_Model||'')}`:'EGL data only'}</td></tr>`}).join('')}</tbody></table></div>`;
}
function nav(){let hash=location.hash.replace('#','')||'home';if(hash==='archive')hash='records';if(hash==='share')hash='share';if(!$('#view-'+hash))hash='home';$$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+hash));$$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===hash));$('#main-nav').classList.remove('open');if(hash==='players')renderPlayers();if(hash==='teams')renderTeams();if(hash==='matches')renderMatches();if(hash==='records')renderRecords();if(hash==='compare')renderCompare();if(hash==='hall')renderHall();if(hash==='sponsors')renderSponsors();if(hash==='share')renderShare();if(hash==='intelligence')renderIntelligence();}
function init(){fetch('egl-data.json').then(r=>{if(!r.ok)throw Error('Could not load EGL data');return r.json()}).then(d=>{DB=d;renderHome();let opts=DB.players.map(p=>`<option value="${esc(p.egl_player_id)}">${esc(p.name)}</option>`).join('');$('#compare-a').innerHTML=opts;$('#compare-b').innerHTML=opts;$('#compare-b').selectedIndex=1;$('#share-player').innerHTML=opts;renderPlayers();renderTeams();renderMatches();renderRecords();renderCompare();renderHall();renderSponsors();renderShare();renderIntelligence();}).catch(e=>{document.querySelector('main').innerHTML=`<div class="panel" style="padding:30px"><h2>League data could not be loaded</h2><p>${esc(e.message)}. Please check that egl-data.json is in the repository root.</p></div>`});}
$('#menu-toggle').onclick=()=>$('#main-nav').classList.toggle('open');window.addEventListener('hashchange',nav);
['player-season','player-role'].forEach(id=>$('#'+id).addEventListener('change',renderPlayers));$('#player-search').addEventListener('input',renderPlayers);
$('#team-season').onchange=renderTeams;['match-season','match-type'].forEach(id=>$('#'+id).onchange=renderMatches);$('#match-search').oninput=renderMatches;
$('#record-season').onchange=renderRecords;$('#record-tabs').onclick=e=>{let b=e.target.closest('button[data-kind]');if(!b)return;currentRecord=b.dataset.kind;$$('#record-tabs button').forEach(x=>x.classList.toggle('selected',x===b));renderRecords()};$('#compare-season').onchange=renderCompare;$('#compare-a').onchange=renderCompare;$('#compare-b').onchange=renderCompare;$('#hall-season').onchange=renderHall;$('#sponsor-season').onchange=renderSponsors;$('#share-player').onchange=renderShare;$('#share-season').onchange=renderShare;$('#intelligence-search')?.addEventListener('input',renderIntelligence);
$('#player-modal').onclick=e=>{if(e.target.dataset.close){$('#player-modal').classList.remove('open');$('#player-modal').setAttribute('aria-hidden','true')}};document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#player-modal').classList.remove('open')});
$('#download-card').onclick=()=>{let card=$('#share-card');if(!window.html2canvas){let s=card.innerHTML;let w=window.open('','_blank');w.document.write(`<html><head><title>EGL Player Card</title><link rel="stylesheet" href="styles.css"></head><body style="padding:20px;background:#071526">${card.outerHTML}</body></html>`);w.document.close();return}window.html2canvas(card).then(c=>{let a=document.createElement('a');a.download='EGL-player-card.png';a.href=c.toDataURL();a.click()})};
init();