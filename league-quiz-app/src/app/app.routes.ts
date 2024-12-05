import { Routes } from '@angular/router';
import { HomeComponent } from './components/features/home/home.component';
import { QuizComponent } from './components/features/quiz/quiz.component';
import { ResultsComponent } from './components/features/results/results.component';
import { ChampionsComponent } from './components/features/champions/champions.component';
import { HeroDetailsComponent } from './components/features/hero-details/hero-details.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'champions', component: ChampionsComponent },
    { path: 'champion/:id', component: HeroDetailsComponent },
    { path: '**', redirectTo: '' },
    
];
