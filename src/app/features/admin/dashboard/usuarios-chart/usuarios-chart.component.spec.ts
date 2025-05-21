import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosChartComponent } from './usuarios-chart.component';

describe('UsuariosChartComponent', () => {
  let component: UsuariosChartComponent;
  let fixture: ComponentFixture<UsuariosChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
