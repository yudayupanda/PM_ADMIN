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
			<!-- <div class="setting-icon" title="检查">
				<i class="fa fa-check"></i>
			</div> -->
		</div>
		<el-table id="table"
		    :data="tableData.filter(data => !search || data.algorithmName.toLowerCase().includes(search.toLowerCase())|| data.algorithmInformation.toLowerCase().includes(search.toLowerCase()))"
		    :row-style="rowClass"
		    style="width: 100%;"
		    v-loading="loading"
		    element-loading-text="加载中">
		    <el-table-column
		      type="index"
		      width="50">
		    </el-table-column> 	
		    <el-table-column
		      label="名称"
		      prop="algorithmName"
		      >
		    </el-table-column>
		    <el-table-column
		      prop="algorithmType"
		      label="类别" 
		      width="200"
		      :filters="[{ text: '融合算法', value: '0' }, { text: '挖掘算法', value: '1' }]"
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
						  v-model="scope.row.algorithmIsAvailable"
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
		      	<!-- <el-button
		          size="mini"
		          @click="handleEdit(scope.$index, scope.row)">检查
		        </el-button> -->
		        <el-button
		          size="mini"
		          @click="handleEdit(scope.$index, scope.row)">设置
		        </el-button>
		        <el-button
		          size="mini"
		          @click="deleteAlgorithm(scope.$index)">删除</el-button>
		      </template>
		    </el-table-column>
  		</el-table>
  		<el-dialog width="30%" title="上传插件" :visible.sync="uploadForm.visible" :modal-append-to-body="false" @opened="dialogOpen()" @closed="closeUploadJarDialog()">
  			<el-form :model="uploadForm" ref="uploadForm" style="margin: 0 auto;width:100%;" >
  				<el-upload 
  					ref="upload" 
  					class="upload-demo" 
  					action="" 
  					:show-file-list="true"
  					accept="jar"  
  					:auto-upload="false" 
  					:file-list="uploadForm.fileList" 
  					:before-upload="uploadFile"
  					:on-change="changeJar"
  					
  					:limit="1"
  					>   
		          <div class="file-uploader"  v-bind:style="{width: uploadForm.select_file_area_width+'px'}">
		          	<span class="svg-container">
		           		<svg-icon icon-class="upload"></svg-icon>
		           	</span>		         
		           	 <div class="el-upload__text">点击上传Jar文件</div>
		          </div>
		          <div class="error__tip" slot="tip" v-if="uploadForm.isFileListEmpty">请上传文件</div>
		        </el-upload>
		        <ul class="el-upload-list el-upload-list--text" v-if="uploadForm.isuploadSuccessed">
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
				<div style="margin-top: 10px;">

					<el-input type="file" id="select_json_btn" style="display:none" @change="uploadConfigJson()"/>
					<div class="setting-icon light-setting-icon"  title="重置" @click="resetAllForms()">
						<svg-icon icon-class="reset" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
					<div class="setting-icon light-setting-icon"  title="导入配置文件" @click="openImportJsonDialog">
						<svg-icon icon-class="json" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
				</div>
				<!-- <el-card>
					<svg-icon icon-class="reset"></svg-icon>
					
					<svg-icon icon-class="import"></svg-icon>
				</el-card> -->
				<!-- <div style="width: 100%;height: 30px;text-align: right;font-size:25px;">
					
				</div> -->
				<!-- <div class="tip-label">
					<svg-icon icon-class="reset"></svg-icon>
					
					<svg-icon icon-class="import"></svg-icon>
				</div> -->
		    	<div class="tip-label" style="margin-top: 10px;" @click="isBaseInfoPanelActive=!isBaseInfoPanelActive">
		    		基本信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':isBaseInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="isBaseInfoPanelActive">
					    <el-form  :model="algorithmInfoForm" :rules="algorithmBaseInfoRules" ref="algorithmInfoForm" label-width="100px" class="demo-ruleForm" label-position="left">
					    	<el-form-item label="算法名称" prop="name">
					    		<el-input v-model = "algorithmInfoForm.name"></el-input>
					    	</el-form-item>
					    	<el-form-item  class="notNeedValid" label="输出类型" prop="outputType">
					    		<el-input style="margin-left: -8px;" v-model="algorithmInfoForm.outputType"></el-input>
					    	</el-form-item>
					    	<el-form-item  class="notNeedValid" label="算法描述" prop="description">
					    		<el-input style="margin-left: -8px;" type="textarea" v-model="algorithmInfoForm.description"></el-input>
					    	</el-form-item>
					    	<el-form-item label="算法类型" prop="type">
					    		<el-radio-group v-model="algorithmInfoForm.type">
							      <el-radio label="融合算法" value="0"></el-radio>
							      <el-radio label="挖掘算法" value="1"></el-radio>
							    </el-radio-group>	
					    	</el-form-item>
					    </el-form>
			    	</div>
				</el-collapse-transition>
			    <div class="tip-label" @click="isRunTimeInfoPanelActive=!isRunTimeInfoPanelActive">
		    		运行信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':isRunTimeInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="isRunTimeInfoPanelActive">
		    			<el-table style="width=100%" :data="runTimeInfoForm.runInfoTable">
				    		<el-table-column label="包名">
				    			<template slot-scope="scope">
				    				<!-- <el-select filterable v-model="algorithmInfoForm.runInfoTable.packageName" placeholder="请选择包">
				    				</el-select> -->
				    				<el-form :model="scope.row" :rules="algRunTimeInfoRules" ref="packageNameForm">
				    					<el-form-item prop="packageName" style="margin-bottom: 16px;">
				    						<el-input v-model="scope.row.packageName"  placeholder="请输入包名"/>
				    					</el-form-item> 
				    				</el-form>
				    					   					
				    			</template>
				    		</el-table-column>
				    		<el-table-column label="类名">
				    			<template slot-scope="scope">
				    				<el-form :model="scope.row" :rules="algRunTimeInfoRules" ref="classNameForm">
				    					<el-form-item prop="className" style="margin-bottom: 16px;">
				    						<el-input v-model="scope.row.className"  placeholder="请输入类名"/>
				    					</el-form-item> 
				    				</el-form>
				    			</template>
				    		</el-table-column>
				    		<el-table-column label="方法名">
				    			<template slot-scope="scope">
				    				<el-form :model="scope.row" :rules="algRunTimeInfoRules" ref="methodNameForm">
				    					<el-form-item prop="methodName" style="margin-bottom: 16px;">
				    						<el-input v-model="scope.row.methodName"  placeholder="请输入方法名"/>
				    					</el-form-item> 
				    				</el-form>
				    			</template>
				    		</el-table-column>		    		
			    		</el-table>
			    
				    	<el-table style="width=100%;" :data="algParameterForm.parameterTable">
				    		<el-table-column label="参数名">
				    			<template slot-scope="scope" >
				    				<el-form :model="scope.row" :rules="algParameterRules" ref="parameterNameForm">
					    				<el-form-item prop="parameterName" style="margin-bottom: 16px;" >
					    				 	<el-input v-model="scope.row.parameterName"  @focus="addOneRowParameter" placeholder="请输入参数名称"/>
					    				</el-form-item>
				    				</el-form>
				    			</template>
				    		</el-table-column>
				    		<el-table-column label="默认值">
				    			<template slot-scope="scope" >
				    				 	<el-input v-model="scope.row.defaultValue"   style="margin-bottom: 16px;" placeholder="请输入默认值"/>
				    			</template>
				    		</el-table-column>
				    		<el-table-column label="参数类型">
				    			<template slot-scope="scope" >
				    				<el-form :model="scope.row" :rules="algParameterRules" ref="parameterTypeForm">
					    				<el-form-item  style="margin-bottom: 16px;" prop="parameterType">
						    				<el-select filterable v-model="scope.row.parameterType" placeholder="请选择参数类型">
						    					<el-option v-for="item in algParameterForm.algParameterType" :key="item.value" :label="item.label"  :value="item.value">
						    					</el-option>
						    				</el-select>
					    				</el-form-item>
				    				</el-form>
				    			</template>
				    		</el-table-column>
				    		<el-table-column  align="center" width="60">
			    				<template slot="header" slot-scope="scope" >
			    					<div class="parameterBtn" @click="addOneRowParameter">
			    						<i class="el-icon-plus" title="添加参数"></i>	
			    					</div>	
			    				</template>

			    				<template slot-scope="scope">
			    					<div class="parameterBtn" style="margin-bottom: 16px;" @click="deleteOneRowParameter(scope.$index)">
			    						<i class="el-icon-close" title="删除此条参数"></i>
			    					</div>
			    				</template>

				    		</el-table-column>
			    		</el-table>  
		    		</div>
		    	</el-collapse-transition>
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
			 <!--    <el-form :model="runTimeInfoForm"  ref="runTimeInfoForm" :rules="algRunTimeInfoRules"> -->
			    	  	
		    	
		    </div>
		 
		    		
	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="uploadForm.visible = false">取 消</el-button>
	        	<!-- <el-button type="primary" @click="submitUpload()">确 定</el-button> -->
	        	<el-button type="primary" @click="submitUpload()" :loading="uploadForm.isUploading">上传</el-button>
	        </div>
  		</el-dialog>
	</div>
