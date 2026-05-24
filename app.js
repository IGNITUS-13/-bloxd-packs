const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "TU_LLAVE_ANON_PUBLIC_AQUI"; // <--- PEGA TU LLAVE AQUÍ
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// LOGIN
async function loginWithGitHub() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

// LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// ACTUALIZAR INTERFAZ
async function updateAuthUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');
    if (!authContainer) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        authContainer.innerHTML = `
            <div class="profile-container">
                <img src="${avatar}" class="nav-avatar" id="avatarClick">
                <div id="profileDropdown" class="dropdown-content">
                    <p style="margin:0; color:#00d4ff; font-weight:bold;">${user.user_metadata.full_name || 'Creator'}</p>
                    <p style="font-size:0.7rem; color:#8b949e;">Stats: 0 Packs | ★ 0</p>
                    <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                    <a href="#" onclick="logout()" style="color:#ff4b4b; text-decoration:none; font-size:0.8rem;">Logout</a>
                </div>
            </div>
        `;
        document.getElementById('avatarClick').onclick = () => {
            document.getElementById('profileDropdown').classList.toggle('show');
        };
    }
}

window.onload = updateAuthUI;
