<template>
  <div id="login">
    <div class="title">后台管理登录</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="帐号" prop="username">
        <el-input v-model="ruleForm.username" autofocus="autofocus"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verify">
        <div class="verifyContainer">
          <img v-bind:src="imgSrc" alt="" @click="getVerify">
          <el-input v-model="ruleForm.verify" @keyup.native.enter="handleSubmit"></el-input>
        </div>
      </el-form-item>
      <el-form-item class="lastItem">
        <el-button type="primary" @click.native.prevent="handleSubmit">登录
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    import CONFIG from '../config';
    import {
        mapState,
        mapMutations,
        mapActions
    } from 'vuex';
    export default {
        name: "Login",
        data() {
            return {
                imgSrc: null,
                ruleForm: {
                    username: '',
                    password: '',
                    verify: ''
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '密码',
                        trigger: 'blur'
                    }],
                    verify: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    }]
                }
            };
        },
        mounted() {
            this.getVerify();
            if (window.sessionStorage.limit) {
                var limit = JSON.parse(window.sessionStorage.limit);
                this.login(JSON.parse(window.sessionStorage.limit));
            }
        },
        computed: {
            ...mapState({ in: state => state.in
            })
        },
        methods: {
            ...mapMutations({
                login: 'LOGIN'
            }),
            ...mapActions(['processBarBegin', 'processBarEnd', 'login']),
            getVerify(){
                this.imgSrc = CONFIG.API + 'verify?'+new Date().getTime();
            },
            handleSubmit() {
                var _this = this;
                var f = new FormData();
                f.append('username', this.ruleForm.username);
                f.append('password', this.ruleForm.password);
                f.append('verify', this.ruleForm.verify);
                this.processBarBegin();
                this.axios.post(CONFIG.API + 'login', f).then(function(value) {
                    var json = value.data;
                    if (json.err == 'verify') {
                        throw '验证码错误';
                    } else if (json.err == 'auth') {
                        throw '账号密码错误';
                    } else {
                        _this.login(json.limit);
                        window.sessionStorage.timeStamp = new Date().getTime().toString();
                        _this.processBarEnd();
                    }
                }).catch(function(err) {
                    _this.$message.error(err);
                    _this.processBarEnd();
                    _this.getVerify();
                })
            }
        }
    }
</script>