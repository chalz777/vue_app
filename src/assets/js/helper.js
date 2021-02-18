export function waitForDOM(context, selector, testCallback, doneCallback, endTime) {
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

/**
* @returns {string} a randomly generated guid
*/
export function generateGuid() {
    var template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    //    var template = "xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx";
    var returnMe = template.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r
                /*
                 * What we're doing here is bitwise operations :
                 * 0x3.toString(2) => 11
                 * 0x8.toString(2) => 1000
                 * first a and with 11 at the bit level (truncating to only the two last bits, that is doing %4),
                 * then a or with 1000 (setting one bit, adding 8).
                 */
                : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return returnMe;
}