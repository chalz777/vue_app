function waitForDOM(context, selector, testCallback, doneCallback, endTime) {
    //console.log('waitForDOM', 'context', context, 'selector', selector, 'testCallback', testCallback, 'doneCallback', doneCallback, 'endTime', endTime);
    var element,
        testResult = null;

    if (!context) {
        context = document;
    }
    if (!testCallback) {
        testCallback = function (context, selector, element) {
            return element ? true : false;
        };
    }
    if (!endTime) {
        endTime = new Date();
        endTime = endTime.setSeconds(endTime.getSeconds() + 15);
    }

    element = context.querySelector(selector);
    testResult = testCallback(context, selector, element);

    if (testResult) {
        return doneCallback(testResult);
    } else if (Date.now() <= endTime) {
        //console.log('delaying', 'now', Date.now(), 'end', endTime);
        setTimeout(function () {
            return waitForDOM(context, selector, testCallback, doneCallback, endTime);
        }, 100);
    } else {
        //console.log('waitForDOM returning null');
        return null;
    }
}

var privelegedRoles = [
    "ADMINISTRATOR", "APPROVER", "COMPTROLLER_LABOR", "COMPTROLLER_PAYROLL", "DEPT_HEAD", "TOD_PAYROLL", "TRAVEL_OFFICE", "TRAVEL_PAYROLL"
];

function getRolesToStatuses() {
    var rolesToStatuses = new Map();

    rolesToStatuses.set("ADMINISTRATOR", ["DRAFT", "TO_REVIEW", "AO_REVIEW", "TO_ERP_TRAVEL", "DRAFT_RETURNED", "DEACTIVATED", "COMPLETE", "ESDH_REVIEW"]);
    rolesToStatuses.set("APPROVER", ["AO_REVIEW"]);
    rolesToStatuses.set("COMPTROLLER_LABOR", ["TO_REVIEW", "TO_ERP_TRAVEL"]);
    rolesToStatuses.set("COMPTROLLER_PAYROLL", ["TO_REVIEW", "TO_ERP_TRAVEL"]);
    rolesToStatuses.set("DEPT_HEAD", ["ESDH_REVIEW"]);
    rolesToStatuses.set("GLOBAL_REQUEST_VIEWER", ["DRAFT", "TO_REVIEW", "AO_REVIEW", "ESDH_REVIEW", "DRAFT_RETURNED", "DEACTIVATED", "COMPLETE"]);
    rolesToStatuses.set("SUPERVISOR", ["AO_REVIEW"]);
    rolesToStatuses.set("TOD_PAYROLL", ["TO_REVIEW", "TO_ERP_TRAVEL", "DEACTIVATED", "COMPLETE"]);
    rolesToStatuses.set("TRAVEL_OFFICE", ["TO_REVIEW", "TO_ERP_TRAVEL", "DEACTIVATED", "COMPLETE"]);
    rolesToStatuses.set("TRAVEL_PAYROLL", ["TO_REVIEW", "TO_ERP_TRAVEL", "DEACTIVATED", "COMPLETE"]);
    rolesToStatuses.set("USER", ["DRAFT", "DRAFT_RETURNED"]);

    return rolesToStatuses;
}

function getStatusesToRoles() {
    var statusesToRoles = new Map();

    statusesToRoles.set("DRAFT", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "USER"]);
    statusesToRoles.set("DRAFT_RETURNED", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "USER"]);
    statusesToRoles.set("TO_REVIEW", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "COMPTROLLER_LABOR", "TOD_PAYROLL", "TRAVEL_OFFICE", "TRAVEL_PAYROLL"]);
    statusesToRoles.set("AO_REVIEW", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "APPROVER", "SUPERVISOR"]);
    statusesToRoles.set("TO_ERP_TRAVEL", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "COMPTROLLER_LABOR", "TOD_PAYROLL", "TRAVEL_OFFICE", "TRAVEL_PAYROLL"]);
    statusesToRoles.set("DEACTIVATED", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "TOD_PAYROLL", "TRAVEL_OFFICE", "TRAVEL_PAYROLL"]);
    statusesToRoles.set("COMPLETE", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "TOD_PAYROLL", "TRAVEL_OFFICE", "TRAVEL_PAYROLL"]);
    statusesToRoles.set("ESDH_REVIEW", ["ADMINISTRATOR", "GLOBAL_REQUEST_VIEWER", "DEPT_HEAD"]);

    return statusesToRoles;
}

function getStatuses() {
    var statuses = new Map();

    statuses.set("DRAFT", "Draft");
    statuses.set("TO_REVIEW", "Awaiting Travel Office Review");
    statuses.set("AO_REVIEW", "Awaiting Approving Official Review");
    statuses.set("TO_ERP_TRAVEL", "Awaiting Travel Office Approval");
    statuses.set("ESDH_REVIEW", "Employee Services Division Head Review");
    statuses.set("DRAFT_RETURNED", "Returned");
    statuses.set("DEACTIVATED", "Deactivated");
    statuses.set("COMPLETE", "Complete");
    statuses.set("ARCHIVED", "Archived");

    return statuses;
}

function getStatusClasses() {
    var statuses = new Map();

    statuses.set("DRAFT", "new");
    statuses.set("TO_REVIEW", "submitted");
    statuses.set("AO_REVIEW", "pending");
    statuses.set("TO_ERP_TRAVEL", "pending");
    statuses.set("ESDH_REVIEW", "pending");
    statuses.set("DRAFT_RETURNED", "denied");
    statuses.set("DEACTIVATED", "cancelled");
    statuses.set("COMPLETE", "approved");
    statuses.set("ARCHIVED", "approved");

    return statuses;
}

