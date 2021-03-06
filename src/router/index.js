import Vue from 'vue'
import VueRouter from 'vue-router'


// import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
// import Welcome from '../components/welcome.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import Users from '../components/user/Users.vue'
// import Roles from '../components/power/Roles.vue'
// import Rights from '../components/power/Rights.vue'
const Users = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/user/Users.vue')
const Roles = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/Roles.vue')
const Rights = () => import(/* webpackChunkName: "users_roles_rights" */ '../components/power/Rights.vue')

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// import Goods from  '../components/goods/Goods.vue'
// import Add from '../components/goods/Add.vue'
const Goods = () => import(/* webpackChunkName: "goods_add" */ '../components/goods/Goods.vue')
const  Add = () => import(/* webpackChunkName: "goods_add" */ '../components/goods/Add.vue')

// import Orders from '../components/orders/orders.vue'
// import Reports from '../components/reports/reports.vue'

const  Orders= () => import(/* webpackChunkName: "orders_reports" */ '../components/orders/orders.vue')
const  Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/reports/reports.vue')




Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path:'/home' , 
    component: Home ,
    redirect:'/welcome' ,
    children:[
      {  
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:Users
      },
      {
        path:'/roles',
        component:Roles
      },{
        path:'/rights',
        component:Rights
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:Goods
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Orders
      },
      {
        path:'/reports',
        component:Reports
      }
    ]
   
  }
]
const router = new VueRouter({
  routes
})

// ???????????????????????? 

router.beforeEach((to,from,next)=>{
  // to ?????????????????????
  // from  ?????????????????????????????????
  // next ?????????????????????????????? 
  if(to.path === '/login')  return next()
  // ??????token
  const tokenStr= window.sessionStorage.getItem('token')
  if( !tokenStr ) return next('/login')
  next()
})



export default router
