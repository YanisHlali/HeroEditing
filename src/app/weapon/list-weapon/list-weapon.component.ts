import { Component } from '@angular/core';
import { Weapon, WeaponId } from '../../data/weapon';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-root',
  templateUrl: './list-weapon.component.html',
  styleUrls: ['./list-weapon.component.css'],
})
export class ListWeaponComponent {
  weapons: WeaponId[] | undefined;
  filterStates: { [key: string]: boolean } = {
    attack: false,
    damage: false,
    dodge: false,
    health: false,
  };
  showSuccessModal: boolean = false;
  successModalMessage: string = '';

  constructor(private weaponService: WeaponService) {}

  ngOnInit(): void {
    this.getWeapons();
    const cookieName = 'WeaponDeleted';
    let cookies = document.cookie.trim().split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookieParts = cookies[i].trim().split('=');
      // Vérification de la présence d'un cookie "WeaponDeleted" avec la valeur "true"
      if (cookieParts[0] === cookieName && cookieParts[1] === 'true') {
        this.showSuccessModal = true;
        this.successModalMessage = 'Arme supprimée';
        // Fermeture du message de succès après 1700 ms
        setTimeout(() => {
          this.showSuccessModal = false;
        }, 1700);
        // Suppression du cookie
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 1);
        document.cookie = `${cookieName}=;expires=${expirationDate.toUTCString()};path=/`;
        break;
      }
    }
  }

  // Récupération de toutes les armes
  getWeapons(): void {
    this.weaponService.getAllWeaponsId().subscribe((weapons) => {
      // Stockage de la liste de toutes les armes dans la propriété "weapons"
      this.weapons = weapons;
    });
  }


  // Active ou désactive un filtre de tri
  toggleFilter(filter: string): void {
    // Inverse l'état actuel du filtre
    this.filterStates[filter] = !this.filterStates[filter];
    // Applique les filtres
    this.applyFilters();
  }

  // Fonction qui applique les filtres sélectionnés
  applyFilters(): void {
    // Récupération des filtres actifs
    let activeFilters = Object.entries(this.filterStates)
      .filter(([key, value]) => value) // Garder uniquement les filtres où la valeur est vraie
      .map(([key, value]) => key); // Garder uniquement les noms des filtres

    // Si aucun filtre n'est actif, on récupère toutes les armes
    if (activeFilters.length === 0) {
      this.getWeapons();
      return;
    }

    // Sinon, on récupère toutes les armes et on les trie en fonction des filtres actifs
    this.weaponService.getAllWeaponsId().subscribe((weapons) => {
      this.weapons = weapons.sort((a, b) => {
        let result = 0;
        // Pour chaque filtre actif, on calcule la différence entre les valeurs des armes
        activeFilters.forEach((filter) => {
          result +=
            (b[filter as keyof WeaponId] as number) -
            (a[filter as keyof WeaponId] as number);
        });
        return result;
      });
    });
  }

  // Création d'une arme
  createWeapon(): void {
    this.weaponService.createWeapon();
    // Après avoir créé l'arme, la méthode getNewestWeapon() est appelée pour obtenir la dernière arme créée.
    this.weaponService.getNewestWeapon().subscribe((weapon) => {
      // La méthode getWeapon() est appelée avec l'ID de l'arme pour obtenir les détails de l'arme.
      this.weaponService.getWeapon(weapon.id);
      // Une fenêtre modale de réussite est affichée pour indiquer que l'arme a été créée avec succès.
      this.showSuccessModal = true;
      this.successModalMessage = 'Arme créee';
      setTimeout(() => {
        this.showSuccessModal = false;
      }, 1700);
    });
  }

}
