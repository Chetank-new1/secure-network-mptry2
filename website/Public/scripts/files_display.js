// Toggle views based on button clicked
document.getElementById("localFilesBtn").addEventListener("click", () => {
    document.getElementById("localFilesSection").style.display = "block";
    document.getElementById("firebaseFilesSection").style.display = "none";
    document.getElementById("localFilesContainer").innerHTML = ""; // Clear previous files
    showLocalFiles("audio");
});

document.getElementById("firebaseFilesBtn").addEventListener("click", () => {
    document.getElementById("firebaseFilesSection").style.display = "block";
    document.getElementById("localFilesSection").style.display = "none";
    document.getElementById("firebaseFilesContainer").innerHTML = ""; // Clear previous Firebase files
    fetchFirebaseFiles(); // Fetch Firebase files when section is shown
});

// Show Local Files based on type
function showLocalFiles(type) {
    fetch(`/files/list-files?type=${type}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("localFilesContainer");
            container.innerHTML = "";

            if (data.success && data.files.length > 0) {
                data.files.forEach(file => {
                    const fileElement = document.createElement("div");

                    const fileLink = document.createElement("a");
                    fileLink.href = file.downloadLink;
                    fileLink.innerText = file.name;
                    fileLink.target = "_blank";
                    fileElement.appendChild(fileLink);

                    const downloadBtn = document.createElement("button");
                    downloadBtn.innerText = "Download";
                    downloadBtn.onclick = () => {
                        const anchor = document.createElement("a");
                        anchor.href = file.downloadLink;
                        anchor.download = file.name;
                        anchor.click();
                    };

                    fileElement.appendChild(downloadBtn);
                    container.appendChild(fileElement);
                });
            } else {
                container.innerHTML = "<p>No files found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching local files:", error);
            document.getElementById("localFilesContainer").innerHTML = "<p>Error fetching files.</p>";
        });
}

// Firebase File Management
function fetchFirebaseFiles() {
    fetch("/files/files")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("firebaseFilesContainer");
            container.innerHTML = "";

            if (data.success && data.files.length > 0) {
                data.files.forEach(file => {
                    const fileElement = document.createElement("div");

                    const link = document.createElement("a");
                    link.href = file.url;
                    link.innerText = file.name;
                    link.target = "_blank";
                    fileElement.appendChild(link);

                    const deleteBtn = document.createElement("button");
                    deleteBtn.innerText = "Delete";
                    deleteBtn.onclick = () => deleteFirebaseFile(file.name);

                    fileElement.appendChild(deleteBtn);
                    container.appendChild(fileElement);
                });
            } else {
                container.innerHTML = "<p>No Firebase files found.</p>";
            }
        })
        .catch(error => console.error("Error fetching Firebase files:", error));
}

function uploadFirebaseFile() {
    const fileInput = document.getElementById("firebaseFileInput");
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        fetch("/files/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("File uploaded successfully:", data);
            fetchFirebaseFiles();
        })
        .catch(error => console.error("Error uploading file to Firebase:", error));
    } else {
        alert("Please select a file to upload.");
    }
}

function deleteFirebaseFile(fileName) {
    fetch(`/files/delete/${encodeURIComponent(fileName)}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        console.log("File deleted successfully:", data);
        fetchFirebaseFiles();
    })
    .catch(error => console.error("Error deleting file from Firebase:", error));
}

// Event listeners for different file types (local files)
document.getElementById("fileTypeButtons").addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "BUTTON" && target.hasAttribute("data-file-type")) {
        const fileType = target.getAttribute("data-file-type");
        showLocalFiles(fileType);
    }
});
