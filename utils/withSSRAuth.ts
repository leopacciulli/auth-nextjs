import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { destroyCookie, parseCookies } from "nookies"
import { AuthTokenError } from "../services/errors/AuthTokenError"

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context)

    if (!cookies['authnextjs.token']) { 
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      }
    }

    try {
      return await fn(context);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(context, 'authnextjs.token')
        destroyCookie(context, 'authnextjs.refreshToken')
    
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}