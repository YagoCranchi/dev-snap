let currentIP = '';
let functionalityIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    getURLParams();
    loadConfig();
    attachEventListeners();
});

function getURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    currentIP = urlParams.get('ip') || '';
    functionalityIndex = parseInt(urlParams.get('index')) || 0;
}

function attachEventListeners() {
    document.getElementById('backButton').addEventListener('click', goBack);
    document.getElementById('redirectForm').addEventListener('submit', saveRedirectConfig);
}

function loadConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        const functionality = ipConfig[functionalityIndex];
        
        if (functionality && functionality.redirectConfig) {
            const { url, delay, newTab } = functionality.redirectConfig;
            document.getElementById('urlInput').value = url || '';
            document.getElementById('delayInput').value = delay || 0;
            document.getElementById('newTabCheckbox').checked = newTab || false;
        }
    });
}

function saveRedirectConfig(event) {
    event.preventDefault();
    
    const url = document.getElementById('urlInput').value;
    const delay = parseInt(document.getElementById('delayInput').value) || 0;
    const newTab = document.getElementById('newTabCheckbox').checked;
    
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        
        if (ipConfig[functionalityIndex]) {
            ipConfig[functionalityIndex].redirectConfig = {
                url,
                delay,
                newTab
            };
            
            configs[currentIP] = ipConfig;
            
            chrome.storage.sync.set({ devSnapFaciliterConfigs: configs }, () => {
                goBack();
            });
        }
    });
}

function goBack() {
    window.location.href = `../index.html?ip=${encodeURIComponent(currentIP)}`;
}
