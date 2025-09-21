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

// ======= RELATÓRIOS COM GRÁFICO =======
function loadReport() {
  const reportDate = document.getElementById('reportDate').value;
  if (!reportDate) {
    alert('Selecione uma data');
    return;
  }
  const selectedDate = new Date(reportDate).toLocaleDateString('pt-BR');

  // filtra vendas e cortes para essa data
  const dailyCuts = cutSales.filter(s => new Date(s.date).toLocaleDateString('pt-BR') === selectedDate);
  const productSales = JSON.parse(localStorage.getItem('productSales')) || [];
  const dailyProducts = productSales.filter(s => new Date(s.date).toLocaleDateString('pt-BR') === selectedDate);

  let html = `<h3>Relatório de ${selectedDate}</h3>`;
  html += `<p>Cortes realizados: ${dailyCuts.length}</p>`;
  const cutsTotal = dailyCuts.reduce((sum, s) => sum + Number(s.price), 0);
  html += `<p>Receita cortes: R$${cutsTotal.toFixed(2)}</p>`;
  const productsTotal = dailyProducts.reduce((sum, s) => sum + Number(s.total), 0);
  html += `<p>Receita produtos: R$${productsTotal.toFixed(2)}</p>`;
  html += `<p>Receita total: R$${(cutsTotal + productsTotal).toFixed(2)}</p>`;
  document.getElementById('reportContent').innerHTML = html;

  // gráfico Chart.js
  const ctx = document.getElementById('reportChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cortes', 'Produtos'],
      datasets: [{
        label: 'Receita (R$)',
        data: [cutsTotal, productsTotal],
        backgroundColor: ['#4CAF50', '#2196F3']
      }]
    }
  });
}

// ======= FIADOS =======
let fiados = JSON.parse(localStorage.getItem('fiados')) || [];

function renderFiados() {
  const fiadoList = document.getElementById('fiadoList');
  if (!fiadoList) return;
  fiadoList.innerHTML = '';
  fiados.forEach((f, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.name}</td>
      <td>${f.descricao}</td>
      <td>R$${Number(f.valor).toFixed(2)}</td>
      <td><button onclick="deleteFiado(${index})">Excluir</button></td>
    `;
    fiadoList.appendChild(tr);
  });
}

function deleteFiado(index) {
  fiados.splice(index, 1);
  localStorage.setItem('fiados', JSON.stringify(fiados));
  renderFiados();
}

const fiadoForm = document.getElementById('fiadoForm');
if (fiadoForm) {
  fiadoForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fiadoName').value;
    const descricao = document.getElementById('fiadoDescricao').value;
    const valor = document.getElementById('fiadoValor').value;
    fiados.push({ name, descricao, valor });
    localStorage.setItem('fiados', JSON.stringify(fiados));
    renderFiados();
    e.target.reset();
  });
}

// ======= RESET SALDO =======
function resetSaldo() {
  if (confirm('Tem certeza que deseja resetar o saldo? Isso apagará os lançamentos de hoje.')) {
    // limpar cortes realizados
    cutSales = [];
    localStorage.setItem('cutSales', JSON.stringify(cutSales));
    // limpar vendas de produtos
    localStorage.removeItem('productSales');
    // atualizar resumo
    renderCutSales();
    updateDailySummary();
    alert('Saldo resetado com sucesso!');
  }
}

// Inicialização
renderClients();
renderProducts();
renderCutTypes();
renderCutSales();
renderFiados();
updateDailySummary();
