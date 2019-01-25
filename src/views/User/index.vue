<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.nickname" placeholder="nickname"></el-input>
				</el-form-item> -->
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" plain  @click="handleAdd"><i class="fa fa-plus"></i> 新增</el-button>
					<el-button icon="el-icon-delete" type="primary" plain :disabled="this.sels.length===0" @click="batchRemove()">删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userTable" highlight-current-row v-loading="" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" >
			</el-table-column>
			<el-table-column type="index" >
			</el-table-column>
			<el-table-column prop="nickname" label="用户名" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱">
			</el-table-column>
			
			<el-table-column prop="banned" label="状态" >
				<template slot-scope="scope">
					<el-tag size="medium" type="success" v-if="scope.row.banned === false">
						未禁用
					</el-tag>
					<el-tag size="medium" type="danger" v-else>
						禁用
					</el-tag>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="activated" label="activated" >
				<template slot-scope="scope">
					<el-tag size="medium" type="danger" v-if="scope.row.activated === false">
						未启用
					</el-tag>
					<el-tag size="medium" type="success" v-else>
						启用
					</el-tag>
				</template>
			</el-table-column> -->
			<!-- <el-table-column prop="type" label="type" >
				<template slot-scope="scope">
					<el-tag size="medium" type="info" v-if="scope.row.type === true">
						管理员
					</el-tag>
					<el-tag size="medium" type="info" v-else>
						用户
					</el-tag>
				</template>
			</el-table-column> -->
			<el-table-column align="right">
			  	<template slot="header" slot-scope="scope">
		          <input
		          class="input-new"
		          v-model="search"
		          size="mini"
		          placeholder="输入关键字搜索"/>
		     	</template>
				<template slot-scope="scope">
					<el-button
					  size="mini"
					  @click="handleEdit(scope.$index, scope.row)">编辑
					</el-button>
					<el-button
					  size="mini"
					  @click="handleDel(scope.$index, scope.row)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length === 0">批量删除</el-button>
			<el-pagination layout="total,prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="page" :page-size="2" :total="total" style="float:right;">
			</el-pagination>
		</el-col> -->

		<!--编辑界面-->           
		<el-dialog title="编辑用户" :visible.sync="editForm.visible" :modal-append-to-body="false" width="30%"> 
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"  :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
			<!-- 	<el-form-item label="password" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item> -->
				<el-form-item label="状态" prop="banned">
					<el-select v-model="editForm.banned" placeholder="请选择" style="width: 100%;">
					    <el-option label="未禁用" value=0> </el-option>
					    <el-option label="禁用" value=1> </el-option>
					 </el-select>
				</el-form-item>
			<!-- 	<el-form-item label="activated" prop="activated">
					<el-select v-model="editForm.activated" placeholder="请选择">
					    <el-option label="未启用" value=0> </el-option>
					    <el-option label="启用" value=1> </el-option>
					 </el-select>
				</el-form-item> -->
				<el-form-item label="type" prop="类别">
					<el-select v-model="editForm.type" placeholder="请选择" style="width: 100%;">
					    <el-option label="管理员" value=1> </el-option>
					    <el-option label="用户" value=0> </el-option>
					 </el-select>
					<el-input type="hidden" v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editForm.visible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">确定</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增用户" :visible.sync="addForm.visible" :modal-append-to-body="false" width="30%">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名" prop="nickname" >
					<el-input v-model="addForm.nickname" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="addForm.password" ></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="banned">
					<el-select v-model="addForm.banned" placeholder="请选择" style="width: 100%;">
					    <el-option label="未禁用" value=0> </el-option>
					    <el-option label="禁用" value=1> </el-option>
					 </el-select>
				</el-form-item>
				<!-- <el-form-item label="activated" prop="activated">
					<el-select v-model="addForm.activated" placeholder="请选择">
					    <el-option label="未启用" value=0> </el-option>
					    <el-option label="启用" value=1> </el-option>
					 </el-select>
				</el-form-item> -->
				<el-form-item label="类别" prop="type">
					<el-select v-model="addForm.type" placeholder="请选择" style="width: 100%;">
					    <el-option label="管理员" value=1> </el-option>
					    <el-option label="普通用户" value=0> </el-option>
					 </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addForm.visible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {getBasicUser,addUser,deleteUser} from '../../api/api'
	export default {
		data() {
			//验证邮箱
			let validateEmail = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入邮箱'))
				} else {
					if(!this.checkEmailForm(value)){
						return callback(new Error('邮箱格式不正确'))
					}
					callback()
				}
			}
			//验证密码
			let validatePass = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入密码'))
				} else {
					if(value.length<6){
						return callback(new Error('密码长度不能小于6'))
					}
					callback();
				}
			}
			//验证用户名
			let validateNickname = (rule,value,callback)=>{
				if(!value){
					return callback(new Error('请输入用户名'))
				}else{
					let regEx = /^(?!_)(?!.*?_$)[a-zA-Z0-9_u4e00-u9fa5]+$/
					if(!regEx.test(value)){
						return callback(new Error('用户名只能包含中文、数字、英文和下划线'))
					}
					callback()
				}
			}
			let validateBanned = (rule,value,callback)=>{
				if(!value){
					return callback(new Error('请选择Banned'))
				}else{
					callback()
				}
			}
			let validateType = (rule,value,callback)=>{
				if(!value){
					return callback(new Error('请选择Type'))
				}else{
					callback()
				}
			}
			let validateActivated = (rule,value,callback)=>{
				if(!value){
					return callback(new Error('请选择Activated'))
				}else{
					callback()
				}
			}
			return {
				search: '',
				filters: {
					nickname: ''
				},
				adminUser:'',
				users: [],
				total: 6,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editLoading: false,
				editFormRules: {
					nickname: [
						{ validator: validateNickname, trigger: 'blur' }
					],
					email: [
						{ validator: validateEmail,  trigger: 'blur' },
					],
					password: [
						{ validator:validatePass,  trigger: 'blur' },
					],
					banned: [
						{ validator:validateBanned, trigger: 'blur' },
					],
					activated: [
						{ validator:validateActivated, trigger: 'blur' },
					],
					type:[
						{ validator:validateType, trigger: 'blur' },
					]
				},
				//编辑界面数据
				editForm: {
					visible: false,
					nickname: '',
					email: '',
					password: '',
					banned: '',
					activated: '',
					type:'',
					id:'',
				},

				addLoading: false,
				addFormRules: {
					nickname: [
						{ validator: validateNickname, trigger: 'blur' }
					],
					email: [
						{ validator: validateEmail,  trigger: 'blur' },
					],
					password: [
						{ validator:validatePass,  trigger: 'blur' },
					],
					banned: [
						{ validator:validateBanned, trigger: 'blur' },
					],
					activated: [
						{ validator:validateActivated, trigger: 'blur' },
					],
					type:[
						{ validator:validateType, trigger: 'blur' },
					]
				},
				//新增界面数据
				addForm: {
					visible: false,
					nickname: '',
					email: '',
					password: '',
					banned:0,
					activated:1,
					type:0,
				}
			}
		},
		computed:{
	      	userTable:function(){
		        let search = this.search
		        if(search){
		          return  this.users.filter(function(dataNews){
		            return Object.keys(dataNews).some(function(key){
		              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
		            })
		          })
		        }
		        return this.users
	      	},
	    },
		methods: {

			//获取用户列表
			getUsers() {
				// let para = {
				// 	page: this.page,
				// 	lineSize : 2,
				// 	key: this.filters.nickname,
				// };
				// this.listLoading = true;
				// console.log(para)
				let params = {email:this.adminUser.email,password:this.adminUser.password}
				getBasicUser(params).then((res) => {
					if(res.code == 1){
						this.users = res.data
						this.listLoading = false
					}else{
						this.$message.error('错误，获取用户列表失败.')
					}
					

				})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('该操作将永久删除所选用户，是否继续?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					deleteUser(para).then((res) => {
						this.listLoading = false;
						if(res.code === 1){
							this.$message({
					          message: '删除用户成功！',
					          type: 'success'
					        })
						}else{
							 this.$message.error('错误，删除用户失败');
						}
						this.getUsers()
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editForm.visible  = true;
				let para = Object.assign({}, row);
				this.editForm.id = para.id
				this.editForm.nickname = para.nickname
				this.editForm.email = para.email
				this.editForm.password = para.password
				if(para.banned === false){
					this.editForm.banned = "0"
				}else{
					this.editForm.banned="1"
				}
				// if(para.activated === false){
				// 	this.editForm.activated = "0"
				// }else{
				// 	this.editForm.activated="1"
				// }
				if(para.type === false){
					this.editForm.type = "0"
				}else{
					this.editForm.type="1"
				}		
			},
			//显示新增界面
			handleAdd: function () {
				this.addForm.visible = true,
				this.addForm.nickname= '',
				this.addForm.email= '',
				this.addForm.password= '',
				this.addForm.banned= '未禁用',
				this.addForm.activated= '',
				this.addForm.type='普通用户'
			},
			//编辑
			editSubmit: function (formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						editUser(para).then((res) => {para
							this.editLoading = false;
							//NProgress.done();
							if(res.code === 1){
								this.notify(1,res.msg)
							}else{
								this.notify(2,res.msg)
							}
							this.$refs['editForm'].resetFields();
							this.editForm.visible = false;
							this.getUsers();
						});
					}
				});
			},
			//新增
			addSubmit: function (formName) {
				this.$refs[formName].validate((valid) => {    
					if (valid) {
						this.addLoading = true
						let banned = this.addForm.banned == "未禁用"?true:false
						let para = {nickname:this.addForm.nickname,email:this.addForm.email,password:this.addForm.password,
							banned:banned,activated:true
						}
						//传数据到后台
						addUser(para).then((res) => {
							this.addLoading = false;
							if(res.code === 1){
								this.$message({
						          message: '删除用户成功！',
						          type: 'success'
						        })
							}else{
								 this.$message.error('错误，删除用户失败');
							}
							this.$refs['addForm'].resetFields()
							this.addForm.visible = false
							this.getUsers()
						})
						this.addForm.visible = false
					}else{
						this.addFormVisible = false
						return false
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						if(res.code === 1){
							this.notify(1,res.msg)
						}else{
							this.notify(2,res.msg)
						}
						this.getUsers();
					});
				}).catch(() => {
				});
			},
			//检查邮件格式
			checkEmailForm(email){
				let ema = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				return  ema.test(email)
			},
			//提示框
			notify(type,message){
				let typeMap={}
				typeMap[0]=['警告','warning']
				typeMap[1]=['成功','success']
				typeMap[2]=['错误','error']
				typeMap[3]=['提示','info']
				this.$notify({
					title:  typeMap[type][0],
					message: message,
					type:  typeMap[type][1],
				});
			},
		},
		mounted() {
			let user = JSON.parse(sessionStorage.getItem('user'))
			this.adminUser = user
			this.getUsers()
		}
	}

</script>

<style scoped>
/**
* 重写输入框
*/
.input-new{
	text-overflow:ellipsis;
	overflow: hidden;
	background-color: #fff;
	background-image: none;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
    border-top-color: rgb(220, 223, 230);
    border-right-color: rgb(220, 223, 230);
    border-bottom-color: rgb(220, 223, 230);
    border-left-color: rgb(220, 223, 230);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	font-size: 12px;
	height: 28px;
	line-height: 28px;
	outline: 0;
	padding: 0 25px;
	-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
	transition: border-color .2s cubic-bezier(.645,.045,.355,1);
	position: relative;
	left: 0px;
	width: 100%;
}
</style>