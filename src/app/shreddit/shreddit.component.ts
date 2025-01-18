import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShredditService } from '../services/shreddit.service';

@Component({
  selector: 'app-shreddit',
  templateUrl: './shreddit.component.html',
  styleUrls: ['./shreddit.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [ShredditService],
})
export class ShredditComponent implements OnInit {
  posts: any[] = [];
  after = '';
  isLoading = false;
  error: string | null = null;
  selectedPost: any = null;
  url: string | null = null;

  constructor(private shredditService: ShredditService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollThreshold = 1050; // Artificial loading extension
    const currentScrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    if (
      currentScrollPosition >= documentHeight - scrollThreshold &&
      !this.isLoading
    ) {
      this.fetchPosts();
    }
  }

  isYouTubeUrl(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.error = null;
    this.shredditService.getPosts(this.after).subscribe(
      (data: any) => {
        this.posts = [
          ...this.posts,
          ...data.data.children.map((child: any) => child.data),
        ];
        this.after = data.data.after;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.error = 'Failed to load posts. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  navigate(): void {
    window.location.href = '/login';
  }

  getPostImageUrl(post: any, usePlaceholder = true): string {
    if (post.preview?.images?.length) {
      const imageUrl = post.preview.images[0].source.url;
      return imageUrl ? imageUrl.replaceAll('&amp;', '&') : '';
    }

    if (post.url_overridden_by_dest != null && post.url_overridden_by_dest.includes("youtube")) { //Some of the posts have youtube links. want to make that a little more obvious.
      return 'https://www.logo.wine/a/logo/YouTube/YouTube-Logo.wine.svg'; //TODO make this an iframe
    }

    return usePlaceholder
      ? 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'
      : '';
  }

  getUpvoteColor(ups: number): string {
    if (ups > 100) return '#FFD700'; // Gold
    if (ups > 20) return '#4CAF50'; // Green
    if (ups > 0) return '#353a95'; // Blue
    return '#808080'; // Gray
  }

  openPostDetails(post: any): void {
    this.selectedPost = post;
    this.url = post.url_overridden_by_dest;

    this.shredditService.getComments(post.id).subscribe(
      (data: any) => {
        this.selectedPost.comments = data[1]?.data?.children?.map(
          (child: any) => child.data
        );
      },
      (error) => {
        console.error('Error fetching comments:', error);
        this.selectedPost.comments = [];
      }
    );
  }

  closePostDetails(): void {
    this.selectedPost = null;
  }

  formatSelfText(selftext: string | null): string {
    if (!selftext) return '';

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return selftext.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }
}
