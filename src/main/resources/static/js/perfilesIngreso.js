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

function limpiarFormularioPerfil() {
    const form = document.getElementById('perfilForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('perfilId').value = '';
    document.getElementById('perfilAlertaError').classList.add('d-none');
    document.getElementById('capacidadesContainer').innerHTML = '';
}

function mostrarAlertaPerfil(mensaje) {
    const alerta = document.getElementById('perfilAlertaError');
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
}

async function abrirModalPerfil(id) { 
    const modalEl = document.getElementById('perfilModal'); 
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl); 
    const modalTitle = document.getElementById('perfilModalLabel'); 

    limpiarFormularioPerfil(); 

    if (id) { 
        modalTitle.textContent = "Editar Perfil"; 
        try { 
            const response = await fetch(`/api/perfiles/${id}`); 
            if (!response.ok) { 
                throw new Error('No se pudo obtener la información de la oferta.'); 
            }
            const perfil = await response.json(); 
            document.getElementById('perfilId').value = perfil.id; 
            document.getElementById('perfilTitulo').value = perfil.titulo;
            document.getElementById('perfilDescripcion').value = perfil.descripcion; 
            if(perfil.capacidadesTransversales && perfil.capacidadesTransversales.length > 0) { 
                perfil.capacidadesTransversales.forEach(capacidad => { agregarInputCapacidad(capacidad.id, capacidad.descripcion); }); 
                } else { 
                    agregarInputCapacidad(); 
                } 

        } catch (error) {
            console.error('Error al obtener el perfil', error); 
            mostrarAlertaPerfil('Error al cargar datos: ', + error.message); 
            return; 
        }
    } else { 
        modalTitle.textContent = 'Agregar Perfil'; 
    }
    modal.show(); 
} 

async function guardarPerfil(event) { 
    event.preventDefault(); 

    const items = document.querySelectorAll('.capacidad-item'); 
    const listaCapacidades = []; 

    items.forEach(item => { 
        const idCapacidad = item.querySelector('.capacidad-id').value; 
        const textoCapacidad = item.querySelector('.capacidad-descripcion').value

        if (textoCapacidad.trim() !== '') { 
            listaCapacidades.push({
                id: idCapacidad ? parseInt(idCapacidad) : null, 
                descripcion: textoCapacidad
            }); 
        }
    }); 

    const idPerfil = document.getElementById('perfilId').value; 

    const data = { 
        id: idPerfil ? parseInt(idPerfil): null, 
        titulo: document.getElementById('perfilTitulo').value, 
        descripcion: document.getElementById('perfilDescripcion').value, 
        capacidadesTransversales: listaCapacidades
    }; 

    try { 
        const response = await fetch('/api/perfil/save', { 
            method: 'POST', 
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        }); 

        if (!response.ok) { 
            const errorData = await response.json().catch(() => ({message: 'Error al guardar la oferta'})); 
            throw new Error(errorData.message); 
        } else { 
            mostrarAlertaPerfil(result.message || 'Ocurrió un error al guardar.'); 
        }
    } catch (error) { 
        console.error('Error: ', error); 
        mostrarAlertaPerfil('Error al guardar: ' + error.message); 
    }
}