function getRoles() {
    var roles = new Map();

    roles.set("ADMINISTRATOR", "Admin");
    roles.set("APPROVER", "Approver");
    roles.set("B_CODE_CREATOR", "Dept. Analyst");
    roles.set("B_CODE_MANAGER", "Office Manager");
    roles.set("COMPTROLLER_LABOR", "Comptroller - Labor");
    roles.set("COMPTROLLER_PAYROLL", "Comptroller - Payroll");
    roles.set("DEPT_HEAD", "Department Head");
    roles.set("GLOBAL_REQUEST_VIEWER", "Global Request Viewer");
    roles.set("HELPDESK", "Helpdesk");
    roles.set("HR", "Human Resources");
    roles.set("SUPERVISOR", "Supervisor");
    roles.set("TOD_PAYROLL", "TOD Payroll Approver");
    roles.set("TRAVEL_OFFICE", "Travel Office");
    roles.set("TRAVEL_PAYROLL", "Travel Payroll");
    roles.set("USER", "User");

    return roles;
}

function getLocations() {
    var locations = new Map();
    locations.set(4, "Primary Residence");
    locations.set(5, "Work");
    locations.set(1, "Hotel");
    locations.set(2, "TDY");
    locations.set(3, "Other");

    return locations;
}

function isUserPrivileged(user) {
    return getFirstPrivelegedRole(user) === null ? false : true;
}

function getFirstPrivelegedRole(user) {
    for (let i = 0; i < user.Roles.length; i++) {
        if (privelegedRoles.indexOf(user.Roles[i].RoleType) > -1) {
            return user.Roles[i].RoleType;
        }
    }
    return null;
}

function getCurrentUser() {
    var userField = document.getElementById('current-user');
    if (userField) {
        return JSON.parse(userField.dataset.user);
    } else {
        return {
            "Id": 0,
            "Username": "",
            "OrgCode": "",
            "Email": "",
            "PhoneNumber": "",
            "FirstName": "",
            "LastName": "",
            "MiddleName": "",
            "FriendlyName": "",
            "PersonnelNumber": null,
            "Active": true,
            "Roles": [],
            "Impersonate": false
        };

    }
}

function getAuthorizedOrgCodes() {
    var orgCodesField = document.getElementById('poc-org-code-content');
    if (orgCodesField) {
        return JSON.parse(orgCodesField.dataset.json);
    } else {
        return null;
    }
}

function getMinutesDifference(/* datetime */ a, /* datetime */ b) {
    // get the difference between two dates in minutes

    return (new Date(a).getTime() -
        new Date(b).getTime()) /
        (1000 * 60);
}

function formatDate(date) {
    return new Date(date).toLocaleString("en-us", {
        year: 'numeric',
        month: 'short',
        weekday: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: "h24"
    });
}

function getTimeZones() {
    var timeZones = new Map();

    timeZones.set(-12, "(GMT-12:00) International Date Line West");
    timeZones.set(-11, "(GMT-11:00) Midway Island, Samoa");
    timeZones.set(-10, "(GMT-10:00) Hawaii");
    timeZones.set(-9, "(GMT-09:00) Alaska");
    timeZones.set(-8, "(GMT-08:00) Pacific Time (US & Canada)");
    timeZones.set(-7, "(GMT-07:00) Mountain Time (US & Canada)");
    timeZones.set(-6, "(GMT-06:00) Central Time (US & Canada)");
    timeZones.set(-5, "(GMT-05:00) Eastern Time (US & Canada)");
    timeZones.set(-4, "(GMT-04:00) Atlantic Time (Canada)");
    timeZones.set(-3.5, "(GMT-03:30) Newfoundland");
    timeZones.set(-3, "(GMT-03:00) Brasilia");
    timeZones.set(-2, "(GMT-02:00) Mid-Atlantic");
    timeZones.set(-1, "(GMT-01:00) Cape Verde Is.");
    timeZones.set(0, "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London");
    timeZones.set(1, "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna");
    timeZones.set(2, "(GMT+02:00) Jerusalem");
    timeZones.set(3, "(GMT+03:00) Kuwait, Riyadh, Baghdad");
    timeZones.set(3.5, "(GMT+03:30) Tehran");
    timeZones.set(4, "(GMT+04:00) Abu Dhabi, Muscat");
    timeZones.set(4.5, "(GMT+04:30) Kabul");
    timeZones.set(5, "(GMT+05:00) Islamabad, Karachi, Tashkent");
    timeZones.set(5.5, "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi");
    timeZones.set(5.75, "(GMT+05:45) Kathmandu");
    timeZones.set(6, "(GMT+06:00) Astana, Dhaka");
    timeZones.set(6.5, "(GMT+06:30) Yangon (Rangoon)");
    timeZones.set(7, "(GMT+07:00) Bangkok, Hanoi, Jakarta");
    timeZones.set(8, "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi");
    timeZones.set(9, "(GMT+09:00) Osaka, Sapporo, Tokyo");
    timeZones.set(9.5, "(GMT+09:30) Adelaide");
    timeZones.set(10, "(GMT+10:00) Guam, Port Moresby");
    timeZones.set(11, "(GMT+11:00) Magadan, Solomon Is., New Caledonia");
    timeZones.set(12, "(GMT+12:00) Fiji, Kamchatka, Marshall Is.");
    timeZones.set(13, "(GMT+13:00) Nuku'alofa");

    return timeZones;
}