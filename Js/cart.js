(() => {
  "use strict";

  // ---------- Data ----------
  const products = [
    {
      id: 1,
      name: "Handmade Diya Holder 2 pcs",
      description: "A colourful decorative accent for your space.",
      price: 230,
      category: "Home Decor",
      image: "Img/Handmade 2pc.jpg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 2,
      name: "Handmade Diya Holder 6 pcs",
      description: "A lovely gift, thoughtfully presented.",
      price: 550,
      category: "Home Decor",
      image: "Img/Handmade 6pcs.jpg",
      badge: "Bestseller",
      available: true
    },
       {
      id: 3,
      name: "Handmade Diya Holder 6 pcs",
      description: "A lovely gift, thoughtfully presented.",
      price: 550,
      category: "Home Decor",
      image: "Img/Handmade1 6pcs.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 4,
      name: "Handmade Diya Holder 4 pcs",
      description: "A lovely gift, thoughtfully presented.",
      price: 340,
      category: "Home Decor",
      image: "Img/Handmade moti 4pcs.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 5,
      name: "Handmade Diya Holder 4 pcs",
      description: "A lovely gift, thoughtfully presented.",
      price: 340,
      category: "Home Decor",
      image: "Img/Handmade diya 4pcs.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 6,
      name: "Handmade Diya Holder 6 pcs",
      description: "A lovely gift, thoughtfully presented.",
      price: 600,
      category: "Home Decor",
      image: "Img/Handmade moti 6pc.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 7,
      name: "Resin Pendant",
      description: "A lovely gift, thoughtfully presented.",
      price: 180,
      category: "Resin Art",
      image: "Img/Pendant 1.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 8,
      name: "Resin Pendant",
      description: "A lovely gift, thoughtfully presented.",
      price: 180,
      category: "Resin Art",
      image: "Img/Pendant.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 9,
      name: "Resin Pooja Thali",
      description: "A lovely gift, thoughtfully presented.",
      price: 1100,
      category: "Resin Art",
      image: "Img/Resin pooja thali.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 10,
      name: "Resin Pooja Thali",
      description: "A lovely gift, thoughtfully presented.",
      price: 1100,
      category: "Resin Art",
      image: "Img/Resin pooja thali1.jpeg",
      badge: "Bestseller",
      available: true
    },
    {
      id: 11,
      name: "Resin Key Chain",
      description: "A lovely gift, thoughtfully presented.",
      price: 120,
      category: "Resin Art",
      image: "Img/Resin keychain.jpeg",
      badge: "Bestseller",
      available: true
    },
  ];

  // Business WhatsApp number: country code + digits only.
  const WHATSAPP_NUMBER = "918378836293";

  const CART_KEY = "anandi-cart";
  const MAX_QTY = 10;

  // ---------- Elements ----------
  const $ = id => document.getElementById(id);

  const grid = $("ap-grid");
  const search = $("ap-search");
  const sort = $("ap-sort");
  const categoriesBox = $("ap-categories");

  const modal = $("ap-modal");
  const modalClose = $("ap-modal-close");
  const modalImage = $("ap-modal-image");
  const modalTitle = $("ap-modal-title");
  const modalCategory = $("ap-modal-category");
  const modalDescription = $("ap-modal-description");
  const modalPrice = $("ap-modal-price");
  const modalStock = $("ap-modal-stock");
  const modalAdd = $("ap-modal-add");

  const cartOpenBtn = $("cart-open");
  const cartCloseBtn = $("cart-close");
  const cartDrawer = $("cart-drawer");
  const cartOverlay = $("cart-overlay");
  const cartItems = $("cart-items");
  // Select by class so every badge / total on the page updates,
  // even if an id was duplicated or named differently.
  const cartCounts = document.querySelectorAll(".cart-count, [id='cartCount']");
  const cartTotals = document.querySelectorAll(".cart-total-value, [id='cart-total']");
  const cartCheckout = $("cart-checkout");

  // Helpful console message if an id in the HTML doesn't match this script
  Object.entries({
    "cart-open": cartOpenBtn, "cart-close": cartCloseBtn,
    "cart-drawer": cartDrawer, "cart-overlay": cartOverlay,
    "cart-items": cartItems, ".cart-count": cartCounts.length,
    ".cart-total-value": cartTotals.length, "cart-checkout": cartCheckout,
    "ap-modal-add": modalAdd
  }).forEach(([id, node]) => {
    if (!node) console.error('Cart: no element "' + id + '" found in the page');
  });

  let activeCategory = "All Products";
  let previouslyFocusedElement = null;
  let cartLastFocused = null;

  const categories = [
    "All Products",
    ...new Set(products.map(product => product.category))
  ];

  // ---------- Helpers ----------
  const rupees = n => "₹" + n.toLocaleString("en-IN");
  const findProduct = id => products.find(p => p.id === id);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function makeWhatsAppLink(message) {
    if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) return "";
    return "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(message);
  }

  // ---------- Cart state ({ productId: quantity }) ----------
  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY)) || {};
      const clean = {};
      Object.entries(saved).forEach(([id, qty]) => {
        const product = findProduct(Number(id));
        if (product && product.available && Number.isInteger(qty) && qty > 0) {
          clean[id] = Math.min(qty, MAX_QTY);
        }
      });
      return clean;
    } catch {
      return {};
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }

  let cart = loadCart();

  function cartTotalValue() {
    return Object.keys(cart).reduce((sum, id) => {
      return sum + findProduct(Number(id)).price * cart[id];
    }, 0);
  }

  function createCartMessage() {
    const lines = Object.keys(cart).map((id, i) => {
      const product = findProduct(Number(id));
      const qty = cart[id];
      return (i + 1) + ". " + product.name + " × " + qty +
        " = " + rupees(product.price * qty);
    });

    return "Hello Anandi Art & Craft! I'd like to order:\n\n" +
      lines.join("\n") +
      "\n\nTotal: " + rupees(cartTotalValue()) +
      "\n\nPlease confirm availability and delivery details.";
  }

  function addToCart(id) {
    cart[id] = Math.min((cart[id] || 0) + 1, MAX_QTY);
    saveCart();
    renderCart();

    cartCounts.forEach(badge => {
      badge.classList.remove("bump");
      void badge.offsetWidth; // restart animation
      badge.classList.add("bump");
    });
  }

  function changeQty(id, delta) {
    cart[id] = Math.min((cart[id] || 0) + delta, MAX_QTY);
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
  }

  function actionButton(label, action, id, ariaLabel, className) {
    const btn = el("button", className, label);
    btn.type = "button";
    btn.dataset.action = action;
    btn.dataset.id = id;
    btn.setAttribute("aria-label", ariaLabel);
    return btn;
  }

  function renderCart() {
    const ids = Object.keys(cart).map(Number);
    let count = 0;

    cartItems.replaceChildren();

    if (!ids.length) {
      cartItems.appendChild(
        el("li", "cart-empty", "Your cart is empty. Add something you love.")
      );
    }

    ids.forEach(id => {
      const product = findProduct(id);
      const qty = cart[id];
      count += qty;

      const li = el("li", "cart-item");

      const img = el("img", "cart-item-img");
      img.src = product.image;
      img.alt = "";
      img.addEventListener("error", () => { img.style.visibility = "hidden"; });

      const info = el("div", "cart-item-info");
      info.append(
        el("p", "cart-item-name", product.name),
        el("p", "cart-item-price", rupees(product.price) + " each")
      );

      const qtyBox = el("div", "cart-qty");
      const qtyValue = el("span", "", String(qty));
      qtyValue.setAttribute("aria-live", "polite");
      qtyBox.append(
        actionButton("−", "dec", id, "Decrease quantity of " + product.name),
        qtyValue,
        actionButton("+", "inc", id, "Increase quantity of " + product.name)
      );
      info.appendChild(qtyBox);

      const side = el("div", "cart-item-side");
      side.append(
        el("span", "cart-item-total", rupees(product.price * qty)),
        actionButton("Remove", "remove", id, "Remove " + product.name + " from cart", "cart-remove")
      );

      li.append(img, info, side);
      cartItems.appendChild(li);
    });

    cartTotals.forEach(node => { node.textContent = rupees(cartTotalValue()); });
    cartCounts.forEach(node => { node.textContent = count; });

    // Checkout link is rebuilt on every change
    if (ids.length) {
      cartCheckout.href = "payment.html";
      cartCheckout.removeAttribute("aria-disabled");
    } else {
      cartCheckout.removeAttribute("href");
      cartCheckout.setAttribute("aria-disabled", "true");
    }
  }

  cartItems.addEventListener("click", event => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "inc") changeQty(id, 1);
    if (btn.dataset.action === "dec") changeQty(id, -1);
    if (btn.dataset.action === "remove") removeFromCart(id);
  });

  // ---------- Cart drawer open / close ----------
  function openCart() {
    cartLastFocused = document.activeElement;
    cartDrawer.classList.add("is-open");
    cartOverlay.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cartCloseBtn.focus();
  }

  function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartOverlay.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (cartLastFocused) cartLastFocused.focus();
  }

  cartOpenBtn.addEventListener("click", openCart);
  cartCloseBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // ---------- Product quick view ----------
  function openProductDetails(product) {
    previouslyFocusedElement = document.activeElement;

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalCategory.textContent = product.category;
    modalDescription.textContent = product.description;
    modalPrice.textContent = rupees(product.price);
    modalStock.textContent = product.available
      ? "● Made to order · ready in 2–3 days"
      : "● Currently Unavailable";

    modalAdd.dataset.id = product.id;
    modalAdd.style.display = product.available ? "inline-flex" : "none";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeProductDetails() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (previouslyFocusedElement) previouslyFocusedElement.focus();
  }

  modalClose.addEventListener("click", closeProductDetails);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeProductDetails();
  });

  modalAdd.addEventListener("click", () => {
    addToCart(Number(modalAdd.dataset.id));
    closeProductDetails();
    openCart();
  });

  // ---------- Keyboard: Esc + focus trap in drawer ----------
  document.addEventListener("keydown", event => {
    const cartIsOpen = cartDrawer.classList.contains("is-open");

    if (event.key === "Escape") {
      if (cartIsOpen) closeCart();
      else if (modal.classList.contains("is-open")) closeProductDetails();
      return;
    }

    if (event.key === "Tab" && cartIsOpen) {
      const focusable = cartDrawer.querySelectorAll(
        "button:not([disabled]), a[href]"
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // ---------- Categories, filtering, sorting ----------
  function renderCategories() {
    categoriesBox.replaceChildren();

    categories.forEach(category => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ap-category";
      button.textContent = category;
      button.setAttribute("aria-pressed", String(activeCategory === category));

      button.addEventListener("click", () => {
        activeCategory = category;
        renderCategories();
        renderProducts();
      });

      categoriesBox.appendChild(button);
    });
  }

  function getVisibleProducts() {
    const query = search.value.trim().toLowerCase();

    const filtered = products.filter(product => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch = (
        product.name + " " +
        product.description + " " +
        product.category
      ).toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    switch (sort.value) {
      case "low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }

  function renderProducts() {
    const filtered = getVisibleProducts();

    grid.replaceChildren();

    if (!filtered.length) {
      grid.appendChild(
        el("p", "ap-empty", "No products found. Try another search.")
      );
      return;
    }

    filtered.forEach(product => {
      const card = el("article", "ap-card");
      card.dataset.id = product.id;

      const imageWrap = el("div", "ap-image-wrap");

      const image = el("img", "ap-image");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.addEventListener("error", () => { image.style.display = "none"; });

      const badge = el("span", "ap-badge", product.badge || product.category);

      const wishlist = el("button", "ap-wishlist", "♡");
      wishlist.type = "button";
      wishlist.setAttribute("aria-label", "Add " + product.name + " to wishlist");
      wishlist.setAttribute("aria-pressed", "false");

      wishlist.addEventListener("click", () => {
        const selected = wishlist.getAttribute("aria-pressed") !== "true";
        wishlist.setAttribute("aria-pressed", String(selected));
        wishlist.textContent = selected ? "♥" : "♡";
        wishlist.setAttribute(
          "aria-label",
          (selected ? "Remove " : "Add ") + product.name + " " +
          (selected ? "from" : "to") + " wishlist"
        );
      });

      imageWrap.append(image, badge, wishlist);

      const body = el("div", "ap-card-body");
      const name = el("h3", "", product.name);
      const description = el("p", "ap-description", product.description);

      const priceRow = el("div", "ap-price-row");
      const price = el("span", "ap-price", rupees(product.price));
      const stock = el(
        "span",
        "ap-stock" + (product.available ? "" : " ap-unavailable"),
        product.available ? "● Made to order" : "● Unavailable"
      );
      priceRow.append(price, stock);

      const addBtn = el("button", "ap-button ap-order");
      addBtn.type = "button";

      if (product.available) {
        addBtn.dataset.add = product.id;
        const icon = el("i", "fas fa-shopping-cart");
        icon.setAttribute("aria-hidden", "true");
        addBtn.append(icon, " Add to Cart");
      } else {
        addBtn.disabled = true;
        addBtn.textContent = "Currently Unavailable";
      }

      body.append(name, description, priceRow, addBtn);
      card.append(imageWrap, body);
      grid.appendChild(card);
    });
  }

  // One listener for every card: add-to-cart buttons and quick view
  grid.addEventListener("click", event => {
    const addBtn = event.target.closest("[data-add]");
    if (addBtn) {
      addToCart(Number(addBtn.dataset.add));
      openCart();
      return;
    }

    if (event.target.closest("button, a")) return;

    const card = event.target.closest(".ap-card");
    if (!card) return;

    const product = findProduct(Number(card.dataset.id));
    if (product) openProductDetails(product);
  });

  search.addEventListener("input", renderProducts);
  sort.addEventListener("change", renderProducts);

  // ---------- Custom order link ----------
  const customOrder = $("ap-custom-order");
  const customLink = makeWhatsAppLink(
    "Hello Anandi Art & Craft! I'd like to enquire about a custom handmade order."
  );

  if (customLink) {
    customOrder.href = customLink;
    customOrder.target = "_blank";
    customOrder.rel = "noopener noreferrer";
  } else {
    customOrder.href = "#";
    customOrder.addEventListener("click", event => {
      event.preventDefault();
      alert("Please configure your business WhatsApp number in products.html first.");
    });
  }

  // ---------- Start ----------
  renderCategories();
  renderProducts();
  renderCart();
})();
