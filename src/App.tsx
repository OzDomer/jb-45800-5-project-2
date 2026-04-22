import './App.css'
import store from "./shared/store/store"
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'

function App() {
  

  return (
    <>
     <Provider store={store}>
     <RouterProvider router={router} />
     </Provider>
    </>
  )
}

export default App
