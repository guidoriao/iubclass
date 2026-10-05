import { Component, computed, signal, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { TarjetaProducto, Producto } from './tarjeta-producto';
import { ResumenPedido, Linea } from './resumen-pedido';

registerLocaleData(localeEsCo);

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [TarjetaProducto, ResumenPedido],
  providers: [{ provide: LOCALE_ID, useValue: 'es-CO' }],
  template: `
    <div style="padding: 1rem; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
      <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: #0f172a;">
        Realizar Pedido
      </h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h2 style="font-size: 1.125rem; font-weight: bold;">Productos Disponibles</h2>
          @for (prod of productos; track prod.nombre) {
            <app-tarjeta-producto
              [producto]="prod"
              [enPedido]="unidadesPorProducto()[prod.nombre] || 0"
              (agregar)="agregarProducto($event)" />
          }
        </div>

        <div>
          <app-resumen-pedido
            [lineas]="lineas()"
            (quitar)="quitarLinea($event)" />
        </div>
      </div>
    </div>
  `
})
export class Pedido {
  productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 }
  ];

  pedido = signal<{ [nombre: string]: number }>({});

  lineas = computed<Linea[]>(() => {
    const estado = this.pedido();
    return Object.keys(estado)
      .map(nombre => {
        const prod = this.productos.find(p => p.nombre === nombre);
        if (!prod) return null;
        return {
          nombre: prod.nombre,
          precio: prod.precio,
          cantidad: estado[nombre]
        };
      })
      .filter((l): l is Linea => l !== null && l.cantidad > 0);
  });

  unidadesPorProducto = computed(() => this.pedido());

  agregarProducto(nombre: string) {
    this.pedido.update(prev => {
      const actual = prev[nombre] || 0;
      return {
        ...prev,
        [nombre]: actual + 1
      };
    });
  }

  quitarLinea(nombre: string) {
    this.pedido.update(prev => {
      const nuevo = { ...prev };
      delete nuevo[nombre];
      return nuevo;
    });
  }
}