const { globalShortcut } = require('electron');
const { shortcutSettings } = require('../config/sysConfig');
const { sysConfigStore } = require('../config/index');
async function registerShortcuts(readWindow) {
    let keys = {};
    for (let k in shortcutSettings) {
        keys[k] = sysConfigStore.get(k);
    }
    const shortcuts = {
        // 上一页
        [keys['key1']]: () => {
            // 向渲染进程发送消息
            readWindow.webContents.send('pre-page');
        },
        // 下一页
        [keys['key2']]: () => {
            readWindow.webContents.send('next-page');
        },
        // 阅读器窗口显隐切换
        [keys['key3']]: () => {
            readWindow.webContents.send('show-hide-readWin');
        },
        // 其他快捷键...
    };

    Object.entries(shortcuts).forEach(([shortcut, callback]) => {
        globalShortcut.register(shortcut, callback);
    });
}

function unregisterShortcuts() {
    globalShortcut.unregisterAll();
}

module.exports = {
    registerShortcuts,
    unregisterShortcuts,
};
