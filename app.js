const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LOGIN - Detecta la URL automáticamente
async function loginWithGitHub() {
    const currentUrl = window.location.origin + window.location.pathname;
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: currentUrl }
    });
    if (error) alert("Error: " + error.message);
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

// ESTA FUNCIÓN SE ENCARGA DE MOSTRAR EL BOTÓN O EL FORMULARIO
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    const btn = document.getElementById('loginBtn');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (user) {
        // SI EL USUARIO EXISTE
        if (btn) {
            btn.innerText = "Logout";
            btn.style.borderColor = "#ff4b4b";
            btn.onclick = logout;
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
    } else {
        // SI NO HAY USUARIO
        if (btn) {
            btn.innerText = "Login";
            btn.style.borderColor = "#00d4ff";
            btn.onclick = loginWithGitHub;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', checkUser);
