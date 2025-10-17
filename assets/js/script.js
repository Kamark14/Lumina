// Elementos DOM
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('nav ul');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const overlay = document.querySelector('.overlay');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.getElementById('form-contato');

// Carrinho de compras
let cart = [];

// Menu mobile
mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Abrir/fechar carrinho
cartIcon.addEventListener('click', () => {
  cartModal.classList.add('active');
  overlay.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cartModal.classList.remove('active');
  overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
  cartModal.classList.remove('active');
  overlay.classList.remove('active');
  navMenu.classList.remove('active');
});

// Adicionar produto ao carrinho
// Event delegation: attach a single click handler for all .add-to-cart buttons
function adicionarEventosAoCarrinho() {
  if (window.__lumina_add_to_cart_attached) return;

  document.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;

    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    // Verificar se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        quantity: 1
      });
    }

    updateCart();

    // Feedback visual
    const previous = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      // Só restaura se o botão ainda existir
      if (document.body.contains(button)) button.innerHTML = previous;
    }, 1000);
  });

  window.__lumina_add_to_cart_attached = true;
}

// Atualizar carrinho
function updateCart() {
  // Atualizar contador
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Atualizar itens no carrinho
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Seu carrinho está vazio</p>';
    totalPrice.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    cartItemElement.innerHTML = `
                    <div class="cart-item-img">
                        <img src="https://images.unsplash.com/photo-1580995176443-a4a6e3083b60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Atualizar preço total
  totalPrice.textContent = `R$ ${total.toFixed(2)}`;

  // Adicionar eventos aos botões de quantidade e remoção
  document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const item = cart.find(item => item.id === id);

      if (item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
      }
    });
  });

  document.querySelectorAll('.quantity-btn.increase').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const item = cart.find(item => item.id === id);

      item.quantity += 1;
      updateCart();
    });
  });

  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.dataset.id;
      const item = cart.find(item => item.id === id);
      const newQuantity = parseInt(input.value);

      if (newQuantity > 0) {
        item.quantity = newQuantity;
        updateCart();
      }
    });
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      cart = cart.filter(item => item.id !== id);
      updateCart();
    });
  });
}

// Finalizar compra
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  alert('Compra finalizada com sucesso! Obrigado pela preferência.');
  cart = [];
  updateCart();
  cartModal.classList.remove('active');
  overlay.classList.remove('active');
});

// Formulário de contato
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Simulação de envio
  alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  contactForm.reset();
});

// Newsletter
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  alert(`Obrigado por se inscrever com o e-mail: ${emailInput.value}`);
  emailInput.value = '';
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });

      // Fechar menu mobile se estiver aberto
      navMenu.classList.remove('active');
    }
  });
});

// Inicializar carrinho
updateCart();

document.addEventListener('DOMContentLoaded', function () {
  renderizarProdutos(produtos);
  // Registrar event delegation para botões add-to-cart
  adicionarEventosAoCarrinho();

  // Pesquisa de produtos
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const productCards = document.querySelectorAll('.product-card');

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = searchInput.value.toLowerCase();
      productCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Carrinho responsivo
  const cartIcon = document.querySelector('.cart-icon');
  const cartModal = document.querySelector('.cart-modal');
  const overlay = document.querySelector('.overlay');
  const closeCartBtn = document.querySelector('.close-cart');

  if (cartIcon && cartModal && overlay) {
    cartIcon.addEventListener('click', function (e) {
      e.preventDefault();
      cartModal.classList.add('active');
      overlay.style.display = 'block';
    });

    closeCartBtn.addEventListener('click', function () {
      cartModal.classList.remove('active');
      overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function () {
      cartModal.classList.remove('active');
      overlay.style.display = 'none';
    });
  }

  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const termo = document.getElementById('search-input').value.toLowerCase();
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    renderizarProdutos(filtrados);
  });
});

const produtos = [
  {
    id: 1,
    nome: "Lavanda Relaxante",
    descricao: "Uma fragrância calmante de lavanda que ajuda a reduzir o estresse e promover o relaxamento.",
    preco: 49.90,
    imagem: "https://cdn2.cocinadelirante.com/sites/default/files/images/2020/03/como-hacer-velas-de-lavanda.jpg"
  },
  {
    id: 2,
    nome: "Baunilha Doce",
    descricao: "Um aroma doce e aconchegante de baunilha que cria uma atmosfera acolhedora em qualquer ambiente.",
    preco: 54.90,
    imagem: "https://img.elo7.com.br/product/main/4CC79F8/vela-aromatica-100-vegetal-aroma-baunilha-100g-vela-artesanal.jpg"
  },
  {
    id: 3,
    nome: "Frescor Cítrico",
    descricao: "Uma combinação revigorante de limão, laranja e grapefruit que energiza e purifica o ar.",
    preco: 52.90,
    imagem: "https://img.elo7.com.br/product/zoom/51E0A24/frescor-vela-aromatica-decorativa-de-capim-limao-100g-velas-personalizadas.jpg"
  },
  {
    id: 4,
    nome: "Madeira Nobre",
    descricao: "Uma fragrância amadeirada e sofisticada com notas de sândalo, cedro e musk.",
    preco: 59.90,
    imagem: "http://acdn-us.mitiendanube.com/stores/004/238/126/products/madeira-nobre-v1-05b3744b9fa47d823a17107124861812-640-0.jpg"
  },
  {
    id: 5,
    nome: "Jasmim Encantador",
    descricao: "Um aroma floral e exótico de jasmim que traz uma sensação de luxo e elegância.",
    preco: 57.90,
    imagem: "https://cdn.leroymerlin.com.br/products/vela_jasmim_1571809545_7a3e_600x600.jpg"
  },
  {
    id: 6,
    nome: "Eucalipto Refrescante",
    descricao: "Uma fragrância revigorante de eucalipto que ajuda a limpar as vias respiratórias e melhorar a concentração.",
    preco: 51.90,
    imagem: "https://img.freepik.com/fotos-premium/vela-aromatica-hojas-eucalipto_87742-29703.jpg"
  }
];

function renderizarProdutos(lista) {
  const grid = document.querySelector('.products-grid');
  grid.innerHTML = '';
  lista.forEach(produto => {
    grid.innerHTML += `
            <div class="product-card">
                <div class="product-img">
                    <img src="${produto.imagem}" alt="Vela ${produto.nome}">
                </div>
                <div class="product-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="product-price">
                        <span class="price">R$ ${produto.preco.toFixed(2)}</span>
                        <button class="add-to-cart" data-id="${produto.id}" data-name="${produto.nome}" data-price="${produto.preco}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  });
}

