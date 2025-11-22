
// Variables globales
let nombreEmpresa = "";
let productos = [];
let contadorId = 1;
let productoEnEdicion = null;


// Objeto-producto
function Producto(id, nombre, cantidad, precioUnitario) {
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
    this.valorTotal = cantidad * precioUnitario;
}

// FUNCIONES DE ORDEN SUPERIOR
// Map: Obtener solo nombres de productos
function obtenerNombresProductos() {
    return productos.map(p => p.nombre.toLowerCase());
}

// Filter: Obtener productos con bajo stock (cantidad <= 5)
function obtenerProductosBajoStock() {
    return productos.filter(p => p.cantidad <= 5);
}

// Filter: Obtener productos por rango de precio
function obtenerProductosPorRangoPrecio(precioMin, precioMax) {
    return productos.filter(p => p.precioUnitario >= precioMin && p.precioUnitario <= precioMax);
}

// Reduce: Calcular valor total mejorado
function calcularValorTotalInventario() {
    return productos.reduce((total, producto) => total + producto.valorTotal, 0);
}

// Some: Verificar si existe un producto con nombre duplicado
function existeProductoConNombre(nombre) {
    return productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
}

// Find: Buscar producto por ID para ediciòn
function buscarProductoPorId(id) {
    return productos.find(p => p.id === id);
}

// Local storge
async function guardarEnLocalStorage() {
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem('nombreEmpresa', nombreEmpresa);
            localStorage.setItem('productos', JSON.stringify(productos));
            localStorage.setItem('contadorId', contadorId);
            resolve(true);
        }, 300);
    });
}

async function cargarDesdeLocalStorage() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const empresaGuardada = localStorage.getItem('nombreEmpresa');
            const productosGuardados = localStorage.getItem('productos');
            const contadorGuardado = localStorage.getItem('contadorId');
            
            if (empresaGuardada) {
                nombreEmpresa = empresaGuardada;
                productos = productosGuardados ? JSON.parse(productosGuardados) : [];
                contadorId = contadorGuardado ? parseInt(contadorGuardado) : 1;
                resolve(true);
            } else {
                resolve(false);
            }
        }, 300);
    });
}

//Elementos de DOM
const pantallaInicio = document.getElementById('pantallaInicio');
const pantallaInventario = document.getElementById('pantallaInventario');
const inputEmpresa = document.getElementById('inputEmpresa');
const btnIniciar = document.getElementById('btnIniciar');
const tituloEmpresa = document.getElementById('tituloEmpresa');
const mensajeBienvenida = document.getElementById('mensajeBienvenida');
const formProducto = document.getElementById('formProducto');
const listaProductos = document.getElementById('listaProductos');
const totalProductos = document.getElementById('totalProductos');
const valorTotalInventario = document.getElementById('valorTotalInventario');
const btnCancelar = document.getElementById('btnCancelar');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');


//Navgecaciòn
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

// Crear productos
async function crearNuevoProducto() {
    const nombre = document.getElementById('nombreProducto').value.trim();
    const cantidadTexto = document.getElementById('cantidadProducto').value;
    const precioTexto = document.getElementById('precioProducto').value;

    // Validaciones
    if (!nombre || !cantidadTexto || !precioTexto) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor completa todos los campos',
        });
        return;
    }

    // Validar que no exista producto con el mismo nombre
    if (existeProductoConNombre(nombre)) {
        Swal.fire({
            icon: 'warning',
            title: 'Producto duplicado',
            text: `Ya existe un producto llamado "${nombre}" en tu inventario`,
        });
        return;
    }

    const nuevoProducto = new Producto(contadorId, nombre, cantidad, precioUnitario);
    productos.push(nuevoProducto);
    contadorId++;

    await guardarEnLocalStorage();

    Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: `El producto "${nombre}" ha sido agregado correctamente`,
        timer: 2000,
    });

    formProducto.reset();
    actualizarUI();
}

