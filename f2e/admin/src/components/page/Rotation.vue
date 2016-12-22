<template>
    <div id="Rotation">
        <div class="rotation">
            <span>{{title}}<el-button type="primary" icon="plus" size="mini" @click.native="mediaVisible=true"></el-button></span>
            <el-tabs type="border-card">
                <div class="empty" v-show="!!rotation[0].default">当前没有轮播图</div>
                <div v-for="item in rotation" v-show="!item.default">
                    <el-tab-pane v-bind:label="'第'+ (item.order+1) +'张'">
                        <div class="img"><img v-bind:src="item.link"></div>
                        <div class="info">
                            图片信息（seo用）
                            <div class="alt">
                                中文：{{item.alt}} <el-button icon="edit" size="mini" @click.native="editInfo('alt',item.order)"></el-button>
                            </div>
                            <div class="altEn">
                                英文：{{item.altEn}} <el-button icon="edit" size="mini" @click.native="editInfo('altEn',item.order)"></el-button>
                            </div>
                            <div class="order">
                                改变顺序
                                <el-button icon="arrow-left" size="mini" @click.native="moveTabItem('prev',item.order)"></el-button>
                                <el-button icon="arrow-right" size="mini" @click.native="moveTabItem('next',item.order)"></el-button>
                            </div>
                            <div class="delete">
                                删除
                                <el-button type="danger" icon="delete" size="mini" @click.native="deleteTabItem(item.order)"></el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </div>
            </el-tabs>
        </div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
    </div>
</template>
<script>
    import Single from './../Single.vue';
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "Rotation",
        props: ['title', 'propType'],
        data() {
            return {
                mediaVisible: false,
                mediaCheck: [],
                rotation: [{
                    link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                    alt: "default",
                    altEn: "default",
                    order: 0,
                    _id: "default",
                    default: true
                }]
            };
        },
        components: {
            Single
        },
        mounted() {
            this.get();
        },
        methods: {
            editInfo(info, order) {
                var _this = this;
                var index = ~~order;
                this.$prompt('请输入新值', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: "新字段不能为空"
                }).then(function(data) {
                    _this.rotation[index][info] = data.value;
                    _this.update();
                }).catch(function() {});
            },
            moveTabItem(move, order) {
                var index = ~~order;
                var length = this.rotation.length;
                var tmp = [].concat(this.rotation);
                var fun = function(tmp) {
                    this.rotation = tmp.map(function(e, index) {
                        e.order = index;
                        return e;
                    });
                    this.update();
                }.bind(this);
                if (this.rotation.length > 1) {
                    if (move == 'prev' && index > 0) {
                        var t = tmp[index - 1];
                        tmp[index - 1] = tmp[index];
                        tmp[index] = t;
                        fun(tmp);
                    } else if (move == 'next' && index < length - 1) {
                        var t = tmp[index + 1];
                        tmp[index + 1] = tmp[index];
                        tmp[index] = t;
                        fun(tmp);
                    }
                }
            },
            deleteTabItem(order) {
                var index = ~~order;
                var tmp = [].concat(this.rotation);
                tmp.splice(index, 1);
                this.rotation = tmp.map(function(e, index) {
                    e.order = index;
                    return e;
                });
                this.update();
                this.$notify.info({
                    message: '删除成功，请切换到其他选项卡',
                    type: 'success'
                });
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
                var t = [];
                media.forEach(function(e) {
                    t.push(_this.getPicLink(e));
                });
                Promise.all(t).then(function(value) {
                    var temp = value.map(function(e) {
                        return {
                            link: CONFIG.PIC + e.link,
                            alt: e.name,
                            altEn: e.englishName,
                            _id: e._id
                        }
                    });
                    if (_this.rotation[0].default) {
                        var tmp2 = temp;
                    } else {
                        var tmp2 = _this.rotation.concat(temp);
                    }
                    _this.rotation = tmp2.map(function(e, index) {
                        e.order = index;
                        return e;
                    });
                    _this.update();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            update() {
                var type = this.propType;
                var array = this.rotation;
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
            get() {
                var type = this.propType;
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'style/' + type).then(function(value) {
                    var json = value.data;
                    if (json[type].length == 0) {
                        _this.rotation = [{
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "default",
                            altEn: "default",
                            order: 0,
                            _id: "default",
                            default: true
                        }]
                    } else {
                        _this.rotation = json[type];
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