document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    const tablaBody = document.getElementById('tablaBody');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetSection = document.querySelector(`#${this.dataset.section}`);
            
            sections.forEach(section => {
                section.style.display = 'none';
            });

            targetSection.style.display = 'block';
        });
    });

const form = document.getElementById('formulario');
form.addEventListener('submit',async(event)=>{
    event.preventDefault();

    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;
    console.log(name);
    try{
        const response = await fetch('/datos',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message})
        });

        if(response.ok){
            tablaBody.innerHTML='';
            cargarRegistros();
        }else{
            console.log('error en la respuesta del servidor');
        }
    }catch(error){
        console.erro('error al enviar el formulario ', error);
    }
    
    
    
});

const cargarRegistros = async ()=>{
    try{
        const respuesta = await fetch('/registros');
        const registros = await respuesta.json();
        
        console.log(registros);
        //tabla
        registros.forEach(function(item){
            var fila = document.createElement('tr');

            var columnaCodigo = document.createElement('td');
            columnaCodigo.textContent = item.usuarioID;
            fila.appendChild(columnaCodigo);

            var columnaNombre = document.createElement('td');
            columnaNombre.textContent = item.nombre;
            fila.appendChild(columnaNombre);

            var columnaEmail = document.createElement('td');
            columnaEmail.textContent = item.email;
            fila.appendChild(columnaEmail);

            var columnaMensaje = document.createElement('td');
            columnaMensaje.textContent = item.mensaje;
            fila.appendChild(columnaMensaje);

            tablaBody.appendChild(fila);
            
            form.reset();
        })
    }catch(error){
        console.log(error)
    }
}

cargarRegistros();

});