</template>

<script>
//查询算法
import { queryAlgorithms } from '../../api/api'
import {upload} from '../../api/api'
import {deleteAlgorithm} from '../../api/api'
import {updateAlgorithmAvailable} from '../../api/api'
import qs from 'qs'
export default {
	components:{	
	},
    data() {
    	let validate = (rule, value, callback) => {

    		if(!value)
    			callback(new Error('请输入包名'))
    		else
    			callback()
	        // if (value === '') {
	          
	        // } else {
	          	
	        //   callback();
	        // }
      	}
      return {
      	//控制折叠面板
      	isBaseInfoPanelActive:true,
      	isRunTimeInfoPanelActive:true,
      	inactiveLogoClass:'el-collapse-item__arrow el-icon-arrow-right',
      	upload:'',
      	loading:true,
        tableData: [],
        checkAll: false,
        search: '',
        // algorithmSet:['融合算法', '挖掘算法'],
        //上传算法界面的文件信息
        uploadForm: {
        	//默认的上传文件区域的宽度，之后会随着页面的大小而自适应
        	select_file_area_width:100,
          	file: "",
          	visible: false,
          	dialogWidth: "30%",
          	limit: 1,
          	isFileListEmpty:false,
          	//上传的文件列表
       		fileList: [],

       		//上传Jar是否成功
       		isuploadSuccessed:false,
       		//是否正在上传
       		isUploading:false,
        },
        //是否展示算法信息页面
        isAlgorithmVisible:false,
        //上传的算法的详细信息
        algorithmInfoForm:{
        	name:"",
        	description:"",
        	//输出类型
        	outputType:"",
        	type:"",
        },
        //算法运行时的信息表单
        runTimeInfoForm:{
        	//算法包、类、方法信息
        	runInfoTable:[
        		{
        			packageName:"",
        			className:"",
        			methodName:"",
        		}
        	],
        },
        //算法参数信息表单
        algParameterForm:{
        	//算法参数表格
        	parameterTable:[
        		
        	],
        	algParameterType:[
        		{
        			value:0,
        			label:"整型"
        		},
        		{
        			value:1,
        			label:"浮点型"
        		},
        		
        		{
        			value:2,
        			label:"字符串"
        		},
        		{
        			value:3,
        			label:"布尔型"
        		},
        	],
        },
        //输入的算法基本信息的规则验证
        algorithmBaseInfoRules:{
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
        //算法运行时的包、类、方法信息的验证
        algRunTimeInfoRules:{
        	packageName:[
        		{ required: true, message: '请输入包名', trigger: 'blur' }
        	],
        	className:[
        		{required:true,message:'请输入类名',trigger:'blur'}
        	],
        	methodName:[
        		{required:true,message:'请输入方法名',trigger:'blur'}
        	],
        },
        //算法参数的验证
        algParameterRules:{
        	parameterName:[
        		{required:true,message:'请输入参数名称',trigger:'blur'}
        	],
        	parameterType:[
        		{required:true,message:'请选择参数类型',trigger:'change'}
        	],
        },
      }
    },
    watch:{
    },
    computed:{
    	// select_file_area_width(){
    	// 	//return document.body.clientWidth*0.3*0.9
    	// //	return document.body.scrollWidth*0.3*0.9
    	// }
    },
    mounted(){
    	// 首先在Virtual DOM渲染数据时，设置下背景图的高度
	    this.uploadForm.select_file_area_width = document.body.clientWidth*0.3-40
	    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景高度．
	    const that = this
	    window.onresize = function temp() {
	        that.uploadForm.select_file_area_width = document.body.clientWidth*0.3-40
	    }
    },
    created(){
    	
    	this.$nextTick(function() {
    		this.getAllAlgorithms()
    	})
    	
    },
    methods: {
    	test(value){
    		console.log(value)

    	},
    	//打开文件上传对话框时的回调函数
    	dialogOpen(){
    		this.$nextTick(function() {
    		})		
    	},
    	//显示文件上传对话框
    	showUploadDialog(){
    		this.uploadForm.visible=true
    		//关闭上传成功的文件列表的显示
    		this.uploadForm.isuploadSuccessed = false
    		this.$nextTick(function() {
    			
    // 			//清空还原
	   //  		this.uploadForm.isFileListEmpty = false
	   //  		this.uploadForm.isUploading = false
	   //  		this.$refs['uploadForm'].resetFields()
				// this.$refs['algorithmInfoForm'].resetFields()
				// this.$refs['packageNameForm'].resetFields()
				// this.$refs['classNameForm'].resetFields()
				// this.$refs['methodNameForm'].resetFields()
	   //  		//清空算法参数表格
	   //  		this.algParameterForm.parameterTable = []
    		})
    		
    	},
    	//关闭Jar文件上传对话框
    	closeUploadJarDialog(){
    		this.isBaseInfoPanelActive=true,
  			this.isRunTimeInfoPanelActive=true,
  			this.resetAllForms()
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
	          	}else{
	          		this.$message.error('错误，获取算法失败.')
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
    		let algoId = this.tableData[index].algorithmId

    		let isAvailable = this.tableData[index].algorithmIsAvailable
    		let params = {algoId:algoId,isAvailable:isAvailable}
    		console.log(params)
    		updateAlgorithmAvailable(params).then(data=>{
    			//连接失败
	            if (typeof (data) == "undefined")
	               return false
	           	if(data.code==1){

	           	}else{
	           		this.tableData[index].algorithmIsAvailable = !isAvailable
	          		this.$message.error('错误，设置算法失败.')
	          	}  
    		})
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
      	//验证
      	submitUpload(){
      		let check_done = true
      		let formsName=[
      			'algorithmInfoForm','packageNameForm','classNameForm','methodNameForm'
      		]
      		for(let i in formsName){
      			this.$refs[formsName[i]].validate((valid) => {
			        if (!valid) {
			           check_done = false
			        }
		   		})
      		}

		    if(this.algParameterForm.parameterTable.length !=0){
		    	let parameterFormsName = ['parameterNameForm','parameterTypeForm']
		    	for(let j in parameterFormsName){
		    		this.$refs[parameterFormsName[j]].validate((valid) => {
				        if (!valid) {
				           check_done = false
				        }
		   			})	
		    	}
		    }
		
		    if(this.uploadForm.fileList.length == 0){
		    	this.uploadForm.isFileListEmpty = true
		    	check_done = false
		    	
		    }
		    if(check_done){
		    	this.$refs.upload.submit()
		    }
      	},
      	//当上传的Jar文件发生改变时
      	changeJar(file,fileList){
      		this.uploadForm.fileList = fileList
      		//为了显示是否选择文件的消息
      		this.uploadForm.isFileListEmpty = false
      		this.uploadForm.isuploadSuccessed = false
      	},
      	//重置表单
      	resetAllForms(){
      		this.uploadForm.isFileListEmpty = false
    		this.uploadForm.isUploading = false
    		this.$refs['uploadForm'].resetFields()
			this.$refs['algorithmInfoForm'].resetFields()
			this.$refs['packageNameForm'].resetFields()
			this.$refs['classNameForm'].resetFields()
			this.$refs['methodNameForm'].resetFields()
    		//清空算法参数表格
    		this.algParameterForm.parameterTable = []
    		this.$refs.upload.clearFiles()
    		this.uploadForm.fileList = []
      	},
      	//导入json配置文件
      	openImportJsonDialog(){
      		document.getElementById("select_json_btn").click()
      	},
      	//上传json配置文件，直接在前端读取
      	uploadConfigJson(){
      		let objFile = document.getElementById("select_json_btn");
      		if(objFile.files.length!=0){
      			let file = objFile.files[0]
      			let name = file.name.substring(file.name.lastIndexOf('.') + 1)
	        	if(name != 'json'){
	        		this.$message.error('错误，文件格式只能为json.')
	        		//清空
	        		
	        	}else{
	        		//新建一个FileReader
	        		let reader = new FileReader()
	        		//读取文件 
		            reader.readAsText(objFile.files[0], "UTF-8")
		            //读取完文件之后会回来这里
		            reader.onload = function(evt){ 
		            	// 读取文件内容
		                let jsonString = evt.target.result 
		                console.log(jsonString)
		        	}
	        	}

      			
      		}  		    
      	},
      	//上传文件
      	uploadFile(file) {

	        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
	        const extension = testmsg === 'jar'
	    
	        const isLt2M = file.size / 1024 / 1024 < 10
	        if (file.size === 0) {
	        	this.$message.error('错误，文件大小为0.')
	         	return
	        }
	        if (!extension ) {
	        	this.$message.error('错误，上传的文件格式只能为Jar.')
	        } else {
	        	this.uploadForm.isUploading = true
	        	this.uploadForm.file = file
	            let formData = new FormData()
	            formData.append('jar', file)
	            let parameterList = this.algParameterForm.parameterTable
	           
	            //如果参数列表不为空的话
	            if(parameterList.length != 0){
	            	  formData.append('params',JSON.stringify(parameterList))
	            }
	            formData.append('algName',this.algorithmInfoForm.name)
	            formData.append('outputType',this.algorithmInfoForm.outputType)
	            formData.append('desc',this.algorithmInfoForm.description)

	            formData.append('type',this.algorithmInfoForm.type=='挖掘算法')

	            formData.append('packName',this.runTimeInfoForm.runInfoTable[0].packageName)
	            formData.append('className',this.runTimeInfoForm.runInfoTable[0].className)
	            formData.append('methodName',this.runTimeInfoForm.runInfoTable[0].methodName)

	            // formData.append('parameterList',this.algParameterForm.parameterTable)
	            upload(formData).then(data=>{
	            	this.uploadForm.isUploading = false
		          	if(!data){
		          		return
		          	}
		          	if(data.code == 1){	
		          		this.uploadForm.isuploadSuccessed = true
		          		this.$message({
				          showClose: true,
				          message: '上传文件成功！',
				          type: 'success'
				        })
		          	}else{
		          		let msg = data.msg
		          		this.$message.error('错误，${msg}.')
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
      	//添加一条参数
    	addOneRowParameter(){
    		let row = {parameterName:"",defaultValue:"",parameterType:""}
    		this.algParameterForm.parameterTable.push(row)
    	},
    	//删除一条参数行
    	deleteOneRowParameter(index){
    		this.algParameterForm.parameterTable.splice(index, 1)
    	},
    	//删除算法
      	deleteAlgorithm(index){
      		let _this = this
      		this.$confirm(
	          '此操作将永久删除所选算法，是否继续?',
	          '提示',
	          { type: 'warning' }
	        ).then(() => {
	        let params = {algoId:_this.tableData[index].algorithmId}	
	        deleteAlgorithm(params).then(data => {
	            if (typeof (data) === "undefined")
	              return
	            if (data.code === 1) {
	              _this.getAllAlgorithms
	            } else {
	              this.$notify.error({
	                title: '提示',
	                message: data.msg
	              })
	            }
	          })
	        }).catch(() => {
	        })
	     },
    },
  }
</script>

<style lang="scss" scoped>

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
.light-setting-icon{
	background-color: #f2f6fc;
}
.light-setting-icon:hover{
	background-color: #e4e7ed;
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
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    display: block;
    font-size: 14px;
    height: 10px;
    line-height:10px;
}
.tip-label:hover{
	cursor:pointer;
}
.notNeedValid{
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
 /**
 *未选择上传文件
 */
.error__tip{
	color:#f56c6c;
	font-size:12px;
}
</style>