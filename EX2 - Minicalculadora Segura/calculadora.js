const $formulario = $("#formCalculadora");
const $numero1 = $("#numero1");
const $numero2 = $("#numero2");
const $operacion = $("#operacion");
const $resultado = $("#resultado");
const $historial = $("#historial");

let historial = JSON.parse(localStorage.getItem("historialCalculadora")) || [];

const formatearOperacion = ({ operacion, n1, n2, resultado }) => `${n1} ${operacion} ${n2} = ${resultado}`;

const actualizarHistorial = () => {
  $historial.empty();

  historial.forEach((item) => {
    const { operacion, n1, n2, resultado } = item;
    const $item = $("<li></li>").text(formatearOperacion({ operacion, n1, n2, resultado }));
    $historial.append($item);
  });

  console.log("🧾 Historial actual:", historial);
};

const guardarHistorial = () => {
  localStorage.setItem("historialCalculadora", JSON.stringify(historial));
  actualizarHistorial();
};

const validarEntrada = (valor1, valor2) => {
  const numero1 = Number(valor1);
  const numero2 = Number(valor2);

  if (valor1.trim() === "" || valor2.trim() === "" || Number.isNaN(numero1) || Number.isNaN(numero2)) {
    return {
      ok: false,
      mensaje: "Debes ingresar números válidos"
    };
  }

  return { ok: true, numero1, numero2 };
};

const obtenerResultado = (operacionSeleccionada, n1, n2) => {
  switch (operacionSeleccionada) {
    case "suma":
      return { ok: true, valor: n1 + n2 };
    case "resta":
      return { ok: true, valor: n1 - n2 };
    case "multiplicacion":
      return { ok: true, valor: n1 * n2 };
    case "division":
      if (n2 === 0) {
        return { ok: false, mensaje: "No se puede dividir entre 0" };
      }
      return { ok: true, valor: n1 / n2 };
    default:
      return { ok: false, mensaje: "Operación no válida" };
  }
};

$formulario.on("submit", (event) => {
  event.preventDefault();

  const { value: valor1 } = $numero1[0];
  const { value: valor2 } = $numero2[0];
  const { value: operacionSeleccionada } = $operacion[0];

  console.log("📥 Entrada recibida:", {
    operacion: operacionSeleccionada,
    numero1: valor1,
    numero2: valor2
  });

  const validacion = validarEntrada(valor1, valor2);

  if (!validacion.ok) {
    $resultado.text(validacion.mensaje);
    console.log("⚠️ Validación fallida:", {
      numero1: valor1,
      numero2: valor2,
      mensaje: validacion.mensaje
    });
    console.log("🧾 Historial actual:", historial);
    return;
  }

  const { numero1: n1, numero2: n2 } = validacion;
  const resultadoCalculado = obtenerResultado(operacionSeleccionada, n1, n2);

  if (!resultadoCalculado.ok) {
    $resultado.text(resultadoCalculado.mensaje);
    console.log("⚠️ Validación fallida:", {
      operacion: operacionSeleccionada,
      numero1: n1,
      numero2: n2,
      mensaje: resultadoCalculado.mensaje
    });
    console.log("🧾 Historial actual:", historial);
    return;
  }

  const operacionRealizada = {
    operacion: operacionSeleccionada,
    n1,
    n2,
    resultado: resultadoCalculado.valor
  };

  historial.unshift(operacionRealizada);
  guardarHistorial();

  $resultado.text(resultadoCalculado.valor);
  console.log("✅ Resultado calculado:", {
    entrada: operacionRealizada,
    salida: resultadoCalculado.valor
  });
  console.log("🧾 Historial actual:", historial);
});

actualizarHistorial();