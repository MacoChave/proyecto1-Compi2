# Comandos
    Para generar los archivos .js ejecutar: tsc
    
    Para generar el archivo .js de la gramatica, ejecutar: jison .\Gramatica\gramatica.jison
    (Al ejecutar el comando se genera el archivo gramatica.js, mover/remplazar el archivo en la carpeta: .dist/Gramatica)

    Para usar Browserify:
    Instalar globalmente: npm install -g browserify
    Una vez ya hayamos generado los archivos .js con tsc, colocarnos en la carpeta dist y ejecutar:
    browserify main.js --standalone load > bundle.js
    (bundle.js va a cargar todos los export, podemos acceder en html --> load.'nombre export')

    Actualmente se está llamando en index.html al metodo hola() de la clase main