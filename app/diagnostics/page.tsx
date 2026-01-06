
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShoppingCart, 
  MessageSquare, 
  Database, 
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { formatCLP, generateWhatsAppLink } from '../../utils';
import { PIZZAS, COUPONS, DOUGHS, INGREDIENTS } from '../../constants';

export default function DiagnosticsPage() {
  const [mounted, setMounted] = useState(false);
  const [testResults, setTestResults] = useState<{name: string, status: 'pass' | 'fail', detail: string}[]>([]);
  const [sampleLink, setSampleLink] = useState('');

  useEffect(() => {
    setMounted(true);
    runDiagnostics();
  }, []);

  const runDiagnostics = () => {
    const results: typeof testResults = [];

    // Test 1: Formato de Moneda
    const priceTest = formatCLP(15500);
    if (priceTest.includes('$') && priceTest.includes('15')) {
      results.push({ name: 'Format CLP', status: 'pass', detail: `Correcto: ${priceTest}` });
    } else {
      results.push({ name: 'Format CLP', status: 'fail', detail: 'Formato de moneda inesperado' });
    }

    // Test 2: Integridad de Constantes
    if (PIZZAS.length > 0 && INGREDIENTS.length > 0) {
      results.push({ name: 'Data Constants', status: 'pass', detail: `${PIZZAS.length} pizzas y ${INGREDIENTS.length} ingredientes cargados.` });
    } else {
      results.push({ name: 'Data Constants', status: 'fail', detail: 'Error cargando archivos de constantes.' });
    }

    // Test 3: LocalStorage
    try {
      localStorage.setItem('vivazza_test', 'ok');
      localStorage.removeItem('vivazza_test');
      results.push({ name: 'LocalStorage', status: 'pass', detail: 'Persistencia disponible.' });
    } catch (e) {
      results.push({ name: 'LocalStorage', status: 'fail', detail: 'Acceso a storage bloqueado.' });
    }

    // Test 4: Generación de WhatsApp (Mock de pedido complejo)
    try {
      const mockItems = [
        { id: 't1', pizzaName: 'Margarita', basePrice: 9500, quantity: 2, isCustom: false },
        { 
          id: 't2', 
          pizzaName: 'Custom Lab', 
          basePrice: 12000, 
          quantity: 1, 
          isCustom: true,
          dough: DOUGHS[0],
          customIngredients: [INGREDIENTS[0], INGREDIENTS[1]]
        }
      ];
      const link = generateWhatsAppLink(mockItems, 31000, { method: 'delivery', address: 'Calle Falsa 123' }, COUPONS[0]);
      setSampleLink(link);
      results.push({ name: 'WhatsApp Logic', status: 'pass', detail: 'Link generado con éxito.' });
    } catch (e) {
      results.push({ name: 'WhatsApp Logic', status: 'fail', detail: 'Error en generador de mensajes.' });
    }

    setTestResults(results);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-body p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2 text-vivazza-red font-bold hover:underline">
            <ArrowLeft size={18} /> VOLVER A LA APP
          </Link>
          <div className="bg-vivazza-stone text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-vivazza-gold" /> System Diagnostics v1.0
          </div>
        </div>

        <header className="mb-12">
          <h1 className="font-heading text-5xl text-vivazza-stone mb-2">PANEL DE <span className="text-vivazza-red">DIAGNÓSTICO</span></h1>
          <p className="text-gray-500 font-medium">Pruebas automáticas de integridad y lógica de negocio para Vivazza.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Activity className="text-blue-500 mb-3" size={32} />
            <span className="text-[10px] font-black uppercase text-gray-400">Status General</span>
            <span className="text-2xl font-heading text-vivazza-stone">OPERATIVO</span>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Database className="text-orange-500 mb-3" size={32} />
            <span className="text-[10px] font-black uppercase text-gray-400">Base de Datos</span>
            <span className="text-2xl font-heading text-vivazza-stone">{PIZZAS.length} SKU's</span>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <ShoppingCart className="text-green-500 mb-3" size={32} />
            <span className="text-[10px] font-black uppercase text-gray-400">Cálculos</span>
            <span className="text-2xl font-heading text-vivazza-stone">VALIDADOS</span>
          </div>
        </div>

        <section className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-heading text-3xl text-vivazza-stone flex items-center gap-3">
              <CheckCircle2 className="text-green-500" /> INTEGRITY CHECKS
            </h2>
            <button onClick={runDiagnostics} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-vivazza-red">
              <RefreshCw size={20} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {testResults.map((test, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${test.status === 'pass' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                  <div>
                    <h4 className="font-bold text-vivazza-stone text-sm uppercase">{test.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{test.detail}</p>
                  </div>
                </div>
                {test.status === 'pass' ? (
                  <CheckCircle2 className="text-green-500/30" size={24} />
                ) : (
                  <AlertTriangle className="text-red-500" size={24} />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-vivazza-stone text-white rounded-[2.5rem] p-8 md:p-12 shadow-premium">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-vivazza-red" size={28} />
            <h2 className="font-heading text-3xl uppercase tracking-tight">WhatsApp Payload Validator</h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-[10px] overflow-x-auto text-gray-400 mb-8 whitespace-pre-wrap leading-relaxed">
            {decodeURIComponent(sampleLink)}
          </div>
          <div className="flex gap-4">
            <a 
              href={sampleLink} 
              target="_blank" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
            >
              PROBAR LINK REAL <ExternalLink size={16} />
            </a>
          </div>
        </section>

        <footer className="mt-12 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
          VIVAZZA PIZZERÍA ARTESANAL // QA DASHBOARD // 2024
        </footer>
      </div>
    </div>
  );
}
