import { Component, OnChanges, Input } from '@angular/core';
import {AppService} from '../../../services/app.service';

@Component({
  selector: 'app-account-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnChanges {

  @Input() account;
  @Input() rixQuote;
  @Input() ramQuote;
  balance: {
    liquid: number;
    ram: number;
    cpu: number;
    net: number;
    total?: number;
  };

  rixprice;

  constructor(private appService: AppService) { }

  ngOnChanges() {
    if (this.account && this.rixQuote && this.ramQuote) {
      this.balance = {
        liquid: this.account.core_liquid_balance ? Number(this.account.core_liquid_balance.replace('RIX', '')) : 0,
        ram: this.account.ram_quota * this.ramQuote.price,
        cpu: this.account.cpu_weight / 10000,
        net: this.account.net_weight / 10000
      };
      this.balance.total = this.balance.liquid + this.balance.ram + this.balance.cpu + this.balance.net;

      this.appService.getRIXTicker().subscribe((response: any) => {
        if (response.data) {
          this.rixprice = parseFloat(response.data.USD.price).toFixed(4)
        }
      })
    }
  }

}
