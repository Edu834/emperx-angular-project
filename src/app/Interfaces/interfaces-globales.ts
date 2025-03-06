export interface Estado {
  idEstado: number;
  nombre: string;
}

export interface Galeria {
  idGaleria: number;
  fotoFrontal: string;
  fotoTrasera: string;
  fotoModeloFrontal: string;
  fotoModeloTrasera: string;
  fotoModeloCostado: string;
  fotoModeloCerca: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
}

export interface SubCategoria {
  idSubcategoria: number;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
}

export interface Producto {
  idProducto: string;
  descripcion: string;
  marca: string;
  nombre: string;
  sexo: string;
  galeria: Galeria;  // Ahora galeria es de tipo Galeria (objeto completo)
  subcategoria: SubCategoria;
}

export interface Articulo {
  idArticulo: string;
  color: string;
  descripcion: string;
  nombre: string;
  precio: number;
  stock: number;
  talla: string;
  estados: Estado[];
  producto: Producto;
}

export interface ProductView {
  idProducto: string;
  subcategoria: SubCategoria;
  sexo: string;
  name: string;            // Nombre del producto
  price: number;           // Precio del producto
  imageUrl: string;        // URL de la imagen principal del producto
  description?: string;    // Descripción del producto (opcional)
  stock: number;
  estados: string[];
  color: string[];
  size: string[];          // Talla del producto (opcional)
  articulos: string[];     // Artículos relacionados al producto
  galeria: Galeria;        // Ahora `galeria` es un objeto de tipo `Galeria`
}

export interface ArticuloEnPedidoDTO{
  idArticulo: string;
  idUsuario: string;
  cantidad: number;
  diasAlquiler: number;
}
