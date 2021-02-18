import '../../lib/marked.min.js'
import '../../lib/purify.min.js'

export const markdownEditor = {

    name: "markdown-editor",
    props: {
        readonly: {
            type: Boolean
        }
    },
    data() {
        return {
            text: ""
        }
    },
    methods: {},
    computed: {
        displayText: function () {
            return marked(this.text);
        }
    },
    mounted: function () { }
    , template: `<div>
    <div class="markdown-text" v-if="!readonly">
        <label>This control uses Markdown.&nbsp;&nbsp;</label><a href="http://www.markdownguide.org" target="_blank">What's Markdown?</a>
        <textarea placeholder="Type Markdown here" class="form-control" v-model="text" rows="4"></textarea>
    </div>
    <div class="markdown-display">
        <label>Preview Output Here</label>
        <div class="border-sm" v-html="displayText"></div>
    </div>
    </div>
`
};