
import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";

export default function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [surtidos, setSurtidos] = useState({});
  const [mostrarSoloFaltantes, setMostrarSoloFaltantes] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("surtidos");
    if (stored) setSurtidos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("surtidos", JSON.stringify(surtidos));
  }, [surtidos]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = utils.sheet_to_json(worksheet, { defval: "" });

    const renamedData = json.map((row) => ({
      ...row,
      Codigo: row["Codigom"] || row["codigo"] || row["Codigo"]
    }));

    setData(renamedData);
  };

  const handleToggle = (codigo) => {
    setSurtidos((prev) => ({ ...prev, [codigo]: !prev[codigo] }));
  };

  const clearSurtidos = () => {
    setSurtidos({});
    localStorage.removeItem("surtidos");
  };

  const filteredData = data.filter((row) => {
    const codigo = row["Codigo"]?.toString().toLowerCase() || "";
    const descripcion = row["descripcion"]?.toString().toLowerCase() || "";
    const coincideBusqueda =
      codigo.includes(search.toLowerCase()) ||
      descripcion.includes(search.toLowerCase());

    const noSurtido = !surtidos[row["Codigo"]];
    return coincideBusqueda && (!mostrarSoloFaltantes || noSurtido);
  });

  const total = filteredData.length;
  const surtidosCount = filteredData.filter(row => surtidos[row["Codigo"]]).length;
  const faltantes = total - surtidosCount;

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">App de Pedido</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input type="file" accept=".xlsx,.xlsm" onChange={handleFileUpload} />
        <input
          placeholder="Buscar por código o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={clearSurtidos} className="bg-red-500 text-white px-3 py-1 rounded">
          Borrar surtidos
        </button>
        <button
          onClick={() => setMostrarSoloFaltantes(!mostrarSoloFaltantes)}
          className="border px-3 py-1 rounded"
        >
          {mostrarSoloFaltantes ? "Ver todos" : "Ver solo faltantes"}
        </button>
      </div>

      {data.length > 0 && (
        <div className="mb-2 text-sm text-gray-700">
          Total: {total} &nbsp; | &nbsp; Surtidos: {surtidosCount} &nbsp; | &nbsp; Faltan: {faltantes}
        </div>
      )}

      <div className="overflow-auto max-h-[70vh] border rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Surtido</th>
              <th className="p-2">Código</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Almacén</th>
              <th className="p-2">Exist.</th>
              <th className="p-2">Pz a pedir</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, i) => (
              <tr
                key={i}
                className={
                  surtidos[row["Codigo"]]
                    ? "bg-green-100"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                }
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={surtidos[row["Codigo"]] || false}
                    onChange={() => handleToggle(row["Codigo"])}
                  />
                </td>
                <td className="p-2">{row["Codigo"]}</td>
                <td className="p-2">{row["descripcion"]}</td>
                <td className="p-2">{row["almacen"]}</td>
                <td className="p-2">{row["exist"]}</td>
                <td className="p-2">{row["pz a pedir"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
