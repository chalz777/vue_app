//import { tabGroup } from '../VueComponents/tab-group.js'
//import { travelerInfo } from '../VueComponents/traveler-info.js'
//import { tripDetail } from '../VueComponents/trip-detail.js'
//import { tripInfo } from '../VueComponents/trip-info.js'
//import { flightDetails } from '../VueComponents/flight-details.js'
//import { tripSummary } from '../VueComponents/trip-summary.js'
//import { vueServer } from '../VueComponents/vue-server.js'
import { routeInfo } from './route-info.js'
import { attachmentMain } from './attachment-main.js'
import { DataAccess } from '../../js/dataAccess.js'
import { PersistRoutedDocumentObject, RoutedDocumentObject, ReviewDetailObject } from '../VueComponents/RoutedDoc.js'

Vue.use(Toasted);
//Vue.use(vueServer);

var router = new VueRouter({
    mode: 'history',
    routes: []
});
window.vm = new Vue({
    vuetify: new Vuetify(),
    router,
    el: '#app',
    components: { routeInfo, attachmentMain },
    data: function () {
        return {
            showSubmit: false,
            isLoading: false,
            isAdmin: false,
            showSave: false
        }
    },
    methods: {
        goToListPage: function () {
            var root = document.getElementById('drt-base-url').value;
            window.location = root;
        },

        approve: function () {
            var routedDocument = vm.$refs.routeInfo;
            var self = this;

            if (routedDocument.$v.$invalid) {
                self.$toasted.error("Cannot submit with errors.");
            }
            else {
                self.isLoading = true;
                return self.persist().then(function (result) {
                    if (result) {
                        return DataAccess.approveRoutedDocument(routedDocument.request.id)
                            .then(function (result) {
                                routedDocument.request = new RoutedDocumentObject(result);
                                routedDocument.submitted = true;
                                self.isLoading = false;
                                self.$toasted.success("Routed Document has been submitted.");
                                self.goToListPage();
                            })
                            .catch(function (err) {
                                self.isLoading = false;
                                self.$toasted.error("Error submitting Routed Document.  " + err.statusText);
                                return null;
                            });
                    } else {
                        self.isLoading = false;
                        self.$toasted.error("Error submitting Routed Document.  Attachment upload failed.  Make sure the file has the correct extension and is not empty.");
                    }
                }).catch(function (err) {
                    self.isLoading = false;
                    self.$toasted.error("Error submitting Routed Document.  " + err.statusText);
                    return null;
                });
            }
        },
        create: function (routedDocument) {
            var routedDocument = vm.$refs.routeInfo;
            var self = this;
            self.isLoading = true;

            return DataAccess.saveRoutedDocument(new PersistRoutedDocumentObject(routedDocument.request))
                .then(function (result) {
                    var attachments = routedDocument.request.attachments;
                    routedDocument.request = new RoutedDocumentObject(result);
                    routedDocument.request.attachments = attachments;
                    return routedDocument.request
                })
                .then(function (request) {
                    return self.$refs.routeInfo.uploadAttachments(request);
                })
                .then(function (attachmentResult) {
                    self.isLoading = false;

                    self.$toasted.success("New Routed Document has been created.");
                    return attachmentResult;
                })
                .fail(function (err) {
                    self.isLoading = false;
                    console.log("DataAccess.saveRoutedDocument fail", err);
                })
                .catch(function (err) {
                    self.isLoading = false;
                    self.$toasted.error("Error creating Routed Document.  " + err.statusText);
                    return null;
                });
        },
        update: function (routedDocument) {
            var self = this;
            var routedDocument = vm.$refs.routeInfo;
            self.isLoading = true;

            return DataAccess.updateRoutedDocument(routedDocument.request.id, new PersistRoutedDocumentObject(routedDocument.request))
                .then(function (result) {
                    var attachments = routedDocument.request.attachments;
                    routedDocument.request = new RoutedDocumentObject(result);
                    routedDocument.request.attachments = attachments;
                    return routedDocument.request;
                })
                .then(function (request) {
                    return self.$refs.routeInfo.uploadAttachments(request);
                })
                .then(function (request) {
                    self.isLoading = false;
                    self.$toasted.success("Routed Document ID:" + routedDocument.request.id + " has been updated.");
                    return request;
                })
                .catch(function (err) {
                    self.isLoading = false;
                    self.$toasted.error("Error updating Routed Document.  " + err.statusText);
                    return null;
                });
        },
        persist: function (event) {
            var self = this;
            var routedDocument = vm.$refs.routeInfo;
            routedDocument.$v.$touch();

            if (routedDocument.request.id) {
                return self.update(routedDocument);
            }
            else {
                return self.create(routedDocument);
            }
        },
        setupValidation: function () {
            this.$nextTick(() => {
                var routedDocument = vm.$refs.routeInfo;
                routedDocument.$v.$touch();

                if (routedDocument.$v.$invalid) {
                    return;
                }
            });
        },
        setupTutorial: function () {
            var tutorial = new Tutorial("document",
                [
                    {
                        selector: ".save-button",
                        description: "message",
                        before: function () { },
                        after: function () { }
                    }

                ]).getInstance();

            $("#tutorial").click(function () {
                tutorial.start();
            });
        },
        canSubmit: function () {
            var routedDocument = this.$refs.routeInfo;
            this.showSubmit = routedDocument &&
                routedDocument.request.canEdit &&
                (routedDocument.request.statusId == 1) &&
                routedDocument.request.reviews.some(x => x.decision === 2);

            this.showSave = routedDocument &&
                routedDocument.request.canEdit || routedDocument.request.canReview;
        },
        showIntro: function () {
            var self = this;
            var routedDocument = vm.$refs.routeInfo;
            routedDocument.request = new RoutedDocumentObject();
            routedDocument.request.attachments.push({
                file: ""
                , routedDocumentId: 0
                , name: "Intro"
                , createdDate: new Date().toISOString()
                , size: 1337
                , isRoutedAttachment: true
                , createdById: 0
                , active: 1
                , id: 0
            });

            routedDocument.request.canReview = true;
            routedDocument.request.reviewerId = 1337;

            routedDocument.request.reviews.push(
                {
                    comment: "You're great!"
                    , decision: 1
                    , id: 0
                    , lastModifiedTime: new Date().toISOString()
                    , orderNumber: 0
                    , routedDocumentId: 0
                    , user: {
                        active: true
                        , edipi: 0
                        , email: "testuser@navy.mil"
                        , firstName: ""
                        , friendlyName: "First Reviewer"
                        , id: 0
                        , lastName: ""
                        , middleName: ""
                        , orgCode: "01"
                        , personnelNumber: 0
                        , username: 0
                        , uwUserId: 0
                    }
                    , userId: 0
                }
            );
            routedDocument.request.reviews.push({
                comment: "You did it wrong."
                , decision: 0
                , id: 1
                , lastModifiedTime: new Date().toISOString()
                , orderNumber: 1
                , routedDocumentId: 0
                , user: {
                    active: true
                    , edipi: 0
                    , email: "anothertestuser@navy.mil"
                    , firstName: ""
                    , friendlyName: "Second Reviewer"
                    , id: 0
                    , lastName: ""
                    , middleName: ""
                    , orgCode: "01"
                    , personnelNumber: 0
                    , username: 0
                    , uwUserId: 0
                }
                , userId: 0
            });
            routedDocument.request.reviews.push({
                comment: ""
                , decision: 2
                , id: 2
                , lastModifiedTime: new Date().toISOString()
                , orderNumber: 2
                , routedDocumentId: 0
                , user: {
                    active: true
                    , edipi: 0
                    , email: "yetanothertestuser@navy.mil"
                    , firstName: ""
                    , friendlyName: "Third Reviewer"
                    , id: 0
                    , lastName: ""
                    , middleName: ""
                    , orgCode: "01"
                    , personnelNumber: 0
                    , username: 0
                    , uwUserId: 0
                }
                , userId: 1337
            });
        },
        hideIntro: function () {
            var self = this;
            $(".new-form-button").click();
        }
    },
    watch: {
    },
    mounted: function () {
        var self = this;

        self.setupValidation();
        self.canSubmit();
        DataAccess.getUserIsAdmin().then(function (result) {
            self.isAdmin = result;
        });
    },
    template: `
<v-app id="lasers">
	<v-overlay :value="isLoading" z-index="9999">
		<v-progress-circular indeterminate size="64"></v-progress-circular>
	</v-overlay>

	<div class="route-info mt-5">
		<div class="text-center">
			<h1>Route Correspondence</h1>
		</div>
	
			<nav class="navbar navbar-expand-sm sticky-top navbar-light bg-light fixed-top-2" data-intro="Click the save button to save your document on the server.  Click the Submit button to send it to the reviewers.">
				<div class="container" v-if="showSave">
					<button @click="persist" :disabled="isLoading" class="btn btn-primary btn-lg btn-block save-button">
						<i class="fa fa-save" style="font-size:20px;color:white"/>&nbsp;&nbsp;Save</button>
				</div>   
				<div class="container" v-if="showSubmit"> 
					<button @click="approve" class="btn btn-primary btn-lg btn-block submit-button">
						<i class="fa fa-check" style="font-size:20px;color:white"/>&nbsp;&nbsp;Submit</button>
				</div>   
          
			</nav>
		
		<route-info ref="routeInfo" @canSubmit="canSubmit" :is-admin="isAdmin"/>
	</div>
</v-app>
`
});


