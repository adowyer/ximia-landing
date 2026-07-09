**XIMIA AI**

**Modelo de Pricing por Lead Calificado**

Investigación, benchmarks de mercado y fórmulas validadas

Abril 2026 · Confidencial

# **1\. Contexto: El mercado de leads en real estate**

Antes de definir el precio de un lead Ximia, es necesario entender cuánto cobra el mercado por leads NO calificados. Estos son los benchmarks validados con datos de 2024–2025.

## **1.1 Facebook / Meta Ads**

| Métrica | Valor | Fuente |
| :---- | :---: | :---: |
| CPL promedio real estate (global) | $21.83 USD | Superads.ai — $3B en datos |
| CPL promedio real estate (USA) | $16.61 USD | LocaliQ 2025 |
| Rango típico | $13 – $29 USD | Varía por temporada |
| Calidad del lead | Sin calificación financiera | Solo expresó interés |

*Importante: estos leads son personas que hicieron click en un anuncio. No han respondido ninguna pregunta financiera. No sabemos si pueden comprar.*

## **1.2 Google Ads**

| Métrica | Valor | Fuente |
| :---- | :---: | :---: |
| CPL promedio real estate (USA) | $50 – $150 USD | Fetch & Funnel 2025 |
| Mercados premium (NYC, SF) | $200 – $350 USD | Fetch & Funnel 2025 |
| Calidad vs. Facebook | 3–5x mayor intención | Alta por búsqueda activa |
| Calidad financiera | Sin calificación | Solo búsqueda intencional |

## **1.3 Portales (Zillow, Realtor.com)**

| Plataforma | CPL típico | CPL grandes metros | Calidad |
| :---- | :---: | :---: | :---: |
| Zillow Premier Agent | $20 – $60 USD | $139 – $223 USD | Sin calificación financiera |
| Zillow (dato oficial) | $139 no-metro | $223 metro avg | Contacto, no pre-aprobación |
| Realtor.com | $200 – $1,000/mes | Variable por ZIP | Sin calificación financiera |
| Mercados ultra-premium | Hasta $450+ | ZIP competitivos | Sin calificación financiera |

| Conclusión clave Todo el mercado — Facebook, Google, Zillow — vende leads SIN calificación financiera a precios de $17 a $223+ USD. Nadie sabe si esa persona puede comprar. Ximia entrega un lead que ya pasó por: verificación de identidad, perfil de ingresos completo, análisis de deudas y ahorro, y score hot/warm con razonamiento. Es un producto categóricamente diferente. |
| :---- |

# **2\. El modelo de pricing: % de comisión amortizada**

## **2.1 Por qué el modelo anterior era incorrecto**

El fee fijo de mantenimiento no tiene relación con el valor entregado. Con 500 conversaciones o con 20,000, el precio era casi el mismo. Eso no es sostenible ni defensible comercialmente.

* El cliente no entiende por qué paga más si el costo de la API es céntimos

* No escala con el éxito del cliente

* No refleja el valor diferencial del producto

## **2.2 La fórmula correcta**

| FÓRMULA PRINCIPAL precio\_lead \= min(techo\_mercado, comision\_amortizada × factor\_mercado) comision\_amortizada \= (ticket\_promedio × comision%) / close\_rate Servicio total \= base\_SLA \+ (leads\_calificados × precio\_lead) |
| :---- |

**Variables de la fórmula**

| Variable | Definición | Fuente |
| :---- | :---: | :---: |
| ticket\_promedio | Precio promedio de una propiedad del portfolio | Input del cliente |
| comision% | Porcentaje de comisión o margen por venta | Input del cliente |
| close\_rate | Leads calificados necesarios para cerrar 1 venta | Input del cliente |
| comision\_amortizada | Lo que vale un lead en términos de comisión | Calculado |
| factor\_mercado | % de captura según mercado geográfico | Ver tabla §2.3 |
| techo\_mercado | Precio máximo por lead según mercado | Ver tabla §2.3 |
| base\_SLA | Fee fijo mensual según nivel de soporte | Ver tabla §2.4 |
| leads\_calificados | conversaciones × 12% | Embudo estadístico §3 |

## **2.3 Factores por mercado**

El mercado geográfico afecta el precio por lead a través del factor de captura y el techo. Los fundamentos: comisiones típicas más altas en USA/EAU justifican un factor mayor; Latam es más sensible al precio.

