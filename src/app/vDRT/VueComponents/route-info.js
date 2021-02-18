import { Constants } from '../../js/constants.js'
import { waitForDOM, generateGuid } from '../../js/helper.js'
import { DataAccess } from '../../js/dataAccess.js'
import { DateTimeFromTime, PersistRoutedDocumentObject, RoutedDocumentObject, ReviewDetailObject, UserDetailObject, RouteObject, RouteTemplateObject } from '../VueComponents/RoutedDoc.js'
import { attachmentMain } from './attachment-main.js'
import { markdownEditor } from './markdown-editor.js'
import { htmlEditor } from './html-editor.js'
import { vueValidityState } from './vue-validity-state.js'
import draggable from './draggable/vuedraggable.js'



Vue.use(Toasted, {
    position: "top-right"
    , duration: 3000
});
Vue.use(window.vuelidate.default)
var required = window.validators.required
var minLength = window.validators.minLength
Vue.component('vuedraggable', draggable)

export const routeInfo = {
    name: 'route-info',
    props: {
        value: {
            type: Object
        }
        , isAdmin: {
            type: Boolean
        }
    },
    components: { Toasted, vueValidityState, draggable, RoutedDocumentObject, ReviewDetailObject, attachmentMain, markdownEditor, htmlEditor},
    data: function () {
        return {
            allUsers: [],
            altObject: null,
            attachmentsToUpload: [],
            currentComment: "",
            confFunc: "",
            confirm: false,
            date: null,
            dialog: false,
            drag: false,
            emptyRequired: false,
            enabled: true,
            isLoading: false,
            menu2: false,
            menu: false,
            modal: false,
            rUser: null,
            request: this.value ? this.value : new RoutedDocumentObject(),
            routes: [],
            routeId: this.$route.query.id ? this.$route.query.id : '',
            search: null,
            overlay: false,
            acheck: false
        }
    },
    watch: {
        request: {
            handler: function () {
                this.$emit("canSubmit");
            },
            deep: true
        },
        search(query) {
            this.querySelections(query);
        },
        date(date) {
            this.request.deadlineDate = date ? date.toString() : null;
        },
        overlay(val) {
            val && setTimeout(() => {
                this.overlay = false
            }, 3000)
        }
    },
    created: function () {
        this.getData();
    },
    validations: {
        request: {
            signatureType: {
                required: required,
            },
            orgCode: {
                required: required
            },
            serialNumber: {
                required: required
            },
            documentType: {
                required: required
            },
            ssic: {
                required: required
            },
            subject: {
                required: required
            },
            background: {
                required: required
            },
            recommendation: {
                required: required
            },
            reviews: {
                required: required,
                minLength: minLength(1)
            },
            attachments: {
                oneAttachment() {
                    return (this.attachmentsToUpload.length + this.request.attachments.length) > 0;
                },
                oneSigCB() {
                    return this.acheck;
                }
            }
        }
    },
    methods: {
        getData: function () {
            var self = this;
            //DataAccess.getUsers()
            //	.then(function (result) {
            //		self.allUsers = result;
            //		self.count = result.length;
            //	})
            //	.catch(function (err) {
            //		console.log("failed to get users", err);
            //	});

            self.getRoutes();

            if (self.routeId) {
                return DataAccess.getRoutedDocument(this.routeId)
                    .then(function (result) {
                        self.request = new RoutedDocumentObject(result);
                        self.date = new Date(self.request.deadlineDate).toLocaleDateString();
                        self.checkAttachSig();
                        self.isLoading = false;
                        self.overlay = !self.overlay
                    })
                    .then(function (request) {
                        self.$emit("canSubmit");
                    })
                    .catch(function (err) {
                        console.log("failed to get document info", err);
                        return null;
                    });
            }
        },
        reorderModal: function () {
            var self = this;
            waitForDOM(document, "div.v-dialog__content.v-dialog__content--active", null, handler, new Date().getTime() + 2000);

            function handler() {
                self.$nextTick(function () {
                    document.querySelector("div.v-dialog__content.v-dialog__content--active").style = "z-index: 99999;";
                    document.querySelector("div.v-overlay.v-overlay--active.theme--dark").style = "z-index: 99998;";
                });
            }
        },
        initAddReview: function () {
            this.rUser = null;
            this.emptyRequired = false;
            this.dialog = true;
            this.reorderModal();
        },
        initDeleteReview: function (funct, review, index) {
            var self = this;
            self.confFunc = funct;
            if (review.id > 0) {
                this.initConfirmReview(funct, review, index);
            }
            else {
                this.request.reviews.splice(index, 1);
            }
        },
        initConfirmReview: function (funct, review) {
            var self = this;
            if (review.user) {
                self.rUser = review.user;
            }
            self.emptyRequired = false;
            self.confFunc = funct;
            self.altObject = review;
            self.confirm = true;
            this.reorderModal();
        },
        approve: function () {
            var self = this;
            if (self.altObject.id > 0) {
                return self.uploadAttachments(self.request)
                    .then(function (result) {
                        return DataAccess.approveReview(self.altObject.id, self.altObject.comment)
                            .then(function (result) {
                                self.$toasted.success("Routed Document has been approved.");
                                self.confirm = false;
                                self.request.reviews.splice(self.request.reviews.findIndex(x => x.id === self.altObject.id), 1, new ReviewDetailObject(result));
                                //console.log(self.request.reviews);
                                self.goToListPage();
                            }).catch(function (err) {
                                console.log("failed to get document info", err);
                                return null;
                            });
                    });
            } else {
                self.$toasted.error("Invalid Routed Document Id.");
            }
        },
        "return": function () {
            var self = this;
            self.isLoading = true;
            if (self.altObject.id > 0) {
                return self.uploadAttachments(self.request)
                    .then(function (result) {
                        return DataAccess.returnReview(self.altObject.id, self.altObject.comment)
                            .then(function (result) {
                                self.$toasted.success("Routed Document has been denied.");
                                self.confirm = false;
                                self.request.reviews.splice(self.request.reviews.findIndex(x => x.id === self.altObject.id), 1, new ReviewDetailObject(result));
                                self.isLoading = false;
                                self.goToListPage();
                            }).catch(function (err) {
                                console.log("failed to get document info", err);
                                return null;
                            });
                    });

            } else {
                self.$toasted.error("Invalid Routed Document Id.");
            }
        },

        addReviewerHandler: function () {
            var self = this;

            if (self.rUser) {
                self.addReviewer(self.rUser);
                self.dialog = false;
            }
            else {
                this.emptyRequired = true;
            }
        },
        addReviewer: function (user) {
            var self = this;
            if (!user || !user.id) {
                self.$toasted.error("Reviewer not valid");
                return false;
            } else {

                //               if (self.request.reviews.findIndex(x => x.userId == user.id && x.decision === 2) > -1) {
                //                 self.$toasted.error("Cannot add the same reviewer twice");
                //               return false;
                //         } else {
                //var reviewUser = new UserDetailObject(self.allUsers.find(u => u.id === user.id));

                self.request.reviews.push(new ReviewDetailObject({
                    comment: ""
                    , decision: 2
                    , id: -1 * Math.floor(Math.random() * 1000000)
                    , lastModifiedTime: new Date().toISOString()
                    , orderNumber: self.request.reviews.length
                    , routedDocumentId: self.request.id
                    , user: user
                    , userId: user.id
                }));
                //       }

                return true;
            }
        },
        deleteReview: function () {
            var self = this;
            if (self.altObject.id > 0) {
                //return DataAccess.deleteReview(self.altObject.id)
                //    .then(function (result) {
                //        self.$toasted.success("Reviewer: " + self.rUser.friendlyName + " has been deleted.");
                self.confirm = false;
                self.request.reviews.splice(self.request.reviews.findIndex(x => x.id === self.altObject.id), 1);
                //}).catch(function (err) {
                //    console.log("failed to get document info", err);
                //    return null;
                //});
            } else {
                self.$toasted.error("Invalid Review Id.");
            }
        },
        alterReview: function () {
            var self = this;
            switch (this.confFunc) {
                case "Approve":
                    self.isLoading = true;
                    self.confirm = false;

                    self.approve()
                        .then(function () {
                            self.isLoading = false;
                        });
                    break;
                case "Deny":
                    if (self.altObject.comment) {
                        self.confirm = false;

                        self.isLoading = true;
                        self.return()
                            .then(function () {
                                self.isLoading = false;
                            });
                    }
                    else {
                        self.emptyRequired = true;
                    }
                    break;
                case "Delete":
                    self.confirm = false;
                    self.isLoading = true;
                    self.deleteReview()
                    //.then(function () {
                    self.isLoading = false;
                    //});

                    break;
                case "Remind":
                    self.confirm = false;
                    self.isLoading = true;
                    self.remindReview()
                        .then(function () {
                            self.isLoading = false;
                        });

                    break;
                case "DeleteAttachment":
                    self.confirm = false;
                    self.isLoading = true;
                    self.deleteAttachment(self.altObject.id)
                        .then(function () {
                            self.isLoading = false;
                        });

                    break;
                default:
                    self.$toasted.error("Operation not supported");
            }
        },
        changed: function (event) {
            var self = this;
            if (event.moved) {
                for (let i = 0; i < self.request.reviews.length; i++) {
                    self.request.reviews[i].orderNumber = i;
                }
            }
        },
        querySelections(q) {
            var self = this;
            self.loading = true;
            clearTimeout(self._getUsersTimeout);

            if (q && q.length > 2) {
                self._getUsersTimeout = setTimeout(() => {
                    DataAccess.findUser(q).then(function (data) {
                        data.forEach(x => {
                            if (self.allUsers.findIndex(y => y.id == x.id) === -1) {
                                self.allUsers.push(x);
                                self.allUsers.sort((a, b) => {
                                    if (a.lastName < b.lastName) {
                                        return -1;
                                    }
                                    else if (a.lastName > b.lastName) {
                                        return 1;
                                    }
                                    else if (a.lastName === b.lastName) {
                                        if (a.firstName < b.firstName) {
                                            return -1
                                        }
                                        else if (a.firstName > b.firstName) {
                                            return 1
                                        }
                                        else if (a.firstName === b.firstName) {
                                            return 0;
                                        }
                                    }
                                });
                            }
                        });
                    });
                }, 500);
            }
        },
        getReviewerRowClass: function (review) {
            var returnMe = "";
            if (review.decision === 2) {
                returnMe += " draggable-item";
            } else {
                returnMe += " non-draggable-item";
            }

            return returnMe + " border rounded";
        },
        isCurrentReviewer: function (row) {
            var temp = this.request.reviewerId === row.userId && this.request.canReview;
            return temp;
        },
        isNextReviewer: function (row) {
            var temp = this.request.reviewerId === row.userId;
            return temp;
        },
        isReviewApproved: function (row) {
            return row.decision == 1;
        },
        isReviewReturned: function (row) {
            return row.decision == 0;
        },
        isReviewButtonDisabled: function (row) {
            return !this.isCurrentReviewer(row) || row.decision !== 2;
        },
        addReviewersFromRoute: function (index) {
            var self = this;
            if (index > -1) {
                var promises = [];

                self.routes[index].routeTemplate
                    .forEach((x, i) => {
                        promises.push(DataAccess.getUser(x.userId)
                            .then(function (data) {
                                self.routes[index].routeTemplate[i].user = data;
                            })
                        );
                    })

                Promise.all(promises).then(function (data) {
                    self.routes[index].routeTemplate
                        .sort((a, b) => a.orderNumber - b.orderNumber)
                        .forEach(x => { self.addReviewer(x.user); });
                });
            }
        },
        commentOk_onclick: function () {
            this.isLoading = true;
            this.$refs.menu.save(this.date)
                .then(function () {
                    this.isLoading = false;
                });
        },
        remindReview: function () {
            var self = this;
            return DataAccess.sendReminderEmail(self.request.id)
                .then(function (result) {
                    self.$toasted.success("Reminder Email has been sent.")
                    self.confirm = false;
                }).catch(function (err) {
                    self.$toasted.error("Failed to send Email.");
                    console.log("failed to send Email", err);
                    self.confirm = false;
                    return null;
                })
        },
        getRoutes: function () {
            var self = this;
            return DataAccess.getRoutes().then(function (result) {
                self.routes = result.map(x => new RouteObject(x));
            });
        },
        routingTemplate_onchange: function (event) {
            //add a review for each user in the route

            //we have a default option, so we subtract 1 from the index
            this.addReviewersFromRoute(event.target.selectedIndex - 1);
        },
        addAttachmentToUpload: function (attachments) {
            attachments.forEach((item, index) => {
                this.attachmentsToUpload.push(item);
            });
        },
        checkAttachSig: function () {
            var self = this;
            var joint = self.attachmentsToUpload.concat(self.request.attachments)

            for (var i = 0; i < joint.length; i++) {
                if (joint[i].isRoutedAttachment) {
                    self.acheck = true;
                    return;
                }
            }
            self.acheck = false;
        },
        newForm: function () {
            var root = document.getElementById('drt-base-url').value;
            window.location = root + "Route";
        },
        goToListPage: function () {
            var root = document.getElementById('drt-base-url').value;
            window.location = root;
        },
        deleteAttachment: function (id) {
            var self = this;
            if (self.request.attachments.findIndex(x => x.id === id) > -1) {
                return DataAccess.deleteAttachment(id)
                    .then(function (data) {
                        self.request.attachments.splice(self.request.attachments.findIndex(x => x.id === id), 1);
                        self.confirm = false;
                        console.log("Successfully deleted file", data);
                    })
                    .catch(function (err) {
                        console.log("fail", err)
                        return null;
                    });
            }
            else {
                this.attachmentsToUpload.splice(this.attachmentsToUpload.findIndex(x => x.id === id), 1);
                self.confirm = false;
            }
        },
        uploadAttachments: function () {
            var self = this;
            let formData = new FormData();

            if (self.attachmentsToUpload.length > 0) {

                self.attachmentsToUpload.forEach((f, x) => {
                    if (!f.id) {
                        //Appends the actual file to the formdata.
                        formData.append('file' + (x + 1), f);
                        //appends the file information for each file being added.
                        formData.append('file' + (x + 1), JSON.stringify(f));
                    }
                });
            }

            self.request.attachments.forEach((f, x) => {
                if (f.isDirty) {
                    formData.append('fileToUpdate' + (x + 1), JSON.stringify(f));
                    f.isDirty = false;
                }
            })

            formData.append("RoutedDocumentId", self.request.id);

            return DataAccess.saveAttachment(formData)
                .then(function (data) {
                    self.attachmentsToUpload = [];
                    return DataAccess.getRoutedDocument(self.request.id)
                        .then(function (data) {
                            self.request = new RoutedDocumentObject(data);
                            return self.request;
                        })
                        .catch(function (err) {
                            self.$toasted.error("Error uploading attachment.  " + err.statusText);
                            return null;
                        });
                }).catch(function (err) {
                    self.$toasted.error("Error uploading attachment.  " + err.statusText);
                    return null;
                });
        }
    },
    computed: {
        availableUsers: function () {
            return this.allUsers.map(x => {
                x.displayText = "Name:  " +
                    x.friendlyName +
                    "    Email:  " +
                    x.email;

                return x;
            })
                //removing this because customers want to send a document to a reviewer who previously returned it
                //todo i think this process needs a revisit
                //.filter(x => this.request.reviews.findIndex(y => y.userId == x.id) === -1)
                ;
        },
        dragOptions() {
            return {
                animation: 200,
                group: "name",
                disabled: false,
                ghostClass: "ghost"
            };
        },
        statusDisplay: function () {
            return Constants.statuses[this.request.statusId];
        },
        isValid: function () {
            return {
                error: validation.$error,
                dirty: validation.$dirty
            }
        },
        modifiedColumnWidth: function () {
            return this.review ? this.review.canEdit ? "35%" : "40%" : "35%";
        },
        nameColumnWidth: function () {
            return this.review ? this.review.canEdit ? "35%" : "40%" : "35%";
        },
        reviewedColumnWidth: function () {
            return this.review ? this.review.canEdit ? "10%" : "10%" : "10%";
        },
        returnColumnWidth: function () {
            return this.review ? this.review.canEdit ? "10%" : "10%" : "10%";
        },
        deleteColumnWidth: function () {
            return this.review ? this.review.canEdit ? "10%" : "0%" : "10%";
        }
    },
    mounted: function () {
        this.overlay = !this.overlay;
        //        this.isLoading = true;
    },
    template: `
<div class="route-info">
	<v-overlay :value="isLoading" z-index="9999">
		<v-progress-circular indeterminate size="64"></v-progress-circular>
	</v-overlay>
	<h2>
		<template v-if="request.id == null">
			<span data-intro="All documents start in DRAFT status, move to ROUTING after submittal, and then to COMPLETE after all reviewers have approved it.">Status:  DRAFT </span>
		</template>
		<template v-else>
			<span data-intro="All documents start in DRAFT status, move to ROUTING after submittal, and then to COMPLETE after all reviewers have approved it.">Status:  {{statusDisplay}}</span>
		</template>
		<button class="right btn btn-primary btn-lg new-form-button" @click="newForm" data-intro="Click this to clear the form.">New Form</button>
	</h2>
	<div class="container-fluid p-4">
		<div class="card">
			<div class="card-body">
				<div class="form-row mb-1">
					<div class=" col-3">
						<label>Attachment contains PII</label>
					</div>
					<div class=" col-3">                    
						<label class="fancy-checkbox" v-if="request.canEdit">
							<input type="checkbox" v-model="request.piiStatus"/>
							<i class="fa fa-check-square fa-3x checked"></i>
							<i class="fa fa-square fa-3x unchecked"></i>
						</label>
						<label class="fancy-checkbox" v-else>
							<i class="fa fa-check-square fa-3x checked" style="display: inline-block;" v-if="request.piiStatus"></i>
							<i class="fa fa-square fa-3x unchecked" style="display: inline-block;" v-else></i>
						</label>
					</div>
					<div class=" col-6"/></div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Priority</label>
					</div>
					<div class=" col-3">
						<label>
						<input type="radio"
								name="priority"
								value="1" checked  :disabled="!request.canEdit"/>
						Normal</label>
						&nbsp;&nbsp;
						<label>
						<input type="radio"
								name="priority"
								value="0"
								:disabled="!request.canEdit"/>
						Hot</label>
					</div>
					<div class=" col-6"/></div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Deadline Date</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_date" >
							<v-menu ref="menu"
									:close-on-content-click="false"
									:return-value.sync="date"
									transition="scale-transition"
									offset-y
									min-width="290px" 
									:disabled="!request.canEdit">
								<template v-slot:activator="{ on }">
									<v-text-field
											v-model="date" 
											v-on="on" >
									</v-text-field>
								</template>
								<v-date-picker v-model="date"
										:show-current="true" scrollable>
									<v-spacer/>
									<v-btn text color="primary"
                                        @click="menu = false">Cancel</v-btn>
									<v-btn text color="primary"
                                        @click="$refs.menu.save(date)">OK</v-btn>
								</v-date-picker>
							</v-menu>
						</span>
					</div>
				</div>
				<div class="form-row ">
					<div class=" col-3">
						<label>Signature Type</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_signature">
							<select cf-field="signature"
									type="select"
									class="form-control"
									name="signature"
									id="i_signature"
									v-model.trim="request.signatureType"
									:class="{ 'is-invalid': $v.request.signatureType.$error }"
									:disabled="!request.canEdit">
								<option value="" />
								<option value="cac">CAC Signature</option>
								<option value="ink">Ink Signature</option>
							</select>
							<div v-if="!$v.request.signatureType.required"
									class="invalid-feedback">Signature Type is required</div>
						</span>
					</div>
					<div class=" col-5"/></div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Org Code</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_serial">
							<input cf-field="serial"
									type="text"
									id="i_orgCode"
									name="serial"
									v-model.trim="request.orgCode"
									class="form-control"
									title="Org Code"
									:class="{ 'is-invalid': $v.request.orgCode.$error }"
									:readonly="!request.canEdit"/>                                        
							<div v-if="!$v.request.orgCode.required"
									class="invalid-feedback">Org Code is required</div>
						</span>
					</div>
					<div class=" col-5">
						<div v-if="!$v.request.serialNumber.required"
								class="invalid-feedback">Org Code</div>
					</div>
				</div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Serial Number</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_serial">
							<input 
									cf-field="serial"
									type="text"
									id="i_serial"
									name="serial"
									v-model.trim="request.serialNumber"
									class="form-control"
									title="Serial Number"
									:class="{ 'is-invalid': $v.request.serialNumber.$error }"
									:readonly="!request.canEdit"/>                                        
							<div v-if="!$v.request.serialNumber.required"
									class="invalid-feedback">Serial Number is required</div>
						</span>
					</div>
					<div class=" col-5">
						<div v-if="!$v.request.serialNumber.required"
								class="invalid-feedback">Serial Number is required</div>
					</div>
				</div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Document Type</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_type">
							<input 
									cf-field="type"
									type="text"
									id="i_type"
									name="type" 
									v-model.trim="request.documentType"
									class="form-control"
									title="Document Type" 
									:class="{ 'is-invalid': $v.request.documentType.$error }" 
									:readonly="request.canEdit != true"/>                                        
							<div v-if="!$v.request.documentType.required"
									class="invalid-feedback">Document Type is required</div>
						</span>
					</div>
					<div v-if="!$v.request.documentType.required"
							class="col-4 invalid-feedback">Document Type is required</div>
				</div>
				<div class="form-row">
					<div class=" col-3">
						<label>SSIC</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_ssic">
							<input 
									cf-field="ssic"
									type="text"
									id="i_ssic"
									name="ssic" 
									v-model.trim="request.ssic"
									class="form-control"
									title="ssic" 
									:class="{ 'is-invalid': $v.request.ssic.$error }" 
									:readonly="request.canEdit != true"/>                                        
							<div v-if="!$v.request.ssic.required"
									class="invalid-feedback">SSIC is required</div>
						</span>
					</div>
					<div class=" col-5"/></div>
				<div class="form-row mb-3">
					<div class=" col-3"/>
					<div class=" col-6"/>
					<div class=" col-3"/></div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Subject</label>
					</div>
					<div class=" col-4">
						<span id="i_holdingrow_subject">
							<input 
									cf-field="subject"
									type="text"
									id="i_subject"
									name="subject" 
									v-model.trim="request.subject"
									class="form-control"
									title="Subject" 
									:class="{ 'is-invalid': $v.request.subject.$error }" 
									:readonly="request.canEdit != true"/>    
							<div v-if="!$v.request.subject.required"
									class="invalid-feedback">Subject is required</div>
						</span>
					</div>
					<div class=" col-5"/></div>
				<div class="form-row">
					<div class=" col-3">
						<label>Background</label>
					</div>

					<div class=" col-4">
                    <span id="i_holdingrow_background" >
							<textarea 
									cf-field="background"
									id="i_background"
									name="background" 
									v-model.trim="request.background"
									rows="4"
									class="form-control" 
									:class="{ 'is-invalid': $v.request.background.$error }" 
									:readonly="request.canEdit != true"
									alt="Please provide a quick overview of document history as well as any additional explanation"
									title="Please provide a quick overview of document history as well as any additional explanation"> </textarea>        
							<div v-if="!$v.request.background.required"
									class="invalid-feedback">Background is required</div>
	                    </span>
				    </div>
				</div>
				<div class="form-row">
					<div class=" col-3">
						<label>Recommendations</label>
					</div>
					<div class=" col-4">
                        <span id="i_holdingrow_recommendations">
							<textarea 
									cf-field="recommendations"
									id="i_recommendations"
									name="recommendations" 
									v-model.trim="request.recommendation"
									rows="4"
									class="form-control" 
									:class="{ 'is-invalid': $v.request.recommendation.$error }" 
									:readonly="request.canEdit != true"
									alt="Action to be taken after final signature"
									title="Action to be taken after final signature"> </textarea>
							<div v-if="!$v.request.recommendation.required"
									class="invalid-feedback">Recommendations is required</div>	
                      </span>
				    </div>
				</div>
				<div class="form-row">
					<div class=" col-3">
						<label>Attachments</label>
					</div>
					<div class=" col-9" data-intro="Drop or browse to your documents here.">
						<attachment-main cf-field="attachments"
								:files="request.attachments"
								:files-to-upload="attachmentsToUpload"
								:can-edit="request.canEdit"
								:can-review="request.canReview"
								:user-id="request.reviewerId"
								:is-originator="request.isOriginator"
								:is-admin="isAdmin"
								@deleteAttachment="deleteAttachment"
								@checkAttachSig="checkAttachSig"
								@updateAttachment="addAttachmentToUpload"
								ref="attachmentMain" />

						<div v-if="!$v.request.attachments.oneAttachment" class="error-message">At least one Attachment is required</div>       
						<div v-if="!$v.request.attachments.oneSigCB" class="error-message">A designated For Signature Attachment is required</div>  
					</div>
				</div>
				<div class="form-row mb-3"
						v-if="request.id != null">
					<div class=" col-3">
						<label>Originator</label>
					</div>
					<div class=" col-4">
						{{request.originator.friendlyName}}
					</div>
					<div class=" col-5"/>
				</div>
				<div class="form-row mb-3">
					<div class=" col-3">
						<label>Routing Type</label>
					</div>
					<div class=" col-4" data-intro="Selecting a route will add the Reviewers from that route to the list below.">
						<select @change="routingTemplate_onchange" 
								cf-field="routing"
								type="select"
								class="form-control"
								name="routing"
								id="i_routing"  
								:disabled="!request.canEdit">
							<option selected="selected"
									value="">Custom</option>
							<option v-for="(route, index) in routes"
									:key="route.id"
									:value="route.id">{{route.name}}</option>
						</select>
					</div>
					<div class=" col-5"/>
				</div>
				<div class="form-row mb-1">
					<div class="col-12">
						<div class="card">
							<h5 class="card-header">Reviewers</h5>
							<div class=" col-12">
								<button darkbutton 
										data-intro="You can create a custom workflow by adding reviewers here."
										v-if="request.canEdit" 
										@click="initAddReview"
										class="btn btn-primary navbar-brand add-reviewer-button">
									<i class="fa fa-plus-square-o"
											style="font-size:20px;color:white"/>&nbsp;&nbsp;Add</button>
								<span v-if="request.reviews.length < 1"
												class="error-message">At least one Reviewer is required</span>
										<v-dialog v-model="dialog" persistent max-width="400">
											reviewer
											<v-card>
												<v-card-title class="headline">Add Reviewer</v-card-title>
												<v-card-text>
													<div v-if="emptyRequired"
															class="is-invalid">Please select User</div>
													<p>Name: {{ this.search || 'unknown'}}</p>
													
                                                        <v-autocomplete
															v-model="rUser"
															:items="availableUsers"
															:search-input.sync="search"
															hide-no-data
															item-text="displayText"
															item-value="id"
															label="User Search"
															placeholder="Start typing to Search"
															prepend-icon="mdi-database-search"
															return-object>

                                                            <template v-slot:selection="data">
                                                                <v-list-item-content>
                                                                  <v-list-item-title v-html="data.item.friendlyName"></v-list-item-title>
                                                                  <v-list-item-subtitle v-html="data.item.email"></v-list-item-subtitle>
                                                                </v-list-item-content>
                                                            </template>

                                                            <template v-slot:item="data">
                                                              <template v-if="typeof data.item !== 'object'">
                                                                <v-list-item-content v-text="data.item"></v-list-item-content>
                                                              </template>
                                                              <template v-else>
                                                                <v-list-item-content>
                                                                  <v-list-item-title v-html="data.item.friendlyName"></v-list-item-title>
                                                                  <v-list-item-subtitle v-html="data.item.email"></v-list-item-subtitle>
                                                                </v-list-item-content>
                                                              </template>
                                                            </template>
													</v-autocomplete>
												</v-card-text>
												<v-card-actions>
													<v-spacer/>
													<v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
													<v-btn color="green darken-1" text v-on:click="addReviewerHandler">OK</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>
										<v-dialog v-model="confirm" persistent max-width="400">
											<v-card>
												<v-card-title class="headline">{{confFunc}} Review</v-card-title>
												<v-card-text>
													<textarea 
															v-if="confFunc==='Deny' || confFunc==='Approve'" 
															cf-field="comment"
															id="i_comment"
															name="comment" 
															v-model.trim="altObject.comment"
															rows="4"
                                                            maxlength="250"
															class="form-control" />
													<div  v-if="confFunc==='Remind'" 
															class="mt-2">Send reminder to {{rUser.friendlyName}}.</div>
													<div  v-if="confFunc==='DeleteAttachment'" 
															class="mt-2">Delete Attachment: \n{{altObject.name}}.</div>                                           
													<div v-if="emptyRequired"
															class="is-invalid mt-2">Comment is required</div>
												</v-card-text>
												<v-card-actions>
													<v-spacer/>
													<v-btn :disabled="isLoading" color="green darken-1" text @click="confirm = false">Cancel</v-btn>
													<v-btn :disabled="isLoading" color="green darken-1" text @click="alterReview">OK</v-btn>
												</v-card-actions>
											</v-card>
										</v-dialog>
									</div>
									<div class="card-body reviewer-list" data-intro="Once you have added reviews, you can reorder them by clicking and dragging, so long as they aren't gray (completed or returned).">
										<div class="form-row border rounded">
											<div class="col-2 font-weight-bold pl-3 date-time border">Modified</div>                                    
											<div class="col-2 font-weight-bold pl-3 border">Name</div>
											<div class="col-2 font-weight-bold pl-3 border">Reviewed</div>
											<div class="col-2 font-weight-bold pl-3 border">Return</div>
											<div class="col-2 font-weight-bold pl-3 border">Delete</div>
											<div class="col-2 font-weight-bold pl-3 border">Remind</div>
										</div>

										<draggable 
												v-model="request.reviews" 
												v-bind="dragOptions"
												class="draggable list-group"
												draggable=".draggable-item"
												@start="drag=true" 
												@end="drag=false"
												@change="changed">
											<transition-group type="transition" :name="!drag ? 'flip-list' : null">
												<div 
														:class="getReviewerRowClass(review)"
														v-for="(review, index) in request.reviews"
														:key="review.id">
													<div class="row">
														<div class="col-2 pl-5 date-time">{{ new Date(review.lastModifiedTime).toLocaleString() }}</div>												
														<div class="col-2 ">{{ review.user.friendlyName }}</div>
														<div class="col-2 text-center">
															<button 
																	class="btn btn-success" 
							                                        title="Approve"
							                                        alt="Approve"
                                                                    @click="initConfirmReview('Approve', review)" 
																	v-if="isReviewApproved(review) || (isCurrentReviewer(review) && request.nextReviewOrderNumber == index)" 
																	:disabled="isReviewButtonDisabled(review)">
																<i class="fa fa-thumbs-o-up"
																		style="font-size:20px;color:white"/>
															</button>
														</div>
														<div class="col-2 text-center">
															<button 
																	class="btn btn-warning" 
							                                        title="Return"
							                                        alt="Return"
																	@click="initConfirmReview('Deny', review)" 
																	v-if="isReviewReturned(review) || (isCurrentReviewer(review) && request.nextReviewOrderNumber == index)" 
																	:disabled="isReviewButtonDisabled(review)">
																<i class="fa fa-window-close-o" style="font-size:18px;color:white"/>
															</button>
														</div>
														<div class="col-2 text-center">
															<button 
																	class="btn btn-danger" 
							                                        title="Delete"
							                                        alt="Delete"
																	@click="initDeleteReview('Delete', review, index)" 
																	v-if="request.canEdit && review.decision == 2">
																<i class="fa fa-trash" style="font-size:20px;color:white"/>
															</button>
														</div>
														<div class="col-2 text-center">
															<button 
																	class="btn btn-warning" 
							                                        title="Remind"
							                                        alt="Remind"
																	@click="initConfirmReview('Remind', review)" 
																	v-if="request.canEdit && isNextReviewer(review) && request.statusId == 2 && review.decision == 2">
																<i class="fa fa-hourglass-3" style="font-size:20px;color:white"/>
															</button>
														</div>
													</div>
													<div class="row">
														<div class="comment col-8 pl-5">
															<label>Comment:</label> 
															<div>
																{{review.comment || "None"}}
															</div>
														</div>
														<div class="col-4" >
															<label>Job Title:</label> 
															<div>
																{{ review.user.jobTitle || "None" }}
															</div>
														</div>
													</div>
												</div>
											</transition-group>
										</draggable>
										<v-overlay :z-index="999999" :value="overlay">
											<v-progress-circular indeterminate size="64"></v-progress-circular>
										</v-overlay>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
`
};
