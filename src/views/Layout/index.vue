<template>
  <div id="main">
    <el-container style="height: 100%;">
      <sidebar></sidebar>
<!--       <topbar v-on:headCallBack="headCall"></topbar> -->
      <topbar></topbar>
      <router-view id="routerView" :class="{collapsed:isCollapsed}"></router-view>
      <el-dialog title="设置" :visible.sync="cogForm.visible" width="35%" :modal-append-to-body="false" >
        <el-tabs v-model="cogForm.activeName" :tab-position="cogForm.tabPosition" style="height:auto;">
          <el-tab-pane label="账户设置" name="0">
            <el-form :model="accountCogForm" label-width="80px" :rules="accountCogFormRules" ref="accountCogForm">
              <el-form-item label="email" prop="email">
                <el-input v-model="accountCogForm.email" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="nickname" prop="nickname">
                <el-input v-model="accountCogForm.nickname" ></el-input>
              </el-form-item>
              <el-form-item style="margin-top:30px;">
                <el-button type="primary" style="width:100%" @click="changeNickname('accountCogForm')">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码设置" name="1">
            <el-form :model="passCogForm" label-width="90px" :rules="passCogFormRules" ref="passCogForm">
              <el-form-item label="oldPass" prop="oldPass">
                <el-input type="password" v-model="passCogForm.oldPass"></el-input>
              </el-form-item>
              <el-form-item label="newPass" prop="newPass">
                <el-input type="password" v-model="passCogForm.newPass"></el-input>
              </el-form-item>
              <el-form-item label="newPassCheck" prop="newPassCheck">
                <el-input type="password" v-model="passCogForm.newPassCheck"></el-input>
              </el-form-item>
              <el-form-item style="margin-top:30px;">
                <el-button type="primary" style="width:100%" @click="changePass('passCogForm')">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </el-container>
  </div>

<!--  <div id="">
  
    <sidebar></sidebar>
    <div id="section" :class="{collapsed:isCollapsed}">
      <topbar></topbar>
      <router-view id="routerView" class="animated fadeIn"></router-view>
    </div>

  </div> -->
</template>


<script>
import sidebar from '../../components/sidebar/index.vue';
import topbar from '../../components/topbar/index.vue';
import {editUserNickname,checkPassword,editUserPass} from '../../api/api';

export default {
  name:'layout',
  components:{
    'sidebar':sidebar,
    'topbar':topbar,
  },
  computed:{
    isCollapsed(){
      return this.$store.state.common.isCollapsed
    },
  },
    data() {
      //验证用户名
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入nickname'))
        } else {
          callback();
        }
      }
      //验证密码
      var validateOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'))
        } else{
          let user = JSON.parse(sessionStorage.getItem('user'))
          let checkResult =new Promise((resolve, reject) => { 
            resolve(this.checkOldPass(user.account,value))
          })
          checkResult.then(result => {
            if(result != true){
              return callback(new Error('密码错误'))
            }else{
              callback();
            }
          })  
        }
      }
      //验证密码
      var validateNewPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'))
        } else {
          callback();
        }
      }
      //验证两次密码是否一样
      var validateNewPassCheck = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码验证'))
        } else {
          if(value != this.passCogForm.newPass){
            return callback(new Error('两次密码不一致'))
          }else{
            callback();
          }
        }
      }
      return {
        isCollapse: true,
        accountCogForm:{
          nickname:'',
          email:'',
        },
        passCogForm:{
          oldPass:'',
          newPass:'',
          newPassCheck:'',
        },
        cogForm:{
          visible:false,
          activeName:'0',
          //选项卡位置
          tabPosition:'left',
        },
        
        passCogFormRules: {
          oldPass: [
            { validator: validateOldPass, trigger: 'blur' }
          ],
          newPass: [
            { validator: validateNewPass,  trigger: 'blur' },
          ],
          newPassCheck: [
            { validator:validateNewPassCheck,  trigger: 'blur' },
          ],
        },
        accountCogFormRules:{
          nickname: [
            { validator:validateName, trigger: 'blur' },
          ],
        }
      };
    },
    mounted() {
      this.$nextTick(function() {
        // let user = JSON.parse(sessionStorage.getItem('user'))
        // this.accountCogForm.nickname = user.nickname
        // this.accountCogForm.email = user.account
      })  
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      headCall: function (msg) { //回调方法，接收子组件传的参数
        console.log(msg);
        this.showConfig();
      },
      showConfig(){
        this.cogForm.activeName='0'
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.accountCogForm.nickname = user.nickname
        this.passCogForm.oldPass=''
        this.passCogForm.newPass=''
        this.passCogForm.newPassCheck=''
        this.cogForm.visible=true
      },
      changeNickname(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认修改吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let user = JSON.parse(sessionStorage.getItem('user'))
              let para={id : user.id, nickname : this.accountCogForm.nickname, email : user.account, password : "" , activated : "" , banned : "", type: ""}
              console.log(para)
              // editUserNickname(para).then((res) => {
              //   this.editLoading = false;
              //   //NProgress.done();
              //   if(res.code === 1){
              //     this.notify(1,res.msg)
              //   }else{
              //     this.notify(2,res.msg)
              //   }
              //   this.$refs[formName].resetFields();
              //   this.cogForm.visible = false;
              // }).catch(() => {
              // });
            });
          }
        });
      },
      changePass(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认修改吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let user = JSON.parse(sessionStorage.getItem('user'))
              let para={id : user.id, nickname : user.nickname, email : user.account, password : this.passCogForm.newPass , activated : "" , banned : "", type: ""}
              // editUserPass(para).then((res) => {
              //   this.editLoading = false;
              //   //NProgress.done();
              //   if(res.code === 1){
              //     this.notify(1,res.msg)
              //   }else{
              //     this.notify(2,res.msg)
              //   }
              //   this.$refs[formName].resetFields();
              //   this.cogForm.visible = false;
              // });
            });
          }
        });
      },
      checkOldPass(email , oldPass){
        let para = {email : email , password : oldPass}
        let p= new Promise((resolve, reject) => {
          checkPassword(para).then((res) =>{
            if(res.code === 1){
              resolve(true)
            }else{
              resolve(false)
            }
          })
        })
        return p.then(result => {
          return result;
        });  
      },
      notify(type,message){
        let typeMap={}
        typeMap[0]=['警告','warning']
        typeMap[1]=['成功','success']
        typeMap[2]=['错误','error']
        typeMap[3]=['提示','info']
        this.$notify({
          title:  typeMap[type][0],
          message: message,
          type:  typeMap[type][1],
        });
      },
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
      bottom:0px;
      box-sizing: border-box;
      transition: all 0.5s;
      padding: 10px;
      &.collapsed{
        transition: all 0.5s;
        left:64px;
      }
  }


</style>