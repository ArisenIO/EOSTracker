import { Component, OnInit, Input } from '@angular/core';
import {AppService} from '../../../services/app.service'
@Component({
  selector: 'app-dashboard-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  public rsnprice: any = null;
  public rsnvolume: any = null;
  @Input() price: any;

  constructor(private httpservice: AppService) { }

  ngOnInit() {

    this.httpservice.getRSNTicker().subscribe((response:any) => {
      this.rsnprice = parseFloat(response.data.USD.price).toFixed(4)
      this.rsnvolume = parseFloat(response.data.USD.base_volume)
    })

  }

}
