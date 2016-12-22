<template>
  <div id="head">
    <div class="secondTitle">
      <span>
               抬头管理
           </span>
      <el-button type="primary" icon='plus' size="mini" @click="openAdd"></el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="_id" label="编号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="抬头公司名" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center">
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" align="center">
        </el-table-column>
        <el-table-column inline-template label="操作" align="center" width="140">
          <div>
            <el-button type="primary" size="mini" icon="edit" @click.native="openUpdate(row)"></el-button>
            <el-button type="danger" size="mini" icon="delete2" @click.native="openDel(row)"></el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-bind:title="dialog.title" v-model="dialog.model" size="small">
      <el-form :model="form" :rules="rule" ref="ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="add" v-show="dialog.type=='add'">添加</el-button>
          <el-button type="primary" @click.native.prevent="update" v-show="dialog.type=='update'">修改</el-button>
          <el-button @click.native.prevent="dialog.model=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" v-model="dialog2.model" size="small">
      <span>确定要删除么</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click.native="del">确 定</el-button>
        <el-button @click.native="dialog2.model = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "head",
        data() {
            return {
                tableData: [],
                dialog: {
                    model: false,
                    title: "",
                    type: ""
                },
                dialog2: {
                    model: false,
                    _id: ""
                },
                form: {
                    name: "",
                    address: "",
                    contact: "",
                    _id: ""
                },
                rule: {
                    name: [{
                        required: true,
                        message: "请输入名称",
                        trigger: 'blur'
                    }],
                    address: [{
                        required: true,
                        message: "请输入地址",
                        trigger: 'blur'
                    }],
                    contact: [{
                        required: true,
                        message: "请输入联系方式",
                        trigger: 'blur'
                    }]
                }
            };
        },
        mounted() {
            this.get();
        },
        methods: {
            openAdd() {
                this.dialog = {
                    model: true,
                    title: "新建抬头",
                    type: "add"
                };
                this.form = {
                    name: null,
                    address: null,
                    contact: null,
                    _id: null
                };
            },
            add() {
                var _this=this;
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.processBarBegin();
                        var f = new FormData();
                        f.append('name', this.form.name);
                        f.append('address', this.form.address);
                        f.append('contact', this.form.contact);
                        _this.axios.post(CONFIG.API + 'head', f).then(function(value) {
                            var json = value.data;
                            if (!json.err && json.state) {
                                _this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success'
                                });
                                _this.get();
                                _this.dialog.model = false;
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
                    } else {
                        return false;
                    }
                });
            },
            openUpdate(row) {
                this.dialog = {
                    model: true,
                    title: "修改抬头",
                    type: "update"
                };
                this.form = {
                    name: row.name,
                    address: row.address,
                    contact: row.contact,
                    _id: row._id
                };
            },
            update() {
                var _this=this;
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        _this.processBarBegin();
                        var f = new FormData();
                        f.append('_id', this.form._id);
                        var change = this.form;
                        delete change._id;
                        f.append('change', JSON.stringify(change));
                        _this.axios.put(CONFIG.API + 'head', f).then(function(value) {
                            var json = value.data;
                            if (!json.err && json.state) {
                                _this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success'
                                });
                                _this.get();
                                _this.dialog.model = false;
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
                    } else {
                        return false;
                    }
                })
            },
            openDel(row) {
                this.dialog2 = {
                    model: true,
                    _id: row._id
                }
            },
            del() {
                var _this=this;
                this.processBarBegin();
                var f = new FormData();
                f.append('_id', this.dialog2._id);
                _this.axios.delete(CONFIG.API + 'head', {
                    data: f
                }).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        _this.get();
                        _this.dialog2.model = false;
                        _this.processBarEnd();
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
            get() {
                var _this=this;
                this.processBarBegin();
                _this.axios.get(CONFIG.API + 'head').then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.tableData = json.list.map(function(e) {
                            return {
                                _id: e._id,
                                name: e.name,
                                address: e.address,
                                contact: e.contact
                            }
                        });
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
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>
<style scoped>

</style>