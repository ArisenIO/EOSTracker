import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { RixService } from '../../services/rix.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  apiEndpoint$;
  result$;

  constructor(
    private rixService: RixService
  ) { }

  ngOnInit() {
    this.apiEndpoint$ = this.rixService.apiEndpoint$;
  }

  getInfo() {
    this.result$ = from(this.rixService.rix.getInfo({}));
  }

  getBlock(block_num_or_id: number) {
    this.result$ = from(this.rixService.rix.getBlock(block_num_or_id));
  }

}
