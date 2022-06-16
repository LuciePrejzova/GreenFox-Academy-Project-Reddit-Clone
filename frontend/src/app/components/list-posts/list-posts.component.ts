import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/Post';
import { Channel } from 'src/app/interfaces/Channel';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AlertsService } from 'src/app/services/alerts.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.scss'],
})
export class ListPostsComponent implements OnInit {
  @Input() isAdmin = false;
  posts: Post[] = [];
  channel!: Channel;
  field: string = 'asc';
  withVotes: boolean = false;
  bestPost!: Post;
  pageSlice = this.posts.slice(0, 5); //how many posts should be displayed
  counts!: number[] | undefined;


  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService
  ) {
    const id: Observable<number> = activatedRoute.params.pipe(
      map((p) => p['id'])
    );
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      // id -> channelId

      // Homepage
      if (!id) {
        console.log(this.field);
        this.postService
          .getPosts(this.withVotes, this.field)
          .subscribe((posts) => {
            console.log(posts);
            this.posts = posts;
            this.pageSlice = this.posts.slice(0, 5);
          });

        // path: 'channel/:id'
      } else {
        this.postService.getChannelPosts(id).subscribe((result) => {
          this.posts = this.postService.orderPostsByCreationDesc(result.posts);
          this.pageSlice = this.posts.slice(0, 5);
          this.channel = result.channel;
        });
      }
    });
  }

  orderBy(field: string) {
    this.postService.getPosts(this.withVotes, field).subscribe((posts) => {
      this.posts = posts;
      this.pageSlice = this.posts.slice(0, 5);
    });
  }

  deletePost(post: Post) {
    if (post.id) {
      this.postService.deletePost(post.id).subscribe((result) => {
        this.postService
          .getPosts(this.withVotes, this.field)
          .subscribe((posts) => {
            this.posts = posts;
            this.pageSlice = this.posts.slice(0, 5);
          });
      });
    }
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.posts.length) {
      endIndex = this.posts.length;
    }
    this.pageSlice = this.posts.slice(startIndex, endIndex);
  }

  addPost(post: Post) {
    const res = this.postService.createNewPost(post);

      res.subscribe({
        next: () => {
          this.alertsService.sweetAlertSuccess(
            'Post was created!',
            'Keep posting!'
          );

          this.postService.getChannelPosts(this.channel.id).subscribe(result => {
            this.posts = this.postService.orderPostsByCreationDesc(result.posts);
            this.channel = result.channel;
          });
        },

        error: (err) =>
          this.alertsService.sweetAlertError(
            'Something went wrong!',
            'Post was not created.'
          ),
      });
  }
}
