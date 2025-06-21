/**
 * ===================================
 * JAVASCRIPT CV PREMIUM VỚI CLEAN CODE & COMMENTS VÀ DARK MODE
 * Tác giả: Nguyen Ngoc Duy
 * Mô tả: Xử lý tương tác và chức năng chỉnh sửa với dark mode toggle
 * YÊU CẦU 11: CLEAN CODE VÀ COMMENT (0.5 điểm)
 * YÊU CẦU 13: BỔ SUNG ẢNH CÁ NHÂN (1.0 điểm)
 * THÊM: DARK MODE TOGGLE FUNCTIONALITY
 * ===================================
 */

/**
 * Main CV Application Object với Dark Mode
 * Quản lý tất cả tính năng của CV Digital bao gồm dark/light mode
 * 
 * @namespace DuyCV
 * @author Nguyen Ngoc Duy
 * @version 3.0.0
 * @since 2025
 */
window.DuyCV = {
    // ===================================
    // PROPERTIES - THUỘC TÍNH
    // ===================================
    
    /** @type {boolean} Trạng thái chế độ chỉnh sửa */
    isEditMode: false,
    
    /** @type {string} Theme hiện tại (light/dark) */
    currentTheme: 'light',
    
    /** @type {Object} Lưu trữ dữ liệu CV */
    cvData: {},
    
    /** @type {Object} Cấu hình ứng dụng */
    config: {
        animationDuration: 300,
        skillBarDelay: 200,
        messageTimeout: 3000,
        scrollOffset: 80,
        maxSkillLevel: 100,
        minSkillLevel: 0,
        themeStorageKey: 'cv-theme-preference'
    },
    
    /** @type {Object} Selectors DOM elements */
    selectors: {
        editToggle: '#editToggle',
        themeToggle: '#themeToggle',
        editNotification: '#editNotification',
        saveChanges: '#saveChanges',
        addSkillBtn: '#addSkillBtn',
        skillsList: '#skillsList',
        downloadBtn: '#download-btn',
        skillModal: '#skillModal',
        skillForm: '#skillForm',
        skillNameInput: '#skillName',
        skillLevelInput: '#skillLevel',
        skillLevelValue: '#skillLevelValue'
    },

    // ===================================
    // INITIALIZATION METHODS - PHƯƠNG THỨC KHỞI TẠO
    // ===================================
    
    /**
     * Khởi tạo ứng dụng CV
     * Phương thức chính để khởi động tất cả tính năng
     * 
     * @public
     * @returns {void}
     */
    init: function() {
        try {
            this.initThemeSystem();
            this.initSkillBars();
            this.initEditMode();
            this.initDownloadFeature();
            this.initLanguageLevels();
            this.initSmoothScrolling();
            this.initIntersectionObserver();
            this.initKeyboardShortcuts();
            this.initMobileFeatures();
            this.loadSavedData();
            this.showWelcomeMessage();
            
            console.log('✅ CV Application with Dark Mode initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize CV application:', error);
            this.showMessage('Có lỗi xảy ra khi khởi tạo ứng dụng', 'error');
        }
    },

    // ===================================
    // DARK MODE SYSTEM - HỆ THỐNG DARK MODE
    // ===================================
    
    /**
     * Khởi tạo hệ thống theme (dark/light mode)
     * 
     * @public
     * @returns {void}
     */
    initThemeSystem: function() {
        // Load theme từ memory hoặc phát hiện system preference
        this.loadThemePreference();
        
        // Bind theme toggle events
        this.bindThemeToggleEvents();
        
        // Apply theme ban đầu
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        this.listenForSystemThemeChanges();
        
        console.log(`✅ Theme system initialized with ${this.currentTheme} mode`);
    },
    
    /**
     * Load theme preference từ memory hoặc system
     * 
     * @private
     * @returns {void}
     */
    loadThemePreference: function() {
        // Trong environment này, sẽ dùng memory thay vì localStorage
        const savedTheme = this.cvData[this.config.themeStorageKey];
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            // Auto-detect system preference
            this.currentTheme = this.detectSystemTheme();
        }
    },
    
    /**
     * Phát hiện system theme preference
     * 
     * @private
     * @returns {string} 'light' hoặc 'dark'
     */
    detectSystemTheme: function() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },
    
    /**
     * Bind events cho theme toggle button
     * 
     * @private
     * @returns {void}
     */
    bindThemeToggleEvents: function() {
        const themeToggle = document.querySelector(this.selectors.themeToggle);
        
        if (!themeToggle) {
            console.warn('⚠️ Theme toggle button not found');
            return;
        }
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    },
    
    /**
     * Toggle giữa light và dark mode
     * 
     * @public
     * @returns {void}
     */
    toggleTheme: function() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Show feedback message
        const themeText = newTheme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng';
        this.showMessage(`Đã chuyển sang ${themeText}`, 'success');
        
        console.log(`🌙 Theme toggled to: ${newTheme}`);
    },
    
    /**
     * Set theme cụ thể
     * 
     * @public
     * @param {string} theme - 'light' hoặc 'dark'
     * @returns {void}
     */
    setTheme: function(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.error('❌ Invalid theme:', theme);
            return;
        }
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveThemePreference(theme);
        this.updateThemeToggleButton(theme);
    },
    
    /**
     * Apply theme vào document
     * 
     * @private
     * @param {string} theme - Theme để apply
     * @returns {void}
     */
    applyTheme: function(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        
        // Trigger reflow để đảm bảo CSS được apply
        html.offsetHeight;
    },
    
    /**
     * Update theme toggle button appearance
     * 
     * @private
     * @param {string} theme - Theme hiện tại
     * @returns {void}
     */
    updateThemeToggleButton: function(theme) {
        const themeToggle = document.querySelector(this.selectors.themeToggle);
        
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light';
            themeToggle.setAttribute('title', 'Chuyển sang chế độ sáng');
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark';
            themeToggle.setAttribute('title', 'Chuyển sang chế độ tối');
        }
    },
    
    /**
     * Save theme preference
     * 
     * @private
     * @param {string} theme - Theme để lưu
     * @returns {void}
     */
    saveThemePreference: function(theme) {
        this.cvData[this.config.themeStorageKey] = theme;
        console.log(`💾 Theme preference saved: ${theme}`);
    },
    
    /**
     * Listen for system theme changes
     * 
     * @private
     * @returns {void}
     */
    listenForSystemThemeChanges: function() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Chỉ auto-switch nếu user chưa manually set theme
                if (!this.cvData[this.config.themeStorageKey]) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.setTheme(systemTheme);
                    this.showMessage('Đã tự động chuyển theo cài đặt hệ thống', 'info');
                }
            });
        }
    },

    // ===================================
    // SKILL BARS MANAGEMENT - QUẢN LÝ THANH KỸ NĂNG
    // ===================================
    
    /**
     * Khởi tạo animation cho các thanh kỹ năng
     * Tạo hiệu ứng loading tuần tự cho skill bars
     * 
     * @public
     * @returns {void}
     */
    initSkillBars: function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBars.length) {
            console.warn('⚠️ No skill bars found');
            return;
        }
        
        // Thiết lập animation cho từng skill bar với delay
        skillBars.forEach((bar, index) => {
            const percentage = this.getSkillPercentage(bar);
            const delay = this.config.skillBarDelay + (index * this.config.skillBarDelay);
            
            setTimeout(() => {
                this.animateSkillBar(bar, percentage);
            }, delay);
        });
        
        console.log(`✅ Initialized ${skillBars.length} skill bars`);
    },
    
    /**
     * Lấy phần trăm kỹ năng từ data attribute hoặc class
     * 
     * @private
     * @param {HTMLElement} bar - Thanh kỹ năng
     * @returns {number} Phần trăm kỹ năng (0-100)
     */
    getSkillPercentage: function(bar) {
        // Ưu tiên data-percentage
        const dataPercentage = bar.getAttribute('data-percentage');
        if (dataPercentage) {
            return Math.min(Math.max(parseInt(dataPercentage), this.config.minSkillLevel), this.config.maxSkillLevel);
        }
        
        // Fallback to class-based percentage
        const classMap = {
            'html-skill': 95,
            'php-skill': 80,
            'design-skill': 85,
            'uiux-skill': 80,
            'sql-skill': 85
        };
        
        for (const [className, percentage] of Object.entries(classMap)) {
            if (bar.classList.contains(className)) {
                return percentage;
            }
        }
        
        return 50; // Default value
    },
    
    /**
     * Tạo animation cho thanh kỹ năng
     * 
     * @private
     * @param {HTMLElement} bar - Thanh kỹ năng
     * @param {number} percentage - Phần trăm đích
     * @returns {void}
     */
    animateSkillBar: function(bar, percentage) {
        if (!bar || typeof percentage !== 'number') {
            console.error('❌ Invalid parameters for animateSkillBar');
            return;
        }
        
        bar.style.width = percentage + '%';
        bar.setAttribute('data-percentage', percentage);
        
        // Thêm class để trigger CSS animation
        bar.classList.add('animated');
    },

    // ===================================
    // EDIT MODE MANAGEMENT - QUẢN LÝ CHẾ ĐỘ CHỈNH SỬA
    // ===================================
    
    /**
     * Khởi tạo chế độ chỉnh sửa
     * Thiết lập event listeners cho các tính năng edit
     * 
     * @public
     * @returns {void}
     */
    initEditMode: function() {
        this.bindEditToggleEvents();
        this.bindSaveEvents();
        this.bindAddSkillEvents();
        this.bindEditableEvents();
        this.bindLanguageEvents();
        
        console.log('✅ Edit mode initialized');
    },
    
    /**
     * Bind events cho nút toggle edit mode
     * 
     * @private
     * @returns {void}
     */
    bindEditToggleEvents: function() {
        const editToggle = document.querySelector(this.selectors.editToggle);
        
        if (!editToggle) {
            console.warn('⚠️ Edit toggle button not found');
            return;
        }
        
        editToggle.addEventListener('click', () => {
            this.toggleEditMode();
        });
    },
    
    /**
     * Bind events cho nút save changes
     * 
     * @private
     * @returns {void}
     */
    bindSaveEvents: function() {
        const saveChanges = document.querySelector(this.selectors.saveChanges);
        
        if (!saveChanges) {
            console.warn('⚠️ Save changes button not found');
            return;
        }
        
        saveChanges.addEventListener('click', () => {
            this.saveAllChanges();
        });
    },
    
    /**
     * Bind events cho nút thêm kỹ năng
     * 
     * @private
     * @returns {void}
     */
    bindAddSkillEvents: function() {
        const addSkillBtn = document.querySelector(this.selectors.addSkillBtn);
        
        if (!addSkillBtn) {
            console.warn('⚠️ Add skill button not found');
            return;
        }
        
        addSkillBtn.addEventListener('click', () => {
            this.showAddSkillModal();
        });
    },
    
    /**
     * Bind events cho các phần tử editable
     * 
     * @private
     * @returns {void}
     */
    bindEditableEvents: function() {
        document.addEventListener('click', (e) => {
            if (this.isEditMode && e.target.classList.contains('editable')) {
                this.makeEditable(e.target);
            }
        });
    },
    
    /**
     * Bind events cho language level dots
     * 
     * @private
     * @returns {void}
     */
    bindLanguageEvents: function() {
        document.addEventListener('click', (e) => {
            if (this.isEditMode && e.target.classList.contains('level-dot')) {
                this.updateLanguageLevel(e.target);
            }
        });
    },
    
    /**
     * Toggle chế độ chỉnh sửa on/off
     * 
     * @public
     * @returns {void}
     */
    toggleEditMode: function() {
        this.isEditMode = !this.isEditMode;
        
        const body = document.body;
        const editToggle = document.querySelector(this.selectors.editToggle);
        const editNotification = document.querySelector(this.selectors.editNotification);
        
        if (!editToggle || !editNotification) {
            console.error('❌ Required elements not found for edit mode toggle');
            return;
        }
        
        if (this.isEditMode) {
            this.enableEditMode(body, editToggle, editNotification);
        } else {
            this.disableEditMode(body, editToggle, editNotification);
        }
        
        console.log(`✅ Edit mode ${this.isEditMode ? 'enabled' : 'disabled'}`);
    },
    
    /**
     * Bật chế độ chỉnh sửa
     * 
     * @private
     * @param {HTMLElement} body - Body element
     * @param {HTMLElement} editToggle - Nút toggle
     * @param {HTMLElement} editNotification - Thông báo edit
     * @returns {void}
     */
    enableEditMode: function(body, editToggle, editNotification) {
        body.classList.add('edit-mode');
        editToggle.classList.add('active');
        editToggle.innerHTML = '<i class="fas fa-save"></i><span>Thoát Edit</span>';
        editNotification.classList.add('show');
        this.showMessage('Chế độ chỉnh sửa đã được bật. Click vào các phần tử để thay đổi.', 'info');
    },
    
    /**
     * Tắt chế độ chỉnh sửa
     * 
     * @private
     * @param {HTMLElement} body - Body element
     * @param {HTMLElement} editToggle - Nút toggle
     * @param {HTMLElement} editNotification - Thông báo edit
     * @returns {void}
     */
    disableEditMode: function(body, editToggle, editNotification) {
        body.classList.remove('edit-mode');
        editToggle.classList.remove('active');
        editToggle.innerHTML = '<i class="fas fa-edit"></i><span>Chỉnh sửa</span>';
        editNotification.classList.remove('show');
        this.showMessage('Đã thoát khỏi chế độ chỉnh sửa.', 'success');
    },
    
    /**
     * Làm cho phần tử có thể chỉnh sửa inline
     * 
     * @public
     * @param {HTMLElement} element - Phần tử cần chỉnh sửa
     * @returns {void}
     */
    makeEditable: function(element) {
        if (!element || !element.hasAttribute('data-field')) {
            console.error('❌ Invalid element for editing');
            return;
        }
        
        const originalText = element.textContent.trim();
        const field = element.getAttribute('data-field');
        
        // Tạo input để chỉnh sửa
        const input = this.createEditInput(originalText);
        
        // Thay thế element bằng input
        this.replaceWithInput(element, input);
        
        // Xử lý khi hoàn thành chỉnh sửa
        this.bindInputEvents(input, element, originalText, field);
        
        console.log(`✏️ Editing field: ${field}`);
    },
    
    /**
     * Tạo input element cho chỉnh sửa
     * 
     * @private
     * @param {string} originalText - Text gốc
     * @returns {HTMLInputElement} Input element
     */
    createEditInput: function(originalText) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.className = 'editing-input';
        return input;
    },
    
    /**
     * Thay thế element bằng input
     * 
     * @private
     * @param {HTMLElement} element - Element gốc
     * @param {HTMLInputElement} input - Input thay thế
     * @returns {void}
     */
    replaceWithInput: function(element, input) {
        element.style.display = 'none';
        element.parentNode.insertBefore(input, element.nextSibling);
        input.focus();
        input.select();
    },
    
    /**
     * Bind events cho input element
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @param {string} originalText - Text gốc
     * @param {string} field - Tên field
     * @returns {void}
     */
    bindInputEvents: function(input, element, originalText, field) {
        const finishEditing = () => {
            this.finishEditing(input, element, originalText, field);
        };
        
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEditing();
            }
        });
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.cancelEditing(input, element);
            }
        });
    },
    
    /**
     * Hoàn thành chỉnh sửa
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @param {string} originalText - Text gốc
     * @param {string} field - Tên field
     * @returns {void}
     */
    finishEditing: function(input, element, originalText, field) {
        const newValue = input.value.trim();
        
        if (newValue && newValue !== originalText) {
            element.textContent = newValue;
            this.cvData[field] = newValue;
            this.showMessage(`Đã cập nhật: ${this.getFieldDisplayName(field)}`, 'success');
        }
        
        this.restoreElement(element, input);
    },
    
    /**
     * Hủy chỉnh sửa
     * 
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {HTMLElement} element - Element gốc
     * @returns {void}
     */
    cancelEditing: function(input, element) {
        this.restoreElement(element, input);
        this.showMessage('Đã hủy chỉnh sửa', 'info');
    },
    
    /**
     * Khôi phục element gốc
     * 
     * @private
     * @param {HTMLElement} element - Element gốc
     * @param {HTMLInputElement} input - Input element
     * @returns {void}
     */
    restoreElement: function(element, input) {
        element.style.display = '';
        if (input.parentNode) {
            input.parentNode.removeChild(input);
        }
    },
    
    /**
     * Lấy tên hiển thị của field
     * 
     * @private
     * @param {string} field - Tên field
     * @returns {string} Tên hiển thị
     */
    getFieldDisplayName: function(field) {
        const fieldNames = {
            'name': 'Tên',
            'profession': 'Nghề nghiệp',
            'phone': 'Số điện thoại',
            'email': 'Email',
            'address': 'Địa chỉ',
            'objective1': 'Mục tiêu 1',
            'objective2': 'Mục tiêu 2'
        };
        
        return fieldNames[field] || field;
    },
    
    /**
     * Cập nhật mức độ ngôn ngữ
     * 
     * @public
     * @param {HTMLElement} clickedDot - Dot được click
     * @returns {void}
     */
    updateLanguageLevel: function(clickedDot) {
        if (!clickedDot || !clickedDot.parentNode) {
            console.error('❌ Invalid language dot element');
            return;
        }
        
        const languageLevel = clickedDot.parentNode;
        const dots = languageLevel.querySelectorAll('.level-dot');
        const clickedIndex = Array.from(dots).indexOf(clickedDot);
        const newLevel = clickedIndex + 1;
        
        // Cập nhật hiển thị
        this.updateLanguageDots(dots, newLevel);
        
        // Lưu vào data
        languageLevel.setAttribute('data-level', newLevel);
        this.showMessage(`Đã cập nhật mức độ ngôn ngữ: ${newLevel}/5`, 'success');
        
        console.log(`✅ Updated language level to ${newLevel}/5`);
    },
    
    /**
     * Cập nhật dots ngôn ngữ
     * 
     * @private
     * @param {NodeList} dots - Danh sách dots
     * @param {number} level - Mức độ mới
     * @returns {void}
     */
    updateLanguageDots: function(dots, level) {
        dots.forEach((dot, index) => {
            if (index < level) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    },

    // ===================================
    // SKILL MANAGEMENT - QUẢN LÝ KỸ NĂNG
    // ===================================
    
    /**
     * Hiển thị modal thêm kỹ năng
     * 
     * @public
     * @returns {void}
     */
    showAddSkillModal: function() {
        const modal = document.querySelector(this.selectors.skillModal);
        const form = document.querySelector(this.selectors.skillForm);
        
        if (!modal || !form) {
            console.error('❌ Skill modal elements not found');
            return;
        }
        
        this.displayModal(modal);
        this.bindModalEvents(modal, form);
        this.bindSkillFormEvents(form, modal);
        
        console.log('✅ Skill modal opened');
    },
    
    /**
     * Hiển thị modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @returns {void}
     */
    displayModal: function(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    },
    
    /**
     * Bind events cho modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @param {HTMLElement} form - Form element
     * @returns {void}
     */
    bindModalEvents: function(modal, form) {
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const skillLevelInput = document.querySelector(this.selectors.skillLevelInput);
        const skillLevelValue = document.querySelector(this.selectors.skillLevelValue);
        
        // Cập nhật hiển thị range value
        if (skillLevelInput && skillLevelValue) {
            skillLevelInput.addEventListener('input', () => {
                skillLevelValue.textContent = skillLevelInput.value + '%';
            });
        }
        
        // Đóng modal events
        const closeModal = () => this.closeModal(modal, form);
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Đóng khi click backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Đóng khi nhấn ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    },
    
    /**
     * Bind events cho skill form
     * 
     * @private
     * @param {HTMLElement} form - Form element
     * @param {HTMLElement} modal - Modal element
     * @returns {void}
     */
    bindSkillFormEvents: function(form, modal) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewSkill();
            this.closeModal(modal, form);
        });
    },
    
    /**
     * Đóng modal
     * 
     * @private
     * @param {HTMLElement} modal - Modal element
     * @param {HTMLElement} form - Form element
     * @returns {void}
     */
    closeModal: function(modal, form) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
        form.reset();
        
        // Reset range display
        const skillLevelValue = document.querySelector(this.selectors.skillLevelValue);
        if (skillLevelValue) {
            skillLevelValue.textContent = '50%';
        }
    },
    
    /**
     * Thêm kỹ năng mới
     * 
     * @public
     * @returns {void}
     */
    addNewSkill: function() {
        const skillName = document.querySelector(this.selectors.skillNameInput)?.value?.trim();
        const skillLevel = document.querySelector(this.selectors.skillLevelInput)?.value;
        const skillsList = document.querySelector(this.selectors.skillsList);
        
        if (!skillName || !skillLevel || !skillsList) {
            console.error('❌ Invalid skill data or skills list not found');
            this.showMessage('Có lỗi khi thêm kỹ năng', 'error');
            return;
        }
        
        // Validate skill level
        const level = Math.min(Math.max(parseInt(skillLevel), this.config.minSkillLevel), this.config.maxSkillLevel);
        
        // Tạo skill item mới
        const skillItem = this.createSkillItem(skillName, level);
        
        // Thêm vào danh sách với animation
        this.addSkillToList(skillsList, skillItem, skillName);
        
        console.log(`✅ Added new skill: ${skillName} (${level}%)`);
    },
    
    /**
     * Tạo skill item HTML
     * 
     * @private
     * @param {string} skillName - Tên kỹ năng
     * @param {number} level - Mức độ kỹ năng
     * @returns {HTMLElement} Skill item element
     */
    createSkillItem: function(skillName, level) {
        const skillItem = document.createElement('li');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-info">
                <span class="skill-name editable" data-field="skill_${Date.now()}">${skillName}</span>
                <span class="skill-percentage">${level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" data-percentage="${level}" style="width: 0%;"></div>
            </div>
        `;
        return skillItem;
    },
    
    /**
     * Thêm skill vào danh sách
     * 
     * @private
     * @param {HTMLElement} skillsList - Container danh sách kỹ năng
     * @param {HTMLElement} skillItem - Skill item mới
     * @param {string} skillName - Tên kỹ năng
     * @returns {void}
     */
    addSkillToList: function(skillsList, skillItem, skillName) {
        const addButton = skillsList.querySelector('.add-skill-btn');
        
        if (addButton) {
            skillsList.insertBefore(skillItem, addButton);
        } else {
            skillsList.appendChild(skillItem);
        }
        
        // Animate skill bar
        setTimeout(() => {
            const skillBar = skillItem.querySelector('.skill-progress');
            const percentage = skillBar.getAttribute('data-percentage');
            this.animateSkillBar(skillBar, parseInt(percentage));
        }, 100);
        
        this.showMessage(`Đã thêm kỹ năng: ${skillName}`, 'success');
    },

    // ===================================
    // DOWNLOAD FEATURE - TÍNH NĂNG TẢI CV
    // ===================================
    
    /**
     * Khởi tạo tính năng tải CV
     * 
     * @public
     * @returns {void}
     */
    initDownloadFeature: function() {
        const downloadBtn = document.querySelector(this.selectors.downloadBtn);
        
        if (!downloadBtn) {
            console.warn('⚠️ Download button not found');
            return;
        }
        
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPrintInstructions();
        });
        
        console.log('✅ Download feature initialized');
    },
    
    /**
     * Hiển thị hướng dẫn in PDF
     * 
     * @public
     * @returns {void}
     */
    showPrintInstructions: function() {
        const instructionDialog = this.createPrintInstructionDialog();
        document.body.appendChild(instructionDialog);
        
        this.bindPrintDialogEvents(instructionDialog);
        
        console.log('✅ Print instructions dialog opened');
    },
    
    /**
     * Tạo dialog hướng dẫn in
     * 
     * @private
     * @returns {HTMLElement} Dialog element
     */
    createPrintInstructionDialog: function() {
        const instructionDialog = document.createElement('div');
        instructionDialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        
        instructionDialog.innerHTML = this.getPrintInstructionHTML();
        return instructionDialog;
    },
    
    /**
     * Lấy HTML cho hướng dẫn in
     * 
     * @private
     * @returns {string} HTML string
     */
    getPrintInstructionHTML: function() {
        return `
            <div style="background-color: white; max-width: 600px; padding: 30px; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="margin-top: 0; color: #0f172a; font-size: 24px; margin-bottom: 15px; text-align: center;">
                    <i class="fas fa-file-pdf" style="color: #f97316; margin-right: 10px;"></i>
                    Lưu CV thành PDF
                </h3>
                <p style="color: #334155; margin-bottom: 15px; text-align: center;">
                    Để lưu CV với đầy đủ màu sắc và định dạng đẹp:
                </p>
                
                <ol style="color: #334155; text-align: left; margin-bottom: 25px; padding-left: 25px; line-height: 1.8;">
                    <li style="margin-bottom: 10px;"><strong>Nhấn "In ngay"</strong> để mở cửa sổ in</li>
                    <li style="margin-bottom: 10px;">Chọn <strong>"Microsoft Print to PDF"</strong> trong danh sách máy in</li>
                    <li style="margin-bottom: 10px;">Mở mục <strong>"Thêm thiết lập"</strong> hoặc <strong>"More settings"</strong></li>
                    <li style="margin-bottom: 10px;">Bật tùy chọn <strong>"Hình nền"</strong> hoặc <strong>"Background graphics"</strong></li>
                    <li style="margin-bottom: 10px;">Đảm bảo <strong>"Định hướng: Dọc"</strong> và <strong>"Khổ giấy: A4"</strong></li>
                    <li style="margin-bottom: 10px;">Tắt <strong>"Tiêu đề & chân trang"</strong> nếu có</li>
                    <li style="margin-bottom: 10px;">Nhấn nút <strong>"In"</strong> hoặc <strong>"Save"</strong></li>
                </ol>
                
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <button id="cancel-print" style="padding: 12px 24px; border: none; background: #e2e8f0; color: #64748b; border-radius: 8px; cursor: pointer; font-weight: 500;">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                    <button id="proceed-print" style="padding: 12px 28px; border: none; background: linear-gradient(135deg, #3b82f6, #f97316); color: white; border-radius: 8px; font-weight: 500; cursor: pointer;">
                        <i class="fas fa-print"></i> In ngay
                    </button>
                </div>
            </div>
        `;
    },
    
    /**
     * Bind events cho print dialog
     * 
     * @private
     * @param {HTMLElement} dialog - Dialog element
     * @returns {void}
     */
    bindPrintDialogEvents: function(dialog) {
        const cancelBtn = dialog.querySelector('#cancel-print');
        const proceedBtn = dialog.querySelector('#proceed-print');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(dialog);
            });
        }
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                this.preparePrintMode();
                document.body.removeChild(dialog);
                setTimeout(() => {
                    window.print();
                }, this.config.animationDuration);
            });
        }
        
        // Đóng khi click backdrop
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                document.body.removeChild(dialog);
            }
        });
        
        // Đóng khi nhấn ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dialog.parentNode) {
                document.body.removeChild(dialog);
            }
        });
    },
    
    /**
     * Chuẩn bị chế độ in
     * 
     * @private
     * @returns {void}
     */
    preparePrintMode: function() {
        // Đảm bảo skill bars hiển thị đúng
        this.updateSkillBarsForPrint();
        
        // Tắt edit mode nếu đang bật
        if (this.isEditMode) {
            this.toggleEditMode();
        }
        
        // Thêm class in vào container
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('printing');
            
            // Khôi phục sau khi in
            setTimeout(() => {
                container.classList.remove('printing');
            }, 1000);
        }
        
        console.log('✅ Print mode prepared');
    },
    
    /**
     * Cập nhật skill bars cho chế độ in
     * 
     * @private
     * @returns {void}
     */
    updateSkillBarsForPrint: function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const percentage = this.getSkillPercentage(bar);
            bar.style.width = percentage + '%';
        });
    },

    // ===================================
    // LANGUAGE LEVELS - QUẢN LÝ MỨC ĐỘ NGÔN NGỮ
    // ===================================
    
    /**
     * Khởi tạo language levels
     * 
     * @public
     * @returns {void}
     */
    initLanguageLevels: function() {
        const languageItems = document.querySelectorAll('.language-item');
        
        languageItems.forEach(item => {
            const level = item.querySelector('.language-level');
            const currentLevel = level.getAttribute('data-level') || 3;
            this.setLanguageLevel(level, parseInt(currentLevel));
        });
        
        console.log(`✅ Initialized ${languageItems.length} language levels`);
    },
    
    /**
     * Set language level
     * 
     * @private
     * @param {HTMLElement} levelContainer - Container chứa dots
     * @param {number} level - Mức độ (1-5)
     * @returns {void}
     */
    setLanguageLevel: function(levelContainer, level) {
        const dots = levelContainer.querySelectorAll('.level-dot');
        this.updateLanguageDots(dots, level);
    },

    // ===================================
    // SMOOTH SCROLLING - CUỘN MƯỢT
    // ===================================
    
    /**
     * Khởi tạo smooth scrolling cho navigation
     * 
     * @public
     * @returns {void}
     */
    initSmoothScrolling: function() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollToTarget(link.getAttribute('href'));
            });
        });
        
        console.log(`✅ Smooth scrolling initialized for ${navLinks.length} links`);
    },
    
    /**
     * Cuộn mượt đến target
     * 
     * @private
     * @param {string} targetId - ID của target element
     * @returns {void}
     */
    smoothScrollToTarget: function(targetId) {
        const target = document.querySelector(targetId);
        
        if (!target) {
            console.warn(`⚠️ Target element not found: ${targetId}`);
            return;
        }
        
        const targetPosition = target.offsetTop - this.config.scrollOffset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // ===================================
    // INTERSECTION OBSERVER - QUAN SÁT GIAO ĐIỂM
    // ===================================
    
    /**
     * Khởi tạo Intersection Observer cho animations
     * 
     * @public
     * @returns {void}
     */
    initIntersectionObserver: function() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver not supported');
            return;
        }
        
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);
        
        // Observe các sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });
        
        console.log(`✅ Intersection Observer initialized for ${sections.length} sections`);
    },
    
    /**
     * Animate element khi visible
     * 
     * @private
     * @param {HTMLElement} element - Element cần animate
     * @returns {void}
     */
    animateElement: function(element) {
        element.classList.add('in-view');
        
        // Animate skill bars nếu có trong section này
        const skillBars = element.querySelectorAll('.skill-progress:not(.animated)');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const percentage = this.getSkillPercentage(bar);
                this.animateSkillBar(bar, percentage);
            }, index * 100);
        });
    },

    // ===================================
    // KEYBOARD SHORTCUTS - PHÍM TẮT
    // ===================================
    
    /**
     * Khởi tạo keyboard shortcuts
     * 
     * @public
     * @returns {void}
     */
    initKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + E: Toggle edit mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.toggleEditMode();
            }
            
            // Ctrl/Cmd + D: Toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Ctrl/Cmd + S: Save changes (in edit mode)
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.isEditMode) {
                e.preventDefault();
                this.saveAllChanges();
            }
        });
        
        console.log('✅ Keyboard shortcuts initialized');
    },

    // ===================================
    // MOBILE FEATURES - TÍNH NĂNG MOBILE
    // ===================================
    
    /**
     * Khởi tạo tính năng mobile
     * 
     * @public
     * @returns {void}
     */
    initMobileFeatures: function() {
        this.initTouchGestures();
        this.initMobileNavigation();
        this.initResponsiveObserver();
        
        console.log('✅ Mobile features initialized');
    },
    
    /**
     * Khởi tạo touch gestures
     * 
     * @private
     * @returns {void}
     */
    initTouchGestures: function() {
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diffY = startY - currentY;
            
            // Swipe down để refresh
            if (diffY < -100 && window.scrollY === 0) {
                this.showMessage('Làm mới trang...', 'info');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }, { passive: true });
    },
    
    /**
     * Khởi tạo mobile navigation
     * 
     * @private
     * @returns {void}
     */
    initMobileNavigation: function() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    },
    
    /**
     * Khởi tạo responsive observer
     * 
     * @private
     * @returns {void}
     */
    initResponsiveObserver: function() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleMobileChange = (e) => {
            if (e.matches) {
                // Mobile mode
                this.enableMobileMode();
            } else {
                // Desktop mode
                this.disableMobileMode();
            }
        };
        
        mediaQuery.addEventListener('change', handleMobileChange);
        handleMobileChange(mediaQuery); // Initial check
    },
    
    /**
     * Bật mobile mode
     * 
     * @private
     * @returns {void}
     */
    enableMobileMode: function() {
        document.body.classList.add('mobile-mode');
        console.log('📱 Mobile mode enabled');
    },
    
    /**
     * Tắt mobile mode
     * 
     * @private
     * @returns {void}
     */
    disableMobileMode: function() {
        document.body.classList.remove('mobile-mode');
        console.log('🖥️ Desktop mode enabled');
    },

    // ===================================
    // DATA MANAGEMENT - QUẢN LÝ DỮ LIỆU
    // ===================================
    
    /**
     * Load saved data
     * 
     * @public
     * @returns {void}
     */
    loadSavedData: function() {
        // Trong environment này, data sẽ được lưu trong memory
        if (Object.keys(this.cvData).length === 0) {
            this.initDefaultData();
        }
        
        console.log('✅ CV data loaded');
    },
    
    /**
     * Khởi tạo default data
     * 
     * @private
     * @returns {void}
     */
    initDefaultData: function() {
        this.cvData = {
            name: 'Nguyen Ngoc Duy',
            profession: 'Web Developer',
            phone: '0358591058',
            email: 'ngocduy12345123@gmail.com',
            address: '388 Huynh Thi Hai, District 12, Ho Chi Minh City, Vietnam',
            lastModified: new Date().toISOString()
        };
    },
    
    /**
     * Save all changes
     * 
     * @public
     * @returns {void}
     */
    saveAllChanges: function() {
        try {
            // Collect all editable fields
            const editableElements = document.querySelectorAll('.editable[data-field]');
            
            editableElements.forEach(element => {
                const field = element.getAttribute('data-field');
                const value = element.textContent.trim();
                this.cvData[field] = value;
            });
            
            // Update last modified
            this.cvData.lastModified = new Date().toISOString();
            
            this.showMessage('Đã lưu tất cả thay đổi!', 'success');
            console.log('✅ All changes saved');
            
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            this.showMessage('Có lỗi xảy ra khi lưu', 'error');
        }
    },

    // ===================================
    // MESSAGE SYSTEM - HỆ THỐNG THÔNG BÁO
    // ===================================
    
    /**
     * Hiển thị message
     * 
     * @public
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, error, info, warning)
     * @returns {void}
     */
    showMessage: function(message, type = 'info') {
        // Tạo message element
        const messageEl = this.createMessageElement(message, type);
        
        // Thêm vào DOM
        document.body.appendChild(messageEl);
        
        // Show với animation
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);
        
        // Auto hide
        setTimeout(() => {
            this.hideMessage(messageEl);
        }, this.config.messageTimeout);
        
        console.log(`💬 Message shown: ${message} (${type})`);
    },
    
    /**
     * Tạo message element
     * 
     * @private
     * @param {string} message - Nội dung
     * @param {string} type - Loại message
     * @returns {HTMLElement} Message element
     */
    createMessageElement: function(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        messageEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        return messageEl;
    },
    
    /**
     * Lấy màu cho message type
     * 
     * @private
     * @param {string} type - Loại message
     * @returns {string} Màu CSS
     */
    getMessageColor: function(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    },
    
    /**
     * Lấy icon cho message type
     * 
     * @private
     * @param {string} type - Loại message
     * @returns {string} Class icon
     */
    getMessageIcon: function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },
    
    /**
     * Ẩn message
     * 
     * @private
     * @param {HTMLElement} messageEl - Message element
     * @returns {void}
     */
    hideMessage: function(messageEl) {
        messageEl.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    },
    
    /**
     * Hiển thị welcome message
     * 
     * @public
     * @returns {void}
     */
    showWelcomeMessage: function() {
        setTimeout(() => {
            this.showMessage('Chào mừng đến với CV Digital của Nguyễn Ngọc Duy! 👋', 'success');
        }, 1000);
    }
};

// ===================================
// AUTO INITIALIZATION - TỰ ĐỘNG KHỞI TẠO
// ===================================

/**
 * Khởi tạo tự động khi DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting CV Application...');
    
    // Delay nhỏ để đảm bảo tất cả resources đã load
    setTimeout(() => {
        window.DuyCV.init();
    }, 100);
});

/**
 * Backup initialization nếu DOMContentLoaded đã fire
 */
if (document.readyState === 'loading') {
    // Document đang load
} else {
    // Document đã load xong
    setTimeout(() => {
        if (window.DuyCV && typeof window.DuyCV.init === 'function') {
            window.DuyCV.init();
        }
    }, 100);
}

// ===================================
// GLOBAL ERROR HANDLER - XỬ LÝ LỖI TOÀN CỤC
// ===================================

/**
 * Xử lý lỗi JavaScript không mong muốn
 */
window.addEventListener('error', function(event) {
    console.error('❌ JavaScript Error:', event.error);
    
    if (window.DuyCV && window.DuyCV.showMessage) {
        window.DuyCV.showMessage('Có lỗi xảy ra. Vui lòng refresh trang.', 'error');
    }
});

/**
 * Xử lý unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('❌ Unhandled Promise Rejection:', event.reason);
    
    if (window.DuyCV && window.DuyCV.showMessage) {
        window.DuyCV.showMessage('Có lỗi xảy ra với tính năng async.', 'warning');
    }
});

console.log('📄 CV JavaScript loaded successfully!');