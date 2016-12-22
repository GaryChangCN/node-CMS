# vue 部分组件使用说明

## 1. 管理端资料库 single.vue
1. 文件位置： `/f2e/admin/src/components/Single.vue`;
2. 在其他组件中使用方法：

  ```js

    // 在父组件顶部引入组件

    <Single :media-check="mediaCheck" :media-visible="mediaVisible" v-on:returnmedia="getMedia"></Single>

    /*
     ** :media-visible="mediaVisible" 用来传递参数控制弹窗的显隐
     ** :media-check="mediaCheck" 用来传递已经选中的图片／视频的 _id 给 single
     ** mediaCheck === [] （如果不需要传递已选中的媒体资源可以不传此参数，但是需要传递时参数必须为 _id 的数组！！
     ** v-on:returnmedia="getMedia" 用来在 single 组件触发父组件获取选中的媒体资源的 _id 参数。返回的参数同样为 _id 的数组
     */

    // 在父组件的 methods 添加如下代码
    showSingle () {
        this.mediaVisible = true;
    },
    getMedia (media, visible) {
        this.mediaVisible = visible;
        this.mediaCheck = media ? media : this.mediaCheck;
    },

    // 已经忽略在 script 中引入组件的 js（比如 import ）。详细可以查看 '/f2e/admin/src/components/product/ProductAdd.vue'
  ```