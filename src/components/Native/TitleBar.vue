<template>
    <div class="title-bar">
        <div class="title-bar-dragger"></div>
        <ul class="window-actions">
            <li @click="handleMinimize">
                <i class="el-icon-minus"></i>
            </li>
            <li class="win-close-btn" @click="handleClose">
                <i class="el-icon-close"></i>
            </li>
        </ul>
    </div>
</template>
<script>
const { ipcRenderer } = window.require('electron');
export default {
    data() {
        return {
            winState: false,
        };
    },
    methods: {
        handleMinimize() {
            ipcRenderer.send('window-min');
        },
        handleClose() {
            ipcRenderer.send('window-close');
        },
    },
};
</script>
<style lang="scss">
.title-bar {
    position: fixed;
    top: 0px;
    left: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    z-index: 5000;
    .title-bar-dragger {
        margin: 5px 0 0 5px;
        flex: 1;
        user-select: none;
        -webkit-app-region: drag;
        -webkit-user-select: none;
    }
    .window-actions {
        opacity: 0.4;
        transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 5100;
        font-size: 0;
        > li {
            display: inline-block;
            padding: 11px 18px;
            font-size: 16px;
            margin: 0;
            color: #1f1f1f;
            &:hover {
                background-color: #eee;
            }
            &.win-close-btn:hover {
                color: #fff;
                background-color: #fd0007;
            }
        }
    }
    &:hover {
        .window-actions {
            opacity: 1;
        }
    }
}
</style>
