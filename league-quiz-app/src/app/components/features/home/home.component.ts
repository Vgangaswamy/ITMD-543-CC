import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showNarrative: boolean = false; // Controls whether the narrative is shown
  currentChapter: number = 1; // Tracks the current chapter
  fullTextRevealed: boolean = false; // Determines if the text is fully revealed
  thunderSound: HTMLAudioElement = new Audio('assets/sounds/thunder.mp3'); // Thunder sound
  showThunderFlash: boolean = false; // Controls the visual flash effect

  characterImage: string = 'assets/images/aatrox.png'; // Path to the character image

  // Chapter titles
  chapterTitles: string[] = [
    'The Awakening',
    'The Guardian’s Tale',
    'The Trial of Worth',
    'The Call to Courage',
    'Destiny Unfolds'
  ];

  // Chapter texts
  chapters: string[] = [
    'In the realm of Runeterra, ancient forces stir. A mystical artifact, the Champion Compass, awakens from its slumber.',
    'Guarded by Aatrox, the Darkin Blade, the Compass holds the power to unveil the champion who mirrors your essence.',
    'Few have attempted to wield the Compass, and even fewer have succeeded. To prove your worth, a trial lies ahead.',
    'The Compass does not seek the strongest or the smartest. It seeks the courageous. Only the brave may answer its call.',
    'Your journey begins now. Step forward and claim the champion who will stand by your side. Destiny awaits.'
  ];

  currentStoryText: string = ''; // Current text being displayed

  constructor(private router: Router) {}

  navigateToQuiz(): void {
    this.router.navigate(['/quiz']);
  }

  navigateToChampions() : void {
    this.router.navigate(['/champions']);
  }

  ngOnInit(): void {
    // Check localStorage to see if narration has already been played
    const narrationPlayed = localStorage.getItem('narrationPlayed');
    if (!narrationPlayed) {
      this.startNarration(); // Play narration if not already played
      localStorage.setItem('narrationPlayed', 'true'); // Mark narration as played
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  clearStorageBeforeUnload() {
    // Clear localStorage on page refresh
    localStorage.removeItem('narrationPlayed');
  }

  // Starts the narration
  startNarration() {
    this.showNarrative = true;
    this.typeText(this.chapters[this.currentChapter - 1]);
    this.playThunderEffect();
  }

  // Typewriter effect
  typeText(text: string) {
    let i = 0;
    this.currentStoryText = '';
    this.fullTextRevealed = false;
    const interval = setInterval(() => {
      if (i < text.length && !this.fullTextRevealed) {
        this.currentStoryText += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        this.fullTextRevealed = true;
      }
    }, 50);
  }

  // Reveals the full text if partially displayed
  revealFullText() {
    if (!this.fullTextRevealed) {
      this.fullTextRevealed = true;
      this.currentStoryText = this.chapters[this.currentChapter - 1];
    }
  }

  // Handles the next story step
  nextStoryStep(event: MouseEvent) {
    event.stopPropagation(); // Prevent click propagation to the story container
    if (this.fullTextRevealed && this.currentChapter < this.chapters.length) {
      this.currentChapter++;
      this.typeText(this.chapters[this.currentChapter - 1]);
    } else if (this.fullTextRevealed) {
      this.endNarrative();
    }
  }

  // Ends the narrative and shows the main content
  endNarrative() {
    this.showNarrative = false;
    this.stopThunderEffect(); // Stop thunder sound
  }

  // Skips the narrative and shows the main content
  skipNarrative(event: MouseEvent) {
    event.stopPropagation(); // Prevent click propagation to the story container
    this.showNarrative = false;
    this.stopThunderEffect(); // Stop thunder sound
  }

  // Plays thunder effect with visual flash
  playThunderEffect() {
    this.thunderSound.volume = 1;
    this.thunderSound.play();

    // Show visual flash effect
    this.showThunderFlash = true;
    setTimeout(() => {
      this.showThunderFlash = false;
    }, 500);
  }

  // Stops thunder sound
  stopThunderEffect() {
    this.thunderSound.pause();
    this.thunderSound.currentTime = 0;
  }
}
