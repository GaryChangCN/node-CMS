<template>
  <div id="ProductComponent">
    <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
    <el-form :model="product" :rules="rules" ref="productForm" label-width="0.8rem">
        <el-form-item label="产品编号" prop="number">
        <el-input v-model="product.number"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="name">
        <el-input v-model="product.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="englishName">
        <el-input v-model="product.englishName" placeholder="可以在产品编辑的时候填写"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
            <el-button type="primary" @click.native="showSingle">从资料库选择</el-button>
        </el-form-item>
        <el-form-item label="中文描述" prop="description">
        <el-input type="textarea" v-model="product.description" :autosize="{minRows: 7, maxRows: 10}"></el-input>
        </el-form-item>
        <el-form-item label="英文描述" prop="englishDescription">
        <el-input type="textarea" v-model="product.englishDescription" :autosize="{minRows: 7, maxRows: 10}" placeholder="可以在产品编辑的时候填写"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click.native.prevent="handleSubmit" size="large">确定</el-button>
            <el-button type="danger" @click.native.prevent="handleReset" size="large">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
    import Single from '../Single.vue';
    import CONFIG from '../../config';
    import {
        mapMutations,
        mapActions
    } from 'vuex';
    export default {
        name: 'ProductComponent',
        components: {
            Single
        },
        data() {
            return {
                mediaCheck: [],
                mediaVisible: false,
                rules: {
                    number: [{
                        required: true,
                        message: '请输入产品的编号！',
                        trigger: 'blur'
                    }, ],
                    name: [{
                        required: true,
                        message: '请输入产品的名称！',
                        trigger: 'blur'
                    }, ],
                    englishName: [{
                        required: true,
                        message: '请输入产品的英文名称！',
                        trigger: 'blur'
                    }, ],
                    description: [{
                        required: true,
                        message: '请输入产品的中文描述！',
                        trigger: 'blur'
                    }, ],
                    englishDescription: [{
                        required: true,
                        message: '请输入产品的英文描述！',
                        trigger: 'blur'
                    }, ]
                },
                product: {
                    number: '',
                    name: '',
                    englishName: '',
                    description: '',
                    englishDescription: ''
                }
            };
        },
        props: ['_id','type'],
        mounted() {
            if (this._id != "null") {
                this.get(this._id);
            }
        },
        watch:{
            _id:function(){
                this.get(this._id);
            }
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd']),
            getMedia(media, visible) {
                this.mediaVisible = visible;
                this.mediaCheck = media ? media : this.mediaCheck;
            },
            showSingle() {
                this.mediaVisible = true;
            },
            handleReset() {
                this.$refs.productForm.resetFields();
            },
            handleSubmit(ev) {
                var _this = this;
                this.$refs.productForm.validate((valid) => {
                    if (valid&&_this.type=="post") {
                        _this.post();
                    } else if(valid&&_this.type=="update"){
                        _this.update();
                    }else{
                        _this.$notify.error({
                            title: '添加产品失败，请重试！'
                        });
                        return false;
                    }
                });
            },
            get(_id) {
                var _this = this;
                if(_id){
                    _this.processBarBegin();
                    _this.axios.get(CONFIG.API + 'product/id/' + _id).then(function(value) {
                        var json = value.data;
                        if (!json.err && json.state) {
                            _this.processBarEnd();
                            _this.mediaCheck = json.list.media;
                            var {
                                name,
                                englishName,
                                description,
                                englishDescription,
                                number,
                                media
                            } = json.list;
                            _this.product = {
                                name,
                                englishName,
                                description,
                                englishDescription,
                                number,
                                media,
                            };
                            _this.mediaCheck=media;
                        } else {
                            throw '获取数据失败';
                        }
                    }).catch(function(err) {
                        _this.processBarEnd();
                        _this.$notify.error({
                            title: '失败',
                            message: err
                        });
                    });
                }
            },
            update(){
                var _this=this;
                var _id=this._id;
                var change=_this.product;
                change.media=this.mediaCheck;
                var f=new FormData();
                f.append('_id',_id);
                f.append('change',JSON.stringify(change));
                this.axios.put(CONFIG.API+'product', f).then(res => {
                    if (!res.data.err) {
                        this.$notify({
                            title: '成功！',
                            message: '修改产品成功！',
                            type: 'success'
                        });
                        _this.$parent.callback();
                    } else {
                        throw '修改产品失败！';
                    }

                }).catch(err => {
                    _this.processBarEnd();
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            post(){
                var _this=this;
                let postData = new FormData();
                let media = JSON.stringify(this.mediaCheck);
                postData.append('number', this.product.number);
                postData.append('name', this.product.name);
                postData.append('englishName', this.product.englishName);
                postData.append('description', this.product.description);
                postData.append('englishDescription', this.product.englishDescription);
                postData.append('media', media);
                _this.processBarBegin();
                this.axios.post(`${CONFIG.API}product`, postData).then(res => {
                    if (!res.data.err) {
                        this.$notify({
                            title: '成功！',
                            message: '添加产品成功！',
                            type: 'success'
                        });
                        _this.handleReset();
                    } else {
                        throw res.data.err;
                    }

                }).catch(err => {
                    _this.processBarEnd();
                    _this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            }
        }
    }
</script>