import $ from 'jquery'

//////const root = document.getElementById('drt-base-url').value;
const root = 'http://localhost:8080/'

function getGetRequest(controllerName, id) {
    let url = root + "api/" + controllerName;

    if (id) {
        url += "/" + id
    }

    return $.ajax({
        url: url,
        method: "GET",
        contentType: "application/json",
        cache: false
    });
}

function getUpdateRequest(controllerName, id, data) {
    return $.ajax({
        url: root + "api/" + controllerName + "/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

function getSaveRequest(controllerName, data) {
    return $.ajax({
        url: root + "api/" + controllerName,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data)
    });
}

function getDeleteRequest(controllerName, id) {
    return $.ajax({
        url: root + "api/" + controllerName + "/" + id,
        method: "DELETE",
        contentType: "application/json"
    });
}



const DataAccess = {
    deleteRoutedDocument
        : function (id) {
        return getDeleteRequest("RoutedDocument", id);
    },
    getRoutedDocument: function (id) {
        return getGetRequest("RoutedDocument", id);
    },
    getRoutedDocuments: function () {
        
        alert("getRoutedDocuments");
        return;

        //return getGetRequest("RoutedDocument");
    },
    getRoutedDocumentList: function () {
        return getGetRequest("RoutedDocument/List");
    },
    returnRoutedDocument: function (id) {
        return $.ajax({
            url: root + "api/RoutedDocument/" + id + "/Return",
            method: "POST",
            contentType: "application/json",
        });
    },
    approveRoutedDocument: function (id) {
        return $.ajax({
            url: root + "api/RoutedDocument/" + id + "/Approve",
            method: "PUT",
            contentType: "application/json",
        });
    },
    updateRoutedDocument: function (id, data) {
        return getUpdateRequest("RoutedDocument", id, data);
    },
    saveRoutedDocument: function (data) {
        return getSaveRequest("RoutedDocument", data);
    },
    findUser: function (query) {
        return $.ajax({
            url: root + "api/User/Find/" + query,
            method: "GET"
        });
    },
    getUserIsAdmin: function () {
        return getGetRequest("User", "IsAdmin");
    },
    getUser: function (id) {
        return getGetRequest("User", id);
    },
    getUsers: function () {
        return getGetRequest("User");
    },
    updateUser: function (id, data) {
        return getUpdateRequest("User", id, data);
    },
    saveUser: function (data) {
        return getSaveRequest("User", data);
    },
    getCurrentUser: function () {
        return $.ajax({
            url: root + "api/User/Current",
            method: "GET"
        });
    },
    getReviews: function () {
        return getGetRequest("Review");
    },
    getReview: function (id) {
        return getGetRequest("Review", id);
    },
    updateReview: function (id, data) {
        return getUpdateRequest("Review", id, data);
    },
    approveReview: function (id, data) {
        return $.ajax({
            url: root + "api/Review/" + id + "/Approve",
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
        });

    },
    returnReview: function (id, data) {
        return $.ajax({
            url: root + "api/Review/" + id + "/Return",
            method: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            
        });

    },
    saveReview: function (data) {
        return getSaveRequest("Review", data);
    },
    deleteReview: function (id) {
        return getDeleteRequest("Review", id);
    },
    getAttachments: function () {
        return getGetRequest("Attachment");
    },
    getAttachment: function (id) {
        return $.ajax({
            url: root + "api/Attachment/" + id,
            method: 'GET',
            processData: 'false',
            responseType: 'arraybuffer',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
    },
    updateAttachment: function (id, data) {
        return getUpdateRequest("Attachment", id, data);
    },
    saveAttachment: function (data) {
        //var xhr = new XMLHttpRequest();
        //// Add any event handlers here...
        //xhr.open('POST', 'api/Attachment/upload', true);
        //xhr.send(data);

        return $.ajax({
            url: root + "api/Attachment/upload",
            method: "POST",
            //contentType: 'multipart/form-data',
            contentType: false,
            processData: false,
            data: data
        }).done(function (data) {
            console.log("Successfully uploaded file ", data)
        }).fail(function (err) {
            console.log("fail", err)
        });
    },
    deleteAttachment: function (id) {
        return getDeleteRequest("Attachment", id);
    },
    getRoutes: function () {
        return getGetRequest("Route");
    },
    getRoute: function (id) {
        return getGetRequest("Route", id);
    },
    updateRoute: function (id, data) {
        return getUpdateRequest("Route", id, data);
    },
    saveRoute: function (data) {
        return getSaveRequest("Route", data);
    },
    sendReminderEmail: function(id) {
        return $.ajax({
            url: root + "api/RoutedDocument/" + id + "/Remind",
            method: "POST",
        })
    }
}
export default DataAccess