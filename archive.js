let EGL_ARCHIVE=null;
const a$=id=>document.getElementById(id);
const aEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const aFmt=(v,d=1)=>v===null||v===undefined||v===''?'—':(typeof v==='number'?v.toLocaleString('en-IN',{maximumFractionDigits:d}):String(v));
function aVal(o,...keys){for(const k of keys){if(o&&o[k]!==null&&o[k]!==undefined&&o[k]!=='')return o[k]}return null}
function aTable(headers,rows){return `<div class="table-wrap"><table class="archive-table"><thead><tr>${headers.map(x=>`<th>${aEsc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${aEsc(x??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function aRender(){
 if(!EGL_ARCHIVE)return;
 let season=Number(a$('archiveSeason').value),view=a$('archiveView').value,q=a$('archiveSearch').value.trim().toLowerCase(),content=a$('archiveContent'),summary=a$('archiveSummary');
 let players=EGL_ARCHIVE.players.filter(p=>season===0?(p.season1_name||p.season2_name):season===1?!!p.season1_name:!!p.season2_name);
 let teams=EGL_ARCHIVE.teams.filter(t=>season===0||t.season===season);
 let matches=season===0?[...(EGL_ARCHIVE.matches['1']||[]).map(x=>({...x,_season:'EGL 1.0'})),...(EGL_ARCHIVE.matches['2']||[]).map(x=>({...x,_season:'EGL 2.0'}))]:(EGL_ARCHIVE.matches[String(season)]||[]);
 let awards=season===0?[...(EGL_ARCHIVE.awards['1']||[]).map(x=>({...x,_season:'EGL 1.0'})),...(EGL_ARCHIVE.awards['2']||[]).map(x=>({...x,_season:'EGL 2.0'}))]:(EGL_ARCHIVE.awards[String(season)]||[]).map(x=>({...x,_season:`EGL ${season}.0`}));
 let sponsors=EGL_ARCHIVE.sponsors.filter(s=>season===0||s.season===season);
 summary.innerHTML=[['Players',players.length],['Teams',teams.length],['Matches',matches.length],['Sponsors & partners',sponsors.length]].map(([l,v])=>`<div class="archive-kpi"><strong>${aFmt(v,0)}</strong><span>${l}</span></div>`).join('');
 if(view==='players'){
  let arr=players.filter(p=>(`${p.egl_player_id} ${p.season1_name||''} ${p.season2_name||''} ${p.season1_team||''} ${p.season2_team||''}`).toLowerCase().includes(q));
  content.innerHTML=`<div class="archive-grid">${arr.map(p=>{
   let combined=season===0, st=combined?p.career_totals:(season===1?p.season1_stats:p.season2_stats), name=combined?(p.season2_name||p.season1_name):(season===1?p.season1_name:p.season2_name), team=combined?[p.season1_team,p.season2_team].filter(Boolean).join(' → '):(season===1?p.season1_team:p.season2_team);
   let stats=combined?[["All-time matches",aVal(st,'All-Time Matches')],["All-time runs",aVal(st,'All-Time Runs')],["All-time wickets",aVal(st,'All-Time Wickets')],["Fours",aVal(st,'All-Time Fours')],["Sixes",aVal(st,'All-Time Sixes')]]:season===1?[["Matches",aVal(st,'Matches')],["Runs",aVal(st,'Runs_scored')],["Batting SR",aVal(st,'Bat_SR')],["Wickets",aVal(st,'Wickets')],["Bowling Avg",aVal(st,'Bowl_Avg')]]:[["Matches",aVal(st,'Matches')],["Runs",aVal(st,'Runs')],["Batting SR",aVal(st,'Strike Rate')],["Wickets",aVal(st,'Wickets')],["Economy",aVal(st,'Economy')]];
   let split=combined?`<p class="archive-note">Season 1: ${aFmt(aVal(st,'S1 Matches'),0)} matches · ${aFmt(aVal(st,'S1 Runs'),0)} runs · ${aFmt(aVal(st,'S1 Wickets'),0)} wickets<br>Season 2: ${aFmt(aVal(st,'S2 Matches'),0)} matches · ${aFmt(aVal(st,'S2 Runs'),0)} runs · ${aFmt(aVal(st,'S2 Wickets'),0)} wickets</p>`:'';
   let photo=p.photo?`<img class="archive-photo" loading="lazy" src="./${aEsc(p.photo).replace(/^\.\//,'')}" alt="${aEsc(name)}" onerror="this.outerHTML='<div class=&quot;archive-photo photo-fallback&quot;>${aEsc((name||'?').slice(0,1))}</div>'">`:`<div class="archive-photo photo-fallback">${aEsc((name||'?').slice(0,1))}</div>`;
   return `<article class="archive-card">${photo}<div class="eyebrow">${aEsc(p.egl_player_id)}</div><h3>${aEsc(name||'Name unavailable')}</h3><div class="sub">${aEsc(team||'Team not recorded')}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px">${stats.map(([k,v])=>`<div class="detail-cell"><span>${aEsc(k)}</span><strong>${aEsc(aFmt(v))}</strong></div>`).join('')}</div>${split}<p class="archive-note">${aEsc(p.identity_status||'')}</p></article>`;
  }).join('')||'<div class="empty">No players match this search.</div>'}</div><p class="archive-note">${season===0?'Combined totals add the available Season 1 and Season 2 official EGL aggregates. Rate statistics are shown season-wise because valid combined denominators must be reconciled.':'Season-specific official EGL aggregates are shown as recorded in the supplied source workbook.'} Blank values remain unknown. Players without a batting or bowling opportunity remain included as official participants.</p>`;
 }else if(view==='teams'){
  let stand=season===0?[...(EGL_ARCHIVE.standings['1']||[]).map(x=>({...x,_season:'EGL 1.0'})),...(EGL_ARCHIVE.standings['2']||[]).map(x=>({...x,_season:'EGL 2.0'}))]:(EGL_ARCHIVE.standings[String(season)]||[]);
  let cards=teams.filter(t=>t.name.toLowerCase().includes(q));
  let logoCards=`<div class="archive-grid">${cards.map(t=>`<article class="archive-card">${t.logo?`<img class="archive-logo" loading="lazy" src="./${aEsc(t.logo).replace(/^\.\//,'')}" alt="${aEsc(t.name)} logo" onerror="this.outerHTML='<div class=&quot;archive-logo logo-fallback&quot;>${aEsc(t.name)}</div>'">`:`<div class="archive-logo logo-fallback">${aEsc(t.name)}</div>`}<h3>${aEsc(t.name)}</h3><div class="sub">${aEsc(t.colour||'')} · EGL ${t.season}.0</div></article>`).join('')}</div>`;
  let teamHonours=awards.filter(a=>a.award_type==='team' && (season===0 || a._season===`EGL ${season}.0`));
  let honoursHtml=`<div class="champions-strip archive-honours">${teamHonours.map(a=>`<article class="champion-card"><span class="season-tag">${aEsc(a._season||`EGL ${season}.0`)} · ${aEsc(a.category)}</span><strong>${aEsc(a.player_or_team)}</strong></article>`).join('')}</div>`;
  content.innerHTML=honoursHtml+logoCards+'<div class="section-head"><h2>League standings</h2><p>Competition table only. Match duration and innings timing are shown separately under Match Results &amp; Timing.</p></div>'+aTable(['Season','Team','Played','Won','Lost','Tied','No result','Points','NRR','For','Against'],stand.filter(t=>JSON.stringify(t).toLowerCase().includes(q)).map(t=>[t._season||`EGL ${season}.0`,aVal(t,'League Level','Team Name','Team'),aVal(t,'Matches Played'),aVal(t,'Won'),aVal(t,'Lost'),aVal(t,'Tied'),aVal(t,'No Result'),aVal(t,'Points'),aVal(t,'NRR'),aVal(t,'For'),aVal(t,'against','Against')]));
 }else if(view==='matches'){
  let arr=matches.filter(m=>JSON.stringify(m).toLowerCase().includes(q));
  content.innerHTML=aTable(['Season','#','Stage','Date','Team 1','Team 2','Winner','Result','Total Match Time (min)','Playing Time (min)','Gap'],arr.map(m=>[m._season||`EGL ${season}.0`,aVal(m,'Match #','Match'),aVal(m,'Match.1','Match Type','Match'),aVal(m,'Date'),aVal(m,'Team'),aVal(m,'Team.1'),aVal(m,'Match Won'),aVal(m,'Remarks'),aVal(m,'Total Match  Time_display','Total Match Time'),aVal(m,'Match Playing Time_display','Match Playing Time'),aVal(m,'Match gap time')]))+'<p class="archive-note">Match timing fields are retained from the source workbook where supplied.</p>';
 }else if(view==='awards'){
  let arr=awards.filter(a=>JSON.stringify(a).toLowerCase().includes(q));
  content.innerHTML=aTable(['Season','Award','Player / Team','Type'],arr.map(a=>[a._season||`EGL ${season}.0`,a.category,a.player||a.player_or_team,a.award_type==='team'?'Team honour':'Player award']))+'<p class="archive-note">Only player awards and champions/runners-up team honours are published.</p>';
 }else if(view==='sponsors'){
  let arr=sponsors.filter(s=>JSON.stringify(s).toLowerCase().includes(q));
  content.innerHTML=`<div class="archive-grid">${arr.map(s=>{let fallback=`<div class="archive-logo logo-fallback">${aEsc(s.brand)}</div>`;let logo=s.logo?`<img class="archive-logo" loading="lazy" src="./${aEsc(s.logo).replace(/^\.\//,'')}" alt="${aEsc(s.brand)} logo" onerror="this.outerHTML='${fallback.replace(/'/g,"&#39;")}'">`:fallback;return `<article class="archive-card">${logo}<div class="eyebrow">${aEsc(s.category)} · EGL ${s.season}.0</div><h3>${aEsc(s.brand)}</h3><div class="sub">${aEsc(s.sponsor_name||'')}</div></article>`}).join('')||'<div class="empty">No sponsors match this search.</div>'}</div><p class="archive-note">Sponsor/contact names are displayed as supplied. Brands without logo artwork use a text mark.</p>`;
 }
}
async function initArchive(){try{const r=await fetch('./archive_data.json',{cache:'no-store'});EGL_ARCHIVE=await r.json();}catch(e){console.error('EGL archive data could not load',e);return}
 ['archiveSeason','archiveView'].forEach(id=>a$(id).addEventListener('change',aRender));a$('archiveSearch').addEventListener('input',aRender);aRender();
}
// Integrate with the existing tab system without changing the original intelligence modules.
const oldSwitchTab=window.switchTab;
window.switchTab=function(tab){if(oldSwitchTab)oldSwitchTab(tab);const hp=document.getElementById('historyPane');if(hp)hp.hidden=tab!=='history';if(tab==='history'){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab==='history'));aRender();}};
document.addEventListener('DOMContentLoaded',initArchive);
