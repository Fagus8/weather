import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { WeatherService } from '../../../core/services/weather.service';
import { City } from '../../../core/models/weather.model';

// ადგილის ძებნა საქართველოში (ლაივ სერჩი). არჩეულ ადგილს მშობელ კომპონენტს გადავცემთ,
// ის კი რუკაზე აჩვენებს.
@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  @Output() placeSelected = new EventEmitter<City>();

  searchText = '';
  suggestions: City[] = [];
  showSuggestions = false;
  searching = false;
  activeIndex = -1;
  message = ''; // შეცდომის ტექსტის გასაღები, მაგ. STATUS.EMPTY_SEARCH
  private searchText$ = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // ლაივ სერჩი: ველოდებით 400ms-ს, და ძველ მოთხოვნას ვაუქმებთ, თუ ახალი ტექსტი მოვიდა
    this.searchSub = this.searchText$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(text => {
        if (text.length < 2) {
          return of([]);
        }
        this.searching = true;
        // catchError საჭიროა, თორემ ერთი შეცდომის შემდეგ ძებნა საერთოდ გაჩერდება
        return this.weatherService.searchPlaces(text, this.translate.currentLang).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(places => {
      this.searching = false;
      this.suggestions = places;
      this.activeIndex = -1;
      this.message = '';
      this.showSuggestions = this.searchText.trim().length >= 2;
    });  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }

  onSearchChange() {
    this.message = '';
    if (this.searchText.trim().length < 2) {
      this.showSuggestions = false;
    }
    this.searchText$.next(this.searchText.trim());
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && this.showSuggestions) {
      event.preventDefault();
      if (this.activeIndex < this.suggestions.length - 1) this.activeIndex++;
    } else if (event.key === 'ArrowUp' && this.showSuggestions) {
      event.preventDefault();
      if (this.activeIndex > 0) this.activeIndex--;
    } else if (event.key === 'Enter') {
      this.onEnter();
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
      this.message = '';
    }
  }

  onEnter() {
    const text = this.searchText.trim();
    if (!text) {
      this.showMessage('STATUS.EMPTY_SEARCH');
      return;
    }

    // თუ სია უკვე ჩანს, ვირჩევთ მონიშნულს ან პირველს
    if (this.showSuggestions && this.suggestions.length > 0) {
      this.selectPlace(this.suggestions[this.activeIndex >= 0 ? this.activeIndex : 0]);
      return;
    }

    // სია ჯერ არ ჩამოსულა (მაგ. სწრაფად დააჭირეს Enter-ს), ამიტომ პირდაპირ ვეძებთ
    this.searching = true;
    this.weatherService.searchPlaces(text, this.translate.currentLang).subscribe({
      next: places => {
        this.searching = false;
        if (places.length > 0) {
          this.selectPlace(places[0]);
        } else {
          this.showMessage('STATUS.PLACE_NOT_FOUND');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.searching = false;
        this.showMessage(err.status === 0 ? 'STATUS.NO_INTERNET' : 'STATUS.UNKNOWN');
      }
    });
  }

  selectPlace(place: City) {
    this.clearSearch();
    this.placeSelected.emit(place);
  }

  clearSearch() {
    this.searchText = '';
    this.searchText$.next('');
    this.suggestions = [];
    this.showSuggestions = false;
    this.message = '';
  }

  showMessage(key: string) {
    this.message = key;
    this.showSuggestions = false;
  }

  // სიის გარეთ დაჭერისას სია იხურება
  @HostListener('document:click', ['$event'])
  onPageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-box')) {
      this.showSuggestions = false;
      this.message = '';
    }
  }
}
