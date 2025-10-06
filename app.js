let nameInventory = prompt("Hola querido Usuario, nos alegra saber de ti. Para iniciar la gestión de tu inventario, te invitamos a ingresar el nombre de tu empresa")


if (nameInventory != null){
    
   switch (parseInt(prompt("¡Bienvenid@ a " + nameInventory + "! \nActualmente tienes 0 productos en tu inventario. Pero no te preocupes, todos empezamos desde cero. \n¿Qué deseas agregar primero? \n1. Categorías \n2. Productos \n\n👉 Escribe solo el número de la opción que prefieras: "))){

    case 1: 

   }
   
    

} else {
    alert("Si te arrepientes (que suele pasar), solo actualiza la página… ¡y listo! Aquí estaremos, con los brazos abiertos y los productos en stock ")
}



const category =  [];
const newCategory = {nameCategory: nameCategory1, products: []}
let nameProduct = prompt(" Ingresa el nombre del producto")
let quantity = prompt("¡Genial! Ahora dime,\n¿Cuántas unidades tienes de este producto?")
let unitPrice = prompt("Ahora dinos, ¿cuál es el valor unitario de este producto? \n💰 Escribe su valor sin puntos ni comas")
let nameCategory1 = prompt( "¿Cómo quieres llamar a esta categoría?")
let assignCategory = prompt (" ¿A qué categoría deseas agregar este producto? \n1. Sin categoría \n Crear nueva categoría")
const newProduct = { nameProduct: nameProduct, quantity: quantity, unitPrice: unitPrice }


// let resume = "";
// for (let i = 0; i < category.length; i++) {
//     const element = array[i];
    
// }

// let resumen = "";
// for (let i = 0; i < categorias.length; i++) {
//   resumen = "Categoría: " + category[i].nombre + "\n";
//   for (let j = 0; j < category[i].productos.length; j++) {
//     const prod = category[i].productos[j];
//     resumen += "  Producto: " + prod.nombre + ", Cantidad: " + prod.cantidad + ", Valor: " + prod.valor + "\n";
//   }
// }
// alert(resumen);



const addProduct = (nameProduct, quantity, unitPrice, category) => {

    for (let i = 0; i != null; i++) {
        const element = array[i];
        do {
            
        } while (condition);
    }

}

