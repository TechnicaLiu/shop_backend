<template>
    <div>
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
             <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索框 -->
        <el-row :gutter="10">
            <el-col :span="7"><div class="grid-content bg-purple">   
                 <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear='getUserList'>
                     <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-button type="primary" @click="addDialogVisible=true ">添加用户</el-button>
                </div>
            </el-col>
        </el-row>
       <!-- 用户列表 -->
          <el-table :data="userlist" style="width: 100% ;" :border='true' stripe class="userCard">
             <el-table-column type="index"  label="#"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
            <el-table-column prop="mg_state" label="状态" width="180">
               <template slot-scope="scope"> <!-- 作用域插槽 -->
                   
                    <el-switch
                      v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                     
                    </el-switch>
               </template>
            </el-table-column>
            <el-table-column  label="操作" >
                <template slot-scope="scope">
                   
                    <!-- 修改按钮 -->
                    <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.id)"></el-button>
                    <!-- 删除按钮  -->
                    <el-button type="danger" icon="el-icon-delete"  size="small" @click="removeUserById(scope.row.id)"></el-button>
                    <!-- 分配任务 -->
                    <el-tooltip  effect="dark" content="分配任务" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting"  size="small" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
                   
                </template>
            </el-table-column>
          
      </el-table>
      <!-- 分页导航条 -->
       <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1,2,3,5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>



        </el-card>

       <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"  @close='addDialogClosed'
         >
         <!-- 内容 -->
          
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
           <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
            <span>
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 编辑用户的对话框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editdialogVisible"
        width="50%" @close="editDialogClosed"
       >
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
           <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
      @close='setRoleDialogClosed' >
        <div>
          <p>当前的用户:{{userInfo.username}}</p>
          <p>当前的角色:{{userInfo.role_name}}</p>
          <p>分配新角色: 
             <el-select v-model="selectedRoleId" placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
</el-dialog>
    </div> 
</template>


<script>
export default {
    data() {
      // 验证邮箱的规则
      var checkEmail =(rule,value,cb)=>{
        const regEmail =/^([a-zA-Z0-P_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
     }
     // 验证手机号的规则 
      var checkMobile =(rule,value,cb)=>{
        const regEmail =/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
     }
      return {
        // 获取用户列表的参数对象 
        queryInfo:{
          query:'',
          // 当前的页数
          pagenum:1,
          // 当前每页显示多少条数据 
          pagesize:2
        },
        userlist:[],
        total:0,
        // 控制对话框 的显示隐藏
        addDialogVisible:false,
        editdialogVisible:false,
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        // 添加表单的验证规则 
        addFormRules:{
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger: 'blur'}
          ],
          password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码不得少于6位', trigger: 'blur' }
          ],
           email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur',},
          { validator: checkEmail, trigger: 'blur'}
         
          ],
           mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur'}
          ],

         
        },
        editForm:{
          username:'',
          email:'',
          mobile:''
        },
         editFormRules:{
          
          
           email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur',},
          { validator: checkEmail, trigger: 'blur'}
         
          ],
           mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur'}
          ],

         
        },
        setRoleDialogVisible:false,
        // 需要被分配的用户信息 
        userInfo:{},
        // 所有角色的列表 
        roleList:[],
        // 已选中的角色 
        selectedRoleId:''
      }
    },

    created(){
      this.getUserList()
    },
    methods:{
   async   getUserList(){
       const {data:res} =  await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res);
        this.userlist =res.data.users
        this.total=res.data.total
      },
      // 分页 pagesize 改变的事件 
      handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getUserList();
      },
      handleCurrentChange(newPage){
          this.queryInfo.pagenum=newPage
          this.getUserList();
      },
      async userStateChanged(userinfo){
        console.log(userinfo);
       const {data:res} = await this.$http.put(`users/${userinfo.id}/state/:${userinfo.mg_state}`)
   
      },
      // 添加用户对话框重置 操作
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
           if (!valid) return
           const { data: res } = await this.$http.post('users', this.addForm)
            if (res.meta.status !== 201) return this.$message.error('添加用户失败！');
            this.$message.success('添加用户成功');
              this.addDialogVisible=false
              this.getUserList();
           
       })
      },
    async  showEditDialog(id){
         const{data:res} = await this.$http.get('users/'+id);
         if (res.meta.status !== 200 ){
           return this.$message.error('查询用户信息失败')
         }
    
         this.editForm= res.data
        this.editdialogVisible=true;
      },
      editDialogClosed(){
        this.$refs.editFormRef.resetFields();
      },
      // 修改用户信息 
      editUserInfo(){
        this.$refs.editFormRef.validate(async valid=>{
            if(!valid) return
         const{data:res}= await this.$http.put('users/'+ this.editForm.id,{
              email:this.editForm.email,
              mobile:this.editForm.mobile
            }) 
          if(res.meta.status !== 200 ){
           return  this.$message.error('更新用户失败')
          }
          this.$message.success('更新用户成功')
          this.editdialogVisible=false;
          this.getUserList();
        })
      },
      // 根据ID删除 用户
    async  removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err=>err)
        if( confirmResult !=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res}= await this.$http.delete('users/'+id);
        if(res.meta.status!==200){
            this.$message.error('删除用户失败')
        }
         this.$message.success('删除用户成功')
          this.getUserList(); 
      },
    async  setRole(userInfo){
        this.userInfo=userInfo;
       const{data:res}= await this.$http.get('roles');
       this.roleList=res.data
        this.setRoleDialogVisible=true
      },
   async   saveRoleInfo(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择新的角色！')
        }
      const{data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
          rid:this.selectedRoleId
        })
      if(res.meta.status!==200){
        return   this.$message.error('分配角色失败！')
      }
      
      this.$message.success('分配角色成功！')
      this.getUserList();
      this.setRoleDialogVisible=false;
      },
      setRoleDialogClosed(){
        this.selectedRoleId='',
        this.userInfo={}
      }
      

    }


}
</script>


<style lang="less">
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0,0.15) !important;
  }
  .userCard{
    margin-top: 15px;
  }
 
</style>