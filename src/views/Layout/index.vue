<template>
  <div id="main">
     <el-container style="height: 100%;">
      <sidebar></sidebar>
      <topbar></topbar>
       <router-view id="routerView" :class="{collapsed:isCollapsed}"></router-view>
    </el-container>
  </div>

<!-- 	<div id="">
	
		<sidebar></sidebar>
		<div id="section" :class="{collapsed:isCollapsed}">
			<topbar></topbar>
			<router-view id="routerView" class="animated fadeIn"></router-view>
		</div>

	</div> -->
</template>


<script>
import sidebar from "../../components/sidebar/index.vue"
import topbar from "../../components/topbar/index.vue"

export default {
	name:'layout',
	components:{
		'sidebar':sidebar,
		'topbar':topbar,
	},
	computed:{
		isCollapsed(){
			return this.$store.state.common.isCollapsed
		}
	},
    data() {
      return {
        isCollapse: true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
<style lang="scss" scoped>
  #main{
    width: 100%;
    height: 100%;

  }
  #routerView{
      position: fixed;
      left:200px;
      right: 0px;
      top:60px;
      box-sizing: border-box;
      transition: all 0.5s;
      padding: 10px;
      &.collapsed{
        transition: all 0.5s;
        left:64px;
      }
  }


</style>