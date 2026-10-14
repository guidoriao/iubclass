import { Component, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FichaProducto, Producto } from './ficha-prodcuto';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FichaProducto, CurrencyPipe],
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2>Inventario de Periféricos</h2>
      
      <div style="background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
        <p><strong>Valor total:</strong> {{ valorTotal() | currency:'COP':'symbol':'1.0-0' }}</p>
        <p><strong>Unidades totales:</strong> {{ unidadesTotales() }}</p>
        <p><strong>Agotados:</strong> {{ agotados() }}</p>
        <button (click)="vaciar()" style="background: #e74c3c; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">
          Vaciar lista
        </button>
      </div>

      <div>
        @for (prod of lista(); track prod.nombre) {
          <app-ficha [producto]="prod" (retirar)="retirarProducto($event)"></app-ficha>
        } @empty {
          <p style="color: #555; font-style: italic;">No hay productos para mostrar</p>
        }
      </div>
    </div>
  `
})
export class Inventario {
  // Signal con la tabla 1
  lista = signal<Producto[]>([
    { nombre: 'Teclado', precio: 38000, existencias: 6 },
    { nombre: 'Ratón', precio: 22000, existencias: 0 },
    { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
    { nombre: 'Cable de red', precio: 6500, existencias: 12 }
  ]);

  valorTotal = computed(() => 
    this.lista().reduce((acc, p) => acc + (p.precio * p.existencias), 0)
  );

  unidadesTotales = computed(() => 
    this.lista().reduce((acc, p) => acc + p.existencias, 0)
  );

  agotados = computed(() => 
    this.lista().filter(p => p.existencias === 0).length
  );

  retirarProducto(nombre: string) {
    this.lista.update(productos =>
      productos.map(p =>
        p.nombre === nombre ? { ...p, existencias: p.existencias - 1 } : p
      )
    );
  }

  vaciar() {
    this.lista.set([]);
  }
}