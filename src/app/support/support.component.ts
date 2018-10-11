import {Component, OnInit} from '@angular/core';
import {RsnService} from '../services/rsn.service';
import {ArkIdService} from '../services/arkid.service';
import {timer} from 'rxjs/index';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.1.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  public history = null;
  public patrons = null;
  public info = null;
  public amount = 5;
  public alive = false;
  public showConfetti = true;

  readonly contract = "trackeraegis";

  constructor(private rsnService: RsnService,
              private arkidService: ArkIdService) {
  }

  ngOnInit() {
    this.arkidService.load();
    this.loadTables();
  }

  loadTables() {
    this.patrons = null;
    this.history = null;
    this.info = null;
    this.alive = false;

    this.rsnService.rsn.getTableRows(
      {
        json: true,
        code: this.contract,
        scope: this.contract,
        table: "history",
        limit: 500
      }
    ).then(result => {
      this.history = result.rows.sort(this.compare);
    });


    this.rsnService.rsn.getTableRows(
      {
        json: true,
        code: this.contract,
        scope: this.contract,
        table: "patrons",
        limit: 500
      }
    ).then(result => {
      this.patrons = result.rows.sort(this.compare);
    });

    this.rsnService.rsn.getTableRows(
      {
        json: true,
        code: this.contract,
        scope: this.contract,
        table: "global",
        limit: 1
      }
    ).then(result => {
      this.info = result.rows[0];
    });
  }

  isLogged() {
    return this.arkidService.isLoggedIn();
  }

  refund() {
    this.alive = true;
    this.arkidService.refund().then(transaction => {
      timer(0, 3000).pipe(
        takeWhile(() => this.alive)
      ).subscribe(() => {
        this.rsnService.getDeferTransaction(transaction.transaction_id).subscribe(data => {
          if (data) {
            this.loadTables();
          }
        });
      });

    }).catch(error => {
      alert('Something was wrong with refund.');
      console.log(error);
      this.loadTables();
    });
  }

  support(amount: string) {
    this.alive = true;
    this.arkidService.support(parseFloat(amount).toFixed(4)).then(transaction => {
      console.log(transaction);
      timer(0, 3000).pipe(
        takeWhile(() => this.alive)
      ).subscribe(() => {
        this.rsnService.getDeferTransaction(transaction.transaction_id).subscribe(data => {
          if (data) {

            let confettiSettings = {
              'target': 'confetti-holder',
              'max': '140',
              'size': '2',
              'animate': true,
              'props': ['circle', 'square', 'triangle', 'line'],
              'colors': [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
              'clock': '35',
              'width': '1440',
              'height': '702'
            };

            let confetti = new window.ConfettiGenerator(confettiSettings);
            confetti.render();
            this.showConfetti = true;

            timer(7000, 0).pipe(
              takeWhile(() => this.showConfetti)
            ).subscribe(() => {
              confetti.clear();
              this.showConfetti = false;
            });

            this.loadTables();
          }
        });
      });

    }).catch(error => {
      alert('Something was wrong with transfer.');
      console.log(error);
      this.loadTables();
    });
  }

  login() {
    this.arkidService.login();
  }


  private compare(a, b) {
    if (a.balance > b.balance) {
      return -1;
    }
    if (a.balance < b.balance) {
      return 1;
    }
    return 0;
  }
}
