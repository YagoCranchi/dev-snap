let currentIP = '';
let functionalities = [];

document.addEventListener('DOMContentLoaded', () => {
    getCurrentIP();
    loadIPConfig();
    attachEventListeners();
});

function getCurrentIP() {
    const urlParams = new URLSearchParams(window.location.search);
    currentIP = urlParams.get('ip') || '';
    document.getElementById('ipTitle').textContent = `Configurar ${currentIP}`;
}

function attachEventListeners() {
    document.getElementById('backButton').addEventListener('click', goBack);
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
        order: functionalities.length
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
        const orderSpan = document.createElement('span');
        const funcSpan = document.createElement('span');
        const upButton = document.createElement('button');
        const downButton = document.createElement('button');
        const removeButton = document.createElement('button');
        
        const functionalityName = typeof functionality === 'object' ? functionality.name : functionality;
        
        orderSpan.textContent = `${index + 1}. `;
        funcSpan.textContent = functionalityName;
        
        if (functionalityName === 'click') {
            funcSpan.addEventListener('click', () => openClickConfig(index));
        }
        
        if (functionalityName === 'value') {
            funcSpan.addEventListener('click', () => openValueConfig(index));
        }
        
        if (functionalityName === 'redirect') {
            funcSpan.addEventListener('click', () => openRedirectConfig(index));
        }

        upButton.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        upButton.className = 'btn-arrow';
        upButton.disabled = index === 0;
        upButton.addEventListener('click', () => moveUp(index));
        
        downButton.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        downButton.className = 'btn-arrow';
        downButton.disabled = index === functionalities.length - 1;
        downButton.addEventListener('click', () => moveDown(index));
        
        removeButton.textContent = 'x';
        removeButton.className = 'btn-remove';
        removeButton.addEventListener('click', () => removeFunctionality(index));
        
        funcItem.appendChild(upButton);
        funcItem.appendChild(downButton);

        const groupDiv = document.createElement('div');
        groupDiv.className = 'spanValue';

        groupDiv.appendChild(orderSpan);
        groupDiv.appendChild(funcSpan);

        funcItem.appendChild(groupDiv);
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

function loadIPConfig() {
    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        const ipConfig = configs[currentIP] || [];
        
        if (Array.isArray(ipConfig)) {
            functionalities = ipConfig.map((item, index) => {
                if (typeof item === 'string') {
                    return { name: item, order: index };
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
