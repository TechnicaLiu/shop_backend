<template>
    <div>
           <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>  
    <!-- 卡片 -->
    <el-card>
           <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    </div>
</template>

<script>

import echarts from 'echarts'

export default {
    data() {
        return {
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    // dom元素 初始完毕 
   async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1');
        if(res.meta.status!==200){
          return  this.$message.error('获取用户数据失败！')
        }
    
    //4. 准备数据和配置项
    const result = _.merge(res.data,this.options)

    myChart.setOption(result);
    },
    created(){
      
    },
    methods:{
     
    }
}
</script>


<style scoped>
    .el-card {
  margin-top: 15px;
}
</style>