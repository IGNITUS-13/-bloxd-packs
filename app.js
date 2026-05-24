const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// FUNCIÓN DE LOGIN (Usando la dirección actual automáticamente)
async function loginWithGitHub() {
    // Esto detecta si estás en el index, discover o donde sea y crea el link perfecto
    const rootUrl = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/';
    
    console.log("Intentando volver a:", rootUrl);

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: rootUrl 
        }
    });
    if (error) alert("Error: " + error.message);
}

// FUNCIÓN DE LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

// COMPROBAR USUARIO
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const btn = document.getElementById('loginBtn');

    if (user && btn) {
        btn.innerText = "Logout";
        btn.style.color = "#ff4b4b";
        btn.style.borderColor = "#ff4b4b";
        btn.onclick = logout;
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
