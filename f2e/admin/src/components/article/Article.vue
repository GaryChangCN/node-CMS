<template>
    <div id="Article">
        <div class="title">
            <el-input v-model="title" placeholder="填写文章标题"></el-input>
        </div>
        <Editor :input-content="inputContent"  v-model="content"></Editor>
        <div class="submit">
            <el-input v-model="link" placeholder="输入本篇文章外链下载地址"></el-input>
            <el-button type="primary" @click.native="submit">提交</el-button>
        </div>
    </div>
</template>
<script>
    import Editor from './Editor.vue';
    import CONFIG from '../../config';
    import {
            mapActions
        } from 'vuex';
    export default {
        name: "Article",
        data() {
            return {
                link:'',
                title:'',
                inputContent: '',
                content: ''
            }
        },
        components: {
            Editor
        },
        methods:{
            submit(){
                var _this=this;
                if(this.title.length==0){
                    this.$notify.error({
                        title:"提示",
                        message:"请输入标题"
                    });
                }else {
                    var _this = this;
                    var f = new FormData();
                    f.append('content', _this.content);
                    f.append('title', _this.title);
                    f.append('type','article');
                    f.append('link',_this.link);
                    _this.processBarBegin();
                    _this.axios.post(CONFIG.API + 'article', f).then(function(value) {
                        var json = value.data;
                        if (!json.err && json.state) {
                            _this.$notify({
                                title: '成功',
                                message: '成功',
                                type: 'success'
                            });
                            _this.processBarEnd();
                        } else {
                            throw '提交失败';
                        }
                    }).catch(function(err) {
                        _this.$notify.error({
                            title: '失败',
                            message: err
                        });
                        _this.disabled=false;
                        _this.processBarEnd();
                    });
                }
            },
            ...mapActions(['processBarBegin', 'processBarEnd'])
        }
    }
</script>