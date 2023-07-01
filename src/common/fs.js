// 在主进程中创建一个供渲染进程调用的 API
const { ipcMain, shell } = require('electron');
const fs = require('fs');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const path = require('path');
ipcMain.handle('read-file', async (event, fileName, start, end) => {
    const filePath = path.join(__dirname, '../books', fileName);

    try {
        const fileContent = await readFile(filePath, {
            start,
            end,
        });
        return fileContent;
    } catch (error) {
        console.error(error);
        return null;
    }
});
ipcMain.handle('read-file-total-words', async (event, fileName) => {
    const filePath = path.join(__dirname, '../books', fileName);
    console.log(filePath);
    try {
        const fileContent = await readFile(filePath);
        return fileContent.length;
    } catch (error) {
        console.error(error);
        return null;
    }
});
ipcMain.handle('open-books-folder', async event => {
    const filePath = path.join(__dirname, '../books');
    try {
        shell.openPath(filePath);
    } catch (error) {
        console.error(error);
        return null;
    }
});

// 读取文件内容，并按照检测到的编码进行解码
async function readFile(filePath, { start = 0, end = Infinity } = {}, encoding = 'utf-8') {
    const buffer = await readBuffer(filePath);
    const { encoding: detectedEncoding } = jschardet.detect(buffer);
    const content = iconv.decode(buffer, detectedEncoding || encoding);
    // console.log('开始和结束：', start, end);
    // console.log('内容:', content.substr(start, end));
    // console.log('读取到了');
    return content.substr(start, end);
}

// 读取文件的二进制数据
function readBuffer(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const chunks = [];

        stream.on('error', error => {
            console.error(error);
            reject(error);
        });

        stream.on('data', chunk => {
            chunks.push(chunk);
        });

        stream.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });
    });
}
