import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; background: #ffffff;">
      <h3 style="font-weight: bold; margin-bottom: 0.5rem; color: #0f172a;">{{ producto().nombre }}</h3>
      <p style="color: #475569; margin-bottom: 0.25rem;">
        Precio: {{ producto().precio | currency:'COP':'symbol-narrow':'1.0-0' }}
      </p>
      <p style="font-size: 0.875rem; color: #64748b; margin-bottom: 1rem;">
        Disponibles: {{ disponibles() }}
      </p>
      <button
        (click)="agregar.emit(producto().nombre)"
        [disabled]="disponibles() === 0"
        style="padding: 6px 12px; border-radius: 4px; background-color: #2563eb; color: white; border: none; cursor: pointer;"
        [style.opacity]="disponibles() === 0 ? '0.5' : '1'"
        [style.cursor]="disponibles() === 0 ? 'not-allowed' : 'pointer'">
        Agregar
      </button>
    </div>
  `
})
export class TarjetaProducto {
  producto = input.required<Producto>();
  enPedido = input<number>(0);
  disponibles = computed(() => this.producto().existencias - this.enPedido());
  agregar = output<string>();
}