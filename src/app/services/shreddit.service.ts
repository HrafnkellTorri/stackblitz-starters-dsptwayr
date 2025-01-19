import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShredditService {
  private baseUrl = 'https://www.reddit.com/r/Angular2.json';

  constructor(private http: HttpClient) {}
  
  getPosts(subreddit: string = ''): Observable<any> {
    const url = subreddit ? `https://www.reddit.com/r/${subreddit}.json` : this.baseUrl;
    return this.http.get(url);
  }

  getComments(postId: string): Observable<any> {
    console.log(`Fetching comments for post with ID: ${postId}`);

    const url = `https://www.reddit.com/comments/${postId}.json`;
    console.log(`Requesting comments from: ${url}`);

    return this.http.get(url);
  }
}
