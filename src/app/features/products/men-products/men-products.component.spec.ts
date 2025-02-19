import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenProductsComponent } from './men-products.component';

describe('MenProductsComponent', () => {
  let component: MenProductsComponent;
  let fixture: ComponentFixture<MenProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
