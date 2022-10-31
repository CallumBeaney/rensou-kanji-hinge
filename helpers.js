 // GET BROWSER TYPE AND MAKE ALTERATIONS FOR IOS
 const os = (() => {
    if (/windows/i.test(navigator.userAgent)) {
        return "Windows";
    }
    else if (/iphone/i.test(navigator.userAgent) || /ipad/i.test(navigator.userAgent)) {
        constructGUI("IOS");
        return "IOS";
    }
    else if (/macintosh/i.test(navigator.userAgent)) {
        return "Mac OS";
    }
})();

// Use this when constructing HTML as a way to change large groups of _classes_ rather than ID-defined elements
const OS_VAL = os == "IOS" ? "IOS " : " ";

let firstInputCheck = 0;

function submitKanji(newKanji, buttonid)
{
    if (firstInputCheck === 0)
    {   
        // Clear the title 連想漢字蝶番 upon first user input
        document.getElementById("outputboxes").innerHTML = "";
        firstInputCheck = 1;
    }

    /* These just let the user move to a different kanji if they get stuck/break up their kanji list */
    if (buttonid === "stopButton" || buttonid === "commaButton")
    {
        passKanji(newKanji);
        return;
    }

    let prevKanji = document.getElementById("nk").innerHTML;
    if (prevKanji === newKanji) {
        // user has input same character twice
        return; 
    }

    // TODO: fix this
    //
    // if (prevKanji != "　") {    // pops last submitted kanji into the kanji list at the top
    //     document.getElementById("outputboxes").innerHTML += '<button class="kanjiList" onclick="kanjiInfo(this.innerHTML)">' + prevKanji + '</button>';
    // }


    let thisBushu = [];     // Need Array: not all kanji entries have >1 components 
    try
    {
        thisBushu = Array.from(dictionary[newKanji].bushu); 
    }
    catch(err) 
    {
        // Change CSS colour to red failure colour on <id=rb_> HTML objects?
        document.getElementById(buttonid).className = "resultbox" + OS_VAL + "failure";
        return;
    }

    const exceptions = ["　", "。", "、"];
    if (exceptions.includes(prevKanji))
    {
        passKanji(newKanji);
        return;
    }
    else
    {
        let prevBushu = Array.from(dictionary[prevKanji].bushu);

        let result = findCommonBushu(thisBushu, prevBushu);
        if (result == true)
        {
            passKanji(newKanji);
            document.getElementById(buttonid).innerHTML = newKanji;
            document.getElementById(buttonid).className = "resultbox" + OS_VAL + "pass"
            return;
        }
        else {
            document.getElementById(buttonid).className = "resultbox" + OS_VAL + "failure";
            return;
        }
    }
}


function passKanji(kanji)
{
    canvas.erase();
    resetColours(); 
    for (i = 0; i < 6; i++) {
        // Mustn't refactor this loop into resetColours() because that gets used by the HTML canvas Undo and Erase buttons
        document.getElementById("rb" + i).innerHTML = "　"; 
    }

    // 1. Update new kanji div; 2. Update previous kanji list; 3. Scroll to bottom of output div.
    document.getElementById("nk").innerHTML = kanji;
    document.getElementById("outputboxes").innerHTML += '<button class="kanjiList' + OS_VAL + '" onclick="kanjiInfo(this.innerHTML)">' + kanji + '</button>';
    updateScroll();
}

function resetColours()
{
    for (i = 0; i < 6; i++) {
        document.getElementById("rb" + i).className = "resultbox" + OS_VAL + "raw";
    }
}

function findCommonBushu(thisBushu, prevBushu) 
{
    /* Iterate through each element in the first array and if some of 
    them include the elements in the second　array then return true */
    return thisBushu.some(item => prevBushu.includes(item))
}    


