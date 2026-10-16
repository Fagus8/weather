import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ResortCardComponent } from './resort-card.component';
import { RESORTS } from '../../../data/resorts';

describe('ResortCardComponent', () => {
  let component: ResortCardComponent;
  let fixture: ComponentFixture<ResortCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, TranslateModule.forRoot()],
      declarations: [ResortCardComponent],
      schemas: [NO_ERRORS_SCHEMA] // შიდა კომპონენტები ტესტში არ გვჭირდება
    });
    fixture = TestBed.createComponent(ResortCardComponent);
    component = fixture.componentInstance;
    component.resort = RESORTS[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
