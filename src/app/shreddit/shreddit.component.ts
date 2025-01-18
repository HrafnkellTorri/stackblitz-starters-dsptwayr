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
  after: string = ''; // Tracks the 'after' token for pagination
  isLoading: boolean = false;
  error: string | null = null; // Tracks errors during data fetching
  selectedPost: any = null; // Tracks the selected post for details view

  constructor(private shredditService: ShredditService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollThreshold = 1050;
    const currentScrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    if (
      currentScrollPosition >= documentHeight - scrollThreshold &&
      !this.isLoading
    ) {
      this.fetchPosts();
    }
  }

  fetchPosts(): void {
    this.isLoading = true;
    this.error = null;
    this.shredditService.getPosts(this.after).subscribe(
      (data: any) => {
        const newPosts = data.data.children.map((child: any) => child.data);
        this.posts = [...this.posts, ...newPosts];
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

  getPostImageUrl(post: any): string {
    if (post.preview && post.preview.images && post.preview.images.length > 0) {
      const imageUrl = post.preview.images[0].source.url;
      if (imageUrl) {
        return imageUrl.replaceAll('&amp;', '&');
      }
    }
    return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
  }

  getUpvoteColor(ups: number): string {
    if (ups > 100) {
      return '#FFD700'; // Gold
    } else if (ups > 20) {
      return '#4CAF50'; // Green
    } else if (ups > 0) {
      return '#353a95'; // Blue
    }
    return '#808080'; // Gray
  }

  openPostDetails(post: any): void {
    this.selectedPost = post;
  }

  closePostDetails(): void {
    this.selectedPost = null;
  }
}
