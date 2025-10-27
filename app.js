// variables globales
let nombreEmpresa = "";
let productos = [];
let contadorId = 1;


// función para almacenar los productos
function Producto(id, nombre, cantidad, precioUnitario) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.valorTotal = cantidad * precioUnitario;
}


// guardado en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('nombreEmpresa', nombreEmpresa);
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('contadorId', contadorId);
}

// traer desde localStorage
function cargarDesdeLocalStorage() {
    const empresaGuardada = localStorage.getItem('nombreEmpresa');
    const productosGuardados = localStorage.getItem('productos');
    const contadorGuardado = localStorage.getItem('contadorId');
    
    if (empresaGuardada) {
        nombreEmpresa = empresaGuardada;
        productos = productosGuardados ? JSON.parse(productosGuardados) : [];
        contadorId = contadorGuardado ? parseInt(contadorGuardado) : 1;
        return true;
    }
    return false;
}


function calcularValorTotalInventario() {
    return productos.reduce(function(total, producto) {
        return total + producto.valorTotal;
    }, 0);
}


function obtenerTotalProductos() {
    return productos.length;
}


// listado del DOM
const pantallaInicio = document.getElementById('pantallaInicio');
const pantallaInventario = document.getElementById('pantallaInventario');
const inputEmpresa = document.getElementById('inputEmpresa');
const btnIniciar = document.getElementById('btnIniciar');
const errorEmpresa = document.getElementById('errorEmpresa');
const tituloEmpresa = document.getElementById('tituloEmpresa');
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
const formProducto = document.getElementById('formProducto');
const mensajeFeedback = document.getElementById('mensajeFeedback');
const listaProductos = document.getElementById('listaProductos');
const totalProductos = document.getElementById('totalProductos');
const valorTotalInventario = document.getElementById('valorTotalInventario');


// iniciar programa
function iniciarApp() {
    const hayDatosGuardados = cargarDesdeLocalStorage();
    
    if (hayDatosGuardados) {
        mostrarPantallaInventario();
        actualizarUI();
    } else {
        mostrarPantallaInicio();
    }
}


// pantalla de inicio - empresa
function mostrarPantallaInicio() {
    pantallaInicio.classList.add('activa');
    pantallaInventario.classList.remove('activa');
}


function mostrarPantallaInventario() {
    pantallaInicio.classList.remove('activa');
    pantallaInventario.classList.add('activa');
    tituloEmpresa.textContent = "Inventario de " + nombreEmpresa + " 📦";
    actualizarMensajeBienvenida();
}


// actualizar sms de los usuario por ingreso de productos
function actualizarMensajeBienvenida() {
    let mensaje = "";
    if (productos.length === 0) {
        mensaje = "Aún no tienes productos en tu inventario. Pero no te preocupes, todos empezamos desde cero.";
    } else if (productos.length === 1) {
        mensaje = "Tienes " + productos.length + " producto en tu stock. ¡Excelente! Vamos uno a la vez.";
    } else {
        mensaje = "Tienes " + productos.length + " productos en tu stock. ¡Vas por buen camino!";
    }
    mensajeBienvenida.textContent = mensaje;
}


// lista de eventos en programa
btnIniciar.addEventListener('click', function() {
    const nombreIngresado = inputEmpresa.value.trim();
    
    if (nombreIngresado === "") {
        errorEmpresa.textContent = "Ingresa el nombre de tu empresa para comenzar";
        return;
    }
    
    nombreEmpresa = nombreIngresado;
    guardarEnLocalStorage();
    mostrarPantallaInventario();
});


inputEmpresa.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        btnIniciar.click();
    }
});


formProducto.addEventListener('submit', function(evento) {
    evento.preventDefault();
    crearNuevoProducto();
});

// vaciar formulario de creaciòn
const btnCancelar = document.getElementById('btnCancelar');
if (btnCancelar) {
    btnCancelar.addEventListener('click', function() {
        formProducto.reset();
        mensajeFeedback.textContent = "";
    });
}


