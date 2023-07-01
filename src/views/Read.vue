<template>
    <div>
        <div class="read-board" :style="{ backgroundColor: `${textBgColor}` }">
            <div
                class="content"
                :style="{ fontSize: fontSize + 'px', letterSpacing: letterSpacing + 'px' }"
            >
                <span :style="{ color: `${textColor}` }">
                    {{ errorMessage }}
                    <!-- {{ booksInfo[currentBookIndex].start }}
                    {{ booksInfo[currentBookIndex].total }} -->
                    {{ fileContent }}
                </span>
            </div>
            <div class="progress" v-if="theBook" :style="{ color: `${textColor}`, opacity: 0.7 }">
                {{ theBook.bookProgress }}%
            </div>
            <div class="close" @click="close" :style="{ color: `${textColor}`, opacity: 0.7 }">
                <i class="el-icon-close"></i>
            </div>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require('electron');
import { mapState } from 'vuex';
import { getSysConfig, setSysConfig } from '@/estore/estore.js';

export default {
    data() {
        return {
            fileContent: '',
            errorMessage: '',
            bookInfo: {},
            currentBookInfo: {},
            currentBookIndex: null,
        };
    },
    computed: {
        ...mapState({
            currentBookName: state => state.sys.currentBookName,
            booksInfo: state => state.sys.booksInfo,
            time: state => state.sys.time,
            textColor: state => state.sys.textColor,
            textBgColor: state => state.sys.textBgColor,
            wordsPerPage: state => state.sys.wordsPerPage,
            fontSize: state => state.sys.fontSize,
            letterSpacing: state => state.sys.letterSpacing,
        }),
        theBook() {
            return this.booksInfo[this.currentBookIndex];
        },
    },
    watch: {
        time: async function () {
            // console.log(this.time);
            const currentBookInfo = this.findBookIndex(this.booksInfo, this.currentBookName);
            // console.log(currentBookInfo);
            this.currentBookIndex = currentBookInfo.index;
            this.handleBookTotalWords();
            this.loadFileContent();
        },
    },
    methods: {
        close() {
            ipcRenderer.send('window-min');
        },
        async findBookByName(bookName) {
            let booksInfo = await getSysConfig('booksInfo');
            return booksInfo.find(book => book.bookName === bookName);
        },
        async loadFileContent() {
            const start = this.theBook.start;

            console.log('读取页面信息', start, this.wordsPerPage);

            try {
                const fileContent = await ipcRenderer.invoke(
                    'read-file',
                    this.currentBookName,
                    start,
                    this.wordsPerPage
                );
                if (!fileContent.replace(/\s+/g, '').length) {
                    this.errorMessage = '这本书你已经读完了，针不戳 ~';
                    this.fileContent = '';
                    this.theBook.start -= this.wordsPerPage;
                    await setSysConfig('booksInfo', this.booksInfo);
                } else {
                    this.errorMessage = '';
                    this.fileContent = fileContent;
                    console.log(this.theBook);
                    const position =
                        ((this.theBook.start + this.wordsPerPage) * 100) / this.theBook.total;
                    console.log(position);
                    this.theBook.bookProgress =
                        Number(position.toFixed(2)) > 100 ? 100 : Number(position.toFixed(2));
                    await setSysConfig('booksInfo', this.booksInfo);
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = '读取文件时发生错误';
            }
        },
        findBookIndex(booksInfo, bookName) {
            for (let i = 0; i < booksInfo.length; i++) {
                if (booksInfo[i].bookName === bookName) {
                    console.log(booksInfo[i]);
                    return {
                        index: i,
                        ...booksInfo[i],
                    };
                }
            }
            return -1;
        },
        async turnPage(isNext) {
            const theBook = this.theBook;
            theBook.start = Math.max(
                theBook.start + (isNext ? this.wordsPerPage : -this.wordsPerPage),
                0
            );
            await setSysConfig('booksInfo', this.booksInfo);
            this.loadFileContent();
        },
        init() {
            ipcRenderer.on('next-page', () => {
                // console.log('下一页');
                this.turnPage(true);
            });
            ipcRenderer.on('pre-page', () => {
                // console.log('上一页');
                this.turnPage(false);
            });
            ipcRenderer.on('show-hide-readWin', async () => {
                // console.log('显示/隐藏窗口切换');
                ipcRenderer.send('readWin-toggle');
            });
        },
        async handleBookTotalWords() {
            try {
                const bookTotalWords = await ipcRenderer.invoke(
                    'read-file-total-words',
                    this.currentBookName
                );
                console.log(bookTotalWords);
                this.theBook.total = bookTotalWords;
            } catch (error) {
                console.error(error);
                this.errorMessage = '读取文件时发生错误';
            }
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="scss">
.read-board {
    width: calc(100vw - 20px);
    height: 100vh;
    color: #fff;
    margin: 0;
    line-height: 40px;
    padding: 0 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    -webkit-user-select: auto;
    .content {
        width: calc(100vw - 30px);
        -webkit-app-region: drag;
    }
}
.el-main {
    margin: 0 !important;
    padding: 0 !important;
}
.close {
    position: absolute;
    right: 0;
    color: #666;
    width: 30px;
    text-align: center;
    // background-color: #fff;
}
.close:hover {
    transform: scale(1.2);
    transition: all 0.2s;
    -webkit-app-region: no-drag;
}
.progress {
    margin-right: 24px;
}
</style>
