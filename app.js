const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginWithGitHub() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

// FUNCIONES DE PERFIL
async function changeDisplayName() {
    const newName = prompt("Enter your new creator name:");
    if (!newName) return;
    await supabaseClient.auth.updateUser({ data: { full_name: newName } });
    location.reload();
}

async function uploadAvatar(event) {
    const file = event.target.files[0];
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!file || !user) return;
    const filePath = `${user.id}-${Date.now()}`;
    await supabaseClient.storage.from('profiles').upload(filePath, file);
    const { data: { publicUrl } } = supabaseClient.storage.from('profiles').getPublicUrl(filePath);
    await supabaseClient.auth.updateUser({ data: { avatar_url: publicUrl } });
    location.reload();
}

// ACTUALIZAR INTERFAZ
async function checkUser() {
    // Si hay un error en la URL, lo limpiamos para que no moleste
    if (window.location.href.includes("error=")) {
        console.log("Error detectado en la URL, limpiando...");
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    const container = document.getElementById('userAuthContainer');

    if (user && container) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        const name = user.user_metadata.full_name || user.user_metadata.user_name || 'New Creator';

        container.innerHTML = `
            <div class="profile-wrap" style="position: relative; display:inline-block;">
                <img src="${avatar}" id="profBtn" style="width:40px; height:40px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer; object-fit:cover;">
                <div id="profMenu" style="display:none; position:absolute; right:0; background:#161b22; border:1px solid #333; padding:15px; border-radius:10px; width:200px; z-index:1000; text-align:left; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <p style="margin:0; color:#00d4ff; font-weight:bold;">${name}</p>
                    <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                    <button onclick="changeDisplayName()" style="background:none; border:none; color:#fff; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0;">✏️ Edit Name</button>
                    <label style="color:#fff; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0;">
                        📸 Change Photo
                        <input type="file" hidden accept="image/*" onchange="uploadAvatar(event)">
                    </label>
                    <button onclick="logout()" style="background:none; border:none; color:#ff4b4b; cursor:pointer; font-size:0.8rem; display:block; padding:5px 0; margin-top:10px;">Logout</button>
                </div>
            </div>`;

        document.getElementById('profBtn').onclick = () => {
            const menu = document.getElementById('profMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        };
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
