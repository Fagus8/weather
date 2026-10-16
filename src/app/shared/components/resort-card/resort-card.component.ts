import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Resort, ResortWeather } from '../../../core/models/weather.model';
import { formatTemp, iconUrl } from '../../../core/utils/format';
import { wmoToIcon, wmoToKey } from '../../../core/utils/weather-codes';

@Component({
  selector: 'app-resort-card',
  templateUrl: './resort-card.component.html',
  styleUrls: ['./resort-card.component.css']
})
export class ResortCardComponent {
  @Input() resort!: Resort;
  @Input() weather?: ResortWeather; // სანამ ჩაიტვირთება, undefined-ია
  @Input() failed = false;

  constructor(private translate: TranslateService) {}

  // მიმდინარე ენა, რომ resort.name[lang] ავიღოთ
  get lang(): Language {
    return this.translate.currentLang as Language;
  }

  formatTemp(temp: number) { return formatTemp(temp); }
  weatherKey(code: number) { return wmoToKey(code); }
  icon(weather: ResortWeather) { return iconUrl(wmoToIcon(weather.weatherCode, weather.isDay)); }
}
