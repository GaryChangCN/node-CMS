<template>
    <div id="Center">
        <Picture title="球馆页面首图" type="centerBanner"></Picture>
        <div class="centerList"  v-for="(item,index) in array">
            <div class="tt">
                <div class="span">球馆项目{{index+1}}</div>
                <el-button icon="delete" type="danger" v-show="array.length>1" size="mini" @click.native="deleteItem(index)"></el-button>
                <el-button icon="plus" type="primary" v-show="array.length==index+1" size="mini" @click.native="addItem"></el-button>
                <el-button type="primary" size="mini" @click.native="update">保存修改</el-button>
            </div>
            <div>
                <div class="item">
                    <div class="ttt">球馆频道页对应图片</div>
                    <div class="infoContainer">
                        <div class="info">
                            <el-input v-model="item.channel.icon.alt" placeholder="图标信息中文(seo用)"></el-input>
                            <el-input v-model="item.channel.icon.altEn" placeholder="图标信息英文"></el-input>
                        </div>
                        <div class="title">
                            <el-input v-model="item.channel.title" placeholder="标题"></el-input>
                            <el-input v-model="item.channel.titleEn" placeholder="英文标题"></el-input>
                        </div>
                        <div class="content">
                            <el-input type="textarea" v-model="item.channel.content" placeholder="内容 此处用于球馆频道页项目对应的图片及说明">
                            </el-input>
                            <el-input type="textarea" v-model="item.channel.contentEn" placeholder="英文内容">
                            </el-input>
                        </div>
                        <div class="control">
                            <el-button icon="picture" size="mini" @click.native="selectPic(index,null,'channel')"></el-button>
                        </div>
                    </div>
                    <div class="pic">
                        <img :src="item.channel.icon.link">
                    </div>
                </div>
                <div class="ppt">
                    <div class="pptTitle">
                        <span class="span">球馆内页展示图片<span>
                        <el-button icon="plus" type="primary" @click.native="addPpt(index)" size="mini"></el-button>
                    </div>
                    <div v-show="item.ppt.length==0">暂时为空</div>
                    <div class="pptItem" v-for="(pptItem,index2) in item.ppt" v-show="item.ppt.length>0">
                        <div class="pptImg">
                            <img :src="pptItem.link">
                        </div>
                        <div class="pptInfo">
                            <el-input v-model="pptItem.alt" placeholder="图片信息中文"></el-input>
                            <el-input v-model="pptItem.altEn" placeholder="图片信息英文"></el-input>
                        </div>
                        <div class="pptControl">
                            <el-button size="mini" icon="arrow-left" @click.native="move('prev','ppt',index,index2)"></el-button>
                            <el-button size="mini" icon="arrow-right" @click.native="move('next','ppt',index,index2)"></el-button>
                            <el-button size="mini" icon="picture" @click.native="selectPic(index,index2,'ppt')"></el-button>
                            <el-button size="mini" type="danger" @click.native="deletePpt(index,index2)" icon="delete"></el-button>
                        </div>
                    </div>
                </div>
                <div class="ppt">
                    <div class="pptTitle rotationTitle">
                        <span class="span">球馆内页轮播图<span>
                        <el-button icon="plus" type="primary"  @click.native="addRotation(index)" size="mini"></el-button>
                    </div>
                    <div v-show="item.rotation.length==0">暂时为空</div>
                    <div class="pptItem" v-for="(rotationItem,index3) in item.rotation" v-show="item.rotation.length>0">
                        <div class="pptImg">
                            <img :src="rotationItem.link">
                        </div>
                        <div class="pptInfo">
                            <el-input v-model="rotationItem.alt" placeholder="轮播图中文"></el-input>
                            <el-input v-model="rotationItem.altEn" placeholder="轮播图英文"></el-input>
                        </div>
                        <div class="pptControl">
                            <el-button size="mini" icon="arrow-left" @click.native="move('prev','rotation',index,index3)"></el-button>
                            <el-button size="mini" icon="arrow-right" @click.native="move('next','rotation',index,index3)"></el-button>
                            <el-button size="mini" icon="picture" @click.native="selectPic(index,index3,'rotation')"></el-button>
                            <el-button size="mini" type="danger" icon="delete" @click.native="deleteRotation(index,index2)"></el-button>
                        </div>
                    </div>
                </div>
                <div class="downLink">
                    <span class="span">球馆内页下载链接</span> <el-input v-model="item.link" placeholder="填写七牛云等外链" size="mini"></el-input>
                </div>
            </div>
        </div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
    </div>
