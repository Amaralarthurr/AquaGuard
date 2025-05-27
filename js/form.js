// Sistema de Formulário com Validação e Upload de Fotos
let uploadedPhoto = null
let userPoints = Number.parseInt(document.getElementById("user-points")?.textContent) || 2450

// Configuração do upload de fotos
const photoConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
}

// Inicialização do formulário
document.addEventListener("DOMContentLoaded", () => {
  setupFormValidation()
  setupPhotoUpload()
  setupFormSubmission()
  console.log("📝 Sistema de formulário inicializado")
})

// Configurar validação em tempo real
function setupFormValidation() {
  const form = document.getElementById("community-form")
  if (!form) return

  const requiredFields = [
    { id: "location", name: "location", label: "Localização" },
    { id: "age", name: "age", label: "Faixa Etária" },
    { id: "reportType", name: "reportType", label: "Tipo de Relato" },
    { id: "description", name: "description", label: "Descrição" },
  ]

  // Adicionar IDs aos campos se não existirem
  requiredFields.forEach((field) => {
    const element = form.querySelector(`[name="${field.name}"]`)
    if (element && !element.id) {
      element.id = field.id
    }
  })

  // Configurar validação em tempo real para cada campo
  requiredFields.forEach((field) => {
    const element = document.getElementById(field.id)
    if (element) {
      // Validação ao sair do campo
      element.addEventListener("blur", () => validateField(field.id, field.label))

      // Validação ao digitar (para inputs de texto)
      if (element.type === "text" || element.tagName === "TEXTAREA") {
        element.addEventListener("input", () => {
          clearFieldError(field.id)
          if (element.value.trim()) {
            showFieldSuccess(field.id)
          }
        })
      }

      // Validação ao selecionar (para selects)
      if (element.tagName === "SELECT") {
        element.addEventListener("change", () => validateField(field.id, field.label))
      }
    }
  })

  console.log("✅ Validação em tempo real configurada")
}

// Validar campo individual
function validateField(fieldId, fieldLabel) {
  const field = document.getElementById(fieldId)
  if (!field) return false

  const value = field.value.trim()

  if (!value) {
    showFieldError(fieldId, `${fieldLabel} é obrigatório`)
    return false
  }

  // Validações específicas
  if (fieldId === "location" && value.length < 3) {
    showFieldError(fieldId, "Localização deve ter pelo menos 3 caracteres")
    return false
  }

  if (fieldId === "description" && value.length < 10) {
    showFieldError(fieldId, "Descrição deve ter pelo menos 10 caracteres")
    return false
  }

  showFieldSuccess(fieldId)
  return true
}

