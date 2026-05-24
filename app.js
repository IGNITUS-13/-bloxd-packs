const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. LOGIN / LOGOUT ---
async function loginWithGitHub() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

// --- 2. CAMBIAR NOMBRE ---
async function changeDisplayName() {
    const newName = prompt("Enter your new creator name:");
    if (!newName) return;

    const { error } = await supabaseClient.auth.updateUser({
        data: { full_name: newName }
    });

    if (error) alert(error.message);
    else location.reload();
}

// --- 3. CAMBIAR FOTO DE PERFIL ---
async function uploadAvatar(event) {
    const file = event.target.files[0];
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = fileName;

    // Subir a Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
        .from('profiles')
        .upload(filePath, file);

    if (uploadError) return alert("Error uploading: " + uploadError.message);

    // Obtener URL de la imagen
    const { data: { publicUrl } } = supabaseClient.storage.from('profiles').getPublicUrl(filePath);

    // Guardar URL en el perfil del usuario
    await supabaseClient.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    location.reload();
}

// --- 4. ACTUALIZAR INTERFAZ ---
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const container = document.getElementById('userAuthContainer');

    if (user && container) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        const name = user.user_metadata.full_name || 'New Creator';

        container.innerHTML = `
            <div class="profile-wrap" style="position: relative; display:inline-block;">
                <img src="${avatar}" id="profBtn" style="width:40px; height:40px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer; object-fit:cover;">
                <div id="profMenu" style="display:none; position:absolute; right:0; background:#161b22; border:1px solid #333; padding:15px; border-radius:10px; width:200px; z-index:1000; text-align:left; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <p style="margin:0; color:#00d4ff; font-weight:bold;">${name}</p>
                    <p style="font-size:0.7rem; color:#8b949e; margin-bottom:10px;">Creator Profile</p>
                    <hr style="border:0; border-top:1px solid #333;">
                    <button onclick="changeDisplayName()" style="background:none; border:none; color:#fff; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0;">✏️ Edit Name</button>
                    <label style="color:#fff; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0;">
                        📸 Change Photo
                        <input type="file" hidden accept="image/*" onchange="uploadAvatar(event)">
                    </label>
                    <button onclick="logout()" style="background:none; border:none; color:#ff4b4b; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0; margin-top:10px;">Logout</button>
                </div>
            </div>
        `;

        document.getElementById('profBtn').onclick = () => {
            const menu = document.getElementById('profMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        };
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
