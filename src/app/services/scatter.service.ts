import {Injectable} from '@angular/core';
import * as Rix from '@arisencore/api';
import {LocalStorage} from 'ngx-webstorage';

@Injectable()
export class ScatterService {
  @LocalStorage()
  identity: any;
  rix: any;
  scatter: any;
  network: any;

  load() {
    this.scatter = (<any>window).scatter;

    this.network = {
      blockchain: 'rix',
      host: 'api1.rixdublin.io',
      port: 443,
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    };
    if (this.scatter) {
      this.rix = this.scatter.rix(this.network, Rix, {chainId: this.network.chainId}, 'https');
    }
  }

  login() {
    this.load();
    const requirements = {accounts: [this.network]};
    if (!this.scatter) {
      alert("You need to install Scatter to use the form.");
      return;
    }
    return this.scatter.getIdentity(requirements);
  }

  logout() {
    this.scatter.forgetIdentity();
  }

  isLoggedIn() {
    return this.scatter && !!this.scatter.identity;
  }

  accountName() {
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'rix');
    return account.name;
  }

  support(amount: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'rix');
    return this.rix.transfer(account.name, 'trackeraegis', amount + " RIX", 'Aegis Support');
  }

  refund() {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'rix');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.rix.contract('trackeraegis').then(contract => contract.refund(account.name, options));
  }
}
