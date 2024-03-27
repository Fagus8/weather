import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherMapComponent } from './weather-map.component';

describe('WeatherMapComponent', () => {
  let component: WeatherMapComponent;
  let fixture: ComponentFixture<WeatherMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherMapComponent]
    });
    fixture = TestBed.createComponent(WeatherMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
