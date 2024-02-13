import { getCurrentTabURL } from "./utils.js";

const bookmarkElement = document.querySelector("#bookmarks");

function setBookmarkAttributes(src, eventListener, controlParentElement) {
    const controlElement = document.createElement("img");
    controlElement.setAttribute("src", `./assets/${src}.png`);
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
}

async function onPlay(e) {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTabURL();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime
    });
}

async function onDelete(e) {
    const activeTab = await getCurrentTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById(`bookmark-${bookmarkTime}`);

    const noOfBookmarks = bookmarkElementToDelete.parentNode.children.length;
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    if (noOfBookmarks === 1) {
        bookmarkElement.innerHTML = `<i class="row">No bookmarks present</i>`;
    }

    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    });
}

async function onSave(e) {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTabURL();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "SAVE",
        value: bookmarkTime
    });
}

function addNewBookmark(bookmarkElement, bookmark) {
    const bookmarkContainer = document.createElement("div");
    const bookmarkTitle = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitle.textContent = bookmark.desc;
    bookmarkTitle.classList.add("bookmark-title");
    controlsElement.classList.add("bookmark-controls");

    bookmarkContainer.id = `bookmark-${bookmark.time}`;
    bookmarkContainer.classList.add("bookmark");
    bookmarkContainer.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);
    setBookmarkAttributes("save", onSave, controlsElement); // Adding the Save button

    bookmarkContainer.appendChild(bookmarkTitle);
    bookmarkContainer.appendChild(controlsElement);
    bookmarkElement.appendChild(bookmarkContainer);
}

function viewBookMarks(currentBookMarks = []) {
    bookmarkElement.innerHTML = "";

    if (currentBookMarks.length > 0) {
        currentBookMarks.forEach((bookmark) => {
            addNewBookmark(bookmarkElement, bookmark);
        });
    } else {
        bookmarkElement.innerHTML = `<i class="row">No bookmarks present</i>`;
    }
}

async function onLoadHandler() {
    const activeTab = await getCurrentTabURL();
    const queryParameter = activeTab.url.split("?")[1];
    const urlParameter = new URLSearchParams(queryParameter);

    const currentVideo = urlParameter.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookMarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            viewBookMarks(currentVideoBookMarks);
        });
    } else {
        const container = document.querySelector(".container");
        container.innerHTML = `<div class="title">This is not a YouTube video page</div>`;
    }
}

document.addEventListener("DOMContentLoaded", onLoadHandler);
