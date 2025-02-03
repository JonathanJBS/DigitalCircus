// script.js

function iniciarQuiz(quizNumber, respuestasCorrectas) {
    let puntaje = 0;
    const totalPreguntas = Object.keys(respuestasCorrectas).length;
    let respuestasUsuario = {};
  
    // Hacer que selectAnswer sea accesible globalmente
    window.selectAnswer = function(pregunta, respuestaSeleccionada) {
      // Guardar la respuesta del usuario
      respuestasUsuario[pregunta] = respuestaSeleccionada;
  
      // Verificar si la respuesta es correcta
      if (respuestaSeleccionada === respuestasCorrectas[pregunta]) {
        puntaje++;
      }
  
      // Actualizar la barra de progreso
      const porcentaje = (pregunta / totalPreguntas) * 100;
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = porcentaje + '%';
      }
  
      // Animación de salida
      const currentQuestion = document.getElementById('question-' + pregunta);
      if (currentQuestion) {
        currentQuestion.classList.add('fade-out');
      }
  
      setTimeout(() => {
        if (currentQuestion) {
          currentQuestion.classList.add('hidden');
        }
  
        // Mostrar la siguiente pregunta o el mensaje final
        const next = pregunta + 1;
        const nextQuestion = document.getElementById('question-' + next);
        if (nextQuestion) {
          nextQuestion.classList.remove('hidden');
          nextQuestion.classList.add('fade-in');
        } else {
          mostrarResumen();
        }
      }, 500);
    };
  
    function mostrarResumen() {
      const completionMessage = document.getElementById('completion-message');
      if (completionMessage) {
        completionMessage.classList.remove('hidden');
        completionMessage.classList.add('fade-in');
      }
      const scoreDisplay = document.getElementById('score-display');
      if (scoreDisplay) {
        scoreDisplay.innerText = puntaje;
      }
  
      // Generar el resumen de respuestas
      const summary = document.getElementById('summary');
      if (summary) {
        for (let i = 1; i <= totalPreguntas; i++) {
          const p = document.createElement('p');
          p.classList.add('mb-2', 'flex', 'items-center');
  
          if (respuestasUsuario[i] === respuestasCorrectas[i]) {
            p.innerHTML = `<span class="text-green-600 font-bold mr-2">✓</span> Pregunta ${i}: Correcta`;
          } else {
            p.innerHTML = `<span class="text-red-600 font-bold mr-2">✗</span> Pregunta ${i}: Incorrecta (Respuesta correcta: ${respuestasCorrectas[i]})`;
          }
  
          summary.appendChild(p);
        }
      }
  
      // Guardar el puntaje en localStorage
      localStorage.setItem('puntaje' + quizNumber, puntaje);
    }
  }
  
  // Código para la página final.html
  function mostrarResultadosFinales() {
    const puntaje1 = parseInt(localStorage.getItem('puntaje1')) || 0;
    const puntaje2 = parseInt(localStorage.getItem('puntaje2')) || 0;
    const puntaje3 = parseInt(localStorage.getItem('puntaje3')) || 0;
    const puntaje4 = parseInt(localStorage.getItem('puntaje4')) || 0;
    const puntajeTotal = puntaje1 + puntaje2 + puntaje3 + puntaje4;
  
    document.getElementById('puntaje1').innerText = puntaje1;
    document.getElementById('puntaje2').innerText = puntaje2;
    document.getElementById('puntaje3').innerText = puntaje3;
    document.getElementById('puntaje4').innerText = puntaje4;
    document.getElementById('puntajeTotal').innerText = puntajeTotal;
  
    // Limpiar el localStorage para reiniciar desde cero
    localStorage.clear();
  }
  



  
// script.js

