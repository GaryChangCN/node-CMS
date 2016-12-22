<template>
    <div id="TextLine">
        <div class="title">
            <span>{{title}}</span>
        </div>
        <div class="TextLineContent">
            <div class="input">
                <el-input v-model="textData.content" placeholder="中文"></el-input>
                <el-input v-model="textData.contentEn" placeholder="英文"></el-input>
            </div>
            <div class="submit">
                <el-button type="primary" size="small" @click.native="update">提交修改</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name:"TextLine",
        data(){
            return{
              textData:{
                  content:null,
                  contentEn:null
              }
            }
        },
        props:['title','type'],
        mounted(){
            this.get();
        },
        methods:{
            update() {
                var type = this.type;
                var array = [this.textData];
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
                        _this.textData={
                            content:null,
                            contentEn:null
                        }
                    } else {
                        _this.textData = json[type][0];
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