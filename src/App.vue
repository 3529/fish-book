<template>
    <div id="app">
        <el-container>
            <el-container>
                <el-aside class="left" v-if="!bookVisible">
                    <div
                        style="
                            position: relative;
                            top: 20px;
                            /* background-color: red; */
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            color: #fff;
                            font-family: sans-serif;
                            /* font-weight: bold; */
                            letter-spacing: 2px;
                        "
                    >
                        <el-image
                            style="width: 40px; height: 40px"
                            :src="logo"
                            class="logo"
                        ></el-image>
                        <!-- <span>fish-book</span> -->
                    </div>
                    <el-menu
                        :default-active="$route.fullPath"
                        router
                        :collapse="true"
                        style="margin-left: 18px; margin-top: 50px"
                    >
                        <el-menu-item index="/">
                            <i class="el-icon-notebook-2"></i>
                            <span slot="title">使用说明</span>
                        </el-menu-item>
                        <el-menu-item index="/book">
                            <i class="el-icon-lollipop"></i>
                            <span slot="title">我的书架</span>
                        </el-menu-item>
                        <!-- <el-menu-item index="/read">
                            <i class="el-icon-picture-outline"></i>
                            <span slot="title">图片</span>
                        </el-menu-item> -->
                        <el-menu-item index="/config">
                            <i class="el-icon-setting"></i>
                            <span slot="title">配置</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <TitleBar v-if="!bookVisible"></TitleBar>
                <el-container :style="{ marginTop: !bookVisible ? '40px' : '0' }">
                    <el-main class="main">
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import TitleBar from './components/Native/TitleBar.vue';
const { ipcRenderer } = window.require('electron');
import { setSysConfig } from '@/estore/estore.js';
import logo from '../public/images/alpha-logo.png';
export default {
    name: 'app',
    data() {
        return {
            bookVisible: false,
            logo,
        };
    },
    components: { TitleBar },
    computed: {},

    created() {
        this.getRoute();
    },
    mounted() {
        this.initStore();
        // 监听更新数据消息
        ipcRenderer.on('update-data', (event, newData) => {
            console.log(newData);
            this.$store.state.sys = newData;
        });
    },
    methods: {
        getRoute() {
            if (this.$route.path == '/read') {
                this.bookVisible = true;
            }
        },
        async initStore() {
            console.log('初始化config');
            await setSysConfig('time', new Date().getTime());
        },
    },
};
</script>

<style lang="scss">
:root {
    --left-width: 30px !important;
    --top-height: 90px;
}

::-webkit-scrollbar {
    width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
    -webkit-border-radius: 5px;
    border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    opacity: 0.1;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.5);
}

body {
    margin: 0;
    width: 100%;
    position: fixed;
    overflow: hidden;
    overscroll-behavior-y: none;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
        '微软雅黑', Arial, sans-serif;
    user-select: none;
}
.top {
    background-color: #272f3f;
    color: white;
    height: var(--top-height) !important;
}
.left {
    background-color: #1e222d;
    height: calc(100vh);
    /* width: var(--left-width) !important; */
    width: 100px !important;
    .logo:hover {
        transform: scale(1.2);
        transition: all 0.3s;
        cursor: pointer;
    }
}
.main {
    /* background-color: #fefefe; */
    color: #333;
    height: calc(100vh);
}
.el-menu {
    border: 0px !important;
    overflow-x: hidden;
}
.el-menu-item {
    border-radius: 10px;
    margin: 20px 0;
}
.el-menu-item:focus,
.el-menu-item:hover,
.el-submenu__title:focus,
.el-submenu__title:hover {
    background-color: #272f3f !important;
}
.el-menu-item.is-active {
    transition: all 1s;
    border-radius: 20px;
    background-color: #008aff !important;
    color: white !important;
}

.episodeCell {
    min-width: var(--left-width) !important;
    padding: 5px 5px 5px 30px !important;
}
.episodeCellParagraph {
    line-height: 15px !important;
    font-size: 15px !important;
    overflow: hidden;
    text-overflow: ellipsis;
}
.activeItem {
    color: rgb(255, 90, 90) !important;
}
.previewLine1 {
    text-align: center;
    color: snow;
    font-size: 15px;
    text-overflow: ellipsis;
    height: 25px;
}
.previewLine2 {
    text-align: center;
    color: lightgray;
    font-size: 15px;
    text-overflow: ellipsis;
    height: 25px;
}
</style>
