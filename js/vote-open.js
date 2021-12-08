/* 
 * 
 */

function generate() {
    let finish = calculateVoteFinish();
    createForumContent(finish);

    let votingThread = 'PUT URL OF VOTING THREAD HERE ONCE POSTED';
    createDispatchContent(finish, votingThread);
    createDiscordContent(finish, votingThread);
}

/**
 * Creates a ready-to-paste string of BBCode for the TSP forum, containing all legal requirements for opening a vote
 * as well as some quality-of-life information for legislators.
 * @param {Date} finish `Date` object for the vote's conclusion, as calculated before
 */
function createForumContent(finish) {
    let header = `Legislators of the South Pacific,`;
    let introduction = `There has been a seconded motion to bring ${id('is-amendment').checked ? 'an amendment to the [url=#law-thread][b]#btitle[/b][/url]' : id('is-repeal').checked ? 'the repeal of the [url=#law-thread][b]#btitle[/b][/url]' : 'the [b]#btitle[/b]'} to vote. The debate thread can be found [url=${id('debate').value}]here[/url].`
        .replace(/#law-thread/gm, id('law-thread').value)
        .replace(/#btitle/gm, id('btitle').value);
    let legalstuff = `This is #btype, thus concluding on #vote-end.`
        .replace(/#btype/gm, (id('is-amendment').checked ? 'an amendment to ' : id('is-repeal').checked ? 'a repeal of ' : '') + formatType(id('btype').value))
        .replace(/#vote-end/gm, `[url=https://www.timeanddate.com/countdown/generic?iso=${finish.getUTCFullYear()}${finish.getUTCMonth() > 8 ? finish.getUTCMonth() + 1 : '0' + (finish.getUTCMonth() + 1)}${finish.getUTCDate() > 9 ? finish.getUTCDate() : '0' + finish.getUTCDate()}T${finish.getUTCHours() > 9 ? finish.getUTCHours() : '0' + finish.getUTCHours()}${finish.getUTCMinutes() > 9 ? finish.getUTCMinutes() : '0' + finish.getUTCMinutes()}&p0=1440&msg=End%20of%20Vote%20-%20${encodeURI(id('is-amendment').checked ? 'Amendment to the ' : id('is-repeal').checked ? 'Repeal of the ' : '')}${encodeURI(id('btitle').value)}&font=slab&csz=1][b]${formatDate(finish)} UTC[/b][/url] (${convertDate(finish, 'Europe/London')} in London, ${convertDate(finish, 'America/New_York')} in New York, ${convertDate(finish, 'Australia/Sydney')} in Sydney)`);
    let instructions = `Please vote by poll if possible. If you cannot vote by poll, post 'Aye', 'Nay' or 'Abstain' in this thread. Please do not vote both by poll and by post. Comments and discussions belong in the debate thread and should be posted there.`;
    let editNotice = `[size=small][b]Notice:[/b] In line with the Law Standards Act (Article 5, Section 2), the bill was edited at the Chair's discretion before bringing it to vote so it complies with formatting guidelines.[/size]`;
    
    id('out-forum').value = `${header}\n\n${introduction}\n\n${legalstuff}\n\n${instructions}\n\n[bill]${id('btext').value}[/bill]${id('is-edited').checked ? '\n' + editNotice : ''}`;
}

/**
 * Creates a ready-to-paste string of BBCode for a NationStates dispatch, containing relevant information on the new
 * vote for gameside legislators who aren't on Discord.
 * @param {Date} finish `Date` object for the vote's conclusion, as calculated before
 */
function createDispatchContent(finish, votingThread) {
    let header = `[box][background-block=#019AED][center][color=#019AED].[/color]\n[img]https://i.imgur.com/XAFiNmu.png[/img]\n[font=Avenir, Segoe UI][size=300][color=#FFFFFF][b]Assembly Announcement[/b][/color][/size][/font]\n[color=#019AED].[/color][/center][/background-block]`;
    let introduction = `[font=Avenir, Segoe UI][align=justify][size=120]Legislators,[/size][/align][/font]\n\n[font=Avenir, Segoe UI][align=justify][size=120]${id('is-amendment').checked ? 'An amendment to the [url=#law-thread][color=#FF9900][b]#btitle[/b][/color][/url] to #bpurpose' : id('is-repeal').checked ? 'The repeal of the [url=#law-thread][color=#FF9900][b]#btitle[/b][/color][/url]' : 'The [color=#FF9900][b]#btitle[/b][/color]'} has been brought to vote.[/size][/align][/font]`
        .replace(/#law-thread/gm, id('law-thread').value)
        .replace(/#btitle/gm, id('btitle').value)
        .replace(/#bpurpose/gm, id('bpurpose').value);
    let links = `[font=Avenir, Segoe UI][align=justify][size=120]The debate thread can be found [url=#debate][color=#FF9900][b]here[/b][/color][/url].[/size][/align][/font]\n\n[font=Avenir, Segoe UI][align=justify][size=120]The voting thread can be found [url=#voting][color=#FF9900][b]here[/b][/color][/url].[/size][/align][/font]`
        .replace(/#debate/gm, id('debate').value)
        .replace(/#voting/gm, votingThread);
    let timing = `[font=Avenir, Segoe UI][align=justify][size=120]The voting period will be ${finish.getDate() - new Date().getDate()} days, closing on #vote-end.[/size][/align][/font]`
        .replace(/#vote-end/gm, `[url=https://www.timeanddate.com/countdown/generic?iso=${finish.getUTCFullYear()}${finish.getUTCMonth() > 8 ? finish.getUTCMonth() + 1 : '0' + (finish.getUTCMonth() + 1)}${finish.getUTCDate() > 9 ? finish.getUTCDate() : '0' + finish.getUTCDate()}T${finish.getUTCHours() > 9 ? finish.getUTCHours() : '0' + finish.getUTCHours()}${finish.getUTCMinutes() > 9 ? finish.getUTCMinutes() : '0' + finish.getUTCMinutes()}&p0=1440&msg=End%20of%20Vote%20-%20${encodeURI(id('is-amendment').checked ? 'Amendment to the ' : id('is-repeal').checked ? 'Repeal of the ' : '')}${encodeURI(id('btitle').value)}&font=slab&csz=1][color=#FF9900][b]${formatDate(finish)} UTC[/b][/color][/url]`);
    let footer = `[align=center][background-block=#019AED][font=Avenir, Segoe UI][size=120]\n[img]https://i.imgur.com/W4ZLFzq.png[/img]\n[color=#019AED]·[/color][/size][/font][/background-block][background-block=#0080C4]\n[color=#0080C4]·[/color]\n[url=https://www.nationstates.net/region=the_south_pacific][img]https://i.imgur.com/NYenHvV.png[/img][/url][color=#0080C4]—[/color][url=https://discord.gg/tEyyDyh][img]https://i.imgur.com/JyO4OrT.png[/img][/url][color=#0080C4]—[/color][url=https://tspforums.xyz/][img]https://i.imgur.com/SEpkSix.png[/img][/url]\n[color=#0080C4]·[/color]\n[color=#0080C4]·[/color]\n[/background-block][/align][/box]`;
    
    let roster = id('roster').value.split('\n');
    let indexNation = getIndex('nation', roster[NUM_HEADERS])
    let leglist = '[spoiler=List of legislators]';
    for(let legislator of roster) 
        if(roster.indexOf(legislator) < NUM_HEADERS) continue;
        else leglist += `\n[nation]${legislator.split('\t')[indexNation]}[/nation]`
    leglist += '\n[/spoiler]';

    id('out-dispatch').value = `${header}\n\n[hr]\n\n${introduction}\n\n${links}\n\n${timing}\n\n[hr]\n\n${leglist}\n\n[hr]\n\n${footer}`;
}

/**
 * Creates a ready-to-paste string of markup for Discord, containing relevant information on the new vote for legislators
 * who are on the regional Discord server and pinging them.
 * @param {Date} finish `Date` object for the vote's conclusion, as calculated before
 */
function createDiscordContent(finish, votingThread) {
    let header = `@Legislators,`;
    let introduction = `#btype#bpurpose has been brought to vote. The voting period will be ${finish.getDate() - new Date().getDate()}, ending on #vote-end.`
        .replace(/#btype/gm, (id('is-amendment').checked ? 'An amendment to the ' : id('is-repeal').checked ? 'The repeal of the ' : 'The ') + id('btitle').value)
        .replace(/#bpurpose/gm, id('is-amendment').checked ? ' to ' + id('bpurpose').value : '')
        .replace(/#vote-end/gm, `${formatDate(finish)} UTC`);
    let links = `Debate thread: #debate\nVoting thread: #voting`
        .replace(/#debate/gm, id('debate').value)
        .replace(/#voting/gm, votingThread);

    id('out-discord').value = `${header}\n${introduction}\n${links}`;
}

/**
 * Calculates the day and time of the new vote's conclusion. For this, the next full half hour is taken as reference,
 * to which the legally mandated amount of days of voting time is then added.
 * @returns {Date} The calculated date of the vote's conclusion
 */
function calculateVoteFinish() {
    let now = new Date();

    if(now.getUTCMinutes() > 30) {
        now.setUTCMinutes(0);
        now.setUTCHours(now.getUTCHours() + 1);
    } else now.setUTCMinutes(30);

    let billType = id('btype').value;
    let daysToAdd = 0;
    if(billType == 'law-general' || billType == 'res-general') daysToAdd = MOTION_TYPES.general.debate;
    else if(billType == 'law-constitutional' || billType == 'res-constitutional') daysToAdd = MOTION_TYPES.constitutional.debate;
    else if(billType == 'treaty') daysToAdd = MOTION_TYPES.treaty.debate;
    else if(billType == 'crs') daysToAdd = MOTION_TYPES.appointment_crs.debate;
    else if(billType == 'court'|| billType == 'legcomm') daysToAdd = MOTION_TYPES.appointment.debate;
    else if(billType == 'recall') daysToAdd = MOTION_TYPES.recall.debate;

    now.setUTCDate(now.getUTCDate() + daysToAdd);
    console.log(now);
    return now;
}

/**
 * Formats the given `Date` object into a neat string.
 * @param {Date} date The date to format
 * @returns {string} The given date, as string of the schema `[day] [month] at [hour]:[minute]`
 */
function formatDate(date) {
    return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'long'
    }) + ' at ' + date.toLocaleString('en-US', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit'
    });
}

/**
 * Converts the given date to its equivalent in the given time zone and formats it into a neat string.
 * @param {Date} date The date to convert
 * @param {string} target Identification of the time zone to convert to
 * @returns {string} The converted date, as string of the schema `[hour]:[minute] (on the [day])<only if resulting in a different day>`
 */
function convertDate(date, target) {
    let ret = date.toLocaleString('en-US', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        timeZone: target
    });
    if(date.getUTCDate() != date.toLocaleString('en-US', {timeZone: target, day: 'numeric'})) ret += ' on ' + date.toLocaleString('en-US', {timeZone: target, day: 'numeric', month: 'short'});
    return ret;
}

/**
 * Selects the appropriate description (containing the voting time and majority requirement) of the given bill type.
 * @param {string} billType The bill type to get information for, as selected in the #btype `<select>` element
 * @returns {string} A string with the legal details of the given bill type
 */
function formatType(billType) {
    switch(billType.toLowerCase()) {
        case 'law-general': return `general legislation, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.general.passage*100}% to pass. The voting period will be ${MOTION_TYPES.general.debate} days`;
        case 'law-constitutional': return `constitutional legislation, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.constitutional.passage*100}% to pass. The voting period will be ${MOTION_TYPES.constitutional.debate} days`;
        case 'treaty': return `a treaty, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.treaty.passage*100}% to pass. The voting period will be ${MOTION_TYPES.treaty.debate} days`;
        case 'res-general': return `a resolution on general matters, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.general.passage*100}% to pass. The voting period will be ${MOTION_TYPES.general.debate} days`;
        case 'res-constitutional': return `a resolution on constitutional matters, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.constitutional.passage*100}% to pass. The voting period will be ${MOTION_TYPES.constitutional.debate} days`;
        case 'crs': return `an appointment to the CRS, according to the Charter requiring a majority greater than ${MOTION_TYPES.appointment_crs.passage*100}% to pass. The voting period will be ${MOTION_TYPES.appointment_crs.debate} days`;
        case 'court': return `an appointment to the High Court, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.appointment.passage*100}% to pass. The voting period will be ${MOTION_TYPES.appointment.debate} days`;
        case 'legcomm': return `an appointment to the Legislator Committee, according to the Legislative Procedure Act requiring a majority greater than ${MOTION_TYPES.appointment.passage*100}% to pass. The voting period will be ${MOTION_TYPES.appointment.debate} days`;
        case 'recall': return `a recall vote, according to the Charter requiring a majority greater than ${MOTION_TYPES.recall.passage*100}% to pass. The voting period will be ${MOTION_TYPES.recall.debate} days`;
    }
}

/**
 * Un-checks the #is-repeal element, and requests an update of the #law-thread-container's visibility.
 */
function updateIsAmendment() {
    id('is-repeal').checked = false;
    updateInputOriginalVisible();
}

/**
 * Un-checks the #is-amendment element, and requests an update of the #law-thread-container's visibility.
 */
function updateIsRepeal() {
    id('is-amendment').checked = false;
    updateInputOriginalVisible();
}

/**
 * Updates the #law-thread-container's visibility - if at least one of the #is-amendment and the #is-repeal
 * element is checked, the container is set to visible, otherwise it gets hidden.
 */
function updateInputOriginalVisible() {
    id('law-thread-container').hidden = !(id('is-amendment').checked || id('is-repeal').checked);
}

/**
 * Updates the visibility of the #is-repeal and #is-amendment elements in order to avoid appointments and
 * recalls being marked as repeal or amendment bill.
 */
function updateLegislationOptionsVisible() {
    let type = id('btype').value;
    let hide = type == 'crs' || type == 'court' || type == 'legcomm' || type == 'recall';
    id('legislation-options').hidden = hide;
    if(hide) {
        id('law-thread-container').hidden = true;
        id('is-amendment').checked = false;
        id('is-repeal').checked = false;
    }
}