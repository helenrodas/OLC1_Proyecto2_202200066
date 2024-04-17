import { useEffect, useState, useRef } from "react"
import './App.css';
import Editor from '@monaco-editor/react';

function App() {
  const editorRef = useRef(null);
  const consolaRef = useRef(null);

  const [archivos, setArchivos] = useState([]); // Estado para mantener los archivos
  const [archivoActual, setArchivoActual] = useState(null);


  function handleEditorDidMount(editor, id) {
    if (id === "editor") {
      editorRef.current = editor;
    } else if (id === "consola") {
      consolaRef.current = editor;
    }
  }

  function interpretar() {
    var entrada = editorRef.current.getValue();
    fetch('http://localhost:4000/interpretar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entrada: entrada }),
    })
      .then(response => response.json())
      .then(data => {
        consolaRef.current.setValue(data.Respuesta);
      })
      .catch((error) => {
        alert("Ya no sale comp1")
        console.error('Error:', error);
      });
  }


  const handleOpenFile = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const contents = event.target.result;
      editorRef.current.setValue(contents);
    };

    if (file.name.endsWith('.sc')) {
      reader.readAsText(file);
    } else {
      alert('Por favor, seleccione un archivo con extensión .sc');
    }
  };

  var contadorArchivos = 0
  const guardarArchivo = () => {
    contadorArchivos = contadorArchivos + 1
    const contenido = editorRef.current.getValue();
    const nombreArchivo = `prueba_${contadorArchivos}.sc`;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };


  function crearArchivoEnBlanco() {
    contadorArchivos = contadorArchivos + 1
    const nombreArchivo = `prueba_${contadorArchivos}.sc`;
    const nuevoArchivo = { nombre: nombreArchivo, contenido: "" };
    setArchivos([...archivos, nuevoArchivo]);
    setArchivoActual(nuevoArchivo);
    editorRef.current.setValue("");
}


function abrirArchivo(nombre) {
  const archivo = archivos.find(a => a.nombre === nombre);
  if (archivo) {
      setArchivoActual(archivo);
      editorRef.current.setValue(archivo.contenido);
  }
}

  return (
    <div className="App">
      <div class="menuBarra">
        <h2><b>CompiScript+</b></h2>
        <ul class="nav nav-underline justify-content-center">
            <li class="nav-item">
                <a class="nav-link " aria-current="page" href="#">Crear Archivos</a>
            </li>
            <li class="nav-item">
            <label className="nav-link" htmlFor="fileInput">Abrir Archivos</label>
            <input id="fileInput" type="file" accept=".sc" style={{ display: 'none' }} onChange={handleOpenFile} />
            </li>
            <li class="nav-item">
              <a className="nav-link" href="#" onClick={guardarArchivo}>Guardar Archivos</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="#" onClick={interpretar}>Ejecutar</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Reportes</a>
            </li>
        </ul>
    </div>
      <br></br>
      <div class='text-center style={{ height: "80%", width: "60%" }} '>
        <div class="container" >
          <div class="row">
            <div class="col">
              <p>Entrada</p>
              <Editor height="68vh" defaultLanguage="java" defaultValue="" theme="vs-dark" onMount={(editor) => handleEditorDidMount(editor, "editor")} />
            </div>
            <div class="col">
              <p>Consola</p>
              <Editor height="68vh" defaultLanguage="cpp" defaultValue="" theme="vs-dark" options={{ readOnly: true }} onMount={(editor) => handleEditorDidMount(editor, "consola")} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: '#cde1f2', height: '28px', borderTop: '1px solid #015092', position: 'fixed', bottom: '0', left: '0', right: '0' }}>
      <li><a href="#" onClick={crearArchivoEnBlanco}>Crear archivo en blanco</a></li>
      
                    {archivos.map(archivo => (
                        <li key={archivo.nombre}><a href="#" onClick={() => abrirArchivo(archivo.nombre)}>{archivo.nombre}</a></li>
                    ))}
      </div>
    </div>
  );
}

export default App;