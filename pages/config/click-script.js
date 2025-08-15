let currentIP = '';
let clickIndex = '';

document.addEventListener('DOMContentLoaded', () => {
    getParams();
    loadClickConfig();
    attachEventListeners();
});

function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    currentIP = urlParams.get('ip') || '';
    clickIndex = urlParams.get('index') || '';
    document.getElementById('clickTitle').textContent = `Configurar Click - ${currentIP}`;
}

function attachEventListeners() {
    document.getElementById('backButton').addEventListener('click', goBack);
    document.getElementById('saveClickButton').addEventListener('click', saveClickConfig);
}

function goBack() {
    window.location.href = `../index.html?ip=${encodeURIComponent(currentIP)}`;
}

function loadClickConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        const clickItem = ipConfig[parseInt(clickIndex)];
        
        if (clickItem && clickItem.clickConfig) {
            document.getElementById('selectorInput').value = clickItem.clickConfig.selector || '';
            document.getElementById('delayInput').value = clickItem.clickConfig.delay || 0;
        }
    });
}

function saveClickConfig() {
    const selector = document.getElementById('selectorInput').value.trim();
    const delay = parseInt(document.getElementById('delayInput').value) || 0;
    
    if (!selector) {
        alert('Por favor, digite um seletor CSS');
        return;
    }

    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        
        if (ipConfig[parseInt(clickIndex)]) {
            ipConfig[parseInt(clickIndex)].clickConfig = {
                selector: selector,
                delay: delay
            };
            
            configs[currentIP] = ipConfig;

            chrome.storage.sync.set({ devSnapFaciliterConfigs: configs }, () => {
                goBack();
            });
        }
    });
}
