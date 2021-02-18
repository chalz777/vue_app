<template>
        <v-card >
            <v-card-title>
                Trial Reports
                <v-spacer />
                <v-text-field v-model="search"
                                label="Search"
                                class="list-search"
                                single-line
                                hide-details />
            </v-card-title>

            <v-data-table :headers="headers"
                            :items="itemsDisplay"
                            :search="search"
                            item-key="id"
                            class="route-list-table">

                <template v-slot:body="{ items }">
                    <tbody>
                        <tr class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
                            <td class="ship">{{ item.ship }}</td>
                            <td class="date">{{ item.date }}</td>
                            <td class="site">{{ item.site }}</td>
                            <td class="comments">{{ item.comments }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-data-table>
        </v-card>
</template>

<script lang="ts">
    import Vue from 'vue'
    import * as DataAccess from '../assets/js/dataAccess'
    export default Vue.extend({        
        name: "trials-table",
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
        props: {
            //items: {
            //    type: Array,
            //    required: true,
            //    default:
            //        function () {
            //            return [];
            //        }
            //}
        },
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
            row_onclick: function (e) {
                console.log(e, " was clicked");
            }
        },
        computed: {
            root: function () {
                return null;// (<HTMLInputElement>document.getElementById('App-base-url')).value;                
            },
            headers: function () {
                return [{
                    text: "Ship",
                    value: "ship",
                    "class": "ship"
                }, {
                    text: "Date",
                    value: "date",
                    "class": "report-date"
                }, {
                    text: "Site",
                    value: "site",
                    "class": "site"
                }, {
                    text: "Comments",
                    value: "comments",
                    "class": "comments",
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
            return [];
        },
 //       template: `
	//			<v-card>
	//				<v-card-title>
 //                   Trial Reports
	//					<v-spacer/>
	//					<v-text-field v-model="search"
 //                       label="Search"
 //                       class="list-search"
 //                       single-line
 //                       hide-details/>
	//				</v-card-title>

	//				<v-data-table  :headers="headers"
 //                             :items="itemsDisplay"
 //                             :search="search"
 //                             item-key="id"
 //                             class="route-list-table">

	//					<template v-slot:body="{ items }">
	//						<tbody>
	//							<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
	//								<td class="ship">{{ item.ship }}</td>
	//								<td class="date">{{ item.date }}</td>
	//								<td class="site">{{ item.site }}</td>
	//								<td class="comments">{{ item.comments }}</td>
	//							</tr>
	//						</tbody>
	//					</template>
	//				</v-data-table>
	//			</v-card>
	//`
    
    })

</script>

<style scoped>
</style>


<!--<script lang="ts">  
    
  export default Vue.extend({
      name: "ssrnm-main",
      components: {
          "coming-soon": comingSoon,
          "dod-notice": dodNotice,
          "app-contacts": contacts,
          //"landing-page": landingPage,
          //"trial-reports-table": last15TrialReports,
          //"trials-table": TrialsTable,
          //"asw-table": AswTable,
          //"non-asw-table": NonAswTable
      },
      data: function () {
          return {
              header: "",
              isNoticeRendered: false,
              currentMainComponent: "landing-page",
              navItems: [{
                  id: 0,
                  link: "landing-page",
                  title: "SSRNM Main"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 1,
                  link: "",
                  title: "ATLANTIC FLEET"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 2,
                  link: "trials-table",
                  title: " - TRIAL HISTORY"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 3,
                  link: "asw-table",
                  title: " - ASW OVERVIEW"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 4,
                  link: "non-asw-table",
                  title: " - NON ASW OVERVIEW"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 5,
                  link: "coming-soon",
                  title: " - AUTEC RANGE INFO"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 6,
                  link: "coming-soon",
                  title: " - REPORT DISTRIBUTION"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 7,
                  link: "coming-soon",
                  title: " - EMAIL LIST"
                  , header: "ATLANTIC FLEET"
              }, {
                  id: 8,
                  link: "",
                  title: "PACIFIC FLEET"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 9,
                  link: "trials-table",
                  title: " - TRIAL HISTORY"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 10,
                  link: "asw-table",
                  title: " - ASW OVERVIEW"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 11,
                  link: "non-asw-table",
                  title: " - NON ASW OVERVIEW"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 12,
                  link: "coming-soon",
                  title: " - SCUIR RANGE INFO"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 13,
                  link: "coming-soon",
                  title: " - REPORT DISTRIBUTION"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 14,
                  link: "coming-soon",
                  title: " - EMAIL LIST"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 15,
                  link: "coming-soon",
                  title: "PROGRAM INFO"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 16,
                  link: "coming-soon",
                  title: "DOCUMENTS"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 17,
                  link: "coming-soon",
                  title: "SS ACOUSTIC TOPICS"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 18,
                  link: "coming-soon",
                  title: "PM/OP CHECK"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 19,
                  link: "coming-soon",
                  title: "SSRNM CRITERIA"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 20,
                  link: "coming-soon",
                  title: "FY REPORTS"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 21,
                  link: "coming-soon",
                  title: "AUTEC INFO"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 22,
                  link: "coming-soon",
                  title: "SCUIR INFO"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 23,
                  link: "coming-soon",
                  title: "FY END REPORTS"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 24,
                  link: "app-contacts",
                  title: "CONTACTS"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 25,
                  link: "coming-soon",
                  title: "DATABASE"
                  , header: "PACIFIC FLEET"
              }, {
                  id: 26,
                  link: "coming-soon",
                  title: "SHIP DETAILS"
                  , header: "Ship Details"
              }, {
                  id: 27,
                  link: "coming-soon",
                  title: "SSRNM Trials"
                  , header: "Trials"
              }, {
                  id: 28,
                  link: "coming-soon",
                  title: "Users"
                  , header: "Users"
              },
              ]
          };
      },
      methods: {
          navItem_onclick: function (e) {
              //load the page into #main
              this.currentMainComponent = e.link;
              this.header = e.header;
          }
      },
      computed: {
          currentMainProperties: function () {
              return {};
          },
          currentMainEvents: function () {
              return {};
          }
      },
      mounted: function () {
          var self = this;

          Vue.nextTick().then(function () {
              self.isNoticeRendered = true;
          });
      }

      //data: () => ({
      //  //message: `Hello ${mykey.MY_CONST}!`, // Hello Vue.js!
      //  search: '',
      //  slots: [
      //      'body',
      //      'body.append',
      //      'body.prepend',
      //      'footer',
      //      'header.data-table-select',
      //      'header',
      //      'header.<name>',
      //      'progress',
      //      'item.data-table-select',
      //      'item.<name>',
      //      'no-data',
      //      'no-results',
      //      'top'
      //],
      //importantLinks: [
      //  {
      //    text: 'Documentation',
      //    href: 'https://vuetifyjs.com',
      //  },
      //  {
      //    text: 'Chat',
      //    href: 'https://community.vuetifyjs.com',
      //  },
      //  {
      //    text: 'Made with Vuetify',
      //    href: 'https://madewithvuejs.com/vuetify',
      //  },
      //  {
      //    text: 'Twitter',
      //    href: 'https://twitter.com/vuetifyjs',
      //  },
      //  {
      //    text: 'Articles',
      //    href: 'https://medium.com/vuetify',
      //  },
      //],
      //whatsNext: [
      //  {
      //    text: 'Explore components',
      //    href: 'https://vuetifyjs.com/components/api-explorer',
      //  },
      //  {
      //    text: 'Select a layout',
      //    href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
      //  },
      //  {
      //    text: 'Frequently Asked Questions',
      //    href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
      //  },
      //],
      //}),
      //props: {
      //    files: {
      //        type: Array,
      //        required: true,
      //        default:
      //            function () {
      //                return [];
      //            }
      //    }
      //},
      //methods: {
      //    deleteItem: function (item: any) {
      //        console.log("deleteItem", item);
      //        //var self = this;
      //        DataAccess.deleteAttachment(item.id)
      //            .then(function (data: any) {
      //                console.log("data", data);
      //                //self.files.splice(self.files.findIndex((x: any) => x.id === item.id), 1);
      //                //self.$toasted.success("Record " + id + " removed");
      //            })
      //            .catch(function (err: any) {
      //                console.log(err);
      //                //self.$toasted.error("Failed to remove record " + id);
      //            });
      //    },
      //    //row_onclick: function (e) {
      //    //    console.log(e, " was clicked");
      //    //}
      //},
  })
</script>-->
