document.getElementById('homeLink').addEventListener('click', function(event) {
  event.preventDefault();
  const contentElement = document.getElementById('content');
  const loadingEffect = document.getElementById('loadingEffect');
  const disappearingSection = document.getElementById('disappearingSection');

  disappearingSection.style.display = 'none';
  loadingEffect.style.display = 'flex';
  contentElement.style.display = 'none';

  fetch('home.html') 
    .then(response => response.text())
    .then(data => {
      setTimeout(() => {
          contentElement.innerHTML = data; 
          contentElement.style.display = 'block'; 
          loadingEffect.style.display = 'none';
          document.getElementById('dynamicHeader').innerText = 'Medical Guidelines';
      }, 900);
    })
    .catch(error => console.error('Error loading home.html:', error));
});

// New event listener for management link start
let editingMedicineName = null;
let editingMedicineExpiry = null;
document.getElementById('managementLink').addEventListener('click', function(event) {
  event.preventDefault();
  const contentElement = document.getElementById('content');
  const loadingEffect = document.getElementById('loadingEffect');
  const disappearingSection = document.getElementById('disappearingSection');

  disappearingSection.style.display = 'none';
  loadingEffect.style.display = 'flex';
  contentElement.style.display = 'none';

  fetch('management.html') 
    .then(response => response.text())
    .then(data => {
      setTimeout(() => {
          contentElement.innerHTML = data; 
          contentElement.style.display = 'block'; 
          loadingEffect.style.display = 'none';
          document.getElementById('dynamicHeader').innerText = 'Medicine Management'; 
          attachmanagementEventListeners(); 
      }, 900);
    })
    .catch(error => console.error('Error loading management.html:', error));
});

function attachmanagementEventListeners() {
  document.getElementById('addMedicineBtn').addEventListener('click', function() {
      editingMedicineName = null;
      editingMedicineExpiry = null;
      document.getElementById('medicineForm').reset();
      document.getElementById('medicineModal').classList.remove('hidden');
  });

  const form = document.getElementById('medicineForm');
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const [nameInput, dosageInput, stockInput, expiryInput, manufacturerInput, priceInput] = event.target.elements;
      const medicineName = nameInput.value.trim();
      const dosage = dosageInput.value.trim();
      const stock = stockInput.value.trim();
      const expiry = expiryInput.value;
      const manufacturer = manufacturerInput.value.trim();
      const price = parseFloat(priceInput.value);

      if (!medicineName || !dosage || !stock || !expiry || !manufacturer || isNaN(price)) {
          alert("Please fill in all fields.");
          return;
      }

      if (editingMedicineName && editingMedicineExpiry) {
          updateMedicineInLocalStorage(editingMedicineName, editingMedicineExpiry, 
              { name: medicineName, dosage, stock, expiry, manufacturer, price });
          editingMedicineName = null;
          editingMedicineExpiry = null;
      } else {
          addMedicineToTable(medicineName, dosage, stock, expiry, manufacturer, price);
      }

      document.getElementById('medicineModal').classList.add('hidden');
      event.target.reset();
      loadMedicines();
  });

  document.getElementById('cancelBtn').addEventListener('click', function() {
      document.getElementById('medicineModal').classList.add('hidden');
      editingMedicineName = null;
      editingMedicineExpiry = null;
  });

  loadMedicines();
}

function loadMedicines() {
  const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  const tableBody = document.getElementById('medicineTableBody');
  tableBody.innerHTML = '';

  medicines.forEach(medicine => {
      addMedicineToTable(medicine.name, medicine.dosage, medicine.stock, medicine.expiry, medicine.manufacturer, medicine.price, false);
  });
}

function calculateTotalPrice(quantity, price) {
  return quantity * price;
}