// Función para manejar la página inicial
function inicial() {
    const btnInvitado = document.getElementById('btnInvitado');
    const btnCedula = document.getElementById('btnCedula');
    const cedulaSection = document.getElementById('cedulaSection');
    const consultarAlumno = document.getElementById('consultarAlumno');
    const cedulaInput = document.getElementById('cedulaInput');
    const resultadoAlumno = document.getElementById('resultadoAlumno');
    const comenzarSection = document.getElementById('comenzarSection');
    const btnVolver = document.getElementById('btnVolver');
  
    // Evento para ingresar como espectador
    btnInvitado.addEventListener('click', () => {
      localStorage.setItem('nombreAlumno', 'Desconocido');
      localStorage.setItem('cedulaAlumno', null);
      mostrarComenzar();
      btnInvitado.disabled = true;
      btnCedula.disabled = true;
    });
  
    // Evento para ingresar con cédula
    btnCedula.addEventListener('click', () => {
      cedulaSection.classList.remove('hidden');
      btnInvitado.disabled = true;
      btnCedula.disabled = true;
    });
  
    // Evento para consultar alumno por cédula
    consultarAlumno.addEventListener('click', async () => {
      const cedula = cedulaInput.value.trim();
      if (cedula === '') {
        resultadoAlumno.textContent = '🎩 Por favor, ingresa tu cédula.';
        return;
      }
  
      resultadoAlumno.textContent = '🔮 Realizando magia...';
      try {
        const URLc = 'https://unefa6tosistemas2025api.onrender.com/api/articulos';
        const respuestaAlumno = await fetch(URLc + '/' + cedula);
        const resultadoAlumnoData = await respuestaAlumno.json();
  
        if (resultadoAlumnoData.Resul) {
          const nombreCompleto = resultadoAlumnoData.data[0].ALUNOMBRE + ' ' + resultadoAlumnoData.data[0].ALUNAPELL;
          resultadoAlumno.textContent = `🎉 ¡Bienvenido al espectáculo, ${nombreCompleto}!`;
          localStorage.setItem('nombreAlumno', nombreCompleto);
          localStorage.setItem('cedulaAlumno', cedula);
          mostrarComenzar();
        } else {
          resultadoAlumno.textContent = `🤔 Hmm... no encontramos tu cédula. Por favor, ingresa como espectador.`;
          btnVolver.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error al consultar la API:', error);
        resultadoAlumno.textContent = '🛑 ¡Oh no! Algo salió mal. ¡Intenta nuevamente!';
        btnVolver.classList.remove('hidden');
      }
    });
  
    // Evento para volver a la pantalla inicial
    btnVolver.addEventListener('click', () => {
      cedulaSection.classList.add('hidden');
      resultadoAlumno.textContent = '';
      cedulaInput.value = '';
      btnVolver.classList.add('hidden');
      btnInvitado.disabled = false;
      btnCedula.disabled = false;
    });
  
    function mostrarComenzar() {
      comenzarSection.classList.remove('hidden');
      cedulaSection.classList.add('hidden');
    }
  }
  
  // Función para inicializar el quiz
  function iniciarQuiz(quizNumber, respuestasCorrectas) {
    let puntaje = 0;
    const totalPreguntas = Object.keys(respuestasCorrectas).length;
    let respuestasUsuario = {};
  
    // Hacer que selectAnswer sea accesible globalmente
    window.selectAnswer = function(pregunta, respuestaSeleccionada) {
      // Guardar la respuesta del usuario
      respuestasUsuario[pregunta] = respuestaSeleccionada;
  
      // Verificar si la respuesta es correcta
      if (respuestaSeleccionada === respuestasCorrectas[pregunta]) {
        puntaje++;
      }
  
      // Actualizar la barra de progreso
      const porcentaje = (pregunta / totalPreguntas) * 100;
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = porcentaje + '%';
      }
  
      // Animación de salida
      const currentQuestion = document.getElementById('question-' + pregunta);
      if (currentQuestion) {
        currentQuestion.classList.add('fade-out');
      }
  
      setTimeout(() => {
        if (currentQuestion) {
          currentQuestion.classList.add('hidden');
        }
  
        // Mostrar la siguiente pregunta o el mensaje final
        const next = pregunta + 1;
        const nextQuestion = document.getElementById('question-' + next);
        if (nextQuestion) {
          nextQuestion.classList.remove('hidden');
          nextQuestion.classList.add('fade-in');
        } else {
          mostrarResumen();
        }
      }, 500);
    };
  
    function mostrarResumen() {
      const completionMessage = document.getElementById('completion-message');
      if (completionMessage) {
        completionMessage.classList.remove('hidden');
        completionMessage.classList.add('fade-in');
      }
      const scoreDisplay = document.getElementById('score-display');
      if (scoreDisplay) {
        scoreDisplay.innerText = puntaje;
      }
  
      // Generar el resumen de respuestas
      const summary = document.getElementById('summary');
      if (summary) {
        for (let i = 1; i <= totalPreguntas; i++) {
          const p = document.createElement('p');
          p.classList.add('mb-2', 'flex', 'items-center');
  
          if (respuestasUsuario[i] === respuestasCorrectas[i]) {
            p.innerHTML = `<span class="text-green-600 font-bold mr-2">✓</span> Pregunta ${i}: Correcta`;
          } else {
            p.innerHTML = `<span class="text-red-600 font-bold mr-2">✗</span> Pregunta ${i}: Incorrecta (Respuesta correcta: ${respuestasCorrectas[i]})`;
          }
  
          summary.appendChild(p);
        }
      }
  
      // Guardar el puntaje en localStorage
      localStorage.setItem('puntaje' + quizNumber, puntaje);
    }
  }
  








