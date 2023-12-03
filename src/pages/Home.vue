<template>
    <Header></Header>
    <div class="slog">webpack5 + vue3</div>
    <div class="num">计算数: {{  num }}</div>
    <div class="btn"><button @click="plus">加</button><button @click="minus">减</button></div>
    <customComponent></customComponent>
</template>
<script lang="ts" setup>
    import {ref} from 'vue'
    import customComponent from '@/component/Footer.vue'
    import Header from '@/component/Header.vue';
    import Test from '@/component/Test.vue';
    import {getName} from '@/utils/util'
    const num = ref(0);
    const plus = () => {
        getName()
        num.value++;
    }
    const minus = () => {
        console.log(num)
        console.info(num.value)
        num.value--;
    }
    console.log(process.env)
</script>
<style scoped>
    .slog {
        height: 200px;
        text-align: center;
        line-height: 200px;
        font-size: 48px;
        color: #fff;
    }
    .num {
        font-size: 32px;
        color: #fff;
        text-align: center;
        line-height: 60px;
    }
    .btn {
        height: 40px;
        line-height: 40px;
        text-align: center;
    }
    button {
        height: 40px; 
        width: 120px;
        border-radius: 8px;
        appearance: none;
        outline: none;
        border: none;
        margin: 0px 16px;
        cursor: pointer;
        color: #fff;
        background: rgba(0, 0, 0, 1);
    }
    button:hover {
        background: rgba(0,0,0,.5);
    }
</style>