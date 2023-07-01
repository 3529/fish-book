const { ipcRenderer } = window.require('electron');

async function getSysConfig(key) {
    return await ipcRenderer.invoke('getSysConfig', key);
}

async function setSysConfig(key, val) {
    await ipcRenderer.invoke('setSysConfig', key, val);
}
async function deleteSysConfig(key) {
    await ipcRenderer.invoke('deleteSysConfig', key);
}
export { getSysConfig, setSysConfig, deleteSysConfig };
