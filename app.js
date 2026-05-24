// 1. CONFIGURACIÓN
const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. FUNCIONES DE USUARIO
async function loginWithGitHub() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: "https://ignitus-13.github.io/-bloxd-packs/" }
    });
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// CAMBIAR FOTO DE PERFIL
async function changeProfilePicture(event) {
    const file = event.target.files[0];
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    const { error: uploadError } = await supabaseClient.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

    if (uploadError) return alert("Error uploading photo");

    const { data: { publicUrl } } = supabaseClient.storage.from('profiles').getPublicUrl(filePath);

    await supabaseClient.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    location.reload();
}

// 3. ACTUALIZAR INTERFAZ
async function updateAuthUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');

    if (!authContainer) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        authContainer.innerHTML = `
            <div class="profile-container" style="position: relative;">
                <img src="${avatar}" class="nav-avatar" id="avatarClick" style="width:35px; height:35px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer;">
                <div id="profileDropdown" class="dropdown-content" style="display:none; position:absolute; right:0; background:#161b22; border:1px solid #00d4ff33; padding:15px; border-radius:10px; min-width:200px; z-index:1000; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <p style="margin:0; font-weight:bold; color:#00d4ff;">${user.user_metadata.full_name || 'Creator'}</p>
                    <p style="font-size:0.75rem; color:#8b949e; margin:5px 0;">Stats: 0 Packs | ★ 0</p>
                    <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                    <label for="picUpload" style="cursor:pointer; font-size:0.8rem; color:#fff; display:block;">📸 Change Profile Picture</label>
                    <input type="file" id="picUpload" hidden accept="image/*" onchange="changeProfilePicture(event)">
                    <a href="#" onclick="logout()" style="color:#ff4b4b; text-decoration:none; font-size:0.8rem; display:block; margin-top:10px;">Logout</a>
                </div>
            </div>
        `;
        document.getElementById('avatarClick').onclick = () => {
            const dd = document.getElementById('profileDropdown');
            dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
        };
    } else {
        authContainer.innerHTML = `<button class="login-btn" onclick="loginWithGitHub()" style="background:transparent; color:#00d4ff; border:1px solid #00d4ff; padding:8px 18px; border-radius:5px; cursor:pointer; font-weight:bold;">Login</button>`;
    }
}

window.onload = updateAuthUI;
