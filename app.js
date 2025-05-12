document.addEventListener("DOMContentLoaded", () => {
  // Gestion des onglets
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Désactiver tous les onglets
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Activer l'onglet cliqué
      this.classList.add("active")
      const tabId = this.getAttribute("data-tab") + "-tab"
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Gestion des détails des lignes
  const detailsToggles = document.querySelectorAll(".details-toggle")

  detailsToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      this.classList.toggle("active")
      const content = this.nextElementSibling

      if (this.classList.contains("active")) {
        content.style.display = "flex"
        this.textContent = "Masquer détails"
      } else {
        content.style.display = "none"
        this.textContent = "Voir détails"
      }
    })
  })

  // Vérification de l'état de la connexion
  function updateOnlineStatus() {
    const offlineMessage = document.getElementById("offline-message")

    if (navigator.onLine) {
      offlineMessage.style.display = "none"
    } else {
      offlineMessage.style.display = "block"
    }
  }

  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)
  updateOnlineStatus()

  // Affichage du message d'installation sur iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches

  if (isIOS && !isInStandaloneMode) {
    document.getElementById("install-prompt").style.display = "flex"
  }
})
