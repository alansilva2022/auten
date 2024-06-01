import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificacaoEstrelaComponent } from './classificacao-estrela.component';

describe('ClassificacaoEstrelaComponent', () => {
  let component: ClassificacaoEstrelaComponent;
  let fixture: ComponentFixture<ClassificacaoEstrelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassificacaoEstrelaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassificacaoEstrelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
