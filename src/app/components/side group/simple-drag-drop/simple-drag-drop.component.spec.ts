import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDragDropComponent } from './simple-drag-drop.component';

describe('SimpleDragDropComponent', () => {
  let component: SimpleDragDropComponent;
  let fixture: ComponentFixture<SimpleDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleDragDropComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
