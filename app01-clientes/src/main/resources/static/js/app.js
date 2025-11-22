// Configuración dinámica de rutas para Nginx
const APP_BASE = '/clientes';
const API_BASE = `${APP_BASE}/api`;

console.log(`🏁 Aplicación Clientes iniciada - Base: ${APP_BASE}`);

// Función para cargar clientes
async function cargarClientes() {
    try {
        console.log(`📡 Cargando clientes desde: ${API_BASE}/clientes`);

        const response = await fetch(`${API_BASE}/clientes`);
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const clientes = await response.json();
        console.log(`✅ ${clientes.length} clientes cargados`);
        mostrarClientes(clientes);

    } catch (error) {
        console.error('❌ Error cargando clientes:', error);
        mostrarError('Error al cargar los clientes: ' + error.message);
    }
}

// Función para mostrar clientes en la tabla
function mostrarClientes(clientes) {
    const tbody = document.getElementById('clientes-body');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || ''}</td>
            <td>${cliente.direccion || ''}</td>
            <td>
                <button onclick="editarCliente(${cliente.id})">✏️ Editar</button>
                <button onclick="eliminarCliente(${cliente.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para crear/editar cliente
async function guardarCliente(event) {
    event.preventDefault();

    const cliente = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value
    };

    try {
        const url = document.getElementById('cliente-id').value
            ? `${API_BASE}/clientes/${document.getElementById('cliente-id').value}`
            : `${API_BASE}/clientes`;

        const method = document.getElementById('cliente-id').value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error('Error al guardar el cliente');
        }

        limpiarFormulario();
        cargarClientes();
        mostrarMensaje('Cliente guardado correctamente');

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al guardar el cliente: ' + error.message);
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
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-id').value = '';
}

// Cargar clientes al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado - Iniciando aplicación Clientes');
    cargarClientes();

    // Configurar el formulario
    const form = document.getElementById('cliente-form');
    if (form) {
        form.addEventListener('submit', guardarCliente);
    }
});