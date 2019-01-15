<template>
	<div>
		<!-- <el-input style="width: 200px;"></el-input>
		<el-button>上传</el-button>
		<el-button>检查</el-button> -->
		<div class="toolbar-wrap">
			<div class="setting-icon" title="刷新" @click="refresh()">
				<i class="fa fa-refresh"></i>
			</div>
			<div class="setting-icon" title="上传" @click="showUploadDialog()">
				<i class="fa fa-upload"></i>
			</div>
			<div class="setting-icon" title="检查">
				<i class="fa fa-check"></i>
			</div>
		</div>
		<el-table id="table"
		    :data="tableData.filter(data => !search || data.algorithmName.toLowerCase().includes(search.toLowerCase())|| data.algorithmInformation.toLowerCase().includes(search.toLowerCase()))"
		    :row-style="rowClass"
		    style="width: 100%;"
		    v-loading="loading"
		    element-loading-text="加载中">
		    <el-table-column
		      label="名称"
		      prop="algorithmName"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="algorithmType"
		      label="类别" 
		      width="200"
		      :filters="[{ text: '融合算法', value: '家' }, { text: '挖掘算法', value: '公司' }]"
		      :filter-method="filterTag"
		      filter-placement="bottom-end">
		        <template slot-scope="scope">
		      		<div class="algorithm-label">
		      		{{scope.row.algorithmType?'挖':'融'}}
		      		</div>
		       <!--  <el-tag
		          :type="scope.row.tag === '家' ? 'primary' : 'success'"
		          disable-transitions>{{scope.row.tag}}</el-tag> -->
		      	</template>
    		</el-table-column>
		    <el-table-column
		      label="描述"
		      prop="algorithmInformation">
		    </el-table-column>
		   
		    <el-table-column
		      label="输出">
		    	<template slot-scope="scope">
		    		{{scope.row.algorithmOutputType}}
		    	</template>
		    </el-table-column>
		   <!--  <el-table-column 
		     	align="center"
		     >
		    	<template slot="header" slot-scope="scope">
		    	

			        <el-checkbox-group v-model="checkboxGroup" size="mini">
				      <el-checkbox v-for="city in algorithmSet" :label="city" :key="city">{{city}}</el-checkbox>
				    </el-checkbox-group>
		      	</template>
		      	<template slot-scope="scope">
		  
		        {{scope.row.algorithmType}}
		      	</template>
		    </el-table-column> -->
		    <el-table-column
		    	label="状态">
		    	 <template slot-scope="scope">
		      	<el-tag size="medium" type="success" v-if="scope.row.algorithmErrorMsg===null||scope.row.algorithmErrorMsg===''">
		      		正常
		      	</el-tag>
		      	<el-tag size="medium" type="danger" v-else>
		      		错误
		      	</el-tag>
		      </template> 
		    </el-table-column>
		    <el-table-column
		    	label="启用"	
		    	align="left">
		    	<template slot-scope="scope">
		    		<el-switch
						  v-model="scope.row.algorithmIsAavailabel"
						  active-color="#13ce66"
						  @change="changeAlgorithmAvailabel(scope.$index)"
						  inactive-color="#EBEEF5"
						  >
						</el-switch>
		    		<!-- <el-tooltip :content="scope.row.isAvailable?'禁用':'开启'" placement="top" effect="light">
			    		<el-switch
						  v-model="scope.row.isAvailable"
						  active-color="#13ce66"
						  @change="changeAlgorithmAvailabel(scope.$index)"
						  inactive-color="#EBEEF5"
						  >
						</el-switch>
					</el-tooltip> -->
		    	</template>
		    </el-table-column>		    
		    <el-table-column
		      align="right"
		      width="350"
		     >
		     <template slot="header" slot-scope="scope">

					<!-- <el-input
		      		
		          v-model="search"
		          size="mini"
		          placeholder="输入关键字搜索"/> -->
		         
		          <input
		          class="input-new"
		          v-model="search"
		          size="mini"
		          placeholder="输入关键字搜索"/>
		     </template>
		    <template slot-scope="scope">
		      	<el-button
		          size="mini"
		          @click="handleEdit(scope.$index, scope.row)">测试
		        </el-button>
		        <el-button
		          size="mini"
		          @click="handleEdit(scope.$index, scope.row)">设置
		        </el-button>
		        <el-button
		          size="mini"
		          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
  		</el-table>
  		<el-dialog width="30%" title="上传插件" :visible.sync="uploadForm.visible" :modal-append-to-body="false" @opened="dialogOpen()">
  			<el-form :model="uploadForm" ref="uploadForm" style="margin: 0 auto;width:100%;" >
  				<el-upload 
  					ref="upload" 
  					class="upload-demo" 
  					action="http://127.0.0.1:8000/processMiningPlatform/algorithmAction/parseJar" 
  					:show-file-list="true"
  					accept="jar"  
  					:auto-upload="true" 
  					:file-list="uploadForm.fileList" 
  					:before-upload="parseJar"
  					:on-change="changeJar"
  					:headers="uploadForm.headers"
  					>   
		          <div class="file-uploader"  v-bind:style="{width: uploadForm.select_file_area_width+'px'}">
		          	<span class="svg-container">
		           		<svg-icon icon-class="upload"></svg-icon>
		           	</span>		         
		           	 <div class="el-upload__text">点击上传Jar文件</div>
		          </div>
		          <div class="el-upload__tip" slot="tip">提示：请先上传Jar文件，再进行后续操作</div>
		        </el-upload>
		        <ul class="el-upload-list el-upload-list--text" v-if="uploadForm.isParseJarSuccessed">
		        	<li tabindex="0" class="el-upload-list__item is-ready">
		        		<a class="el-upload-list__item-name">
		        			<i class="el-icon-document"></i>{{uploadForm.file.name}}
    					</a>
    					<label class="el-upload-list__item-status-label" style="display: inline-block;">
    						<i class="el-icon-upload-success el-icon-circle-check"></i>
    					</label>
    				</li>
    			</ul>
		    </el-form>
		<!--     <div v-if="isAlgorithmVisible"> -->
			<div>
		    	<div class="tip-label">基本信息</div>
			    <el-form :model="algorithmInfoForm" :rules="algorithmInfoRules" ref="algorithmInfoForm" label-width="100px" class="demo-ruleForm" label-position="left">
			    	<el-form-item label="算法名称" prop="name">
			    		<el-input v-model = "algorithmInfoForm.name"></el-input>
			    	</el-form-item>
			    	<el-form-item  id="algorithmDesc" label="算法描述" prop="description">
			    		<el-input style="margin-left: -8px;" type="textarea" v-model="algorithmInfoForm.description"></el-input>
			    	</el-form-item>
			    	<el-form-item label="算法类型" prop="type">
			    		<el-radio-group v-model="algorithmInfoForm.type">
					      <el-radio label="融合算法" value="0"></el-radio>
					      <el-radio label="挖掘算法" value="1""></el-radio>
					    </el-radio-group>	
			    	</el-form-item>
			    	<div class="tip-label">运行信息</div>
			    	<!-- <el-form-item label="包名">
			    		<el-select v-model="algorithmInfoForm.packageName" placeholder="请选择包">
			    		</el-select>
			    	</el-form-item>
			    	<el-form-item label="类名">
			    		<el-select v-model="algorithmInfoForm.className" placeholder="请选择类">
			    		</el-select>
			    	</el-form-item>
			    	<el-form-item label="方法名">
			    		<el-select v-model="algorithmInfoForm.className" placeholder="请选择方法">
			    		</el-select>
			    	</el-form-item> -->
			    	
			    	<el-table style="width=100%" :data="algorithmInfoForm.runInfoTable">
			    		<el-table-column label="包名">
			    			<template slot-scope="scope">
			    				<el-select filterable v-model="algorithmInfoForm.runInfoTable.packageName" placeholder="请选择包">
			    				</el-select>
			    			</template>
			    		</el-table-column>
			    		<el-table-column label="类名">
			    			<template slot-scope="scope">
			    				<el-select filterable v-model="algorithmInfoForm.runInfoTable.className" placeholder="请选择类">
			    				</el-select>
			    			</template>
			    		</el-table-column>
			    		<el-table-column label="方法名">
			    			<template slot-scope="scope">
			    				<el-select filterable v-model="algorithmInfoForm.runInfoTable.methodName" placeholder="请选择方法">
			    				</el-select>
			    			</template>
			    		</el-table-column>
			    	</el-table>		    	
			    </el-form>
			    <el-table style="width=100%;" :data="algorithmInfoForm.parameterTable">
			    		<el-table-column label="参数名">
			    		<!-- 	<template slot-scope="scope">
			    				 <el-input v-model="scope.row.name"  placeholder="请输入参数名"/>
			    			</template> -->
			    		</el-table-column>
			    		<el-table-column label="默认值">
			    			<template slot-scope="scope">
			    				 <el-input v-model="scope.row.default_value"  placeholder="请输入默认值"/>
			    			</template>
			    		</el-table-column>
			    		<el-table-column label="参数类型">
			    			<!-- <template slot-scope="scope">
			    				<el-select filterable v-model="algorithmInfoForm.parameterTable.type" placeholder="请选择参数类型">
			    				</el-select>
			    			</template> -->
			    		</el-table-column>
			    		<!-- <el-table-column  align="center" width="60">
		    				<template slot="header" slot-scope="scope" >
		    					<div class="parameterBtn">
		    						<i class="fa fa-plus" title="添加"></i>	
		    					</div>	
		    				</template>

		    				<template slot-scope="scope">
		    					<div class="parameterBtn">
		    						<i class="fa fa-trash-o" title="删除"></i>
		    					</div>
		    				</template>
		    				
			    		</el-table-column> -->
			    </el-table>
		    </div>
		 
		    		
	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="uploadForm.visible = false">取 消</el-button>
	        	<!-- <el-button type="primary" @click="submitUpload()">确 定</el-button> -->
	        	<el-button type="primary" @click="submitUploadJar()" :loading="uploadForm.isParsingJar" disabled>确定</el-button>
	        </div>
  		</el-dialog>
	</div>
