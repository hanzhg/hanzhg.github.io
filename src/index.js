import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './styles.css';
import { HashRouter, Routes, Route} from 'react-router-dom';
import Canvas from './canvas';
import NotFound from './404';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="" element={<App />}/>
                <Route path="/canvas" element = {<Canvas />}/>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
