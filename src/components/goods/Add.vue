<template>
  <div>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 进度条组件  -->
      <el-steps align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab切换区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave='beforeTabLeave' @tab-click='tabClicked'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expandTrigger="hover"
                v-model="addForm.goods_cat"

                :options="catelist"
                :props="cateProps"
                clearable
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
               <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>

                  </el-checkbox-group>

               </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
             
           
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传按钮 -->
            <!-- action 上传图片的api地址  -->
            <el-upload
                
                action="https://lianghj.top:8888/api/private/v1/upload"
                :headers="headerObj"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :on-success="handleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor
                  
                  v-model="addForm.goods_introduce"
                  
                >
              </quill-editor>

           <el-button @click="addGoods" type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picdialogVisible"
      width="50%"
     >
      <img :src="previewPath" alt="" class="previewImg">
     
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:[],
        pics:[],
        //商品详情描述
        goods_introduce:'',
        attrs:[]
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-10个字符之间", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      
      catelist: [],
      cateProps:{
          value: "cat_id",
          label: "cat_name",
          children: "children",
      },
      manyTableData:[],
      onlyTableData:[],
      fileList:[],
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewPath:'',
      picdialogVisible:false
    };
  },

  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }

      this.catelist = res.data;
      // 总数据条数
    },
    //级联选择器 发生变化 触发 
    handleChange(){
        if(this.addForm.goods_cat.length!==3){
            this.addForm.goods_cat=[]
        }
    },
    beforeTabLeave(activeName, oldActiveName){
        if(oldActiveName=='0' && this.addForm.goods_cat.length!==3){
            this.$message.error('请先选择商品分类！')
            return false
        }
    },
   async tabClicked(){
        // 访问动态参数 
       if(this.activeIndex==='1'){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
               params:{
                   sel:'many'
               }
           })
        if(res.meta.status!==200){
            this.$message.error('获取参数数据失败！')
        }
        res.data.forEach(item => {
            item.attr_vals=item.attr_vals.length === 0 ? []:item.attr_vals.split(' ')
           
        });
        this.manyTableData=res.data
       }else if(this.activeIndex==='2'){
        const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
            params:{
              sel:'only'
            }
          })
         if(res.meta.status!==200){
            this.$message.error('获取属性数据失败！')
        }
        this.onlyTableData=res.data

       } 
    },
  //处理图片预览 事件  
  handlePreview(file){
    console.log(file);
    this.previewPath ="https://lianghj.top:8888/"+ file.response.data.tmp_path
    this.picdialogVisible=true
  },
  //移除事件 
  handleRemove(file){
    //1.获取将要删除的图片的临时路径
    //2.从pics 数组中，找到这个图片对应的索引值
    //3.调用数组的splice 方法， 把图片信息对象，从pics数组中移除 
    const filePath = file.response.data.tmp_path
    const i= this.addForm.pics.findIndex(x=>x.pic=== filePath)
    this.addForm.pics.splice(i,1)
    console.log(this.addForm);
  },
  //监听图片上传成功  
  handleSuccess(response){
    //拼接得到一个图片信息对象
    // 将图片信息对象 Push到pics  数组中
    const picInfo ={ pic:response.data.tmp_path}
    this.addForm.pics.push(picInfo) 
    console.log(this.addForm);
  },
  addGoods(){
    // addform 中的goods_cat 报错 请求需要是字符串,但是双向绑定是 数组，不一致 
    //  解决方法， 深拷贝一个addform 给 请求的时候用 
    
      this.$refs.addFormRef.validate(async valid=>{
            if(!valid){
              return this.$message.error('请填写必要的表单项！')
            }
          const form = _.cloneDeep(this.addForm)
          form.goods_cat=form.goods_cat.join(',')
      // 处理 动态参数  
      this.manyTableData.forEach(item=>{
         const newInfo ={
           attr_id:item.attr_id,
           attr_value:item.attr_vals.join(' ')
         }
         this.addForm.attrs.push(newInfo)
      })
      this.onlyTableData.forEach(item=>{
         const newInfo ={
            attr_id:item.attr_id,
           attr_value:item.attr_vals
         }
          this.addForm.attrs.push(newInfo)
      })
      form.attrs = this.addForm.attrs

         const{data:res} =await  this.$http.post('goods',form);
        if(res.meta.status!==201){
         return   this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')   
        this.$router.push('/goods')    
             
       })
  }
  
  },
  computed:{
      cateId(){
          if(this.addForm.goods_cat.length === 3){
              return  this.addForm.goods_cat[2]
          }
          return null
      }
  },
 
  
  };
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 35px;
}
.el-checkbox{
 margin: 0 10px 0 0  !important ; 
}
.previewImg{
  width: 100%;
  height: 100%;
}
.btnAdd{
  margin-top: 10px;
}

</style>