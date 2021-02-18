import { DateTime } from "../../lib/luxon.js"

function DateTimeFromTime(val) {
    if(!val) {	//If no travel time return an invalid DateTime
        return DateTime.fromObject({day:99});
    }
    var onlyNumber = val.replace(':','');
    if(onlyNumber.length != 4) {	//If it is not 4 digits after removing colon then return invalid DateTime
        return DateTime.fromObject({day:99});
    }
    var timeObject = {
        hour:onlyNumber.slice(0,2),
        minute:onlyNumber.slice(2,4)
        //zone: this.travelTimeZone
    };
    return DateTime.fromObject(timeObject);
} 

var RoutedDocumentObject = (function () {

    function RoutedDocumentObject(data) {
        if (data) {
            this.background = data.background ? data.background : '';
            this.isOriginator = data.isOriginator !== null ? data.isOriginator : false;
            this.canEdit = data.canEdit !== null ? data.canEdit : true;
            this.canReview = data.canReview !== null ? data.canReview : false;
            this.createdTime = data.createdTime ? data.createdTime : null;
            this.deadlineDate = data.deadlineDate ? data.deadlineDate : new Date().toISOString();
            this.documentType = data.documentType ? data.documentType : '';
            this.id = data.id ? data.id : null;
            this.orgCode = data.orgCode ? data.orgCode : "";
            this.originator = data.originator !== null ? new UserDetailObject(data.originator) : new UserDetailObject();
            this.originatorId = data.originatorId ? data.originatorId : 0;
            this.piiStatus = data.piiStatus ? data.piiStatus : false;
            this.priority = data.priority ? data.priority : 2;
            this.recommendation = data.recommendation ? data.recommendation : '';
            this.reviewerId = data.reviewerId ? data.reviewerId : 0;
            this.reviews = data.reviews ? data.reviews.map(x => new ReviewDetailObject(x)) : [];
            this.serialNumber = data.serialNumber ? data.serialNumber : '';
            this.signatureType = data.signatureType ? data.signatureType : 'ink';
            this.ssic = data.ssic ? data.ssic : '';
            this.nextReviewOrderNumber = data.nextReviewOrderNumber ? data.nextReviewOrderNumber : 0;
            this.statusId = data.statusId ? data.statusId : 1;
            this.subject = data.subject ? data.subject : '';
            this.attachments = data.attachments ? data.attachments.map(x => new AttachmentObject(x)) : [];
        }
        else {
            this.background = '';
            this.isOriginator = false;
            this.canEdit = true;
            this.canReview = false;
            this.createdTime = null;
            this.deadlineDate = new Date().toISOString();
            this.documentType = '';
            this.id = null;
            this.orgCode = "";
            this.originator = null;
            this.originatorId = 0;
            this.piiStatus = false;
            this.priority = 2;
            this.recommendation = '';
            this.reviewerId = 0;
            this.reviews = [];
            this.serialNumber = '';
            this.signatureType = 'ink';
            this.ssic = '';
            this.statusId = 1;
            this.subject = '';
            this.attachments = [];
        }
    }

    return RoutedDocumentObject;
}());


var PersistRoutedDocumentObject = (function () {

    function constructor(data) {
        if (data) {
            this.id = data.id ? data.id : 0;
            this.background = data.background ? data.background : '';
            this.deadlineDate = data.deadlineDate ? data.deadlineDate : new Date().toISOString();
            this.documentType = data.documentType ? data.documentType : '';
            this.orgCode = data.orgCode ? data.orgCode : "";
            this.originatorId = data.originatorId ? data.originatorId : 0;
            this.piiStatus = data.piiStatus ? data.piiStatus : false;
            this.priority = data.priority ? data.priority : 2;
            this.recommendation = data.recommendation ? data.recommendation : '';
            this.reviews = data.reviews ? data.reviews.map(x => new ReviewDetailObject(x)) : [];
            this.serialNumber = data.serialNumber ? data.serialNumber : '';
            this.signatureType = data.signatureType ? data.signatureType : '';
            this.ssic = data.ssic ? data.ssic : '';
            this.statusId = data.statusId ? data.statusId : 1;
            this.subject = data.subject ? data.subject : '';
            this.attachments = data.attachments ? data.attachments.map(x => new AttachmentObject(x)) : [];
        }
        else {
            this.background = '';
            this.deadlineDate = new Date().toISOString();
            this.documentType = '';
            this.orgCode = "";
            this.originatorId = 0;
            this.piiStatus = false;
            this.priority = 2;
            this.recommendation = '';
            this.reviews = [];
            this.serialNumber = '';
            this.signatureType = 'ink';
            this.ssic = '';
            this.statusId = 1;
            this.subject = '';
            this.id = 0;
            this.attachments = [];
        }
    }

    return constructor;
}());

