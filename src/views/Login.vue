<template>
  <div class="main-container">
    <div class="title">流程挖掘后台管理系统</div>
    <div class="login-container">
      <el-form :model="userForm" :rules="rules" ref="userForm"  class="demo-userForm">
         <span class="login-title">登录</span>
         <el-form-item prop="email" >
           <el-input  type="text" v-model="userForm.email" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
         <el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="userForm.password" auto-complete="off" placeholder="密码" v-on:keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item style="margin-top:10px;">
            <el-checkbox v-model="userForm.isRememberPassword" checked >记住密码</el-checkbox>
            <input type="button" onclick="" value="忘记密码？" class="login-cannotLogin"/>
          </el-form-item>   
          <el-form-item style="margin-top:10px;">
            <el-button type="primary" style="width:100%;"  :loading="logining" @click="login" @keyup.enter.native="login">登录</el-button>
            </el-form-item>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import './../assets/iconfont/iconfont.css'
  import {requestLogin} from './../api/api'
  const md5 = require('js-md5')
  export default {
    data() {
      return {
        logining: false,
        userForm: {
          isRememberPassword:true,
          email: '',
          password: '',
        },
        rules: {
          email: [
            { required: true, message: '请输入账号', trigger: 'blur' }, 
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
       
      
      }
    },
    //页面加载调用获取cookie值
    mounted() {
        this.getCookie()
    },
    methods: {

      login() {

        this.$refs['userForm'].validate((valid) => {
          if(valid){
            this.logining = true
            let md5Pass = md5(this.userForm.password).toUpperCase()
            let params={email:this.userForm.email,password:md5Pass}
            requestLogin(params).then(res=>{
              this.logining = false
              if (typeof(res) == "undefined")
                return
              if(res.code==1){
                  let user = res.data
                  if(this.userForm.isRememberPassword){
                    this.setCookie(this.userForm.email,this.userForm.password,7)
                  }else{
                    this.clearCookie()
                  }  
                  sessionStorage.setItem('user', JSON.stringify(user));
                  this.$router.push({name: '首页' })
              }else{
                  if(res.msg!=null)
                    this.$message.error(res.msg)
                  else
                    this.$message.error("错误，登录失败.")

              }

              // if(res!=null){
              //   if(res.code==1){

              //   }else{
              //      this.$message.error(res.msg)
              //   }
              // }
              // if(res!=null){
              //   if(res.code==1){
              //     let user = res.data
              //     if(this.userForm.isRememberPassword){
              //       this.setCookie(this.userForm.email,this.userForm.password,7)
              //     }else{
              //       this.clearCookie()
              //     }  
              //     sessionStorage.setItem('user', JSON.stringify(user));
              //     this.$router.push({name: '首页' })
              //   }else{
              //     this.$message.error(data.msg)
              //   }
              // }
               
            })
          }
         
        })
      },
      //设置cookie
      setCookie(c_name, c_pwd, exdays) {
          var exdate = new Date(); //获取时间
          exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
          //字符串拼接cookie
          window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
          window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      getCookie(){
        if (document.cookie.length > 0) {
          let arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
          for (var i = 0; i < arr.length; i++) {
              let arr2 = arr[i].split('='); //再次切割
              //判断查找相对应的值
              if (arr2[0] == 'userName') {
                  this.userForm.email = arr2[1]; //保存到保存数据的地方
              } else if (arr2[0] == 'userPwd') {
                  this.userForm.password = arr2[1];
              } 
          }
        }  
      },
      //清除cookie
      clearCookie: function() {
          this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      },
    }
  }

</script>

<style lang="scss" scoped>
  .main-container{
    background-color:#3b3e42;
    height:100%;
    min-height: 750px;
    position:fixed;
    right: 0;
    left: 0;
  }
  .title{
    text-align:center;
    font-size:40px;
    font-weight:700;
    margin-top: 120px;
     color:#c5c5c5;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 60px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #f1f1f1;
    border: 1px solid #eaeaea;
    // box-shadow: 0 0 25px #cac6c6;
  }
  .login-title {
     text-align: center;
      display:inline-block;
      color:    #6E6E6E;
      height: 30px;
      margin-bottom: 30px;
      width: 20%;
      margin-left: 40%;
      border-bottom:2px solid   #6E6E6E;
      font-weight: 600;
      font-size:20px;
    }
  .footer{
    position: fixed;bottom: 10px;
    margin:0;
    padding: 0;
    width: 100%;
    font-size: 12px;
    color: #666;
    height: 40px !important;
    text-align: center;
    margin-top: 10%;
  }
  .login-cannotLogin{
    font-size: 14px;
    border:0;
    cursor:pointer;
    background-color: transparent;
    color: #8590a6;
    text-align: center;
    display: inline-block;
    height: auto;
    padding: 0;
    line-height: inherit;
    float: right;
  }
</style>