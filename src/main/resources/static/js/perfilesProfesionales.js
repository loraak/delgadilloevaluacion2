function limpiarFormularioPerfilProfesional() { 
    const form = document.getElementById('perfilProfesionalForm'); 
    form.reset(); 
    form.classList.remove('was-validated'); 
    document.getElementById('perfilProfesionalId');
    document.getElementById('perfilProfesionalAlertaError').classList.add('d-none'); 
    document.getElementById('capacidadesContainer').innerHTML = ''; 
    document.getElementById('capacidadesEspContainer').innerHTML = ''; 
    document.getElementById('competenciasBaseContainer').innerHTML = '';  
}

function mostrarAlertaPerfilProfesional(mensaje) { 
    const alerta = document.getElementById('perfilProfesionalAlertaError'); 
    alerta.textContent = mensaje; 
    alerta.classList.remove('d-none'); 
}

async function abrirModalPerfilProfesional(id) { 
    const modalEl = document.getElementById('perfilProfesionalModal'); 
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl); 
    const modalTitle = document.getElementById('perfilProfesionalModalLabel'); 

    limpiarFormularioPerfilProfesional(); 

    if (id) { 
        modalTitle.textContent = "Editar Perfil Profesional"
        try { 
            const response = await fetch(`/api/perfilesprofesionales/${id}`); 
            if (!response.ok) { 
                throw new Error('No se pudo obtener la información de la alerta.'); 
            }
            const perfil = await response.json(); 
            document.getElementById('perfilProfesionalId').value = perfil.id; 
            document.getElementById('perfilProfesionalTitulo').value = perfil.titulo; 
            document.getElementById('perfilProfesionalDescripcion').value = perfil.descripcion; 
            if (perfil.ofertaEducativa) { 
                document.getElementById('ofertaId').value = perfil.ofertaEducativa.id; 
            }
            if (perfil.capacidadesTransversales && perfil.capacidadesTransversales.length > 0) { 
                perfil.capacidadesTransversales.forEach(capacidad => { agregarInputCapacidad(capacidad.id, capacidad.descripcion); }); 
            } else { 
                agregarInputCapacidad(); 
            }
            if(perfil.capacidadesEspecificas && perfil.capacidadesEspecificas.length > 0) { 
                perfil.capacidadesEspecificas.sort((a, b) => a.ciclo - b.ciclo).forEach(capacidadEsp => { agregarInputCapacidadEsp(capacidadEsp.id, capacidadEsp.descripcion, capacidadEsp.ciclo); }); 
            } else { 
                agregarInputCapacidadEsp(); 
            } 
            if(perfil.competenciasBase && perfil.competenciasBase.length > 0) { 
                perfil.competenciasBase.forEach(competenciaBase => { agregarInputCompetenciaBase(competenciaBase.id, competenciaBase.descripcion); }); 
            } else { 
                agregarInputCompetenciaBase(); 
            } 
        } catch (error) { 
            console.error('Error al obtener el perfil profesional', error); 
            mostrarAlertaPerfilProfesional('Error al cargar datos: ', + error.message); 
            return; 
        }
    } else { 
        modalTitle.textContent = 'Agregar Perfil Profesional'; 
    }
    modal.show(); 
}

