import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RixService } from '../../services/rix.service';
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
    private rixService: RixService
  ) { }

  ngOnInit() {
    this.transaction$ = this.route.params.pipe(
      switchMap(params => this.rixService.getTransactionRaw(+params.blockId, params.id))
    );
  }

}
