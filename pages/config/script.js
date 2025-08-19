let currentIP = '';
let functionalities = [];
let ips = [];

document.addEventListener('DOMContentLoaded', () => {
    getCurrentIP();
    loadIPs();
    loadIPConfig();
    attachEventListeners();
});

function getCurrentIP() {
    const urlParams = new URLSearchParams(window.location.search);
    currentIP = urlParams.get('ip') || '';
    updateTitle();
}

function updateTitle() {
    const ipObj = ips.find(item => {
        const ip = typeof item === 'string' ? item : item.ip;
        return ip === currentIP;
    });
    
    const displayName = (ipObj && typeof ipObj === 'object' && ipObj.name) ? ipObj.name : currentIP;
    document.getElementById('ipTitle').textContent = `Configurar ${displayName}`;
}

function attachEventListeners() {
    document.getElementById('backButton').addEventListener('click', goBack);
    document.getElementById('editNameButton').addEventListener('click', editName);
    document.getElementById('addFunctionButton').addEventListener('click', addFunctionality);
    
    const select = document.getElementById('functionalitySelect');
    select.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFunctionality();
        }
    });
}

function addFunctionality() {
    const select = document.getElementById('functionalitySelect');
    const selectedValue = select.value;
    
    if (!selectedValue) {
        return;
    }
    
    const newItem = {
        name: selectedValue,
        order: functionalities.length,
        enabled: true
    };
    
    functionalities.push(newItem);
    select.value = '';
    renderFunctionalityTable();

    saveConfig();
}

function removeFunctionality(index) {
    functionalities.splice(index, 1);
    renderFunctionalityTable();
    saveConfig();
}

function toggleFunctionality(index, enabled) {
    functionalities[index].enabled = enabled;
    saveConfig();
}

function renderFunctionalityTable() {
    const table = document.getElementById('functionalityTable');

    if (!Array.isArray(functionalities)) {
        functionalities = [];
    }
    
    if (functionalities.length === 0) {
        table.innerHTML = '<div>Nenhuma funcionalidade adicionada</div>';
        return;
    }
    
    table.innerHTML = '';
    
    functionalities.forEach((functionality, index) => {
        const funcItem = document.createElement('div');
        const checkbox = document.createElement('input');
        const orderSpan = document.createElement('span');
        const funcSpan = document.createElement('span');
        const editNameBtn = document.createElement('button');
        const upButton = document.createElement('button');
        const downButton = document.createElement('button');
        const removeButton = document.createElement('button');
        
        const functionalityName = typeof functionality === 'object' ? functionality.name : functionality;
        const customName = typeof functionality === 'object' ? functionality.customName : null;
        const enabled = typeof functionality === 'object' ? functionality.enabled !== false : true;
        
        checkbox.type = 'checkbox';
        checkbox.checked = enabled;
        checkbox.addEventListener('change', () => toggleFunctionality(index, checkbox.checked));
        
        orderSpan.textContent = `${index + 1}. `;
        
        const displayName = customName || functionalityName;
        funcSpan.textContent = displayName;
        
        if (functionalityName === 'click') {
            funcSpan.style.cursor = 'pointer';
            funcSpan.style.textDecoration = 'underline';
            funcSpan.addEventListener('click', () => openClickConfig(index));
        }
        
        if (functionalityName === 'value') {
            funcSpan.style.cursor = 'pointer';
            funcSpan.style.textDecoration = 'underline';
            funcSpan.addEventListener('click', () => openValueConfig(index));
        }
        
        if (functionalityName === 'redirect') {
            funcSpan.style.cursor = 'pointer';
            funcSpan.style.textDecoration = 'underline';
            funcSpan.addEventListener('click', () => openRedirectConfig(index));
        }
        
        editNameBtn.textContent = 'Editar Nome';
        editNameBtn.title = 'Editar nome';
        editNameBtn.addEventListener('click', () => editFunctionalityName(index));
        
        upButton.textContent = '↑';
        upButton.disabled = index === 0;
        upButton.addEventListener('click', () => moveUp(index));
        
        downButton.textContent = '↓';
        downButton.disabled = index === functionalities.length - 1;
        downButton.addEventListener('click', () => moveDown(index));
        
        removeButton.textContent = 'Remover';
        removeButton.addEventListener('click', () => removeFunctionality(index));
        
        funcItem.appendChild(checkbox);
        funcItem.appendChild(orderSpan);
        funcItem.appendChild(funcSpan);
        funcItem.appendChild(editNameBtn);
        funcItem.appendChild(upButton);
        funcItem.appendChild(downButton);
        funcItem.appendChild(removeButton);
        table.appendChild(funcItem);
    });
}

