
// import { DataAccess } from '../../js/dataAccess.js'
// import { UserDetailObject } from '../../js/common.js'
// import { vueToast } from '../VueComponents/vue-toast.js'
// import { attachmentList } from '../VueComponents/attachment-list.js'

// import { DataAccess } from '../../js/dataAccess.js'
// import { Constants } from '../../js/constants.js'
// import { DateTimeFromTime, UserDetailObject, AttachmentObject, formatDate, getMinutesDifference, getCurrentUser, waitForDOM } from '../../js/common.js'
Vue.use(Vuetify);
//import Vue from 'vue'

const attachmentList = {
	name: "ssrnm-main",
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
			]
		}
	},
	props: {
		files: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
	},
	methods: {
		deleteItem: function (item) {
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
		row_onclick: function (e) {
			console.log(e, " was clicked");
		}
	},
	computed: {
		root: function () {
			return document.getElementById('App-base-url').value;
		},
		headers: function () {
			return [{
					text: "File Name",
					value: "filename"
				}, {
					text: "Created By",
					value: "createdBy",
					"class": "created-by"
				}, {
					text: "Upload Date",
					value: "createdDate",
					"class": "created-date",
					sort: function (a, b) {
						return new Date(a).getTime() - new Date(b).getTime();
					}
				}, {
					text: "Actions",
					value: "actions",
					"class": "actions",
					sortable: false
				},
			];
		},
		itemsDisplay: function () {
			var self = this;
			if (self.files.filter) {
				return self.files.filter(i => i.filename.toLowerCase().indexOf(self.search.toLowerCase()) > -1);
			} else {
				return [];
			}
		}
	},
	mounted: function () {
		var self = this;
		DataAccess.getUserIsAdmin().then(function (data) {
			self.isAdmin = data;
		});
		DataAccess.getCurrentUser().then(function (data) {
			self.user = new UserDetailObject(data);
		});
	},
	template: `
		<v-card>
			<v-card-title>
                    Files
				<v-spacer/>
				<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
			</v-card-title>

			<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

				<template v-slot:body="{ items }">
					<tbody>
						<tr @click="row_onclick(item.id)" class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
							<td class="file-name">{{ item.filename }}</td>
							<td class="originator">{{ item.createdBy }}</td>
							<td class="upload-date" :class="item.uploadDateClass">{{ item.createdDate }}</td>
							<td>
								<v-icon class="delete-button" small @click.stop="deleteItem(item)">X</v-icon>
							</td>
						</tr>
					</tbody>
				</template>
			</v-data-table>
		</v-card>
	`
};

const attachmentMain = {
	name: 'attachment-main',
	data: function () {
		return {
			uploadMe: null,
			search: "",
			files: [],
			user: new UserDetailObject(),
		};
	},
	components: {
		attachmentList
	},
	computed: {
		uploadDisabled() {
			return this.files.length === 0;
		},
		root: function () {
			return document.getElementById('App-base-url').value;
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
			return (id === null || id === undefined) ||
			this.canEdit ||
			(this.canReview && this.userId === id);
		},
		isPermittedExtension(fileName) {
			const fileparts = fileName.split('.');
			const fname = fileparts[0];
			const fext = fileparts[fileparts.length - 1];

			var validExt = ["pdf", "ppt", "pptx", "pps", "ppsx", "odt", "xls", "xlsx", "jpg", "jpeg", "png", "gif", "txt", "doc", "docx"];
			var eind = validExt.indexOf(fext);
			if (eind > -1)
				return true;
			return false;
		},
		addDroppedFile(e) {
			var self = this;

			e.preventDefault();

			let droppedFiles = e.dataTransfer.files;

			if (!droppedFiles) {
				return;
			}

			self.addFiles(droppedFiles);
		},
		addTargetFile(e) {
			var self = this;

			e.preventDefault();

			let targetFiles = e.target.files;

			if (!targetFiles) {
				return;
			}

			self.addFiles(targetFiles);
		},
		addFiles(files) {
			files.forEach(function (x) {
				if (!self.isPermittedExtension(x.filename)) {
					self.toast("The added file extension is not supported");
				} else {
					self.$emit('updateAttachment', x);
				}
			});
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
			})
			.catch(function (err) {
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
			if (parts.length == 2) {
				return parts.pop().split(";").shift();
			}
		},
		uploadAttachment: function () {
			var file = document.querySelector("#fu").files[0];

			DataAccess.saveAttachment(file)
			.then(function (response) {
				//console.log("attachment upload response", response);
			});
		},
		getList: function () {
			var self = this;
			DataAccess.getAttachments()
			.then(function (data) {
				//console.log(data);
				self.files = JSON.parse(data);
			});
		}

	},
	mounted: function () {
		this.getList();
	},
	template: `
				<v-main>
					<v-app-bar dark flat app>
						<h1>ACCM File Utility</h1>
					</v-app-bar>
					<v-label>Upload</v-label>
					<v-file-input id="fu"/>
					<v-btn @click="uploadAttachment">Upload</v-btn>

					<attachment-list :files="files"/>

					<v-footer>
						<div class="container">
							<img src="Images/NAVSEA_Keyport_Logo.png">
            &nbsp
            &copy; 2020 - ACCM File Utility - <a asp-area="" asp-controller="Home" asp-action="Privacy">Privacy</a>
							</div>
						</v-footer>
					</v-main>
	`
}

