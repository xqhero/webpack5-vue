<template>
    <div class="footer">运行时长: {{ result.hours }} 小时 {{ result.minutes }} 分钟 {{ result.seconds }} 秒</div>
</template>
<script lang="ts" setup>
import {reactive, onMounted} from 'vue'

const result = reactive({
    hours: 0,
    minutes: 0,
    seconds: 0
})
const startTime = new Date('2023/05/01').getTime()


onMounted(() => {
    setInterval(()=>{
        const now = new Date().getTime()
        const diff = Math.floor((now - startTime) / 1000)
        result.hours =  Math.floor(diff / 3600)
        result.minutes = Math.floor(diff%3600/60);
        result.seconds = diff % 60;
        
    }, 1000)
})

</script>
<style scoped>
.footer{
    width: 100%;
    height: 100px;
    line-height: 100px;
    /* background-color: rgba(0,0,0,.5); */
    color: #fff;
    text-align: center;
    font-size: 20px;
}
</style>