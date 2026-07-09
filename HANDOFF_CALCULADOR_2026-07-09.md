# Handoff técnico — Calculador de precios de Ximia

**Fecha:** 2026-07-09 · **Archivo:** `public/calculator.html` (HTML+JS standalone, embebido como iframe en la landing)
**Para:** cualquiera que necesite retomar o modificar el calculador. Documenta el modelo final, por qué es así, dónde tocar cada cosa, y qué queda pendiente.

---

## 1. Qué es y dónde vive

- **Archivo único:** `public/calculator.html` — todo el markup, estilos (`<style>` inline) y lógica (`<script>` al final, ~a partir de la línea 2280) están ahí. No depende de React; se sirve tal cual y se embebe en `src/App.jsx` como iframe.
- **Servir en dev:** `npm run dev` → `http://localhost:5173/calculator.html`.
- **Build:** `npm run build` → copia a `dist/calculator.html`.
- **Verificación sin navegador:** se puede correr el `<script>` en Node con un shim de `document` (ver ejemplos abajo). El motor es DOM-dependiente pero se testea así.

---

## 2. EL MODELO FINAL (lo importante)

**Suscripción por capacidad de absorción, facturada por asiento comercial (por vendedor).**

```
fee_mensual   = base_SLA + n_vendedores × precio_asiento
precio_asiento = LEADS_PER_SEAT × precio_lead
precio_lead    = min( techo_mercado , (ticket × comisión% / close_rate) × factor_captura )
```

- **Driver primario = cantidad de vendedores** (`S.vendors`, input "Vendedores" en la UI). NO el inventario ni el tráfico.
- **Por qué:** Ximia puede generar leads casi infinitos, pero el cliente sólo puede *trabajar* los que su equipo humano absorbe (~30 leads calificados/vendedor/mes). Se factura la capacidad comprometida (committed-use, tipo Salesforce/HubSpot), no lo que se genera.
- **`precio_lead` es el del doc §2.2, intacto.** El techo por mercado garantiza "nunca más caro que Zillow/portal".
- **Unidades (`S.units`)** = solo indicador de escala del cliente. NO entra en el fee. (El proxy unidades→vendedores por defecto quedó pendiente, ver §7.)
- **Tráfico/embudo** = "supply" (lo que Ximia puede entregar), sirve de chequeo, NO factura.
- **Ximia Closing** (success-fee 3% al cierre) = roadmap/opcional, FUERA del abono (riesgo legal de brokerage).

**Números de referencia (LATAM, ticket $110k, comisión 3%, standard SLA):**
| Vendedores | Abono/mes | Costo por venta | ROI |
|--:|--:|--:|--:|
| 3 | ~$2.740 | $243 (0,22%) | ×13.6 |
| 8 | ~$6.467 | $216 (0,20%) | ×15.4 |
| 20 | ~$15.418 | $206 | ×16.1 |
| 50 | ~$37.794 | $202 | ×16.4 |

El "costo por venta habilitada ≈ 0,2% del ticket" es el argumento estrella del pitch.

---

## 3. Por qué llegamos a este modelo (evolución — leer si vas a cambiarlo)

El pricing pasó por varias iteraciones en la sesión del 2026-07-09. Contexto para no repetir errores:

1. **Modelo original (roto):** el precio del lead era una repartición del costo total con pesos inventados; `LEAD_BASE`/`LEAD_CEILING` eran código muerto. No implementaba el doc.
2. **Modelo del doc (comisión amortizada):** `precio_lead = min(techo, ticket×comm/close_rate × factor)`. Correcto para el PRECIO por lead, pero al facturar `leads × precio` daba números enormes.
3. **Fee por tramos (plano):** intento de fee mensual predecible por bracket de tráfico. **Error:** demasiado plano — no variaba con ticket/comisión/unidades. El doc §2.1 dice explícito que un fee plano no es defendible.
4. **Híbrido (piso + variable con tope por inventario):** variaba con todo, pero **el tope por inventario (`units × close_rate`) trataba el inventario TOTAL como flujo mensual** → LATAM 359 unidades daba $72.000/mes. Inviable.
5. **MODELO FINAL (por asientos):** un panel de 5 agentes expertos (real estate, pricing SaaS, ventas/capacidad, finanzas, GTM) diagnosticó el error de fondo: **confundíamos la capacidad de GENERACIÓN de Ximia con la capacidad de ABSORCIÓN del cliente.** El fee debe atarse a los vendedores (capacidad real), no al inventario ni al tráfico. El caso de $72.000 → $6.467.