// --- Dados e renderização para Velas Decorativas, Kits Presente e Acessórios ---
const decorativeCandles = [
  {
    id: 101,
    nome: "Vela Flor de Cerejeira",
    descricao: "Vela decorativa com flores secas embutidas. Perfeita para centros de mesa.",
    preco: 69.90,
    imagem: "https://cdn.leroymerlin.com.br/products/vela_flor_de_cerejeira_1571810463_9995_300x300.jpg"
  },
  {
    id: 102,
    nome: "Vela Geométrica",
    descricao: "Design moderno em cerâmica com acabamento matte.",
    preco: 79.90,
    imagem: "https://img.elo7.com.br/product/zoom/4A5D4A9/vela-geometrica-velas-velasaromaticas-velasdecorativas-velasperfumadas-decoracao-velas-e-aromas-vela.jpg"
  },
  {
    id: 103,
    nome: "Vela com Pétalas",
    descricao: "Aromatizada com notas florais e acabamento artesanal.",
    preco: 64.90,
    imagem: "https://anfitrion.com.mx/wp-content/uploads/2019/10/IMG-20190905-WA0027.jpg"
  },
  {
    id: 104,
    nome: "Vela Cerâmica Azul",
    descricao: "Vela em copo de cerâmica azul com aroma marinho.",
    preco: 72.50,
    imagem: "https://tse3.mm.bing.net/th/id/OIP.XeWqOOuV1S5fCzANznmgFAHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 105,
    nome: "Vela Aromática de Mel",
    descricao: "Aromatizada com notas doces de mel e florais.",
    preco: 59.90,
    imagem: "https://tse1.mm.bing.net/th/id/OIP.UM9pFXEqQj2ZyqKCVWVQmQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 106,
    nome: "Vela Vintage",
    descricao: "Vela decorativa com acabamento envelhecido e aroma de tabaco.",
    preco: 89.90,
    imagem: "https://th.bing.com/th/id/R.35ce523170e8ad0f53ac034320c58a0f?rik=a8ZMO%2fR%2fdjusGw&pid=ImgRaw&r=0"
  }
];

