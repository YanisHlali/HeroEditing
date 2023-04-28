import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeroDetailComponent } from './hero/hero-detail/hero-detail.component';
import { ListHeroComponent } from './hero/list-hero/list-hero.component';

import { AppRoutingModule } from './app-routing.module';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import { ListWeaponComponent } from './weapon/list-weapon/list-weapon.component';
import { WeaponDetailComponent } from './weapon/weapon-detail/weapon-detail.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  declarations: [
    AppComponent,
    ListHeroComponent,
    HeroDetailComponent,
    ListWeaponComponent,
    WeaponDetailComponent
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }