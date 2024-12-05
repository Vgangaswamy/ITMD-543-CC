import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root', // Ensures it's a singleton and injectable across the app
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Login with Google
  async loginWithGoogle(): Promise<firebase.User | null> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.afAuth.signInWithPopup(provider);
    return result.user;
  }

  // Logout
  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }

  // Get authentication state
  getAuthState() {
    return this.afAuth.authState; // Observable of authentication state
  }
}
