<template>
    <div id="Category">
        <div v-for="(item,i) in array" class="categor">
            <div class="tt">
                <span v-show="i==0" class="span">文章目录管理</span>
                <span class="span">第{{i+1}}行</span>
                <el-button class="delete" v-show="deleteShow" icon="delete" type="danger" size="mini" @click.native="deleteItem(i)"></el-button>
                <el-button icon="plus" v-show="array.length==(i+1)" size="mini" type="primary" @click.native="append"></el-button>
                <el-button type="primary" @click.native="update()" size="mini">提交修改</el-button>
            </div>
            <div class="categoryContainer">
                <div class="item" v-for="(item2,j) in item">
                    <div class="pic">
                        <img :src="item2.icon.link">
                        <el-button icon="document" size="mini" class="left" @click.native="controlArticle(i,j)"></el-button>
                        <el-button icon="picture" size="mini" class="right" @click.native="selectPic(i,j)"></el-button>
                    </div>
                    <div class="info">
                        <el-input v-model="item2.icon.alt" placeholder="图标信息中文(seo用)"></el-input>
                        <el-input v-model="item2.icon.altEn" placeholder="图标信息英文"></el-input>
                    </div>
                    <div class="title">
                        <el-input v-model="item2.title" placeholder="标题"></el-input>
                        <el-input v-model="item2.titleEn" placeholder="英文标题"></el-input>
                    </div>
                    <div class="content">
                        <el-input type="textarea" v-model="item2.content" placeholder="内容">
                        </el-input>
                        <el-input type="textarea" v-model="item2.contentEn" placeholder="英文内容">
                        </el-input>
                    </div>
                </div>
            </div>
        </div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
        <SelectArticle :show="SelectArticleShow" :articleCheck="articleCheck"></SelectArticle>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import Single from './../Single.vue';
    import SelectArticle from './SelectArticle.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "Category",
        data() {
            return {
                articleCheck:[],
                mediaVisible:false,
                SelectArticleShow:false,
                mediaCheck:[],
                where:{
                    i:null,
                    j:null
                },
                array: [
                    [{
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }, {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }, {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }]
                ]
            }
        },
        computed:{
            deleteShow(){
                return this.array.length>1?true:false;
            }
        },
        mounted(){
            this.get();
        },
        methods:{
            callback(judge,array){
                this.SelectArticleShow=false;
                var where=this.where;
                if(judge){
                    this.array[where.i][where.j].children=array;
                    this.update();
                }
            },
            controlArticle(i,j){
                this.SelectArticleShow=true;
                this.where={i,j};
                this.articleCheck=this.array[i][j].children||[];
            },
            deleteItem(i){
                this.array.splice(i,1);
                this.update();
            },
            append(){
                this.array.push(this.record());
                this.update();
            },
            getMedia(media) {
                this.mediaVisible = false;
                media=media||[];
                if(media.length>0){
                    this.afterMedia(media);
                }
            },
            selectPic(i,j){
                this.mediaVisible = true;
                this.where = {i,j};
            },
            getPicLink(_id) {
                var _this = this;
                return new Promise(function(reslove, reject) {
                    _this.axios.get(CONFIG.API + 'media/id/' + _id).then(function(value) {
                        var json = value.data;
                        if (!json.err && json.state) {
                            reslove(json.media);
                        } else {
                            reject("获取数据失败");
                        }
                    }).catch(function(err) {
                        reject(err);
                    });
                });
            },
            afterMedia(media) {
                var _this = this;
                var where = this.where;
                var _id = media[0];
                this.getPicLink(_id).then(function(e) {
                    _this.array[where.i][where.j].icon.link = CONFIG.PIC + e.link
                    _this.update();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            update(){
                var array=[];
                this.array.forEach(function(e){
                    array=array.concat(e);
                });
                var _this = this;
                var f=new FormData();
                f.append('type','category');
                f.append('array',JSON.stringify(array));
                _this.processBarBegin();
                _this.axios.post(CONFIG.API + 'article', f).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.get();
                        _this.$notify({
                            title: '成功',
                            message: '成功',
                            type: 'success'
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
            get(){
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'article/category/all').then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        if (json.list.length != 0) {
                            var array=[];
                            var tmp=[];
                            var list=json.list;
                            list.forEach(function(e,i){
                                var index=i+1;
                                if(index%3===0){
                                    tmp.push(e);
                                    array.push(tmp);
                                    tmp=[];
                                }else{
                                    tmp.push(e);
                                }
                            });
                            _this.array = array;
                        }else{
                            //_this.array=_this.record();
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
            record(){
                return [{
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }, {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }, {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    }]
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components:{
            Single,
            SelectArticle
        }
    }
</script>