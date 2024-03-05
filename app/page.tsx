import { TableExportRow } from "@/components/TableExportRow";
import Image from "next/image";

export default function Home() {
  return (
    <section className="container flex flex-col p-12 min-h-screen text-base">
      <TableExportRow table="Todos" />
      <TableExportRow table="Users" />
      <TableExportRow table="Books" />
    </section>
  )
}
