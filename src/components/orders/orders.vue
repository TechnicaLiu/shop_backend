<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表单数据 -->
      <el-table :data="orderlist" style="width: 100%" :border="true" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          width="500"
          label="订单编号"
        ></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editDialog"
            ></el-button>
            <!-- 删除按钮  -->
            <el-button
              type="success"
              icon="el-icon-s-opportunity
"
              size="small"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页导航条 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 编辑地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"

      >
        <el-form-item label="省市区/县" prop="address1">
           <el-cascader
            expandTrigger="hover"
            v-model="editForm.address1"
            :options="cityData"
           
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2" ></el-input>
        </el-form-item>
      </el-form>
      <span>
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 货流详情 -->
     <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      
    >
     <!-- 时间线  -->
     <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
     </el-timeline>
      <span>
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import cityData from './citydata.js'


export default {
  data() {
    return {
      orderlist: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editDialogVisible: false,
      editForm:{
          address1:[],
          address2:''
      },
      editFormRules:{
          address1: [
          { required: true, message: "请输入省市区县", trigger: "blur" },
        
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        
        ],
      },
      cityData,
      progressVisible:false,
      progressInfo:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }
      this.$message.success("获取订单数据成功");
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 编辑对话框 关闭事件
    editDialogClosed() {
        this.$refs.editFormRef.resetFields()
    },
    editDialog() {
      this.editDialogVisible = true;
    },
    submit(){

    },
   async showProgress(){
         const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }

      this.progressInfo = res.data;
      console.log(this.progressInfo)
    this.progressVisible=true 
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css' ;
.el-card {
  margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>