// Helpers
function gDs(w) { if (w <= 2) return P0; if (w <= 6) return (w % 2 === 1) ? P1A : P1B; return (w % 2 === 1) ? P2A : P2B }
function gpl(w) { if (w <= 2) return "Phase 0 · Reactivation"; if (w <= 6) return "Phase 1 · Rebuild (" + (w % 2 === 1 ? "A" : "B") + ")"; return "Phase 2 · Accelerate (" + (w % 2 === 1 ? "A" : "B") + ")" }
function gD(w, dy) { return gDs(w)[dy] || null }
function cD(w, dy) { const d = gD(w, dy); if (!d) return { t: 0, d: 0 }; let t = 0, dn = 0; d.b.forEach((bl, bi) => bl.it.forEach((_, ii) => { if (!_.startsWith("→")) { t++; if (S.chk[`${w}-${dy}-${bi}-${ii}`]) dn++ } })); return { t, d: dn } }
function cW(w) { let t = 0, d = 0; DO.forEach(dy => { const c = cD(w, dy); t += c.t; d += c.d }); return { t, d, p: t ? Math.round(d / t * 100) : 0 } }
function cP() { let t = 0, d = 0; for (let w = 1; w <= 12; w++) { const c = cW(w); t += c.t; d += c.d } return { t, d, p: t ? Math.round(d / t * 100) : 0 } }
function gcw() { const t = new Date(); t.setHours(0, 0, 0, 0); const s = new Date(PS); s.setHours(0, 0, 0, 0); if (t < s) return 1; return Math.max(1, Math.min(12, Math.floor((t - s) / (864e5 * 7)) + 1)) }

function ws(w) { const d = new Date(PS); d.setDate(d.getDate() + (w - 1) * 7); return d }
function gdd(w, dy) { const i = DO.indexOf(dy); const d = new Date(ws(w)); d.setDate(d.getDate() + i); return d }

const MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function fm(d) { 
    return d.getDate().toString().padStart(2, '0') + " " + MO[d.getMonth()];
}
function fmy(d) {
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}
function fr(w) { const s = ws(w); const e = new Date(s); e.setDate(e.getDate() + 6); return fm(s) + " – " + fm(e) }
function exN(t) { return t.split("—")[0].split("×")[0].replace(/\d+s neg.*|tempo.*|\(.*\)/gi, '').trim() }

function parseExpectedSets(it) {
    const match = it.match(/(\d+)×(\d+(-\d+)?)/);
    if (match) return parseInt(match[1]);
    return 1;
}

function recommendWeight(exName) {
    if (S.aiSuggests) {
        // Look for Agent mapped suggestion first
        const found = S.aiSuggests.find(s => s.ex.toLowerCase() === exName.toLowerCase());
        if (found) return found.suggested + " (AI Suggested)";
    }
    
    // Normalize user's exercise name
    const nRaw = exName.replace(/\—.*$|\(.*\)|\d+x\d+/g, '').trim().toLowerCase();
    let similarExs = [nRaw];
    for (const [group, exList] of Object.entries(EG)) {
        if (exList.some(e => exName.includes(e) || e.includes(exName))) {
            similarExs = exList;
            break;
        }
    }
    
    let bestWeight = null;
    let fallbackWeight = null;
    let latestTime = 0;
    let fallbackTime = 0;

    for (const [k, setsArr] of Object.entries(S.sets)) {
        if (!setsArr || !setsArr.length) continue;
        const setExName = setsArr[0].exName;
        if (!setExName) continue;
        
        const isMatch = similarExs.some(e => setExName.includes(e) || e.includes(setExName));
        if (!isMatch) continue;

        for (const s of setsArr) {
            if (!s.weight) continue;
            
            // Prioritize sets where RPE is 3 or 4 (Moderate/Hard)
            if (s.rpe == 3 || s.rpe == 4) {
               if (s.timestamp > latestTime) {
                   latestTime = s.timestamp;
                   bestWeight = s.weight;
               }
            } else {
               if (s.timestamp > fallbackTime) {
                   fallbackTime = s.timestamp;
                   fallbackWeight = s.weight;
               }
            }
        }
    }
    return bestWeight || fallbackWeight || null;
}

