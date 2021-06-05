# XML

## Elementos

- strText  -> `[^>^<]`
- strAttr  -> `"[A-Za-z -_]+"|'[A-Za-z -_]+'`
- id  -> `[A-Za-z-_]+`

## Lenguaje

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
<child attr="value">
    <subchild>text to element</subchild>
    <subchild/>
</child>
</root>
```

### Comentario

```xml
<!-- THIS IS A COMMENT -->
```

### Entidades predefinidas

|        |       |                |                  |
| :----: | :---: | :------------: | :--------------: |
|  &it;  |   <   |   Less than    | Caracter = error |
|  &gt;  |   >   |  Grater than   | Caracter = error |
| &amp;  |   &   |   Ampersand    |                  |
| &apos; |   '   |   Apostrophe   |                  |
| &quot; |   "   | Quotation mark |                  |