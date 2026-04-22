import './App.css'
import store from "./shared/store/store"
import { Provider } from 'react-redux'
import Layout from './shared/layout/Layout'

function App() {
  

  return (
    <>
     <Provider store={store}>
     <Layout />
     </Provider>
    </>
  )
}

export default App
