const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LOGIN - DIRECCIÓN FIJA PARA MATAR EL 404
async function loginWithGitHub() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: "https://ignitus-13.github.io/-bloxd-packs/" 
        }
    });
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

// ACTUALIZAR BOTÓN EN TODAS LAS PÁGINAS
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const btn = document.getElementById('loginBtn');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (user && btn) {
        btn.innerText = "Logout";
        btn.style.color = "#ff4b4b";
        btn.style.borderColor = "#ff4b4b";
        btn.onclick = logout;
        
        // Mostrar formulario si estamos en upload.html
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
    } else {
        // Bloquear subida si no hay usuario
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
