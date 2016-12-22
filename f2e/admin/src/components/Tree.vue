<template>
  <div id="tree">
    <el-menu class="el-menu-vertical-demo">
      <el-submenu index="1" v-show="limit.indexOf(1)>-1">
        <template slot="title">
          表单管理
        </template>
        <el-menu-item index="1-1">
          <router-link :to="{name:'unhandled'}">未处理询价</router-link>
        </el-menu-item>
        <el-menu-item index="1-2">
          <router-link :to="{name:'processed'}">已处理询价</router-link>
        </el-menu-item>
        <el-menu-item index="1-3">
          <router-link :to="{name:'sale'}">销售发票</router-link>
        </el-menu-item>
        <el-menu-item index="1-4">
          <router-link :to="{name:'delivery'}">发货清单</router-link>
        </el-menu-item>
        <el-menu-item index="1-5">
          <router-link :to="{name:'failed'}">未成功交易</router-link>
        </el-menu-item>
        <el-menu-item index="1-6" v-show="limit.indexOf(4)>-1">
          <router-link :to="{name:'recycle'}">回收站</router-link>
        </el-menu-item>
        <el-menu-item index="1-7">
          <router-link :to="{name:'head'}">抬头管理</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2" v-show="limit.indexOf(2)>-1">
        <template slot="title">
          产品管理
        </template>
        <el-menu-item index="2-1">
          <router-link :to="{ name: 'brandEdit' }">分类管理</router-link>
        </el-menu-item>
        <el-menu-item index="2-2">
          <router-link :to="{ name: 'productAdd' }">添加产品</router-link>
        </el-menu-item>
        <el-menu-item index="2-3">
          <router-link :to="{ name: 'productList' }">产品列表</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3" v-show="limit.indexOf(3)>-1">
        <template slot="title">
          页面版式
        </template>
        <el-menu-item index="3-1">
          <router-link :to="{ name: 'style' }">页面管理</router-link>
        </el-menu-item>
        <el-menu-item index="3-2">
          <router-link :to="{ name: 'articleadd' }">添加文章</router-link>
        </el-menu-item>
        <el-menu-item index="3-3">
          <router-link :to="{ name: 'vieweditor' }">查看&修改文章</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          流量统计
        </template>
        <el-menu-item index="4-1"><a href="http://tongji.baidu.com/web/welcome/login" target="_Blank">百度统计</a></el-menu-item>
        <el-menu-item index="4-2"><a href="https://www.google.com/intl/zh-CN/analytics/" target="_Blank">谷歌分析</a></el-menu-item>
      </el-submenu>
      <el-submenu index="6" v-show="limit.indexOf(3)>-1">
        <template slot="title">
          资料库
        </template>
        <el-menu-item index="6-1">
          <router-link :to="{ name: 'imageManage' }">图片管理</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5" v-show="limit.indexOf(4)>-1">
        <template slot="title">
          账户权限
        </template>
        <el-menu-item index="5-1">
          <router-link :to="{ name: 'userManage' }">账户管理</router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
    import {
        mapState
    } from 'vuex';
    export default {
        name: "Tree",
        data() {
            return {
                pageAdd: {
                    name: 'pageAdd'
                }
            };
        },
        computed: {
            ...mapState({
                limit: state => state.limit
            })
        }
    }
</script>
<style scoped>


</style>
