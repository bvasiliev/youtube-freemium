$(document).ready(function(){
    const YtRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
    let Audio = $("#player");
    let Player = Audio[0];
    let ThumbnailImg = $("#thumbnail");
    let TitleLinkA = $("#title_link");
    let ChannelLinkA = $("#channel_link");
    let BySpan = $("#by");
    let Description = $("#description");
    let UrlInput = $("#youtube_url");
    let Form = $("#form");
    let MiddleDiv = $("#middle");
    let Body = $("body");

    async function paste(input) {
        /* Mozilla has lapki but others are ok */
        const clipboard = await navigator.clipboard.readText();
        if (YtRegex.test(clipboard)) {
            input.val(clipboard);
            Form.submit();
            };
        };

    $("form").on("submit", function(event) {
        $.getJSON("/_v", { url: $("#youtube_url").val() },
            function updatePage(data) {
                document.title = data.title + " - audio";
                Audio.attr("src", data.url);
                Body.css("background-image", "url(" + data.thumbnail + ")");
                TitleLinkA.attr("href", data.webpage_url);
                TitleLinkA.text(data.title);
                ChannelLinkA.attr("href", data.uploader_url);
                ChannelLinkA.text(data.uploader);
                BySpan.text(" by ");
                Description.text(data.description);
            });
        return false;
        });

    $("#middle").on("click", function(){
        Player.paused ? Player.play() : Player.pause();
        });

    $("#paste").on("click", function(){
        paste(UrlInput);
        });

    paste(UrlInput);
});
