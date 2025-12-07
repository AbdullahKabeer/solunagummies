'use client';

const ingredients = [
  {
    id: "01",
    name: "Cognizin® Citicoline",
    dosage: "125mg",
    source: "Kyowa Hakko Bio",
    function: "Supports Mental Energy",
    status: "Active"
  },
  {
    id: "02",
    name: "L-Theanine",
    dosage: "100mg",
    source: "Green Tea Extract",
    function: "Promotes Calm Focus",
    status: "Active"
  },
  {
    id: "03",
    name: "Natural Caffeine",
    dosage: "50mg",
    source: "Coffea Arabica",
    function: "Gentle Alertness",
    status: "Active"
  },
  {
    id: "04",
    name: "Saffron Extract",
    dosage: "20mg",
    source: "Crocus Sativus",
    function: "Mood Support",
    status: "Active"
  },
  {
    id: "05",
    name: "Vitamin B12",
    dosage: "300mcg",
    source: "Methylcobalamin",
    function: "Cellular Health",
    status: "Active"
  }
];

export default function Ingredients() {
  return (
    <section id="ingredients" className="py-24 border-b border-black/10 bg-[#FDFCF8]">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1a1a1a]">
            Inside the Gummy
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Full transparency. No proprietary blends. Just clinically studied ingredients at meaningful dosages.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 font-mono text-xs text-gray-400 uppercase tracking-widest">No.</th>
                <th className="py-4 px-4 font-mono text-xs text-gray-400 uppercase tracking-widest">Ingredient</th>
                <th className="py-4 px-4 font-mono text-xs text-gray-400 uppercase tracking-widest">Dosage</th>
                <th className="py-4 px-4 font-mono text-xs text-gray-400 uppercase tracking-widest hidden md:table-cell">Source</th>
                <th className="py-4 px-4 font-mono text-xs text-gray-400 uppercase tracking-widest hidden md:table-cell">Benefit</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing) => (
                <tr 
                  key={ing.id} 
                  className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors group"
                >
                  <td className="py-6 px-4 font-mono text-xs text-gray-400">{ing.id}</td>
                  <td className="py-6 px-4 font-bold text-lg text-[#1a1a1a]">{ing.name}</td>
                  <td className="py-6 px-4 font-mono text-sm text-gray-600">{ing.dosage}</td>
                  <td className="py-6 px-4 text-sm text-gray-600 hidden md:table-cell">{ing.source}</td>
                  <td className="py-6 px-4 text-sm text-gray-600 hidden md:table-cell">{ing.function}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-between items-center text-xs text-gray-400 font-mono">
          <span>Updated: Dec 2024</span>
          <span>Lab Verified</span>
        </div>
      </div>
    </section>
  );
}
