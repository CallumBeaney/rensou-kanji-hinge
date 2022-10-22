updateScroll(); // call on loadup to bring user-input scrollbar to bottom -- rm when done

function pushKanji(newKanji, buttonid)
{

    if (buttonid === "stopButton")  // 。 button
    {
        passKanji(newKanji);
        // TODO: clipboard copy from <outputboxes> + popup window to let user know
        return;
    }
    if (buttonid === "commaButton")  // 、 button
    {
        // This just lets the user move to a different kanji if they get stuck
        passKanji(newKanji);
        return;
    }

    let prevKanji = document.getElementById("nk").innerHTML;
    if (prevKanji === newKanji)
    {
        // user has input same character twice
        return;
    }

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
        resetColours();
        passKanji(newKanji);
        return;
    }
    if (    !(exceptions.includes(prevKanji))   ) // TODO: is there ANY incidence where this being an Else is invalid?
    {
        let prevBushu = Array.from(dictionary[prevKanji].bushu);

        let result = findCommonBushu(thisBushu, prevBushu);
        if (result == true)
        {
            resetColours();
            passKanji(newKanji);
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

    for (i = 0; i < 6; i++) {
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
            document.getElementById("rb" + i).className = "resultbox pass";
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


function kanjiInfo(kanji)
{
    console.log("asked for info");

    // TODO: construct html popup
    
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
    
}