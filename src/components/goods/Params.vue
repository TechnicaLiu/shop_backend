<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 警告文字 -->
      <el-alert title="注意！只允许为第三级分类设置相关参数" type="warning" show-icon> </el-alert>
      <el-row class="cat_opt">
          <el-col>
              <span>选择商品分类 :</span> &nbsp;&nbsp;
              <!-- 选择商品分类的级联选择框 -->
                <el-cascader
                    :show-all-levels="false"
                    v-model="selectKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange">
                </el-cascader>
          </el-col>
      </el-row>
      <!-- tab切换 -->
       <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!-- 动态参数面板 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini" :disabled='isBtnDisabled' @click="showAddDialog" >添加参数</el-button>
    <!-- 动态参数表格 -->
     <el-table
      :data="manyTableData"
       border stripe>
        
        <el-table-column type="expand"> 
            <template slot-scope="scope">
                <el-tag v-for="(item ,i) in scope.row.attr_vals " :key="i"  closable
  :disable-transitions="false"
  @close="handleClose(i,scope.row)">{{item}}</el-tag>
          <!-- new tag 输入文本框 -->
              <el-input
                 
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
             </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

            </template>


        </el-table-column>
      <el-table-column
        type="index"
        label="#"
        >
      </el-table-column>
      <el-table-column
        prop="attr_name"
        label="参数名称"
       >
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
               <el-button type="primary" size="mini" icon="el-icon-edit"
      @click="showEditDialog(scope.row)"      >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeParams(scope.row)" 
            >删除</el-button
          >
          </template>
      </el-table-column>
     
    </el-table>
    </el-tab-pane>
    <!-- 静态参数面板  -->
    <el-tab-pane label="静态参数" name="only">
      <el-button type="primary" size="mini" :disabled='isBtnDisabled'  @click="showAddDialog" >添加参数</el-button>
    <!-- 静态参数表格 -->
    <el-table
      :data="onlyTableData"
       border stripe>
       <!-- 展开行 -->
       <el-table-column type="expand"> 
            <template slot-scope="scope">
                <el-tag v-for="(item ,i) in scope.row.attr_vals " :key="i"  closable
  :disable-transitions="false"
  @close="handleClose(i,scope.row)">{{item}}</el-tag>
          <!-- new tag 输入文本框 -->
              <el-input
                 
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
             </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

            </template>


        </el-table-column>
      <el-table-column
        type="index"
        label="#"
        >
      </el-table-column>
      <el-table-column
        prop="attr_name"
        label="属性名称"
       >
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
               <el-button type="primary" size="mini" icon="el-icon-edit"
     @click="showEditDialog(scope.row)"  >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
           @click="removeParams(scope.row)"
            >删除</el-button
          >
          </template>
      </el-table-column>
     
    </el-table>
    </el-tab-pane>
   
     
  </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
  :title="'添加'+titleText"
  :visible.sync="addParamsDialogVisible"
  width="50%" @close='addParamsDialogClosed'
  >
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams" >确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑参数对话框 -->
 <el-dialog
  :title="'修改'+titleText"
  :visible.sync="editParamsDialogVisible"
  width="50%" @close='editParamsDialogClosed'
  >
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams" >确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList:[],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择器双向绑定的数据
      selectKeys:[],
      activeName:'many',
      manyTableData:[],
      onlyTableData:[],
      addParamsDialogVisible:false,
      // 添加参数的表单数据对象
      addForm:{
        attr_name:''
      },
      // 添加表单的验证 
      addFormRules:{
         attr_name:[
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            {min:3,max:10,message:'参数名称在3-10个字符之间',trigger: 'blur'}
          ],
      },
      editFormRules:{
         attr_name:[
            { required: true, message: '请修改属性名称', trigger: 'blur' },
            {min:3,max:10,message:'参数名称在3-10个字符之间',trigger: 'blur'}
          ],
      },
      editParamsDialogVisible:false,
       // 修改参数的表单数据对象
      editForm:{},
     
    };
  },
  created() {
    this.getCateList()
  },
  methods: {
   async getCateList(){
    const{data:res} = await this.$http.get('categories')
    if(res.meta.status!== 200){
      this.$message.error('获取商品分类数据失败！')
    }
  this.cateList=res.data
    },
    // 选中级联菜单后,调取参数数据
    handleChange(){
      this.getParamsData();
    },
    // 切换tab栏后，再次调取参数数据 
    handleTabClick(){
      this.getParamsData();
    },
  async  getParamsData(){
    // 证明选中的不是三级分类
      if(this.selectKeys.length !==3){
        this.selectKeys=[]
        this.manyTableData=[]
         this.onlyTableData=[]
        return 
      }
      // 根据所选分类的id，和当前所处的面板。获取对应的参数 
     const{data:res} = await  this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
     if(res.meta.status !==200 ){
      return  this.$message.error('获取参数数据失败！')
     }

     console.log(res.data);
     res.data.forEach(item => {
          item.attr_vals=item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏  
          item.inputValue=''
          item.inputVisible=false
     });

     if(this.activeName === 'many'){
       this.manyTableData=res.data
     }else{
       this.onlyTableData =res.data
     }
    },
    //点击添加属性 展开对话框
    showAddDialog(){
      this.addParamsDialogVisible=true
    },
    // 监听对话框关闭时间
    addParamsDialogClosed(){
      this.$refs.addFormRef.resetFields() ;  
    },
    addParams(){
       this.$refs.addFormRef.validate(async valid=>{
            if(!valid) return
         const{data:res} =await  this.$http.post(`categories/${this.cateId}/attributes`,{
              attr_name:this.addForm.attr_name,
              attr_sel:this.activeName
            });
        if(res.meta.status!==201){
         return   this.$message.error('添加参数失败！')
        }
          this.$message.success('添加参数成功！')   
            this.addParamsDialogVisible=false ;
             this.getParamsData(); 
       })
      
    },
  async  showEditDialog(params){
   const{data:res} =  await this.$http.get(`categories/${this.cateId}/attributes/${params.attr_id}`,{
      params:{ attr_sel:this.activeName}
   })
   this.editForm = res.data
   this.editParamsDialogVisible=true

    },
     editParamsDialogClosed(){
      this.$refs.editFormRef.resetFields() ;  
    },
    editParams(){
       this.$refs.editFormRef.validate(async valid=>{
            if(!valid) return
         const{data:res} =await  this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
              attr_name:this.editForm.attr_name,
              attr_sel:this.activeName
            });
        if(res.meta.status!==200){
         return   this.$message.error('修改参数失败！')
        }
          this.$message.success('修改参数成功！')   
            this.editParamsDialogVisible=false ;
             this.getParamsData(); 
       })
      
    },
    //删除参数
   async removeParams(params){
       const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
       `categories/${this.cateId}/attributes/${params.attr_id}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
     this.getParamsData(); 
    },
    // 文本框  按下 enter键 触发  
 async   handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue ='' 
        row.inputVisible=false
        return 
      }
      // 输入内容做后续处理 
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue='';
      row.inputVisible=false
      // 需要发起请求，保存这一次操作 
      this.saveAttrVals(row)

    },
    // 将参数更新的请求方法 抽离出来 二次利用 
    async saveAttrVals(row){
       const{data:res}= await  this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:this.activeName,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200){
       return this.$message.error('属性数据更新失败！')
      }
      this.$message.success('属性数据更新成功！')
    },
    // 点击 new tags 按钮 
    showInput(row){
        row.inputVisible=true;
        // input 输入框 自动获得焦点 
        // $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码 
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除 tag标签事件
    handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
    }
  },
  computed:{
    isBtnDisabled(){
      if(this.selectKeys.length!==3){
        return true
      }else{
        return false
      }
    },
    // 当前选中的三级分类的id
    cateId(){
      if(this.selectKeys.length===3){
        return this.selectKeys[2]
      }
      return null 
    },
    titleText(){
      if(this.activeName==='many'){
        return '动态属性'
      }else{
        return '静态属性'
      }
    }
    }
};
</script>

<style lang="less"  scoped>
    .el-card{
        margin-top: 10px;
    }
    .cat_opt{
        margin:15px 0px
    }
    .el-tag{
      margin: 0 6px;
    }
    .el-input{
      width: 120px;
    }
    

</style>
