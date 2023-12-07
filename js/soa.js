/*
 *
 */

const REPORT_DETAILS = {
    votes: [],
    discussions: [],
    legsDeparting: [],
    legsArriving: []
}

id('soa-month').innerText = new Date(new Date() - 1000 * 60 * 60 * 24 * 7).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
});

function edit(part) {
    for(let component of document.getElementById('input').children) component.open = false;
    if(part == 'V') id('in-votes').open = true;
    else if(part == 'D') id('in-discussions').open = true;
    else if(part == 'A' || part == 'L') id('in-legcheck').open = true;
}

function generate() {
    let header = `[align=center][size=x-large][b]State of the Assembly #month[/b][/size][/align]`
        .replace(/#month/gm, id('soa-month').innerText);
    let votesHeader = `[table=100][tr][td][size=large][b]Votes[/b][/size][/td][/tr][/table]`;
    let discussionsHeader = `[table=100][tr][td][size=large][b]Discussions[/b][/size][/td][/tr][/table]`;
    let legCheckHeader = `[table=100][tr][td][size=large][b]Legislator Check[/b][/size][/td][/tr][/table]`;
    let legCheckIntro = `According to the [url=https://tspforums.xyz/thread-5792.html]Legislator Committee Act[/url], in order to keep their legislator status, legislators must have voted in at least half of all votes in each month (given that there were at least two votes in that month), as well as maintain a nation in [region]the South Pacific[/region]. Since ${REPORT_DETAILS.votes.length < 2 ? (REPORT_DETAILS.votes.length == 0 ? 'no votes' : 'only one vote') + ' finished this month, legislators needed only to maintain a nation in the South Pacific to keep their status' : REPORT_DETAILS.votes.length + ' votes finished this month, legislators needed to have voted in at least ' + Math.ceil(REPORT_DETAILS.votes.length / 2) + ' of them to keep their status'}.\n\nThe list of legislators whom the Chair recommends the Legislator Committee to revoke the legislator statuses of is in the table below. If your legislator status has been revoked, you can always [url=https://tspforums.xyz/thread-9655.html]reapply.[/url] You can also find the legislator roster for this month attached at the bottom of this post.`;
    let arrivalsHeader = `[table=100][tr][td][size=large][b]New Legislators[/b][/size][/td][/tr][/table]`;

    let tableVotes = '[table=100]\n[tr][td][b]Code[/b][/td][td][b]Title[/b][/td][td][b]Result[/b][/td][/tr]';
    for(let vote of REPORT_DETAILS.votes) tableVotes += `\n[tr][td]${vote.code}[/td][td]${(vote.link != '' ? '[url=' + vote.link + ']' + vote.title + '[/url]' : vote.title)}[/td][td][color=${vote.result == 'Passed' ? '#017000]Passed' : vote.result == 'Failed' ? '#123456]Failed' : '#808080]' + vote.result}[/color][/td][/tr]`;
    tableVotes += '\n[/table]';

    let listDiscussions = '[list]'
    for(let discussion of REPORT_DETAILS.discussions) listDiscussions += '\n[*]' + (discussion.link != '' ? '[url=' + discussion.link + ']' + discussion.title + '[/url]' : discussion.title);
    listDiscussions += '\n[/list]';

    let tableDeparting = '[table=100]\n[tr][td][b]Forum Username[/b][/td][td][b]Nation in TSP[/b][/td][td][b]Reason[/b][/td][/tr]';
    for(let noncomplier of REPORT_DETAILS.legsDeparting) tableDeparting += `\n[tr][td]@${/[ \d]/g.test(noncomplier.forum) ? '\'' + noncomplier.forum + '\'' : noncomplier.forum}[/td][td][nation]${noncomplier.nation}[/nation][/td][td]${noncomplier.reason}[/td][/tr]`;
    tableDeparting += '\n[/table]';

    let listArriving = ' ';
    for(let arrival of REPORT_DETAILS.legsArriving) listArriving += ` | @${arrival.forum.includes(' ') ? '\'' + arrival.forum + '\'' : arrival.forum}`;

    let final = `${header}\n\n${votesHeader}\n\n${id('intro-votes').value}\n\n[spoiler=List of votes]\n${tableVotes}\n[/spoiler]\n\n${discussionsHeader}\n\n[spoiler=List of discussions active this past month]\n${listDiscussions}\n[/spoiler]\n\n${legCheckHeader}\n\n${legCheckIntro}\n\n${tableDeparting}\n\n${arrivalsHeader}\n\n${id('intro-arrivals').value}\n\n${listArriving.replace('  | ', '')}`;

    id('soa-out').value = final;
}

/**
 * Automatically parses the user input in the `add-votes` text area into `vote` objects and displays them in the votes table.
 */
function loadVotes() {
    let errorLabel = id('error-votes');
    errorLabel.innerText = '';
    for(let row of id('add-votes').value.split('\n')) {
        let data = row.split('\t');
        let vote = {
            code: data[0],
            title: data[1],
            result: data[3],
            link: ''
        };
        id('votes').appendChild(createTableRow(vote), 'V');
        REPORT_DETAILS.votes.push(vote);
        updateVoteCount();
    }
}

/**
 * Updates the saved `vote` object corresponding to the given votes table row.
 * @param {HTMLTableRowElement} row Row in the votes table where content was changed
 */
function updateVote(row) {
    REPORT_DETAILS.votes[row.rowIndex - 1] = parseToVote(row);
}

/**
 * Removes the `vote` object corresponding to the given votes table row.
 * @param {HTMLTableRowElement} row Row in the votes table to be deleted
 */
function removeVote(row) {
    REPORT_DETAILS.votes.splice(row.rowIndex - 1, 1);
    row.parentElement.removeChild(row);
    updateVoteCount();
}

/**
 * Adds a blank row to the votes table and saves a corresponding `vote` object in the REPORT_DETALS.
 */
function manualVote() {
    let blankVote = {code: '', title: '', result: 'Failed', link: ''};
    id('votes').appendChild(createTableRow(blankVote, 'V'));
    REPORT_DETAILS.votes.push(blankVote);
    updateVoteCount();
}

/**
 * Parses the given votes table row's content into a `vote` object.
 * @param {HTMLTableRowElement} row Row of the votes table to base the object on
 */
function parseToVote(row) {
    return {
        /**
         * @type {string}
         */
        code: row.children.item(0).firstChild.value,
        /**
         * @type {string}
         */
        title: row.children.item(1).firstChild.value,
        /**
         * @type {string}
         */
        result: row.children.item(2).firstChild.value,
        /**
         * @type {string}
         */
        link: row.children.item(3).firstChild.value
    };
}

/**
 * Updates the displayed number of votes registered to reflect the number of current internally registered votes.
 */
function updateVoteCount() {
    id('num-votes').innerText = REPORT_DETAILS.votes.length;
    id('smry-votes').innerText = REPORT_DETAILS.votes.length;
}

/**
 * [UNUSED]
 * Automatically parses the user input in the `add-discussion` text area into `discussion` objects and displays them in the discussions table.
 */
function loadDiscussions() {
    id('error-discussion').innerText = '';
    let input = id('add-discussion');
}

/**
 * Updates the saved `discussion` object corresponding to the given discussions table row.
 * @param {HTMLTableRowElement} row Row in the discussions table where content was changed
 */
function updateDiscussion(row) {
    REPORT_DETAILS.discussions[row.rowIndex - 1] = parseToDiscussion(row);
}

/**
 * Removes the `discussion` object corresponding to the given discussions table row.
 * @param {HTMLTableRowElement} row Row in the discussions table to be deleted
 */
function removeDiscussion(row) {
    REPORT_DETAILS.discussions.splice(row.rowIndex - 1, 1);
    row.parentElement.removeChild(row);
    updateDiscussionCount();
}

/**
 * Adds a blank row to the discussions table and saves a corresponding `discussion` object in the REPORT_DETALS.
 */
function manualDiscussion() {
    let blankDiscussion = {title: '', link: ''};
    id('discussions').appendChild(createTableRow(blankDiscussion, 'D'));
    REPORT_DETAILS.discussions.push(blankDiscussion);
    updateDiscussionCount();
}


/**
 * Parses the given votes table row's content into a `discussion` object.
 * @param {HTMLTableRowElement} row Row of the discussions table to base the object on
 */
function parseToDiscussion(row) {
    return {
        title: row.children.item(0).firstChild.value,
        link: row.children.item(1).firstChild.value
    };
}

/**
 * Updates the displayed number of discussions registered to reflect the number of current internally registered discussions.
 */
function updateDiscussionCount() {
    id('num-discussions').innerText = REPORT_DETAILS.discussions.length;
    id('smry-discussions').innerText = REPORT_DETAILS.discussions.length;
}

/**
 * Conducts a fully automatic Legislator Check on the given roster.
 * @param {string[]} roster The rows of the legislator roster. Cells of a row are separated by tabs
 */
async function legCheck(roster) {
    // Clear the Legislator Check table body, but ask for confirmation before
    let checkTable = id('noncompliant');
    let arrivalsTable = id('arrivals');
    if(checkTable.childNodes.length > 0) if(!window.confirm('The Legislator Check table already contains data, '
            + 'which will get erased when executing another Legislator Check. Are you sure you want to continue?')) return;
    else if(arrivalsTable.childNodes.length > 0) if(!window.confirm('The New Legislators table already contains data, '
    + 'which will get erased when executing another Legislator Check. Are you sure you want to continue?')) return;
    checkTable.childNodes.length = 0;

    let checkFails = [];    // The details of legislators failing the check...
    let arrivals = [];      // ...and those of newly arriving legislators

    // Load in the required column indexes
    let nameIndex = getIndex('forum', roster[NUM_HEADERS]),
        nationIndex = getIndex('nation', roster[NUM_HEADERS]),
        numVotesIndex = getIndex('num_votes', roster[NUM_HEADERS]),
        noteIndex = getIndex('notes', roster[NUM_HEADERS]);

    // Calculate how often a legislator must have voted to maintain their status
    let votesHeld = roster[NUM_HEADERS].split('\t').length - ROSTER_SCHEMA.length + 1,
        votesNeeded = votesHeld === 1 ? 0 : Math.ceil(votesHeld / 2);

    // Fetch a list of all nations and all regional ones to verify existence/residence
    let nationsList = await API.getNations(),
        residents = await API.getResidents('the_south_pacific');

    // Check every legislator for all compliance criteria
    for(let row of roster) {
        if(roster.indexOf(row) < NUM_HEADERS) continue;

        let cols = row.split('\t');
        let reason = undefined;
        let nationLookup = cols[nationIndex].toLowerCase().replace(/ /gm, '_');

        let vRequired = true;
        if(cols[noteIndex].toLocaleLowerCase().includes('new')) {
            let leg = {forum: cols[nameIndex]};
            arrivalsTable.appendChild(createTableRow(leg, 'A'));
            arrivals.push(leg);
            vRequired = false;
        }

        // If a compliance criterium is failed, register the reason, otherwise skip this legislator
        if(cols[noteIndex].toLowerCase().includes('resigned')) reason = 'Resigned';
        else if(!residents.includes(nationLookup)) reason = nationsList.includes(nationLookup) ? 'Nation moved out' : 'Nation CTEd';
        else if(vRequired && parseInt(cols[numVotesIndex]) < votesNeeded) reason = 'Failed Voting Requirement';
        else continue;

        // Create the noncompliance report and save it
        let failReport = {
            forum: cols[nameIndex], 
            nation: cols[nationIndex],
            reason: reason
        }
        checkFails.push(failReport);
        checkTable.appendChild(createTableRow(failReport, 'L'));
    }
    REPORT_DETAILS.legsDeparting = checkFails;
    REPORT_DETAILS.legsArriving = arrivals;
    updateFailingCount();
    updateArrivingCount();
}

/**
 * Updates the noncompliance report for a legislator.
 * @param {HTMLTableRowElement} row Table row of the Legislator Check table corresponding to the legislator
 */
 function updateFailingLegislator(row) {
    REPORT_DETAILS.legsDeparting[row.rowIndex - 1] = parseToReport(row);
}

/**
 * Removes the noncompliance report for a legislator completely and finally.
 * @param {HTMLTableRowElement} row Table row of the Legislator Check table to remove
 */
function removeFailingLegislator(row) {
    REPORT_DETAILS.legsDeparting.splice(row.rowIndex - 1, 1);
    row.parentElement.removeChild(row);
    updateFailingCount();
}

/**
 * Adds a blank row to the Legislator Check table and saves a corresponding noncompliance report.
 */
function manualFailingLegislator() {
    let blankFail = {forum: '', nation: '', reason: ''}
    id('noncompliant').appendChild(createTableRow(blankFail, 'L'));
    REPORT_DETAILS.legsDeparting.push(blankFail);
    updateFailingCount();
}

/**
 * Parses the content of the given row (laid out as the Legislator Check table) into a noncompliance report object.
 * @param {HTMLTableRowElement} row Row to extract the information from
 * @returns An object with the details of a legislator's noncompliance
 */
function parseToReport(row) {
    return {
        /**
         * @type {string}
         */
        forum: row.children.item(0).firstChild.value,
        /**
         * @type {string}
         */
        nation: row.children.item(1).firstChild.value,
        /**
         * @type {string}
         */
        reason: row.children.item(2).firstChild.value
    };
}

/**
 * Updates the displayed number of noncompliant legislators registered to reflect the number of current internally registered ones.
 */
function updateFailingCount() {
    id('num-fails').innerText = REPORT_DETAILS.legsDeparting.length;
    id('smry-fails').innerText = REPORT_DETAILS.legsDeparting.length;
}

/**
 * Updates the arrival report for a legislator.
 * @param {HTMLTableRowElement} row Row of the arrivals table corresponding to the legislator
 */
function updateArrivingLegislator(row) {
    REPORT_DETAILS.legsArriving[row.rowIndex - 1] = parseToReport(row);
}

/**
 * Removes the arrival report for a legislator completely and finally.
 * @param {HTMLTableRowElement} row Row of the arrivals table to remove
 */
function removeArrivingLegislator(row) {
    REPORT_DETAILS.legsArriving.splice(row.rowIndex - 1, 1);
    row.parentElement.removeChild(row);
    updateArrivingCount();
}

/**
 * Adds a blank row to the arrivals table and saves a corresponding arrival report.
 */
 function manualArrivingLegislator() {
    let blankLegislator = {forum: ''};
    id('arrivals').appendChild(createTableRow(blankLegislator, 'A'));
    REPORT_DETAILS.legsArriving.push(blankLegislator);
    updateArrivingCount();
}

/**
 * Parses the given arrivals table row's content into an arrival report.
 * @param {HTMLTableRowElement} row Row of the arrivals table to base the object on
 */
function parseToArrival(row) {
    return {
        /**
         * @type string
         */
        forum: row.children.item(0).firstChild.value
    };
}

/**
 * Updates the displayed number of arriving legislators registered to reflect the number of current internally registered ones.
 */
 function updateArrivingCount() {
    id('num-arrivals').innerText = REPORT_DETAILS.legsArriving.length;
    id('smry-arrivals').innerText = REPORT_DETAILS.legsArriving.length;
}

/**
 * 
 * @param {*} obj 
 * @param {string} temp 
 * @returns 
 */
 function createTableRow(obj, temp) {
    let appendRow = document.createElement('tr');
    for(let key in obj) {
        let cell = document.createElement('td');
        let textField = document.createElement('input');
        textField.type = 'text';
        textField.value = obj[key];

        textField.onblur = (ev) => temp == 'V' ? updateVote(ev.target.parentElement.parentElement) : temp == 'D' ? updateDiscussion(ev.target.parentElement.parentElement) : temp == 'A' ? updateArrivingLegislator(ev.target.parentElement.parentElement) : updateFailingLegislator(ev.target.parentElement.parentElement);
        cell.appendChild(textField);
        appendRow.appendChild(cell);
    }

    // Create the contents of the cell with the row manipulation actions
    let actionCell = document.createElement('td');

    let removeBtn = document.createElement('button');   // Button to remove a noncompliance report completely
    removeBtn.innerText = '✕';
    removeBtn.title = 'Remove';
    removeBtn.className = 'action-btn';
    removeBtn.onclick = (ev) => temp == 'V' ? removeVote(ev.target.parentElement.parentElement) : temp == 'D' ? removeDiscussion(ev.target.parentElement.parentElement) : temp == 'A' ? removeArrivingLegislator(ev.target.parentElement.parentElement) : removeFailingLegislator(ev.target.parentElement.parentElement);

    actionCell.appendChild(removeBtn);
    appendRow.appendChild(actionCell);
    return appendRow;
}
