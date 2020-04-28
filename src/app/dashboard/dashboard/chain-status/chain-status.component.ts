import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-dashboard-chain-status',
  templateUrl: './chain-status.component.html',
  styleUrls: ['./chain-status.component.scss']
})
export class ChainStatusComponent implements OnInit {

  public rixprice: any = null;

  status$;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
    this.status$ = this.appService.info$;
    
    this.appService.getRIXTicker().subscribe((response: any) => {
      if (response.data) {
        this.rixprice = parseFloat(response.data.USD.price).toFixed(4)
      }
    })
  }

}
