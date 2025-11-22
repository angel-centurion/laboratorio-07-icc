const API_BASE = '/api/proveedores';
let editando = false;

// Cargar proveedores al iniciar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando aplicación de Proveedores...');
    cargarProveedores();
});

// Manejar envío del formulario
document.getElementById('proveedor-form').addEventListener('submit', function(e) {
    e.preventDefault();
    guardarProveedor();
});

document.getElementById('cancel-btn').addEventListener('click', cancelarEdicion);

async function cargarProveedores() {
    try {
        console.log('Cargando proveedores desde:', API_BASE);
        const response = await fetch(API_BASE);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        const proveedores = await response.json();
        console.log('Proveedores cargados:', proveedores);
        mostrarProveedores(proveedores);
    } catch (error) {
        console.error('Error cargando proveedores:', error);
        alert('Error al cargar los proveedores: ' + error.message);
    }
}

function mostrarProveedores(proveedores) {
    const tbody = document.getElementById('proveedores-body');
    tbody.innerHTML = '';

    if (proveedores.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" style="text-align: center;">No hay proveedores registrados</td>`;
        tbody.appendChild(tr);
        return;
    }

    proveedores.forEach(proveedor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proveedor.id}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.contacto || '-'}</td>
            <td>${proveedor.telefono || '-'}</td>
            <td class="email-cell" title="${proveedor.email || ''}">${proveedor.email || '-'}</td>
            <td class="direccion-cell" title="${proveedor.direccion || ''}">${proveedor.direccion || '-'}</td>
            <td class="actions">
                <button onclick="editarProveedor(${proveedor.id})">✏️ Editar</button>
                <button class="delete" onclick="eliminarProveedor(${proveedor.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function guardarProveedor() {
    const proveedor = {
        nombre: document.getElementById('nombre').value,
        contacto: document.getElementById('contacto').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value
    };

    const id = document.getElementById('proveedor-id').value;

    try {
        let response;
        if (editando) {
            response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            });
        } else {
            response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            });
        }

        if (response.ok) {
            limpiarFormulario();
            cargarProveedores();
            alert(editando ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente');
        } else {
            const error = await response.text();
            alert('Error: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión: ' + error.message);
    }
}

async function editarProveedor(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) {
            throw new Error('Proveedor no encontrado');
        }
        const proveedor = await response.json();

        document.getElementById('proveedor-id').value = proveedor.id;
        document.getElementById('nombre').value = proveedor.nombre;
        document.getElementById('contacto').value = proveedor.contacto || '';
        document.getElementById('telefono').value = proveedor.telefono || '';
        document.getElementById('email').value = proveedor.email || '';
        document.getElementById('direccion').value = proveedor.direccion || '';

        document.getElementById('form-title').textContent = 'Editar Proveedor';
        document.getElementById('submit-btn').textContent = 'Actualizar Proveedor';
        document.getElementById('cancel-btn').style.display = 'inline-block';
        editando = true;

        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error cargando proveedor:', error);
        alert('Error al cargar el proveedor: ' + error.message);
    }
}

async function eliminarProveedor(id) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                cargarProveedores();
                alert('Proveedor eliminado correctamente');
            } else {
                alert('Error eliminando proveedor');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión: ' + error.message);
        }
    }
}

function cancelarEdicion() {
    limpiarFormulario();
    document.getElementById('form-title').textContent = 'Agregar Nuevo Proveedor';
    document.getElementById('submit-btn').textContent = 'Guardar Proveedor';
    document.getElementById('cancel-btn').style.display = 'none';
    editando = false;
}

function limpiarFormulario() {
    document.getElementById('proveedor-form').reset();
    document.getElementById('proveedor-id').value = '';
}