async function guardarPerfilProfesional(event) {
    event.preventDefault(); 
    event.stopPropagation(); 

    const form = document.getElementById('perfilProfesionalForm'); 
    form.classList.add('was-validated'); 

    if (!form.checkValidity()) { 
        return; 
    }

    const items = document.querySelectorAll('.capacidad-item'); 
    const listaCapacidades = []; 

    items.forEach(item => { 
        const idCapacidad = item.querySelector('.capacidad-id').value; 
        const textoCapacidad = item.querySelector('.capacidad-descripcion').value;

        if (textoCapacidad.trim() !== '') { 
            listaCapacidades.push({
                id: idCapacidad ? parseInt(idCapacidad) : null, 
                descripcion: textoCapacidad
            }); 
        }
    }); 

    const itemsEsp = document.querySelectorAll('.capacidadesp-item'); 
    const listaCapacidadesEsp = []; 

    itemsEsp.forEach(item => { 
        const idCapacidadEsp = item.querySelector('.capacidadesp-id').value; 
        const textoCapacidadEsp = item.querySelector('.capacidadesp-descripcion').value;
        const cicloCapacidadEsp = item.querySelector('.capacidadesp-ciclo').value; 

        if (textoCapacidadEsp.trim() !== '') { 
            listaCapacidadesEsp.push({
                id: idCapacidadEsp ? parseInt(idCapacidadEsp) : null, 
                descripcion: textoCapacidadEsp, 
                ciclo: parseInt(cicloCapacidadEsp)
            }); 
        }
    });

    const itemsCap = document.querySelectorAll('.competenciabase-item'); 
    const listaCompetencias = []; 

    itemsCap.forEach(item => { 
        const idCompetencia = item.querySelector('.competenciabase-id').value; 
        const textoCompetencia = item.querySelector('.competenciabase-descripcion').value;

        if (textoCompetencia.trim() !== '') { 
            listaCompetencias.push({
                id: idCompetencia ? parseInt(idCompetencia) : null, 
                descripcion: textoCompetencia
            }); 
        }
    }); 

    const idPerfil = document.getElementById('perfilProfesionalId').value; 

    const data = { 
        id: idPerfil ? parseInt(idPerfil): null, 
        titulo: document.getElementById('perfilProfesionalTitulo').value, 
        descripcion: document.getElementById('perfilProfesionalDescripcion').value, 
        capacidadesTransversales: listaCapacidades, 
        capacidadesEspecificas: listaCapacidadesEsp,
        competenciasBase: listaCompetencias,
        ofertaEducativa: document.getElementById('ofertaId').value ? { id: parseInt(document.getElementById('ofertaId').value) } : null
    }; 

    try {
        const response = await fetch('/api/perfilprofesional/save', {
            method: 'POST', 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        }); 
        if (!response.ok) { 
            const errorData = await response.json().catch(() => ({message: 'Error al guardar el perfil.'})); 
            throw new Error(errorData.message); 
        }

        const result = await response.json(); 

        bootstrap.Modal.getInstance(document.getElementById('perfilProfesionalModal')).hide(); 
        actualizarOAgregarCardPerfilProfesional(result.perfil); 
    } catch (error) { 
        console.error('Error: ', error); 
        mostrarAlertaPerfilProfesional('Error al guardar: ' + error.message); 
    }
}

function agregarInputCapacidad(id = '', descripcion = '') {
    const contenedor = document.getElementById('capacidadesContainer');

    const div = document.createElement('div');
    div.className = 'input-group mb-2 capacidad-item';

    div.innerHTML = `
        <input type="hidden" class="capacidad-id" value="${id}">
        
        <input type="text" class="form-control capacidad-descripcion" 
        placeholder="Ej: Pensamiento crítico..." value="${descripcion}" required>
        <button class="btn text-white" style="background-color: #C73E3E; border-color: #C73E3E;" 
                type="button" onclick="this.parentElement.remove()">X</button>`;
    
    contenedor.appendChild(div);
}

function agregarInputCapacidadEsp(id = '', descripcion = '', ciclo = '') {
    const contenedor = document.getElementById('capacidadesEspContainer');

    const div = document.createElement('div');
    div.className = 'input-group mb-2 capacidadesp-item';

    div.innerHTML = `
        <input type="hidden" class="capacidadesp-id" value="${id}">
        <input type="number" class="form-control capacidadesp-ciclo" placeholder="Ciclo" value="${ciclo}" style="width: 80px;" required>
        <input type="text" class="form-control capacidadesp-descripcion" placeholder="Ej: Pensamiento crítico..." value="${descripcion}" required>
        <button class="btn btn-outline-secondary" type="button" onclick="moverCapacidadEspArriba(this)">↑</button>
        <button class="btn btn-outline-secondary" type="button" onclick="moverCapacidadEspAbajo(this)">↓</button>
        <button class="btn text-white" style="background-color: #C73E3E; border-color: #C73E3E;" type="button" onclick="this.parentElement.remove()">X</button>`;
    
    contenedor.appendChild(div);
    actualizarCiclosCapacidadesEsp();
}

function moverCapacidadEspArriba(button) {
    const item = button.parentElement;
    const prev = item.previousElementSibling;
    if (prev) {
        item.parentElement.insertBefore(item, prev);
        actualizarCiclosCapacidadesEsp();
    }
}

function moverCapacidadEspAbajo(button) {
    const item = button.parentElement;
    const next = item.nextElementSibling;
    if (next) {
        item.parentElement.insertBefore(next, item);
        actualizarCiclosCapacidadesEsp();
    }
}

function actualizarCiclosCapacidadesEsp() {
    const items = document.querySelectorAll('#capacidadesEspContainer .capacidadesp-item');
    items.forEach((item, index) => {
        const cicloInput = item.querySelector('.capacidadesp-ciclo');
        cicloInput.value = index + 1;
    });
}

