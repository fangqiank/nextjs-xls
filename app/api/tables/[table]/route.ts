import type {NextRequest} from 'next/server'
import * as xlsx from 'xlsx'
import {promises as fs} from 'fs'

type props = {
	params: {
		table: string
	}
}

export const GET = async (request: NextRequest, {params: {table}}: props) => {
	const searchParams = request.nextUrl.searchParams
	const format = searchParams.get('format')

	try{
		if(!table)
			throw new Error('Table name required')

		const tableName = 'Todos'

		const file = await fs.readFile(process.cwd() + '/data/data.json', 'utf-8')
		const jsonTableData = JSON.parse(file)

		console.log(jsonTableData);

		const workSheet = xlsx.utils.json_to_sheet(jsonTableData)

		if(format === 'csv'){
			const csv = xlsx.utils.sheet_to_csv(workSheet,{
				forceQuotes: true
			})

			return new Response(csv, {
				status: 200,
				headers: {
					'Content-Disposition': `attachment; filename="${tableName}.csv"`,
          'Content-Type': 'text/csv',
				}
			})
		} else if(format === 'txt'){
			const txt = xlsx.utils.sheet_to_txt(workSheet, {
				forceQuotes: true
			})

			return new Response(txt, {
				status: 200,
				headers: {
					'Content-Disposition': `attachment; filename="${tableName}.txt"`,
					'Content-Type': 'text/csv',
				}
			})
		} else if(format === 'xlsx'){
			const workBook = xlsx.utils.book_new()

			xlsx.utils.book_append_sheet(workBook, workSheet, 'sheets')

			const buff = xlsx.write(workBook, {
				type: 'buffer',
				bookType: 'xlsx'
			})

			return new Response(buff, {
				status: 200,
				headers: {
						'Content-Disposition': `attachment; filename="${tableName}.xlsx"`,
						'Content-Type': 'application/vnd.ms-excel',
				}
			})
		} else if(format === 'json'){
			return Response.json(jsonTableData)
		} else{
			const html = xlsx.utils.sheet_to_html(workSheet)

			return new Response(html, {
				status: 200,
				headers: {
						'Content-Type': 'text/html',
				}
			})
		}
	}

	catch(err){
		if (err instanceof Error) {
			console.error(err)
			return new Response(err.message, {
					status: 400,
			})
	}
	}
};
