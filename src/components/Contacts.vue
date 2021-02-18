<template>
   
    <v-card>
        <v-card-title>
            Contact Info
        </v-card-title>

        <v-container>
            <v-row class="text-center">
                <v-col cols="1">
                    <v-spacer />
                </v-col>
                <v-col cols="4">
                    <v-card elevation="8" outlined shaped>
                        <v-card-title>
                            SSRNM Programmatic Contact
                        </v-card-title>
                        <v-divider class="mx-4"></v-divider>                       

                        <v-card-text>
                            <div>Neal Prater</div>
                            <div>NAVSEA ASW Range Program Manager</div>
                            <div>(SEA05E18)</div>
                            <div>360-315-3413</div>
                            <div>neal.prater@navy.mil</div>
                        </v-card-text>  
                    </v-card>
                </v-col>
                <v-col cols="1">
                    <v-spacer />
                </v-col>

                <v-col cols="4" color="white">
                    <v-card elevation="8" outlined shaped>
                        <v-card-title>
                            Technical/WebSite Contact
                        </v-card-title>
                        <v-divider class="mx-4"></v-divider>
                        <v-card-text>
                            <div>NUWC Keyport Code 1042</div>
                            <div>610 Dowell Street</div>
                            <div>Keyport, WA 98345</div>

                            <div>Voice: 360-315-7840</div>
                            <div>james.gooder@navy.smil.mil</div>
                            <div>james.gooder@navy.mil</div>
                        </v-card-text>
                    </v-card>                   
                </v-col>
            </v-row>
</v-container>
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