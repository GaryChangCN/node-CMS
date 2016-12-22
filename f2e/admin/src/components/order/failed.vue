<template>
  <div id="failed">
    <div class="secondTitle">
      <span>未成功交易</span>
      <div>
        <el-button v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
        <el-input placeholder="搜索表单" icon="search" v-model="keywords" v-show="search.inputShow" @keyup.native.enter="searchFailed" @click="searchFailed"></el-input>
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
        <el-table-column inline-template label="操作" align="center" width="70">
          <el-button type="primary" size="mini" icon="edit" @click.native="openSetContent(row)"></el-button>
        </el-table-column>
        <el-table-column inline-template label="移动" align="center" width="70">
          <el-button type="primary" size="mini" icon="setting" @click.native="openMove(row)"></el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="15" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div v-show="setContentShow" class="setContent">
      <div class="contentContainer">
        <el-button class="close" icon="close" @click.native="closeSetContent"></el-button>
        <orderPage v-bind:id="id"></orderPage>
      </div>
    </div>
    <el-dialog title="移动到" v-model="moveDialogShow" class="move-dialog">
      <el-form :model="moveForm" :rules="moveRule" ref="moveRef">
        <el-form-item label="请选择" prop="new">
          <el-select v-model="moveForm.new">
            <el-option label="已处理询价" value="processed"></el-option>
            <el-option label="回收站" value="recycle"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="moveDialogShow = false">取 消</el-button>
        <el-button type="primary" @click.native="move">确 定</el-button>
      </div>
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
        name: "failed",
        data() {
            return {
                moveDialogShow: false,
                moveForm: {
                    new: null
                },
                moveRule: {
                    new: [{
                        required: true,
                        message: '不能为空',
                        trigger: 'blue'
                    }]
                },
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
            this.axios.get(CONFIG.API + 'order/count/failed').then(function(value) {
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
            openMove(row) {
                this.id = row.id;
                this.moveDialogShow = true;
            },
            move() {
                var _this = this;
                this.$refs.moveRef.validate(function(v) {
                    if (v) {
                        var n = _this.moveForm.new;
                        var id = _this.id;
                        var change = {
                            where: n,
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
                                _this.moveDialogShow = false;
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
                    } else {
                        return false;
                    }
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
            closeSetContent() {
                this.setContentShow = false;
                this.fresh();
            },
            openSetContent(row) {
                this.id = row.id;
                this.setContentShow = true;
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
            searchFailed() {
                var _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'order/search/failed/' + this.keywords).then(function(value) {
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
                this.axios.get(CONFIG.API + 'order/get/failed/15/' + skip).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.tableData = _this.fullfill(json.list);
                        _this.processBarEnd();
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