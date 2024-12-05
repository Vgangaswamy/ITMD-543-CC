import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../components/services/auth.service'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuOpen = false;
  user: any = null;

  constructor(private authService: AuthService) {}

  // Toggle menu for mobile
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Login
  async login() {
    const user = await this.authService.loginWithGoogle();
    this.user = user;
    console.log('Logged in user:', user);
  }

  // Logout
  logout() {
    this.authService.logout().then(() => {
      this.user = null;
      console.log('User logged out');
    });
  }

  // Get auth state on initialization
  ngOnInit() {
    this.authService.getAuthState().subscribe((user: any) => {
      this.user = user;
    });
  }
}
