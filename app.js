const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// --- AUTH ---
async function handleLogin() { await puter.auth.signIn(); location.reload(); }
function handleLogout() { puter.auth.signOut(); location.reload(); }

async function editName() {
    const n = prompt("New Creator Name:");
    if (n) { await puter.kv.set('user_name', n); location.reload(); }
}

async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        await puter.kv.set('user_avatar', e.target.result);
        location.reload();
    };
    reader.readAsDataURL(file);
}

// --- SISTEMA DE PACKS REAL ---
async function publishPack() {
    const name = document.getElementById('pName').value;
    const res = document.getElementById('pRes').value;
    const yt = document.getElementById('pYt').value;
    
    // Obtener Tags seleccionados
    const selectedTags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(cb => cb.value);

    if (!name) return alert("Please enter a Pack Name!");

    const user = await puter.auth.getUser();
    const creator = await puter.kv.get('user_name') || user.username;

    const newPack = {
        name,
        res,
        yt,
        tags: selectedTags,
        creator,
        date: Date.now(),
        stars: 0
    };

    let list = await puter.kv.get('community_packs') || [];
    list.unshift(newPack);
    await puter.kv.set('community_packs', list);

    alert("¡Pack Published Successfully!");
    window.location.href = "discover.html";
}

// --- CARGAR CONTENIDO DINÁMICO ---
async function loadContent() {
    const packs = await puter.kv.get('community_packs') || [];
    const grid = document.getElementById('packsGrid');
    const tbody = document.getElementById('leaderboardBody');

    // 1. Discover / Home
    if (grid) {
        grid.innerHTML = packs.length ? packs.map(p => `
            <div class="pack-card">
                <div class="pack-img" style="display:flex; align-items:center; justify-content:center; background:#0d1117; height:150px; color:#222;">No Preview</div>
                <div class="pack-info">
                    <h3 style="margin:0; color:var(--neon);">${p.name}</h3>
                    <p style="font-size:0.8rem; color:#8b949e;">by ${p.creator} | ${p.res}</p>
                    <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:5px;">
                        ${p.tags ? p.tags.map(t => `<span style="font-size:0.6rem; background:rgba(0,212,255,0.1); color:var(--neon); padding:2px 6px; border-radius:4px;">${t}</span>`).join('') : ''}
                    </div>
                </div>
            </div>
        `).join('') : '<p style="color:#444;">No packs uploaded yet.</p>';
    }

    // 2. Leaderboard REAL (Sin nombres falsos)
    if (tbody) {
        const stats = {};
        packs.forEach(p => stats[p.creator] = (stats[p.creator] || 0) + 1);
        const sorted = Object.keys(stats).map(name => ({name, count: stats[name]})).sort((a,b) => b.count - a.count);
        
        tbody.innerHTML = sorted.length ? sorted.map((c, i) => `
            <tr>
                <td>#${i+1}</td>
                <td><strong>${c.name}</strong></td>
                <td>${c.count} Packs</td>
                <td style="color:#ffd700;">★ 0</td>
            </tr>
        `).join('') : '<tr><td colspan="4">No creators yet.</td></tr>';
    }
}

// --- INIT ---
async function initApp() {
    const container = document.getElementById('userAuthContainer');
    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        const name = await puter.kv.get('user_name') || user.username;
        const avatar = await puter.kv.get('user_avatar') || 'https://via.placeholder.com/100';
        
        if (container) {
            container.innerHTML = `
                <div class="profile-wrapper">
                    <img src="${avatar}" class="nav-avatar" id="navAvatarBtn">
                    <div class="profile-card" id="profileCard">
                        <div class="avatar-big-wrapper">
                            <img src="${avatar}" class="avatar-big">
                            <label for="fIn" class="camera-overlay">📷<input type="file" id="fIn" hidden onchange="uploadPhoto(event)"></label>
                        </div>
                        <h3 class="display-name">${name}</h3>
                        <button onclick="editName()" class="opt-btn">✏️ Edit Name</button>
                        <button onclick="handleLogout()" class="opt-btn logout-btn">Logout</button>
                    </div>
                </div>`;
            document.getElementById('navAvatarBtn').onclick = (e) => { 
                e.stopPropagation(); 
                document.getElementById('profileCard').classList.toggle('show'); 
            };
            document.onclick = () => document.getElementById('profileCard')?.classList.remove('show');
        }
        if (document.getElementById('uploadForm')) document.getElementById('uploadForm').style.display = 'block';
        if (document.getElementById('loginRequiredMessage')) document.getElementById('loginRequiredMessage').style.display = 'none';
    } else {
        if (c
