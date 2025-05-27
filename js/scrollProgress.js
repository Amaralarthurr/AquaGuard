// Funções base do site - Navegação Suave Aprimorada

// Função principal de scroll suave para seções
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
        // Calcular offset da navbar fixa
        const navHeight = document.querySelector('nav').offsetHeight;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - navHeight - 20; // 20px de margem extra
        
        // Scroll suave com comportamento personalizado
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Feedback visual opcional
        targetElement.classList.add('section-highlight');
        setTimeout(() => {
            targetElement.classList.remove('section-highlight');
        }, 2000);
        
        // Fechar menu mobile se estiver aberto
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        console.log(`Navegando para seção: ${sectionId}`);
    } else {
        console.warn(`Seção não encontrada: ${sectionId}`);
    }
}

// Função para scroll suave melhorada com easing
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Função de easing para suavizar a animação
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 AquaGuard - Sistema de navegação inicializado!');
    
    // Configurar todos os links de navegação
    setupNavigationLinks();
    
    // Configurar botões de ação
    setupActionButtons();
    
    // Configurar indicador de seção ativa
    setupActiveSection();
    
    // Configurar scroll spy
    setupScrollSpy();
});

// Configurar links de navegação
function setupNavigationLinks() {
    // Links da navegação principal
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Adicionar classe ativa
            navLinks.forEach(l => l.classList.remove('nav-active'));
            this.classList.add('nav-active');
        });
    });
    
    // Links do footer
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    console.log(`✅ Configurados ${navLinks.length + footerLinks.length} links de navegação`);
}

// Configurar botões de ação
function setupActionButtons() {
    // Botões com onclick já definido no HTML funcionarão automaticamente
    // Mas vamos adicionar listeners extras para garantir
    
    const actionButtons = document.querySelectorAll('button[onclick*="scrollToSection"]');
    actionButtons.forEach(button => {
        // Backup listener caso o onclick falhe
        button.addEventListener('click', function() {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/scrollToSection$$'([^']+)'$$/);
                if (match) {
                    scrollToSection(match[1]);
                }
            }
        });
    });
    
    console.log(`✅ Configurados ${actionButtons.length} botões de ação`);
}

// Configurar indicador de seção ativa
function setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + 100; // Offset para navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover classe ativa de todos os links
                navLinks.forEach(link => link.classList.remove('nav-active'));
                
                // Adicionar classe ativa ao link correspondente
                const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav-active');
                }
            }
        });
    }
    
    // Throttle para performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveSection);
            ticking = true;
            setTimeout(() => { ticking = false; }, 100);
        }
    }
    
    window.addEventListener('scroll', requestTick);
    console.log('✅ Sistema de seção ativa configurado');
}

// Configurar scroll spy para animações
function setupScrollSpy() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Animações específicas por seção
                const sectionId = entry.target.getAttribute('id');
                triggerSectionAnimations(sectionId);
            }
        });
    }, observerOptions);
    
    // Observar todas as seções
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
    
    console.log(`✅ Scroll spy configurado para ${sections.length} seções`);
}

// Animações específicas por seção
function triggerSectionAnimations(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            animateDashboardCards();
            break;
        case 'community':
            animateCommunityForm();
            break;
        case 'gamification':
            animateGamificationElements();
            break;
        case 'about':
            animateAboutSection();
            break;
    }
}

// Animações do dashboard
function animateDashboardCards() {
    const cards = document.querySelectorAll('#dashboard .card-hover');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
        }, index * 100);
    });
}

// Animações da seção comunidade
function animateCommunityForm() {
    const form = document.querySelector('#community-form');
    if (form) {
        form.classList.add('animate-fade-in-up');
    }
}

// Animações da gamificação
function animateGamificationElements() {
    const badges = document.querySelectorAll('#gamification .card-hover');
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.transform = 'scale(1) rotate(0deg)';
            badge.style.opacity = '1';
        }, index * 50);
    });
}

// Animações da seção sobre
function animateAboutSection() {
    const elements = document.querySelectorAll('#about .card-hover');
    elements.forEach(element => {
        element.classList.add('animate-slide-in');
    });
}

// Função para scroll para o topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para scroll para baixo (próxima seção)
function scrollToNextSection() {
    const currentSection = getCurrentSection();
    const sections = ['home', 'dashboard', 'community', 'gamification', 'about'];
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        scrollToSection(sections[currentIndex + 1]);
    }
}

// Obter seção atual
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            return section.getAttribute('id');
        }
    }
    
    return 'home';
}

// Atalhos de teclado para navegação
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + setas para navegação rápida
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                scrollToTop();
                break;
            case 'ArrowDown':
                e.preventDefault();
                scrollToNextSection();
                break;
            case '1':
                e.preventDefault();
                scrollToSection('home');
                break;
            case '2':
                e.preventDefault();
                scrollToSection('dashboard');
                break;
            case '3':
                e.preventDefault();
                scrollToSection('community');
                break;
            case '4':
                e.preventDefault();
                scrollToSection('gamification');
                break;
            case '5':
                e.preventDefault();
                scrollToSection('about');
                break;
        }
    }
});

// Adicionar botão "voltar ao topo" flutuante
function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'fixed bottom-8 right-8 bg-gradient-to-r from-electric-blue to-vibrant-purple text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 opacity-0 pointer-events-none';
    button.id = 'back-to-top';
    button.onclick = scrollToTop;
    
    document.body.appendChild(button);
    
    // Mostrar/ocultar baseado no scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
}

// Inicializar botão voltar ao topo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addBackToTopButton, 1000);
});

// Exportar funções para uso global
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
window.scrollToNextSection = scrollToNextSection;

console.log('🌊 AquaGuard Navigation System - Totalmente carregado!');