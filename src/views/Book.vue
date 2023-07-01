<template>
    <div class="book">
        <h2>
            我的书架
            <!-- <i class="el-icon-refresh-right refresh" title="同步书架" @click="refreshInit"></i> -->
            <div class="tools">
                <el-button
                    type=""
                    size="mini"
                    plain
                    icon="el-icon-refresh"
                    style="margin-right: 10px"
                    @click="refreshInit"
                >
                    同步书架
                </el-button>
                <el-popover placement="top-start" title="提示" width="400" trigger="hover">
                    <div class="popover-content">
                        您的书架对应您磁盘上的一个名为【books】的文件夹，如果您想要上传小说的话，点击下方蓝色按钮后，只需要把txt文件拖进文件夹，回到软件点击【同步书架】按钮即可。
                        <el-divider></el-divider>
                        <div style="text-align: center">
                            <el-button type="primary" size="mini" @click="openFolder">
                                打开书架本地文件夹
                            </el-button>
                        </div>
                    </div>
                    <el-button type="" plain size="mini" slot="reference" icon="el-icon-upload2">
                        上传小说
                    </el-button>
                </el-popover>
            </div>
        </h2>
        <div class="book-shelf" ref="shelf" v-loading="loading" v-show="books.length">
            <div class="shelf-row" v-for="(row, index) in rows" :key="index" v-show="!loading">
                <div
                    v-for="(item, itemIndex) in row"
                    :key="itemIndex"
                    :style="{ backgroundColor: item.color, backgroundImage: item.bgImg }"
                    @click="checkItem(item)"
                    :class="{ 'shelf-item': true, active: item.name == currentBookName }"
                >
                    <div class="info">
                        <span class="while-reading" v-if="item.name == currentBookName">
                            阅读中
                        </span>

                        <div class="title" :style="{ color: item.hover ? '#fff' : '#eee' }">
                            {{ item.title }}
                        </div>
                        <!-- <div class="author">{{ item.author }}</div> -->
                        <div class="progress" v-if="item.bookProgress">
                            已读 {{ item.bookProgress }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-empty description="书架空空的，你是懂感恩老板的 ~" v-show="!books.length">
            <el-button type="text" @click="showTipDialog">如何创建书架？</el-button>
        </el-empty>
        <el-dialog :visible.sync="tipDialogVisible">
            <div class="popover-content">
                您的书架对应您磁盘上的一个名为【books】的文件夹，如果您想要上传小说的话，点击下方蓝色按钮后，只需要把txt文件拖进文件夹，回到软件点击【同步书架】按钮即可。
                <el-divider></el-divider>
                <div style="text-align: center">
                    <el-button type="primary" size="mini" @click="openFolder">
                        打开书架本地文件夹
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const { ipcRenderer } = window.require('electron');
import { getSysConfig, setSysConfig } from '@/estore/estore.js';
export default {
    name: 'Book',
    data() {
        return {
            tipDialogVisible: false,
            loading: true,
            currentBookName: '',
            books: [
                // {
                //     title: '时间简史',
                //     author: '史蒂芬·霍金',
                // },
            ],
            rows: [],
            activeItem: null,
            booksInfo: [],
        };
    },
    mounted() {
        this.refreshInit();
        // 监听从主进程发送的readFilesError消息
        ipcRenderer.on('readFilesError', (event, err) => {
            console.error(err);
        });
    },
    methods: {
        async refreshInit() {
            await getSysConfig('currentBookName');
            this.getLocalFiles();
            await this.init();
            setTimeout(() => {
                this.loading = false;
            }, 500);
        },
        async init() {
            const shelfWidth = this.$refs.shelf.offsetWidth;
            const itemWidth = 160;
            const rowCount = Math.floor(shelfWidth / itemWidth);
            let rowIndex = 0;
            let colIndex = 0;
            this.rows = [];
            this.rows[rowIndex] = [];
            this.books.forEach(book => {
                const color = this.getRandomColor();
                this.rows[rowIndex][colIndex] = {
                    ...book,
                    color,
                    hover: false,
                };
                colIndex++;
                if (colIndex >= rowCount) {
                    colIndex = 0;
                    rowIndex++;
                    this.rows[rowIndex] = [];
                }
            });
            this.currentBookName = await getSysConfig('currentBookName');
        },
        handleItemEnter(item) {
            this.activeItem = item;
            item.hover = true;
        },
        handleItemLeave(item) {
            if (this.activeItem === item) {
                this.activeItem = null;
            }
            item.hover = false;
        },
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        getRandomImage() {
            const randomNum = Math.floor(Math.random() * 300) + 1;
            // return `url('https://picsum.photos/id/${randomNum}/160/240')`;
            return `url('https://tuapi.eees.cc/api.php?category=fengjing&type=302&px=m&rdm=${randomNum}')`;
        },
        showTipDialog() {
            this.tipDialogVisible = true;
        },

        // item
        async checkItem(item) {
            ipcRenderer.send('show-read-win');
            await setSysConfig('currentBookName', item.name);
            await setSysConfig('time', new Date().getTime());
            this.currentBookName = item.name;
            this.findBookByName(item.name);
            ipcRenderer.send('window-min');
        },
        getLocalFiles() {
            // 监听从主进程发送的fileContent消息
            ipcRenderer.once('fileContent', async (event, data) => {
                // 同步书架，同步至 sysConfig -> booksInfo
                await this.syncBooksInfo(data);
                // 将文件内容添加到fileContents数组中
                this.fileContents = data;
                this.books = data.map(item => {
                    return {
                        name: item,
                        title: item.replace('.txt', '').replace('《', '').replace('》', ''),
                        author: 'fish-book',
                        bgImg: this.getRandomImage(),
                        ...this.booksInfo.find(book => book.bookName === item),
                    };
                });
                this.init();
            });
            ipcRenderer.send('readFiles');
        },
        async syncBooksInfo(books) {
            let booksInfo = await getSysConfig('booksInfo');
            this.booksInfo = booksInfo;
            if (!booksInfo) {
                await setSysConfig('booksInfo', []);
                booksInfo = [];
            }
            for (let i = 0; i < books.length; i++) {
                let bookName = books[i];

                // 检查该书籍是否已经存在于booksInfo中
                let existingBookInfo = booksInfo.find(info => info.bookName === bookName);
                if (existingBookInfo) {
                    continue; // 如果已经存在，则跳过该书籍的处理
                }

                // 如果不存在，则创建一个新的书籍信息对象，并将其添加到booksInfo中
                let newBookInfo = {
                    bookName: bookName,
                    bookProgress: 0,
                    start: 0,
                    content: `欢迎使用fish-book当前（${bookName}）`,
                    total: -1,
                };
                booksInfo.push(newBookInfo);
            }
            await setSysConfig('booksInfo', booksInfo);
            this.booksInfo = booksInfo;
        },
        async findBookByName(bookName) {
            let booksInfo = await getSysConfig('booksInfo');
            return booksInfo.find(book => book.bookName === bookName);
        },
        openFolder() {
            ipcRenderer.invoke('open-books-folder');
        },
    },
};
</script>

<style scoped lang="scss">
.book {
    padding: 10px 40px;
    .tools {
        float: right;
    }
}

.refresh {
    color: #008aff;
    font-size: 24px;
    cursor: pointer;
}
.refresh:hover {
    color: #0066ff;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.1s;
    transform: scale(1.2);
}
.book-shelf {
    height: 70vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    margin: 30px 0;
}

.shelf-row {
    display: flex;
}

.shelf-item {
    width: 160px;
    height: 240px;
    margin: 10px;
    position: relative;
    border-radius: 5px;
    border-bottom: 6px solid #e9eef3;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
    /* transform-style: preserve-3d; */
    /* transform-origin: center left; */
    background-size: 100%;
}
.shelf-item.active {
    border-bottom: 6px solid #ff550099;
}
.shelf-item .while-reading {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #777;
    letter-spacing: 1px;
    font-size: 14px;
}

.shelf-item:hover {
    transform: scale(1.2) translateZ(130px);
    z-index: 999;
    .progress {
        display: block;
    }
}

.info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    transform: translateZ(30px);
    transition: transform 0.3s ease-in-out;
    transform-style: preserve-3d;
    background-color: rgba(0, 0, 0, 0.7);
    backface-visibility: hidden;
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin: 0 10px;
    margin-bottom: 5px;
    transition: color 0.3s ease-in-out;
    line-height: 26px;
    letter-spacing: 1px;
}

.author {
    font-size: 14px;
    color: #666;
}
.progress {
    position: absolute;
    bottom: 6px;
    right: -16px;
    font-size: 12px;
    letter-spacing: 1px;
    display: none;
    color: #fff;
}
.popover-content {
    text-align: left;
    margin: 0;
    line-height: 26px;
    button {
        margin: 0 auto;
    }
}
</style>
