<template>
    <div id="Project-Center">
        <Picture title="工程页面首图" type="projectBanner"></Picture>
        <ProjectList title="工程页面列表信息" type="projectList"></ProjectList>
    </div>
</template>
<script>
    import Picture from './Picture.vue';
    import ProjectList from './ProjectList.vue';
    export default {
        name:"Project-Center",
        data(){
            return{
              
            }
        },
        components:{
            Picture,
            ProjectList
        }
    }
</script>