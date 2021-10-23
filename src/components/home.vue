<template>
<el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
        <div class="header-font">
              <b>Management system</b>
        </div>
        <div>
            <i class="el-icon-switch-button"> &nbsp;<a  @click="logout">登出</a></i>  
        </div>
        
    </el-header>
    <!-- 内容区域 --> 
    <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="flag ? '64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">
                |||
            </div>
            <el-menu
                :router='true'
                :collapse-transition='false' 
                :collapse= "flag"
                unique-opened   
                background-color="#1f2935"
                text-color="#fff"
                active-text-color="#409eff"
                :default-active='activePath'
                >
         <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单 -->
        <template slot="title" >
        <i :class="iconsObj[item.id]"></i>
        <span> {{item.authName}} </span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" @click="saveNavState('/'+items.path)">
             <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}} </span>
             </template>
        </el-menu-item>

        </el-submenu>
      
             </el-menu>
  


        </el-aside>
        <!-- 内容显示板块 -->
        <el-main>
            
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>

</template>

<script>
export default {
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    data() {
        return {
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-yonghu',
                '103':'iconfont icon-gerenzhongxin',
                '101':'iconfont icon-shaixuan',
                '102':'iconfont icon-zhandianguanli',
                '145':'iconfont icon-yonghutongji'
            },
            flag:false,
            activePath:''
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        async getMenuList(){
            const{data:res} = await  this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist=res.data
            console.log(res);
            },
            // 点击按钮 侧边栏展开 或折叠 
        toggleCollapse(){
            this.flag = this.flag == false ? true : false
        },
        // 保存链接的激活状态  
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath
        }
    }
}
</script>


<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-header{
        display: flex;
        justify-content: space-between;
        background-color:#1f2935;
        color: #fff;
        line-height: 60px;
    }
    .header-font{
        font-size: 20px;
    }
    .el-aside{
        background-color: #1f2935;
       // height: 100% ;
        color: white;
    }
    .el-main{
        background-color:#f4f5f7;
    }
    .el-menu{
        background-color: white ;
        border-right: 0;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
       text-align: center;
    }

</style>