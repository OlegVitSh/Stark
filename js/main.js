document.addEventListener('alpine:init', () => {
    // 1. Инициализация корзины из localStorage
    const savedCart = localStorage.getItem('stark_cart');

    Alpine.store('cart', {
        items: savedCart ? JSON.parse(savedCart) : [],
        isOpen: false,

        // Открыть / закрыть боковую шторку корзины
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

        // Добавить товар в корзину
        addItem(item) {
            // item: { id, name, article, price, qty, details }
            const existing = this.items.find(i => i.id === item.id);
            if (existing) {
                existing.qty += (item.qty || 1);
            } else {
                this.items.push({
                    id: item.id,
                    name: item.name,
                    article: item.article || '',
                    price: Number(item.price),
                    qty: item.qty || 1,
                    details: item.details || ''
                });
            }
            this.save();
            this.open(); // Автоматически открываем шторку при добавлении
        },

        // Изменить количество
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

        // Удалить позицию
        removeItem(id) {
            this.items = this.items.filter(i => i.id !== id);
            this.save();
        },

        // Очистить корзину
        clear() {
            this.items = [];
            this.save();
        },

        // Сохранить в память браузера
        save() {
            localStorage.setItem('stark_cart', JSON.stringify(this.items));
        },

        // Общее количество позиций
        get totalCount() {
            return this.items.reduce((sum, item) => sum + item.qty, 0);
        },

        // Общая сумма заказа
        get totalPrice() {
            return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },

        // Текстовая сводка для передачи в форму заявки
        get orderSummaryText() {
            if (this.items.length === 0) return 'Корзина пуста';
            return this.items.map((it, idx) => 
                `${idx + 1}) ${it.name} [Арт: ${it.article}] (${it.details}) — ${it.qty} шт. x ${it.price.toLocaleString('ru-RU')} ₽ = ${(it.price * it.qty).toLocaleString('ru-RU')} ₽`
            ).join('\n') + `\n\nИТОГО: ${this.totalPrice.toLocaleString('ru-RU')} ₽ (вкл. НДС 20%)`;
        }
    });

    // 2. Хранилище модальных окон и меню
    Alpine.store('app', {
        isModalOpen: false,
        selectedSystem: '',

        openModal(system = '') {
            if (system) {
                this.selectedSystem = system;
            }
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
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (Alpine.store('cart') && Alpine.store('cart').isOpen) Alpine.store('cart').close();
        if (Alpine.store('app') && Alpine.store('app').isModalOpen) Alpine.store('app').closeModal();
    }
});
