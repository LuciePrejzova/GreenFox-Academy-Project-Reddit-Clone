import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../interfaces/Post';
import { Comment } from 'src/app/interfaces/Comment';
import { PostService } from '../../services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { UtilsService } from 'src/app/services/utils.service';
import {
  faCircleDown,
  faCircleUp,
  faComments,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-posts-item',
  templateUrl: './posts-item.component.html',
  styleUrls: ['./posts-item.component.scss'],
})
export class PostsItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() title!: string;
  @Input() votes!: number;
  @Input() isAdmin: boolean = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  userName!: string;
  profilePicture!: string;
  totalVotes!: number;

  contentPath!: any;
  voteType!: string;
  comments: Comment[] = [];
  showComments: boolean = false;

  // informations in the footer
  showAuthor = false;
  author: { name?: string } | undefined;
  creationDate?: string;
  creationTime?: string;

  //ICONS
  faCircleDown = faCircleDown;
  faCircleUp = faCircleUp;
  faComments = faComments;
  faX = faCircleXmark;
  faTrash = faTrash;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.post.id) {
      this.postService
        .getVotes(this.post.id)
        .subscribe((result) => {this.votes = result.count;
        this.totalVotes = result.total;});
    }
    this.contentPath = this.utils.sanitize(this.post.content);

    this.commentService.getComments(this.post.id!).subscribe((comments) => {
      console.log(comments);
      this.comments = comments;
    });

    [this.creationDate, this.creationTime] = this.utils.formatDateTime(
      this.post.createdAt
    );

    this.activatedRoute.params.subscribe(({ id }) => {
      // id -> channelId
      // if you are not on homepage -> footer will be showed
      if (id) {
        this.showAuthor = true;
        this.author = this.post.user;
        [this.creationDate, this.creationTime] = this.utils.formatDateTime(
          this.post.createdAt
        );
      }
    });

    // will mark all upvotes/downvote of currently logged user
    this.markUserVote();
  }

  markUserVote() {
    const {id: loggedUserId } = this.utils.getDataFromToken();

    if (this.post.votes) {
      for (const vote of this.post.votes!) {
        if (vote.user_id === loggedUserId) {
          this.voteType = vote.type;
        }
      }
    }
  }

  vote(post: Post, type: string): void {
    if (!post.id) {
      alert('please provide id');
      return;
    }
    this.voteType = type;
    const newVote = {
      type: this.voteType,
    };
    console.log(newVote);
    this.postService.newVote(post.id, newVote).subscribe((message) => {
      console.log(message);
      //if there is a succes message, votes number change accordingly, if error / nothing happens
      if (post.id !== undefined) {
        this.postService
          .getVotes(post.id)
          .subscribe((result) => {this.votes = result.count;
            this.totalVotes = result.total;});
      }
    });
  }

  toggleComments(post: any) {
    this.showComments = true;
  }

  toggleCommentsOff() {
    this.showComments = !this.showComments;
  }

  deletePost(post: Post) {
    if (post) {
      this.delete.emit(post);
    }
  }

  deleteComment(comment: Comment) {
    this.commentService.deleteComment(comment.id).subscribe((result) => {
      this.commentService.getComments(comment.post_id).subscribe((comments) => {
        console.log(comments);
        this.comments = comments;
      });
    });
  }

  updateComment(formData: any) {
    this.commentService.updateComment(formData).subscribe(() => {
      this.commentService
        .getComments(formData.post_id)
        .subscribe((comments) => {
          console.log(comments);
          this.comments = comments;
        });
    });
  }
}