// Función para manejar la página inicial
function inicial() {
    const btnInvitado = document.getElementById('btnInvitado');
    const btnCedula = document.getElementById('btnCedula');
    const cedulaSection = document.getElementById('cedulaSection');
    const consultarAlumno = document.getElementById('consultarAlumno');
    const cedulaInput = document.getElementById('cedulaInput');
    const resultadoAlumno = document.getElementById('resultadoAlumno');
    const comenzarSection = document.getElementById('comenzarSection');
    const btnVolver = document.getElementById('btnVolver');
  
    // Evento para ingresar como espectador
    btnInvitado.addEventListener('click', () => {
      localStorage.setItem('nombreAlumno', 'Desconocido');
      localStorage.setItem('cedulaAlumno', null);
      mostrarComenzar();
      btnInvitado.disabled = true;
      btnCedula.disabled = true;
    });
  
    // Evento para ingresar con cédula
    btnCedula.addEventListener('click', () => {
      cedulaSection.classList.remove('hidden');
      btnInvitado.disabled = true;
      btnCedula.disabled = true;
    });
  
    // Evento para consultar alumno por cédula
    consultarAlumno.addEventListener('click', async () => {
      const cedula = cedulaInput.value.trim();
      if (cedula === '') {
        resultadoAlumno.textContent = '🎩 Por favor, ingresa tu cédula mágica.';
        return;
      }
  
      resultadoAlumno.textContent = '🔮 Realizando magia...';
      try {
        const URLc = 'https://unefa6tosistemas2025api.onrender.com/api/articulos';
        const respuestaAlumno = await fetch(URLc + '/' + cedula);
        const resultadoAlumnoData = await respuestaAlumno.json();
  
        if (resultadoAlumnoData.Resul) {
          const nombreCompleto = resultadoAlumnoData.data[0].ALUNOMBRE + ' ' + resultadoAlumnoData.data[0].ALUNAPELL;
          resultadoAlumno.textContent = `🎉 ¡Bienvenido al espectáculo, ${nombreCompleto}!`;
          localStorage.setItem('nombreAlumno', nombreCompleto);
          localStorage.setItem('cedulaAlumno', cedula);
          mostrarComenzar();
        } else {
          resultadoAlumno.textContent = `🤔 Hmm... no encontramos tu cédula. Por favor, ingresa como espectador.`;
          btnVolver.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error al consultar la API:', error);
        resultadoAlumno.textContent = '🛑 ¡Oh no! Algo salió mal. ¡Intenta nuevamente!';
        btnVolver.classList.remove('hidden');
      }
    });
  
    // Evento para volver a la pantalla inicial
    btnVolver.addEventListener('click', () => {
      cedulaSection.classList.add('hidden');
      resultadoAlumno.textContent = '';
      cedulaInput.value = '';
      btnVolver.classList.add('hidden');
      btnInvitado.disabled = false;
      btnCedula.disabled = false;
    });
  
    function mostrarComenzar() {
      comenzarSection.classList.remove('hidden');
      cedulaSection.classList.add('hidden');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('btnInvitado')) {
      inicial();
    }
  });
  







