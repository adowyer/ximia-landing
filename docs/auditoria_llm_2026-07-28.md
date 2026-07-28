# Auditoría de costos LLM del calculador — 2026-07-28

**Archivo auditado:** `public/simulador.html`
**Método:** workflow multi-agente, 13 agentes (4 lentes independientes + verificación adversarial de cada hallazgo material), ~1,1M tokens.
**Escenario canónico:** 10.000 contactos propios · Latam · campaña off · voz off · 3 asientos.
**Doc vivo relacionado:** `MOTOR_COSTOS_LLM.md` (cómo funciona el motor de costos y qué no romper).

> Este documento es la copia estable del resultado de la auditoría, para llevar a la sesión de trabajo del agente Ximia.

---

## TL;DR

- **La aritmética es impecable.** Recálculo independiente desde cero reconcilia al centavo en los 3 planes. Cero discrepancias.
- **Los precios de modelos están verificados** contra fuentes oficiales (jul-2026).
- **El riesgo está 100% en los supuestos**, no en el cálculo — y todos subcontan (dirección peligrosa), concentrados en Pro/Premium.
- Tras las decisiones de Andrea, **el riesgo más grave se descartó** (era un supuesto de canal async tipo WhatsApp; Ximia corre en widget sincrónico). Queda **un solo riesgo vivo** (fuga de triage), que es una perilla a medir, no un bug.
- **Ningún precio mostrado está mal calculado.** Los números son un piso defendible dentro del markup 2,5×, a calibrar con la primera factura real.

### Ground truth (escenario canónico)

| Plan | Motor | Motor de IA | Base de datos e infra | Plataforma y Fee | **Total** |
|---|---|---|---|---|---|
| Estándar | Gemini 3 Flash | $97 | $203 | $672 | **$972** |
| Pro | Claude Sonnet 5 | $365 | $497 | $1.024 | **$1.886** |
| Premium | Claude Opus 5 | $626 | $910 | $1.827 | **$3.363** |

Triage (Flash-Lite, idéntico en los 3): $16,12 raw.

---

## 1. Aritmética — BLINDADA ✅

Recálculo independiente desde cero reproduce **todos** los valores del dump en vivo:

- `triageRaw = $16,1172` (compartido). `convBounce=6512`; in=6512×(1500+200×2,5)=13.024.000 tok; out=6512×(300×2,5)=4.884.000 tok; ×($0,30/$2,50 por Mtok) = $3,9072+$12,21.
- Por plan, `pIn`/`pOut`/`planRawLlm`/`pLlm`/`catMotor` coinciden al último dígito reportado.
- Mapeo de turnos por bucket: lF→frío(8), lC→caliente(15), lA→ready(25), lP→ready(25). Correcto.
- Término de cache `fixedInput×(firstTurnMult + 0.10×(t-1))`: turno 1 paga blended 1,02; turnos 2..t leen cacheados a 0,10×. Sin doble conteo, sin off-by-one.

**La calculadora computa exactamente lo que muestra.**

---

## 2. Precios de modelos — verificados contra fuentes oficiales (jul-2026)

| Modelo (tier) | Precio in/out (por Mtok) | Veredicto |
|---|---|---|
| **Claude Opus 5** (Premium) | $5 / $25 | ✅ **Correcto.** Salió como "drop-in al precio de Opus 4.8" → 4.8 y 5 cuestan lo mismo; elegir uno u otro es **calidad, no costo**. El flag "revisar precio heredado" se borró. |
| **Claude Sonnet 5** (Pro) | $3 / $15 | ✅ Precio de lista correcto. Hay **tarifa intro $2/$10 hasta 31-ago-26** → durante ese período sobre-cobramos Pro ~33% (del lado seguro). |
| **Gemini 3.5 Flash-Lite** (triage) | $0,30 / $2,50 | ✅ Correcto, GA. La única atada a un modelo no-preview. |
| **Gemini 3 Flash** (Estándar) | $0,50 / $3 | ⚠️ Número correcto **pero es un modelo _preview_.** El GA (3.5/3.6 Flash) cuesta ~3× ($1,50/$7,50–$9). Riesgo de deprecación: si migra sin re-precio, Motor Estándar $97→~$210. |

**Acción tomada:** flag de Opus 5 borrado (verificado). **Pendiente sugerido:** marcar en código que el precio de Estándar sigue a un modelo preview.

---

## 3. Riesgos de supuestos — estado tras las decisiones de Andrea

Todos los riesgos son de **subconteo** (la factura real podría superar lo mostrado) y pegan más fuerte en Pro/Premium. Severidad post-verificación adversarial.

