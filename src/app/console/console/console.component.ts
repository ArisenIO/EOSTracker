import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { RsnService } from '../../services/rsn.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  apiEndpoint$;
  result$;

  constructor(
    private rsnService: RsnService
  ) { }

  ngOnInit() {
    this.apiEndpoint$ = this.rsnService.apiEndpoint$;
  }

  getInfo() {
    this.result$ = from(this.rsnService.rsn.getInfo({}));
  }

  getBlock(block_num_or_id: number) {
    this.result$ = from(this.rsnService.rsn.getBlock(block_num_or_id));
  }

}
