// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "sb_publishable_bcnxOIHnI9j_rh7Wcu8IkA_S_S_4hYI"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Ignitus Packs conectado!");

// --- FUNCIÓN PARA LOGIN CON GITHUB ---
async function loginWithGitHub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
            // Esto hace que después de loguearte vuelvas a tu página
            redirectTo: window.location.origin + window.location.pathname
        }
    });
    if (error) console.error("Error en login:", error.message);
}

// --- FUNCIÓN PARA CERRAR SESIÓN ---
async function logout() {
    await supabaseClient.auth.signOut();
    location.reload();
}

// COMPROBAR SI HAY UN USUARIO LOGUEADO AL CARGAR LA PÁGINA
window.onload = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const loginBtn = document.getElementById('loginBtn');

    if (user && loginBtn) {
        // Si el usuario está dentro, el botón dirá "Logout"
        loginBtn.innerText = "Logout";
        loginBtn.style.borderColor = "#ff4b4b";
        loginBtn.style.color = "#ff4b4b";
        loginBtn.onclick = logout;
        console.log("Sesión iniciada:", user.email);
    }
};