const last15TrialReports = {
	name: "trial-reports-table",
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
			]
		}
	},
	props: {
		reports: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
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
			return document.getElementById('App-base-url').value;
		},
		headers: function () {
			return [{
					text: "hull",
					value: "hull"
				}, {
					text: "date",
					value: "reportDate",
					"class": "report-date"
				}, {
					text: "report name",
					value: "reportName",
					"class": "report-name",
					sort: function (a, b) {
						return new Date(a).getTime() - new Date(b).getTime();
					}
				}, {
					text: "ext",
					value: "ext",
					"class": "ext",
					sortable: false
				},
			];
		},
		itemsDisplay: function () {
			var self = this;
			if (self.reports.sort) {
				return self.reports.sort((a, b) => {
					return a - b;
				});
			} else {
				return [];
			}
		}
	},
	mounted: function () {
	},
	template: `
				<v-card>
					<v-card-title>
                    Last 15 Trial Reports
						<v-spacer/>
						<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
					</v-card-title>

					<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

						<template v-slot:body="{ items }">
							<tbody>
								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
									<td class="hull">{{ item.hull }}</td>
									<td class="date">{{ item.date }}</td>
									<td class="report-name" :class="item.uploadDateClass">{{ item.name }}</td>
									<td class="ext">{{ item.ext }}</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card>
	`
};

const ReportsList = {
	name: "reports-list",
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
			]
		}
	},
	props: {
		reports: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
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
			return document.getElementById('App-base-url').value;
		},
		headers: function () {
			return [{
					text: "hull",
					value: "hull"
				}, {
					text: "date",
					value: "reportDate",
					"class": "report-date"
				}, {
					text: "Unclass Message",
					value: "message",
					"class": "message"
				}, {
					text: "Quicklook",
					value: "quicklook",
					"class": "quicklook"
				}, {
					text: "report name",
					value: "reportName",
					"class": "report-name",
					sort: function (a, b) {
						return a - b;
					}
				}, {
					text: "ext",
					value: "ext",
					"class": "ext",
					sortable: false
				},
			];
		},
		itemsDisplay: function () {
			var self = this;
			if (self.reports.sort) {
				return self.reports.sort((a, b) => {
					return a - b;
				});
			} else {
				return [];
			}
		}
	},
	mounted: function () {
	},
	template: `
				<v-card>
					<v-card-title>
                    Last 15 Trial Reports
						<v-spacer/>
						<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
					</v-card-title>

					<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

						<template v-slot:body="{ items }">
							<tbody>
								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
									<td class="hull">{{ item.hull }}</td>
									<td class="date">{{ item.date }}</td>
									<td class="report-name" :class="item.uploadDateClass">{{ item.name }}</td>
									<td class="ext">{{ item.ext }}</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card>
	`
};

