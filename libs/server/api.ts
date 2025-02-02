import nc from 'next-connect'
import { onError, useError } from './middlewares/error'
import { NextApiRequest, NextApiResponse } from 'next'
import { API } from './middlewares/error'
import { StoreProvider } from '@notea/store'
import { useSession } from './middlewares/session'
import { Session } from 'next-iron-session'
import { TreeStore } from './tree'

export type ApiRequest = NextApiRequest & {
  store: StoreProvider
  treeStore: TreeStore
  session: Session
}

export type ApiResponse = NextApiResponse & {
  APIError: typeof API
}

export type ApiNext = () => void

export const api = () =>
  nc<ApiRequest, ApiResponse>({
    onError,
  })
    .use(useError)
    .use(useSession)
