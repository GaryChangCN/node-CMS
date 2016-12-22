<template>
  <div id="app">
    <div class="processBar" v-show="!processBar.hide">
      <div class="process-bg"></div>
      <div class="process-go"  v-bind:style="{width:processBar.process}"></div>
    </div>
    <div class="header">
      <span class="title">新士域后台管理系统</span>
      <span class="log">
        <span @click="clickLogout" class="logout">注销</span>
      </span>
    </div>
    <div class="container">
      <div class="tree">
        <Tree></Tree>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <div class="loginCover" v-show="!hasLogin">
      <Login></Login>
    </div>
  </div>
</template>
<script>
    import Tree from './components/Tree';
    import Login from './components/Login'
    import {
        mapState,
        mapActions,
        mapMutations
    } from 'vuex';
    export default {
        name: "App",
        data() {
            return {
                hasLogin: null
            };
        },
        computed: {
            menuTitle() {
                return this.$route.params.title ? ' ' + this.$route.params.title : '';
            },
            ...mapState({
                hasLogin: state => state.hasLogin,
                processBar: state => state.processBar
            })
        },
        components: {
            Tree,
            Login
        },
        mounted() {
            var _this = this;
            this.$router.beforeEach(function(to, from, next) {
                _this.processBarBegin();
                next();
            });
            this.$router.afterEach(function() {
                _this.processBarEnd();
            });
            setInterval(function() {
                var now = new Date().getTime();
                var set = parseInt(window.sessionStorage.timeStamp);
                if (now - set > 7200000) {
                    setTimeout(function() {
                        setTimeout(function() {
                            window.location.reload();
                        }, 0);
                        _this.logout();
                    }, 3000);
                    _this.$message({
                        message: '登陆时间已过期，即将刷新网页',
                        type: 'warning'
                    });
                }
            }, 3600000);
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd', 'logout']),
            clickLogout() {
                this.logout();
            }
        }
    }
</script>