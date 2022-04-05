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
    const DetailsDiv = $("#details");
    const ChaptersDiv = $("#chapters");
    const Body = $("body");
    const Timecodes = $("#timecodes");

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

    function secondsToHMS(seconds) {
       return new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    function audioSeek(seconds) {
        Player.currentTime = seconds;
    };

    function addTimecode(chapter) {
        const Item = $("<li>").attr("time", chapter.start_time);
        Item.append(
            $("<span>").addClass("chapter").text(chapter.title)
            );
        Item.append(
            $("<span>").addClass("dots")
            );
        Item.append(
            $("<span>").text(secondsToHMS(chapter.start_time)).addClass("hrefs").attr("time", chapter.start_time)
            );
        Item.on("click", function() {
            audioSeek($(this).attr('time'))
            });
        Timecodes.append(Item);
    };

    Form.on("submit", function(event) {
        $.getJSON("/_v", { url: $("#youtube_url").val() },
            function updatePage(data) {
                document.title = data.title + " - audio";
                Audio.attr("src", data.url);
                Player.currentTime = data.start_time || 0;
                TitleLinkA.attr("href", data.webpage_url);
                TitleLinkA.text(data.title);
                ChannelLinkA.attr("href", data.uploader_url);
                ChannelLinkA.text(data.uploader);
                BySpan.text(" by ");
                Description.text(data.description);
                updateMediaSession(data);

                Timecodes.empty();
                ChaptersDiv.hide();
                if ("chapters" in data) {
                    data.chapters.forEach(addTimecode)
                    ChaptersDiv.show()
                    }
            });
        return false;
        });

    DetailsDiv.on("click", function(){
        Player.paused ? Player.play() : Player.pause();
        });

    $("#paste").on("click", function(){
        paste(UrlInput);
        });

    ChaptersDiv.hide();

    paste(UrlInput);
});