### 3.1 Cache intra-conversación → **DESCARTADO** (era el más grave)

- **El supuesto:** todos los turnos de una charla leen la KB de 11k a 0,10× (cache de Anthropic, TTL 5 min).
- **Por qué el agente lo marcó "alta":** asumió canal **asíncrono tipo WhatsApp**, donde el lead responde a las horas/días → el cache vence entre turnos → habría que releer la KB cara (hasta ~$1.150 el Motor Premium a 0,40× efectivo).
- **Por qué NO aplica a nosotros:** **Ximia corre en widget web sincrónico.** El lead se sienta y responde seguido, dentro del TTL de 5 min → el cache aguanta → el 0,10× es correcto.
- **Gatillo de revisión:** sólo si algún día se agrega WhatsApp/async — y para entonces habrá facturación real para medirlo.

### 3.2 Thinking tokens → **acotado**

- **El supuesto:** `turnOutput=300` cuenta sólo el output **visible**; ignora los **thinking tokens** (razonamiento), que se facturan como output. Opus 5 razona por default.
- **Por qué está acotado:** el modelo usa los **mismos turnos** para los 3 planes, así que Opus tampoco recibe crédito por calificar en **menos** turnos. El costo del thinking (sube) y la eficiencia de turnos (baja) **se compensan**. El markup 2,5× aguanta hasta ~4,7× de thinking antes de quedar bajo agua.
- **Decisión:** **no** meter un multiplicador inventado (sería adivinar en la dirección opuesta, el error de la tarifa plana). Calibrar el par (thinking + eficiencia de turnos) con la primera factura real.

### 3.3 Triage `escalationRate = 0` → **el único riesgo vivo** ⚠️

- **El supuesto:** ningún rebote (6.512 de 7.400 conversaciones) toca la KB ni el modelo caro del plan; todos corren en Flash-Lite.
- **Por qué es real:** un router no sabe que una charla va a rebotar hasta engancharla → algo se filtra al modelo caro. Confirmado por el agente adversarial.
- **Impacto:** 10% de fuga → Motor Premium +$137, Pro +$81. 20% → +$274/+$161. (~+4% a +8% del total cotizado.)
- **Acción:** documentado en código como perilla `[DEV]`; medir la tasa real con el primer cliente.

### 3.4 KB (`fixedInput=11.180`) e historial → a medir

- Si la KB real es 20–30k tok → Motor Premium +$238 a +$507. Depende de la arquitectura (una KB con RAG/herramientas no infla el prefijo cacheado).
- Historial de conversación: mayormente absorbido si se cachea (par de ~$42 billed en Premium, no $408).
- **Acción:** medir `fixedInput` con tiktoken/count-tokens del prompt real.

---

## 4. Perillas `[DEV]` a clavar con la PRIMERA FACTURA REAL

| Perilla | Qué es | Dirección del riesgo |
|---|---|---|
| `escalationRate` | % de rebotes que se filtran al modelo caro | subconteo (vivo) |
| `thinkingMultiplier` + eficiencia de turnos por plan | par que se compensa | ambiguo |
| `fixedInput` | tamaño real de System+KB+Profile | subconteo si KB grande |
| `cacheHitRate` | hit de cache **entre** conversaciones | favorable (margen a favor si funciona) |

Hasta medir: los números son **piso defendible** dentro del 2,5×, **no** costo esperado. **No comprometer Pro/Premium como precio fijo** sin una factura real.

---

## 5. Decisión abierta: motor de Premium

- **Opus 4.8 vs Opus 5:** cuestan **lo mismo** ($5/$25). Elegir es calidad/estabilidad, no costo.
- **La pregunta real es Opus vs Sonnet:** ¿el salto de calidad justifica $25 vs $15 de output para calificar leads?
- Andrea ya probó Sonnet en conversación real → el gap no era enorme.
- **Pendiente:** A/B Opus vs Sonnet con el **mismo guión** en el agente n8n (mismo prompt, mismo lead simulado, cambiar sólo el modelo).
  - Si Opus no gana claro → Premium en Sonnet es defendible **y** más barato.
  - Si gana → se queda Opus (da igual 4.8 o 5).

---

## Cambios aplicados al repo en esta auditoría (2026-07-28)

- `public/simulador.html`: flag de Opus 5 borrado (verificado); documentados en código los 3 supuestos (cache intra-charla válido por widget sincrónico · thinking-vs-turnos · triage `escalationRate=0`). **Ningún precio mostrado se movió.**
- `MOTOR_COSTOS_LLM.md`: sección de auditoría agregada.
- `docs/auditoria_llm_2026-07-28.md`: este documento.
