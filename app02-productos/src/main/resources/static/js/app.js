// Configuración dinámica de rutas para Nginx
const APP_BASE = '/productos';
const API_BASE = `${APP_BASE}/api`;

console.log(`🏁 Aplicación Productos iniciada - Base: ${APP_BASE}`);

// Función para cargar productos
async function cargarProductos() {
    try {
        console.log(`📡 Cargando productos desde: ${API_BASE}/productos`);

        const response = await fetch(`${API_BASE}/productos`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const productos = await response.json();
        console.log(`✅ ${productos.length} productos cargados`);
        mostrarProductos(productos);

    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        mostrarError('Error al cargar los productos: ' + error.message);
    }
}

// Función para mostrar productos en la tabla
function mostrarProductos(productos) {
    const tbody = document.getElementById('productos-body');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria || ''}</td>
            <td>
                <button onclick="editarProducto(${producto.id})">✏️ Editar</button>
                <button onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para crear/editar producto
async function guardarProducto(event) {
    event.preventDefault();

    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('categoria').value
    };

    try {
        const url = document.getElementById('producto-id').value
            ? `${API_BASE}/productos/${document.getElementById('producto-id').value}`
            : `${API_BASE}/productos`;

        const method = document.getElementById('producto-id').value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }

        limpiarFormulario();
        cargarProductos();
        mostrarMensaje('Producto guardado correctamente');

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar el producto: ' + error.message);
    }
}

// Funciones auxiliares
function mostrarError(mensaje) {
    alert('❌ ' + mensaje);
}

function mostrarMensaje(mensaje) {
    alert('✅ ' + mensaje);
}

function limpiarFormulario() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = '';
}

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado - Iniciando aplicación Productos');
    cargarProductos();

    // Configurar el formulario
    const form = document.getElementById('producto-form');
    if (form) {
        form.addEventListener('submit', guardarProducto);
    }
});