//Ediciòn de producto
async function abrirFormularioEdicion(id) {
    const producto = buscarProductoPorId(id);
    if (!producto) return;

    const { value: formValues } = await Swal.fire({
        title: 'Editar Producto',
        width: '600px', 
        html: `
            <div style="text-align: center;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Nombre del producto:</label>
                <input type="text" id="editNombre" value="${producto.nombre}" class="swal2-input" style="margin-bottom: 15px; width: 90%;">
                
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Unidades disponibles:</label>
                <input type="number" id="editCantidad" value="${producto.cantidad}" class="swal2-input" style="margin-bottom: 15px; width: 90%;" min="0">
                
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">Precio unitario (COP):</label>
                <input type="number" id="editPrecio" value="${producto.precioUnitario}" class="swal2-input" style= "width: 90%;" min="0">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Guardar cambios',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        preConfirm: () => {
            const nuevoNombre = document.getElementById('editNombre').value.trim();
            const nuevaCantidad = parseInt(document.getElementById('editCantidad').value);
            const nuevoPrecio = parseInt(document.getElementById('editPrecio').value);

            if (!nuevoNombre || !nuevaCantidad || !nuevoPrecio) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }

            // Validar que nombres duplicados
            if (nuevoNombre !== producto.nombre && existeProductoConNombre(nuevoNombre)) {
                Swal.showValidationMessage(`Ya existe un producto con ese nombre`);
                return false;
            }

            return { nuevoNombre, nuevaCantidad, nuevoPrecio };
        }
    });

    if (formValues) {
        producto.nombre = formValues.nuevoNombre;
        producto.cantidad = formValues.nuevaCantidad;
        producto.precioUnitario = formValues.nuevoPrecio;
        producto.valorTotal = formValues.nuevaCantidad * formValues.nuevoPrecio;

        await guardarEnLocalStorage();

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Los cambios han sido guardados correctamente',
            timer: 2000,
        });

        actualizarUI();
    }
}

//Eliminar productos
async function eliminarProducto(id) {
    const producto = buscarProductoPorId(id);
    if (!producto) return;

    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: `Vas a eliminar el producto "${producto.nombre}"`,
        showCancelButton: true,

        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        productos = productos.filter(p => p.id !== id);
        reorganizarIds();
        await guardarEnLocalStorage();

        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: `"${producto.nombre}" ha sido eliminado del inventario`,
            timer: 2000,
        });

        actualizarUI();
    }
}

//Organizaciòn de IDS
function reorganizarIds() {
    productos.forEach((producto, index) => {
        producto.id = index + 1;
    });
    contadorId = productos.length + 1;
}

//Actualizar resumen
function actualizarResumen() {
    totalProductos.textContent = productos.length;
    valorTotalInventario.textContent = calcularValorTotalInventario().toLocaleString('es-CO');
}

function renderizarListaProductos() {
    listaProductos.innerHTML = "";

    if (productos.length === 0) {
        listaProductos.innerHTML = '<p class="mensaje-vacio">Parece que el inventario de ' + nombreEmpresa + ' está totalmente vacío. 😭<br>¡Crea tu primer producto arriba!</p>';
        return;
    }

    productos.forEach(producto => {
        const card = crearCardProducto(producto);
        listaProductos.appendChild(card);
    });
}

//Cards de productos creados
function crearCardProducto(producto) {
    const card = document.createElement('div');
    card.className = 'producto-card';

    const badge = producto.cantidad <= 5 ? '<span class="badge-ultima">Últimas unidades</span>' : '';

    card.innerHTML = `
        <h3>
            ⭐ ${producto.nombre}
            ${badge}
        </h3>
        <div class="producto-info">
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Unidades:</strong> ${producto.cantidad}</p>
            <p><strong>Precio unidad (COP):</strong> ${producto.precioUnitario.toLocaleString('es-CO')}</p>
            <p><strong>Total (COP):</strong> ${producto.valorTotal.toLocaleString('es-CO')}</p>
        </div>
        <div class="botones-producto">
            <button class="btn-editar" data-id="${producto.id}" title="Editar producto">
                <i class="fas fa-pen"></i>
            </button>
            <button class="btn-eliminar" data-id="${producto.id}" title="Eliminar producto">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    const btnEditar = card.querySelector('.btn-editar');
    const btnEliminar = card.querySelector('.btn-eliminar');

    btnEditar.addEventListener('click', () => abrirFormularioEdicion(producto.id));
    btnEliminar.addEventListener('click', () => eliminarProducto(producto.id));

    return card;
}

//Actualizar vista
function actualizarUI() {
    actualizarMensajeBienvenida();
    actualizarResumen();
    renderizarListaProductos();
}

//Cerrar sesiòn
async function cerrarSesion() {
    const result = await Swal.fire({
        icon: 'warning',
        title: '¿Cerrar sesión?',
        text: `¿Estás seguro de que quieres salir?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        // Limpiar TODAS las variables
        nombreEmpresa = "";
        productos = [];
        contadorId = 1;
        
        // Limpiar TODO el localStorage
        localStorage.removeItem('nombreEmpresa');
        localStorage.removeItem('productos');
        localStorage.removeItem('contadorId');
        localStorage.clear();

        // Limpiar formularios
        inputEmpresa.value = "";
        formProducto.reset();

        // Ocultar ambas pantallas
        pantallaInicio.classList.remove('activa');
        pantallaInventario.classList.remove('activa');

        // Mostrar pantalla de inicio
        mostrarPantallaInicio();

        Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Tu sesión ha sido cerrada correctamente',
            timer: 1500,
        });
    }
}

//Inicializando el programa
async function iniciarApp() {
    // Ocultar AMBAS pantallas mientras cargamos
    pantallaInicio.classList.remove('activa');
    pantallaInventario.classList.remove('activa');
    
    // Cargar datos desde localStorage (sincrónico, muy rápido)
    const hayDatosGuardados = await cargarDesdeLocalStorage();

    // Doble validación
    if (hayDatosGuardados && nombreEmpresa && nombreEmpresa.trim() !== "") {
        // Hay datos válidos → mostrar inventario
        mostrarPantallaInventario();
        actualizarUI();
    } else {
        // No hay datos válidos → mostrar inicio
        nombreEmpresa = "";
        productos = [];
        contadorId = 1;
        localStorage.clear();
        mostrarPantallaInicio();
    }
}


//Eventos

btnCerrarSesion.addEventListener('click', cerrarSesion);

btnIniciar.addEventListener('click', async () => {
    const nombreIngresado = inputEmpresa.value.trim();

    if (nombreIngresado === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campo vacío',
            text: 'Ingresa el nombre de tu empresa para comenzar',
        });
        return;
    }

    nombreEmpresa = nombreIngresado;
    await guardarEnLocalStorage();
    mostrarPantallaInventario();
});

inputEmpresa.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        btnIniciar.click();
    }
});

formProducto.addEventListener('submit', (evento) => {
    evento.preventDefault();
    crearNuevoProducto();
});

btnCancelar.addEventListener('click', () => {
    formProducto.reset();
});


//Inicio de la carga de DOM
document.addEventListener('DOMContentLoaded', iniciarApp);
