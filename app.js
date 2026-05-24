// 1. CONEXIÓN (USANDO TUS DATOS REALES)
const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. FUNCIÓN DE LOGIN (DIRECCIÓN EXACTA)
async function loginWithGitHub() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            // Esta es la dirección que GitHub buscará al terminar
            redirectTo: "https://ignitus-13.github.io/-bloxd-packs/" 
        }
    });
    if (error) alert("Error de Login: " + error.message);
}

// 3. FUNCIÓN DE LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// 4. ACTUALIZAR BOTÓN AL CARGAR
async function updateAuthUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');

    if (user && authContainer) {
        // SI ESTÁ LOGUEADO: Mostrar Logout
        authContainer.innerHTML = `
            <button onclick="logout()" style="background:transparent; color:#ff4b4b; border:1px solid #ff4b4b; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">Logout</button>
        `;
        console.log("Sesión iniciada:", user.email);
    } else if (authContainer) {
        // SI NO ESTÁ LOGUEADO: Mostrar Login
        authContainer.innerHTML = `
            <button class="login-btn" onclick="loginWithGitHub()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>
        `;
    }
}

window.onload = updateAuthUI;
