updateScroll(); // call on loadup to bring user-input scrollbar to bottom

function pushKanji(newKanji)
{
    let prevKanji = document.getElementById("nk").innerHTML;

    if (prevKanji === newKanji) 
    {
        return;
    }

    // Need Array: not all kanji's components > 1 
    let thisBushu = Array.from(dictionary[newKanji].bushu); 

    if (prevKanji === "　")
    {
        passKanji(newKanji);
    }
    if (prevKanji != "　")
    {
        let prevBushu = Array.from(dictionary[prevKanji].bushu);
        // console.log(prevBushu);
        let result = findCommonBushu(thisBushu, prevBushu);
        if (result == true)
        {
            console.log("common!");
            passKanji(newKanji);
        }
        else {
            // TODO: Change CSS colour to red failure colour on <id=rb> HTML objects?
            console.log("not common!");
            return;
        }
    }
}


function passKanji(kanji)
{
    canvas.erase();
    for (i=0; i<6; i++) {
        document.getElementById("rb" + i).innerHTML = ""; 
    }

    // 1. Update new kanji div; 2. Update previous kanji list; 3. Scroll to bottom of output div.
    document.getElementById("nk").innerHTML = kanji;
    document.getElementById("outputboxes").innerHTML += '<button class="kanjiList" onclick="kanjiInfo(this.innerHTML)">' + kanji + '</button>';
    updateScroll();
}

function findCommonBushu(thisBushu, prevBushu) 
{
    /* Iterate through each element in the first array and if some of 
    them include the elements in the secondarray then return true. */
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