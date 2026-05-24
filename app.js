const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. LOGIN / LOGOUT ---
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

// --- 2. SUBIR PACK A LA BASE DE DATOS ---
async function publishPack() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return alert("Please login first!");

    const name = document.getElementById('pName').value;
    const res = document.getElementById('pRes').value;
    const yt = document.getElementById('pYt').value;
    
    if(!name) return alert("Pack name is required!");

    const { error } = await supabaseClient.from('packs').insert([
        { 
            name: name, 
            resolution: res, 
            youtube_url: yt, 
            creator: user.user_metadata.full_name,
            stars: 0 
        }
    ]);

    if (error) alert("Error: " + error.message);
    else {
        alert("Pack Published Successfully!");
        window.location.href = "discover.html";
    }
}

// --- 3. MOSTRAR Y BUSCAR PACKS (DISCOVER) ---
async function loadPacks(searchTerm = "") {
    const display = document.getElementById('packsGrid');
    if (!display) return;

    // Pedir packs a Supabase (ordenados por el más nuevo)
    let query = supabaseClient.from('packs').select('*').order('created_at', { ascending: false });

    if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data: packs, error } = await query;

    if (error) return console.error(error);

    if (packs.length === 0) {
        display.innerHTML = `<p style="color:#444">No packs found...</p>`;
        return;
    }

    display.innerHTML = packs.map(pack => `
        <div class="pack-card">
            <div class="pack-img">Banner</div>
            <div class="pack-content">
                <h3 style="margin:0; color:#00d4ff;">${pack.name}</h3>
                <p style="font-size:0.8rem; color:#8b949e;">by ${pack.creator} | ${pack.resolution}</p>
                <div style="display:flex; justify-content:space-between; margin-top:15px;">
                    <button class="action-btn">★ ${pack.stars}</button>
                    <button class="action-btn" onclick="window.open('${pack.youtube_url}')">Video</button>
                    <button class="action-btn" style="background:#00d4ff; color:#000;">Download</button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- 4. ACTUALIZAR INTERFAZ AL CARGAR ---
window.onload = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authContainer = document.getElementById('userAuthContainer');

    // Manejar Login UI
    if (user && authContainer) {
        const avatar = user.user_metadata.avatar_url || 'https://via.placeholder.com/40';
        authContainer.innerHTML = `
            <img src="${avatar}" style="width:35px; border-radius:50%; border:2px solid #00d4ff; cursor:pointer;" onclick="logout()">
        `;
    }

    // Si estamos en Discover, cargar los packs
    if (window.location.pathname.includes("discover.html")) {
        loadPacks();
        document.getElementById('pSearch').oninput = (e) => loadPacks(e.target.value);
    }
};
