<template>
    <div id="FirstStage"  class="first stage">
        <div class="stageTitle">
            <span>一级(分组)</span>
            <el-button type="primary" icon="plus" @click.native="openAdd()" size="mini"></el-button>
        </div>
        <div v-for="(item,index) in first.list" @click="openSecond(index)" :class="{stageItem:true,select:first.select==index}">
            <span class="name">{{item.name}}</span>
            <div v-show="first.list[0]._id">
                <el-button icon="arrow-up" size="mini" @click.native.stop="move('prev',index)"></el-button>
                <el-button icon="arrow-down" size="mini" @click.native.stop="move('next',index)"></el-button>
                <el-button type="primary" icon="edit" size="mini" @click.native.stop="openEdit(index)"></el-button>
                <el-button type="danger" icon="delete" size="mini" @click.native.stop="openDelete(index)"></el-button>
            </div>
        </div>
        <el-dialog title="添加" v-model="dialogVisible">
            <el-form :model="dialogForm" :rules="groupFormRules" ref="ruleForm">
                <el-form-item label="中文名" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="englishName">
                    <el-input v-model="dialogForm.englishName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click.native="dialogOk">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name:"FirstStage",
        data(){
            return{
                dialogVisible:false,
                dialogFunction:null,
                dialogIndex:null,
                rootId:null,
                dialogForm:{      
                  name:null,
                  englishName:null
                },
                ruleForm:{
                  name:'',englishName:''
                },
                groupFormRules:{
                  name:[{required:true,message:"请输入中文名",trigger: 'blur'}],
                  englishName:[{required:true,message:"请输入英文名",trigger: 'blur'}]
                },
                first: {
                    list: [{
                        _id: null,
                        name: "空",
                        englishName: null,
                        type:null
                    }],
                    select: null
                }
            }
        },
        props:['refresh'],
        watch:{
            refresh:function(){
                this.get();
            }
        },
        mounted(){
            this.get();
        },
        methods:{
            openSecond(index){
                var _id=this.first.list[index]._id;
                this.first.select=index;
                this.$parent.firstCallback(_id);
            },
            move(to,index){
                var _id=this.rootId;
                var length=this.first.list.length;
                if(to=="prev"&&index!=0){
                    var tmp=this.first.list[index];
                    this.first.list[index]=this.first.list[index-1];
                    this.first.list[index-1]=tmp;
                    var change={
                      children:this.first.list.map(function(e){
                          return e._id;
                      })
                    }
                    this.update(_id,change);
                }else if(to=="next"&&index<length-1){
                    var tmp=this.first.list[index];
                    this.first.list[index]=this.first.list[index+1];
                    this.first.list[index+1]=tmp;
                    var change={
                      children:this.first.list.map(function(e){
                          return e._id;
                      })
                    }
                    this.update(_id,change);
                }
            },
            openDelete(index){
                var _this=this;
                this.$confirm("将会永久删除此项以及此项下属所有分组，商品不会删除只会下架","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(function(){
                    _this.delete(index);
                }).catch(function(){});
            },
            openAdd(){
                this.dialogVisible=true;
                this.dialogFunction="add";
                this.reset();
            },
            openEdit(index){
                this.dialogVisible=true;
                this.dialogFunction="edit";
                this.dialogForm=this.first.list[index];
                this.dialogIndex=index;
            },
            dialogOk(){
                if(this.dialogFunction=="add"){
                    this.post();
                }else if(this.dialogFunction=="edit"){
                    var index=this.dialogIndex;
                    var _id=this.first.list[index]._id;
                    var change =this.dialogForm;
                    this.update(_id,change);
                    this.dialogVisible=false;
                }
            },
            delete(index){
                var _this=this;
                var _id=this.first.list[index]._id;
                var f=new FormData();
                f.append('stage','first');
                f.append('_id',_id);
                _this.axios.delete(CONFIG.API + 'group', {
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
                        _this.$parent.firstCallback(false);
                        _this.processBarEnd();
                    } else {
                        throw '删除失败';
                    }
                }).catch(function(err) {
                    console.log(err);
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            update(_id,change){
                var _this=this;
                var f=new FormData();
                f.append('_id',_id);
                f.append('change',JSON.stringify(change));
                _this.processBarBegin();
                _this.axios.put(CONFIG.API+'group',f).then(function(value){
                    var json = value.data;
                    if (json.state && !json.err) {
                        _this.processBarEnd();
                        _this.addVisible=false;
                        _this.$parent.firstCallback(false);
                        _this.get();
                        _this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success'
                        });
                    } else {
                        throw '更新失败';
                    }
                }).catch(function(err){
                  console.log(err);
                    _this.processBarEnd();
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                })
            },
            post(f){
                var _this=this;
                var f =new FormData();
                f.append('stage','first');
                f.append('name',this.dialogForm.name);
                f.append('englishName',this.dialogForm.englishName);
                _this.$refs.ruleForm.validate(function(valid){
                    if(valid){
                       _this.processBarBegin();
                       _this.axios.post(CONFIG.API + 'group',f).then(function(value) {
                          var json = value.data;
                          if (json.state && !json.err) {
                              _this.processBarEnd();
                              _this.reset();
                              _this.dialogVisible=false;
                              _this.get();
                              _this.$notify({
                                  title: '成功',
                                  message: '添加分组成功',
                                  type: 'success'
                              });
                          } else {
                              throw '获取失败';
                          }
                      }).catch(function(err) {
                          console.log(err);
                          _this.processBarEnd();
                          _this.$notify.error({
                              title: '失败',
                              message: err
                          });
                      });
                    }else{
                      return false;
                    }
                });
            },
            get() {
                var _this = this;
                _this.processBarBegin();
                this.axios.get(CONFIG.API + 'group/first').then(function(value) {
                    var json = value.data;
                    if (json.state && !json.err) {
                        _this.processBarEnd();
                        if (json.list.length == 0) {
                            _this.first.list = [{
                                _id: null,
                                name: "空",
                                englishName: null,
                                type:null
                            }]
                        } else {
                            _this.rootId=json._id;
                            _this.first.list = json.list;
                        }
                    } else {
                        throw '获取失败';
                    }
                }).catch(function(err) {
                    console.log(err);
                    _this.processBarEnd();
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            reset(){
                this.dialogForm={
                  extra:'',      
                  name:null,
                  englishName:null
                }
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>