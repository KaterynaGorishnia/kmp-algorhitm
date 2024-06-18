import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InterfaceComponent } from './interface/interface.component';
import {DescriptionComponent} from "./description/description.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'algorithm', component: DescriptionComponent },
  { path: 'interface', component: InterfaceComponent }
];
