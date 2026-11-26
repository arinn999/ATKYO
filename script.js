// Data Produk Alat Tulis menggunakan Foto Asli (Realistis)
const initialProducts = [
  {
    id: 1,
    name: "Buku Catatan Grid A5",
    brand: "Joyko",
    price: 25000,
    desc: "Buku tulis kertas tebal anti-tembus dengan desain sampul minimalis.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Pensil Warna Classic",
    brand: "Faber-Castell",
    price: 65000,
    desc: "Pensil warna pigmen cerah dan tidak mudah patah untuk menggambar.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Pulpen Gel Hitam",
    brand: "Kenko",
    price: 18000,
    desc: "Pulpen gel tinta cepat kering dan nyaman digenggam untuk menulis sehari-hari.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Spidol Whiteboard Set",
    brand: "Snowman",
    price: 32000,
    desc: "Spidol papan tulis mudah dihapus tanpa meninggalkan bekas noda.",
    image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=500&q=80"
  }
];

// State Aplikasi (Ambil dari localStorage jika ada)
let products = JSON.parse(localStorage.getItem('at_products')) || initialProducts;
let cart = JSON.parse(localStorage.getItem('at_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('at_user')) || null;

// Elemen DOM
const productListEl = document.getElementById('productList');
const brandFilterEl = document.getElementById('brandFilter');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const authBtn = document.getElementById('authBtn');
const sellBtn = document.getElementById('sellBtn');
const userGreeting = document.getElementById('userGreeting');

// Modal Elemen
const loginModal = document.getElementById('loginModal');
const sellModal = document.getElementById('sellModal');
const cartModal = document.getElementById('cartModal');
const closeLogin = document.getElementById('closeLogin');
const closeSell = document.getElementById('closeSell');
const closeCart = document.getElementById('closeCart');
const cartBtn = document.getElementById('cartBtn');

// Form Elemen
const loginForm = document.getElementById('loginForm');
const sellForm = document.getElementById('sellForm');
const checkoutBtn = document.getElementById('checkoutBtn');

// Format Rupiah
function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

// Render Katalog Produk (Mendukung Filter Merk)
function renderProducts(selectedBrand = 'Semua') {
  productListEl.innerHTML = '';

  const filteredProducts = selectedBrand === 'Semua'
    ? products
    : products.filter(p => p.brand === selectedBrand);

  if (filteredProducts.length === 0) {
    productListEl.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#747d8c;">Belum ada produk untuk merk ini.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="brand-badge">${product.brand}</span>
      <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80'">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-price">${formatRupiah(product.price)}</div>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">
          + Tambah ke Keranjang
        </button>
      </div>
    `;
    productListEl.appendChild(card);
  });
}

// Event Filter Merk
brandFilterEl.addEventListener('change', (e) => {
  renderProducts(e.target.value);
});

// Fitur Jual Barang (Buka Modal Jual)
sellBtn.addEventListener('click', () => {
  if (!currentUser) {
    alert('Silakan LOGIN terlebih dahulu untuk menjual alat tulis!');
    loginModal.classList.remove('hidden');
    return;
  }
  sellModal.classList.remove('hidden');
});

// Submit Form Jual Barang
sellForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('sellName').value.trim();
  const brand = document.getElementById('sellBrand').value;
  const price = parseInt(document.getElementById('sellPrice').value);
  const imageInput = document.getElementById('sellImage').value.trim();
  const desc = document.getElementById('sellDesc').value.trim();

  // Jika user tidak mengisi link gambar, pakai gambar default foto asli
  const defaultPhoto = "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80";

  const newProduct = {
    id: Date.now(),
    name: name,
    brand: brand,
    price: price,
    image: imageInput || defaultPhoto,
    desc: `${desc} (Dijual oleh: ${currentUser})`
  };

  products.unshift(newProduct);
  localStorage.setItem('at_products', JSON.stringify(products));

  brandFilterEl.value = 'Semua';
  renderProducts('Semua');

  sellForm.reset();
  sellModal.classList.add('hidden');
  alert(`Produk "${name}" (${brand}) berhasil ditayangkan di toko!`);
});

// Tambah ke Keranjang
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveAndRenderCart();
  alert(`"${product.name}" berhasil masuk keranjang!`);
}

// Ubah Jumlah Item di Keranjang
function updateQty(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveAndRenderCart();
}

// Hapus Item dari Keranjang
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveAndRenderCart();
}

// Simpan & Render Keranjang
function saveAndRenderCart() {
  localStorage.setItem('at_cart', JSON.stringify(cart));
  
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;

  cartItemsEl.innerHTML = '';
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="text-align:center; color:#747d8c; padding:1rem;">Keranjang belanja masih kosong.</p>';
  } else {
    cart.forEach(item => {
      const subtotal = item.price * item.qty;
      totalPrice += subtotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name} <small style="color:#747d8c;">(${item.brand})</small></h4>
          <p>${formatRupiah(item.price)} x ${item.qty} = ${formatRupiah(subtotal)}</p>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
      `;
      cartItemsEl.appendChild(itemEl);
    });
  }

  cartTotalEl.textContent = formatRupiah(totalPrice);
}

// Manajemen Login / Logout
function updateAuthUI() {
  if (currentUser) {
    userGreeting.textContent = `Halo, ${currentUser}!`;
    userGreeting.classList.remove('hidden');
    authBtn.textContent = 'Logout';
  } else {
    userGreeting.classList.add('hidden');
    authBtn.textContent = 'Login';
  }
}

authBtn.addEventListener('click', () => {
  if (currentUser) {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      currentUser = null;
      localStorage.removeItem('at_user');
      updateAuthUI();
    }
  } else {
    loginModal.classList.remove('hidden');
  }
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('username').value.trim();
  if (usernameInput) {
    currentUser = usernameInput;
    localStorage.setItem('at_user', JSON.stringify(currentUser));
    updateAuthUI();
    loginModal.classList.add('hidden');
    loginForm.reset();
    alert(`Selamat datang, ${currentUser}!`);
  }
});

// Fitur Checkout / Beli
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Keranjang Anda masih kosong. Pilih produk terlebih dahulu!');
    return;
  }

  if (!currentUser) {
    alert('Anda harus LOGIN terlebih dahulu untuk menyelesaikan pembelian!');
    cartModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
    return;
  }

  const totalBayar = cartTotalEl.textContent;
  alert(`Terima kasih ${currentUser}!\nPesanan alat tulis sebesar ${totalBayar} berhasil diproses. 📦✏️`);
  
  cart = [];
  saveAndRenderCart();
  cartModal.classList.add('hidden');
});

// Kontrol Buka/Tutup Modal
cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
closeLogin.addEventListener('click', () => loginModal.classList.add('hidden'));
closeSell.addEventListener('click', () => sellModal.classList.add('hidden'));

window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.add('hidden');
  if (e.target === sellModal) sellModal.classList.add('hidden');
  if (e.target === cartModal) cartModal.classList.add('hidden');
});

// Inisialisasi awal
renderProducts();
saveAndRenderCart();
updateAuthUI();