// Update the addMedicineToTable function to include price handling
function addMedicineToTable(name, dosage, stock, expiry, manufacturer, price, save = true) {
  const tableBody = document.getElementById('medicineTableBody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
      <td>${name}</td>
      <td>${dosage}</td>
      <td>${stock}</td>
      <td>${expiry}</td>
      <td>${manufacturer}</td>
      <td>${price.toFixed(2)}</td>
      <td class="actionbtns">
          <button class="editBtn" data-name="${name}" data-expiry="${expiry}"><i class="fas fa-edit"></i></button>
          <button class="deleteBtn" data-name="${name}" data-expiry="${expiry}"><i class="fas fa-trash"></i></button>
      </td>
  `;

  tableBody.appendChild(newRow);

  if (save) {
      saveMedicineToLocalStorage(name, dosage, stock, expiry, manufacturer, price);
  }

  newRow.querySelector('.deleteBtn').addEventListener('click', function() {
      tableBody.removeChild(newRow);
      removeMedicineFromLocalStorage(name, expiry);
  });

  newRow.querySelector('.editBtn').addEventListener('click', function() {
      editingMedicineName = name;
      editingMedicineExpiry = expiry;
      const form = document.getElementById('medicineForm');
      const [nameInput, dosageInput, stockInput, expiryInput, manufacturerInput, priceInput] = form.elements;

      nameInput.value = name;
      dosageInput.value = dosage;
      stockInput.value = stock;
      expiryInput.value = expiry;
      manufacturerInput.value = manufacturer;
      priceInput.value = price;
      document.getElementById('medicineModal').classList.remove('hidden');
  });
}

function saveMedicineToLocalStorage(name, dosage, stock, expiry, manufacturer, price) {
  let medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  medicines.push({ name, dosage, stock, expiry, manufacturer, price });
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

function removeMedicineFromLocalStorage(name, expiry) {
  let medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  medicines = medicines.filter(medicine => !(medicine.name === name && medicine.expiry === expiry));
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

function updateMedicineInLocalStorage(originalName, originalExpiry, updatedData) {
  let medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  medicines = medicines.map(med => 
    (med.name === originalName && med.expiry === originalExpiry) ? updatedData : med
  );
  localStorage.setItem('medicines', JSON.stringify(medicines));
}

// TRACKING LINK START
document.getElementById('trackingLink').addEventListener('click', function(event) {
  event.preventDefault();
  const contentElement = document.getElementById('content');
  const loadingEffect = document.getElementById('loadingEffect');
  const disappearingSection = document.getElementById('disappearingSection');

  disappearingSection.style.display = 'none';
  loadingEffect.style.display = 'flex';
  contentElement.style.display = 'none'; 

  fetch('tracking.html')
    .then(response => response.text())
    .then(data => {
      setTimeout(() => {
          contentElement.innerHTML = data; 
          contentElement.style.display = 'block'; 
          loadingEffect.style.display = 'none';
          document.getElementById('dynamicHeader').innerText = 'Inventory Tracking'; 
          loadTrackingData(); 
      }, 900);
    })
    .catch(error => console.error('Error loading tracking.html:', error));
});

let cachedMedicines = [];

function loadTrackingData() {
  cachedMedicines = JSON.parse(localStorage.getItem('medicines')) || [];
  renderTrackingTables(cachedMedicines);
  attachSearchListeners();
}

function renderTrackingTables(medicines) {
  const stockTableBody = document.getElementById('stockLevelsBody');
  const expiryTableBody = document.getElementById('expiryTrackingBody');
  const today = new Date();

  stockTableBody.innerHTML = '';
  if (expiryTableBody) expiryTableBody.innerHTML = ''; // Optional for expiry section

  medicines.forEach(med => {
    // STOCK LEVELS
    const stockRow = document.createElement('tr');
    const minThreshold = 50;
    const status = parseInt(med.stock) < minThreshold ? 'Low Stock' : 'OK';
    const statusColor = status === 'Low Stock' ? 'red' : 'green';

    stockRow.innerHTML = `
      <td>${med.name}</td>
      <td>${med.stock}</td>
      <td>${minThreshold}</td>
       <td>${med.manufacturer || 'N/A'}</td>
      <td style="color: ${statusColor}; font-weight: bold;">${status}</td>
    `;
    stockTableBody.appendChild(stockRow);

    // Optional: Render expiry tracking if section exists
    if (expiryTableBody) {
      const expiryRow = document.createElement('tr');
      const expiryDate = new Date(med.expiry);
      const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      let expiryStatus = '';

      if (expiryDate < today) {
        expiryStatus = '<span style="color:red; font-weight: bold;">Expired</span>';
      } else if (daysLeft <= 30) {
        expiryStatus = '<span style="color:orange; font-weight: bold;">Expiring Soon</span>';
      } else {
        expiryStatus = '<span style="color:green;">Valid</span>';
      }

      expiryRow.innerHTML = `
        <td>${med.name}</td>
        <td>${med.expiry}</td>
        <td>${expiryStatus}</td>
      `;
      expiryTableBody.appendChild(expiryRow);
    }
  });
}

function attachSearchListeners() {
  const stockSearchInput = document.getElementById('stockSearch');
  const expirySearchInput = document.getElementById('expirySearch'); // Added expiry search input

  if (stockSearchInput) {
    stockSearchInput.addEventListener('input', () => {
      const query = stockSearchInput.value.toLowerCase();
      const filtered = cachedMedicines.filter(med =>
        med.name.toLowerCase().includes(query) ||
        med.manufacturer?.toLowerCase().includes(query)
      );
      renderTrackingTables(filtered);
    });
  }

  // New listener for expiry search
  if (expirySearchInput) {
    expirySearchInput.addEventListener('input', () => {
      const query = expirySearchInput.value.toLowerCase();
      const filtered = cachedMedicines.filter(med =>
        med.name.toLowerCase().includes(query) ||
        med.manufacturer?.toLowerCase().includes(query)
      );
      renderExpiryTrackingTables(filtered); // Call a new function to render expiry tracking
    });
  }
}
function renderExpiryTrackingTables(medicines) {
  const expiryTableBody = document.getElementById('expiryTrackingBody');
  const today = new Date();

  expiryTableBody.innerHTML = ''; // Clear existing rows

  medicines.forEach(med => {
    const expiryRow = document.createElement('tr');
    const expiryDate = new Date(med.expiry);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    let expiryStatus = '';

    if (expiryDate < today) {
      expiryStatus = '<span style="color:red; font-weight: bold;">Expired</span>';
    } else if (daysLeft <= 30) {
      expiryStatus = '<span style="color:orange; font-weight: bold;">Expiring Soon</span>';
    } else {
      expiryStatus = '<span style="color:green;">Valid</span>';
    }

    expiryRow.innerHTML = `
      <td>${med.name}</td>
      <td>${med.expiry}</td>
      <td>${expiryStatus}</td>
    `;
    expiryTableBody.appendChild(expiryRow);
  });
}
// TRACKING LINK END




// SALES LINK HANDLER start
document.getElementById('salesLink').addEventListener('click', function (event) {
  event.preventDefault();
  const contentElement = document.getElementById('content');
  const loadingEffect = document.getElementById('loadingEffect');
  const disappearingSection = document.getElementById('disappearingSection');

  disappearingSection.style.display = 'none';
  loadingEffect.style.display = 'flex';
  contentElement.style.display = 'none'; 

  fetch('sales.html')
    .then(response => response.text())
    .then(data => {
      setTimeout(() => {
          contentElement.innerHTML = data; 
          contentElement.style.display = 'block'; 
          loadingEffect.style.display = 'none'; 
          document.getElementById('dynamicHeader').innerText = 'Sales and Dispensing';
          initializeSales();       
          loadSalesHistory();      
      }, 900);
    })
    .catch(error => console.error('Error loading sales.html:', error));
});

// MAIN SALES FUNCTION
function initializeSales() {
  let medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const searchInput = document.getElementById('searchMedicine');
  const quantityInput = document.getElementById('quantity');
  const addToCartBtn = document.getElementById('addToCart');
  const cartBody = document.getElementById('cartBody');
  const totalAmountSpan = document.getElementById('totalAmount');
  const finalizeSaleBtn = document.getElementById('finalizeSale');

  // Fill datalist with medicine names
  function populateMedicineDatalist() {
    const datalist = document.getElementById('medicineList');
    datalist.innerHTML = '';
    medicines.forEach(med => {
      const option = document.createElement('option');
      option.value = med.name;
      datalist.appendChild(option);
    });
  }

  // Search for medicine by name
  function findMedicineByName(name) {
    return medicines.find(med => med.name.toLowerCase() === name.toLowerCase());
  }

  // Render cart UI
  function renderCart() {
    cartBody.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.quantity * item.unitPrice;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₱${item.unitPrice.toFixed(2)}</td>
        <td>₱${subtotal.toFixed(2)}</td>
        <td><button class="removeBtn" data-index="${index}">Remove</button></td>
      `;
      cartBody.appendChild(row);
    });

    totalAmountSpan.textContent = `₱${total.toFixed(2)}`;

    // Remove item from cart
    document.querySelectorAll('.removeBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
    });
  }

  // Add medicine to cart
  function addToCart() {
    const medicineName = searchInput.value.trim();
    const quantity = parseInt(quantityInput.value);

    if (!medicineName) return alert('Please enter a medicine name.');
    if (!quantity || quantity <= 0) return alert('Please enter a valid quantity.');

    const med = findMedicineByName(medicineName);
    if (!med) return alert('Medicine not found.');
    if (quantity > med.stock) return alert(`Not enough stock. Available: ${med.stock}`);

    const existingIndex = cart.findIndex(item => item.name.toLowerCase() === medicineName.toLowerCase());
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        name: med.name,
        quantity,
        unitPrice: parseFloat(med.price) || 0
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    searchInput.value = '';
    quantityInput.value = '';
    renderCart();
  }

  // Finalize the sale
  function finalizeSale() {
    if (cart.length === 0) return alert('Cart is empty!');

    // Deduct stock from medicines
    cart.forEach(item => {
      const medIndex = medicines.findIndex(med => med.name === item.name);
      if (medIndex !== -1) {
        medicines[medIndex].stock -= item.quantity;
      }
    });

    localStorage.setItem('medicines', JSON.stringify(medicines));

    // Save the sale
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    const saleRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
    };
    salesHistory.push(saleRecord);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));

    // Reset cart
    cart = [];
    localStorage.removeItem('cart');
    alert('Sale finalized!');
    renderCart();
    loadSalesHistory(); // Refresh history after sale
  }

 // Load sales history and render it