</template>

<script>
//查询算法
import { queryAlgorithms } from '../../api/api'
import {getJarInfo} from '../../api/api'
export default {
	components:{
		
	},
    data() {
      return {
      	upload:'',
      	loading:false,
        tableData: [],
        checkAll: false,
        search: '',
        // algorithmSet:['融合算法', '挖掘算法'],
        //上传算法界面的文件信息
        uploadForm: {
        	//默认的上传文件区域的宽度，之后会随着页面的大小而自适应
        	select_file_area_width:100,
        	headers:{
        		'Content-Type': 'application/x-www-form-urlencoded',
        	},
          	file: "",
          	visible: true,
          	dialogWidth: "30%",
          	limit: 1,
          	//上传文件时要上传的额外参数
          	upLoadData: {
            	format: '',
            	projectId: '',
          	},
          	//上传的文件列表
       		fileList: [],
       		//正在解析Jar
       		isParsingJar:false,
       		//解析Jar是否成功
       		isParseJarSuccessed:false,
        },
        //是否展示算法信息页面
        isAlgorithmVisible:false,
        //上传的算法的详细信息
        algorithmInfoForm:{
        	name:"",
        	description:"",
        	type:"",
        	runInfoTable:[
        		{
        			packageName:"",
        			className:"",
        			methodName:"",
        		}
        	],
        	parameterTable:[
        		{
        			//参数名字
        			name:"",
        			//默认值
        			default_value:"",
        			//类型
        			type:"",
        		}
        	],
        	//是否需要参数
        	isNeedParameter:false,
        },
        //输入的算法信息的规则验证
        algorithmInfoRules:{
        	name: [
            	{ required: true, message: '请输入算法名称', trigger: 'blur' },
            	// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          	],
          	description:[
          		// { required: true, message: '请填写活动形式', trigger: 'blur' }
          	],
          	type: [
            { required: true, message: '请选择算法类型', trigger: 'change' }
          	],
        },
      }
    },
    computed:{
    	// select_file_area_width(){
    	// 	//return document.body.clientWidth*0.3*0.9
    	// //	return document.body.scrollWidth*0.3*0.9
    	// }
    },
    mounted(){
    	//设置上传插件时文件选择区域的宽度
    
    	// 首先在Virtual DOM渲染数据时，设置下背景图的高度
	    this.uploadForm.select_file_area_width = document.body.clientWidth*0.3-40
	    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
	    const that = this
	    window.onresize = function temp() {
	        that.uploadForm.select_file_area_width = document.body.clientWidth*0.3-40
	    }
    },
    created(){
    	
    	this.$nextTick(function() {
    		//页面进入获取所有的算法信息
    		//this.getAllAlgorithms()
    	})
    	
    },
    methods: {
    	//打开文件上传对话框时的回调函数
    	dialogOpen(){
    		this.$nextTick(function() {
    		})		
    	},
    	//显示文件上传对话框
    	showUploadDialog(){
    		this.uploadForm.visible=true
    	},
    	//获取所有的算法信息
    	getAllAlgorithms(){
    		let _this =this
	    	//请求所有算法
	    	queryAlgorithms().then(data => {
	    		_this.loading = false
	    		//连接失败
	            if (typeof (data) == "undefined")
	               return false
	          	//获取成功
	          	if(data.code === 1){
	          		let algorithms = data.data.allAlgorithms
	          		_this.tableData = algorithms
	          	}   		
	    	})
    	},
    	//刷新
    	refresh(){
    		this.loading = true
    		if(!this.getAllAlgorithms()){
    			this.$notify({
		          title: '成功',
		          message: '刷新成功',
		          type: 'success'
		        })
    		}
    	},
    	//是否禁用算法
    	changeAlgorithmAvailabel(index){
    		//先恢复到原来的状态
    		//this.tableData[index].algorithmIsAavailabel = !this.tableData[index].algorithmIsAavailabel
    		// console.log(this.tableData[index].isAvailable)
    		// this.$confirm('是否禁用该算法?', '提示', {
		    //       confirmButtonText: '确定',
		    //       cancelButtonText: '取消',
		    //       type: 'warning'
		    //     }).then(() => {      
		    //     }).catch(() => {             
	     	//})
    	},
    	getRowClass({ row, column, rowIndex, columnIndex }) {
    		// if(rowIndex==0&&columnIndex==4)
    		// return {'color':'red','height':'40px','line-height':'40px'}
		},
    	rowClass (object, index) {
    	
    		let type = object.row.algorithmType
    		if(type==0)
      			return { "background-color": " 	#F5F5F5" }
      		else if(type==1)
      			return { "background-color": " 	#F8F8FF" }
    	},
      	handleEdit(index, row) {
        	console.log(index, row);
      	},
      	handleDelete(index, row) {
        	console.log(index, row);
      	},
      	filterHandler(value, row, column) {
        	const property = column['property'];
        	return row[property] === value;
      	},
      	filterTag(value, row) {
        	return row.algorithmType === value;
      	},
      	//上传Jar以解析其中的信息
      	submitUploadJar(){
      		this.$refs.upload.submit()
      	},
      	changeJar(file,fileList){
      		//重新选择jar文件
      		this.uploadForm.isParseJarSuccessed = false
      	},
      	//解析jar文件
      	parseJar(file) {
	        this.uploadForm.isParsingJar = true
	        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
	        const extension = testmsg === 'jar'
	    
	        const isLt2M = file.size / 1024 / 1024 < 10
	        if (file.size === 0) {
	        	this.$notify.error({
	        		title:'错误',
	        		message:'上传的文件大小为空，请检查。'
	        	})
	         	return
	        }
	        if (!extension ) {
	        	this.$notify.error({
	        		title:'错误',
	        		message:'上传的文件格式只能是Jar，请检查。'
	        	})
	        } else {
	        	this.uploadForm.file = file
	        	
	            let formData = new FormData()
	            formData.append('jar', file)
	            getJarInfo(formData).then(data=>{
	            //解析完毕
	            this.uploadForm.isParsingJar = false
	          	if(!data){
	          		return
	          	}
	          	if(data.code == 1){	
	          		this.uploadForm.isParseJarSuccessed = true 	
	          		//this.isAlgorithmVisible = true
	          		this.$notify({
	                title: '提示',
	                message: '上传成功！',
	                type: 'success'
	              })
	          	}
	          })
	          // formData.append('format', testmsg)
	          // formData.append('projectId', this.currentProject.pid)
	          // uploadEventLog(formData).then(data => {
	          //   if (typeof (data) == "undefined") {
	          //     return
	          //   }
	          //   if (data.code == 1) {
	          //     this.$notify({
	          //       title: '提示',
	          //       message: '上传成功！',
	          //       type: 'success'
	          //     })
	          //     this.uploadForm.visible = false
	          //     let createdTime = timestamp2Time(data.data.EventLogCreatetime)
	          //     let EventLog = { eventLogId: data.data.eventlogId, EventLog: data.data.EventLogName, rawLog: data.data.rawlog, eventLog: data.data.eventlog, createdTime: createdTime }
	          //     this.log.push(EventLog)
	          //   }
	          //   if (data.code == -1) {
	          //     this.$notify.error({
	          //       title: '提示',
	          //       message: data.msg
	          //     })
	          //   }
	          // })
	        }
	        return extension
      	},
    
      
    },
  }
</script>

<style lang="scss" scoped>
#uploadArea .el-upload-dragger{

		height: 110px;

}

