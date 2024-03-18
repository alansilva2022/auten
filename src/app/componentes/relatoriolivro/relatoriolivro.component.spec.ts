import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatoriolivroComponent } from './relatoriolivro.component';

describe('RelatoriolivroComponent', () => {
  let component: RelatoriolivroComponent;
  let fixture: ComponentFixture<RelatoriolivroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatoriolivroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatoriolivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
