document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Products
    try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.success) {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // clear any existing
            result.data.forEach(product => {
                const card = document.createElement('div');
                card.className = "glass-card p-5 rounded-3xl flex flex-col items-center hover:border-green-500/50 transition-all duration-300 group";
                card.innerHTML = `
                    <div class="w-full aspect-square bg-white/5 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center p-4">
                        <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://placehold.co/400x400/1a1a1a/4ade80?text=${encodeURIComponent(product.name)}'">
                    </div>
                    <div class="w-full flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-lg">${product.name}</h3>
                            <p class="text-green-400 font-bold mt-1">$${product.price.toFixed(2)}</p>
                        </div>
                        <button class="w-10 h-10 rounded-full bg-white/10 hover:bg-green-500 hover:text-black flex items-center justify-center transition-colors">
                            <span class="text-xl font-bold">+</span>
                        </button>
                    </div>
                `;
                productList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    // 2. Auth State Management
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userNameDisplay = document.getElementById('userNameDisplay');

    function updateAuthState() {
        const user = JSON.parse(localStorage.getItem('velo_user'));
        if (user) {
            authButtons.classList.add('hidden');
            authButtons.classList.remove('flex');
            userProfile.classList.remove('hidden');
            userProfile.classList.add('flex');
            userNameDisplay.textContent = `Hi, ${user.name}`;
        } else {
            authButtons.classList.remove('hidden');
            authButtons.classList.add('flex');
            userProfile.classList.add('hidden');
            userProfile.classList.remove('flex');
            userNameDisplay.textContent = '';
        }
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('velo_user');
        updateAuthState();
    });

    updateAuthState(); // Initial check

    // 3. Modal Logic
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    function openModal(modal) {
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.children[0].classList.remove('scale-95');
        }, 10);
    }

    function closeModal(modal) {
        modal.classList.add('opacity-0');
        modal.children[0].classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300); // Wait for transition
    }

    document.getElementById('loginBtn').addEventListener('click', () => openModal(loginModal));
    document.getElementById('closeLogin').addEventListener('click', () => closeModal(loginModal));
    
    document.getElementById('signupBtn').addEventListener('click', () => openModal(signupModal));
    document.getElementById('closeSignup').addEventListener('click', () => closeModal(signupModal));

    // Close on outside click
    [loginModal, signupModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // 4. API Calls
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('velo_user', JSON.stringify(data.user));
                updateAuthState();
                closeModal(loginModal);
                loginForm.reset();
                errorDiv.classList.add('hidden');
            } else {
                errorDiv.textContent = data.message;
                errorDiv.classList.remove('hidden');
            }
        } catch (err) {
            errorDiv.textContent = 'Server error. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const errorDiv = document.getElementById('signupError');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('velo_user', JSON.stringify(data.user));
                updateAuthState();
                closeModal(signupModal);
                signupForm.reset();
                errorDiv.classList.add('hidden');
            } else {
                errorDiv.textContent = data.message;
                errorDiv.classList.remove('hidden');
            }
        } catch (err) {
            errorDiv.textContent = 'Server error. Please try again.';
            errorDiv.classList.remove('hidden');
        }
    });
});
