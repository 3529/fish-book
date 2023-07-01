const fs = require('fs');
const jschardet = require('jschardet');
const iconv = require('iconv-lite');

// 读取文件内容，并按照检测到的编码进行解码
async function readFile(filePath, { start = 0, end = Infinity } = {}, encoding = 'utf-8') {
    const buffer = await readBuffer(filePath);
    const { encoding: detectedEncoding } = jschardet.detect(buffer);
    const content = iconv.decode(buffer, detectedEncoding || encoding);

    return content.slice(0, 5);
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

async function test() {
    const content = await readFile('../../books/《我的师傅每到大限才突破》.txt', {
        start: 0,
        end: 12,
    });
    console.log(content);
}

test();
