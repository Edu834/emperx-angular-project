export interface Estado{
    idEstado: number;
    nombre: string;
  }
export  interface Galeria{
    
  }
export  interface Categoria{
    idCategoria: number;
    nombre: string;
    descripcion: string;
  }
export interface SubCategoria{
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
    sexo: string;
    galeria: Galeria;
    subcategoria: SubCategoria;
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
    id: number;             // ID único del array de productos
    producto: Producto;     // Producto
    name: string;         // Nombre del producto                       
    price: number;         // Precio del producto
    imageUrl: string;      // URL de la imagen del producto
    description?: string;  // Descripción del producto (opcional)
    stock: number;        // Stock del producto (opcional)
    color: string[];        // Color del producto (opcional)
    size: string[];         // Talla del producto (opcional)
    articulos: string[];     // Articulos del producto
  }