// CONFIGURACIÓN DE SUPABASE (YA TIENE TU LLAVE REAL)
const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// FUNCIÓN DE LOGIN (Link corregido con el guion)
async function loginWithGitHub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: "https://ignitus-13.github.io/-bloxd-packs/" 
        }
    });
    if (error) alert("Error: " + error.message);
}

// LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// LÓGICA DE ETIQUETAS (DISCOVER)
let selectedTags = [];
function toggleTag(tagElement) {
    const tag = tagElement.innerText;
    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        tagElement.classList.remove('active-tag');
    } else {
        selectedTags.push(tag);
        tagElement.classList.add('active-tag');
    }
}

// ACTUALIZAR INTERFAZ GLOBAL
async function updateAuthUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');

    if (user && authContainer) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        authContainer.innerHTML = `
            <div class="profile-container" style="position: relative;">
                <img src="${avatar}" class="nav-avatar" id="avatarClick" style="width:35px; height:35px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer;">
                <div id="profileDropdown" class="dropdown-content" style="display:none; position:absolute; right:0; background:#0d1117; border:1px solid #00d4ff33; padding:15px; border-radius:10px; min-width:180px; z-index:1001; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <p style="margin:0; color:#00d4ff; font-weight:bold;">${user.user_metadata.full_name || 'Creator'}</p>
                    <p style="font-size:0.75rem; color:#8b949e; margin:5px 0;">Stats: 0 Packs | ★ 0</p>
                    <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                    <a href="#" onclick="logout()" style="color:#ff4b4b; text-decoration:none; font-size:0.8rem; display:block; margin-top:10px;">Logout</a>
                </div>
            </div>
        `;
        document.getElementById('avatarClick').onclick = () => {
            const dd = document.getElementById('profileDropdown');
            dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        };
    } else if (authContainer) {
        authContainer.innerHTML = `<button class="login-btn" onclick="loginWithGitHub()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>`;
    }
}

window.onload = updateAuthUI;