const giftSets = [
  {
    id: 201,
    nome: "Kit Relax",
    descricao: "Lavanda + Eucalipto + sachê aromático. Embalagem para presente.",
    preco: 129.90,
    imagem: "assets/Img/kitrelax.png"
  },
  {
    id: 202,
    nome: "Kit Romance",
    descricao: "Vela Jasmim + vela Baunilha em caixa luxuosa.",
    preco: 149.90,
    imagem: "assets/Img/kitromance.png"
  },
  {
    id: 203,
    nome: "Kit Bem-estar",
    descricao: "Inclui vela calmante, óleo essencial e sachê aromático.",
    preco: 139.90,
    imagem: "assets/Img/kitbemestar.png"
  },
  {
    id: 204,
    nome: "Kit Festa",
    descricao: "Trio de velas festivas em embalagem colorida.",
    preco: 119.90,
    imagem: "assets/Img/kitfesta.png"
  },
  {
    id: 205,
    nome: "Kit Minimal",
    descricao: "Conjunto elegante para presentear com design minimalista.",
    preco: 159.90,
    imagem: "assets/Img/kitminimal.png"
  },
  {
    id: 206,
    nome: "Kit Natureza",
    descricao: "Velas com aromas naturais em embalagem rústica.",
    preco: 129.90,
    imagem: "assets/Img/kitnatureza.png"
  }
];