function loadSalesHistory() {
  const history = JSON.parse(localStorage.getItem('salesHistory')) || [];
  const salesTableBody = document.getElementById('salesHistoryBody');
  if (!salesTableBody) return;

  salesTableBody.innerHTML = '';
  history.forEach((sale, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${new Date(sale.date).toLocaleString()}</td>
          <td>₱${sale.total.toFixed(2)}</td>
          <td>${sale.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
          <td>
          <div class="btn-ac">
             <button class="printReceiptBtn" data-index="${index}"><i class="fa-solid fa-print"></i></button>
              <button class="deleteReceiptBtn" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
          </div>
          </td>
      `;
      salesTableBody.appendChild(row);
  });

  // Attach print functionality to each button
  document.querySelectorAll('.printReceiptBtn').forEach(btn => {
      btn.addEventListener('click', function(e) {
          const index = parseInt(this.getAttribute('data-index'));
          const sale = history[index];
          if (sale) {
              printReceipt(sale);
          }
      });
  });

  // Attach delete functionality to each delete button
  document.querySelectorAll('.deleteReceiptBtn').forEach(btn => {
      btn.addEventListener('click', function(e) {
          const index = parseInt(this.getAttribute('data-index'));
          deleteReceipt(index);
      });
  });
}
function renderSalesChart() {
  const history = JSON.parse(localStorage.getItem('salesHistory')) || [];

  const labels = history.map(sale => new Date(sale.date).toLocaleDateString());
  const totals = history.map(sale => sale.total);

  const ctx = document.getElementById('salesChart').getContext('2d');
  
  // Destroy existing chart if it exists (prevents duplicates)
  if (window.salesChartInstance) {
    window.salesChartInstance.destroy();
  }

  window.salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sales Over Time',
        data: totals,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: context => `₱${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `₱${value}`
          }
        }
      }
    }
  });
}


