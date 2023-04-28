import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";


import { map, Observable} from "rxjs";
import { Hero, HeroId } from '../data/hero';

@Injectable({ providedIn: 'root' })

export class HeroService {
  private static url:string = 'heroes';

  constructor(private readonly afs: AngularFirestore) { }

  // ------------------ CREATE ------------------

  createHero(): Promise<any> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    let hero: Hero = {
      name: 'nouveau héro',
      image: 'https://mybroadband.co.za/news/wp-content/uploads/2017/04/Twitter-profile-picture.jpg',
      attack: 10,
      damage: 10,
      dodge: 10,
      health: 10,
      weapon: ''
    };
    return heroCollection.add(hero);
  }

  // ------------------ GET ------------------

  getHeroes(): Observable<HeroId[]> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    let heroes: Observable<HeroId[]> = heroCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Hero;
        const id = a.payload.doc.id;
        return {
          ...data,
          id
        };
      }))
    );

    return heroes;
  }
  
  getHero(id: string): Observable<HeroId> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    let hero: Observable<HeroId> = heroCollection.doc(id.toString()).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Hero;
        const id = a.payload.id;
        return {
          ...data,
          id: id
        };
      })
    );

    return hero;
  }

  getNewestHero(): Observable<HeroId> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    let hero: Observable<HeroId> = heroCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Hero;
        const id = a.payload.doc.id;
        return {
          ...data,
          id
        };
      })),
      map(heroes => heroes[heroes.length - 1])
    );
    return hero;
  }

  getHeroIdByWeaponId(weaponId: string): Observable<string | undefined> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    let hero: Observable<string | undefined> = heroCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Hero;
        const id = a.payload.doc.id;
        return {
          ...data,
          id
        };
      })),
      map(heroes => heroes.find(hero => hero.weapon === weaponId)),
      map(hero => hero?.id)
    );
    return hero;
  }
  

  // ------------------ UPDATE ------------------

  updateName(id: string, name: string): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      name: name
    });
  }

  updateAttack(id: string, attack: number): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      attack: attack
    });
  }

  updateDamage(id: string, damage: number): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      damage: damage
    });
  }

  updateDodge(id: string, dodge: number): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      dodge: dodge
    });
  }

  updateHealth(id: string, health: number): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      health: health
    });
  }

  updateWeapon(id: string, weapon: string): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      weapon: weapon
    });
  }

  updateImage(id: string, image: string): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      image: image
    });
  }

  // ------------------ DELETE ------------------

  deleteWeapon(id: string): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).update({
      weapon: ""
    });
  }

  deleteHero(id: string): Promise<void> {
    let heroCollection = this.afs.collection<Hero>(HeroService.url);
    return heroCollection.doc(id).delete();
  }

  imageExists(imageUrl: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      let img = new Image();
      img.onload = () => {
        observer.next(true);
        observer.complete();
      };
      img.onerror = () => {
        observer.next(false);
        observer.complete();
      };
      img.src = imageUrl;
    });
  }
}