const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "TU_API_KEY_AQUI"; 
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

// CAMBIAR FOTO DE PERFIL
async function changeProfilePicture(event) {
    const file = event.target.files[0];
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    // Subir a Storage (Asegúrate de crear el bucket 'profiles' en Supabase como público)
    const { error: uploadError } = await supabaseClient.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

    if (uploadError) return alert("Error uploading photo");

    const { data: { publicUrl } } = supabaseClient.storage.from('profiles').getPublicUrl(filePath);

    // Guardar URL en el perfil del usuario
    await supabaseClient.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    location.reload();
}

// ACTUALIZAR INTERFAZ GLOBAL
async function updateAuthUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');
    if (!authContainer) return;

    if (user) {
        // USUARIO LOGUEADO: Mostrar Avatar y Menú
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        authContainer.innerHTML = `
            <div class="profile-container">
                <img src="${avatar}" class="nav-avatar" id="avatarClick">
                <div id="profileDropdown" class="dropdown-content">
                    <p style="margin:0; color:#00d4ff; font-weight:bold;">${user.user_metadata.full_name || 'Creator'}</p>
                    <p style="font-size:0.75rem; color:#8b949e; margin:5px 0;">Stats: 0 Packs | ★ 0</p>
                    <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                    <label for="picUpload" style="cursor:pointer; font-size:0.8rem; color:#fff;">📸 Change Profile Picture</label>
                    <input type="file" id="picUpload" hidden accept="image/*" onchange="changeProfilePicture(event)">
                    <a href="#" onclick="logout()" style="color:#ff4b4b; font-size:0.8rem; display:block; margin-top:10px; text-decoration:none;">Logout</a>
                </div>
            </div>
        `;
        
        // Hacer que el menú aparezca/desaparezca
        document.getElementById('avatarClick').onclick = () => {
            document.getElementById('profileDropdown').classList.toggle('show');
        };
    } else {
        // USUARIO NO LOGUEADO: Mostrar botón de Login
        authContainer.innerHTML = `<button class="login-btn" onclick="loginWithGitHub()">Login</button>`;
        
        // Bloqueo de seguridad: Si está en la página de upload sin estar logueado, lo saca
        if (window.location.pathname.includes("upload.html")) {
            alert("Please login to upload packs!");
            window.location.href = "index.html";
        }
    }
}

window.onload = updateAuthUI;
