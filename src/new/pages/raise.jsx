// Recaudar: NGOs. Its verb is "reconoce" — to raise you first have to know who your
// donors are, and recognising that four records are one person is what runs today.
import React from "react";
import { ShieldCheck, Database, UserCheck, AlertTriangle } from "lucide-react";
import { Page } from "../Shell";
import { openCalendly } from "../lib";
import { Hero, DarkStat, Stepper, WhyXimia, CtaDark } from "../bands";

export default function RaisePage() {
  return (
    <Page here="/new/recaudar/">
      <Hero
        negation="Ximia AI no adivina."
        verb="Reconoce."
        subLead="Entiende cuáles de tus contactos son la misma persona, por qué canal te responden y qué datos tenés roto."
        subTail="Tu base no sale de tu computadora. Lo podés comprobar vos."
        onPrimary={{ label: "Agendar Demo", onClick: openCalendly }}
        aside={
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">Cuatro registros, una persona</p>
            <div className="space-y-3">
              {[
                "ana.gomez@correo.com",
                "ANA.GOMEZ@Correo.com",
                "+54 11 5555 1234",
                "Ana Gómez · socia 2019",
              ].map((row) => (
                <div key={row} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#0092B3" }} />
                  <span className="text-sm text-gray-600 truncate">{row}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-baseline gap-3">
              <span className="text-4xl font-black" style={{ color: "#0092B3" }}>1</span>
              <span className="text-sm text-gray-500 leading-snug">persona, no cuatro. Y tu informe deja de contarla cuatro veces.</span>
            </div>
          </div>
        }
      />

      <DarkStat
        headline={["Tu base no te miente.", "Te cuenta la misma persona"]}
        highlight="cuatro veces."
        figure="93%"
        caption="de los contactos aparecían en más de un canal, contados como si fueran distintos."
        source="Medido sobre nuestra propia base: 429 de 459 contactos. Son NUESTROS contactos, no donantes de una fundación — prueba que el análisis funciona, no que conozcamos tu dominio."
        without={{
          label: "Sin Ximia",
          steps: ["Exportás tu base", "Contás los registros", "Mandás a todos", "La misma persona, tres veces"],
        }}
        with_={{
          label: "Con Ximia",
          steps: ["Subís tu export", "Se reconoce quién es quién", "Sabés a quién le hablás"],
        }}
        result="Una base que no sabés leer."
      />

      <Stepper
        title="Ximia AI resuelve eso."
        steps={[
          { title: "Reconoce", description: "Dos filas que comparten cualquier identificador son una persona. Lo hace sobre el hash, sin ver un solo mail." },
          { title: "Entiende", description: "Cuántas veces interactuaste, por qué canal, desde cuándo y quién nunca te contestó. Separa lo que es una respuesta de lo que es un acuse del sistema." },
          { title: "Aplica tus reglas", description: "Qué es un donante activo, cuándo se considera perdido, desde cuándo cuenta tu operación. Lo declarás vos: un valor nuestro se leería como una política tuya." },
          { title: "Entrega", description: "Lo que tenés, lo que está roto y lo que no se puede afirmar. Mientras quede un tipo de evento sin clasificar, no dice quién te contesta." },
        ]}
      />

      <WhyXimia
        eyebrow="La garantía"
        headline={"No prometemos borrar tus datos.\nNo los recibimos."}
        intro="El archivo se lee en tu navegador. Los identificadores se normalizan y se hashean antes de cualquier cálculo, y nunca salen de tu máquina. No hay nada que borrar después, y lo podés comprobar en tu propia pestaña de red mientras la demo corre."
        claims={[
          {
            icon: <ShieldCheck size={24} />,
            title: "Verificable, no declarado",
            description: "Abrí las herramientas del navegador y mirá qué viaja. Es la única garantía de privacidad que no te pide confiar en nosotros.",
          },
          {
            icon: <Database size={24} />,
            title: "Sal nueva por sesión",
            description: "Un hash sin sal se revierte con una lista de mails. Con sal nueva cada vez, los hashes no se pueden comparar entre sesiones ni acumular.",
          },
          {
            icon: <UserCheck size={24} />,
            title: "Vos confirmás",
            description: "El mapeo de columnas, el orden de la fecha y la clase de cada evento se proponen leyendo tu archivo y los confirmás en pantalla.",
          },
          {
            icon: <AlertTriangle size={24} />,
            title: "El precio, dicho",
            description: "Un hash conserva la igualdad y destruye el parecido: dos escrituras distintas del mismo mail quedan como dos personas. El match difuso necesita el dato en claro y un acuerdo firmado.",
          },
        ]}
        panel={{
          title: "Lo que encontró en una base real",
          subtitle: "Los tres hallazgos de la primera corrida. Ninguno se buscaba: salieron de mirar bien los datos que ya estaban.",
          layers: [
            { layer: "93% en más de un canal", function: "429 de 459 contactos, contados 1.521 veces si se cuenta por canal." },
            { layer: "69% nunca respondió", function: "318 de 459 no contestaron ni hicieron un clic. Es a quién no le estás hablando bien." },
            { layer: "27 fechas imposibles", function: "Una en 1927: el lector automático tomó la fecha de nacimiento donde iba la del consentimiento. Y es el campo por el que el sistema de envíos filtra." },
            { layer: "1.234 acuses contados como respuestas", function: "Eran del transporte, no de una persona. Decían que 384 respondían donde respondían 141." },
          ],
        }}
      />

      <CtaDark
        headline="No compres un modelo. Cargá tus reglas."
        subheadline="Subí tu export y mirá el informe con tus datos, sin que tus datos nos lleguen. Lo que la demo no puede decir con honestidad, te lo dice con esas palabras."
        button="Agendar Demo"
        onClick={openCalendly}
      />
    </Page>
  );
}
