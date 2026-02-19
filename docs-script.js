// 文档页面 JavaScript 功能
const DOCS_CONFIG = [
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

const appState = {
    currentDocName: '',
    tocTicking: false
};

document.addEventListener('DOMContentLoaded', function () {
    initDocsPage();
});

function initDocsPage() {
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

    initSidebar(DOCS_CONFIG);
    initSearch();
    initMobileMenus();
    initPaginationActions();
    initTOCEvents();
    initGlobalShortcuts();

    const defaultDoc = getDefaultDoc(DOCS_CONFIG);
    openDocument(defaultDoc.name, false);

    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.docName) {
            openDocument(e.state.docName, false);
            return;
        }

        const fallbackDoc = getDefaultDoc(DOCS_CONFIG);
        openDocument(fallbackDoc.name, false);
    });

    window.addEventListener('scroll', handleTOCHighlightOnScroll, { passive: true });
}

function initSidebar(docsConfig) {
    const navList = document.getElementById('nav-list');

    const categories = {};
    docsConfig.forEach(doc => {
        if (!categories[doc.category]) {
            categories[doc.category] = [];
        }
        categories[doc.category].push(doc);
    });

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
                    <a href="/docs/${doc.slug}/" class="nav-link-item" data-doc="${doc.name}" data-path="${doc.path}" data-title="${doc.title}">
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

    navList.addEventListener('click', function (e) {
        const target = e.target.closest('.nav-link-item');
        if (!target) return;

        e.preventDefault();
        openDocument(target.dataset.doc, true);
        closePanels();
    });
}

function initSearch() {
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
            category.style.display = visibleItems.length === 0 ? 'none' : 'block';
        });

        noResults.style.display = totalVisible === 0 ? 'block' : 'none';
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
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    const toc = document.querySelector('.docs-toc');
    const backdrop = document.getElementById('mobile-panel-backdrop');
    const mobileDocsButton = document.getElementById('mobile-docs-button');
    const mobileTocButton = document.getElementById('mobile-toc-button');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            syncBodyLock();
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                syncBodyLock();
            }
        });
    }

    const toggleSidebar = (e) => {
        if (e) e.stopPropagation();
        if (!sidebar) return;

        const willOpen = !sidebar.classList.contains('open');
        closePanels();

        if (willOpen) {
            sidebar.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
        }

        syncBodyLock();
    };

    const toggleToc = (e) => {
        if (e) e.stopPropagation();
        if (!toc) return;

        const willOpen = !toc.classList.contains('open');
        closePanels();

        if (willOpen) {
            toc.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
        }

        syncBodyLock();
    };

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (mobileDocsButton) {
        mobileDocsButton.addEventListener('click', toggleSidebar);
    }

    if (mobileTocButton) {
        mobileTocButton.addEventListener('click', toggleToc);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closePanels);
    }

    document.addEventListener('click', (e) => {
        if (!sidebar || !toc) return;

        const clickedOutsideSidebar = !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target) && !mobileDocsButton?.contains(e.target);
        const clickedOutsideToc = !toc.contains(e.target) && !mobileTocButton?.contains(e.target);

        if (sidebar.classList.contains('open') && clickedOutsideSidebar) {
            sidebar.classList.remove('open');
        }

        if (toc.classList.contains('open') && clickedOutsideToc) {
            toc.classList.remove('open');
        }

        if (!sidebar.classList.contains('open') && !toc.classList.contains('open') && backdrop) {
            backdrop.classList.remove('active');
        }

        syncBodyLock();
    });
}

function initPaginationActions() {
    const pagination = document.getElementById('mobile-doc-pagination');
    if (!pagination) return;

    pagination.addEventListener('click', function (e) {
        const link = e.target.closest('[data-doc]');
        const action = e.target.closest('[data-action]');

        if (action && action.dataset.action === 'open-sidebar') {
            e.preventDefault();
            const mobileDocsButton = document.getElementById('mobile-docs-button');
            if (mobileDocsButton) {
                mobileDocsButton.click();
            }
            return;
        }

        if (!link) return;

        e.preventDefault();
        openDocument(link.dataset.doc, true);
    });
}

function initTOCEvents() {
    const tocNav = document.getElementById('toc-nav');
    if (!tocNav) return;

    tocNav.addEventListener('click', function (e) {
        const link = e.target.closest('a[data-target]');
        if (!link) return;

        e.preventDefault();

        const targetId = link.dataset.target;
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            closePanels();
        }
    });
}

function initGlobalShortcuts() {
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                openSidebar();
                searchInput.focus();
                searchInput.select();
            }
        }

        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger-menu');
            const navLinks = document.querySelector('.nav-links');

            closePanels();

            if (navLinks && navLinks.classList.contains('active')) {
                hamburger?.classList.remove('active');
                navLinks.classList.remove('active');
            }

            syncBodyLock();
        }
    });
}

function openSidebar() {
    const sidebar = document.querySelector('.docs-sidebar');
    const backdrop = document.getElementById('mobile-panel-backdrop');

    closePanels();

    if (sidebar) {
        sidebar.classList.add('open');
    }

    if (backdrop) {
        backdrop.classList.add('active');
    }

    syncBodyLock();
}