// creacion de productos
function crearNuevoProducto() {
    const nombre = document.getElementById('nombreProducto').value.trim();
    const cantidadTexto = document.getElementById('cantidadProducto').value;
    const precioTexto = document.getElementById('precioProducto').value;
    
    const cantidad = parseInt(cantidadTexto);
    const precioUnitario = parseInt(precioTexto);
    
    const nuevoProducto = new Producto(contadorId, nombre, cantidad, precioUnitario);
    productos.push(nuevoProducto);
    contadorId = contadorId + 1;
    
    guardarEnLocalStorage();
    mostrarMensaje("✅ ¡El producto '" + nombre + "' ha sido agregado con éxito a tu inventario!", "exito");
    formProducto.reset();
    actualizarUI();
}


function mostrarMensaje(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = "mensaje-feedback " + tipo;
    
    setTimeout(function() {
        mensajeFeedback.textContent = "";
        mensajeFeedback.className = "mensaje-feedback";
    }, 5000);
}


// actualizar visual
function actualizarUI() {
    actualizarMensajeBienvenida();
    actualizarResumen();
    renderizarListaProductos();
}


// por cada carga, se actualiza el resumen de los productos
function actualizarResumen() {
    totalProductos.textContent = obtenerTotalProductos();
    valorTotalInventario.textContent = calcularValorTotalInventario().toLocaleString('es-CO');
}


function renderizarListaProductos() {
    listaProductos.innerHTML = "";
    
    if (productos.length === 0) {
        listaProductos.innerHTML = '<p class="mensaje-vacio">Parece que el inventario de ' + nombreEmpresa + ' está totalmente vacío. 😭<br>¡Crea tu primer producto arriba!</p>';
        return;
    }
    
    productos.forEach(function(producto) {
        const card = crearCardProducto(producto);
        listaProductos.appendChild(card);
    });
}


// crear card de producto cada que se agregue
function crearCardProducto(producto) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    
    card.innerHTML = '<h3>⭐ ' + producto.nombre + '</h3>' +
        '<div class="producto-info">' +
            '<p><strong>ID:</strong> ' + producto.id + '</p>' +
            '<p><strong>Unidades:</strong> ' + producto.cantidad + '</p>' +
            '<p><strong>Precio unidad (COP):</strong> ' + producto.precioUnitario.toLocaleString('es-CO') + '</p>' +
            '<p><strong>Total (COP):</strong> ' + producto.valorTotal.toLocaleString('es-CO') + '</p>' +
        '</div>' +
        '<button class="btn-eliminar" data-id="' + producto.id + '">Eliminar producto</button>';
    
    const btnEliminar = card.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', function() {
        eliminarProducto(producto.id, card);
    });
    
    return card;
}


// Actualizar id de productos eliminados 
function reorganizarIds() {
    productos.forEach(function(producto, index) {
        producto.id = index + 1;
    });
    contadorId = productos.length + 1;
}


// nueva acción: eliminar productos agregados
function eliminarProducto(id, cardElement) {
    const productoEliminado = productos.find(function(p) {
        return p.id === id;
    });
    
    // Crear mensaje de eliminación dentro de la card del elemnto eliminado
    if (productoEliminado) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje-eliminacion';
        mensajeDiv.textContent = "Has eliminado el producto '" + productoEliminado.nombre + "' 😔";
        
        // Agregar el mensaje a la card
        cardElement.appendChild(mensajeDiv);
        
        // Deshabilitar el botón de eliminar POST ELIMINACIÒN
        const btnEliminar = cardElement.querySelector('.btn-eliminar');
        btnEliminar.disabled = true;
        btnEliminar.style.opacity = '0.3';
        btnEliminar.style.cursor = 'not-allowed';
        
        
        setTimeout(function() {
            productos = productos.filter(function(p) {
                return p.id !== id;
            });
            
            // Reorganizar IDs después de eliminar
            reorganizarIds();
            
            guardarEnLocalStorage();
            actualizarUI();
        }, 4000);
    }
}

// iniciar
document.addEventListener('DOMContentLoaded', iniciarApp);
