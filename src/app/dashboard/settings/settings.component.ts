import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from 'ngx-webstorage';
import { take } from 'rxjs/operators';
import { RsnService } from '../../services/rsn.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @LocalStorage() language: string;
  languages = LANGUAGES;
  apis = APIS;
  languageControl: FormControl;
  apiControl: FormControl;

  constructor(
    private translate: TranslateService,
    private rsnService: RsnService
  ) { }

  ngOnInit() {
    // initialize language select control
    this.languageControl = new FormControl();
    // set initial language select control value with LocalStorage value
    this.languageControl.setValue(this.language);
    // subscribe to language select control value change
    this.languageControl.valueChanges.subscribe(language => {
      this.language = language;
      this.translate.use(language);
    });

    // setup api control
    this.apiControl = new FormControl();
    this.rsnService.apiEndpoint$.pipe(
      take(1)
    ).subscribe(apiEndpoint => {
      this.apiControl.setValue(apiEndpoint);
    });
    this.apiControl.valueChanges.subscribe(apiEndpoint => {
      this.rsnService.setApiEndpoint(apiEndpoint);
    });
  }

}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hr', name: 'Croatian' },
  { code: 'it', name: 'Italian' },
  { code: 'ko', name: 'Korean' },
  { code: 'de', name: 'German' },
  { code: 'dk', name: 'Danish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'zh', name: 'Chinese' }
];

export const APIS = [
  { name: 'Arisen Dublin', endpoint: 'https://greatchains.arisennodes.io' },
  { name: 'Arisen New York', endpoint: 'https://greatchains.arisennodes.io' },
  { name: 'Arisen Great Chain', endpoint: 'https://greatchains.arisennodes.io' },
  { name: 'Arisen Liberty', endpoint: 'https://greatchains.arisennodes.io' }
]
