<template>
    <div id="ViewEditor">
        <ul class="articleList">
            <li v-show="array[0].default">暂时没有文章</li>
            <li v-for="(item,index) in array" v-show="!item.default" v-bind:class="{select:select==index}" @click="selectArticle(index,item._id)">
                <span>{{item.title}}</span>
                <el-button type="danger" size="mini" icon="delete" @click.native.stop="deleteArticle(item._id)"></el-button>
            </li>
        </ul>
        <div class="articleContainer" v-show="editorShow">
            <div class="title">
                <el-input v-model="title"  placeholder="填写文章标题"></el-input>
            </div>
            <Editor :input-content="inputContent"  v-model="content"></Editor>
            <div class="submit">
                <div class="lastMod">
                    <span v-show="!!lastMod">上次修改：</span>{{lastMod}}
                </div>
                <el-input v-model="link"></el-input>
                <el-button type="primary"  @click.native="submit">提交修改</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import Editor from './Editor.vue';
    import CONFIG from '../../config';
    import {
            mapActions
        } from 'vuex';
    export default {
        name:"ViewEditor",
        data(){
            return{
              inputContent:"",
              content:"",
              title:null,
              link:null,
              array:[{title:null,_id:null,default:true}],
              lastMod:null,
              select:null,
              editorShow:false,
              _id:null
            }
        },
        mounted(){
            this.getTitle()
        },
        methods:{
            deleteArticle(_id){
                var _this=this;
                this.$confirm("此操作将会永久删除此篇文章以及从包含此文章所有目录中删除此篇文章","警告",{
                    confirmButtonText:"删除",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(function(){
                    _this.processBarBegin();
                    var f = new FormData();
                    f.append('_id', _id);
                    _this.axios.delete(CONFIG.API + 'article', {
                        data: f
                    }).then(function(value) {
                        var json = value.data;
                        if (!json.err && json.state) {
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.getTitle();
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
                }).catch(function(){})
            },
            submit(){
                var _this=this;
                _this.processBarBegin();
                var f = new FormData();
                f.append('_id', _this._id);
                f.append('content', _this.content);
                f.append('title', _this.title);
                f.append('link',_this.link);
                _this.axios.put(CONFIG.API + 'article', f).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success'
                        });
                        _this.getTitle();
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
            getArticle(_id){
                var _this=this;
                this.processBarBegin();
                _this.axios.get(CONFIG.API + 'article/id/'+_id).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.title=json.data.title;
                        _this.inputContent=json.data.content;
                        _this.link=json.data.link;
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
            selectArticle(index,_id){
                this.select=index;
                this.lastMod=this.array[index].time;
                this.editorShow=true;
                this._id=_id;
                this.getArticle(_id);
            },
            getTitle(){
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'article/category/title').then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        if (json.list.length != 0) {
                            _this.array = json.list.map(function(e){
                                e.time=e.time?_this.convertDate(new Date(e.time)):'';
                                return e;
                            });
                        }
                        _this.processBarEnd();
                    } else {
                        throw "未获取成功";
                    }
                    _this.processBarEnd();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '获取失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            convertDate(date) {
                return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components:{
            Editor
        }
    }
</script>