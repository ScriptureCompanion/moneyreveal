const fileInput = document.getElementById("fileInput");
const results = document.getElementById("results");
const MERCHANT_CATEGORIES = {

  "ica": "Food & Dining",
  "coop": "Food & Dining",
  "lidl": "Food & Dining",
  "willys": "Food & Dining",

  "mcdonald": "Food & Dining",
  "burger king": "Food & Dining",
  "max": "Food & Dining",

  "shell": "Transport",
  "circle k": "Transport",
  "okq8": "Transport",

  "uber": "Transport",
  "bolt": "Transport",

  "spotify": "Subscriptions",
  "netflix": "Subscriptions",
  "youtube": "Subscriptions",
  "apple": "Subscriptions",
  "google": "Subscriptions",

  "amazon": "Shopping",
  "zalando": "Shopping",
  "ikea": "Shopping",

  "hm": "Shopping",
  "h&m": "Shopping"

};
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
    // --- Financial insights ---
    const expenses   = normalizedRows.filter(r => r.amount < 0);
    const income     = normalizedRows.filter(r => r.amount > 0);
    const totalSpent = expenses.reduce((s, r) => s + r.amount, 0);
    const totalIn    = income.reduce((s, r) => s + r.amount, 0);
    const net        = totalIn + totalSpent;

    // Recurring: descriptions appearing 2+ times among expenses
    const descCount = {};
    expenses.forEach(r => {
      const key = r.description.toLowerCase().trim();
      descCount[key] = (descCount[key] || 0) + 1;
    });
    const recurring = Object.entries(descCount)
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Top spending categories (simple keyword buckets)
    const CATEGORIES = {
      "Food & Dining":    ["restaurant", "cafe", "coffee", "pizza", "burger", "sushi", "mat", "livsmedel", "ica", "coop", "lidl", "willys"],
      "Transport":        ["uber", "lyft", "taxi", "sl ", "buss", "tåg", "train", "fuel", "bensin", "parkering"],
      "Subscriptions":    ["netflix", "spotify", "hbo", "apple", "google", "microsoft", "amazon", "adobe", "prenumeration"],
      "Shopping":         ["amazon", "zalando", "h&m", "zara", "ikea", "elgiganten", "komplett"],
      "Health":           ["apotek", "gym", "fitness", "doctor", "pharmacy", "health"],
    };
    const catTotals = {};
    expenses.forEach(r => {
      const desc = r.description.toLowerCase();
      for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(k => desc.includes(k))) {
          catTotals[cat] = (catTotals[cat] || 0) + Math.abs(r.amount);
          return;
        }
      }
      catTotals["Other"] = (catTotals["Other"] || 0) + Math.abs(r.amount);
    });
    const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const fmt = n => (n == null || isNaN(n)) ? "—" : n.toLocaleString("sv-SE", { minimumFractionDigits: 2 });

    html += `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;">
      <div style="flex:1;min-width:160px;padding:14px 18px;background:#fff8f0;border-left:4px solid #e07000;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Spent</div>
        <div style="font-size:22px;font-weight:700;color:#c0392b;">${fmt(totalSpent)}</div>
      </div>
      <div style="flex:1;min-width:160px;padding:14px 18px;background:#f0fff4;border-left:4px solid #27ae60;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Income</div>
        <div style="font-size:22px;font-weight:700;color:#27ae60;">+${fmt(totalIn)}</div>
      </div>
      <div style="flex:1;min-width:160px;padding:14px 18px;background:#f5f5ff;border-left:4px solid #7b5ea7;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Net</div>
        <div style="font-size:22px;font-weight:700;color:${net >= 0 ? "#27ae60" : "#c0392b"};">${net >= 0 ? "+" : ""}${fmt(net)}</div>
      </div>
    </div>`;

    if (topCats.length > 0) {
      const grandTotal = topCats.reduce((s, [, v]) => s + v, 0) || 1;
      html += `<div style="margin:16px 0;"><strong>Spending by Category</strong><div style="margin-top:8px;">`;
      topCats.forEach(([cat, val]) => {
        const pct = Math.round((val / grandTotal) * 100);
        html += `<div style="margin-bottom:6px;font-size:13px;">
          <span style="display:inline-block;width:140px;">${cat}</span>
          <span style="display:inline-block;background:#e0e0e0;width:180px;height:10px;border-radius:5px;vertical-align:middle;">
            <span style="display:block;background:#e07000;width:${pct}%;height:10px;border-radius:5px;"></span>
          </span>
          <span style="margin-left:8px;">${fmt(val)} (${pct}%)</span>
        </div>`;
      });
      html += `</div></div>`;
    }

    if (recurring.length > 0) {
      html += `<div style="margin:16px 0;"><strong>Likely Recurring Payments</strong><ul style="margin-top:6px;">`;
      recurring.forEach(([desc, count]) => {
        html += `<li style="font-size:13px;">${desc} — ${count}x</li>`;
      });
      html += `</ul></div>`;
    }

    html += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;margin-top:16px;">
      <thead><tr style="background:#f5f5f5;"><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
      <tbody>`;
    normalizedRows.forEach(row => {
      const color = row.amount < 0 ? "#c0392b" : "#27ae60";
      html += `<tr>
        <td>${row.date}</td>
        <td>${row.description}</td>
        <td style="color:${color};text-align:right;">${fmt(row.amount)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p>No transactions parsed. Raw preview:</p><pre>${previewRows.map(r => JSON.stringify(r)).join("\n")}</pre>`;
  }

  results.innerHTML = html;
}

// --- Column alias map: maps bank-specific header names to normalized keys ---
const COLUMN_ALIASES = {
  date:        ["datum", "date", "transaktionsdatum", "bookingdate", "booking date", "valuedate", "transaction date", "fecha"],
  description: ["beskrivning", "text", "description", "merchant", "payee", "name", "mottagare", "transaktion", "details", "memo", "reference"],
  amount:      ["belopp", "amount", "amount (sek)", "sum", "debit/credit", "transaktionsbelopp", "value", "importe"],
  balance:     ["saldo", "balance", "running balance", "saldo efter transaktion"]
};

function detectColumns(headerRow) {
  const cols = { date: -1, description: -1, amount: -1, balance: -1 };
  headerRow.forEach((cell, i) => {
    const normalized = String(cell).toLowerCase().trim();
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (cols[key] === -1 && aliases.includes(normalized)) {
        cols[key] = i;
      }
    }
  });
  return cols;
}

function normalizeRows(rows) {
  const transactions = [];

  let startIndex = 0;
  let cols = { date: 1, description: 2, amount: 3, balance: 4 }; // fallback

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowText = row.join(" ").toLowerCase();
    // Detect any row that contains date-like and amount-like headers
    const hasDateCol  = COLUMN_ALIASES.date.some(a => rowText.includes(a));
    const hasAmountCol = COLUMN_ALIASES.amount.some(a => rowText.includes(a));
    if (hasDateCol && hasAmountCol) {
      cols = detectColumns(row);
      startIndex = i + 1;
      console.log("Detected columns:", cols, "at row", i);
      break;
    }
  }

  console.log("Transactions start at row index:", startIndex);
  console.log("Total rows in file:", rows.length);

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    const date        = String(row[cols.date]        ?? "").trim();
    const description = String(row[cols.description] ?? "").trim();
    const rawAmt      = String(row[cols.amount]      ?? "").trim();
    const amount      = parseAmount(rawAmt);
    const balance     = cols.balance !== -1 ? parseAmount(String(row[cols.balance] ?? "")) : null;
    if (!date && !description) continue;
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) continue;
    transactions.push({
  date,
  description,
  amount,
  balance,
  rawAmount: rawAmt,
  category: detectCategory(description)
});
  }

  if (transactions.length > 0) {
    console.log("Date range:", transactions[transactions.length - 1].date, "->", transactions[0].date);
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
function detectCategory(description){

  const text = description.toLowerCase();

  for(const merchant in MERCHANT_CATEGORIES){

    if(text.includes(merchant)){
      return MERCHANT_CATEGORIES[merchant];
    }

  }

  return "Other";

}
