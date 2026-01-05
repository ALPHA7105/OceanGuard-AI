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
    analyzeBtn.disabled = true;

    try {
        // HARDCODED KEY - Guaranteed to work in browser
        const genAI = new GoogleGenAI("AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = currentImageBase64.split(',')[1];
        const result = await model.generateContent([
            "Analyze marine pollution in this image. Identify plastic/waste items, severity (low/medium/high), and conservation advice. Response must be JSON.",
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, "").trim();
        renderResults(JSON.parse(cleanJson));
    } catch (err) {
        console.error(err);
        document.getElementById('analysis-error').classList.remove('hidden');
    } finally {
        analyzeBtn.disabled = false;
    }
}

function renderResults(data) {
    const container = document.getElementById('results-container');
    container.innerHTML = `
        <div class="p-4 bg-sky-50 rounded-xl">
            <h3 class="font-bold text-sky-900">${data.severity.toUpperCase()} SEVERITY</h3>
            <p class="text-sm text-gray-700 mt-2">${data.description}</p>
        </div>
    `;
}

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
