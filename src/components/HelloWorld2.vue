<template>
  <v-container>
      <v-row class="text-center">
          <v-col cols="12">
              <v-img :src="require('../assets/logo.svg')"
                     class="my-3"
                     contain
                     height="100" />
             
          </v-col>

          <!--<v-col class="mb-4">
              <h1 class="display-2 font-weight-bold mb-3">
                  Welcome to Vuetify Home 2
              </h1>
              <router-link to="/home2">Go to Home2</router-link>
              <router-link to="/">Go to Home 1</router-link>

              <p class="subheading font-weight-regular">
                  For help and collaboration with other Vuetify developers,
                  <br>please join our online
                  <a href="https://community.vuetifyjs.com"
                     target="_blank">Discord Community</a>
              </p>
          </v-col>

          <v-expansion-panels>
              <v-expansion-panel v-for="(item,i) in 5"
                                 :key="i">
                  <v-expansion-panel-header>
                      Item
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </v-expansion-panel-content>
              </v-expansion-panel>
          </v-expansion-panels>
          <v-dialog class="front" v-model="isNoticeRendered" :key="isNoticeRendered" transition="slide-x-transition">
              <dod-notice @click="isNoticeRendered = false" class="front"> </dod-notice>
          </v-dialog>-->

          <v-navigation-drawer app dark>
              <!--<v-list nav>
                  <v-list-item link v-for="item in navItems" :key="item.id" @click="navItem_onclick(item)">
                      <v-list-item-content>
                          <v-list-item-title>
                              {{item.title}}
                          </v-list-item-title>
                      </v-list-item-content>
                  </v-list-item>
              </v-list>-->
          </v-navigation-drawer>

          <v-main app dark>
              <v-container dark>
                  <div class="error">This site contains dynamic content - Highest Possible Classification is SECRET</div>
                  <h1>Surface Ship Radiated Noise Measurement</h1>
                  <h2>ASW Range Program Manager - Mr Neal Prater</h2>
                  <hr />
                  <h2>NAVAL SEA SYSTEMS COMMAND - SEA 05H3</h2>
                  <v-card>
                      <v-card-title>{{header}}</v-card-title>
                      <!--shoud be in the view<component :is="currentMainComponent" v-bind="currentMainProperties" v-on="currentMainEvents"> </component>-->
                  </v-card>
              </v-container>
          </v-main>
          

         
      </v-row>
  </v-container>
</template>

