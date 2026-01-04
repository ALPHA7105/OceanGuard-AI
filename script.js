import { GoogleGenAI, Type } from "@google/genai";
import { helix } from "ldrs";

// Initialize Helix Loader
if (typeof window !== 'undefined') {
    helix.register();
    const loaderContainer = document.getElementById('loader-container');
    if (loaderContainer) {
        loaderContainer.innerHTML = '<l-helix size="60" speed="2.5" color="#38bdf8"></l-helix>';
    }
}

// Global State
let activeSection = 'learn';
let currentImageBase64 = null;
let productionChart = null;
let typesChart = null;

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen after 2.5s
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
    // Update Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
    const targetTab = document.getElementById(`tab-${section}`);
    if (targetTab) targetTab.classList.add('active-tab');

    // Toggle Sections
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`section-${section}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('animate-fadeIn');
    }

    activeSection = section;

    // Trigger Charts if Impact
    if (section === 'impact') {
        // Short delay to ensure the canvas is visible before Chart.js initializes
        setTimeout(initCharts, 100);
    }
};

// --- Detection Logic ---
function initDetectHandlers() {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const analyzeBtn = document.getElementById('btn-analyze');
    const resetBtn = document.getElementById('btn-reset');
    const preview = document.getElementById('image-preview');
    const prompt = document.getElementById('upload-prompt');

    if (!fileInput || !dropZone || !analyzeBtn || !resetBtn || !preview || !prompt) return;

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
        document.getElementById('results-container').innerHTML = `
            <div class="text-5xl mb-4 opacity-30">🧬</div>
            <p class="text-sm font-medium text-gray-400">Analysis results will appear here.</p>
        `;
    };
}

async function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        const preview = document.getElementById('image-preview');
        const prompt = document.getElementById('upload-prompt');
        const analyzeBtn = document.getElementById('btn-analyze');
        const resetBtn = document.getElementById('btn-reset');

        if (preview && prompt && analyzeBtn && resetBtn) {
            preview.src = currentImageBase64;
            preview.classList.remove('hidden');
            prompt.classList.add('hidden');
            resetBtn.classList.remove('hidden');
            analyzeBtn.disabled = false;
        }
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
    
    // Loading State UI
    resultsContainer.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="flex gap-2 mb-4">
                <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce"></div>
                <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <p class="text-sky-700 font-bold">Ocean Data Sync...</p>
        </div>
    `;

try {
        const API_KEY = "AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"; 
        
        const genAI = new GoogleGenAI("AIzaSyCxXnMK5fQE5Jf4e-DQhmd0kAJhbxjjFNQ"); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const base64Data = currentImageBase64.split(',')[1];

        // This format is the most stable for the 1.5-flash model
        const result = await model.generateContent([
            "Analyze marine pollution in this image. Identify plastic/waste items, severity (low/medium/high), and conservation advice. Response must be JSON.",
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Safety check for JSON formatting
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);
        
        renderResults(data);

    } catch (err) {
        console.error("Analysis Error:", err);
        // This will help you see if it's an API key issue or something else
        errorContainer.textContent = `Error: ${err.message}`;
        errorContainer.classList.remove('hidden');
    } finally {
        analyzeBtn.disabled = false;
    }
}


function renderResults(data) {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    container.classList.remove('items-center', 'justify-center', 'text-center');
    container.innerHTML = `
        <div class="w-full text-left space-y-6 animate-fadeIn">
            <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-sky-900 uppercase tracking-widest text-xs">AI Evaluation</h3>
                    <span class="px-2 py-1 rounded text-[10px] font-black uppercase ${data.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                        ${data.severity} SEVERITY
                    </span>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${data.detectedItems.map(item => `<span class="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold border border-sky-100">#${item.replace(/\s/g, '')}</span>`).join('')}
                </div>
                <p class="text-gray-600 text-sm italic border-l-4 border-sky-200 pl-4 mb-6">"${data.description}"</p>
                <h4 class="font-bold text-sky-900 text-sm mb-3">🌱 Key Recommendations</h4>
                <ul class="space-y-2">
                    ${data.recommendations.map(rec => `
                        <li class="text-xs text-gray-600 flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                            <span class="text-sky-500 font-bold">✓</span> ${rec}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

// --- Data Visualization ---
function initCharts() {
    const prodCanvas = document.getElementById('prodChart');
    const typeCanvas = document.getElementById('typeChart');
    
    if (!prodCanvas || !typeCanvas) return;

    if (productionChart instanceof Chart) {
        productionChart.destroy();
    }
    if (typesChart instanceof Chart) {
        typesChart.destroy();
    }

    const prodCtx = prodCanvas.getContext('2d');
    const typeCtx = typeCanvas.getContext('2d');

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
            animation: {
                duration: 1000 
            },
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: false } }
            }
        }
    });

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
