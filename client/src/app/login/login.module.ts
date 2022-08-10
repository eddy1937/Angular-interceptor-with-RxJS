import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
