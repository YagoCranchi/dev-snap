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
                    
                    switch (functionalityName) {
                      case 'ip':
                        console.log(ip);
                        break;
                      case 'ping':
                        console.log('ping');
                        break;
                      case 'passo':
                        console.log(index + 1);
                        break;
                      case 'click':
                        if (typeof functionality === 'object' && functionality.clickConfig) {
                          const { selector, delay } = functionality.clickConfig;
                          setTimeout(() => {
                            const element = document.querySelector(selector);
                            if (element) {
                              element.click();
                            } else {
                              console.error(`Elemento não encontrado: ${selector}`);
                            }
                          }, delay);
                        }
                        break;
                      case 'value':
                        if (typeof functionality === 'object' && functionality.valueConfig) {
                          const { selector, value, delay } = functionality.valueConfig;
                          setTimeout(() => {
                            const element = document.querySelector(selector);
                            if (element) {
                              element.value = value;
                              const event = new Event('input', { bubbles: true });
                              element.dispatchEvent(event);
                            } else {
                              console.error(`Elemento não encontrado: ${selector}`);
                            }
                          }, delay);
                        }
                        break;
                      default:
                        break;
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
