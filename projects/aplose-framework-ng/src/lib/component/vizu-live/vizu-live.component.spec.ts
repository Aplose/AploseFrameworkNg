import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VizuLiveComponent } from './vizu-live.component';

describe('VizuLiveComponent', () => {
  let component: VizuLiveComponent;
  let fixture: ComponentFixture<VizuLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VizuLiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VizuLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
