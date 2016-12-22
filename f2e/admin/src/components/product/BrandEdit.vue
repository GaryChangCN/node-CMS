<template>
  <div id="brand-edit">
    <div class="secondTitle">
        <span>分类管理</span>
    </div>
    <div class="stageContainer">
        <First :refresh="first.refresh"></First> 
        <Second :parentId="first.selectId" v-show="second.show"></Second>      
        <Third :parentId="second.selectId" v-show="third.show"></Third>
        <Fourth :parentId="third.selectId" v-show="fourth.show"></Fourth>
    </div>
  </div>
</template>
<script>
    import {
        mapActions
    } from 'vuex';
    import First from './FirstStage.vue';
    import Second from './SecondStage.vue';
    import Third from './ThirdStage.vue';
    import Fourth from './FourthStage.vue';
    export default {
        name: 'brandEdit',
        data() {
            return {
                first: {
                    refresh: null,
                    show: true,
                    selectId: null
                },
                second: {
                    show: false,
                    selectId: null
                },
                third: {
                    show: false,
                    selectId: null
                },
                fourth: {
                    show: false
                }
            }
        },
        methods: {
            firstCallback(_id) {
                if (_id) {
                    this.first.selectId = _id;
                    this.second.show = true;
                    this.third.show = false;
                    this.fourth.show = false;
                } else {
                    this.second.show = false;
                    this.third.show = false;
                    this.fourth.show = false;
                }
            },
            secondCallback(_id) {
                if (_id) {
                    this.second.selectId = _id;
                    this.third.show = true;
                    this.fourth.show = false;
                } else {
                    this.third.show = false;
                    this.fourth.show = false;
                }
            },
            thirdCallback(_id){
                if(_id){
                    this.third.selectId = _id;
                    this.fourth.show = true;
                }else{
                    this.fourth.show = false;
                }
            }
        },
        components: {
            First,
            Second,
            Third,
            Fourth
        }
    }
</script>