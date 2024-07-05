'use client'

import {
  UrqlProvider,
  ssrExchange,
  fetchExchange,
  createClient,
  gql,
} from '@urql/next'
import { PropsWithChildren, cache, useMemo } from 'react'
import { cacheExchange } from '@urql/exchange-graphcache'
import { url } from '@/utils/url'
import { getToken } from '@/utils/token'

const GQLProvider = ({ children }: PropsWithChildren) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({ 
      isClient: typeof window !== 'undefined'
    })

    const client = createClient({
      url, // our url
      exchanges: [
       cacheExchange({}), ssr, fetchExchange // plugins, puoi usare pure axios
      ],
      fetchOptions: () => { // fetch options
        const token = getToken()
        return token ? {
          headers: {
            authorization: `Bearer ${token}`,
          },
        } : {}
      },
    })
    return [client, ssr]
  }, [])

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  )
}

export default GQLProvider