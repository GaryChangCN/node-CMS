<template>
    <div id="Contactus">
        <Picture title="联系我们页面首图" type="contactusBanner"></Picture>
        <div class="contact">
            <div class="contactTitle">
                <span class="span">联系方式</span><el-button size="mini" type="primary" @click.native="update">保存修改</el-button>
            </div>
            <div class="contactContainer">
                <div class="contactItem" v-for="item in array">
                    <div class="info">
                        <div class="left"><el-input v-model="item.title" placeholder="中文标题"></el-input></div>
                        <div class="right"><el-input v-model="item.titleEn" placeholder="英文标题"></el-input></div>
                    </div>
                    <div class="contactInfo" v-for="item2 in item.list">
                        <div class="info">
                            <div class="left"><el-input v-model="item2.name" placeholder="中文姓名"></el-input></div>
                            <div class="right"><el-input v-model="item2.nameEn" placeholder="英文名"></el-input></div>
                        </div>
                        <div class="info">
                            <div class="left"><el-input v-model="item2.position" placeholder="中文职位"></div>
                            <div class="right"><el-input v-model="item2.positionEn" placeholder="英文职位"></el-input></div>
                        </div>
                        <div class="info">
                            <div class="left">MOBILE:</div>
                            <div class="right"><el-input v-model="item2.mobile"></el-input></div>
                        </div>  
                        <div class="info">
                            <div class="left">EMAIL:</div>
                            <div class="right"><el-input v-model="item2.email"></el-input></div>
                        </div>                                                
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Picture from './Picture.vue';
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "Contactus",
        data() {
            return {
                array: [{
                    title: null,
                    titleEn:null,
                    list: [{
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }, {
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }]
                }, {
                    title: null,
                    titleEn:null,
                    list: [{
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }, {
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }]
                }, {
                    title: null,
                    titleEn:null,
                    list: [{
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }, {
                        name: null,
                        nameEn:null,
                        position: null,
                        positionEn:null,
                        mobile: null,
                        email: null
                    }]
                }]
            }
        },
        mounted(){
            this.get();
        },
        methods: {
            update(){
                var _this=this;
                var f = new FormData();
                var array = this.array;
                f.append('type', 'contact');
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
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'style/contact').then(function(value) {
                    var json = value.data;
                    if (json.contact.length != 0) {
                        _this.array = json.contact;
                    } else {
                        _this.array = [{
                            title: null,
                            list: [{
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }, {
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }]
                        }, {
                            title: null,
                            list: [{
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }, {
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }]
                        }, {
                            title: null,
                            list: [{
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }, {
                                name: null,
                                position: null,
                                mobile: null,
                                email: null
                            }]
                        }]
                    }
                    _this.processBarEnd();
                }).catch(function(err) {
                    console.log(err)
                    _this.$notify.error({
                        title: '获取失败',
                        message: err
                    });
                    _this.processBarEnd();
                });
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        },
        components: {
            Picture
        }
    }
</script>