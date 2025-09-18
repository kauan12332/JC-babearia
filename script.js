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

// Inicialização
renderClients();
renderProducts();
