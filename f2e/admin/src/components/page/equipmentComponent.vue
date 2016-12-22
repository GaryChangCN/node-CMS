<template>
    <div id="equipmentComponent">
        <div class="colTitleContainer">
            <div class="colTitle">
                <span class="span">上部图标标题</span>
                <el-button size="mini" type="primary" @click.native="update">保存修改</el-button>
            </div>
            <div class="inputContainer">
                <el-input v-model="list[type].colTitle.name" placeholder="中文"></el-input>
                <el-input v-model="list[type].colTitle.englishName" placeholder="英文"></el-input>
            </div>
        </div>
        <div class="colContainer">
            <div class="colTitle">
                <span class="span">上部图标</span>
                <el-button size="mini" type="primary" icon="plus" @click.native="addItem('col')"></el-button>
                <el-button size="mini" type="primary" @click.native="update">保存修改</el-button>
            </div>
            <div class="colItem" v-for="(item,index) in list[type].col">
                <div class="img">
                    <el-button type="danger" size="mini" icon="delete" @click.native="deleteItem(index,'col')"></el-button>
                    <img :src="item.link" alt="">
                    <el-button size="mini" icon="picture" @click.native="selectPic(index,'col')"></el-button>
                </div>
                <div class="colRow">
                    <el-input v-model="item.alt" placeholder="图片信息中文"></el-input>
                    <el-input v-model="item.altEn" placeholder="图片信息英文"></el-input>
                </div>
                <div class="colRow">
                    <el-input v-model="item.title" placeholder="标题中文"></el-input>
                    <el-input v-model="item.titleEn" placeholder="标题英文"></el-input>
                </div>
                <el-input type="textarea" v-model="item.content" placeholder="内容中文"></el-input>
                <el-input type="textarea" v-model="item.contentEn" placeholder="内容英文"></el-input>
            </div>
        </div>
        <div class="pptContainer colContainer">
            <div class="pptTitle colTitle">
                <span class="span">中部内容</span>
                <el-button size="mini" type="primary" icon="plus" @click.native="addItem('ppt')"></el-button>
                <el-button size="mini" type="primary" @click.native="update">保存修改</el-button>
            </div>
            <div class="pptItem colItem" v-for="(item,index) in list[type].ppt">
                <div class="img">
                    <el-button type="danger" size="mini" icon="delete" @click.native="deleteItem(index,'ppt')"></el-button>
                    <img :src="item.link" alt="">
                    <el-button size="mini" icon="picture"  @click.native="selectPic(index,'ppt')"></el-button>
                </div>
                <div class="pptRow colRow">
                    <el-input v-model="item.alt" placeholder="图片信息中文"></el-input>
                    <el-input v-model="item.altEn" placeholder="图片信息英文"></el-input>
                </div>
                <div class="pptRow colRow">
                    <el-input v-model="item.title" placeholder="标题中文"></el-input>
                    <el-input v-model="item.titleEn" placeholder="标题英文"></el-input>
                </div>
                <el-input type="textarea" v-model="item.content" placeholder="内容中文"></el-input>
                <el-input type="textarea" v-model="item.contentEn" placeholder="内容英文"></el-input>
            </div>
        </div>
        <div class="suggestContainer">
            <div class="colTitle suggestTitle">
                <span class="span">推荐商品左</span>
                <el-button size="mini" type="primary" icon="plus" @click.native="addSuggest('suggest1')"></el-button>
            </div>
            <div class="suggest">
                <div v-for="(item,index) in list[type].suggest1" class="suggestItem">
                    <span>{{item.name}}</span>
                    <el-button type="danger" size="mini" icon="delete" @click.native="deleteItem(index,'suggest1')" v-show="item.number"></el-button>
                </div>
            </div>
        </div>
        <div class="suggestContainer">
            <div class="colTitle suggestTitle">
                <span class="span">推荐商品中</span>
                <el-button size="mini" type="primary" icon="plus" @click.native="addSuggest('suggest2')"></el-button>
            </div>
            <div class="suggest">
                <div v-for="(item,index) in list[type].suggest2" class="suggestItem">
                    <span>{{item.name}}</span>
                    <el-button type="danger" size="mini" icon="delete" @click.native="deleteItem(index,'suggest2')" v-show="item.number"></el-button>
                </div>
            </div>
        </div>
        <div class="suggestContainer">
            <div class="colTitle suggestTitle">
                <span class="span">推荐商品右</span>
                <el-button size="mini" type="primary" icon="plus" @click.native="addSuggest('suggest3')"></el-button>
            </div>
            <div class="suggest">
                <div v-for="(item,index) in list[type].suggest3" class="suggestItem">
                    <span>{{item.name}}</span>
                    <el-button type="danger" size="mini" icon="delete" @click.native="deleteItem(index,'suggest2')" v-show="item.number"></el-button>
                </div>
            </div>
        </div>
        <div class="colTitleContainer">
            <div class="colTitle">
                <span class="span">nickname</span>
                <el-button size="mini" type="primary" @click.native="update">保存修改</el-button>
            </div>
            <div class="inputContainer">
                <el-input v-model="list[type].nickName.name" placeholder="中文"></el-input>
                <el-input v-model="list[type].nickName.englishName" placeholder="英文"></el-input>
            </div>
        </div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
        <el-dialog title="选择商品" v-model="dialogAddProductShow">
            <List></List>
        </el-dialog>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import List from '../product/ProductListComponent.vue';
    import Single from './../Single.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "equipmentComponent",
        props: ['_id'],
        watch: {
            _id: function() {
                this.get();
            }
        },
        data() {
            return {
                type: "default",
                dialogAddProductShow: false,
                suggestType: null,
                mediaVisible: false,
                mediaCheck: [],
                mediaType: null,
                mediaIndex: null,
                list: {
                    default: {
                        colTitle: {
                            name: null,
                            englishName: null
                        },
                        nickName: {
                            name: null,
                            englishName: null
                        },
                        col: [{
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: null,
                            altEn: null,
                            title: null,
                            titleEn: null,
                            content: null,
                            contentEn: null
                        }],
                        ppt: [{
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: null,
                            altEn: null,
                            title: null,
                            titleEn: null,
                            content: null,
                            contentEn: null
                        }],
                        suggest1: [{
                            _id: null,
                            name: "暂无"
                        }],
                        suggest2: [{
                            _id: null,
                            name: "暂无"
                        }],
                        suggest3: [{
                            _id: null,
                            name: "暂无"
                        }]
                    }
                }
            }
        },
        methods: {
            addSuggest(type) {
                this.suggestType = type
                this.dialogAddProductShow = true;
            },
            selectProduct(obj) {
                if (!!this.list[this.type][this.suggestType][0] && !this.list[this.type][this.suggestType][0]._id) {
                    this.list[this.type][this.suggestType].shift();
                }
                this.list[this.type][this.suggestType].push(obj);
                this.dialogAddProductShow = false;
                this.update();
            },
            deleteItem(index, type) {
                this.list[this.type][type].splice(index, 1);
                this.update();
            },
            addItem(type) {
                this.list[this.type][type].push(this.record()[type][0]);
                this.update();
            },
            selectPic(index, type) {
                this.mediaVisible = true;
                this.mediaType = type;
                this.mediaIndex = index;
            },
            getMedia(media) {
                this.mediaVisible = false;
                media = media[0] || [];
                if (media.length > 0) {
                    this.afterMedia(media);
                }
            },
            afterMedia(media) {
                var _this = this;
                _this.getPicLink(media).then(function(value) {
                    var temp = {
                        link: CONFIG.PIC + value.link,
                        alt: value.name,
                        altEn: value.englishName,
                        _id: value._id
                    }
                    var _id = _this._id;
                    var type = _this.mediaType;
                    var index = _this.mediaIndex;
                    _this.list[_id][type][index].link = CONFIG.PIC + value.link;
                    _this.list[_id][type][index].alt = value.name;
                    _this.list[_id][type][index].altEn = value.englishName;
                    _this.update();
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
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
            update() {
                var array = [this.list];
                var _this = this;
                var f = new FormData();
                f.append('type', 'equipmentdetail');
                f.append('array', JSON.stringify(array));
                _this.processBarBegin();
                _this.axios.post(CONFIG.API + 'style', f).then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        _this.get();
                        _this.$notify({
                            title: '成功',
                            message: '变更成功',
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
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'style/equipmentdetail').then(function(value) {
                    var json = value.data;
                    if (json.equipmentdetail.length != 0) {
                        var tmp = json.equipmentdetail[0];
                        var _id = _this._id;
                        if (!tmp.hasOwnProperty(_id)) {
                            tmp[_id] = _this.record();
                        }
                        _this.list = tmp;
                        _this.type = _id;
                    } else {
                        var _id = _this._id;
                        var tmp = {};
                        tmp[_id] = _this.record();
                        _this.list = tmp;
                        _this.type = _id;
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
            record() {
                var data = {
                    colTitle: {
                        name: null,
                        englishName: null
                    },
                    nickName: {
                        name: null,
                        englishName: null
                    },
                    col: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: null,
                        altEn: null,
                        title: null,
                        titleEn: null,
                        content: null,
                        contentEn: null
                    }],
                    ppt: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: null,
                        altEn: null,
                        title: null,
                        titleEn: null,
                        content: null,
                        contentEn: null
                    }],
                    suggest1: [{
                        _id: null,
                        name: "暂无"
                    }],
                    suggest2: [{
                        _id: null,
                        name: "暂无"
                    }],
                    suggest3: [{
                        _id: null,
                        name: "暂无"
                    }]
                }
                return data;
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components: {
            Single,
            List
        }
    }
</script>