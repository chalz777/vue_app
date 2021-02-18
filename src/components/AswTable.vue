<template>
  
    <v-card>
        <v-card-title>
            ASW Overview nana
            <v-spacer />
            <v-text-field v-model="search"
                          label="Search"
                          class="list-search"
                          append-icon="mdi-magnify"
                          single-line
                          hide-details />
        </v-card-title>
        
        <v-data-table :headers="headers"
                      :items="itemsDisplay"
                      :search="search"
                      item-key="id"
                      class="elevation-1"
                      @click:row="row_onClick">
            
            <template v-slot:slot:default>
                <tbody>
                    <tr class="pointer" v-for="item in items" :key="item.id">
                        <td>{{item.status}} | {{item.rowClass}}</td>
                        <td>{{ item.hull }}</td>
                        <td>{{ item.ship}}</td>
                        <td>{{ item.months}}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.name }}</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
        <div>

        </div>
    </v-card>


</template>

<script lang="ts">

    import Vue from 'vue'
    import * as DataAccess from '../assets/js/dataAccess'   

    export default Vue.extend({
        name: "asw-table",
        components: {
                
        },
        data() {
            return {          
                search: '',
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
                items: [],
            }
        },
        //props: {
        //    reports: {
        //        type: Array,
        //        required: true,
        //        default:
        //            function () {
        //                return [];
        //            }
        //    }
        //},
        methods: {
            /* 		deleteItem: function (item) {
            console.log("deleteItem", item);
            var self = this;
            DataAccess.deleteAttachment(item.id)
            .then(function (data) {
            console.log("data", data);
            self.files.splice(self.files.findIndex(x => x.id === item.id), 1);
            //self.$toasted.success("Record " + id + " removed");
            })
            .catch(function (err) {
            console.log(err);
            //self.$toasted.error("Failed to remove record " + id);
            });
            },
             */
            getReports: function(){
            return [
			{
                 id: 1                
                ,hull:"hull1"
                ,status:"status1"
                ,ship:"ship1"
                ,months:"months1"
                ,reportDate:this.dateFormat(new Date(0))           
                ,reportName:"name1"
                },
                {
                     id:2      
                ,hull:"hull2"
                ,status:"status2"
                ,ship:"ship2"
                ,months:"months2"
                ,reportDate:this.dateFormat(new Date(0))          
                ,reportName:"name2"
                },
                {
                 id: 3        
                ,hull:"hull3"
                ,status:"status3"
                ,ship:"ship3"
                ,months:"months3"
                ,reportDate:this.dateFormat(new Date(0))           
                ,reportName:"name3"
                },
                {
                 id: 4        
                ,hull:"hull4"
                ,status:"status4"
                ,ship:"ship4"
                ,months:"months4"
                ,reportDate:this.dateFormat(new Date(0))                
                ,reportName:"name4"
                },
                {
                 id: 5      
                ,hull:"hull5"
                ,status:"status5"
                ,ship:"ship5"
                ,months:"months5"
                ,reportDate:this.dateFormat(new Date(0))
                ,reportName:"name5"
			    }
			];
            },
            dateFormat: function (e){
                   return new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        }).format(e);
            },
         
            row_onClick: function (e) {
                console.log(e, " was clicked");
                console.log(this.$route.query);
                (this as any).$vData.getRoutedDocuments();
                //(this as any).getRoute();
                (this as any).$vToastify.info("body", "title"); 
                
            }
        },
        computed: {
            root: function () {
                return null;//document.getElementById('App-base-url').value;
            },
            headers: function () {
                return [{
                    text: "Status",
                    value: "status",
                    "class": "status"
                }, {
                    text: "Hull",
                    value: "hull",
                    "class": "hull"
                }, {
                    text: "Ship",
                    value: "ship",
                    "class": "ship"
                }, {
                    text: "Months",
                    value: "months",
                    "class": "months"
                }, {
                    text: "Date",
                    value: "reportDate",
                    "class": "report-date"
                }, {
                    text: "Report name",
                    value: "reportName",
                    "class": "report-name",
                    sort: function (a, b) {
                        return a - b;
                    }
                },
                ];
            },
            itemsDisplay: function () {
                const self = (this as any);
                if (self.items.sort) {
                    return self.items.sort((a: any, b: any) => {
                        return a - b;
                    });
                } else {
                    return [];
                }
            }
        },
        mounted: function () {
            (this as any).items = this.getReports();
        }
    })

</script>
<style scoped>
</style>