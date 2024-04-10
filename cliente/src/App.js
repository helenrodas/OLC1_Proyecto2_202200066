import { useEffect, useState, useRef } from "react"
import './App.css';
import Editor from '@monaco-editor/react';

function App() {
  const editorRef = useRef(null);
  const consolaRef = useRef(null);

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

  const CargarArchivo = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      var contents = event.target.result;
      editorRef.current.setValue(contents);
    };
    reader.readAsText(file);
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
                <a class="nav-link" href="#">Abrir Archivos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Guardar Archivos</a>
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

    </div>
  );
}

export default App;