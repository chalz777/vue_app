<template>
   
    <v-card @click="clicked">
        <v-card-title>
            Consent to Monitoring
        </v-card-title>

        <v-container>
            <p>
                You are accessing a U.S. Government (USG) information system (IS) that is provided for USG-authorized use only.
                By using this IS, you consent to the following conditions:
            </p>
            <p>
                The USG routinely intercepts and monitors communications on this IS for
                purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM),
                law enforcement (LE), and counterintelligence (CI) investigations. At any time, the USG may inspect and seize data stored on this IS.
                Communications using, or data stored on, this IS are not private, are subject to rouine monitoring, intereption, and search, and may be
                disclosed or used for any USG authorized purpose. This IS includes security measure (e.g., authentication and access controls) to protect
                USG interests--not for your personal benefit or privacy. Notwithstanding the above, using this ID does not constitute conent to PM, LE
                or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation
                or services by attorneys, psychotherapits, or clergy, and their assistants. Such communications and work product are private and confidential.
            </p>
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