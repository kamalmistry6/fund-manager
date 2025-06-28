import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotExpensesComponent } from './allot-expenses.component';

describe('AllotExpensesComponent', () => {
  let component: AllotExpensesComponent;
  let fixture: ComponentFixture<AllotExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
