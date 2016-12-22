<template>
  <div id="image-manage">
    <div class="secondTitle">
        <span>资料库 - 图片管理</span>
        <div>
            <div>
                <form ref="uploadForm">
                    <label class="upload-button" for="picfile"><i class="el-icon-upload"></label>
                    <input multiple="multiple" type="file" name="file" id="picfile" accept="image/png, image/jpeg, image/gif" ref="picture" @change="getPicture" class="el-upload__input">
                </form>
            </div>
            <div>
                <el-button v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
                <el-input placeholder="搜索图片" icon="search" v-model="keywords" v-show="search.inputShow" @click="searchMedia" @keyup.native.enter="searchMedia"></el-input>
            </div>
        </div>
    </div>
    <div class="table-wrapper">
        <el-table
            class="image-table"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            inline-template
            label="图片">
                <div class="image-wrapper" @click="showBigImage(row)">
                    <img class="image" :src="`/api/media/pic/${row.link}`" alt="image">
                </div>
            </el-table-column>
            <el-table-column
            inline-template
            label="中文名">
                <div>
                    <span>{{row.name}}</span>
                    <el-button type="primary"  size="mini" icon="edit" @click.native="showDialog(row, 'name')"></el-button>
                </div>
            </el-table-column>
            <el-table-column
            inline-template
            label="英文名">
                <div>
                    <span>{{row.englishName}}</span>
                    <el-button type="primary"  size="mini" icon="edit" @click.native="showDialog(row, 'englishName')"></el-button>
                </div>
            </el-table-column>
            <el-table-column
            inline-template
            label="操作">
                <div class="button-group">
                    <el-button type="danger" size="mini" icon="delete" @click.native="showDialog(row, 'del')"></el-button>
                </div>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination" v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="18" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>


    <!-- 添加图片弹窗 -->
    <el-dialog class="upload-dialog" title="添加图片" v-model="uploadData.dialogVisible">
        <div v-if="!uploadData.tableShow">数据加载中……</div>
        <el-table v-if="uploadData.tableShow" :data="uploadData.data">
            <el-table-column inline-template label="图片">
                <div class="dialog-image-wrapper">
                    <img class="image" :src="row.image" alt="image">
                </div>
            </el-table-column>
            <el-table-column inline-template label="中文名">
                <el-input type="text" v-model="row.info.name"></el-input>
            </el-table-column>
            <el-table-column inline-template label="英文名">
                <el-input type="text" v-model="row.info.englishName"></el-input>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click.native="cancelUpload">取 消</el-button>
            <el-button type="primary" @click.native="submitUpload">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改提示" v-model="changeData.dialogVisible" size="tiny">
      <span v-show="changeData.type === 'del'">确定删除<b style="color: #ff4949;">{{changeData.image.name}}</b>这张图片吗？（此操作不可恢复！若有项目引用了此图片则会失效！）</span>
      <el-input v-show="changeData.type !== 'del'" placeholder="请输入新值" v-model="changeData.newValue"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="changeData.dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click.native="submitChange">{{changeData.type === 'del' ? "删 除" : "提 交"}}</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog class="image-dialog" v-model="bigImage.dialogVisible">
        <img :src="`/api/media/pic/${bigImage.image.link}`">
    </el-dialog>
  </div>
</template>

