document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // ------------------------------------------------------------
        // Мобильное меню
        // ------------------------------------------------------------
        mobileMenuOpen: false,

        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },

        openMobileMenu() {
            this.mobileMenuOpen = true;
        },

        closeMobileMenu() {
            this.mobileMenuOpen = false;
        },

        // ------------------------------------------------------------
        // Модальное окно «Запросить КП / Расчет стоимости»
        // ------------------------------------------------------------
        modalOpen: false,

        openModal(system = null) {
            if (system) {
                this.setSystem(system);
            }
            this.modalOpen = true;
            document.body.style.overflow = 'hidden';
        },

        closeModal() {
            this.modalOpen = false;
            document.body.style.overflow = '';
        },

        toggleModal() {
            this.modalOpen ? this.closeModal() : this.openModal();
        },

        // ------------------------------------------------------------
        // Выбранная система стола (D16 / D28)
        // ------------------------------------------------------------
        selectedSystem: null,

        setSystem(system) {
            this.selectedSystem = system;
        },

        clearSystem() {
            this.selectedSystem = null;
        },

        // Открыть модалку заявки с предзаполненной системой
        requestQuote(system = null) {
            this.openModal(system);
        },
    });
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && Alpine.store('app').modalOpen) {
        Alpine.store('app').closeModal();
    }
});