function closePanels() {
    const sidebar = document.querySelector('.docs-sidebar');
    const toc = document.querySelector('.docs-toc');
    const backdrop = document.getElementById('mobile-panel-backdrop');

    sidebar?.classList.remove('open');
    toc?.classList.remove('open');
    backdrop?.classList.remove('active');

    syncBodyLock();
}

function syncBodyLock() {
    const navLinks = document.querySelector('.nav-links');
    const sidebar = document.querySelector('.docs-sidebar');
    const toc = document.querySelector('.docs-toc');

    const navOpen = navLinks?.classList.contains('active');
    const docsPanelOpen = sidebar?.classList.contains('open') || toc?.classList.contains('open');

    document.body.style.overflow = navOpen || docsPanelOpen ? 'hidden' : '';
}

async function openDocument(docName, shouldPushHistory) {
    const doc = DOCS_CONFIG.find(item => item.name === docName);
    if (!doc) return;

    appState.currentDocName = doc.name;

    await loadDocument(doc.path, doc.title);

    setActiveNav(doc.name);
    updateMobileCurrentDoc(doc.title);
    renderMobilePagination(doc.name);

    if (shouldPushHistory) {
        const nextUrl = `/docs/${doc.slug}/`;
        window.history.pushState({ docName: doc.name }, doc.title, nextUrl);
    }

    scrollActiveDocIntoView();
}

function updateMobileCurrentDoc(title) {
    const currentDoc = document.getElementById('mobile-current-doc');
    if (currentDoc) {
        currentDoc.textContent = `当前: ${title}`;
    }
}

function renderMobilePagination(currentDocName) {
    const pagination = document.getElementById('mobile-doc-pagination');
    if (!pagination) return;

    const currentIndex = DOCS_CONFIG.findIndex(doc => doc.name === currentDocName);
    if (currentIndex < 0) {
        pagination.innerHTML = '';
        return;
    }

    const prevDoc = currentIndex > 0 ? DOCS_CONFIG[currentIndex - 1] : null;
    const nextDoc = currentIndex < DOCS_CONFIG.length - 1 ? DOCS_CONFIG[currentIndex + 1] : null;

    const prevHtml = prevDoc
        ? `<a class="mobile-page-link prev" href="/docs/${prevDoc.slug}/" data-doc="${prevDoc.name}">
                <span class="label">上一篇</span>
                <span class="title">${prevDoc.title}</span>
           </a>`
        : '<div></div>';

    const nextHtml = nextDoc
        ? `<a class="mobile-page-link next" href="/docs/${nextDoc.slug}/" data-doc="${nextDoc.name}">
                <span class="label">下一篇</span>
                <span class="title">${nextDoc.title}</span>
           </a>`
        : '<div></div>';

    pagination.innerHTML = `
        ${prevHtml}
        <button class="mobile-page-center" data-action="open-sidebar" type="button">全部文档</button>
        ${nextHtml}
    `;
}

function scrollActiveDocIntoView() {
    const activeLink = document.querySelector('.nav-link-item.active');
    if (!activeLink) return;

    activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

async function loadDocument(path, title) {
    const contentDiv = document.getElementById('markdown-content');

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

        contentDiv.innerHTML = html;
        contentDiv.className = 'markdown-body';

        document.title = `${title} - Zero Forwarder 文档`;

        generateTOC();
        Prism.highlightAllUnder(contentDiv);

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

    if (!tocNav) return;

    if (headings.length === 0) {
        tocNav.innerHTML = '<p class="no-toc">此文档没有标题</p>';
        return;
    }

    let tocHTML = '<ul>';
    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const id = `heading-${index}`;

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
    updateTOCHighlight();
}

function handleTOCHighlightOnScroll() {
    if (appState.tocTicking) return;

    appState.tocTicking = true;
    requestAnimationFrame(function () {
        updateTOCHighlight();
        appState.tocTicking = false;
    });
}

function updateTOCHighlight() {
    const tocLinks = document.querySelectorAll('.toc-nav a');
    const headings = document.querySelectorAll('#markdown-content h1, #markdown-content h2, #markdown-content h3, #markdown-content h4');

    if (headings.length === 0 || tocLinks.length === 0) return;

    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    let currentHeading = null;

    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= navbarHeight + 50) {
            currentHeading = heading;
        }
    });

    tocLinks.forEach(link => link.classList.remove('active'));

    if (currentHeading) {
        const activeLink = document.querySelector(`.toc-nav a[data-target="${currentHeading.id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
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
    const pathMatch = window.location.pathname.match(/^\/docs\/([^/]+)\/?$/i);
    if (pathMatch && pathMatch[1]) {
        const targetSlug = pathMatch[1].toLowerCase();
        const docBySlug = docsConfig.find(doc => doc.slug === targetSlug);
        if (docBySlug) {
            return docBySlug;
        }
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
        const docByName = docsConfig.find(doc => doc.name === hash);
        if (docByName) {
            return docByName;
        }
    }

    return docsConfig[0];
}
