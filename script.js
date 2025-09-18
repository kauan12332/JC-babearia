// ======= CLIENTES =======
const clientForm = document.getElementById('clientForm');
const clientList = document.getElementById('clientList');
const clientSearch = document.getElementById('clientSearch');

let clients = JSON.parse(localStorage.getItem('clients')) || [];

function renderClients(filter = '') {
  clientList.innerHTML = '';
  clients
    .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((c, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.service}</td>
        <td>${new Date(c.dateTime).toLocaleString('pt-BR')}</td>
        <td>
          <button class="edit-btn" onclick="editClient(${index})">Editar</button>
          <button class="action-btn" onclick="deleteClient(${index})">Excluir</button>
        </td>
      `;
      clientList.appendChild(tr);
    });
}

function deleteClient(index) {
  clients.splice(index, 1);
  localStorage.setItem('clients', JSON.stringify(clients));
  renderClients(clientSearch.value);
}

function editClient(index) {
  const c = clients[index];
  document.getElementById('clientName').value = c.name;
  document.getElementById('service').value = c.service;
  document.getElementById('dateTime').value = c.dateTime;
  document.getElementById('clientIndex').value = index;
}

clientForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('clientName').value;
  const service = document.getElementById('service').value;
  const dateTime = document.getElementById('dateTime').value;
  const index = document.getElementById('clientIndex').value;

  if (index === '') {
    clients.push({ name, service, dateTime });
  } else {
    clients[index] = { name, service, dateTime };
  }

  localStorage.setItem('clients', JSON.stringify(clients));
  renderClients(clientSearch.value);
  clientForm.reset();
  document.getElementById('clientIndex').value = '';
});

clientSearch.addEventListener('input', () => renderClients(clientSearch.value));

// ======= PRODUTOS =======
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productSearch = document.getElementById('productSearch');

let products = JSON.parse(localStorage.getItem('products')) || [];

function renderProducts(filter = '') {
  productList.innerHTML = '';
  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>R$${Number(p.price).toFixed(2)}</td>
        <td>${p.qty}</td>
        <td>
          <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
          <button class="action-btn" onclick="deleteProduct(${index})">Excluir</button>
          <button class="edit-btn" onclick="sellProduct(${index})">Vender</button>
        </td>
      `;
      productList.appendChild(tr);
    });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts(productSearch.value);
}

function editProduct(index) {
  const p = products[index];
  document.getElementById('productName').value = p.name;
  document.getElementById('productPrice').value = p.price;
  document.getElementById('productQty').value = p.qty;
  document.getElementById('productIndex').value = index;
}

productForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const qty = document.getElementById('productQty').value;
  const index = document.getElementById('productIndex').value;

  if (index === '') {
    products.push({ name, price, qty });
  } else {
    products[index] = { name, price, qty };
  }

  localStorage.setItem('products', JSON.stringify(products));
  renderProducts(productSearch.value);
  productForm.reset();
  document.getElementById('productIndex').value = '';
});

productSearch.addEventListener('input', () => renderProducts(productSearch.value));

// ======= VENDER PRODUTO =======
function sellProduct(index) {
  const p = products[index];
  if (p.qty <= 0) {
    alert('Estoque insuficiente!');
    return;
  }
  p.qty--;
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts(productSearch.value);

  let productSales = JSON.parse(localStorage.getItem('productSales')) || [];
  productSales.push({
    name: p.name,
    total: p.price,
    date: new Date().toISOString()
  });
  localStorage.setItem('productSales', JSON.stringify(productSales));
  updateDailySummary();
}

// ======= TIPOS DE CORTES =======
let cutTypes = JSON.parse(localStorage.getItem('cutTypes')) || [];
let cutSales = JSON.parse(localStorage.getItem('cutSales')) || [];

function renderCutTypes() {
  const cutTypeList = document.getElementById('cutTypeList');
  const cutSelect = document.getElementById('cutSelect');
  if (!cutTypeList || !cutSelect) return;
  cutTypeList.innerHTML = '';
  cutSelect.innerHTML = '<option value="">Selecione o corte</option>';

  cutTypes.forEach((c, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>R$${Number(c.price).toFixed(2)}</td>
      <td><button class="action-btn" onclick="deleteCutType(${index})">Excluir</button></td>
    `;
    cutTypeList.appendChild(tr);

    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = `${c.name} - R$${Number(c.price).toFixed(2)}`;
    cutSelect.appendChild(opt);
  });
}

function deleteCutType(index) {
  cutTypes.splice(index, 1);
  localStorage.setItem('cutTypes', JSON.stringify(cutTypes));
  renderCutTypes();
}

const cutTypeForm = document.getElementById('cutTypeForm');
if (cutTypeForm) {
  cutTypeForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cutName').value;
    const price = document.getElementById('cutPrice').value;
    cutTypes.push({ name, price });
    localStorage.setItem('cutTypes', JSON.stringify(cutTypes));
    renderCutTypes();
    e.target.reset();
  });
}

// ======= REGISTRAR CORTES REALIZADOS =======
function renderCutSales() {
  const cutSaleList = document.getElementById('cutSaleList');
  if (!cutSaleList) return;
  cutSaleList.innerHTML = '';
  cutSales.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>R$${Number(s.price).toFixed(2)}</td>
      <td>${new Date(s.date).toLocaleString('pt-BR')}</td>
    `;
    cutSaleList.appendChild(tr);
  });
  updateDailySummary();
}

const cutSaleForm = document.getElementById('cutSaleForm');
if (cutSaleForm) {
  cutSaleForm.addEventListener('submit', e => {
    e.preventDefault();
    const index = document.getElementById('cutSelect').value;
    if (index === '') return;
    const c = cutTypes[index];
    cutSales.push({ name: c.name, price: c.price, date: new Date().toISOString() });
    localStorage.setItem('cutSales', JSON.stringify(cutSales));
    renderCutSales();
    e.target.reset();
  });
}

// ======= RESUMO DIÁRIO =======
function updateDailySummary() {
  const dailyCutsEl = document.getElementById('dailyCuts');
  const dailyRevenueEl = document.getElementById('dailyRevenue');
  if (!dailyCutsEl || !dailyRevenueEl) return;

  const today = new Date().toLocaleDateString('pt-BR');
  const dailyCuts = cutSales.filter(s => new Date(s.date).toLocaleDateString('pt-BR') === today);
  const dailyCutsTotal = dailyCuts.length;
  const dailyCutsRevenue = dailyCuts.reduce((sum, s) => sum + Number(s.price), 0);

  const productSales = JSON.parse(localStorage.getItem('productSales')) || [];
  const dailyProductSales = productSales.filter(s => new Date(s.date).toLocaleDateString('pt-BR') === today);
  const dailyProductRevenue = dailyProductSales.reduce((sum, s) => sum + Number(s.total), 0);

  const totalRevenue = dailyCutsRevenue + dailyProductRevenue;

  dailyCutsEl.textContent = `Total de cortes hoje: ${dailyCutsTotal}`;
  dailyRevenueEl.textContent = `Receita total hoje: R$ ${totalRevenue.toFixed(2)}`;
}

function printReport() {
  window.print();
}

// Inicialização
renderClients();
renderProducts();
renderCutTypes();
renderCutSales();
updateDailySummary();
