document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("results").innerText =
        "File uploaded: " + file.name + ". Analysis coming soon.";
});
