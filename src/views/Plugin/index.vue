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
		  <!--   <el-table-column
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
		      	</template>
    		</el-table-column> -->
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
		      	<el-button
		          size="mini"
		          @click="downloadAlgorithm(scope.$index)" :loading="isDownloading">下载
		        </el-button>
		        <el-button
		          size="mini"
		          @click="update(scope.$index)">设置
		        </el-button>
		        <el-button
		          size="mini"

		          @click="deleteAlgorithm(scope.$index)" >删除</el-button>
		      </template>
		    </el-table-column>
  		</el-table>
  		<el-dialog width="30%" title="上传算法" :visible.sync="uploadForm.visible" :modal-append-to-body="false" @opened="dialogOpen()" @closed="closeUploadJarDialog()">
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
			<div>
				<div style="margin-top: 10px;">
					<el-input type="file" id="select_json_btn" style="display:none" @change="uploadConfigJson()"/>
					<div class="setting-icon light-setting-icon"  title="重置" @click="resetUploadForms()">
						<svg-icon icon-class="reset" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
					<div class="setting-icon light-setting-icon"  title="导入配置文件" @click="openImportJsonDialog">
						<svg-icon icon-class="json" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
				</div>
		
		    	<div class="tip-label" style="margin-top: 10px;" @click="uploadForm.isBaseInfoPanelActive=!uploadForm.isBaseInfoPanelActive">
		    		基本信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':uploadForm.isBaseInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="uploadForm.isBaseInfoPanelActive">
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
					    </el-form>
			    	</div>
				</el-collapse-transition>
			    <div class="tip-label" @click="uploadForm.isRunTimeInfoPanelActive=!uploadForm.isRunTimeInfoPanelActive">
		    		运行信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':uploadForm.isRunTimeInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="uploadForm.isRunTimeInfoPanelActive">
		    			<el-table style="width=100%" :data="runTimeInfoForm.runInfoTable">
				    		<el-table-column label="包名">
				    			<template slot-scope="scope">
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
					    				 	<el-input v-model="scope.row.parameterName"  placeholder="请输入参数名称"/>
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
		    </div> 		
	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="uploadForm.visible = false">取 消</el-button>
	        	<!-- <el-button type="primary" @click="submitUpload()">确 定</el-button> -->
	        	<el-button type="primary" @click="submitUpload(true)" :loading="uploadForm.isUploading">上 传</el-button>
	        </div>
  		</el-dialog>
  		<el-dialog width="30%" title="更新算法" :visible.sync="updateForm.visible" :modal-append-to-body="false"  @closed="closeUploadJarDialog()">
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
		           	 <div class="el-upload__text">重新上传Jar文件</div>
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
			<div>
				<div style="margin-top: 10px;">
					<el-input type="file" id="select_json_btn" style="display:none" @change="uploadConfigJson()"/>
					<div class="setting-icon light-setting-icon"  title="重置" @click="resetUploadForms()">
						<svg-icon icon-class="reset" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
					<div class="setting-icon light-setting-icon"  title="导入配置文件" @click="openImportJsonDialog">
						<svg-icon icon-class="json" style="font-size:28px;margin-top:2px;"></svg-icon>
					</div>
				</div>
		
		    	<div class="tip-label" style="margin-top: 10px;" @click="uploadForm.isBaseInfoPanelActive=!uploadForm.isBaseInfoPanelActive">
		    		基本信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':uploadForm.isBaseInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="uploadForm.isBaseInfoPanelActive">
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
					    </el-form>
			    	</div>
				</el-collapse-transition>
			    <div class="tip-label" @click="uploadForm.isRunTimeInfoPanelActive=!uploadForm.isRunTimeInfoPanelActive">
		    		运行信息
		    		<i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':uploadForm.isRunTimeInfoPanelActive},inactiveLogoClass]" style="float: right;"></i>
		    	</div>
		    	<el-collapse-transition>
		    		<div v-show="uploadForm.isRunTimeInfoPanelActive">
		    			<el-table style="width=100%" :data="runTimeInfoForm.runInfoTable">
				    		<el-table-column label="包名">
				    			<template slot-scope="scope">
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
					    				 	<el-input v-model="scope.row.parameterName"  placeholder="请输入参数名称"/>
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
		    </div> 		
	        <div slot="footer" class="dialog-footer">
	        	<el-button @click="updateForm.visible = false">取 消</el-button>
	        	<!-- <el-button type="primary" @click="submitUpload()">确 定</el-button> -->
	        	<el-button type="primary" @click="submitUpload(false)" :loading="uploadForm.isUploading">更新</el-button>
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
import { base } from '../../api/api'
import {getAlgorithmInfo} from '../../api/api'
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
      	isDeleting:false,
      	isDownloading:false,
      
      	
      	inactiveLogoClass:'el-collapse-item__arrow el-icon-arrow-right',
      	upload:'',
      	loading:true,
        tableData: [],
        checkAll: false,
        search: '',
        // algorithmSet:['融合算法', '挖掘算法'],
        //上传算法界面的文件信息
        uploadForm: {
        	//控制折叠面板
      		isBaseInfoPanelActive:true,
        	isRunTimeInfoPanelActive:true,
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
        //上传算法界面的文件信息
        updateForm: {
        	//控制折叠面板
      		isBaseInfoPanelActive:true,
        	isRunTimeInfoPanelActive:true,
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
        	type:1,
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
    		})
    		
    	},
    	//关闭Jar文件上传对话框
    	closeUploadJarDialog(){
    		this.uploadForm.isBaseInfoPanelActive=true,
  			this.uploadForm.isRunTimeInfoPanelActive=true,
  			this.resetUploadForms()
    	},
    	closeUpdateJarDialog(){

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
	          	//	let algorithms = data.data.allAlgorithms
	          		_this.tableData = []
	          		let algorithms = []
	          		let count = data.data.allAlgorithms.length
	          		for(let i=0;i<count;i++)
	          			if(data.data.allAlgorithms[i].algorithmType)
	          				_this.tableData.push(data.data.allAlgorithms[i])
	          		//_this.tableData = algorithms
	          	}else{
	          		this.$message.error('错误，获取算法失败.')
	          	}   		
	    	})
    	},
    	//更新算法界面
    	update(index){
    		this.updateForm.visible = !this.updateForm.visible
    		this.algorithmInfoForm.name = this.tableData[index].algorithmName
            this.algorithmInfoForm.outputType= this.tableData[index].algorithmOutputType
			this.algorithmInfoForm.description= this.tableData[index].algorithmInformation
            this.runTimeInfoForm.runInfoTable[0].packageName = this.tableData[index].algorithmPackage
            this.runTimeInfoForm.runInfoTable[0].className = this.tableData[index].algorithmClassName
            this.runTimeInfoForm.runInfoTable[0].methodName = this.tableData[index].algorithmMethod
            let _this = this
            let p={algoId:this.tableData[index].algorithmId}
            getAlgorithmInfo(p).then(data=>{
            	// //连接失败
	            if (typeof (data) == "undefined")
	               return false
            	if(data.code === 1){
            		if(data.data==null)
            			return
            		let params = data.data.params
            		if(params!=null){		
	            		let paramMap = {
	                      0: '整型',
	                      1: '浮点型',
	                      2: '字符串',
	                      3: '布尔型',
	                    }
	                    let count = params.length
	                    for(let i=0;i<count;i++){
	              	 		let type = ['整型','浮点型','字符型','布尔型']
	                		//添加一条参数
			    			let row = {parameterName:params[i].parameterName,defaultValue:params[i].defaultValue,parameterType:type[params[i].parameterType]}
			    			_this.algParameterForm.parameterTable.push(row)
	                	}
            		}
            		
            	}
            })
       
        //     if(params!=undefined &&params.length>0){
        //     	let count = params.length
        //       	 for(let i=0;i<count;i++){
        //       	 	let type = ['整型','浮点型','字符型','布尔型']
        //         	//添加一条参数
		    		// let row = {parameterName:params[i].parameterName,defaultValue:params[i].defaultValue,parameterType:type[params[i].parameterType]}
		    		// _this.algParameterForm.parameterTable.push(row)
        //         }
        //     }
    		console.log(this.tableData[index])
    		// let params = {algoId:_this.tableData[index].algorithmId}	
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
      	submitUpload(isNeedJar){
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
			if(isNeedJar){
				if(this.uploadForm.fileList.length == 0){
			    	this.uploadForm.isFileListEmpty = true
			    	check_done = false
		    	}
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
      	resetUploadForms(){
      		console.log("reset")
      		this.uploadForm.isFileListEmpty = false
    		this.uploadForm.isUploading = false
    		this.$refs['uploadForm'].resetFields()
			this.$refs['algorithmInfoForm'].resetFields()
			this.$refs['packageNameForm'].resetFields()
			this.$refs['classNameForm'].resetFields()
			this.$refs['methodNameForm'].resetFields()
			this.algorithmInfoForm.name = ""
			this.algorithmInfoForm.name = ""
			this.algorithmInfoForm.outputType = ""
			this.algorithmInfoForm.description = ""
			this.algorithmInfoForm.type=='挖掘算法'
			this.runTimeInfoForm.runInfoTable[0].packageName = ""
			this.runTimeInfoForm.runInfoTable[0].className = ""
			this.runTimeInfoForm.runInfoTable[0].methodName = ""
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
      		let _this = this
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
		            	try{
		            		// 读取文件内容
			                let jsonString = evt.target.result
			                let jsonData = JSON.parse(jsonString)
			              
			                _this.algorithmInfoForm.name = jsonData['name']
			                _this.algorithmInfoForm.outputType= jsonData['outputType']
			                _this.algorithmInfoForm.description= jsonData['description']
			                _this.runTimeInfoForm.runInfoTable[0].packageName = jsonData['packageName']
			                _this.runTimeInfoForm.runInfoTable[0].className = jsonData['className']
			                _this.runTimeInfoForm.runInfoTable[0].methodName = jsonData['methodName']

			                let params = jsonData['params']
			                if(params!=undefined &&params.length>0){
			                	let count = params.length
				              	 for(let i=0;i<count;i++){
				              	 	let type = ['整型','浮点型','字符型','布尔型']
				                	//添加一条参数
						    		let row = {parameterName:params[i].parameterName,defaultValue:params[i].defaultValue,parameterType:params[i].parameterType}
						    		_this.algParameterForm.parameterTable.push(row)
				                }
			                }else{
			                	_this.algParameterForm.parameterTable = []
			                }
			               	
		            	}catch(e){
		            		_this.$message.error('配置文件出错,请检查.')
		            		console.log(e)
		            	}
		            	
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

	            formData.append('type',true)

	            formData.append('packName',this.runTimeInfoForm.runInfoTable[0].packageName)
	            formData.append('className',this.runTimeInfoForm.runInfoTable[0].className)
	            formData.append('methodName',this.runTimeInfoForm.runInfoTable[0].methodName)

	            // formData.append('parameterList',this.algParameterForm.parameterTable)
	            upload(formData).then(data=>{
	            	this.uploadForm.isUploading = false
	            	let _this = this
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
				        _this.getAllAlgorithms()
				        _this.uploadForm.visible = false
		          	}else{
		          		let msg = data.msg
		          		this.$message.error('错误，${msg}.')
		          	}
	          })
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
    	
    	//下载算法
        downloadAlgorithm(index){
        	let algoId =  this.tableData[index].algorithmId
        	if(algoId){
        		window.open(`${base}/algorithmAction/download?algoId=${algoId}`) 
        	}
        },
    	//删除算法
      	deleteAlgorithm(index){
      		let _this = this
      		this.$confirm(
	          '此操作将永久删除所选算法，是否继续?',
	          '提示',
	          { type: 'warning' }
	        ).then(() => {
	        _this.isDeleting = true
	        let params = {algoId:_this.tableData[index].algorithmId}	
	        deleteAlgorithm(params).then(data => {
	        	_this.isDeleting = false
	            if (typeof (data) === "undefined")
	              return
	            if (data.code == 1) {
	              _this.getAllAlgorithms()
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