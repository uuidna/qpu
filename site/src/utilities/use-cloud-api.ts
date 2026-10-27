import type { Deployment, Plan, Project, Team } from '@root/payload-cloud-types'

import { useAuth } from '@root/providers/Auth/index'
import { qs } from '@utilities/qs'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

export type UseCloudAPI<R, A = null> = (args?: A) => {
  error: string
  isLoading: boolean | null
  reload: () => void
  reqStatus?: number
  result: R
}

export const useCloudAPI = <R>(args: {
  body?: string
  delay?: number
  initialState?: R
  interval?: number
  method?: 'GET' | 'POST'
  url?: string
}): ReturnType<UseCloudAPI<R>> => {
  const { body, delay = 250, initialState, interval, method = 'GET', url } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<R>(initialState as unknown as R)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [requestTicker, dispatchRequestTicker] = useReducer((state: number) => state + 1, 0)
  const [reqStatus, setReqStatus] = useState<number | undefined>()

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (url) {
      if (isRequesting.current) {
        return
      }
      isRequesting.current = true

      const makeRequest = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}${url}`, {
            body,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method,
          })

          setReqStatus(req.status)

          const json: R = await req.json()

          if (req.ok) {
            timer = setTimeout(() => {
              setResult(json)
              setError('')
              setIsLoading(false)
            }, delay)
          } else {
            // @ts-expect-error
            setError(json?.message || 'Something went wrong')
          }
        } catch (err: unknown) {
          const message = (err as Error)?.message || 'Something went wrong'
          setError(message)
          setIsLoading(false)
        }

        isRequesting.current = false
      }

      void makeRequest()
    }

    return () => {
      clearTimeout(timer)
    }
  }, [url, requestTicker, delay, method, body])

  const reload = useCallback(() => {
    isRequesting.current = false
    dispatchRequestTicker()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (url && interval) {
      timer = setTimeout(() => {
        reload()
      }, interval)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [url, requestTicker, reload, interval])

  const memoizedState = useMemo(
    () => ({ error, isLoading, reload, reqStatus, result }),
    [result, isLoading, error, reload, reqStatus],
  )

  return memoizedState
}

export const useGetPlans: UseCloudAPI<Plan[]> = () => {
  const response = useCloudAPI<{
    docs: Plan[]
  }>({
    url: '/api/plans?where[slug][not_equals]=enterprise&sort=order',
  })

  return useMemo(() => {
    return {
      ...response,
      result: response.result?.docs,
    }
  }, [response])
}

type ProjectWithTeam = {
  team: Team
} & Omit<Project, 'team'>

// you can get projects with either the `id` or `teamSlug` and `projectSlug`
export const useGetProjectDeployments: UseCloudAPI<
  Deployment[],
  {
    environmentSlug?: string
    interval?: number
    page?: number
    projectID?: string
  }
> = (args) => {
  const { environmentSlug, interval, page = 0, projectID } = args || {}

  const query = qs.stringify({
    limit: 10,
    page,
    sort: '-createdAt',
    where: {
      and: [
        {
          project: {
            equals: projectID,
          },
        },
        {
          environmentSlug: {
            equals: environmentSlug,
          },
        },
      ],
    },
  })

  const url = `/api/deployments${query ? `?${query}` : ''}`

  const response = useCloudAPI<{
    docs: Deployment[]
  }>({
    interval,
    url,
  })

  return useMemo(() => {
    return {
      ...response,
      result: response.result?.docs,
    }
  }, [response])
}
