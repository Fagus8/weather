import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CityComponent } from './city.component';
import { formatTemp } from '../../core/utils/format';

describe('CityComponent', () => {
  let component: CityComponent;
  let fixture: ComponentFixture<CityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, TranslateModule.forRoot()],
      declarations: [CityComponent],
      schemas: [NO_ERRORS_SCHEMA] // შიდა კომპონენტები ტესტში არ გვჭირდება
    });
    fixture = TestBed.createComponent(CityComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('formatTemp', () => {
  it('should not show -0°', () => {
    expect(formatTemp(-0.3)).toBe('0°');
  });
});
