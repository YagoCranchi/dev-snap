let registeredIPs = [];
let ipConfigs = {};

chrome.storage.sync.get(['devSnapFaciliterIPs', 'devSnapFaciliterConfigs'], (result) => {
    if (result.devSnapFaciliterIPs) {
        registeredIPs = result.devSnapFaciliterIPs;
    }
    if (result.devSnapFaciliterConfigs) {
        ipConfigs = result.devSnapFaciliterConfigs;
    }
    checkCurrentIP();
});

function checkCurrentIP() {
    const currentURL = window.location.href;
    
    registeredIPs.forEach(ip => {
        if (currentURL.includes(ip)) {
            const config = ipConfigs[ip] || [];
            
            config
                .sort((a, b) => {
                    const orderA = typeof a === 'object' ? a.order : 0;
                    const orderB = typeof b === 'object' ? b.order : 0;
                    return orderA - orderB;
                })
                .forEach((functionality, index) => {
                    const functionalityName = typeof functionality === 'object' ? functionality.name : functionality;
                    
                    if (functionalityName === 'ip') {
                        console.log(ip);
                    } else if (functionalityName === 'ping') {
                        console.log('ping');
                    } else if (functionalityName === 'passo') {
                        console.log(index + 1);
                    } else if (functionalityName === 'click') {
                        if (typeof functionality === 'object' && functionality.clickConfig) {
                            const { selector, delay } = functionality.clickConfig;
                            setTimeout(() => {
                                const element = document.querySelector(selector);
                                if (element) {
                                    element.click();
                                    console.log(`Clicou em: ${selector}`);
                                } else {
                                    console.log(`Elemento não encontrado: ${selector}`);
                                }
                            }, delay);
                        }
                    }
                });
        }
    });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.devSnapFaciliterIPs) {
            registeredIPs = changes.devSnapFaciliterIPs.newValue || [];
        }
        if (changes.devSnapFaciliterConfigs) {
            ipConfigs = changes.devSnapFaciliterConfigs.newValue || {};
        }
        checkCurrentIP();
    }
});
