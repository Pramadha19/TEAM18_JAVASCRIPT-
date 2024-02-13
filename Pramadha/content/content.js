(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookMarks = [];

    chrome.runtime.onMessage.addListener((message, sender, response) => {
        const { type, value, videoId } = message;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type === "DELETE") {
            chrome.storage.sync.get([currentVideo], (data) => {
                currentVideoBookMarks = JSON.parse(data[currentVideo]);
                currentVideoBookMarks = currentVideoBookMarks.filter((bookmark) => bookmark.time != value);
                chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookMarks) });
            });
        }
        else if (type === "SAVE"){
            const videoUrl = `https://www.youtube.com/watch?v=${currentVideo}`;
            chrome.downloads.download({
                url: videoUrl,
                filename: `${currentVideo}.mp4`
            });
        }
    });

    function fetchBookMarks() {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    }

    async function newVideoLoaded() {
        const bookmarkBtnExists = document.querySelector(".bookmark-btn");
        currentVideoBookMarks = await fetchBookMarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.querySelector(".ytp-left-controls");
            youtubePlayer = document.querySelector(".video-stream");

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkHandler);
        }
    }

    async function addNewBookmarkHandler() {
        const currTime = youtubePlayer.currentTime;
        const descTime = getTimeInStandardFormat(currTime);
        const newBookmark = {
            "time": currTime,
            "desc": `Bookmark at ${descTime}`
        };

        currentVideoBookMarks = await fetchBookMarks();
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookMarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    function getTimeInStandardFormat(currTime) {
        const hour = Math.floor(currTime / 3600) < 10 ? `0${Math.floor(currTime / 3600)}` : Math.floor(currTime / 3600);
        const min = Math.floor(currTime / 60) % 60 < 10 ? `0${Math.floor(currTime / 60) % 60}` : Math.floor(currTime / 60) % 60;
        const sec = Math.floor(currTime % 60) < 10 ? `0${Math.floor(currTime % 60)}` : Math.floor(currTime % 60);

        return `${hour}:${min}:${sec}`;
    }

    let trail = "&ytExt=ON";
    if (!window.location.href.includes(trail) && !window.location.href.includes("ab_channel") && window.location.href.includes("youtube.com/watch")) {
        window.location.href += trail;
    }
})();
