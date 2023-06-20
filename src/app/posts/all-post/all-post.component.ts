import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {
  postData!: Array<any>
  constructor(
    private postservice: PostsService
  ){}
  ngOnInit(): void{

    this.postservice.loadData().subscribe((val)=>{
      // console.log(val);
      this.postData = val;
      console.log(this.postData);

    });
  }

  onDelete(postImgPath: string, id: string){
    this.postservice.deleteImage(postImgPath, id);
  }

  onFeatured(id: string, featuredValue: boolean){
    const featuredData = {
      isFeatured: featuredValue,
    }
    console.log("Sending data to markFeatured");
    this.postservice.markFeatured(id, featuredData);
  }
}
