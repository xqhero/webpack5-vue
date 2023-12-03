<template>
<div class="header">
    <div class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    </div>
</div>
</template>
<style scoped>
    .header {
        height: 56px;
        background-color: rgba(0, 0, 0, .5);
    }
    .nav {
        width: 200px;
        height: 56px;
        margin: 0 auto;
        display: flex;
        align-items: center;
    }

    .nav a {
        flex: 1;
        text-decoration: none;
        color: #fff;
    }
</style>