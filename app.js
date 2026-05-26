const APP_ID = "app-342aac80-710a-4d32-92a7-576ffae95775";

// FUNCIONES DE ACCESO
async function handleLogin() {
    await puter.auth.signIn();
    location.reload();
}

function handleLogout() {
    puter.auth.signOut();
    location.reload();
}

// CAMBIAR NOMBRE (Actualización instantánea)
async function editName() {
    const newName = prompt("Enter your new creator name:");
    if (newName && newName.trim() !== "") {
        const cleanedName = newName.trim();
        await puter.kv.set('user_name', cleanedName);
        
        // Actualizar en la pantalla de inmediato
        const nameLabel = document.querySelector('.display-name');
        if (nameLabel) nameLabel.innerText = cleanedName;
    }
}

// CAMBIAR FOTO (Actualización instantánea + Círculos)
async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageUrl = e.target.result;
        
        // Guardar en la base de datos de Puter
        await puter.kv.set('user_avatar', imageUrl);
        
        // Actualizar todas las fotos en la pantalla de inmediato
        const navAvatar = document.getElementById('navAvatarBtn');
        const avatarBig = document.querySelector('.avatar-big');
        
        if (navAvatar) navAvatar.src = imageUrl;
        if (avatarBig) avatarBig.src = imageUrl;
    };
    reader.readAsDataURL(file);
}

// CONSTRUIR LA INTERFAZ
async function initApp() {
    const container = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        
        const savedName = await puter.kv.get('user_name') || user.username;
        const savedAvatar = await puter.kv.get('user_avatar') || 'https://via.placeholder.com/100?text=User';

        if (container) {
            container.innerHTML = `
                <div class="profile-wrapper">
                    <img src="${savedAvatar}" class="nav-avatar" id="navAvatarBtn">
                    <div class="profile-card" id="profileCard">
                        <div class="avatar-big-wrapper">
                            <img src="${savedAvatar}" class="avatar-big">
                            <label for="fileInput" class="camera-overlay">
                                <span>📷</span>
                                <input type="file" id="fileInput" hidden accept="image/*" onchange="uploadPhoto(event)">
                            </label>
                        </div>
                        <h3 class="display-name">${savedName}</h3>
                        <p class="user-email">${user.email || 'Bloxd Creator'}</p>
                        <button onclick="editName()" class="opt-btn">✏️ Edit Name</button>
                        <button onclick="handleLogout()" class="opt-btn logout-btn">Logout</button>
                    </div>
                </div>
            `;

            const btn = document.getElementById('navAvatarBtn');
            const card = document.getElementById('profileCard');
            btn.onclick = (e) => { e.stopPropagation(); card.classList.toggle('show'); };
            document.onclick = () => card.classList.remove('show');
            card.onclick = (e) => e.stopPropagation();
        }

        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';

    } else {
        if (container) {
            container.innerHTML = `<button class="login-btn" onclick="handleLogin()">Login</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

async function waitForPuter() {
    while (typeof puter === 'undefined' || !puter.auth) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await waitForPuter();
    initApp();
});
