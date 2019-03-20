<template>
	<div style="overflow-x: auto;">
		<div class="tip-label" @click="selectLogAreaShow=!selectLogAreaShow">
		    1.选择日志
		    <i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':selectLogAreaShow},inactiveLogoClass]" style="float: right;"></i>
		</div>
		<el-collapse-transition>
			<div v-show="selectLogAreaShow" style="width: 50%;">
				<el-upload
				  	class="upload-demo"
				  	ref="mineLog"
				  	action=""
					:before-upload="submitLogMine"
				  	:limit=1
				  	:file-list="logList"
				  	:auto-upload="false"
				  	:on-change="fileChange"
				  	:before-remove="removeLog"
				  	:show-file-list="true"
				  	>
				  	<el-button slot="trigger" size="small" type="primary">选取事件日志</el-button>
				</el-upload>
			</div>
		</el-collapse-transition>
		<div class="tip-label" @click="selectAlgorithmAreaShow=!selectAlgorithmAreaShow">
		    2.选择算法
		    <i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':selectAlgorithmAreaShow},inactiveLogoClass]" style="float: right;"></i>
		</div>
		<el-collapse-transition>
			<div v-show="selectAlgorithmAreaShow" style="width: 50%;">
				<el-table  ref="minerAlgorithmTable" highlight-current-row v-loading="mineForm.algorithmLoading" element-loading-text="加载中..."
		            :data="mineForm.mineAlgorithms.filter(data => !mineForm.searchMineAlgorithm || data.algorithmName.toLowerCase().includes(mineForm.searchMineAlgorithm .toLowerCase())||data.algorithmInformation.toLowerCase().includes(mineForm.searchMineAlgorithm .toLowerCase()))"
		            tooltip-effect="dark" 
		            style="width: 100%" 
		            @current-change="handelCurrentMineAlgorithm">
		              <el-table-column type="index" width="50">
		              	 <template slot-scope="scope">
			                  <el-radio :label="scope.$index" v-model="mineForm.selectMineAlgorithmRadio" >&nbsp;</el-radio>
			              </template>
		              </el-table-column>
		              <el-table-column prop="algorithmName" label="算法名称"  show-overflow-tooltip >
		              </el-table-column>
		              <el-table-column prop="algorithmInformation" label="算法描述"  show-overflow-tooltip >
		              </el-table-column>
		              <el-table-column prop="algorithmOutputType" label="输出类型"  show-overflow-tooltip >
		              </el-table-column>

		              <el-table-column
		                align="right"
		                width="200"
		              >
			              <template slot="header" slot-scope="scope">      
			                <el-input
			                class="input-new"
			                v-model="mineForm.searchMineAlgorithm"
			                size="mini"
			                placeholder="输入关键字搜索"/>
			             </template>
			             <template slot-scope="scope">
			             	 <el-button :id="'button'+scope.$index" size="mini" :disabled="true" @click="logMine(scope.$index)" >挖掘</el-button>
			             </template>
		          	</el-table-column>
          		</el-table>
			</div>
		</el-collapse-transition>
		<div class="tip-label" @click="modelAreaShow=!modelAreaShow">
		    3.模型展示
		    <i :class="[{'el-collapse-item__arrow el-icon-arrow-right is-active':modelAreaShow},inactiveLogoClass]" style="float: right;"></i>
		</div>
		<el-collapse-transition>
			<div id="graph" v-show="modelAreaShow" style="width: 50%;">
			</div>
		</el-collapse-transition>
		<el-dialog width="30%" title="参数设置" :visible.sync="mineForm.isNeedParams" :modal-append-to-body="false" @opened="" @closed="">
			<el-table style="width=100%;" :data="mineForm.algorithmParamsForm.params">
	            <el-table-column type="index" width="50">
	            </el-table-column>
	            <el-table-column label="参数名" prop="parameterName" >
	            </el-table-column>
	            <el-table-column label="参数类型" prop="parameterType" >
	            </el-table-column>
	            <el-table-column label="默认值" prop="defaultValue">
	            </el-table-column>
	            <el-table-column label="实际值">
	                  <template slot-scope="scope" >
	                    <el-form :model="scope.row"  :rules="mineForm.checkParamsRule" ref="paramInput" >
	                      <el-form-item v-if="scope.row.inputShow" prop="paramValue" style="margin-bottom: 0px;">
	                        <el-input v-model="scope.row.paramValue" ></el-input>
	                      </el-form-item>
	                      <el-form-item ref="boolForm" style="margin-bottom: 0px;">
	                        <el-select v-model="scope.row.paramValue"  v-if="!scope.row.inputShow" style="width: 100%">
	                          <el-option v-for="item in mineForm.algorithmParamsForm.boolTypeParamName" :key="item.value" :label="item.label" :value="item.value">
	                          </el-option>
	                        </el-select>
	                    </el-form-item>
	                    </el-form>
	                  </template>
	                </el-table-column>
	        </el-table>
	         <div slot="footer" class="dialog-footer">
	        	<el-button @click="mineForm.isNeedParams = false">取 消</el-button>
	        	<!-- <el-button type="primary" @click="submitUpload()">确 定</el-button> -->
	        	<el-button type="primary" @click="startLogMine()">确 定</el-button>
	        </div>
		</el-dialog>
	</div>

