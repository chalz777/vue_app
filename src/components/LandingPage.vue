<template>
    <v-card>
        <v-container>
            <p>
                Complete the
                <a href="secure/new_user.asp" target="_blank">registration</a>
                to gain access to documents on this site.
            </p>

            <p class="app-info">
                This site provides current U.S Navy Fleet and individual ship information in regard to the Surface Ship Radiated Noise Measurement Program(SSRNM). The Atlantic Fleet and Pacific Fleet Tracking Tables for ASW and Non-ASW assets provide, with respect to the fleet command and ship name,the last SSRNM date and years since last test in a descending order. The Atlantic Fleet and Pacific Fleet Trial Schedule Tables provide a historical view of SSRNM occurences. The Database search utility contains a searchable form display of the SSRNM tracking database. Numerous selectable search &amp; sort options are available.
            </p>

            <p>
                <a href="content/section508.html" target="_blank"> Accessibility/Section 508</a>
            </p>
            <!--<trial-reports-table :reports="reports" />-->
        </v-container>
    </v-card>
</template>

<script lang="ts">

    import Vue from 'vue'
    import * as DataAccess from '../assets/js/dataAccess'
    export default Vue.extend({
        name: "landing-page",
        data() {
            return {
                reports: []
            }
        },
        //components: {
        //    "trial-reports-table": last15TrialReports
        //},
        methods: {
            getReports: function () {                
                return [{
                        hull: "hull"
                        , name: "name"
                        , date: new Date(0)
                        , ext: "pdf"
                    },
                    {
                        hull: "hull2"
                        , name: "name2"
                        , date: new Date(0)
                        , ext: "pdf"
                    },
                    {
                        hull: "hull3"
                        , name: "name3"
                        , date: new Date(0)
                        , ext: "pdf"
                    },
                    {
                        hull: "hull4"
                        , name: "name4"
                        , date: new Date(0)
                        , ext: "pdf"
                    },
                    {
                        hull: "hull5"
                        , name: "name5"
                        , date: new Date(0)
                        , ext: "pdf"
                    }
                ];
            }

        },
       
        mounted: function () {
            (this as any).reports = this.getReports();
        }

    })

</script>
<style scoped>
</style>