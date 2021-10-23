<template>
    <div>
        <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片表格 -->
      <el-card class="box-card">
          <el-row>
              <el-col>
                  <el-button type="primary"  @click="addDialogVisible=true ">添加角色</el-button>
              </el-col>
          </el-row> 
          <!-- 角色列表区 -->
          <el-table :data="rolelist" style="width: 100% ; margin-top:10px" border stripe>
              <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                   <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                       <!-- 渲染一级权限 -->
                       <el-col :span="5">
                           <el-tag closable  @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                       </el-col>
                        <!-- 渲染二级三级权限 -->
                       <el-col :span="19">
                           <el-row :class="['bdbottom',i2===0 ? 'bdtop' : '','vcenter']"  v-for="(item2,i2) in item1.children" :key='item2.id'>
                               <!-- 二级权限 -->
                               <el-col :span="6">
                                   <el-tag type="success" closable  @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                               </el-col>
                               <!-- 三级权限 -->
                               <el-col :span="18">
                                    <el-tag :class="['bdbottom',i3===0 ? 'bdtop' : '']"  type="danger" v-for="(item3,i3) in item2.children" :key="item3.id" closable  @close="removeRightById(scope.row,item3.id)" >{{item3.authName}}</el-tag>
                               </el-col>
                           </el-row>
                       </el-col>
                   </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称" >
            </el-table-column>
            <el-table-column prop="roleDesc" label="权限说明"> </el-table-column>
             <el-table-column label="操作">
                 <template slot-scope="scope">
                     <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
                     <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row)">删除</el-button>
                     <el-button type="warning" size="mini" icon="el-icon-star-off" @click="showSetRightDialog(scope.row)" @close='setRightDialogClosed'>分配权限</el-button>
                 </template>
                 
             </el-table-column>
      </el-table>
      </el-card>
    <!-- 分配权限 -->
     <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisable"
          width="50%"  
         >
         <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
     </el-dialog>

     <!-- 添加角色 -->
     <el-dialog
          title="添加角色"
          :visible.sync="addDialogVisible"
          width="50%" @close='addDialogClosed'
         >
         <!-- 内容 -->
          
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
           <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
           </el-form-item>
        </el-form>
            <span>
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
      </el-dialog>
    </div>
</template>


<script>
export default {
    data() {
        return {
            //添加角色对话框
            addDialogVisible:false,
            rolelist:[],
            setRightDialogVisable:false,
            rightsList:[],
            /* 树形控件的绑定对象 */
            treeProps:{
                children:'children',
                label: 'authName',
            },
            //默认选中的值
            defKeys:[],
            roleId:'',
           //添加角色的 动态绑定值
           addForm:{
                roleName:'',
                roleDesc:''
            },
          // 添加角色 验证规则
          addFormRules:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            {min:2,max:10,message:'角色的长度在2-10个字符之间',trigger: 'blur'}
          ],
          roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' },
          { min: 5, max: 20, message: '角色描述至少5个字', trigger: 'blur' }
          ],
        },  
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        // 添加角色事件
        addRole(){
             this.$refs.addFormRef.validate(async valid=>{
           if (!valid) return
           const { data: res } = await this.$http.post('roles', this.addForm)
            if (res.meta.status !== 201) return this.$message.error('添加角色失败！');
            this.$message.success('添加角色成功');
              this.addDialogVisible=false;
              this.getRoleList()
           
       })
        },
        // 添加用户对话框  关闭事件 
        addDialogClosed(){
           this.$refs.addFormRef.resetFields()
        },
       async getRoleList(){
          const {data:res}= await this.$http.get('roles');
         
          if(res.meta.status!==200){
           return  this.$message.error('获取权限列表失败')
          }
          this.rolelist=res.data
        },
     async   removeRightById(role,rightId){
       const confirmResult=  await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if( confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
        }
       const{data:res}= await this.$http.delete('roles/'+role.id+'/rights/'+rightId)
       if(res.meta.status!==200){
         return this.$message.error('删除权限失败');
       }
       this.$message.success('删除权限成功')
       role.children=res.data 
        },
      /* 展示权限对话框 */
      async showSetRightDialog(role){
          this.roleId=role.id;
         const {data:res}= await this.$http.get('rights/tree')
         if(res.meta.status!==200){
             return  this.$message.error('获取权限数据失败！')
         }
        this.rightsList=res.data
        this.getLeafKeys(role,this.defKeys)
         this.setRightDialogVisable=true;
        },
        // 通过递归的形式获取所有三级权限的id ，并push到 数组defKeys中，默认选中 
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }
        
        node.children.forEach(item => {
            this.getLeafKeys(item,arr)
        });
        },
        // 权限对话框的关闭事件
        setRightDialogClosed(){
            this.defKeys=[]
        },
        //点击为确定分配权限
    async    allotRights(){
            const Keys=[
              ...this.$refs.treeRef.getCheckedKeys(),
              ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr =Keys.join(',');
            //角色授权
       const{data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}) ;
        if(res.meta.status !==200 ){
            return this.$message.error('角色授权失败！')
        }
        this.$message.success('角色授权成功！');
        this.getRoleList();
        this.setRightDialogVisable= false
        },
      async  removeRole(roleId){
           const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err=>err)
        if( confirmResult !=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res}= await this.$http.delete('roles/'+roleId);
        if(res.meta.status!==200){
            this.$message.error('删除角色失败')
        }
         this.$message.success('删除角色成功')
           this.getRoleList();
        }
    }
}
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
     .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style> 