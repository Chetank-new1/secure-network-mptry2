// Fetch and display files based on selected type
function selectFileType(type) {
  fetchFiles(type);
}

// Fetch files from the backend
async function fetchFiles(type) {
  const response = await fetch(`/files/list-files?type=${type}`); // Correct route
  const data = await response.json();
  if (data.success) {
    displayFiles(data.files);
  } else {
    alert("Error fetching files");
  }
}


// Display files with download links
function displayFiles(files) {
  const container = document.getElementById("files-container");
  container.innerHTML = "";

  files.forEach((file) => {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    fileItem.innerHTML = `
            <span>${file.name}</span> 
            <a href="${file.downloadLink}" download>Download</a>
        `;
    container.appendChild(fileItem);
  });
}
