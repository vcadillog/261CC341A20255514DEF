import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private authService = inject(AuthService);
  private router = inject(Router);

  nombre = this.authService.currentNombre;
  username = this.authService.currentUsername;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