</template>
<script>
	import { queryMineAlgorithms } from '../../api/api'
	import { getAlgorithmInfo } from '../../api/api'
	import {mineLogByUserUpload} from '../../api/api'
	import { DataSet, Network } from '../../common/js/vis.js'
  	import 'vis/dist/vis.min.css'
	export default {
		data() {
			//验证挖掘算法输入的参数类型是否正确
		    let validateMineParamsValueInput = (rule, value, callback) => {
		        //输入为空
		        if (!value) {
		          return callback(new Error('请输入参数值'))
		        }else{
		        	callback()
		        }
		      }
			return {
				index:-1,
				inactiveLogoClass:'el-collapse-item__arrow el-icon-arrow-right',
				selectLogAreaShow:true,
				selectAlgorithmAreaShow:true,
				modelAreaShow:true,
				logList:[],
				nolog:true,
				log:"",
				mineForm:{
					algorithmLoading:false,
					mineAlgorithms:[],
					searchMineAlgorithm:"",
					selectMineAlgorithmRadio:"",
					isNeedParams:false,
					currentMineAlgorithm:"",
					//算法参数
			        algorithmParamsForm: {
			            params: [
			            ],
			            loading: true,
			            boolTypeParamName: [
			              {
			                value: 'true',
			                label: 'true',
			              },
			              {
			                value: 'false',
			                label: 'false',
			              },
			            ]
			        },
			        checkParamsRule: {
			            paramValue: [
			              { validator: validateMineParamsValueInput, trigger: 'blur' }
			            ],
			       },
				}
			}
		},
		mounted(){

			queryMineAlgorithms().then(data => {
            //连接失败
            if (typeof (data) == "undefined")
              return
            if (data.code === 1) {
              let all = data.data.allAlgorithms
              let count = all.length
              console.log(count)
              let i = 0
              let algorithmId, algorithmName, packageName, className, methodName
              for (; i < count; i++) {
                //如果为挖掘算法
                if (all[i].algorithmType) {
                  this.mineForm.mineAlgorithms.push(all[i])
                }
              }
               this.mineForm.currentMineAlgorithm = this.mineForm.mineAlgorithms[0]
              this.$refs.minerAlgorithmTable.setCurrentRow(this.mineForm.currentMineAlgorithm)
              this.mineForm.loading = false
            } else {
              this.mineForm.loading = false
            }
            this.loading = false
            console.log(this.mineForm.mineAlgorithms)
          })
		},
		cpmputed:{
		},
		watch:{

		},
		methods:{
			logMine(index){
				//获取算法参数信息
              	//获取算法参数
              	let algoId =this.mineForm.mineAlgorithms[index].algorithmId
              	let p = { algoId: algoId }
              	getAlgorithmInfo(p).then(data => {
              		if (typeof (data) === "undefined")
	             		 return
             		if(data.code!=1){
             			this.$message.error(`错误，${data.msg}`)
             		}

	                if (data.code === 1) {
	                  	this.mineForm.currentMineAlgorithm = this.mineForm.mineAlgorithms[index]
	                  	let params = data.data.params

	                  	if (params===null) {
	                  		//无需参数，直接挖掘
			                this.mineForm.algorithmParamsForm.params = []
			                this.mineForm.isNeedParams = false	
			                this.$refs.mineLog.submit()
			            }else{
			            	let length = params.length
			            	let paramMap = {
		                      0: '整型',
		                      1: '浮点型',
		                      2: '字符串',
		                      3: '布尔型',
		                    }
		                    for(let i=0;i<length;i++){
		                      let type = params[i].parameterType
		                      params[i].parameterType = paramMap[type]
		                      params[i].inputShow = true
		                      params[i].paramValue = params[i].defaultValue
		                      //布尔型
		                      if(type == 3){
		                        params[i].inputShow = false
		                      }
		                    }
		                    this.mineForm.algorithmParamsForm.params = params
		                    this.mineForm.isNeedParams = true
			            }
			            
		            }
              	})
			},
			startLogMine(){
				this.$refs.mineLog.submit()
			},
			submitLogMine(file){

				let isValid = false
				let log = this.log
				let logName = file.name
	            let params
	            //验证算法参数是否填写正确
	            if (this.mineForm.algorithmParamsForm.params.length == 0) {
	              params = []
	              isValid = true
	            } else {
		            this.$refs.paramInput.validate((valid) => {
		                if (valid) {
		                  isValid = true
		                } else {
		                }
		            })
	            }

	            //验证输入参数有效
	            if (isValid) {
		              let logId, methodId, imageType
		              let paramList = []
		              let originParams = this.mineForm.algorithmParamsForm.params
		              let i = 0, paramsCount = originParams.length
		              let param
		              let paramMap = {
		                     '整型':0,
		                    '浮点型':1,
		                    '字符串':2,
		                    '布尔型':3,
		              }
		              for (; i < paramsCount; i++) {
		                let type = paramMap[originParams[i].parameterType]
		                param = { name: originParams[i].parameterName, value: originParams[i].paramValue, type:type  }
		                paramList.push(param)
		              }
		            imageType = 1

		            let formData = new FormData()
		            //如果参数列表不为空的话
		            if(paramList.length != 0){
		            	formData.append('paramList',JSON.stringify(paramList))
		            }
		            formData.append('log',file)
		            console.log(file)
		            formData.append('algoId',this.mineForm.currentMineAlgorithm.algorithmId)
		            const loading = this.$loading({
			          lock: true,
			          text: '挖掘中...',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
			        });
		             //日志ID,算法ID,参数列表
		            mineLogByUserUpload(formData).then(data => {
		            	loading.close()
		            	if (typeof (data) === "undefined")
	             		 return
	             		if(data.code!=1){
	             			this.$message.error(data.msg)
	             		}else{
		             		this.$message({
					          showClose: true,
					          message: '挖掘成功！',
					          type: 'success'
					        })
					        this.draw(data.data)
					        this.mineForm.isNeedParams = false
	             		}
	             		let algorithmCount = this.mineForm.mineAlgorithms.length
	             		for(let i=0;i<algorithmCount;i++){
			        	 	let id = `button${i}`
			        		document.getElementById(id).setAttribute("disabled",true)
	        				document.getElementById(id).classList.add("is-disabled")
		        		}
		        		this.logList=[]
		        		this.logList.push({name: logName,url:'tmp'})
		            })
		        }
			},
			//选择挖掘算法的事件处理函数
		    handelCurrentMineAlgorithm(currentRow, oldCurrentRow) {
		        this.mineForm.currentMineAlgorithm = currentRow
		        let index = this.mineForm.mineAlgorithms.indexOf(currentRow)
		        this.index = index
		        this.mineForm.selectMineAlgorithmRadio = index
		    },
		    //选择文件，未上传
		    fileChange(file,fileList){
		    	let _this = this
		    	let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
		        const extension = (testmsg === 'txt')||(testmsg === 'xes')
        	
		        const isLt2M = file.size / 1024 / 1024 < 10
		        let ok = true
		        if (file.size === 0) {
		        	this.$message.error('错误，文件大小为0.')
		         	ok = false
		        }
		        if (!extension) {
		        	this.$message.error('错误，事件日志的格式只能为xes或txt.')   
		        	ok = false
		        } 
		        let algorithmCount = this.mineForm.mineAlgorithms.length

		        if(!ok){
		        	this.$refs.mineLog.clearFiles()
		        }else{
		        	_this.log = file
		        	for(let i=0;i<algorithmCount;i++){
		        	 	let id = `button${i}`
		        		document.getElementById(id).removeAttribute("disabled")
		        		document.getElementById(id).classList.remove("is-disabled")
		        	}
		        	
		        }
		    },
		    //取消已选择的日志
		    removeLog(file,fileList){
		    	let algorithmCount = this.mineForm.mineAlgorithms.length
		    	for(let i=0;i<algorithmCount;i++){
	        	 	let id = `button${i}`
	        		document.getElementById(id).setAttribute("disabled",true)
	        		document.getElementById(id).classList.add("is-disabled")
		        }
		    },
		    draw(json){     
	            let nodes = json.nodes
	            let edges = json.edges
	            // vis数据
	            let data = {
	              nodes: new DataSet(nodes),
	              edges: new DataSet(edges)
	            }
	            let options = this.getOptions()
	            // 创建一个网络
	            let container = document.getElementById('graph')
	            // 初始化网络
	            this.network = new Network(container, data, options)
            },
		    getOptions() {
		        let _this = this
		        //可选项
		        let options = {
		          autoResize: true,
		          //节点配置
		          nodes: {//节点配置
		            // shape: 'box',
		            borderWidth: 1,//节点边框的宽度,单位为px
		            borderWidthSelected: 2,//节点被选中时边框的宽度，单位为px
		            color: {
		              border: '#E0EEE0',//节点边框颜色
		              background: '#000000',//节点背景颜色
		              highlight: {//节点选中时状态颜色
		                border: '#2B7CE9',
		                background: '#D2E5FF'
		              },
		              hover: {//节点鼠标滑过时状态颜色
		                border: '#2B7CE9',
		                background: '#D2E5FF'
		              }
		            },
		            fixed: {
		              x: false,
		              y: false
		            },
		            scaling: {
		              label: true
		            },
		            font: {//字体配置
		              color: '#343434',//颜色
		              size: 20, // 大小，单位px
		              face: 'arial',//字体
		              background: 'none',//背景
		              align: 'center',//位置left right center
		            },
		            shadow: true
		          },
		          edges: {
		            color: {
		              color: '#969696',
		            },
		            shadow: true,//连接线阴影配置
		            smooth: true,//是否显示方向箭头
		            arrows: { to: true }//箭头指向to节点
		          },
		          //布局
		          layout: {
		            randomSeed: 1,//配置每次生成的节点位置都一样，参数为数字1、2等
		            hierarchical: {
		              direction: this.layoutValue,//UD:上下 DU:下上 LR:左右 RL:右左
		              sortMethod: 'directed'
		            }, //层级结构显示}
		          },
		          //交互
		          interaction: {
		            dragNodes: true,//是否能拖动节点
		            dragView: true,//是否能拖动画布
		            hideEdgesOnDrag: false,//拖动画布时是否隐藏连接线
		            hideNodesOnDrag: false,//拖动画布时是否隐藏节点
		            hover: true,//鼠标移过后加粗该节点和连接线
		            keyboard: true,//
		            multiselect: true,//按 ctrl 多选
		            navigationButtons: true,//是否显示控制按钮
		            selectable: true,//是否可以点击选择
		            selectConnectedEdges: true,//选择节点后是否显示连接线
		            hoverConnectedEdges: true,//鼠标滑动节点后是否显示连接线
		            tooltipDelay: 200,
		            zoomView: true//是否能缩放画布
		          },
		          physics: {
		            forceAtlas2Based: {
		              gravitationalConstant: -26,
		              centralGravity: 0.005,
		              springLength: 230,
		              springConstant: 0.18,
		              avoidOverlap: 1.5
		            },
		            maxVelocity: 146,
		            solver: 'forceAtlas2Based',
		            timestep: 0.35,
		            stabilization: {
		              enabled: true,
		              iterations: 1000,
		              updateInterval: 25
		            }
		          },
		        }
		        return options
		      },
		}
	}
</script>
<style lang="scss" scoped>
#graph{
	border: 1px solid #d3d3d3;
	position: relative;
	height: 430px;
	
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
    height: 20px;
    line-height:20px;
    width:50%;
}
.tip-label:hover{
	cursor:pointer;
}
</style>