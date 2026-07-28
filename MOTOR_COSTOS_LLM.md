# Motor de costos LLM del calculador — cómo funciona y qué NUNCA volver a romper

**Archivo:** `public/calculator_v2.html` · **Última revisión:** 2026-07-28
**Entrada canónica del calculador:** `HANDOFF_CALCULADOR_2026-07-09.md`

> El costo del LLM es **uno de los costos más importantes** de Ximia. Este documento existe
> para que el error que encontramos el 2026-07-28 no vuelva a pasar.

---

## ⛔ El error que teníamos (2026-07-28)

El costo de IA se cobraba con una **tarifa plana por conversación**, idéntica para los 3 motores:

```js
const llmRaw = conversations * TARIFA_CONV;   // TARIFA_CONV = 0.022, hardcodeado
```

Es decir: elegías **Gemini 3 Flash** ($0.50/$3 por Mtok) o **Opus 5** ($5/$25 por Mtok) y
**el costo de IA no se movía un centavo**. Los precios `in`/`out` por modelo estaban en el
código pero **no se usaban en ningún cálculo** — pura decoración.

Para una calculadora cuyo punto central es *"elegí tu arquitectura y mirá el costo"*, esto
era un error grave: el motor no impactaba el costo que mostrábamos.

---

## ✅ El modelo correcto (vigente)

`llmRaw = costo_triage + costo_plan`, calculado por **tokens reales × precio real del motor**.

### 1. Precios oficiales verificados (2026-07-28)

| Plan | Motor | Input /Mtok | Output /Mtok | Constante |
|---|---|---|---|---|
| Estándar | **Gemini 3 Flash (Preview)** | $0.50 | $3.00 | `AI_TIERS.economic` |
| Pro | **Claude Sonnet 5** | $3.00 | $15.00 (estándar; intro $2/$10 hasta 31-ago-26) | `AI_TIERS.balanced` |
| Premium | **Claude Opus 5** | $5.00 | $25.00 (igual que Opus 4.8) | `AI_TIERS.premium` |
| *Triage* | **Gemini 3.5 Flash-Lite** | $0.30 | $2.50 | `TRIAGE` (constante en `calc()`) |

