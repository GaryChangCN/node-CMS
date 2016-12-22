<template>
  <div id="product-list">
    <div class="secondTitle">
      <span>产品列表</span>
      <div>
        <el-button v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
        <el-input placeholder="搜索表单" icon="search" v-model="keywords" v-show="search.inputShow" @keyup.native.enter="searchProduct" @click="searchProduct"></el-input>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column property="number" label="编号" align="center"></el-table-column>
        <el-table-column property="name" label="产品名" align="center"></el-table-column>
        <el-table-column property="englishName" label="英文名" align="center"></el-table-column>
        <el-table-column inline-template label="操作" width="320" align="center">
          <div class="button-group">
            <el-button type="primary" size="mini" icon="edit"  @click="editProduct(row._id)"></el-button>
            <el-button type="danger" size="mini" icon="delete" @click="deleteProduct(row._id)"></el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange"
        :current-page="1"
        :page-size="15"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div class="seeEditContainer" v-show="dialogVisible">
        <div class="seeEdit">
            <div class="seeTitle">
                <span class="span">查看&修改</span>
                <el-button icon="close" @click.native="dialogVisible=false"></el-button>
            </div>
            <ProductComponent :_id="_id" type="update" size="mini"></ProductComponent>
        </div>
    </div>
  </div>
</template>
<script>
    import CONFIG from '../../config';
    import ProductComponent from './ProductComponent.vue';
    import { mapActions } from 'vuex';
    export default {
        name: "productList",
        data () {
            return {
                dialogVisible:false,
                _id:"null",
                total: null,
                search: {
                    inputShow: false,
                    searchButtonContent: "search",
                    searchButtonType: "primary"
                },
                keywords: '',
                tableData: []
            }
        },
        components:{
            ProductComponent
        },
        mounted() {
            this.getCount();
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd']),
            deleteProduct(_id){
                var _this=this;
                this.$confirm('将会删除此商品，并且从所有包含此商品的分组中删除此商品，是否继续？若是下架商品应该从商品管理中选择下架','警告',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'                    
                }).then(function(){
                    _this.processBarBegin();
                    let delData = new FormData();
                    delData.append('_id',_id);
                    _this.axios.delete(CONFIG.API+'product', {data: delData}).then(res => {
                        _this.processBarEnd();
                        if(!res.data.err) {
                            _this.processBarEnd();
                            _this.getCount();
                            _this.$notify({
                                title: '成功！',
                                message: '删除产品成功！',
                                type: 'success'
                            });
                        } else {
                            throw '删除失败';
                        }
                    }).catch(err => {
                        _this.processBarEnd();
                        this.$notify.error({
                            title: '失败',
                            message: err
                        });
                    })
                }).catch(function(){})
            },
            callback(){
                this.dialogVisible=false;
                this.getCount();
            },
            editProduct(_id){
                this._id=_id;
                this.dialogVisible=true;
            },
            handleCurrentChange(value) {
                this.getList((value - 1) * 15);
            },
            toggleSearchContent() {
                this.keywords = '';
                this.search.searchButtonContent = this.search.inputShow ? 'search': 'arrow-right';
                this.search.searchButtonType = this.search.inputShow ? 'primary' : '';
                this.search.inputShow = !this.search.inputShow;
                if (!this.search.inputShow) {
                    this.getList(1);
                }
            },
            searchProduct() {
                let _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'product/search/' + this.keywords).then(function(value) {
                    var json = value.data;
                    if (!json.err) {
                        _this.tableData = json.list;
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
            getList(skip) {
                let _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'product/get/15/' + skip).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.tableData = json.list;
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
            getCount(){
                var _this=this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'product/count').then(function(value) {
                var json = value.data;
                if (!json.err && json.state) {
                    _this.total = json.count;
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
            }
        }
    }
</script>
