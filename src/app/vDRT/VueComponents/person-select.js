//Vue.component('v-select', VueSelect.VueSelect);
//$('#locus-base-folder').val()

export const personSelect = {
    name:'person-select',
    components: { 'v-select':VueSelect.VueSelect },
    props: {
        value: {
            type: Object
        }
    },
    data: function() {
        return {
            opts: [],
            val: this.value ? this.value : null
            //val: this.value ? { label:this.value.label, value:this.value } : null
        };
    },
    created: function() {
        if(this.val == '') {
            var user = JSON.parse(document.getElementById('current-user').getAttribute("data-user"));
            console.log('Setting to current user:',user);
            this.val = {
                label: user.FriendlyName + ' C/' + user.OrgCode + ' ' + user.Email,
                value: user
            };
        }
    },
    methods: {
        onSearch(search,loading) {
            if(search != null & search.length >= 3) {
                var url = document.getElementById('locus-base-folder').value + 'api/user/search?count=20&term=' + search;
                console.log(url);
                loading(true);
                fetch(url,{ credentials:'include'}).then(response => response.json()).then(result => {
                    console.log(result);
                    this.opts = result;
                    loading(false);
                });
            }
        },
        onInput: function(val) {
            console.log('person-select onInput',val.value);
            this.$emit('input',val.value);
        }
    },
    watch: {
        value: {
            immediate: false,
            handler: function() {
                console.log('person-select watch-value',this.value);
                this.val = new User(this.value);
            }
        }
    },
    template: `
        <v-select v-bind:options="opts" v-model="val" :filterable="false" @search="onSearch" placeholder="Type at least 3 characters to search..." @input="onInput">
        </v-select>
        `
}