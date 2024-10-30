import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalValidationComponent } from './proposal-validation.component';

describe('ProposalValidationComponent', () => {
  let component: ProposalValidationComponent;
  let fixture: ComponentFixture<ProposalValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalValidationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
