import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RsnService } from './rsn.service';
import { Observable, Subject, timer, from, forkJoin, of } from 'rxjs';
import { map, filter, share, withLatestFrom, switchMap, catchError, take } from 'rxjs/operators';

const RSN_QUOTE = 60000;
const RAM_QUOTE = 60000;
const GET_INFO_INTERVAL = 5000;

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private latestBlockNumberSource = new Subject<number>();

  latestBlockNumber$ = this.latestBlockNumberSource.asObservable();
  isMaintenance$: Observable<boolean>;
  rsnQuote$: Observable<any>;
  ramQuote$: Observable<any>;
  info$: Observable<any>;
  latestBlock$: Observable<any>;
  recentBlocks$: Observable<any[]>;
  recentTransactions$: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private rsnService: RsnService
  ) {
    this.info$ = timer(0, GET_INFO_INTERVAL).pipe(
      switchMap(() => this.rsnService.getDeferInfo()),
      share()
    );
    this.latestBlock$ = this.info$.pipe(
      switchMap((info: any) => from(this.rsnService.getDeferBlock(info.head_block_num))),
      share()
    );
    this.recentBlocks$ = this.latestBlock$.pipe(
      switchMap((block: any) => {
        const blockNumber: number = block.block_num;
        const blockNumbers: number[] = [blockNumber - 1, blockNumber - 2, blockNumber - 3, blockNumber - 4];
        const blockNumbers$: Observable<any>[] = blockNumbers.map(blockNum => this.rsnService.getDeferBlock(blockNum).pipe(catchError(() => of(null))));
        return forkJoin(blockNumbers$).pipe(
          map((blocks) => [block, ...blocks].filter(block => block !== null))
        );
      }),
      share()
    );
    this.recentTransactions$ = this.recentBlocks$.pipe(
      map((blocks: any[]) => {
        return blocks.reduce((previous, current) => {
          const transactions = current.transactions.map(transaction => {
            return {
              ...transaction,
              block_num: current.block_num,
              trx: typeof transaction.trx === 'string' ? { id: transaction.trx } : transaction.trx
            };
          })
          return previous.concat(transactions);
        }, []);
      }),
      share()
    );
    this.isMaintenance$ = this.info$.pipe(
      withLatestFrom(this.latestBlockNumber$),
      map(([chainStatus, blockNumber]) => {
        return (chainStatus.head_block_num - blockNumber) > 600;
      }),
      share()
    );
    this.rsnQuote$ = timer(0, RSN_QUOTE).pipe(
      switchMap(() => this.getRSNTicker()),
      filter(ticker => !!ticker.data),
      map(ticker => ticker.data),
      share()
    );
    this.ramQuote$ = timer(0, RAM_QUOTE).pipe(
      switchMap(() => from(this.rsnService.rsn.getTableRows({
        json: true,
        code: "arisen",
        scope: "arisen",
        table: "rammarket"
      }))),
      filter((data: any) => data.rows && data.rows.length),
      map(data => data.rows[0]),
      map(data => {
        const base = Number(data.base.balance.replace('RAM', ''));
        const quote = Number(data.quote.balance.replace('RSN', ''));
        return {
          ...data,
          price: quote / base
        };
      }),
      share()
    );
  }

  getBlocks(blockNumber?: number, limit = 10): Observable<any[]> {
    let blockNumber$: Observable<number>;
    if (blockNumber) {
      blockNumber$ = of(blockNumber);
    } else {
      blockNumber$ = this.info$.pipe(
        take(1),
        map(info => info.head_block_num)
      );
    }
    return blockNumber$.pipe(
      switchMap(blockNumber => {
        let blockNumbers: number[] = [];
        for (let i = blockNumber; i > blockNumber - limit && i > 0; i--) {
          blockNumbers.push(i);
        }
        const blockNumbers$: Observable<any>[] = blockNumbers.map(blockNumber => {
          return this.rsnService.getDeferBlock(blockNumber).pipe(
            catchError(() => of(null))
          );
        });
        return forkJoin(blockNumbers$).pipe(
          map(blocks => blocks.filter(block => block !== null))
        );
      })
    );
  }

  getTokens(): Observable<any[]> {
    return this.http.get<any[]>(`https://raw.githubusercontent.com/arisenio/arisen-airdrops/master/tokens.json`);
  }

  getRSNTicker(): Observable<CMCTicker> {
    // let url = 'https://api.coinmarketcap.com/v2/ticker/1765/';
    let url1 = 'https://nv6khovry9.execute-api.us-east-1.amazonaws.com/dev/get_arisen_price'
      console.log(this.http.get<CMCTicker>(url1))
      return this.http.get<CMCTicker>(url1);
  }

  getBpJson(url: string): Observable<any> {
    return this.http.get<any>(`${url}/bp.json`);
  }

  setLatestBlockNumber(blockNumber: number) {
    if (blockNumber) {
      this.latestBlockNumberSource.next(blockNumber);
    }
  }

}

export interface CMCTicker {
  data?: {
    // name: string;
    // symbol: string;
    // quotes: {
      USD: {
        price: number,
        // market_cap: number,
        volume24: number
      }
    // }
  };
  metadata?: any
}
