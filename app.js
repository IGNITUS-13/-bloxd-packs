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

// CAMBIAR NOMBRE
async function editName() {
    const newName = prompt("Enter your new creator name:");
    if (newName) {
        // Guardamos el nombre en el almacenamiento de Puter
        await puter.kv.set('user_name', newName);
        location.reload();
    }
}

// CAMBIAR FOTO (Simulación funcional)
async function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Convertimos la imagen a una URL que el navegador entienda
    const reader = new FileReader();
    reader.onload = async function(e) {
        const imageUrl = e.target.result;
        await puter.kv.set('user_avatar', imageUrl);
        location.reload();
    };
    reader.readAsDataURL(file);
}

// SENSOR DE USUARIO Y CONSTRUCCIÓN DE PERFIL
async function initApp() {
    const container = document.getElementById('userAuthContainer');
    if (!container) return;

    if (puter.auth.isSignedIn()) {
        const user = await puter.auth.getUser();
        
        // Recuperar nombre y foto personalizada o usar los de defecto
        const savedName = await puter.kv.get('user_name') || user.username;
        const savedAvatar = await puter.kv.get('user_avatar') || 'https://via.placeholder.com/100?text=User';

        container.innerHTML = `
            <div class="profile-wrapper">
                <!-- Foto pequeña de la Navbar -->
                <img src="${savedAvatar}" class="nav-avatar" id="navAvatarBtn">

                <!-- Ventanita de Perfil (tipo Google) -->
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
                    
                    <div class="menu-options">
                        <button onclick="editName()" class="opt-btn">✏️ Edit Name</button>
                        <button onclick="handleLogout()" class="opt-btn logout-btn">Logout</button>
                    </div>
                </div>
            </div>
        `;

        // Lógica para abrir/cerrar el menú
        const btn = document.getElementById('navAvatarBtn');
        const card = document.getElementById('profileCard');
        btn.onclick = (e) => {
            e.stopPropagation();
            card.classList.toggle('show');
        };
        document.onclick = () => card.classList.remove('show');
        card.onclick = (e) => e.stopPropagation();

    } else {
        container.innerHTML = `<button class="login-btn" onclick="handleLogin()">Login</button>`;
    }
}

// Esperar a Puter y ejecutar
async function waitForPuter() {
    while (typeof puter === 'undefined' || !puter.auth) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await waitForPuter();
    initApp();
});
