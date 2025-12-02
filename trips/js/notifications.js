// Custom Notification System

class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notificationContainer');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icon = this.getIcon(type);
        const title = this.getTitle(type);

        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(notification);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.close(notification));

        // Auto close
        if (duration > 0) {
            setTimeout(() => this.close(notification), duration);
        }

        return notification;
    }

    close(notification) {
        notification.classList.add('closing');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Success!',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        return titles[type] || 'Notification';
    }
}

// Custom Modal/Popup System
class ModalManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create modal overlay if it doesn't exist
        if (!document.getElementById('customModalOverlay')) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'customModalOverlay';
            this.overlay.className = 'custom-modal-overlay';
            document.body.appendChild(this.overlay);

            // Close on overlay click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        } else {
            this.overlay = document.getElementById('customModalOverlay');
        }
    }

    show(options) {
        const {
            title = 'Alert',
            message = '',
            type = 'info',
            confirmText = 'OK',
            cancelText = 'Cancel',
            showCancel = false,
            onConfirm = null,
            onCancel = null
        } = options;

        const icon = this.getIcon(type);

        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        modal.innerHTML = `
            <div class="custom-modal-icon ${type}">${icon}</div>
            <h3 class="custom-modal-title">${title}</h3>
            <p class="custom-modal-message">${message}</p>
            <div class="custom-modal-buttons">
                ${showCancel ? `<button class="custom-modal-button secondary" data-action="cancel">${cancelText}</button>` : ''}
                <button class="custom-modal-button primary" data-action="confirm">${confirmText}</button>
            </div>
        `;

        this.overlay.innerHTML = '';
        this.overlay.appendChild(modal);
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Button handlers
        const confirmBtn = modal.querySelector('[data-action="confirm"]');
        const cancelBtn = modal.querySelector('[data-action="cancel"]');

        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            this.close();
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (onCancel) onCancel();
                this.close();
            });
        }

        // Escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    confirm(options) {
        return new Promise((resolve) => {
            this.show({
                ...options,
                showCancel: true,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }
}

// Global instances
const notify = new NotificationManager();
const modal = new ModalManager();

// Convenience functions
function showNotification(message, type = 'info') {
    notify.show(message, type);
}

function showSuccess(message) {
    notify.show(message, 'success');
}

function showError(message) {
    notify.show(message, 'error');
}

function showWarning(message) {
    notify.show(message, 'warning');
}

function showInfo(message) {
    notify.show(message, 'info');
}

function showModal(options) {
    modal.show(options);
}

async function confirmAction(options) {
    return await modal.confirm(options);
}
