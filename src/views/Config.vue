<template>
    <section class="settings">
        <h2>设置</h2>

        <div class="settings-container">
            <el-form size="small" :model="form" label-position="left" label-width="120px">
                <el-tabs tab-position="top">
                    <!-- <el-tab-pane label="系统设置">
                        <el-form-item label="主题样式" label-width="80px">
                            <el-select v-model="form.theme" style="width: 100px">
                                <el-option label="白色" value="light"></el-option>
                                <el-option label="暗黑" value="dark"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane> -->

                    <el-tab-pane label="小说阅读器">
                        <el-alert
                            class="tip"
                            title="打开小说阅读器后，再调整下面的设置项，可直接预览效果哦！"
                            type="info"
                        ></el-alert>
                        <el-form-item label="每页字数">
                            <el-slider
                                v-model.number="form.wordsPerPage"
                                :min="5"
                                :max="200"
                                :step="1"
                                :marks="marksWordsTotal"
                                @change="wordsPerPageChange"
                                style="width: 420px"
                            ></el-slider>
                        </el-form-item>
                        <br />
                        <el-form-item label="字体颜色">
                            <el-color-picker
                                v-model="form.textColor"
                                @active-change="textColorChange"
                                show-alpha
                                style="width: 100px"
                            ></el-color-picker>
                        </el-form-item>
                        <el-form-item label="背景颜色">
                            <el-color-picker
                                v-model="form.textBgColor"
                                @active-change="textBgColorChange"
                                show-alpha
                                style="width: 100px"
                            ></el-color-picker>
                            <span class="color-picker-tip">
                                Tip：支持调整背景色透明度，调整为 0，则只显示文字
                            </span>
                        </el-form-item>
                        <el-form-item label="窗口透明度">
                            <el-slider
                                v-model.number="form.bgOpacity"
                                :min="0.1"
                                :max="1"
                                :step="0.01"
                                :marks="marksBgOpacity"
                                @input="bgOpacityChange"
                                style="width: 420px"
                            ></el-slider>
                        </el-form-item>
                        <br />
                        <el-form-item label="字体大小">
                            <el-slider
                                v-model.number="form.fontSize"
                                :min="12"
                                :max="30"
                                :step="1"
                                @input="fontSizeChange"
                                style="width: 420px"
                            ></el-slider>
                        </el-form-item>
                        <br />
                        <el-form-item label="字体间距">
                            <el-slider
                                v-model.number="form.letterSpacing"
                                :min="0"
                                :max="20"
                                :step="0.5"
                                @input="letterSpacingChange"
                                style="width: 420px"
                            ></el-slider>
                        </el-form-item>
                        <el-form-item label="阅读器窗口">
                            <el-checkbox v-model="form.resizable" @change="resizableChange">
                                允许调整宽高
                            </el-checkbox>
                        </el-form-item>
                        <br />
                        <el-button type="primary" plain @click="resetBookSettings">
                            恢复默认设置
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="快捷键">
                        <el-alert
                            class="tip"
                            title="如果键入快捷键后显示不全，例如按了 Ctrl + F1 却只显示 Ctrl，说明快捷键被其他应用占用了"
                            type="info"
                        ></el-alert>
                        <el-form-item label-width="0">
                            <div :span="8" v-for="i in shortcutCount" :key="i">
                                <div class="input-container">
                                    <span>{{ getShortcutName(i) }}</span>
                                    <input
                                        type="text"
                                        v-model="form['key' + i]"
                                        placeholder=""
                                        readonly
                                        @keydown="captureShortcut(i, $event)"
                                        @keyup="releaseShortcut"
                                        @focus="currentIndex = i"
                                    />
                                </div>
                            </div>
                        </el-form-item>
                        <el-button type="primary" plain @click="resetShortcutSettings">
                            恢复默认设置
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="关于"><About></About></el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
    </section>
</template>

