import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {
  languages = [
    { code: 'ka', label: 'ქარ' },
    { code: 'en', label: 'ENG' },
    { code: 'ru', label: 'РУС' }
  ];

  constructor(public translate: TranslateService) {}

  // ეს კომპონენტი ყოველთვის ჰედერშია, ამიტომ საიტის გახსნისას ენას აქ ვაყენებთ
  ngOnInit(): void {
    const saved = localStorage.getItem('language');
    this.changeLanguage(saved === 'en' || saved === 'ru' ? saved : 'ka');
  }

  changeLanguage(code: string) {
    this.translate.use(code); // ტექსტები გვერდის გადატვირთვის გარეშე იცვლება
    localStorage.setItem('language', code);
    document.documentElement.lang = code; // <html lang="...">
  }
}
