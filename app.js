const fileInput = document.getElementById("fileInput");
const results = document.getElementById("results");

fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();
  results.textContent = `Reading file: ${file.name} ...`;

  if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    readExcelFile(file);
    return;
  }

  if (fileName.endsWith(".csv")) {
    readCsvFile(file);
    return;
  }

  results.textContent = "Unsupported file type. Please upload .csv, .xlsx, or .xls";
}

function readExcelFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      handleParsedRows(rows, file.name, "excel");
    } catch (error) {
      console.warn("SheetJS binary read failed, trying HTML fallback:", error.message);
      const fallbackReader = new FileReader();
      fallbackReader.onload = function (e2) {
        try {
          const html = e2.target.result;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const rows = Array.from(doc.querySelectorAll("tr")).map(tr =>
            Array.from(tr.querySelectorAll("td,th")).map(td => td.innerText.trim())
          );
          if (rows.length === 0) throw new Error("No table rows found in HTML fallback");
          handleParsedRows(rows, file.name, "xls-html");
        } catch (err2) {
          console.error("HTML fallback also failed:", err2);
          results.textContent = "Could not read file: " + err2.message;
        }
      };
      fallbackReader.readAsText(file);
    }
  };
  reader.readAsArrayBuffer(file);
}

function readCsvFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const text = e.target.result;
      const rows = parseCsv(text);
      handleParsedRows(rows, file.name, "csv");
    } catch (error) {
      console.error(error);
      results.textContent = "Could not read CSV file.";
    }
  };

  reader.readAsText(file);
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .filter(line => line.trim() !== "");

  return lines.map(line => {
    if (line.includes(";")) {
      return line.split(";").map(cell => cell.trim());
    }
    return line.split(",").map(cell => cell.trim());
  });
}

function handleParsedRows(rows, fileName, fileType) {
  console.log("Raw rows:", rows);

  if (!rows || rows.length === 0) {
    results.textContent = "No rows found in file.";
    return;
  }

  const previewRows = rows.slice(0, 8);
  const normalizedRows = normalizeRows(rows);

  console.log("Normalized rows:", normalizedRows);

  results.textContent =
    `File loaded successfully: ${fileName}\n` +
    `Type: ${fileType}\n` +
    `Rows found: ${rows.length}\n` +
    `Normalized transactions found: ${normalizedRows.length}\n\n` +
    `Preview of first rows:\n` +
    previewRows.map(row => JSON.stringify(row)).join("\n");
}

function normalizeRows(rows) {
  const transactions = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const date = String(row[0] ?? "").trim();
    const description = String(row[1] ?? "").trim();
    const rawAmount = String(row[2] ?? "").trim();

    if (!date && !description && !rawAmount) continue;

    const amount = parseAmount(rawAmount);

    transactions.push({
      date,
      description,
      amount,
      rawAmount
    });
  }

  return transactions;
}

function parseAmount(value) {
  if (!value) return null;

  let cleaned = String(value).trim();

  cleaned = cleaned.replace(/\s/g, "");

  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }

  const num = Number(cleaned);
  return Number.isNaN(num) ? null : num;
}
