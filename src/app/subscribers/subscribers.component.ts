import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit{

  subscribersData!: Array<any>;
  constructor(
    private subservice: SubscribersService,
  ){}

  ngOnInit(): void {
    this.subservice.loadData().subscribe(val=>{
      this.subscribersData = val;
    })
  }

  onDelete(id: string){
    this.subservice.deleteData(id);
  }
}
