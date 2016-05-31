if (document.title.indexOf("Трекер") != -1) {

    var ratings = ["imdbRating", "tomatoUserMeter"];

    let table = document.getElementById("tor-tbl");

    createColumn(table.querySelector("thead tr"));

    Array.prototype.slice.call(table.querySelectorAll("#tor-tbl tbody tr")).forEach(e=>rowRating(e));

    document.querySelector("#tor-tbl").tablesorter();
}

function createColumn(el) {
    ratings.forEach(ratingName=> {
        //imdb
        let imdbTH = document.createElement("TH");
        imdbTH.setAttribute("class", "{sorter: 'digit'} header");

        let imdbB = document.createElement("b");
        imdbB.setAttribute("class", "tbs-text");
        let rating = document.createTextNode(ratingName);
        imdbB.appendChild(rating);
        imdbTH.appendChild(imdbB);

        let imdbSpan = document.createElement("span");
        imdbSpan.setAttribute("class", "tbs-icon");
        let spanText = document.createTextNode("  ");
        imdbSpan.appendChild(spanText);
        imdbTH.appendChild(imdbSpan);

        el.appendChild(imdbTH);
    });
}

function rowRating(el) {
    ratings.forEach(ratingName=> {
        let imdb = document.createElement("td");
        imdb.setAttribute("class", "row4 small " + ratingName);

        let imdbRating = document.createTextNode("0");

        imdb.appendChild(imdbRating);

        let imdbTitleNode = el.querySelector("td.t-title div.t-title a.tLink");
        if (imdbTitleNode) {
            let title = imdbTitleNode.text;

            let obj = {};

            if (isSeries(title)) {
                let enTitle = title.substr(title.indexOf("/") + 1);
                obj.enTitle = enTitle.substr(0, enTitle.indexOf("/")).trim();

                obj.type = "series"
            } else {
                obj.enTitle = title.substr(title.indexOf("/") + 1, title.indexOf("(") - title.indexOf("/") - 1).trim();

                obj.type = "movie"
            }

            obj.year = title.substr(title.indexOf("[") + 1, 4);

            queryForRating(el, obj);
        }
        el.appendChild(imdb);
    });
}

function isSeries(title) {
    return title.indexOf("Сезон") != -1;
}

function queryForRating(e, obj, depth = 0) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.omdbapi.com/?tomatoes=true&t=" + obj.enTitle + "&y=" + obj.year + "&type=" + obj.type, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (JSON.parse(xhr.responseText).Response == "True") {
                ratings.forEach(ratingName=> {
                    var rating = JSON.parse(xhr.responseText)[ratingName];
                    if (rating.match(/^\d[.]?\d$/)) {
                        e.querySelector("td." + ratingName).textContent = rating;
                    }
                });
            } else {
                if (depth <= 2) {
                    if (obj.enTitle.indexOf(":") != -1) {
                        obj.enTitle = obj.enTitle.substr(0, obj.enTitle.indexOf(":"));

                        queryForRating(e, obj, depth + 1);
                    }
                }
            }
        }
    };
    xhr.send();
}