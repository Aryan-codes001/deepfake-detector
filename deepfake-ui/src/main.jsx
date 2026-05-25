import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import Code from './code.jsx'

import {
BrowserRouter,
Routes,
Route
} from "react-router-dom"

createRoot(
document.getElementById('root')
).render(

<StrictMode>

<BrowserRouter>

<Routes>

<Route
path="/"
element={<App/>}
/>

<Route
path="/code"
element={<Code/>}
/>

</Routes>

</BrowserRouter>

</StrictMode>

)