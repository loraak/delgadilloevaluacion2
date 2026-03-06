async function abrirModalPlan(id) {
    const modalEl = document.getElementById('planModal'); 
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl); 
    const modalTitle = document.getElementById('planModalLabel'); 

    limpiarFormularioPlan(); 

    if (id) { 
        modalTitle.textContent = "Editar Plan"; 
        try {
            const response = await fetch(`/api/planestudios/${id}`); 
            if (!response.ok) { 
                throw new Error('No se pudo obtener la información del plan'); 
            }
            const plan = await response.json(); 

            document.getElementById('planId').value = plan.id; 
            document.getElementById('imagen').value = plan.imagen || '';
            if (plan.ofertaEducativa) { 
                document.getElementById('ofertaId').value = plan.ofertaEducativa.id; 
            }
            mostrarPreview(plan.imagen); 
        } catch (error) { 
            console.error('Error al obtener plan: ', error); 
            mostrarAlertaPlan('Error al cargar los datos: ' + error.message); 
            return; 
        }
    } else { 
        modalTitle.textContent = 'Agregar Plan'; 
    }
    modal.show(); 
}

function mostrarAlertaPlan(mensaje) { 
    const alerta = document.getElementById('planAlertaError'); 
    alerta.textContent = mensaje; 
    alerta.classList.remove('d-none'); 
}

function limpiarFormularioPlan() { 
    const form = document.getElementById('planForm'); 
    form.reset(); 
    form.classList.remove('was-validated'); 
    document.getElementById('planId').value = ''; 
    document.getElementById('planAlertaError').classList.add('d-none'); 
    ocultarPreview(); 
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

function actualizarOAgregarCardPlan(plan) {
    const contenedor = document.getElementById('planes-container');
    if (!contenedor) {
        window.location.reload();
        return;
    }

    let col = document.getElementById(`plan-card-${plan.id}`);

    if (!col) {
        col = document.createElement('div');
        col.className = 'col';
        contenedor.appendChild(col);
    }

    col.id = `plan-card-${plan.id}`;

    let nombreOferta = 'Sin oferta'; 

    if (plan.ofertaEducativa && plan.ofertaEducativa.nombreOferta) { 
        nombreOferta = plan.ofertaEducativa.nombreOferta; 
    } else if (plan.ofertaEducativa && plan.ofertaEducativa.id) { 
        const selectOfertas = document.getElementById('ofertaId'); 

        const opcionSeleccionada = selectOfertas.options[selectOfertas.selectedIndex]; 
        if (opcionSeleccionada && opcionSeleccionada.value) {
            nombreOferta = opcionSeleccionada.text; 
        }
    }

    col.innerHTML = `
        <div class="card h-100 shadow-sm border-1">
            <img src="${plan.imagen || ''}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <div class="mb-2">
                    <h6 class="fw-semibold text-secondary">Oferta Educativa:</h6>
                    <span class="text-dark">${nombreOferta}</span>
                </div>
                <div class="mt-auto pt-3">
                    <button type="button" class="btn text-white w-100 fw-semibold"
                        style="background-color: #6AA276; border-color: #6AA276;" 
                        onclick="abrirModalPlan(${plan.id})">Editar</button>
                </div>
                <div class="mt-2">
                    <button type="button" class="btn text-white w-100 fw-semibold" 
                        style="background-color: #C73E3E; border-color:#C73E3E;" 
                        onclick="eliminarPlan(${plan.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

async function guardarPlan(event) {
    event.preventDefault(); 
    event.stopPropagation();  

    const form = document.getElementById('planForm'); 
    form.classList.add('was-validated'); 

    if (!form.checkValidity()) { 
        return; 
    }

    const idPlan = document.getElementById('planId').value; 

    const data = { 
        id: idPlan ? parseInt(idPlan): null, 
        imagen: document.getElementById('imagen').value, 
        ofertaEducativa: document.getElementById('ofertaId').value ? {id: parseInt (document.getElementById('ofertaId').value) } : null
    }; 

    try {
        const response = await fetch('/api/planestudios/save', {
            method: 'POST', 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        }); 
        if (!response.ok) { 
            const errorData = await response.json().catch(() => ({message: 'Error al guardar el perfil.'})); 
            throw new Error(errorData.message); 
        }

        const result = await response.json(); 

        if (result.success) { 
            bootstrap.Modal.getInstance(document.getElementById('planModal')).hide(); 
            actualizarOAgregarCardPlan(result.plan); 
        } else {
            mostrarAlertaPlan(result.message || 'Ocurrió un error al guardar.'); 
        } 
    } catch (error) { 
        console.error('Error: ', error); 
        mostrarAlertaPlan('Error al guardar: ' + error.message); 
    }
}

async function eliminarPlan() {

}