function moveUp(index) {
    if (index > 0) {
        [functionalities[index], functionalities[index - 1]] = [functionalities[index - 1], functionalities[index]];
        updateOrders();
        renderFunctionalityTable();
        saveConfig();
    }
}

function moveDown(index) {
    if (index < functionalities.length - 1) {
        [functionalities[index], functionalities[index + 1]] = [functionalities[index + 1], functionalities[index]];
        updateOrders();
        renderFunctionalityTable();
        saveConfig();
    }
}

function updateOrders() {
    functionalities.forEach((item, index) => {
        if (typeof item === 'object') {
            item.order = index;
        }
    });
}

function goBack() {
    window.location.href = '../index.html';
}

function editName() {
    const ipObj = ips.find(item => {
        const ip = typeof item === 'string' ? item : item.ip;
        return ip === currentIP;
    });
    
    const currentName = (ipObj && typeof ipObj === 'object' && ipObj.name) ? ipObj.name : '';
    const newName = prompt('Digite o novo nome:', currentName);
    
    if (newName !== null) {
        const ipIndex = ips.findIndex(item => {
            const ip = typeof item === 'string' ? item : item.ip;
            return ip === currentIP;
        });
        
        if (ipIndex !== -1) {
            if (typeof ips[ipIndex] === 'string') {
                ips[ipIndex] = {
                    ip: ips[ipIndex],
                    enabled: true,
                    name: newName.trim() || null
                };
            } else {
                ips[ipIndex].name = newName.trim() || null;
            }
            
            saveIPs();
            updateTitle();
        }
    }
}

function editFunctionalityName(index) {
    const functionality = functionalities[index];
    const currentCustomName = functionality.customName || '';
    const functionalityType = functionality.name;
    
    const newName = prompt(`Digite um nome personalizado para "${functionalityType}":`, currentCustomName);
    
    if (newName !== null) {
        if (newName.trim() === '') {
            delete functionality.customName;
        } else {
            functionality.customName = newName.trim();
        }
        
        renderFunctionalityTable();
        saveConfig();
    }
}

function saveIPNames() {
    chrome.storage.sync.set({ devSnapFaciliterIPs: ips });
}

function loadIPs() {
    chrome.storage.sync.get('devSnapFaciliterIPs', (result) => {
        if (result.devSnapFaciliterIPs) {
            ips = result.devSnapFaciliterIPs;
        }
        updateTitle();
    });
}

function saveIPs() {
    chrome.storage.sync.set({ devSnapFaciliterIPs: ips });
}

function loadIPConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        
        if (Array.isArray(ipConfig)) {
            functionalities = ipConfig.map((item, index) => {
                if (typeof item === 'string') {
                    return { name: item, order: index, enabled: true };
                }
                if (item.enabled === undefined) {
                    item.enabled = true;
                }
                return item;
            });
        } else {
            functionalities = [];
        }
        
        renderFunctionalityTable();
    });
}

function saveConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        configs[currentIP] = functionalities;

        chrome.storage.sync.set({ devSnapFaciliterConfigs: configs }, () => {});
    });
}

function openClickConfig(index) {
    window.location.href = `click/index.html?ip=${encodeURIComponent(currentIP)}&index=${index}`;
}

function openValueConfig(index) {
    window.location.href = `value/index.html?ip=${encodeURIComponent(currentIP)}&index=${index}`;
}

function openRedirectConfig(index) {
    window.location.href = `redirect/index.html?ip=${encodeURIComponent(currentIP)}&index=${index}`;
}
