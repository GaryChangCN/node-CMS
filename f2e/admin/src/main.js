import Vue from 'vue';
import Element from 'element-ui';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';
import Rem from './lib/Rem';
import 'element-ui/lib/theme-default/index.css';
import './assets/main.less';

Rem();

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(Element);


const App = resolve => require(['./App.vue'], resolve);
const Unhandled = resolve => require(['./components/order/unhandled.vue'], resolve);
const Processed = resolve => require(['./components/order/processed.vue'], resolve);
const Sale = resolve => require(['./components/order/sale.vue'], resolve);
const Failed = resolve => require(['./components/order/failed.vue'], resolve);
const Delivery = resolve => require(['./components/order/delivery.vue'], resolve);
const Recycle = resolve => require(['./components/order/recycle.vue'], resolve);
const Head = resolve => require(['./components/order/head'], resolve);
// 产品管理
const BrandEdit = resolve => require(['./components/product/BrandEdit.vue'], resolve);
const ProductList = resolve => require(['./components/product/ProductList.vue'], resolve);
const ProductAdd = resolve => require(['./components/product/ProductAdd.vue'], resolve);
// 页面管理
const Style = resolve => require(['./components/page/Style.vue'], resolve);
const ArticleAdd = resolve => require(['./components/article/Article.vue'], resolve);
const IndexStyle = resolve => require(['./components/page/IndexStyle.vue'], resolve);
const navbarStyle = resolve => require(['./components/page/navbarStyle.vue'], resolve);
const Project = resolve => require(['./components/page/Project.vue'], resolve);
const Center = resolve => require(['./components/page/Center'], resolve);
const Support = resolve => require(['./components/page/Support.vue'], resolve);
const ViewEditor = resolve => require(['./components/article/ViewEditor.vue'], resolve);
const Contactus = resolve => require(['./components/page/Contactus.vue'], resolve);
const equipmentDetail = resolve => require(['./components/page/equipmentDetail.vue'], resolve);
// 账户管理
const UserManage = resolve => require(['./components/user/UserManage.vue'], resolve);
// 资料库管理
const ImageManage = resolve => require(['./components/media/ImageManage.vue'], resolve);

const routes = {
    mode: 'hash',
    routes: [
        { name: 'head', path: '/order/head', component: Head },
        { name: 'unhandled', path: '/order/unhandled', component: Unhandled },
        { name: 'processed', path: '/order/processed', component: Processed },
        { name: 'delivery', path: '/order/delivery', component: Delivery },
        { name: 'sale', path: '/order/sale', component: Sale },
        { name: 'failed', path: '/order/failed', component: Failed },
        { name: 'recycle', path: '/order/recycle', component: Recycle },
        { name: 'userManage', path: '/user/manage', component: UserManage },
        { name: 'brandEdit', path: '/product/brand', component: BrandEdit },
        { name: 'productList', path: '/product/list', component: ProductList },
        { name: 'productAdd', path: '/product/add', component: ProductAdd },
        {
            name: 'style',
            path: '/page/style',
            component: Style,
            children: [
                { name: 'index', path: 'index', component: IndexStyle },
                { name: 'navbar', path: 'navbar', component: navbarStyle },
                { name: 'project', path: 'project', component: Project },
                { name: 'center', path: 'center', component: Center },
                { name: 'support', path: 'support', component: Support },
                { name: 'contactus', path: 'contactus', component: Contactus },
                { name: 'equipmentdetail', path: 'equipmentdetail', component: equipmentDetail }
            ]
        },
        { name: 'articleadd', path: '/article/add', component: ArticleAdd },
        { name: 'vieweditor', path: '/article/vieweditor', component: ViewEditor },
        { name: 'imageManage', path: '/media/image', component: ImageManage }
    ]
};

const router = new VueRouter(routes);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});