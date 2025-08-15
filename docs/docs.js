// 文档页面交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const sidebar = document.querySelector('.docs-sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const searchInput = document.getElementById('docs-search');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端侧边栏切换
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            
            // 更新按钮图标
            if (sidebar.classList.contains('open')) {
                this.innerHTML = '✕';
                this.style.background = '#ef4444';
            } else {
                this.innerHTML = '☰';
                this.style.background = 'var(--accent-primary)';
            }
        });
    }
    
    // 点击外部区域关闭侧边栏
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.background = 'var(--accent-primary)';
        }
    });
    
    // 高亮当前页面导航
    function highlightCurrentNav() {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace('../', ''))) {
                link.classList.add('active');
            }
        });
    }
    
    // 初始化导航高亮
    highlightCurrentNav();
    
    // 搜索功能
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterNavigation(query);
            }, 300);
        });
    }
    
    function filterNavigation(query) {
        const navSections = document.querySelectorAll('.nav-section');
        
        if (!query) {
            // 显示所有导航项
            navSections.forEach(section => {
                section.style.display = 'block';
                section.querySelectorAll('.nav-item').forEach(item => {
                    item.style.display = 'block';
                });
            });
            return;
        }
        
        navSections.forEach(section => {
            const sectionTitle = section.querySelector('.nav-section-title').textContent.toLowerCase();
            const navItems = section.querySelectorAll('.nav-item');
            let hasVisibleItems = false;
            
            navItems.forEach(item => {
                const linkText = item.querySelector('.nav-link').textContent.toLowerCase();
                
                if (linkText.includes(query) || sectionTitle.includes(query)) {
                    item.style.display = 'block';
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // 显示或隐藏整个区域
            section.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 内容区域滚动监听，更新导航高亮
    const docsContent = document.querySelector('.docs-content');
    if (docsContent) {
        const headings = docsContent.querySelectorAll('h1, h2, h3');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 这里可以添加右侧目录高亮逻辑
                    console.log('Current section:', entry.target.textContent);
                }
            });
        }, {
            rootMargin: '-100px 0px -80% 0px'
        });
        
        headings.forEach(heading => observer.observe(heading));
    }
    
    // 代码复制功能
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                this.textContent = '已复制!';
                this.style.background = 'var(--accent-primary)';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = '复制';
                    this.style.background = 'var(--bg-tertiary)';
                    this.style.color = 'var(--text-secondary)';
                }, 2000);
            });
        });
        
        if (pre.style.position !== 'absolute') {
            pre.style.position = 'relative';
        }
        pre.appendChild(copyBtn);
    });
    
    // 链接悬停效果
    document.querySelectorAll('.docs-content a').forEach(link => {
        if (!link.classList.contains('nav-link')) {
            link.style.color = 'var(--accent-primary)';
            link.style.textDecoration = 'none';
            link.style.borderBottom = '1px solid transparent';
            link.style.transition = 'border-color 0.2s ease';
            
            link.addEventListener('mouseenter', function() {
                this.style.borderBottomColor = 'var(--accent-primary)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.borderBottomColor = 'transparent';
            });
        }
    });
    
    // 窗口大小变化处理
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.background = 'var(--accent-primary)';
        }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // ESC 键关闭移动端侧边栏或清空搜索
        if (e.key === 'Escape') {
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileMenuBtn.innerHTML = '☰';
                mobileMenuBtn.style.background = 'var(--accent-primary)';
            } else if (searchInput === document.activeElement) {
                searchInput.value = '';
                filterNavigation('');
                searchInput.blur();
            }
        }
    });
    
    // 添加搜索快捷键提示
    if (searchInput) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';
        searchInput.placeholder = `搜索文档... (${shortcutKey})`;
    }
    
    // 页面加载完成后的初始化
    setTimeout(() => {
        // 添加页面加载动画
        const elementsToAnimate = document.querySelectorAll('.docs-content > *');
        elementsToAnimate.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});