<script>
import { test } from '../api/test.js';
import { ref } from 'vue';
import { Aim, Coordinate } from '@element-plus/icons-vue';
export default {
    name: 'homeComponent',
    components: {
        Aim, Coordinate
    },
    setup() {
        const value1 = ref(null);
        const mesBtn = () => {
            console.log('11111');
            const params = {
                memId: '5491d095-d59e-4014-83dc-6fee0e1fa9a0',
                type: 0
            };
            test(params).then(data => console.log(data)).catch(msg => console.log(msg));
            // fetch('/api/get').then(res => res.json()).then(m => console.log(m)).catch(a => {
            //     console.log(a);
            // });
        };
        return {
            value1,
            mesBtn
        };
    }
};
</script>
<template>
    <div>
        <h4>home页面</h4>
        <el-icon>
            <aim />
        </el-icon>
        <el-icon>
            <coordinate />
        </el-icon>
        <mark>{{ $store.state.title }}</mark>
        <el-button type="primary" round @click="mesBtn">点击提示</el-button>
        <el-rate v-model="value1"></el-rate>
    </div>
</template>
<style lang="scss" >
</style>
