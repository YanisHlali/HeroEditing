import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { Hero } from '../../data/hero';
import { Weapon, WeaponId } from '../../data/weapon';
import { HeroService } from '../../services/hero.service';
import { WeaponService } from '../../services/weapon.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})

export class HeroDetailComponent implements OnInit {
  hero?: Hero;
  weapon?: Weapon;
  weaponId?: string;
  weapons?: Weapon[];
  weaponsId?: WeaponId[];
  remainingPoints: number = 0;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  successModalMessage: string = "";
  errorModalMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private weaponService: WeaponService,
  ) {}

  ngOnInit(): void {
    // Récupération de l'héro à partir de l'identifiant dans l'URL
    this.getHero();
    // Récupération de la liste de toutes les armes
    this.getAllWeapons();
  }

  // Récupération d'un héro à partir de son identifiant
  getHero(): void {
    // Récupération de l'identifiant de l'héro à partir de l'URL
    const idHero = this.route.snapshot.paramMap.get('id');
    // Si aucun identifiant n'est trouvé, retour immédiat
    if (!idHero) return;
    // Récupération de l'héro à partir de son identifiant
    this.heroService.getHero(idHero)
    .subscribe(hero => {
      this.hero = hero;
      // Récupération de l'arme de l'héro
      this.getWeapon();
      // Mise à jour des points restants pour l'amélioration de l'héro
      this.setRemainingPoints();
    });
  }

  // Récupération de l'arme associée à l'héro
  getWeapon(): void {
    const id = this.hero?.weapon;
    // Si l'identifiant de l'arme est indéfini, la fonction s'arrête
    if (!id) return;
    this.weaponService.getWeaponById(id)
      .subscribe(weapon => {
        // Mise à jour de la propriété weapon avec les informations de l'arme
        this.weapon = weapon
      });
  }

  // Récupération de la liste de toutes les armes depuis le service Weapon
  getAllWeapons(): void {
    this.weaponService.getAllWeapons()
      .subscribe(weapons => this.weapons = weapons);

    this.weaponService.getAllWeaponsId()
      .subscribe(weapons => {
        // Stockage de la liste de toutes les armes et de leurs identifiants
        this.weapons = weapons;
        this.weaponsId = weapons;
      }
    );
  }

  // Enregistrement du nom d'un héros
  saveName(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    // Si l'identifiant du héros n'est pas trouvé ou si le héros n'existe pas, retourne
    if (!this.hero || !id) return;
    // Vérification que le nom du héros contient au moins une lettre
    if (this.hero.name.length < 1) {
      this.showErrorModal = true;
      this.errorModalMessage = 'Votre nom doit contenir au moins une lettre !';
      setTimeout(() => {
        this.showErrorModal = false;
      }, 1700);
      this.getHero();
    } else {
      // Mise à jour du nom du héros
      this.heroService.updateName(id, this.hero.name);
    }
  }

  // Enregistrement du nom de l'arme
  saveWeapon(): void {
    if (!this.hero || !this.weapon) return;
    // Récupération de l'identifiant de l'arme à partir de son nom
    this.weaponService.getWeaponIdByName(this.weapon.name).subscribe(weaponId => {
      if (!weaponId) return;
      // Vérification de la présence de l'objet héro
      if (!this.hero) return;
      // Récupération de l'identifiant de l'arme
      const id = weaponId.id;
      // Récupération de l'identifiant de l'héro depuis l'URL
      const idhero = this.route.snapshot.paramMap.get('id');
      // Mise à jour de l'arme associée à l'héro
      this.heroService.updateWeapon(String(idhero), id);
      // Affichage d'un message de succès
      this.showSuccessModal = true;
      this.successModalMessage = "Votre arme a bien été sauvegardée !";
      setTimeout(() => {
        this.showSuccessModal = false;
      }
      , 1700);
    });
  }


  // Sauvegarde des statistiques de l'héro
  saveStats(): void {
    // Récupération de l'identifiant de l'héro depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    // Si l'héro ou l'identifiant n'ont pas été trouvés, retourner
    if (!this.hero || !id) return;

    // Vérification que toutes les statistiques sont supérieures à 1
    if (this.hero.attack < 1 || this.hero.damage < 1 || this.hero.dodge < 1 || this.hero.health < 1) {
      // Si une des statistiques est inférieure à 1, récupération de l'héro
      this.getHero();
      return;
    }

    // Vérification que les points restants sont suffisants pour les statistiques
    if (40 - this.hero.attack - this.hero.damage - this.hero.dodge - this.hero.health >= 0) {
      // Mise à jour des statistiques de l'héro
      this.heroService.updateAttack(id, this.hero.attack);
      this.heroService.updateDamage(id, this.hero.damage);
      this.heroService.updateDodge(id, this.hero.dodge);
      this.heroService.updateHealth(id, this.hero.health);

      // Affichage d'un message de succès et masquage après 1,7 seconde
      this.showSuccessModal = true;
      this.successModalMessage = "Vos statistiques ont bien été sauvegardées !";
      setTimeout(() => {
        this.showSuccessModal = false;
      }, 1700);
    } else {
      // Affichage d'un message d'erreur et masquage après 1,7 seconde
      this.showErrorModal = true;
      this.errorModalMessage = "Vous avez dépassé le nombre de points restants !";
      setTimeout(() => {
        this.showErrorModal = false;
      }, 1700);

      // Récupération de l'héro
      this.getHero();
    }
  }


  // Calcul du nombre de points restants
  setRemainingPoints(): void {
    // Si l'objet hero n'est pas défini, on retourne immédiatement
    if (!this.hero) return;
    // Calcul du nombre de points restants en soustrayant les statistiques de l'objet hero
    this.remainingPoints = 40 - this.hero.attack - this.hero.damage - this.hero.dodge - this.hero.health;
  }
  // Enregistrement de l'image du héro
  saveImage(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Si l'objet héro ou l'ID n'existent pas, la fonction est interrompue
    if (!this.hero || !id) return;
    // Si l'URL de l'image est vide, la fonction est interrompue
    if (this.hero.image.length < 1) {
      this.getHero();
      return;
    }
    // Si l'URL de l'image ne commence ni par "http" ni par "data:image", la fonction est interrompue
    if (!this.hero.image.startsWith("http") && !this.hero.image.startsWith("data:image")) {
      this.getHero();
      return;
    }
    // Enregistrement de l'URL de l'image pour le héro correspondant
    this.heroService.updateImage(id, this.hero.image)
  }

  // Suppression de l'arme du héro
  deleteWeapon(): void {
    // Récupération de l'identifiant du héro à partir de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    if (!this.hero) return;

    // Si l'identifiant n'a pas été trouvé ou si le héro n'a pas été récupéré, retour de la fonction
    if (!id || !this.hero) return;

    // Si le héro n'a pas d'arme, affichage d'un message d'erreur
    if (this.hero.weapon === "") {
      this.showErrorModal = true;
      this.errorModalMessage = "Vous n'avez pas d'arme";
      setTimeout(() => {
        this.showErrorModal = false;
      }, 1700);
    } else {
      // Suppression de l'arme du héro via le service Hero
      this.heroService.deleteWeapon(id)
        .then(() => {
          // Mise à jour des informations du héro
          if (this.hero) {
            this.hero.weapon = "";
          }
          this.weapon = undefined;
          this.setRemainingPoints();

          // Affichage d'un message de succès
          this.showSuccessModal = true;
          this.successModalMessage = "Votre arme a bien été supprimée !";
          setTimeout(() => {
            this.showSuccessModal = false;
          }, 1700);
        })
        .catch((error) => {
          // Affichage de l'erreur en console
          console.error("Erreur lors de la suppression de l'arme :", error);
        });
    }
  }

  // Fonction de comparaison de deux armes
  compareWeapons(weapon1: Weapon, weapon2: Weapon): boolean {
    // Retourne vrai si les noms des deux armes sont identiques, sinon retourne faux
    return weapon1 && weapon2 ? weapon1.name === weapon2.name : weapon1 === weapon2;
  }

  // Fonction pour supprimer un héro
  deleteHero(): void {
    // Récupération de l'ID du héro depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    // Appel de la méthode deleteHero() du service Hero
    this.heroService.deleteHero(id)
      .then(() => {
        // Création d'un cookie pour indiquer la suppression d'un héro
        const cookieName = "HeroDeleted";
        const cookieValue = "true";
        const expiresInDays = 1;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        const cookie = `${cookieName}=${cookieValue};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = cookie;
        // Retour à la page précédente
        this.location.back();
      })
      .catch(error => {
        // Affichage de l'erreur en console
        console.error("Erreur lors de la suppression du héros :", error);
      });
  }
  
}
