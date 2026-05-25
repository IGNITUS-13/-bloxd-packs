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

// 3. FUNCIÓN PARA CARGAR LA TABLA DE CREADORES (LEADERBOARD)
async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return; // Si no estamos en la página de creators, no hace nada

    // Por ahora, como estamos empezando, pondremos unos datos de ejemplo
    // Pero estos ya los escribe el "cerebro" automáticamente
    tbody.innerHTML = `
        <tr>
            <td>#1</td>
            <td><strong>IGNITUS-13</strong></td>
            <td>0 Packs</td>
            <td style="color:#ffd700;">★ 0</td>
        </tr>
        <tr>
            <td colspan="4" style="color:#444; font-size:0.8rem; padding:40px;">
                Waiting for more creators to join...
            </td>
        </tr>
    `;
}

// 4. FUNCIÓN PARA CARGAR LOS PACKS (DISCOVER)
async function loadDiscover() {
    const grid = document.getElementById('packsGrid');
    if (!grid) return;

    // Mensaje de que aún no hay packs reales subidos
    grid.innerHTML = `<p style="color:#555; grid-column: 1/-1;">No packs found. Be the first to upload one!</p>`;
}

// 5. SENSOR DE USUARIO Y CONTROLADOR DE PÁGINAS
async function initApp() {
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    // Revisar si el usuario entró
    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
        console.log("Conectado como:", user.username);
    } else {
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogin()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }

    // Cargar contenido según la página
    loadLeaderboard();
    loadDiscover();
}

// Ejecutar todo cuando la web esté lista
document.addEventListener('DOMContentLoaded', initApp);
