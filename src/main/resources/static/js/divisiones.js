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

            document.getElementById('divisionId').value = division.id;
            document.getElementById('divisionClave').value = division.clave;
            document.getElementById('divisionNombre').value = division.nombre;
            document.getElementById('divisionActivo').checked = division.activo;

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
    document.getElementById('divisionId').value = '';
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
        return;
    }

    const id = document.getElementById('divisionId').value; 

    const data = {
        id: id ? parseInt(id) : null, 
        clave: document.getElementById('divisionClave').value,
        nombre: document.getElementById('divisionNombre').value,
        activo: document.getElementById('divisionActivo').checked
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
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de que desea eliminar esta división?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#6AA276',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/division/delete/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const row = document.getElementById(`division-row-${id}`);
                    if (row) {
                        row.remove();
                    } else {
                        window.location.reload();
                    }
                } else {
                    Swal.fire('Error', 'Error al eliminar la división.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar división:', error);
                Swal.fire('Error', 'Ocurrió un error en la comunicación con el servidor.', 'error');
            }
        }
    });
}