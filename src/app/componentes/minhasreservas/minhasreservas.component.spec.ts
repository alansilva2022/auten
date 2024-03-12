import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasreservasComponent } from './minhasreservas.component';

describe('MinhasreservasComponent', () => {
  let component: MinhasreservasComponent;
  let fixture: ComponentFixture<MinhasreservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasreservasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinhasreservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
