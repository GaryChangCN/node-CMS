<!-- 资料库 -->
<template>
<div id="single">
  <el-dialog title="资料库" v-model="dialogMediaVisible" size="full">
    <div class="nav">
        <div>
            <el-button type="primary" size="small" @click.native="getSingleData('picture')">图片</el-button>
            <el-button type="primary" size="small" @click.native="getSingleData('video')">视频</el-button>
        </div>
        <div>
          <el-button size="small" v-bind:type="search.searchButtonType" v-bind:icon="search.searchButtonContent" @click="toggleSearchContent"></el-button>
          <el-input placeholder="搜索中文或英文名" icon="search" v-model="keywords" v-show="search.inputShow" @click="searchSingle" @keyup.native.enter="searchSingle"></el-input>
        </div>
    </div>
    <div class="singleContent">
        <div class="item" v-for="file in singleFiles">
            <div class="item-img">
              <img :src="file.type === 'picture' ? preLink + file.link: '//odgdn5u95.bkt.clouddn.com/video2.png' " :alt="file.englishName" width="200px">
            </div>
            <el-checkbox v-model="mediaIdReturn" :label="file._id">{{file.name}}</el-checkbox>
        </div>
    </div>
    <div class="pagination" v-show="!search.inputShow">
      <el-pagination @current-change="handleCurrentChange" :current-page="1" :page-size="18" layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="dialogMediaVisible = false">取 消</el-button>
      <el-button type="primary" @click.native="dialogMediaVisible = false, choose = true">确 定</el-button>
    </span>
  </el-dialog>
</div>

</template>
<script>
    import CONFIG from '../config.js';
    import {
        mapMutations,
        mapActions
    } from 'vuex';
    export default {
        name: 'single',
        props: ['mediaCheck', 'mediaVisible'],
        data() {
            return {
                preLink: CONFIG.PIC,
                total: null,
                keywords: '',
                kind: 'picture',
                choose: false,
                dialogMediaVisible: false,
                search: {
                    inputShow: false,
                    searchButtonContent: "search",
                    searchButtonType: "primary"
                },
                singleFiles: [],
                mediaIdReturn: []
            }
        },
        watch: {
            'mediaVisible' (val) {
                if (val) {
                    this.dialogMediaVisible = true;
                }
            },
            'dialogMediaVisible': function(val) {
                if (val) {
                    this.mediaIdReturn = this.mediaCheck ? this.mediaIdReturn.concat(this.mediaCheck) : this.mediaIdReturn;
                    this.getCount();
                } else {
                    if (this.choose) {
                        this.$emit('returnmedia', this.mediaIdReturn, false);
                        this.choose = false;
                        this.mediaIdReturn = [];
                    } else {
                        this.$emit('returnmedia', null, false);
                        this.mediaIdReturn = [];
                    }
                }
            }
        },
        methods: {
            ...mapActions(['processBarBegin', 'processBarEnd']),
            handleCurrentChange(value) {
                this.getSingleData(this.kind, (value - 1) * 18);
            },
            toggleSearchContent() {
                this.keywords = '';
                this.search.searchButtonContent = this.search.inputShow ? 'search' : 'arrow-right';
                this.search.searchButtonType = this.search.inputShow ? 'primary' : '';
                this.search.inputShow = !this.search.inputShow;
                if (!this.search.inputShow) {
                    this.getSingleData(this.kind);
                }
            },
            getCount() {
                let _this = this;
                this.axios.get(CONFIG.API + 'media/count/' + this.kind).then(function(value) {
                    var json = value.data;
                    if (!json.err) {
                        _this.total = json.count;
                        _this.getSingleData();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: "获取图片失败、请刷新"
                    });
                });
            },
            getSingleData(kind = 'picture', skip = 0) {
                let _this = this;
                this.kind = kind;
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'media/get/' + kind + '/18/' + skip).then(function(value) {
                    var json = value.data;
                    if (!json.err) {
                        json.list.forEach(function(ele) {
                            ele.checked = false;
                        });
                        _this.singleFiles = json.list;
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
            searchSingle() {
                let _this = this;
                if(!this.keywords) {
                    return;
                }
                this.processBarBegin();
                this.axios.get(CONFIG.API + 'media/search/' + this.keywords).then(function(value) {
                    var json = value.data;
                    if (!json.err) {
                        _this.singleFiles = json.list;
                        _this.processBarEnd();
                    } else {
                        throw '获取数据失败';
                    }
                }).catch(function(err) {
                    _this.$notify.error({
                        title: '失败',
                        message: "获取图片失败、请刷新"
                    });
                    _this.processBarEnd();
                });
            },
            getPicture() {
                let previewer = this.$refs.previewer;
                previewer.src = '';
                let reader = new FileReader();
                reader.onload = function() {
                    let result = this.result;
                    previewer.src = result;
                };
                reader.readAsDataURL(this.$refs.picture.files[0]);
                this.uploadPreview = true;
                this.uploadForm.file = this.$refs.picture.files[0];
            }
        }
    }
</script>