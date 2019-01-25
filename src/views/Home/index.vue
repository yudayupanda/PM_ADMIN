<template>
	<section>
		<div class="heading">
			更新日志
			<el-button style="float: right;">Github Releases</el-button>
		</div>
		<div class="versionHeading">
			<span class="version">1.0.0</span>
			<span class="date">2019-01-25</span>
		</div>
		<div class="content">
			<div class="update">用户管理功能 : 新增、删除、更新用户</div>
			<div class="update">插件管理功能 : 上传、删除、更新插件</div>
		</div>
	</section>
</template>
<style lang="scss" scoped>
.heading{
	margin-left: 20px;
	margin-top: 20px;
	font-size: 24px;
	margin-bottom: 50px;
	color: #000;
	width: 50%;
	height: 30px;
	line-height: 30px;
}
.versionHeading{
	border: 1px solid #ddd;
	width: 50%;
	margin-left:20px;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	padding-left: 30px;
	box-sizing:border-box;  
}
.content{
	font-family:" SimHei";
	border: 1px solid #ddd;
	border-top: 0px;
	width: 50%;
	
	margin-left:20px;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
	padding: 30px;
	padding-left:50px;
	font-size:16px;
	box-sizing:border-box;  
	font-weight:500;
}
.update{
	margin-bottom: 20px;
}
.update::before{
	content: "";
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: #333;
	-ms-transform: translateX(-20px);
	transform: translateX(-20px);
	display: inline-block;
	vertical-align: middle;
}
.version{
	line-height: 80px;
	font-size:28px;
	color:#303133;
	font-weight: normal;
}
.date{
	line-height: 80px;
	font-size:16px;
	color:#909399;
	font-weight: normal;
	float: right;
	margin-right: 30px;
}
</style>