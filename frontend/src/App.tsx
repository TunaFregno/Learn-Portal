import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider,  } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import CategoriesPage from './pages/CategoriesPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/dashboard' element={<MainPage/>}/>
      <Route path='/categories' element={<CategoriesPage/>}/>
    </Route>
    
  )
);

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
