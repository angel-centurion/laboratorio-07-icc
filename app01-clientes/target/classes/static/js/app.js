const API_BASE = '/api/clientes';
let editando = false;

// Cargar clientes al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando aplicación de Clientes...');
    cargarClientes();
});

// Manejar envío del formulario
document.getElementById('cliente-form').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarCliente();
});

document.getElementById('cancel-btn').addEventListener('click', cancelarEdicion);

async function cargarClientes() {
    try {
        console.log('Cargando clientes desde:', API_BASE);
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        const clientes = await response.json();
        console.log('Clientes cargados:', clientes);
        mostrarClientes(clientes);
    } catch (error) {
        console.error('Error cargando clientes:', error);
        alert('Error al cargar los clientes: ' + error.message);
    }
}

function mostrarClientes(clientes) {
    const tbody = document.getElementById('clientes-body');
    tbody.innerHTML = '';

    if (clientes.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" style="text-align: center;">No hay clientes registrados</td>`;
        tbody.appendChild(tr);
        return;
    }

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefono || '-'}</td>
            <td>${cliente.ciudad || '-'}</td>
            <td class="actions">
                <button onclick="editarCliente(${cliente.id})">✏️ Editar</button>
                <button class="delete" onclick="eliminarCliente(${cliente.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function guardarCliente() {
    const cliente = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        ciudad: document.getElementById('ciudad').value
    };

    const id = document.getElementById('cliente-id').value;

    try {
        let response;
        if (editando) {
            response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });
        } else {
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });
        }

        if (response.ok) {
            limpiarFormulario();
            cargarClientes();
            alert(editando ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión: ' + error.message);
    }
}

async function editarCliente(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error('Cliente no encontrado');
        }
        const cliente = await response.json();

        document.getElementById('cliente-id').value = cliente.id;
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('ciudad').value = cliente.ciudad || '';

        document.getElementById('form-title').textContent = 'Editar Cliente';
        document.getElementById('submit-btn').textContent = 'Actualizar Cliente';
        document.getElementById('cancel-btn').style.display = 'inline-block';
        editando = true;

        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error cargando cliente:', error);
        alert('Error al cargar el cliente: ' + error.message);
    }
}

async function eliminarCliente(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                cargarClientes();
                alert('Cliente eliminado correctamente');
            } else {
                alert('Error eliminando cliente');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión: ' + error.message);
        }
    }
}

function cancelarEdicion() {
    limpiarFormulario();
    document.getElementById('form-title').textContent = 'Agregar Nuevo Cliente';
    document.getElementById('submit-btn').textContent = 'Guardar Cliente';
    document.getElementById('cancel-btn').style.display = 'none';
    editando = false;
}

function limpiarFormulario() {
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-id').value = '';
}