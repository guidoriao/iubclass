import { Component, computed, signal } from '@angular/core';

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.html',
})
export class Tablero {

  vendedor = signal('Don Efraín');
  filtro = signal('');

  productos = signal<Producto[]>([
    { nombre: 'Mango', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', precio: 1200, cantidad: 8 },
    { nombre: 'Patilla', precio: 6500, cantidad: 2 },
    { nombre: 'Maracuyá', precio: 3400, cantidad: 5 },
    { nombre: 'Níspero', precio: 2900, cantidad: 4 },
  ]);

  total = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.cantidad, 0),
  );

  unidades = computed(() =>
    this.productos().reduce((suma, p) => suma + p.cantidad, 0),
  );

  visibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    if (texto === '') return this.productos();
    return this.productos().filter((p) => p.nombre.toLowerCase().includes(texto));
  });

  agotados = computed(() => 
    this.productos().filter((p) => p.cantidad === 0).length
  );

  inventarioBajo = computed(() =>
    this.productos().some((p) => p.cantidad >= 1 && p.cantidad <= 2)
  );

  masCaro = computed(() => {
    const lista = this.productos();
    if (lista.length === 0) return null;
    return lista.reduce((max, p) => (p.precio > max.precio ? p : max), lista[0]);
  });

  ordenadosPorSubtotal = computed(() =>
    [...this.productos()].sort((a, b) => b.precio * b.cantidad - a.precio * a.cantidad)
  );

  vender(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.cantidad > 0
          ? { ...p, cantidad: p.cantidad - 1 }
          : p,
      ),
    );
  }

  venderTodo(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, cantidad: 0 } : p))
    );
  }

  reabastecer(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, cantidad: p.cantidad + 10 } : p)),
    );
  }

  onFiltrar(e: Event) {
    const caja = e.target as HTMLInputElement;
    this.filtro.set(caja.value);
  }

  limpiarFiltro() {
    this.filtro.set('');
  }
}