const palette = ["#1c694c","#e3a53b","#4f83c2","#d56f58","#9167b8","#3eaaa0","#d879aa","#81904a","#64748b","#bb8a62","#7b9cbb","#b65b70"];
const initialParties = [
  {name:"Partit A",votes:420000},{name:"Partit B",votes:365000},
  {name:"Partit C",votes:245000},{name:"Partit D",votes:92000},
  {name:"Partit E",votes:54000},{name:"Partit F",votes:18000}
];
let parties = initialParties.map((p,i)=>({...p,id:i+1}));
let nextId = parties.length+1;
const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat("ca-ES").format(n);
function totalVotes(){return parties.reduce((s,p)=>s+Math.max(0,Number(p.votes)||0),0)}
function renderInputs(){
  const total=totalVotes();
  $("party-rows").innerHTML=parties.map((p,i)=>`<tr>
    <td><input class="party-name" aria-label="Nom de la candidatura" data-id="${p.id}" data-key="name" value="${escapeHtml(p.name)}" maxlength="50"></td>
    <td><input class="party-votes" aria-label="Vots de la candidatura" data-id="${p.id}" data-key="votes" type="number" min="0" step="1" value="${Math.max(0,Number(p.votes)||0)}"></td>
    <td class="party-percent">${total?((Math.max(0,Number(p.votes)||0)/total)*100).toLocaleString("ca-ES",{maximumFractionDigits:2,minimumFractionDigits:2})+"%":"0%"}</td>
    <td><button class="remove" data-remove="${p.id}" aria-label="Eliminar candidatura" title="Eliminar candidatura">×</button></td></tr>`).join("");
  $("total-votes").textContent=fmt(total)+" vots totals";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function calculate(){
  const total=totalVotes(), threshold=Math.max(0,Math.min(100,Number($("threshold").value)||0)), seats=Math.max(1,Math.min(350,Math.floor(Number($("seats").value)||1)));
  const eligible=parties.filter(p=>total>0 && (Math.max(0,Number(p.votes)||0)/total*100)>=threshold && (Number(p.votes)||0)>0);
  const results=parties.map(p=>({...p,votes:Math.max(0,Number(p.votes)||0),seats:0,eligible:eligible.some(e=>e.id===p.id)}));
  const quotients=[];
  eligible.forEach(p=>{for(let d=1;d<=seats;d++)quotients.push({id:p.id,q:p.votes/d,d,votes:p.votes})});
  quotients.sort((a,b)=>b.q-a.q || a.id-b.id || a.d-b.d);
  quotients.slice(0,seats).forEach(q=>{const p=results.find(x=>x.id===q.id);if(p)p.seats++});
  const sorted=results.slice().sort((a,b)=>b.seats-a.seats||b.votes-a.votes);
  $("stat-votes").textContent=fmt(total);
  $("stat-parties").textContent=String(results.filter(p=>p.seats>0).length);
  $("stat-seats").textContent=String(seats);
  $("result-status").textContent=eligible.length?`${eligible.length} candidatures superen el llindar`:"Cap candidatura elegible";
  const chart=$("seat-chart");chart.style.gridTemplateColumns=`repeat(${Math.min(seats,16)},minmax(7px,1fr))`;
  let seatParty=[];sorted.forEach(p=>{for(let i=0;i<p.seats;i++)seatParty.push(p)});
  chart.innerHTML=seatParty.length?seatParty.map(p=>`<div class="seat" title="${escapeHtml(p.name)}: ${p.seats} escons" style="background:${palette[parties.findIndex(x=>x.id===p.id)%palette.length]}"></div>`).join(""):`<p class="muted">No hi ha escons assignats.</p>`;
  $("legend").innerHTML=sorted.filter(p=>p.seats>0).map(p=>`<div class="legend-item"><span class="swatch" style="background:${palette[parties.findIndex(x=>x.id===p.id)%palette.length]}"></span><span>${escapeHtml(p.name)}</span><strong>${p.seats}</strong></div>`).join("")||'<span class="muted">Cap resultat amb escons.</span>';
  $("results-rows").innerHTML=sorted.map(p=>{const pct=total?p.votes/total*100:0;const color=palette[parties.findIndex(x=>x.id===p.id)%palette.length];return `<tr><td><div class="result-party"><span class="swatch" style="background:${color}"></span>${escapeHtml(p.name)}</div>${!p.eligible?'<div class="muted small" style="font-size:10px;margin-top:4px">Per davall del llindar</div>':""}</td><td>${fmt(p.votes)}</td><td><div>${pct.toLocaleString("ca-ES",{maximumFractionDigits:2})}%</div><div class="detail-bar"><span style="width:${Math.min(100,pct)}%;background:${color}"></span></div></td><td class="seat-number">${p.seats}</td><td>${(p.seats/seats*100).toLocaleString("ca-ES",{maximumFractionDigits:1})}%</td></tr>`}).join("");
}
function refresh(){renderInputs();calculate()}
$("party-rows").addEventListener("input",e=>{
 const el=e.target;if(!el.dataset.id)return;const p=parties.find(p=>p.id===Number(el.dataset.id));if(!p)return;
 if(el.dataset.key==="name")p.name=el.value;else p.votes=Math.max(0,Math.floor(Number(el.value)||0));
 const row=el.closest("tr");if(el.dataset.key==="votes"){const total=totalVotes();$("total-votes").textContent=fmt(total)+" vots totals";$("party-rows").querySelectorAll("tr").forEach((tr,i)=>{const v=Math.max(0,Number(parties[i].votes)||0);tr.querySelector(".party-percent").textContent=total?(v/total*100).toLocaleString("ca-ES",{maximumFractionDigits:2,minimumFractionDigits:2})+"%":"0%"})}
 calculate();
});
$("party-rows").addEventListener("click",e=>{const id=e.target.dataset.remove;if(!id)return;parties=parties.filter(p=>p.id!==Number(id));refresh()});
$("add-party").addEventListener("click",()=>{parties.push({id:nextId++,name:`Partit ${String.fromCharCode(65+parties.length)}`,votes:0});refresh()});
$("seats").addEventListener("input",calculate);$("threshold").addEventListener("input",calculate);
$("reset").addEventListener("click",()=>{parties=initialParties.map((p,i)=>({...p,id:i+1}));nextId=parties.length+1;$("seats").value=16;$("threshold").value=3;refresh()});
refresh();