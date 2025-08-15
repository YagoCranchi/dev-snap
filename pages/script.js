let ips = [];

document.addEventListener('DOMContentLoaded', () => {
    loadIPs();
    attachEventListeners();
});

function attachEventListeners() {
    const addButton = document.getElementById('addButton');
    const ipInput = document.getElementById('ipInput');
    
    addButton.addEventListener('click', addIP);
    
    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIP();
        }
    });
}

function addIP() {
    const ipInput = document.getElementById('ipInput');
    const ip = ipInput.value.trim();

    if (!ip) {
        return;
    }
    
    if (ips.includes(ip)) {
        console.log('ip ja cadastrado');
        return;
    }
    
    ips.push(ip);
    saveIPs();
    ipInput.value = '';
    renderTable();
}

function removeIP(ip) {
    ips = ips.filter(item => item !== ip);

    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        delete configs[ip];
        chrome.storage.sync.set({ devSnapFaciliterConfigs: configs });
    });
    
    saveIPs();
    renderTable();
}

function renderTable() {
    const table = document.getElementById('ipTable');
    
    if (ips.length === 0) {
        table.innerHTML = '<div>Nenhum IP cadastrado</div>';
        return;
    }
    
    table.innerHTML = '';
    
    ips.forEach(ip => {
        const ipItem = document.createElement('div');
        const ipSpan = document.createElement('span');
        const button = document.createElement('button');
        
        ipSpan.textContent = ip;
        ipSpan.style.cursor = 'pointer';
        ipSpan.style.textDecoration = 'underline';
        ipSpan.addEventListener('click', () => openConfig(ip));
        
        button.textContent = 'Remover';
        button.addEventListener('click', () => removeIP(ip));
        
        ipItem.appendChild(ipSpan);
        ipItem.appendChild(button);
        table.appendChild(ipItem);
    });
}

function openConfig(ip) {
    window.location.href = `config/index.html?ip=${encodeURIComponent(ip)}`;
}

function saveIPs() {
    chrome.storage.sync.set({ devSnapFaciliterIPs: ips });
}

function loadIPs() {
    chrome.storage.sync.get('devSnapFaciliterIPs', (result) => {
        if (result.devSnapFaciliterIPs) {
            ips = result.devSnapFaciliterIPs;
        }
        renderTable();
    });
}
