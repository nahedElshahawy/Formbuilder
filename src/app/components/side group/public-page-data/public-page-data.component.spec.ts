import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPageDataComponent } from './public-page-data.component';

describe('PublicPageDataComponent', () => {
  let component: PublicPageDataComponent;
  let fixture: ComponentFixture<PublicPageDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPageDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
