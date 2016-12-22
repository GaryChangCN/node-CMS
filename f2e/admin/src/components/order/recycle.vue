<template>
  <div id="recycle">
    <div class="secondTitle">
      <span>回收站</span>
      <div>
        <el-button v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
        <el-input placeholder="搜索表单" icon="search" v-model="keywords" v-show="search.inputShow" @keyup.native.enter="searchRecycle" @click="searchRecycle"></el-input>
      </div>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="number" label="编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="title" label="表单标题" width="180" align="center">
        </el-table-column>
        <el-table-column prop="costomerName" label="客户名" align="center">
        </el-table-column>
        <el-table-column prop="date" label="下单日期" align="center">
        </el-table-column>
        <el-table-column inline-template label="星标" align="center" width="70">
          <el-button v-bind:icon="row.star" @click.native="star(row)" class="star" size="mini"></el-button>
        </el-table-column>
        <el-table-column inline-template label="还原" align="center" width="70">
          <el-button type="primary" size="mini" icon="time" @click.native="openRevoked(row)"></el-button>
        </el-table-column>
        <el-table-column inline-template label="删除" align="center" width="70">
          <el-button type="danger" size="mini" icon="delete" @click.native="openDelete(row)"></el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="15" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
<el-dialog title="提示" v-model="deleteDialogShow" size="tiny">
  <span>确定要清除此项，删除后不可恢复。</span>
  <span slot="footer" class="dialog-footer">
    <el-button  @click.native="deleteDialogShow = false">取 消</el-button>
    <el-button type="danger" @click.native="deleteZ">删除</el-button>
  </span>
</el-dialog>
<el-dialog title="提示" v-model="revokedDialogShow" size="tiny">
  <span>确定要还原么？还原后将在未处理询价中出现。</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click.native="revokedDialogShow = false">取 消</el-button>
    <el-button type="primary" @click.native="revoked">还原</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
    import CONFIG from '../../config';
    import orderPage from './orderPage';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "recycle",
        data() {
            return {
                deleteDialogShow: false,
                revokedDialogShow: false,
                pageNumber: 1,
                total: null,
                search: {
                    inputShow: false,
                    searchButtonContent: "search",
                    searchButtonType: "primary"
                },
                keywords: '',
                tableData: [],
                id: null,
                setContentShow: false
            }
        },
        components: {
            orderPage
        },
        mounted() {
            this.processBarBegin();
            var _this = this;
            this.axios.get(CONFIG.API + 'order/count/recycle').then(function(value) {
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
        },
        methods: {
            openDelete(row) {
                this.id = row.id;
                this.deleteDialogShow = true;
            },
            deleteZ() {
                var _this = this;
                var id = _this.id;
                var d = new FormData();
                d.append('_id', id);
                _this.processBarBegin();
                _this.axios.delete(CONFIG.API + 'order', {data:d}).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.fresh();
                        _this.deleteDialogShow = false;
                        _this.processBarEnd();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                    } else {
                        throw '删除失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            openRevoked(row) {
                this.id = row.id;
                this.revokedDialogShow = true
            },
            revoked() {
                var _this = this;
                var id = _this.id;
                var change = {
                    where: 'unhandled',
                    time: new Date()
                }
                var d = new FormData();
                d.append('_id', id);
                d.append('change', JSON.stringify(change));
                _this.processBarBegin();
                _this.axios.put(CONFIG.API + 'order', d).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.fresh();
                        _this.revokedDialogShow = false;
                        _this.processBarEnd();
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    } else {
                        throw '更新失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            star(row) {
                var _id = row.id;
                var _this = this;
                if (row.star == 'star-off') {
                    var star = true;
                } else {
                    var star = false;
                }
                var d = new FormData();
                d.append('_id', _id);
                d.append('change', JSON.stringify({
                    star: star
                }));
                _this.processBarBegin();
                _this.axios.put(CONFIG.API + 'order', d).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.fresh();
                        _this.processBarEnd();
                        _this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                    } else {
                        throw '更新失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            fresh() {
                var value = this.pageNumber;
                this.getList((value - 1) * 15);
            },
            convertDate(date) {
                return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
            },
            fullfill(list) {
                var _this = this;
                return list.map(function(e) {
                    var date = new Date(e.customerTime);
                    var d = _this.convertDate(date);
                    return {
                        id: e._id,
                        number: e.number,
                        title: e.title,
                        costomerName: e.customerName,
                        date: d,
                        star: e.star ? "star-on" : "star-off"
                    }
                });
            },
            searchRecycle() {
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'order/search/recycle/' + this.keywords).then(function(value) {
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
            toggleSearchContent() {
                this.keywords = "";
                this.search.searchButtonContent = this.search.inputShow ? "search" : "arrow-right";
                this.search.searchButtonType = this.search.inputShow ? "primary" : "";
                this.search.inputShow = !this.search.inputShow;
                if (!this.search.inputShow) {
                    this.getList(0);
                }
            },
            getList(skip) {
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'order/get/recycle/15/' + skip).then(function(value) {
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
                this.pageNumber = value;
                this.getList((value - 1) * 15);
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>
<style scoped>

</style>