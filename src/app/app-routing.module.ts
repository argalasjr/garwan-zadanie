import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DevelopersComponent } from './developers/developers.component';
import { DeveloperDetailComponent } from './developer-detail/developer-detail.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetComponent } from './auth/reset/reset.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset', component: ResetComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'detail/:id', component: DeveloperDetailComponent }
];

@NgModule({
  imports: [ CommonModule,RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