.el-table th div{
	line-height: 0px !important;
}
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
.input-new:hover {
    border-color: #c0c4cc;
}
.input-new:focus{
	border: 1px solid #409EFF;
}
/**
* 工具栏
*/
.toolbar-wrap{
	padding: 5px;
	display:block;
	border-bottom:1px solid #f0f0f0;
	position: relative;
	top:0;
	left:0;
	height: 40px;
	width: 100%;
}
/**
* 图标按钮
*/
.setting-icon{

	margin-right: 10px;
	width: 32px;
	height: 32px;
	text-align: center;
	color: #4e535d;
	background-color: #a0a0a080;
	border-radius: 4px;
	display: inline-block;
	vertical-align: middle;
	line-height: 32px;
	font-size: 18px;
	cursor: pointer;
}
.setting-icon:hover{
	background-color:#c5c5c5;
}
.algorithm-label{
	height: 36px;
	width: 36px;
	border-radius: 20px;
	border: 1px solid #C0C4CC;
	color:#606266;
	font-size: 14px;
	line-height:36px;
	text-align: center;
}
.el-upload{
	width:100% !important;
}
.file-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden; 
    height:70px;
    width: 500px;
    display:block;
   
}
.file-uploader:hover {
	border-color: #409EFF;
}
.file-uploader-icon {
    font-size: 28px;
    color: #8c939d; 
    // line-height: 80px;
    text-align: center;

}
.svg-container {
 
   	font-size:40px;
    vertical-align: middle;
  	
    display: inline-block;

}
.tip-label{
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    display: block;
    font-size: 14px;
    height: 10px;
    line-height:10px;
 }

 #algorithmDesc{
 	//为了对齐
 	margin-left: 8px;
 	margin-right:-8px;
 }
 .parameterBtn{
 	font-size:20px;
 	line-height:20px;
 }
 .parameterBtn:hover{
 	color:#c5c5c5;
 	cursor:pointer;
 }
</style>