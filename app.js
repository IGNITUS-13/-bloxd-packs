const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LOGIN - TRUCO FINAL
async function loginWithGitHub() {
    // Esto obliga a GitHub a regresar exactamente a donde estás ahora
    const target = window.location.origin + window.location.pathname;
    
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: target }
    });
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const btn = document.getElementById('loginBtn');
    if (user && btn) {
        btn.innerText = "Logout";
        btn.onclick = logout;
        console.log("LOGUEADO CORRECTAMENTE");
    } else if (btn) {
        btn.onclick = loginWithGitHub;
    }
}
document.addEventListener('DOMContentLoaded', checkUser);
