
// almacena el nombre de la empresa
let nombreEmpresa = "";    
//almacena los productos
let productos = [];        
//asigna Id a los productos
let contadorId = 1;        

//pedir al usuario el nombre de la empresa
function iniciarSimulador() {
    nombreEmpresa = prompt("¡Hola querido Usuario!👋\nPara iniciar la gestión de tu inventario, cuéntame ¿Cómo se llama tu empresa?");
    if (nombreEmpresa === null || nombreEmpresa.trim() === "") {
        alert("Si te arrepientes (que suele pasar), solo actualiza la página… ¡y listo! Aquí estaremos, con los brazos abiertos y los productos en stock. 😊");
        return; }
    mostrarMenuPrincipal();
}

//navegación del usuario
function mostrarMenuPrincipal() {
    let continuar = true;
    while (continuar) {
        // primer mensaje para el usuario
        let mensaje = "Bienvenid@ al inventario de " + nombreEmpresa + " 📦\n\n";
        if (productos.length === 0) {
            mensaje = mensaje + "Aún no tienes productos en tu inventario. Pero no te preocupes, todos empezamos desde cero.\n";
        } else {
            mensaje = mensaje + "Tienes " + productos.length + " producto en tu stock. ¡Excelente! Vamos uno a la vez.\n";
            if (productos.length > 1) {
                mensaje = "Bienvenid@ al inventario de " + nombreEmpresa + " 🙌\n\nTienes " + productos.length + " productos en tu stock. ¡Vas por buen camino!.\n";
            }
        }
        mensaje = mensaje + "\n¿Qué quieres hacer?\n";
        mensaje = mensaje + " 1. ➕ Crear nuevo producto\n";
        mensaje = mensaje + " 2. 🔍 Ver listado de productos\n";
        mensaje = mensaje + " 3. 🏃‍♂️ Salir";

        let opcion = prompt(mensaje);

        if (opcion === "1") {
            crearNuevoProducto();
        } else if (opcion === "2") {
            let resultado = mostrarListadoProductos();
            if (resultado === "salir") {
                continuar = false;
            }
        } else if (opcion === "3") {
            alert("¡Nos vemos pronto! 👋\nGracias por confiar en nuestro inventario para " + nombreEmpresa + ".");
            continuar = false;
        } else {
            alert("Esa opción no existe. Intentémoslo de nuevo.😉");
        }
    }
}

// crear producto cada que el usuario seleccione 1
function crearNuevoProducto() {
    //pedir el nombre del producto
    let nombre = prompt("📝 ¿Cúal es el nombre del producto? \nAsí dejamos de usar nombres en clave… que ya nadie recuerda. 🤭");
    if (nombre === null) {
        return; }
    //pedir las cantidades
    let cantidadTexto = prompt("¡Genial! ¿Y cuántas unidades tienes de este producto? 🤩\n(Escribe solo números)");
    if (cantidadTexto === null) {
        return;}
    //valida que sean números
    let cantidad = parseInt(cantidadTexto);
    if (isNaN(cantidad) || cantidad < 0) {
        alert("Cantidad inválida. Intentémoslo de nuevo.😉");
        return;}
    // pedir el precio por unidad del producto
    let precioTexto = prompt("Y hablando de números… \n¿Cuál es el precio unitario (COP) de este producto?💲");
    if (precioTexto === null) {
        return;}

    let precioTexto1 = precioTexto.replace(/[.,]/g, "");
    let precioUnitario = parseInt(precioTexto1);
    if (isNaN(precioUnitario) || precioUnitario < 0) {
        alert("Precio inválido. Intentémoslo de nuevo.😉");
        return;}
    //almacena el valor total del producto
    let valorTotal = cantidad * precioUnitario;

    // Confirmación de producto a crear
    let resumen = "Vale, echemos un vistazo, antes de agregarlo al stock 🧐\n\n";
    resumen = resumen + "Nombre: " + nombre + "\n";
    resumen = resumen + "Unidades: " + cantidad + "\n";
    resumen = resumen + "Precio unitario (COP): " + precioUnitario + "\n";
    resumen = resumen + "Valor total (COP): " + valorTotal + "\n\n";
    resumen = resumen + "¿Estás seguro que lo quieres agregar?";

    let confirmar = confirm(resumen);
    if (confirmar) {
        let nuevoProducto = {
            id: contadorId,
            nombre: nombre,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            valorTotal: valorTotal
        };
        productos.push(nuevoProducto);
        contadorId = contadorId + 1;
        alert("✅ ¡El producto '" + nombre + "' ha sido agregado con éxito a tu inventario!");
    } else {alert("Pensé que ibamos bien. Volvamos al menú pincipal. 😔");}
}

// función de mostrar el listado de productos
function mostrarListadoProductos() {
    if (productos.length === 0) {
        let crearAhora = confirm("Parece que el inventario de " + nombreEmpresa + " está totalmente vacío. 😭\n¿Quieres crear tu primer producto?");
        if (crearAhora) {
            crearNuevoProducto();}
        return;
    }

    let listado = "📋 Inventario de " + nombreEmpresa + "\n";
    listado = listado + "---------------------------------------------------------------------------\n";
    let sumaInventario = 0;

    for (let i = 0; i < productos.length; i++) {
        let p = productos[i];
        listado = listado + "⭐\nID: " + p.id + "\n";
        listado = listado + "Nombre: " + p.nombre + "\n";
        listado = listado + "Unidades: " + p.cantidad + "\n";
        listado = listado + "Precio unidad (COP): " + p.precioUnitario + "\n";
        listado = listado + "Total (COP): " + p.valorTotal + "\n";
        listado = listado + "---------------------------------------------------------------------------\n";
        sumaInventario = sumaInventario + p.valorTotal;
    }

    listado = listado + "Total de productos: " + productos.length + "\n";
    listado = listado + "Valor total del inventario (COP): " + sumaInventario + " \n---------------------------------------------------------------------------\n\n⬅️ Ahora volvamos al menú principal.";
    
    // Visualizar consola cuando se agreguen màs de 2 productos y el usuario quiera ver el listado de productos
    // Por restricciones, sólo se pueden ver hasta dos productos en las modales del navegador :(
    if (productos.length > 2 ){
        console.log(listado);
        alert("Traté de mostrar tu imperio de productos, pero el navegador tiró la toalla. 🙃 Abre la consola a ver si ahí hay más suerte. \n---------------------------------------------------------------------------\n" + listado);
    } else { alert(listado)}  
}

//Iniciador
iniciarSimulador();
