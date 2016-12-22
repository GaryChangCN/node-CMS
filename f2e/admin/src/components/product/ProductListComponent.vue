<template>
  <div id="productListComponent">
    <div class="search">
      <el-button v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
      <el-input placeholder="搜索表单" icon="search" v-model="keywords" v-show="search.inputShow" @keyup.native.enter="searchProduct" @click="searchProduct"></el-input>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="number" label="编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="商品名" align="center">
        </el-table-column>
        <el-table-column prop="englishName" label="英文名" align="center">
        </el-table-column>
        <el-table-column inline-template label="操作" align="center" width="100">
          <el-button type="primary" size="mini"  @click.native="selectProduct(row)">选取</el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination"  v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="10" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "productListComponent",
        data() {
            return {
                total:null,
                search: {
                    inputShow: false,
                    searchButtonContent: "search",
                    searchButtonType: "primary"
                },
                keywords: '',
                tableData: []
            };
        },
        mounted(){
            this.processBarBegin();
            var _this = this;
            this.axios.get(CONFIG.API + 'product/count').then(function(value) {
                var json = value.data;
                if (!json.err && json.state) {
                    _this.total = json.sum;
                    _this.getList(0);
                    _this.processBarEnd();
                } else {
                    throw '获取数据失败';
                }
            }).catch(function(err) {
                _this.$notify.error({
                    title: '失败',
                    message: err
                });
                _this.processBarEnd();
            });
        },
        methods:{
            selectProduct(row){
                this.$parent.$parent.selectProduct({_id:row.id,number:row.number,name:row.name,englishName:row.englishName});
            },
            toggleSearchContent() {
                this.keywords = "";
                this.search.searchButtonContent = this.search.inputShow ? "search" : "arrow-right";
                this.search.searchButtonType = this.search.inputShow ? "primary" : "";
                this.search.inputShow = !this.search.inputShow;
                if (!this.search.inputShow) {
                    this.getList(0);
                }
            },
            fullfill(list) {
                var _this = this;
                return list.map(function(e) {
                    return {
                        id: e._id,
                        number:e.number,
                        name:e.name,
                        englishName:e.englishName
                    }
                });
            },
            searchProduct(){
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'product/search/' + this.keywords).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.tableData = _this.fullfill(json.list);
                        _this.processBarEnd();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    this.processBarEnd();
                });
            },
            getList(skip) {
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'product/get/10/' + skip).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.tableData = _this.fullfill(json.list);
                        _this.processBarEnd();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            handleCurrentChange(value) {
                this.getList((value - 1) * 10);
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>
<style scoped>


</style>
