// Configuración dinámica de rutas para Nginx
const APP_BASE = '/proveedores';
const API_BASE = `${APP_BASE}/api`;

console.log(`🏁 Aplicación Proveedores iniciada - Base: ${APP_BASE}`);

// Función para cargar proveedores
async function cargarProveedores() {
    try {
        console.log(`📡 Cargando proveedores desde: ${API_BASE}/proveedores`);

        const response = await fetch(`${API_BASE}/proveedores`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const proveedores = await response.json();
        console.log(`✅ ${proveedores.length} proveedores cargados`);
        mostrarProveedores(proveedores);

    } catch (error) {
        console.error('❌ Error cargando proveedores:', error);
        mostrarError('Error al cargar los proveedores: ' + error.message);
    }
}

// Función para mostrar proveedores en la tabla
function mostrarProveedores(proveedores) {
    const tbody = document.getElementById('proveedores-body');
    tbody.innerHTML = '';

    proveedores.forEach(proveedor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proveedor.id}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.contacto || ''}</td>
            <td>${proveedor.telefono || ''}</td>
            <td>${proveedor.email || ''}</td>
            <td>${proveedor.direccion || ''}</td>
            <td>
                <button onclick="editarProveedor(${proveedor.id})">✏️ Editar</button>
                <button onclick="eliminarProveedor(${proveedor.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para crear/editar proveedor
async function guardarProveedor(event) {
    event.preventDefault();

    const proveedor = {
        nombre: document.getElementById('nombre').value,
        contacto: document.getElementById('contacto').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value
    };

    try {
        const url = document.getElementById('proveedor-id').value
            ? `${API_BASE}/proveedores/${document.getElementById('proveedor-id').value}`
            : `${API_BASE}/proveedores`;

        const method = document.getElementById('proveedor-id').value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar el proveedor');
        }

        limpiarFormulario();
        cargarProveedores();
        mostrarMensaje('Proveedor guardado correctamente');

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar el proveedor: ' + error.message);
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
    document.getElementById('proveedor-form').reset();
    document.getElementById('proveedor-id').value = '';
    document.getElementById('form-title').textContent = 'Agregar Nuevo Proveedor';
    document.getElementById('submit-btn').textContent = 'Guardar Proveedor';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Funciones de edición y eliminación
function editarProveedor(id) {
    fetch(`${API_BASE}/proveedores/${id}`)
        .then(response => response.json())
        .then(proveedor => {
            document.getElementById('proveedor-id').value = proveedor.id;
            document.getElementById('nombre').value = proveedor.nombre;
            document.getElementById('contacto').value = proveedor.contacto || '';
            document.getElementById('telefono').value = proveedor.telefono || '';
            document.getElementById('email').value = proveedor.email || '';
            document.getElementById('direccion').value = proveedor.direccion || '';

            document.getElementById('form-title').textContent = 'Editar Proveedor';
            document.getElementById('submit-btn').textContent = 'Actualizar Proveedor';
            document.getElementById('cancel-btn').style.display = 'inline-block';
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error al cargar el proveedor para editar');
        });
}

function eliminarProveedor(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
        fetch(`${API_BASE}/proveedores/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el proveedor');
                }
                cargarProveedores();
                mostrarMensaje('Proveedor eliminado correctamente');
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al eliminar el proveedor: ' + error.message);
            });
    }
}

// Cancelar edición
function cancelarEdicion() {
    limpiarFormulario();
}

// Cargar proveedores al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado - Iniciando aplicación Proveedores');
    cargarProveedores();

    // Configurar el formulario
    const form = document.getElementById('proveedor-form');
    if (form) {
        form.addEventListener('submit', guardarProveedor);
    }

    // Configurar botón cancelar
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelarEdicion);
    }
});