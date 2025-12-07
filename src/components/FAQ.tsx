'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How quickly will I notice anything?",
    answer: "Many users report noticing the experience within 30–60 minutes, but individual responses vary.*"
  },
  {
    question: "Is it safe?",
    answer: "Focus Gummies are made with ingredients that are generally recognized as safe (GRAS). Consult your healthcare provider if you are pregnant, on medication, or have a medical condition.*"
  },
  {
    question: "Can I take this with coffee?",
    answer: "Yes — many customers enjoy Focus alongside their regular routine."
  },
  {
    question: "Is it vegan?",
    answer: "Soluna uses a pectin base instead of gelatin, which is typically suitable for people avoiding animal gelatin. Check the full ingredient list on your specific product bottle to confirm it fits your dietary needs.*"
  },
  {
    question: "How much sugar is in it?",
    answer: "The gummies are sweetened primarily with allulose and monk fruit, with minimal sugar contribution from other ingredients. See the Supplement Facts panel on the label for exact carbohydrate and sugar values.*"
  },
  {
    question: "Can I take it every day?",
    answer: "Yes—Soluna is designed as a daily supplement. For best results, take 2 gummies every day at roughly the same time, and pair it with good sleep, hydration, and nutrition.*"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-transparent relative overflow-hidden">
      
      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <h2 className="text-4xl font-serif font-bold text-center mb-16 text-[#1a1a1a]">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#1a1a1a]/10">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
              >
                <span className="text-xl font-medium text-[#1a1a1a] group-hover:text-orange-600 transition-colors">{faq.question}</span>
                <span className={`text-2xl text-[#1a1a1a]/40 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[#1a1a1a]/70 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
          *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </div>
      </div>
    </section>
  );
}