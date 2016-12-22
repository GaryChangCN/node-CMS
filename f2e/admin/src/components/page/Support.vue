<template>
    <div id="Support">
        <Picture title="支持页面首图" type="supportBanner"></Picture>
        <Category></Category>
    </div>
</template>
<script>
    import Picture from './Picture.vue';
    import Category from './category.vue';
    export default {
        name:"Support",
        data(){
            return{
              
            }
        },
        components:{
            Picture,
            Category
        }
    }
</script>