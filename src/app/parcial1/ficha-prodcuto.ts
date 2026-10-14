import { Component, input, output, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-ficha',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div style="border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 10px; border-radius: 8px; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 1.125rem;">{{ producto().nombre }}</h3>
      <p style="margin: 4px 0; color: #475569;">Precio: {{ producto().precio | currency:'COP':'symbol':'1.0-0' }}</p>
      <p style="margin: 4px 0; color: #475569;">Existencias: {{ producto().existencias }}</p>
      <p style="margin: 4px 0 12px 0;">Estado: 
        @switch (estado()) {
          @case ('Agotado') { <strong style="color: #ef4444;">Agotado</strong> }
          @case ('Inventario bajo') { <strong style="color: #f59e0b;">Inventario bajo</strong> }
          @case ('Disponible') { <strong style="color: #10b981;">Disponible</strong> }
        }
      </p>
      <!-- Aquí están los estilos del botón -->
      <button 
        [disabled]="producto().existencias === 0" 
        (click)="onRetirar()"
        [style.background-color]="producto().existencias === 0 ? '#cbd5e1' : '#fbbf24'"
        [style.color]="producto().existencias === 0 ? '#64748b' : '#0f172a'"
        [style.cursor]="producto().existencias === 0 ? 'not-allowed' : 'pointer'"
        style="font-weight: bold; padding: 6px 16px; border-radius: 6px; border: none; transition: background-color 0.2s;">
        Retirar 1
      </button>
    </div>
  `
})
export class FichaProducto {
  producto = input.required<Producto>();
  retirar = output<string>();

  estado = computed(() => {
    const ex = this.producto().existencias;
    if (ex === 0) return 'Agotado';
    if (ex < 3) return 'Inventario bajo';
    return 'Disponible';
  });

  onRetirar() {
    this.retirar.emit(this.producto().nombre);
  }
}