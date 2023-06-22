import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(
    private fs: AngularFirestore,
    private toastr: ToastrService
  ) { }

  loadData() {
    return this.fs
      .collection('subscribers')
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

  deleteData(id: string){
    this.fs.collection('subscribers').doc(id).delete().then(docRef=>{
      this.toastr.success('Data Deleted!!');
    })
  }
}
