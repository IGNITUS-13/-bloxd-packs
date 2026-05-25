const SUPABASE_URL = "https://prcigukboydnkmntugsp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2lndWtib3lkbmttbnR1Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzA2OTUsImV4cCI6MjA5NTIwNjY5NX0._JF8SihpTgtGyXOFRcoGmPqBYvHwlOM_3VNq1ufqQJs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. FUNCIÓN DE LOGIN (GitHub)
async function login() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { 
            redirectTo: window.location.origin + window.location.pathname 
        }
    });
    if (error) alert("Error: " + error.message);
}

// 2. FUNCIÓN DE LOGOUT
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

// 3. EL "SENSOR" DE LOGIN (Actualiza la web automáticamente)
supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    const authContainer = document.getElementById('userAuthContainer');
    const uploadForm = document.getElementById('uploadForm');
    const loginMsg = document.getElementById('loginRequiredMessage');

    if (user) {
