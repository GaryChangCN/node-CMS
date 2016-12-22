<template>
  <div id="product-add">
    <div class="secondTitle">
      <span>添加产品</span>
    </div>
    <div class="thirdContent">
        <ProductComponent _id="null" type="post"></ProductComponent>
    </div>
  </div>
</template>
<script>
    import Single from '../Single.vue';
    import ProductComponent from './ProductComponent.vue';
    export default {
        name: 'productAdd',
        components: { Single ,ProductComponent},
        data() {
            return {
            };
        }
    }
</script>
