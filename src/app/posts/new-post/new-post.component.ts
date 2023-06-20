import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: any = './assets/image-placeholder.jpg';
  selectedimage: any;
  categories!: Array<any>;
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  docid!: string;
  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.docid = val.id;

      if(this.docid){
        this.postService.loadInvidualData(val.id).subscribe((post)=>{
          console.log(post);
          this.post = post;
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.post.permalink, Validators.required],
            excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(10)]],
            category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
            postimg: ['', Validators.required],
            content: [this.post.content, Validators.required],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        })
      }
      else{
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(10)]],
          category: ['', Validators.required],
          postimg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }

    });

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      postimg: ['', Validators.required],
      content: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.categoryService.getData().subscribe((res) => {
      this.categories = res;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChange(event: any) {
    // console.log(event.target.value);
    const title = event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showImagePreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };

    // Convert the recieving response in the data url.
    reader.readAsDataURL(event.target.files[0]);
    this.selectedimage = event.target.files[0];
  }

  onSubmit() {
    let splitData = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitData[0],
        category: splitData[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    this.postService.uploadImage(this.selectedimage, postData, this.formStatus, this.docid);
    // console.log(postData);
    this.postForm.reset();
    this.imgSrc = './assets/image-placeholder.jpg';
  }
}
