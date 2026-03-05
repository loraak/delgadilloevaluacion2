async function abrirModalOferta(id) {
    const modalEl = document.getElementById('ofertaModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const modalTitle = document.getElementById('ofertaModalLabel');

    limpiarFormularioOferta();

    if (id) {
        modalTitle.textContent = 'Editar Oferta';
        try {
            const response = await fetch(`/api/ofertas/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la oferta.');
            }
            const oferta = await response.json();

            document.getElementById('ofertaId').value = oferta.id;
            document.getElementById('nombreOferta').value = oferta.nombreOferta;
            document.getElementById('modalidad').value = oferta.modalidad;
            document.getElementById('imagen').value = oferta.imagen || '';
            document.getElementById('divisionId').value = oferta.division ? oferta.division.id : '';
            mostrarPreview(oferta.imagen);

        } catch (error) {
            console.error('Error al obtener la oferta:', error);
            mostrarAlertaOferta('Error al cargar los datos: ' + error.message);
            return;
        }
    } else {
        modalTitle.textContent = 'Agregar Oferta';
    }

    modal.show();
}

function limpiarFormularioOferta() {
    const form = document.getElementById('ofertaForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('ofertaId').value = '';
    document.getElementById('ofertaAlertaError').classList.add('d-none');
    ocultarPreview();
}

function mostrarAlertaOferta(mensaje) {
    const alerta = document.getElementById('ofertaAlertaError');
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
}

function mostrarPreview(url) {
    const preview = document.getElementById('imagenPreview');
    if (url && url.trim() !== '') {
        preview.src = url;
        preview.classList.remove('d-none');
    } else {
        ocultarPreview();
    }
}

function ocultarPreview() {
    const preview = document.getElementById('imagenPreview');
    preview.src = '';
    preview.classList.add('d-none');
}

document.getElementById('imagen').addEventListener('input', function () {
    mostrarPreview(this.value);
});

async function guardarOferta(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = document.getElementById('ofertaForm');
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
        return;
    }

    const id = document.getElementById('ofertaId').value;
    const divisionId = document.getElementById('divisionId').value;

    const data = {
        id: id ? parseInt(id) : null,
        nombreOferta: document.getElementById('nombreOferta').value,
        modalidad: document.getElementById('modalidad').value,
        imagen: document.getElementById('imagen').value,
        division: divisionId ? { id: parseInt(divisionId) } : null
    };

    try {
        const response = await fetch('/api/oferta/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error al guardar la oferta.' }));
            throw new Error(errorData.message);
        }

        const result = await response.json();

        if (result.success) {
            bootstrap.Modal.getInstance(document.getElementById('ofertaModal')).hide();
            actualizarOAgregarCard(result.oferta);
        } else {
            mostrarAlertaOferta(result.message || 'Ocurrió un error al guardar.');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlertaOferta('Error al guardar: ' + error.message);
    }
}

function actualizarOAgregarCard(oferta) {
    const contenedor = document.getElementById('ofertas-container');
    if (!contenedor) {
        window.location.reload();
        return;
    }

    let col = document.getElementById(`oferta-card-${oferta.id}`);

    if (!col) {
        col = document.createElement('div');
        col.className = 'col';
        contenedor.appendChild(col);
    }

    col.id = `oferta-card-${oferta.id}`;
    const divisionNombre = oferta.division ? oferta.division.nombre : 'Sin División';

    col.innerHTML = `
        <div class="card h-100 shadow-sm border-1">
            <img src="${oferta.imagen || ''}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">${oferta.nombreOferta}</h5>
                <div class="mb-2">
                    <span class="text-dark">${oferta.modalidad}</span>
                </div>
                <div class="mb-2">
                    <span class="text-dark">${divisionNombre}</span>
                </div>
                <div class="mt-auto pt-3">
                    <button type="button" class="btn text-white w-100 fw-semibold"
                        style="background-color: #6AA276; border-color: #6AA276;"
                        onclick="abrirModalOferta(${oferta.id})">Editar</button>
                </div>
                <div class="mt-2">
                    <form action="/admin/oferta-educativa/delete/${oferta.id}" method="post">
                        <input type="hidden" name="_method" value="delete" />
                        <button type="submit" class="btn text-white w-100 fw-semibold"
                            style="background-color: #C73E3E; border-color: #C73E3E;">Eliminar</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}