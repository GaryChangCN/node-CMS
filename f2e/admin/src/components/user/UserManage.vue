<template>
  <div id="user-manage">
    <div class="secondTitle">
        <span>账户管理</span>
        <el-button type="primary" icon='plus' size="mini" @click="showAddDialog"></el-button>
    </div>
    <div class="table">
      <el-table :data="userItems" stripe border style="width: 100%">
        <el-table-column property="username" label="用户名"></el-table-column>
        <el-table-column inline-template label="密码">
          <div><p>***********</p></div>
        </el-table-column>
        <el-table-column property="limitName" label="权限" show-tooltip-when-overflow></el-table-column>
        <el-table-column inline-template label="操作">
          <div class="button-group">
            <el-button type="primary"  size="mini" icon="edit" @click.native="showEditDialog(row)"></el-button>
            <el-button type="danger" size="mini" icon="delete" @click.native="showDelDialog(row)" v-show="!row.superUser"></el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加账户弹窗 -->
    <el-dialog title="添加账户" v-model="dialogAddVisible">
      <el-form :model="addUserData" :rules="rules" ref="addUserForm">
        <el-form-item prop="username" label="账户名" :label-width="formLabelWidth">
          <el-input v-model="addUserData.username" auto-complete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="limit" label="权限设置" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addUserData.limit">
            <el-checkbox label="1">表单管理、不包括回收站</el-checkbox>
            <el-checkbox label="2">产品管理</el-checkbox>
            <el-checkbox label="3">页面版式</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAddDialog()">取 消</el-button>
        <el-button type="primary" @click.native="add()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑账户弹窗 -->
    <el-dialog title="编辑账户(不更改的项目无需修改！)" v-model="dialogEditVisible">
      <el-form :model="editUserData" :rules="rules" ref="editUserForm">
        <el-form-item label="账户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editUserData.username" auto-complete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="editUserData.password" auto-complete="off" placeholder="输入新密码，不更改密码请忽略！"></el-input>
        </el-form-item>
        <el-form-item prop="limit" label="权限更改" :label-width="formLabelWidth" v-show="selectLimit">
          <el-checkbox-group v-model="editUserData.limit">
            <el-checkbox label="1">表单管理、不包括回收站</el-checkbox>
            <el-checkbox label="2">产品管理</el-checkbox>
            <el-checkbox label="3">页面版式</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelEditDialog()">取 消</el-button>
        <el-button type="primary" @click.native="edit()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除账户弹窗 -->
    <el-dialog title="删除提示" v-model="dialogDelVisible" size="tiny">
      <span>确定删除<strong>{{delUserData.username}}</strong>账户吗？（此操作不可恢复）</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelDelDialog()">取 消</el-button>
        <el-button type="danger" @click.native="del()">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import CONFIG from '../../config.js';
    import {
        mapMutations,
        mapActions
    } from 'vuex';
    export default {
        name: 'userManage',
        data() {
            return {
                selectLimit: true,
                dialogAddVisible: false,
                dialogEditVisible: false,
                dialogDelVisible: false,
                userItems: [],
                formLabelWidth: '1rem',
                rules: {
                    username: [{
                        required: true,
                        message: '账户名不可为空！',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '密码不可为空！',
                        trigger: 'blur'
                    }],
                    limit: [{
                        type: 'array',
                        required: true,
                        message: '请至少选择一个管理权限',
                        trigger: 'change'
                    }]
                },
                limitToName: {
                    1: '表单管理、不包括回收站',
                    2: '产品管理',
                    3: '页面版式'
                },
                addUserData: {
                    username: '',
                    password: '',
                    limit: []
                },
                editUserData: {
                    _id: '',
                    username: '',
                    password: '',
                    limit: []
                },
                delUserData: {}
            }
        },
        mounted() {
            var _this=this;
            this.$prompt('请先输入管理员密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(function(value){
                var f = new FormData();
                f.append('password', value.value);
                _this.axios.post(CONFIG.API+'userSuper',f).then(function(res){
                    var json=res.data;
                    if(json.power){
                        _this.showUserList(); 
                    }else{
                        throw '';
                    }
                }).catch(function(err){
                    _this.$alert('密码错误，点击确定刷新','错误',{
                        confirmButtonText:"确定",
                        callback:function(){
                            window.location.reload();
                        }
                    });
                })
            }).catch(function(){
                _this.$router.push({name:"unhandled"});
            })
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd']),
            showUserList() {
                let _this = this;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'user').then(function(val) {
                    if (!val.data.err && val.data.state) {
                        let list = val.data.list;
                        let limitToName = _this.limitToName;
                        list.forEach((element, index, array) => {
                            element.limitName = element.limit.map((value) => {
                                return limitToName[value];
                            }).join();
                        });
                        _this.userItems = list;
                        _this.processBarEnd();
                    } else {
                        throw '获取失败';
                    }
                }).catch(function(err) {
                    _this.processBarEnd();
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                })
            },
            showAddDialog() {
                this.dialogAddVisible = true;
            },
            cancelAddDialog() {
                this.dialogAddVisible = false;
                this.$refs.addUserForm.resetFields();
            },
            // 显示和隐藏编辑弹窗
            showEditDialog(item) {
                if (item.superUser) {
                    this.selectLimit = false;
                } else {
                    this.selectLimit = true;
                }
                this.editUserData.username = item.username;
                this.editUserData.limit = item.limit.map((value) => {
                    return value.toString();
                });
                this.editUserData._id = item._id;
                this.editUserData.password = '';
                this.dialogEditVisible = true;
            },
            cancelEditDialog() {
                this.dialogEditVisible = false;
                this.$refs.editUserForm.resetFields();
            },
            // 显示和隐藏删除弹窗
            showDelDialog(item) {
                this.delUserData._id = item._id;
                this.delUserData.username = item.username;
                this.dialogDelVisible = true;
            },
            cancelDelDialog() {
                this.dialogDelVisible = false;
                this.delUserData = {};
            },
            // 添加账户
            add() {
                this.$refs.addUserForm.validate((valid) => {
                    if (valid) {
                        let postAddData = new FormData();
                        let limit = this.addUserData.limit.map((value) => {
                            return +value
                        });
                        let _this = this;
                        limit = JSON.stringify(limit);
                        postAddData.append('username', this.addUserData.username);
                        postAddData.append('password', this.addUserData.password);
                        postAddData.append('limit', limit);
                        this.processBarBegin();
                        this.axios.post(CONFIG.API + 'user', postAddData).then(function(res) {
                            var json = res.data;
                            if (json.err) {
                                throw '用户名已存在';
                            } else if (!json.state) {
                                throw '获取失败'
                            } else {
                                _this.processBarEnd();
                                _this.dialogAddVisible = false;
                                _this.$refs.addUserForm.resetFields();
                                _this.showUserList();
                            }
                        }).catch(function(err) {
                            _this.processBarEnd();
                            _this.dialogAddVisible = false;
                            _this.$refs.addUserForm.resetFields();
                            _this.$notify.error({
                                title: '失败',
                                message: err
                            });
                        });
                    } else {
                        this.$notify.error({
                            title: '失败',
                            message: '账户信息填写错误！'
                        });
                        return false;
                    }
                });
            },
            // 编辑账户
            edit() {
                this.$refs.editUserForm.validate((valid) => {
                    if (valid) {
                        let postEditData = new FormData();
                        let limitArr = this.editUserData.limit.map((value) => {
                            return +value
                        });
                        let change = {
                            username: this.editUserData.username,
                            password: this.editUserData.password,
                            limit: limitArr
                        };
                        let _this = this;
                        change = JSON.stringify(change);
                        postEditData.append('_id', this.editUserData._id);
                        postEditData.append('change', change);

                        this.processBarBegin();
                        this.axios.put(CONFIG.API + 'user', postEditData).then(function(res) {
                            if (!res.data.err) {
                                _this.processBarEnd();
                                _this.dialogEditVisible = false;
                                _this.$refs.editUserForm.resetFields();
                                _this.showUserList();
                            } else {
                                throw '修改账户信息失败，请重试！'
                            }
                        }).catch(function(err) {
                            _this.processBarEnd();
                            _this.dialogEditVisible = false;
                            _this.$refs.editUserForm.resetFields();
                            _this.$notify.error({
                                title: '失败',
                                message: err
                            });
                        });
                    } else {
                        this.$notify.error({
                            title: '失败',
                            message: '账户信息填写错误！'
                        });
                        return false;
                    }
                });
            },
            // 删除账户
            del() {
                let postDelData = new FormData();
                let _this = this;
                postDelData.append('_id', this.delUserData._id);
                this.processBarBegin();
                this.axios.delete(CONFIG.API + 'user', {
                    data: postDelData
                }).then(function(res) {
                    if (!res.data.err) {
                        _this.processBarEnd();
                        _this.dialogDelVisible = false;
                        _this.delUserData = {};
                        _this.showUserList();
                    } else {
                        throw '删除账户失败，请重试！'
                    }
                }).catch(function(err) {
                    _this.processBarEnd();
                    _this.dialogDelVisible = false;
                    _this.delUserData = {};
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            }
        }
    }
</script>