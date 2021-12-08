/*  
 * TRANSLATION OF https://github.com/slashme/parliamentdiagram/blob/master/newarch.py
 * INTO JAVASCRIPT, INCLUDING FUNCTIONALITY TWEAKS
 * AS PER https://github.com/slashme/parliamentdiagram/blob/master/LICENSE.md SECTION 2 -
 * WRITTEN 2021/04/30
 */ 

const TOTALS = [4, 15, 33, 61, 95, 138, 189, 247, 313, 388, 469, 559, 657, 762, 876, 997, 1126, 1263, 1408, 1560, 1722, 1889, 2066, 2250, 2442, 2641, 2850, 3064, 3289, 3519, 3759, 4005, 4261, 4522, 4794, 5071, 5358, 5652, 5953, 6263, 6581, 6906, 7239, 7581, 7929, 8287, 8650, 9024, 9404,
    9793, 10187, 10594, 11003, 11425, 11850, 12288, 12729, 13183, 13638, 14109, 14580, 15066, 15553, 16055, 16557, 17075, 17592, 18126, 18660, 19208, 19758, 20323, 20888, 21468, 22050, 22645, 23243, 23853, 24467, 25094, 25723, 26364, 27011, 27667, 28329, 29001, 29679, 30367, 31061];

// Functionally slightly tweaked version in order to draw results directly onto a JS canvas.
// The full original translation can be found down below.
function drawLegislators(inputlist) {
    if(inputlist == null) return;

    // initialize list of parties
    let partylist = [];

    // Keep a running total of the number of delegates in the diagram, for use later.
    let sumdelegates = 0;

    // error flag: This seems ugly, but what should I do?
    let error = false;

    for(let party of inputlist.split(/\s*;\s*/g)) {
        let datalist = [];
        for(let data of party.split(/\s*,\s*/g)) datalist.push(data);
        partylist.push(datalist);
    }

    for(let i of partylist) {
        if(i.length < 5) error = true;
        else if(/[^0-9]/.test(i[1])) error = true;
        else {
            i[1] = parseInt(i[1]) != NaN ? parseInt(i[1]) : 0;
            sumdelegates += i[1];
            if(sumdelegates > TOTALS[-1]) error = true;
        }
    }

    if(sumdelegates < 1 || error) return;

    // Figure out how many rows are needed:
    let rows = 1;
    for(let i = 0; i < TOTALS.length; i++) if(TOTALS[i] >= sumdelegates) {
        rows += i;
        break;
    }

    // Maximum radius of spot is 0.5/rows; leave a bit of space.
    let radius = 0.4 / rows;

    // Create list of centre spots
    let poslist = [];
    for(let i = 1; i < rows; i++) {
        // Each row can contain pi/(2asin(2/(3n+4i-2))) spots, where n is the number of rows and i is the number of the current row.
        // Fill each row proportionally to the "fullness" of the diagram, up to the second-last row.
        const J = Math.floor(1.0 * sumdelegates / TOTALS[rows - 1] *
            Math.PI / (2 * Math.asin(2.0 / (3.0 * rows + 4.0 * i - 2.0))));
        
        // The radius of the ith row in an N-row diagram (Ri) is (3*N+4*i-2)/(4*N)
        const R = (3.0 * rows + 4.0 * i - 2.0) / (4.0 * rows);

        if(J == 1) poslist.push([Math.PI / 2.0, 1.75 * R, R]);
        else for(let j = 0; j < J; j++) {
            // The angle to a spot is n.(pi-2sin(r/Ri))/(Ni-1)+sin(r/Ri) where Ni is the number in the arc
            // x=R.cos(theta) + 1.75
            // y=R.sin(theta)
            let angle = (1.0 * j *
                        (Math.PI - 2.0 * Math.sin(radius / R)) /
                        (1.0 * J - 1.0) + Math.sin(radius / R));
            poslist.push([angle, R * Math.cos(angle) + 1.75, R * Math.sin(angle)]);
        }
    }

    // Now whatever seats are left go into the outside row:
    const J = sumdelegates - poslist.length;
    const R = (7.0 * rows - 2.0) / (4.0 * rows);
    if(J == 1) poslist.push([Math.PI / 2.0, 1.75 * R, R]);
    else for(let j = 0; j < J; j++) {
        let angle = (1.0 * j *
                    (Math.PI - 2.0 * Math.sin(radius / R)) /
                    (1.0 * J - 1.0) + Math.sin(radius / R));
        poslist.push([angle, R * Math.cos(angle) + 1.75, R * Math.sin(angle)]);
    }
    poslist.sort((a, b) => {return b[0] - a[0]});

    let counter = -1;    // How many spots have we drawn?
    for(let i = 0; i < partylist.length; i++) {

        CTX.fillStyle = `${partylist[i][2]}`;
        CTX.strokeStyle = `${partylist[i][4]}`
        for(let c = counter + 1; c < counter + partylist[i][1] + 1; c++) {
            CTX.beginPath();
            CTX.arc((poslist[c][1] * 100.0 + 5.0).toFixed(2), 
                    (100.0 * (1.75 - poslist[c][2]) + 5.0 + 62).toFixed(2),
                    (radius * 100.0 * (1.0 - partylist[i][3] / 2.0)).toFixed(2),
                    0, 2 * Math.PI);
            CTX.fill();
            CTX.stroke();
        }
        counter += partylist[i][1];
    }
}

