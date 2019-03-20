<!--左侧导航组建-->
<template>
	<div id="sidebar" :class={collapsed:isCollapsed}>
		<div class="logo">
			{{isCollapsed?'PM':'PMAMAS'}}
		</div>
		<!--导航菜单-->
		
		<el-menu background-color="#304156" text-color="#BFCBD9" :default-active="$route.path"  class="el-menu-vertical-demo"  unique-opened  router  :collapse="isCollapsed">
			<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
				<el-submenu :index="index+''" v-if="!item.leaf">
					<template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
					<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
				</el-submenu>
				<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
					<i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
</template>
<script >
	export default{
		name:'sidebar',
		data(){
			return{

			}
		},
		computed:{
			//得到是否缩小状态
			isCollapsed(){
				return this.$store.state.common.isCollapsed
			}
		},
		created(){

		},
		methods:{
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
	}
	
</script>
<style lang="scss" scoped="">
#sidebar{
	position: fixed;
	left: 0;
	width:200px;
	height:100%;
	overflow-y: hidden;
	overflow-x: hidden;
	transition: all .5s;
	background: #304156;
	&.collapsed {
    	width: 64px;
   	 	transition: all 0.5s;
  	}
  	.logo{
  		color: #353d47;
  		background:#3f4d67;	
  		color: #fff;
	    text-align: center;
	    padding: 18px 0;
	    margin: 0;
	    height: 60px;
	    box-sizing: border-box;
	    font-size: 18px;
	    font-weight: bold;
  	}
 	.el-menu {
  		height: 100%;
  		border-radius: 0px !important;
  		border-right:0px !important;
	}

}

</style>