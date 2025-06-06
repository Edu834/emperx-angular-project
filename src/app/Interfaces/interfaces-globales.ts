import { User } from "../core/service/user/user";

export interface Estado{
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
export  interface Categoria{
    idCategoria: number;
    nombre: string;
    descripcion: string;
  }
export interface Subcategoria{
    idSubcategoria: number;
    nombre: string;
    descripcion: string;
    categoria: Categoria;
  }
  
export interface Producto{
    idProducto: string;
    descripcion: string;
    marca: string;
    nombre: string;
    precio: number;
    sexo: string;
    galeria: Galeria;
    subcategoria: Subcategoria;
  }
  
export interface Articulo{
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
  subcategoria: Subcategoria;
  sexo: string;
  name: string;            // Nombre del producto
  price: number;           // Precio del producto
  imageUrl: string;        // URL de la imagen principal del producto
  description?: string;    // Descripción del producto (opcional)
  stock: number;
  estados: string[];
  color: string[];
  size: string[];  
  marca:string;        // Talla del producto (opcional)
  articulos: string[];     // Artículos relacionados al producto
  galeria: Galeria;        // Ahora `galeria` es un objeto de tipo `Galeria`
}
export interface Filtro {
  marca: string;
  precio: string;
  talla: string[];
  color: string;
}
export interface ArticuloEnPedidoDTO{
  idArticulo: string;
  idUsuario: string;
  cantidad: number;
  diasAlquiler: number | null;
  precioFinal: number;
}



export interface Pedido {
  idPedido: string;
  fechaPedido: string;
  fechaEntrega: string;
  fechaDevolucion: string;
  fecha: string;
  estado: string;
  usuario: User;
  articulosEnPedido: ArticuloEnPedido[];
}

export interface IdArticuloEnPedido {
  idArticulo: string;
  idPedido: string;
}

export interface ArticuloEnPedido {
  id: IdArticuloEnPedido;
  cantidad: number;
  cantidadDevuelta: number;
  estado: string;
  diasAlquiler: number | null;
  fechaDevuelta: string;
  precioFinal: number;
}
