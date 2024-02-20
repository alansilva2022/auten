import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaoautorizadoComponent } from './naoautorizado.component';

describe('NaoautorizadoComponent', () => {
  let component: NaoautorizadoComponent;
  let fixture: ComponentFixture<NaoautorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoautorizadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NaoautorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
