async function abrirModalDivision(id) {
    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const modalTitle = document.getElementById('exampleModalLabel');

    limpiarFormulario();

    if (id) {
        modalTitle.textContent = 'Editar División';
        try {
            const response = await fetch(`/api/divisiones/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la división desde el servidor.');
            }
            const division = await response.json();

            document.getElementById('id').value = division.id;
            document.getElementById('clave').value = division.clave;
            document.getElementById('nombre').value = division.nombre;
            document.getElementById('activo').checked = division.activo;

        } catch (error) {
            console.error('Error al obtener los datos de la división:', error);
            const alerta = document.getElementById('alertaError');
            alerta.textContent = 'Error al cargar los datos para editar. ' + error.message;
            alerta.classList.remove('d-none');
            return;
        }
    } else {
        modalTitle.textContent = 'Agregar División';
    }

    modal.show();
}

function limpiarFormulario() {
    const form = document.getElementById('divisonForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('alertaError').classList.add('d-none');
    document.getElementById('id').value = '';
}

function mostrarAlerta(mensaje) {
    const alerta = document.getElementById('alertaError');
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
}

async function guardarDivision(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = document.getElementById('divisonForm');
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
        console.warn('Formulario no válido');
        return;
    }

    const formData = new FormData(form);
    const data = {
        id: formData.get('id') ? parseInt(formData.get('id')) : null,
        clave: formData.get('clave'),
        nombre: formData.get('nombre'),
        activo: document.getElementById('activo').checked
    };

    try {
        const response = await fetch('/api/division/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error al guardar la división.' }));
            throw new Error(errorData.message);
        }

        const result = await response.json();

        if (result.success) {
            const modalEl = document.getElementById('exampleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
            actualizarOAgregarFilaEnTabla(result.division);
        } else {
            mostrarAlerta(result.message || 'Ocurrió un error al guardar la división.');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al guardar: ' + error.message);
    }
}

function actualizarOAgregarFilaEnTabla(division) {
    const tbody = document.querySelector('#divisiones-table tbody');
    if (!tbody) {
        window.location.reload();
        return;
    }

    let row = document.getElementById(`division-row-${division.id}`);
    const isNew = !row;

    if (isNew) {
        row = tbody.insertRow();
        row.id = `division-row-${division.id}`;
    }

    row.innerHTML = `
        <td>${division.id}</td>
        <td>${division.clave}</td>
        <td>${division.nombre}</td>
        <td>${division.activo ? 'Sí' : 'No'}</td>
        <td>
            <button type="button" class="btn btn-sm text-white fw-semibold"
                style="background-color: #6AA276; border-color: #6AA276;"
                onclick="abrirModalDivision(${division.id})">Editar</button>
            <button type="button" class="btn btn-sm text-white fw-semibold"
                style="background-color: #c0392b; border-color: #c0392b;"
                onclick="eliminarDivision(${division.id})">Eliminar</button>
        </td>
    `;
    }

async function eliminarDivision(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta división?')) {
        return;
    }

    try {
        const response = await fetch(`/api/division/delete/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const row = document.getElementById(`division-row-${id}`);
            if (row) {
                row.remove();
            } else {
                window.location.reload();
            }
        } else {
            alert(`Error al eliminar: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar división:', error);
        alert('Ocurrió un error en la comunicación con el servidor.');
    }
}