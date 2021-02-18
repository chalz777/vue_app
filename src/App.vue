<template>
  
    <v-app>
        <v-system-bar app class="text-center" color="red" dark>
            <v-row class="text-center">
                <v-spacer />
                <span class="black--text">
                    This site contains dynamic content - Highest Possible Classification is SECRET
                </span>
            </v-row>
            <v-spacer></v-spacer>
            <v-icon>mdi-wifi-strength-4</v-icon>
            <v-icon>mdi-signal-cellular-outline</v-icon>
            <v-icon>mdi-battery</v-icon>
            <span>12:30</span>
        </v-system-bar>
        
            <v-navigation-drawer app dark>
                <v-list nav>
                    <v-list-item link v-for="item in navItems" :key="item.id" @click="navItem_onclick(item)">
                        <v-list-item-content>
                            <v-list-item-title>
                                <i class="material-icons" :style="{'font-size':item.isize + 'px'}">{{item.icon}}</i>        
                                {{item.title}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

           
            <v-app-bar app>
                <h2>Surface Ship Radiated Noise Measurement</h2>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn>
                        <i class="material-icons" style="font-size:24px">account_balance</i>  
                        <router-link to="/ssrnm">SSRNM Main</router-link>
                    </v-btn>
                    <v-btn>
                        <i class="material-icons" style="font-size:20px">directions_boat</i>
                        <router-link to="/">Atlantic Fleet</router-link>
                    </v-btn>
                    <v-btn>
                        <i class="material-icons" style="font-size:22px">help_outline</i>
                        <router-link to="/about">About</router-link>
                    </v-btn>
                </v-toolbar-items>


            </v-app-bar>
            <v-main>
                <v-container fluid>
                    <router-view :parentComponent="currItem" />
                </v-container>
            </v-main>
            <v-footer app>
                <!-- -->
            </v-footer>
</v-app>
</template>

<script lang="ts">
    /* eslint-disable vue/no-unused-components */
    import Vue from 'vue';
    import SsrnmMain from '@/views/SsrnmMain.vue'; 
   

export default Vue.extend({

  name: 'App',
  components: {
      SsrnmMain,     
  },  
    data: () => ({
        navItems: [
            {
                id: 0,
                link: "landing-page",
                icon: "account_balance",
                isize: "22",
            title: " - SSRNM Main"
            , header: "ATLANTIC FLEET"
        }, {
            id: 1,
                link: "",
                icon: "directions_boat",
                isize: "20",
            title: " - ATLANTIC FLEET"
            , header: "ATLANTIC FLEET"
        }, {
            id: 2,
                link: "trials-table",
                icon: "compare_arrows",
                isize: "19",
            title: " - TRIAL HISTORY"
            , header: "ATLANTIC FLEET"
        }, {
                id: 3,
                link: "asw-table",
                icon: "gps_not_fixed",
                isize: "19",
                title: " - ASW OVERVIEW"
                , header: "ATLANTIC FLEET"
        },{
                id: 4,
                link: "non-asw-table",
                icon: "invert_colors",
                isize: "19",
                title: " - NON ASW OVERVIEW"
                , header: "NON ATLANTIC FLEET"
            
        }, {
                id: 5,
                link: "search-form",
                icon: "search",
                isize: "19",
                title: " - SEARCH"
                , header: "SEARCH"
        }, {
                id: 6,
                link: "reports-list",
                icon: "line_weight",
                isize: "19",
                title: " - REPORTS LIST"
                , header: "REPORTS LIST"
        }, {
                id: 7,
                link: "last-15-trials",
                icon: "play_for_work",
                isize: "19",
                title: " - LAST 15 TRIALS"
                , header: "LAST 15 TRIALS"
        }, {
                id: 8,
                link: "contacts",
                icon: "group",
                isize: "19",
                title: " - CONTACTS"
                , header: "CONTACTS"
        }, {
                id: 9,
                link: "coming-soon",
                icon: "watch",
                isize: "19",
                title: " - COMING SOON"
                , header: "COMING SOON"
        }, {
                id: 10,
                link: "dod-notice",
                icon: "gavel",
                isize: "19",
                title: " - DOD NOTICE"
                , header: "DOD NOTICE"
        },
            //{
        //        id: 5,
        //        link: "reuse-tabs",
        //        icon: "mdi-airplane",
        //        isize: "22",
        //        title: " - reuse-tabs"
        //        , header: "reuse-tabs FLEET"
        // },
        ],
        currItem: '',
    }),
    methods: {
        navItem_onclick(item) {           
            this.currItem = item
        },
    }
});
</script>