| Mercado | Factor captura | Techo por lead | Justificación |
| :---- | :---: | :---: | :---: |
| Latam | 6% | $80 USD | Comisiones más bajas, mayor sensibilidad al precio |
| USA | 8% | $200 USD | Mercado estándar de referencia — competitivo con Zillow |
| Europa | 8% | $200 USD | Comisiones similares a USA, mercado maduro |
| EAU (Dubai) | 10% | $250 USD | Comisiones ultra-altas, portfolio premium, cliente sofisticado |

| ¿Por qué estos porcentajes son defensibles? Facebook cobra entre 15–40% del valor del lead con un producto sin calificación. Ximia cobra 6–10% con un lead financieramente pre-aprobado. El producto es superior, el precio es menor en términos de % de captura. El argumento es irrefutable. |
| :---- |

## **2.4 Base fija por nivel de SLA**

| Nivel de Soporte | Base mensual | Incluye |
| :---- | :---: | :---: |
| Estándar | $500 USD/mes | Monitoreo, reportes mensuales, soporte en horario laboral |
| Prioritario | $800 USD/mes | Todo lo anterior \+ respuesta en 4hs, reunión quincenal |
| Enterprise | $1,500 USD/mes | Todo lo anterior \+ soporte 24/7, SLA garantizado, reporting ejecutivo |

## **2.5 Ejemplos de precios calculados**

Usando ticket promedio \= superficie 80m², comisión 3%, close rate 1/8:

| Mercado | m²/USD | Propiedad 80m² | Comis. 3% | Amort. /8 | Factor | Precio lead |
| :---- | :---: | :---: | :---: | :---: | :---: | :---: |
| Latam | $500 | $40,000 | $1,200 | $150 | 6% | $9.00 |
| Latam | $1,500 | $120,000 | $3,600 | $450 | 6% | $27.00 |
| Latam | $5,000 | $400,000 | $12,000 | $1,500 | 6% | $80 (techo) |
| USA | $2,000 | $160,000 | $4,800 | $600 | 8% | $48.00 |
| USA | $5,000 | $400,000 | $12,000 | $1,500 | 8% | $120.00 |
| USA | $12,000 | $960,000 | $28,800 | $3,600 | 8% | $200 (techo) |
| EAU | $15,000 | $1,200,000 | $36,000 | $4,500 | 10% | $250 (techo) |
| EAU | $20,000 | $1,600,000 | $48,000 | $6,000 | 10% | $250 (techo) |

*El techo garantiza que ningún cliente pague más de lo que paga Zillow por un lead no calificado, lo cual hace el argumento irrebatible en cualquier reunión de ventas.*

# **3\. El embudo estadístico de conversaciones**

¿Qué pasa con las conversaciones iniciadas? La distribución se basa en benchmarks de conversión de chatbots de real estate y en la fricción natural del proceso de calificación financiera.

| Segmento | % del total | Definición | Costo |
| :---- | :---: | :---: | :---: |
| Rebote | 38% | Menos de 3 turnos, sin datos útiles | \~Cero |
| Procesado | 37% | 3–12 turnos, datos parciales, score cold | Costo reducido |
| Completo frío | 13% | Proceso completo, no bankable o timeline \>12m | Costo completo |
| Lead Calificado | 12% | Hot/warm, pre-aprobado, listo para vendedor | Precio premium |

**¿Por qué 12% de calificación?**

* Chatbots genéricos de real estate: 3–5% de calificación

* Formularios web con seguimiento humano: 8–12%

* Ximia hace calificación financiera real → más fricción que un formulario, pero infinitamente más calidad

* 12% es conservador y defendible — en operaciones optimizadas puede superar el 15%

| La barrera de las preguntas financieras El 37% de abandono en la fase incompleta ocurre principalmente cuando el sistema pregunta por ingresos, deudas y ahorro. Es la fricción más alta del proceso y también la que más valor agrega. El framing es crítico: 'Para encontrarte la mejor opción necesito entender tu situación' convierte mejor que 'Completá tu perfil financiero'. |
| :---- |

# **4\. El argumento de ventas: el jaque mate**

## **4.1 Costo por lead: Ximia vs. mercado**

El argumento más poderoso no es cuánto cuesta Ximia, sino cuánto vale lo que genera Ximia.

| Fuente | Costo por lead | Calificación financiera | Disponibilidad |
| :---- | :---: | :---: | :---: |
| Facebook Ads (real estate) | $17 – $22 USD | ❌ Ninguna | Solo horario laboral |
| Google Ads (real estate) | $50 – $150 USD | ❌ Ninguna | Solo horario laboral |
| Zillow Premier Agent | $139 – $223 USD | ❌ Ninguna | Solo horario laboral |
| Vendedor humano senior | \~$133 USD | ✅ Parcial (45 min/lead) | 8hs/día, 5 días/semana |
| Ximia (Latam estándar) | $9 – $27 USD | ✅ Completa \+ score | 24/7, ilimitado |
| Ximia (USA premium) | $48 – $120 USD | ✅ Completa \+ score | 24/7, ilimitado |

