import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/interfaces/Post';

@Component({
  selector: 'app-list-user-posts',
  templateUrl: './list-user-posts.component.html',
  styleUrls: ['./list-user-posts.component.scss']
})
export class ListUserPostsComponent implements OnInit {
  userPosts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getUserPosts().subscribe(userPosts => {
      this.userPosts = userPosts;
    })
  }

}
