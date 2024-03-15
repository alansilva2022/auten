import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultartrasacaoComponent } from './consultartrasacao.component';

describe('ConsultartrasacaoComponent', () => {
  let component: ConsultartrasacaoComponent;
  let fixture: ComponentFixture<ConsultartrasacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultartrasacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultartrasacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
