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

// Utility to mask first 4 digits
function maskFirst4(str) {
  return str.length > 4 ? '****' + str.slice(4) : str;
}

function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(row => {
      const status = row[3]; // assuming סטטוס is at index 3
      let statusColor = '';
  
      switch (status) {
        case 'בוצע':
          statusColor = 'green';
          break;
        case 'ממתין':
          statusColor = 'goldenrod';
          break;
        case 'לא הועבר נוסח':
          statusColor = 'Brown';
          break;
          case 'בוטל':
          statusColor = 'red';
          break;
      }
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td style="background-color: ${statusColor}; color: white;">${row[3]}</td>
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
  function maskContact(contact) {
  // Regular expression to find a phone number pattern (with optional dash)
  const phoneRegex = /(\d{3,4}[-]?\d{5,7})/;

  return contact.replace(phoneRegex, match => {
    // Remove dashes for clean masking
    const clean = match.replace(/-/g, '');

    if (clean.length <= 4) {
      return '*'.repeat(clean.length);
    }

    const masked = '****' + clean.slice(4);

    // Reinsert dash if it was there originally (optional)
    return match.includes('-')
      ? masked.slice(0, 3) + '-' + masked.slice(3)
      : masked;
  });
}

