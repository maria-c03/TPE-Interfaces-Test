// Game State
const gameState = {
  currentLevel: 1,
  maxLevel: 3,
  selectedPieces: 4,
  currentImage: null,
  pieces: [],
  timerInterval: null,
  startTime: null,
  elapsedTime: 0,
  isPaused: false,
  helpUsed: false,
  totalTime: 0,
  images: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=800&fit=crop",
  ],
}

// Canvas setup
const canvas = document.getElementById("game-canvas")
const ctx = canvas ? canvas.getContext("2d") : null

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.getElementById(pageId).classList.add("active")
}

function showLanding() {
  showPage("landing-page")
  stopTimer()
  resetGame()
}

function showInstructions() {
  showPage("instructions-page")
}

function showConfiguration() {
  showPage("configuration-page")
}

// Configuration
function selectPieces(numPieces) {
  gameState.selectedPieces = numPieces
  document.querySelectorAll(".config-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.closest(".config-btn").classList.add("active")
}

// Start Game
function startGame() {
  gameState.currentLevel = 1
  gameState.totalTime = 0
  showImageSelection()
}

function showImageSelection() {
  showPage("image-selection-page")

  const container = document.getElementById("thumbnails-container")
  container.innerHTML = ""

  // Create thumbnails
  gameState.images.forEach((imgSrc, index) => {
    const img = document.createElement("img")
    img.src = imgSrc
    img.className = "thumbnail"
    img.style.animationDelay = `${index * 0.1}s`
    container.appendChild(img)
  })

  // Select random image after animation
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * gameState.images.length)
    gameState.currentImage = gameState.images[randomIndex]

    const thumbnails = container.querySelectorAll(".thumbnail")
    thumbnails[randomIndex].classList.add("selected")

    setTimeout(() => {
      initLevel()
    }, 1500)
  }, 1000)
}

// Initialize Level
function initLevel() {
  showPage("game-page")

  document.getElementById("level-display").textContent = gameState.currentLevel
  document.getElementById("pieces-display").textContent = gameState.selectedPieces
  document.getElementById("current-level-display").textContent = gameState.currentLevel

  gameState.helpUsed = false
  document.getElementById("help-btn").disabled = false

  loadImage(gameState.currentImage)
}

// Load and setup image
function loadImage(imageSrc) {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    setupGame(img)
    startTimer()
  }
  img.src = imageSrc
}

function setupGame(img) {
  // Setup canvas
  const size = 600
  canvas.width = size
  canvas.height = size

  // Calculate grid
  const cols = gameState.selectedPieces === 4 ? 2 : gameState.selectedPieces === 6 ? 3 : 4
  const rows = gameState.selectedPieces === 4 ? 2 : gameState.selectedPieces === 6 ? 2 : 2
  const pieceWidth = size / cols
  const pieceHeight = size / rows

  // Create pieces
  gameState.pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = {
        x: col * pieceWidth,
        y: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
        sourceX: col * (img.width / cols),
        sourceY: row * (img.height / rows),
        sourceWidth: img.width / cols,
        sourceHeight: img.height / rows,
        rotation: Math.floor(Math.random() * 4) * 90, // 0, 90, 180, 270
        correctRotation: 0,
        isFixed: false,
      }
      gameState.pieces.push(piece)
    }
  }

  drawGame(img)
}

function drawGame(img) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  gameState.pieces.forEach((piece) => {
    ctx.save()

    // Move to piece center
    ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2)
    ctx.rotate((piece.rotation * Math.PI) / 180)

    // Apply level filter
    applyLevelFilter()

    // Draw piece
    ctx.drawImage(
      img,
      piece.sourceX,
      piece.sourceY,
      piece.sourceWidth,
      piece.sourceHeight,
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height,
    )

    ctx.restore()

    // Draw border
    ctx.strokeStyle = piece.isFixed ? "#10b981" : "#667eea"
    ctx.lineWidth = piece.isFixed ? 4 : 2
    ctx.strokeRect(piece.x, piece.y, piece.width, piece.height)
  })

  // Check if completed
  if (checkCompletion()) {
    setTimeout(() => {
      completeLevel(img)
    }, 500)
  }
}

