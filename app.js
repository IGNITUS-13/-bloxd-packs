// 1. CONFIGURACIÓN DE PUTER
const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// 2. FUNCIONES DE LOGIN / LOGOUT
async function handleLogin() {
    try {
        await puter.auth.signIn();
        location.reload();
    } catch (err) {
        console.log("Login cancelado");
    }
}

function handleLogout() {
    puter.auth.signOut();
    location.reload();
}

// 3. FUNCIÓN PARA CARGAR LA TABLA DE CREADORES
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
            <td colspan="4" style="color:#444; font-size:0.8rem; padding:40px;">
                Waiting for more creators to join...
            </td>
        </tr>
    `;
}

// 4. FUNCIÓN PARA CARGAR LOS PACKS
async function loadDiscover() {
    const grid = document.getElementById('packsGrid');
    if (!grid) return;
    grid.innerHTML = `<p style="color:#555; grid-column: 1/-1;">No packs found. Be the first to upload one!</p>`;
}

// 5. INICIALIZADOR DE LA INTERFAZ
async function initApp() {
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
        console.log("Logged in as:", user.username);
    } else {
        if (aut
