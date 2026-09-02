// =====================================================
// EX1 - Directorio de Usuarios
// API: https://jsonplaceholder.typicode.com/users
// Tecnologias: ES6 + Axios + jQuery
// =====================================================

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Variable que guarda todos los usuarios cargados
let todosLosUsuarios = [];

// ---------------------------------------------------
// 1. Cargar usuarios con Axios + async/await
// ---------------------------------------------------
const cargarUsuarios = async () => {
  try {
    const response = await axios.get(API_URL);
    const usuarios = response.data;

    todosLosUsuarios = usuarios;

    // LOG 1: resumen de carga
    console.log(`Usuarios cargados: ${usuarios.length}`);
    console.log('Primera fila:', usuarios[0]);

    renderizarTabla(usuarios);

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

// ---------------------------------------------------
// 2. Renderizar tabla con jQuery
// ---------------------------------------------------
const renderizarTabla = (usuarios) => {
  const $tbody = $('#tbody-usuarios');
  $tbody.empty();

  usuarios.forEach((usuario, index) => {
    const { id, name, email, company } = usuario;  // destructuring

    const fila = `<tr data-id="${id}" class="fila-usuario">
      <td>${index + 1}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${company.name}</td>
    </tr>`;

    $tbody.append(fila);
  });
};

// ---------------------------------------------------
// 3. Filtro en vivo por nombre
// ---------------------------------------------------
$('#filtro').on('input', function () {
  const termino = $(this).val().toLowerCase().trim();

  const coincidencias = todosLosUsuarios.filter(({ name }) =>
    name.toLowerCase().includes(termino)
  );

  // LOG 2: termino de busqueda y cantidad de coincidencias
  console.log(`Filtro: "${termino}" | Coincidencias: ${coincidencias.length}`);

  renderizarTabla(coincidencias);
});

// ---------------------------------------------------
// 4. Detalle al hacer clic en una fila
// ---------------------------------------------------
$('#tbody-usuarios').on('click', '.fila-usuario', function () {
  const id = parseInt($(this).data('id'));

  const usuario = todosLosUsuarios.find((u) => u.id === id);

  if (!usuario) return;

  const { name, phone, address } = usuario;  // destructuring
  const direccionFormato = `${address.street}, ${address.city}`;

  // LOG 3: detalle del usuario seleccionado
  console.log('Usuario seleccionado:', { name, phone, address: direccionFormato });

  $('#detalle-nombre').text(name);
  $('#detalle-telefono').text(phone);
  $('#detalle-direccion').text(direccionFormato);
  $('#panel-detalle').removeClass('oculto');
});

// ---------------------------------------------------
// 5. Cerrar panel de detalle
// ---------------------------------------------------
$('#btn-cerrar').on('click', function() {
  $('#panel-detalle').addClass('oculto');
});

// ---------------------------------------------------
// Iniciar la aplicacion
// ---------------------------------------------------
cargarUsuarios();