**Regla de oro para no volver a romperlo:** el volumen facturable NUNCA se ata al lado de la OFERTA (tráfico × 12%, o inventario × close_rate). Se ata a la CAPACIDAD DE ABSORCIÓN (vendedores × leads_por_vendedor). Y no confundir valor de liquidación TOTAL (una vez) con fee MENSUAL (recurrente).

---

## 4. Parámetros tuneables (todos en el bloque de constantes del `<script>`)

| Constante | Valor default | Qué controla | Nota |
|---|---|---|---|
| `LEADS_PER_SEAT` | `30` | leads calificados que un vendedor trabaja/mes | **Perilla más sensible** (mueve el fee ±35%). Rango defendible 20–40. Validar con throughput real de los primeros clientes (medir en etapa de CIERRE, no de contacto). |
| `SLA_BASE` | `{standard:500, priority:800, enterprise:1500}` | piso mensual (base_SLA del doc §2.4) | |
| `CAPTURE_FACTOR` | `{latam:0.06, usa:0.08, europa:0.08, eau:0.10}` | % del valor del lead que cobra Ximia (doc §2.3) | **Tuneable en vivo con los sliders [DEV].** Es la palanca de magnitud por mercado. |
| `LEAD_CEILING_MKT` | `{latam:80, usa:200, europa:200, eau:250}` | techo por lead = benchmark portal sin calificar | Mantiene "nunca más que Zillow". |
| `CLOSE_RATE` | `{frio:150, cali:30, apro:8, prev:2}` | leads de cada tier por venta | `apro:8` es el que importa (se cancela en el % de comisión). |
| `CALIF_RATE / APRO_RATE / PREV_RATE` | `0.50 / 0.30 / 0.10` | embudo anidado (de conversaciones) | Sólo afecta el "supply" mostrado, NO el fee. |
| `ENGAGE_RATE` | `0.75` (en `calc()`) | % de contactos que inicia conversación | Constante de producto. |
| `MARKET[x].commission` | Latam 3% / USA 2.5% / EAU 2% | comisión default por mercado | El cliente la ajusta con el slider "Comisión". |
| `MARKET[x].portal / benchFb / benchGoogle` | por mercado | nombres y CPLs para la comparativa | Zillow solo USA; LATAM Zonaprop, Europa Idealista, EAU Bayut. |
| `AI_TIERS` | Haiku 4.5 / Sonnet 5 / Opus 4.8 | modelos y precios LLM 2026 | Infra interna (incluida), no se suma al fee. |
| `MGMT_TRAMOS`, `LICENCIA_BASE`, `PREV_COMMISSION` | — | **restos del modelo viejo, ya NO se usan en el fee** | Se pueden borrar en una limpieza. |

---

## 5. Cómo está armado el `calc()` (la función que recalcula todo)

Orden dentro de `calc()`:
1. **Ticket** = `S.ticket` (input directo); el m² es lectura derivada.
2. **Embudo anidado:** `nCaliProgress = conv×CALIF_RATE`; `nApro = nCali×APRO_RATE`; `nPreV = nApro×PREV_RATE`. Buckets exclusivos (`leafFrio/Cali/Apro/PreV`) que suman a las conversaciones.
3. **Valor por lead** `leadValue(tier)` → `vFrio/vCali/vApro/vPrev` (comisión amortizada × factor, con techo). Pre-Venta = techo (portal premium).
4. **SERVICIO (el fee):** `seats × LEADS_PER_SEAT × vApro + SLA_BASE`. Ver §2.
5. **Infra interna** (LLM/host/db/voz) — se muestra como "incluida", NO se suma.
6. **Valor/ROI:** `ventasHabilitadas = capacidadLeads/close_rate`; `cpaPorVenta = servicio/ventasHabilitadas`; `roi = ingresosMes/servicio`.
7. **Display:** actualiza todos los `id`s del DOM vía `s(id, valor)`.

**IDs de salida clave:** `r-total` (abono), `roi-lead-cost` (costo por venta), `roi-cpa-pct` (% del ticket), `r-roi-main` (ROI), `r-svc`/`r-platform-total` (plataforma+equipo), barras del embudo (`bn-*`, `st-*`, `bar-*`), comparativa (`vsm-*`).

