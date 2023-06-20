import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage,
    private fs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  uploadImage(selectedImage: any, postData: Post, formStaus: string, id: string){
    const filepath = `postIMG/${Date.now()}`;

    this.storage.upload(filepath, selectedImage).then(()=>{
      console.log('post image uploaded successfully!');

      this.storage.ref(filepath).getDownloadURL().subscribe((url)=>{
        postData.postImgPath = url;
        console.log(postData);

        if(formStaus === 'Edit'){
          this.updateData(id, postData)
        }
        else{
          this.saveData(postData);
        }
      })
    })
  }

  saveData(postData: Post){
    this.fs.collection('posts').add(postData).then((docRef)=>{
      this.toastr.success('Data inserted Successfully..!');
      this.router.navigate(['/posts']);
    })
  }


  loadData() {
    return this.fs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { data, id };
          });
        })
      );
  }

  loadInvidualData(id: string){
    // this.fs.collection('posts').doc(id).valueChanges();
    // Other approach
    return this.fs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: string, postData: Post){
    this.fs.doc(`posts/${id}`).update(postData).then((val)=>{
      this.toastr.success('Data updated successfully!!');
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: string, id: string){
    this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
      this.deleteData(id);
    });
  }

  deleteData(id: string){
    this.fs.doc(`posts/${id}`).delete().then(()=>{
      this.toastr.success("Data deleted..!")
    })
  }

  markFeatured(id: string, featuredData: any){
    this.fs.doc(`posts/${id}`).update(featuredData).then((val)=> {
      console.log(val);

      this.toastr.info('Featured Status Updated!')
    });
  }
}
