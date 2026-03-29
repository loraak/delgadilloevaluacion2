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
            document.getElementById('objetivos-lista').innerHTML = '';
            document.getElementById('valores-lista').innerHTML = '';
            (seccion.objetivos || []).forEach(o => agregarItem('objetivos', o));
            (seccion.valores || []).forEach(v => agregarItem('valores', v));
            document.getElementById('seccionActiva').checked = seccion.activa;

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
    document.getElementById('objetivos-lista').innerHTML = '';
    document.getElementById('valores-lista').innerHTML = '';
    (document.objetivos || []).forEach(o => agregarItem('objetivos', o));
    (document.valores || []).forEach(v => agregarItem('valores', v));
}

function agregarItem(tipo, valor = '') {
    const lista = document.getElementById(`${tipo}-lista`);
    const div = document.createElement('div');
    div.className = 'd-flex gap-2 mb-2';
    div.innerHTML = `
        <input type="text" class="form-control" 
        data-tipo="${tipo}" placeholder="Escribe aquí..." value="${valor}" required>
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.parentElement.remove()">✕</button>
    `;
    lista.appendChild(div);
}

function obtenerLista(tipo) {
    return [...document.querySelectorAll(`[data-tipo="${tipo}"]`)]
        .map(input => input.value.trim())
        .filter(v => v !== '');
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

    const objetivos = obtenerLista('objetivos');
    const valores = obtenerLista('valores');

    if (objetivos.length === 0) {
        mostrarAlertaSeccion('Debes agregar al menos un objetivo.');
        return;
    }
    if (valores.length === 0) {
        mostrarAlertaSeccion('Debes agregar al menos un valor.');
        return;
    }

    const data = {
        id: id ? parseInt(id) : null,
        mision: document.getElementById('mision').value,
        vision: document.getElementById('vision').value,
        politica: document.getElementById('politica').value,
        objetivos: obtenerLista('objetivos'),
        valores: obtenerLista('valores'),
        activa: document.getElementById('seccionActiva').checked
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
        <div class="card shadow-sm border-1 mb-4 ${seccion.activa ? 'border-success border-2' : ''}">
            <div class="card-header fw-bold ${seccion.activa ? 'text-success' : ''}">
                ${seccion.activa ? 'SECCIÓN ACTIVA' : 'Sección Inactiva'}
            </div>
            <div class="card-body p-4">
                <div class="mb-3"><h4 class="fw-bold text-secondary">Misión</h4><p>${seccion.mision}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Visión</h4><p>${seccion.vision}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Política de Calidad</h4><p>${seccion.politica}</p></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Objetivos</h4><ul>${(seccion.objetivos || []).map(o => `<li>${o}</li>`).join('')}</ul></div>
                <div class="mb-3"><h4 class="fw-bold text-secondary">Valores</h4><ul>${(seccion.valores || []).map(v => `<li>${v}</li>`).join('')}</ul></div>
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