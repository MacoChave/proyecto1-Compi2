# Comandos
    Para generar los archivos .js ejecutar: tsc
    
    Para generar el archivo .js de la gramatica, ejecutar: jison .\Gramatica\gramatica.jison
    (Al ejecutar el comando se genera el archivo gramatica.js, mover el archivo a la carpeta .dist)
    
    El archivo index contiene el texto de entrada para el analizador, para ejecutar el analisis ejecutar: node .\dist\index.js