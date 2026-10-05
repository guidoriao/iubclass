import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; background: #f8fafc;">
      <h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Resumen del Pedido</h2>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
          <tr style="border-bottom: 2px solid #cbd5e1; text-align: left;">
            <th style="padding: 8px;">Producto</th>
            <th style="padding: 8px; text-align: center;">Cant.</th>
            <th style="padding: 8px; text-align: right;">Precio</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
            <th style="padding: 8px; text-align: center;">Acción</th>
          </tr>
        </thead>
        <tbody>
          @for (linea of lineas(); track linea.nombre) {
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px;">{{ linea.nombre }}</td>
              <td style="padding: 8px; text-align: center;">{{ linea.cantidad }}</td>
              <td style="padding: 8px; text-align: right;">
                {{ linea.precio | currency:'COP':'symbol-narrow':'1.0-0' }}
              </td>
              <td style="padding: 8px; text-align: right;">
                {{ (linea.precio * linea.cantidad) | currency:'COP':'symbol-narrow':'1.0-0' }}
              </td>
              <td style="padding: 8px; text-align: center;">
                <button
                  (click)="quitar.emit(linea.nombre)"
                  style="background-color: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                  Quitar
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" style="padding: 1rem; text-align: center; color: #64748b; font-style: italic;">
                El pedido está vacío
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid #cbd5e1; padding-top: 0.75rem;">
        <div style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <strong>{{ subtotal() | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Domicilio:</span>
          <strong>
            @if (lineas().length === 0) {
              —
            } @else if (domicilio() === 0) {
              Gratis
            } @else {
              {{ domicilio() | currency:'COP':'symbol-narrow':'1.0-0' }}
            }
          </strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.125rem; color: #1e293b; border-top: 2px solid #0f172a; padding-top: 0.5rem;">
          <span>Total:</span>
          <strong>{{ total() | currency:'COP':'symbol-narrow':'1.0-0' }}</strong>
        </div>
      </div>
    </div>
  `
})
export class ResumenPedido {
  lineas = input.required<Linea[]>();
  quitar = output<string>();

  subtotal = computed(() =>
    this.lineas().reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  );

  domicilio = computed(() => {
    if (this.lineas().length === 0) return 0;
    return this.subtotal() >= 20000 ? 0 : 3000;
  });

  total = computed(() => {
    if (this.lineas().length === 0) return 0;
    return this.subtotal() + this.domicilio();
  });
}