# Cómo funciona el calculador de Ximia

*Explicación para stakeholders — en lenguaje simple, sin tecnicismos. Cualquiera que lo lea debería entender qué hace la calculadora y qué es cada número.*

---

## Qué es

Es una herramienta que un desarrollador inmobiliario usa en la web de Ximia para **ver, con sus propios números, cuánto le costaría trabajar con Ximia cada mes y cuánto valor recibiría a cambio**. Mueve unos controles y ve, en tiempo real, su inversión mensual, los leads que recibiría y su retorno.

---

## La idea central del modelo (leer esto primero)

Ximia captura y **califica financieramente** los contactos de un desarrollador: verifica ingresos, deudas y ahorro, y entrega leads listos para comprar. La máquina de Ximia puede generar **casi infinitos** leads calificados si hay tráfico.

**Pero el cliente no puede atender infinitos leads.** Su límite es humano: cuántos leads puede realmente trabajar y cerrar su equipo de vendedores. De nada sirve entregarle 12.000 leads si su equipo solo puede llamar a unos cientos por mes.

Por eso **el precio no depende de cuántos leads Ximia puede generar, ni de cuántas propiedades tiene el cliente — depende del tamaño de su equipo de ventas** (su capacidad real de trabajar leads). Es el mismo modelo que usan Salesforce o HubSpot: se cobra por "asiento" (por vendedor).

---

## Lo que el cliente carga (los controles)

1. **Vendedores** — cuántos ejecutivos comerciales tiene. **Este es el que manda:** define la capacidad y, con eso, el costo mensual.
2. **Mercado** — Latam, USA, Europa o Dubái (cambia los precios de referencia).
3. **Precio promedio de una propiedad** — el ticket típico de su cartera.
4. **Comisión por venta** — cuánto gana el cliente por operación.
5. **Unidades en cartera** — el tamaño de su stock. **No cambia el precio**: es solo un indicador del tipo y la escala del cliente (y sirve para sugerir un tamaño de equipo por defecto).
6. **Contactos por mes** — su tráfico. Sirve para verificar que Ximia tenga material suficiente para llenar la capacidad del equipo.

---

## El precio: un abono mensual predecible

El abono mensual se arma con dos partes:

- **Base** (Licencia + Soporte): un piso fijo según el nivel de soporte elegido ($500 a $1.500/mes).
- **Equipo**: por cada vendedor, Ximia le entrega y le cobra los ~30 leads calificados que ese vendedor puede trabajar en el mes. El costo de esos 30 leads sale del **valor de mercado del lead** (ver abajo).

> **Fórmula simple:** `Abono = Base + (cantidad de vendedores × precio por vendedor)`
> Donde el *precio por vendedor* = 30 leads × lo que vale cada lead en su mercado.

**Ejemplos reales** (equipo típico según tamaño):

| Mercado | Vendedores | **Abono mensual** |
|---|---|---|
| Latam | 3 | ~$2.700 |
| Latam | 8 | ~$6.500 |
| Latam | 25 | ~$19.000 |
| USA | 8 | ~$30.000 |
| Dubái | 8 | ~$30.500 |

El número **escala con el cliente** (más vendedores = más capacidad = más costo), pero nunca da los números absurdos que daban los modelos anteriores. Es predecible: el cliente sabe exactamente qué paga cada mes, y solo cambia si suma o saca vendedores.

---

## El valor: qué recibe a cambio (el argumento estrella)

Debajo del abono, el calculador muestra el retorno:

- **Costo por venta habilitada** — lo que le cuesta Ximia por **cada operación que su equipo cierra**. Da alrededor de **0,2% del ticket** en todos los mercados. Un director comercial entiende *"me sale $216 por cada unidad vendida"* mucho mejor que *"pago $6.500/mes"*. Este es el número que se muestra sin espantar a nadie.
- **Retorno (ROI)** — cuántas veces recupera la inversión con las comisiones que genera (típicamente 10 a 16 veces).
- **Comparativa vs. mercado** — el lead calificado de Ximia frente a los contactos **sin calificar** de Facebook, Google y los portales (Zillow en USA, Zonaprop en Latam, Idealista en Europa, Bayut en Dubái). Ximia entrega un lead con perfil financiero validado a un costo comparable al de un contacto crudo, y por debajo de un portal premium.
- **Garantía** — nunca pagás más por un lead calificado de Ximia que por un contacto sin calificar del portal de tu mercado.

---

## El embudo de leads (lo que Ximia puede entregar)

De los contactos, el 75% inicia una conversación. De ahí salen, en niveles de calidad crecientes y **anidados** (cada nivel está dentro del anterior):

- **Frío** — dejó su perfil personal.
- **Calificado** — completó su perfil e hizo la calificación financiera.
- **Financieramente Calificado** — pasó la evaluación, está listo para comprar.
- **Pre-Venta** — listo para reservar.

Esto es la **oferta** de Ximia: lo que *puede* entregar. El calculador muestra estos volúmenes y el valor de mercado de cada perfil. Pero **el cliente paga por la capacidad de su equipo, no por este volumen** — el excedente de leads que su equipo no llega a trabajar es una oportunidad de crecer (sumar vendedores), no un costo.

---

## Ximia Closing (opcional · en el roadmap)

El lead listo para cerrar se puede entregar con un tiempo de contacto acordado (24–48 h). Si el cliente no lo cierra a tiempo, Ximia podría cerrarlo y cobrar una comisión (~3%). **Es una función futura, no está en el precio del abono** — requiere estructura legal de intermediación por país. En el calculador se muestra como línea separada y opcional, nunca sumada al abono.

---

## Los números que se ven en pantalla, en una frase cada uno

- **Inversión mensual** — el abono que paga el cliente cada mes (base + equipo). Predecible.
- **Costo por venta habilitada** — lo que le cuesta Ximia por cada unidad que su equipo vende (~0,2% del ticket). *El argumento clave.*
- **Retorno (ROI)** — cuántas veces recupera lo que paga.
- **Comparativa vs. mercado** — su lead calificado frente a los contactos sin calificar de Facebook, Google y los portales.
- **Valor de mercado por lead** — lo que cada perfil de lead valdría comprado afuera.

---

*En una frase: el cliente paga un abono mensual predecible que depende del tamaño de su equipo de ventas (su capacidad real de trabajar leads). A cambio recibe leads financieramente calificados que valen mucho más de lo que le cuestan — y el costo por cada venta que habilita es apenas ~0,2% del precio de la propiedad.*
