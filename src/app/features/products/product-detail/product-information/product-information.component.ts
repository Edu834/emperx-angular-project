import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
 imports: [CommonModule],
})
export class AccordionComponent {
  items = [
    {
      title: 'Product information',
      content: 'Detailed information about the product, its fabric, and fit.',
      open: false
    },
    {
      title: 'Shipping & returns',
      content: 'Standard shipping in 2–4 days. Returns accepted within 15 days.',
      open: false
    },
    {
      title: 'Our packaging',
      content: 'We use 100% reusable and recyclable packaging for all orders.',
      open: false
    }
  ];

  toggle(index: number) {
    this.items[index].open = !this.items[index].open;
  }
}
