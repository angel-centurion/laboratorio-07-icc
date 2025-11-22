const API_BASE = '/api/productos';
let editando = false;

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando aplicación de Productos...');
    cargarProductos();
});

// Manejar envío del formulario
document.getElementById('producto-form').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarProducto();
});

document.getElementById('cancel-btn').addEventListener('click', cancelarEdicion);

async function cargarProductos() {
    try {
        console.log('Cargando productos desde:', API_BASE);
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        alert('Error al cargar los productos: ' + error.message);
    }
}

function mostrarProductos(productos) {
    const tbody = document.getElementById('productos-body');
    tbody.innerHTML = '';

    if (productos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" style="text-align: center;">No hay productos registrados</td>`;
        tbody.appendChild(tr);
        return;
    }

    productos.forEach(producto => {
        const tr = document.createElement('tr');

        // Aplicar clases según el stock
        if (producto.stock === 0) {
            tr.classList.add('stock-zero');
        } else if (producto.stock < 5) {
            tr.classList.add('stock-low');
        }

        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td class="descripcion-cell" title="${producto.descripcion || ''}">${producto.descripcion || '-'}</td>
            <td>S/ ${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td class="actions">
                <button onclick="editarProducto(${producto.id})">✏️ Editar</button>
                <button class="delete" onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function guardarProducto() {
    const producto = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    const id = document.getElementById('producto-id').value;

    try {
        let response;
        if (editando) {
            response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        } else {
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        }

        if (response.ok) {
            limpiarFormulario();
            cargarProductos();
            alert(editando ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión: ' + error.message);
    }
}

async function editarProducto(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }
        const producto = await response.json();

        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion || '';
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;

        document.getElementById('form-title').textContent = 'Editar Producto';
        document.getElementById('submit-btn').textContent = 'Actualizar Producto';
        document.getElementById('cancel-btn').style.display = 'inline-block';
        editando = true;

        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error cargando producto:', error);
        alert('Error al cargar el producto: ' + error.message);
    }
}

async function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                cargarProductos();
                alert('Producto eliminado correctamente');
            } else {
                alert('Error eliminando producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión: ' + error.message);
        }
    }
}

function cancelarEdicion() {
    limpiarFormulario();
    document.getElementById('form-title').textContent = 'Agregar Nuevo Producto';
    document.getElementById('submit-btn').textContent = 'Guardar Producto';
    document.getElementById('cancel-btn').style.display = 'none';
    editando = false;
}

function limpiarFormulario() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = '';
}