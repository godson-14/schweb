const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const bookLevelSelect = document.getElementById('book-level-select');
const examLevelSelect = document.getElementById('exam-level-select');
const bookList = document.getElementById('book-list');
const examList = document.getElementById('exam-list');
const bookAddForm = document.getElementById('book-add-form');
const bookTitleInput = document.getElementById('book-title');
const bookAuthorInput = document.getElementById('book-author');
const bookDescriptionInput = document.getElementById('book-description');
const bookPriceInput = document.getElementById('book-price');
const bookLevelInput = document.getElementById('book-level-input');
const bookContentInput = document.getElementById('book-content');
const bookAddMessage = document.getElementById('book-add-message');
const serverWarning = document.getElementById('server-warning');
const runServerBtn = document.getElementById('run-server-btn');
const serverInstructions = document.getElementById('server-instructions');
const ordersList = document.getElementById('orders-list');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');
const dashboardSection = document.getElementById('dashboard-section');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const activityList = document.getElementById('activity-list');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartMessage = document.getElementById('cart-message');

let currentCart = JSON.parse(localStorage.getItem('edu-cart') || '[]');
let currentBookPages = [];
let currentPageIndex = 0;

function showPage(pageId) {
  pages.forEach((page) => page.classList.toggle('hidden', page.id !== pageId));
  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.page === pageId);
  });
  if (pageId === 'books') {
    fetchBooks();
  }
  if (pageId === 'exams') {
    fetchExams();
  }
  if (pageId === 'cart') {
    const email = getUserEmail();
    if (email) {
      fetchCartFromServer(email).then(renderCart);
    } else {
      renderCart();
    }
  }
  if (pageId === 'orders') {
    const email = getUserEmail();
    if (email) {
      fetchOrders(email);
    } else {
      ordersList.innerHTML = '<p>Please login to view your orders.</p>';
    }
  }
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.page));
});

document.querySelectorAll('[data-page]').forEach((button) => {
  button.addEventListener('click', () => {
    const page = button.dataset.page;
    if (page) showPage(page);
  });
});

bookLevelSelect.addEventListener('change', fetchBooks);
examLevelSelect.addEventListener('change', fetchExams);
bookAddForm.addEventListener('submit', submitNewBook);

const bookDetailSection = document.getElementById('book-detail-section');
const bookDetailTitle = document.getElementById('book-detail-title');
const bookDetailAuthor = document.getElementById('book-detail-author');
const bookDetailContent = document.getElementById('book-detail-content');
const closeBookDetail = document.getElementById('close-book-detail');

