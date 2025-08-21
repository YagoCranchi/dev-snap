let ips = [];

document.addEventListener('DOMContentLoaded', () => {
    loadIPs();
    attachEventListeners();
});

function attachEventListeners() {
    const addButton = document.getElementById('addButton');
    const addCurrentUrlButton = document.getElementById('addCurrentUrlButton');
    const ipInput = document.getElementById('ipInput');
    
    addButton.addEventListener('click', addIP);
    addCurrentUrlButton.addEventListener('click', addCurrentUrl);
    
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
            
            if (ips.includes(urlToAdd)) {
                console.log('URL já cadastrada:', urlToAdd);
                return;
            }
            
            ips.push(urlToAdd);
            saveIPs();
            renderTable();
        }
    });
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
        
        ipSpan.innerHTML = `<i class="fa-solid fa-globe" style="margin-right:6px;"></i>${ip}`;
        ipSpan.addEventListener('click', () => openConfig(ip));
        
        button.textContent = 'x';
        button.className = 'btn-remove';
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
