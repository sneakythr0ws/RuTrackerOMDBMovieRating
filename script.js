if (document.title.indexOf("Трекер") != -1) {

    let table = document.getElementById("tor-tbl");

    table.querySelector("thead tr").appendChild(createColumn());


    Array.prototype.slice.call(table.querySelectorAll("#tor-tbl tbody tr")).forEach(e=>e.appendChild(rowRating(e)));
}

function createColumn() {
    //Creating Elements
    let th = document.createElement("TH");
    //th.setAttribute("class", "{sorter: 'digit'} header");
    th.setAttribute("class", "header");

    let b = document.createElement("b");
    b.setAttribute("class", "tbs-text");

    let rating = document.createTextNode("Рейтинг");
    b.appendChild(rating);

    th.appendChild(b);

    return th;
}

function rowRating(e) {
    let rowRatingTD = document.createElement("td");
    rowRatingTD.setAttribute("class", "row4 small rowrating");

    //new XMLHttpRequest().open("GET", "http://api.kinopoisk.cf/searchFilms?keyword=%D0%B4%D0%B6%D0%B5%D0%B9", true);
    let rating = document.createTextNode("0");

    rowRatingTD.appendChild(rating);

    let title = e.querySelector("td.t-title div.t-title a.tLink").text;
    let enTitle = title.substr(title.indexOf("/") + 1, title.indexOf("(") - title.indexOf("/") - 1).trim();
    let year = title.substr(title.indexOf("[") + 1, 4);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.omdbapi.com/?t=" + enTitle + "&y=" + year, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            e.querySelector("td.rowrating").textContent = JSON.parse(xhr.responseText).imdbRating;
        }
    };
    xhr.send();

    return rowRatingTD;
    //Array.prototype.slice.call(table.querySelectorAll("#tor-tbl tbody tr")).forEach(e=>e.appendChild(rowRating(e)));
}