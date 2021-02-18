import '../../lib/ckeditor.min.js'

export const htmlEditor = {
    name: 'html-editor',
    components: {},
    data() {
        return {
            editor: ClassicEditor,
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {
                // The configuration of the editor.
            }
        }
    },
    methods: {
        getClassicEditor: function () {
            ClassicEditor
                .create(document.querySelector('.editor-root'))
                .then(editor => {
                    // the space key doesn't seemt to wrok for some reason. 
                    // seems like an issue related to copying the code directly from the CDN
                    self.editor = editor;
                    self.editor.keystrokes.set('space', (key, stop) => {
                        self.editor.execute('input', {
                            text: ' '
                        });
                        stop();
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    mounted: function () {
        this.getClassicEditor();
    },
    beforeDestroy() {
        //this.editor.destroy()
    },
    template: `<div class="editor-root"></div>`
};