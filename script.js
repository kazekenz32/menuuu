
/* =====================================
   1. PENGATURAN CAFE
===================================== */

// Ganti dengan nomor WhatsApp cafe.
// Contoh: 081234567890 menjadi 6281234567890.
const NOMOR_WA_CAFE = "6281234567890";
const NAMA_CAFE = "MenuKita Cafe";

/* =====================================
   2. DATA MENU DAN FOTO
===================================== */

// Foto harus tersedia di folder images.
// Nama file dan huruf besar/kecil harus cocok.

const menus = [
  {
    id: 1,
    name: "Kopi Susu Senja",
    category: "Minuman",
    price: 18000,
    emoji: "☕",
    image: "images/kopi-susu.jpg",
    description: "Kopi susu dengan rasa lembut."
  },
  {
    id: 2,
    name: "Americano",
    category: "Minuman",
    price: 15000,
    emoji: "☕",
    image: "images/americano.jpg",
    description: "Kopi hitam klasik."
  },
  {
    id: 3,
    name: "Es Teh",
    category: "Minuman",
    price: 7000,
    emoji: "🍹",
    image: "images/es-teh.jpg",
    description: "Teh dingin yang menyegarkan."
  },
  {
    id: 4,
    name: "Kentang Goreng",
    category: "Camilan",
    price: 16000,
    emoji: "🍟",
    image: "images/kentang-goreng.jpg",
    description: "Kentang goreng renyah dan gurih."
  },
  {
    id: 5,
    name: "Roti Cokelat",
    category: "Camilan",
    price: 12000,
    emoji: "🥐",
    image: "images/roti-cokelat.jpg",
    description: "Roti lembut dengan isian cokelat."
  },
  {
    id: 6,
    name: "Nasi Ayam",
    category: "Makanan",
    price: 25000,
    emoji: "🍗",
    image: "images/nasi-ayam.jpg",
    description: "Nasi hangat dengan ayam berbumbu."
  },
  {
    id: 7,
    name: "Nasi Goreng",
    category: "Makanan",
    price: 22000,
    emoji: "🍛",
    image: "images/nasi-goreng.jpg",
    description: "Nasi goreng dengan bumbu pilihan."
  },
  {
    id: 8,
    name: "Matcha Latte",
    category: "Minuman",
    price: 20000,
    emoji: "🍵",
    image: "images/matcha-latte.jpg",
    description: "Matcha creamy dengan rasa khas."
  },
  {
    id: 9,
    name: "Pisang Goreng",
    category: "Camilan",
    price: 13000,
    emoji: "🍌",
    image: "images/pisang-goreng.jpg",
    description: "Pisang goreng hangat dan renyah."
  }
];

/* =====================================
   3. MENGHUBUNGKAN HTML DENGAN JAVASCRIPT
===================================== */

const menuList = document.querySelector("#menu-list");
const categoriesBox = document.querySelector("#categories");
const searchInput = document.querySelector("#search");
const cartList = document.querySelector("#cart-list");
const totalBox = document.querySelector("#total");
const cartCount = document.querySelector("#cart-count");
const tableNumber = document.querySelector("#table-number");
const orderButton = document.querySelector("#order-button");
const messageBox = document.querySelector("#message");
const yearBox = document.querySelector("#year");

/* =====================================
   4. KERANJANG SEMENTARA
===================================== */

// Tidak menggunakan database.
// Isi keranjang hilang jika halaman dimuat ulang.

const cart = [];
let activeCategory = "Semua";

/* =====================================
   5. FORMAT HARGA RUPIAH
===================================== */

function rupiah(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

/* =====================================
   6. MENAMPILKAN KATEGORI
===================================== */

function renderCategories() {
  const categories = [
    "Semua",
    ...new Set(menus.map(menu => menu.category))
  ];

  categoriesBox.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "category-button";
    button.textContent = category;

    if (category === activeCategory) {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderMenus();
    });

    categoriesBox.appendChild(button);
  });
}

/* =====================================
   7. MENAMPILKAN MENU DAN FOTO
===================================== */

