// 平滑滚动导航
document.addEventListener('DOMContentLoaded', function() {
    // 为所有导航链接添加平滑滚动
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滚动时的背景模糊效果
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.9)';
            navbar.style.backdropFilter = 'blur(12px)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 复制安装命令功能
    const copyBtn = document.querySelector('.copy-btn');
    const command = document.querySelector('.command').textContent;
    
    copyBtn.addEventListener('click', function() {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        textArea.value = command.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            // 更新按钮文本
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制!';
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    });
    
    // 卡片悬停动画增强
    const cards = document.querySelectorAll('.feature-card, .doc-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 页面加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为需要动画的元素添加观察
    const animateElements = document.querySelectorAll('.feature-card, .doc-card, .hero-content, .section-title');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 搜索框交互效果
    const searchBox = document.querySelector('.search-box');
    
    searchBox.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.05)';
    });
    
    searchBox.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
    
    // 按钮点击波纹效果
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn, .copy-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 终端打字效果
    const commandElement = document.querySelector('.command');
    const originalCommand = commandElement.textContent;
    
    function typeWriter(text, element, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // 当安装区域进入视口时开始打字动画
    const installSection = document.querySelector('.install');
    const installObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    typeWriter(originalCommand, commandElement, 30);
                }, 500);
                installObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    installObserver.observe(installSection);
    
    // 移动端菜单切换
    if (window.innerWidth <= 768) {
        // 为小屏幕设备优化导航
        const navLinks = document.querySelector('.nav-links');
        let isMenuOpen = false;
        
        // 添加汉堡菜单按钮
        const menuButton = document.createElement('button');
        menuButton.innerHTML = '☰';
        menuButton.style.cssText = `
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        `;
        
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
            navLinks.style.display = 'none';
            document.querySelector('.nav-container').appendChild(menuButton);
            
            menuButton.addEventListener('click', function() {
                isMenuOpen = !isMenuOpen;
                navLinks.style.display = isMenuOpen ? 'flex' : 'none';
                
                if (isMenuOpen) {
                    navLinks.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--bg-primary);
                        flex-direction: column;
                        padding: var(--space-lg);
                        border-top: 1px solid var(--border-color);
                        display: flex;
                    `;
                }
            });
        }
    }
    
    // 性能优化：节流滚动事件
    let ticking = false;
    
    function updateScrollEffects() {
        // 这里可以添加更多滚动相关的效果
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
});

// CSS 动画关键帧（通过 JavaScript 添加到样式表）
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
`;

document.head.appendChild(style);