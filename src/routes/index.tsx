import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  Route,
} from 'react-router-dom';
import Root from '../pages/root';
import ErrorPage from '../pages/ErrorPage';
import Contact, { contactAction, contactLoader } from '../pages/Contact';
import EditContact, {
  editContactAction,
  editContactLoader,
} from '../pages/Edit';
import Index from '../pages/Index';
import { getContacts, createContact, deleteContact } from '../service/contacts';

const destroyContactAction = async ({ params }) => {
  await deleteContact(params.contactId);
  return redirect('/');
};
const rootLoader = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return { contacts, q };
};
const rootAction = async () => {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
  // return { contact };
};

// Object嵌套路由写法
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: 'contacts/:contactId',
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: 'contacts/:contactId/edit',
            element: <EditContact />,
            loader: editContactLoader,
            action: editContactAction,
          },
          {
            path: 'contacts/:contactId/destroy',
            errorElement: <div>Oops! There was an error.</div>,
            action: destroyContactAction,
          },
        ],
      },
      // 默认为选中时展示的首页
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <EditContact />,
        loader: editContactLoader,
        action: editContactAction,
      },
      {
        path: 'contacts/:contactId/destroy',
        errorElement: <div>Oops! There was an error.</div>,
        action: destroyContactAction,
      },
    ],
  },
]);
// JSX嵌套路由写法
const router2 = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={editContactAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyContactAction}
        />
      </Route>
    </Route>
  )
);

export default router2;