// Function to delete a receipt
function deleteReceipt(index) {
  let history = JSON.parse(localStorage.getItem('salesHistory')) || [];
  history.splice(index, 1); // Remove the receipt at the specified index
  localStorage.setItem('salesHistory', JSON.stringify(history)); // Update localStorage
  loadSalesHistory(); // Refresh the displayed sales history
}

  // Print receipt in new window
  function printReceipt(sale) {
    const receiptWindow = window.open('', 'Print Receipt', 'width=600,height=700');
    const formattedDate = new Date(sale.date).toLocaleString();

    const receiptContent = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Medicine Sales Receipt</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₱${item.unitPrice.toFixed(2)}</td>
                  <td>₱${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total: ₱${sale.total.toFixed(2)}</p>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptContent);
    receiptWindow.document.close();
  }

  // Wire event listeners
  addToCartBtn.addEventListener('click', addToCart);
  finalizeSaleBtn.addEventListener('click', finalizeSale);
  quantityInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addToCart();
  });

  // Initialize UI
  populateMedicineDatalist();
  renderCart();
  loadSalesHistory();
}

// Run initializeSales on page load
window.addEventListener('DOMContentLoaded', initializeSales);
// SALES LINK HANDLER end



// REPORT LINK HANDLER start
document.getElementById('reportLink').addEventListener('click', function(event) {
  event.preventDefault();
  const contentElement = document.getElementById('content');
  const loadingEffect = document.getElementById('loadingEffect');
  const disappearingSection = document.getElementById('disappearingSection');

  disappearingSection.style.display = 'none';
  loadingEffect.style.display = 'flex';
  contentElement.style.display = 'none';

  fetch('report.html') 
    .then(response => response.text())
    .then(data => {
      setTimeout(() => {
          contentElement.innerHTML = data; 
          contentElement.style.display = 'block'; 
          loadingEffect.style.display = 'none';
          document.getElementById('dynamicHeader').innerText = 'Reports Dashboard';
          initializeReport(); // Initialize report functionality
      }, 900);
    })
    .catch(error => console.error('Error loading report.html:', error));
});

