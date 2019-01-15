import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCounterDialogComponent } from './modify-counter-dialog.component';

describe('ModifyCounterDialogComponent', () => {
  let component: ModifyCounterDialogComponent;
  let fixture: ComponentFixture<ModifyCounterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyCounterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCounterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
