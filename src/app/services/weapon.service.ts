import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";


import {map, Observable} from "rxjs";
import { Hero, HeroId } from '../data/hero';
import { Weapon, WeaponId } from '../data/weapon';


@Injectable({ providedIn: 'root' })

export class WeaponService {
    private static url:string = 'weapons';
    private static HeroUrl:string = 'heroes';
    constructor(private readonly afs: AngularFirestore) { }

    createWeapon(): Promise<any> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapon: Weapon = {
          name: 'Nouvelle arme',
          image: 'https://mybroadband.co.za/news/wp-content/uploads/2017/04/Twitter-profile-picture.jpg',
          attack: 0,
          damage: 0,
          dodge: 0,
          health: 0
        };
        return weaponCollection.add(weapon);
      }

      getWeapon(id: string): Observable<WeaponId> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapon: Observable<WeaponId> = weaponCollection.doc(id.toString()).snapshotChanges().pipe(
          map(a => {
            const data = a.payload.data() as Weapon;
            const id = a.payload.id;
            return {
              ...data,
              id: id
            };
          })
        );
    
        return weapon;
      }
      

    getAllWeapons(): Observable<Weapon[]> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapons: Observable<Weapon[]> = weaponCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Weapon;
                const id = a.payload.doc.id;
                return {
                    ...data,
                    id
                };
            }))
        );

        return weapons;
    }

    getAllWeaponsId(): Observable<WeaponId[]> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapons: Observable<WeaponId[]> = weaponCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Weapon;
                const id = a.payload.doc.id;
                return {
                    ...data,
                    id
                };
            }))
        );

        return weapons;
    }

    getWeaponIdByName(name: string): Observable<WeaponId | undefined> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapon: Observable<WeaponId | undefined> = weaponCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Weapon;
            const id = a.payload.doc.id;
            return {
              ...data,
              id
            };
          }).find(a => a.name === name))
        );
        return weapon;
      }
      

    getWeaponById(id: string): Observable<Weapon> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapon: Observable<Weapon> = weaponCollection.doc(id).snapshotChanges().pipe(
            map(a => {
                const data = a.payload.data() as Weapon;
                return {
                    ...data
                };
            })
        );

        return weapon;
    }

    getNewestWeapon(): Observable<WeaponId> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        let weapon: Observable<WeaponId> = weaponCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as Weapon;
            const id = a.payload.doc.id;
            return {
              ...data,
              id
            };
          })),
          map(weapons => weapons[weapons.length - 1])
        );
        return weapon;
      }      

    updateName(id: string, name: string): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({name});
    }

    updateAttack(id: string, attack: number): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({attack});
    }

    updateDamage(id: string, damage: number): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({damage});
    }

    updateDodge(id: string, dodge: number): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({dodge});
    }

    updateHealth(id: string, health: number): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({health});
    }

    updateImage(id: string, image: string): void {
        this.afs.collection<Weapon>(WeaponService.url).doc(id).update({image});
    }

    deleteWeapon(id: string): Promise<void> {
        let weaponCollection = this.afs.collection<Weapon>(WeaponService.url);
        return weaponCollection.doc(id).delete();
      }
      
}