</template>
<script>
    import Picture from './Picture.vue';
    import CONFIG from '../../config';
    import Single from './../Single.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "Center",
        data() {
            return {
                mediaVisible: false,
                mediaCheck: [],
                mediaType: null,
                mediaIndex: null,
                mediaIndexNext: null,
                array: [{
                    channel: {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    },
                    ppt: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    }],
                    rotation: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    }],
                    link: ""
                }]
            }
        },
        mounted() {
            this.get();
        },
        methods: {
            move(p,type,index,indexNext){
                var tmp=[].concat(this.array[index][type]);
                var length=tmp.length;
                var now=tmp[indexNext];
                if(p=="prev"&&indexNext>0){
                    tmp[indexNext]=tmp[indexNext-1];
                    tmp[indexNext-1]=now;
                    this.array[index][type]=tmp;
                    this.update();
                }else if(p=="next"&&indexNext<length-1){
                    tmp[indexNext]=tmp[indexNext+1];
                    tmp[indexNext+1]=now;
                    this.array[index][type]=tmp;
                    this.update();
                }
            },
            deleteRotation(index,index2){
                this.array[index].rotation.splice(index2,1);
                this.update()
            },
            deletePpt(index,index2){
                this.array[index].ppt.splice(index2,1);
                this.update()
            },
            addRotation(index){
                this.array[index].rotation.push(this.record().rotation[0]);
                this.update();
            },
            addPpt(index){
                this.array[index].ppt.push(this.record().ppt[0]);
                this.update();
            },
            deleteItem(index){
                this.array.splice(index,1);
                this.update();
            },
            addItem() {
                this.array.push(this.record());
                this.update();
            },
            selectPic(index, indexNext, type) {
                this.mediaVisible = true;
                this.mediaType = type;
                this.mediaIndex = index;
                this.mediaIndexNext = indexNext;
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
                    var type = _this.mediaType;
                    var index = _this.mediaIndex;
                    if (type == "channel") {
                        _this.array[index].channel.icon = temp;
                    } else if (type == "ppt") {
                        var indexNext = _this.mediaIndexNext;
                        _this.array[index].ppt[indexNext] = temp;
                    } else if (type == "rotation") {
                        var indexNext = _this.mediaIndexNext;
                        _this.array[index].rotation[indexNext] = temp;
                    } else {
                        _this.$notify.error({
                            title: '失败',
                            message: '未知的图片位置'
                        });
                    }
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
                var array = this.array;
                var _this = this;
                var f = new FormData();
                f.append('type', 'centerarray');
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
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'style/centerarray').then(function(value) {
                    var json = value.data;
                    if (json.centerarray.length == 0) {
                        _this.array = [_this.record()];
                    } else {
                        _this.array = json.centerarray;
                    }
                    _this.processBarEnd();
                }).catch(function(err) {
                    console.log(err);
                    _this.$notify.error({
                        title: '获取失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            record() {
                return {
                    channel: {
                        icon: {
                            link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                            alt: "",
                            altEn: ""
                        },
                        title: "",
                        titleEn: "",
                        content: "",
                        contentEn: ""
                    },
                    ppt: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    }],
                    rotation: [{
                        link: "http://7xw4hd.com1.z0.glb.clouddn.com/empty.gif",
                        alt: "",
                        altEn: ""
                    }],
                    link: ""
                }
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components: {
            Picture,
            Single
        }
    }
</script>