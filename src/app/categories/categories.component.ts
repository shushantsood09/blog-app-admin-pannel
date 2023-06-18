import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryData!: Array<any>;
  formCategory!: string;
  formStatus: string = 'Add';
  categoryId!: string;
  constructor(
    private fs: AngularFirestore,
    private categoryService: CategoriesService
  ) {}
  ngOnInit(): void {
    this.categoryService.getData().subscribe(val =>  {
      console.log(val);
      this.categoryData = val;
    });
  }
  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category,
    };

    if( this.formStatus === 'Add'){
      this.categoryService.saveData(categoryData);
      formData.reset();
    }
    else if( this.formStatus === 'Edit'){
      this.categoryService.updatedata(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }



    // let subCategorydata = {
    //   subCategory: 'subCategory',
    // };
  }

  onEdit(category: string, id: string){
    // console.log(category);
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  onDelete(id: string){
    this.categoryService.deleteData(id);
  }
}