// Mostrar erro no campo
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId)
  if (!field) return

  // Remover estados anteriores
  clearFieldError(fieldId)

  // Adicionar classe de erro
  field.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-500/20")
  field.classList.remove("border-green-500", "focus:border-green-500", "focus:ring-green-500/20")

  // Criar mensagem de erro
  const errorDiv = document.createElement("div")
  errorDiv.className = "text-red-600 text-sm mt-1 flex items-center"
  errorDiv.id = `error-${fieldId}`
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`

  // Inserir após o campo
  field.parentNode.insertBefore(errorDiv, field.nextSibling)
}

// Mostrar sucesso no campo
function showFieldSuccess(fieldId) {
  const field = document.getElementById(fieldId)
  if (!field) return

  // Remover estados anteriores
  clearFieldError(fieldId)

  // Adicionar classe de sucesso
  field.classList.add("border-green-500", "focus:border-green-500", "focus:ring-green-500/20")
  field.classList.remove("border-red-500", "focus:border-red-500", "focus:ring-red-500/20")
}

// Limpar erro do campo
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId)
  const errorDiv = document.getElementById(`error-${fieldId}`)

  if (field) {
    field.classList.remove(
      "border-red-500",
      "focus:border-red-500",
      "focus:ring-red-500/20",
      "border-green-500",
      "focus:border-green-500",
      "focus:ring-green-500/20",
    )
  }

  if (errorDiv) {
    errorDiv.remove()
  }
}

// Configurar upload de fotos
function setupPhotoUpload() {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  // Criar input file oculto
  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.accept = photoConfig.allowedExtensions.join(",")
  fileInput.style.display = "none"
  fileInput.id = "photo-input"

  uploadArea.appendChild(fileInput)

  // Click na área de upload
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("border-vibrant-orange", "bg-vibrant-orange/10")
  })

  uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("border-vibrant-orange", "bg-vibrant-orange/10")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("border-vibrant-orange", "bg-vibrant-orange/10")

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handlePhotoUpload(files[0])
    }
  })

  // Mudança no input file
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handlePhotoUpload(e.target.files[0])
    }
  })

  console.log("✅ Sistema de upload de fotos configurado")
}

// Processar upload de foto
function handlePhotoUpload(file) {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  // Validar tipo de arquivo
  if (!photoConfig.allowedTypes.includes(file.type)) {
    showUploadError("Tipo de arquivo não suportado. Use JPG, PNG ou WebP.")
    return
  }

  // Validar tamanho
  if (file.size > photoConfig.maxSize) {
    showUploadError("Arquivo muito grande. Máximo 5MB.")
    return
  }

  // Mostrar loading
  showUploadLoading()

  // Simular upload (em produção, seria uma requisição real)
  setTimeout(() => {
    uploadedPhoto = file
    showUploadSuccess(file)
    console.log("📸 Foto carregada:", file.name)
  }, 1500)
}

// Mostrar loading do upload
function showUploadLoading() {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  uploadArea.innerHTML = `
        <div class="text-center">
            <div class="animate-spin text-vibrant-orange text-5xl mb-4">
                <i class="fas fa-spinner"></i>
            </div>
            <p class="text-gray-600 text-lg font-medium">Carregando foto...</p>
            <p class="text-gray-500">Aguarde um momento</p>
        </div>
    `
}

// Mostrar sucesso do upload
function showUploadSuccess(file) {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  // Criar preview da imagem
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadArea.innerHTML = `
            <div class="text-center">
                <div class="relative inline-block mb-4">
                    <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-2xl border-4 border-green-500">
                    <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <i class="fas fa-check text-sm"></i>
                    </div>
                </div>
                <p class="text-green-600 text-lg font-medium">✅ Foto carregada!</p>
                <p class="text-gray-600 text-sm">${file.name}</p>
                <p class="text-gray-500 text-xs">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button type="button" onclick="removePhoto()" class="mt-3 text-red-600 hover:text-red-800 text-sm font-medium">
                    <i class="fas fa-trash mr-1"></i>Remover foto
                </button>
            </div>
        `
    uploadArea.classList.remove("border-vibrant-orange/50")
    uploadArea.classList.add("border-green-500")
  }
  reader.readAsDataURL(file)
}

// Mostrar erro do upload
function showUploadError(message) {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  uploadArea.innerHTML = `
        <div class="text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
            <p class="text-red-600 text-lg font-medium">Erro no upload</p>
            <p class="text-gray-600">${message}</p>
            <button type="button" onclick="resetPhotoUpload()" class="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all">
                Tentar novamente
            </button>
        </div>
    `
}

// Remover foto
function removePhoto() {
  uploadedPhoto = null
  resetPhotoUpload()
  console.log("🗑️ Foto removida")
}

// Resetar área de upload
function resetPhotoUpload() {
  const uploadArea = document.querySelector(".border-dashed")
  if (!uploadArea) return

  uploadArea.classList.remove("border-green-500", "border-vibrant-orange")
  uploadArea.classList.add("border-vibrant-orange/50")

  uploadArea.innerHTML = `
        <i class="fas fa-camera text-vibrant-orange text-5xl mb-4 animate-bounce-slow"></i>
        <p class="text-gray-600 text-lg font-medium">Clique para adicionar uma foto</p>
        <p class="text-gray-500">Máximo 5MB - JPG, PNG, WebP</p>
        <p class="text-gray-400 text-sm mt-2">Ou arraste e solte aqui</p>
    `

  // Recriar input file
  const oldInput = document.getElementById("photo-input")
  if (oldInput) {
    oldInput.remove()
  }

  const fileInput = document.createElement("input")
  fileInput.type = "file"
  fileInput.accept = photoConfig.allowedExtensions.join(",")
  fileInput.style.display = "none"
  fileInput.id = "photo-input"

  uploadArea.appendChild(fileInput)

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handlePhotoUpload(e.target.files[0])
    }
  })
}

// Configurar envio do formulário
function setupFormSubmission() {
  const form = document.getElementById("community-form")
  const submitButton = form?.querySelector('button[type="submit"]')

  if (!form || !submitButton) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validar consentimento LGPD
    const lgpdConsent = document.getElementById("lgpd-consent")
    if (!lgpdConsent?.checked) {
      showFormError("É necessário aceitar os termos da LGPD para continuar.")
      lgpdConsent?.focus()
      return
    }

    // Validar todos os campos obrigatórios
    const requiredFields = [
      { id: "location", label: "Localização" },
      { id: "age", label: "Faixa Etária" },
      { id: "reportType", label: "Tipo de Relato" },
      { id: "description", label: "Descrição" },
    ]

    let isValid = true
    requiredFields.forEach((field) => {
      if (!validateField(field.id, field.label)) {
        isValid = false
      }
    })

    if (!isValid) {
      showFormError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    // Enviar formulário
    submitForm(form, submitButton)
  })

  console.log("✅ Envio do formulário configurado")
}

// Enviar formulário
function submitForm(form, submitButton) {
  // Mostrar loading
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner animate-spin mr-3"></i>Enviando...'
  submitButton.disabled = true

  // Simular envio (em produção seria uma requisição real)
  setTimeout(() => {
    // Coletar dados do formulário
    const formData = new FormData(form)
    const data = {
      location: formData.get("location"),
      age: formData.get("age"),
      reportType: formData.get("reportType"),
      description: formData.get("description"),
      hasPhoto: uploadedPhoto !== null,
      photo: uploadedPhoto,
      timestamp: new Date().toISOString(),
    }

    console.log("📤 Dados enviados:", data)

    // Simular sucesso
    showFormSuccess()

    // Atualizar pontos do usuário
    updateUserPoints(50)

    // Resetar formulário
    setTimeout(() => {
      resetForm(form, submitButton, originalText)
    }, 3000)
  }, 2000)
}

// Mostrar sucesso do formulário
function showFormSuccess() {
  const form = document.getElementById("community-form")
  if (!form) return

  // Criar overlay de sucesso
  const successOverlay = document.createElement("div")
  successOverlay.className =
    "absolute inset-0 bg-green-500/95 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10"
  successOverlay.innerHTML = `
        <div class="text-center text-white">
            <div class="text-6xl mb-4">🎉</div>
            <h3 class="text-2xl font-bold mb-2">Relato Enviado!</h3>
            <p class="text-green-100 mb-4">Obrigado por contribuir com a comunidade!</p>
            <div class="bg-white/20 px-4 py-2 rounded-full inline-block">
                <i class="fas fa-star mr-2"></i>+50 pontos AquaGuard
            </div>
        </div>
    `

  form.parentElement.style.position = "relative"
  form.parentElement.appendChild(successOverlay)

  // Remover overlay após 3 segundos
  setTimeout(() => {
    successOverlay.remove()
  }, 3000)
}

// Mostrar erro do formulário
function showFormError(message) {
  // Remover erro anterior se existir
  const existingError = document.getElementById("form-error")
  if (existingError) {
    existingError.remove()
  }

  const form = document.getElementById("community-form")
  if (!form) return

  const errorDiv = document.createElement("div")
  errorDiv.id = "form-error"
  errorDiv.className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center"
  errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle mr-3"></i>
        <span>${message}</span>
    `

  form.insertBefore(errorDiv, form.firstChild)

  // Remover erro após 5 segundos
  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

