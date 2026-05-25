// CONFIGURACIÓN DE PUTER - TU APP ID REAL
const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// FUNCIÓN PARA LOGIN
async function login() {
    try {
        // Puter abre la ventanita pro con Google, GitHub, Microsoft
        await puter.auth.signIn();
        location.reload(); // Recarga para aplicar los cambios
    } catch (err) {
        console.log("Login cancelado");
    }
}

// FUNCIÓN PARA LOGOUT
function logout() {
    puter.auth.signOut();
    location.reload();
}

// SENSOR DE USUARIO (Esto controla toda la web)
async function checkUser() {
    const btnContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        
        // SI ESTÁ LOGUEADO: Mostrar Logout
        if (btnContainer) {
            btnContainer.innerHTML = `
                <button onclick="logout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>
            `;
        }
        // MOSTRAR FORMULARIO EN upload.html
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
        
        console.log("¡Conectado como:", user.username);
    } else {
        // SI NO ESTÁ LOGUEADO: Mostrar Login
        if (btnContainer) {
            btnContainer.innerHTML = `
                <button onclick="login()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>
            `;
        }
        // BLOQUEAR SUBIDA
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

// Iniciar Puter y chequear usua
