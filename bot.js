const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRR2dbI8ou1w1zEd-cRf_fNq90WzdCQ96ZqqMz4IDjJFMaLShw5w2BBDYu6hVmuO1kH1GBNOWAeONNs/pub?gid=1142500467&single=true&output=csv";

const tableBody = document.querySelector('#data-table tbody');
const searchInput = document.getElementById('search');
const toggleThemeBtn = document.getElementById('toggle-theme');

let allRows = [];

// Load and process CSV
async function loadCSVData() {
  const response = await fetch(SHEET_CSV_URL);
  const text = await response.text();
  const rows = text.trim().split('\n').map(row => row.split(','));

  // Remove header
  rows.shift();

  // Map columns: [0]=שם העסק, [2]=חפ, [1]=איש קשר, [7]=סטטוס
  allRows = rows
    .map(row => [
      row[0]?.trim() || '', // שם העסק
      row[2]?.trim() || '', // חפ
      row[1]?.trim() || '', // איש קשר
      row[7]?.trim() || ''  // סטטוס
    ])
    .filter(row => row.some(cell => cell !== ''));

  renderTable(allRows);
}

// Utility to mask first 4 digits
function maskFirst4(str) {
  return str.length > 4 ? '****' + str.slice(4) : str;
}

// Render table with color-coded status cell
function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(row => {
    const status = row[3];
    let statusColor = '';

    switch (status) {
      case 'בוצע':
        statusColor = 'green';
        break;
      case 'בתהליך':
        statusColor = 'goldenrod';
        break;
      case 'לא מעוניין':
        statusColor = 'red';
        break;
      case 'לא רלוונטי':
        statusColor = 'darkred';
        break;
      case 'נשלחה הודעה':
        statusColor = 'CornflowerBlue';
        break;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row[0]}</td>  <!-- שם העסק -->
      <td>${maskFirst4(row[1])}</td>  <!-- חפ -->
      <td>${maskFirst4(row[2])}</td>  <!-- איש קשר -->
      <td style="background-color: ${statusColor}; color: white;">${row[3]}</td>  <!-- סטטוס -->
    `;
    tableBody.appendChild(tr);
  });
}

// Search filter
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allRows.filter(row =>
    row.some(cell => cell.toLowerCase().includes(query))
  );
  renderTable(filtered);
});

// Dark mode toggle
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarLinks = document.getElementById('navbar-links');

  navbarToggle.addEventListener('click', () => {
    navbarLinks.classList.toggle('show');
  });
});

loadCSVData();