function applyLevelFilter() {
  if (gameState.currentLevel === 1) {
    // Grayscale
    ctx.filter = "grayscale(100%)"
  } else if (gameState.currentLevel === 2) {
    // Brightness 30%
    ctx.filter = "brightness(0.3)"
  } else if (gameState.currentLevel === 3) {
    // Negative
    ctx.filter = "invert(100%)"
  }
}

// Canvas click handler
if (canvas) {
  canvas.addEventListener("click", (e) => {
    if (gameState.isPaused) return
    handlePieceClick(e, false)
  })

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (gameState.isPaused) return
    handlePieceClick(e, true)
  })
}

function handlePieceClick(e, isRightClick) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // Find clicked piece
  const clickedPiece = gameState.pieces.find(
    (piece) =>
      x >= piece.x && x <= piece.x + piece.width && y >= piece.y && y <= piece.y + piece.height && !piece.isFixed,
  )

  if (clickedPiece) {
    // Rotate piece
    if (isRightClick) {
      clickedPiece.rotation = (clickedPiece.rotation + 90) % 360
    } else {
      clickedPiece.rotation = (clickedPiece.rotation - 90 + 360) % 360
    }

    // Redraw
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      drawGame(img)
    }
    img.src = gameState.currentImage
  }
}

// Check if puzzle is completed
function checkCompletion() {
  return gameState.pieces.every((piece) => piece.rotation === piece.correctRotation)
}

// Complete level
function completeLevel(img) {
  stopTimer()

  // Remove filters and redraw
  ctx.filter = "none"
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  gameState.pieces.forEach((piece) => {
    ctx.save()
    ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2)
    ctx.rotate((piece.rotation * Math.PI) / 180)
    ctx.drawImage(
      img,
      piece.sourceX,
      piece.sourceY,
      piece.sourceWidth,
      piece.sourceHeight,
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height,
    )
    ctx.restore()
  })

  // Show victory modal
  document.getElementById("final-time").textContent = formatTime(gameState.elapsedTime)
  document.getElementById("completed-level").textContent = gameState.currentLevel

  gameState.totalTime += gameState.elapsedTime

  if (gameState.currentLevel >= gameState.maxLevel) {
    document.getElementById("total-time").textContent = formatTime(gameState.totalTime)
    document.getElementById("complete-modal").classList.add("active")
  } else {
    document.getElementById("victory-modal").classList.add("active")
  }
}

// Timer functions
function startTimer() {
  gameState.startTime = Date.now() - gameState.elapsedTime * 1000
  gameState.timerInterval = setInterval(updateTimer, 100)
}

function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval)
    gameState.timerInterval = null
  }
}

function updateTimer() {
  if (!gameState.isPaused) {
    gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000)
    document.getElementById("timer-display").textContent = formatTime(gameState.elapsedTime)
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Help function
function useHelp() {
  if (gameState.helpUsed) return

  // Find first incorrect piece
  const incorrectPiece = gameState.pieces.find((piece) => piece.rotation !== piece.correctRotation && !piece.isFixed)

  if (incorrectPiece) {
    incorrectPiece.rotation = incorrectPiece.correctRotation
    incorrectPiece.isFixed = true
    gameState.helpUsed = true

    // Add 5 seconds penalty
    gameState.startTime -= 5000

    // Disable help button
    document.getElementById("help-btn").disabled = true

    // Redraw
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      drawGame(img)
    }
    img.src = gameState.currentImage
  }
}

// Pause/Resume
function pauseGame() {
  gameState.isPaused = true
  stopTimer()
  document.getElementById("pause-modal").classList.add("active")
}

function resumeGame() {
  gameState.isPaused = false
  document.getElementById("pause-modal").classList.remove("active")
  startTimer()
}

// Next level
function nextLevel() {
  document.getElementById("victory-modal").classList.remove("active")
  gameState.currentLevel++
  gameState.elapsedTime = 0

  // Select new random image
  const randomIndex = Math.floor(Math.random() * gameState.images.length)
  gameState.currentImage = gameState.images[randomIndex]

  initLevel()
}

// Restart game
function restartGame() {
  document.getElementById("complete-modal").classList.remove("active")
  startGame()
}

// Reset game
function resetGame() {
  gameState.currentLevel = 1
  gameState.elapsedTime = 0
  gameState.totalTime = 0
  gameState.isPaused = false
  gameState.helpUsed = false
  stopTimer()
}

// Close modals when clicking outside
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active")
      if (modal.id === "pause-modal") {
        resumeGame()
      }
    }
  })
})