// Atualizar pontos do usuário
function updateUserPoints(points) {
  userPoints += points

  // Atualizar na interface
  const pointsElements = document.querySelectorAll("#user-points, #profile-points")
  pointsElements.forEach((element) => {
    if (element) {
      element.textContent = userPoints.toLocaleString()
    }
  })

  console.log(`⭐ Pontos atualizados: +${points} (Total: ${userPoints})`)
}

// Resetar formulário
function resetForm(form, submitButton, originalText) {
  form.reset()
  submitButton.innerHTML = originalText
  submitButton.disabled = false

  // Limpar erros
  const errorDivs = form.querySelectorAll('[id^="error-"]')
  errorDivs.forEach((div) => div.remove())

  // Resetar classes dos campos
  const fields = form.querySelectorAll("input, select, textarea")
  fields.forEach((field) => {
    field.classList.remove(
      "border-red-500",
      "focus:border-red-500",
      "focus:ring-red-500/20",
      "border-green-500",
      "focus:border-green-500",
      "focus:ring-green-500/20",
    )
  })

  // Resetar upload de foto
  uploadedPhoto = null
  resetPhotoUpload()

  // Desmarcar LGPD
  const lgpdConsent = document.getElementById("lgpd-consent")
  if (lgpdConsent) {
    lgpdConsent.checked = false
  }

  console.log("🔄 Formulário resetado")
}

// Expor funções globais
window.removePhoto = removePhoto
window.resetPhotoUpload = resetPhotoUpload

console.log("📝 Sistema de formulário carregado!")
