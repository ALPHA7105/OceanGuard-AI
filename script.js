/*
import { GoogleGenAI } from "@google/genai";
import { helix } from "ldrs";

// 1. Initialize Helix Loader
if (typeof window !== 'undefined') {
    helix.register();
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.innerHTML = '<l-helix size="60" speed="2.5" color="#38bdf8"></l-helix>';
    }
}

// 2. Global State
let activeSection = 'learn';
let currentImageBase64 = null;
let productionChart = null;
let typesChart = null;

// 3. Initialize App
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.classList.add('hidden'), 1000);
        }
    }, 2500);
    initDetectHandlers();
});

// --- Navigation ---
window.navigateTo = (section) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${section}`);
    if (targetTab) targetTab.classList.add('active-tab');

    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`section-${section}`);
    
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fadeIn');
        if (section === 'impact') {
            setTimeout(initCharts, 300);
        }
    }
    activeSection = section;
};

// --- Detection Logic ---
function initDetectHandlers() {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const analyzeBtn = document.getElementById('btn-analyze');
    const resetBtn = document.getElementById('btn-reset');

    if (!fileInput || !dropZone) return;

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    analyzeBtn.onclick = () => runAnalysis();
    resetBtn.onclick = (e) => {
        e.stopPropagation();
        currentImageBase64 = null;
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('upload-prompt').classList.remove('hidden');
        resetBtn.classList.add('hidden');
        analyzeBtn.disabled = true;
        fileInput.value = '';
        document.getElementById('results-container').innerHTML = `<p class="text-gray-400">Analysis results will appear here.</p>`;
    };
}

async function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        document.getElementById('image-preview').src = currentImageBase64;
        document.getElementById('image-preview').classList.remove('hidden');
        document.getElementById('upload-prompt').classList.add('hidden');
        document.getElementById('btn-analyze').disabled = false;
        document.getElementById('btn-reset').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// --- AI Analysis ---
async function runAnalysis() {
    if (!currentImageBase64) return;

    const resultsContainer = document.getElementById('results-container');
    const analyzeBtn = document.getElementById('btn-analyze');
    const errorContainer = document.getElementById('analysis-error');

    analyzeBtn.disabled = true;
    errorContainer.classList.add('hidden');
    resultsContainer.innerHTML = `<div class="flex flex-col items-center"><p class="animate-pulse text-sky-600 font-bold">Connecting to Gemini AI...</p></div>`;

    try {
        // FIX: Using a variable for the key properly
        const API_KEY = "AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"; 
        const genAI = new GoogleGenAI(API_KEY); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = currentImageBase64.split(',')[1];
        const result = await model.generateContent([
            "Analyze marine pollution in this image. Return ONLY a JSON object with: { \"severity\": \"low\"|\"medium\"|\"high\", \"detectedItems\": [], \"description\": \"\", \"recommendations\": [] }",
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid AI Data");
        
        renderResults(JSON.parse(jsonMatch[0]));

    } catch (err) {
        console.error(err);
        errorContainer.classList.remove('hidden');
        errorContainer.innerHTML = `<strong>Error:</strong> ${err.message}`;
        resultsContainer.innerHTML = `<div class="text-5xl opacity-20">❌</div>`;
    } finally {
        analyzeBtn.disabled = false;
    }
}

// --- NEW: Added back the missing render function ---
function renderResults(data) {
    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div class="w-full text-left space-y-4 animate-fadeIn">
            <div class="flex justify-between items-center">
                <span class="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase">${data.severity} Severity</span>
            </div>
            <p class="text-gray-600 text-sm italic border-l-4 border-sky-400 pl-4">"${data.description}"</p>
            <div class="flex flex-wrap gap-2">
                ${data.detectedItems.map(item => `<span class="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold">#${item}</span>`).join('')}
            </div>
            <div class="space-y-2">
                <h4 class="text-xs font-bold text-sky-900 uppercase tracking-widest">Recommendations</h4>
                ${data.recommendations.map(r => `<div class="text-[11px] bg-sky-50 p-2 rounded">✓ ${r}</div>`).join('')}
            </div>
        </div>
    `;
}

// --- Data Visualization ---
function initCharts() {
    const prodCanvas = document.getElementById('prodChart');
    const typeCanvas = document.getElementById('typeChart');
    if (!prodCanvas || !typeCanvas) return;

    if (productionChart) productionChart.destroy();
    if (typesChart) typesChart.destroy();

    productionChart = new Chart(prodCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['1950', '1970', '1990', '2010', '2020', '2040'],
            datasets: [{ label: 'Plastic (Tons)', data: [2, 35, 120, 310, 460, 800], backgroundColor: '#0ea5e9' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    typesChart = new Chart(typeCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['PE', 'PP', 'PVC', 'PET', 'Other'],
            datasets: [{ data: [34, 19, 16, 7, 24], backgroundColor: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}









import { GoogleGenAI } from "@google/genai";
import { helix } from "ldrs";

// 1. Initialize Helix Loader
if (typeof window !== 'undefined') {
    helix.register();
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.innerHTML = '<l-helix size="60" speed="2.5" color="#38bdf8"></l-helix>';
    }
}

// 2. Global State
let activeSection = 'learn';
let currentImageBase64 = null;
let productionChart = null;
let typesChart = null;
let chartsInitialized = false; // SAFETY GATE FOR GRAPHS

// 3. Initialize App
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.classList.add('hidden'), 1000);
        }
    }, 2500);

    initDetectHandlers();
});


window.navigateTo = (section) => {
    // 1. Update Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${section}`);
    if (targetTab) targetTab.classList.add('active-tab');

    // 2. Toggle Sections
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`section-${section}`);
    
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fadeIn');
        
        // 3. Trigger Charts ONLY when we land on 'impact'
        if (section === 'impact') {
            // Give the browser 300ms to finish the "unhide" animation
            setTimeout(() => {
                initCharts();
            }, 300);
        }
    }

    activeSection = section;
};


// --- Navigation Logic ---
window.navigateTo = (section) => {
    if (activeSection === section) return; // Don't reload if already here

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${section}`);
    if (targetTab) targetTab.classList.add('active-tab');

    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`section-${section}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fadeIn');
    }

    activeSection = section;

    // Trigger Charts ONLY ONCE to prevent crashing
    if (section === 'impact' && !chartsInitialized) {
        setTimeout(initCharts, 200); 
    }
};
*/
/*
// --- AI Detection Logic ---
function initDetectHandlers() {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const analyzeBtn = document.getElementById('btn-analyze');
    const resetBtn = document.getElementById('btn-reset');
    const preview = document.getElementById('image-preview');
    const prompt = document.getElementById('upload-prompt');

    if (!fileInput || !dropZone) return;

    dropZone.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    analyzeBtn.onclick = () => runAnalysis();
    resetBtn.onclick = (e) => {
        e.stopPropagation();
        currentImageBase64 = null;
        preview.classList.add('hidden');
        prompt.classList.remove('hidden');
        resetBtn.classList.add('hidden');
        analyzeBtn.disabled = true;
        fileInput.value = '';
        document.getElementById('results-container').innerHTML = `<p>Analysis results will appear here.</p>`;
    };
}

async function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        document.getElementById('image-preview').src = currentImageBase64;
        document.getElementById('image-preview').classList.remove('hidden');
        document.getElementById('upload-prompt').classList.add('hidden');
        document.getElementById('btn-analyze').disabled = false;
        document.getElementById('btn-reset').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function runAnalysis() {
    if (!currentImageBase64) return;

    const resultsContainer = document.getElementById('results-container');
    const analyzeBtn = document.getElementById('btn-analyze');
    const errorContainer = document.getElementById('analysis-error');

    analyzeBtn.disabled = true;
    errorContainer.classList.add('hidden');
    
    resultsContainer.innerHTML = `<div class="flex flex-col items-center"><p class="animate-pulse text-sky-600 font-bold">Connecting to Gemini...</p></div>`;

    try {
        // 1. DEFINE KEY DIRECTLY HERE
        const MY_KEY = "AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"; 
        
        // 2. INITIALIZE CLIENT
        const genAI = new GoogleGenAI("AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"); 
        
        // 3. INITIALIZE MODEL
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = currentImageBase64.split(',')[1];

        const result = await model.generateContent([
            "Analyze marine pollution in this image. Return ONLY a JSON object with: { \"severity\": \"low\"|\"medium\"|\"high\", \"detectedItems\": [], \"description\": \"\", \"recommendations\": [] }",
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Safety Clean for JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI returned invalid format");
        
        const data = JSON.parse(jsonMatch[0]);
        renderResults(data);

    } catch (err) {
        console.error("Critical API Error:", err);
        errorContainer.classList.remove('hidden');
        // This will tell you if the key is actually missing or just rejected
        errorContainer.innerHTML = `<strong>Error:</strong> ${err.message}`;
        resultsContainer.innerHTML = `<div class="text-5xl opacity-20">❌</div>`;
    } finally {
        analyzeBtn.disabled = false;
    }
}


async function runAnalysis() {
    if (!currentImageBase64) return;

    const resultsContainer = document.getElementById('results-container');
    const analyzeBtn = document.getElementById('btn-analyze');
    const errorContainer = document.getElementById('analysis-error');

    analyzeBtn.disabled = true;
    errorContainer.classList.add('hidden');
    errorContainer.textContent = ""; // Clear previous error
    
    resultsContainer.innerHTML = `<div class="flex flex-col items-center"><p class="animate-pulse text-sky-600 font-bold">AI Analyzing Waves...</p></div>`;

    try {
        const API_KEY = "AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"; 
        const genAI = new GoogleGenAI(API_KEY); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = currentImageBase64.split(',')[1];

        // Strict prompt to ensure valid JSON
        const prompt = "Analyze this marine image. Return ONLY a JSON object with: { \"severity\": \"low\"|\"medium\"|\"high\", \"detectedItems\": [], \"description\": \"\", \"recommendations\": [] }";

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const response = await result.response;
        let text = response.text();
        
        // --- CLEAN THE JSON ---
        // This removes any extra text or markdown the AI might have added
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("AI returned invalid data format");
        
        const data = JSON.parse(jsonMatch[0]);
        renderResults(data);

    } catch (err) {
        console.error("Analysis Error:", err);
        errorContainer.classList.remove('hidden');
        // This will now show the REAL error message in the red box
        errorContainer.textContent = "Error: " + (err.message || "Connection failed. Check your internet.");
        resultsContainer.innerHTML = `<div class="text-5xl opacity-20">❌</div>`;
    } finally {
        analyzeBtn.disabled = false;
    }
}


// --- Data Visualization ---
function initCharts() {
    const prodCanvas = document.getElementById('prodChart');
    const typeCanvas = document.getElementById('typeChart');
    
    if (!prodCanvas || !typeCanvas) return;

    // IMPORTANT: Destroy old charts if they exist to prevent memory leaks/crashes
    if (productionChart instanceof Chart) {
        productionChart.destroy();
    }
    if (typesChart instanceof Chart) {
        typesChart.destroy();
    }

    const prodCtx = prodCanvas.getContext('2d');
    const typeCtx = typeCanvas.getContext('2d');

    // Create Bar Chart
    productionChart = new Chart(prodCtx, {
        type: 'bar',
        data: {
            labels: ['1950', '1970', '1990', '2010', '2020', '2040'],
            datasets: [{
                label: 'Global Plastic (Tons)',
                data: [2, 35, 120, 310, 460, 800],
                backgroundColor: '#0ea5e9',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // Create Doughnut Chart
    typesChart = new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: ['PE', 'PP', 'PVC', 'PET', 'Other'],
            datasets: [{
                data: [34, 19, 16, 7, 24],
                backgroundColor: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
            },
            cutout: '70%'
        }
    });
}


/*
// --- Data Visualization (CRASH-PROOF) ---
function initCharts() {
    const prodCanvas = document.getElementById('prodChart');
    if (!prodCanvas || chartsInitialized) return;

    chartsInitialized = true; // LOCK THE GATE

    const prodCtx = prodCanvas.getContext('2d');
    productionChart = new Chart(prodCtx, {
        type: 'bar',
        data: {
            labels: ['1950', '1970', '1990', '2010', '2020', '2040'],
            datasets: [{
                label: 'Global Plastic (Tons)',
                data: [2, 35, 120, 310, 460, 800],
                backgroundColor: '#0ea5e9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // REQUIRED for crashing issues
        }
    });
}
*/


