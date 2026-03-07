document.getElementById("fileInput").addEventListener("change", function (e) {

const file = e.target.files[0];
if (!file) return;

const reader = new FileReader();

reader.onload = function(event) {

const data = new Uint8Array(event.target.result);

const workbook = XLSX.read(data, { type: "array" });

const firstSheetName = workbook.SheetNames[0];

const worksheet = workbook.Sheets[firstSheetName];

const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

document.getElementById("results").innerText =
"Rows found: " + rows.length;

console.log("All rows from file:");
console.log(rows);

};

reader.readAsArrayBuffer(file);

});