const NonAswTable = {
	name: "non-asw-table",
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
			]
		}
	},
	props: {
		reports: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
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
			return document.getElementById('App-base-url').value;
		},
		headers: function () {
			return [{
					text: "ship",
					value: "ship"
				}, {
					text: "years",
					value: "years",
					"class": "years"
				}, {
					text: "date",
					value: "reportDate",
					"class": "report-date"
				}, {
					text: "Message",
					value: "message",
					"class": "message"
				}, {
					text: "report name",
					value: "reportName",
					"class": "report-name",
					sort: function (a, b) {
						return a - b;
					}
				},
			];
		},
		itemsDisplay: function () {
			var self = this;
			if (self.reports.sort) {
				return self.reports.sort((a, b) => {
					return a - b;
				});
			} else {
				return [];
			}
		}
	},
	mounted: function () {
	},
	template: `
				<v-card>
					<v-card-title>
                    Non ASW Overview
						<v-spacer/>
						<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
					</v-card-title>

					<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

						<template v-slot:body="{ items }">
							<tbody>
								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
									<td class="ship">{{ item.ship }}</td>
									<td class="years">{{ item.years }}</td>
									<td class="date">{{ item.date }}</td>
									<td class="message">{{ item.message }}</td>
									<td class="report-name" :class="item.uploadDateClass">{{ item.name }}</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card>
	`
};

const AswTable = {
	name: "asw-table",
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
			]
		}
	},
	props: {
		reports: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
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
			return document.getElementById('App-base-url').value;
		},
		headers: function () {
			return [{
					text: "Status",
					value: "status",
					"class": "status"
				}, {
					text: "Hull",
					value: "hull",
					"class": "hull"
				}, {
					text: "Ship",
					value: "ship",
					"class": "ship"
				}, {
					text: "Months",
					value: "months",
					"class": "months"
				}, {
					text: "Date",
					value: "reportDate",
					"class": "report-date"
				}, {
					text: "Report name",
					value: "reportName",
					"class": "report-name",
					sort: function (a, b) {
						return a - b;
					}
				},
			];
		},
		itemsDisplay: function () {
			var self = this;
			if (self.reports.sort) {
				return self.reports.sort((a, b) => {
					return a - b;
				});
			} else {
				return [];
			}
		}
	},
	mounted: function () {
	},
	template: `
				<v-card>
					<v-card-title>
                    ASW Overview
						<v-spacer/>
						<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
					</v-card-title>

					<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

						<template v-slot:body="{ items }">
							<tbody>
								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
									<td class="hull">{{ item.hull }}</td>
									<td class="date">{{ item.date }}</td>
									<td class="report-name" :class="item.uploadDateClass">{{ item.name }}</td>
									<td class="ext">{{ item.ext }}</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card>
	`
};

const TrialsTable = {
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
			]
		}
	},
	props: {
		items: {
			type: Array,
			required: true,
		default:
			function () {
				return [];
			}
		}
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
			return document.getElementById('App-base-url').value;
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
			var self = this;
			if (self.items.sort) {
				return self.items.sort((a, b) => {
					return a - b;
				});
			} else {
				return [];
			}
		}
	},
	mounted: function () {
	},
	template: `
				<v-card>
					<v-card-title>
                    Trial Reports
						<v-spacer/>
						<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
					</v-card-title>

					<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              class="route-list-table">

						<template v-slot:body="{ items }">
							<tbody>
								<tr  class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
									<td class="ship">{{ item.ship }}</td>
									<td class="date">{{ item.date }}</td>
									<td class="site">{{ item.site }}</td>
									<td class="comments">{{ item.comments }}</td>
								</tr>
							</tbody>
						</template>
					</v-data-table>
				</v-card>
	`
};

