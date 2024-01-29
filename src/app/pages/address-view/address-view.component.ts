import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddressService } from '../../services/address/address.service';

@Component({
  selector: 'app-address-view',
  templateUrl: './address-view.component.html',
  styleUrls: ['./address-view.component.css']
})
export class AddressViewComponent implements OnInit {
  dataSource:any;
 displayedColumns: string[] = ['id','name','ownerName','emaild','mobileNumberPrimary','status','edit'];
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

  constructor(private addressService:AddressService) { }

  ngOnInit() {
  }
  getAddressListByTenId(id:number){
    this.addressService.getAddressByTenIdList(id)  
        .subscribe(  
        res => {  
          this.dataSource = new MatTableDataSource();  
          this.dataSource.data = res;  
          this.dataSource.paginator = this.paginator;  
          this.dataSource.sort=this.sort;
          // 
        },  
        error => {  
          
        });  
    }
    getAddressListByAccId(id:number){
      this.addressService.getAddressByAccIdList(id)  
          .subscribe(  
          res => {  
            this.dataSource = new MatTableDataSource();  
            this.dataSource.data = res;  
            this.dataSource.paginator = this.paginator;  
            this.dataSource.sort=this.sort;
            // 
          },  
          error => {  
            
          });  
      }
}