Datos de referencia útiles (Google, jul-2026): Gemini 3.6 Flash $1.50/$7.50 · Gemini 3.5 Flash
$1.50/**$9** (más caro que 3.6, **NO usar**) · 3.5 Flash-Lite $0.30/$2.50 · 3 Flash Preview $0.50/$3.
Fuente: <https://ai.google.dev/gemini-api/docs/pricing> y <https://platform.claude.com/docs/en/about-claude/pricing>.

**Regla:** el Estándar corre Gemini 3 Flash barato. **NO migrar a 3.6 Flash** — triplica el
costo real de API y el Flash barato funciona perfecto para ese tier.

### 2. Triage de rebotes (palanca #1, la que hace sostenible Pro/Premium)

De las ~26k conversaciones, ~23k **rebotan** sin dejar datos. **No corren el motor caro del
plan ni cargan la KB de 11k tokens** — las procesa un modelo triage barato (Flash-Lite) con un
prompt lean de ruteo (`TRIAGE_INPUT = 1500` tok). Sólo escalan al motor del plan las
conversaciones que **progresan** en el embudo.

Sin esto, Opus 5 sobre 26k conversaciones daba **$7.180/mes** (impagable). Con triage: $4.535.

### 3. Cache del system+KB — honesto, NO garantizado

El system prompt + KB + perfil pesa `fixedInput = 11.180` tokens. Cacheo:

- **Dentro de una charla** (turnos a segundos): del turno 2 en adelante **siempre** lee cacheado
  (`CACHE_READ = 0.10×`). Esto **sí** está garantizado.
- **Entre conversaciones**: NO garantizado. El cache de Anthropic dura **5 min (1 h extendido)**.
  El **primer turno** de cada conversación sólo pega el cache si otra la calentó dentro del TTL.
  - hit → read `0.10×`
  - miss → **escritura `CACHE_WRITE = 1.25×`** (¡peor que no cachear, `1.0×`!)
  - Con tráfico goteando, el hit-rate cae. Se modela con `cacheHitRate` (conservador **0.20**).

**Por qué el riesgo del cache es chico ahora:** como el triage sacó los 23k rebotes del camino
de la KB de 11k, la incógnita del cache sólo toca las ~3k que progresan. La banda completa
(0%→100% hit) mueve el total de Premium apenas **±3%** (~$4.310–$4.560). El triage fue el fix
real; el cache es secundario.

---

## 🎛️ Parámetros a calibrar (todos `[DEV]`, en `calc()` de `public/calculator_v2.html`)

Cuando tengamos **facturación real** de un cliente, ajustar estos y queda clavado:

| Parámetro | Valor actual | Qué es | Cómo validar |
|---|---|---|---|
| `TOKENS.fixedInput` | 11.180 | System + KB + perfil (tok) | Contar tokens del prompt real |
| `TOKENS.turnInput` | 200 | Input variable por turno | Muestreo de conversaciones |
| `TOKENS.turnOutput` | 300 | Output por turno (**NO recortar** — la calidad de respuesta genera leads) | Muestreo |
| `TOKENS.weightedTurns` | 2.5/8/15/25 | Turnos por desenlace (rebote/frío/caliente/ready) | Logs del agente |
| `TOKENS.cacheFactor` | 0.10 | Multiplicador de lectura cacheada | Doc del proveedor |
| `cacheHitRate` | 0.20 | % de 1eros-turno que pegan cache | **MEDIR** con tráfico real vs TTL |
| `CACHE_WRITE` | 1.25 | Multiplicador de escritura (5 min; 1 h ≈ 2×) | Doc Anthropic |
| `TRIAGE` in/out | 0.30/2.50 | Precio del modelo triage | Lista Google |
| `TRIAGE_INPUT` | 1.500 | Contexto del prompt de ruteo | Definir prompt real |

`TARIFA_CONV = 0.022` quedó **muerta** (ya no se usa para el LLM). No reintroducirla.

---

## 📊 Salida actual (35k contactos propios, Latam, campaña off)

| Plan | LLM real (triage+cache) | Total mensual |
|---|---|---|
| Estándar | $190 | **$1.246** |
| Pro | $716 | **$2.547** |
| Premium | $1.228 | **$4.535** |

---

## ✅ Checklist anti-regresión

- [ ] `llmRaw` se calcula por **tokens × `ai.in`/`ai.out`**, nunca por una tarifa plana.
- [ ] Los rebotes (`convBounce`) corren en `TRIAGE`, **no** en `ai` del plan.
- [ ] El cache entre conversaciones usa `cacheHitRate` + `CACHE_WRITE` (no se asume 100% hit).
- [ ] Los precios por modelo coinciden con las listas oficiales (revisar en cada release de modelo).
- [ ] `turnOutput` NO se recorta para "ahorrar" — degrada la generación de leads.

---

## 🔬 Auditoría multi-agente 2026-07-28 (13 agentes, verificación adversarial)

Escenario canónico: **10.000 contactos propios · Latam · campaña off · voz off**. Ground truth: Motor de IA
$97 (Estándar) / $365 (Pro) / $626 (Premium); totales $972 / $1.886 / $3.363.

### Aritmética: BLINDADA
Recálculo independiente desde cero reconcilia **al centavo** en los 3 planes. Triage ($16,12, igual en los 3),
término de cache (`firstTurnMult + 0.10×(t-1)`), mapeo de turnos (lF→8, lC→15, lA→25, lP→25): sin doble conteo,
sin off-by-one, cero discrepancias. La calculadora computa exactamente lo que muestra.

### Precios verificados contra fuentes oficiales (jul-2026)
| Modelo | Precio | Estado |
|---|---|---|
| **Opus 5** (Premium) | $5 / $25 | ✅ CORRECTO — drop-in al precio de Opus 4.8 (4.8 y 5 cuestan lo mismo; elegir es calidad, no costo) |
| **Sonnet 5** (Pro) | $3 / $15 | ✅ precio de lista correcto (hay intro $2/$10 hasta 31-ago-26 → hoy sobre-cobramos Pro ~33%, margen-safe) |
| **Flash-Lite** (triage) | $0,30 / $2,50 | ✅ correcto, GA |
| **Gemini 3 Flash** (Estándar) | $0,50 / $3 | ⚠️ número correcto pero es **preview**; el GA cuesta ~3× (riesgo de deprecación) |

### Riesgos de supuestos (todos subcontan, todos pegan más en Premium) — estado post-decisiones de Andrea
1. **Cache intra-charla** (era el más grave, "alta") → **DESCARTADO.** Ximia corre en **widget web sincrónico**
   (el lead responde seguido, dentro del TTL de 5 min), así que el 0,10× por turno es válido. Sólo revisar si
   algún día se agrega **WhatsApp/async**.
2. **Thinking tokens** (`turnOutput=300` ignora el razonamiento) → **acotado.** Sube el costo, pero Opus califica
   en menos turnos (efecto que el modelo hoy NO le acredita, porque `weightedTurns` es compartido) → se compensan.
   El markup 2,5× aguanta hasta ~4,7× de thinking. NO meter un multiplicador inventado; calibrar con factura real.
3. **Triage `escalationRate=0`** → **el único riesgo vivo.** Asume que ningún rebote toca el modelo caro. 10% de
   fuga = +$137 en Premium; 20% = +$274. [DEV] medir con el primer cliente.
4. **KB=11.180 tok / historial** → a medir con datos reales (tiktoken del prompt real).

### Perillas `[DEV]` a clavar con la PRIMERA FACTURA REAL
`escalationRate` (triage) · `thinkingMultiplier` + eficiencia de turnos por plan (par que se compensa) ·
`fixedInput` (medido) · `cacheHitRate` (cruzado). Hasta entonces los números son un **piso defendible** dentro
del 2,5×, no un costo esperado — **no comprometer Pro/Premium como precio fijo** sin medir.

### Decisión abierta: motor de Premium
Opus vs Sonnet es empírico. Andrea ya probó Sonnet en real (el gap no era enorme). Pendiente: **A/B Opus vs Sonnet
con el mismo guión** en el agente n8n. Si Opus no gana claro → Premium en Sonnet es defendible y más barato
($15 vs $25 de output). 4.8 ↔ 5 es indistinto en costo.
