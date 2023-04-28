import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mobileMenuOpen = false;

  constructor(private elementRef: ElementRef) {}

  // Fonction permettant d'ouvrir ou de fermer le menu mobile
  toggleMobileMenu() {
    // Inverse l'état de l'ouverture du menu mobile
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // Récupère l'élément HTML de la page
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      // Si le menu mobile est ouvert
      if (this.mobileMenuOpen) {
        // Ajoute la classe "mobile-menu-open" à l'élément HTML
        htmlElement.classList.add('mobile-menu-open');

        // Récupère l'élément de l'application
        const appElement = document.querySelector('.app') as HTMLElement;
        if (appElement) {
          // Définit la marge supérieure de l'élément de l'application à 160px
          appElement.style.marginTop = '160px';
        }

        // Ajoute un écouteur d'événements sur le document pour gérer les clics en dehors du menu mobile
        this.elementRef.nativeElement.ownerDocument.addEventListener('click', this.onDocumentClick.bind(this));
      } else {
        // Supprime la classe "mobile-menu-open" de l'élément HTML
        htmlElement.classList.remove('mobile-menu-open');

        // Récupère l'élément de l'application
        const appElement = document.querySelector('.app') as HTMLElement;
        if (appElement) {
          // Supprime la marge supérieure de l'élément de l'application
          appElement.style.marginTop = '';
        }

        // Supprime l'écouteur d'événements sur le document pour les clics en dehors du menu mobile
        this.elementRef.nativeElement.ownerDocument.removeEventListener('click', this.onDocumentClick.bind(this));
      }
    }
  }

  // Cette fonction est appelée lorsque le document est cliqué.
  // Elle est utilisée pour fermer le menu mobile lorsque l'utilisateur clique en dehors du menu.
  onDocumentClick(event: MouseEvent) {
    // Récupère la classe de l'élément cliqué
    const targetClass = (event.target as HTMLElement).className;

    // Si la classe n'est ni "bar" ni "hamburger-menu", cela signifie que l'utilisateur a cliqué en dehors du menu.
    if (targetClass !== "bar" && targetClass !== "hamburger-menu") {
      // Ferme le menu mobile en définissant la variable mobileMenuOpen sur false.
      this.mobileMenuOpen = false;

      // Récupère l'élément HTML.
      const htmlElement = document.querySelector('html');

      // Si l'élément HTML existe, enlève la classe "mobile-menu-open" et réinitialise le marging-top de .app
      if (htmlElement) {
        htmlElement.classList.remove('mobile-menu-open');
        const appElement = document.querySelector('.app') as HTMLElement;
        if (appElement) {
          appElement.style.marginTop = '';
        }

        // Enlève l'écouteur d'événement "click" pour éviter des fuites de mémoire.
        this.elementRef.nativeElement.ownerDocument.removeEventListener('click', this.onDocumentClick.bind(this));
      }
    }
  }
}
