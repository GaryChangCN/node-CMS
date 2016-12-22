<template>
    <div id="Icon">
        <div class="iconicon">
            <div class="tt">
                {{title}}
                <el-button type="primary" @click.native="update(type)" size="mini">提交修改</el-button>    
            </div>
            <div class="item" v-for="(item,index) in dataList">
                <div class="pic">
                    <img :src="item.icon.link">
                    <el-button icon="picture" size="mini" @click.native="selectPic(index)"></el-button>
                </div>
                <div class="info">
                    <el-input v-model="item.icon.alt" placeholder="图标信息中文(seo用)"></el-input>
                    <el-input v-model="item.icon.altEn" placeholder="图标信息英文"></el-input>
                </div>
                <div class="title">
                    <el-input v-model="item.title" placeholder="标题"></el-input>
                    <el-input v-model="item.titleEn" placeholder="英文标题"></el-input>
                </div>
                <div class="content">
                    <el-input type="textarea" v-model="item.content" placeholder="内容">
                    </el-input>
                    <el-input type="textarea" v-model="item.contentEn" placeholder="英文内容">
                    </el-input>
                    <el-input v-model="item.target" class="target" placeholder="跳转链接">
                    </el-input>
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
        name: 'Icon',
        props: ['type', 'title'],
        components: {
            Single
        },
        data() {
            return {
                mediaVisible: false,
                mediaCheck: [],
                where: null,
                dataList: [{
                    icon: {
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    },
                    title: "",
                    titleEn: "",
                    content: "",
                    contentEn: "",
                    target:""
                }, {
                    icon: {
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    },
                    title: "",
                    titleEn: "",
                    content: "",
                    contentEn: "",
                    target:""
                }, {
                    icon: {
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    },
                    title: "",
                    titleEn: "",
                    content: "",
                    contentEn: "",
                    target:""
                }]
            }
        },
        mounted() {
            this.get()
        },
        methods: {
            getMedia(media) {
                this.mediaVisible = false;
                media=media||[];
                if(media.length>0){
                    this.afterMedia(media);
                }
            },
            selectPic(a) {
                this.mediaVisible = true;
                this.where = a;
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
                    _this.dataList[where].icon.link = CONFIG.PIC + e.link
                    _this.update();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            update() {
                var type = this.type;
                var _this = this;
                var f = new FormData();
                var array = this.dataList;
                f.append('type', type);
                f.append('array', JSON.stringify(array));
                _this.processBarBegin();
                _this.axios.post(CONFIG.API + 'style', f).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.get(type);
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
                    if (json[type].length != 0) {
                        _this.dataList = json[type];
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