---

## 6. Features del calculador

- **Permalink + captura de email (#25):** `serializeState()` codifica el estado en la URL; `hydrateFromURL()` lo reconstruye al cargar (corre en INIT antes de `onSlider()`). Botón "Copiar link" (`copyPermalink()`) y form de email (`submitEmail()`) que hace POST a `CAPTURE_WEBHOOK`. **⚠️ `CAPTURE_WEBHOOK` es un placeholder `https://REEMPLAZAR.n8n/...` — reemplazar por el webhook real de n8n (que inserta en Supabase → HubSpot).**
- **Comparativa vs mercado (#26):** panel oscuro, market-aware (portal correcto por mercado) + garantía.
- **Ximia Closing:** explicado en un bloque verde bajo el embudo. La Pre-Venta se muestra como "Ximia Closing", fuera del fee.
- **Capital liberado (#27):** tarjeta que traduce el tiempo ahorrado a dólares (carrying evitado, 1%/mes).
- **Sliders [DEV]:** controlan `CAPTURE_FACTOR` por mercado (Latam/Europa/Dubái; USA fijo 8%). Andrea los dejó VISIBLES a propósito para tunear — ocultar/gatear antes de exponer a clientes.
- **Idioma / formato:** lee `?lang=en` o `<html lang>` → formatea números con `en-US` vs `es-AR`. Textos estáticos siguen en español (traducción completa pendiente, ver §7).
- **Accesibilidad:** aria-labels en inputs, foco de teclado visible, aria-pressed en botones.

---

## 7. Pendientes / follow-ups

1. **`CAPTURE_WEBHOOK`**: reemplazar el placeholder por el webhook real de n8n.
2. **`LEADS_PER_SEAT = 30`**: validar con throughput real de los primeros 2–3 clientes antes de fijarlo.
3. **Proxy unidades→vendedores**: el panel sugirió que "unidades" autocomplete un default de equipo (100u≈3, 359u≈8, 3000u≈25) y sugiera el tier de SLA. No está cableado.
4. **Copy del landing (`src/App.jsx` + `locales/en|es/translation.json`)**: el panel recomendó retirar el pitch "liquidar 300 unidades en 2 meses" (§4.2 del doc) y reemplazarlo por "aceleramos tu velocidad de venta dentro de lo que tu equipo puede cerrar". Mantener paridad de keys en ambos translation.json.
5. **Traducción EN completa** de los textos del calculador (hoy solo el formato de números es locale-aware). Ideal al extraer a componente React con el i18next del sitio.
6. **Panel [DEV]**: gatearlo/ocultarlo antes de publicar a clientes (hoy visible a propósito para tunear).
7. **Limpieza de código muerto**: `MGMT_TRAMOS`, `LICENCIA_BASE`, `PREV_COMMISSION`, `mktWeight` en `MARKET` ya no se usan en el fee.
8. **Ximia Closing v1**: definir la estructura legal de brokerage por jurisdicción antes de activarlo como SKU.
9. **Elevar el input "Vendedores"** a input primario/prominente (hoy es un slider secundario junto a idiomas).
10. **Deploy**: `dist/` está listo; falta publicarlo (Vercel/Netlify/hosting) para que los SH lo chequeen remoto.

---

## 8. Backups locales (por si hay que comparar o revertir)

- `public/calculator.backup-2026-07-09.html` — antes de reconstruir el motor de pricing.
- `public/calculator.backup-premodel-2026-07-09.html` — antes del modelo mensual (tramos/híbrido).
- `public/calculator.backup-preseats-2026-07-09.html` — **antes del modelo por asientos (el último "antes")**. Este es el más útil para comparar el cambio final.

*(Estos backups NO se commitean — están gitignoreados. Son solo referencia local.)*

---

## 9. Documentos relacionados

- **`Ximia Lead Pricing Model 2026.md`** — el doc de pricing (fuente de verdad del `precio_lead`).
- **`COMO_FUNCIONA_EL_CALCULADOR.md`** — explicación para stakeholders, en lenguaje simple (sin jerga).
- **Revisión inicial (28 hallazgos):** se corrieron agentes que auditaron el calculador; 23/28 corregidos antes del pivote de modelo. La mayoría quedó superada por el rediseño del pricing.
- **Panel de pricing (5 expertos):** diagnosticó y diseñó el modelo por asientos. El veredicto está resumido en §3.
