<template>
   
    <v-card>
        <v-card-title>
            Query
        </v-card-title>

        <v-container>
            <v-menu>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Status
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in statuses" :key="index">
                        {{ item.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Fleet
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in fleets" :key="index">
                        {{ item.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Site
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in sites" :key="index">
                        {{ item.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Class
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in classes" :key="index">
                        {{ item.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu>
                <template v-slot:activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Hull Id
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in hulls" :key="index">
                        {{ item.title }}
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-container>
        <v-container>
            <v-btn>Search</v-btn>
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