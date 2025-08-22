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
    
    registeredIPs.forEach(ipItem => {
        const ip = typeof ipItem === 'string' ? ipItem : ipItem.ip;
        const enabled = typeof ipItem === 'string' ? true : ipItem.enabled !== false;
        
        if (currentURL.includes(ip) && enabled) {
            const config = ipConfigs[ip] || [];
            
            config
                .sort((a, b) => {
                    const orderA = typeof a === 'object' ? a.order : 0;
                    const orderB = typeof b === 'object' ? b.order : 0;
                    return orderA - orderB;
                })
                .forEach((functionality, index) => {
                    if (functionality.enabled === false) return;
                    
                    const functionalityName = typeof functionality === 'object' ? functionality.name : functionality;
                    
                    switch (functionalityName) {
                      case 'click':
                        if (typeof functionality === 'object' && functionality.clickConfig) {
                          const { selector, delay } = functionality.clickConfig;
                          setTimeout(() => {
                            const escapedSelector = selector.replace(/\\\\/g, '\\');
                            const element = document.querySelector(escapedSelector);
                            if (element) {
                              element.click();
                            } else {
                              console.error(`Elemento não encontrado: ${escapedSelector}`);
                            }
                          }, delay);
                        }
                        break;
                      case 'value':
                        if (typeof functionality === 'object' && functionality.valueConfig) {
                          const { selector, value, delay } = functionality.valueConfig;
                          setTimeout(() => {
                            const escapedSelector = selector.replace(/\\\\/g, '\\');
                            const element = document.querySelector(escapedSelector);
                            if (element) {
                              element.value = value;
                              const event = new Event('input', { bubbles: true });
                              element.dispatchEvent(event);
                            } else {
                              console.error(`Elemento não encontrado: ${escapedSelector}`);
                            }
                          }, delay);
                        }
                        break;
                      case 'redirect':
                        if (typeof functionality === 'object' && functionality.redirectConfig) {
                          const { url, delay, newTab } = functionality.redirectConfig;
                          setTimeout(() => {
                            if (newTab) {
                              window.open(url, '_blank');
                            } else {
                              window.location.href = url;
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
