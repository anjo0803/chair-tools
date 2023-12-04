/* 
 *
 */

/**
 * @type CanvasRenderingContext2D
 */
const CTX = document.getElementById('result-img').getContext('2d');

function generate() {

    // Count the votes
    let ballots = {};
    let tally = {
        aye: 0,
        nay: 0,
        abstain: 0
    }
    for(let ballot in tally) {
        let votes = 0;
        for(let legislator of id('v' + ballot).value.split(', ')) {
            if(legislator.length == 0) continue;
            ballots[legislator] = ballot;
            votes++;
        }
        tally[ballot] = votes;
    }

    // Count the number of legislators and create the pasteable vote list for the spreadsheet
    let roster = id('roster').value.split('\n');
    let numLegs = 0;
    let pasteVotesList = '';
    let nameIndex = getIndex('forum', roster[NUM_HEADERS]);
    for(let row of roster) {
        if(roster.indexOf(row) < NUM_HEADERS) continue;
        pasteVotesList += '\n';
        let cells = row.split('\t');
        pasteVotesList += ballots[cells[nameIndex]] === undefined ? '' : capitalizeFirst(ballots[cells[nameIndex]]);
        numLegs++;
    }

    let billTitle = id('btitle').value;
    let billCode = id('bcode').value;
    let threshold = parseFloat(id('threshold').value * .01);
    tally.absent = numLegs - tally.aye - tally.nay - tally.abstain;
    console.log(tally);

    createVisual(billCode, threshold, tally);
    id('bbcode-out').value = `[table=100][tr][tdc="2"][align=center][color=#109aed][size=xx-large][b]Final Result[/b][/size]\n[i]${billTitle}[/i][/color][/align][/tdc][/tr][tr][tdc="2"][align=center][img]ENTER LINK TO IMAGE AFTER UPLOAD HERE[/img][/align][/tdc][/tr][tr][td][align=center][color=#4572A7][size=large][b]Ayes: ${tally.aye}[/b][/size][/color][/align]\n[i]${(100.0 * tally.aye / (numLegs - tally.absent)).toFixed(1)}% | ${(100.0 * tally.aye / (tally.aye + tally.nay)).toFixed(1)}% (discounting abstentions)[/i][/td][td][align=center][color=#AA4643][size=large][b]Nays: ${tally.nay}[/b][/size][/color][/align]\n[i]${(100.0 * tally.nay / (numLegs - tally.absent)).toFixed(1)}% | ${(100.0 * tally.nay / (tally.aye + tally.nay)).toFixed(1)}% (discounting abstentions)[/i][/td][/tr][tr][tdc="2"]There were ${tally.abstain} Abstentions (${(100.0 * tally.abstain / (numLegs - tally.absent)).toFixed(1)}%); ${tally.absent} legislators were absent. Thus, attendance for this vote was ${(100.0 * (numLegs - tally.absent) / numLegs).toFixed(1)}%.[/tdc][/tr][tr][tdc="2"][size=medium]In light of these results, the proposal [color=` + (tally.aye >= (tally.aye + tally.nay) * threshold ? '#017000][b]passes[/b][/color], having achieved' : '#C0392B][b]fails[/b][/color], having fallen short of') + ` the required majority (>${threshold * 100}%).[/size][/tdc][/tr][/table]`;
    id('paste-votes').value = pasteVotesList.replace('\n', '');
}

// Paint a visual representation of the voting results.
function createVisual(voteID, threshold, tally) {
    
    CTX.beginPath();
    CTX.clearRect(0, 0, CTX.width, CTX.height);
    CTX.closePath();

    // Draw the static background image.
    CTX.drawImage(document.getElementById('bg'), 0, 0);

    // Draw the diagrams
    let toThreshold = 258.0 * threshold;
    CTX.moveTo(51 + toThreshold, 256);
    CTX.lineTo(51 + toThreshold, 264);
    CTX.stroke();
    CTX.moveTo(51 + toThreshold, 284);
    CTX.lineTo(51 + toThreshold, 292);
    CTX.stroke();
    paintArch(tally);
    paintBar(tally);


    // Add a title either saying [voteID] PASSED/FAILED
    CTX.font = 'bold 36px Semplicita';
    CTX.textAlign = 'center';
    CTX.fillText(voteID + (tally.aye / (tally.aye + tally.nay) > threshold ? ' PASSED' : ' FAILED'), 180, 41);

    let img = document.createElement('img');
    img.setAttribute('src', document.getElementById('result-img').toDataURL('image/png'));
    document.getElementById('img-gen').appendChild(img);
}

// Paint an arch diagram depicting the vote tally and an
// indicator of how many votes were cast onto the canvas.
function paintArch(tally) {
    
    // Use the tweaked parliament diagram creator to draw an arch
    // diagram of legislators with their stances
    drawLegislators(`Aye, ${tally.aye}, #4572A7, 0.2, #FFFFFF; `
            + `Nay, ${tally.nay}, #AA4643, 0.2, #FFFFFF; `
            + `Abstain, ${tally.abstain}, #FF9900, 0.2, #FFFFFF; `
            + `Absent, ${tally.absent}, #989898, 0.2, #FFFFFF`);

    // Paint number of legislators
    CTX.textAlign = 'center';
    CTX.fillStyle = 'white';
    CTX.font = 'bold 36px Semplicita';
    CTX.fillText((tally.aye + tally.nay + tally.abstain + tally.absent).toString(), 180, 220);
    CTX.font = '14px Semplicita';
    CTX.fillText(`${tally.aye + tally.nay + tally.abstain} PRESENT`, 180, 240);
}

// Paint a bar pitching solely aye and nay votes against
// each other below the arch diagram.
function paintBar(tally) {

    // Calculate up to which pixel the aye bar will go
    let toPx = Math.round(258.0 * tally.aye / (tally.aye + tally.nay));

    // Paint the aye bar
    CTX.fillStyle = '#4572A7';
    CTX.fillRect(51, 265, toPx, 18);

    // Paint the percentage
    CTX.font = '16px Semplicita';
    CTX.fillStyle = 'white';
    CTX.textAlign = 'right';
    CTX.fillText(`${tally.aye}`, 40, 280);
    if(tally.aye > tally.nay) {
        CTX.fillText(`${(100.0 * tally.aye / (tally.aye + tally.nay)).toFixed(1)}%`, toPx + 45, 280);
        CTX.textAlign = 'left';
    } else {
        CTX.textAlign = 'left';
        CTX.fillText(`${(100.0 * tally.nay / (tally.aye + tally.nay)).toFixed(1)}%`, toPx + 55, 280);
    }
    CTX.fillText(`${tally.nay}`, 320, 280);
}