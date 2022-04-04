$(document).ready(function(){
    const YtRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
    const Audio = $("#player");
    const Player = Audio[0];
    const TitleLinkA = $("#title_link");
    const ChannelLinkA = $("#channel_link");
    const BySpan = $("#by");
    const Description = $("#description");
    const UrlInput = $("#youtube_url");
    const Form = $("#form");
    const MiddleDiv = $("#middle");
    const Body = $("body");

    async function paste(input) {
        /* Mozilla has lapki but others are ok */
        if ('clipboard' in navigator) {
            const clipboard = await navigator.clipboard.readText();
            if (YtRegex.test(clipboard)) {
                input.val(clipboard);
                Form.submit();
                };
            };
        };

    function updateMediaSession(data) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: data.title,
                artist: data.uploader,
                artwork: data.artwork
            });
        };
    };

    Form.on("submit", function(event) {
        $.getJSON("/_v", { url: $("#youtube_url").val() },
            function updatePage(data) {
                document.title = data.title + " - audio";
                Audio.attr("src", data.url);
                TitleLinkA.attr("href", data.webpage_url);
                TitleLinkA.text(data.title);
                ChannelLinkA.attr("href", data.uploader_url);
                ChannelLinkA.text(data.uploader);
                BySpan.text(" by ");
                Description.text(data.description);
                updateMediaSession(data);
            });
        return false;
        });

    MiddleDiv.on("click", function(){
        Player.paused ? Player.play() : Player.pause();
        });

    $("#paste").on("click", function(){
        paste(UrlInput);
        });

    paste(UrlInput);
});
