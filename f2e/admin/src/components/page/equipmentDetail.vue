<template>
    <div id="equipmentDetail">
        <div class="pinsetlerNav">
            <div v-for="(item,index) in pinsetler" @click="select(index)" :class="{item:true,select:item._id==selectId}">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="please" v-show="!selectId">请选择商品↑</div>
        <equipmentComponent :_id="selectId" v-show="selectId"></equipmentComponent>
    </div>
</template>
<script>
    import CONFIG from '../../config';
    import equipmentComponent from './equipmentComponent.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "equipmentDetail",
        data() {
            return {
                selectId:null,
                pinsetler: [{
                    _id: null,
                    name: null,
                    englishName: null
                }]
            }
        },
        mounted() {
            this.get();
        },
        methods: {
            select(index){
                var _id=this.pinsetler[index]._id;
                this.selectId=_id;
            },
            get() {
                var _this = this;
                this.axios.get(CONFIG.API + 'group/pinsetler').then(function(value) {
                    var json = value.data;
                    if (!json.err && json.state) {
                        if (json.pinsetler.length > 0) {
                            _this.pinsetler = json.pinsetler;
                        } else {
                            _this.pinsetler = [{
                                id: null,
                                name: null,
                                englishName: null
                            }]
                        }
                    } else {
                        throw '获取失败';
                    }
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
            equipmentComponent
        }
    }
</script>