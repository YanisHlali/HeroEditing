import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListHeroComponent } from './hero/list-hero/list-hero.component';
import { HeroDetailComponent } from './hero/hero-detail/hero-detail.component';
import { ListWeaponComponent } from './weapon/list-weapon/list-weapon.component';
import { WeaponDetailComponent } from './weapon/weapon-detail/weapon-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/list/hero', pathMatch: 'full' },
  { path: 'create/heroes', component: HeroDetailComponent },
  { path: 'hero/detail/:id', component: HeroDetailComponent },
  { path: 'list/hero', component: ListHeroComponent },
  { path: 'list/weapon', component: ListWeaponComponent },
  { path: 'weapon/detail/:id', component: WeaponDetailComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}