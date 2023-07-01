'use strict';

const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';
import fs from 'fs';
import { sysConfigStore } from '../src/config/index';
import './common/fs';
import { FOLDER_PATH } from './common/path';
import { sysConfig } from './config/sysConfig';
const { registerShortcuts, unregisterShortcuts } = require('./common/shortcut');

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
    console.log('当前为开发环境');
} else {
    console.log('当前为生产环境');
}

let mainWindow = null;
let readWindow = null;

async function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        // backgroundColor: '#1e222d',
        minWidth: 1024,
        minHeight: 768,
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    // mainWindow.webContents.openDevTools();
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        //if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        mainWindow.loadURL('app://./index.html');
    }
    console.log('__static:', __static);
    const tray = new Tray(path.join(__static, '/images/logo.png'));
    tray.setToolTip('fish-book');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开主界面',
            icon: path.join(__static, '/images/app.png'),
            click: () => {
                mainWindow.show();
            },
        },
        // { label: '设置', icon: path.join(__dirname, '../public/images/setting.png') },
        // { label: '关于', icon: path.join(__dirname, '../public/images/about.png') },
        {
            label: '退出',
            icon: path.join(__static, '/images/quit.png'),
            click: function () {
                app.quit();
            },
        },
    ]);
    tray.setContextMenu(contextMenu);
    // 监听托盘双击事件
    tray.on('double-click', () => {
        mainWindow.show();
    });
}

function createReadWindow() {
    // 获取屏幕尺寸
    const { width } = screen.getPrimaryDisplay().workAreaSize;

    // 创建一个新的无边框窗口
    readWindow = new BrowserWindow({
        width: 800,
        height: 40,
        x: Math.floor((width - 800) / 2), // 窗口在 X 轴上的位置居中
        y: 0, // 窗口在 Y 轴上的位置放置在屏幕底部
        frame: false,
        fullscreenable: false,
        transparent: true,
        resizable: true,
        movable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        modal: false,
    });
    // readWindow.webContents.openDevTools();
    readWindow.setMaximumSize(1920, 1080);
    readWindow.setMinimumSize(32, 32);
    readWindow.setSkipTaskbar(true);
    readWindow.setOpacity(0.7);
    // 将窗口设置为全局置顶
    readWindow.setAlwaysOnTop(true);
    // 将子窗口设置为主窗口的子窗口
    readWindow.setParentWindow(mainWindow);
    if (isDev) {
        // 在开发环境中加载子窗口的页面
        readWindow.loadURL('http://localhost:8080/#/read');
    } else {
        // 在生产环境中加载子窗口的页面
        const indexPath = path.join(__dirname, 'index.html');
        readWindow.loadURL(`file://${indexPath}#/read`);
    }
    //
    readWindow.on('closed', () => {
        // 将子窗口对象置为 null
        readWindow = null;
        // console.log('子窗口被关闭了');
    });

    readWindow.hookWindowMessage(278, function (e) {
        readWindow.setEnabled(false); //窗口禁用
        setTimeout(() => {
            readWindow.setEnabled(true); //窗口启用
        }, 100);
        return true;
    });
    global.readWindow = readWindow;
    // 注册所有快捷键
    registerShortcuts(readWindow);
}
// 监听从渲染进程发送的消息
ipcMain.on('readFiles', async (event, data) => {
    try {
        // 读取文件夹中所有文件
        const files = await fs.promises.readdir(FOLDER_PATH);

        // 过滤出txt文件
        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        // console.log(txtFiles);
        event.reply('fileContent', txtFiles);
    } catch (err) {
        event.reply('readFilesError', err);
    }
});
ipcMain.on('window-min', event => {
    const webContent = event.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    win.hide();
});
ipcMain.on('window-max', event => {
    const webContent = event.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    win.maximize();
});
ipcMain.on('window-close', event => {
    const webContent = event.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    win.hide();
});
ipcMain.on('readWin-toggle', () => {
    if (readWindow.isVisible()) {
        readWindow.hide();
    } else {
        readWindow.show();
    }
});
// 监听来自渲染进程的 "open-window" 消息
ipcMain.on('show-read-win', () => {
    if (readWindow === null) {
        createReadWindow();
    } else {
        readWindow.show();
    }
});
ipcMain.on('reload-read-win', () => {
    readWindow.close();
});
// 监听渲染进程发送的消息，修改窗口透明度
ipcMain.on('set-bg-opacity', (event, opacity) => {
    readWindow.setOpacity(opacity);
});
// 监听渲染进程发送的消息，修改resizeable
ipcMain.on('set-resizable', (event, resizable) => {
    console.log(resizable);
    readWindow.setResizable(resizable);
});
// 重置快捷键
ipcMain.on('change-shortcut', () => {
    // 注销所有快捷键
    unregisterShortcuts();
    // 注册所有快捷键
    registerShortcuts(readWindow);
    // console.log('重新注册快捷键');
});
// 处理获取存储值的请求
ipcMain.handle('getSysConfig', (event, key) => {
    return sysConfigStore.get(key);
});
ipcMain.handle('setSysConfig', (event, key, val) => {
    sysConfigStore.set(key, val);
});
ipcMain.handle('deleteSysConfig', (event, key, val) => {
    sysConfigStore.delete(key);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
        }
    });

    app.on('ready', async () => {
        createWindow();
        createReadWindow();
    });
}

app.on('will-quit', () => {
    // 注销所有快捷键
    unregisterShortcuts();
});

// 监听存储数据的更改
sysConfigStore.onDidAnyChange(newData => {
    const config = configFixer(newData);
    // 向渲染进程发送消息，通知更新数据
    mainWindow.webContents.send('update-data', config);
    readWindow.webContents.send('update-data', config);
});
// 检测并修复配置文件
function configFixer(currentConfig) {
    // console.log(typeof currentConfig);
    for (let key in sysConfig) {
        // console.log(currentConfig[key]);
        if (!(key in currentConfig)) {
            console.log(key + '不在curentConfig中');
            currentConfig[key] = sysConfig[key];
            sysConfigStore.set(key, currentConfig[key]);
        }
    }
    return currentConfig;
}
