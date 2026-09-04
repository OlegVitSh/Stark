document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // Модальное окно заявки
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

        // Мобильное меню
        isMobileMenuOpen: false,

        openMobileMenu() {
            this.isMobileMenuOpen = true;
        },

        closeMobileMenu() {
            this.isMobileMenuOpen = false;
        },

        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        }
    });
});

// Закрытие модального окна по нажатию клавиши Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && Alpine.store('app') && Alpine.store('app').isModalOpen) {
        Alpine.store('app').closeModal();
    }
});
