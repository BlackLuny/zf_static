// 文档页面 JavaScript 功能
document.addEventListener('DOMContentLoaded', function () {
    initDocsPage();
});

function initDocsPage() {
    // 配置 marked.js
    marked.setOptions({
        highlight: function (code, lang) {
            if (lang && Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
            }
            return code;
        },
        breaks: true,
        gfm: true
    });

    // 文档配置
    const docsConfig = [
        {
            name: 'README.md',
            title: '项目介绍',
            path: '/markdown/README.md',
            slug: 'readme',
            category: '开始使用'
        },
        {
            name: 'install.md',
            title: '安装指南',
            path: '/markdown/install.md',
            slug: 'quickstart',
            category: '开始使用'
        },
        {
            name: 'config.md',
            title: '配置说明',
            path: '/markdown/config.md',
            slug: 'config',
            category: '配置指南'
        },
        {
            name: 'faq.md',
            title: '常见问题',
            path: '/markdown/faq.md',
            slug: 'faq',
            category: '帮助支持'
        },
        {
            name: 'ix-guide.md',
            title: 'IX使用说明',
            path: '/markdown/ix-guide.md',
            slug: 'ix-guide',
            category: '配置指南'
        },
        {
            name: 'halo-ix.md',
            title: 'Halo IX机器使用说明',
            path: '/markdown/halo-ix.md',
            slug: 'halo-ix',
            category: '配置指南'
        },
        {
            name: 'bw_merge.md',
            title: '单线程带宽聚合',
            path: '/markdown/bw_merge.md',
            slug: 'bw-merge',
            category: '配置指南'
        },
        {
            name: 'bandwidth_speed_limit.md',
            title: '带宽限速',
            path: '/markdown/bandwidth_speed_limit.md',
            slug: 'bandwidth-speed-limit',
            category: '配置指南'
        },
        {
            name: 'fwd_chain.md',
            title: '动态多级转发链',
            path: '/markdown/fwd_chain.md',
            slug: 'fwd-chain',
            category: '配置指南'
        },
        {
            name: 'latency_test.md',
            title: '延迟Benchmark',
            path: '/markdown/latency_test.md',
            slug: 'latency-test',
            category: '配置指南'
        },
        {
            name: 'inbound_proxy.md',
            title: '入站代理配置指南',
            path: '/markdown/inbound_proxy.md',
            slug: 'inbound-proxy',
            category: '配置指南'
        },
        {
            name: 'china_server.md',
            title: '国内机器最佳实践',
            path: '/markdown/china_server.md',
            slug: 'china-server',
            category: '配置指南'
        },
        {
            name: 'global_cdn_config.md',
            title: '一机拉全球模式配置',
            path: '/markdown/global_cdn_config.md',
            slug: 'global-cdn-config',
            category: '配置指南'
        },
        {
            name: 'jp_us_lan.md',
            title: '日本美国内网组网配置',
            path: '/markdown/jp_us_lan.md',
            slug: 'jp-us-lan',
            category: '配置指南'
        },
        {
            name: 'multi_fallback_line.md',
            title: '多备用线路配置',
            path: '/markdown/multi_fallback_line.md',
            slug: 'multi-fallback-line',
            category: '配置指南'
        },
        {
            name: 'UNLOCK_TRAFFIC_ROUTING_GUIDE.md',
            title: '解锁服务配置与分流管理',
            path: '/markdown/UNLOCK_TRAFFIC_ROUTING_GUIDE.md',
            slug: 'unlock-traffic-routing-guide',
            category: '配置指南'
        }
    ];

    // 初始化侧边栏导航
    initSidebar(docsConfig);

    // 初始化搜索功能
    initSearch(docsConfig);

    // 初始化移动端菜单
    initMobileMenus();

    // 加载默认文档
    const defaultDoc = getDefaultDoc(docsConfig);
    loadDocument(defaultDoc.path, defaultDoc.title);

    // 设置当前活动文档
    setActiveNav(defaultDoc.name);
}