function initializeReport() {
  // Get data from localStorage
  const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];

  // Calculate and display total sales
  const totalSales = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  document.getElementById('totalSales').textContent = `₱${totalSales.toFixed(2)}`;

  // Display total transactions
  document.getElementById('totalTransactions').textContent = salesHistory.length;

  // Calculate and display average sale
  const averageSale = salesHistory.length > 0 ? totalSales / salesHistory.length : 0;
  document.getElementById('averageSale').textContent = `₱${averageSale.toFixed(2)}`;

  // Calculate inventory statistics
  const totalStockItems = medicines.length;
  const lowStockItems = medicines.filter(med => parseInt(med.stock) < 50).length;
  const today = new Date();
  const expiringItems = medicines.filter(med => {
    const expiryDate = new Date(med.expiry);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  }).length;

  // Display inventory statistics
  document.getElementById('totalStockItems').textContent = totalStockItems;
  document.getElementById('lowStockItems').textContent = lowStockItems;
  document.getElementById('expiringItems').textContent = expiringItems;

  // Render custom sales chart
  renderCustomSalesChart(salesHistory);

  // Populate recent sales table
  const recentSalesTableBody = document.getElementById('recentSalesTableBody');
  recentSalesTableBody.innerHTML = '';

  // Show last 5 sales
  const recentSales = salesHistory.slice(-5).reverse();
  recentSales.forEach(sale => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(sale.date).toLocaleString()}</td>
      <td>${sale.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
      <td>₱${sale.total.toFixed(2)}</td>
    `;
    recentSalesTableBody.appendChild(row);
  });

  // Populate inventory table
  const inventoryTableBody = document.getElementById('inventoryTableBody');
  if (inventoryTableBody) {
    inventoryTableBody.innerHTML = '';
    const today = new Date();

    medicines.forEach(med => {
      const expiryDate = new Date(med.expiry);
      const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      const stock = parseInt(med.stock);
      
      // Determine status
      let status = '';
      let statusClass = '';
      
      if (daysLeft <= 0) {
        status = 'Expired';
        statusClass = 'status-expired';
      } else if (daysLeft <= 30) {
        status = 'Expiring Soon';
        statusClass = 'status-warning';
      } else if (stock < 50) {
        status = 'Low Stock';
        statusClass = 'status-low';
      } else {
        status = 'In Stock';
        statusClass = 'status-ok';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${med.name}</td>
        <td>${stock}</td>
        <td><span class="status-indicator ${statusClass}">${status}</span></td>
        <td>${new Date(med.expiry).toLocaleDateString()}</td>
        <td>${daysLeft > 0 ? daysLeft : 'Expired'}</td>
      `;
      inventoryTableBody.appendChild(row);
    });
  }
}

function renderCustomSalesChart(salesHistory) {
  const chartContainer = document.querySelector('.chart-wrapper');
  if (!chartContainer) return;

  // Clear existing content
  chartContainer.innerHTML = '';

  // Get last 7 days of sales
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Calculate daily totals
  const dailyTotals = last7Days.map(date => {
    return salesHistory
      .filter(sale => sale.date.startsWith(date))
      .reduce((sum, sale) => sum + sale.total, 0);
  });

  // Find maximum value for scaling
  const maxValue = Math.max(...dailyTotals, 1000); // Minimum height of 1000

  // Create chart elements
  const chart = document.createElement('div');
  chart.className = 'custom-chart';
  chart.innerHTML = `
    <div class="chart-bars">
      ${last7Days.map((date, index) => `
        <div class="chart-bar-container">
          <div class="chart-bar" style="height: ${(dailyTotals[index] / maxValue) * 100}%">
            <span class="bar-value">₱${dailyTotals[index].toFixed(2)}</span>
          </div>
          <span class="bar-label">${new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </div>
      `).join('')}
    </div>
    <div class="chart-grid">
      ${Array.from({ length: 5 }, (_, i) => `
        <div class="grid-line" style="bottom: ${(i * 25)}%">
          <span class="grid-value">₱${((maxValue * (4 - i)) / 4).toFixed(2)}</span>
        </div>
      `).join('')}
    </div>
  `;

  chartContainer.appendChild(chart);
}

// REPORT LINK HANDLER end


