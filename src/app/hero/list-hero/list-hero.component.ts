import { Component, OnInit } from '@angular/core';
import { HeroId } from '../../data/hero';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './list-hero.component.html',
  styleUrls: ['./list-hero.component.css'],
})
export class ListHeroComponent implements OnInit {
  heroes: HeroId[] | undefined;
  filterStates: { [key: string]: boolean } = {
    attack: false,
    damage: false,
    dodge: false,
    health: false,
  };
  showSuccessModal = false;
  successModalMessage = '';

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
    // Vérification du cookie pour la suppression d'un héro
    const cookieName = 'HeroDeleted';
    let cookies = document.cookie.trim().split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookieParts = cookies[i].trim().split('=');
      if (cookieParts[0] === cookieName && cookieParts[1] === 'true') {
        // Afficher la fenêtre modale de succès
        this.showSuccessModal = true;
        this.successModalMessage = 'Héro supprimé';
        // Effacement de la fenêtre modale après 1.7 secondes
        setTimeout(() => {
          this.showSuccessModal = false;
        }, 1700);
        // Effacement du cookie
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 1);
        document.cookie = `${cookieName}=;expires=${expirationDate.toUTCString()};path=/`;
        break;
      }
    }
  }

  // Récupération de la liste des héros depuis le service Hero
  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      // Affectation de la liste des héros à la variable heroes
      this.heroes = heroes;
    });
  }

  // Modification de l'état du filtre
  toggleFilter(filter: string): void {
    // Inversion de la valeur booléenne de l'état du filtre
    this.filterStates[filter] = !this.filterStates[filter];
    // Mise à jour des héros affichés en fonction des filtres activés
    this.applyFilters();
  }

  // Application des filtres
  applyFilters(): void {
    // Récupération de la liste des filtres activés
    let activeFilters = Object.entries(this.filterStates)
      .filter(([key, value]) => value)
      .map(([key, value]) => key);

    // Si aucun filtre n'est activé, récupération de la liste des héros
    if (activeFilters.length === 0) {
      this.getHeroes();
      return;
    }

    this.heroService.getHeroes().subscribe((heroes) => {
      // Tri des héros en fonction des filtres activés
      this.heroes = heroes.sort((a, b) => {
        let result = 0;
        activeFilters.forEach((filter) => {
          result +=
            (b[filter as keyof HeroId] as number) -
            (a[filter as keyof HeroId] as number);
        });
        return result;
      });
    });
  }
  
  // Comparaison de deux héros
  compareHeroes(a: HeroId, b: HeroId): number {
    let result = 0;
    // Boucle sur les filtres activés
    for (const filter in this.filterStates) {
      // Si un filtre est activé ...
      if (this.filterStates[filter]) {
        // ... ajout de la différence entre les valeurs associées à la clé pour les deux héros
        result +=
          this.getHeroValueByKey(b, filter) - this.getHeroValueByKey(a, filter);
      }
    }
    return result;
  }

  // Récupération de la valeur d'un héro pour une clé donnée
  getHeroValueByKey(hero: HeroId, key: string): number {
    // Vérification que la clé est une des clés valides (attack, damage, dodge, health)
    if (key === 'attack' || key === 'damage' || key === 'dodge' || key === 'health') {
      // Retour de la valeur pour la clé donnée
      return hero[key as keyof HeroId] as number;
    }
    // Retour de 0 si la clé n'est pas valide
    return 0;
  }

  // Fonction qui permet de créer un héro
  createHero(): void {
    // Appel à la fonction createHero() du service Hero
    this.heroService.createHero();
    // Récupération des détails du nouveau héro
    this.heroService.getNewestHero().subscribe((hero) => {
      this.heroService.getHero(hero.id);
      // Affichage d'un message de succès lors de la création du héro
      this.showSuccessModal = true;
      this.successModalMessage = 'Héro créé';
      // Fermeture du message de succès après 1.7 secondes
      setTimeout(() => {
        this.showSuccessModal = false;
      }, 1700);
    });
  }
}
