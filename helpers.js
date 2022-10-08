function pushKanji(kanji)
{
    // TODO:
    // Compare kanji with dictionary

    canvas.erase();


    // if (kanji passes condition check)
    document.getElementById("nk").innerHTML = kanji;

    // Replace <button> contents
    for (i=0;i<6;i++) {
        document.getElementById("rb" + i).innerHTML = "　";
    }
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