/* Banco basado en Gimnasio 3, sección 3.2 «Equivalencias», pp. 6–8. */
window.SIMPLEX_CHALLENGES = [
  {
    id: "e1-01", topic: "e1", label: "Equivalencia 1 · objetivo",
    instruction: "Arma la función objetivo equivalente.",
    prompt: "max z = cx es equivalente a…",
    parts: ["min z =", { slot: true }],
    answer: ["−cx"], distractors: ["cx", "+cx", "−z"],
    hint: "Al cambiar max por min, la función objetivo cambia de signo.",
    feedback: "Correcto: al pasar de max a min, z cambia de signo.",
    rule: "max z = cx ⇔ min z = −cx", page: 6
  },
  {
    id: "e1-02", topic: "e1", label: "Equivalencia 1 · varios términos",
    instruction: "Cambia de maximización a minimización.",
    prompt: "Transforma la función completa, incluido el término constante.",
    parts: ["max z = 2x₁ + 3x₂ − 5x₃ + 5  ⇔  min z =", { slot: true }, { slot: true }, { slot: true }, { slot: true }],
    answer: ["−2x₁", "−3x₂", "+5x₃", "−5"],
    distractors: ["+2x₁", "+3x₂", "−5x₃", "+5"],
    hint: "Multiplica toda la función objetivo por −1: no olvides el término constante.",
    feedback: "Correcto: cambiaste el signo de cada término de la función.",
    rule: "max z = f(x) ⇔ min z = −f(x)", page: 6
  },
  {
    id: "e1-03", topic: "e1", label: "Equivalencia 1 · sentido inverso",
    instruction: "Construye la maximización equivalente.",
    prompt: "min z = 6x₁ − 8x₂ + 9x₃ se transforma en…",
    parts: ["max z =", { slot: true }, { slot: true }, { slot: true }],
    answer: ["−6x₁", "+8x₂", "−9x₃"],
    distractors: ["+6x₁", "−8x₂", "+9x₃"],
    hint: "Invierte todos los signos al intercambiar min y max.",
    feedback: "Bien: la función objetivo quedó multiplicada por −1.",
    rule: "min z = f(x) ⇔ max z = −f(x)", page: 6
  },
  {
    id: "e1-04", topic: "e1", label: "Equivalencia 1 · ejemplo del cuadernillo",
    instruction: "Reconstruye la función equivalente.",
    prompt: "min z = 3x₁ − 4x₂ + x₃ se escribe como maximización…",
    parts: ["max z =", { slot: true }, { slot: true }, { slot: true }],
    answer: ["−3x₁", "+4x₂", "−x₃"],
    distractors: ["+3x₁", "−4x₂", "+x₃"],
    hint: "Cada coeficiente —también el de x₂, que ya es negativo— cambia de signo.",
    feedback: "Correcto: cambiaste el signo de todos los términos.",
    rule: "min z = 3x₁ − 4x₂ + x₃ ⇔ max z = −3x₁ + 4x₂ − x₃", page: 8
  },
  {
    id: "e2-01", topic: "e2", label: "Equivalencia 2 · forma general",
    instruction: "Completa la equivalencia al multiplicar por −1.",
    prompt: "Ax ≤ b es equivalente a…",
    parts: [{ slot: true }, { slot: true }, { slot: true }],
    answer: ["−Ax", "≥", "−b"],
    distractors: ["Ax", "≤", "b"],
    hint: "Al multiplicar una desigualdad por un número negativo, invierte el sentido.",
    feedback: "Correcto: negaste ambos lados y cambiaste ≤ por ≥.",
    rule: "Ax ≤ b ⇔ −Ax ≥ −b", page: 6
  },
  {
    id: "e2-02", topic: "e2", label: "Equivalencia 2 · ejemplo del cuadernillo",
    instruction: "Arma la desigualdad equivalente.",
    prompt: "3x₁ + 4x₂ − 3x₃ ≤ 1000 se transforma en…",
    parts: [{ slot: true }, { slot: true }, { slot: true }],
    answer: ["−3x₁ − 4x₂ + 3x₃", "≥", "−1000"],
    distractors: ["3x₁ + 4x₂ − 3x₃", "≤", "+1000"],
    hint: "Cambia el signo de cada coeficiente y del lado derecho; invierte la desigualdad.",
    feedback: "Bien: la región factible no cambia al negar ambos lados.",
    rule: "3x₁ + 4x₂ − 3x₃ ≤ 1000 ⇔ −3x₁ − 4x₂ + 3x₃ ≥ −1000", page: 6
  },
  {
    id: "e2-03", topic: "e2", label: "Equivalencia 2 · desigualdad ≥",
    instruction: "Niega ambos lados y cambia el sentido.",
    prompt: "12x₁ − 4x₂ ≥ −200 se transforma en…",
    parts: [{ slot: true }, { slot: true }, { slot: true }],
    answer: ["−12x₁ + 4x₂", "≤", "200"],
    distractors: ["12x₁ − 4x₂", "≥", "−200"],
    hint: "El opuesto de −200 es +200.",
    feedback: "Correcto: la desigualdad equivalente conserva las mismas soluciones.",
    rule: "12x₁ − 4x₂ ≥ −200 ⇔ −12x₁ + 4x₂ ≤ 200", page: 6
  },
  {
    id: "e2-04", topic: "e2", label: "Equivalencia 2 · signos mixtos",
    instruction: "Completa la forma con el lado izquierdo negado.",
    prompt: "5x₁ + 2x₂ ≥ 3 es equivalente a…",
    parts: ["", { slot: true }, { slot: true }, { slot: true }],
    answer: ["−5x₁ − 2x₂", "≤", "−3"],
    distractors: ["5x₁ + 2x₂", "≥", "+3"],
    hint: "Multiplicar por −1 invierte el símbolo y también el signo de 3.",
    feedback: "Muy bien: invertiste signos y sentido de la desigualdad.",
    rule: "Ax ≥ b ⇔ −Ax ≤ −b", page: 6
  },
  {
    id: "e3-01", topic: "e3", label: "Equivalencia 3 · intersección",
    instruction: "Completa las dos desigualdades que forman la igualdad.",
    prompt: "3x₁ + 2x₂ = 5 equivale a la intersección de…",
    parts: ["3x₁ + 2x₂", { slot: true }, "5  y  3x₁ + 2x₂", { slot: true }, "5"],
    answer: ["≥", "≤"], distractors: ["=", "<", ">"],
    hint: "Para fijar exactamente el valor 5, el lado izquierdo debe ser al menos 5 y a lo más 5.",
    feedback: "Correcto: juntas, ambas desigualdades fuerzan la igualdad.",
    rule: "Ax = b ⇔ (Ax ≤ b) ∩ (Ax ≥ b)", page: 6
  },
  {
    id: "e3-02", topic: "e3", label: "Equivalencia 3 · forma general",
    instruction: "Arma la intersección equivalente a Ax = b.",
    prompt: "Una igualdad Ax = b se descompone como…",
    parts: ["Ax", { slot: true }, "b  y  Ax", { slot: true }, "b"],
    answer: ["≤", "≥"], distractors: ["=", "<", ">"],
    hint: "La igualdad se cumple cuando Ax no es menor ni mayor que b.",
    feedback: "Bien: reconociste la igualdad como intersección de dos semiespacios.",
    rule: "Ax = b ⇔ Ax ≤ b y Ax ≥ b", page: 6
  },
  {
    id: "e3-03", topic: "e3", label: "Equivalencia 3 · regreso a igualdad",
    instruction: "Reconstruye la igualdad que satisfacen ambas restricciones.",
    prompt: "4x₁ − x₂ ≤ 8 y 4x₁ − x₂ ≥ 8 implican…",
    parts: [{ slot: true }],
    answer: ["4x₁ − x₂ = 8"], distractors: ["4x₁ − x₂ ≤ 8", "4x₁ − x₂ ≥ 8", "4x₁ − x₂ ≠ 8"],
    hint: "La expresión está simultáneamente acotada por arriba y por abajo por 8.",
    feedback: "Correcto: las dos desigualdades opuestas fijan el mismo valor.",
    rule: "Ax ≤ b y Ax ≥ b ⇔ Ax = b", page: 6
  },
  {
    id: "e4h-01", topic: "holgura", label: "Equivalencia 4a · holgura",
    instruction: "Convierte la desigualdad en igualdad.",
    prompt: "12x₁ + 4x₂ ≤ 12. Agrega una variable de holgura nueva.",
    parts: ["12x₁ + 4x₂", { slot: true }, "= 12"],
    answer: ["+ x₃"], distractors: ["− x₃", "+ x₁", "+ x₄"],
    hint: "Una restricción ≤ se completa sumando lo que falta para llegar al límite.",
    feedback: "Correcto: agregaste x₃ como variable de holgura, con x₃ ≥ 0.",
    rule: "Ax ≤ b ⇔ Ax + y = b, con y ≥ 0", page: 6
  },
  {
    id: "e4h-02", topic: "holgura", label: "Equivalencia 4a · índice disponible",
    instruction: "Elige la variable nueva sin repetir una ya usada.",
    prompt: "En 14x₁ + 3x₂ ≤ 10 ya aparece x₃ en el modelo.",
    parts: ["14x₁ + 3x₂", { slot: true }, "= 10"],
    answer: ["+ x₄"], distractors: ["− x₄", "+ x₃", "+ x₂"],
    hint: "La holgura se suma y debe tener un nombre distinto al de las variables existentes.",
    feedback: "Bien: añadiste una variable de holgura nueva y no repetiste x₃.",
    rule: "Para ≤ se suma una holgura no negativa.", page: 6
  },
  {
    id: "e4h-03", topic: "holgura", label: "Equivalencia 4a · interpretación",
    instruction: "Calcula la holgura que queda disponible.",
    prompt: "La capacidad es 12 unidades y el consumo real es de 8 unidades.",
    parts: ["x₃ =", { slot: true }, "unidades"],
    answer: ["4"], distractors: ["8", "12", "20"],
    hint: "Holgura = capacidad disponible − cantidad usada.",
    feedback: "Correcto: quedan 4 unidades sin usar.",
    rule: "La holgura mide lo que falta para alcanzar la capacidad máxima.", page: 6
  },
  {
    id: "e4e-01", topic: "exceso", label: "Equivalencia 4b · exceso",
    instruction: "Convierte la restricción en igualdad.",
    prompt: "16x₁ + 8x₂ ≥ 5. Agrega una variable de exceso nueva.",
    parts: ["16x₁ + 8x₂", { slot: true }, "= 5"],
    answer: ["− x₃"], distractors: ["+ x₃", "− x₁", "+ x₄"],
    hint: "En una restricción ≥, se resta lo que excede el mínimo requerido.",
    feedback: "Correcto: restaste la variable de exceso x₃ ≥ 0.",
    rule: "Ax ≥ b ⇔ Ax − w = b, con w ≥ 0", page: 7
  },
  {
    id: "e4e-02", topic: "exceso", label: "Equivalencia 4b · índice disponible",
    instruction: "Usa una variable de exceso nueva y con el signo correcto.",
    prompt: "7x₁ + 3x₂ ≥ 10; en el modelo ya aparece x₃.",
    parts: ["7x₁ + 3x₂", { slot: true }, "= 10"],
    answer: ["− x₄"], distractors: ["+ x₄", "− x₃", "+ x₃"],
    hint: "Para ≥ se resta el exceso; además, no reutilices x₃.",
    feedback: "Bien: restaste una variable de exceso nueva, x₄ ≥ 0.",
    rule: "Ax ≥ b ⇔ Ax − w = b, con w ≥ 0", page: 7
  },
  {
    id: "e4e-03", topic: "exceso", label: "Equivalencia 4b · interpretación",
    instruction: "Determina el exceso sobre el mínimo requerido.",
    prompt: "Se requieren al menos 10 unidades y se utilizan 12.",
    parts: ["La variable de exceso vale", { slot: true }, "unidades"],
    answer: ["2"], distractors: ["10", "12", "22"],
    hint: "Exceso = cantidad utilizada − mínimo requerido.",
    feedback: "Correcto: se sobrepasan en 2 unidades las requeridas.",
    rule: "La variable de exceso mide cuánto se rebasa el mínimo.", page: 7
  },
  {
    id: "e5-01", topic: "libre", label: "Equivalencia 5 · variable no restringida",
    instruction: "Representa la variable como diferencia de dos no negativas.",
    prompt: "x₁ puede tomar cualquier valor real.",
    parts: ["x₁ =", { slot: true }, ";", { slot: true }],
    answer: ["x₃ − x₄", "x₃, x₄ ≥ 0"],
    alternatives: [["x₄ − x₃", "x₃, x₄ ≥ 0"]],
    distractors: ["x₄ − x₃", "x₃ + x₄", "x₃ − x₄ ≤ 0", "x₃, x₄ ≤ 0"],
    hint: "La diferencia puede ser positiva, negativa o cero aunque ambas variables sean no negativas.",
    feedback: "Correcto: expresaste la variable libre como diferencia de dos no negativas.",
    rule: "Variable no restringida: x₁ = x₃ − x₄, con x₃, x₄ ≥ 0", page: 7
  },
  {
    id: "e5-02", topic: "libre", label: "Equivalencia 5 · sustitución",
    instruction: "Sustituye x₁ por x₃ − x₄ en la restricción.",
    prompt: "En 5x₁ + 5x₂ ≤ 5, x₁ no está restringida.",
    parts: ["5(", { slot: true }, ") + 5x₂ ≤ 5"],
    answer: ["x₃ − x₄"], distractors: ["x₃ + x₄", "x₄ − x₃", "−x₃ − x₄"],
    hint: "Usa la descomposición de la variable libre dentro del paréntesis.",
    feedback: "Bien: sustituiste x₁ por la diferencia de dos variables no negativas.",
    rule: "Si x₁ es libre, reemplázala por x₃ − x₄.", page: 7
  },
  {
    id: "e5-03", topic: "libre", label: "Equivalencia 5 · variable no positiva",
    instruction: "Escribe x₂ ≤ 0 usando una variable no negativa.",
    prompt: "Representa x₂, que solo puede tomar valores no positivos.",
    parts: ["x₂ =", { slot: true }, ";  x₄ ≥ 0"],
    answer: ["−x₄"], distractors: ["+x₄", "x₄", "−x₂"],
    hint: "Si x₄ ≥ 0, ¿qué signo debe tener −x₄?",
    feedback: "Correcto: x₂ = −x₄ garantiza que x₂ ≤ 0.",
    rule: "Para x₂ ≤ 0, define x₄ = −x₂ ≥ 0; entonces x₂ = −x₄.", page: 8
  },
  {
    id: "e5-04", topic: "libre", label: "Equivalencia 5 · signo de la diferencia",
    instruction: "Elige la condición que hace negativa a x₁.",
    prompt: "Si x₁ = x₃ − x₄, entonces x₁ < 0 cuando…",
    parts: ["x₃", { slot: true }, "x₄"],
    answer: ["<"], distractors: [">", "=", "≤"],
    hint: "Una diferencia es negativa cuando el segundo término supera al primero.",
    feedback: "Bien: x₃ < x₄ hace que x₃ − x₄ sea negativo.",
    rule: "x₃ > x₄ ⇒ x₁ > 0; x₃ < x₄ ⇒ x₁ < 0; x₃ = x₄ ⇒ x₁ = 0.", page: 7
  },
  {
    id: "e5-05", topic: "libre", label: "Equivalencia 5 · valor de la diferencia",
    instruction: "Calcula el valor de la variable original.",
    prompt: "x₁ = x₃ − x₄, con x₃ = 5 y x₄ = 2.",
    parts: ["x₁ =", { slot: true }],
    answer: ["3"], distractors: ["7", "−3", "2"],
    hint: "Sustituye los valores en x₃ − x₄ y conserva el orden.",
    feedback: "Correcto: x₁ = 5 − 2 = 3.",
    rule: "Una variable libre puede ser positiva, negativa o cero según la diferencia.", page: 7
  }
];

window.SIMPLEX_TOPICS = {
  e1: "Equivalencia 1 · objetivo",
  e2: "Equivalencia 2 · desigualdades",
  e3: "Equivalencia 3 · igualdades",
  holgura: "Equivalencia 4a · holgura",
  exceso: "Equivalencia 4b · exceso",
  libre: "Equivalencia 5 · variables libres"
};
