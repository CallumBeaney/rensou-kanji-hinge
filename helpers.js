let firstStroke = 0;

function submitKanji(newKanji, buttonid)
{
    if (firstStroke === 0)
    {   
        // Clear the title 連想漢字蝶番 upon user input
        document.getElementById("outputboxes").innerHTML = "";
        firstStroke = 1;
    }


    /* These just let the user move to a different kanji if they get stuck/break up their kanji list */
    if (buttonid === "stopButton")
    {
        passKanji(newKanji);
        return;
    }
    if (buttonid === "commaButton")
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
        document.getElementById(buttonid).className = "resultbox failure";
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
            document.getElementById(buttonid).className = "resultbox pass"
            return;
        }
        else {
            document.getElementById(buttonid).className = "resultbox failure";
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
        document.getElementById("rb" + i).innerHTML = ""; 
    }

    // 1. Update new kanji div; 2. Update previous kanji list; 3. Scroll to bottom of output div.
    document.getElementById("nk").innerHTML = kanji;
    document.getElementById("outputboxes").innerHTML += '<button class="kanjiList" onclick="kanjiInfo(this.innerHTML)">' + kanji + '</button>';
    updateScroll();
}

function resetColours()
{
    for (i = 0; i < 6; i++) {
        document.getElementById("rb" + i).className = "resultbox raw";
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
    document.getElementById("overlayText").innerHTML = "<br>This is an app for practicing hand-writing kanji by linking their components. Write a kanji in the white box. Tap your kanji when it appears in one of the grey boxes to add it to the list. " 
    + "Tap ､ or ｡ to start a new sequence. 〒 to export. If you want to know more about a kanji, tap on it!"
    + "<br><br>" 
    + "例：虫虹工紅、寸吋囗吐土"
    + "<br></br>"
    + "<a href='https://callumbeaney.github.io/website/'>Callum Beaney</a> made this based on how he used to practice kanji on a notepad at work. The kanji dictionary is built from EDRDG's <a href='http://www.edrdg.org/wiki/index.php/KANJIDIC_Project'>KANJIDIC</a> & <a href='http://www.edrdg.org/krad/kradinf.html'>RADKFILE</a> and Shang's Kanji Frequency on Wikipedia <a href='https://docs.google.com/spreadsheets/d/18uV916nNLcGE7FqjWH4SJSxlvuT8mM4J865u0WvqlHU/edit#gid=0'>spreadsheet</a>. The canvas API is Chen-Yu Ho's <a href='https://www.chenyuho.com/project/handwritingjs/'>Handwriting.JS</a>. Read the <a href='https://github.com/CallumBeaney/rensou-kanji-hinge'>source code</a>.";

    turnOverlayOn();

    // ORIGINAL
    /* document.getElementById("overlayText").innerHTML = "<br>これは｢連想漢字蝶番｣、 部首を連想することで漢字の手習いの為の携帯サイトです。This is Associate Kanji Hinge, a mobile site for practicing writing by linking kanji radicals. <br><br>描きながら、直上の六つの四角に自動手書き認識ソフトは描いた漢字を推測します。選びが成功すれば、成功欄に追加されます。部首を共有する漢字を思い出せない場合｢、｣と｢。｣ボタンを押して新しい一連を始めます。The program will guess the kanji you write in the boxes immediately above the input box. Successful choices are added to the kanji column. Use the 、and 。buttons to start a new kanji sequence.<br><br>漢字の情報が欲しければ漢字を押してください。<br>If you want to know about a kanji, tap on it!<br><br>This was made by <a href='https://callumbeaney.github.io/website/'>Callum Beaney</a> based on how he used to practice kanji on a notepad at work. The reference dictionary is built from <a href='http://www.edrdg.org/wiki/index.php/KANJIDIC_Project'>KANJIDIC</a> dictionary, and <a href='http://www.edrdg.org/krad/kradinf.html'>RADKFILE/KRADFILE</a>. The canvas API is Chen-Yu Ho's <a href='https://www.chenyuho.com/project/handwritingjs/'>Handwriting.JS</a>. Read the <a href='https://github.com/CallumBeaney/rensou-kanji-hinge'>source code on Github</a>."; */
}



function kanjiInfo(kanji, mode)
{    
    // TODO: fix up kanjiInfo() and output() functions
    // TODO: ADD FURIGANA TO ON/KUN-YOMI
    // SEE: https://github.com/poisa/JVFurigana.js?files=1

    // for external output mode
    if (kanji === "。" || kanji === "、")
    {
        let toSend = [kanji];
        document.getElementById("overlayText").innerHTML += toSend;
        console.log(toSend);
        return;
    }

    /* -------------- DICTIONARY ENTRY HANDLING STARTS -------------- */

    let heisigIndex;
        if (dictionary[kanji].heisig === undefined) {   
            heisigIndex = ">3007th place"   
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
        if (dictionary[kanji].onyomiKanji === null){
            onyomiKanji = null;
        } else if (typeof dictionary[kanji].onyomiKanji === 'object') {
            onyomiKanji = dictionary[kanji].onyomiKanji.join("、");
        } else if (typeof dictionary[kanji].onyomiKanji === 'string') {
            onyomiKanji = dictionary[kanji].onyomiKanji;
        } 
        
    let onyomiKana;
        if (dictionary[kanji].onyomiKana === null){
            onyomiKana = null;
        } else if (typeof dictionary[kanji].onyomiKana === 'object') {
            onyomiKana =  dictionary[kanji].onyomiKana.join(", ");
        } else if (typeof dictionary[kanji].onyomiKana === 'string') {
            onyomiKana =  dictionary[kanji].onyomiKana;
        } 

    let kunyomiKanji;
        if (dictionary[kanji].kunyomiKanji === null){
            kunyomiKanji = null;
        } else if (typeof  dictionary[kanji].kunyomiKanji === 'object') {
            kunyomiKanji = dictionary[kanji].kunyomiKanji.join(", ");
        } else if (typeof  dictionary[kanji].kunyomiKanji === 'string') {
            kunyomiKanji = dictionary[kanji].kunyomiKanji;
        } 

    let kunyomiKana;
        if (dictionary[kanji].kunyomiKana === null){
            kunyomiKana = null;
        } else if (typeof dictionary[kanji].kunyomiKana === 'object') {
            kunyomiKana = dictionary[kanji].kunyomiKana.join(", ");
        } else if (typeof dictionary[kanji].kunyomiKana === 'string') {
            kunyomiKana = dictionary[kanji].kunyomiKana;
        } 

    /* _______________ DICTIONARY ENTRY HANDLING ENDS _______________ */


    if (mode === "externalOutput") // User wants to send themselves e.g. a CSV
    {
            let toSend = [kanji, translation, yomikata, bushu, dictionary[kanji].jikaku.toString(), dictionary[kanji].wiki.toString(), heisigIndex];    
            document.getElementById("overlayText").innerHTML += toSend;

            // TODO: sort sending -- https://stackoverflow.com/questions/3868315/invoke-click-a-mailto-link-with-jquery-javascript

            return;
    }
    else // mode is undefined --> user wants to know about a character
    {   
        // TABLE SYNTAX FROM: https://www.tablesgenerator.com/html_tables#
    
        let output = "<p style='font-size: 4.5rem; margin:0 auto;' align='center'>" + kanji + "</p><br>"
        + "<table class='tg'><tbody>"
        + "<tr>" + '<td class="tg-left">' + "発音" + "</td>" + '<td class="tg-right">' + yomikata + "</td>"
        + "<tr>" + '<td class="tg-left">' + "英語" + "</td>" + '<td class="tg-right">' + translation + "</td>"
        + "<tr>" + '<td class="tg-left">' + "部首" + "</td>" + '<td class="tg-right">' + bushu + "</td>"
        + "<tr>" + '<td class="tg-left">' + "字画" + "</td>" + '<td class="tg-right">' + dictionary[kanji].jikaku.toString() + "</td>"
        + "<tr>" + '<td class="tg-left">' + "Heisig" + "</td>" + '<td class="tg-right">' + heisigIndex + "</td>"
        + "<tr>" + '<td class="tg-left">' + "ウィキ" + "</td>" + '<td class="tg-right">' + dictionary[kanji].wiki.toString() + " 回出現する</td>";
        
        if (onyomiKanji != null)
        {
            output += "<tr>" + '<td class="tg-left">' + "音読み" + "</td>" + '<td class="tg-right">' + onyomiKanji + "</td>"
                    + "<tr>" + '<td class="tg-left">' + "・・・" + "</td>" + '<td class="tg-right">' + onyomiKana  + "</td>";
        }
        if (kunyomiKanji != null)
        {
            // TODO: turn back on after testing Github mobile view
            // output += "<tr>" + '<td class="tg-left">' + "訓読み" + "</td>" + '<td class="tg-right">' + kunyomiKanji + "</td>"
            //         + "<tr>" + '<td class="tg-left">' + "・・・" + "</td>" + '<td class="tg-right">' + kunyomiKana  + "</td>";
        } 

        // TODO: Figure out this furigana converter: https://github.com/Victor-Bernabe/nhg-ruby/blob/master/nhg-ruby.js
        //
        // if (onyomiKanji != null)
        // {
        //     // output += "<tr>" + '<td class="tg-left">' + "音読み" + "</td>" + '<td class="tg-right">'
        //     //         + '<div class="LitElement" style="display: flex; justify-content: space-between;">'
        //     //         +   '<nhg-ruby' + 'style="display: block;"'
        //     //         +       'furigana="' + onyomiKana  + '"'
        //     //         +       'text="'     + onyomiKanji + '">'
        //     //         +   '</nhg-ruby></div>'
        //     //         + '</td>';
        // }

        output += "</tbody></table>";
       
        document.getElementById("overlayText").innerHTML = output;
    }

    turnOverlayOn();
}


function output()
{   
    document.getElementById("overlayText").innerHTML = "";

    let elements = document.querySelectorAll('.kanjiList');    
    
    Array.from(elements).forEach((element, index) => {
        kanjiInfo(element.innerHTML, "externalOutput");
    });

    turnOverlayOn();
    
    // TODO: clipboard copy from <outputboxes>: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
}


/*  UI FUNCTIONS  */

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