// Navigation
function nv(v, dy) { S.v = v; S.sd = dy || null; history.pushState({ v, dy }, ''); ren(); window.scrollTo(0, 0) }
window.addEventListener('popstate', function (e) { if (e.state) { S.v = e.state.v; S.sd = e.state.dy } else { S.v = 'o'; S.sd = null } ren() });

function ren() { 
    const a = document.getElementById('app'); 
    if (S.v === 'o') rO(a); 
    else if (S.v === 'w') rW(a); 
    // rD removed as tracking is now purely in overview
}

// Global UI Headers
function getHeaderHTML() {
    return `
    <div class="hdr">
        <div class="lr">
            <div class="logo">rba</div>
            <div>
                <div class="ht">rba | fit</div>
                <div class="hs">Rise · Build · Adapt</div>
            </div>
        </div>
        <div>
           <button class="tb" onclick="triggerEODAgent()" style="margin-right: 5px;">Day Complete ✓</button>
        </div>
    </div>`;
}

// --- OVERVIEW RENDER ---
function rO(a) {
    const w = S.cw, wk = cW(w), p = cP();
    const today = new Date();
    const dateStr = fmy(today);
    const dLog = S.daily[dateStr] || { weight: '', food: '' };
    
    // AI Summary defaults
    const activeType = S.aiSummaryType || "Pending";
    const activeSummary = S.aiSummaryText || "Loading highlights from Agent... Waiting for 1 PM Midday or EOD Check-in.";
    const activeScore = S.aiScore || "N/A";
    
    a.innerHTML = getHeaderHTML() + `
    <!-- Top Action Hub -->
    <div class="qa-container">
        <button class="qa-btn" onclick="toggleQaPanel('weight')">⚖️ Log Weight</button>
        <button class="qa-btn" onclick="toggleQaPanel('meal')">📸 Log Meal</button>
    </div>
    
    <div id="qa-panel-weight" class="qa-panel hidden">
        <div class="input-group">
            <span class="input-label">Current Weight (lbs)</span>
            <input type="number" id="quick_weight" class="text-input" value="${dLog.weight}" placeholder="e.g. 185.5">
            <button class="btn-primary" style="padding:8px" onclick="quickSaveLog('${dateStr}')">Save Weight</button>
        </div>
    </div>
    
    <div id="qa-panel-meal" class="qa-panel hidden">
        <div class="input-group">
            <span class="input-label">Meal Notes</span>
            <textarea id="quick_food" class="text-input" style="min-height:50px" placeholder="What did you eat?">${dLog.food}</textarea>
            <input type="file" id="quick_photo" accept="image/*" class="hidden" onchange="handleQuickPhotoSelect(event)">
            <button class="btn-secondary" style="margin-top:6px" onclick="document.getElementById('quick_photo').click()">📸 Attach Photo</button>
            <span id="quick_photo_status" style="font-size: 11px; color: var(--green); margin-top: 5px;"></span>
            <button class="btn-primary" style="padding:8px" onclick="quickSaveLog('${dateStr}')">Save Meal</button>
        </div>
    </div>

    <!-- AI Highlight -->
    <div class="ai-highlight">
        <div class="ai-highlight-title">
            <span>✨ AI Insights (${activeType})</span>
            <span style="font-size:10px; font-weight:normal; color:var(--text3); border:1px solid #333; padding:2px 6px; border-radius:4px;">Score: ${activeScore}</span>
        </div>
        <div class="ai-highlight-body">${activeSummary}</div>
    </div>

    <div style="margin-bottom:12px"><div class="pr"><span class="prl">Program</span><div class="prt"><div class="prf" style="width:${p.p}%;background:var(--green)"></div></div><span class="prp">${p.p}%</span></div><div class="pr"><span class="prl">Week ${w}</span><div class="prt"><div class="prf" style="width:${wk.p}%;background:var(--accent)"></div></div><span class="prp">${wk.p}%</span></div></div>
    <div class="wn"><button class="nb" onclick="cW2(-1)" ${w === 1 ? 'disabled' : ''}>‹</button><div style="text-align:center"><div class="wl">Week ${w}</div><div class="pl">${gpl(w)}</div><div class="dr">${fr(w)}</div></div><button class="nb" onclick="cW2(1)" ${w === 12 ? 'disabled' : ''}>›</button></div>
    ${w !== gcw() ? `<button class="jb" onclick="jt()">↓ Jump to Current Week (${gcw()}) ↓</button>` : ''}
    <div class="pills">${Array.from({ length: 12 }, (_, i) => `<button class="pill ${i + 1 === w ? 'pa' : 'pi'}" onclick="gw2(${i + 1})">${i + 1}</button>`).join('')}</div>
    <div class="im"><div class="imt">Intensity</div><div class="imr">${DO.map(dy => { const d = gD(w, dy); return `<div class="imc"><div class="imd" style="background:${IC[d?.i] || '#333'}"></div><div class="iml">${DL[dy]}</div></div>` }).join('')}</div></div>
    <div class="dc">${DO.map(dy => { const d = gD(w, dy); if (!d) return ''; const c = cD(w, dy), pc = c.t ? Math.round(c.d / c.t * 100) : 0, ds = fm(gdd(w, dy)); return `<button class="dcd" onclick="nv('w','${dy}')"><div class="dct"><span class="dci">${d.ic}</span><div class="dcf"><div class="ddy">${DL[dy].toUpperCase()} ${ds}</div><div class="dcn">${d.t}</div></div><div class="dcr"><span class="bdg" style="background:${IC[d.i] || '#444'}">${d.i}</span><span class="ddr">${d.d}</span></div></div>${c.t > 0 ? `<div class="dp"><div class="dpt"><div class="dpf" style="width:${pc}%"></div></div><span class="dpp">${c.d}/${c.t}</span></div>` : ''}</button>` }).join('')}</div>
    ${w === 10 ? '<div class="dl">⚠️ <strong>Deload Week.</strong> Drop volume 40%, keep weights same.</div>' : ''}`;
    
    // Automatically re-fetch AI state lazily if we are on today's view (in real use we'd cache to save fetches, but for testing daily is fine)
    fetchStateFromCloud(dateStr, (serverData) => {
        if (serverData && serverData.latestSummaryText) {
            let changed = false;
            if (S.aiSummaryText !== serverData.latestSummaryText) { S.aiSummaryText = serverData.latestSummaryText; changed = true; }
            if (S.aiSummaryType !== serverData.latestSummaryType) { S.aiSummaryType = serverData.latestSummaryType; changed = true; }
            
            // Extract score if any from latest logs
            let lastScore = serverData.nutritionScores && serverData.nutritionScores.length ? serverData.nutritionScores[serverData.nutritionScores.length-1] : "N/A";
            if (S.aiScore !== lastScore) { S.aiScore = lastScore; changed = true; }
            
            if (serverData.aiWeightSuggestions && serverData.aiWeightSuggestions.length > 0) {
                // Ensure array shape matches internal state expectation
                S.aiSuggests = serverData.aiWeightSuggestions;
                changed = true;
            }
            
            if (changed) { sv(); document.querySelector('.ai-highlight-body').innerText = S.aiSummaryText; }
        }
    });
}

