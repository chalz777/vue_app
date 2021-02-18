<template>
    <v-container>
        <!--<v-row class="text-center" style="height: 50px;">
            <v-col cols="12">
                <v-spacer />
            </v-col>
        </v-row>-->

        <v-row class="text-center">
            <v-col cols="12" class="pa-md-1 my-lg-auto" color="white">
                <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
            </v-col>
        </v-row>
    </v-container>   
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
    import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src    

@Component({
    components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
