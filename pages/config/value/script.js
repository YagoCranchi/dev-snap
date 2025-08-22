let currentIP = '';
let valueIndex = '';

document.addEventListener('DOMContentLoaded', () => {
    getParams();
    loadValueConfig();
    attachEventListeners();
});

function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    currentIP = urlParams.get('ip') || '';
    valueIndex = urlParams.get('index') || '';
        
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        const valueItem = ipConfig[parseInt(valueIndex)];

        const displayName = (valueItem && valueItem.customName) ? valueItem.customName : "Value";
        document.getElementById('valueTitle').textContent = `${displayName}`;
    });
}

function attachEventListeners() {
    document.getElementById('backButton').addEventListener('click', goBack);
    document.getElementById('saveValueButton').addEventListener('click', saveValueConfig);
}

function goBack() {
    window.location.href = `../index.html?ip=${encodeURIComponent(currentIP)}`;
}

function loadValueConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        const valueItem = ipConfig[parseInt(valueIndex)];
        
        if (valueItem && valueItem.valueConfig) {
            document.getElementById('selectorInput').value = valueItem.valueConfig.selector || '';
            document.getElementById('newValueInput').value = valueItem.valueConfig.value || '';
            document.getElementById('delayInput').value = valueItem.valueConfig.delay || 0;
        }
    });
}

function saveValueConfig() {
    const selector = document.getElementById('selectorInput').value.trim();
    const newValue = document.getElementById('newValueInput').value.trim();
    const delay = parseInt(document.getElementById('delayInput').value) || 0;
    
    if (!selector) {
        alert('Por favor, digite um seletor CSS');
        return;
    }
    
    if (!newValue) {
        alert('Por favor, digite um valor');
        return;
    }
    
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        
        if (ipConfig[parseInt(valueIndex)]) {
            ipConfig[parseInt(valueIndex)].valueConfig = {
                selector: selector,
                value: newValue,
                delay: delay
            };
            
            configs[currentIP] = ipConfig;
            
            chrome.storage.sync.set({ devSnapFaciliterConfigs: configs }, () => {
                goBack();
            });
        }
    });
}
