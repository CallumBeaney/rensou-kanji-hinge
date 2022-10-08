function pushKanji(kanji)
{
    // TODO:
    // Compare kanji with dictionary

    canvas.erase();

    // Replace <button> contents
    for (i=0;i<6;i++) {
        document.getElementById("rb" + i).innerHTML = "　";
    }

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