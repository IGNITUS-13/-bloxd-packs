// TU APP ID DE PUTER
const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// FUNCIÓN DE LOGIN (Abre la ventana con Google, GitHub, etc.)
async function handleLogin() {
    try {
        await puter.auth.signIn();
        location.reload();
    } catch (err) {
        console.log("Login cancelado");
    }
}

// FUNCIÓN DE LOGOUT
function handleLogout() {
    puter.auth.signOut();
    location.reload();
}

// SENSOR DE USUARIO
async function checkUser() {
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (puter.auth.isSignedIn()) {
        // SI ESTÁ LOGUEADO
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
    } else {
        // SI NO ESTÁ LOGUEADO
        if (authContainer) {
            authContainer.innerHTML = `<button onclick="handleLogin()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
