import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShredditService {
  private baseUrl = 'https://www.reddit.com/r/Angular2.json';

  constructor(private http: HttpClient) {}

  getPosts(after: string = ''): Observable<any> {
    const url = after ? `${this.baseUrl}?after=${after}` : this.baseUrl;
    return this.http.get(url);
  }

getComments(postId: string): Observable<any> {
  // Log the request URL for debugging purposes
  console.log(`Fetching comments for post with ID: ${postId}`);

  // Construct the URL for the Reddit comments API
  const url = `https://www.reddit.com/comments/${postId}.json`;

  // Log the request URL
  console.log(`Requesting comments from: ${url}`);

  return this.http.get(`https://www.reddit.com/comments/${postId}.json`);

  }
}