function initSidebar(docsConfig) {
    const navList = document.getElementById('nav-list');

    // 按分类组织文档
    const categories = {};
    docsConfig.forEach(doc => {
        if (!categories[doc.category]) {
            categories[doc.category] = [];
        }
        categories[doc.category].push(doc);
    });

    // 生成导航HTML
    let navHTML = '';
    Object.keys(categories).forEach(category => {
        navHTML += `
            <li class="nav-category">
                <div class="category-header">${category}</div>
                <ul class="category-list">
        `;

        categories[category].forEach(doc => {
            navHTML += `
                <li class="nav-item">
                    <a href="#" class="nav-link-item" data-doc="${doc.name}" data-path="${doc.path}" data-title="${doc.title}">
                        ${doc.title}
                    </a>
                </li>
            `;
        });

        navHTML += `
                </ul>
            </li>
        `;
    });

    navList.innerHTML = navHTML;

    // 添加分类样式
    const style = document.createElement('style');
    style.textContent = `
        .nav-category {
            margin-bottom: var(--space-lg);
        }
        
        .category-header {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: var(--space-sm) var(--space-md);
            margin-bottom: var(--space-sm);
        }
        
        .category-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
    `;
    document.head.appendChild(style);

    // 绑定点击事件
    navList.addEventListener('click', function (e) {
        if (e.target.classList.contains('nav-link-item')) {
            e.preventDefault();
            const path = e.target.dataset.path;
            const title = e.target.dataset.title;
            const docName = e.target.dataset.doc;

            loadDocument(path, title);
            setActiveNav(docName);

            // 更新URL
            const docSlug = getDocSlugByName(docName, docsConfig);
            const nextUrl = docSlug ? `/docs/${docSlug}/` : `/docs.html#${docName}`;
            window.history.pushState({ path, title, docName }, title, nextUrl);

            // 移动端关闭侧边栏
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.docs-sidebar');
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            }
        }
    });

    // 处理浏览器后退/前进
    window.addEventListener('popstate', function (e) {
        if (e.state) {
            loadDocument(e.state.path, e.state.title);
            setActiveNav(e.state.docName);
        } else {
            const defaultDoc = getDefaultDoc(docsConfig);
            loadDocument(defaultDoc.path, defaultDoc.title);
            setActiveNav(defaultDoc.name);
        }
    });
}

function initSearch(docsConfig) {
    const searchInput = document.getElementById('search-input');
    const navList = document.getElementById('nav-list');
    
    let noResults = document.getElementById('no-search-results');
    if (!noResults) {
        noResults = document.createElement('li');
        noResults.id = 'no-search-results';
        noResults.className = 'no-results';
        noResults.innerHTML = '<div class="no-results-content">无结果</div>';
        noResults.style.display = 'none';
        navList.appendChild(noResults);
    }

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            navList.querySelectorAll('.nav-item').forEach(item => {
                item.style.display = 'block';
            });
            navList.querySelectorAll('.nav-category').forEach(category => {
                category.style.display = 'block';
            });
            noResults.style.display = 'none';
            return;
        }

        let totalVisible = 0;

        navList.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link-item');
            const title = link.dataset.title.toLowerCase();
            const docName = link.dataset.doc.toLowerCase();

            if (title.includes(searchTerm) || docName.includes(searchTerm)) {
                item.style.display = 'block';
                totalVisible++;
            } else {
                item.style.display = 'none';
            }
        });

        navList.querySelectorAll('.nav-category').forEach(category => {
            const visibleItems = category.querySelectorAll('.nav-item:not([style*="display: none"])');
            if (visibleItems.length === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });

        if (totalVisible === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (searchInput.value !== '') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
            searchInput.blur();
        }
    });
}