// --- WORKOUT RENDER ---
function rW(a) {
    const w = S.cw, dy = S.sd, d = gD(w, dy); if (!d) { S.v = 'o'; ren(); return }
    const dt = gdd(w, dy);
    const dateStr = fmy(dt);
    const ds = fm(dt);
    
    let h = `<div class="dh"><button class="bb" onclick="nv('o')">← Back</button><div><div class="dt">${d.ic} ${d.t}</div><div class="dm">Week ${w} · ${DL[dy].toUpperCase()} ${ds} <span class="bdg" style="background:${IC[d.i]}">${d.i}</span> <span style="color:var(--text3)">${d.d}</span><button class="btn-diagram" style="margin-left:6px;width:auto;padding:0 4px;" onclick="showRpeModal()">RPE ?</button></div>${d.eq ? `<div class="eq">Bring: ${d.eq}</div>` : ''}</div></div>`;
    
    if (d.rc && d.op) h += `<div style="margin-bottom:14px"><div class="opth">Pick your recovery</div><div class="opts">${d.op.map(o => `<span class="opt">${o}</span>`).join('')}</div></div>`;
    
    h += '<div>';
    d.b.forEach((bl, bi) => {
        h += `<div class="blk">${bl.n ? `<div class="bn">${bl.n}</div>` : ''}`;
        bl.it.forEach((it, ii) => {
            if (it.startsWith("→")) { h += `<div class="ar">${it}</div>`; return }
            
            const k = `${w}-${dy}-${bi}-${ii}`;
            const dn = !!S.chk[k];
            const activeSets = S.sets[k] || [];
            
            const exName = exN(it);
            const numExpectedSets = parseExpectedSets(it);
            const recomWt = recommendWeight(exName);
            
            let shouldTrack = true;
            const bName = bl.n.toLowerCase();
            const title = d.t.toLowerCase();
            if (/warm-up|cool-down|mobility|ladder|movement|stretch|agility|run|strides|recovery/i.test(bName)) {
                shouldTrack = false;
            }
            if (title.includes('track') || title.includes('footwork')) {
                shouldTrack = false;
            }
            if (it.toLowerCase().includes("weighted vest")) {
                shouldTrack = true;
            }
            
            // Build the set rows
            let setsHtml = '';
            if (shouldTrack) {
                for (let i = 0; i < numExpectedSets; i++) {
                    const s = activeSets[i] || {};
                    setsHtml += `
                        <div class="set-row">
                            <span class="set-num">${i+1}</span>
                            <input type="text" placeholder="reps" class="set-input reps" id="rep_${k}_${i}" value="${s.reps || ''}">
                            <input type="text" placeholder="lbs" class="set-input weight" id="wt_${k}_${i}" value="${s.weight || ''}">
                            <select class="set-select rpe" id="rpe_${k}_${i}">
                                <option value="">RPE</option>
                                <option value="1" ${s.rpe==1?'selected':''}>1</option>
                                <option value="2" ${s.rpe==2?'selected':''}>2</option>
                                <option value="3" ${s.rpe==3?'selected':''}>3</option>
                                <option value="4" ${s.rpe==4?'selected':''}>4</option>
                                <option value="5" ${s.rpe==5?'selected':''}>5</option>
                            </select>
                            ${(i===0 && recomWt && !s.weight) ? `<span class="set-recom">use ${recomWt}</span>` : ''}
                            <button class="save-set-btn ${s.weight ? 'saved':''}" onclick="saveSet('${k}', ${i}, '${dateStr}', '${exName.replace(/'/g,"\\'")}')">${s.weight ? '✓' : 'Save'}</button>
                        </div>
                    `;
                }
            }

            h += `
            <div class="it ${dn ? 'itd' : ''}">
                <div class="it-header">
                    <button class="ck" style="color:${dn ? 'var(--green)' : 'var(--text3)'}" onclick="tg('${k}')">${dn ? '✓' : '○'}</button>
                    <div style="flex:1;min-width:0">
                        <div class="itt">
                            ${it} 
                            <button class="btn-diagram" onclick="showDiagramModal('${exName.replace(/'/g,"\\'")}')">?</button>
                        </div>
                    </div>
                </div>
                <div class="sets-container" id="sc_${k}" style="display: ${dn ? 'none' : 'flex'}">
                    ${setsHtml}
                </div>
            </div>`;
        });
        h += '</div>';
    });
    h += '</div>'; a.innerHTML = h;
}