<script>
const { ipcRenderer } = window.require('electron');
import { setSysConfig } from '@/estore/estore.js';
import { mapState } from 'vuex';
import About from './About.vue';
const { bookSettings, shortcutSettings } = require('../config/sysConfig');
export default {
    name: 'Config',
    data() {
        return {
            shortcutCount: 3,
            timer: null,
            marksBgOpacity: {
                0.1: '0.1',
                0.5: '0.5',
                0.7: {
                    style: {
                        color: '#1989FA',
                    },
                    label: this.$createElement('strong', '极致体验'),
                },
                1: '1',
            },
            marksWordsTotal: {
                40: {
                    style: {
                        color: '#1989FA',
                    },
                    label: this.$createElement('strong', '推荐40'),
                },
                100: '100',
                150: '150',
                200: '200',
            },
            currentIndex: '',
            form: {
                theme: 'light',
                ...bookSettings,
                ...shortcutSettings,
            },
            keyCombination: [],
        };
    },
    components: { About },
    computed: {
        ...mapState({
            // 小说每页字数
            wordsPerPage: state => state.sys.wordsPerPage,
            // 小说字体颜色
            textColor: state => state.sys.textColor,
            // 小说背景颜色
            textBgColor: state => state.sys.textBgColor,
            // 窗口透明度
            bgOpacity: state => state.sys.bgOpacity,
            // 快捷键
            shortcut: state => state.sys.shortcut,
            // 禁止调整阅读器宽高
            resizable: state => state.sys.resizable,
            // 字体大小
            fontSize: state => state.sys.fontSize,
            // 字体间距
            letterSpacing: state => state.sys.letterSpacing,
            // 下一页
            key1: state => state.sys.key1,
            // 上一页
            key2: state => state.sys.key2,
            // 显示隐藏阅读器窗口
            key3: state => state.sys.key3,
        }),
    },
    methods: {
        captureShortcut(index, event) {
            event.preventDefault();
            event.stopPropagation();
            if (!this.keyCombination.includes(event.key)) {
                this.keyCombination.push(event.key);
            }
            this.form['key' + index] = this.keyCombination
                .join(' + ')
                .replace(/Control|control/g, 'ctrl');
        },
        releaseShortcut() {
            for (let i = 1; i <= this.shortcutCount; i++) {
                if (i == this.currentIndex) {
                    continue;
                }
                if (this.form['key' + i] == this.form['key' + this.currentIndex]) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.$message.error('快捷键重复！');
                        this.form['key' + this.currentIndex] = '';
                    }, 100);
                }
            }
            this.keyCombination = [];
            // 更新本地存储
            this.setShortcut(this.form['key' + this.currentIndex]);
        },
        getShortcutName(index) {
            switch (index) {
                case 1:
                    return '上一页';
                case 2:
                    return '下一页';
                case 3:
                    return '老板键（阅读器显示 / 隐藏）';
            }
        },
        async wordsPerPageChange(data) {
            await setSysConfig('wordsPerPage', data);
        },
        async bgOpacityChange(data) {
            await setSysConfig('bgOpacity', data);
            ipcRenderer.send('set-bg-opacity', data);
        },
        async textColorChange(data) {
            this.form.textColor = data;
            await setSysConfig('textColor', data);
        },
        async textBgColorChange(data) {
            this.form.textBgColor = data;
            await setSysConfig('textBgColor', data);
        },
        async resizableChange(data) {
            await setSysConfig('resizable', data);
            ipcRenderer.send('set-resizable', data);
        },
        async fontSizeChange(data) {
            await setSysConfig('fontSize', data);
        },
        async letterSpacingChange(data) {
            await setSysConfig('letterSpacing', data);
        },
        async setConfigsFun(settingsObj) {
            for (let key in settingsObj) {
                await setSysConfig(key, settingsObj[key]);
                this.form[key] = settingsObj[key];
            }
            ipcRenderer.send('change-shortcut');
        },
        async setShortcut(data) {
            await setSysConfig('key' + this.currentIndex, data);
            ipcRenderer.send('change-shortcut');
        },
        resetBookSettings() {
            this.$confirm('确认要初始化当前页面下的所有设置吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.setConfigsFun(bookSettings);

                this.$message({
                    type: 'success',
                    message: '已恢复默认配置',
                });
            });
        },
        resetShortcutSettings() {
            this.$confirm('确认要初始化当前页面下的所有设置吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.setConfigsFun(shortcutSettings);

                this.$message({
                    type: 'success',
                    message: '已恢复默认配置',
                });
            });
        },
        mountedDefaultVal(obj) {
            for (let key in obj) {
                this.form[key] = this[key];
            }
        },
    },
    mounted() {
        this.mountedDefaultVal({ ...bookSettings });
        this.mountedDefaultVal({ ...shortcutSettings });
        ipcRenderer.send('set-bg-opacity', this.bgOpacity);
        ipcRenderer.send('set-resizable', this.resizable);
    },
};
</script>

<style lang="scss">
h2 {
    // padding-left: 40px;
}
.settings-container {
    // padding-left: 100px;
    // padding-bottom: 30px;
}

.el-row {
    margin-bottom: 20px;
}

.el-col:first-child {
    text-align: right;
    padding-right: 20px;
}

.settings {
    height: 800px;
    padding: 10px 40px;
}

.input-container {
    position: relative;
    width: 200px;
}

.input-container input {
    width: 100%;
    height: 30px;
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}

.input-container input:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    outline: none;
}
.Preview {
    position: absolute;
    left: 80px;
    top: 30px;
    background: #000;
    color: #fff;
    margin: 0;
    width: 440px;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}
.color-picker-tip {
    position: absolute;
    top: 2px;
    left: 50px;
    font-size: 12px;
    color: #999;
}
.tip {
    width: 660px;
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
    margin-top: -10px;
}
.el-tabs__item {
    // height: 60px !important;
}
.el-tabs__content {
    padding: 20px 0 0 10px;
}
</style>
