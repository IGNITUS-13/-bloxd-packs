// 1. CONFIGURACIÓN DE PUTER (TU APP ID)
const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// 2. FUNCIONES DE LOGIN / LOGOUT
async function handleLogin() {
    try {
        await puter.auth.signIn();
        location.reload();
    } catch (err) {
        console.log("Login canceled");
    }
}

function handleLogout() {
    puter.auth.signOut();
    location.reload();
}

// 3. CARGAR LEADERBOARD (TABLA DE CREADORES)
async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    tbody.innerHTML = `
        <tr>
            <td>#1</td>
            <td><strong>IGNITUS-13</strong></td>
            <td>0 Packs</td>
            <td style="color:#00d4ff;">★ 0</td>
        </tr>
        <tr>
            <td colspan="4" style="color:#444; font-size:0.8rem; padding:20px;">
                Waiting for more creators...
            </td>
        </tr>
    `;
}

// 4. CARGAR PACKS (PÁGINA DISCOVER)
async function loadDiscover() {
    const grid = document.getElementById('packsGrid');
    if (!grid) return;
    grid.innerHTML = `<p style="color:#555;">No packs uploaded yet.</p>`;
}

// 5. FUNCIÓN PRINCIPAL QUE CONTROLA LA INTERFAZ
async function initApp() {
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (puter.auth.isSignedIn()) {
        // SI ESTÁ LOGUEADO
        const user = await puter.auth.getUser();
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
        console.log("Connectado como:", user.username);
    } else {
        // SI NO ESTÁ LOGUEADO
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogin()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
    
    // Cargar contenido de las páginas
    loadLeaderboard();
    loadDiscover();
}

// --- EL CÓDIGO QUE ME DISTE: ESPERAR A QUE PUTER ESTÉ LISTO ---
async function waitForPuter() {
    while (typeof puter === 'undefined' || !puter.auth) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Waiting for Puter...");
    await waitForPuter();
    console.log("Puter ready! Initializing app...");
    initApp();
});
