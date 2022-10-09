updateScroll(); // call on loadup

function pushKanji(kanji)
{
    // if (kanji != null) {
    //      do thing
    // }

    // TODO:
    // Compare kanji with dictionary

    /*  Firstly you'll need to read the JSON, like const myObject = JSON.parse(myJsonString);. 
        That will give you an object. 
        Then you can index into the object like const myValue = myObject[myKey];. 
        If myValue is undefined, the key didn't exist in the object.
    */

    // 1. Clear handwriting input box; 2. Replace suggestion <button> contents.
    canvas.erase();
    for (i=0; i<6; i++) {
        document.getElementById("rb" + i).innerHTML = ""; 
    }

    // 1. Update new kanji div; 2. Update previous kanji list; 3. Scroll to bottom of output div.
    document.getElementById("nk").innerHTML = kanji;
    document.getElementById("outputboxes").innerHTML += '<button class="kanjiList" onclick="kanjiInfo(this.innerHTML)">' + kanji + '</button>';
    updateScroll();
}

function updateScroll() 
{
    var element = document.getElementById("outputboxes");
    element.scrollTop = element.scrollHeight;
}

function kanjiInfo(kanji)
{
    console.log("asked for info");
}

/*                    JSON LIBRARY FIELDS EXAMPLE
    "年": {
        "bushu": [
        "ノ",
        "一",
        "干"
        ],
        "wiki": 2082013,
        "eigo": "year",
        "jikaku": 6,
        "heisig": 1036,
        "kanjidicBan": 2177,
        "yomikata": [
        "ネン",
        "とし",
        ""
        ],
        "onyomiKanji": [
        "年代",
        "少年",
        "豊年"
        ],
        "onyomiKana": [
        "ねんだい",
        "しょうねん",
        "ほうねん"
        ],
        "kunyomiKanji": "年",
        "kunyomiKana": "とし"
    }, 
                            */