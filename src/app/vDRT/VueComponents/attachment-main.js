import { DataAccess } from '../../js/dataAccess.js'
import { vueToast } from '../VueComponents/vue-toast.js'
Vue.use(vueToast);

Vue.filter('kb', val => {
    return Math.floor(val / 1024);
});

export const attachmentMain = {
    name: 'attachment-main',
    components: { vueToast },
    props: {
        canEdit: {
            type: Boolean
        },
        canReview: {
            type: Boolean
        },
        isAdmin: {
            type: Boolean
        },
        files: {
            type: Array
        },
        filesToUpload: {
            type: Array
        },
        isOriginator: {
            type: Boolean
        },
        userId: {
            type: Number
        }
    },
    computed: {
        uploadDisabled() {
            return this.files.length === 0;
        },
        forSignatureColumnWidth: function () {
            return this.review ? this.review.canEdit ? "35%" : "40%" : "35%";
        },
        fileNameColumnWidth: function () {
            return this.review ? this.review.canEdit ? "35%" : "40%" : "35%";
        },
        downloadColumnWidth: function () {
            return this.review ? this.review.canEdit ? "10%" : "10%" : "10%";
        },
        deleteColumnWidth: function () {
            return this.review ? this.review.canEdit ? "10%" : "0%" : "10%";
        },
        root: function () {
            return document.getElementById('drt-base-url').value;
        },
        filesDisplay: function () {
            this.files.sort(function (a, b) {
                a.createdDate - b.createdDate;
            })

            return this.filesToUpload.concat(this.files);            
        }
    },
    methods: {
        showRemoveButton: function (id) {
            var temp = 3;

            return (id === null || id === undefined) ||
                this.canEdit ||
                (this.canReview && this.userId === id);
        },
        isPermittedExtension(fileName) {
            const fileparts = fileName.split('.');
            const fname = fileparts[0];
            const fext = fileparts[fileparts.length -1];       
            
            var validExt = ["pdf", "ppt", "pptx", "pps", "ppsx", "odt", "xls", "xlsx", "jpg", "jpeg", "png", "gif", "txt", "doc", "docx"];
            var eind = validExt.indexOf(fext);
            if (eind > -1) return true;
            return false; 
       },
        mapFile(x) {
            return x => {
                x.filename = x.name;
                x.fileSize = x.size;
                x.isRoutedAttachment = false;
                x.createdDate = new Date(x.lastModified).toISOString();
                return x;
            };
        },
        mainChecked(file) {           
            var self = this;
            file.isDirty = true;
            self.$emit('checkAttachSig');          
        },
        addDroppedFile(e) {
            var self = this;
            e.preventDefault();
            let droppedFiles = e.dataTransfer.files;
            if (!droppedFiles) return;

            var mapped = [].map.call(droppedFiles, self.mapFile());
            
            if (!self.isPermittedExtension(mapped[0].filename))
                self.toast("The added file extension is not supported");
            else
                self.$emit('updateAttachment', mapped);
        },
        addTargetFile(e) {
            var self = this;
            e.preventDefault();
            let targetFiles = e.target.files;
            if (!targetFiles) return;
            
            var mapped = [].map.call(targetFiles, self.mapFile());
        
            if (!self.isPermittedExtension(mapped[0].filename))
                self.toast("The added file extension is not supported");
            else
                self.$emit('updateAttachment', mapped);
        },
        removeFile(file) {
            var self = this;
            self.$emit('deleteAttachment', file.id);
        },
        downloadFile(file) {
            var self = this;            
            return DataAccess.getAttachment(file.id)            
                .then(function (response) {                 
                    if (response) {
                    const arrayBuffer = self.base64ToArrayBuffer(response.file)
                    
                        const fileName = response.filename.substr(0, response.filename.lastIndexOf('.'));                    
                        const extension = response.filename.substr(response.filename.lastIndexOf('.') + 1);                    
                        self.createAndDownloadBlobFile(arrayBuffer, fileName, extension);
                    }
                }).catch(function (err) {
                    console.log("failed to get attachment info", err);
            });
        },
        base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64); // Comment this if not using base64
            const bytes = new Uint8Array(binaryString.length);
            return bytes.map((byte, i) => binaryString.charCodeAt(i));
        },
        createAndDownloadBlobFile(body, filename, extension) {
            const blob = new Blob([body]);
            const fileName = `${filename}.${extension}`;
            if (navigator.msSaveBlob) {
                // IE 10+
                navigator.msSaveBlob(blob, fileName);
            } else {
                const link = document.createElement('a');
                // Browsers that support HTML5 download attribute
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', fileName);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        },
        getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        },
    },
    template: `
<div>
    <div class="attachment-main" v-cloak @drop.prevent="addDroppedFile" @dragover.prevent alt="Ensure all titles match correspondence. For references, provide only the pertinent pieces if document is too large" title="Ensure all titles match correspondence. For references, provide only the pertinent pieces if document is too large">
	    <div>
			<form @submit.prevent="uploadAttachment" enctype="multipart/form-data" class="dropzone" role="form" onclick="$('#targetedFile')[0].click();">                
                <input  
                        type="file" 
                        id="targetedFile" 
                        style="display: none;" 
                        @change="addTargetFile"  
                        multiple />
                Drop files here or click to browse
            </form>

	    </div>
    </div>
    <div>
    <table v-if="filesDisplay.length > 0" id="attachmentTable" class="table attachmentTable">           
        <thead>
            <tr>
                <th width="fileNameColumnWidth">Last Modified</th>     
                <th width="fileNameColumnWidth">File Name</th>                
                <th width="forSignatureColumnWidth">For Signature</th>
                <th width="downloadColumnWidth">Download</th>
                <th width="deleteColumnWidth">Remove</th>
            </tr>
        </thead>
        <tbody v-for="(file, index) in filesDisplay" v-bind:key="index"> 
            <tr>
                <td> {{ new Date(file.createdDate).toDateString() }}</td>            
                <td>                   
                    {{ file.name }} ({{ file.size | kb }} kb)
                </td>
                <td>
                    <label class="fancy-checkbox" v-if="canEdit || canReview">
                        <input type="checkbox"
                            v-model="file.isRoutedAttachment"
                            @change="mainChecked(file)"
                            name = "mainFileCheckbox"/>

                            <i class="fa fa-check-square fa-3x checked"></i>
                            <i class="fa fa-square fa-3x unchecked"></i>
                    </label>
                    <label class="fancy-checkbox" v-else>
                            <i class="fa fa-check-square fa-3x checked" style="display: inline-block;" v-if="file.isRoutedAttachment"></i>
                            <i class="fa fa-square fa-3x unchecked" style="display: inline-block;" v-else></i>
                    </label>
                </td>
                <td><button v-if="file.id && (canReview || isOriginator || isAdmin)" class="btn btn-info" @click="downloadFile(file)" ><i class="fa fa-cloud-download" style="font-size:20px;color:white"></i></button></td>
                <td> <button v-if="showRemoveButton(file.createdById)" class="btn btn-danger" @click="removeFile(file)" > <i class="fa fa-trash" style="font-size:20px;color:white"></i></button></td>
            </tr>
        </tbody>
        </table>  

    </div>
</div>
         `
}
