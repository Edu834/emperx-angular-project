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
    question: '¿Qué pasa si la prenda no me queda bien?',
    answer: 'Sabemos que elegir la talla correcta puede ser complicado. Por eso, ofrecemos cambios de talla gratuitos (sujetos a disponibilidad) si nos avisas dentro de las primeras 24 horas después de recibir la prenda. También puedes solicitar una prenda de respaldo con descuento al hacer tu pedido, por si acaso.',
    isOpen: false,
  },
  {
    question: '¿Cuánto dura el alquiler?',
    answer: 'El período estándar de alquiler es de 4 días, contando desde el día de entrega hasta el día de devolución. También ofrecemos extensiones de hasta 8 días por un coste adicional, que puedes seleccionar durante el proceso de reserva.',
    isOpen: false,
  },
  {
    question: '¿Cómo recibo y devuelvo las prendas?',
    answer: 'Te enviaremos la prenda directamente a tu dirección preferida en un empaque reutilizable. Dentro encontrarás una etiqueta de envío prepagada para la devolución. Solo necesitas volver a empacar la prenda en la misma caja, pegar la etiqueta y dejarla en la oficina de paquetería más cercana.',
    isOpen: false,
  },
  {
    question: '¿Tengo que lavar la ropa antes de devolverla?',
    answer: 'No es necesario. Todas nuestras prendas pasan por un proceso profesional de limpieza y desinfección después de cada uso. Solo te pedimos que no intentes lavarla por tu cuenta para evitar posibles daños.',
    isOpen: false,
  },
  {
    question: '¿Qué pasa si daño la prenda accidentalmente?',
    answer: 'Incluimos una cobertura básica de daños menores (como pequeños desgarros, manchas o botones sueltos). Si el daño es significativo o irreparable, podríamos aplicar un cargo adicional dependiendo del valor de la prenda y el tipo de daño.',
    isOpen: false,
  },
  {
    question: '¿Puedo cancelar una reserva?',
    answer: 'Sí, puedes cancelar tu reserva sin penalización hasta 15 días antes de la fecha de entrega programada. Si cancelas con menos de 15 días de antelación, se aplicará una tarifa del 50%. Las cancelaciones hechas con menos de 72 horas no son reembolsables.',
    isOpen: false,
  },
];


  toggle(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
