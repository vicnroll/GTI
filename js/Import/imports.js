

function importarHTML() {
    var z, i, elmnt, file, xhttp;
    z = $("link[rel=import]");
    for (i = 0; i < $(z).length; i++) {
        elmnt = (i == 0 ? $("header") : $("footer"));
        file = $($(z)[i]).attr("href");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(this.responseText.indexOf("<nav") != -1) $("header").html(this.responseText);
                    else $("footer").html(this.responseText);
                }
            }      
            xhttp.open("GET", file, true);
            xhttp.send();
        }
    }
    return;
}