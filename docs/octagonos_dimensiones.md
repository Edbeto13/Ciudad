# Dimensiones Detalladas de Octágonos

## Introducción
Este documento describe las dimensiones detalladas de los octágonos utilizados en el simulador de ciudad, basados en el archivo `Octagonal_100m2.dxf`. Se calcula para un octágono regular con un área de 100 m².

## Cálculos Matemáticos
Un octágono regular tiene 8 lados iguales y 8 ángulos iguales.

### Área del Octágono Regular
La fórmula para el área \( A \) de un octágono regular es:
\[
A = 2 \times (1 + \sqrt{2}) \times s^2
\]
Donde \( s \) es la longitud de cada lado.

Para \( A = 100 \) m²:
\[
s^2 = \frac{100}{2 \times (1 + \sqrt{2})} = \frac{100}{2 \times 2.414213562} \approx \frac{100}{4.828427124} \approx 20.71067812
\]
\[
s \approx 4.551 m
\]

### Radio Circunscrito (R)
El radio del círculo circunscrito es:
\[
R = \frac{s}{\sqrt{2} - 1} \approx \frac{4.551}{0.414213562} \approx 10.991 m
\]

### Radio Inscrito (r)
El radio del círculo inscrito es:
\[
r = \frac{s}{1 + \sqrt{2}} \approx \frac{4.551}{2.414213562} \approx 1.884 m
\]

### Ángulos
- Ángulo interno: \( \frac{6\pi}{8} = 135^\circ \)
- Ángulo externo: \( \frac{2\pi}{8} = 45^\circ \)

## Diagrama
A continuación, un diagrama ASCII aproximado de un octágono regular:

```
       /\
      /  \
     /    \
    /      \
   /        \
  /          \
 /            \
/______________\
|              |
 \            /
  \          /
   \        /
    \      /
     \    /
      \  /
       \/
```

Este diagrama representa un octágono visto desde arriba, con los vértices conectados.

## Aplicación en el Simulador
En el simulador, este octágono se utiliza para representar áreas específicas en la ciudad, escaladas según la escala del modelo (1:300).

## Resumen de Medidas de Paredes, Techo y Piso
Asumiendo un edificio octagonal con altura de paredes de 3 m (altura estándar para un edificio bajo), aquí va un resumen de las medidas:

### Paredes
El octágono tiene 8 paredes idénticas, cada una con:
- Longitud: 4.551 m
- Altura: 3 m
- Área por pared: 4.551 m × 3 m = 13.653 m²
- Área total de paredes: 8 × 13.653 m² = 109.224 m²

### Techo
- Forma: Octágono regular plano
- Área: 100 m²
- Perímetro: 8 × 4.551 m = 36.408 m

### Piso
- Forma: Octágono regular
- Área: 100 m²
- Perímetro: 36.408 m

## Notas
- Todas las dimensiones están en metros.
- Los cálculos asumen un octágono regular perfecto.
- Para usos precisos, referirse al archivo DXF original.