<!--左侧导航组建-->
<template>
	<span id="breadcrumb">
		<!-- <el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb> -->
		<el-breadcrumb separator="/">
  			<el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
  		
  			<el-breadcrumb-item v-if="$route.name!='首页'">{{$route.name}}</el-breadcrumb-item>
		</el-breadcrumb>

	</span>
</template>
<script >
	export default{
		name:'breadcrumb',
		data(){
			return{
				isHomePage:false,
			}
		},
		computed:{
			
		},
		created(){
		},
		methods:{
		},
	}
	
</script>
<style lang="scss" scoped>
	#breadcrumb{
		line-height: 60px;
		display: inline-block;
		font-size: 14px;
		font-weight: bold;


	}
</style>