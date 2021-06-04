# Lenguage XPATH
- [Lenguage XPATH](#lenguage-xpath)
  - [Seleccionando nodos](#seleccionando-nodos)
  - [Predicados](#predicados)
  - [Seleccionando nodos desconocidos](#seleccionando-nodos-desconocidos)
  - [Expresiones de localización de ruta](#expresiones-de-localización-de-ruta)
  - [Seleccionando varias rutas](#seleccionando-varias-rutas)
  - [Operadores](#operadores)

## Seleccionando nodos

Seleccionando nodos

    node_name -> Todos los nodos con nombre node_name
    /         -> Seleccionar desde el nodo raiz
    //        -> Seleccionar los nodos sin importar el camino hacia él
    .         -> Seleccionar el nodo actual
    ..        -> Seleccionar el nodo padre
    @         -> Seleccionar atributos

## Predicados

Seleccionar nodos especificando un contenido con un valor específico

    [number]            -> Seleccionando el item que indica el numero
    [last()]            -> Seleccionar el último ítem
    [position() COND]   -> Seleccionar los ítems que sea válido por la condicicón
    [@attr]             -> Seleccionar todos los elementos con el atributo especificado
    [@attr = 'val']     -> Seleccionar todos los elementos con el atributo especificado y que tengan el valor dado
    [elemento COND]     -> Seleccionar todos los elementos que cumplan con la condición dada

## Seleccionando nodos desconocidos

    *       -> Coincidencia con cualquier nodo
    @*      -> Coincidencia con cualquier atributo
    node()  -> Coincidencia con cualquier nodo de cualquier tipo
    text()  -> Seleccionar todo el texto del nodo actual

## Expresiones de localización de ruta

    child::node_name        -> Selecionar todos los nodos hijos de node_name
    attribute::attr         -> Seleccionar todos los atrubutos attr del nodo actual
    descendant::node_name   -> Seleccionar todos los descencientes del nodo node_name
    ancestor::node_name     -> Seleccionar todos los ancestros del nodo node_name
    ancestor-or-self::node_name     -> Seleccionar todos los ancestros del nodo node_name y el nodo actual

## Seleccionando varias rutas

Usando el operador `|` se puede seleccionar varias rutas

## Operadores

| Operador |          Descripción           |
| :------: | :----------------------------: |
|    \|    | Computar dos arreglos de nodos |
|    +     |              Suma              |
|    -     |             Resta              |
|    *     |         Multiplicación         |
|   div    |            División            |
|    =     |             Igual              |
|    !=    |            No igual            |
|    <     |           Menor que            |
|    <=    |       Menor o igual que        |
|    >     |           Mayor que            |
|    >=    |       Mayor o igual que        |
|    or    |               Or               |
|   and    |              And               |
|   mod    |             Modulo             |