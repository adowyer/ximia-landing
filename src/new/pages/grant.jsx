// Otorgar: credit and benefit granting. Its verb is "resuelve".
import React from "react";
import { Page } from "../Shell";
import { openCalendly } from "../lib";
import { Hero, DarkStat, Stepper, VsTable, CtaDark } from "../bands";

export default function GrantPage() {
  return (
    <Page here="/new/otorgar/">
      <Hero
        negation="Ximia AI no estima."
        verb="Resuelve."
        subLead="Lee la carpeta de cada solicitante, aplica tus reglas de crédito y devuelve el veredicto línea por línea, con el motivo de cada descarte."
        subTail="Tus reglas, no las nuestras. Las cargás y el motor las usa."
        onPrimary={{ label: "Agendar Demo", onClick: openCalendly }}
        onSecondary={{ label: "Cuánto Cuesta", onClick: () => window.open("/simulador.html", "_blank") }}
        aside={
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Veredicto por línea</p>
            <div className="space-y-4">
              {[
                { line: "Línea A · hipotecaria", verdict: "USD 68.199", ok: true, why: "cumple residencia, ingreso y terreno propio" },
                { line: "Línea B · vivienda única", verdict: "No aplica", ok: false, why: "ingreso familiar sobre el tope de la línea" },
                { line: "Línea C · personal", verdict: "USD 22.410", ok: true, why: "no exige terreno" },
                { line: "Línea D · prendaria", verdict: "No aplica", ok: false, why: "edad fuera del rango de la línea" },
              ].map((row) => (
                <div key={row.line} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <span className="text-sm text-gray-500">{row.line}</span>
                    <span className={`text-base font-bold ${row.ok ? "text-gray-900" : "text-gray-400"}`}>
                      {row.verdict}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{row.why}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              Ejemplo ilustrativo. En la demo las líneas y los topes son los que vos cargues.
            </p>
          </div>
        }
      />

      <DarkStat
        headline={["Mientras una persona", "lee carpeta por carpeta,"]}
        highlight="el solicitante ya se fue a otro lado."
        figure="407"
        caption="fichas manuscritas leídas, con su crédito calculado y su motivo de descarte."
        source="Medido sobre nuestra propia operación en ConstruirFácil: 407 fichas en papel digitalizadas y precalificadas. Es la prueba de que el motor corre, no una proyección."
        without={{
          label: "Sin Ximia",
          steps: ["Llega la carpeta", "Alguien la lee", "Busca la línea", "Calcula a mano", "Días después, un número"],
        }}
        with_={{
          label: "Con Ximia",
          steps: ["Llega la carpeta", "El motor la evalúa", "En el momento, el veredicto"],
        }}
        result="Analistas leyendo, no decidiendo."
      />

      <Stepper
        title="Ximia AI resuelve eso."
        steps={[
          { title: "Lee", description: "La carpeta entra como está: escaneada, manuscrita, en planilla. Lo que no puede leer lo declara en vez de suponerlo." },
          { title: "Evalúa", description: "Corre tus reglas sobre cada línea. No la que más presta: la que de verdad le aplica a esa persona." },
          { title: "Arma", description: "Monto, plazo, cuota y techo real de compra. Cada cifra sale de una consulta, con su condición al lado." },
          { title: "Entrega", description: "El veredicto por línea, con el motivo de cada descarte. Es lo que convierte un 'no' en una conversación." },
        ]}
      />

      <VsTable
        title="Lo que usás hoy vs. Ximia AI"
        columns={["Área", "Con una planilla", "Con Ximia"]}
        rows={[
          { feature: "Quién evalúa", old: "Un analista, carpeta por carpeta", ximia: "El motor, en el momento que entra" },
          { feature: "Las reglas", old: "En la cabeza de quien evalúa", ximia: "Cargadas como dato, iguales para todos" },
          { feature: "Un rechazo", old: "«No califica»", ximia: "Qué condición no cumple, y de qué línea" },
          { feature: "Cambiar una tasa", old: "Rehacer la planilla y avisar a todos", ximia: "Un valor, y rige desde la siguiente evaluación" },
          { feature: "Dos evaluadores", old: "Dos criterios para el mismo caso", ximia: "Un criterio, con su registro" },
          { feature: "Auditar una decisión", old: "Reconstruirla de memoria", ximia: "Qué reglas corrieron y con qué datos" },
        ]}
      />

      <CtaDark
        headline="No sumes analistas. Sumá capacidad de resolución."
        subheadline="En la demo cargás tus propias líneas de crédito y tus propios solicitantes, y ves el veredicto regla por regla. Las reglas son tuyas: si las cambiás, cambia el resultado."
        button="Agendar Demo"
        onClick={openCalendly}
      />
    </Page>
  );
}
