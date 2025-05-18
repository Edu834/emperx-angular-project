import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqs = [
    {
      question: 'What if the garment doesn’t fit me?',
      answer: 'We know picking the right size can be tricky. That’s why we offer free size exchanges (subject to availability) if you notify us within the first 24 hours after receiving the garment. You can also add a discounted backup item to your order, just in case.',
      isOpen: false,
    },
    {
      question: 'How long is the rental period?',
      answer: 'The standard rental period is 4 days, starting from the delivery date until the return date. You can also extend your rental up to 8 days for an additional fee, which you can select during checkout.',
      isOpen: false,
    },
    {
      question: 'How do I receive and return the items?',
      answer: 'We’ll ship the garment directly to your preferred address in reusable packaging. Inside, you’ll find a prepaid return label. Just repack the item in the same box, attach the label, and drop it off at your nearest shipping location.',
      isOpen: false,
    },
    {
      question: 'Do I need to wash the clothes before returning them?',
      answer: 'No need! All garments go through a professional cleaning and sanitizing process after every use. We kindly ask that you don’t attempt to wash them yourself to avoid damage.',
      isOpen: false,
    },
    {
      question: 'What if I accidentally damage the garment?',
      answer: 'We include basic coverage for minor damage (like small tears, stains, or loose buttons). If the damage is significant or beyond repair, an additional fee may apply based on the garment’s value and the type of damage.',
      isOpen: false,
    },
    {
      question: 'Can I cancel a reservation?',
      answer: 'Yes, you can cancel your reservation free of charge up to 15 days before the scheduled delivery date. If you cancel with fewer than 15 days’ notice, a 50% fee will apply. Cancellations made within 72 hours are non-refundable.',
      isOpen: false,
    },
  ];

  toggle(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
