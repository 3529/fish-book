import Vue from 'vue';
import VueRouter from 'vue-router';
import Book from '../views/Book.vue';
import Read from '../views/Read.vue';
import Home from '../views/Home.vue';
import Config from '../views/Config.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/book',
        name: 'Book',
        component: Book,
    },
    {
        path: '/read',
        name: 'Read',
        component: Read,
    },
    {
        path: '/config',
        name: 'Config',
        component: Config,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