function toggleQaPanel(id) {
    const p1 = document.getElementById('qa-panel-weight');
    const p2 = document.getElementById('qa-panel-meal');
    if (id === 'weight') {
        p1.classList.toggle('hidden');
        p2.classList.add('hidden');
    } else if (id === 'meal') {
        p2.classList.toggle('hidden');
        p1.classList.add('hidden');
    } else {
        p1.classList.add('hidden');
        p2.classList.add('hidden');
    }
}

function quickSaveLog(dateStr) {
    if (!S.daily[dateStr]) S.daily[dateStr] = { weight: '', food: '' };
    S.daily[dateStr].weight = document.getElementById('quick_weight').value;
    S.daily[dateStr].food = document.getElementById('quick_food').value;
    sv();
    
    syncDailyLogToCloud(dateStr, S.daily[dateStr].weight, S.daily[dateStr].food, window.quickPhotoB64, window.quickPhotoMime);
    window.quickPhotoB64 = null;
    toggleQaPanel('hideall');
    rO(document.getElementById('app')); 
}

function handleQuickPhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            window.quickPhotoB64 = evt.target.result.split(',')[1];
            window.quickPhotoMime = file.type;
            document.getElementById('quick_photo_status').innerText = "✓ Attached";
        };
        reader.readAsDataURL(file);
    }
}

