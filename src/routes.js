import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Layout from './views/Layout/index.vue'

import Home from './views/Home/index.vue'
import User from './views/User/index.vue'

import LogMine from './views/LogMine/index.vue'

import Plugin from './views/Plugin/index.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path:'/',
        component:Layout,
        name:'',
        iconCls: 'fa fa-home',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/Home', component: Home, name: '首页' },
        ]
    },
    {
        path: '/',
        component: Layout,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
         hidden: true,
        children: [
            { path: '/user', component: User, name: '用户管理' }
        ]
    },
    
   
    {
        path: '/',
        component: Layout,
        name: '',
        iconCls: 'fa fa-cog',//图标样式class
        leaf:true,
        children:[
            {path:'/plugin',component:Plugin,name:'算法管理'}
        ]

    },
    {
        path: '/',
        component: Layout,
        name: '',
        iconCls: 'fa fa-file-text-o',//图标样式class
        leaf:true,
        children:[
            {path:'/logMine',component:LogMine,name:'日志挖掘'}
        ]

    },
    
   
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;