function renderMenus() {
  const keyword = searchInput.value
    .toLowerCase()
    .trim();

  const filteredMenus = menus.filter(menu => {
    const matchesCategory =
      activeCategory === "Semua" ||
      menu.category === activeCategory;

    const searchableText = (
      menu.name + " " +
      menu.category + " " +
      menu.description
    ).toLowerCase();

    return matchesCategory && searchableText.includes(keyword);
  });

  menuList.replaceChildren();

  if (filteredMenus.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty-menu";
    emptyMessage.textContent =
      "Menu tidak ditemukan. Coba kata kunci lain.";

    menuList.appendChild(emptyMessage);
    return;
  }

  filteredMenus.forEach(menu => {
    const card = document.createElement("article");
    card.className = "menu-card";

    // FOTO MENU
    const image = document.createElement("img");

    image.className = "menu-image";
    image.src = menu.image;
    image.alt = menu.name;
    image.loading = "lazy";

    // Jika foto gagal dimuat, tampilkan emoji.
    image.onerror = () => {
      const fallback = document.createElement("div");

      fallback.className = "menu-emoji";
      fallback.textContent = menu.emoji;
      fallback.setAttribute("aria-label", menu.name);

      image.replaceWith(fallback);
    };

    // KATEGORI
    const category = document.createElement("p");

    category.className = "menu-category";
    category.textContent = menu.category;

    // NAMA MENU
    const title = document.createElement("h3");

    title.textContent = menu.name;

    // DESKRIPSI
    const description = document.createElement("p");

    description.className = "menu-description";
    description.textContent = menu.description;

    // BAGIAN HARGA DAN TOMBOL
    const bottom = document.createElement("div");

    bottom.className = "menu-bottom";

    const price = document.createElement("div");

    price.className = "price";
    price.textContent = rupiah(menu.price);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "add-button";
    button.textContent = "+ Tambah ke Keranjang";

    button.addEventListener("click", () => {
      addToCart(menu.id);
    });

    bottom.append(price, button);

    card.append(
      image,
      category,
      title,
      description,
      bottom
    );

    menuList.appendChild(card);
  });
}

/* =====================================
   8. MENAMBAHKAN MENU KE KERANJANG
===================================== */

function addToCart(id) {
  const menu = menus.find(item => item.id === id);

  if (!menu) {
    return;
  }

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...menu,
      quantity: 1
    });
  }

  renderCart();

  showMessage(
    menu.name + " berhasil ditambahkan.",
    "success"
  );
}

/* =====================================
   9. MENAMBAH ATAU MENGURANGI JUMLAH
===================================== */

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    const index = cart.findIndex(
      product => product.id === id
    );

    cart.splice(index, 1);
  }

  renderCart();
}

/* =====================================
   10. MENGHITUNG TOTAL HARGA
===================================== */

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

/* =====================================
   11. MENAMPILKAN KERANJANG
===================================== */

function renderCart() {
  cartList.replaceChildren();

  if (cart.length === 0) {
    cartList.textContent = "Keranjang masih kosong.";
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("div");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent =
      rupiah(item.price) + " per item";

    info.append(name, price);

    const actions = document.createElement("div");
    actions.className = "cart-actions";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.className = "quantity-button";
    minusButton.textContent = "−";
    minusButton.setAttribute(
      "aria-label",
      "Kurangi " + item.name
    );

    minusButton.addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });

    const quantity = document.createElement("span");
    quantity.className = "quantity-number";
    quantity.textContent = item.quantity;

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.className = "quantity-button";
    plusButton.textContent = "+";
    plusButton.setAttribute(
      "aria-label",
      "Tambah " + item.name
    );

    plusButton.addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });

    actions.append(minusButton, quantity, plusButton);
    row.append(info, actions);

    cartList.appendChild(row);
  });

  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  totalBox.textContent = rupiah(calculateTotal());
  cartCount.textContent = totalQuantity + " item";
}

/* =====================================
   12. PESAN STATUS
===================================== */

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
}

/* =====================================
   13. PESAN MELALUI WHATSAPP
===================================== */

function orderViaWhatsApp() {
  if (cart.length === 0) {
    showMessage(
      "Keranjang masih kosong. Tambahkan menu dahulu.",
      "error"
    );
    return;
  }

  const table = tableNumber.value.trim();

  if (!table) {
    showMessage(
      "Silakan isi nomor meja terlebih dahulu.",
      "error"
    );

    tableNumber.focus();
    return;
  }

  // Format nomor: kode negara 62 diikuti nomor HP.
  if (!/^62\d{8,15}$/.test(NOMOR_WA_CAFE)) {
    showMessage(
      "Nomor WhatsApp cafe belum benar. Periksa script.js.",
      "error"
    );
    return;
  }

  const lines = [
    "Halo " + NAMA_CAFE + ", saya ingin memesan:",
    "",
    "Nomor meja: " + table,
    "",
    "Daftar pesanan:"
  ];

  cart.forEach((item, index) => {
    lines.push(
      (index + 1) + ". " +
      item.name + " x " + item.quantity +
      " = " + rupiah(item.price * item.quantity)
    );
  });

  lines.push("");
  lines.push("Total: " + rupiah(calculateTotal()));
  lines.push("");
  lines.push("Mohon konfirmasi pesanan saya. Terima kasih!");

  const message = lines.join("\n");

  const whatsappURL =
    "https://wa.me/" +
    NOMOR_WA_CAFE +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =====================================
   14. MENJALANKAN WEBSITE
===================================== */

// Pencarian menu
searchInput.addEventListener("input", renderMenus);

// Tombol WhatsApp
orderButton.addEventListener("click", orderViaWhatsApp);

// Tahun footer otomatis
yearBox.textContent = new Date().getFullYear();

// Tampilkan isi halaman saat dibuka
renderCategories();
renderMenus();
renderCart();
