<!--左侧导航组建-->
<template>
	<div id="topbar" :class="{collapsed:isCollapsed}">
		<el-row>
			<el-col :span="1">
			 	<i id="toggleBtn" :class="[isCollapsed? 'fa fa-align-right':'fa fa-align-left']" @click="toggleSiderBar"></i>
			</el-col>
			<el-col :span="4">
				<breadcrumb></breadcrumb>
			</el-col>
		</el-row>
		
		
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

			}
		},
		computed:{
			isCollapsed(){
				return this.$store.state.common.isCollapsed
			}
		},
		created(){

		},
		methods:{
			toggleSiderBar() {
      			this.$store.commit('toggleSiderBar')
    		},
		},
	}
	
</script>
<style lang="scss" scoped>
#topbar{
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
</style>