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
  reader.onload = async function (e) {
    try {
      const data = e.target.result;

      // Try SheetJS directly first
      try {
        const arr = new Uint8Array(data);
        const workbook = XLSX.read(arr, { type: "array", cellDates: true });
        console.log("Sheet names:", workbook.SheetNames);
        const allRows = [];
        workbook.SheetNames.forEach(name => {
          const ws = workbook.Sheets[name];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          allRows.push(...rows);
        });
        handleParsedRows(allRows, file.name, "excel");
        return;
      } catch (directErr) {
        console.warn("SheetJS direct failed, trying JSZip repack:", directErr.message);
      }

      // Repack ZIP with JSZip then re-read with SheetJS
      const zip = await JSZip.loadAsync(data);
      const repackedZip = new JSZip();
      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async("uint8array");
          repackedZip.file(path, content, { compression: "DEFLATE" });
        }
      }
      const repackedData = await repackedZip.generateAsync({ type: "uint8array" });
      const workbook = XLSX.read(repackedData, { type: "array", cellDates: true });
      console.log("Sheet names:", workbook.SheetNames);
      const allRows = [];
      workbook.SheetNames.forEach(name => {
        const ws = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        allRows.push(...rows);
      });
      console.log("First 3 rows:", allRows.slice(0, 3));
      console.log("Row at index 9:", allRows[9]);
      console.log("Row at index 10:", allRows[10]);
      handleParsedRows(allRows, file.name, "excel-repacked");

    } catch (err) {
      console.error("All Excel read methods failed:", err);
      results.textContent = "Could not read Excel file: " + err.message;
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

 let html = `<p><strong>File:</strong> ${fileName} &nbsp; <strong>Transactions:</strong> ${normalizedRows.length}</p>`;

  if (normalizedRows.length > 0) {
    html += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px;">
      <thead><tr><th>Datum</th><th>Beskrivning</th><th>Belopp</th></tr></thead>
      <tbody>`;
    normalizedRows.forEach(row => {
      const color = row.amount < 0 ? "red" : "green";
      html += `<tr>
        <td>${row.date}</td>
        <td>${row.description}</td>
        <td style="color:${color};text-align:right;">${row.amount}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p>No transactions parsed. Raw preview:</p><pre>${previewRows.map(r => JSON.stringify(r)).join("\n")}</pre>`;
  }

  results.innerHTML = html;
}

function normalizeRows(rows) {
  const transactions = [];

  // Find the header row by looking for "Datum" or "datum"
  let startIndex = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowText = row.join(" ").toLowerCase();
    if (rowText.includes("datum") && rowText.includes("belopp")) {
      startIndex = i + 1;
      break;
    }
  }

  console.log("Transactions start at row index:", startIndex);

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;
    const date = String(row[0] ?? "").trim();
    const description = String(row[1] ?? "").trim();
    const rawAmount = String(row[2] ?? "").trim();
    if (!date && !description && !rawAmount) continue;
    // Skip rows that don't look like a date
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) continue;
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
