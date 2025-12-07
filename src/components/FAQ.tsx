'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How quickly can I expect to feel the effects?",
    answer: "Most users report a gentle sense of alertness within 30–60 minutes, though experiences may vary."
  },
  {
    question: "Is it safe for daily use?",
    answer: "Yes, Soluna is formulated with ingredients that are generally recognized as safe (GRAS) for daily support. As always, consult your healthcare provider if you have specific medical conditions."
  },
  {
    question: "Can I take this with coffee?",
    answer: "Absolutely. Many of our customers enjoy Soluna alongside their morning coffee to help smooth out the caffeine jitters and extend their focus."
  },
  {
    question: "Is it vegan / gluten-free?",
    answer: "Yes. We use a pectin base (no gelatin), and our formula is completely vegan, gluten-free, and free from artificial dyes."
  },
  {
    question: "How much sugar is in it?",
    answer: "Very little. We sweeten primarily with Allulose and Monk Fruit, so you get a great taste with negligible impact on blood sugar."
  },
  {
    question: "How should I take it?",
    answer: "We recommend taking 2 gummies daily, preferably in the morning or about 30 minutes before you need to focus."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white border-b border-black/10">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="mb-16 text-center">
          <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 text-xs font-mono mb-4 rounded-full">
            FAQ
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Common Questions
          </h2>
        </div>

        <div className="border-t border-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg"
              >
                <span className="text-lg font-medium text-[#1a1a1a]">{faq.question}</span>
                <div className="ml-4 text-gray-400">
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pb-8 text-gray-600 leading-relaxed px-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-gray-400 max-w-xl mx-auto">
          *Statements not evaluated by FDA. Product not intended to diagnose, treat, cure, or prevent disease.
        </div>

      </div>
    </section>
  );
}
