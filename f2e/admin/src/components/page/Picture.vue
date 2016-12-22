<template>
    <div id="Picture">
        <div class="title">
            <span>{{title}}</span>
        </div>
        <div class="picContent">
            <div class="img">
                <img :src="picture.link">
            </div>
            <div class="info">
                图片信息（seo用）
                <div class="alt">
                    中文：{{picture.alt}} <el-button icon="edit" size="mini" @click.native="editInfo('alt')"></el-button>
                </div>
                <div class="altEn">
                    英文：{{picture.altEn}} <el-button icon="edit" size="mini" @click.native="editInfo('altEn')"></el-button>
                </div>
                <div class="change">
                    更换
                    <el-button type="primary" icon="picture" size="mini" @click.native="mediaVisible=true"></el-button>
                </div>
            </div>
        </div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import Single from './../Single.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name:"Picture",
        data(){
            return{
                mediaVisible: false,
                mediaCheck: [],
                picture:{
                    link:"http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                    alt:"空",
                    altEn:"empty"
                }
            }
        },
        components: {
            Single
        },
        props:['title','type'],
        mounted(){
            this.get();
        },
        methods:{
            editInfo(info, order) {
                var _this = this;
                this.$prompt('请输入新值', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: "新字段不能为空"
                }).then(function(data) {
                    _this.picture[info] = data.value;
                    _this.update();
                }).catch(function() {});
            },
            getMedia(media) {
                this.mediaVisible = false;
                media=media||[];
                if(media.length>0){
                    this.afterMedia(media);
                }
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
                var _id = media[0];
                this.getPicLink(_id).then(function(e) {
                    _this.picture.link = CONFIG.PIC + e.link
                    _this.update();
                }).catch(function(err) {
                    console.log(err);
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            update() {
                var type = this.type;
                var array = [this.picture];
                var _this = this;
                var f = new FormData();
                f.append('type', type);
                f.append('array', JSON.stringify(array));
                _this.processBarBegin();
                _this.axios.post(CONFIG.API + 'style', f).then(function(value) {
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
            get() {
                var type = this.type;
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'style/' + type).then(function(value) {
                    var json = value.data;
                    if (json[type].length == 0) {
                        _this.picture={
                            link:"http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt:"空",
                            altEn:"empty"
                        }
                    } else {
                        _this.picture = json[type][0];
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
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>