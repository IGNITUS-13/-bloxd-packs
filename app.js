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

// Cargar datos del leaderboard de creadores
async function loadLeaderboard() {
    const creators = [
        { rank: 1, name: 'Creator1', packs: 15, stars: 342 },
        { rank: 2, name: 'Creator2', packs: 12, stars: 298 },
        { rank: 3, name: 'IGNITUS', packs: 8, stars: 156 }
    ];

    const leaderboardBody = document.getElementById('leaderboardBody');
    if (leaderboardBody) {
        leaderboardBody.innerHTML = creators.map(c => `
            <tr>
                <td>${c.rank}</td>
                <td>${c.name}</td>
                <td>${c.packs}</td>
                <td>⭐ ${c.stars}</td>
            </tr>
        `).join('');
    }
}

// CONSTRUIR LA INTERFAZ
async function initApp() {
    const container = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');
    const leaderboardBody = document.getElementById('leaderboardBody');

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
            if (btn && card) {
                btn.onclick = (e) => { e.stopPropagation(); card.classList.toggle('show'); };
                document.onclick = () => card.classList.remove('show');
                card.onclick = (e) => e.stopPropagation();
            }
        }

        // MOSTRAR FORMULARIOS DE UPLOAD
        if (uploadForm) uploadForm.style.display = 'block';
        if (loginMsg) loginMsg.style.display = 'none';

        // Cargar datos de creadores
        if (leaderboardBody) {
            await loadLeaderboard();
        }

    } else {
        if (container) {
            container.innerHTML = `<button class="login-btn" onclick="handleLogin()">Login</button>`;
        }
        if (uploadForm) uploadForm.style.display = 'none';
        if (loginMsg) loginMsg.style.display = 'block';
    }
}

// Esperar a que Puter cargue
async function waitForPuter() {
    while (typeof puter === 'undefined' || !puter.auth) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Iniciar la app cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
    await waitForPuter();
    initApp();
});


// ==========================================
// NUEVA FUNCIÓN: ACCIÓN DEL BOTÓN PUBLISH PACK
// ==========================================
document.addEventListener('click', async (event) => {
    if (event.target && event.target.classList.contains('publish-btn')) {
        event.preventDefault();

        // Capturar los valores del formulario de forma segura
        const packNameInput = document.getElementById('pName');
        const packName = packNameInput ? packNameInput.value.trim() : '';
        
        const packResolutionInput = document.getElementById('pRes');
        const packResolution = packResolutionInput ? packResolutionInput.value : '16x16';
        
        const youtubeInput = document.querySelector('input[type="url"]');
        const youtubeUrl = youtubeInput ? youtubeInput.value.trim() : '';

        // Validar que el campo obligatorio de nombre no esté vacío
        if (!packName) {
            alert("Please enter a Pack Name before publishing.");
            return;
        }

        // Capturar las etiquetas que el usuario seleccionó
        const selectedTags = [];
        const checkboxes = document.querySelectorAll('.tags-grid input[type="checkbox"]');
        checkboxes.forEach(box => {
            if (box.checked) {
                selectedTags.push(box.parentElement.innerText.trim());
            }
        });

        // Feedback visual en el botón
        const originalText = event.target.innerText;
        event.target.innerText = "PUBLISHING...";
        event.target.disabled = true;

        try {
            // Obtener packs existentes de Puter KV
            const existingPacksRaw = await puter.kv.get('uploaded_packs');
            let packsList = [];
            if (existingPacksRaw) {
                packsList = JSON.parse(existingPacksRaw);
            }

            // Obtener nombre del creador activo
            const nameLabel = document.querySelector('.display-name');
            const creatorName = nameLabel ? nameLabel.innerText : 'Unknown';

            // Estructura del nuevo pack a guardar
            const newPack = {
                id: 'pack-' + Date.now(),
                name: packName,
                resolution: packResolution,
                youtube: youtubeUrl,
                tags: selectedTags,
                creator: creatorName,
                date: new Date().toLocaleDateString()
            };

            // Guardar lista actualizada en Puter
            packsList.push(newPack);
            await puter.kv.set('uploaded_packs', JSON.stringify(packsList));

            alert("🚀 Pack published successfully!");
            
            // Limpiar el formulario tras publicar exitosamente
            if (packNameInput) packNameInput.value = '';
            if (youtubeInput) youtubeInput.value = '';
            checkboxes.forEach(box => box.checked = false);

        } catch (error) {
            console.error("Error saving pack:", error);
            alert("❌ Error publishing pack. Please try again.");
        } finally {
            // Restaurar estado del botón
            event.target.innerText = originalText;
            event.target.disabled = false;
        }
    }
});
