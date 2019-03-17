import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  customerArray = [];
  
  constructor(private customerService: CustomerService) { }


  ngOnInit() {
    this.customerService.getCustomers().subscribe(
      list => {
        this.customerArray = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        });
      });
  }

}
