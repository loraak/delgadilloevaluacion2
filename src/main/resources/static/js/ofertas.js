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

            //  Cómo se indica, se obtienen todos los elementos desde el html. 
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

//  Eliminar oferta educativa. 
async function eliminarOferta(id) {
    try {
        const response = await fetch(`/api/oferta/delete/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const tarjeta = document.getElementById(`oferta-card-${id}`);
            if (tarjeta) {
                tarjeta.remove();
            }
        } else {
            console.log("Problemas");
        }
    } catch (error) {
        console.error("Error", error);
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

    let divisionNombre = 'Sin División';

    if (oferta.division && oferta.division.nombre) {
        divisionNombre = oferta.division.nombre;
    } else if (oferta.division && oferta.division.id) {
        const selectDivision = document.getElementById('divisionId');
        const opcionSeleccionada = selectDivision.options[selectDivision.selectedIndex];
        if (opcionSeleccionada && opcionSeleccionada.value) {
            divisionNombre = opcionSeleccionada.text;
        }
    }
    
    const perfilIngresoTitulo = oferta.perfilDeIngreso ? oferta.perfilDeIngreso.titulo : 'Sin perfil registrado';
    const perfilProfesionalTitulo = oferta.perfilProfesional ? oferta.perfilProfesional.titulo : 'Sin perfil registrado';

    let capacidadesTransversalesIngresoHtml = '';
    if (oferta.perfilDeIngreso && oferta.perfilDeIngreso.capacidadesTransversales && oferta.perfilDeIngreso.capacidadesTransversales.length > 0) {
        capacidadesTransversalesIngresoHtml = '<h7 class="fw-semibold text-secondary">Capacidades Transversales:</h7><ul class="list-unstyled">';
        oferta.perfilDeIngreso.capacidadesTransversales.forEach(capacidad => {
            capacidadesTransversalesIngresoHtml += `<li>${capacidad.descripcion}</li>`;
        });
        capacidadesTransversalesIngresoHtml += '</ul>';
    }

    let capacidadesEspecificasIngresoHtml = '';
    if (oferta.perfilDeIngreso && oferta.perfilDeIngreso.capacidadesEspecificas && oferta.perfilDeIngreso.capacidadesEspecificas.length > 0) {
        capacidadesEspecificasIngresoHtml = '<h7 class="fw-semibold text-secondary">Capacidades Específicas:</h7><ul class="list-unstyled">';
        oferta.perfilDeIngreso.capacidadesEspecificas.forEach(capacidad => {
            capacidadesEspecificasIngresoHtml += `<li>${capacidad.descripcion}</li>`;
        });
        capacidadesEspecificasIngresoHtml += '</ul>';
    }

    let capacidadesTransversalesProfesionalHtml = '';
    if (oferta.perfilProfesional && oferta.perfilProfesional.capacidadesTransversales && oferta.perfilProfesional.capacidadesTransversales.length > 0) {
        capacidadesTransversalesProfesionalHtml = '<h7 class="fw-semibold text-secondary">Capacidades Transversales:</h7><ul class="list-unstyled">';
        oferta.perfilProfesional.capacidadesTransversales.forEach(capacidad => {
            capacidadesTransversalesProfesionalHtml += `<li>${capacidad.descripcion}</li>`;
        });
        capacidadesTransversalesProfesionalHtml += '</ul>';
    }

    let capacidadesEspecificasProfesionalHtml = '';
    if (oferta.perfilProfesional && oferta.perfilProfesional.capacidadesEspecificas && oferta.perfilProfesional.capacidadesEspecificas.length > 0) {
        capacidadesEspecificasProfesionalHtml = '<h7 class="fw-semibold text-secondary">Capacidades Específicas:</h7><ul class="list-unstyled mb-0">';
        oferta.perfilProfesional.capacidadesEspecificas.forEach(capacidad => {
            capacidadesEspecificasProfesionalHtml += `<li>Ciclo ${capacidad.ciclo}: ${capacidad.descripcion}</li>`;
        });
        capacidadesEspecificasProfesionalHtml += '</ul>';
    }

    let competenciasBaseHtml = '';
    if (oferta.perfilProfesional && oferta.perfilProfesional.competenciasBase && oferta.perfilProfesional.competenciasBase.length > 0) {
        competenciasBaseHtml = '<h7 class="fw-semibold text-secondary">Competencias Base:</h7><ul class="list-unstyled">';
        oferta.perfilProfesional.competenciasBase.forEach(competencia => {
            competenciasBaseHtml += `<li>${competencia.descripcion}</li>`;
        });
        competenciasBaseHtml += '</ul>';
    }

    const planImagen = oferta.planEstudios ? oferta.planEstudios.imagen : '';

    col.innerHTML = `
        <div class="card h-100 shadow-sm border-1">
            <img src="${oferta.imagen || ''}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h6 class="fw-semibold text-secondary">Nombre de la oferta:</h6>
                <h5 class="card-title fw-bold">${oferta.nombreOferta}</h5>
                <div class="mb-2">
                    <h7 class="fw-semibold text-secondary">Modalidad:</h7>
                    <span class="text-dark">${oferta.modalidad}</span>
                </div>
                <div class="mb-2">
                    <h7 class="fw-semibold text-secondary">División:</h7>
                    <span class="text-dark">${divisionNombre}</span>
                </div>
                <div class="mb-2">
                    <span class="fw-bold">Perfil de Ingreso: </span>
                    <span class="text-dark">${perfilIngresoTitulo}</span>
                </div>
                ${capacidadesTransversalesIngresoHtml ? `<div class="mb-2">${capacidadesTransversalesIngresoHtml}</div>` : ''}
                ${capacidadesEspecificasIngresoHtml ? `<div class="mb-2">${capacidadesEspecificasIngresoHtml}</div>` : ''}
                <div class="mb-2">
                    <span class="fw-bold">Perfil Profesional: </span>
                    <span class="text-dark">${perfilProfesionalTitulo}</span>
                </div>
                ${capacidadesTransversalesProfesionalHtml ? `<div class="mb-2">${capacidadesTransversalesProfesionalHtml}</div>` : ''}
                ${capacidadesEspecificasProfesionalHtml ? `<div class="mb-2">${capacidadesEspecificasProfesionalHtml}</div>` : ''}
                ${competenciasBaseHtml ? `<div class="mb-2">${competenciasBaseHtml}</div>` : ''}
                <span class="fw-bold">Plan de Estudios: </span>
                <img src="${planImagen || ''}" style="height: 200px; object-fit: cover;">
                <div class="mt-auto pt-3">
                    <button type="button" class="btn text-white w-100 fw-semibold"
                        style="background-color: #6AA276; border-color: #6AA276;"
                        onclick="abrirModalOferta(${oferta.id})">Editar</button>
                </div>
                <div class="mt-2">
                    <button type="button" class="btn text-white w-100 fw-semibold" style="background-color: #C73E3E; border-color:#C73E3E;" onclick="eliminarOferta(${oferta.id})"> Eliminar </button>
                </div>
            </div>
        </div>
    `;
}