var ReviewDetailObject = (function () {

    function ReviewDetailObject(data) {
        if (data) {
            this.comment = data.comment ? data.comment.trim() : "";
            this.decision = (data.decision !== null && data.decision !== undefined) ? data.decision : 2; //2  = no decision
            this.id = data.id !== null ? data.id : 0;
            this.lastModifiedTime = data.lastModifiedTime ? data.lastModifiedTime : new Date().toISOString();
            this.orderNumber = data.orderNumber !== null ? data.orderNumber : 1;
            this.routedDocumentId = data.routedDocumentId !== null ? data.routedDocumentId : 0;
            this.user = data.user ? new UserDetailObject(data.user) : new UserDetailObject();
            this.userId = data.userId !== null ? data.userId : 0;
        }
        else {
            this.comment = "";
            this.decision = 2; //2  = no decision
            this.id = 0;
            this.lastModifiedTime = new Date().toISOString();
            this.orderNumber = 1;
            this.routedDocumentId = 0;
            this.user = new UserDetailObject();
            this.userId = 0;
        }
    }

    return ReviewDetailObject;
}());

var AttachmentObject = (function () {

    function AttachmentObject(data) {
        if (data) {
            this.file = data.file ? data.file : "";
            this.routedDocumentId = data.routedDocumentId ? data.routedDocumentId : 0; 
            this.name = data.filename ? data.filename : "";
            this.createdDate = data.createdDate ? data.createdDate : new Date().toISOString();
            this.size = data.fileSize ? data.fileSize : 0;
            this.isRoutedAttachment = data.isRoutedAttachment ? data.isRoutedAttachment : false;
            this.createdById = data.createdById ? data.createdById : 1;
            this.active = data.active ? data.active : 0;
            this.id = data.id ? data.id : 0;
        }
        else {
            this.file = "";
            this.routedDocumentId =  0; 
            this.name = "";
            this.createdDate = new Date().toISOString();
            this.size = 0;
            this.isRoutedAttachment = false;
            this.createdById = 1;
            this.active = 0;
            this.id = 0;
        }
    }

    return AttachmentObject;
}());

var UserDetailObject = (function () {

    function UserDetailObject(data) {
        if (data) {
            this.active = data.active ? data.active : false;
            this.edipi = data.edipi ? data.edipi : null;
            this.email = data.email ? data.email : null;
            this.firstName = data.firstName ? data.firstName : null
            this.friendlyName = data.friendlyName ? data.friendlyName : null;
            this.id = data.id ? data.id : null;
            this.lastName = data.lastName ? data.lastName : null;
            this.middleName = data.middleName ? data.middleName : null;
            this.orgCode = data.orgCode ? data.orgCode : null;
            this.personnelNumber = data.personnelNumber ? data.personnelNumber : null;
            this.username = data.username ? data.username : null
            this.uwUserId = data.uwUserId ? data.uwUserId : null;
        }
        else {
            this.active = false;
            this.edipi = null;
            this.email = null;
            this.firstName = null;
            this.friendlyName = null;
            this.id = null;
            this.lastName = null;
            this.middleName = null;
            this.orgCode = null;
            this.personnelNumber = null;
            this.username = null;
            this.uwUserId = null;
        }
    }

    return UserDetailObject;
}());

var RouteObject = (function () {

    function constructor(data) {
        if (data) {
            this.id = data.id ? data.id : 0;
            this.name = data.name ? data.name : ""
            this.routeTemplate = data.routeTemplate ? data.routeTemplate.map(x => new RouteTemplateObject(x)) : [];
        }
        else {
            this.id = 0;
            this.username = ""
            this.reviews = [];
        }
    }

    return constructor;
}());

var RouteTemplateObject = (function () {

    function constructor(data) {
        if (data) {
            this.id = data.id ? data.id : 0;
            this.userId = data.userId ? data.userId : 0;
            this.routeId = data.routeId ? data.routeId : 0;
            this.orderNumber = data.orderNumber ? data.orderNumber : 0;
        }
        else {
            this.id = 0;
            this.userId = 0;
            this.routeId = 0;
            this.orderNumber = 0;
        }
    }

    return constructor;
}());

export { DateTimeFromTime, PersistRoutedDocumentObject, RoutedDocumentObject, ReviewDetailObject, UserDetailObject, RouteObject, RouteTemplateObject }