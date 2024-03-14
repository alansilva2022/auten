import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultausuarioComponent } from './consultausuario.component';

describe('ConsultausuarioComponent', () => {
  let component: ConsultausuarioComponent;
  let fixture: ComponentFixture<ConsultausuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultausuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultausuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
