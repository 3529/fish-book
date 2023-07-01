<template>
    <div class="about-us">
        <header>
            <h1>ABOUT SOFTWARE</h1>
        </header>
        <main>
            <p>本软件支持离线使用，最重要的是，它是完全免费的</p>
            <p>
                您可以在这里找到我的Git存储库
                <a href="#" @click="openUrl">{{ gitRepo }}</a>
                .
            </p>
            <p>
                如有任何疑问，也可以通过邮箱联系我
                <span>{{ contact }}</span>
            </p>
        </main>
    </div>
</template>

<script>
const { shell } = window.require('electron');
export default {
    name: 'About',
    data() {
        return {
            developer: 'Mofabo',
            gitRepo: 'https://github.com/3529/fish-book',
            contact: 'mofabo@163.com',
        };
    },
    methods: {
        openUrl() {
            shell.openExternal(this.gitRepo);
        },
    },
};
</script>

<style scoped lang="scss">
.about-us {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    span {
        user-select: all;
    }
}
header {
    text-align: center;
}
h1 {
    font-size: 2.5rem;
    margin: 0;
    color: #007bff;
}
main {
    padding: 20px;
    text-align: center;
}
a {
    color: #007bff;
    text-decoration: none;
    border-bottom: 1px solid #007bff;
}
a:hover {
    text-decoration: none;
    border-color: transparent;
}
</style>
