let EGL_ARCHIVE=null;
const a$=id=>document.getElementById(id);
const aEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const aFmt=(v,d=1)=>v===null||v===undefined||v===''?'—':(typeof v==='number'?v.toLocaleString('en-IN',{maximumFractionDigits:d}):String(v));
function aVal(o,...keys){for(const k of keys){if(o&&o[k]!==null&&o[k]!==undefined&&o[k]!=='')return o[k]}return null}
function aTable(headers,rows){return `<div class="table-wrap"><table class="archive-table"><thead><tr>${headers.map(x=>`<th>${aEsc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(x=>`<td>${aEsc(x??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function aRender(){if(!EGL_ARCHIVE)return;let season=Number(a$('archiveSeason').value),view=a$('archiveView').value,q=a$('archiveSearch').value.trim().toLowerCase(),content=a$('archiveContent'),summary=a$('archiveSummary');
 let players=EGL_ARCHIVE.players.filter(p=>season===1?p.season1_name:p.season2_name);let teams=EGL_ARCHIVE.teams.filter(t=>t.season===season);let matches=EGL_ARCHIVE.matches[String(season)]||[];let awards=EGL_ARCHIVE.awards[String(season)]||[];let sponsors=EGL_ARCHIVE.sponsors.filter(s=>s.season===season);
 summary.innerHTML=[['Players',players.length],['Teams',teams.length],['Matches',matches.length],['Sponsors & partners',sponsors.length]].map(([l,v])=>`<div class="archive-kpi"><strong>${aFmt(v,0)}</strong><span>${l}</span></div>`).join('');
 if(view==='players'){
  let arr=players.filter(p=>(`${p.egl_player_id} ${p.season1_name||''} ${p.season2_name||''} ${p.season1_team||''} ${p.season2_team||''}`).toLowerCase().includes(q));
  content.innerHTML=`<div class="archive-grid">${arr.map(p=>{let st=season===1?p.season1_stats:p.season2_stats, name=season===1?p.season1_name:p.season2_name, team=season===1?p.season1_team:p.season2_team;let stats=season===1?[["Matches",aVal(st,'Matches')],["Runs",aVal(st,'Runs_scored')],["Batting SR",aVal(st,'Bat_SR')],["Wickets",aVal(st,'Wickets')],["Bowling Avg",aVal(st,'Bowl_Avg')]]:[["Matches",aVal(st,'Matches')],["Runs",aVal(st,'Runs')],["Batting SR",aVal(st,'Strike Rate')],["Wickets",aVal(st,'Wickets')],["Economy",aVal(st,'Economy')]];return `<article class="archive-card">${p.photo?`<img class="archive-photo" loading="lazy" src="${aEsc(p.photo)}" alt="${aEsc(name)}">`:`<div class="archive-photo" style="display:grid;place-items:center;color:#8295ad;font-size:42px">${aEsc((name||'?').slice(0,1))}</div>`}<div class="eyebrow">${aEsc(p.egl_player_id)}</div><h3>${aEsc(name||'Name unavailable')}</h3><div class="sub">${aEsc(team||'Team not recorded')}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px">${stats.map(([k,v])=>`<div class="detail-cell"><span>${aEsc(k)}</span><strong>${aEsc(aFmt(v))}</strong></div>`).join('')}</div><p class="archive-note">${aEsc(p.identity_status||'')}</p></article>`}).join('')||'<div class="empty">No players match this search.</div>'}</div><p class="archive-note">Season-specific official EGL aggregates are shown as recorded in the supplied source workbook. Blank values remain unknown. Players without a batting or bowling opportunity remain included as official participants.</p>`;
 }else if(view==='teams'){
  let stand=EGL_ARCHIVE.standings[String(season)]||[];
  let cards=teams.filter(t=>t.name.toLowerCase().includes(q));
  let logoCards=`<div class="archive-grid">${cards.map(t=>`<article class="archive-card">${t.logo?`<img class="archive-logo" src="${aEsc(t.logo)}" alt="${aEsc(t.name)} logo">`:''}<h3>${aEsc(t.name)}</h3><div class="sub">${aEsc(t.colour||'')}</div><div class="archive-note">${aEsc(t.owner||'')}${t.co_owner?' · '+aEsc(t.co_owner):''}</div></article>`).join('')}</div>`;
  content.innerHTML=logoCards+'<div class="section-head"><h2>League standings</h2><p>Source standings for this season.</p></div>'+aTable(['Team','Played','Won','Lost','Points','NRR','For','Against','Last 5'],stand.filter(t=>JSON.stringify(t).toLowerCase().includes(q)).map(t=>[aVal(t,'League Level','Team Name','Team'),aVal(t,'Matches Played'),aVal(t,'Won'),aVal(t,'Lost'),aVal(t,'Points'),aVal(t,'NRR'),aVal(t,'For'),aVal(t,'against','Against'),aVal(t,'last-5')]));
 }else if(view==='matches'){
  let arr=matches.filter(m=>JSON.stringify(m).toLowerCase().includes(q));
  content.innerHTML=aTable(['#','Stage','Date','Team 1','Team 2','Winner','Result','Total Match Time (min)','Playing Time (min)','Gap'],arr.map(m=>[aVal(m,'Match #','Match'),aVal(m,'Match.1','Match Type','Match'),aVal(m,'Date'),aVal(m,'Team'),aVal(m,'Team.1'),aVal(m,'Match Won'),aVal(m,'Remarks'),aVal(m,'Total Match  Time_display', 'Total Match Time'),aVal(m,'Match Playing Time_display','Match Playing Time'),aVal(m,'Match gap time')]));
  content.innerHTML+='<p class="archive-note">Match timing fields are retained from the source workbook where supplied. Total match time and playing time are expressed in minutes in the source data; innings durations and intervals remain separately recorded.</p>';
 }else if(view==='awards'){
  let arr=awards.filter(a=>JSON.stringify(a).toLowerCase().includes(q));
  content.innerHTML=aTable(['Award','Player / Team','Type'],arr.map(a=>[a.category,a.player||a.player_or_team,a.award_type==='team'?'Team honour':'Player award']))+'<p class="archive-note">Only player awards and the champions/runners-up team honours are published. Sponsor and team-owner felicitation records are excluded from this public archive.</p>';
 }else if(view==='sponsors'){
  let arr=sponsors.filter(s=>JSON.stringify(s).toLowerCase().includes(q));
  content.innerHTML=`<div class="archive-grid">${arr.map(s=>`<article class="archive-card">${s.logo?`<img class="archive-logo" loading="lazy" src="${aEsc(s.logo)}" alt="${aEsc(s.brand)} logo">`:`<div class="archive-logo" style="display:grid;place-items:center;font-weight:900;color:#0a1728;font-size:22px">${aEsc(s.brand)}</div>`}<div class="eyebrow">${aEsc(s.category)}</div><h3>${aEsc(s.brand)}</h3><div class="sub">${aEsc(s.sponsor_name||'')}</div></article>`).join('')||'<div class="empty">No sponsors match this search.</div>'}</div><p class="archive-note">Sponsor/contact names are displayed as supplied in the workbook. Brands without supplied logo artwork are represented by a text mark.</p>`;
 }
}
async function initArchive(){try{const r=await fetch('./archive_data.json',{cache:'no-store'});EGL_ARCHIVE=await r.json();}catch(e){console.error('EGL archive data could not load',e);return}
 ['archiveSeason','archiveView'].forEach(id=>a$(id).addEventListener('change',aRender));a$('archiveSearch').addEventListener('input',aRender);aRender();
}
// Integrate with the existing tab system without changing the original intelligence modules.
const oldSwitchTab=window.switchTab;
window.switchTab=function(tab){if(oldSwitchTab)oldSwitchTab(tab);const hp=document.getElementById('historyPane');if(hp)hp.hidden=tab!=='history';if(tab==='history'){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab==='history'));aRender();}};
document.addEventListener('DOMContentLoaded',initArchive);
