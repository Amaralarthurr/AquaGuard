// Sistema de Quiz Interativo
let selectedAnswer = null;
let quizAnswered = false;

function initQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (quizAnswered) return;
            
            // Remover seleção anterior
            quizOptions.forEach(opt => {
                opt.classList.remove('bg-white/30', 'border-2', 'border-white');
            });
            
            // Adicionar seleção atual
            this.classList.add('bg-white/30', 'border-2', 'border-white');
            selectedAnswer = this.dataset.correct === 'true';
        });
    });
    
    document.getElementById('quiz-submit').addEventListener('click', submitQuiz);
}

function submitQuiz() {
    if (selectedAnswer === null || quizAnswered) return;
    
    quizAnswered = true;
    const quizOptions = document.querySelectorAll('.quiz-option');
    const submitButton = document.getElementById('quiz-submit');
    
    quizOptions.forEach(option => {
        const isCorrect = option.dataset.correct === 'true';
        
        if (isCorrect) {
            option.classList.add('bg-green-500/50', 'border-green-400');
            option.innerHTML = '✅ ' + option.innerHTML;
        } else {
            option.classList.add('bg-red-500/50', 'border-red-400');
            option.innerHTML = '❌ ' + option.innerHTML;
        }
        
        option.style.pointerEvents = 'none';
    });
    
    if (selectedAnswer) {
        // Resposta correta
        submitButton.innerHTML = '🎉 Correto! +100 pontos';
        submitButton.classList.add('bg-green-500');
        
        // Atualizar pontos do usuário
        updateUserPoints(100);
        
        // Mostrar explicação
        setTimeout(() => {
            alert('🎉 Parabéns! A falta de drenagem urbana adequada é realmente a principal causa de enchentes nas cidades brasileiras. Você ganhou 100 pontos!');
        }, 1000);
        
    } else {
        // Resposta incorreta
        submitButton.innerHTML = '😔 Incorreto. Tente amanhã!';
        submitButton.classList.add('bg-red-500');
        
        setTimeout(() => {
            alert('😔 Resposta incorreta. A principal causa de enchentes urbanas é a falta de drenagem adequada. Tente novamente amanhã!');
        }, 1000);
    }
    
    submitButton.style.pointerEvents = 'none';
}

function updateUserPoints(points) {
    const currentPoints = parseInt(document.getElementById('user-points').textContent);
    const newPoints = currentPoints + points;
    
    // Atualizar todos os elementos de pontuação
    document.getElementById('user-points').textContent = newPoints;
    document.getElementById('profile-points').textContent = newPoints;
    
    // Animação de pontos
    const pointsElements = document.querySelectorAll('#user-points, #profile-points');
    pointsElements.forEach(element => {
        element.classList.add('animate-pulse');
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, 2000);
    });
}

// Inicializar quiz quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initQuiz);