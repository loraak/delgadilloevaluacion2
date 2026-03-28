async function abrirModalSeccion(id) {
    const modalEl = document.getElementById('seccionModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const modalTitle = document.getElementById('seccionModalLabel');

    limpiarFormularioSeccion();

    if (id) {
        modalTitle.textContent = 'Editar Sección Institucional';
        try {
            const response = await fetch(`/api/seccion-institucional/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la sección.');
            }
            const seccion = await response.json();

            document.getElementById('seccionId').value = seccion.id;
            document.getElementById('mision').value = seccion.mision;
            document.getElementById('vision').value = seccion.vision;
            document.getElementById('politica').value = seccion.politica;
            document.getElementById('objetivos').value = seccion.objetivos;
            document.getElementById('valores').value = seccion.valores;

        } catch (error) {
            console.error('Error al obtener los datos de la sección:', error);
            mostrarAlertaSeccion('Error al cargar los datos para editar. ' + error.message);
            return;
        }
    } else {
        modalTitle.textContent = 'Agregar Sección Institucional';
    }

    modal.show();
}

function limpiarFormularioSeccion() {
    const form = document.getElementById('seccionForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('seccionAlertaError').classList.add('d-none');
    document.getElementById('seccionId').value = '';
}

function mostrarAlertaSeccion(mensaje) {
    const alerta = document.getElementById('seccionAlertaError');
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
}

async function guardarSeccion(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = document.getElementById('seccionForm');
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
        return;
    }

    const id = document.getElementById('seccionId').value;

    const data = {
        id: id ? parseInt(id) : null,
        mision: document.getElementById('mision').value,
        vision: document.getElementById('vision').value,
        politica: document.getElementById('politica').value,
        objetivos: document.getElementById('objetivos').value,
        valores: document.getElementById('valores').value
    };

    try {
        const response = await fetch('/api/seccion-institucional/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error al guardar la sección.' }));
            throw new Error(errorData.message);
        }

        const result = await response.json();

        if (result.success) {
            const modalEl = document.getElementById('seccionModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
            actualizarOAgregarCard(result.seccion);
        } else {
            mostrarAlertaSeccion(result.message || 'Ocurrió un error al guardar la sección.');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlertaSeccion('Error al guardar: ' + error.message);
    }
}

function actualizarOAgregarCard(seccion) {
    const container = document.getElementById('seccion-container');
    if (!container) {
        window.location.reload();
        return;
    }

    let cardContainer = document.getElementById(`seccion-card-${seccion.id}`);
    const isNew = !cardContainer;

    if (isNew) {
        cardContainer = document.createElement('div');
        cardContainer.className = 'col-md-8';
        cardContainer.id = `seccion-card-${seccion.id}`;
        container.appendChild(cardContainer);
    }

    cardContainer.innerHTML = `
        <div class="card shadow-sm border-1 mb-4">
            <div class="card-body p-4">
                <div class="mb-3"><h4 class="fw-bold text-secondary">Misión</h4><p>${seccion.mision}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Visión</h4><p>${seccion.vision}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Política de Calidad</h4><p>${seccion.politica}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Objetivos</h4><p>${seccion.objetivos}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Valores</h4><p>${seccion.valores}</p></div>
                <div class="mt-auto pt-3"><button type="button" class="btn text-white w-100 fw-semibold" style="background-color: #6AA276; border-color: #6AA276;" onclick="abrirModalSeccion(${seccion.id})">Editar</button></div>
                <div class="mt-2"><button type="button" class="btn text-white w-100 fw-semibold" style="background-color: #C73E3E; border-color:#C73E3E;" onclick="eliminarSeccion(${seccion.id})"> Eliminar </button></div>
            </div>
        </div>
    `;
}

async function eliminarSeccion(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
        return;
    }

    try {
        const response = await fetch(`/api/seccion-institucional/delete/${id}`, { method: 'DELETE' });
        if (response.ok) {
            document.getElementById(`seccion-card-${id}`).remove();
        } else {
            alert('Error al eliminar la sección.');
        }
    } catch (error) {
        console.error('Error al eliminar la sección:', error);
        alert('Ocurrió un error en la comunicación con el servidor.');
    }
}