import { ComponentFixture, TestBed } from '@angular/core/testing';



describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryComponent]
    });
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
