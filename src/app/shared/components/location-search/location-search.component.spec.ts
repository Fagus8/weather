import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LocationSearchComponent } from './location-search.component';

describe('LocationSearchComponent', () => {
  let component: LocationSearchComponent;
  let fixture: ComponentFixture<LocationSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, TranslateModule.forRoot()],
      declarations: [LocationSearchComponent],
      schemas: [NO_ERRORS_SCHEMA] // შიდა კომპონენტები ტესტში არ გვჭირდება
    });
    fixture = TestBed.createComponent(LocationSearchComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