<script lang="ts">
    import Vue from 'vue'    
    import * as DataAccess from '../assets/js/dataAccess'

  export default Vue.extend({
      name: "ssrnm-main",
      components: {
          //"coming-soon": comingSoon,
          //"dod-notice": dodNotice,
          //"app-contacts": contacts,
          ////"landing-page": landingPage,
          ////"trial-reports-table": last15TrialReports,
          ////"trials-table": TrialsTable,
          ////"asw-table": AswTable,
          ////"non-asw-table": NonAswTable
      },
      data: function () {
          return {
              header: "",
              //isNoticeRendered: false,
              //currentMainComponent: "landing-page",
              //navItems: [{
              //    id: 0,
              //    link: "landing-page",
              //    title: "SSRNM Main"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 1,
              //    link: "",
              //    title: "ATLANTIC FLEET"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 2,
              //    link: "trials-table",
              //    title: " - TRIAL HISTORY"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 3,
              //    link: "asw-table",
              //    title: " - ASW OVERVIEW"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 4,
              //    link: "non-asw-table",
              //    title: " - NON ASW OVERVIEW"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 5,
              //    link: "coming-soon",
              //    title: " - AUTEC RANGE INFO"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 6,
              //    link: "coming-soon",
              //    title: " - REPORT DISTRIBUTION"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 7,
              //    link: "coming-soon",
              //    title: " - EMAIL LIST"
              //    , header: "ATLANTIC FLEET"
              //}, {
              //    id: 8,
              //    link: "",
              //    title: "PACIFIC FLEET"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 9,
              //    link: "trials-table",
              //    title: " - TRIAL HISTORY"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 10,
              //    link: "asw-table",
              //    title: " - ASW OVERVIEW"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 11,
              //    link: "non-asw-table",
              //    title: " - NON ASW OVERVIEW"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 12,
              //    link: "coming-soon",
              //    title: " - SCUIR RANGE INFO"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 13,
              //    link: "coming-soon",
              //    title: " - REPORT DISTRIBUTION"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 14,
              //    link: "coming-soon",
              //    title: " - EMAIL LIST"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 15,
              //    link: "coming-soon",
              //    title: "PROGRAM INFO"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 16,
              //    link: "coming-soon",
              //    title: "DOCUMENTS"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 17,
              //    link: "coming-soon",
              //    title: "SS ACOUSTIC TOPICS"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 18,
              //    link: "coming-soon",
              //    title: "PM/OP CHECK"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 19,
              //    link: "coming-soon",
              //    title: "SSRNM CRITERIA"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 20,
              //    link: "coming-soon",
              //    title: "FY REPORTS"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 21,
              //    link: "coming-soon",
              //    title: "AUTEC INFO"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 22,
              //    link: "coming-soon",
              //    title: "SCUIR INFO"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 23,
              //    link: "coming-soon",
              //    title: "FY END REPORTS"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 24,
              //    link: "app-contacts",
              //    title: "CONTACTS"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 25,
              //    link: "coming-soon",
              //    title: "DATABASE"
              //    , header: "PACIFIC FLEET"
              //}, {
              //    id: 26,
              //    link: "coming-soon",
              //    title: "SHIP DETAILS"
              //    , header: "Ship Details"
              //}, {
              //    id: 27,
              //    link: "coming-soon",
              //    title: "SSRNM Trials"
              //    , header: "Trials"
              //}, {
              //    id: 28,
              //    link: "coming-soon",
              //    title: "Users"
              //    , header: "Users"
              //},
              //]
          };
      },
      methods: {
          navItem_onClick: function (e) {
              //load the page into #main
              //this.currentMainComponent = e.link;
              //this.header = e.header;
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
          //var self = this;

          Vue.nextTick().then(function () {
              //self.isNoticeRendered = true;
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

//    const TrialsTable = {
//        name: "trials-table",
//        data() {
//            return {

//                search: '',
//                slots: [
//                    'body',
//                    'body.append',
//                    'body.prepend',
//                    'footer',
//                    'header.data-table-select',
//                    'header',
//                    'header.<name>',
//                    'progress',
//                    'item.data-table-select',
//                    'item.<name>',
//                    'no-data',
//                    'no-results',
//                    'top'
//                ]
//            }
//        },
//        props: {
//            items: {
//                type: Array,
//                required: true,
//                default:
//                    function () {
//                        return [];
//                    }
//            }
//        },
//        methods: {
//            /* 		deleteItem: function (item) {
//            console.log("deleteItem", item);
//            var self = this;
//            DataAccess.deleteAttachment(item.id)
//            .then(function (data) {
//            console.log("data", data);
//            self.files.splice(self.files.findIndex(x => x.id === item.id), 1);
//            //self.$toasted.success("Record " + id + " removed");
//            })
//            .catch(function (err) {
//            console.log(err);
//            //self.$toasted.error("Failed to remove record " + id);
//            });
//            },
//             */
//            row_onclick: function (e) {
//                console.log(e, " was clicked");
//            }
//        },
//        computed: {
//            root: function () {
//                return document.getElementById('App-base-url').value;
//            },
//            headers: function () {
//                return [{
//                    text: "Ship",
//                    value: "ship",
//                    "class": "ship"
//                }, {
//                    text: "Date",
//                    value: "date",
//                    "class": "report-date"
//                }, {
//                    text: "Site",
//                    value: "site",
//                    "class": "site"
//                }, {
//                    text: "Comments",
//                    value: "comments",
//                    "class": "comments",
//                    sort: function (a, b) {
//                        return a - b;
//                    }
//                },
//                ];
//            },
//            itemsDisplay: function () {
//                var self = this;
//                if (self.items.sort) {
//                    return self.items.sort((a, b) => {
//                        return a - b;
//                    });
//                } else {
//                    return [];
//                }
//            }
//        },
//        mounted: function () {
//        },
//        template: `
//				<v-card>
//					<v-card-title>
//                    Trial Reports
//						<v-spacer/>
//						<v-text-field v-model="search"
//                        label="Search"
//                        class="list-search"
//                        single-line
//                        hide-details/>
//					</v-card-title>

//					<v-data-table  :headers="headers"
//                              :items="itemsDisplay"
//                              :search="search"
//                              item-key="id"
//                              class="route-list-table">

//						<template v-slot:body="{ items }">
//							<tbody>
//								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
//									<td class="ship">{{ item.ship }}</td>
//									<td class="date">{{ item.date }}</td>
//									<td class="site">{{ item.site }}</td>
//									<td class="comments">{{ item.comments }}</td>
//								</tr>
//							</tbody>
//						</template>
//					</v-data-table>
//				</v-card>
//	`
//    };

//    const contacts = {
//        name: "app-contacts",
//        data() {
//            return {
//            }
//        },
//        template: `
//				<v-card>
//					<v-card-title>
//                    Contact Info
//					</v-card-title>

//					<v-container>
//						<div class="flex">
//							<div class="margin-sm">
//								<div>SSRNM Programmatic Contact</div>
//								<div>Neal Prater</div>
//								<div>NAVSEA ASW Range Program Manager</div>
//								<div>(SEA05E18)</div>
//								<div>360-315-3413</div>
//								<div>neal.prater@navy.mil</div>
//							</div>

//							<div class="margin-sm">
//								<div>Technical/WebSite Contact</div>
//								<div>NUWC Keyport Code 1042</div>
//								<div>610 Dowell Street</div>
//								<div>Keyport, WA 98345</div>
//								<div>Voice: 360-315-7840</div>
//								<div>james.gooder@navy.smil.mil</div>
//								<div>james.gooder@navy.mil</div>
//							</div>
//						</div>
//					</v-container>
//				</v-card>
//	`
//    };

//    const comingSoon = {
//        name: "coming-soon",
//        data() {
//            return {
//            }
//        },
//        template: `
//				<v-card>
//					<v-card-title>
//                    Coming Soon
//					</v-card-title>
//				</v-card>
//	`
//    };

//    const searchForm = {
//        name: "search-form",
//        data() {
//            return {
//                statuses: [],
//                fleets: [],
//                sites: [],
//                classes: [],
//                hulls: []
//            }
//        },
//        template: `
//<v-card>
//	<v-card-title>
//        Query
//	</v-card-title>

//	<v-container>
//		<v-menu>
//			<template v-slot:activator="{on, attrs}">
//				<v-btn>
//						Status
//				</v-btn>
//			</template>
//			<v-list>
//				<v-list-item v-for="(item, index) in statuses" :key="index">
//				</v-list-item>
//			</v-list>
//		</v-menu>
//		<v-menu>
//			<template v-slot:activator="{on, attrs}">
//				<v-btn>
//						Fleet
//				</v-btn>
//			</template>
//			<v-list>
//				<v-list-item v-for="(item, index) in fleets" :key="index">
//				</v-list-item>
//			</v-list>
//		</v-menu>
//		<v-menu>
//			<template v-slot:activator="{on, attrs}">
//				<v-btn>
//						Site
//				</v-btn>
//			</template>
//			<v-list>
//				<v-list-item v-for="(item, index) in sites" :key="index">
//				</v-list-item>
//			</v-list>
//		</v-menu>
//		<v-menu>
//			<template v-slot:activator="{on, attrs}">
//				<v-btn>
//						Class
//				</v-btn>
//			</template>
//			<v-list>
//				<v-list-item v-for="(item, index) in classes" :key="index">
//				</v-list-item>
//			</v-list>
//		</v-menu>
//		<v-menu>
//			<template v-slot:activator="{on, attrs}">
//				<v-btn>
//						Hull Id
//				</v-btn>
//			</template>
//			<v-list>
//				<v-list-item v-for="(item, index) in hulls" :key="index">
//				</v-list-item>
//			</v-list>
//		</v-menu>
//	</v-container>
//	<v-container>
//		<v-btn>Search</v-btn>
//	</v-container>
	
//</v-card>
//`
//    };

//    const dodNotice = {
//        name: "dod-notice",
//        data() {
//            return {
//            }
//        },
//        methods: {
//            clicked: function () {
//                this.emit("clicked");
//            }
//        },
//        template: `
//				<v-card @click="clicked">
//					<v-card-title>
//                    Consent to Monitoring
//					</v-card-title>

//					<v-container>
//						<p>
//		You are accessing a U.S. Government (USG) information system (IS) that is provided for USG-authorized use only.
//		By using this IS, you consent to the following conditions:
//						</p>
//						<p>		
//		The USG routinely intercepts and monitors communications on this IS for
//		purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM),
//		law enforcement (LE), and counterintelligence (CI) investigations. At any time, the USG may inspect and seize data stored on this IS.
//		Communications using, or data stored on, this IS are not private, are subject to rouine monitoring, intereption, and search, and may be
//		disclosed or used for any USG authorized purpose. This IS includes security measure (e.g., authentication and access controls) to protect
//		USG interests--not for your personal benefit or privacy. Notwithstanding the above, using this ID does not constitute conent to PM, LE
//		or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation
//		or services by attorneys, psychotherapits, or clergy, and their assistants. Such communications and work product are private and confidential.
//						</p>
//					</v-container>
//				</v-card>
//	`
//    };
</script>
