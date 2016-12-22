<template>
  <div id="IndexStyle">
    <Rotation title="首页轮播图（PC端）" propType="rotation"></Rotation>
    <Rotation title="首页轮播图（移动端）" propType="rotationMobile"></Rotation>
    <Icon title="Investors' Chioce" type="investors"></Icon>
    <Icon title="Centers' Chioce" type="centers"></Icon>
    <Icon title="Bowlers' Chioce" type="bowlers"></Icon>
  </div>
</template>
<script>
    import Rotation from './Rotation.vue';
    import Icon from './Icon.vue';
    import {
        mapActions
    } from 'vuex';
    export default {
        name: "IndexStyle",
        data() {
            return {};
        },
        components: {
            Icon,
            Rotation
        }
    }
</script>