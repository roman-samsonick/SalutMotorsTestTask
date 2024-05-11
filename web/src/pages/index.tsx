'use client';


import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Alert, Container, Pagination } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

const inter = Inter({ subsets: ['latin'] });

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: {
    data: TUserItem[], meta: {
      first: string;
      prev: string | null;
      next: string | null;
      last: string;
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  } | null
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const query = ctx.query;

  try {
    const res = await fetch(`http://localhost:3000/users?page=${query.page || 1}`, { method: 'GET' });

    if (!res.ok) {
      return {
        props: {
          statusCode: res.status,
          users: null,
        },
      };
    }

    return {
      props: {
        statusCode: 200,
        users: await res.json(),
      },
    };
  } catch (e) {
    return {
      props: {
        statusCode: 500,
        users: null,
      },
    };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;


export default function Home({
  statusCode,
  users,
}: TGetServerSideProps) {
  if (statusCode !== 200 || users == null) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const meta = users.meta;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();


  let paginationItems = [];
  for (let number = 1; number <= 10; number++) {
    let i = number;
    if (meta.page > 5) {
      i = (meta.page - 5) + number;
    }
    if (meta.page as number + 5 > meta.totalPages) {
      i = (meta.totalPages - 10) + number;
    }

    paginationItems.push(
      <Pagination.Item key={i}
                       onClick={() => router.push(`?page=${i}`)}
                       active={i == meta.page}>
        {i}
      </Pagination.Item>,
    );
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description"
              content="Тестовое задание" />
        <meta name="viewport"
              content="width=device-width, initial-scale=1" />
        <link rel="icon"
              href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped
                 bordered
                 hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First
              onClick={() => router.push(meta.first)} />

            <Pagination.Prev disabled={!meta.prev}
                             onClick={() => router.push(meta.prev!)} />

            {paginationItems}

            <Pagination.Next disabled={!meta.next}
                             onClick={() => router.push(meta.next!)} />

            <Pagination.Last
              onClick={() => router.push(meta.last)} />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
