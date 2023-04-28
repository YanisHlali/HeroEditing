import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Weapon } from '../../data/weapon';
import { WeaponService } from '../../services/weapon.service';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: [ './weapon-detail.component.css' ]
})

export class WeaponDetailComponent implements OnInit {
  weapon?: Weapon;
  id?: string;
  remainingPoints: number = 0;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  successModalMessage: string = "";
  errorModalMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private weaponService: WeaponService,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.getWeapon();
  }

  getWeapon(): void {
    // Récupération de l'identifiant de l'arme depuis les paramètres de la route
    const idWeapon = this.route.snapshot.paramMap.get('id');
    // Si l'identifiant de l'arme n'est pas trouvé, on sort de la fonction
    if (!idWeapon) return;
    // Récupération de l'arme en utilisant l'identifiant récupéré
    this.weaponService.getWeaponById(idWeapon)
      .subscribe(weapon => {
        // Stockage de l'arme dans la variable `this.weapon`
        this.weapon = weapon;
        // Mise à jour des points restants
        this.setRemainingPoints();
      });
    // Stockage de l'identifiant de l'arme dans la variable `this.id`
    this.id = idWeapon;
  }
  // Enregistre le nom de l'arme
  saveName(): void {
    // Récupération de l'identifiant de l'arme.
    const id = this.route.snapshot.paramMap.get('id');
    // Si l'arme ou l'identifiant n'existe pas, on retourne.
    if (!this.weapon || !id) return;
    // Si le nom de l'arme ne contient pas au moins un caractère, 
    // on affiche un message d'erreur et on recharge l'arme.
    if (this.weapon.name.length < 1) {
      this.showErrorModal = true;
      this.errorModalMessage = "Le nom de l'arme doit contenir au moins un caractère.";
      setTimeout(() => {
        this.showErrorModal = false;
      }
      ,1700);
      this.getWeapon();
    } else {
      // Sinon, on met à jour le nom de l'arme.
      this.weaponService.updateName(id, this.weapon.name);
    }
  }

  // Entregistre l'URL de l'image
  saveImage(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Vérifie si l'arme existe et si l'identifiant de l'arme est valide
    if (!this.weapon || !id) return;
    // Vérifie si l'URL de l'image est valide
    if (this.weapon.image.length < 1) {
      // Affiche une erreur si l'URL n'est pas valide
      this.showErrorModal = true;
      this.errorModalMessage = "L'URL de l'image doit être valide";
      setTimeout(() => {
        this.showErrorModal = false;
      }
      ,1700);
      // Récupère les données de l'arme à nouveau
      this.getWeapon();
    } else {
      // Sauvegarde l'URL de l'image
      this.weaponService.updateImage(id, this.weapon.image);
    }
  }

  // Enregistre les caractéristiques de l'arme
  saveStats(): void {
    // Récupération de l'identifiant de l'arme à partir de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    // Si l'arme ou l'identifiant n'existent pas, on quitte la fonction
    if (!this.weapon || !id) return;

    // Vérification que les statistiques de l'arme sont valides
    if (
      // Vérification que l'attaque est comprise entre -5 et 5
      this.weapon.attack >= -5 && this.weapon.attack <= 5 &&
      // Vérification que les dégâts sont compris entre -5 et 5
      this.weapon.damage >= -5 && this.weapon.damage <= 5 &&
      // Vérification que l'esquive est comprise entre -5 et 5
      this.weapon.dodge >= -5 && this.weapon.dodge <= 5 &&
      // Vérification que la santé est comprise entre -5 et 5
      this.weapon.health >= -5 && this.weapon.health <= 5 &&
      // Vérification que la somme des statistiques est égale à 0
      (this.weapon.attack + this.weapon.damage + this.weapon.dodge + this.weapon.health) === 0
    ) {
      // Mise à jour des statistiques de l'arme
      this.weaponService.updateAttack(id, this.weapon.attack);
      this.weaponService.updateDamage(id, this.weapon.damage);
      this.weaponService.updateDodge(id, this.weapon.dodge);
      this.weaponService.updateHealth(id, this.weapon.health);
      // Affichage d'un message de succès
      this.showSuccessModal = true;
      this.successModalMessage = "Les statistiques de l'arme ont été modifiées.";
      setTimeout(() => {
        this.showSuccessModal = false;
      }
      ,1700);
    } else {
      // Affichage d'un message d'erreur
      this.showErrorModal = true;
      this.errorModalMessage = "Les statistiques de l'arme doivent être comprises entre -5 et 5 et la somme de ces statistiques doit être égale à 0.";
      setTimeout(() => {
        this.showErrorModal = false;
      }
      ,3000);
      // Récupération des informations actualisées de l'arme
      this.getWeapon();
    }
  }

  // Fonction pour mettre à jour le nombre de points restants
  setRemainingPoints(): void {
    // Si l'objet weapon n'est pas défini, on quitte la fonction
    if (!this.weapon) return;
    // Calcul du nombre de points restants en soustrayant la somme des statistiques de l'arme à 0
    this.remainingPoints = 0 - this.weapon.attack - this.weapon.damage - this.weapon.dodge - this.weapon.health;
  }
  
  // Fonction pour supprimer l'arme
  deleteWeapon(): void {
    // Récupère l'ID de l'arme à partir de l'URL
    const id = this.route.snapshot.paramMap.get('id');
    // Si l'ID n'a pas été trouvé, quitte la fonction
    if (!id) return;

    // Récupère l'ID du héros associé à cette arme
    this.heroService.getHeroIdByWeaponId(id)
      .subscribe(heroId => {
        // Si un héros est associé à cette arme, retire cette arme de ce héros
        if (heroId) {
          this.heroService.deleteWeapon(heroId)
            .catch(error => {
              // Affiche une erreur dans la console en cas d'erreur lors de la suppression de l'arme du héros
              console.error("Erreur lors de la suppression de l'arme du héros :", error);
            });
        }
      });

    // Supprime l'arme
    this.weaponService.deleteWeapon(id)
      .then(() => {
        // Retourne à la page précédente
        this.location.back();
        // Définit un cookie indiquant que l'arme a été supprimée
        const cookieName = "WeaponDeleted";
        const cookieValue = "true";
        const expiresInDays = 1;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        const cookie = `${cookieName}=${cookieValue};expires=${expirationDate.toUTCString()};path=/`;
        document.cookie = cookie;
      })
      .catch(error => {
        // Affiche une erreur dans la console en cas d'erreur lors de la suppression de l'arme
        console.error("Erreur lors de la suppression de l'arme :", error);
      });
  }

}
