<template>
    <div class="text-center">
        <v-btn dark
               color="orange darken-2"
               @click="snackbar = true">
            Open Snackbar
        </v-btn>

        <v-snackbar v-model="snackbar"
                    :timeout="timeout">
                    {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="blue"
                       text
                       v-bind="attrs"
                       @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default Vue.extend({
        name: "asw-table",
        data() {
            return {
                snackbar: false,
                text: 'My timeout is set to 2000.',
                timeout: 2000,
            }
        },
        //props: {
        //    type: {
        //        type: String,
        //    },
        //},
        //methods: {
        //    showAlert(inType) {
        //        this.alertType = inType

        //        const timer = (this as any).showAlert.timer
        //        if (timer) {
        //            clearTimeout(timer)
        //        }
        //        (this as any).showAlert.timer =
        //            setTimeout(() => {
        //                this.alertType = null
        //            }
        //                , 3000)

        //        this.elapse = 1;
        //        const t = this.showAlert.t
        //        if (t) {
        //            clearInterval(t)
        //        }

        //        this.showAlert.t = setInterval(() => {
        //            if (this.elapse === 3) {
        //                this.elapse = 0
        //                clearInterval(this.showAlert.t)
        //            }
        //            else {
        //                this.elapse++
        //            }
        //        }, 1000)
        //    },
        //},

    })

</script>

<style scoped>
</style>