function help()
{
    document.getElementById("overlayText").innerHTML = "<center style='font-size:1.4rem;'><fg t='連想'>RENSOU</fg> <fg t='漢字'>KANJI</fg> <fg t='蝶番'>HINGE</fg></center>"
    + "<br>This is a mobile webapp for practicing hand-writing kanji by chaining them by their shared components."
    + "<center><br>例：虫虹工紅、寸吋囗吐土<br><br></center>"
    + "Write a kanji in the white box. Tap your kanji when it appears in one of the grey boxes to add it to the list. " 
    + "Tap ､ or ｡ to start a new sequence. 〒 to export. If you want to know more about a kanji, tap on it!"
    + "<br></br>"
    + "<a href='https://callumbeaney.github.io/website/'>Callum Beaney</a> made this based on how he used to practice kanji on a notepad at work. The kanji dictionary is built from EDRDG's <a href='http://www.edrdg.org/wiki/index.php/KANJIDIC_Project'>KANJIDIC</a> & <a href='http://www.edrdg.org/krad/kradinf.html'>RADKFILE</a> and Shang's Kanji Frequency <a href='https://docs.google.com/spreadsheets/d/18uV916nNLcGE7FqjWH4SJSxlvuT8mM4J865u0WvqlHU/edit#gid=0'>spreadsheet</a>. The canvas API is Chen-Yu Ho's <a href='https://www.chenyuho.com/project/handwritingjs/'>Handwriting.JS</a>. Read the source code <a href='https://github.com/CallumBeaney/rensou-kanji-hinge'>here</a>. Report a bug <a href='https://github.com/CallumBeaney/rensou-kanji-hinge/issues'>here</a>.";

    turnOverlayOn();
}


function kanjiInfo(kanji, mode)             // TODO: fix up outputList() function
{    
    // for external output mode
    if (kanji === "。" || kanji === "、")
    {
        let toSend = [kanji];
        document.getElementById("overlayText").innerHTML += toSend;
        return;
    }

    /* -------------- DICTIONARY ENTRY HANDLING STARTS -------------- */

    let heisigIndex;
        if (dictionary[kanji].heisig === null || dictionary[kanji].heisig === undefined) {   
            heisigIndex = "unlisted"   
        } else { 
            heisigIndex = dictionary[kanji].heisig;   
        }

    let yomikata;
        if (typeof dictionary[kanji].yomikata === 'object') {
            yomikata = dictionary[kanji].yomikata.join("、");
        } else {
            yomikata = dictionary[kanji].yomikata;        
        }
                    
    let translation;
        if (typeof dictionary[kanji].eigo === 'object') {
            translation = dictionary[kanji].eigo.join(", ");
        } else {
            translation = dictionary[kanji].eigo;
        }

    let bushu;
        if (typeof dictionary[kanji].bushu === 'object') {
            bushu = dictionary[kanji].bushu.join(", ");
        } else {
            bushu = dictionary[kanji].bushu;
        }
        
    let onyomiKanji;
    let onyomiKana;
        if (dictionary[kanji].onyomiKana === null) {  // If .____Kana is X, so is .____Kanji 
            onyomiKanji = null;
            onyomiKana  = null;
        } else {
            onyomiKanji = dictionary[kanji].onyomiKanji;
            onyomiKana  = dictionary[kanji].onyomiKana;
        } 

    let kunyomiKanji;
    let kunyomiKana;
        if (dictionary[kanji].kunyomiKana === null) {  
            kunyomiKanji =  null; 
            kunyomiKana  =  null;
        } else {
            kunyomiKanji = dictionary[kanji].kunyomiKanji;
            kunyomiKana  = dictionary[kanji].kunyomiKana;
        } 

    /* _______________ DICTIONARY ENTRY HANDLING ENDS _______________ */


    if (mode === "externalOutput") // User wants to send themselves e.g. a CSV
    {
            // let toSend = [kanji, translation, yomikata, bushu, dictionary[kanji].jikaku.toString(), dictionary[kanji].wiki.toString(), heisigIndex];    
            // document.getElementById("overlayText").innerHTML += toSend;
            document.getElementById("overlayText").innerHTML = "<center style='font-size:1.4rem;'><br><br>in development<br>発展つつある</center>";

            // TODO: sort sending -- https://stackoverflow.com/questions/3868315/invoke-click-a-mailto-link-with-jquery-javascript

            return;
    }    
    else // mode is undefined --> user wants to know about a character
    {   
        // TABLE SYNTAX FROM: https://www.tablesgenerator.com/html_tables#
        
        let output = "<p style='font-size: 4.5rem; margin:0 auto;' align='center'>" + kanji + "</p><br>" 
                   + "<table class='tg'><tbody>"
                   + "<tr>" + '<td class="tg-left">' + "発音" + "</td>";

        if (typeof dictionary[kanji].yomikata === 'object' && dictionary[kanji].yomikata.length >= 7) 
        {   
            output += '<td class="tg-right smalltext">' + yomikata + "</td>";
        } else {
            output += '<td class="tg-right">' + yomikata + "</td>";
        }

        output += "<tr>" + '<td class="tg-left">' + "英語" + "</td>" + '<td class="tg-right">' + translation + "</td>"
                + "<tr>" + '<td class="tg-left">' + "部首" + "</td>" + '<td class="tg-right">' + bushu + "</td>"
                + "<tr>" + '<td class="tg-left">' + "字画" + "</td>" + '<td class="tg-right">' + dictionary[kanji].jikaku.toString() + "</td>"
                + "<tr>" + '<td class="tg-left">' + "Heisig" + "</td>" + '<td class="tg-right">' + heisigIndex + "</td>"
                + "<tr>" + '<td class="tg-left">' + "ウィキ" + "</td>" + '<td class="tg-right">' + dictionary[kanji].wiki.toString() + " 回出現する</td>";
        

        /* CONDITIONAL FURIGANA APPENDATION */
        /* Thanks to MysticWhiteDragon on SO for this HTML/CSS-only furigana solution: https://stackoverflow.com/a/54324347 */
        if (onyomiKanji != null)
        {
            let addToOutput = buildFurigana(onyomiKanji, onyomiKana, "音読み");
            output += addToOutput;
        }
        if (kunyomiKanji != null)
        {
            let addToOutput = buildFurigana(kunyomiKanji, kunyomiKana, "訓読み");
            output += addToOutput;
        } 
        
        output += "</tbody></table>"; // Closing tags for HTML table
        document.getElementById("overlayText").innerHTML = output;
    }

    turnOverlayOn();
}


