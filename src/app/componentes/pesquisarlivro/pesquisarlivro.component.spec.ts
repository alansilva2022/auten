import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarlivroComponent } from './pesquisarlivro.component';

describe('PesquisarlivroComponent', () => {
  let component: PesquisarlivroComponent;
  let fixture: ComponentFixture<PesquisarlivroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarlivroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisarlivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
