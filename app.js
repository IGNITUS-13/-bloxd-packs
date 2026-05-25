const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginWithGitHub() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: "https://ignitus-13.github.io/-bloxd-packs/" }
    });
    if (error) alert("Error: " + error.message);
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
}

async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        if (authContainer) {
            authContainer.innerHTML = `
                <div class="profile-container" style="position:relative;">
                    <img src="${avatar}" id="profBtn" style="width:35px; height:35px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer;">
                    <div id="profMenu" style="display:none; position:absolute; right:0; background:#161b22; border:1px solid #333; padding:15px; border-radius:10px; min-width:160px; z-index:1000; box-shadow:0 10px 30px #000;">
                        <p style="margin:0; color:#00d4ff; font-weight:bold;">${user.user_metadata.full_name || 'Creator'}</p>
                        <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
                        <button onclick="logout()" style="background:none; border:none; color:#ff4b4b; cursor:pointer; width:100%; text-align:left;">Logout</button>
                    </div>
                </div>`;
            document.getElementById('profBtn').onclick = () => {
                const m = document.getElementById('profMenu');
                m.style.display = m.style.display === 'none' ? 'block' : 'none';
            };
        }
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';
    } else {
        if (authContainer) authContainer.innerHTML = `<button class="login-btn" onclick="loginWithGitHub()">Login</button>`;
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', checkUser);
