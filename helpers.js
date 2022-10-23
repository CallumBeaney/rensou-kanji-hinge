function submitKanji(newKanji, buttonid)
{

    /* These just let the user move to a different kanji if they get stuck and break up their kanji list */
    if (buttonid === "stopButton")  // 。 button
    {
        passKanji(newKanji);
        return;
    }
    if (buttonid === "commaButton")  // 、 button
    {
        passKanji(newKanji);
        return;
    }

    let prevKanji = document.getElementById("nk").innerHTML;
    if (prevKanji === newKanji) {    // user has input same character twice
        return; 
    }

    // TODO: fix this
    //
    // if (prevKanji != "　") {    // pops last submitted kanji into the kanji list at the top
    //     document.getElementById("outputboxes").innerHTML += '<button class="kanjiList" onclick="kanjiInfo(this.innerHTML)">' + prevKanji + '</button>';
    // }


    let thisBushu = [];     // Need Array: not all kanji have >1 components 
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
        // Mustn't move this into resetColours() because that gets used by the HTML canvas Undo and Erase buttons
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

function updateScroll() 
{
    var element = document.getElementById("outputboxes");
    element.scrollTop = element.scrollHeight;
}

function help()
{
    // TODO: popup window &/ canvas simulation
    turnOverlayOn();
    document.getElementById("overlayText").innerHTML = "<br>これは「連想漢字蝶番」即ち ｢Associative Kanji Hinge｣、 漢字の部首を連想することで日本語漢字の手習いの為の携帯サイトです。<br>This is Associative Kanji Hinge, or '連想漢字蝶番', a mobile site for learning Chinese characters used in Japanese by drawing associations between their sub-components or 'radicals'. <br><br>白いボックスに描きながら、直上の六つの四角に自動手書き認識ソフトはあなたが描いた漢字を推測します。選びが成功すれば、成功欄に追加されます。部首を共有する漢字を思い出せない場合「、」と「。」ボタンを押して新しい一連を始めます。<br>Automatic handwriting recognition software will guess the kanji you write and give suggestions in the six boxes immediately above the input box. Successful choices will be added to the kanji column. Use the 、and 。buttons when you can't think of any more valid characters to start a new sequence.<br><br>漢字の情報が欲しければ漢字を押してください。<br>If you want to know about a kanji, tap on it!<br><br>ABOUT<br><p style='font-size:0.8rem;'>This program was conceived and written by <a href='https://callumbeaney.github.io/website/'>Callum Beaney</a> based on how he used to practice kanji on a notepad at work, writing as many as he could remember by linking them together. The reference dictionary is primarily built from EDRDG's <a href='http://www.edrdg.org/wiki/index.php/KANJIDIC_Project'>KANJIDIC</a> dictionary, and Raine/Breen's <a href='http://www.edrdg.org/krad/kradinf.html'>RADKFILE/KRADFILE</a>. The canvas API is the excellent Chen-Yu Ho's <a href='https://www.chenyuho.com/project/handwritingjs/'>Handwriting.JS</a>. Read the <a href='https://github.com/CallumBeaney/rensou-kanji-hinge'>source code on Github</a>.</p>";
}


function output()
{
    turnOverlayOn();
    // TODO: clipboard copy from <outputboxes>: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
}

function kanjiInfo(kanji)
{        
    let heisigIndex;
    if (dictionary[kanji].heisig === undefined) {   
        heisigIndex = ">3007th place"   
    } else { heisigIndex = dictionary[kanji].heisig   
    }

    let yomikata;
    if (typeof dictionary[kanji].yomikata === 'object' || dictionary[kanji].yomikata instanceof Object) {
        yomikata = dictionary[kanji].yomikata.join("、");
    } else {
        yomikata = dictionary[kanji].yomikata;        
    }
                
    let translation;
    if (typeof dictionary[kanji].eigo === 'object') {
        translation = dictionary[kanji].eigo.join("・");
    } else {
        translation = dictionary[kanji].eigo;
    }

    if (typeof dictionary[kanji].eigo === 'object') {
        translation = dictionary[kanji].eigo.join("・");
    } else {
        translation = dictionary[kanji].eigo;
    }

    let bushu;
    if (typeof dictionary[kanji].bushu === 'object') {
        bushu = dictionary[kanji].bushu.join(", ");
    } else {
        bushu = dictionary[kanji].bushu;
    }

    let output = "<p style='font-size: 5rem; margin:0 auto;' align='center'>" + kanji 
               + "</p><br><p style='font-size: 1rem' align='center'>" 
               + "Meaning: " + translation 
               + "<br>Pronunciation: " + yomikata 
               + "<br>Radicals: " + bushu
               + "<br>Stroke Count: " + dictionary[kanji].jikaku.toString()
               + "<br>Instances on JP Wikipedia: " + dictionary[kanji].wiki.toString() 
               + "<br>Heisig Index: " + heisigIndex 
               + "</p>";

    // TODO: Sort out on/kun-yomi output
    
    /*  bushu        = 部首      = radicals (components of the kanji)
        eigo         = 英語      = kanji's english meaning
        jikaku       = 字画      = kanji stroke count
        heisig       = ・・      = Heisig's index number
        kanjidicBan  = ・・      = The number for the EDRGD "KANJIDIC" dictionary **
        yomikata     = 読み方    = The entry kanji's pronunciations.
        onyomiKanji  = 音読み漢字 = Words using the kanji's onyomi, in kanji form
        onyomiKana   = 音読み仮名 = Words using the kanji's onyomi, in kana form
        kunyomiKanji = 訓読み漢字 = Words using the kanji's kunyomi, in kanji form
        kunyomiKana  = 訓読み仮名 = Words using the kanji's kunyomi, in kana form 
    */

        document.getElementById("overlayText").innerHTML = output;
        turnOverlayOn();

}

function turnOverlayOn() {
    document.getElementById("overlay").style.display = "block";
}
function turnOverlayOff() {
    document.getElementById("overlay").style.display = "none";
}