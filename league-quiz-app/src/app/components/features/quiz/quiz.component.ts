import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  questions: { content: string; options: string[] }[] = [];
  answers: string[] = [];
  recommendations: any[] = [];
  currentQuestionIndex: number = 0;
  loading: boolean = false;
  error: string | null = null;
  quizComplete: boolean = false;

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.error = null;

    this.quizService.getQuizQuestions().subscribe(
      (response: any) => {
        try {
          const chatResponse = response.choices[0]?.message?.content;
          this.questions = this.parseQuestions(chatResponse);

          if (!this.questions.length) {
            throw new Error('No questions found.');
          }

          this.loading = false;
        } catch (err) {
          this.error = 'Failed to parse questions. Please try again.';
          this.loading = false;
        }
      },
      (err) => {
        this.error = 'Failed to load questions.';
        this.loading = false;
      }
    );
  }

  submitAnswer(answer: string) {
    this.answers.push(answer);

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.fetchRecommendations();
    }
  }

  fetchRecommendations() {
    this.loading = true;

    this.quizService.getRecommendations(this.answers).subscribe(
      async (response: any) => {
        try {
          const rawRecommendations = response.choices[0]?.message?.content;
          this.recommendations = JSON.parse(rawRecommendations);

          if (!this.recommendations.length) {
            throw new Error('No recommendations generated.');
          }

          const enrichedRecommendations = await Promise.all(
            this.recommendations.map(async (rec: any) => {
              const details = await this.quizService.getChampionDetails(
                rec.name.replace(/\s+/g, '')
              );
              const shortLore = details.lore.split('. ')[0] + '.';

              return {
                ...rec,
                image: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${details.id}_0.jpg`,
                title: details.title,
                lore: shortLore,
                difficulty: details.info.difficulty,
                stats: {
                  attack: details.info.attack,
                  defense: details.info.defense,
                  magic: details.info.magic,
                },
              };
            })
          );

          this.recommendations = enrichedRecommendations.sort(
            (a, b) => a.difficulty - b.difficulty
          );

          this.loading = false;
          this.quizComplete = true;
        } catch (err) {
          this.error = 'Failed to fetch recommendations.';
          this.loading = false;
        }
      },
      (err) => {
        this.error = 'Failed to fetch recommendations.';
        this.loading = false;
      }
    );
  }

  parseQuestions(responseText: string): { content: string; options: string[] }[] {
    try {
      const questions = [];
      const regex = /{\s*"content":\s*"(.*?)",\s*"options":\s*(\[[^\]]+\])/g;
      let match;

      while ((match = regex.exec(responseText)) !== null) {
        const content = match[1];
        const options = JSON.parse(match[2]);
        if (content && options?.length) {
          questions.push({ content, options });
        }
      }

      return questions;
    } catch {
      return [];
    }
  }

  getConfidencePercentage(): number {
    return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
  }

  getStars(difficulty: number): string[] {
    return Array(Math.round(difficulty / 2)).fill('⭐');
  }
}
