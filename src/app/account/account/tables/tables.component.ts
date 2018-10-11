import { Component, OnInit, Input } from '@angular/core';
import { RsnService } from '../../../services/rsn.service';
import { Observable, combineLatest, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  @Input() account;
  accountTables$: Observable<any[]>;

  constructor(
    private rsnService: RsnService
  ) { }

  ngOnInit() {
    if (this.account && this.account.abi && this.account.abi.tables) {
      const table$s: Observable<any>[] = this.account.abi.tables.map(table => {
        return from(
          this.rsnService.rsn.getTableRows(true, this.account.name, this.account.name, table.name, table.key_names[0])
        ).pipe(
          map(tableRows => ({ ...table, ...tableRows }))
        );
      });
      this.accountTables$ = combineLatest(table$s);
    }
  }

}