function initMobileMenus() {
    // 1. Main Navbar Hamburger
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 2. Docs Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

async function loadDocument(path, title) {
    const contentDiv = document.getElementById('markdown-content');

    // 显示加载状态
    contentDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>加载中...</p>
        </div>
    `;

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const markdown = await response.text();
        const html = marked.parse(markdown);

        // 渲染内容
        contentDiv.innerHTML = html;
        contentDiv.className = 'markdown-body';

        // 更新页面标题
        document.title = `${title} - Zero Forwarder 文档`;

        // 生成目录
        generateTOC();

        // 高亮代码
        Prism.highlightAllUnder(contentDiv);

        // 滚动到顶部
        contentDiv.scrollTop = 0;
        window.scrollTo(0, 0);

    } catch (error) {
        console.error('加载文档失败:', error);
        contentDiv.innerHTML = `
            <div class="error-message">
                <h3>文档加载失败</h3>
                <p>无法加载文档: ${path}</p>
                <p>错误信息: ${error.message}</p>
                <p>请检查文件是否存在或稍后重试。</p>
            </div>
        `;
    }
}

function generateTOC() {
    const tocNav = document.getElementById('toc-nav');
    const contentDiv = document.getElementById('markdown-content');
    const headings = contentDiv.querySelectorAll('h1, h2, h3, h4');

    if (headings.length === 0) {
        tocNav.innerHTML = '<p class="no-toc">此文档没有标题</p>';
        return;
    }

    let tocHTML = '<ul>';
    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const id = `heading-${index}`;

        // 为标题添加ID，用于锚点跳转
        heading.id = id;

        tocHTML += `
            <li>
                <a href="#${id}" class="toc-${level}" data-target="${id}">
                    ${text}
                </a>
            </li>
        `;
    });
    tocHTML += '</ul>';

    tocNav.innerHTML = tocHTML;

    // 绑定目录点击事件
    tocNav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.dataset.target;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // 滚动时高亮当前目录项
    initTOCHighlight();
}

function initTOCHighlight() {
    const tocLinks = document.querySelectorAll('.toc-nav a');
    const headings = document.querySelectorAll('#markdown-content h1, #markdown-content h2, #markdown-content h3, #markdown-content h4');

    if (headings.length === 0) return;

    function updateTOCHighlight() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        let currentHeading = null;

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= navbarHeight + 50) {
                currentHeading = heading;
            }
        });

        // 更新目录高亮
        tocLinks.forEach(link => link.classList.remove('active'));

        if (currentHeading) {
            const activeLink = document.querySelector(`.toc-nav a[data-target="${currentHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // 节流滚动事件
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateTOCHighlight();
                ticking = false;
            });
            ticking = true;
        }
    });

    // 初始高亮
    updateTOCHighlight();
}

function setActiveNav(docName) {
    const navLinks = document.querySelectorAll('.nav-link-item');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.querySelector(`.nav-link-item[data-doc="${docName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function getDefaultDoc(docsConfig) {
    // 优先解析 /docs/<slug>/ 形式路径
    const pathMatch = window.location.pathname.match(/^\/docs\/([^/]+)\/?$/i);
    if (pathMatch && pathMatch[1]) {
        const targetSlug = pathMatch[1].toLowerCase();
        const docBySlug = docsConfig.find(doc => doc.slug === targetSlug);
        if (docBySlug) {
            return {
                name: docBySlug.name,
                path: docBySlug.path,
                title: docBySlug.title
            };
        }
    }

    // 检查URL中是否有指定的文档
    const hash = window.location.hash.slice(1);
    if (hash) {
        const link = document.querySelector(`.nav-link-item[data-doc="${hash}"]`);
        if (link) {
            return {
                name: hash,
                path: link.dataset.path,
                title: link.dataset.title
            };
        }
    }

    // 返回默认文档
    return {
        name: 'README.md',
        path: '/markdown/README.md',
        title: '项目介绍'
    };
}

function getDocSlugByName(docName, docsConfig) {
    const matchedDoc = docsConfig.find(doc => doc.name === docName);
    return matchedDoc ? matchedDoc.slug : '';
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // ESC 关闭移动端菜单
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.docs-sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');

        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
        
        if (navLinks && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
