import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/core/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule, 
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'league-quiz-app';
}
