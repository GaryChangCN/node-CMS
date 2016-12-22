<template>
    <div id="EditorContainer">
        <el-button icon="picture" size="mini" class="openPicSelect" @click.native="mediaVisible=true"></el-button>
        <div id="editor" v-html="inputContent" @input="outputContent"></div>
        <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>
    </div>
</template>

<script>
import WangEditor from 'wangeditor';
import emoji from '../../assets/emoji';
import Single from '../Single.vue';
import CONFIG from '../../config';
import {
        mapActions
    } from 'vuex';

export default {
    name:"Editor",
    props: ['inputContent'],
    data() {
        return {
            mediaVisible: false,
            mediaCheck: [],
            content: '',
        }
    },
    mounted() {
        this.begin()
    },
    methods: {
        begin(){
            var editor=this.createEditor();
            this.$editor=editor;
        },
        getMedia(media) {
            this.mediaVisible = false;
            media=media||[];
            if(media.length>0){
                this.afterMedia(media);
            }
        },
        afterMedia(media) {
            var _this = this;
            var _id = media[0];
            this.getPicLink(_id).then(function(e) {
                var h="<img src='"+CONFIG.PIC+e.link+"' alt='"+e.name+"'>";
                var html=_this.content;
                _this.$editor.$txt.append(html+h);
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
        createEditor() {
            const self = this;
            const editor = new WangEditor('editor');
            editor.config.menus = ['source', '|', 'bold', 'underline', 'italic', 'strikethrough', 'eraser', 'forecolor', 'bgcolor', '|', 'quote', 'fontsize', 'head', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright',
                '|', 'link', 'unlink','emotion', '|', 'undo', 'redo'
            ];
            editor.config.emotions={
                'weibo':{
                    title:'表情1',
                    data:emoji.weibo
                },
                'get':{
                    title:'表情2',
                    data:emoji.get
                }
            };
            editor.config.uploadImgUrl = CONFIG.API+'media';
            editor.config.uploadImgFileName = 'file';
            editor.config.uploadParams = {
                type:"picture",
                editor:"true"
            }
            wangEditor.config.printLog = false;
            editor.onchange = function() {
                self.formatContent(this.$txt.html());
            };
            editor.config.hideLinkImg = true;
            editor.create();
            return editor;
        },
        formatContent(content) {
            this.content = content;
            this.outputContent();
        },
        outputContent() {
            this.$emit('input', this.content);
        },
        ...mapActions(['processBarBegin', 'processBarEnd'])
    },
    components: {
        Single
    }
}
</script>

