$(document).ready(function () {
  // la API busca paises de lengua española donde pone "lang/spanish" en el $.getJSON
  // ademas en la const "nombreComun segun el pais escogido, en el nombreOficial fija el nombre oficial del pais en ingles (lengua oficial)"
  $.getJSON('https://restcountries.com/v3.1/lang/spanish', function (data) {
    data.forEach(function (pais) {
      const nombreComun = pais.name.common;
      const nombreOficial = pais.name.official;

      $('#pais').append(
        `<option value="${nombreComun}" data-oficial="${nombreOficial}">${nombreComun}</option>`
      );
    });
  });

  // Cuando se seleccione un país, mostrar su nombre oficial
  $('#pais').on('change', function () {
    const nombreOficial = $(this).find(':selected').data('oficial') || '';
    $('#paisoficial').val(nombreOficial);
  });

    $('#formularioContacto').on('submit', function (e) {
    e.preventDefault(); // Evita el envío real del formulario

    // Obtener los valores
    const nombre = $('#nombre').val().trim();
    const telefono = $('#telefono').val().trim();
    const correo = $('#correo').val().trim();
    const pais = $('#pais').val();
    const nombreOficial = $('#paisoficial').val().trim();
    const comentario = $('#mensajeformulario').val().trim();

    // Validar correo con expresión regular
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    const telefonoValido = /^[1-9][0-9]{7,8}$/.test(telefono);
    if (!telefonoValido) {
        alert('Por favor, ingrese un número de teléfono válido (8 o 9 dígitos, sin espacios ni letras).');
        return;
    }

    // Validar que todos los campos estén completos
    if (!nombre || !telefono || !correo || !pais || !nombreOficial || !comentario) {
      alert('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    if (!correoValido) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    // Si todo está correcto:
    alert('Validación correcta. Listo para guardar.');
    // Aquí en el siguiente paso se guardarán los datos en LocalStorage

    const nuevoContacto = {
      nombre,
      telefono,
      correo,
      pais,
      nombreOficial,
      comentario
    };

    // Obtener datos existentes o iniciar array
    let contactos = JSON.parse(localStorage.getItem('contactos')) || [];

    // Agregar nuevo contacto
    if (indiceEditar === -1) {
        // Nuevo registro
        contactos.push(nuevoContacto);
        alert('Nuevo registro agregado.');
    } else {
        // Editando existente
        contactos[indiceEditar] = nuevoContacto;
        alert('Registro actualizado correctamente.');
        indiceEditar = -1; // Reiniciar
    }

    // Guardar en LocalStorage
    localStorage.setItem('contactos', JSON.stringify(contactos));

    // Limpiar el formulario
    this.reset();
    $('#paisoficial').val('');

    // Mostrar mensaje
    alert('Datos guardados correctamente.');

    // Refrescar lista
    mostrarRegistros();
  });

});

function mostrarRegistros() {
  let contactos = JSON.parse(localStorage.getItem('contactos')) || [];
  let tabla = `
    <table class="table table-striped table-hover table-bordered mt-4 shadow">
      <thead class="thead-dark">
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Correo</th>
          <th>País</th>
          <th>Nombre Oficial</th>
          <th>Comentario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  contactos.forEach((contacto, index) => {
    tabla += `
      <tr class="text-center align-middle">
        <td>${contacto.nombre}</td>
        <td>${contacto.telefono}</td>
        <td>${contacto.correo}</td>
        <td>${contacto.pais}</td>
        <td>${contacto.nombreOficial}</td>
        <td>${contacto.comentario}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editarRegistro(${index})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarRegistro(${index})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  tabla += `</tbody></table>`;
  $('#tablaRegistros').html(tabla);
}

function eliminarRegistro(index) {
  // Confirmación antes de eliminar
  if (!confirm('¿Estás seguro que deseas eliminar este registro?')) return;

  // Obtener registros existentes
  let contactos = JSON.parse(localStorage.getItem('contactos')) || [];

  // Eliminar por índice
  contactos.splice(index, 1);

  // Guardar cambios en LocalStorage
  localStorage.setItem('contactos', JSON.stringify(contactos));

  // Actualizar tabla
  mostrarRegistros();
}

let indiceEditar = -1;

function editarRegistro(index) {
    let contactos = JSON.parse(localStorage.getItem('contactos')) || [];
    let contacto = contactos[index];


    $('#nombre').val(contacto.nombre);
    $('#telefono').val(contacto.telefono);
    $('#correo').val(contacto.correo);
    $('#pais').val(contacto.pais);
    $('#paisoficial').val(contacto.nombreOficial);
    $('#mensajeformulario').val(contacto.comentario);
    indiceEditar = index;
}
