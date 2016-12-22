<template>
    <div id="FourthStage"  class="fourth stage">
        <div class="stageTitle">
            <span>四级(商品)</span>
            <div>
                <el-tooltip content="添加包含的商品" placement="top-start">
                    <el-button type="primary" icon="menu" @click.native="dialogAddProductShow=true" size="mini"></el-button>
                </el-tooltip>
            </div>
        </div>
        <div v-for="(item,index) in fourth.list" class="stageItem">
            <span class="name">{{item.name}}</span>
            <div v-show="fourth.list[0]._id">
                <el-button icon="arrow-up" size="mini" @click.native.stop="move('prev',index)"></el-button>
                <el-button icon="arrow-down" size="mini" @click.native.stop="move('next',index)"></el-button>
                <el-button type="danger" icon="delete" size="mini"  v-show="item.type=='product'" @click.native.stop="openShelve(index)"></el-button>
            </div>
        </div>
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
        name:"FourthStage",
        data(){
            return{
                dialogAddProductShow:false,
                fourth: {
                    list: [{
                        _id: null,
                        name: "空",
                        englishName: null,
                        type:'product'
                    }]
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
            selectProduct(obj){
                if(!this.fourth.list[0]._id){
                    this.fourth.list.shift();
                }
                this.fourth.list.push(obj);
                var _id=this.parentId;
                var change={
                    children:this.fourth.list.map(function(e){
                        return e._id;
                    })
                }
                this.dialogAddProductShow=false;
                this.update(_id,change);
            },
            move(to,index){
                var _id=this.parentId;
                var length=this.fourth.list.length;
                if(to=="prev"&&index!=0){
                    var tmp=this.fourth.list[index];
                    this.fourth.list[index]=this.fourth.list[index-1];
                    this.fourth.list[index-1]=tmp;
                    var change={
                      children:this.fourth.list.map(function(e){
                          return e._id;
                      })
                    }
                    this.update(_id,change);
                }else if(to=="next"&&index<length-1){
                    var tmp=this.fourth.list[index];
                    this.fourth.list[index]=this.fourth.list[index+1];
                    this.fourth.list[index+1]=tmp;
                    var change={
                      children:this.fourth.list.map(function(e){
                          return e._id;
                      })
                    }
                    this.update(_id,change);
                }
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
                    var _id=_this.fourth.list[index]._id;
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
            get() {
                var _id=this.parentId;
                var _this = this;
                _this.processBarBegin();
                this.axios.get(CONFIG.API + 'group/'+_id).then(function(value) {
                    var json = value.data;
                    if (json.state && !json.err) {
                        _this.processBarEnd();
                        if (json.list.length == 0) {
                            _this.fourth.list = [{
                                _id: null,
                                name: "空",
                                englishName: null,
                                type:'product'
                            }]
                        } else {
                            _this.rootId=json._id;
                            _this.fourth.list = json.list;
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
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components:{
            List
        }
    }
</script>