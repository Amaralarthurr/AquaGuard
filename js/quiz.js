class QuizSystem {
  constructor() {
    this.questions = [
      {
        id: 1,
        question: "Qual é a principal causa de enchentes urbanas no Brasil?",
        options: [
          "Falta de drenagem urbana adequada",
          "Excesso de chuva apenas",
        ],
        correct: 0,
        hint: "Pense na infraestrutura das cidades brasileiras e como a água da chuva é escoada.",
      },
      {
        id: 2,
        question: "O que fazer PRIMEIRO ao receber um alerta de enchente?",
        options: [
          "Sair de casa imediatamente",
          "Verificar a veracidade da informação",
        ],
        correct: 1,
        hint: "Sempre confirme a informação antes de tomar qualquer ação drástica.",
      },
      {
        id: 3,
        question: "Durante uma enchente, qual é a profundidade MÁXIMA segura para caminhar na água?",
        options: [
          "Até o joelho (50cm)",
          "Até o tornozelo (15cm)",
        ],
        correct: 1,
        hint: "A correnteza pode ser muito forte mesmo em águas aparentemente rasas.",
      },
      {
        id: 4,
        question: "Qual item é ESSENCIAL em um kit de emergência para enchentes?",
        options: ["Televisão portátil", "Rádio à pilha"],
        correct: 1,
        hint: "Pense em algo que funcione sem energia elétrica e forneça informações importantes.",
      },
      {
        id: 5,
        question: "O que NÃO se deve fazer durante uma enchente?",
        options: [
          "Procurar abrigo em local alto",
          "Dirigir através de ruas alagadas",
        ],
        correct: 1,
        hint: "Uma das opções representa um grande perigo que muitas pessoas subestimam.",
      }

    ]

    this.currentQuestion = 0
    this.score = 0
    this.selectedAnswer = null
    this.quizCompleted = false
    this.userAnswers = []

    this.init()
  }

  init() {
    this.bindEvents()
    this.loadQuestion()
    console.log("Sistema de Quiz inicializado")
  }

  bindEvents() {
    const submitBtn = document.getElementById("quiz-submit")
    const hintBtn = document.getElementById("quiz-hint")
    const restartBtn = document.getElementById("quiz-restart")

    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.handleSubmit())
    }

    if (hintBtn) {
      hintBtn.addEventListener("click", () => this.showHint())
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.restartQuiz())
    }
  }

  loadQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.showResults()
      return
    }

    const question = this.questions[this.currentQuestion]

    this.updateProgress()

    document.getElementById("question-number").textContent = this.currentQuestion + 1
    document.getElementById("question-text").textContent = question.question

    this.createOptions(question.options)

    const submitBtn = document.getElementById("quiz-submit")
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "🎯 Responder"
    }

    this.selectedAnswer = null
  }

  createOptions(options) {
    const container = document.getElementById("options-container")
    if (!container) return

    container.innerHTML = ""

    options.forEach((option, index) => {
      const button = document.createElement("button")
      button.className =
        "quiz-option bg-white/10 hover:bg-white/20 p-3 rounded-xl text-left transition-all hover:scale-105 border-2 border-transparent"
      button.textContent = `${String.fromCharCode(65 + index)}) ${option}`
      button.dataset.index = index

      button.addEventListener("click", () => this.selectOption(index, button))

      container.appendChild(button)
    })
  }

  selectOption(index, buttonElement) {
    const allOptions = document.querySelectorAll(".quiz-option")
    allOptions.forEach((option) => {
      option.classList.remove("border-white", "bg-white/30")
    })

    buttonElement.classList.add("border-white", "bg-white/30")

    this.selectedAnswer = index

    const submitBtn = document.getElementById("quiz-submit")
    if (submitBtn) {
      submitBtn.disabled = false
    }
  }

  handleSubmit() {
    if (this.selectedAnswer === null) return

    const question = this.questions[this.currentQuestion]
    const isCorrect = this.selectedAnswer === question.correct

    this.userAnswers.push({
      question: question.question,
      userAnswer: this.selectedAnswer,
      correctAnswer: question.correct,
      isCorrect: isCorrect,
    })

    if (isCorrect) {
      this.score++
    }

    this.showFeedback(isCorrect, question)

    setTimeout(() => {
      this.currentQuestion++
      this.loadQuestion()
    }, 3000)
  }

  showFeedback(isCorrect, question) {
    const allOptions = document.querySelectorAll(".quiz-option")

    allOptions.forEach((option, index) => {
      if (index === question.correct) {
        option.classList.add("border-green-400", "bg-green-500/30")
      } else if (index === this.selectedAnswer && !isCorrect) {
        option.classList.add("border-red-400", "bg-red-500/30")
      }
      option.disabled = true
    })

    const submitBtn = document.getElementById("quiz-submit")
    if (submitBtn) {
      submitBtn.innerHTML = isCorrect
        ? '<i class="fas fa-check mr-2"></i>Correto!'
        : '<i class="fas fa-times mr-2"></i>Incorreto!'
      submitBtn.disabled = true
    }
  }

  showHint() {
    const question = this.questions[this.currentQuestion]
    const hintBtn = document.getElementById("quiz-hint")

    if (!hintBtn) return

    const hintDiv = document.createElement("div")
    hintDiv.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    hintDiv.innerHTML = `
      <div class="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl max-w-md mx-4 text-white">
        <div class="flex items-center mb-4">
          <i class="fas fa-lightbulb text-2xl mr-3"></i>
          <h4 class="text-xl font-bold">Dica</h4>
        </div>
        <p class="text-yellow-100 mb-4">${question.hint}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg font-bold transition-all">
          Entendi!
        </button>
      </div>
    `

    document.body.appendChild(hintDiv)

    setTimeout(() => {
      if (hintDiv.parentElement) {
        hintDiv.remove()
      }
    }, 10000)
  }

  updateProgress() {
    const progressText = document.getElementById("quiz-progress")
    const progressBar = document.getElementById("progress-bar")

    if (progressText) {
      progressText.textContent = `${this.currentQuestion + 1}/${this.questions.length}`
    }

    if (progressBar) {
      const percentage = ((this.currentQuestion + 1) / this.questions.length) * 100
      progressBar.style.width = `${percentage}%`
    }
  }

  showResults() {
    this.quizCompleted = true

    document.getElementById("question-container").classList.add("hidden")
    document.getElementById("quiz-controls").classList.add("hidden")

    document.getElementById("result-container").classList.remove("hidden")
    document.getElementById("restart-container").classList.remove("hidden")

    const percentage = (this.score / this.questions.length) * 100
    const correctCount = this.score
    const incorrectCount = this.questions.length - this.score

    this.updateResultContent(percentage, correctCount, incorrectCount)

    this.awardPoints(percentage)

    console.log(`🎯 Quiz concluído: ${this.score}/${this.questions.length} (${percentage.toFixed(1)}%)`)
  }

  updateResultContent(percentage, correctCount, incorrectCount) {
    const resultEmoji = document.getElementById("result-emoji")
    const resultTitle = document.getElementById("result-title")
    const resultMessage = document.getElementById("result-message")
    const finalScore = document.getElementById("final-score")
    const correctCountEl = document.getElementById("correct-count")
    const incorrectCountEl = document.getElementById("incorrect-count")

    let emoji, title, message
    if (percentage >= 90) {
      title = "Excelente!"
      message = "Você é um expert em prevenção de enchentes!"
    } else if (percentage >= 70) {
      title = "Muito Bom!"
      message = "Você tem bom conhecimento sobre prevenção!"
    } else if (percentage >= 50) {
      title = "Bom Trabalho!"
      message = "Continue estudando para melhorar ainda mais!"
    } else {
      title = "Continue Aprendendo!"
      message = "Que tal revisar o conteúdo e tentar novamente?"
    }

    if (resultEmoji) resultEmoji.textContent = emoji
    if (resultTitle) resultTitle.textContent = title
    if (resultMessage) resultMessage.textContent = message
    if (finalScore) finalScore.textContent = `${this.score}/${this.questions.length}`
    if (correctCountEl) correctCountEl.textContent = correctCount
    if (incorrectCountEl) incorrectCountEl.textContent = incorrectCount
  }

  awardPoints(percentage) {
    let points = 0
    if (percentage >= 90) points = 150
    else if (percentage >= 70) points = 100
    else if (percentage >= 50) points = 50
    else points = 25

    if (typeof updateUserPoints === "function") {
      updateUserPoints(points)
    }

    const quizPoints = document.getElementById("quiz-points")
    if (quizPoints) {
      quizPoints.textContent = `+${points} pts`
    }

    console.log(`⭐ Pontos ganhos no quiz: ${points}`)
  }

  restartQuiz() {
    this.currentQuestion = 0
    this.score = 0
    this.selectedAnswer = null
    this.quizCompleted = false
    this.userAnswers = []

    document.getElementById("question-container").classList.remove("hidden")
    document.getElementById("quiz-controls").classList.remove("hidden")

    document.getElementById("result-container").classList.add("hidden")
    document.getElementById("restart-container").classList.add("hidden")

    const quizPoints = document.getElementById("quiz-points")
    if (quizPoints) {
      quizPoints.textContent = "+100 pts"
    }

    this.loadQuestion()

    console.log("🔄 Quiz reiniciado")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    new QuizSystem()
  }, 1000)
})