## **4.2 El modelo de liquidación de stock**

Para un desarrollador inmobiliario, el argumento decisivo no es el costo del lead — es el tiempo de liquidación de su stock.

| Escenario: 300 unidades, close rate 1/8 Con Ximia (15,000 conv/mes) Sin Ximia (5 vendedores) Leads calificados/mes 1,800 60 Ventas estimadas/mes 225 7.5 Tiempo para 300 unidades \~2 meses \~40 meses Costo mensual $44,600 (escenario USA) $10,000 (salarios) Costo total del proceso \~$89,200 \~$400,000 Ximia no reduce el costo de vender. Comprime el tiempo de liquidación de años a meses. Para un desarrollador con $30M en stock sin vender, eso tiene un valor financiero que es órdenes de magnitud mayor que el costo de la plataforma. |
| ----- |

## **4.3 Los leads 'fríos' tienen valor oculto**

El 13% que completa el proceso pero resulta not\_bankable hoy no es una pérdida — es una base de nurturing con perfil financiero real.

* En 6–12 meses, una parte de ellos podrá comprar

* Ningún competidor tiene esa base de datos estructurada

* Son leads retargetables con contexto financiero real

* El dato 'cuánto le falta para calificar' tiene valor para ofrecer soluciones alternativas

# **5\. Implementación técnica en la calculadora**

## **5.1 Modelo C (híbrido) — recomendado**

| Servicio mensual \= base\_SLA \+ (leads\_calificados × precio\_lead) leads\_calificados \= conversaciones\_mes × 0.12 precio\_lead \= min(techo, (ticket × margin% / closeRate) × factor\_mercado) |
| :---- |

## **5.2 Por qué el Modelo C y no el B puro**

* La base fija (SLA) protege el margen en clientes de bajo volumen

* El variable escala con el valor entregado — más leads calificados \= más servicio \= más precio

* El cliente entiende exactamente por qué paga más cuando recibe más

* Es el modelo que usan los SaaS de referencia (Stripe, Twilio, etc.)

## **5.3 Parámetros configurables internamente**

| Parámetro | Valor actual | Dónde cambiar |
| :---- | :---: | :---: |
| Factor Latam | 6% | MARKET\_CONFIG en el HTML |
| Factor USA / Europa | 8% | MARKET\_CONFIG en el HTML |
| Factor EAU | 10% | MARKET\_CONFIG en el HTML |
| Techo Latam | $80 USD | MARKET\_CONFIG en el HTML |
| Techo USA / Europa | $200 USD | MARKET\_CONFIG en el HTML |
| Techo EAU | $250 USD | MARKET\_CONFIG en el HTML |
| Base SLA Estándar | $500 USD/mes | MAINT\_BASE\_SLA en el HTML |
| Base SLA Prioritario | $800 USD/mes | MAINT\_BASE\_SLA en el HTML |
| Base SLA Enterprise | $1,500 USD/mes | MAINT\_BASE\_SLA en el HTML |
| Tasa de leads calificados | 12% | QUALIFIED\_RATE en el HTML |
| Tasa de rebote | 38% | BOUNCE\_RATE en el HTML |

# **6\. Fuentes y referencias**

| Fuente | Dato clave | URL |
| :---- | :---: | :---: |
| Superads.ai (basado en $3B de datos) | CPL real estate Facebook 2025: $21.83 avg | superads.ai/facebook-ads-costs |
| LocaliQ 2025 | CPL real estate Facebook: $16.61 | localiq.com/blog/facebook-advertising-benchmarks |
| WordStream 2024 | CPL Facebook promedio todas las industrias: $21.98 | wordstream.com/blog/facebook-ads-benchmarks |
| Fetch & Funnel 2025 | Google Ads real estate: $50–$150, NYC/SF: $200–$350 | fetchfunnel.com/cost-per-lead-real-estate |
| Zillow Premier Agent (oficial) | CPL metro: $223, no-metro: $139 | zillow.com/premier-agent |
| Thunderbit 2025 | Zillow leads: $139–$223 avg, hasta $450+ en ZIPs hot | thunderbit.com |
| Simply Be Found 2025 | Facebook real estate CPL: $13.87, Google: promedio $53.52 | simplybefound.com |

Documento generado en Abril 2026 · **Confidencial — Ximia AI**