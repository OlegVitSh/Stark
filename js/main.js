// Функция регистрации глобальных хранилищ Alpine
function initStarkStores() {
    if (typeof Alpine === 'undefined') return;

    // 1. Хранилище корзины (localStorage)
    let savedCart = [];
    try {
        const local = localStorage.getItem('stark_cart');
        if (local) savedCart = JSON.parse(local);
    } catch (e) {
        console.error('Ошибка чтения localStorage корзины:', e);
    }

    Alpine.store('cart', {
        items: savedCart,
        isOpen: false,

        open() {
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        },
        close() {
            this.isOpen = false;
            document.body.style.overflow = '';
        },
        toggle() {
            this.isOpen ? this.close() : this.open();
        },

        addItem(item) {
            const existing = this.items.find(i => i.id === item.id);
            if (existing) {
                existing.qty += (item.qty || 1);
            } else {
                this.items.push({
                    id: item.id,
                    name: item.name,
                    article: item.article || '',
                    price: Number(item.price) || 0,
                    qty: item.qty || 1,
                    details: item.details || ''
                });
            }
            this.save();
            this.open();
        },

        changeQty(id, delta) {
            const item = this.items.find(i => i.id === id);
            if (item) {
                item.qty += delta;
                if (item.qty <= 0) {
                    this.removeItem(id);
                    return;
                }
                this.save();
            }
        },

        removeItem(id) {
            this.items = this.items.filter(i => i.id !== id);
            this.save();
        },

        clear() {
            this.items = [];
            this.save();
        },

        save() {
            try {
                localStorage.setItem('stark_cart', JSON.stringify(this.items));
            } catch (e) {
                console.error('Ошибка сохранения корзины:', e);
            }
        },

        get totalCount() {
            return this.items.reduce((sum, item) => sum + item.qty, 0);
        },

        get totalPrice() {
            return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },

        get orderSummaryText() {
            if (this.items.length === 0) return 'Корзина пуста';
            return this.items.map((it, idx) => 
                `${idx + 1}) ${it.name} [Арт: ${it.article}] (${it.details}) — ${it.qty} шт. x ${it.price.toLocaleString('ru-RU')} ₽ = ${(it.price * it.qty).toLocaleString('ru-RU')} ₽`
            ).join('\n') + `\n\nИТОГО: ${this.totalPrice.toLocaleString('ru-RU')} ₽ (вкл. НДС 20%)`;
        }
    });

    // 2. Хранилище диалоговых окон и меню
    Alpine.store('app', {
        isModalOpen: false,
        selectedSystem: '',

        openModal(system = '') {
            if (system) this.selectedSystem = system;
            this.isModalOpen = true;
            document.body.style.overflow = 'hidden';
        },
        closeModal() {
            this.isModalOpen = false;
            document.body.style.overflow = '';
        },

        isMobileMenuOpen: false,
        openMobileMenu() { this.isMobileMenuOpen = true; },
        closeMobileMenu() { this.isMobileMenuOpen = false; },
        toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
    });
}

// Защита от Race Condition: слушаем alpine:init ИЛИ вызываем сразу, если Alpine уже есть
if (window.Alpine) {
    initStarkStores();
} else {
    document.addEventListener('alpine:init', initStarkStores);
}

// Закрытие окон по Esc
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (window.Alpine && Alpine.store('cart') && Alpine.store('cart').isOpen) Alpine.store('cart').close();
        if (window.Alpine && Alpine.store('app') && Alpine.store('app').isModalOpen) Alpine.store('app').closeModal();
    }
});