function triggerEODAgent() {
    const dateStr = fmy(new Date());
    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: 'run_eod_agent', date: dateStr })
    }).catch(err => console.error(err));
    alert("Day complete! End-of-Day Agent triggered. Summary and suggestions will populate shortly.");
}

// Global actions
function cW2(d) { const n = S.cw + d; if (n >= 1 && n <= 12) { S.cw = n; ren(); window.scrollTo(0, 0) } }
function gw2(w) { S.cw = w; ren(); window.scrollTo(0, 0) }
function jt() { S.cw = gcw(); ren(); window.scrollTo(0, 0) }

function tg(k) { 
    S.chk[k] = !S.chk[k]; 
    if (!S.chk[k]) delete S.chk[k]; 
    sv(); 
    ren(); 
}

function saveSet(k, index, dateStr, exName) {
    const reps = document.getElementById(`rep_${k}_${index}`).value;
    const wt = document.getElementById(`wt_${k}_${index}`).value;
    const rpe = document.getElementById(`rpe_${k}_${index}`).value;
    
    if (!wt) return alert("Please enter weight.");

    if (!S.sets[k]) S.sets[k] = [];
    S.sets[k][index] = {
        setNum: index + 1,
        reps: reps,
        weight: wt,
        rpe: rpe,
        exName: exName,
        timestamp: Date.now()
    };
    
    sv();
    
    // Sync to Apps Script asynchronously
    syncWorkoutToCloud(dateStr, exName, [S.sets[k][index]]);
    
    ren();
}

// Modals
window.closeModal = function() {
    document.getElementById('modal-container').innerHTML = '';
}

window.showRpeModal = function() {
    const mc = document.getElementById('modal-container');
    mc.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-close" onclick="closeModal()">×</div>
            <div class="modal-title">RPE Scale (Rate of Perceived Exertion)</div>
            <div style="display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--text2);">
                <p><strong style="color:var(--text);">1 - Very Light</strong>: Easy effort, warming up.</p>
                <p><strong style="color:var(--text);">2 - Light</strong>: Can maintain easily, moderate breathing.</p>
                <p><strong style="color:var(--accent);">3 - Moderate</strong>: Hard but doable. (Could do 4+ more reps)</p>
                <p><strong style="color:var(--orange);">4 - Hard</strong>: Very challenging. (Could only do 1-2 more reps)</p>
                <p><strong style="color:var(--red);">5 - Max Effort</strong>: Total failure or near failure. (0 reps left in the tank)</p>
            </div>
        </div>
    </div>`;
}

window.showDiagramModal = function(exName) {
    const mc = document.getElementById('modal-container');
    
    // We expect the image to map to the sanitized exercise name
    // e.g. "Slider Body Saw" -> "slider_body_saw.webp"
    const imgName = exName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    
    mc.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-close" onclick="closeModal()">×</div>
            <div class="modal-title">${exName}</div>
            <img src="assets/diagrams/${imgName}.png" class="modal-image" alt="Diagram for ${exName}" onerror="this.src=''; this.alt='Diagram generated image missing - we will generate it shortly.'">
        </div>
    </div>`;
}

// Init
S.cw = gcw(); history.replaceState({ v: 'o', dy: null }, ''); ren();
