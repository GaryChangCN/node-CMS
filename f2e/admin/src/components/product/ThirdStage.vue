<template>
    <div id="ThirdStage"  class="third stage">
        <div class="stageTitle">
            <span>
                三级
                <span v-show="third.list[0].type!='product'&&third.list[0].type!='group'">(分组/商品)</span>
                <span v-show="third.list[0].type=='product'">(商品)</span>
                <span v-show="third.list[0].type=='group'">(分组)</span>
            </span>
            <div>
                <el-tooltip content="添加包含的商品" placement="top-start" v-show="addProductShow&&third.list[0].type!='group'">
                    <el-button type="primary" icon="menu" @click.native="dialogAddProductShow=true" size="mini"></el-button>
                </el-tooltip>
                <el-tooltip content="添加包含的分组" placement="top-start"  v-show="addGroupShow&&third.list[0].type!='product'" >
                    <el-button type="primary" icon="plus" @click.native="openAdd()" size="mini"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div v-for="(item,index) in third.list"  @click="openFourth(index)" :class="{stageItem:true,select:third.select==index}">
            <span class="name">{{item.name}}</span>
            <div v-show="third.list[0]._id">
                <el-button icon="arrow-up" size="mini" @click.native.stop="move('prev',index)"></el-button>
                <el-button icon="arrow-down" size="mini" @click.native.stop="move('next',index)"></el-button>
                <el-button type="primary" icon="edit" size="mini" v-show="item.type=='group'" @click.native.stop="openEdit(index)"></el-button>
                <el-button type="danger" icon="delete" size="mini"  v-show="item.type=='group'" @click.native.stop="openDelete(index)"></el-button>
                <el-button type="danger" icon="delete" size="mini"  v-show="item.type=='product'" @click.native.stop="openShelve(index)"></el-button>
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
        <el-dialog title="选择商品" v-model="dialogAddProductShow">
            <List></List>
        </el-dialog>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    import List from './ProductListComponent.vue';
    export default {
        name:"ThirdStage",
        data(){
            return{
                dialogAddProductShow:false,
                dialogVisible:false,
                dialogFunction:null,
                dialogIndex:null,
                addGroupShow:true,
                addProductShow:true,
                dialogForm:{
                  extra:'',      
                  name:null
                },
                ruleForm:{
                  name:'',englishName:''
                },
                groupFormRules:{
                  name:[{required:true,message:"请输入中文名",trigger: 'blur'}],
                  englishName:[{required:true,message:"请输入英文名",trigger: 'blur'}]
                },
                third: {
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
        props:['parentId'],
        watch:{
            parentId:function(){
                this.get(this.parentId);
            }
        },
        methods:{
            openFourth(index){
                var type=this.third.list[index].type;
                if(type=="group"){
                    var _id=this.third.list[index]._id;
                    this.third.select=index;
                    this.$parent.thirdCallback(_id);
                }
            },
            selectProduct(obj){
                if(!this.third.list[0]._id){
                    this.third.list.shift();
                }
                this.third.list.push(obj);
                var _id=this.parentId;
                var change={
                    children:this.third.list.map(function(e){
                        return e._id;
                    })
                }
                this.dialogAddProductShow=false;
                this.update(_id,change);
            },
            move(to,index){
                var _id=this.parentId;
                var length=this.third.list.length;
                if(to=="prev"&&index!=0){
                    var tmp=this.third.list[index];
                    this.third.list[index]=this.third.list[index-1];
                    this.third.list[index-1]=tmp;
                    var change={
                      children:this.third.list.map(function(e){
                          return e._id;
                      })
                    }
                    this.update(_id,change);
                }else if(to=="next"&&index<length-1){
                    var tmp=this.third.list[index];
                    this.third.list[index]=this.third.list[index+1];
                    this.third.list[index+1]=tmp;
                    var change={
                      children:this.third.list.map(function(e){
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
            openShelve(index){
                var _this=this;
                this.$confirm("确定从当前分组下架此商品，商品不会删除","下架商品",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(function(){
                    _this.processBarBegin();
                    var f=new FormData();
                    var parentId=_this.parentId;
                    var _id=_this.third.list[index]._id;
                    f.append('stage','shelve');
                    f.append('parent',parentId);
                    f.append('product',_id);
                    _this.axios.post(CONFIG.API + 'group',f).then(function(value) {
                        var json = value.data;
                        if (json.state && !json.err) {
                            _this.processBarEnd();
                            _this.get();
                            _this.$notify({
                                title: '成功',
                                message: '下架',
                                type: 'success'
                            });
                        } else {
                            throw '下架失败';
                        }
                    }).catch(function(err) {
                        _this.processBarEnd();
                        _this.$notify.error({
                            title: '失败',
                            message: err
                        });
                    });
                }).catch(function(){});
            },
            openAdd(){
                this.reset();
                this.dialogVisible=true;
                this.dialogFunction="add";
            },
            openEdit(index){
                this.dialogVisible=true;
                this.dialogFunction="edit";
                this.dialogForm=this.third.list[index];
                this.dialogIndex=index;
            },
            dialogOk(){
                if(this.dialogFunction=="add"){
                    this.post();
                }else if(this.dialogFunction=="edit"){
                    var index=this.dialogIndex;
                    var _id=this.third.list[index]._id;
                    var change =this.dialogForm;
                    this.update(_id,change);
                    this.dialogVisible=false;
                }
            },
            delete(index){
                var _this=this;
                var _id=this.third.list[index]._id;
                var f=new FormData();
                f.append('_id',_id);
                f.append('stage','third');
                f.append('parent',this.parentId);
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
                f.append('stage','third');
                f.append('name',this.dialogForm.name);
                f.append('englishName',this.dialogForm.englishName);
                f.append('parent',this.parentId);
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
                var _id=this.parentId;
                var _this = this;
                _this.processBarBegin();
                this.axios.get(CONFIG.API + 'group/'+_id).then(function(value) {
                    var json = value.data;
                    if (json.state && !json.err) {
                        _this.processBarEnd();
                        if (json.list.length == 0) {
                            _this.third.list = [{
                                _id: null,
                                name: "空",
                                englishName: null,
                                type:null
                            }]
                            _this.addGroupShow=!json.extra;
                        } else {
                            _this.rootId=json._id;
                            _this.third.list = json.list;
                            _this.addGroupShow=!json.extra;
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
        },
        components:{
            List
        }
    }
</script>