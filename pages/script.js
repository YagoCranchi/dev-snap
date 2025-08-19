let ips = [];

document.addEventListener('DOMContentLoaded', () => {
    loadIPs();
    attachEventListeners();
});

function attachEventListeners() {
    const addButton = document.getElementById('addButton');
    const addCurrentUrlButton = document.getElementById('addCurrentUrlButton');
    const ipInput = document.getElementById('ipInput');
    const nameInput = document.getElementById('nameInput');
    
    addButton.addEventListener('click', addIP);
    addCurrentUrlButton.addEventListener('click', addCurrentUrl);
    
    ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIP();
        }
    });
    
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addIP();
        }
    });
}

function addIP() {
    const ipInput = document.getElementById('ipInput');
    const nameInput = document.getElementById('nameInput');
    const ip = ipInput.value.trim();
    const name = nameInput.value.trim();

    if (!ip) {
        return;
    }
    
    const existingIP = ips.find(item => (typeof item === 'string' ? item : item.ip) === ip);
    if (existingIP) {
        console.log('ip ja cadastrado');
        return;
    }
    
    const newIPObject = {
        ip: ip,
        enabled: true,
        name: name || null
    };
    
    ips.push(newIPObject);
    
    saveIPs();
    ipInput.value = '';
    nameInput.value = '';
    renderTable();
}

function addCurrentUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            const currentUrl = tabs[0].url;
            
            let urlToAdd = '';
            try {
                const url = new URL(currentUrl);
                urlToAdd = url.protocol + '//' + url.host + url.pathname;
                
                if (urlToAdd.endsWith('/') && url.pathname !== '/') {
                    urlToAdd = urlToAdd.slice(0, -1);
                }
            } catch (e) {
                console.error('URL inválida:', currentUrl);
                return;
            }
            
            const existingIP = ips.find(item => (typeof item === 'string' ? item : item.ip) === urlToAdd);
            if (existingIP) {
                console.log('URL já cadastrada:', urlToAdd);
                return;
            }
            
            const newIPObject = {
                ip: urlToAdd,
                enabled: true,
                name: null
            };
            
            ips.push(newIPObject);
            saveIPs();
            renderTable();
        }
    });
}

function removeIP(ipToRemove) {
    ips = ips.filter(item => {
        const ip = typeof item === 'string' ? item : item.ip;
        return ip !== ipToRemove;
    });

    chrome.storage.sync.get('devSnapFaciliterConfigs', (result) => {
        const configs = result.devSnapFaciliterConfigs || {};
        delete configs[ipToRemove];
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
    
    ips.forEach((item, index) => {
        const ipItem = document.createElement('div');
        const checkbox = document.createElement('input');
        const ipSpan = document.createElement('span');
        const button = document.createElement('button');
        
        const ip = typeof item === 'string' ? item : item.ip;
        const enabled = typeof item === 'string' ? true : item.enabled !== false;
        const name = typeof item === 'string' ? null : item.name;
        
        checkbox.type = 'checkbox';
        checkbox.checked = enabled;
        checkbox.addEventListener('change', () => toggleIP(index, checkbox.checked));
        
        const displayName = name || ip;
        ipSpan.textContent = displayName;
        ipSpan.style.cursor = 'pointer';
        ipSpan.style.textDecoration = 'underline';
        ipSpan.addEventListener('click', () => openConfig(ip));
        
        button.textContent = 'Remover';
        button.addEventListener('click', () => removeIP(ip));
        
        ipItem.appendChild(checkbox);
        ipItem.appendChild(ipSpan);
        ipItem.appendChild(button);
        table.appendChild(ipItem);
    });
}

function openConfig(ip) {
    window.location.href = `config/index.html?ip=${encodeURIComponent(ip)}`;
}

function toggleIP(index, enabled) {
    if (typeof ips[index] === 'string') {
        ips[index] = {
            ip: ips[index],
            enabled: enabled,
            name: null
        };
    } else {
        ips[index].enabled = enabled;
    }
    saveIPs();
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