const accessories = [
  {
    id: 301,
    nome: "Suporte de Metal",
    descricao: "Base em metal dourado para velas pequenas.",
    preco: 39.90,
    imagem: "https://tse1.explicit.bing.net/th/id/OIP.97c5MX4xSoaUP3tD2Rr6CAHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 302,
    nome: "Kit Pavio",
    descricao: "Pavios de algodão (10 unidades) para reposição.",
    preco: 19.90,
    imagem: "https://down-br.img.susercontent.com/file/br-11134207-7qukw-li9appdq24jj46"
  },
  {
    id: 303,
    nome: "Coaster de Cerâmica",
    descricao: "Base decorativa para velas em cerâmica.",
    preco: 24.90,
    imagem: "https://ae01.alicdn.com/kf/H9c35ec5ad1df43c986c4eb9cbbf1e1e7g/Coaster-cer-mica-isolamento-esteiras-decora-es-vela-tapete-retro-aromaterapia-decora-o-esteira-casa-coaster.jpg"
  },
  {
    id: 304,
    nome: "Mini Colher de Cera",
    descricao: "Acessório para manuseio seguro da cera.",
    preco: 14.90,
    imagem: "https://tse4.mm.bing.net/th/id/OIP.pE6ySsOtXV-z9z23k6XXoAHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 305,
    nome: "Kit Limpeza de Pavio",
    descricao: "Ferramentas para manutenção do pavio.",
    preco: 29.90,
    imagem: "https://tse1.explicit.bing.net/th/id/OIP.pbYz0zA-SfnbNkLP7gUdPwHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 306,
    nome: "Tesoura para Velas",
    descricao: "Tesoura especial para cortar pavios com precisão.",
    preco: 34.90,
    imagem: "https://tse3.mm.bing.net/th/id/OIP.xs_YeRe6NE7icRE7agrNDAHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  }
];

// Array unificado de todos os produtos para busca e modal
const todosProdutos = [
  ...produtos.map(p => ({ ...p, secao: 'produtos' })),
  ...decorativeCandles.map(p => ({ ...p, secao: 'decorativeCandles' })),
  ...giftSets.map(p => ({ ...p, secao: 'giftSets' })),
  ...accessories.map(p => ({ ...p, secao: 'accessories' }))
];

function renderSection(list, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card small-card';

    card.innerHTML = `
            <div class="product-img">
                <img src="${item.imagem}" alt="${item.nome}">
            </div>
            <div class="product-info">
                <h3>${item.nome}</h3>
                <p class="desc">${item.descricao}</p>
                <div class="product-price">
                    <span class="price">R$ ${item.preco.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${item.id}" data-name="${item.nome}" data-price="${item.preco}" data-img="${item.imagem}"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;

    container.appendChild(card);
  });

  // Re-attach eventos add-to-cart
}

// Renderizar as três seções após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
  renderSection(decorativeCandles, '.decorative-candles-grid');
  renderSection(giftSets, '.gift-sets-grid');
  renderSection(accessories, '.accessories-grid');
});

// ========== MODAL DE AUTENTICAÇÃO E HISTÓRICO DE PEDIDOS ==========

// Elementos DOM para autenticação
const userIcon = document.querySelector('nav ul li:last-child');
const authModal = document.querySelector('.auth-modal');
const closeAuth = document.querySelector('.close-auth');
const ordersModal = document.querySelector('.orders-modal');
const closeOrders = document.querySelector('.close-orders');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');
const ordersList = document.querySelector('.orders-list');

// Elementos DOM para cookies
const cookiesModal = document.querySelector('.cookies-modal');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const declineCookiesBtn = document.getElementById('decline-cookies');

// Dados de usuários (simulação de banco de dados)
let users = JSON.parse(localStorage.getItem('lumina_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('lumina_current_user')) || null;
let orders = JSON.parse(localStorage.getItem('lumina_orders')) || [];
let cookiesAccepted = localStorage.getItem('lumina_cookies_accepted') || false;

// Verificar se precisa mostrar o modal de cookies
if (!cookiesAccepted) {
  setTimeout(() => {
    cookiesModal.classList.add('active');
  }, 2000);
}

// Funções para cookies
acceptCookiesBtn.addEventListener('click', () => {
  localStorage.setItem('lumina_cookies_accepted', 'true');
  cookiesModal.classList.remove('active');
});

declineCookiesBtn.addEventListener('click', () => {
  localStorage.setItem('lumina_cookies_accepted', 'false');
  cookiesModal.classList.remove('active');
});

// Abrir modal de autenticação ao clicar no ícone do usuário
userIcon.addEventListener('click', () => {
  if (currentUser) {
    // Se já estiver logado, mostrar histórico de pedidos
    showOrdersModal();
  } else {
    // Se não estiver logado, mostrar modal de login/cadastro
    authModal.classList.add('active');
  }
});

// Fechar modais
closeAuth.addEventListener('click', () => {
  authModal.classList.remove('active');
});

closeOrders.addEventListener('click', () => {
  ordersModal.classList.remove('active');
});

// Alternar entre abas de login e cadastro
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Ativar aba clicada
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Mostrar formulário correspondente
    authForms.forEach(form => {
      form.classList.remove('active');
      if (form.id === `${tab}-form`) {
        form.classList.add('active');
      }
    });
  });
});

// Processar formulário de login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Verificar credenciais
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Login bem-sucedido
    currentUser = user;
    localStorage.setItem('lumina_current_user', JSON.stringify(currentUser));

    // Atualizar interface
    updateUserInterface();

    // Fechar modal
    authModal.classList.remove('active');

    // Mostrar mensagem de boas-vindas
    alert(`Bem-vindo(a) de volta, ${user.name}!`);
  } else {
    alert('E-mail ou senha incorretos. Tente novamente.');
  }
});

// Processar formulário de cadastro
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Validações
  if (password !== confirmPassword) {
    alert('As senhas não coincidem. Tente novamente.');
    return;
  }

  if (users.find(u => u.email === email)) {
    alert('Este e-mail já está cadastrado. Tente fazer login.');
    return;
  }

  // Criar novo usuário
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  // Adicionar usuário à "base de dados"
  users.push(newUser);
  localStorage.setItem('lumina_users', JSON.stringify(users));

  // Fazer login automaticamente
  currentUser = newUser;
  localStorage.setItem('lumina_current_user', JSON.stringify(currentUser));

  // Atualizar interface
  updateUserInterface();

  // Fechar modal
  authModal.classList.remove('active');

  // Mostrar mensagem de boas-vindas
  alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${name}!`);
});

// Logout
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('lumina_current_user');
  updateUserInterface();
  ordersModal.classList.remove('active');
  alert('Você saiu da sua conta.');
});

