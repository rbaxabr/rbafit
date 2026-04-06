// rba | fit - Storage & Cloud Integration

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyulQM5noADYgoc5PhKuEqtzhiMtovSGBMEOvfRDK608-vTFVug-ScYK7G-WM1Q_D9R/exec";

// Global State
// chk: general completion toggle
// sets: per-set data tracking (reps, weight, rpe, notes)
// daily: daily logs
const S = { 
    cw: 1, 
    sd: null, 
    v: 'o', 
    chk: JSON.parse(localStorage.getItem('rba3_c') || '{}'),
    sets: JSON.parse(localStorage.getItem('rba3_s') || '{}'),
    daily: JSON.parse(localStorage.getItem('rba3_d') || '{}')
};

function sv() { 
    localStorage.setItem('rba3_c', JSON.stringify(S.chk)); 
    localStorage.setItem('rba3_s', JSON.stringify(S.sets)); 
    localStorage.setItem('rba3_d', JSON.stringify(S.daily));
}

// Function to sync a completed exercise (all its sets) to Apps Script
function syncWorkoutToCloud(dateStr, exerciseName, setsData) {
    if (!setsData || setsData.length === 0) return;

    const payload = {
        type: 'workout',
        sets: setsData.map(s => ({
            date: dateStr,
            exercise_name: exerciseName,
            set_number: s.setNum,
            reps: s.reps,
            weight_lbs: s.weight,
            rpe: s.rpe,
            notes: s.notes || ""
        }))
    };

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Cloud sync failed:", err));
}

// Function to fetch active data/summaries
function fetchStateFromCloud(dateStr, callback) {
    // We cannot easily use no-cors to read JSON back from Apps Script directly without issues in Safari if not setup perfectly as JSONP or with exact headers.
    // Assuming CORS is enabled globally by the server's doOptions.
    const payload = { type: 'fetch_state', date: dateStr };
    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => callback(data))
    .catch(err => console.error("Fetch State Failed:", err));
}

// Function to sync Daily log to Apps Script
function syncDailyLogToCloud(dateStr, bodyWeight, foodNotes, photoBase64, photoMimeType) {
    const payload = {
        type: 'daily_log',
        date: dateStr,
        body_weight: bodyWeight,
        food_notes: foodNotes,
        photo_base64: photoBase64,
        photo_mimeType: photoMimeType
    };

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(err => console.error("Cloud sync failed:", err));
}

// File input to base64 helper
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
