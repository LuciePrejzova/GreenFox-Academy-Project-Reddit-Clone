import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Comment } from 'src/app/interfaces/Comment';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { UtilsService } from 'src/app/services/utils.service';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: Comment;
  @Input() isAdmin: boolean = false;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @ViewChild('formDirective') formDirective!: NgForm;
  faTrash = faTrash;
  faPencil = faPencil;
  creationDate?: string;
  creationTime?: string;
  isOpen: boolean = false;
  commentForm!: FormGroup;

  constructor(private utils: UtilsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createFormGroup();
    [this.creationDate, this.creationTime] = this.utils.formatDateTime(
      this.comment.createdAt
    );
  }

  createFormGroup() {
    this.commentForm = this.fb.group({
      content: [
        '',
        {
          validators: [Validators.required, Validators.minLength(1)],
          updateOn: 'blur',
        },
      ],
      id: this.comment.id,
      post_id: this.comment.post_id,
    });
  }

  onDelete(comment: Comment) {
    if (comment) {
      this.delete.emit(comment);
    }
  }

  onUpdate(formData: any) {
    console.log('updating');
    console.log('update comment:' + JSON.stringify(formData));
    if (formData.content) {
      this.update.emit(formData);
    }
  }
}
