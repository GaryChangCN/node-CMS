<template>
    <div id="SelectArticle" v-show="showThis">
        <div class="SelectArticleContainer">
            <div class="closeC">
                <el-button size="mini" @click.native="save(true)">保存修改</el-button>
                <el-button class="close" icon="close" size="mini" @click.native="save(false)"></el-button>
            </div>
            <div class="empty" v-show="array[0].default">暂时没有文章</div>
            <el-checkbox-group v-model="checkedd">
                <el-checkbox v-for="item in array" :label="item._id" v-show="!item.default">
                    <div class="articleTitle">
                        {{item.title}}
                    </div>
                    <div class="articleTime">
                        {{item.time}}
                    </div>
                </el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import {
        mapActions
    } from 'vuex';
    export default {
        name:"SelectArticle",
        data(){
            return{
                array:[
                    {
                        time:null,
                        title:null,
                        _id:null,
                        default:true
                    }
                ],
                checkedd:[]
            }
        },
        mounted(){
            this.get();
        },
        props:['articleCheck','show'],
        computed:{
            showThis(){
                return this.show;
            }
        },
        watch:{
            articleCheck:function(){
                this.checkedd=this.articleCheck;
            }
        },
        methods:{
            save(f){
                if(!f){
                    this.$parent.callback(false);
                }else{
                    if(this.checkedd.length!=0){
                        var array=this.checkedd;
                    }else{
                        var array=[];
                    }
                    this.$parent.callback(true,array);
                }
            },
            convertDate(date) {
                return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
            },
            get(){
                var _this = this;
                _this.processBarBegin();
                _this.axios.get(CONFIG.API + 'article/category/title').then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        if (json.list.length != 0) {
                            _this.array = json.list.map(function(e){
                                e.time=e.time?_this.convertDate(new Date(e.time)):'';
                                return e;
                            });
                        }else{
                            _this.array=[{time:null,title:null,_id:null,default:true}];
                        }
                        _this.processBarEnd();
                    } else {
                        throw "未获取成功";
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