<script>
    import CONFIG from '../../config.js';
    import {
        mapMutations,
        mapActions
    } from 'vuex';
    export default {
        name: 'imageManage',
        data() {
            return {
                total: null,
                keywords: '',
                currentPage: 1,
                tableData: [],
                search: {
                    inputShow: false,
                    searchButtonContent: "search",
                    searchButtonType: "primary"
                },
                uploadData: {
                    dialogVisible: false,
                    tableShow: false,
                    data: []
                },
                changeData: {
                    type: '',
                    image: {},
                    dialogVisible: false,
                    newValue: ''
                },
                bigImage: {
                    dialogVisible: false,
                    image: {}
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd']),
            handleCurrentChange(value) {
                this.currentPage = value;
                this.getImageData((value - 1) * 18);
            },
            toggleSearchContent() {
                this.keywords = '';
                this.search.searchButtonContent = this.search.inputShow ? 'search' : 'arrow-right';
                this.search.searchButtonType = this.search.inputShow ? 'primary' : '';
                this.search.inputShow = !this.search.inputShow;
                if (!this.search.inputShow) {
                    this.getImageData();
                }
            },
            init(page) {
                // getCount && get Image
                this.axios.get(`${CONFIG.API}media/count/picture`).then((value) => {
                    var json = value.data;
                    if (!json.err) {
                        this.total = json.sum;
                        if (page) {
                            this.getImageData((page - 1) * 18);
                        } else {
                            this.getImageData();
                        }
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(function(err) {
                    this.$notify.error({
                        title: '失败',
                        message: err
                    });
                });
            },
            getImageData(skip = 0) {
                this.processBarBegin();
                this.axios.get(`${CONFIG.API}media/get/picture/18/${skip}`).then((value) => {
                    var json = value.data;
                    if (!json.err) {
                        this.tableData = [];
                        this.tableData = json.list;
                        this.processBarEnd();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch((err) => {
                    this.$notify.error({
                        title: '失败',
                        message: "获取图片失败、请刷新"
                    });
                    this.processBarEnd();
                });
            },
            searchMedia() {
                if(!this.keywords) return;

                this.processBarBegin();
                this.axios.get(`${CONFIG.API}media/search/${this.keywords}`).then(value => {
                    let json = value.data;
                    if (!json.err) {
                        this.tableData = [];
                        this.tableData = json.list.map((val) => {
                            if (val.type === 'picture') return val;
                        });
                        this.processBarEnd();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(err => {
                    _this.$notify.error({
                        title: '失败',
                        message: "获取图片失败、请刷新"
                    });
                    _this.processBarEnd();
                });
            },
            showDialog(image, type) {
                this.changeData.newValue = '';
                this.changeData.image = image;
                this.changeData.type = type;
                this.changeData.dialogVisible = true;
            },
            submitChange() {
                if (this.changeData.type === 'del' && this.changeData.image._id) {
                    this.processBarBegin();
                    let delData = new FormData();
                    delData.append('_id', this.changeData.image._id);

                    this.axios.delete(`${CONFIG.API}media`, {
                        data: delData
                    }).then((res) => {
                        if(!res.data.err) {
                            this.processBarEnd();
                            this.changeData.dialogVisible = false;
                            this.init(this.currentPage);
                            this.$notify({
                                title: '成功',
                                message: '删除图片成功！',
                                type: 'success'
                            })
                        } else {
                            throw '删除图片失败！'
                        }
                    }).catch(err => {
                        this.$notify.error({
                            title: '失败',
                            message: err
                        });
                    });

                }
                else if (this.changeData.type !== 'del' && this.changeData.image._id) {
                    if(this.changeData.newValue) {
                        this.processBarBegin();
                        let change = null, changeData = new FormData();

                        if(this.changeData.type === 'name') {
                            change = {name: this.changeData.newValue};
                        } else {
                            change = {englishName: this.changeData.newValue};
                        }

                        changeData.append('_id', this.changeData.image._id);
                        changeData.append('change', JSON.stringify(change));

                        this.axios.put(`${CONFIG.API}media`, changeData).then((res) => {
                            if(!res.data.err) {
                                this.processBarEnd();
                                this.changeData.dialogVisible = false;
                                this.init(this.currentPage);
                                this.$notify({
                                    title: '成功',
                                    message: '修改信息成功！',
                                    type: 'success'
                                })
                            } else {
                                throw '修改信息失败！'
                            }
                        }).catch(err => {
                            this.$notify.error({
                                title: '失败',
                                message: err
                            });
                        });
                    }
                } else {
                    return false;
                }
            },
            getPicture() {
                let files = this.$refs.picture.files;
                let _this = this;
                if(files.length <= 0) return;

                this.uploadData.data = [];
                for(let i = 0; i < files.length; i++) {
                    console.log(files[i]);
                    let reader = new FileReader();
                    reader.onload = function() {
                        let result = this.result;
                        _this.uploadData.data[i] ={
                            image: result,
                            info:{
                                name: '保龄',
                                englishName: 'bowling'
                            }
                        };
                        if(i+1 === files.length) {
                            _this.uploadData.dialogVisible = true;
                            _this.uploadData.tableShow = true;
                        }
                    };
                    reader.readAsDataURL(files[i]);
                }
            },
            cancelUpload() {
                this.uploadData.dialogVisible = false;
                this.$refs.uploadForm.reset();
            },
            submitUpload() {
                let info = [];
                let formData = new FormData(this.$refs.uploadForm);
                this.uploadData.data.forEach((value, index) => {
                    info[index] = value.info;
                })
                info = JSON.stringify(info);
                formData.append('type', 'picture');
                formData.append('info', info);
                this.uploadFile(formData);
            },
            uploadFile(uploadData) {
                this.axios.post(`${CONFIG.API}media`, uploadData).then((value) => {
                    let json = value.data;
                    if (!json.err) {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success'
                        });
                        this.processBarEnd();
                        this.uploadData.dialogVisible = false;
                        this.init();
                        this.$refs.uploadForm.reset();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch((err) => {
                    this.$notify.error({
                        title: '失败',
                        message: err
                    });
                    this.processBarEnd();
                });
            },
            showBigImage(image) {
                this.bigImage.image = image;
                this.bigImage.dialogVisible = true;
            }
        }
    }
</script>