import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hero-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.css'],
})
export class HeroDetailsComponent implements OnInit {
  hero: any = null;
  heroStats = [
    { label: 'Attack', value: 0 },
    { label: 'Defense', value: 0 },
    { label: 'Magic', value: 0 },
    { label: 'Difficulty', value: 0 },
  ];
  heroStrengths: string[] = [];
  currentQuote: string = '';
  quotes: string[] = [];
  averageStats = { attack: 5, defense: 5, magic: 5, difficulty: 5 };

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    const heroId = this.route.snapshot.paramMap.get('id');
    if (heroId) {
      await this.loadHeroDetails(heroId);
      this.generateStrengths();
      this.initializeQuotes();
    }
  }

  async loadHeroDetails(heroId: string) {
    try {
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion/${heroId}.json`
      );
      const data = await response.json();
      const hero = data.data[heroId];

      this.hero = {
        id: hero.id,
        name: hero.name,
        title: hero.title,
        lore: hero.lore,
        tags: hero.tags,
        abilities: Object.values(hero.spells),
        passive: hero.passive,
        skins: hero.skins.map((skin: any) => ({
          name: skin.name === 'default' ? hero.name : skin.name,
          image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${hero.id}_${skin.num}.jpg`,
        })),
        image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${hero.id}_0.jpg`,
      };

      this.heroStats = [
        { label: 'Attack', value: hero.info.attack },
        { label: 'Defense', value: hero.info.defense },
        { label: 'Magic', value: hero.info.magic },
        { label: 'Difficulty', value: hero.info.difficulty },
      ];
    } catch (error) {
      console.error('Error loading hero details:', error);
    }
  }

  generateStrengths() {
    const allStrengths = [
      'High burst damage', 'Great sustain in combat', 'Excellent mobility',
      'Strong crowd control', 'Powerful AoE abilities', 'Fast jungle clear',
      'Strong laning phase', 'High scaling potential', 'Exceptional teamfight utility',
      'Versatile playstyle', 'Low cooldowns', 'Superior map control',
      'High skill ceiling', 'Effective split-pushing', 'Strong synergy with allies',
      'Unparalleled versatility', 'Deadly execution combos', 'Superior sustain mechanics',
      'Tower melting abilities', 'Strategic dominance', 'Reliable damage output',
      'Evasive movements', 'Unique gameplay mechanics', 'Control of the battlefield',
      'Punishes mispositioning', 'Adaptable in all situations', 'Critical burst timing',
      'Reliable disengages', 'Exceptional crowd control chains', 'Punishes weak lanes',
      'Sustainably clears jungle', 'Difficult to counter', 'Unrivaled late-game scaling',
      // ... Add more strengths up to 100 or more.
    ];

    this.heroStrengths = allStrengths.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  initializeQuotes() {
    const loreParts = this.hero?.lore.split('.') || [];
    this.quotes = loreParts.filter((sentence: string) => sentence.trim().length > 10);

    this.currentQuote = this.quotes[0] || 'A hero without a story!';
    let index = 0;

    setInterval(() => {
      index = (index + 1) % this.quotes.length;
      this.currentQuote = this.quotes[index];
    }, 10000);
  }

  getComparisonWidth(statLabel: string): number {
    const statKey = statLabel.toLowerCase() as keyof typeof this.averageStats;
    const average = this.averageStats[statKey] || 10;
    const value = this.heroStats.find(stat => stat.label === statLabel)?.value || 0;
    return (value / average) * 100;
  }

  getTagClass(tag: string): string {
    const tagClasses: any = {
      Fighter: 'bg-red-500 text-white',
      Tank: 'bg-blue-500 text-white',
      Mage: 'bg-purple-500 text-white',
      Assassin: 'bg-green-500 text-white',
      Support: 'bg-yellow-500 text-black',
      Marksman: 'bg-orange-500 text-white',
    };
    return tagClasses[tag] || 'bg-gray-500 text-white';
  }

  getRoleDescription(tag: string): string {
    const descriptions: any = {
      Fighter: 'A versatile champion specializing in melee combat.',
      Tank: 'A durable champion who can soak up damage.',
      Mage: 'A magic-based champion with high burst damage.',
      Assassin: 'A champion excelling at single-target elimination.',
      Support: 'A champion who enhances and protects their team.',
      Marksman: 'A ranged champion dealing consistent damage.',
    };
    return descriptions[tag] || 'A unique champion role.';
  }

  goBack() {
    this.router.navigate(['/champions']);
  }
}
