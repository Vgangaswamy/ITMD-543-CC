import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-champions',
  standalone: true,
   imports: [CommonModule, FormsModule, RouterModule,],
  templateUrl: './champions.component.html',
  styleUrls: ['./champions.component.css'],
})
export class ChampionsComponent implements OnInit {
  heroes: any[] = [];
  filteredHeroes: any[] = [];
  paginatedHeroes: any[] = [];
  heroOfTheDay: any = {};
  searchTerm: string = '';
  selectedType: string = 'All';
  selectedDifficulty: string = 'All';
  sortOption: string = 'name';

  heroTypes: string[] = ['All', 'Tank', 'Mage', 'Support', 'Assassin', 'Marksman'];
  difficultyLevels: string[] = ['All', 'Easy', 'Medium', 'Hard'];
  sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Difficulty (Low to High)', value: 'difficulty' },
    { label: 'Difficulty (High to Low)', value: 'difficulty-desc' },
  ];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  constructor(private router: Router) {}

  navigateToHero(heroId: string): void {
    console.log('Navigating to hero:', heroId); // For debugging
    this.router.navigate(['/champion', heroId]);
  }

  ngOnInit() {
    this.loadHeroes();
  }

  async loadHeroes() {
    try {
      const response = await fetch(
        'https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion.json'
      );
      const data = await response.json();
      const heroList = Object.values(data.data);

      this.heroes = heroList.map((hero: any) => ({
        id: hero.id,
        name: hero.name,
        title: hero.title,
        description: hero.blurb,
        tags: hero.tags,
        difficulty: this.getDifficultyLabel(hero.info.difficulty),
        stats: hero.info,
        image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${hero.id}_0.jpg`,
      }));

      this.heroOfTheDay = this.heroes[Math.floor(Math.random() * this.heroes.length)];

      this.applyFilters();
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  }

  getDifficultyLabel(difficulty: number): string {
    if (difficulty <= 3) return 'Easy';
    if (difficulty <= 6) return 'Medium';
    return 'Hard';
  }

  applyFilters() {
    this.filteredHeroes = this.heroes.filter((hero) => {
      const matchesType =
        this.selectedType === 'All' || hero.tags.includes(this.selectedType);
      const matchesDifficulty =
        this.selectedDifficulty === 'All' || hero.difficulty === this.selectedDifficulty;
      const matchesSearch =
        this.searchTerm === '' ||
        hero.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesType && matchesDifficulty && matchesSearch;
    });

    this.sortHeroes();
    this.paginateHeroes();
  }

  sortHeroes() {
    const isDescending = this.sortOption.includes('desc');
    const key = this.sortOption.replace('-desc', '');

    this.filteredHeroes.sort((a, b) => {
      const valueA = key === 'difficulty' ? a.stats.difficulty : a[key];
      const valueB = key === 'difficulty' ? b.stats.difficulty : b[key];

      if (typeof valueA === 'number') {
        return isDescending ? valueB - valueA : valueA - valueB;
      }

      return isDescending
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    });
  }

  paginateHeroes() {
    this.totalPages = Math.ceil(this.filteredHeroes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedHeroes = this.filteredHeroes.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number) {
    this.currentPage = page;
    this.paginateHeroes();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = 'All';
    this.selectedDifficulty = 'All';
    this.sortOption = 'name';
    this.currentPage = 1;
    this.applyFilters();
  }

  getRoleColor(role: string): string {
    const colors: any = {
      Tank: '#4ade80',
      Mage: '#7dd3fc',
      Support: '#facc15',
      Assassin: '#f43f5e',
      Marksman: '#a78bfa',
    };

    return colors[role] || '#fff';
  }

  getStars(difficulty: number): string[] {
    const stars = Math.round(difficulty / 2);
    return Array(stars).fill('⭐');
  }

  onSearchChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.applyFilters();
  }

  onDifficultyChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }
}
