document.getElementById("fileInput")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      document.getElementById("results").innerText =
        "Excel file uploaded: " + file.name + "\nRows found: " + rows.length;

      console.log(rows);
    };

    reader.readAsArrayBuffer(file);
    return;
  }

  document.getElementById("results").innerText =
    "Unsupported file type for now: " + file.name;
});
