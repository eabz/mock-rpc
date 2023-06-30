export const apiSuccess = (data?: any, contentType?: string): Response => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': contentType ? contentType : 'application/json',
  }

  const body = JSON.stringify({ data, success: true })

  const res = new Response(body, { headers })

  return res
}

export const apiError = (error: string, statusError: number): Response => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }

  const body = JSON.stringify({ error, success: false })

  const res = new Response(body, { headers, status: statusError })

  return res
}

export const apiSuccessJSON = (data: any, id: number): Response => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }

  const body = JSON.stringify({ id, jsonrpc: '2.0', result: data })

  const res = new Response(body, { headers })

  return res
}

export const apiErrorJSON = (error: string, id: number): Response => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
  }

  const body = JSON.stringify({ error, id, jsonrpc: '2.0' })
  const res = new Response(body, { headers })

  return res
}
