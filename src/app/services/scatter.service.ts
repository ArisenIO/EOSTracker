import {Injectable} from '@angular/core';
import * as Rsn from 'arisenjsv1';
import {LocalStorage} from 'ngx-webstorage';

@Injectable()
export class ArkIdService {
  @LocalStorage()
  identity: any;
  rsn: any;
  arkid: any;
  network: any;

  load() {
    this.arkid = (<any>window).arkid;

    this.network = {
      blockchain: 'rsn',
      host: 'greatchain.arisennodes.io',
      port: 443,
      chainId: 'fffa80dc4492fedaa90cbc4ee6f5520568826dfb31ed9c8c161224349f6b82f5'
    };
    if (this.arkid) {
      this.rsn = this.arkid.rsn(this.network, Rsn, {chainId: this.network.chainId}, 'https');
    }

  }

  login() {
    this.load();
    const requirements = {accounts: [this.network]};
    if (!this.arkid) {
      alert("You need to install ArisenID to use the form.");
      return;
    }
    return this.arkid.getIdentity(requirements);
  }

  logout() {
    this.arkid.forgetIdentity();
  }

  isLoggedIn() {
    return this.arkid && !!this.arkid.identity;
  }

  accountName() {
    if (!this.arkid || !this.arkid.identity) {
      return;
    }
    const account = this.arkid.identity.accounts.find(acc => acc.blockchain === 'rsn');
    return account.name;
  }

  support(amount: string) {
    this.load();
    const account = this.arkid.identity.accounts.find(acc => acc.blockchain === 'rsn');
    return this.rsn.transfer(account.name, 'aidsupport', amount + " RSN", 'ArisenID Support');
  }

  refund() {
    this.load();
    const account = this.arkid.identity.accounts.find(acc => acc.blockchain === 'rsn');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.rsn.contract('aidsupport').then(contract => contract.refund(account.name, options));
  }
}
