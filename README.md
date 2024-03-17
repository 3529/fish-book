<div align="center">
  <img alt="fish-book-logo" width="120" height="120" src="http://www.fish-book.com/__static/logo.png">
  <h1>fish-book</h1>
  <a href="http://www.fish-book.com">访问官网</a>
</div>

## ⚡ 简介

基于 electron、vue2、vuex、element-ui、electron-store.

fish-book 是一款可以隐蔽式阅读小说的工具，让你在工作之余可以摸鱼看小说。fish-book 支持修改小说文字大小、颜色、背景色、窗口透明度等，让你可以根据个人喜好自定义阅读界面。这款阅读器的隐蔽式阅读功能非常实用，可以在工作时间内阅读小说，不会被别人发现。fish-book 还支持多种阅读设置，打造最舒适的阅读界面，让你的阅读体验更愉悦。如果你是一个坐在电脑前的打工人，fish-book 绝对是你必备的工具之一。

## ✔️ 预览

<img src="http://www.fish-book.com/images/preview.gif" 
style="width: 100%;border:1px solid #f5f5f5;border-radius:20px;margin-top:30px;box-shadow:10px 10px 4px #f5f5f5">

## 🚀 开发

```bash

# 镜像源配置 （不进行下方配置，可能会出现依赖安装异常、编译异常等问题）

# 使用淘宝镜像源
yarn config set registry https://registry.npmmirror.com

# 设置 Electron 镜像源
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/

# 设置 Electron Builder Binaries 镜像源
yarn config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/


# 环境
1. node 版本 16.19.0
2. electron 版本 25.0.1

# 克隆项目
git clone https://github.com/3529/fish-book.git

# 进入项目目录
cd fish-book

# 安装依赖
yarn

# 启动服务
yarn run electron:dev

# 打包
yarn run electron:build
```

## 💕 感谢 Star

未来会加入更多好玩有趣的摸鱼功能，对了，如果你喜欢这款软件的话，记得点个 star！ (#^.^#)