const contacts = {
	name: "app-contacts",
	data() {
		return {
		}
	},
	template: `
				<v-card>
					<v-card-title>
                    Contact Info
					</v-card-title>

					<v-container>
						<div class="flex">
							<div class="margin-sm">
								<div>SSRNM Programmatic Contact</div>
								<div>Neal Prater</div>
								<div>NAVSEA ASW Range Program Manager</div>
								<div>(SEA05E18)</div>
								<div>360-315-3413</div>
								<div>neal.prater@navy.mil</div>
							</div>

							<div class="margin-sm">
								<div>Technical/WebSite Contact</div>
								<div>NUWC Keyport Code 1042</div>
								<div>610 Dowell Street</div>
								<div>Keyport, WA 98345</div>
								<div>Voice: 360-315-7840</div>
								<div>james.gooder@navy.smil.mil</div>
								<div>james.gooder@navy.mil</div>
							</div>
						</div>
					</v-container>
				</v-card>
	`
};

const comingSoon = {
	name: "coming-soon",
	data() {
		return {
		}
	},
	template: `
				<v-card>
					<v-card-title>
                    Coming Soon
					</v-card-title>
				</v-card>
	`
};

const searchForm = {
	name: "search-form",
	data() {
		return {
			statuses: [],
			fleets: [],
			sites: [],
			classes: [],
			hulls: []
		}
	},
	template: `
<v-card>
	<v-card-title>
        Query
	</v-card-title>

	<v-container>
		<v-menu>
			<template v-slot:activator="{on, attrs}">
				<v-btn>
						Status
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="(item, index) in statuses" :key="index">
				</v-list-item>
			</v-list>
		</v-menu>
		<v-menu>
			<template v-slot:activator="{on, attrs}">
				<v-btn>
						Fleet
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="(item, index) in fleets" :key="index">
				</v-list-item>
			</v-list>
		</v-menu>
		<v-menu>
			<template v-slot:activator="{on, attrs}">
				<v-btn>
						Site
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="(item, index) in sites" :key="index">
				</v-list-item>
			</v-list>
		</v-menu>
		<v-menu>
			<template v-slot:activator="{on, attrs}">
				<v-btn>
						Class
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="(item, index) in classes" :key="index">
				</v-list-item>
			</v-list>
		</v-menu>
		<v-menu>
			<template v-slot:activator="{on, attrs}">
				<v-btn>
						Hull Id
				</v-btn>
			</template>
			<v-list>
				<v-list-item v-for="(item, index) in hulls" :key="index">
				</v-list-item>
			</v-list>
		</v-menu>
	</v-container>
	<v-container>
		<v-btn>Search</v-btn>
	</v-container>
	
</v-card>
`
};

const dodNotice = {
	name: "dod-notice",
	data() {
		return {
		}
	},
	methods:{
		clicked: function(){
			this.emit("clicked");
		}
	},
	template: `
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
	`
};

const landingPage = {
	name: "landing-page",
	data() {
		return {
			reports: []
		}
	},
	components:{
		"trial-reports-table": last15TrialReports
	},
	methods:{
		getReports: function(){
			this.reports = [

			{
			hull:"hull"
			,name:"name"
			,date:new Date(0)
			,ext: "pdf"
			},
			{
			hull:"hull2"
			,name:"name2"
			,date:new Date(0)
			,ext: "pdf"
			},
			{
			hull:"hull3"
			,name:"name3"
			,date:new Date(0)
			,ext: "pdf"
			},
			{
			hull:"hull4"
			,name:"name4"
			,date:new Date(0)
			,ext: "pdf"
			},
			{
			hull:"hull5"
			,name:"name5"
			,date:new Date(0)
			,ext: "pdf"
			}
			];
		}

	},
	template: `
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
						<trial-reports-table :reports="reports"/>
					</v-container>
				</v-card>
	`
	,mounted: function(){
		this.getReports();
	}
};