function fetchBooks() {
  const level = bookLevelSelect.value;
  fetch(`/api/books?level=${level}`)
    .then((res) => res.json())
    .then((data) => {
      bookList.innerHTML = '';
      if (!data.books.length) {
        bookList.innerHTML = '<p>No books found for this level yet.</p>';
        return;
      }
      data.books.forEach((book) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p>${book.description}</p>
          <p><strong>Price:</strong> ${book.price}</p>
            <button class="secondary-btn">Read textbook</button>
          <button class="primary-btn">Add to cart</button>
        `;
        const [readBtn, cartBtn] = card.querySelectorAll('button');
        readBtn.addEventListener('click', () => showBookDetail(book));
        cartBtn.addEventListener('click', () => addToCart(book));
        bookList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Error fetching books:', error);
      bookList.innerHTML = '<p>Unable to load books. Please make sure the server is running and open the site through the app URL.</p>';
    });
}

function showBookDetail(book) {
  currentBookPages = book.content.split('\n\n');
  currentPageIndex = 0;
  saveActivity(`Viewed book: ${book.title}`);
  bookDetailTitle.textContent = book.title;
  bookDetailAuthor.textContent = `Author: ${book.author}`;
  renderBookPage();
  bookDetailSection.classList.remove('hidden');
}

function renderBookPage() {
  bookDetailContent.innerHTML = '';
  const pageText = currentBookPages[currentPageIndex] || '';
  const paragraphs = pageText.split('\n');
  paragraphs.forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    bookDetailContent.appendChild(p);
  });
  document.getElementById('book-detail-page').textContent = `Page ${currentPageIndex + 1} of ${currentBookPages.length}`;
}

function changeBookPage(direction) {
  currentPageIndex = Math.max(0, Math.min(currentBookPages.length - 1, currentPageIndex + direction));
  renderBookPage();
}

closeBookDetail.addEventListener('click', () => {
  bookDetailSection.classList.add('hidden');
});

function fetchExams() {
  const level = examLevelSelect.value;
  fetch(`/api/exams?level=${level}`)
    .then((res) => res.json())
    .then((data) => {
      examList.innerHTML = '';
      if (!data.exams.length) {
        examList.innerHTML = '<p>No exams available for this level yet.</p>';
        return;
      }
      data.exams.forEach((exam) => {
        const card = document.createElement('div');
        card.className = 'exam-card';
        card.innerHTML = `
          <h3>${exam.title}</h3>
          <p>${exam.questions.length} questions</p>
          <button class="secondary-btn">Start exam</button>
        `;
        card.querySelector('button').addEventListener('click', () => openExam(exam));
        examList.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Error fetching exams:', error);
      examList.innerHTML = '<p>Unable to load exams. Please make sure the server is running and open the site through the app URL.</p>';
    });
}

function checkServerConnection() {
  fetch('/api/books?level=primary')
    .then((res) => {
      if (!res.ok) throw new Error('Server responded with ' + res.status);
      return res.json();
    })
    .then(() => {
      serverWarning.classList.add('hidden');
    })
    .catch((error) => {
      console.error('Server connection check failed:', error);
      serverWarning.classList.remove('hidden');
    });
}

if (runServerBtn) {
  runServerBtn.addEventListener('click', () => {
    if (serverInstructions) {
      serverInstructions.classList.toggle('hidden');
    }
  });
}

function openExam(exam) {
  const email = getUserEmail();
  if (!email) {
    alert('Please login to take exams.');
    showPage('account');
    return;
  }

  const answers = [];
  exam.questions.forEach((question, index) => {
    const option = prompt(`${index + 1}. ${question.question}\n${question.options.map((option, i) => `${i + 1}. ${option}`).join('\n')}`);
    const selected = question.options[parseInt(option, 10) - 1] || '';
    answers.push({ question: question.question, selected, correct: question.answer });
  });

  const correctCount = answers.filter((answer) => answer.selected === answer.correct).length;
  saveActivity(`Completed exam: ${exam.title} (${correctCount}/${exam.questions.length})`);
  alert(`You completed ${exam.title}. Score: ${correctCount}/${exam.questions.length}`);
}

function saveActivity(action) {
  const email = getUserEmail();
  if (!email) return;
  fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, action, detail: action })
  });
}

function getGuestCart() {
  return JSON.parse(localStorage.getItem('edu-cart') || '[]');
}

function setGuestCart(cart) {
  localStorage.setItem('edu-cart', JSON.stringify(cart));
}

function fetchCartFromServer(email) {
  return fetch(`/api/cart?email=${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        currentCart = data.cart;
      }
      return currentCart;
    })
    .catch(() => {
      currentCart = getGuestCart();
      return currentCart;
    });
}

function addToCart(book) {
  const email = getUserEmail();
  const exists = currentCart.find((item) => item.id === book.id);
  if (exists) {
    cartMessage.textContent = 'This book is already in your cart.';
    return;
  }

  if (email) {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, book })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          currentCart = data.cart;
          cartMessage.textContent = `${book.title} added to cart.`;
          updateCartCount();
          saveActivity(`Added to cart: ${book.title}`);
        }
      });
    return;
  }

  currentCart.push(book);
  setGuestCart(currentCart);
  cartMessage.textContent = `${book.title} added to cart.`;
  updateCartCount();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  if (!currentCart.length) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty. Add a book to continue.</p>';
    cartTotal.textContent = 'Total: ₦0';
    cartMessage.textContent = '';
    return;
  }
  let total = 0;
  currentCart.forEach((book) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p>${book.description}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <button class="secondary-btn">Remove</button>
    `;
    card.querySelector('button').addEventListener('click', () => removeFromCart(book.id));
    cartItemsContainer.appendChild(card);
    total += Number(book.price.replace(/[^0-9]/g, ''));
  });
  cartTotal.textContent = `Total: ₦${total}`;
  cartMessage.textContent = '';
}

function submitNewBook(event) {
  event.preventDefault();
  const payload = {
    title: bookTitleInput.value.trim(),
    author: bookAuthorInput.value.trim(),
    description: bookDescriptionInput.value.trim(),
    price: bookPriceInput.value.trim(),
    level: bookLevelInput.value,
    content: bookContentInput.value.trim()
  };
  if (!payload.title || !payload.author || !payload.description || !payload.price || !payload.content) {
    bookAddMessage.textContent = 'Please fill every book field.';
    return;
  }

  fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        bookAddMessage.textContent = 'Book added successfully.';
        bookTitleInput.value = '';
        bookAuthorInput.value = '';
        bookDescriptionInput.value = '';
        bookPriceInput.value = '';
        bookContentInput.value = '';
        fetchBooks();
      } else {
        bookAddMessage.textContent = data.message || 'Unable to add book.';
      }
    })
    .catch(() => {
      bookAddMessage.textContent = 'Unable to add book at this time.';
    });
}

function fetchOrders(email) {
  fetch(`/api/purchases?email=${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.purchases.length) {
        ordersList.innerHTML = '<p>You have no orders yet. Complete checkout to see receipts here.</p>';
        return;
      }
      ordersList.innerHTML = '';
      data.purchases.reverse().forEach((purchase) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
          <h3>Order #${purchase.id.slice(0, 8)}</h3>
          <p><strong>Date:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
          <p><strong>Total:</strong> ₦${purchase.total}</p>
          <h4>Items</h4>
          <ul>${purchase.items.map((item) => `<li>${item.title} - ${item.price}</li>`).join('')}</ul>
          <button class="primary-btn download-btn">Download receipt</button>
        `;
        card.querySelector('.download-btn').addEventListener('click', () => downloadReceipt(purchase));
        ordersList.appendChild(card);
      });
    })
    .catch(() => {
      ordersList.innerHTML = '<p>Unable to load orders at this time.</p>';
    });
}

function downloadReceipt(purchase) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>EduText Hub Receipt</title>
  <style>
    body { font-family: Arial, sans-serif; color: #1f2937; margin: 32px; }
    h1 { color: #1d4ed8; }
    .header, .receipt-summary, .receipt-items { margin-bottom: 24px; }
    .receipt-items li { margin-bottom: 0.5rem; }
    .footer { margin-top: 32px; font-size: 0.95rem; color: #4b5563; }
    .receipt-card { padding: 24px; border: 1px solid #d1d5db; border-radius: 16px; background: #ffffff; }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <h1>EduText Hub Receipt</h1>
      <p>Order ID: <strong>${purchase.id}</strong></p>
      <p>Date: <strong>${new Date(purchase.createdAt).toLocaleString()}</strong></p>
    </div>
    <div class="receipt-summary">
      <p><strong>Total Paid:</strong> ₦${purchase.total}</p>
      <p><strong>Items:</strong></p>
      <ul class="receipt-items">
        ${purchase.items.map((item) => `<li>${item.title} — ${item.price}</li>`).join('')}
      </ul>
    </div>
    <div class="footer">
      <p>Thank you for choosing EduText Hub.</p>
      <p>This receipt is a digital confirmation of your purchase.</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${purchase.id.slice(0, 8)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function removeFromCart(bookId) {
  const email = getUserEmail();
  if (email) {
    fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, bookId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          currentCart = data.cart;
          renderCart();
          updateCartCount();
        }
      });
    return;
  }

  currentCart = currentCart.filter((book) => book.id !== bookId);
  setGuestCart(currentCart);
  renderCart();
  updateCartCount();
}

function checkoutCart() {
  const email = getUserEmail();
  if (!email) {
    alert('Please login to checkout.');
    showPage('account');
    return;
  }
  if (!currentCart.length) {
    cartMessage.textContent = 'Your cart is empty.';
    return;
  }

  fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        currentCart = [];
        setGuestCart(currentCart);
        renderCart();
        updateCartCount();
        cartMessage.textContent = 'Thank you! Your purchase is complete.';
      } else {
        cartMessage.textContent = data.message;
      }
    });
}

function updateCartCount() {
  const cartButton = Array.from(navButtons).find((button) => button.dataset.page === 'cart');
  if (cartButton) {
    const count = currentCart.length;
    cartButton.textContent = count ? `Cart (${count})` : 'Cart';
  }
}

checkoutBtn.addEventListener('click', checkoutCart);

document.getElementById('prev-page').addEventListener('click', () => changeBookPage(-1));
document.getElementById('next-page').addEventListener('click', () => changeBookPage(1));

function init() {
  const currentUser = getUserEmail();
  if (currentUser) {
    showDashboard();
  }
  updateCartCount();
  fetchBooks();
  fetchExams();
}

function getUserEmail() {
  return localStorage.getItem('edu-email');
}

function getUserName() {
  return localStorage.getItem('edu-name');
}

function showDashboard() {
  const email = getUserEmail();
  if (!email) return;
  dashboardSection.classList.remove('hidden');
  userName.textContent = getUserName();
  fetch(`/api/activities?email=${encodeURIComponent(email)}`)
    .then((res) => res.json())
    .then((data) => {
      activityList.innerHTML = '';
      if (!data.activities.length) {
        activityList.innerHTML = '<li>No activity yet.</li>';
        return;
      }
      data.activities.slice(-6).reverse().forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${new Date(item.timestamp).toLocaleString()}: ${item.action}`;
        activityList.appendChild(li);
      });
    });
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginMessage.textContent = '';
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('login-email').value,
      password: document.getElementById('login-password').value
    })
  })
    .then((res) => res.json())
    .then((data) => {
      loginMessage.textContent = data.message;
      if (data.success) {
        localStorage.setItem('edu-email', data.user.email);
        localStorage.setItem('edu-name', data.user.name);
        fetchCartFromServer(data.user.email).then(() => {
          showDashboard();
          updateCartCount();
        });
      }
    });
});

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  registerMessage.textContent = '';
  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('register-name').value,
      email: document.getElementById('register-email').value,
      password: document.getElementById('register-password').value
    })
  })
    .then((res) => res.json())
    .then((data) => {
      registerMessage.textContent = data.message;
      if (data.success) {
        localStorage.setItem('edu-email', data.user.email);
        localStorage.setItem('edu-name', data.user.name);
        fetchCartFromServer(data.user.email).then(() => {
          showDashboard();
          updateCartCount();
        });
      }
    });
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('edu-email');
  localStorage.removeItem('edu-name');
  dashboardSection.classList.add('hidden');
  alert('You have been logged out.');
});

function init() {
  const currentUser = getUserEmail();
  if (currentUser) {
    fetchCartFromServer(currentUser).then(() => {
      showDashboard();
      updateCartCount();
    });
  } else {
    currentCart = getGuestCart();
    updateCartCount();
  }
  fetchBooks();
  fetchExams();
  checkServerConnection();
}

init();
