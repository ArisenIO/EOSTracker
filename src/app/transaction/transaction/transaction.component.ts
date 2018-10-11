import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RsnService } from '../../services/rsn.service';
import { Result } from '../../models';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  transaction$: Observable<Result<any>>;

  constructor(
    private route: ActivatedRoute,
    private rsnService: RsnService
  ) { }

  ngOnInit() {
    this.transaction$ = this.route.params.pipe(
      switchMap(params => this.rsnService.getTransactionRaw(+params.blockId, params.id))
    );
  }

}
