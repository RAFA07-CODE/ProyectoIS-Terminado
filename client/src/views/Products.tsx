import { ActionFunctionArgs, Link, useLoaderData } from 'react-router-dom'
import { getProducts, updateProductAvailability } from '../services/ProductService'
import ProductDetails from '../components/ProductDetails'
import { Product } from '../types'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function loader() {
  const products = await getProducts()
  return products
}

export async function action({ request }: ActionFunctionArgs) {
  const data = Object.fromEntries(await request.formData())
  await updateProductAvailability(+data.id)
  return {}
}

export default function Products() {
  const data = useLoaderData() as Product[]

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(p => ({
      Producto: p.name,
      Precio: p.price,
      Disponible: p.availability ? 'Sí' : 'No'
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos")
    XLSX.writeFile(workbook, "productos.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("Lista de Productos", 14, 10)
    const tableData = data.map(p => [p.name, p.price, p.availability ? 'Sí' : 'No'])
    autoTable(doc, {
      head: [['Producto', 'Precio', 'Disponible']],
      body: tableData,
      startY: 20,
    })
    doc.save("productos.pdf")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-700">Gestión de Productos</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow-md hover:bg-emerald-600 transition duration-200"
          >
            📊 Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow-md hover:bg-rose-600 transition duration-200"
          >
            📄 PDF
          </button>
          <Link
            to="productos/nuevo"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-200"
          >
            ➕ Nuevo
          </Link>
        </div>
      </div>

      <div className="overflow-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-indigo-100 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Disponibilidad</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map(product => (
              <ProductDetails
                key={product.id}
                product={product}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
