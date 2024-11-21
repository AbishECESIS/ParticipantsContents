let VideoData = {};

// Function to update modal and open it
function VideoUpdate(videoId) {
    const video = GetVideoData(videoId);
    if (video) {
        // Update video source, title, and content
        document.getElementById("video-popup-link").src = video.link;
        // document.getElementById("video-popup-link").poster = video.poster_image;  // Set poster image
        document.getElementById("video-pop-title").textContent = video.title;
        // document.getElementById("video-popup-cnt").textContent = video.content;
        // Log to verify if updates are applied
        console.log("Modal content updated with:", video);

        // Open the modal programmatically
        const myModal = new bootstrap.Modal(document.getElementById('video-popup'));
        myModal.show();
    } else {
        console.log("Video data not found for ID:", videoId);
    }
}

// Stop the video when the modal is closed
document.getElementById('video-popup').addEventListener('hidden.bs.modal', function () {
    const videoElement = document.getElementById("video-popup-link");
    videoElement.pause();
    videoElement.currentTime = 0;  // Reset the video to the beginning
});

// Function to get video data by ID
function GetVideoData(videoId) {
    return VideoData[videoId];
}

// Function to load video data from JSON file
function loadVideoData() {
    fetch('json/pramaan_videos.json')
        .then(response => response.json())
        .then(data => {
            VideoData = data;
            console.log("Video data loaded:", VideoData);  // Confirm data is loaded
        })
        .catch(error => console.error("Error loading video data:", error));
}

// Call function to load video data on page load
loadVideoData();
