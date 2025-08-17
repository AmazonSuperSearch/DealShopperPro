// Modern navbar-loader.js - Enhanced with performance & UX improvements

class NavbarLoader {
  constructor() {
    this.placeholder = null;
    this.isLoaded = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async init() {
    try {
      this.placeholder = document.getElementById("navbar-placeholder");
      if (!this.placeholder) {
        console.warn("Navbar placeholder not found");
        return;
      }

      // Add loading state
      this.showLoadingState();
      
      // Load navbar with retry logic
      await this.loadWithRetry();
      
      // Initialize all navbar features
      this.initializeNavbar();
      
      // Add scroll effects
      this.initScrollEffects();
      
      this.isLoaded = true;
      
      // Dispatch custom event for other scripts
      document.dispatchEvent(new CustomEvent('navbarLoaded', {
        detail: { placeholder: this.placeholder }
      }));
      
    } catch (error) {
      this.handleError(error);
    }
  }

  showLoadingState() {
    this.placeholder.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
        <div class="container">
          <div class="navbar-loading">
            <div class="loading-pulse" style="
              height: 40px; 
              background: linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent);
              background-size: 200% 100%;
              animation: loading-shimmer 1.5s infinite;
              border-radius: 8px;
            "></div>
          </div>
        </div>
      </nav>
      <style>
        @keyframes loading-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      </style>
    `;
  }

  async loadWithRetry() {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch("/navbar.html", {
          cache: 'default',
          headers: {
            'Accept': 'text/html'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        if (!html.trim()) {
          throw new Error("Empty navbar content received");
        }
        
        // Smooth content replacement
        this.placeholder.style.opacity = '0';
        this.placeholder.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          this.placeholder.innerHTML = html;
          this.placeholder.style.opacity = '1';
        }, 150);
        
        return; // Success!
        
      } catch (error) {
        this.retryCount = attempt;
        
        if (attempt === this.maxRetries) {
          throw new Error(`Failed to load navbar after ${this.maxRetries + 1} attempts: ${error.message}`);
        }
        
        // Exponential backoff: 500ms, 1s, 2s
        const delay = Math.pow(2, attempt) * 500;
        await this.sleep(delay);
        
        console.warn(`Navbar load attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      }
    }
  }

  initializeNavbar() {
    // Enhanced active link highlighting
    this.highlightActiveLinks();
    
    // Initialize responsive collapse
    this.initializeCollapse();
    
    // Initialize tooltips
    this.initializeTooltips();
    
    // Add link interactions
    this.enhanceLinkInteractions();
  }

  highlightActiveLinks() {
    const currentPath = this.normalizeePath(window.location.pathname);
    const links = this.placeholder.querySelectorAll("a.nav-link[href]");
    
    links.forEach(link => {
      const href = this.normalizeePath(link.getAttribute("href"));
      
      // Enhanced matching logic
      const isMatch = this.isLinkMatch(currentPath, href);
      
      if (isMatch) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        
        // Add subtle animation for active link
        link.style.animation = "activeLink 0.6s ease-out";
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  normalizeePath(path) {
    if (!path) return "/";
    
    // Remove trailing slashes and handle index.html
    const normalized = path.replace(/\/$/, "") || "/";
    return normalized === "/index.html" ? "/" : normalized;
  }

  isLinkMatch(currentPath, linkPath) {
    // Exact match
    if (currentPath === linkPath) return true;
    
    // Handle index.html variations
    if (currentPath === "/" && (linkPath === "/" || linkPath.endsWith("/index.html"))) return true;
    if (linkPath === "/" && currentPath.endsWith("/index.html")) return true;
    
    // Handle subdirectories
    if (currentPath.startsWith(linkPath + "/") && linkPath !== "/") return true;
    
    return false;
  }

  initializeCollapse() {
    const toggler = this.placeholder.querySelector(".navbar-toggler");
    const targetSelector = toggler?.getAttribute("data-bs-target");
    const target = targetSelector ? this.placeholder.querySelector(targetSelector) : null;

    if (!toggler || !target) return;

    // Enhanced Bootstrap integration
    if (window.bootstrap?.Collapse) {
      const collapse = new bootstrap.Collapse(target, { toggle: false });
      
      toggler.addEventListener("click", (e) => {
        e.preventDefault();
        const isShown = target.classList.contains("show");
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        isShown ? collapse.hide() : collapse.show();
      });
      
      // Auto-close on link click (mobile)
      target.addEventListener('click', (e) => {
        if (e.target.matches('.nav-link') && window.innerWidth < 992) {
          setTimeout(() => collapse.hide(), 150);
        }
      });
      
    } else {
      // Fallback for missing Bootstrap
      toggler.addEventListener("click", (e) => {
        e.preventDefault();
        target.classList.toggle("show");
        
        // Update aria attributes
        const isExpanded = target.classList.contains("show");
        toggler.setAttribute("aria-expanded", isExpanded);
      });
    }
  }

  initializeTooltips() {
    if (!window.bootstrap?.Tooltip) return;
    
    // Use requestIdleCallback for better performance
    const initTooltips = () => {
      this.placeholder.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
        try {
          new bootstrap.Tooltip(element, {
            trigger: 'hover',
            delay: { show: 300, hide: 100 },
            animation: true
          });
        } catch (error) {
          console.warn("Tooltip initialization failed:", error);
        }
      });
    };

    if (window.requestIdleCallback) {
      requestIdleCallback(initTooltips, { timeout: 2000 });
    } else {
      setTimeout(initTooltips, 100);
    }
  }

  enhanceLinkInteractions() {
    const links = this.placeholder.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      // Add smooth page transitions
      if (this.isInternalLink(link.href)) {
        link.addEventListener('click', (e) => {
          // Add loading state for navigation
          this.addNavigationLoading(link);
        });
      }
      
      // Enhanced hover effects
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px)';
      });
      
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
          link.style.transform = '';
        }
      });
    });
  }

  initScrollEffects() {
    let ticking = false;
    
    const updateNavbar = () => {
      const navbar = this.placeholder.querySelector('.navbar-custom');
      if (!navbar) return;
      
      const scrolled = window.scrollY > 50;
      navbar.classList.toggle('scrolled', scrolled);
      
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };
    
    // Throttled scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    updateNavbar();
  }

  isInternalLink(href) {
    if (!href) return false;
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return href.startsWith('/') || href.startsWith('./') || href.startsWith('../');
    }
  }

  addNavigationLoading(link) {
    const originalText = link.innerHTML;
    link.innerHTML = `<span style="opacity: 0.7;">${originalText}</span>`;
    
    // Reset after short delay if navigation doesn't happen
    setTimeout(() => {
      if (link.innerHTML.includes('opacity: 0.7')) {
        link.innerHTML = originalText;
      }
    }, 2000);
  }

  handleError(error) {
    console.error("Navbar loading failed:", error);
    
    // Fallback navbar
    if (this.placeholder) {
      this.placeholder.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
          <div class="container">
            <a class="navbar-brand fw-bold text-warning" href="/">
              ⚡ Deal Shopper Pro
            </a>
            <div class="navbar-nav ms-auto">
              <a class="nav-link text-warning" href="/">Home</a>
            </div>
          </div>
        </nav>
      `;
    }
    
    // Dispatch error event
    document.dispatchEvent(new CustomEvent('navbarError', {
      detail: { error: error.message, retryCount: this.retryCount }
    }));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
  @keyframes activeLink {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .navbar-custom .nav-link {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const navbarLoader = new NavbarLoader();
    navbarLoader.init();
  });
} else {
  const navbarLoader = new NavbarLoader();
  navbarLoader.init();
}

// Export for potential external use
window.NavbarLoader = NavbarLoader;
