import * as React from 'react'
import { useState } from 'react'
import Styles from './index.module.scss'
import IndexPage from '../pages/IndexPage'
import MeshPage from '../pages/MeshPage'

function Layout() {
  const [currentPage, setCurrentPage] = useState<'index' | 'mesh'>('index')

  return (
    <div className={Styles.layout}>
      <div className={Styles.navigation}>
        <button 
          className={currentPage === 'index' ? Styles.active : ''} 
          onClick={() => setCurrentPage('index')}
        >
          粒子系统
        </button>
        <button 
          className={currentPage === 'mesh' ? Styles.active : ''} 
          onClick={() => setCurrentPage('mesh')}
        >
          网格模型学习
        </button>
      </div>
      
      <div className={Styles.pageContainer}>
        {currentPage === 'index' && <IndexPage />}
        {currentPage === 'mesh' && <MeshPage />}
      </div>
    </div>
  )
}

export default Layout