// Atualizar interface do usuário
function updateUserInterface() {
  const userIconElement = document.querySelector('nav ul li:last-child i');

  if (currentUser) {
    // Usuário logado
    userIconElement.classList.add('user-logged-in');
    userNameSpan.textContent = currentUser.name;
  } else {
    // Usuário não logado
    userIconElement.classList.remove('user-logged-in');
  }
}

// Mostrar modal de histórico de compras
function showOrdersModal() {
  // Atualizar nome do usuário
  userNameSpan.textContent = currentUser.name;

  // Filtrar compras do usuário atual
  const userOrders = orders.filter(order => order.userId === currentUser.id);

  // Atualizar lista de compras
  if (userOrders.length === 0) {
    ordersList.innerHTML = '<div class="no-orders">Você ainda não realizou nenhuma compra.</div>';
  } else {
    ordersList.innerHTML = userOrders.map(order => `
      <div class="order-item">
        <div class="order-header">
          <span class="order-date">${formatDate(order.date)}</span>
          <span class="order-total">R$ ${order.total.toFixed(2)}</span>
          <span class="order-status ${order.status === 'completed' ? 'status-completed' : 'status-pending'}">${order.status === 'completed' ? 'Concluído' : 'Pendente'}</span>
        </div>
        <div class="order-products">
          ${order.items.map(item => `
            <div class="order-product">
              <span>${item.name}</span>
              <span>${item.quantity} x R$ ${item.price.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // Mostrar modal
  ordersModal.classList.add('active');
}

// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Simular finalização de pedido (modificar a função existente)
const originalCheckout = checkoutBtn.onclick;
checkoutBtn.onclick = function (e) {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  // Se o usuário não estiver logado, pedir para fazer login
  if (!currentUser) {
    alert('Para finalizar a compra, faça login ou cadastre-se.');
    authModal.classList.add('active');
    return;
  }

  // Criar pedido
  const order = {
    id: Date.now().toString(),
    userId: currentUser.id,
    date: new Date().toISOString(),
    items: [...cart],
    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    status: 'completed'
  };

  // Adicionar pedido à "base de dados"
  orders.push(order);
  localStorage.setItem('lumina_orders', JSON.stringify(orders));

  alert('Compra finalizada com sucesso! Obrigado pela preferência.');
  cart = [];
  updateCart();
  cartModal.classList.remove('active');
  overlay.classList.remove('active');
};

// Modal de detalhes do produto
function criarModalProduto() {
  if (document.getElementById('product-detail-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'product-detail-modal';
  modal.id = 'product-detail-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-product-modal"><i class="fas fa-times"></i></button>
      <div class="modal-body"></div>
    </div>
    <div class="modal-overlay"></div>
  `;
  document.body.appendChild(modal);
}

function abrirModalProduto(produto) {
  criarModalProduto();
  const modal = document.getElementById('product-detail-modal');
  const body = modal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="modal-img">
      <img src="${produto.imagem}" alt="${produto.nome}" />
    </div>
    <div class="modal-info">
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <span class="modal-price">R$ ${produto.preco.toFixed(2)}</span>
      <button class="add-to-cart-modal" data-id="${produto.id}" data-name="${produto.nome}" data-price="${produto.preco}">
        <i class="fas fa-plus"></i> Adicionar ao Carrinho
      </button>
    </div>
  `;
  modal.classList.add('active');

  // Fechar modal
  modal.querySelector('.close-product-modal').onclick = () => {
    modal.classList.remove('active');
  };
  modal.querySelector('.modal-overlay').onclick = () => {
    modal.classList.remove('active');
  };

  // Adicionar ao carrinho pelo modal
  modal.querySelector('.add-to-cart-modal').onclick = function() {
    const id = this.dataset.id;
    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);
    const existingItem = cart.find(item => item.id == id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    modal.classList.remove('active');
  };
}

// Event delegation para abrir modal ao clicar no card
function adicionarEventoDetalheProduto() {
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.product-card');
    if (card && !e.target.classList.contains('add-to-cart')) {
      // Descobre o produto pelo nome
      const nome = card.querySelector('h3').textContent;
      // Busca no array todosProdutos
      const produto = todosProdutos.find(p => p.nome === nome);
      if (produto) abrirModalProduto(produto);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // ...existing code...
  adicionarEventoDetalheProduto();
  // ...existing code...
});
