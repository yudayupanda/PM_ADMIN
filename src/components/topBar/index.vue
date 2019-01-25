<!--上侧导航组建-->
<template>
	<div id="topbar" :class="{collapsed:isCollapsed}">
			<i id="toggleBtn" :class="[isCollapsed? 'fa fa-align-right':'fa fa-align-left']" @click="toggleSiderBar"></i>
			<span style="width: 30px;height: 20px;display: inline-block;"></span>
			<breadcrumb></breadcrumb>
			<span class="userInfo">
			<el-dropdown  trigger="hover" >
				<div  class="el-dropdown-link userinfo-inner">
					<i class="fa fa-user fa-fw "></i>
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item><i class="fa fa-user fa-fw"></i>&nbsp;{{userName}}</el-dropdown-item>
					<el-dropdown-item ><i class="fa fa-envelope-o fa-fw"></i>&nbsp;{{email}}</el-dropdown-item>
					<el-dropdown-item :divided="true" @click.native="showConfig">
					<span >
						<i class="fa fa-cog fa-fw"></i>&nbsp;设置
					</span>
					</el-dropdown-item>
					<el-dropdown-item :divided="true" @click.native = "logOut()"><span><i class="fa fa-power-off fa-fw"></i>&nbsp;注销</span></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</span> 
			<el-dialog title="设置"   :visible.sync="accountCogForm.visible" width="35%" :modal-append-to-body="false">
				<el-tabs v-model="accountCogForm.activeName" :tab-position="accountCogForm.tabPosition" style="height:auto;">
					<el-tab-pane label="账户设置" name="0">
					<el-form :model="accountCogForm" label-width="80px">
						<el-form-item label="帐号">
						<el-input v-model="email" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="用户名">
						<el-input v-model="userName"></el-input>
						</el-form-item>
						<el-form-item style="margin-top:30px;">
						<el-button type="primary" style="width:100%">保存</el-button>
						</el-form-item>
					</el-form>
					</el-tab-pane>
					<el-tab-pane label="密码设置" name="1">
					<el-form :model="accountCogForm" label-width="90px">
						<el-form-item label="旧密码">
						<el-input type="password" v-model="accountCogForm.oldPass"></el-input>
						</el-form-item>
						<el-form-item label="新密码">
						<el-input type="password" v-model="accountCogForm.newPass"></el-input>
						</el-form-item>
						<el-form-item label="确认新密码">
						<el-input type="password" v-model="accountCogForm.newPassCheck"></el-input>
						</el-form-item>
						<el-form-item style="margin-top:30px;">
						<el-button type="primary" style="width:100%">保存</el-button>
						</el-form-item>
					</el-form>
					</el-tab-pane>
				</el-tabs>
		</el-dialog>
	</div>

</template>
<script >
	import breadcrumb from "../breadcrumb/index.vue"
	export default{
		name:'topbar',
		components:{
			'breadcrumb':breadcrumb,
		},
		data(){
			return{
				userName:"",
				email:"",
				accountCogForm:{
					visible:false,
					activeName:'0',
					//选项卡位置
					tabPosition:'left',
					oldPass:'',
					newPass:'',
					newPassCheck:'',
				}, 
			}
		},
		computed:{
			isCollapsed(){
				return this.$store.state.common.isCollapsed
			}
		},
		created(){

		},
		mounted() {
			this.$nextTick(function() {
				let user = JSON.parse(sessionStorage.getItem('user'))
				this.userName = user.nickname
				this.email = user.email
      		})  
    	},
		methods:{
			toggleSiderBar() {
      			this.$store.commit('toggleSiderBar')
			},
			 showConfig(){
				// let user = JSON.parse(sessionStorage.getItem('user'))
				// this.userName = user.nickname
				// this.accountCogForm.activeName='0'
				// this.accountCogForm.oldPass=''
				// this.accountCogForm.newPass=''
				// this.accountCogForm.newPassCheck=''
				// this.accountCogForm.visible=true
				this.accountCogForm.visible=true
			}, 
			logOut(){
				let _this = this
				this.$confirm('是否退出?', '提示', {   
				}).then(() => {
					sessionStorage.removeItem('user')  
					_this.$router.push({path: '/Login' })
				}).catch(() => {
					
				})
      		},
			sendMsg: function () { //传参方法
				this.$emit('headCallBack', 'openSetting'); //第一个参数是父组件中v-on绑定的自定义回调方法，第二个参数为传递的参数
			},
		},
	}
	
</script>
<style lang="scss" scoped>
#topbar{
	z-index:10;
	position: fixed;
	left: 200px;
	width:100%;
  	border-bottom: 1px solid #ddd;
  	background: #fff;
  	color: #353d47;
  	padding: 0 15px;
  	box-sizing: border-box;
  	height: 60px;
  	line-height: 60px;
  	transition: all 0.5s;
  	&.collapsed{
        transition: all 0.5s;
        left:64px;
    }
}
#toggleBtn{
	cursor: pointer;
}
.userInfo{
 
  position:fixed;
  right: 40px;
  cursor: pointer;
  height: 60px;
  color: #EBEEF5;
  display:inline-block;
}
 .userinfo-inner {
  cursor: pointer;
  margin-top: 20px;
  width:40px;
  height:40px;
  font-size: 25px; 
  line-height: 25px;
}
</style>