// Functionally identical translation of the original parliament diagram creator.
function createSVG(inputlist) {
    if(inputlist == null) return;

    // initialize list of parties
    let partylist = [];

    // Keep a running total of the number of delegates in the diagram, for use later.
    let sumdelegates = 0;

    // error flag: This seems ugly, but what should I do?
    let error = false;

    for(let party of inputlist.split(/\s*;\s*/g)) {
        let datalist = [];
        for(let data of party.split(/\s*,\s*/g)) datalist.push(data);
        partylist.push(datalist);
    }

    for(let i of partylist) {
        if(i.length < 5) error = true;
        else if(/[^0-9]/.test(i[1])) error = true;
        else {
            i[1] = parseInt(i[1]) != NaN ? parseInt(i[1]) : 0;
            sumdelegates += i[1];
            if(sumdelegates > TOTALS[-1]) error = true;
        }
    }

    if(sumdelegates < 1 || error) return;

    // Initialize counters for use in layout
    let spotcounter = 0, lines = 0;

    // Figure out how many rows are needed:
    let rows = 1;
    for(let i = 0; i < TOTALS.length; i++) if(TOTALS[i] >= sumdelegates) {
        rows += i;
        break;
    }

    // Maximum radius of spot is 0.5/rows; leave a bit of space.
    let radius = 0.4 / rows;

    // Write svg header:
    let out = '<svg xmlns:svg="http://www.w3.org/2000/svg"\n'
            + 'xmlns="http://www.w3.org/2000/svg" version="1.1"\n'
    // Make 350 px wide, 175 px high diagram with a 5 px blank border
            + 'width="360" height="185">\n'
            + '<!-- Created with the Wikimedia parliament diagram creator (https://parliamentdiagram.toolforge.org/parlitest.php) -->\n'
    // Print the number of seats in the middle at the bottom.
            + '<g>\n'
            /* + '<text x="175" y="175" style="font-size:36px;font-weight:bold;text-align:center;text-anchor:middle;font-family:Semplicita,sans-serif;">' + sumdelegates + '</text>\n' */
            ;
    
    // Create list of centre spots
    let poslist = [];
    for(let i = 1; i < rows; i++) {
        // Each row can contain pi/(2asin(2/(3n+4i-2))) spots, where n is the number of rows and i is the number of the current row.
        // Fill each row proportionally to the "fullness" of the diagram, up to the second-last row.
        const J = Math.floor(1.0 * sumdelegates / TOTALS[rows - 1] *
            Math.PI / (2 * Math.asin(2.0 / (3.0 * rows + 4.0 * i - 2.0))));
        
        // The radius of the ith row in an N-row diagram (Ri) is (3*N+4*i-2)/(4*N)
        const R = (3.0 * rows + 4.0 * i - 2.0) / (4.0 * rows);

        if(J == 1) poslist.push([Math.PI / 2.0, 1.75 * R, R]);
        else for(let j = 0; j < J; j++) {
            // The angle to a spot is n.(pi-2sin(r/Ri))/(Ni-1)+sin(r/Ri) where Ni is the number in the arc
            // x=R.cos(theta) + 1.75
            // y=R.sin(theta)
            let angle = (1.0 * j *
                        (Math.PI - 2.0 * Math.sin(radius / R)) /
                        (1.0 * J - 1.0) + Math.sin(radius / R));
            poslist.push([angle, R * Math.cos(angle) + 1.75, R * Math.sin(angle)]);
        }
    }

    // Now whatever seats are left go into the outside row:
    const J = sumdelegates - poslist.length;
    const R = (7.0 * rows - 2.0) / (4.0 * rows);
    if(J == 1) poslist.push([Math.PI / 2.0, 1.75 * R, R]);
    else for(let j = 0; j < J; j++) {
        let angle = (1.0 * j *
                    (Math.PI - 2.0 * Math.sin(radius / R)) /
                    (1.0 * J - 1.0) + Math.sin(radius / R));
        poslist.push([angle, R * Math.cos(angle) + 1.75, R * Math.sin(angle)]);
    }
    poslist.sort((a, b) => {return b[0] - a[0]});

    let counter = -1;    // How many spots have we drawn?
    for(let i = 0; i < partylist.length; i++) {
        // Make each party's blocks an svg group
        let sanitizedpartyname = i + '_' + partylist[i][0].replace(/[^a-zA-Z0-9_-]+/g, '-');
        let tempstring = `  <g style="fill:${partylist[i][2]}; stroke-width:${(100.0 * radius * partylist[i][3]).toFixed(2)}; stroke:${partylist[i][4]}" id="${sanitizedpartyname}">`;
        out += tempstring + '\n';
        for(let c = counter + 1; c < counter + partylist[i][1] + 1; c++) {
            tempstring = `    <circle cx="${(poslist[c][1] * 100.0 + 5.0).toFixed(2)}" cy="${(100.0 * (1.75 - poslist[c][2]) + 5.0).toFixed(2)}" r="${(radius * 100.0 * (1.0 - partylist[i][3] / 2.0)).toFixed(2)}"/>`;
            out += tempstring + '\n';
        }
        counter += partylist[i][1];
        out += '  </g>\n';
    }

    return out += '</g>\n'
            + '</svg>\n';
}