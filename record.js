const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRR2dbI8ou1w1zEd-cRf_fNq90WzdCQ96ZqqMz4IDjJFMaLShw5w2BBDYu6hVmuO1kH1GBNOWAeONNs/pub?gid=816954791&single=true&output=csv";

const tableBody = document.querySelector('#data-table tbody');
const searchInput = document.getElementById('search');
const toggleThemeBtn = document.getElementById('toggle-theme');

let allRows = [];

async function loadCSVData() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const rows = text.trim().split('\n').map(row => row.split(','));

    rows.shift(); // remove header row

    allRows = rows
      .map(row => [
        row[0]?.trim() || '', // שם העסק
        maskFirst4(row[1]?.trim() || ''), // חפ
        maskFirst4(row[2]?.trim() || ''), // איש קשר
        row[8]?.trim() || ''  // סטטוס
      ])
      .filter(row => row.some(cell => cell !== ''));

    renderTable(allRows);
  } catch (error) {
    console.error("Failed to load CSV:", error);
  }
}

// Utility to mask first 4 digits
function maskFirst4(str) {
  return str.length > 4 ? '****' + str.slice(4) : str;
}

// Render table with color-coded status cell only
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
      case 'בוטל':
        statusColor = 'red';
        break;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row[0]}</td>  <!-- שם העסק -->
      <td>${row[1]}</td>  <!-- חפ -->
      <td>${row[2]}</td>  <!-- איש קשר -->
      <td style="background-color: ${statusColor}; color: white;">${row[3]}</td>  <!-- סטטוס -->
    `;
    tableBody.appendChild(tr);
  });
}

// Search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allRows.filter(row =>
    row.some(cell => cell.toLowerCase().includes(query))
  );
  renderTable(filtered);
});

// Dark mode
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

loadCSVData();
// Navbar toggle for mobile
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarLinks = document.getElementById('navbar-links');
  
    navbarToggle.addEventListener('click', () => {
      navbarLinks.classList.toggle('show');
    });
  });
  