function actualizarOAgregarCardPerfilProfesional(perfil) {
    const contenedor = document.getElementById('perfiles-container');
    if (!contenedor) {
        window.location.reload();
        return;
    }

    let col = document.getElementById(`perfil-card-${perfil.id}`);

    if (!col) {
        col = document.createElement('div');
        col.className = 'col';
        contenedor.appendChild(col);
    }

    col.id = `perfil-card-${perfil.id}`;

    let capacidadesHtml = '';
    if (perfil.capacidadesTransversales && perfil.capacidadesTransversales.length > 0) {
        capacidadesHtml = '<ul class="list-unstyled mb-0">';
        perfil.capacidadesTransversales.forEach(capacidad => {
            capacidadesHtml += `<li><span>${capacidad.descripcion}</span></li>`;
        });
        capacidadesHtml += '</ul>';
    } else {
        capacidadesHtml = '<small class="text-muted">No hay capacidades registradas.</small>';
    }

    let capacidadesHtmlEsp = '';
    if (perfil.capacidadesEspecificas && perfil.capacidadesEspecificas.length > 0) {
        capacidadesHtmlEsp = '<ul class="list-unstyled mb-0">';
        perfil.capacidadesEspecificas.sort((a, b) => a.ciclo - b.ciclo).forEach(capacidadEsp => {
            capacidadesHtmlEsp += `<li><span>Ciclo ${capacidadEsp.ciclo}: ${capacidadEsp.descripcion}</span></li>`;
        });
        capacidadesHtmlEsp += '</ul>';
    } else {
        capacidadesHtmlEsp = '<small class="text-muted">No hay capacidades específicas registradas.</small>';
    }

    let competenciasBaseHtml = '';
    if (perfil.competenciasBase && perfil.competenciasBase.length > 0) {
        competenciasBaseHtml = '<ul class="list-unstyled mb-0">';
        perfil.competenciasBase.forEach(competencia => {
            competenciasBaseHtml += `<li><span>${competencia.descripcion}</span></li>`;
        });
        competenciasBaseHtml += '</ul>';
    } else {
        competenciasBaseHtml = '<small class="text-muted">No hay competencias base registradas.</small>';
    }

    let nombreOferta = 'Sin oferta'; 

    if (perfil.ofertaEducativa && perfil.ofertaEducativa.nombreOferta) { 
        nombreOferta = perfil.ofertaEducativa.nombreOferta; 
    } else if (perfil.ofertaEducativa && perfil.ofertaEducativa.id) { 
        const selectOfertas = document.getElementById('ofertaId'); 

        const opcionSeleccionada = selectOfertas.options[selectOfertas.selectedIndex]; 
        if (opcionSeleccionada && opcionSeleccionada.value) {
            nombreOferta = opcionSeleccionada.text; 
        }
    }

    col.innerHTML = `
        <div class="card h-100 shadow-sm border-1">
            <div class="card-body d-flex flex-column">
                <h6 class="fw-semibold text-secondary">Título:</h6>
                <h5 class="card-title">${perfil.titulo}</h5>
                <div class="mb-2">
                    <h6 class="fw-semibold text-secondary">Descripción:</h6>
                    <span class="text-dark">${perfil.descripcion}</span>
                </div>
                <div class="mb-3">
                    <h6 class="fw-semibold text-secondary">Capacidades Transversales:</h6>
                    ${capacidadesHtml}
                </div>
                <div class="mb-3">
                    <h6 class="fw-semibold text-secondary">Capacidades Específicas:</h6>
                    ${capacidadesHtmlEsp}
                </div>
                <div class="mb-3">
                    <h6 class="fw-semibold text-secondary">Competencias Base:</h6>
                    ${competenciasBaseHtml}
                </div>
                <div class="mb-2">
                    <h6 class="fw-semibold text-secondary">Oferta Educativa:</h6>
                    <span class="text-dark">${nombreOferta}</span>
                </div>
                <div class="mt-auto pt-3">
                    <button type="button" class="btn text-white w-100 fw-semibold"
                        style="background-color: #6AA276; border-color: #6AA276;" 
                        onclick="abrirModalPerfilProfesional(${perfil.id})">Editar</button>
                </div>
                <div class="mt-2">
                    <button type="button" class="btn text-white w-100 fw-semibold" 
                        style="background-color: #C73E3E; border-color:#C73E3E;" 
                        onclick="eliminarPerfil(${perfil.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

function agregarInputCompetenciaBase(id = '', descripcion = '') {
    const contenedor = document.getElementById('competenciasBaseContainer');

    const div = document.createElement('div');
    div.className = 'input-group mb-2 competenciabase-item';

    div.innerHTML = `
        <input type="hidden" class="competenciabase-id" value="${id}">
        
        <input type="text" class="form-control competenciabase-descripcion" 
        placeholder="Ej: Pensamiento crítico..." value="${descripcion}" required>
        <button class="btn text-white" style="background-color: #C73E3E; border-color: #C73E3E;" 
                type="button" onclick="this.parentElement.remove()">X</button>`;
    
    contenedor.appendChild(div);
}

async function eliminarPerfilProfesional(id) { 
    try { 
        const response = await fetch(`/api/perfilprofesional/delete/${id}`, {
            method: 'DELETE'
        }); 
        if (response.ok) { 
            const tarjeta = document.getElementById(`perfil-card-${id}`)
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