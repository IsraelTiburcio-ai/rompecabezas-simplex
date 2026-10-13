# ROMPECABEZAS ALGEBRAICO

**Arma la equivalencia correcta** · Microjuego de Optimización I, Gimnasio 3 — Método Simplex.

## Objetivo

Reforzar la sección **3.2 Equivalencias** mediante la reconstrucción activa de expresiones del método Simplex. El alumno practica cómo se transforma una forma en otra: cambio de signo en la función objetivo, equivalencias de desigualdades e igualdades, variables de holgura y exceso, y representación de variables libres o no positivas.

## Fuente académica

Fuente principal: *Gimnasio 3. Método Simplex*, cuadernillo de Optimización I, sección **3.2 Equivalencias**, páginas **6–8** (PDF proporcionado para el proyecto).

- **Página 6:** equivalencias 1–4a: max/min, negación de desigualdades, igualdad como intersección y variable de holgura.
- **Página 7:** variable de exceso y variable no restringida como diferencia de dos variables no negativas.
- **Página 8:** ejemplo de conversión a forma canónica, variables con restricción de signo y sustitución de una variable no positiva.

Se conserva la convención del cuadernillo: para una restricción `≤` se suma holgura; para `≥` se resta exceso; una variable no restringida se escribe como diferencia de dos variables no negativas. Las transformaciones de signo se validaron algebraicamente, incluyendo el cambio del sentido de la desigualdad al multiplicar por `−1`.

## Mecánica

1. Elige una partida de **6, 7 u 8 rondas** (7 por defecto).
2. Lee la consigna y reconstruye la expresión tocando fichas y ranuras. También puedes arrastrar fichas como alternativa.
3. Comprueba el armado; las piezas incorrectas se señalan para que puedas corregirlas. Las pistas son opcionales y la partida no limita los intentos.
4. Recibe puntos, bonus por rapidez y un resumen al terminar.

El banco contiene **22 retos**. Cada partida mezcla retos al azar con representación de los seis grupos de equivalencias y evita repetir los de la partida inmediatamente anterior cuando hay suficientes retos disponibles. Duración esperada: **60–120 segundos**, según el ritmo de lectura y los intentos.

## Diseño y accesibilidad

- Mobile-first; bandeja y ranuras optimizadas para toque, con reflujo de expresiones matemáticas y adaptación a iPad retrato/paisaje.
- Interacción principal por toque/clic; arrastrar y soltar es opcional.
- Controles semánticos, etiquetas accesibles, anuncios de estado, foco visible, soporte de teclado (Tab, Enter/Espacio, Escape y `M` para sonido) y `prefers-reduced-motion`.
- Sonidos breves sintetizados en el navegador, con control de silencio persistente.

## Stack

HTML, CSS y JavaScript vanilla. No requiere dependencias ni proceso de compilación.

## Cómo correrlo

Desde la carpeta del proyecto, inicia un servidor local estático:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También se puede abrir `index.html` directamente, aunque un servidor local representa mejor el despliegue web.

## GitHub Pages

Deploy automático desde `main` con GitHub Actions (`.github/workflows/pages.yml`).

**URL de producción:** <https://israeltiburcio-ai.github.io/rompecabezas-simplex/>
