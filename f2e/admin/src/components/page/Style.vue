<template>
  <div id="style">
    <div class="tabContainer">
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='index'}" @click="toggleTab('index')">首页</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='navbar'}" @click="toggleTab('navbar')">导航栏</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='project'}"@click="toggleTab('project')">工程</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='center'}"@click="toggleTab('center')">球馆</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='equipmentdetail'}" @click="toggleTab('equipmentdetail')">整套设备内页</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='support'}" @click="toggleTab('support')">支持</div>
        <div v-bind:class="{tabItem:true,tabItemSelect:select==='contactus'}" @click="toggleTab('contactus')">联系我们</div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
    export default {
        name: "style",
        data() {
            return {
                select: null
            };
        },
        mounted() {
            var se = this.$route.fullPath.split('/').pop();
            this.select = se;
        },
        methods: {
            toggleTab(a) {
                this.$router.push({
                    name: a
                });
                this.select = a;
            }
        }
    }
</script>