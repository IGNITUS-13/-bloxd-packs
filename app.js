const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// --- PERFIL Y AUTH ---
async function handleLogin() { await puter.auth.signIn(); location.reload(); }
function handleLogout() { puter.auth.signOut(); location.reload(); }

async function editName() {
    const n = prompt("New Name:");
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

// --- LÓGICA DE PACKS (SUBIR) ---
async function publishPack() {
    const name = document.getElementById('pName').value;
    const res = document.getElementById('pRes').value;
    if (!name) return alert("Enter pack name!");

    const user = await puter.auth.getUser();
    const creator = await puter.kv.get('user_name') || user.username;

    const newPack = { name, res, creator, date: Date.now(), stars: 0 };
    let list = await puter.kv.get('community_packs') || [];
    list.unshift(newPack); // Poner al principio
    await puter.kv.set('community_packs', list);

    alert("Pack Published!");
    window.location.href = "discover.html";
}

// --- CARGAR DATOS EN LAS PÁGINAS ---
async function loadContent() {
    const packs = await puter.kv.get('community_packs') || [];
    const grid = document.getElementById('packsGrid');
    const tbody = document.getElementById('leaderboardBody');

    // 1. Mostrar Packs (Home/Discover)
    if (grid) {
        grid.innerHTML = packs.length ? packs.map(p => `
            <div class="pack-card">
                <div class="pack-img" style="display:flex; align-items:center; justify-content:center; color:#222">No Preview</div>
                <div class="pack-info">
                    <h3 style="margin:0; color:var(--neon)">${p.name}</h3>
                    <p style="font-size:0.8rem; color:#8b949e">by ${p.creator} | ${p.res}</p>
                </div>
            </div>
        `).join('') : '<p>No packs yet.</p>';
    }

    // 2. Leaderboard Real
    if (tbody) {
        const stats = {};
        packs.forEach(p => stats[p.creator] = (stats[p.creator] || 0) + 1);
        const sorted = Object.keys(stats).map(name => ({name, count: stats[name]})).sort((a,b) => b.count - a.count);
        tbody.innerHTML = sorted.map((c, i) => `
            <tr><td>${i+1}</td><td>${c.name}</td><td>${c.count}</td><td>⭐ 0</td></tr>
        `).join('');
    }
}

// --- INICIALIZAR ---
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
            document.getElementById('navAvatarBtn').onclick = (e) => { e.stopPropagation(); document.getElementById('profileCard').classList.toggle('show'); };
        }
        if (document.getElementById('uploadForm')) document.getElementById('uploadForm').style.display = 'block';
        if (document.getElementById('loginRequiredMessage')) document.getElementById('loginRequiredMessage').style.display = 'none';
    } else {
        if (container) container.innerHTML = `<button class="login-btn" onclick="handleLogin()">Login</button>`;
    }
    loadContent();
}

document.addEventListener('DOMContentLoaded', async () => {
    while (typeof puter === 'undefined' || !puter.auth) await new Promise(r => setTimeout(r, 100));
    initApp();
});
