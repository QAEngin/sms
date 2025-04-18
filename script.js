const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTCPt2128NhVQ1j_QbAuQMdkuUohM07yFXs_eQnE9vrj9YIDD0IuMSloBl94b6oeHAra5-fXiUbsVPa/pub?output=csv';

const tableBody = document.querySelector('#data-table tbody');
const searchInput = document.getElementById('search');
const toggleThemeBtn = document.getElementById('toggle-theme');

let allRows = [];

async function loadCSVData() {
    const response = await fetch(SHEET_CSV_URL);
    const text = await response.text();
    const rows = text.trim().split('\n').map(row => row.split(','));
  
    // Remove header row
    rows.shift();
  
    // Map and filter
    allRows = rows
      .map(row => [
        row[7]?.trim() || '', // שם העסק
        row[8]?.trim() || '', // חפ
        row[6]?.trim() || '', // איש קשר
        row[3]?.trim() || ''  // סטטוס
      ])
      .filter(row =>
        row.some(cell => cell !== '') // remove if all fields are empty
      );
  
    renderTable(allRows);
  }

function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach(row => {
    const status = row[3].trim(); // סטטוס
    const tr = document.createElement('tr');
    tr.classList.add(`status-${status}`);
    tr.innerHTML = `
      <td>${row[0]}</td>  <!-- שם העסק -->
      <td>${row[1]}</td>  <!-- חפ -->
      <td>${row[2]}</td>  <!-- איש קשר -->
      <td>${row[3]}</td>  <!-- סטטוס -->
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
  
