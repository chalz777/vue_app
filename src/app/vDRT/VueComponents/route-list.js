import { DataAccess } from '../../js/dataAccess.js'
import { Constants } from '../../js/constants.js'
import { UserDetailObject } from './RoutedDoc.js';

Vue.use(Toasted);
export const routeList = {

    name: "route-list",

    data() {
        return {
            search: "",
            statusFilter: "",
            buttonFilter: "originated",
            items: [],
            user: new UserDetailObject(),
            isAdmin: false,
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
                'top',
            ],
        }
    },
    methods: {

        deleteItem: function (item) {
            console.log("deleteItem", item);
            var self = this;
            DataAccess.deleteRoutedDocument(item.id)
                .then(function (data) {
                    console.log("data", data);
                    self.items.splice(self.items.findIndex(x => x.id === item.id), 1);
                    self.$toasted.success("Record " + item.id + " removed");
                })
                .catch(function (err) {
                    self.$toasted.error("Failed to remove record " + item.id + ", draft status required.");
                });
        },
        row_onclick: function (value) {
            window.location = this.root + "Route?id=" + value;
        },
        getDisplayValues: function (doc) {
            return {
                "id": doc.id ? doc.id : 0,
                "status": doc.statusId ? Constants.statuses[doc.statusId] : Constants.statuses[doc.statusId],
                "orgCode": doc.orgCode ? doc.orgCode : "",
                "trackingNumber": doc.trackingNumber ? doc.trackingNumber : doc.trackingNumber,
                "createdTime": new Date(doc.createdTime).toLocaleDateString(),
                "subject": doc.subject ? doc.subject : "",
                "priority": doc.priority ? doc.priority : "",
                "dueDate": new Date(doc.deadlineDate).toLocaleDateString(),
                "documentType": doc.documentType ? doc.documentType : "",
                "serialNumber": doc.serialNumber,
                "ssic": doc.ssic ? doc.ssic : "",
                //"recommendation": "string",
                //"background": "string",
                //"piiStatus": true,
                //"signatureType": "string",
                "originator": doc.originator ? doc.originator : "",
                "reviewer": doc.reviewer ? doc.reviewer : "",
                //"discussions": [],
                //"reviews": []
                "dueDateClass": this.getDueDateClass(doc),
                "canReview": doc.canReview,
                "rowClass": this.getRowClass(doc),
                "isOriginator": doc.isOriginator
            };
        },
        getDueDateClass: function (item) {
            if ((Constants.statuses[item.statusId] !== "COMPLETE") &&
                (new Date(item.deadlineDate).getTime() < new Date().getTime())) {
                return "row-red";
            }
        },
        getRowClass: function (item) {
            if (Constants.statuses[item.statusId] === "COMPLETE") {
                return "row-green";
            }
        },
        getButtonColor: function (target) {
            return this.buttonFilter === target ? 'success' : 'primary';
        }
    },
    computed: {
        root: function () {
            return document.getElementById('drt-base-url').value;
        },
        statusOptions: function () {
            var returnMe = Object.values(Constants.statuses);
            returnMe.unshift("");
            return returnMe;

        },
        headers: function () {
            return [
                { text: "Subject", value: "subject" },
                {
                    text: "Status",
                    class: "status",
                    value: "status",
                    filter: value => {
                        if (!this.statusFilter) return true

                        return value == this.statusFilter;
                    },
                },
                { text: "Code", value: "orgCode", class: "org-code" },
                { text: "SSIC", value: "ssic", class: "ssic" },
                { text: "Serial Number", value: "serialNumber", class: "serial-number" },
                { text: "Originator", value: "originator", class: "originator" },
                { text: "Reviewer", value: "reviewer", class: "reviewer" },
                { text: "Due Date", value: "dueDate", class: "due-date", sort: function (a, b) { return new Date(a).getTime() - new Date(b).getTime(); } },
                { text: "Actions", value: "actions", class: "actions", sortable: false },
            ];
        },
        itemsDisplay: function () {
            if (this.buttonFilter === "all") {
                return this.items;
            }
            else if (this.buttonFilter === "originated") {
                return this.items.filter(i => i.isOriginator);
            }
            else if (this.buttonFilter === "reviews") {
                return this.items.filter(i => i.canReview);
            }
            else {
                return this.items.filter(i => i.isOriginator);
            }
        }

    },
    mounted: function () {
        var self = this;
        DataAccess.getRoutedDocumentList().then(function (data) {
            self.items = data.map(x => self.getDisplayValues(x));
        });
        DataAccess.getUserIsAdmin().then(function (data) {
            self.isAdmin = data;
        });
        DataAccess.getCurrentUser().then(function (data) {
            self.user = new UserDetailObject(data);
        });
    }
    , template: `
<v-app id="lasers">
	<v-card>
		<v-card-title>
                    Documents en Route
			<v-spacer/>
			<v-text-field v-model="search"
                        label="Search"
                        class="list-search"
                        single-line
                        hide-details/>
		</v-card-title>

        <div>
            <v-btn class="my-documents-button" :color="getButtonColor('originated')" @click="buttonFilter = 'originated'">My Documents</v-btn>
            <v-btn class="action-required-button" :color="getButtonColor('reviews')" @click="buttonFilter = 'reviews'">Action Required</v-btn>
            <v-btn class="all-button" :color="getButtonColor('all')" @click="buttonFilter = 'all'">All</v-btn>
        </div>

		<v-data-table  :headers="headers"
                              :items="itemsDisplay"
                              :search="search"
                              item-key="id"
                              @click:row="row_onclick"
                              class="route-list-table">

			<template v-slot:header.status>
				<span>
					<v-select
                            :items="statusOptions"
                            label="Status"
                            class="status-filter-select"
                            v-model="statusFilter">
					</v-select>
				</span>
			</template>

			<template v-slot:body="{ items }">
				<tbody>
					<tr @click="row_onclick(item.id)" class="pointer" :class="item.rowClass" v-for="item in items" :key="item.id">
						<td class="rimpy">{{ item.subject }}</td>
						<td class="status">{{ item.status }}</td>
						<td class="org-code">{{ item.orgCode }}</td>
						<td class="ssic">{{ item.ssic }}</td>
						<td class="serial-number">{{ item.serialNumber }}</td>
						<td class="originator">{{ item.originator }}</td>
						<td class="reviewer">{{ item.reviewer }}</td>
						<td class="due-date" :class="item.dueDateClass">{{ item.dueDate }}</td>
                        <td><v-icon v-if="isAdmin || item.isOriginator"small @click.stop="deleteItem(item)">mdi-delete</v-icon></td>
					</tr>
				</tbody>
			</template>
		</v-data-table>
	</v-card>
</v-app>
`
};