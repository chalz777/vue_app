<template>
  <div class="home">    
    <HelloWorld2 msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld2 from '@/components/HelloWorld2.vue'; // @ is an alias to /src

@Component({
  components: {
      HelloWorld2,
  },
})
export default class Home extends Vue {}
</script>
