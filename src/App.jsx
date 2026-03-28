import React from "react";
import { useEffect } from "react";

export default function App() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js?v=2";
    script1.defer = true;

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2026/02/09/15/20260209155612-JRZYC1GZ.js";
    script2.defer = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);
  }, []);

  return (
    <div className="font-sans text-gray-900">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Ximia</h1>
          <nav className="space-x-6 hidden md:block">
            <button onClick={() => scrollTo("how")} className="hover:text-gray-500">Cómo funciona</button>
            <button onClick={() => scrollTo("demo")} className="hover:text-gray-500">Demo</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-gray-500">Precio</button>
          </nav>
          <button
            onClick={() => scrollTo("demo")}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Ver demo
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 text-center bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tu mejor vendedor, trabajando 24/7
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Ximia convierte visitantes en leads calificados y los guía hasta la compra,
            automáticamente.
          </p>
          <button
            onClick={() => scrollTo("demo")}
            className="bg-black text-white px-6 py-4 rounded-xl text-lg"
          >
            Ver demo en vivo
          </button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20" id="how">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-2">Califica leads</h3>
            <p className="text-gray-600">
              Filtra automáticamente clientes reales de curiosos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-2">Vende por vos</h3>
            <p className="text-gray-600">
              Explica, recomienda y guía como un asesor experto.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-2">Disponible 24/7</h3>
            <p className="text-gray-600">
              Nunca perdés oportunidades fuera de horario.
            </p>
          </div>

        </div>
      </section>

      {/* DEMO */}
      <section className="py-20 bg-gray-100 text-center" id="demo">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Probalo en vivo</h2>
          <p className="text-gray-600 mb-10">
            Esta es una simulación de cómo Ximia conversa con tus clientes.
          </p>

          <div className="bg-white rounded-2xl shadow p-6 text-left max-w-xl mx-auto">
            <p className="mb-2"><strong>Usuario:</strong> Estoy buscando una casa</p>
            <p className="mb-2"><strong>Ximia:</strong> Perfecto. ¿Es para vivir o inversión?</p>
            <p className="mb-2"><strong>Usuario:</strong> Para vivir con mi familia</p>
            <p><strong>Ximia:</strong> Genial, entonces te voy a recomendar opciones según tu perfil.</p>
          </div>

        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 text-center" id="pricing">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Simple pricing</h2>
          <p className="text-gray-600 mb-8">
            Pagás solo por resultados. Sin costos ocultos.
          </p>
          <div className="bg-white shadow rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-2">$</h3>
            <p className="text-gray-500 mb-6">Custom para cada proyecto</p>
            <button className="bg-black text-white px-6 py-3 rounded-xl">
              Agendar demo
            </button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Empezá a vender más hoy
        </h2>
        <button className="bg-white text-black px-6 py-3 rounded-xl">
          Solicitar demo
        </button>
      </section>

    </div>
  );
}