function buildFurigana(kanji, kana, type)
{
    let adder = "<tr>"    // Start the left-hand of the table entry
              + '<td class="tg-left">' + type + "</td>";
                    
    if (typeof kanji === 'string') // have just one kanji dict entry
    {
        adder += '<td class="tg-right">' 
               + '<fg t="' + kana + '">' + kanji + '</fg>'
               + '</td>';
    }
    if (typeof kanji === 'object') // have multiple dict entries
    {    
        if (kanji.length >= 8) {
            adder += '<td class="tg-right smalltext">';
        } 
        else {
            adder += '<td class="tg-right">'; 
        }

        // Build the kanji-furigana pairs
        for (i = 0; i < kanji.length; i++) {
            adder += '<fg t="' + kana[i] + '"> ' + kanji[i] + '</fg>, ';
        }

        adder += '</td>'; // Close On/Kunyomi Kanji cell   
    }
     
    return adder;
}

// TODO: clipboard copy from <outputboxes>: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function outputList()
{   
    let query = ".kanjiList" + OS_VAL;
    let elements = document.querySelectorAll(query);    
    
    Array.from(elements).forEach((element, index) => {
        kanjiInfo(element.innerHTML, "externalOutput");
    });

    turnOverlayOn();    
}


/*  UI FUNCTIONS  */

function constructGUI(os) // This changes classes to iOS-centric ones should it be needed.
{
    document.getElementById("nk").className = "newestKanjiIOS";
    document.getElementById("commaButton").className =  "NKactionButtonIOS";
    document.getElementById("stopButton").className =  "NKactionButtonIOS";
    document.getElementById("upperHalf").className = "upperHalfIOS";
    document.getElementById("outputButton").className = "actionButtonIOS";
    document.getElementById("helpButton").className = "actionButtonIOS";
    document.getElementById("hiddenButton").className = "actionButtonIOS";

    let introText = ["連", "想", "漢", "字", "蝶", "番"];
    document.getElementById("outputboxes").innerHTML = "";
    
    for (i = 0; i < 6; i++)
    {   
        document.getElementById("outputboxes").innerHTML += '<button class="kanjiList' + os + '" onclick="kanjiInfo(this.innerHTML)">' + introText[i] + '</button>';
    }   
}

function updateScroll() 
{
    var element = document.getElementById("outputboxes");
    element.scrollTop = element.scrollHeight;
}

function turnOverlayOn() {
    document.getElementById("overlay").style.display = "block";
}
function turnOverlayOff() {
    document.getElementById("overlay").style.display = "none";
}