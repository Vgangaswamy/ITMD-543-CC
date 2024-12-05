import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openaiApiKey;

  constructor(private http: HttpClient) {}

  // Fetch quiz questions from GPT-4
  getQuizQuestions(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const payload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a League of Legends expert. Generate quiz questions to help understand a user’s preferences for recommending champions. Each question should include a "content" string and an array of four "options".',
        },
      ],
      max_tokens: 1000,
    };

    return this.http.post(this.chatGptApiUrl, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching quiz questions:', error);
        return throwError('Failed to fetch quiz questions.');
      })
    );
  }

  // Fetch recommendations based on answers
  getRecommendations(answers: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const payload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a League of Legends expert.',
        },
        {
          role: 'user',
          content: `Based on the answers: ${answers.join(
            ', '
          )}, recommend 4 champions as a JSON array with "name", "difficulty", and "description".`,
        },
      ],
      max_tokens: 1000,
    };

    return this.http.post(this.chatGptApiUrl, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching recommendations:', error);
        return throwError('Failed to fetch recommendations.');
      })
    );
  }

  // Fetch champion details
  getChampionDetails(championName: string): Promise<any> {
    const url = `https://ddragon.leagueoflegends.com/cdn/13.20.1/data/en_US/champion/${championName}.json`;
    return this.http
      .get(url)
      .toPromise()
      .then((data: any) => data.data[championName]);
  }
}