new Vue({
	el: "#vue",
	vuetify: new Vuetify({
		theme: {
			dark: true
		}
	}),
	components:{
		"coming-soon": comingSoon,
		"dod-notice": dodNotice,
		"app-contacts": contacts,
		"landing-page":landingPage,
		"trial-reports-table":last15TrialReports,
		"trials-table":TrialsTable,
		"asw-table":AswTable,
		"non-asw-table":NonAswTable
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
					,header: "ATLANTIC FLEET"
				}, {
					id: 1,
					link: "",
					title: "ATLANTIC FLEET"
					,header: "ATLANTIC FLEET"
				}, {
					id: 2,
					link: "trials-table",
					title: " - TRIAL HISTORY"
					,header: "ATLANTIC FLEET"
				}, {
					id: 3,
					link: "asw-table",
					title: " - ASW OVERVIEW"
					,header: "ATLANTIC FLEET"
				}, {
					id: 4,
					link: "non-asw-table",
					title: " - NON ASW OVERVIEW"
					,header: "ATLANTIC FLEET"
				}, {
					id: 5,
					link: "coming-soon",
					title: " - AUTEC RANGE INFO"
					,header: "ATLANTIC FLEET"
				}, {
					id: 6,
					link: "coming-soon",
					title: " - REPORT DISTRIBUTION"
					,header: "ATLANTIC FLEET"
				}, {
					id: 7,
					link: "coming-soon",
					title: " - EMAIL LIST"
					,header: "ATLANTIC FLEET"
				}, {
					id: 8,
					link: "",
					title: "PACIFIC FLEET"
					,header: "PACIFIC FLEET"
				}, {
					id: 9,
					link: "trials-table",
					title: " - TRIAL HISTORY"
					,header: "PACIFIC FLEET"
				}, {
					id: 10,
					link: "asw-table",
					title: " - ASW OVERVIEW"
					,header: "PACIFIC FLEET"
				}, {
					id: 11,
					link: "non-asw-table",
					title: " - NON ASW OVERVIEW"
					,header: "PACIFIC FLEET"
				}, {
					id: 12,
					link: "coming-soon",
					title: " - SCUIR RANGE INFO"
					,header: "PACIFIC FLEET"
				}, {
					id: 13,
					link: "coming-soon",
					title: " - REPORT DISTRIBUTION"
					,header: "PACIFIC FLEET"
				}, {
					id: 14,
					link: "coming-soon",
					title: " - EMAIL LIST"
					,header: "PACIFIC FLEET"
				}, {
					id: 15,
					link: "coming-soon",
					title: "PROGRAM INFO"
					,header: "PACIFIC FLEET"
				}, {
					id: 16,
					link: "coming-soon",
					title: "DOCUMENTS"
					,header: "PACIFIC FLEET"
				}, {
					id: 17,
					link: "coming-soon",
					title: "SS ACOUSTIC TOPICS"
					,header: "PACIFIC FLEET"
				}, {
					id: 18,
					link: "coming-soon",
					title: "PM/OP CHECK"
					,header: "PACIFIC FLEET"
				}, {
					id: 19,
					link: "coming-soon",
					title: "SSRNM CRITERIA"
					,header: "PACIFIC FLEET"
				}, {
					id: 20,
					link: "coming-soon",
					title: "FY REPORTS"
					,header: "PACIFIC FLEET"
				}, {
					id: 21,
					link: "coming-soon",
					title: "AUTEC INFO"
					,header: "PACIFIC FLEET"
				}, {
					id: 22,
					link: "coming-soon",
					title: "SCUIR INFO"
					,header: "PACIFIC FLEET"
				}, {
					id: 23,
					link: "coming-soon",
					title: "FY END REPORTS"
					,header: "PACIFIC FLEET"
				}, {
					id: 24,
					link: "app-contacts",
					title: "CONTACTS"
					,header: "PACIFIC FLEET"
				}, {
					id: 25,
					link: "coming-soon",
					title: "DATABASE"
					,header: "PACIFIC FLEET"
				}, {
					id: 26,
					link: "coming-soon",
					title: "SHIP DETAILS"
					,header: "Ship Details"
				}, {
					id: 27,
					link: "coming-soon",
					title: "SSRNM Trials"
					,header: "Trials"
				}, {
					id: 28,
					link: "coming-soon",
					title: "Users"
					,header: "Users"
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
	mounted: function(){
		var self = this;

		Vue.nextTick().then(function(){
			self.isNoticeRendered = true;
		});
	}
});
