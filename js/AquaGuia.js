        // Dados das seções para o guia
        const sectionData = {
            home: {
                title: "🏠 Bem-vindo ao AquaGuard!",
                message: "Esta é nossa página inicial! Aqui você encontra uma visão geral da plataforma, estatísticas em tempo real e pode começar sua jornada de prevenção de enchentes. O AquaGuard é sua ferramenta para proteger sua comunidade!",
                tips: "💡 Dica: Role para baixo para explorar todas as funcionalidades ou use meu menu para navegar rapidamente!"
            },
            dashboard: {
                title: "📊 Dashboard em Tempo Real",
                message: "Aqui está o coração do AquaGuard! Monitore dados de precipitação, áreas de risco, relatos da comunidade e usuários ativos. Os gráficos e mapas são atualizados constantemente para te manter informado sobre a situação atual.",
                tips: "💡 Dica: Clique nos botões 'Atualizar' e 'Centralizar' para interagir com os dados!"
            },
            community: {
                title: "👥 Comunidade Colaborativa",
                message: "Esta é a seção mais importante! Aqui você pode contribuir com relatos sobre sua região, ajudando a criar uma rede de proteção comunitária. Seus dados são protegidos pela LGPD e cada relato vale pontos!",
                tips: "💡 Dica: Quanto mais detalhado seu relato, mais útil ele será para a comunidade!"
            },
            gamification: {
                title: "🏆 Sistema de Recompensas",
                message: "Transformamos a prevenção em diversão! Ganhe pontos, conquiste badges, suba no ranking e teste seus conhecimentos no quiz. Cada contribuição sua é recompensada e ajuda a salvar vidas!",
                tips: "💡 Dica: Faça o quiz para testar seus conhecimentos sobre prevenção de enchentes!"
            },
            about: {
                title: "🤝 Nossas Parcerias",
                message: "Conheça nossos parceiros influenciadores que ajudam a espalhar a mensagem de prevenção! Trabalhamos com podcasters, YouTubers e ativistas para alcançar mais pessoas e criar uma rede de conscientização.",
                tips: "💡 Dica: Siga nossos parceiros nas redes sociais para mais conteúdo educativo!"
            }
        };

        // Variáveis globais para o guia 3D
        let guideScene, guideCamera, guideRenderer, guideModel;
        let isGuideLoaded = false;

        // Variáveis para controle do guia
        let isMenuOpen = false;
        let currentSpeechTimeout = null;

        // Função para scroll suave
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ 
                behavior: 'smooth' 
            });
        }

        // Inicializar o guia 3D
        function initGuide3D() {
            const container = document.getElementById('guide3D');
            
            // Criar cena
            guideScene = new THREE.Scene();
            
            // Criar câmera
            guideCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
            guideCamera.position.set(0, 0, 4);
            
            // Criar renderer
            guideRenderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                preserveDrawingBuffer: true
            });
            guideRenderer.setSize(120, 120);
            guideRenderer.setClearColor(0x000000, 0);
            guideRenderer.shadowMap.enabled = true;
            guideRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(guideRenderer.domElement);
            
            // Adicionar iluminação melhorada
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            guideScene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(2, 2, 2);
            directionalLight.castShadow = true;
            guideScene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0x06b6d4, 0.3);
            pointLight.position.set(-2, 1, 1);
            guideScene.add(pointLight);
            
            // Carregar modelo GLB com URLs alternativas
            const loader = new THREE.GLTFLoader();
            
            // Lista de URLs para tentar (modelo anterior)
            const modelUrls = [
                'https://raw.githubusercontent.com/Amaralarthurr/3dmodel-aquaguard/997b7cb69c750a9aeb34b0ac28f408021e349cae/cute_water.glb',
                'https://github.com/Amaralarthurr/3dmodel-aquaguard/raw/997b7cb69c750a9aeb34b0ac28f408021e349cae/cute_water.glb',
                'https://cdn.jsdelivr.net/gh/Amaralarthurr/3dmodel-aquaguard@997b7cb69c750a9aeb34b0ac28f408021e349cae/cute_water.glb'
            ];
            
            let currentUrlIndex = 0;
            
            function tryLoadModel() {
                if (currentUrlIndex >= modelUrls.length) {
                    console.error('Todas as URLs falharam, criando fallback');
                    createFallbackModel();
                    return;
                }
                
                const currentUrl = modelUrls[currentUrlIndex];
                console.log(`Tentando carregar modelo da URL ${currentUrlIndex + 1}:`, currentUrl);
                
                loader.load(
                    currentUrl,
                    function(gltf) {
                        console.log('Modelo GLB carregado com sucesso!', gltf);
                        guideModel = gltf.scene;
                        
                        // Calcular bounding box para ajustar escala
                        const box = new THREE.Box3().setFromObject(guideModel);
                        const size = box.getSize(new THREE.Vector3());
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 2 / maxDim; // Ajustar para caber bem no container
                        
                        guideModel.scale.set(scale, scale, scale);
                        
                        // Centralizar o modelo
                        const center = box.getCenter(new THREE.Vector3());
                        guideModel.position.sub(center.multiplyScalar(scale));
                        guideModel.position.y -= 0.2; // Ajuste fino da posição
                        
                        // Adicionar à cena
                        guideScene.add(guideModel);
                        isGuideLoaded = true;
                        
                        console.log('Modelo adicionado à cena com sucesso!');
                        
                        // Iniciar animação
                        animateGuide();
                    },
                    function(progress) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(1);
                        console.log(`Progresso do carregamento: ${percent}%`);
                    },
                    function(error) {
                        console.error(`Erro ao carregar da URL ${currentUrlIndex + 1}:`, error);
                        currentUrlIndex++;
                        tryLoadModel(); // Tentar próxima URL
                    }
                );
            }
            
            function createFallbackModel() {
                console.log('Criando modelo fallback (gotinha estilizada)');
                
                // Criar uma gotinha estilizada em vez de esfera simples
                const dropGeometry = new THREE.SphereGeometry(0.8, 16, 16);
                
                // Modificar a geometria para parecer uma gota
                const positions = dropGeometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const y = positions[i + 1];
                    if (y > 0.4) {
                        // Afinar a parte superior para formar a gota
                        const factor = 1 - (y - 0.4) * 0.8;
                        positions[i] *= factor;     // x
                        positions[i + 2] *= factor; // z
                    }
                }
                dropGeometry.attributes.position.needsUpdate = true;
                dropGeometry.computeVertexNormals();
                
                const material = new THREE.MeshLambertMaterial({ 
                    color: 0x06b6d4,
                    emissive: 0x033d4a,
                    emissiveIntensity: 0.1,
                    transparent: true,
                    opacity: 0.9
                });
                
                guideModel = new THREE.Mesh(dropGeometry, material);
                guideModel.position.set(0, 0, 0);
                guideScene.add(guideModel);
                isGuideLoaded = true;
                
                console.log('Modelo fallback criado');
                animateGuide();
            }
            
            // Iniciar tentativa de carregamento
            tryLoadModel();
        }

        // Animar o guia 3D (versão estática)
        function animateGuide() {
            requestAnimationFrame(animateGuide);
            
            if (guideModel && isGuideLoaded) {
                // Remover rotação - modelo fica parado
                // guideModel.rotation.y += 0.01; // REMOVIDO
                
                // Manter apenas uma sutil flutuação vertical (opcional)
                guideModel.position.y = -0.2 + Math.sin(Date.now() * 0.002) * 0.05;
                
                // Remover inclinação
                // guideModel.rotation.x = Math.sin(Date.now() * 0.002) * 0.1; // REMOVIDO
            }
            
            if (guideRenderer) {
                guideRenderer.render(guideScene, guideCamera);
            }
        }

        // Interações do guia
        function setupGuideInteractions() {
            const guide = document.getElementById('guide3D');
            const tooltip = document.getElementById('guideTooltip');
            const menu = document.getElementById('guideMenu');
            const overlay = document.getElementById('guideOverlay');
            const speech = document.getElementById('guideSpeech');
            const menuClose = document.getElementById('guideMenuClose');
            const speechClose = document.getElementById('guideSpeechClose');
            const speechNext = document.getElementById('guideSpeechNext');
            
            // Mostrar tooltip ao passar o mouse
            guide.addEventListener('mouseenter', function() {
                if (!isMenuOpen) {
                    tooltip.classList.add('show');
                }
            });
            
            // Esconder tooltip ao sair com o mouse
            guide.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
            });
            
            // Clique no guia - abrir menu
            guide.addEventListener('click', function() {
                openGuideMenu();
            });
            
            // Fechar menu
            menuClose.addEventListener('click', closeGuideMenu);
            overlay.addEventListener('click', closeGuideMenu);
            
            // Fechar balão de fala
            speechClose.addEventListener('click', function() {
                hideSpeech();
            });
            
            // Navegação do menu
            const menuItems = document.querySelectorAll('.guide-menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const section = this.dataset.section;
                    navigateToSection(section);
                });
            });
            
            // Tecla ESC para fechar
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (isMenuOpen) {
                        closeGuideMenu();
                    } else {
                        hideSpeech();
                    }
                }
            });
        }

        // Abrir menu do guia
        function openGuideMenu() {
            const menu = document.getElementById('guideMenu');
            const overlay = document.getElementById('guideOverlay');
            const tooltip = document.getElementById('guideTooltip');
            
            menu.classList.add('open');
            overlay.classList.add('show');
            tooltip.classList.remove('show');
            isMenuOpen = true;
            
            // Falar sobre o menu
            setTimeout(() => {
                showSpeech(
                    "🎯 Menu de Navegação",
                    "Escolha uma seção para explorar! Vou te explicar tudo sobre cada área do AquaGuard. Clique em qualquer opção para começar nossa jornada!",
                    "💡 Dica: Use as teclas de seta ou clique diretamente nas opções!"
                );
            }, 500);
        }

        // Fechar menu do guia
        function closeGuideMenu() {
            const menu = document.getElementById('guideMenu');
            const overlay = document.getElementById('guideOverlay');
            
            menu.classList.remove('open');
            overlay.classList.remove('show');
            isMenuOpen = false;
            hideSpeech();
        }

        // Navegar para seção
        function navigateToSection(sectionId) {
            closeGuideMenu();
            
            // Scroll suave para a seção
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Aguardar o scroll e então falar sobre a seção
                setTimeout(() => {
                    const data = sectionData[sectionId];
                    if (data) {
                        showSpeech(data.title, data.message, data.tips);
                    }
                }, 1000);
            }
        }

        // Mostrar balão de fala
        function showSpeech(title, message, tips) {
            const speech = document.getElementById('guideSpeech');
            const content = document.getElementById('guideSpeechContent');
            
            // Limpar timeout anterior
            if (currentSpeechTimeout) {
                clearTimeout(currentSpeechTimeout);
            }
            
            // Montar conteúdo
            let fullMessage = `<strong>${title}</strong><br><br>${message}`;
            if (tips) {
                fullMessage += `<br><br>${tips}`;
            }
            
            content.innerHTML = fullMessage;
            speech.classList.add('show');
            
            // Auto-hide após 20 segundos
            currentSpeechTimeout = setTimeout(() => {
                hideSpeech();
            }, 20000);
        }

        // Esconder balão de fala
        function hideSpeech() {
            const speech = document.getElementById('guideSpeech');
            speech.classList.remove('show');
            
            if (currentSpeechTimeout) {
                clearTimeout(currentSpeechTimeout);
                currentSpeechTimeout = null;
            }
        }

        // Interações do guia
        function setupGuideInteractions() {
            const guide = document.getElementById('guide3D');
            const tooltip = document.getElementById('guideTooltip');
            const menu = document.getElementById('guideMenu');
            const overlay = document.getElementById('guideOverlay');
            const speech = document.getElementById('guideSpeech');
            const menuClose = document.getElementById('guideMenuClose');
            const speechClose = document.getElementById('guideSpeechClose');
            const speechNext = document.getElementById('guideSpeechNext');
            
            // Mostrar tooltip ao passar o mouse
            guide.addEventListener('mouseenter', function() {
                if (!isMenuOpen) {
                    tooltip.classList.add('show');
                }
            });
            
            // Esconder tooltip ao sair com o mouse
            guide.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
            });
            
            // Clique no guia - abrir menu
            guide.addEventListener('click', function() {
                openGuideMenu();
            });
            
            // Fechar menu
            menuClose.addEventListener('click', closeGuideMenu);
            overlay.addEventListener('click', closeGuideMenu);
            
            // Fechar balão de fala
            speechClose.addEventListener('click', function() {
                hideSpeech();
            });
            
            // Navegação do menu
            const menuItems = document.querySelectorAll('.guide-menu-item');
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const section = this.dataset.section;
                    navigateToSection(section);
                });
            });
            
            // Tecla ESC para fechar
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (isMenuOpen) {
                        closeGuideMenu();
                    } else {
                        hideSpeech();
                    }
                }
            });
        }

        // Responsividade
        function handleResize() {
            if (guideRenderer) {
                guideRenderer.setSize(120, 120);
            }
        }

        // Inicializar quando a página carregar
        window.addEventListener('load', function() {
            // Aguardar um pouco para garantir que tudo carregou
            setTimeout(() => {
                initGuide3D();
                setupGuideInteractions();
                
                // Mostrar tooltip inicial após 3 segundos
                setTimeout(() => {
                    const tooltip = document.getElementById('guideTooltip');
                    tooltip.classList.add('show');
                    
                    // Esconder após 5 segundos
                    setTimeout(() => {
                        tooltip.classList.remove('show');
                    }, 5000);
                }, 3000);
            }, 1000);
        });

        // Event listener para redimensionamento
        window.addEventListener('resize', handleResize);