// 阅读器相关设置项
const bookSettings = {
    // 小说每页字数
    wordsPerPage: 40,
    // 小说字体颜色
    textColor: '#ffffff',
    // 小说背景颜色
    textBgColor: '#000000',
    // 窗口透明度
    bgOpacity: 0.7,
    // 是否允许调整窗口宽高
    resizable: true,
    // 小说字体大小
    fontSize: 16,
    // 小说字间距
    letterSpacing: 0,
};
// 快捷键
const shortcutSettings = {
    // 上一页
    key1: 'alt + z',
    // 下一页
    key2: 'alt + c',
    // 阅读器显隐切换
    key3: 'alt + v',
};

const sysConfig = {
    // 主题 dark || white
    theme: 'white',
    // 存储小说列表、书名、阅读进度等信息
    booksInfo: [
        {
            bookName: '说明文档.txt',
            bookProgress: 0,
            start: 0,
            // 当前小说显示文本
            content: '欢迎使用fish-book！',
            // 总字数
            total: -1,
        },
    ],
    // 上次阅读开始时间
    time: '',
    // 当前在阅读的小说名
    currentBookName: '说明文档.txt',
    // 当前小说进度
    currentBookProgress: 0,
    // 当前小说显示文本
    currentBookContent: '',
    // 小说当前阅读字数
    start: 0,
    // 阅读器相关设置
    ...bookSettings,
    // 快捷键相关设置
    ...shortcutSettings,
};

export { sysConfig, bookSettings, shortcutSettings };
