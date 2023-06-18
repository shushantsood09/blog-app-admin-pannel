import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private fs: AngularFirestore, private toastr: ToastrService) {}

  saveData(data: any) {
    this.fs
      .collection('categories')
      .add(data)
      .then((docRef) => {
        // console.log(docRef);
        this.toastr.success('Data inserted successfully!!');
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  }

  getData() {
    return this.fs
      .collection('categories')
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

  updatedata(id: string, EditData: Category){
    this.fs.collection('categories').doc(id).update(EditData).then(docRef=> {
      this.toastr.success('Data Updated Successfully!!');
    })
    // Alternative of above
    // this.fs.doc(`categories/${id}`).update(EditData).then(docRef=> {
    //   this.toastr.success('Data Updated Successfully!!');
    // })
  }

  deleteData(id: string){
    this.fs.collection('categories').doc(id).delete().then(docRef=>{
      this.toastr.success('Data Deleted!!');
    })
  }
}
