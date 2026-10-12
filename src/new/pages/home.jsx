// The homepage: explains Ximia with no vertical of its own, and opens the three doors.
import React from "react";
import { BrainCircuit, Calculator, UserCheck, ShieldCheck } from "lucide-react";
import { Page } from "../Shell";
import { openCalendly } from "../lib";
import { Hero, Statement, WhyXimia, CtaDark } from "../bands";

const DOOR_CARDS = [
  {
    href: "/",
    verb: "Vende.",
    negation: "Ximia AI no chatea.",
    body: "Atiende tu inbound, califica capacidad de compra y orquesta el inventario en tiempo real. Vivo hoy en ConstruirFácil.",
    tag: "En producción",
    live: true,
  },
  {
    href: "/new/otorgar/",
    verb: "Resuelve.",
    negation: "Ximia AI no estima.",
    body: "Lee la carpeta de cada solicitante, aplica tus reglas de crédito y entrega el veredicto con el motivo de cada descarte.",
    tag: "Probalo con tus reglas",
  },
  {
    href: "/new/recaudar/",
    verb: "Reconoce.",
    negation: "Ximia AI no adivina.",
    body: "Entiende quiénes de tus contactos son la misma persona y cómo se comportan, sin que tu base salga de tu computadora.",
    tag: "Probalo con tu export",
  },
];

function Doors() {
  return (
    <div className="flex flex-col gap-4">
      {DOOR_CARDS.map((door) => (
        <a
          key={door.href}
          href={door.href}
          className="group bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-3 gap-4">
            <p className="text-xs md:text-sm uppercase tracking-widest text-gray-400">{door.tag}</p>
            <span className="text-gray-300 group-hover:text-[#0092B3] transition-colors text-xl">→</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-3">
            <span className="text-gray-400">{door.negation} </span>
            <span className="text-gray-900">{door.verb}</span>
          </p>
          <p className="text-base text-gray-500 leading-relaxed">{door.body}</p>
        </a>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <Page here="/new/">
      <Hero
        negation="Ximia AI no responde preguntas."
        verb="Resuelve casos."
        size="tight"
        subLead="Una superestructura de agentes de IA que atiende, entiende, aplica tus reglas y entrega la operación resuelta."
        subTail="Tres puertas, un mismo motor. Lo que cambia son tus reglas, no el desarrollo."
        onPrimary={{ label: "Agendar Demo", onClick: openCalendly }}
        aside={<Doors />}
      />

      <Statement
        lead={"El mismo sistema que hoy vende casas puede otorgar un crédito\no entender a los donantes de una fundación."}
        punch={"Lo que cambia son las reglas."}
      />

      <WhyXimia
        headline={"No es un prompt distinto.\nEs una arquitectura diferente."}
        intro="Ximia AI no es un chatbot monolítico. Es un ecosistema de capas coordinadas donde cada componente ejecuta una función crítica, y donde las garantías viven en el código y no en una instrucción."
        claims={[
          {
            icon: <BrainCircuit size={24} />,
            title: "Decide, no improvisa",
            description: "El ruteo y las reglas de negocio corren en código determinístico. El modelo conversa; no decide quién califica.",
          },
          {
            icon: <Calculator size={24} />,
            title: "Calcula de verdad",
            description: "Cada cifra que dice sale de una consulta, no de su memoria. Si no tiene fuente, no la dice.",
          },
          {
            icon: <UserCheck size={24} />,
            title: "Sabe con quién habla",
            description: "Identidad verificada antes de mostrar un solo dato personal. Lo público se ve sin identificarse; lo tuyo, no.",
          },
          {
            icon: <ShieldCheck size={24} />,
            title: "Dice lo que no sabe",
            description: "Sin fuente, deriva a una persona. Es la única respuesta que no te deja un cliente con un dato inventado.",
          },
        ]}
        panel={{
          title: "Un motor, tres aplicaciones",
          subtitle: "Medido, no afirmado: el mismo cuerpo del motor corrió sobre reglas de vivienda y sobre reglas de crédito prendario de auto, sin cambiar una línea de código.",
          layers: [
            { layer: "El catálogo", function: "Qué se compra, se otorga o se recauda. Es un dato, no un desarrollo." },
            { layer: "Las reglas", function: "Las condiciones de tu negocio. De 27 columnas de una regla de crédito, 21 no saben nada de vivienda." },
            { layer: "El conocimiento", function: "Lo que el agente SABE de tu dominio, con su fuente y su vencimiento. No lo busca: lo sabe." },
            { layer: "La conversación", function: "Una sola, de punta a punta, con el contexto entero. No cinco agentes pasándose el caso." },
          ],
        }}
      />

      <CtaDark
        headline="No escales tu equipo. Escalá tu capacidad de resolver."
        subheadline="Elegí la puerta que se parece a tu negocio y probala con tus propios datos. Las dos demos corren con tus reglas y tus archivos, no con un ejemplo nuestro."
        button="Agendar Demo"
        onClick={openCalendly}
      />
    </Page>
  );
}
