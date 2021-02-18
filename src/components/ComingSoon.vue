<template>
   
    <v-card>
        <v-card-title>
            Coming Soon
        </v-card-title>
    </v-card>
  
</template>

<script lang="ts">

    import Vue from 'vue'
    import * as DataAccess from '../assets/js/dataAccess'
    export default Vue.extend({
        name: "search-form",
        components: {         
        },
        data() {
            return {
                search: '',
                yourDateString: '2018-12-24 04:19:23',
                slots: [
                    'body',
                    'body.append',
                    'body.prepend',
                    'footer',
                    'header.data-table-select',
                    'header',
                    'header.<name>',
                    'progress',
                    'item.data-table-select',
                    'item.<name>',
                    'no-data',
                    'no-results',
                    'top'
                ],
                items: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },
                ],
                statuses: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },],
                fleets: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },],
                sites: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },],
                classes: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },],
                hulls: [
                    { title: 'Click Me1' },
                    { title: 'Click Me2' },
                    { title: 'Click Me3' },
                    { title: 'Click Me4' },]
            }
        },

    })

</script>
<style scoped>
</style>