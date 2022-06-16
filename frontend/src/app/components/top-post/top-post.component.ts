import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/interfaces/Post';
import { UtilsService } from 'src/app/services/utils.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-top-post',
  templateUrl: './top-post.component.html',
  styleUrls: ['./top-post.component.scss'],
})
export class TopPostComponent implements OnInit {
  bestPost!: Post;
  contentPath!: any;
  author: { name?: string } | undefined;
  creationDate?: string;
  creationTime?: string;

  constructor(private postService: PostService, private utils: UtilsService) {}

  ngOnInit(): void {
    this.postService.getPosts(false, 'vote').subscribe((posts) => {
      //get post wiith most votes
      this.bestPost = posts[0];
      this.contentPath = this.utils.sanitize(this.bestPost.content);
      this.author = this.bestPost.user;
      [this.creationDate, this.creationTime] = this.utils.formatDateTime(
        this.bestPost.createdAt
      );
    });
  }
}
