<template>
    <div id="NavbarStyle">
        <Picture title="Logo图片" type="logo"></Picture>
        <Picture title="导航下拉面板图片" type="panelPicture"></Picture>
        <TextLine title="搜索框预设字段" type="placeholder"></TextLine>
    </div>
</template>
<script>
    import Picture from './Picture.vue';
    import TextLine from './TextLine.vue';
    export default {
        name:"NavbarStyle",
        data(){
            return{
              
            }
        },
        components:{
            Picture,
            TextLine
        }
    }
</script>