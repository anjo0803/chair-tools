// Communicating with the NationStates API

const BASE = 'https://www.nationstates.net/cgi-bin/api.cgi?script_name=TSP_Assembly_Autoformatter_by_Tepertopia&';
const RATELIMIT = 30000.0 / 49;
var lastRequest = 0;

const API = {
    async getRMB(region, sincePost) {
        if(sincePost == null) return;
        return await response('region=' + region + '&q=messages;limit=100;fromid=' + sincePost);
    },
    async getWA() {
        return await response('wa=1&q=members');
    },

    /**
     * 
     * @returns {string[]} A list of the names of all resident nations of the given region
     */
    async getResidents(region) {
        return (await response(`region=${region}&q=nations`)).getElementsByTagName('NATIONS')[0].textContent.split(/\:/gm);
    },

    /**
     * 
     * @returns {string[]} A list of the names of all active nations
     */
    async getNations() {
        return (await response('q=nations')).getElementsByTagName('NATIONS')[0].textContent.split(/\,/gm);
    }
}

// Delays the current execution - used to meet rate limits
function delay(millis) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, millis);
    });
}

// Returns the XML Document returned from the NS API when given the specified arguments. Meets rate limits.
async function response(apiArgs) {
    try {
        let time = new Date().getTime();
        if(time < lastRequest + RATELIMIT) await delay(lastRequest + RATELIMIT - time);
        return await call(apiArgs);
    } catch(error) {
        console.log(error);
        return null;
    }
}

// Returns the XML Document returned from the NS API when given the specified arguments.
function call(apiArgs) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(this.responseXML);
        }
        xhr.onerror = reject;
        xhr.open("GET", BASE + apiArgs);
        xhr.send();
    });
}