// Función para obtener los artículos mágicos
async function obtenerArticulos() {
  const cedulaAlumno = localStorage.getItem('cedulaAlumno');
  const nombreAlumno = localStorage.getItem('nombreAlumno');

  if (!cedulaAlumno || cedulaAlumno === 'null') {
    alert('Debes ingresar con tu cédula para ver tus artículos mágicos.');
    return;
  }

  // Mapear el nombre del archivo a la categoría correcta en mayúsculas
  const categoriaMap = {
    "deporte.html": "DEPORTE",
    "hogar.html": "HOGAR",
    "tec.html": "TECNOLOGIA",
    "comida.html": "COMIDA"
  };

  // Obtener el nombre del archivo actual
  const pathArray = window.location.pathname.split('/');
  const currentPage = pathArray[pathArray.length - 1].toLowerCase();

  const categoria = categoriaMap[currentPage]; // Categoría a consultar

  if (!categoria) {
    alert('No se pudo determinar la categoría. Verifica la URL.');
    return;
  }

  const listaArticulos = document.getElementById('listaArticulos');
  listaArticulos.innerHTML = '🔮 Obteniendo tus artículos mágicos...';

  try {
    const URLc = 'https://unefa6tosistemas2025api.onrender.com/api/articulos';
    const respuesta = await fetch(URLc, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "ALUMNO": cedulaAlumno,
        "ARTCATEGO": categoria
      })
    });
    const resultado = await respuesta.json();

    if (resultado.Resul) {
      const ListaProductos = resultado.data;

      if (ListaProductos.length === 0) {
        listaArticulos.innerHTML = '🛍 No tienes artículos mágicos en esta categoría.';
      } else {
        let articulosHTML = '<h3 class="text-2xl font-bold mb-4">✨ Tus Artículos Mágicos:</h3><ul class="list-disc list-inside">';
        ListaProductos.forEach(producto => {
          articulosHTML += `<li class="mb-2">
            <strong>${producto.ARTDESCRI}</strong> (Código: ${producto.ARTNUMERO}) - Precio: $${producto.ARTPRECIO}
          </li>`;
        });
        articulosHTML += '</ul>';
        listaArticulos.innerHTML = articulosHTML;
      }
    } else {
      listaArticulos.innerHTML = `🚫 ${resultado.error}`;
    }
  } catch (error) {
    console.error('Error al consultar la API:', error);
    listaArticulos.innerHTML = '🛑 Hubo un error al obtener tus artículos. ¡Intenta nuevamente!';
  }
}

// Asignar eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  // Si existe el botón 'btnVerArticulos', asigna el evento
  if (document.getElementById('btnVerArticulos')) {
    document.getElementById('btnVerArticulos').addEventListener('click', obtenerArticulos);
  }

  // Mantener la inicialización de la página inicial si existe el botón 'btnInvitado'
  if (document.getElementById('btnInvitado')) {
    inicial();
  }
});

  
  
  // Función para mostrar el mensaje final personalizado
function mostrarMensajeFinal() {
    const nombreAlumno = localStorage.getItem('nombreAlumno') || 'Desconocido';
    const puntajeTotal = parseInt(localStorage.getItem('puntajeTotal')) || 0;
    let mensajeFinal = '';
  
    // Diccionario de apodos
    const apodos = {
      "Victor": "Señor slenderman",
      "Héctor": "Hipertrofiar esas nalgas",
      "Jesús": "pinche furro asqueroso",
      "Maria": "Maria terecita :3",
      "Barbara": "Barbariña Alelimon",
      "Eduardo": "Miniom mamado",
      "Emmanuel": "Don barriga",
      "Jonathan": "Chin chon wan",
      "Diego": "Negrito ojos claros, sosuna",
      "Luis": "Banana Joe"
    };
  
    // Reemplazar nombre con apodo si existe en el diccionario
    const nombreMostrar = apodos[nombreAlumno] || nombreAlumno;
  
    if (puntajeTotal === 16) {
      mensajeFinal = '🎪 ¡Felicidades, nota perfecta!';
      // Mostrar imagen y texto adicional para nota perfecta
      document.getElementById('perfect-score').style.display = 'block';
      document.getElementById('perfect-score-text').innerText = 'INCREÍBLE BUBBLE, al parecer alguien obtuvo una calificación peeerfecta, probablemente se trata de alguien con gran futuro o talento ¡Cuanta emoción!';
    } else if (puntajeTotal >= 11 && puntajeTotal <= 15) {
      mensajeFinal = '🤹 ¡Puedes mejorar, artista!';
    } else if (puntajeTotal >= 5 && puntajeTotal <= 10) {
      mensajeFinal = '🎭 ¡Sigue practicando tu acto!';
    } else if (puntajeTotal >= 0 && puntajeTotal <= 4) {
      mensajeFinal = '🦁 ¡Eres aprendiz y se nota!';
    }
  
    const mensajeElemento = document.getElementById('mensajeFinal');
    if (mensajeElemento) {
      mensajeElemento.innerHTML = `${mensajeFinal} <strong>${nombreMostrar}</strong>`;
    }
  }
  
  // Mostrar el mensaje final
  mostrarMensajeFinal();
