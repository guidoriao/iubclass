import { Component, computed, signal, LOCALE_ID } from '@angular/core';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { UnidadesPipe } from './pipes/unidades';

registerLocaleData(localeEsCo);

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

interface ProductoFila extends Producto {
  estado: 'agotado' | 'bajo' | 'disponible';
}

@Component({
  selector: 'app-taller02',
  imports: [CurrencyPipe, DatePipe, UnidadesPipe],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  template: `
    <div style="padding: 1rem; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
      <h1>Inventario · {{ hoy | date:'fullDate' }}</h1>

      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        @for (cat of categorias; track cat) {
          <button 
            (click)="filtro.set(cat)"
            [style.background-color]="filtro() === cat ? '#2563eb' : '#f1f5f9'"
            [style.color]="filtro() === cat ? '#ffffff' : '#0f172a'"
            style="padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer;">
            {{ cat }}
          </button>
        }
      </div>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #e2e8f0;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Producto</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Precio</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Existencias</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (prod of filas(); track prod.nombre) {
            <tr [class.agotado]="prod.estado === 'agotado'" style="border-bottom: 1px solid #cbd5e1;">
              <td style="border: 1px solid #cbd5e1; padding: 8px;">{{ prod.nombre }}</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">
                {{ prod.precio | currency:'COP':'symbol-narrow':'1.0-0' }}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">{{ prod.cantidad | unidades }}</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px;">
                @switch (prod.estado) {
                  @case ('agotado') {
                    <span style="color: #dc2626; font-weight: bold;">agotado</span>
                  }
                  @case ('bajo') {
                    <span style="color: #d97706; font-weight: bold;">bajo</span>
                  }
                  @case ('disponible') {
                    <span style="color: #16a34a; font-weight: bold;">disponible</span>
                  }
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" style="padding: 16px; text-align: center; color: #64748b; font-style: italic;">
                No hay productos en esta categoría
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .agotado {
      background-color: #fee2e2 !important;
    }
  `]
})
export class Taller02 {
  hoy = new Date();
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];
  filtro = signal('Todas');

  productos = signal<Producto[]>([
    { nombre: 'Mango', categoria: 'Frutas', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas', precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas', precio: 6500, cantidad: 2 },
    { nombre: 'Tomate', categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 }
  ]);

  visibles = computed(() => {
    const f = this.filtro();
    if (f === 'Todas') {
      return this.productos();
    }
    return this.productos().filter(p => p.categoria === f);
  });

  filas = computed<ProductoFila[]>(() => {
    return this.visibles().map(p => {
      let estado: 'agotado' | 'bajo' | 'disponible';
      if (p.cantidad === 0) {
        estado = 'agotado';
      } else if (p.cantidad <= 2) {
        estado = 'bajo';
      } else {
        estado = 'disponible';
      }
      return { ...p, estado };
    });
  });
}